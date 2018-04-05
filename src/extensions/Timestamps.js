const
    augmenter = require('../helpers/augmenter'),
    Extension = require('../Extension')

/**
 * @summary
 * Use this extension to add `createdAt` and `removedAt`
 * timestamps to your models automatically.
 *
 * This extension sets up:
 * - `createdAt` and `updatedAt` timestamps on insert
 * - updates `updatedAt` automatically on update
 *
 * It uses nedb's timestampData option to achieve this.
 * To learn more visit: https://github.com/louischatriot/nedb#creatingloading-a-database
 */
class Timestamps extends Extension {
    apply() {
        let __class = this.__class

        this.setStatic('datastore', datastore => {
            return function () {
                let options = datastore.call(__class)

                if ( ! options) {
                    options = { timestampData: true }
                } else if ('string' === typeof options) {
                    options = {
                        filename: options,
                        timestampData: true
                    }
                } else if ('object' === typeof options) {
                    options = augmenter(options)({
                        timestampData: true
                    })
                }

                return options
            }
        }, true)

        return true
    }
}

module.exports = Timestamps

