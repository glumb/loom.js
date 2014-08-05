/**
 * loom.js
 *
 * @author Maximilian Beck
 * @link http://glumb.de/loomjs
 * @license http://opensource.org/licenses/MIT
 * @version 0.1.0
 */

module = (function () {
    var debug = false,

        moduleContainer = {},
        waitingFor = {}, //'a':['b','c'] module b,c are waiting for a
        requireId = 0;

    function define(moduleName, deps, module, resolve) { //('n',[d],m,r) ('n',m,r) ('n',[d],m) ('n',m)
        if (moduleContainer[moduleName]) {
            log('module "' + moduleName + '" already defined');
            return;
        }

        if (module === undefined || typeof module === "boolean") {
            resolve = module;
            module = deps;
            deps = [];
        }

        if (typeof deps == 'string') {
            deps = [deps];
        }

        moduleContainer[moduleName] = {
            module: module,
            deps: deps,
            resolved: false
        };

        if (waitingFor[moduleName] || resolve) {
            resolveModuleDeps(moduleName);
        }
    }

    //require is basically a define without name
    function require(requireModules, callback) {
        var id = 'req-' + requireId++;
        define(id, requireModules, callback, true);
    }

    // adds moduleName to the list of the module it is waiting for
    function addWaitingFor(moduleName, waitingForName) {
        log('module "' + moduleName + '" waiting for module "' + waitingForName + '"');
        var pendingEntry = waitingFor[waitingForName] || []; //['a','b'] or []

        if (!(pendingEntry.indexOf(moduleName) > -1)) {
            pendingEntry.push(moduleName);
            waitingFor[waitingForName] = pendingEntry;
        }
    }

    function removeWaitingFor(moduleName) {
        log('deleting waitingFor: "' + moduleName + '"');
        delete waitingFor[moduleName];
    }

    function resolveModule(moduleName, deps) {

        var module = moduleContainer[moduleName];

        module.resolved = true;
        module.module = (deps !== undefined && deps.length > 0) ? module.module.apply(this, deps) : module.module.apply(this);

        if (waitingFor[moduleName]) {
            var waitingForArr = waitingFor[moduleName]; //['b','c'] b, c waiting for module
            for (var i = 0; i < waitingForArr.length; i++) {
                resolveModuleDeps(waitingForArr[i]);
            }
            removeWaitingFor(moduleName);
        }

        log('module "' + moduleName + '" resolved');
    }

    function resolveModuleDeps(ModuleName) {
        var module = moduleContainer[ModuleName];

        var depNames = module.deps; //['a','foo']
        if (depNames.length === 0) {
            resolveModule(ModuleName);
        } else {
            var resolvedDeps = [];

            for (var i = 0; i < depNames.length; i++) {
                var depName = module.deps[i];

                if (!moduleContainer[depName]) { //module not here(, yet?)
                    addWaitingFor(ModuleName, depName);
                    return;
                } else {
                    var depModule = moduleContainer[depName];

                    if (!depModule.resolved) {
                        resolveModuleDeps(depName);
                    }

                    if (depModule.resolved) {
                        resolvedDeps.push(depModule.module);
                    } else {
                        addWaitingFor(ModuleName, depName);
                        return;
                    }
                }
            }
            if (!module.resolved) {
                resolveModule(ModuleName, resolvedDeps);
            }

        }
    }

    function setDebug(deb) {
        debug = !!deb;
    }

    function log(message) {
        if (debug)
            console.log(message);
    }

    return {
        "debug": setDebug,
        "require": require,
        "define": define
    }
})();