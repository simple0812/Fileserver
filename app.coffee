esp = require 'esp'

require './controller/data'
require './controller/login'
require './controller/user'
require './controller/box'

User = require './model/user'

esp.auth '/login', -> User.find @cookie.token if @cookie?.token?

esp.run 80

