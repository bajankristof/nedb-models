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
     * @example
     * // check out the Timestamps or SoftRemoves extension...
     * // https://github.com/bajankristof/nedb-models/blob/master/src/extensions/Timestamps.js
     * // https://github.com/bajankristof/nedb-models/blob/master/src/extensions/SoftRemoves.js
     * 
     * @return {boolean}
     */
    apply() { return true }

    /**
     * Set a non-static property or method.
     *
     * @example
     * // in apply() { ... }
     * this.set('one', 1)
     * // now the applied model has an instance property 'one' with a value of 1
     *
     * @example
     * // in apply() { ... }
     * this.set('one', function () { return 1 })
     * // now the applied model has an instance method 'one' with a return value of 1
     *
     * @example
     * // in apply() { ... } if you want to override an instance method
     * this.set('save', save => {
     *     return function () {
     *         console.log('we disabled saving')
     *         return this // the model instance
     *     }
     * })
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
     * (Works the same way *extension.set* does...)
     *
     * @example
     * // in apply() { ... } if you want to override a static method
     * // first we need to reference the currently processed class
     * let __class = this.__class
     * this.setStatic('find', find => {
     *     return function (query) {
     *         console.log('we disabled the projection parameter')
     *         return find.call(__class, query)
     *     }
     * })
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
     * @example
     * // in apply() { ... }
     * this.extendDefaults({ query: { removedAt: null }})
     * // now the applied model class' static defaults() return value is 
     * // extended with the above object
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
