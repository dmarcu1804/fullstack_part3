const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/personDB')

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
    Person.find({})
          .then(persons => {
            response.json(persons)
          })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
          .then(person => {
            response.json(person)
          })
          .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
          .then(result => {
            console.log(result)
            response.status(204).end()
          })
          .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const id = Math.random() * 100
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const personObject = new Person({
        name : body.name,
        number : body.number,
    })

    personObject.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const personNameExists = Person.exists({name: body.name})

  const person = {
    name: body.name,
    number: body.number
  }

  if(personNameExists){
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
  }
}) 

app.get('/info', (request, response) => {
    response.send(`<p> This Page has info for ${persons.length} people </p> <br/> ${new Date()}`)
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})