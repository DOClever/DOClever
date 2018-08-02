var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn

// Use `spawn` to make a better `exec` without stdio buffering.
function exec (command, options, callback) {
  // Copied from npm's lib/utils/lifecycle.js
  var sh = 'sh'
  var shFlag = '-c'

  // Doesn't need to support all options, we only ever pass these two.
  var shOpts = {
    env: options.env,
    stdio: options.stdio || 'inherit'
  }

  // Copied from npm's lib/utils/lifecycle.js
  if (process.platform === 'win32') {
    sh = process.env.comspec || 'cmd'
    shFlag = '/d /s /c'
    shOpts.windowsVerbatimArguments = true
    // Even though `command` may properly quote arguments that contain spaces,
    // cmd.exe might strip them. Wrap the entire command in quotes, and the /s
    // flag will remove them and leave the rest.
    if (options.quote) {
      command = '"' + command + '"'
    }
  }

  var proc = spawn(sh, [shFlag, command], shOpts)
  var done = false

  function procKill () {
    proc.kill()
  }

  function procDone (err) {
    if (!done) {
      done = true
      process.removeListener('SIGTERM', procKill)
      callback(err)
    }
  }

  process.once('SIGTERM', procKill)
  proc.on('error', procDone)
  proc.on('close', function (code, signal) {
    var err
    if (code) {
      // Behave like `exec` and construct an Error object.
      var cmdStr = [sh, shFlag, command].join(' ')
      err = new Error('Command failed: ' + cmdStr + '\n')
      err.killed = signal != null
      err.code = code
      err.signal = signal
      err.cmd = cmdStr
    }
    procDone(err)
  })

  return proc
}

// If we call `process.exit` immediately after logging to the console, then
// any process that is reading our output through a pipe would potentially get
// truncated output, because the pipe would be closed before it could be read.
// See: https://github.com/nodejs/node-v0.x-archive/issues/3737
function safeExit (code) {
  process.on('exit', function () {
    process.exit(code)
  })
}

function postinstallBuild () {
  var CWD = process.cwd()
  var POSTINSTALL_BUILD_CWD = process.env.POSTINSTALL_BUILD_CWD || ''

  // If we didn't have this check, then we'd be stuck in an infinite
  // `postinstall` loop, since we run `npm install --only=dev` below,
  // triggering another `postinstall`. We can't use `--ignore-scripts` because
  // that ignores scripts in all the modules that get installed, too, which
  // would break stuff. So instead, we set an environment variable,
  // `POSTINSTALL_BUILD_CWD`, that keeps track of what we're installing. It's
  // more than just a yes/no flag because the dev dependencies we're installing
  // might use `postinstall-build` too, and we don't want the flag to prevent
  // them from running.
  if (POSTINSTALL_BUILD_CWD === CWD) {
    return
  }

  var buildArtifact
  var buildCommand
  var flags = {
    quote: false,
    verbosity: 1
  }
  for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i]
    if (arg === '--silent') {
      flags.verbosity = 0
    } else if (arg === '--verbose') {
      flags.verbosity = 2
    } else if (arg === '--only-as-dependency') {
      flags.onlyAsDependency = true
    } else if (arg === '--script') {
      // Consume the next argument.
      flags.script = process.argv[++i]
    } else if (arg.indexOf('--script=') === 0) {
      flags.script = arg.slice(9)
    } else if (buildArtifact == null) {
      buildArtifact = arg
    } else if (buildCommand == null) {
      buildCommand = arg
    }
  }

  // Some packages (e.g. `ember-cli`) install their own version of npm, which
  // can shadow the expected version and break the package trying to use
  // `postinstall-build`.
  var npm = 'npm'
  var execPath = process.env.npm_execpath
  var userAgent = process.env.npm_config_user_agent || ''
  var npmVersion = (userAgent.match(/^npm\/([^\s]+)/) || [])[1]
  // If the user agent doesn't start with `npm/`, just fall back to running
  // `npm` since alternative agents (e.g. Yarn) may not support the same
  // commands (like `prune`).
  if (execPath && npmVersion) {
    npm = '"' + process.argv[0] + '" "' + execPath + '"'
  }

  if (flags.script != null) {
    // Hopefully people aren't putting special characters that need escaping
    // in their script names. If they are, they can take care of escaping it
    // themselves when they supply `--script`.
    flags.quote = true
    buildCommand = npm + ' run ' + flags.script
  } else if (buildCommand == null) {
    // If no command or script was given, run the 'build' script.
    flags.quote = true
    buildCommand = npm + ' run build'
  }

  var _write = function (verbosity, message) {
    if (flags.verbosity >= verbosity) {
      process.stderr.write(message + '\n')
    }
  }

  var log = {
    info: _write.bind(this, 2),
    warn: _write.bind(this, 1),
    error: _write.bind(this, 0)
  }

  var handleError = function (err) {
    log.error('postinstall-build:\n  ' + err + '\n')
    safeExit(1)
  }

  if (buildArtifact == null) {
    return handleError('A build artifact must be supplied.')
  } else if (/^(npm|yarn) /.test(buildArtifact)) {
    log.warn(
      "postinstall-build:\n  '" + buildArtifact + "' is being passed as the " +
      'build artifact, not the build command.\n  If your build artifact is ' +
      "a file or folder named '" + buildArtifact + "', you may ignore\n  " +
      'this warning. Otherwise, you probably meant to pass this as the build ' +
      'command\n  instead, and must supply a build artifact.\n'
    )
  }

  // After building, we almost always want to prune back to the production
  // dependencies, so that the transient development dependencies aren't
  // left behind. The only reason we wouldn't want to prune is if we're the
  // top-level package being `npm install`ed with no arguments for
  // development or testing purposes. If we're the `postinstall` script of a
  // dependency, we should always prune. Unfortunately, npm doesn't set
  // any helpful environment variables to indicate whether we're being
  // installed as a dependency or not. The best we can do is check whether
  // the parent directory is `node_modules` but the package can be nested
  // in multiple parent directories so we split apart the name of the module.
  var parentDirs = CWD.split(path.sep)
  var isDependency = parentDirs.indexOf('node_modules') !== -1

  if (flags.onlyAsDependency && !isDependency) {
    log.info(
      'postinstall-build:\n  Not installed as a dependency, skipping build.\n'
    )
    return
  }

  // If we're the top-level package being `npm install`ed with no arguments,
  // we still might want to prune if certain flags indicate that only production
  // dependencies were requested.
  var isProduction = (process.env.npm_config_production === 'true' &&
                      process.env.npm_config_only !== 'development' &&
                      process.env.npm_config_only !== 'dev')
  var isOnlyProduction = (process.env.npm_config_only === 'production' ||
                          process.env.npm_config_only === 'prod')
  var shouldPrune = isDependency || isProduction || isOnlyProduction

  var getInstallArgs = function () {
    var packageFile = path.join(CWD, 'package.json')
    var packageInfo = require(packageFile)
    var devDependencies = packageInfo.devDependencies || {}
    var buildDependencies = packageInfo.buildDependencies
    var installArgs = ' --only=dev'

    if (buildDependencies && Array.isArray(buildDependencies)) {
      installArgs = buildDependencies.map(function (name) {
        var spec = devDependencies[name]
        // If a name specified in `buildDependencies` doesn't actually exist in
        // `devDependencies`, it may be a global, peer, or production dependency.
        // Assume it is already available. If a user puts something in
        // `buildDependencies` and expects it to be installed by
        // `postinstall-build`, then it must also be in `devDependencies`.
        if (typeof spec === 'undefined') {
          log.warn(
            "postinstall-build:\n  The dependency '" + name + "' appears in " +
            'buildDependencies but not devDependencies.\n  Instead of ' +
            'installing it, postinstall-build will assume it is already ' +
            'available.\n'
          )
          return ''
        } else if (spec) {
          // This previously used `npm-package-arg` to determine which specs are
          // appropriate to use with the @ syntax and which aren't, but the latest
          // version no longer works on Node <4, and older versions don't have the
          // properties we want. So instead of trying to parse `spec`, just assume
          // npm is okay with always using @ syntax.
          return ' "' + name + '@' + spec + '"'
        } else {
          // We shouldn't really expect to find a null or empty spec, but it's
          // technically possible, and npm will interpret it as `latest`.
          return ' "' + name + '"'
        }
      }).join('')
    }

    return installArgs
  }

  var warnUserAgent = function () {
    if (npmVersion && !/^(3\.|4\.0\.)/.test(npmVersion)) {
      log.warn(
        'postinstall-build:\n  This version of npm (' + npmVersion + ') may ' +
        'not be compatible with postinstall-build! There\n  are outstanding ' +
        'bugs in certain versions of npm that prevent it from working with\n  ' +
        'postinstall-build. See https://github.com/exogen/postinstall-build#bugs-in-npm\n  ' +
        'for more information.\n'
      )
    }
  }

  var checkBuildArtifact = function (callback) {
    fs.stat(buildArtifact, function (err, stats) {
      if (err || !(stats.isFile() || stats.isDirectory())) {
        log.info(
          'postinstall-build:\n  Build artifact not found, proceeding to ' +
          'build.\n'
        )
        callback(null, true)
      } else {
        log.info(
          'postinstall-build:\n  Build artifact found, skipping build.\n'
        )
        callback(null, false)
      }
    })
  }

  var checkUserAgent = function (callback) {
    // If we know an incompatible version of npm triggered `postinstall-build`,
    // print a warning. Note that if the original user agent is NOT npm, then we
    // don't know what version `postinstall-build` will actually run, since the
    // `$npm_config_user_agent` string didn't tell us, so run `npm --version` to
    // find out.
    if (npmVersion) {
      warnUserAgent()
      return callback(null, npmVersion)
    }
    var output = ''
    var command = npm + ' --version'
    log.info('postinstall-build:\n  ' + command + '\n')
    var proc = exec(command, { stdio: 'pipe' }, function (err) {
      npmVersion = (output.match(/^(\d[^\s]*)/) || [])[1]
      warnUserAgent()
      callback(err, npmVersion)
    })
    proc.stdout.setEncoding('utf8')
    proc.stdout.on('data', function (chunk) {
      output += chunk
    })
  }

  var installBuildDependencies = function (execOpts, callback) {
    // We only need to install dependencies if `shouldPrune` is true. Why?
    // Because this flag detects whether `devDependencies` were already
    // installed in order to determine whether they need to be pruned at the
    // end or not. And if we already have `devDependencies` then installing
    // here isn't going to get us anything.
    if (shouldPrune) {
      // If `installArgs` is empty, the build doesn't depend on installing any
      // extra dependencies.
      var installArgs = getInstallArgs()
      if (installArgs) {
        var command = npm + ' install' + installArgs
        log.info('postinstall-build:\n  ' + command + '\n')
        return exec(command, execOpts, callback)
      }
      log.info(
        'postinstall-build:\n  No install arguments, skipping install.\n'
      )
    }
    log.info(
      'postinstall-build:\n  Already have devDependencies, skipping install.\n'
    )
    callback(null)
  }

  var runBuildCommand = function (execOpts, callback) {
    // Only quote the build command if necessary, otherwise run it exactly
    // as npm would.
    execOpts.quote = flags.quote
    log.info('postinstall-build:\n  ' + buildCommand + '\n')
    exec(buildCommand, execOpts, callback)
  }

  var cleanUp = function (execOpts, callback) {
    if (shouldPrune) {
      execOpts.quote = true
      var command = npm + ' prune --production'
      log.info('postinstall-build:\n  ' + command + '\n')
      return exec(command, execOpts, callback)
    }
    log.info('postinstall-build:\n  Skipping prune.\n')
    callback(null)
  }

  checkBuildArtifact(function (err, shouldBuild) {
    if (err) {
      return handleError(err)
    }
    if (shouldBuild) {
      checkUserAgent(function (err) {
        // If an error occurred, the only consequence is that we don't know
        // which version of npm is going to be run, and can't issue a warning.
        // If there's an actual problem running npm we'll find out soon enough.
        if (err) {
          log.warn('postinstall-build:\n  ' + err + '\n')
        }

        // If `npm install` ends up being run by `installBuildDependencies`, this
        // script will be run again. Set an environment variable to tell it to
        // skip the check. Really we just want the spawned child's `env` to be
        // modified, but it's easier just modify and pass along our entire
        // `process.env`.
        process.env.POSTINSTALL_BUILD_CWD = CWD

        var execOpts = {
          env: process.env,
          quote: true
        }
        if (flags.verbosity === 0) {
          execOpts.stdio = 'ignore'
        }

        installBuildDependencies(execOpts, function (err) {
          if (err) {
            return handleError(err)
          }
          // Don't need this flag anymore as `postinstall` was already run.
          // Change it back so the environment is minimally changed for the
          // remaining commands.
          process.env.POSTINSTALL_BUILD_CWD = POSTINSTALL_BUILD_CWD

          runBuildCommand(execOpts, function (err) {
            if (err) {
              return handleError(err)
            }
            cleanUp(execOpts, function (err) {
              if (err) {
                return handleError(err)
              }
            })
          })
        })
      })
    }
  })
}

module.exports = postinstallBuild
