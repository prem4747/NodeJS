(function() {
	'use strict';

	var   Class 		= require('ee-class')
        , EventEmitter  = require('ee-event-emitter')
        , type          = require('ee-types')
        , v8            = require('v8')
		, log 			= require('ee-log');



	module.exports = new Class({
        inherits: EventEmitter


        // how many percent of the heap to keep clear
        , minFreePercentage: 20


        // the interval for polling the memory
        , pollInterval: 60000


        // the amount of memory that has to be free 
        , freeBytes: 0


        // the heap limit
        , heapBytes: 0





        /**
         * class setup
         */
		, init: function(options) {
            if (type.object(options)) {
                if (type.number(options.minFree)) {
                    if (options.minFree < 100 && options.minFree > 0) this.minFreePercentage = options.minFree;
                    else throw new Error('the minFree option must be a percentage between 1 and 99');
                }

                if (type.number(options.pollInterval)) this.pollInterval = options.pollInterval;
            }


            // if an event listener is added or removed we
            // should check if we still need to emit events
            this.on('listener', this.checkListeners.bind(this));
            this.on('removeListener', this.checkListeners.bind(this));


            // set up the amount oof bytes that need to be free
            this.heapBytes = v8.getHeapStatistics().heap_size_limit;
            this.freeBytes = Math.round(this.heapBytes/100*this.minFreePercentage);
		}







        /**
         * toggle memory usage polling based on the listeners for 
         * the event
         */
        , checkListeners: function() {
            process.nextTick(() => {
                if (this.listener('full').length) {
                    if (!this.poller) {
                        this.poller = setTimeout(() => {

                            // emit the full event if the memory is full
                            if (!this.hasMemory()) this.emit('full');
                        }, this.pollInterval);
                    }
                }
                else if (this.poller) {

                    // diable polling
                    clearTimeout(poller);
                    delete this.poller;
                }
            });           
        }





        /**
         * does the actual memory check
         */
        , hasMemory: function() {
            return v8.getHeapStatistics().total_available_size > this.freeBytes;
        }
	});
})();
