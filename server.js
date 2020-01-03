const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Entry = require('./models/Entry')
const withAuth = require('./middleware');
require('dotenv').config();

const app = express();

const secret = 'mysecretsshhh';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_uri = 'mongodb://localhost/react-auth'; // TODO: Replace with production uri
//const mongo_uri = 'mongodb://localhost/badmini'; // TODO: Replace with production uri
mongoose.connect(process.env.MONGODB_URI || mongo_uri, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  console.log(path.join(__dirname, 'public', 'index.html'));
  console.log(process.env.PUBLIC_PATH);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/home', function (req, res) {
  res.send('Welcome!');
});

app.get('/api/secret', withAuth, function (req, res) {
  res.send('The password is potato');
});

app.post('/api/register', function (req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});


app.post('/api/entry', withAuth, function (req, res) {
  const { date, setMC, setFJ } = req.body;
  const entry = new Entry({ date, setMC, setFJ });
  entry.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new Entry please try again.");
    } else {
      res.status(200).send("Entry registered");
    }
  });
});

app.get('/api/entry', function (req, res) {
  Entry.find({}, function (err, entries) {
    res.send(entries)
  });
})

app.post('/api/authenticate', function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});

const port = process.env.PORT || 8080;
app.listen(port);
