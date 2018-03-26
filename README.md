# nedb-models
`nedb-models` is a simple and extensible model wrapper for [nedb](https://www.npmjs.com/package/nedb) using [nedb-promises](https://www.npmjs.com/package/nedb-promises).

Check out the [docs](https://github.com/bajankristof/nedb-models/blob/master/docs.md)!

## Installation
```bash
npm install nedb-models
```

## Usage
### Basics
```js
const { Model } = require('nedb-models')

class Book extends Model {
	static datastore() {
      	return {
        	filename: 'books.db'
        }
            
        // same as
        // return 'books.db'
    }
    
    async sell() {
        this.soldAt = Date.now()
        return await this.save()
    } 
}

Book.find()
// [ Book { ... }, Book { ... } ]

// find the first book
let book = Book.findOne()
// Book { ... }

// sell it
book.sell().then(book => {
	// Book { soldAt: XXXXXX, ... }
})
```

### Extensions
`nedb-models` includes two extensions that you can use right out of the box:
- [Timestamps](https://github.com/bajankristof/nedb-models/blob/master/docs.md#Timestamps)
- [SoftRemoves](https://github.com/bajankristof/nedb-models/blob/master/docs.md#SoftRemoves)

To implement them in your model, all you have to do is:
```js
const { Model, Timestamps, SoftDeletes } = require('nedb-models')

class Book extends Model {
	...
}

Book.use(SoftDeletes)
// or Book.use([Timestamps, SoftDeletes])
// or Book.use(Timestamps)

// now that your model is using SoftDeletes, 
// you can do funky stuff like:
Book.findRemoved()
Book.forceRemove({ ... })
Book.restore({ ... })
```

Check out the [docs](https://github.com/bajankristof/nedb-models/blob/master/docs.md)!