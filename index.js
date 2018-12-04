const { send, json } = require('micro')
const { get, post, put, del, router } = require('microrouter')
const monk = require('monk')
const cors = require('micro-cors')()
const db = require('./dbconfig')

const book = db.get('bookmodels')
db.then(() => {
    console.log('Connected to the server my dude...')
})

// Adding Test Commit
const getHome = async (req,res) => {
    send(res, 200, 'Home Page')
}

// [GET] /book 200[] Get all of the Books
const getBook = async (req, res) => {
    const result = await book.find({}).then( results => ( results ))
    // console.log(res)
    send(res, 200, result)
}

// [GET] /book/name/:name 200[] Get a Book by Name
const getBookByName = async (req, res) => {
    let result = await book.find({}).then(results => (results))
    result = result.filter(book => {
        return book.book_title.replace(/\s/g, "").toLowerCase().includes(req.params.name.toLowerCase())
    })
    if (result){
        send(res, 200, result) 
    }
    else {
        send(res, 404, {})
    }
}

// [POST] /Book 200{} Create a Book { 'name': '', 'genre': [], 'type': [], 'image': '' }
const createBook = async (req, res) => {
    const body = await json(req)
    const result = await book.insert( body ).then(results => (results))
    send(res, 200, result)
}

// [PUT] /Book/id/:id 200{} Update Book { 'name': '', 'genre': [], 'type': [], 'image': '' }
const updateBook = async (req, res) => {
    const body = await json(req)
    const result = await book.update({ "_id": req.params.id }, body ).then(results => (results))
    send(res, 200, result)
}

// [DELETE] /Book/id/:id 200{} Delete a Book
const deleteBook = async (req, res) => {
    const result = await book.remove({ "_id": req.params.id }).then(results => (results))
    send(res, 200, result)
}

// Exports
module.exports = cors (
    router(
        get('/', getHome),
        get('/book', getBook),
        get('/book/name/:name', getBookByName),
        post('/book', createBook),
        put('/book/id/:id', updateBook),
        del('/book/id/:id', deleteBook) 
    )
)