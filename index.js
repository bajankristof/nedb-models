const
    augmenter = require('./src/helpers/augmenter'),
    converter = require('./src/helpers/converter'),
    datastore = require('./src/helpers/datastore'),
    Extension = require('./src/Extension'),
    Model = require('./src/Model'),
    SoftRemoves = require('./src/extensions/SoftRemoves'),
    Timestamps = require('./src/extensions/Timestamps')

module.exports = {
    augmenter,
    converter,
    datastore,
    Extension,
    Model,
    SoftRemoves,
    Timestamps
}