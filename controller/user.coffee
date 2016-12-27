esp = require 'esp'
User = require '../model/user'
Node = require '../model/node'
querystring = require 'querystring'
helper = require './helper'

esp.route ->

  @get '/register', ->
    @view 'register'
  , public: true

  @post '/register', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        return @json {status: 'fail', result: '用户名不能为空'} if p.name? is ''
        return @json {status: 'fail', result: '用户邮箱不能为空'} if p.email? is ''
        user = User.findone (x) -> x.name is p.name
        return @json {status: 'fail', result: '用户名已存在'} if user?
        user = User.findone (x) -> x.email is p.email
        return @json {status: 'fail', result: '用户邮箱已存在'} if user?
        user = User.create p
        user.init()
        user.save()
        @setCookie token: user.id
        @json {status: 'success', result: user}
      catch err
        @clearCookie()
        @json {status: 'fail', result: 'Got an error!'}
  , public: true

  @put '/user/:id/information', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        email = p.email if p.email?
        oldpassword = p.oldpassword if p.oldpassword?
        newpassword = p.newpassword if p.newpassword?
        description = p.description if p.description?
        if email?
          user = User.findone (x) -> x.email is email
          return @json {status: 'fail', result: '当前邮箱已存在'} if user?
          user = User.findone (x) => x.id is @id
          return @json {status: 'fail', result: '当前用户不存在'} unless user?
          user.email = email
          user.save()
          @json {status: 'success', result: '修改成功'}
        else if description?
          user = User.findone (x) => x.id is @id
          return @json {status: 'fail', result: '当前用户不存在'} unless user?
          user.description = description
          user.save()
          @json {status: 'success', result: '修改成功'}
        else if oldpassword? and newpassword?
          user = User.findone (x) => x.id is @id
          return @json {status: 'fail', result: '当前用户不存在'} unless user?
          return @json {status: 'fail', result: '原始秘密不正确'} unless user.password is oldpassword
          user.password = newpassword
          user.save()
          @json {status: 'success', result: '修改成功'}
        else
          @json {status: 'fail', result: '修改失败'}
      catch err
        @json {status: 'fail', result: 'Got an error!'}


  @post '/user/create', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = querystring.parse data
        return @json {status: 'fail', result: '用户名不能为空'} if p.name? is ''
        return @json {status: 'fail', result: '用户邮箱不能为空'} if p.email? is ''
        user = User.findone (x) -> x.name is p.name
        return @json {status: 'fail', result: '用户名已存在'} if user?
        user = User.findone (x) -> x.email is p.email
        return @json {status: 'fail', result: '用户邮箱已存在'} if user?
        user = User.create p
        user.init()
        user.save()
        @setCookie token: user.id
        @json {status: 'success', result: user}
      catch err
        @clearCookie()
        @json {status: 'fail', result: 'Got an error!'}

  @post '/user/import', ->

  @delete '/user', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        users = []
        for each in p
          user = User.findone (x) -> x.id is each
          users.push user
        helper.rmUsers users, => @json {status: 'success', result: ''}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

  @post '/user/export', ->

  @put '/user/activate', ->
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        successful = []
        failed = []
        for id in p.ids
          user = User.findone (x) -> x.id is id
          if user.activated isnt p.activate
            successful.push id
            user.activated = p.activate
            user.save()
          else
            failed.push id
        return @json {status: 'success', result: '修改成功'} unless successful.length is 0
        @json {status: 'fail', result: {successful: successful, failed: failed}}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

