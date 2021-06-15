![nedb-models](https://github.com/bajankristof/nedb-models/blob/master/logo.svg "nedb-models")

`nedb-models` is a simple and extensible model wrapper for [nedb](https://www.npmjs.com/package/nedb) using [nedb-promises](https://www.npmjs.com/package/nedb-promises).

Check out the [docs](https://github.com/bajankristof/nedb-models/blob/master/docs.md)!

##### IMPORTANT
**As of `nedb-promises` `5.0.0` [nedb](https://github.com/louischatriot/nedb#readme) package has been replaced with a fork of the original package, [@seald-io/nedb](https://github.com/seald/nedb) to solve some vulnerability issues originating from `nedb`!**

## Contents
- [Installation](#installation)
- [Usage](#usage)
    - [Basics](#basics)
    - [Extensions](#extensions)
- [Creating extensions](#creating-extensions)
- [What's new](#whats-new)
- [What's coming](#whats-coming)

<a name="installation"></a>
## Installation
```bash
npm install nedb-models
```

<a name="usage"></a>
## Usage
<a name="basics"></a>
### Basics
A model class has almost all methods nedb's Datastore
does, like `Model.find()`, `Model.findOne`, etc.

Check out the [docs](https://github.com/bajankristof/nedb-models/blob/master/docs.md)
to see all of them!

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

<a name="extensions"></a>
### Extensions
`nedb-models` includes three extensions that you can use right out of the box:
- [Timestamps](https://github.com/bajankristof/nedb-models/blob/master/docs.md#Timestamps)
- [SoftRemoves](https://github.com/bajankristof/nedb-models/blob/master/docs.md#SoftRemoves)
- [Encryption](https://github.com/bajankristof/nedb-models/blob/master/docs.md#Encryption)

To implement them in your model, all you have to do is:
```js
const { Model, Timestamps, SoftDeletes, Encryption } = require('nedb-models')

class Book extends Model {
    ...
}

Book.use(SoftDeletes)
// or Book.use([Timestamps, SoftDeletes])
// or Book.use(Timestamps)
// or Book.use(Encryption)

// now that your model is using SoftDeletes, 
// you can do funky stuff like:
Book.findRemoved()
Book.forceRemove({ ... })
Book.restore({ ... })
```

<a name="creating-extensions"></a>
## Creating extensions
Let's take a look at how an extension is built:
```js
class Timestamps extends Extension {
    apply() {
        let __class = this.__class

        /**
         * In this case we have to add the `timestampData: true`
         * property to the datastore options.
         *
         * Since the datastore options are returned by a static
         * method we need to overwrite this method while
         * accessing it.
         * This is where tha last parameter of (in this case) `setStatic`
         * comes in handy. If you set this to true, and the second parameter
         * is a function, the module will pass the original value
         * to your function and then override it with the returned value.
         */
        this.setStatic('datastore', datastore => {
            /**
             * Don't use arrow functions when overwriting methods (static or instance),
             * because arrow functions don't handle the context (`this`) well.
             */
            return function () {
                /**
                 * In the new function first we retrieve the original options.
                 * We do that inside the new function to keep the possibility
                 * of dynamic properties.
                 */
                let options = datastore.call(__class)

                /**
                 * We add the property while also checking
                 * the type of the original options.
                 */
                if ( ! options) {
                    options = { timestampData: true }
                } else if ('string' === typeof options) {
                    options = {
                        filename: options,
                        timestampData: true
                    }
                } else if ('object' === typeof options) {
                    options = augmenter(options)({
                        timestampData: true
                    })
                }

                return options
            }
        }, true)

        /**
         * Finally we return true to show that
         * applying the extension was successful.
         */
        return true
    }
}
```

Check out the [docs](https://github.com/bajankristof/nedb-models/blob/master/docs.md)!

<a name="whats-new"></a>
## What's new
`2.2.0`
- [Events](https://github.com/bajankristof/nedb-models/blob/master/docs.md#Model.addListener)
- [Indexing](https://github.com/bajankristof/nedb-models/blob/master/docs.md#Model.ensureIndex)

<a name="whats-coming"></a>
## What's coming
- Tests (for SoftRemoves and Encryption)
