Encoder = require('node-html-encoder').Encoder
encoder = new Encoder 'entity'

String.prototype.htmlEncode = ->
  encoder.htmlEncode this

String.prototype.htmlDecode = ->
  encoder.htmlDecode this