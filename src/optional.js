module.exports = function(baseObject, stateful) {
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

    wrapper.get = function(selector, defaultObject, persistDefault) {
        if (selector == null) {
            return currentObject;
        }

        currentObject = wrapper(selector).get();
        if (currentObject == null) {
            if (persistDefault) {
                wrapper.set(selector, defaultObject);
            }
            currentObject = defaultObject;
        }
        var temporary = currentObject;
        if (!stateful) {
            wrapper.reset();
        }

        return temporary;
    };

    wrapper.set = function(selector, object) {
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
};
