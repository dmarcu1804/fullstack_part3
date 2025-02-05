require('dotenv').config()
const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    console.log(process.argv)
    process.exit(1)
}

//const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = process.argv.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: `${personName}`,
    number: `${personNumber}`,
})

if(process.argv.length === 3){
    Person.find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
        mongoose.connection.close()
        })
}
else{
    person.save()
      .then(() => {
        console.log(`added ${personName} number ${personNumber} to phonebook`)
        mongoose.connection.close()
      })
}