# nedb-models
nedb-models is a simple and extensible model wrapper for [nedb](https://www.npmjs.com/package/nedb) using [nedb-promises](https://www.npmjs.com/package/nedb-promises).

## Table of Contents
[Usage](#usage)

[Model](#model)

[Datastore](#datastore)

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

## Model
### static `Model.keys`

An object containing the keys the model should observe when created. 

##### `key` objects
```js
{
	required: true, //boolean
    default: undefined //any (the default value)
}
```

##### Example:
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
}
```

### static `Model.timestamps`

A boolean value. When set to true, the model instances will automatically have two additional keys: `createdAt` and `updatedAt`. These properties will hold unix timestamp values, and the `updatedAt` property will update when any other property changes. 

##### Example: 
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

let todo = new Todo({ name: 'sleep', priority: 100 });
/*
todo = Todo {
	name: (get/set) 'sleep', 
    priority: (get/set) 100,
    createdAt: 1496524310000,
    updatedAt: 1496524310000
}
*/

setTimeout(() => {
	todo.priority = 0;
    /*
    todo = Todo {
        name: (get/set) 'sleep', 
        priority: (get/set) 0,
        createdAt: 1496524310000,
        updatedAt: 1496524315000
    }
    */
}, 5000);
```

### `Model.exists()`
`return`: True if the model exists. (`Boolean`)

Checks if the Model has an \_id or not. 

### `Model.setProperty(key, value)`
`key`:
The property name. (`String`)

`value`: The property value. (`Any`)

`return`: (`Void`)

Use this if you want to specify a new property for the model. 

If timestamps are active this will create a getter and a setter for your property to update `updatedAt` accordingly.

### `Model.unsetProperty(key)`
`key` The property to unset. (`String`)

`return`: (`Void`)

Use this if you want to unset a property. 

### `Model.isDirty()`

`return`: True if the model is dirty (`Boolean`)

Checks if all required properties are defined or not. 

### `Model.getDirty()`

`return`: The dirty properties. (`String[]`)

Gets all dirty properties of the model. 

### `Model.toString()`

`return`: The stringified model. (`String`)

### `Model.toObject()`

`return`: The plain object representation of the model. (`Object`)

## Datastore

For complete documentation, check out [nedb](https://www.npmjs.com/package/nedb) and [nedb-promises](https://www.npmjs.com/package/nedb-promises). 

The methods below are only additions to the existing functionality. 

### `Datastore.attachModel(model)`

`model`: The model class. (`Model.constructor`)

`return`: (`Void`)

Attaches a model to a datastore instance. 

See [Usage](#usage) for example.

### `Datastore.detachModel()`

`return`: (`Void`)

Detaches the attached model of a datastore instance. 