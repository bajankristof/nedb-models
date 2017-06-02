const OriginalDatastore = require('nedb-promises'),
	Cursor = require('nedb-promises/lib/Cursor');

class Datastore extends OriginalDatastore {
	constructor(options) {
		super(options);

		Object.defineProperty(this, '__model', {
			enumerable: false,
			writable: true,
			value: null
		});
	}

	find(query, projection) {
		let cursor = super.find(query, projection);
		if (!this.__model)
			return cursor;

		Object.defineProperty(cursor, 'exec', {
			configurable: false,
			enumerable: false,
			writable: false,
			value: () => {
				return Cursor.prototype.exec.apply(cursor)
					.then((docs) => {
						var result = [];
						for (let doc of docs)
							result.push(new this.__model(doc));
						return result;
					});
			}
		});

		return cursor;
	}

	findOne(query, projection) {
		if (!this.__model)
			return super.findOne(query, projection);

		return super.findOne(query, projection)
			.then((result) => {
				return new this.__model(result);
			});
	}

	attachModel(model) {
		if (typeof model !== 'function')
			throw new TypeError(`Unexpected ${typeof model}, expected: constructable`);
		this.__model = model;
	}

	detachModel() {
		this.__model = null;
	}
}

module.exports = Datastore;