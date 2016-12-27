esp = require 'esp'
config = require('../config').getConfig()

class Weather extends esp.Model
  @persist 'weather', 'maxtemperature', 'mintemperature', 'createat'

  constructor: (arg) ->
    @weather = arg.weather
    @maxtemperature = arg.maxtemperature
    @mintemperature = arg.mintemperature
    @createat = new Date().getTime()

exports = module.exports = Weather