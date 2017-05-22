
var emitter = require('../')
  , Person = function () {}
  , person = new Person;

emitter(Person.prototype);

describe('Person', function () {
  it('should mixin emitter', function () {
    person._events.should.equal(person._events);
    Person.prototype._events.should.not.equal(person._events);
  });

  it('should emit properly', function () {
    person.on('foo', function (a) {
      a.should.eql('bar');
    }).emit('foo', 'bar');
  });

  it('should register events properly', function () {
    person.on('say', console.log)._events.say.should.equal(console.log);
  })
});

describe('Person constructor', function () {
  it('should eql `Person`', function () {
    person.constructor.should.equal(Person);
  })
})

describe('emitter()', function () {
  it('should return the given `obj`', function () {
    var obj = new Person();
    emitter(obj).should.be.instanceOf(Person);
  })
})

describe('emitter({})', function () {

  var obj = emitter({});

  describe('.on()', function () {
    it('should work', function () {
      obj.on('foo', console.log)
        ._events['foo'].should.equal(console.log)
    })
  })

  describe('.removeListener()', function () {
    it('should work', function () {
      obj.removeListener('foo', console.log)
        ._events.should.eql({});
    })
  })

  describe('.removeAllListeners()', function () {
    it('should work', function () {
      obj.on('foo', console.log)
        .removeAllListeners()
        ._events.should.eql({});
    })
  })

  describe('.once()', function () {
    it('should work', function () {
      obj.once('foo', console.log).emit('foo');
      obj._events
        .should
        .eql({});
    })
  })

  describe('.setMaxListeners()', function () {
    it('should work', function () {
      obj.setMaxListeners(10);
      obj._maxListeners.should.eql(10);
    })
  })

  describe('.listeners()', function () {
    it('should return all listeners for event', function () {
      obj.on('foo', console.log)
        .listeners('foo')[0]
        .should.equal(console.log);

      obj.removeListener('foo', console.log);
    })
  })

  describe('.emit()', function () {
    it('should emit the given event with `args`', function () {
      var args;

      obj.on('foo', function () {
        args = [].slice.call(arguments);
      }).emit('foo', 'bar', 'baz');

      args.should.eql(['bar', 'baz']);
    })
  })

  describe('.off()', function () {
    it('should remove all listeners if arguments are omitted', function () {
      obj
        .on('foo', function () {})
        .on('bar', function () {})
        .off()
        ._events
        .should
        .eql({});
    })

    it('should remove all listeners for `event`', function () {
      obj.on('foo', function () {}).off('foo')
        ._events.should.have.property('foo', null);
    })

    it('should remove the given `listener` from `event`', function () {
      obj.on('foo', console.log).on('foo', console.dir)
        .off('foo', console.log)
        .listeners('foo')
        .should.not.include(console.log);
    })
  })

})
