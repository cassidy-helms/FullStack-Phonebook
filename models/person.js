const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

//const password = process.argv[2]

//const url = `mongodb+srv://fullstack:${password}@phonebook.a8r0tkk.mongodb.net/phonebook`

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

//mongoose.connect(url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to mongodb')
    })
    .catch(error => {
        console.log('error connecting to mongodb:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)