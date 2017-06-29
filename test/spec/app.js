/* global describe, it, expect, inject */
(function(){//declare the function in self instantiating mode
    'use strict';// ths will forbid some javascript regarded to be harmful;
    // load the module
    describe('App: jApp', function(){
        beforeEach(module('jApp')); // this will run first before anything inside this
        it('version 0.0.1', inject(function(version){
            expect(version).toBe('0.0.1');
        }));
    });
}());