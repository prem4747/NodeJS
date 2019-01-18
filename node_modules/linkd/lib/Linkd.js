!function() {
    'use strict';




    
    const log           = require('ee-log');
    const EventEmitter  = require('ee-event-emitter');
    const Node          = require('./Node');
        





    /**
     * A fast and extendable doubly linked list.
     */



    module.exports = class Linkd extends EventEmitter {



        // the lenght property returns how many items are currently
        // stored in the linked list
        get length() {return this.map.size;}





        /**
         * initilize the linked list, set up storage and pointer. class constructor.
         *
         * @param {CustomNodeType} CustomNodeType A custom item implementation
         *                                        used for storing items
         */
        constructor(CustomType) {
            super();

            // the map hoofding the linked list
            Class.define(this, 'map', Class(new Map()).Writable());

            // reference to the first item
            Class.define(this, 'firsNode', Class(null).Writable().Configurable());

            // reference to the last item
            Class.define(this, 'lastNode', Class(null).Writable().Configurable());



            // the user may pass a custom type for the map items
            if (CustomType){
                if (new CustomType().identifier === Node.identifier) throw new Error('The custom type must inherit from the LinkedList.Node class!');
                Class.define(this, 'Node', Class(CustomType));
            }
            else {
                Class.define(this, 'Node', Class(Node));
            }



            // emit the drain event if the list is empty
            this.on('remove', () => {
                if (!this.length) this.emit('drain');
            })
        }



        /**
         * returns a node by its hash or null if the
         * node was not found
         *
         * @private
         * @param {*} hash a hash identifying an item, may be of any type
         * @returns {node|null} node or null
         */
        _getNode(hash) {
            return this.has(hash) ? this.map.get(hash) : null;
        }



        /**
         * returns an item by its hash or undefined if the
         * item was not found.
         *
         * @param {*} hash a hash identifying an item, may be of any type
         * @returns {*|undefined} value value of any type
         */
        get(hash) {
            let node = this.getNode(hash);

            return node ? node.value : undefined;
        }




        /**
         * returns a node by its hash or null if the
         * node was not found
         *
         * @param {*} hash a hash identifying an item, may be of any type
         * @returns {node|null} node or null
         */
        getNode(hash) {
            let node = this._getNode(hash);

            if (node) {
                // emit events
                this.emit('get', node.value);
                this.emit('getNode', node);

                return node;
            }
            else return null;
        }




        /**
         * returns the first item or undefined
         *
         *
         *
         * @returns {*|undefined} item or undefined
         */
        getFirst(noEvents) {
            return this.firstNode ? this.getFirstNode(noEvents).value : undefined;
        }



        /**
         * returns the last item or undefined
         *
         * @returns {*|undefined} item or undefined
         */
        getLast(noEvents) {
            return this.lastNode ? this.getLastNode(noEvents).value : undefined;
        }



        /**
         * returns the first node or null
         *
         * @returns {Node|null} node or null
         */
        getFirstNode(noEvents) {
            return this.firstNode ? (noEvents ? this._getNode(this.firstNode.hash) : this.getNode(this.firstNode.hash)) : null;
        }



        /**
         * returns the last node or null
         *
         * @returns {Node|null} item or null
         */
        getLastNode(noEvents) {
            return this.lastNode ? (noEvents ? this._getNode(this.lastNode.hash) : this.getNode(this.lastNode.hash)) : null;
        }





        /**
         * checks if a certain hash is present in the linked list
         *
         * @param {*} hash a hash identifying an item, may be of any type
         * @returns {bool} true if the hash was found inside the list
         */
        has(hash) {
            return this.map.has(hash);
        }




        /**
         * Moves an item so that its placed after another item
         *
         * @param {*|Node} hash the hash of the item to move or the node
         * @param {*|Node} afterHash the hash to move the item after or the node
         *
         * @returns {Node} the node that was moved
         */
        moveAfter(hash, afterHash) {
            let node;

            // check the input
            if (hash instanceof this.Node) hash = hash.hash;
            if (afterHash instanceof this.Node) afterHash = afterHash.hash;

            // the items need to exist
            if (this.has(hash)) {
                if (this.has(afterHash)) {
                    // remove the node
                    node = this._removeNode(hash);

                    // addd again
                    this._addAfter(node, afterHash);

                    // return the node
                    return node;
                }
                else throw new Error('The node cannot be moved after the node with the hash «'+hash+'». It could not be found!');
            }
            else throw new Error('The node cannot be moved, the hash «'+hash+'» could not be found!');
        }



        /**
         * Moves an item so that its placed before another item
         *
         * @param {*|Node} hash the hash of the item to move or the node
         * @param {*|Node} beforeHash the hash to move the item before or the node
         *
         * @returns {Node} the node that was moved
         */
        moveBefore(hash, beforeHash) {
            let node;

            // check the input
            if (hash instanceof this.Node) hash = hash.hash;
            if (beforeHash instanceof this.Node) beforeHash = beforeHash.hash;

            // the items need to exist
            if (this.has(hash)) {
                if (this.has(beforeHash)) {
                    // remove the node
                    node = this._removeNode(hash);

                    // addd again
                    this._addBefore(node, beforeHash);

                    // return the node
                    return node;
                }
                else throw new Error('The node cannot be moved after the node with the hash «'+hash+'». It could not be found!');
            }
            else throw new Error('The node cannot be moved, the hash «'+hash+'» could not be found!');
        }



        /**
         * Moves an item so that its placed at the beginning of the list
         *
         * @param {*|Node} hash the hash of the item to move or the node
         *
         * @returns {Node} the node that was moved
         */
        moveToBegin(hash) {
            let node;

            // check the input
            if (hash instanceof this.Node) hash = hash.hash;

            // the items need to exist
            if (this.has(hash)) {
                // remove the node
                node = this._removeNode(hash);

                // addd again
                this._push(node);

                // return the node
                return node;
            }
            else throw new Error('The node cannot be moved, the hash «'+hash+'» could not be found!');
        }



        /**
         * Moves an item so that its placed at the beginning of the list
         *
         * @param {*|Node} hash the hash of the item to move or the node
         *
         * @returns {Node} the node that was moved
         */
        moveToEnd(hash) {
            let node;

            // check the input
            if (hash instanceof this.Node) hash = hash.hash;

            // the items need to exist
            if (this.has(hash)) {
                // remove the node
                node = this._removeNode(hash);

                // addd again
                this._unshift(node);

                // return the node
                return node;
            }
            else throw new Error('The node cannot be moved, the hash «'+hash+'» could not be found!');
        }




        /**
         * add an element after another item in the list
         *
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         * @param {*} hash the hash of the item this should be placed after
         *            value
         * @returns {Node} the noded added
         */
        addAfter(hash, value, afterHash) {

            let node = this._addAfter(hash, value, afterHash);


            // emit events
            this.emit('add', node.value);
            this.emit('addNode', node);
            this.emit('addAfter', node.value);
            this.emit('addAfterNode', node);

            return node;
        }



        /**
         * add an element after another item in the list
         *
         * @private
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         * @param {*} hash the hash of the item this should be placed after
         *            value
         * @returns {Linkd} this
         */
        _addAfter(hash, value, afterHash) {
            let node, afterNode, existingNode = false;

            // clean up letiables
            if (hash instanceof this.Node) {
                node = hash;
                hash = node.hash;
                afterHash = value;
                existingNode = true;
            }


            // convert nodes to hashes
            if (afterHash instanceof this.Node) afterHash = afterHash.hash;


            // the node to insert after needds to exits!
            if (!this.has(afterHash)) throw new Error('Cannot add node after hash «'+afterHash+'», the node referenced node does not exist!');
            else afterNode = this.map.get(afterHash);


            // set up node
            if (existingNode) {
                node.nextNode = afterNode;
                node.previousNode = null;
            }
            else node = new this.Node(hash, value, null, afterNode);


            // remove existing instances
            if (this.has(hash)) this._removeNode(hash);


            // store the node
            this.map.set(hash, node);


            // set this node between the afterNode and its previous node
            if (afterNode.previousNode) {
                afterNode.previousNode.nextNode = node;
                node.previousNode = afterNode.previousNode;
            }
            else {
                // this is the last node
                this.lastNode = node;
            }


            // set link
            afterNode.previousNode = node;


            // return this class for daisy chaning
            return node;
        }



        /**
         * add an element before another item in the list
         *
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         * @param {*} hash the hash of the item this should be placed before
         *            value
         * @returns {Linkd} this
         */
        addBefore(hash, value, beforeHash) {

            let node = this._addBefore(hash, value, beforeHash);

            // emit events
            this.emit('add', node.value);
            this.emit('addNode', node);
            this.emit('addBefore', node.value);
            this.emit('addBeforeNode', node);

            return this;
        }






        /**
         * add an element before another item in the list
         * @private
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         * @param {*} hash the hash of the item this should be placed before
         *            value
         * @returns {Linkd} this
         */
        _addBefore(hash, value, beforeHash) {
            let node, beforeNode, existingNode = false;


            // clean up letiables
            if (hash instanceof this.Node) {
                node = hash;
                hash = node.hash;
                beforeHash = value;
                existingNode = true;
            }


            // convert nodes to hashes
            if (beforeHash instanceof this.Node) beforeHash = beforeHash.hash;


            // the node to insert before needds to exits!
            if (!this.has(beforeHash)) throw new Error('Cannot add node before hash «'+beforeHash+'», the node referenced node does not exist!');
            else beforeNode = this.map.get(beforeHash);


            // set up node
            if (existingNode) {
                node.nextNode = null;
                node.previousNode = beforeNode;
            }
            else node = new this.Node(hash, value, beforeNode);


            // remove existing instances
            if (this.has(hash)) this._removeNode(hash);


            // store the node
            this.map.set(hash, node);


            // set this node between the beforeNode and its previous node
            if (beforeNode.nextNode) {
                beforeNode.nextNode.previousNode = node;
                node.nextNode = beforeNode.nextNode;
            }
            else {
                // this is the first node
                this.firstNode = node;
            }


            // set link
            beforeNode.nextNode = node;


            // return this class for daisy chaning
            return node;
        }




        /**
         * add an element to the beginning of the list
         *
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         *              value
         * @returns {Node} the created node
         */
        push(hash, value) {

            let node = this._push(hash, value);

            // emit events
            this.emit('add', node.value);
            this.emit('addNode', node);
            this.emit('push', node.value);
            this.emit('pushNode', node);

            return node;
        }




        /**
         * add an element to the beginning of the list
         *
         * @private
         * @param {*|node} hash a hash identifying an item, may be of any type or a node
         * @param {*} the value to store. undefiend is the only unacceptable
         *              value
         * @returns {Node} the created node
         */
        _push(hash, value) {
            let node;

            // set up node
            if (hash instanceof this.Node) {
                node = hash;
                hash = node.hash;

                node.nextNode = null;
                node.previousNode = this.firstNode;
            }
            else node = new this.Node(hash, value, this.firstNode);


            // remove existing instances
            if (this.has(hash)) this._removeNode(hash);


            // store the node
            this.map.set(hash, node);


            // set myself as nextnode
            if (this.firstNode) this.firstNode.nextNode = node;


            // set as first node
            this.firstNode = node;


            // set as last node if first item
            if (!this.lastNode) this.lastNode = this.firstNode;


            // return this class for daisy chaning
            return node;
        }




        /**
         * add an element to the end of the list
         *
         * @param {*} hash a hash identifying an item, may be of any type
         * @param {any} the value to store. undefiend is the only unacceptable
         *              value
         * @returns {Node} the created node
         */
        unshift(hash, value) {

            let node = this._unshift(hash, value);

            // emit events
            this.emit('add', node.value);
            this.emit('addNode', node);
            this.emit('unshift', node.value);
            this.emit('unshiftNode', node);

            return node;
        }





        /**
         * add an element to the end of the list
         *
         * @private
         * @param {*} hash a hash identifying an item, may be of any type
         * @param {any} the value to store. undefiend is the only unacceptable
         *              value
         * @returns {Node} the created node
         */
        _unshift(hash, value) {
            let node;

            // set up node
            if (hash instanceof this.Node) {
                node = hash;
                hash = node.hash;

                node.nextNode = this.lastNode;
                node.previousNode = null;
            }
            else node = new this.Node(hash, value, null, this.lastNode);


            // remove existing instances
            if (this.has(hash)) this._removeNode(hash);


            // store the node
            this.map.set(hash, node);


            // set myself as nextnode
            if (this.lastNode) this.lastNode.previousNode = node;


            // set as first node
            this.lastNode = node;


            // set as last node if first item
            if (!this.firstNode) this.firstNode = this.lastNode;

            // return this class for daisy chaning
            return node;
        }




        /**
         * remove an element from the beginning of the list
         *
         * @returns {Node} the removed node
         */
        popNode() {
            let node;

            if (this.firstNode) {
                node = this._removeNode(this.firstNode.hash);

                if (node) {
                    this.emit('remove', node.value);
                    this.emit('removeNode', node);
                    this.emit('pop', node.value);
                    this.emit('popNode', node);
                }

                return node;
            }
            return undefined;
        }



        /**
         * remove an element from the beginning of the list
         *
         * @returns {*} the removed item
         */
        pop() {
            let node = this.popNode();

            return node ? node.value : node;
        }




        /**
         * remove an element from the beginning of the list
         *
         * @returns {Node} the removed item
         */
        shiftNode() {
            let node;

            if (this.lastNode) {
                node = this._removeNode(this.lastNode.hash);

                if (node) {
                    this.emit('remove', node.value);
                    this.emit('removeNode', node);
                    this.emit('shift', node.value);
                    this.emit('shiftNode', node);
                }

                return node;
            }
            return undefined;
        }




        /**
         * remove an element from the beginning of the list
         *
         * @returns {*} the removed item
         */
        shift() {
            let node = this.shiftNode();

            return node ? node.value : node;
        }






        /**
         * remove an element from the list
         *
         * @param {*|Node} hash a hash identifying an item, may be of any type or node
         * @returns {Node} the removed node
         */
        removeNode(hash) {
            let node;

            if (hash instanceof this.Node) node = this._removeNode(hash.hash);
            else node = this._removeNode(hash);

            if (node) {
                this.emit('remove', node.value);
                this.emit('removeNode', node);
            }

            return node;
        }





        /**
         * remove an element from the list
         *
         * @param {*|Node} hash a hash identifying an item, may be of any type or node
         * @returns {*} the removed item
         */
        remove(hash) {
            let node = this.removeNode(hash);

            return node ? node.value : node;
        }





        /**
         * returns all the hashes that are stored in the list
         *
         * @returns {Iterable*} with all hashes
         */
        keys() {
            return this.map.keys();
        }




        /**
         * clears all values from the linked list, re-initilizes
         * the class isntance
         */
        clear() {

            // create a new map
            Class.define(this, 'map', Class(new  Map()).Writable());

            // clear nodes
            this.lastNode = null;
            this.firstNode = null;


            this.emit('clear');
        }




        /**
         * removes a node from the lsit
         *
         * @private
         * @param {*} hash the hash of the node to remove
         * @returns {Node} node
         */
        _removeNode(hash) {
            let toBeRemovedNode = this.map.has(hash) ? this.map.get(hash) : null;

            if (toBeRemovedNode) {
                if (toBeRemovedNode.nextNode) {
                    if (toBeRemovedNode.previousNode) {
                        // this node is in between of two nodes
                        toBeRemovedNode.nextNode.previousNode = toBeRemovedNode.previousNode;
                        toBeRemovedNode.previousNode.nextNode = toBeRemovedNode.nextNode;
                    }
                    else {
                        // this is the last node
                        toBeRemovedNode.nextNode.previousNode = null;
                        this.lastNode = toBeRemovedNode.nextNode;
                    }
                }
                else {
                    if (toBeRemovedNode.previousNode) {
                        // this is the first node
                        toBeRemovedNode.previousNode.nextNode = null;
                        this.firstNode = toBeRemovedNode.previousNode;
                    }
                    else {
                        // this was the last node
                        this.lastNode = null;
                        this.firstNode = null;
                    }
                }

                // remove from map
                this.map.delete(hash);

                // remove links
                toBeRemovedNode.nextNode = null;
                toBeRemovedNode.previousNode = null;

                // return the deleted node
                return toBeRemovedNode;
            }
            else throw new Error('Cannot remove the node «'+(hash && hash.toString ? hash.toString() : hash)+'», the node doesn\'t exist!');
        }






        [Symbol.iterator]() {
            let currentNode = this.firstNode;

            return {
                next: function() {
                    let returnNode;

                    if (currentNode) {
                        returnNode = currentNode;
                        currentNode = currentNode.previousNode || null;

                        return {value: returnNode.value, done: false};
                    }
                    else return {done: true};
                }
            };
        }
    };
}();
