winston = require 'winston'
moment = require 'moment'
config = require '../config'

LOG_ROOT = config.getConfig().log_dir

logger = null

init = ->
  wl = new (winston.Logger)(
    transports: [
      new (winston.transports.File)(
        filename: LOG_ROOT
        json: false
        maxsize: 5242880
        timestamp: -> new moment().format 'YYYY-MM-DD HH:mm:ss'
      )
    ]
    exitOnError: false
    level: 'info'
  )

  wl.getLevel = -> level = @transports.file.level
  wl.setLevel = (level) -> @transports.file.level = level

  return wl

getInstance = ->
  logger = init() unless logger
  return logger

module.exports.getInstance = getInstance
