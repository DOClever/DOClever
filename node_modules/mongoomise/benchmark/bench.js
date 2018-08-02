var async = require('async')
var tasks = {}
var $ = require('lodash')

/*
* add a test suite
* */
exports.add = function(name, testFn, opts){
	var fn =  function(callback){
		var arr = new Array(opts.times || 10000)
		if(opts.setup) opts.setup()

		var start = Date.now()

		async.eachSeries(arr, testFn, function(err){
			if(err) throw err
			tasks[name].cycles = arr.length
			tasks[name].elapsed = Date.now() - start
			if(opts.complete) opts.complete(tasks[name].elapsed)
			callback()
		})
	}
	tasks[name] = {fn: fn, name: name}
}

exports.run = function(fn, isParallel){
	var method = isParallel?'each':'eachSeries'
	async[method]($.values(tasks), function(item, callback){
		item.fn(callback)
	}, function(err){
		if(err) throw err
		var results = $.map(tasks, function(task){
			return {name: task.name, elapsed: task.elapsed, cycles: task.cycles}
		})
		tasks = null
		fn(results)
	})
}