esp = require 'esp'
Weather = require '../model/weather'
querystring = require 'querystring'
_ = require 'underscore'

esp.route ->
  @post '/weather', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = querystring.parse data

        return @json {status: 'fail', result: '天气不能为空'} unless p.weather?
        return @json {status: 'fail', result: '天气最大值不能为空'} unless p.maxtemperature?
        return @json {status: 'fail', result: '天气最小值不能为空'} unless p.mintemperature?

        weather = Weather.findone (x) -> true
        if weather
          [weather.weather, weather.maxtemperature, weather.mintemperature] =
            [p.weather, p.maxtemperature, p.mintemperature]
          weather.save()
        else
          weather = Weather.create p
          weather.save()
        @json {status: 'success', result: weather}
      catch err
        @json {status: 'fail', result: 'Got an error!'}
  , public: true

  @get '/weather', ->
    weather = Weather.findone (x) -> true
    weather = {weather:'晴天', maxtemperature:'', mintemperature:''}  unless weather?
    @view 'weather', weather: weather
  , public: true

  @get '/weather/interface', ->
    weather = Weather.findone (x) -> true
    dest = {weatherinfo:{temp:'', weather:''}}
    if weather?
      dest.weatherinfo.temp = "#{weather.mintemperature}℃~#{weather.maxtemperature}℃"
      dest.weatherinfo.weather = weather.weather
    @json dest
  , public: true



