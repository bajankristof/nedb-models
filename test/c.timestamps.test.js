const
    Book = require('./Book'),
    { Timestamps } = require('..'),
    { expect } = require('chai'),
    sleep = function (duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration)
        })
    }

describe('testing timestamps', () => {
    Book.use(Timestamps)

    describe('insert', async () => {
        it('should have createdAt and updatedAt timestamps', async () => {
            let book = await Book.insert(Book.factory())
            expect(book.hasOwnProperty('createdAt')).to.equal(true)
            expect(book.createdAt instanceof Date).to.equal(true)
            expect(book.hasOwnProperty('updatedAt')).to.equal(true)
            expect(book.updatedAt instanceof Date).to.equal(true)
        })
    })

    describe('update', async () => {
        it('should update updatedAt timestamp', async () => {
            let book = await Book.insert(Book.factory()),
                updatedAt = new Date(book.updatedAt)

            await sleep(1000)

            await book.save()

            expect(book.updatedAt > updatedAt).to.equal(true)
        })
    })
})
