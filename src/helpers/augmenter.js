const
    clone = require('clone'),
    extend = require('extend'),
    factory = function (defaults) {
        const
            augment = function (values) {
                return extend(
                    true,
                    clone(defaults),
                    clone(values)
                )
            }

        return augment
    }

module.exports = factory
