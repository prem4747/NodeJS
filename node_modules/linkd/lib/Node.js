!function() {
    'use strict';


    const log           = require('ee-log');
    const EventEmitter  = require('ee-event-emitter');




    module.exports = class Node extends EventEmitter {



        /**
         * initilize the linked list node
         *
         * @param {Item} customType a custom item implementation used for storing
         *                          ittems
         */
        constructor(hash, value, previousNode, nextNode) {
            super();

            this.identifier = Symbol('Linkd.Node');

            // we may need the hash later on
            this.hash = hash;

            // save the value
            this.value = value;

            // save the links
            Class.define(this, 'previousNode', Class(previousNode || null).Writable().Configurable().Enumerable());
            Class.define(this, 'nextNode', Class(nextNode || null).Writable().Configurable().Enumerable());
        }


        /**
         * returns true if there is a next node in the list
         *
         * @returns {bool} true if there is a next node in the list
         */
        hasNext() {
            return !!this.nextNode;
        }


        /**
         * returns true if there is a previous node in the list
         *
         * @returns {bool} true if there is a previous node in the list
         */
        hasPrevious() {
            return !!this.previousNode;
        }


        /**
         * returns true if this is the last node in the list
         *
         * @returns {bool} true if this is the last node in the list
         */
        isLast() {
            return !this.previousNode;
        }



        /**
         * returns true if this is the first node in the list
         *
         * @returns {bool} true if this is the first node in the list
         */
        isFrist() {
            return !this.nextNode;
        }


        /**
         * returns the next node or null
         *
         * @returns {Node|null} the next node or null
         */
        getNext() {
            return this.nextNode || null;
        }


        /**
         * returns the previous node or null
         *
         * @returns {Node|null} the previous node or null
         */
        getPrevious() {
            return this.previousNode || null;
        }
    };
}();
