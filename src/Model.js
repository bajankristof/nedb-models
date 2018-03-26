const
    augmenter = require('./helpers/augmenter'),
    converter = require('./helpers/converter'),
    datastore = require('./helpers/datastore'),
    Extension = require('./Extension')

/**
 * @class
 */
class Model {
    constructor(values) {
        this.assign(values)
    }

    /**
     * Assign values to the model.
     * 
     * @param  {Object} values Key-value pairs to be assigned.
     * @return {undefined}
     */
    assign(values) {
        values = (
            'object' === typeof values
            && null !== values
        ) ? values : {}

        Object.keys(values).forEach(key => {
            this[key] = values[key]
        })
    }

    /**
     * Get the models datastore configuration.
     * For more information visit:
     * https://github.com/louischatriot/nedb#creatingloading-a-database
     * 
     * @return {null|string|Object} The datastore configuration.
     * @static
     */
    static datastore() {
        return null
    }

    /**
     * Get the class in the instance.
     * 
     * @return {Function}
     */
    getClass() {
        return this.constructor
    }

    /**
     * Get a plain object representation of the model.
     * 
     * @return {Object}
     */
    toPOJO() {
        return Object.keys(this).reduce((values, key) => {
            values[key] = this[key]
            return values
        }, {})
    }

    /**
     * Get a JSON string representation of the model.
     * 
     * @return {string}
     */
    toJSON(replacer, space) {
        return JSON.stringify(
            this.toPOJO(),
            replacer,
            space
        )
    }

    /**
     * Save the model to the database.
     * 
     * @return {Promise.<this>}
     * @async
     */
    async save() {
        let
            result = this._id
                ? await this.getClass().update(
                    { _id: this._id },
                    { $set: this.toPOJO() },
                    { returnUpdatedDocs: true }
                )
                : await this.getClass().insert(
                    this.toPOJO()
                )

        this.assign(
            Array.isArray(result)
                ? result[0]
                : result
        )

        return this
    }

    /**
     * Remove the model from the database.
     * 
     * @return {Promise.<number>}
     * @async
     */
    async remove() {
        if ( ! this._id) return 0
        return await this.getClass().remove(
            { _id: this._id },
            { multi: false }
        )
    }

    /**
     * Create a duplicate of the model (in database).
     * 
     * @return {Promise.<static>} The duplicate...
     * @async
     */
    async duplicate() {
        let values = this.toPOJO()
        delete values._id
        return this.getClass().insert(values)
    }

    /**
     * Find models that match a query.
     * https://github.com/louischatriot/nedb#finding-documents
     *
     * **Note**: This is the only method of the Model class
     * that is not an `async function`.
     * That is because of the way the Cursor works.
     * The cool thing about Cursors is that you can `await` their results.
     *
     * @example
     * return await Model.find({ ... }).sort({ ... })
     * @example
     * // to get all models
     * return await Model.find()
     *
     * @param {Object} query 
     * @param {Object} projection
     * @return {Cursor} https://github.com/bajankristof/nedb-promises#find-query--projection--
     * @static
     */
    static find(query = {}, projection) {
        query = augmenter(this.__defaults.query)(query)
        projection = augmenter(this.__defaults.projection)(projection)

        let cursor = datastore(this)().find(query, projection),
            exec = cursor.exec

        cursor.exec = async () => {
            return converter(this)(
                await exec.call(cursor)
            )
        }

        return cursor
    }

    /**
     * Find one model that matches a query.
     * https://github.com/louischatriot/nedb#finding-documents
     *
     * @param {Object} query
     * @param {Object} projection
     * @return {Promise.<static>}
     * @static
     * @async
     */
    static async findOne(query = {}, projection) {
        query = augmenter(this.__defaults.query)(query)
        projection = augmenter(this.__defaults.projection)(projection)

        return converter(this)(
            await datastore(this)().findOne(query, projection)
        )
    }

    /**
     * Count models that match a query.
     * https://github.com/louischatriot/nedb#counting-documents
     *
     * @param {Object} query
     * @return {Promise.<number>}
     * @static
     * @async
     */
    static async count(query = {}) {
        query = augmenter(this.__defaults.query)(query)

        return converter(this)(
            await datastore(this)().count(query)
        )
    }

    /**
     * Insert a document or bulk insert documents.
     * https://github.com/louischatriot/nedb#inserting-documents
     *
     * @param {Object|Object[]} values
     * @return {Promise.<static|static[]>}
     * @static
     * @async
     */
    static async insert(values) {
        let augment = augmenter(this.__defaults.values)

        values = Array.isArray(values)
            ? values.map(augment)
            : augment(values)

        return converter(this)(
            await datastore(this)().insert(values)
        )
    }

    /**
     * Update models that match a query.
     * https://github.com/louischatriot/nedb#updating-documents
     *
     * @param {Object} query
     * @param {Object} values
     * @param {Object} options
     * @return {Promise.<*>}
     * @static
     * @async
     */
    static async update(query = {}, values, options) {
        options = augmenter({ multi: true })(options)

        return converter(this)(
            await datastore(this)().update(query, values, options)
        )
    }

    /**
     * Remove models that match a query.
     * https://github.com/louischatriot/nedb#removing-documents
     *
     * @param {Object} query
     * @param {Object} options
     * @return {Promise.<number>}
     * @static
     * @async
     */
    static async remove(query = {}, options) {
        options = augmenter({ multi: true })(options)

        return converter(this)(
            await datastore(this)().remove(query, options)
        )
    }

    /**
     * Create a model and save it to the database.
     * (An alias to insert...)
     * 
     * @param  {Object|Object[]} values
     * @return {Promise.<static|static[]>}
     * @static
     * @async
     */
    static async create(values) {
        return await this.insert(values)
    }

    /**
     * Use an extension on the model.
     * 
     * @param  {Function|Function[]} extension Extension constructor(s).
     * @return {boolean} true if all extensions were applied successfully.
     * @static
     */
    static use(extension) {
        if (Array.isArray(extension)) {
            return extension.reduce((result, extension) => {
                return result && this.use(extension)
            }, true)
        }

        if ('function' === typeof extension) {
            extension = new extension(this)
        } else {
            return false
        }

        if ( ! extension instanceof Extension) {
            return false
        }

        return extension.apply()
    }
}

// Burn in the default args so that they can be changed.
Model.__proto__.__defaults = {
    query: {},
    projection: {},
    values: {}
}

module.exports = Model
