const {Model} = require('..');

class Todo extends Model {
	static get timestamps() {
		return true;
	}

	static get keys() {
		return {
			name: {
				required: true
			},
			priority: {
				default: 0
			}
		}
	}
}

module.exports = Todo;