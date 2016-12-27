User = require '../model/user'
Node = require '../model/node'
fs = require 'fs'
path = require 'path'
config = require('../config').getConfig()

BOX_ROOT = config.storage_dir

getFileType = (fileName) ->
  extension = path.extname(fileName).toLowerCase().slice(1)
  switch extension
    when 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'bmp'
      return 'picture'
    when 'doc', 'docx', 'docm', 'dotx', 'dotm', 'xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam', 'ppt', 'pptx', 'pptm', 'ppsx', 'potx', 'pdf', 'txt'
      return 'document'
    when 'avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mp4', 'mkv', 'vob'
      return 'video'
    else
      return 'other'

handleUploadFile = (user, fileInfo, callback) ->
  if user?
    return callback '未知错误，上传失败' unless fileInfo.name? and fileInfo.path? and fileInfo.size?
    pNode = Node.findone (p) -> p.id is fileInfo.pid
    nodes = Node.find (p) -> p.pid is fileInfo.pid
    return callback "未知错误，#{fileInfo.name} 上传失败" unless pNode?
    names = []
    names.push each.name for each in nodes
    if fileInfo.name in names
      extname = path.extname fileInfo.name
      name = path.basename fileInfo.name, extname
      p = 1
      p += 1 while "#{name}(#{p})#{extname}" in names
      fileInfo.name = "#{name}(#{p})#{extname}"
    p = {}
    [p.name, p.type, p.path, p.belongs, p.size, p.pid] = [fileInfo.name, getFileType(fileInfo.name), path.join(pNode.path, fileInfo.name), user.name, parseInt(fileInfo.size), pNode.id]
    node = Node.create p
    node.save()
    pNode.size += 1
    x = path.join BOX_ROOT, node.id
    fs.rename fileInfo.path, x, (err) ->
      throw err if err?
      callback node
  else
    fs.unlink fileInfo.path, (err) ->
      throw err if err?
      callback "无上传权限，#{fileInfo.name} 上传失败"

rmFNode = (node, callback) ->
  pNode = Node.findone (p) -> p.id is node.pid
  filePath = path.join BOX_ROOT, node.id
  fs.unlink filePath, (err) ->
    throw err if err?
    pNode.size -= 1 if pNode?
    node.delete()
    callback()

rmFNodes = (nodes, callback) ->
  rmFNodesSerial = (i) ->
    return callback() if i is nodes.length
    node = nodes[i]
    rmFNode node, -> rmFNodesSerial i + 1
  rmFNodesSerial 0

rmDNode = (node, callback) ->
  pNode = Node.findone (p) -> p.id is node.pid
  cNodes = Node.find (p) -> p.pid is node.id
  rmNodes cNodes, ->
    pNode.size -= 1 if pNode?
    node.delete()
    callback()

rmNodes = (nodes, callback) ->
  dNodes = []
  fNodes = []
  for each in nodes
    if each.type is 'directory' then dNodes.push each else fNodes.push each
  rmNodesSerial = (i) ->
    return rmFNodes fNodes, callback if i is dNodes.length
    node = dNodes[i]
    rmDNode node, -> rmNodesSerial i + 1
  rmNodesSerial 0

rmUser = (user, callback) ->
  rootNode = Node.findone (p) -> p.belongs is user.name and p.pid is ''
  rmDNode rootNode, ->
    user.delete()
    callback()

rmUsers = (users, callback) ->
  rmUsersSerial = (i) ->
    return callback() if i is users.length
    user = users[i]
    rmUser user, -> rmUsersSerial i + 1
  rmUsersSerial 0

module.exports.handleUploadFile = handleUploadFile
module.exports.rmNodes = rmNodes
module.exports.rmUsers = rmUsers
