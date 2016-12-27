doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf-8'
    link href:"/css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"/css/common.css", rel:"stylesheet", media:"screen"
    title 'GBOX'
    script src:"/js/jquery-1.10.2.js"
    script src:"/js/bootstrap.min.js"
    script src:"/js/util.js"
    script src:"/js/md5.js"
    coffeescript ->
      uid = getQueryString('uid')
      #alert(window.location.href.split("?").length)
      alert('链接无效') unless uid

      popoverUtil = (obj, message, time) ->
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
          return alert('链接无效') unless uid
          pass = $("#txtPass").val().trim()
          confirm = $("#txtConfirm").val().trim()

          return popoverUtil "#txtPass", '密码长度要大于4' if pass.length < 4
          return popoverUtil "#txtConfirm", '密码不匹配' unless pass is confirm

          $.post '/password/reset', {password: hex_md5(pass), id: uid}, (result) ->
            return popoverUtil "#btnFindPass", '未知错误' unless result?
            return popoverUtil "#btnFindPass", result.result if result.status is 'fail'
            return window.location.href = '/' if result.result.type is 'normal'
            window.location.href = '/admin'


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
            li class:"active", -> a href:"javascript:void(0)", -> '重置密码'
            li -> a href:"/login", -> '登录'
            li class:"", -> a href:'/register', -> '注册'

    div class:"container", id:'container', style:'margin-top:80px;',  ->
      form class:"form-horizontal col-sm-8 col-sm-push-3", ->
        h2 class:"form-signin-heading col-sm-offset-3", -> '重置密码'
        div class:"form-group", ->
          label for:"txtPass", class:"col-sm-3 control-label", ->'新密码'
          div class:"col-sm-5", ->
            input type:"password", class:"form-control ", id:'txtPass', placeholder:'请输入新密码', ->
        coffeescript ->
          $('#txtPass').focus()
        div class:"form-group", ->
          label for:"txtConfirm", class:"col-sm-3 control-label", ->'确认密码'
          div class:"col-sm-5", ->
            input type:"password", class:"form-control ", id:'txtConfirm', placeholder:'请确认密码', ->
        div class:"form-group", ->
          div class:"col-sm-5 col-sm-offset-3", ->
            button class:"btn btn-lg btn-primary col-sm-12", id:"btnFindPass", type:"button",  ->'修改密码'
