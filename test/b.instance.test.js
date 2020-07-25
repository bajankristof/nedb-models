const
    Book = require('./Book'),
    { expect } = require('chai')

describe('testing instance', () => {
    describe('save', async () => {
        it('should update the _id property', async () => {
            let book = new Book(Book.factory())
            expect('string' === typeof book._id).to.equal(false)
            await book.save()
            expect('string' === typeof book._id).to.equal(true)
        })
    })

    describe('duplicate', async () => {
        it('should duplicate the model', async () => {
            let book = await Book.findOne(),
                duplicate

            expect(book instanceof Book).to.equal(true)

            duplicate = await book.duplicate()

            expect(duplicate instanceof Book).to.equal(true)
            expect(book._id === duplicate._id).to.equal(false)
        })
    })

    describe('remove', async () => {
        it('should remove the model', async () => {
            let book = await Book.findOne()
            await book.remove()
            expect((await Book.find({ _id: book._id })).length).to.equal(0)
        })
    })
})
