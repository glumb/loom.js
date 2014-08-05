loom.js 0.1.0
=======
A super simple, lightweight ~0.5kB (minified & gzipped) and flexible module container.

##How to use loom.js
There are two base methods, `define()` and `require()`.
Define your module using the `module.define()` method like so:

    module.define('moduleName', ['dependency1', 'dependency2'], function (dep1, dep2) {
        // module code goes here

        return publicMethods;
    }, resolve);

Request modules using `modules.require()`:

    module.require('moduleName', function (module) {
        // use the module here
    });

Modules are only evaluated, if the optional parameter `resolve` is set to *true* or they are requested
using `module.require()`.

##Examples
Find examples [here](www.glumb.de/loomjs)
