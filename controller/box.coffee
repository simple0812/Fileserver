esp = require 'esp'
helper = require './helper'
User = require '../model/user'
Node = require '../model/node'
path = require 'path'
querystring = require 'querystring'
underscore = require 'underscore'
formidable = require 'formidable'
fs = require 'fs'
logger = require('./logger').getInstance()
config = require('../config').getConfig()

esp.route ->

  verify = (cookie, id) ->
    p = cookie.token
    userA = User.findone (x) -> x.id is p
    return true if userA.type is 'administrator'
    user = User.findone (x) -> x.id is id
    if user? and p is id then true else false

  modifyChildrenPath = (mvid) ->
    mvNode = Node.findone (x) -> x.id is mvid
    childNodes = Node.find (x) -> x.pid is mvid
    for node in childNodes
      node.path = path.join mvNode.path, node.name
      node.save()
      modifyChildrenPath(node.id) if node.type is 'directory'

  modifyParentSize = (id, size) ->
    node = Node.findone (x) -> x.id is id
    return if node.pid is ''
    pNode = Node.findone (x) -> x.id is node.pid
    pNode.size += size
    pNode.save()
    modifyParentSize(node.pid, size)

  @get '/', ->
    uid = @cookie.token
    user = User.findone (p) -> p.id is uid
    return @html 'Page is not found', 404 unless user?.type is 'normal'
    node = Node.findone (x) -> x.pid is '' and x.belongs is user.name

    nodes = Node.find (x) -> x.belongs is user.name and x.type isnt 'directory'
    currentSize = 0
    totalSize = 20 * 1000 * 1000 * 1000

    currentSize += each.size for each in nodes

    @view 'index', userInfo:
      name: user.name, id: uid, type: user.type
      email: user.email, description: user.description
      nodeid: node.id, nodepath: node.path
      currentSize: currentSize, totalSize: totalSize

  @get '/chat', ->
    uid = @cookie.token
    user = User.findone (p) -> p.id is uid
    return @html 'Page is not found', 404 unless user?
    @view 'chat', userInfo: {name: user.name, id: uid, type: user.type}

  @get '/admin', ->
    uid = @cookie.token
    user = User.findone (p) -> p.id is uid
    return @html 'Page is not found', 404 unless user?.type is 'administrator'
    @view 'admin/index', userInfo: {name: user.name, id: uid, type: user.type, email: user.email, description: user.description}

  @get '/box/:id', ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    user = User.findone (p) => p.id is @id
    nodes = Node.find (x) -> x.belongs is user.name

    newNodes = []
    newNodes.push(underscore.pick(each, 'id', 'name', 'type', '_authCode',
      'path', 'belongs', 'shared', 'mtime', 'size', 'pid' )) for each in nodes

    return @json newNodes

  @get '/node/:id/:file', ->
    feedback = (msg) => @html '<!DOCTYPE HTML><html><head><meta charset="utf-8"></head><body><div style="text-align:center">' + msg + '</div></body></html>'
    return feedback '用户权限不对或非法用户请求' unless verify @cookie, @id
    user = User.findone (x) => x.id is @id
    node = Node.findone (x) => x.id is @file
    code = @query.code
    return feedback '文件不存在' unless node?
    switch node.shared
      when 0
        return feedback '你没有下载此文件的权限' unless (node.belongs is user.name or user.type is 'administrator')
      when 2
        return feedback '你没有下载此文件的权限' unless (node.belongs is user.name or user.type is 'administrator' or code is node._authCode)

    return feedback '文件不存在' unless fs.existsSync(config.storage_dir + '/' + node.id)

    @response.setHeader("Content-type", 'application/octet-stream')
    @response.setHeader("Content-Disposition", 'attachment;filename=' + node.name + ";")
    s = fs.createReadStream(config.storage_dir + '/' + node.id)
    s.pipe @response
    s.on 'end', () =>
      @response.end()

  @delete '/nodes/:id', ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        nodes = []
        for each in p
          node = Node.findone (x) -> x.id is each
          nodes.push node
        helper.rmNodes nodes, => @json {status: 'success', result: ''}
      catch err
        @json {status: 'fail', result: '系统出错，请联系管理员'}

  @post '/box/:id/mkdir',  ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = querystring.parse data
        user = User.findone (x) => x.id is @id
        pnode = Node.findone (x) -> x.id is p.id
        return @json {status: 'fail', result: '目标文件夹不存在'} unless pnode?
        return @json {status: 'fail', result: '当前用户权限不够'} unless pnode.belongs is user.name
        nodes = Node.find (x) -> x.pid is pnode.id

        return @json {status: 'fail', result: '文件夹名称已存在'} for each in nodes when each.name is p.name
        x = {}
        [x.name, x.path, x.belongs, x.pid] = [p.name, path.join(pnode.path, p.name), pnode.belongs, pnode.id]
        node = Node.create x
        node.save()

        pnode.size += 1
        pnode.save()
        @json {status: 'success', result:  underscore.pick(node,'id', 'name', 'type', '_authCode',
        'path', 'belongs', 'shared', 'mtime', 'size', 'pid' )}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

  @put '/box/:id/move', ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        successful = []
        failed = []
        toNode = Node.findone (x) -> x.id is p.to
        toNodeChildren = Node.find (x) -> x.pid is toNode.id
        for id in p.ids

          if id is p.to
            failed.push id
            continue

          node = Node.findone (x) ->x.id is id
          fromNode = Node.findone (x) ->x.id is node.pid

          isExists = false
          isExists = true for each in toNodeChildren when each.name is node.name

          if isExists
            failed.push id
            continue

          fromNode.size -= 1
          toNode.size += 1
          node.pid = toNode.id
          node.path = path.join toNode.path, node.name

          node.save()
          fromNode.save()
          toNode.save()

          successful.push id

          modifyChildrenPath id if node.type is 'directory'

        return @json {status: 'fail', result: '操作失败'} if successful.length is 0
        @json {status: 'success', result: '操作成功'}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

  @put '/box/:id/share', ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        successful = []
        failed = []
        for id in p.ids
          xNode = Node.findone (t) -> t.id is id
          if xNode?.shared is p.shared
            failed.push(id)
          else
            return failed.push(id) if !p.code? and p.shared is 2
            xNode.shared = p.shared
            if p.shared is 2 then xNode._authCode = p.code else xNode._authCode = ''
            xNode.save()
            successful.push(id)
        return @json {status: 'fail', result: '操作失败'} if successful.length is 0
        @json {status: 'success', result: '操作成功'}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

  #获取非当前用户的分享
  @get '/oshare/:id', ->
    page =  @query.destpage or 1
    pageSize =  @query.pagesize or 15
    query =  @query.query or ''
    sortFlag = @query.sortflag or 'createdAt'
    orderMode = @query.ordermode or 'desc'
    page = 1 if page <= 0
    pageSize = 15 if pageSize <= 0

    firstNum = (page - 1) * pageSize
    endNum = firstNum + parseInt pageSize
    user = User.findone (x) => x.id is @id
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless user?

    nodes = Node.find (x) ->
      x.shared and x.belongs isnt user.name and (x.name.indexOf query) > -1 and x.pid isnt ''
    destNodes = underscore.sortBy nodes, (node) -> node[sortFlag]
    destNodes = destNodes.reverse() if orderMode is 'desc'
    destNodes = destNodes[firstNum...endNum]

    newNodes = []
    newNodes.push(underscore.pick(each, 'id', 'name', 'type',
      'path', 'belongs', 'shared', 'mtime', 'size', 'pid' )) for each in destNodes

    @json { status: 'success', result: newNodes, recordcount: nodes.length, count: destNodes.length }

  @put '/box/:id/rename', ->
    return @json {status: 'fail', result: '用户权限不对或非法用户请求'} unless verify @cookie, @id
    data = ''
    @request.on 'data', (chunk) -> data += chunk
    @request.on 'end', =>
      try
        p = JSON.parse data
        node = Node.findone (x) -> x.id is p.id
        return @json {status: 'fail', result: '文件不存在'} unless node?
        nodes = Node.find (x) -> x.pid is node.pid
        (return @json {status: 'fail', result: '文件名称已存在'} if each.name is p.new) for each in nodes
        x = path.dirname node.path
        x = path.join x, p.new
        node.name = p.new
        node.path = x
        node.save()
        modifyChildrenPath(node.id)
        @json {status: 'success', result: underscore.pick(node,'id', 'name', 'type',
          'path', 'belongs', 'shared', 'mtime', 'size', 'pid' )}
      catch err
        @json {status: 'fail', result: 'Got an error!'}

  @post '/upload', ->
    query = @query
    user = User.findone (x) => x.id is @cookie.token
    feedback = (arg) =>
      res = {status: 'fail', result: ''}
      if arg instanceof Node
        [res.status, res.result] = ['success', arg]
        logger.info "\tUpload\t#{user.name}\t#{arg.name}\tNID: #{arg.id}\t"
      else
        res.result = arg
        console.log arg
      @json res
    form = new formidable.IncomingForm()
    form.on 'fileBegin', (name, file) ->
      file.path = config.temp
    form.parse @request, (err, fields, files) ->
      return feedback null if err
      p = files['files[]']
      p.pid = query.path
      try
        helper.handleUploadFile user, p, feedback
      catch err
        console.log err.message

  @get '/users', ->
    users = User.find (x) -> x.type is 'normal'
    @json users

  #默认15条
  @get '/files', ->
    page =  @query.destpage or 1
    pageSize =  @query.pagesize or 15
    query =  @query.query or ''
    sortFlag = @query.sortflag or 'createdAt'
    orderMode = @query.ordermode or 'desc'
    page = 1 if page <= 0
    pageSize = 15 if pageSize <= 0

    firstNum = (page - 1) * pageSize
    endNum = firstNum + parseInt pageSize

    nodes = Node.find (x) ->
      x.type isnt 'directory' and (x.name.indexOf query) > -1 and x.pid isnt ''

    destNodes = underscore.sortBy nodes, (node) ->
      node[sortFlag]
    destNodes = destNodes.reverse() if orderMode is 'desc'
    destNodes = destNodes[firstNum...endNum]

    newNodes = []

    newNodes.push(underscore.pick(each, 'id', 'name', 'type',
      'path', 'belongs', 'shared', 'mtime', 'size', 'pid' )) for each in destNodes

    @json { status: 'success', result: newNodes, recordcount: nodes.length, count: destNodes.length }

