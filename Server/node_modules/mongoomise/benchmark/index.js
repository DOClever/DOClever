var mongoose = require('mongoose')
var bluebird = require('bluebird')
var Q = require('q')
var RSVP = require('rsvp')
var when = require('when')
var es6Promise = require('es6-promise')
var mongoomise = require('../src/main')
var bench = require('./bench')
var $ = require('lodash')

require('../test/feed')

var Feed = mongoose.model('Feed')
mongoose.connect('mongodb://localhost/mongoomise')

var testFunc = function(item, callback){
	Feed.findOneAsync().then(function(feed){
		feed.text = Math.random().toString()
		return feed.saveAsync()
	}).then(function(doc){
		callback(null, doc)
	})
}

var compareResults = function(results){
	console.log('all tasks have been proceeded')
	var sl = $.sortBy(results, function(i){
		return i.elapsed
	})
	$.each(sl, function(task){
		console.log('#### task ' + task.name  + ' ####')
		var details = task.cycles + ' cycles, ' + task.elapsed + ' ms, ' +
			(1000*task.cycles/task.elapsed).toFixed(2) + ' ops/sec'
		console.log('  ' + details)
	})
}

bench.add('bluebird', testFunc, {
	setup: function(){
		bluebird.promisifyAll(mongoose)
		console.log('bluebird is running...')
	},
	complete: function(elapsed){
		console.log('bluebird has been proceeded in ' + elapsed + ' ms.')
	}
})

bench.add('mongoomise-bluebird', testFunc, {
	setup: function(){
		mongoomise.promisifyAll(mongoose, bluebird)
		console.log('mongoomise-bluebird is running...')
	},
	complete: function(elapsed){
		console.log('mongoomise-bluebird has been proceeded in ' + elapsed + ' ms.')
	}
})

bench.add('mongoomise-Q', testFunc, {
	setup: function(){
		mongoomise.promisifyAll(mongoose, Q)
		console.log('mongoomise-Q is running...')
	},
	complete: function(elapsed){
		console.log('mongoomise-Q has been proceeded in ' + elapsed + ' ms.')
	}
})

bench.add('mongoomise-RSVP', testFunc, {
	setup: function(){
		mongoomise.promisifyAll(mongoose, RSVP)
		console.log('mongoomise-RSVP is running...')
	},
	complete: function(elapsed){
		console.log('mongoomise-RSVP has been proceeded in' + elapsed + ' ms.')
	}
})

bench.add('mongoomise-when', testFunc, {
	setup: function(){
		mongoomise.promisifyAll(mongoose, when)
		console.log('mongoomise-when is running...')
	},
	complete: function(elapsed){
		console.log('mongoomise-when has been proceeded in' + elapsed + ' ms.')
	}
})

bench.add('mongoomise-es6Promise', testFunc, {
	setup: function(){
		mongoomise.promisifyAll(mongoose, es6Promise)
		console.log('mongoomise-es6Promise is running...')
	},
	complete: function(elapsed){
		console.log('mongoomise-es6Promise has been proceeded in' + elapsed + ' ms.')
	}
})

// this should be false, otherwise you may use the same promise library
var isParallel = false

bench.run(function(results){
	compareResults(results)
	process.exit()
}, isParallel)