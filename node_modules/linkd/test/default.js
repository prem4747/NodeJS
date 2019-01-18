

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var   LinkedList = require('../');



	describe('The LinkedList', function(){
		it('should not crash when instantiated', function() {
			new LinkedList();
		});


		it('should corrently save pushed nodes', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b', 'a']);
		});


		it('should corrently save unshifted nodes', function() {
			var   list = new LinkedList()
				, arr = [];

			list.unshift(1, 'a');
			list.unshift(2, 'b');
			list.unshift(3, 'c');
			list.unshift(4, 'd');
			list.unshift(5, 'e');

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b', 'a'].reverse());
		});


		it('should corrently save unshifted and push nodes', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(10, 'x');
			list.unshift(1, 'a');
			list.unshift(2, 'b');
			list.unshift(3, 'c');
			list.unshift(4, 'd');
			list.push(11, 'y');
			list.unshift(5, 'e');

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b', 'a', 'x', 'y'].reverse());
		});


		it('should corrently save addAfter nodes', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');
			list.addAfter(6, 'x', 1);

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b', 'a', 'x']);
		});


		it('should corrently save unshifted nodes', function() {
			var   list = new LinkedList()
				, arr = [];

			list.unshift(1, 'a');
			list.unshift(2, 'b');
			list.unshift(3, 'c');
			list.unshift(4, 'd');
			list.unshift(5, 'e');
			list.addAfter(6, 'x', 1);

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b', 'x', 'a'].reverse());
		});


		it('should corrently check if an item is in the list', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			assert(list.has(1));
			assert(!list.has(10));
		});


		it('should corrently return a value', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			assert(list.get(4) === 'd');
		});


		it('should corrently return a node', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			assert(list.getNode(4).value === 'd');
		});


		it('should corrently remove a value', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			list.remove(3);

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'b', 'a']);
		});


		it('should corrently shift a value', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			list.shift();

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['e', 'd', 'c', 'b']);
		});


		it('should corrently pop a value', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			list.pop();

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['d', 'c', 'b', 'a']);
		});


		it('clearing the list should work', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			list.clear();

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, []);
		});


		it('listing the keys should work', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');

			for (var x of list.keys()) arr.push(x);

			assert.deepEqual(arr, [1, 2, 3, 4, 5]);
		});





		it('moving nodes should work', function() {
			var   list = new LinkedList()
				, arr = [];

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');
			list.push(6, 'f');
			list.push(7, 'g');


			list.moveAfter(1, 7);
			list.moveBefore(2, 7);
			list.moveToBegin(3);
			list.moveToEnd(5);

			for (var x of list) arr.push(x);

			assert.deepEqual(arr, ['c', 'b', 'g', 'a', 'f', 'd', 'e']);
		});



		it('events should work', function() {
			var   list = new LinkedList()
				, events = ['remove', 'remove', 'pop', 'add', 'push', 'remove', 'shift', 'add', 'unshift', 'add', 'addAfter', 'add', 'addBefore',
							'removeNode', 'removeNode', 'popNode', 'addNode', 'pushNode', 'removeNode', 'shiftNode', 'addNode', 'unshiftNode', 'addNode', 'addAfterNode', 'addNode', 'addBeforeNode']
				, arr = [];

			events.forEach(function(evt) {
				list.on(evt, function(val) {
					var index = events.indexOf(evt);
					events.splice(index, 1);

					if (evt.substr(-4) === 'Node') assert(typeof val === 'object');
					else assert(typeof val === 'string');
				})
			});

			list.push(1, 'a');
			list.unshift(2, 'b');
			list.addAfter(3, 'c', 1);
			list.addBefore(4, 'd', 1);
			list.pop(1);
			list.shift(2);
			list.shift(3);

			assert(events.length === 0);
		});



		it('should emit the drain event correctly', function(done) {
			var list = new LinkedList();

			
			list.on('drain', () => {
				assert(!list.length);
				done();
			});


			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');
			list.push(4, 'd');
			list.push(5, 'e');
			list.push(6, 'f');
			list.push(7, 'g');

			
			for (var i = 0, l = list.length; i < l; i++) list.shift();
		});
	});
