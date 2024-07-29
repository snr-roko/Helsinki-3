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

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({error: "ID malformatted"})
  } else if(error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((contacts) => {
      response.json(contacts)
    })
})

// Info implemented with database
app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date()
      response.send(`Phonebook has info for ${count} people <br> ${requestTime}`)
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(contact => {
      response.json(contact)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(202).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name) return (
    response.status(400).json({error: "Name can not be ommitted"})
  )
  if(!body.number) return(
    response.status(400).json({error: "Number can not be ommitted"})
  )
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedData => {
      response.json(savedData)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const updatedData = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, updatedData, {new: true})
    .then(updatedData => {
      response.json(updatedData)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})