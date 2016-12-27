doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf8'
    link href:"css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"css/common.css", rel:"stylesheet", media:"screen"
    title 'GBOX'
    script src:"js/jquery-1.10.2.js"
    script src:"js/bootstrap.min.js"
    script src:"js/underscore.js"
    script src:"js/backbone.js"
    script src:"js/md5.js"

	
  body ->
    div class:"navbar navbar-inverse navbar-fixed-top", role:"navigation", ->
      div class:"container", ->
        div class:"navbar-header", ->
          button type:"button", class:"navbar-toggle", 'data-toggle':"collapse", 'data-target':".navbar-collapse", ->
            span class:"sr-only", -> 'Toggle navigation'
            span class:"icon-bar"
            span class:"icon-bar"
            span class:"icon-bar"
          a class:"navbar-brand", href:"#", ->'GBOX'
        div class:"collapse navbar-collapse hide", ->
          ul class:"nav navbar-nav", ->
            li class:"active", -> a href:"/login", -> '登录'
            li class:"", -> a href:'/register', -> '注册'

    div class:"container", id:'container', style:'margin-top:80px;',  ->
      form class:"form-horizontal col-xs-4 col-xs-push-4", ->
        h2 class:"form-signin-heading", -> '欢迎登录GBOX'
        input type:"text", class:"form-control formConFix", id:'txtName', placeholder:'请输入用户名', ->
        coffeescript ->
          $('#txtName').focus()
        input type:"password", class:"form-control formConFix", id:'txtPassword', placeholder:'请输入密码', ->

        button class:"btn btn-lg btn-primary col-xs-8", id:"btnLogin", type:"button", ->'登录'
        button type:"button", class:"btn btn-lg btn-link col-xs-4", onclick:"window.location.href='/register'",  -> '注册'
    script src: 'model/user.js'
    script src: 'view/login.js'
    script src:"js/common.js"
