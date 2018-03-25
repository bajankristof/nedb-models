const
    augmenter = require('../helpers/augmenter'),
    Extension = require('../Extension')

class Timestamps extends Extension {
    apply() {
        let __class = this.__class

        this.setStatic('insert', insert => {
            return async function (values) {
                let createdAt = Date.now(),
                    updatedAt = createdAt

                values = Array.isArray(values)
                    ? values.map(current => augmenter(current)({ createdAt, updatedAt }))
                    : augmenter(values)({ createdAt, updatedAt })

                return await insert.call(__class, values)
            }
        }, true)

        this.setStatic('update', update => {
            return async function (query = {}, values, options) {
                return await update.call(
                    __class,
                    query,
                    augmenter(values)({ $set: { updatedAt: Date.now() } }),
                    options
                )
            }
        }, true)
    }
}

module.exports = Timestamps

