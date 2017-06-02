# nedb-models
nedb-models is a simple and extensible model wrapper for [nedb](https://www.npmjs.com/package/nedb) using [nedb-promises](https://www.npmjs.com/package/nedb-promises).

## Usage
##### Create your model:
```js
const {Model} = require('nedb-models');

class Todo extends Model {
	static get keys() {
    	return {
        	name: {
	            required: true
            },
            priority: {
            	required: false,
                default: 0
            }
        }
    }
	static get timestamps() {
    	return true;
    }
}
```

##### Create your database:
###### First approach: 
```js
const {Datastore} = require('nedb-models'),
	Todo = require('/path/to/Todo');

let db = new Datastore(...);
db.attachModel(Todo);
//db.find(...).exec(); -> resolves with Todo objects
//db.insert(...); -> insert Todo or plain objects
//etc.
```
###### Second approach:
```js
const {Datastore} = require('nedb-models');

class TodoDB extends Datastore {
	constructor(options) {
    	super(options);
        this.attachModel(Todo);
    }
}

let db = new TodoDB(...);
//db.find(...).exec(); -> resolves with Todo objects
//db.insert(...); -> insert Todo or plain objects
//etc.
```