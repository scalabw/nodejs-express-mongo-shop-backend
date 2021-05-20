const express = require('express')
const mongoose = require('mongoose')

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

app.get('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: '1',
      title: 'My first objet',
      description: 'first object infos',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: '2',
      title: 'My second objet',
      description: 'second object infos',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ]
  res.status(200).json(stuff)
})

app.post('/api/stuff', (req, res, next) => {
  console.log(req.body)
  res.status(201).json({
    message: 'Objet created !',
  })
})

module.exports = app
