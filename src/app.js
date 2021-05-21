const express = require('express')
const mongoose = require('mongoose')

const Thing = require('./models/thing')

require('dotenv').config()
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6krpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('Connection to MongoDB Successful !'))
  .catch(() => console.log('Connection to MongoDB Failure !'))

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use('/api/stuff', (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }))
})

app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }))
})

app.post('/api/stuff', (req, res, next) => {
  delete req.body._id
  const thing = new Thing({
    ...req.body,
  })
  thing
    .save()
    .then(() => res.status(201).json({ message: 'Objet created !' }))
    .catch((error) => res.status(400).json({ error }))
})
module.exports = app
