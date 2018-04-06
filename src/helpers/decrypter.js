const
    crypto = require('crypto'),
    factory = function (algorithm, password) {
        const
            decrypt = function (data) {
                let
                    decipher = crypto.createDecipher(algorithm, password)

                return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
            }

        return decrypt
    }

module.exports = factory
