const
    faker = require('faker'),
    { Model, augmenter } = require('..')

class Book extends Model {
    static defaults() {
        return augmenter(
            super.defaults()
        )({
            values: {
                rating: 0
            }
        })
    }

    static datastore() {
        return null
    }

    static factory(n = 1) {
        let generate = function () {
            let color = faker.commerce.color()
            return {
                author: faker.name.findName(),
                title: `If your eyes were ${color}`,
                rating: faker.random.number(5)
            }
        }

        n = n < 1 ? 1 : n

        if (n === 1) return generate()

        let data = []
        for (let i = 0; i < n; i++) {
            data.push(generate())
        }

        return data
    }
}

module.exports = Book
