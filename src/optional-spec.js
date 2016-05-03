(function() {
    'use strict';
    describe('Tests for get method of optional', function() {
        var optional;
        var testObject;
        var CHECK_STRING = 'TEST';

        beforeEach(function() {
            optional = require('./optional');
            testObject = {
                a: {
                    b: {
                        c: {
                            d: CHECK_STRING
                        }
                    }
                }
            };
        });

        it('test', function() {
            var result = optional(testObject).get('a.b.c.d', {});
            expect(CHECK_STRING).toBe(result)
        });
    });
})();
