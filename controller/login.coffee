esp = require 'esp'

User = require '../model/user'
querystring = require('querystring')

esp.route ->

  @get '/login', -> @view 'login'

  @post '/login', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = querystring.parse data
        #user = User.findone (x) -> x.name is p.name
        user = {
          id:1,'name':'zl', 'password':'123', 'type':'admin', 'activated':true, 'email':'xxxx', 'description':'xxxxx'
        }
        #return @json {status: 'fail', result: '用户名不存在'} unless user?
        #return @json {status: 'fail', result: '用户密码不匹配'} unless user.password is p.password
        #return @json {status: 'fail', result: '该用户被禁用'} unless user.activated
        @setCookie token: user.id
        @json {status: 'success', result: user}
      catch err
        @clearCookie()
        @json {status: 'fail', result: 'Got an error!'}

  @get '/logout', ->
    @clearCookie()
    @redirect '/login'
