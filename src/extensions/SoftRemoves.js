const
    augmenter = require('../helpers/augmenter'),
    Extension = require('../Extension')

class SoftRemoves extends Extension {
    apply() {
        let __class = this.__class,
            update = __class.update,
            hasRemovedAt = query => {
                return query.hasOwnProperty('removedAt')
                    || (query.hasOwnProperty('$not')
                        && query.$not.hasOwnProperty('removedAt'))
            }

        this.extendDefaults('values', { removedAt: null })

        this.set('forceRemove', async function () {
            if ( ! this._id) return 0
            return await this.getClass().forceRemove(
                { _id: this._id },
                { multi: false }
            )
        })

        this.setStatic('find', find => {
            return function (query = {}, projection) {
                query = hasRemovedAt(query)
                    ? query
                    : augmenter({ removedAt: null })(query)

                return find.call(__class, query, projection)
            }
        }, true)

        this.setStatic('findOne', findOne => {
            return async function (query = {}, projection) {
                query = hasRemovedAt(query)
                    ? query
                    : augmenter({ removedAt: null })(query)

                return await findOne.call(__class, query, projection)
            }
        }, true)

        this.setStatic('count', count => {
            return async function (query = {}, projection) {
                query = hasRemovedAt(query)
                    ? query
                    : augmenter({ removedAt: null })(query)

                return await count.call(__class, query)
            }
        }, true)

        this.setStatic('remove', remove => {
            this.setStatic('forceRemove', async function (query = {}, options) {
                return await remove.call(__class, query, options)
            })

            return async function (query = {}, options) {
                let values = { $set: { removedAt: Date.now() } }
                return await update.call(__class, query, values, options)
            }
        }, true)

        this.setStatic('findRemoved', async function (query = {}, projection) {
            query = augmenter(query)({ $not: { removedAt: null } })
            return await __class.find(query, projection)
        })
    }
}

module.exports = SoftRemoves
