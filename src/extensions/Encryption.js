const
    Extension = require('../Extension'),
    augmenter = require('../helpers/augmenter'),
    encrypter = require('../helpers/encrypter'),
    decrypter = require('../helpers/decrypter'),
    algorithm = 'aes256'

/**
 * @summary
 * Use this extension to encrypt your
 * model's database file.
 *
 * This extension requires your model class
 * to have a static `encryption` method that should
 * either return a `string` (in this case this will be 
 * used as the password for the encryption and the 
 * algorithm will be `aes256`) or an `object` (that 
 * must have a `password` property, also in this 
 * case you can specify the encryption algorithm
 * by providing an `algorithm` property too).
 *
 * Be aware that if you already have a database
 * that has been created before applying the Encryption
 * extension you might get the below error:
 * ```
 * Error: More than 10% of the data file is corrupt, 
 * the wrong beforeDeserialization hook may be used. 
 * Cautiously refusing to start NeDB to prevent dataloss.
 * ```
 *
 * **Example**
 * ```js
 * const { Model, Encryption } = require('nedb-models')
 * 
 * class User extends Model {
 *     static encryption() {
 *         return 'password'
 *     }
 * }
 * 
 * User.use(Encryption)
 * ```
 *
 * **Example**
 * ```js
 * const { Model, Encryption } = require('nedb-models')
 * 
 * class User extends Model {
 *     static encryption() {
 *         return {
 *             password: 'password',
 *             algorithm: 'aes192'
 *         }
 *     }
 * }
 * 
 * User.use(Encryption)
 * ```
 */
class Encryption extends Extension {
    apply() {
        let __class = this.__class

        this.setStatic('datastore', datastore => {
            return function () {
                if ('function' !== typeof __class.encryption) {
                    throw new Error('encryption method not defined in model class')
                }

                let
                    options = datastore.call(__class),
                    encryption = __class.encryption.call(__class),
                    beforeDeserialization = data => data,
                    afterSerialization = data => data,
                    encrypt,
                    decrypt

                if ('string' === encryption) {
                    encryption = { password: encryption, algorithm }
                } else if ('object' === typeof encryption) {
                    encryption = augmenter({ algorithm })(encryption)
                } else {
                    throw new TypeError('encryption method should return a string or an object')
                }

                encrypt = encrypter(encryption.algorithm, encryption.password)
                decrypt = decrypter(encryption.algorithm, encryption.password)

                if ('string' === typeof options) {
                    options = { filename: options }
                }

                if ('object' === typeof options) {
                    if (options.hasOwnProperty('beforeDeserialization')) {
                        beforeDeserialization = options.beforeDeserialization
                    }

                    if (options.hasOwnProperty('afterSerialization')) {
                        afterSerialization = options.afterSerialization
                    }

                    options.beforeDeserialization = data => {
                        return decrypt(
                            beforeDeserialization(data)
                        )
                    }

                    options.afterSerialization = data => {
                        return encrypt(
                            afterSerialization(data)
                        )
                    }
                }

                return options
            }
        }, true)

        return true
    }
}

module.exports = Encryption
