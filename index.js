require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./model/person')
const app = express()

app.use(express.static('./dist'))
app.use(cors())

app.use(express.json())

// creating a morgan token
morgan.token('post-data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : 'N/A')

const morgan_custom = ':method :url :res[content-length] - :response-time ms :post-data'

app.use(morgan(morgan_custom))

let persons = [
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
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((contacts) => {
      response.json(contacts)
    })
})

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date()
      response.send(`Phonebook has info for ${count} people <br> ${requestTime}`)
    })
  })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(contact => {
      response.json(contact)
    })
    .catch(error => {
      response.status(400).send({error: "ID request not found"})
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name) return (
    response.status(400).json({error: "Name can not be ommitted"})
  )
  if(!body.number) return(
    response.status(400).json({error: "Number can not be ommitted"})
  )
  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }
  if(persons.some(person => person.name === newPerson.name)) return (
    response.status(400).json({error: "Name must be unique"})
  )
  persons = [...persons, newPerson]
  response.json(newPerson)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})