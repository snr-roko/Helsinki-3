const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log("Add password to see all documents or Add password, name, and number to add new contact to database")
  process.exit(1)
}

if(process.argv.length > 5) {
  console.log("You have succeeded the number of arguments. Try again. Note: Name with whitespace should be in quotes.")
  process.exit(1)
}

if(process.argv.length === 4) {
  console.log("Add a number Please")
  process.exit(1)
}

const password = process.argv[2]

mongoose.connect(`mongodb+srv://snr-roko:${password}@helsinki-notes.fnqrxsa.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=helsinki-notes`)
  .then(result => {
    console.log("Database Server connected successfully")
  })
  .catch(error => {
    console.log("Database Server connection unsuccessful, Please Check Logins")
    process.exit(1)
  })


mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  Person.find({})
    .then(people => {
      console.log("Phonebook:")
      people.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
        .then(() => process.exit(0))
    })
}

if(process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save()
    .then(savedData => {
      console.log(`added ${savedData.name} number ${savedData.number} to phonebook`)
      mongoose.connection.close()
        .then(() => process.exit(0))
    })
}


