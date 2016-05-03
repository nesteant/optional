(function() {
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
        ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();

    // CommonJS export
    if (typeof module != 'undefined' && module.exports) {
        module.exports = optional;
    }// RequireJS export
    else if (typeof define == 'function' && define.amd) {
        define(function() {
            return optional;
        });
    }// Export to global object
    else {
        global.optional = optional;
    }

    function optional(baseObject, stateful) {
        stateful = !!stateful;
        baseObject = baseObject || window;

        var rootObject = baseObject;
        var currentObject = baseObject;
        var separator = '.';

        /**
         * Walks through object hierarchy and saves result in current context
         * @param path - Path relative to the base object
         * @returns {wrapper} - returns itself for chaining convenience
         */
        function wrapper(path) {
            if (path == null) {
                return wrapper;
            }

            if (path.indexOf(separator) > -1) {
                var chunks = path.split(separator);
                for (var chunkCount = 0; chunkCount < chunks.length; chunkCount++) {
                    var chunk = chunks[chunkCount];
                    wrapper(chunk);
                }
            } else {
                var result = currentObject && currentObject[path];
                currentObject = result == null ? null : result;
            }
            return wrapper;
        }

        /**
         * Allows to get property of the object without specifying explicit null checks
         *
         * @param selector - dot separated path to specified object
         * @param defaultObject - default object which should be returned in case path specified leads to undefined
         *     property
         * @param persistDefault - whether to save default object as a property of object wrapped with optional in case
         * this propery is not specified
         * @returns returns property under the specified path or default object if path leads to unspecified property
         */
        wrapper.get = function(selector, defaultObject, persistDefault) {
            if (selector == null) {
                return currentObject;
            }

            var temporary = wrapper(selector).get();
            if (stateful) {
                currentObject = temporary;
            } else {
                wrapper.reset();
            }

            if (temporary == null) {
                if (persistDefault) {
                    wrapper.set(selector, defaultObject);
                }
                temporary = defaultObject ? defaultObject : null;
            }

            return temporary;
        };

        /**
         * Allows to set properties of the object without specifying explicit null checks
         *
         * @param selector - dot separated path to the property which should be specified
         * @param object - object which should be set as a property of the object wrapped with optional
         * @returns optional
         */
        wrapper.set = function(selector, object) {
            if (currentObject == null) {
                currentObject = {};
            }

            if (object == null) {
                return wrapper;
            }
            if (selector == null) {
                return object;
            }
            var tempObject = currentObject;
            var chunks = selector.split(separator);

            function isLastChunk(array, index) {
                return array.length - 1 === index;
            }

            for (var chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                var chunk = chunks[chunkIndex];
                if (isLastChunk(chunks, chunkIndex)) {
                    currentObject[chunk] = object;
                } else {
                    if (currentObject[chunk] == null) {
                        currentObject[chunk] = {};
                    }
                    currentObject = currentObject[chunk];
                }
            }
            currentObject = tempObject;
            return wrapper;
        };

        wrapper.reset = function() {
            currentObject = rootObject;
            return wrapper;
        };
        return wrapper;
    }
})();