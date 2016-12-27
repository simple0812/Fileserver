esp = require 'esp'
fs = require 'fs'
moment = require 'moment'
path = require 'path'

class Node extends esp.Model
  @persist 'name', 'type', 'path', 'belongs', 'shared', '_authCode', 'mtime', 'size', 'pid'

  # arg: belongs 
  constructor: (arg) ->
    super
    if arg.name? then @name = arg.name else @name = 'root'
    if arg.type? then @type = arg.type else @type = 'directory'
    if arg.path? then @path = arg.path else @path = '/'
    @belongs = arg.belongs
    @shared = 0
    @_authCode = ''
    @mtime = moment().format('YYYY-MM-DD HH:mm:ss')
    if arg.size? then @size = arg.size else @size = 0
    if arg.pid? then @pid = arg.pid else @pid = ''

  rmSubFNode: (node, callback) ->
    return unless @type is 'directory'
    return unless node.pid is @id
    extension = Path.extname node.name
    filePath = Path.join BOX_ROOT, "#{node.id}#{extension}"
    fs.unlink filePath, (err) =>
      throw err if err?
      @size -= node.size
      node.delete()
      callback()

# 需要检验
  rmSubDNode: (node, callback) ->
    return unless @type is 'directory'
    return unless node.pid is @id
    size = node.size
    subNodes = Node.find (p) -> p.pid is node.id
    node.empty(callback)
    node.delete()
    @size -= size

  rmSubFNodes: (nodes, callback) ->
    return unless @type is 'directory'
    rmFNodesSerial = (i) ->
      return callback() if i is nodes.length
      node = nodes[i]
      @rmSubFNode node, -> rmFNodesSerial i + 1
    rmFNodesSerial 0

  rmSubNodes: (nodes, callback) ->
    return unless @type is 'directory'
    dNodes = []
    fNodes = []
    for each in nodes
      if each.type is 'directory' then dNodes.push each else fNodes.push each
    rmDNodesSerial = (i) =>
      return @rmSubFNodes fNodes, callback if i is dNodes.length
      node = dNodes[i]
      rmSubDNode node, -> rmDNodesSerial i + 1
    rmDNodesSerial 0

  empty: (callback) ->
    return unless @type is 'directory'
    pNode = Node.findone (p) => p.id is @pid
    size = @size
    subNodes = Node.find (p) -> p.pid is @id
    @rmSubNodes subNodes, callback

exports = module.exports = Node
