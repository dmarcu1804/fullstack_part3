const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())
morgan.token('person', (request) => {
    if(request.method === 'POST'){
        return JSON.stringify(request.body)
    }

    return "";
})

const customFormat = ':method :url :status :res[content-length] - :response-time ms :person'
app.use(morgan(customFormat))

app.use(express.static('dist'))

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": "5",
        "name": "testing", 
        "number": "3333"
      }
]

app.get('/', (request, response) => {
    response.send('<h1>hello</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).send("The ID entered does not exist").end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => {
        //console.log(person.id !== id)
        return person.id !== id
    })

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.random() * 100
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const existingName = persons.find(person => person.name === body.name)
    if(existingName){
        return response.status(400).json({
            error: "name is already in the phonebook"
        })
    }

    const personObject = {
        name : body.name,
        number : body.number,
        id: id.toString(),
    }

    persons = persons.concat(personObject)
    response.json(personObject)
})

app.get('/info', (request, response) => {
    response.send(`<p> This Page has info for ${persons.length} people </p> <br/> ${new Date()}`)
})
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})