const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://zahnanni_db_user:${password}@cluster0.aiqtzjd.mongodb.net/PhonebookApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)


if (process.argv.length === 3) {
  console.log("phonebook:")
  Entry.find({}).then(result => {
  result.forEach(entry => {
    console.log(entry.name + " " + entry.number)
  })
  mongoose.connection.close()
})
}

if (process.argv.length === 4) {
  console.log('you have either not provided a name or a number for the entry.')
  process.exit(1)
}

if (process.argv.length === 5) {

    const entry = new Entry({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    entry.save().then(result => {
        console.log(`added ${entry.name} number ${entry.number} to phonebook`)
        mongoose.connection.close()
    })
  
}