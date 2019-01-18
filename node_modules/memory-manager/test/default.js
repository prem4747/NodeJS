(function() {
    'use strict';


	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var MemoryManager = require('../')



	describe('The MemoryManager', function() {
		it('should not crash', function() {
            new MemoryManager();
		});

        it('should return if there is memory left I', function() {
            assert(!new MemoryManager({minFree: 99}).hasMemory());
        });

        it('should return if there is memory left II', function() {
            assert(new MemoryManager({minFree: 1}).hasMemory());
        });


        it('should the full event if the memory is full', function(done) {
            let mm = new MemoryManager({minFree: 99, pollInterval: 1000});
            mm.on('full', done);
        });
	});    
})();
