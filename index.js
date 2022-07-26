const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const session = require('express-session')
const app = express()

const cookieParser = require("cookie-parser")

const SECRETKEY = "846846e8a80f1f1b0da92d14b012e2e1"
const PORT = 3000
const maxAge = 60*60*24

const dbUrl = 'mongodb+srv://pythonr:bublogoyrenmekveoyretmekucundur@pythonr.vznn8ny.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err))

const Mesele = require('./models/meseleSchema.js')
const User = require('./models/user.js')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SECRETKEY, resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs')

const createToken = (id) => {
  return jwt.sign({id}, SECRETKEY, {expiresIn: maxAge})
}

app.get('/', (req, res) => {
  res.render('main')
})

app.get('/ekle', async (req, res) => {
  const salt = await bcrypt.genSalt(3);
  let userpass = await bcrypt.hash("salamdostlar", salt);
  let resp = User.create({
    ad: 'aklerza',
    sifre: userpass
  })
  res.send(resp)
})

app.get('/panel', async (req, res) => {
  let token = req.cookies.token
  if (token) {
    let userdata = null
    await jwt.verify(token, SECRETKEY, async (err, decodedToken) => {
      if (err) {
        console.log(err)
      }
      if (decodedToken) {
        id = decodedToken.id
        userdata = await User.findOne({ id })
      }
    })

    if (userdata) {
      req.session.loggedIn = true
      res.render('panel')
    }
  } else {
    res.render('panel-login')
  }
})

app.get('/panel/yaz', async (req, res) => {
  let token = req.cookies.token
    if (token) {
    let userdata = null
    await jwt.verify(token, SECRETKEY, async (err, decodedToken) => {
      if (err) {
        console.log(err)
      }
      if (decodedToken) {
        id = decodedToken.id
        userdata = await User.findOne({ id })
      }
    })

    if (userdata) {
      res.render('panel-yaz')
    }
  } else {
    res.render('panel-login')
  }
})

app.get('/mesele', (req, res) => {
  Mesele.find().sort({ createdAt: -1})
    .then((result) => {
      res.render('meseleler', {data: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/mesele/:id', (req, res) => {
  const id = req.params.id

  Mesele.findById(id)
    .then((result) => {
      res.render('mesele', {data: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/python', (req, res) => {
  res.render('python')
})

app.post('/panel/login', async (req, res) => {
  const {ad, password} = req.body
  const user = await User.findOne({ad: ad})

  if (!user) {
    return res.json({status: 'Error', error:''})
  }

  if (await bcrypt.compare(password, user.sifre)) {
    let token = createToken(user._id)
    res.cookie('token', token,{httpOnly: true, secure: true, maxAge: maxAge * 1000})
    res.redirect('/panel')
  }
})

app.post('/panel/yaz', async (req, res) => {
  const {title, description, solve} = req.body
  let token = req.cookies.token
    if (token) {
    let userdata = null
    await jwt.verify(token, SECRETKEY, async (err, decodedToken) => {
      if (err) {
        console.log(err)
      }
      if (decodedToken) {
        id = decodedToken.id
        userdata = await User.findOne({ id })
      }
    })

    if (userdata) {
      let Yazi =  await Mesele.create({
        title: title,
        description: description,
        solve: solve
      })
      .then((res) => {
        console.log(title + " adlı məsələ səhifəyə dərc edildi.")
      })
      .catch((err) => {
        console.log(err)
      })
      res.render('panel')
    }
  } else {
    res.render('panel-login')
  }
})