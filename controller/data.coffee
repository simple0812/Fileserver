esp = require 'esp'

User = require '../model/user'
Node = require '../model/node'
md5 = require('blueimp-md5').md5

esp.route ->
  @put '/p/init', ->
    p =
      name: 'admin'
      password: md5 'admin'
      type: 'administrator'
      email: 'admin@admin.com'
    user = User.findone (x) -> x.name is 'admin'
    return @json {status: 'fail', result: 'admin is exists!'} if user
    admin = User.create(p)
    admin.init()
    admin.save()
    @json {status: 'success', result: 'create success'}

