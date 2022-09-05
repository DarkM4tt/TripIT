const HttpError = require('../models/http-error')
const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place-model')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
]

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  let place

  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    )
    return next(error)
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    )
    return next(error)
  }

  res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid

  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    )
  }

  res.json({ places: places.map((place) => place.toObject({ getters: true })) })
}

const addPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, coordinates, address, creator } = req.body

  try {
    const coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 70.45,
      lng: 64.42,
    },
    image:
      'https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhY2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60',
    creator,
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again!', 500)
    console.log(err)
    return next(error)
  }

  res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place!',
      500
    )
    return next(error)
  }

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    )
    return next(error)
  }
  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    )
    return next(error)
  }

  try {
    await place.remove()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    )
    return next(error)
  }

  res.status(200).json({ message: 'Deleted place.' })
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  addPlace,
  updatePlace,
  deletePlace,
}
