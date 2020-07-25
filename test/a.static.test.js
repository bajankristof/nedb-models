const
    Book = require('./Book'),
    { expect } = require('chai')

describe('testing statics', () => {
    describe('single insert', async () => {
        it('should return a model instance', async () => {
            let book = await Book.insert(Book.factory())
            expect(book instanceof Book).to.equal(true)
        })
    })

    describe('bulk insert', async () => {
        it('should return an array of models', async () => {
            let books = await Book.insert(Book.factory(9))
            expect(Array.isArray(books)).to.equal(true)
            expect(books.length).to.equal(9)

            expect(
                books.filter(book => ! (book instanceof Book)).length
            ).to.equal(0)
        })
    })

    describe('find', async () => {
        it('should return an array of models', async () => {
            let books = await Book.find()
            expect(Array.isArray(books)).to.equal(true)
            expect(Number.isSafeInteger(books.length)).to.equal(true)
            expect(books.length > 0).to.equal(true)

            expect(
                books.filter(book => ! (book instanceof Book)).length
            ).to.equal(0)
        })
    })

    describe('findOne', async () => {
        it('should return a model instance', async () => {
            let book = await Book.findOne()
            expect(book instanceof Book).to.equal(true)
        })
    })

    describe('update', async () => {
        it('should return the number of updated models', async () => {
            let book = await Book.findOne(),
                params = [{ _id: book._id }, { $set: { title: Book.factory().title } }]

            expect(await Book.update(...params)).to.equal(1)
        })
    })

    describe('remove', async () => {
        it('should return the number of removed models', async () => {
            expect((await Book.remove()) > 0).to.equal(true)
            expect((await Book.find()).length).to.equal(0)
        })
    })
})
