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

/**
 * @summary
 * Get a simple encrypt function.
 * (crypto.createCipher)
 *
 * This helper is used by the `Encryption` extension.
 * 
 * @param  {string} algorithm An OpenSSL algorithm (eg.: aes256).
 * @param  {string} password  The password to encrypt the data with.
 * @return {Function}
 *
 * @example
 * const encrypt = encrypter('aes256', 'password')
 * encrypt('hello')
 * // 54f505e1106e9ffc22cd64705c3819d4
 */
function encrypter(algorithm, password) {}

/**
 * @summary
 * Get a simple decrypt function.
 * (crypto.createDecipher)
 *
 * This helper is used by the `Encryption` extension.
 * 
 * @param  {string} algorithm An OpenSSL algorithm (eg.: aes256).
 * @param  {string} password  The password to decrypt the data with.
 * @return {Function}
 *
 * @example
 * const decrypt = decrypter('aes256', 'password')
 * decrypt('54f505e1106e9ffc22cd64705c3819d4')
 * // hello
 */
function decrypter(algorithm, password) {}
