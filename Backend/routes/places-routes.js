const express = require('express')
const HttpError = require('../models/http-error')
const {
  getPlaceById,
  getPlacesByUserId,
  addPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/places-controllers')

const router = express.Router()

router.get('/:pid', getPlaceById)

router.get('/user/:uid', getPlacesByUserId)

router.post('/', addPlace)

router.patch('/:pid', updatePlace)

router.delete('/:pid', deletePlace)

module.exports = router
