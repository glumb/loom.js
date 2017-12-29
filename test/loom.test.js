var ns = window

ns.loom.debug(true);

ns.QUnit.module("loom");

ns.QUnit.test("test that modules can be ns.defined", function(assert) {

  ns.define('testModule1', function() {
    return 'data'
  });

  assert.ok(ns.loom.modules.hasOwnProperty('testModule1'), "'testModule1' is ns.defined");

  ns.define('testModule2', function() {
    return 'data'
  });

  assert.ok(ns.loom.modules.hasOwnProperty('testModule2'), "'testModule2' is ns.defined");
});

ns.QUnit.test("test that modules can objects and functions", function(assert) {

  ns.define('testModule4', {
    data: 'some data',
    func: function(e) {
      alert(e);
    }
  });

  ns.define('testModule5', function() {
    return 'other data'
  });

  var m4, m5;

  ns.require(['testModule4', 'testModule5'], function(tm4, tm5) {
    m4 = tm4;
    m5 = tm5;
  });

  assert.equal(m4.data, 'some data', "module as Object");
  assert.equal(m5, 'other data', "module as anonymous function");

});


ns.QUnit.module("ns.require test");

// ns.QUnit.test("test that jquery registers itself as a module", function(assert) {
//
//   var jq;
//   ns.require('jquery', function($jq) {
//     jq = $jq;
//   });
//   assert.ok(jq === ns.$, "'jquery' is available");
// });

ns.QUnit.test("test that ns.requires can be nested", function(assert) {

  assert.ok(ns.loom.modules.hasOwnProperty('testModule1') && ns.loom.modules.hasOwnProperty('testModule2'), "assert that 'testModule1' and 'testModule2' are available");

  var m2 = false;
  ns.require('testModule1', function() {
    ns.require('testModule2', function(tm2) {
      m2 = tm2;
    });
  });
  assert.ok(m2 === 'data', "testModule2 resturns `data`");
});

ns.QUnit.test("test that modules can be ns.required", function(assert) {

  assert.ok(ns.loom.modules.hasOwnProperty('testModule1') && ns.loom.modules.hasOwnProperty('testModule2'), "assert that 'testModule1' and 'testModule2' are available");

  var m1, m2 = false;
  ns.require('testModule1', function() {
    m1 = true;
  });
  ns.require('testModule1', function() {
    m2 = true;
  });
  assert.ok(m1 && m2, "modules can be ns.required");
});


ns.QUnit.module("general tests");

ns.QUnit.test("context of `this`", function(assert) {

  ns.define('testModule6', {
    data: 'some data',
    self: function() {
      return this;
    }
  });
  var m6;
  ns.require(['testModule6'], function(tm6) {
    m6 = tm6;
  });

  assert.deepEqual(ns.loom.modules['testModule6'].module, m6.self(), '`this` refers to the module itself');
});

ns.QUnit.test("test resolving order and other logic", function(assert) {

  ns.define('a', ['c', 'b'], function(c, b) {

    console.log('processing a');

    return {
      c: c,
      logVal: function() {
        console.log(c.val);
      },
      init: function() {
        console.log('initiated a');
        b.init();
        c.add();
        c.add();
      }
    };
  });

  assert.ok(ns.loom.modules.hasOwnProperty('a'), "module 'a' is in the container");
  assert.ok(!ns.loom.modules['a'].resolved, "module 'a' is not resolved, yet");
  assert.ok(!ns.loom.queue.hasOwnProperty('c') && !ns.loom.queue.hasOwnProperty('b'), "modules 'c' and 'b' not in the queue, yet");


  ns.define('c', [], function() {

    console.log('processing c');

    return {
      val: 0,
      add: function() {
        this.val++;
        console.log("val c: " + this.val);
      },
      init: function() {
        console.log('initiated c');
      }
    };
  });

  assert.ok(ns.loom.modules.hasOwnProperty('c'), "module 'c' is in the container");
  assert.ok(!ns.loom.modules['c'].resolved, "module 'c' is not resolved, yet");
  assert.ok(!ns.loom.queue.hasOwnProperty('c') && !ns.loom.queue.hasOwnProperty('b'), "modules 'c' and 'b' not in the queue, yet");


  ns.require(['a'], function(a) {

    a.init();


    a.logVal();
    a.c.add();
    a.logVal();

    console.log('initiated main');

  });

  assert.ok(ns.loom.modules['c'].resolved, "module 'c' is resolved.");
  assert.ok(!ns.loom.modules['a'].resolved, "module 'a' is not resolved.");
  assert.ok(ns.loom.queue.hasOwnProperty('b') && ns.loom.queue.hasOwnProperty('a'), "modules 'b' and 'a' are in the queue.");
  assert.ok(!ns.loom.queue.hasOwnProperty('c'), "modules 'c' is not in the queue.");


  ns.define('d', ['e'], function() {

    console.log('processing d');

    console.log('this should not be logged, since d is not used');

    return {
      init: function() {
        console.log('initiated e');
      }
    };
  });

  assert.ok(!ns.loom.modules['d'].resolved, "module 'd' is not resolved.");
  assert.ok(!ns.loom.queue.hasOwnProperty('e'), "module 'e' is not in the queue.");

  ns.define('b', ['c'], function(c) {

    c.init();
    console.log('processing b');

    return {
      init: function() {
        console.log('initiated b');
        c.add();
      }
    };
  });

  assert.ok(Object.keys(ns.loom.queue).length === 0, "queue is empty");
  assert.ok(ns.loom.modules['a'].resolved, "module 'a' is resolved.");
});

ns.QUnit.test("calculator test", function(assert) {

  ns.define('Square', ['Multiply'], function(multi) {

    return function(num) {
      return multi(num, num);
    }
  });


  ns.require(['Square', 'Multiply', 'Add'], function(sq, mul, add) {

    assert.equal(sq(3), 9, 'square works');
    assert.equal(mul(2, 3), 6, 'multiply works');
    assert.equal(add(3, 4), 7, 'adding works');
  });


  ns.define('Multiply', function() {

    return function(num1, num2) {
      return num1 * num2;
    }
  });

  ns.define('Add', function() {

    return function(num1, num2) {
      return num1 + num2;
    }
  });
});
