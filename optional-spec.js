(function() {
    'use strict';
    describe('Test get().', function() {
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

        it('Get defined property', function() {
            var result = optional(testObject).get('a.b.c.d', {});
            expect(result).toBe(CHECK_STRING);
        });

        it('Get not defined property without default', function() {
            var result = optional(testObject).get('a.b.c.e');
            expect(result).toBe(null);
        });

        it('Get not defined property with default', function() {
            var expectedObject = {};
            var result = optional(testObject).get('a.b.c.e', expectedObject);
            expect(result).toBe(expectedObject);
        });
    });

    describe('Test setUndefined().', function() {
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

        it('Set defined property', function() {
            var expectedObject = {};
            var result = optional(testObject).setUndefined('a.b.c.d', expectedObject);
            expect(result).toBe(CHECK_STRING);
            expect(testObject.a.b.c.d).toBe(CHECK_STRING);
        });

        it('Set undefined property', function() {
            var expectedObject = {};
            var result = optional(testObject).setUndefined('a.b.c.e', expectedObject);
            expect(result).toBe(expectedObject);
            expect(testObject.a.b.c.e).toBe(expectedObject);
        });
    });

    describe('Test set().', function() {
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

        it('Set object', function() {
            var expectedObject = {};
            optional(testObject).set('a.b.c.e', expectedObject);
            expect(testObject.a.b.c.e).toBe(expectedObject);
        });

        it('Override object', function() {
            var expectedObject = {};
            optional(testObject).set('a.b.c.d', expectedObject);
            expect(testObject.a.b.c.d).toBe(expectedObject);
        });
    });
})();
