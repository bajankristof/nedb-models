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
     * Extend the value returned by the `defaults`
     * static method of the model.
     * 
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendDefaults(value) {
        let __class = this.__class

        this.setStatic('defaults', defaults => {
            return function () {
                return augmenter(
                    defaults.call(__class)
                )(value)
            }
        }, true)

        return this
    }

    /**
     * Extend the default query.
     * (Model.defaults().query)
     * 
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendQuery(value) {
        return this.extendDefaults({ query: value })
    }

    /**
     * Extend the default projection.
     * (Model.defaults().projection)
     * 
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendProjection(value) {
        return this.extendDefaults({ projection: value })
    }

    /**
     * Extend the default values.
     * (Model.defaults().values)
     * 
     * @param  {Object} value The value to extend it with.
     * @return {this}
     */
    extendValues(value) {
        return this.extendDefaults({ values: value })
    }
}

module.exports = Extension
