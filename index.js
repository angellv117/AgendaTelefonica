const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('dist'))
app.use(cors())

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

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

//index
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//all
app.get('/api/info', (request, response) => {
    const fechaActual = new Date();

    const diaSemana = fechaActual.toLocaleString('en-US', { weekday: 'short' });
    const mes = fechaActual.toLocaleString('en-US', { month: 'short' });
    const dia = fechaActual.getDate();
    const anio = fechaActual.getFullYear();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();
    const zonaHoraria = fechaActual.toLocaleString('en-US', { timeZoneName: 'long' });

    
    const formatoFecha = `${diaSemana} ${mes} ${dia} ${anio} ${horas}:${minutos}:${segundos} GMT${fechaActual.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(fechaActual.getTimezoneOffset() / 60)}00 (${zonaHoraria})`;

    info = `<h1>Phonebook has info for ${persons.length}</h1>`+
    `<h3>${formatoFecha}</h3>`
    response.send(info)
})

//info
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//one register id is a number
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const peroson = persons.find(person => person.id === id)
    if (peroson) {
        response.json(peroson)
    } else {
        response.status(404).end()
    }
})

//Delete a register
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//Add a register
const generateId = () => {
    return Math.floor(Math.random() * 10000000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'person already added'
        })
    }

    const person = {
        name: body.name,
        number: body.number || "0000000000",
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})