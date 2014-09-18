loom.js 0.2.0
=======
A super simple, lightweight ~0.5kB (minified & gzipped) and flexible module container.

##How to use loom.js
There are two base methods, `define()` and `require()`.
Define your module using the `define()` method like so:

    define('moduleName', ['dependency1', 'dependency2'], function (dep1, dep2) {
        // module code goes here

        return publicMethods;
    });

Request modules using `require()`:

    require('moduleName', function (module) {
        // use the module here
    });

Modules are only evaluated, if they are requested using `require()`.

##Examples
Find examples [here](www.glumb.de/loomjs)
