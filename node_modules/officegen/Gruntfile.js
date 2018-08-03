var path = require ( 'path' );

/**
 * List of grunt tasks.
 * @namespace gruntfile
 */
module.exports = function ( grunt ) {
	// We are checking how much time took each grunt task:
	require ( 'time-grunt' ) ( grunt );

	function lastModified ( minutes ) {
		return function ( filepath ) {
			var filemod = ( require ( 'fs' ).statSync ( filepath ) ).mtime;
			var timeago = ( curDate ).setMinutes ( ( curDate ).getMinutes () - minutes );
			return ( filemod > timeago );
		};
	}

	grunt.initConfig ({
		pkg: grunt.file.readJSON ( 'package.json' ),

		jshint: {
			files: {
				// List of all the source files to test:
				src: [
					'gruntfile.js',
					'index.js',
					'lib/**/*.js'
				],

				// Run only on files been modified on the last day:
				// filter: lastModified ( 24 * 60 )
			},

			// Configure JSHint (documented at http://www.jshint.com/docs/):
			options: {
				evil: false,
				multistr: true, // We need to take care about it.
				globals: {
					console: true,
					module: true
				}
			}
		},

		jsdoc : {
			dist : {
				src: [
					'gruntfile.js',
					'index.js',
					'lib/**/*.js'
				],
				options: {
					destination: 'doc',
					package: 'package.json',
					readme: 'README.md',
					template: './node_modules/jaguarjs-jsdoc'
				}
			}
		}
	});

	//
	// The default task:
	//

	/**
	 * The default grunt task.
	 * @name default
	 * @memberof gruntfile
	 * @kind function
	 */
	grunt.registerTask ( 'default', [
		'jshint'
	]);

	//
	// More Grunt tasks:
	//

	//
	// Load all the modules that we need:
	//

	grunt.loadNpmTasks ( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks ( 'grunt-jsdoc' );
};
