##v0.2.0
* `define` and `require` are now in the global namespace

* added global variable `loom` to acess internal components like
 *queue*, *modules*, *requireCounter* and *debug*
* added `define.amd=true` to let 3rd party libs register as a module
* added support for objects in the define method `define('mod', {a:1})`