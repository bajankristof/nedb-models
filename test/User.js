const
    faker = require('faker'),
    { Model, Encryption } = require('..')

class User extends Model {
    static datastore() {
        return 'users.db'
    }

    static encryption() {
        return {
            algorithm: 'aes256',
            password: 'very safe password'
        }
    }

    static factory(n = 1) {
        let generate = function () {
            return {
                username: faker.internet.userName(),
                password: faker.internet.password()
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

User.use(Encryption)

module.exports = User
