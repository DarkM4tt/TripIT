const express = require('express')
const HttpError = require('../models/http-error')
const { getUsers, signup, login } = require('../controllers/users-controllers')

const router = express.Router()

router.get('/', getUsers)

router.post('/signup', signup)

router.post('/login', login)

module.exports = router
