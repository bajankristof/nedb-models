const
    crypto = require('crypto'),
    factory = function (algorithm, password) {
        const
            encrypt = function (data) {
                let
                    cipher = crypto.createCipher(algorithm, password)

                return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
            }

        return encrypt
    }

module.exports = factory
