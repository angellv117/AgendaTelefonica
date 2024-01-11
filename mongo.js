const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const password = process.argv[2]

const url =
  `mongodb+srv://Angel117:${password}@cluster0.gzxjaqd.mongodb.net/agenda-app?retryWrites=true&w=majority`

mongoose.connect(url)
//create schema and new note to save

const personShcema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personShcema)

const person = new Person()

if (process.argv.length <= 3) {
  console.log("phonebook:")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
if (process.argv.length >= 4 && process.argv.length <= 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })
  
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })

}


