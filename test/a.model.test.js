const {expect} = require('chai'),
	Todo = require('./Todo');

process.env.NODE_ENV = 'production';

describe('Model', () => {
	describe('New Empty Todo', () => {
		let todo = new Todo();

		it('should be non-existant', (done) => {
			expect(todo.exists()).to.equal(false);
			done();
		});

		it('should be dirty', (done) => {
			expect(todo.isDirty()).to.equal(true);
			done();
		});

		it('should have only one dirty property (name)', (done) => {
			expect(todo.getDirty())
				.to.be.an('array')
				.that.has.lengthOf(1)
				.that.does.include('name');
			done();
		});

		it('should have numeric timestamps (createdAt, updatedAt)', (done) => {
			expect(todo.createdAt).to.be.a('number');
			expect(todo.updatedAt).to.be.a('number');
			done();
		});

		it('should have undefined name', (done) => {
			expect(todo.name).to.equal(undefined);
			done();
		});

		it('should have priority of 0', (done) => {
			expect(todo.priority).to.equal(0);
			done();
		});
	});

	describe('Filled Todo (_id: "as7867sas8h87", name: "buy vegetables", priority: 100, createdAt: 1496402370535, updatedAt: 1496402370535)', () => {
		let todo = new Todo({
			_id: 'as7867sas8h87',
			name: 'buy vegetables',
			priority: 100,
			createdAt: 1496402370535,
			updatedAt: 1496402370535
		});

		it('should exist', (done) => {
			expect(todo.exists()).to.equal(true);
			done();
		});

		it('should be clean', (done) => {
			expect(todo.isDirty()).to.equal(false);
			done();
		});

		it('should have no dirty properties', (done) => {
			expect(todo.getDirty())
				.to.be.an('array')
				.that.has.lengthOf(0);
			done();
		});

		it('should have numeric timestamps', (done) => {
			expect(todo.createdAt).to.be.a('number');
			expect(todo.updatedAt).to.be.a('number');
			done();
		});

		it('should have name "buy vegetables"', (done) => {
			expect(todo.name).to.equal('buy vegetables');
			done();
		});

		it('should have priority of 100', (done) => {
			expect(todo.priority).to.equal(100);
			done();
		});

		it('should update when a property changes', (done) => {
			todo.name = 'buy fruits';
			expect(todo.createdAt).to.not.equal(todo.updatedAt);
			done();
		});
	});
});