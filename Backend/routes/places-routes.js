const express = require('express')
const HttpError = require('../models/http-error')
const {
  getPlaceById,
  getPlaceByUserId,
  addPlace,
} = require('../controllers/places-controllers')

const router = express.Router()

router.get('/:pid', getPlaceById)

router.get('/user/:uid', getPlaceByUserId)

router.post('/', addPlace)

module.exports = router
