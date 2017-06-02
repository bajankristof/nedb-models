const {Datastore} = require('..'),
	Todo = require('./Todo');

class TodoDB extends Datastore {
	constructor(options) {
		super(options);
		this.attachModel(Todo);
	}
}

module.exports = TodoDB;