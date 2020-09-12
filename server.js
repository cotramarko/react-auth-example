const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/User')
const Entry = require('./models/Entry')
const withAuth = require('./middleware')
require('dotenv').config()

process.env.PWD = process.cwd()

const app = express()

const secret = 'mysecretsshhh'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

const mongoUri = 'mongodb://localhost/react-auth'
mongoose.connect(process.env.MONGODB_URI || mongoUri, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err
  } else {
    console.log(`Successfully connected to ${mongoUri}`)
  }
})

app.use(express.static(path.normalize(path.join(__dirname, 'public'))));
// app.use('/', express.static(path.join(__dirname, 'build')))

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

app.get('/api/healthcheck', function (req, res) {
  res.send('Hello')
})

/*
app.post('/api/register', function (req, res) {
  const { email, password } = req.body
  const user = new User({ email, password })
  user.save(function (err) {
    if (err) {
      console.log(err)
      res.status(500).send('Error registering new user please try again.')
    } else {
      res.status(200).send('Welcome to the club!')
    }
  })
})
*/

app.post('/api/entry', withAuth, function (req, res) {
  const { date, setMC, setFJ } = req.body
  const entry = new Entry({ date, setMC, setFJ })
  entry.save(function (err) {
    if (err) {
      console.log(err)
      res.status(500).send('Error registering new Entry please try again.')
    } else {
      res.status(200).send('Entry registered')
    }
  })
})

app.post('/api/match', function (req, res) {
  const { date } = req.body
  const entry = new Entry({ date })
  entry.save(function (err, createdEntry) {
    if (err) {
      console.log(err)
      res.status(500).send('Error registering new Entry please try again.')
    } else {
      res.status(200).send({ id: createdEntry.id })
    }
  })
})

const saveEntryAndRespond = (en, res) => en.save(function (err, savedEntry) {
  if (err) {
    res.status(500).json({
      error: err
    })
  } else {
    res.status(200).json({
      entry: savedEntry
    })
  }
})

app.delete('/api/match', function (req, res) {
  const { id } = req.body
  Entry.findById(id, function (_err, en) {
    if (!en.locked) {
      en.remove(function (err, savedEntry) {
        if (err) {
          res.status(500).json({
            error: err
          })
        } else {
          res.status(200).json({
            entry: savedEntry
          })
        }
      })
    }
  })
})

app.post('/api/addSet', function (req, res) {
  const { id, set } = req.body
  Entry.findById(id, function (_err, en) {
    console.log(en)
    const matchingIndex = en.sets.findIndex(s => s.setNumber === set.setNumber)

    if (matchingIndex > -1) {
      en.sets[matchingIndex].pointsMC = set.pointsMC
      en.sets[matchingIndex].pointsFJ = set.pointsFJ
    } else {
      en.sets.push(set)
    }
    saveEntryAndRespond(en, res)
  })
})

app.post('/api/setSets', function (req, res) {
  const { id, sets, locked, setMC, setFJ } = req.body
  const setLocked = locked || false
  Entry.findById(id, function (_err, en) {
    console.log(en)
    en.sets = sets
    en.locked = setLocked
    en.setMC = setMC
    en.setFJ = setFJ
    saveEntryAndRespond(en, res)
  })
})

app.post('/api/lockMatch', function (req, res) {
  const { id } = req.body
  Entry.findById(id, function (_err, en) {
    console.log(en)
    en.locked = true
    saveEntryAndRespond(en, res)
  })
})

app.get('/api/entry', function (req, res) {
  Entry.find({}, function (_err, entries) {
    res.send(entries)
  })
})

app.post('/api/authenticate', function (req, res) {
  const { email, password } = req.body
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err)
      res.status(500)
        .json({
          error: 'Internal error please try again'
        })
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        })
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            })
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            })
        } else {
          // Issue token
          const payload = { email }
          const token = jwt.sign(payload, secret, {
            expiresIn: '2h'
          })
          res.cookie('token', token, { httpOnly: true }).sendStatus(200)
        }
      })
    }
  })
})

app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200)
})

const port = process.env.PORT || 8080
app.listen(port)
