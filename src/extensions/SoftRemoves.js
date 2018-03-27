const
    augmenter = require('../helpers/augmenter'),
    Extension = require('../Extension')

/**
 * @summary
 * Use this extension to setup soft removal
 * functionality for your model.
 *
 * The extension sets up:
 * - `removedAt` property on your inserted models with a default value of `null`
 * - `forceRemove` async instance method (replaces the original `remove` method)
 * - `forceRemove` async static method (replaces the original `remove` method)
 * - `remove` async instance method just updates the `removedAt` property with the current timestamp
 * - `remove` async static method just updates the `removedAt` property with the current timestamp
 * - `find`, `findOne` and `count` automatically exclude models that have a non null removedAt property
 * - `findRemoved` async static method to query removed models
 * - `restore` async instance method to restore a removed model
 * - `restore` async static method to restore models
 */
class SoftRemoves extends Extension {
    apply() {
        let __class = this.__class,
            hasRemovedAt = query => {
                return query.hasOwnProperty('removedAt')
                    || (query.hasOwnProperty('$not')
                        && query.$not.hasOwnProperty('removedAt'))
            }

        this.extendValues({ removedAt: null })

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
                let values = { $set: { removedAt: new Date() } }
                return await __class.update(query, values, options)
            }
        }, true)

        this.setStatic('findRemoved', function (query = {}, projection) {
            query = augmenter(query)({ $not: { removedAt: null } })
            return __class.find(query, projection)
        })

        this.setStatic('restore', async function (query = {}) {
            return await __class.update(
                query,
                { $set: { removedAt: null } },
                { returnUpdatedDocs: true }
            )
        })

        this.set('restore', async function () {
            if ( ! this._id) return this
            return (await this.getClass().restore(
                { _id: this._id }
            ))[0]
        })

        return true
    }
}

module.exports = SoftRemoves
