const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')

morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['content'](req, res)
  ].join(' ')
}))

require('dotenv').config()

const Entry = require('./models/entry')


app.get('/info', (request, response) => {
  const date = new Date()

  Entry.countDocuments({}).then(
    number_entries => {
      response.send(`Phonebook has info for ${number_entries} people<br>${date}`)
    }
  )

})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body


  const entry = new Entry({
    name : body.name,
    number: body.number
  })

  entry.save()
    .then(savedEntry => {
      response.json(savedEntry)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Entry.findById(request.params.id)
    .then(entry => {
      if (!entry) {
        return response.status(404).end()
      }

      entry.name = name
      entry.number = number

      return entry.save().then((updatedEntry) => {
        response.json(updatedEntry)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})