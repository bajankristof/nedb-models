const
    factory = function (__class) {
        const
            convert = function (document) {
                if (
                    Array.isArray(document)
                ) {
                    return document.map(convert)
                        .filter(document => document instanceof __class)
                } else if (
                    'object' === typeof document
                    && null !== document
                ) {
                    return new __class(document)
                }

                return document
            }

        return convert
    }

module.exports = factory
