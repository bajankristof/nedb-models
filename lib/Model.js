const _default = {
	required: false,
	// default: null
};

class Model {
	constructor(values = {}) {
		if (!(values instanceof Object))
			throw new TypeError(`Unexpected ${typeof values}, expected: Object`);

		let self = this.constructor;
		for (let key in values)
			if (key !== 'createdAt' &&
				key !== 'updatedAt')
				this.setProperty(key, values[key]);
			else this[key] = values[key];

		if (!(self.keys instanceof Object))
			return;

		for (let key in self.keys) {
			let desc = Object.assign(_default, self.keys[key]);
			if (desc.required === true &&
				typeof this[key] === 'undefined' &&
				process.env.NODE_ENV !== 'production')
				console.warn(`Required key "${key}" is not defined`);

			if (typeof this[key] !== 'undefined')
				continue;

			this.setProperty(key, desc.default);
		}

		if (!self.timestamps)
			return;

		if (!Number.isSafeInteger(this.createdAt))
			this.createdAt = Date.now();
		if (!Number.isSafeInteger(this.updatedAt))
			this.updatedAt = Date.now();
	}

	exists() {
		return !!this._id;
	}

	setProperty(key, value) {
		let self = this.constructor;

		if (!self.timestamps) {
			this[key] = value;
			return;
		}

		Object.defineProperty(this, key, {
			configurable: true,
			enumerable: true,
			get() {
				return value;
			},
			set(val) {
				this.updatedAt = Date.now();
				value = val;
			}
		})
	}

	unsetProperty(key) {
		delete this[key];
	}

	isDirty() {
		let self = this.constructor;

		for (let key in self.keys) {
			let desc = Object.assign(_default, self.keys[key]);

			if (!desc.required)
				continue;

			if (typeof this[key] === 'undefined' ||
				this[key] === null)
				return true;
		}

		return false;
	}

	getDirty() {
		let self = this.constructor,
			result = [];

		for (let key in self.keys) {
			let desc = Object.assign(_default, self.keys[key]);

			if (!desc.required)
				continue;

			if (typeof this[key] === 'undefined' ||
				this[key] === null)
				result.push(key);
		}

		return result;
	}

	toObject() {
		let result = {};

		for (let key in this)
			result[key] = this[key];

		return result;
	}

	toString() {
		return JSON.stringify(this.toObject());
	}

	static get keys() {
		return {};
	}

	static get timestamps() {
		return false;
	}
}

module.exports = Model;