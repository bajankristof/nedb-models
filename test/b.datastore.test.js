const {expect} = require('chai'),
	Todo = require('./Todo'),
	TodoDB = require('./TodoDB');

process.env.NODE_ENV = 'production';

describe('Datastore', () => {
	let db = new TodoDB();

	let objects = [
		{ name: 'buy fruits', priority: 10 },
		{ name: 'buy vegetables', priority: 2 },
		{ name: 'pick up the kids at school', priority: 100 }
	];

	let models = [];
	for (let object of objects)
		models.push(new Todo(object));

	describe('Todo Datastore', () => {
		it('should be able to insert Todo (Model) objects', () => {
			return db.insert(models);
		});

		it('should be able to insert Todo (plain) objects', () => {
			return db.insert(objects);
		});

		it('should find all documents as Todo (Model) object', () => {
			return db.find()
				.sort({ priority: 1 }).exec()
				.then((todos) => {
					expect(todos)
						.to.be.an('array')
						.that.has.lengthOf(6);

					for (let todo of todos)
						expect(todo)
							.to.be.an.instanceof(Todo)
							.that.has.all.keys(
								'_id',
								'name',
								'priority',
								'createdAt',
								'updatedAt');
				});
		});
	});
});
