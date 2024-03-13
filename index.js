const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

morgan.token('data', function getData(req) {
    return JSON.stringify(req.body)
})

app.use(morgan('tiny', {
    skip: function(req, res) { return req.method === 'POST' }
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: function(req, res) { return req.method !== 'POST' }
}))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const generateId = () => {
    return Math.floor(Math.random() * 100000000)
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const originalPerson = persons.find(person => person.id === id)
    const updatedPerson = { ...originalPerson, number: body.number }
    
    persons = persons.map(person => person.id === id ? updatedPerson : person)

    response.json(updatedPerson);
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    
    const duplicate = persons.find(person => person.name === body.name)
    if(duplicate) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    return response.send(
        `<p>Phonebook has info for ${persons.length} people</p></br>${new Date()}`
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})