const
    Datastore = require('nedb-promises'),
    factory = function (__class) {
        const
            preserve = function (datastore) {
                Object.defineProperty(__class, '__datastore', {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: datastore
                })
            },
            datastore = function () {
                if (__class.__datastore instanceof Datastore) {
                    return __class.__datastore
                }

                let datastore = __class.datastore()
                if (datastore instanceof Datastore) {
                    preserve(datastore)
                } else {
                    preserve(Datastore.create(datastore))
                }

                return __class.__datastore
            }

        return datastore
    }

module.exports = factory
