loom.js 0.2.0
=======
A super simple, lightweight ~0.5kB (minified & gzipped) and flexible module container.

## Why loom
* structure code in modules
* require modules in *any order*
* libs like that follow the AMD syntax like jQuery automatically register as a module
* modules only get called, if they are requested

## What loom.js is not
* a module loader, that loads modules via ajax.

## How to use loom.js
There are two base methods, `define()` and `require()`.
Define your module using the `define()` method like so:

    define('module2Name', function () {
        return publicMethods;
    });

    define('module3Name', 'dependency1', function (dep1) {
        return publicMethods;
    });

    define('module1Name', ['dependency1', 'dependency2'], function (dep1, dep2) {
        // module code goes here

        return publicMethods;
    });

    define('objectName', {a:1, b:2});


Modules are only evaluated, if they are requested using `require()`.

Request modules using `require()`:

    require('moduleName', function (module) {
        // use the module here
    });

    require(['module1Name', 'module2Name'], function (m1, m2) {
        // use the modules here
    });

Modules can be required in *any order*, even before they are defined. Once the required module is
 defined, the callback of the `require` function will be called.

## Example
The *require* works, even though *Add* and *Multiply* are defined afterwards.
*Pi* is not logged to the console, because module *PI* is never requested.


    define('Square', ['Multiply'], function (multi) {

        return function (num) {
            return multi(num, num);
        }
    });


    require(['Square', 'Multiply', 'Add'], function (sq, mul, add) {

        console.log(sq(3));
        console.log(mul(2, 3));
        console.log(add(3, 4));
    });


    define('Multiply', function () {

        return function (num1, num2) {
            return num1 * num2;
        }
    });

    define('Add', function () {

        return function (num1, num2) {
            return num1 + num2;
        }
    });

    define('Pi', function () {

        console.log(Math.PI);
        return Math.PI;
    });


## More examples
Find examples [here](www.glumb.de/loomjs)
