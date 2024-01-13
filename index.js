require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

const app = express()
app.use(cors())

//muestra en el diretorio raiz el frontend de la carperta dist
app.use(express.static('dist'))


app.use(express.json())
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            req.method === 'POST' ? JSON.stringify(req.body) : ''
        ].join(' ');
    })
)

const errorHandler = (error, request, response, next) => {
    //console.error(error.message)
    console.log(error.name, error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message})
    }
    next(error)
}



//index
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//Info
app.get('/api/info', (request, response) => {
    const fechaActual = new Date();
    Person.find({}).then(persons => {
        var numContacts = persons.length
        const diaSemana = fechaActual.toLocaleString('en-US', { weekday: 'short' });
        const mes = fechaActual.toLocaleString('en-US', { month: 'short' });
        const dia = fechaActual.getDate();
        const anio = fechaActual.getFullYear();
        const horas = fechaActual.getHours();
        const minutos = fechaActual.getMinutes();
        const segundos = fechaActual.getSeconds();
        const zonaHoraria = fechaActual.toLocaleString('en-US', { timeZoneName: 'long' });


        const formatoFecha = `${diaSemana} ${mes} ${dia} ${anio} ${horas}:${minutos}:${segundos} GMT${fechaActual.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(fechaActual.getTimezoneOffset() / 60)}00 (${zonaHoraria})`;

        info = `<h1>Phonebook has info for ${numContacts}</h1>` +
            `<h3>${formatoFecha}</h3>`
        response.send(info)
    })


})

//all
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//one register id is a number
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            person ? response.json(person) : response.status(404).end()
        })
        .catch(error => next(error))
})


//update
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

//Delete a register
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletePerson => {
            response.json(deletePerson)
        })
        .catch(error => next(error))
})


//Add a register
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'empty values'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})