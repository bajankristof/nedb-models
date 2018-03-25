const
    augmenter = require('./helpers/augmenter')

/**
 * @name Extension
 */
class Extension {
    constructor(__class) {
        this.__class = __class
    }

    /**
     * This is called when the extension
     * applies.
     * 
     * @return {undefined}
     */
    apply() {}

    /**
     * Set a non-static property or method.
     * 
     * @param {string}     key
     * @param {*|Function} value
     * @param {boolean}    fn
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
     * @param  {string} key
     * @param  {*}      value
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
     * @param {string}     key
     * @param {*|Function} value
     * @param {boolean}    fn
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
     * @param  {string} key
     * @param  {*}      value
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
     * of a built-in static method.
     * Eg.: find, findOne, count, etc.
     * 
     * @param  {string} method
     * @param  {Array}  value
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
     * @param  {Object} value
     * @return {this}
     */
    extendQuery(value) {
        return this.extendDefaults('query', value)
    }
}

module.exports = Extension
