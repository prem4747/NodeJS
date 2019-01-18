# memory-manager

Tracks the memory of the current node process, checks if its save to allocate more memory.

Used to check if some cache implementations can store more items or if they should start rejecting them.


[![npm](https://img.shields.io/npm/dm/memory-manager.svg?style=flat-square)](https://www.npmjs.com/package/memory-manager)
[![Travis](https://img.shields.io/travis/eventEmitter/memory-manager.svg?style=flat-square)](https://travis-ci.org/eventEmitter/memory-manager)
[![node](https://img.shields.io/node/v/memory-manager.svg?style=flat-square)](https://nodejs.org/)

You may start node using the `--max-old-space-size=4000` parameter in order to get a bigger heap (mb). Check `node --v8-options | grep size` for the details on this paramter.

## API

The memory manager checks if there is enough free memory left to allocate more objects. 
It starts returning false if the there is no more than minFree momory left for the 
current process. The heap size is determined via the v8 module. By default the library 
starts to return false as soon less than 20% of the heap is left.
    
    
    // import
    let MemoryManager = require('memory-manager');


    // create an instance of the manager
    let memoryManager = new MemoryManager({
        minFree: 10 // optionsal, defaults to 20% iof the heap
    });


    // checks if there is enough free memory to allocate more objects
    if (memorManager.hasMemory()) {

    }


The manager does poll reguarl< if there is enough memory left and
emits then «full» event if the limit was reached.

    
    memoryManager.on('full', () => {
        // start disposing objects

    });