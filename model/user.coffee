esp = require 'esp'
Node = require './node'

class User extends esp.Model
  @persist 'name', 'password', 'type', 'activated', 'email', 'description'

  # arg: name, password
  constructor: (arg) ->
    @name = arg.name
    @password = arg.password
    @email = arg.email
    if arg.type? then @type = arg.type else @type = 'normal'
    if arg.description? then @description = arg.description else @description = ''
    @activated = true

  init: ->
    p = {}
    p.belongs = @name
    root = Node.create p
    root.save()

exports = module.exports = User
