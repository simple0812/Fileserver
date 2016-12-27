config = null
init = ->
  configuration =
    temp : __dirname + '/temp'
    storage_dir: __dirname + '/download'
    log_dir:  __dirname + '/log/gbox.log'
    root_dir : __dirname 

    capacity:
      normal: 20 * 1024 * 1024 * 1024
      manager: 50 * 1024 * 1024 * 1024
      administrator: 5 * 100 * 1024 * 1024 * 1024
  return configuration

getConfig = ->
  config = init() unless config
  return config

module.exports.getConfig = getConfig
