## Classes

<dl>
<dt><a href="#Extension">Extension</a></dt>
<dd></dd>
<dt><a href="#Model">Model</a></dt>
<dd></dd>
<dt><a href="#Encryption">Encryption</a></dt>
<dd></dd>
<dt><a href="#SoftRemoves">SoftRemoves</a></dt>
<dd></dd>
<dt><a href="#Timestamps">Timestamps</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#augmenter">augmenter(defaults)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#converter">converter(__class)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#datastore">datastore(__class)</a> ⇒ <code>Proxy.&lt;Datastore&gt;</code></dt>
<dd></dd>
<dt><a href="#encrypter">encrypter(algorithm, password)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#decrypter">decrypter(algorithm, password)</a> ⇒ <code>function</code></dt>
<dd></dd>
</dl>

<a name="Extension"></a>

## Extension
**Kind**: global class  

* [Extension](#Extension)
    * [.apply()](#Extension+apply) ⇒ <code>boolean</code>
    * [.set(key, value, fn)](#Extension+set) ⇒ <code>this</code>
    * [.extend(key, value)](#Extension+extend) ⇒ <code>this</code>
    * [.setStatic(key, value, fn)](#Extension+setStatic) ⇒ <code>this</code>
    * [.extendStatic(key, value)](#Extension+extendStatic) ⇒ <code>this</code>
    * [.extendDefaults(value)](#Extension+extendDefaults) ⇒ <code>this</code>
    * [.extendQuery(value)](#Extension+extendQuery) ⇒ <code>this</code>
    * [.extendProjection(value)](#Extension+extendProjection) ⇒ <code>this</code>
    * [.extendValues(value)](#Extension+extendValues) ⇒ <code>this</code>

<a name="Extension+apply"></a>

### extension.apply() ⇒ <code>boolean</code>
This is called when the extension
is beind applied.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Example**  
```js
// check out the Timestamps or SoftRemoves extension...
// https://github.com/bajankristof/nedb-models/blob/master/src/extensions/Timestamps.js
// https://github.com/bajankristof/nedb-models/blob/master/src/extensions/SoftRemoves.js
```
<a name="Extension+set"></a>

### extension.set(key, value, fn) ⇒ <code>this</code>
Set a non-static property or method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>key</td><td><code>string</code></td><td><p>The name of the property or method.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>*</code> | <code>function</code></td><td><p>The value to replace it with or a replacer function.</p>
</td>
    </tr><tr>
    <td>fn</td><td><code>boolean</code></td><td><p>Whether to use the value as a replacer or not.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// in apply() { ... }
this.set('one', 1)
// now the applied model has an instance property 'one' with a value of 1
```
**Example**  
```js
// in apply() { ... }
this.set('one', function () { return 1 })
// now the applied model has an instance method 'one' with a return value of 1
```
**Example**  
```js
// in apply() { ... } if you want to override an instance method
this.set('save', save => {
    return function () {
        console.log('we disabled saving')
        return this // the model instance
    }
})
```
<a name="Extension+extend"></a>

### extension.extend(key, value) ⇒ <code>this</code>
Extend a non-static property.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>key</td><td><code>string</code></td><td><p>The name of the property.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

<a name="Extension+setStatic"></a>

### extension.setStatic(key, value, fn) ⇒ <code>this</code>
Set a static property or method.
(Works the same way *extension.set* does...)

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>key</td><td><code>string</code></td><td><p>The name of the static property or method.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>*</code> | <code>function</code></td><td><p>The value to replace it with or a replacer function.</p>
</td>
    </tr><tr>
    <td>fn</td><td><code>boolean</code></td><td><p>Whether to use the value as a replacer or not.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// in apply() { ... } if you want to override a static method
// first we need to reference the currently processed class
let __class = this.__class
this.setStatic('find', find => {
    return function (query) {
        console.log('we disabled the projection parameter')
        return find.call(__class, query)
    }
})
```
<a name="Extension+extendStatic"></a>

### extension.extendStatic(key, value) ⇒ <code>this</code>
Extend a static property.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>key</td><td><code>string</code></td><td><p>The name of the static property.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

<a name="Extension+extendDefaults"></a>

### extension.extendDefaults(value) ⇒ <code>this</code>
Extend the value returned by the `defaults`
static method of the model.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// in apply() { ... }
this.extendDefaults({ query: { removedAt: null }})
// now the applied model class' static defaults() return value is 
// extended with the above object
```
<a name="Extension+extendQuery"></a>

### extension.extendQuery(value) ⇒ <code>this</code>
Extend the default query.
(Model.defaults().query)

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

<a name="Extension+extendProjection"></a>

### extension.extendProjection(value) ⇒ <code>this</code>
Extend the default projection.
(Model.defaults().projection)

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

<a name="Extension+extendValues"></a>

### extension.extendValues(value) ⇒ <code>this</code>
Extend the default values.
(Model.defaults().values)

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>Object</code></td><td><p>The value to extend it with.</p>
</td>
    </tr>  </tbody>
</table>

<a name="Model"></a>

## Model
**Kind**: global class  

* [Model](#Model)
    * _instance_
        * [.assign(values)](#Model+assign) ⇒ <code>undefined</code>
        * [.getClass()](#Model+getClass) ⇒ <code>function</code>
        * [.toPOJO()](#Model+toPOJO) ⇒ <code>Object</code>
        * [.toJSON()](#Model+toJSON) ⇒ <code>string</code>
        * [.save()](#Model+save) ⇒ <code>Promise.&lt;this&gt;</code>
        * [.remove()](#Model+remove) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.duplicate()](#Model+duplicate) ⇒ <code>Promise.&lt;static&gt;</code>
    * _static_
        * [.datastore()](#Model.datastore) ⇒ <code>null</code> \| <code>string</code> \| <code>Object</code> \| <code>Datastore</code>
        * [.defaults()](#Model.defaults) ⇒ <code>Object</code>
        * [.find(query, projection)](#Model.find) ⇒ <code>Cursor</code>
        * [.findOne(query, projection)](#Model.findOne) ⇒ <code>Promise.&lt;static&gt;</code>
        * [.count(query)](#Model.count) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.insert(values)](#Model.insert) ⇒ <code>Promise.&lt;(static\|Array.&lt;static&gt;)&gt;</code>
        * [.update(query, values, options)](#Model.update) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.remove(query, options)](#Model.remove) ⇒ <code>Promise.&lt;number&gt;</code>
        * [.create(values)](#Model.create) ⇒ <code>Promise.&lt;(static\|Array.&lt;static&gt;)&gt;</code>
        * [.ensureIndex(options)](#Model.ensureIndex) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.removeIndex(field)](#Model.removeIndex) ⇒ <code>Promise.&lt;undefined&gt;</code>
        * [.use(extension)](#Model.use) ⇒ <code>boolean</code>
        * [.addListener()](#Model.addListener)
        * [.emit()](#Model.emit)
        * [.eventNames()](#Model.eventNames)
        * [.getMaxListeners()](#Model.getMaxListeners)
        * [.listenerCount()](#Model.listenerCount)
        * [.listeners()](#Model.listeners)
        * [.on()](#Model.on)
        * [.once()](#Model.once)
        * [.prependListener()](#Model.prependListener)
        * [.prependOnceListener()](#Model.prependOnceListener)
        * [.removeAllListeners()](#Model.removeAllListeners)
        * [.removeListener()](#Model.removeListener)
        * [.setMaxListeners()](#Model.setMaxListeners)
        * [.rawListeners()](#Model.rawListeners)

<a name="Model+assign"></a>

### model.assign(values) ⇒ <code>undefined</code>
Assign values to the model.

**Kind**: instance method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Object</code></td><td><p>Key-value pairs to be assigned.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
let book = await Book.findOne()
// Book { _id: 'XXX', title: '...' }
book.assign({ title: ',,,', one: 1 })
// now book is Book { _id: 'XXX', title: ',,,', one: 1 }
```
<a name="Model+getClass"></a>

### model.getClass() ⇒ <code>function</code>
Get the class in the instance.

**Kind**: instance method of [<code>Model</code>](#Model)  
<a name="Model+toPOJO"></a>

### model.toPOJO() ⇒ <code>Object</code>
Get a plain object representation of the model.

**Kind**: instance method of [<code>Model</code>](#Model)  
<a name="Model+toJSON"></a>

### model.toJSON() ⇒ <code>string</code>
Get a JSON string representation of the model.

**Kind**: instance method of [<code>Model</code>](#Model)  
<a name="Model+save"></a>

### model.save() ⇒ <code>Promise.&lt;this&gt;</code>
Save the model to the database.

**Kind**: instance method of [<code>Model</code>](#Model)  
**Example**  
```js
let book = new Book()
book.title = '...'
// now book is Book { title: '...' }
await book.save()
// now book is Book { _id: 'XXX', title: '...'}
```
<a name="Model+remove"></a>

### model.remove() ⇒ <code>Promise.&lt;number&gt;</code>
Remove the model from the database.

**Kind**: instance method of [<code>Model</code>](#Model)  
**Example**  
```js
let book = await Book.findOne()
await book.remove()
// now book is not persisted in the database
```
<a name="Model+duplicate"></a>

### model.duplicate() ⇒ <code>Promise.&lt;static&gt;</code>
Create a duplicate of the model (in database).

**Kind**: instance method of [<code>Model</code>](#Model)  
**Returns**: <code>Promise.&lt;static&gt;</code> - The duplicate...  
**Example**  
```js
let book = await Book.findOne()
// Book { _id: 'XXX', title: '...' }
let duplicate = await book.duplicate()
// Book { _id: 'YYY', title: '...' }
```
<a name="Model.datastore"></a>

### Model.datastore() ⇒ <code>null</code> \| <code>string</code> \| <code>Object</code> \| <code>Datastore</code>
Get the datastore configuration of the model.
For more information visit:
https://github.com/louischatriot/nedb#creatingloading-a-database

**Kind**: static method of [<code>Model</code>](#Model)  
**Returns**: <code>null</code> \| <code>string</code> \| <code>Object</code> \| <code>Datastore</code> - The datastore configuration or a [nedb-promises](https://www.npmjs.com/package/nedb-promises) datastore instance.  
**Example**  
```js
return {
    inMemoryOnly: true,
    timestampData: true
}
```
**Example**  
```js
const Datastore = require('nedb-promises')
return Datastore.create('filename.db')
```
<a name="Model.defaults"></a>

### Model.defaults() ⇒ <code>Object</code>
Get the defaults of the model.

**Note**:

The returned object **has** to contain at least
three objects:
- `query` - used in `Model.find`, `Model.findOne` and `Model.count`
- `projection` - used in `Model.find` and `Model.findOne`
- `values` - used in `Model.insert`

It's good practice **not** to return a
completely new value, but to return an
extended one based on the parent's defaults.

**Kind**: static method of [<code>Model</code>](#Model)  
**Example**  
```js
return extend(true, super.defaults(), { ... })
```
<a name="Model.find"></a>

### Model.find(query, projection) ⇒ <code>Cursor</code>
Find models that match a query.
https://github.com/louischatriot/nedb#finding-documents

**Note**: This is the only method of the Model class
that is not an `async function`.
That is because of the way the Cursor works.
The cool thing about Cursors is that you can `await` their results.

**Kind**: static method of [<code>Model</code>](#Model)  
**Returns**: <code>Cursor</code> - https://github.com/bajankristof/nedb-promises#find-query--projection--  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>projection</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
return await Book.find({ ... }).sort({ ... })
```
**Example**  
```js
// to get all books
return await Book.find()
```
<a name="Model.findOne"></a>

### Model.findOne(query, projection) ⇒ <code>Promise.&lt;static&gt;</code>
Find one model that matches a query.
https://github.com/louischatriot/nedb#finding-documents

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>projection</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Model.count"></a>

### Model.count(query) ⇒ <code>Promise.&lt;number&gt;</code>
Count models that match a query.
https://github.com/louischatriot/nedb#counting-documents

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Model.insert"></a>

### Model.insert(values) ⇒ <code>Promise.&lt;(static\|Array.&lt;static&gt;)&gt;</code>
Insert a document or bulk insert documents.
Returns the inserted documents in model format.
https://github.com/louischatriot/nedb#inserting-documents

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Object</code> | <code>Array.&lt;Object&gt;</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
await Book.insert({ title: '...' })
// Book { _id: 'XXX', title: '...' }
```
**Example**  
```js
await Book.insert([ { title: '...' }, { title: ',,,' } ])
// [ Book { _id: 'XXX', title: '...' }, Book { _id: 'YYY', title: ',,,' } ]
```
<a name="Model.update"></a>

### Model.update(query, values, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Update models that match a query.
https://github.com/louischatriot/nedb#updating-documents
By default it returns the number of updated documents.

You can set options.returnUpdatedDocs to true to get the updated
documents as models.

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>values</td><td><code>Object</code></td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
await Book.update({ ... }, { $set: { ... } })
// 1
```
<a name="Model.remove"></a>

### Model.remove(query, options) ⇒ <code>Promise.&lt;number&gt;</code>
Remove models that match a query.
https://github.com/louischatriot/nedb#removing-documents
By default removing multiple documents is enabled.
Set options.multi to false to disable it.

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>Object</code></td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
await Book.remove({ ... })
// 5
```
<a name="Model.create"></a>

### Model.create(values) ⇒ <code>Promise.&lt;(static\|Array.&lt;static&gt;)&gt;</code>
Create a model and save it to the database.
(An alias to insert...)

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Object</code> | <code>Array.&lt;Object&gt;</code></td>
    </tr>  </tbody>
</table>

<a name="Model.ensureIndex"></a>

### Model.ensureIndex(options) ⇒ <code>Promise.&lt;undefined&gt;</code>
Creates an index for a given field name.
https://github.com/louischatriot/nedb#indexing

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="Model.removeIndex"></a>

### Model.removeIndex(field) ⇒ <code>Promise.&lt;undefined&gt;</code>
Removes the index for a given field name.
https://github.com/louischatriot/nedb#indexing

**Kind**: static method of [<code>Model</code>](#Model)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>field</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Model.use"></a>

### Model.use(extension) ⇒ <code>boolean</code>
Use an extension on the model.

**Kind**: static method of [<code>Model</code>](#Model)  
**Returns**: <code>boolean</code> - true if all extensions were applied successfully.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>extension</td><td><code>function</code> | <code>Array.&lt;function()&gt;</code></td><td><p>Extension constructor(s).</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Book.use(SoftRemoves)
```
<a name="Model.addListener"></a>

### Model.addListener()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.emit"></a>

### Model.emit()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.eventNames"></a>

### Model.eventNames()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.getMaxListeners"></a>

### Model.getMaxListeners()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.listenerCount"></a>

### Model.listenerCount()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.listeners"></a>

### Model.listeners()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.on"></a>

### Model.on()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.once"></a>

### Model.once()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.prependListener"></a>

### Model.prependListener()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.prependOnceListener"></a>

### Model.prependOnceListener()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.removeAllListeners"></a>

### Model.removeAllListeners()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.removeListener"></a>

### Model.removeListener()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.setMaxListeners"></a>

### Model.setMaxListeners()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Model.rawListeners"></a>

### Model.rawListeners()
Derived from EventEmitter...

https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

https://github.com/bajankristof/nedb-promises/blob/master/docs.md#Datastore

**Kind**: static method of [<code>Model</code>](#Model)  
<a name="Encryption"></a>

## Encryption
**Kind**: global class  
**Summary**: Use this extension to encrypt your
model's database file.

This extension requires your model class
to have a static `encryption` method that should
either return a `string` (in this case this will be 
used as the password for the encryption and the 
algorithm will be `aes256`) or an `object` (that 
must have a `password` property, also in this 
case you can specify the encryption algorithm
by providing an `algorithm` property too).

Be aware that if you already have a database
that has been created before applying the Encryption
extension you might get the below error:
```
Error: More than 10% of the data file is corrupt, 
the wrong beforeDeserialization hook may be used. 
Cautiously refusing to start NeDB to prevent dataloss.
```

**Example**
```js
const { Model, Encryption } = require('nedb-models')

class User extends Model {
    static encryption() {
        return 'password'
    }
}

User.use(Encryption)
```

**Example**
```js
const { Model, Encryption } = require('nedb-models')

class User extends Model {
    static encryption() {
        return {
            password: 'password',
            algorithm: 'aes192'
        }
    }
}

User.use(Encryption)
```  
<a name="SoftRemoves"></a>

## SoftRemoves
**Kind**: global class  
**Summary**: Use this extension to setup soft removal
functionality for your model.

The extension sets up:
- `removedAt` property on your inserted models with a default value of `null`
- `forceRemove` async instance method (replaces the original `remove` method)
- `forceRemove` async static method (replaces the original `remove` method)
- `remove` async instance method just updates the `removedAt` property with the current timestamp
- `remove` async static method just updates the `removedAt` property with the current timestamp
- `find`, `findOne` and `count` automatically exclude models that have a non null removedAt property
- `findRemoved` async static method to query removed models
- `restore` async instance method to restore a removed model
- `restore` async static method to restore models  
<a name="Timestamps"></a>

## Timestamps
**Kind**: global class  
**Summary**: Use this extension to add `createdAt` and `removedAt`
timestamps to your models automatically.

This extension sets up:
- `createdAt` and `updatedAt` timestamps on insert
- updates `updatedAt` automatically on update

It uses nedb's timestampData option to achieve this.
To learn more visit: https://github.com/louischatriot/nedb#creatingloading-a-database  
<a name="augmenter"></a>

## augmenter(defaults) ⇒ <code>function</code>
**Kind**: global function  
**Summary**: Get a safe object extender from a default object.
(Why is it safe?
Because it clones both the defaults and the given object,
so it doesn't modify them.)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>defaults</td><td><code>Object</code></td><td><p>The defaults to extend.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
augmenter({ one: true })({ two: false })
// { one: true, two: false }
```
**Example**  
```js
augmenter({ one: true })({ one: false, two: false })
// { one: false, two: false }
```
<a name="converter"></a>

## converter(__class) ⇒ <code>function</code>
**Kind**: global function  
**Summary**: Get a converter from a model class.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>__class</td><td><code>function</code></td><td><p>The model class.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
converter(Book)({ title: '...' })
// Book { title: '...' }
```
**Example**  
```js
converter(Book)([ { title: '...' }, { title: ',,,' } ])
// [ Book { title: '...' }, Book { title: ',,,' } ]
```
<a name="datastore"></a>

## datastore(__class) ⇒ <code>Proxy.&lt;Datastore&gt;</code>
**Kind**: global function  
**Summary**: Get a datastore instance from a model class.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>__class</td><td><code>function</code></td><td><p>The model class.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
datastore(Book)()
// Proxy.<Datastore> based on Book.datastore()
```
<a name="encrypter"></a>

## encrypter(algorithm, password) ⇒ <code>function</code>
**Kind**: global function  
**Summary**: Get a simple encrypt function.
(crypto.createCipher)

This helper is used by the `Encryption` extension.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>algorithm</td><td><code>string</code></td><td><p>An OpenSSL algorithm (eg.: aes256).</p>
</td>
    </tr><tr>
    <td>password</td><td><code>string</code></td><td><p>The password to encrypt the data with.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
const encrypt = encrypter('aes256', 'password')
encrypt('hello')
// 54f505e1106e9ffc22cd64705c3819d4
```
<a name="decrypter"></a>

## decrypter(algorithm, password) ⇒ <code>function</code>
**Kind**: global function  
**Summary**: Get a simple decrypt function.
(crypto.createDecipher)

This helper is used by the `Encryption` extension.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>algorithm</td><td><code>string</code></td><td><p>An OpenSSL algorithm (eg.: aes256).</p>
</td>
    </tr><tr>
    <td>password</td><td><code>string</code></td><td><p>The password to decrypt the data with.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
const decrypt = decrypter('aes256', 'password')
decrypt('54f505e1106e9ffc22cd64705c3819d4')
// hello
```
