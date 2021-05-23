const express = require('express')
const mongoose = require('mongoose')

const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(express.json())

app.use('/api/stuff', stuffRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
