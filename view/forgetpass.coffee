doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf-8'
    link href:"css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"css/common.css", rel:"stylesheet", media:"screen"
    title 'GBOX'
    script src:"js/jquery-1.10.2.js"
    script src:"js/bootstrap.min.js"
    coffeescript ->
      popoverUtil = (obj, message, time) ->
        $(obj).popover('destroy')
        time = time || 1000
        $(obj).popover {placement:'bottom',trigger:'manual',content: message}
        $(obj).popover('show')
        hide = ->
          $(obj).popover('hide')
        setTimeout hide, time

      window.document.onkeypress = (e) ->
        $('#btnFindPass').trigger('click') if e.keyCode is 13


      $ ->
        $('#btnFindPass').click (e) ->
          email = $("#txtEmail").val().trim()
          regMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          return popoverUtil "#txtEmail", '邮箱格式不正确' unless regMail.test email
          $.get '/password/email', {email: email}, (result) ->
            return popoverUtil "#btnFindPass", '未知错误' unless result?
            return popoverUtil "#btnFindPass", result.result if result.status is 'fail'
            popoverUtil "#btnFindPass", "信息已发送到您的邮箱:#{email}, 请查收", 5000

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
            li class:"active", -> a href:"/password", -> '忘记密码'
            li class:"", -> a href:"/login", -> '登录'
            li class:"", -> a href:'/register', -> '注册'

    div class:"container", id:'container', style:'margin-top:80px;',  ->
      form class:"form-horizontal col-sm-8 col-sm-push-3", onsubmit:"return false", ->
        h2 class:"form-signin-heading col-sm-offset-3", -> '使用邮箱找回'
        div class:"form-group", ->
          label for:"txtEmail", class:"col-sm-3 control-label", ->'注册邮箱'
          div class:"col-sm-5", ->
            input type:"text", class:"form-control ", id:'txtEmail', placeholder:'请输入用户邮箱', ->
        coffeescript ->
          $('#txtEmail').focus()
        div class:"form-group", ->
          div class:"col-sm-5 col-sm-offset-3", ->
            button class:"btn btn-lg btn-primary col-sm-12", id:"btnFindPass", type:"button",  ->'找回密码'
