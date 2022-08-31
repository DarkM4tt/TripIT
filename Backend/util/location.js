const axios = require('axios')
const HttpError = require('../models/http-error')

const API_KEY = 'AkcnskoACOSDCAlLMDLKLMCLSD'

function getCoordsForAddress(address) {
  return {
    lat: 83.4352,
    lng: -48.3424,
  }
}

module.exports = getCoordsForAddress
