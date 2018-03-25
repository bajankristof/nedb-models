const
    augmenter = require('./helpers/augmenter'),
    converter = require('./helpers/converter'),
    datastore = require('./helpers/datastore'),
    Extension = require('./Extension')

/**
 * @name Model
 */
class Model {
    constructor(values) {
        this.assign(values)
    }

    /**
     * Assign values to the model.
     * 
     * @param  {Object} values
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
     */
    async save() {
        var
            result = this._id
                ? await this.getClass().update(
                    { _id: this._id },
                    this.toPOJO(),
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
     */
    async duplicate() {
        let values = this.toPOJO()
        delete values._id
        return this.getClass().insert(values)
    }

    /**
     * Find models that match a query.
     *
     * @param {Object} query
     * @param {Object} projection
     * @return {Cursor}
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
     *
     * @param {Object} query
     * @param {Object} projection
     * @return {Promise.<static>}
     * @static
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
     *
     * @param {Object} query
     * @return {Promise.<number>}
     * @static
     */
    static async count(query = {}) {
        query = augmenter(this.__defaults.query)(query)

        return converter(this)(
            await datastore(this)().count(query)
        )
    }

    /**
     * Insert a document or bulk insert documents.
     *
     * @param {Object|Array} values
     * @return {Promise.<static|Array.<static>>}
     * @static
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
     *
     * @param {Object} query
     * @param {Object} values
     * @param {Object} options
     * @return {Promise.<*>}
     * @static
     */
    static async update(query = {}, values, options) {
        options = augmenter({ multi: true })(options)

        return converter(this)(
            await datastore(this)().update(query, values, options)
        )
    }

    /**
     * Remove models that match a query.
     *
     * @param {Object} query
     * @param {Object} options
     * @return {Promise.<number>}
     * @static
     */
    static async remove(query = {}, options) {
        options = augmenter({ multi: true })(options)

        return converter(this)(
            await datastore(this)().remove(query, options)
        )
    }

    /**
     * Create a model and save it to the database.
     * 
     * @param  {Object|Array.<Object>} values
     * @return {Promise.<static|Array.<static>>}
     * @static
     */
    static async create(values) {
        return await this.insert(values)
    }

    /**
     * Use an extension on the model.
     * 
     * @param  {Function|Array.<Function>} extension
     * @return {boolean}
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

        extension.apply()

        return true
    }
}

// Burn in the default args so that they can be changed.
Model.__proto__.__defaults = {
    query: {},
    projection: {},
    values: {}
}

module.exports = Model
