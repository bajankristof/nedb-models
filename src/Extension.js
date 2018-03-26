const
    augmenter = require('./helpers/augmenter')

/**
 * @class
 */
class Extension {
    constructor(__class) {
        this.__class = __class
    }

    /**
     * This is called when the extension
     * is beind applied.
     * 
     * @return {boolean}
     */
    apply() { return true }

    /**
     * Set a non-static property or method.
     * 
     * @param {string}      key The name of the property or method.
     * @param {*|Function}  value The value to replace it with or a replacer function.
     * @param {boolean}     fn Whether to use the value as a replacer or not.
     * @return {this}
     */
    set(key, value, fn) {
        if (true === fn) {
            value = value.call(
                this,
                this.__class.prototype[key]
            )
        }

        this.__class.prototype[key] = value

        return this
    }

    /**
     * Extend a non-static property.
     * 
     * @param  {string} key The name of the property.
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extend(key, value) {
        this.__class.prototype[key] = augmenter(
            this.__class.prototype[key]
        )(value)

        return this
    }

    /**
     * Set a static property or method.
     * 
     * @param {string}      key The name of the static property or method.
     * @param {*|Function}  value The value to replace it with or a replacer function.
     * @param {boolean}     fn Whether to use the value as a replacer or not.
     * @return {this}
     */
    setStatic(key, value, fn) {
        if (true === fn) {
            value = value.call(
                this,
                this.__class[key]
            )
        }

        this.__class[key] = value

        return this
    }

    /**
     * Extend a static property.
     * 
     * @param  {string} key The name of the static property.
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendStatic(key, value) {
        this.__class[key] = augmenter(
            this.__class[key]
        )(value)

        return this
    }

    /**
     * Extend the default arguments
     * of built-in static methods.
     *
     * **Keys**:
     * `'query'` - used in `Model.find`, `Model.findOne` and `Model.count`
     * `'projection'` - used in `Model.find` and `Model.findOne`
     * `'values'` - used in `Model.insert`
     * 
     * @param  {string} key The possible values are: `'query'`, `'projection'` or `'values'`.
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendDefaults(key, value) {
        this.__class.__defaults[key] = augmenter(
            this.__class.__defaults[key]
        )(value)

        return this
    }

    /**
     * Extend the default query.
     * (The first parameter of find, findOne and count.)
     * 
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendQuery(value) {
        return this.extendDefaults('query', value)
    }
}

module.exports = Extension
