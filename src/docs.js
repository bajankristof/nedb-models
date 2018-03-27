/**
 * @summary
 * Get a safe object extender from a default object.
 * (Why is it safe?
 * Because it clones both the defaults and the given object,
 * so it doesn't modify them.)
 *
 * @example
 * augmenter({ one: true })({ two: false })
 * // { one: true, two: false }
 *
 * @example
 * augmenter({ one: true })({ one: false, two: false })
 * // { one: false, two: false }
 * 
 * @param  {Object} defaults The defaults to extend.
 * @return {Function}
 */
function augmenter(defaults) {}

/**
 * @summary
 * Get a converter from a model class.
 * 
 * @param  {Function} __class The model class.
 * @return {Function}
 *
 * @example
 * converter(Book)({ title: '...' })
 * // Book { title: '...' }
 *
 * @example
 * converter(Book)([ { title: '...' }, { title: ',,,' } ])
 * // [ Book { title: '...' }, Book { title: ',,,' } ]
 */
function converter(__class) {}

/**
 * @summary
 * Get a datastore instance from a model class.
 * 
 * @param  {Function} __class The model class.
 * @return {Proxy.<Datastore>}
 *
 * @example
 * datastore(Book)()
 * // Proxy.<Datastore> based on Book.datastore()
 */
function datastore(__class) {}