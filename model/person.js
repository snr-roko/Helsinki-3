require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
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

module.exports = mongoose.model('Person', personSchema)