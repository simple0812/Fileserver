doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf8'
    link href:"css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"css/common.css", rel:"stylesheet", media:"screen"
    link href:"css/pager.css", rel:"stylesheet", media:"screen"
    title 'GBOX'
    script src:"js/jquery-1.10.2.js"
    script src:"js/bootstrap.min.js"
    script src:"js/underscore.js"
    script src:"js/backbone.js"
    script src:"js/md5.js"
    script src:"js/util.js"
    script src:"js/pager.js"
    script src:"js/jquery.cookies.js"
    script src:"js/filesize.min.js"

  body style:"padding-top:70px;", ->
    div class:"modal fade", id:"myModal", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title", id:"myModalLabel", ->
              text '修改密码'
          div class:"modal-body", ->
            form class:"form-horizontal", id: 'password', style: 'margin-top: 10px', ->
              h5 class:"modal-title", style:"margin-bottom:10px;", -> '修改密码:'
              input type:"password", class:"form-control formConFix", id:"txtOriginalPassword", placeholder:"请输入原密码", ->
              input type:"password", class:"form-control formConFix", id:"txtNewPassword", placeholder:"请输入新密码", ->
              input type:"password", class:"form-control formConFix", id:"txtComfirmPassword", placeholder:"请确认新密码", ->
          div class:"modal-footer",->
            button type:"button", id:'modifyPassword', class:"btn btn-primary ",->'保存修改'
            button type:"button", class:"btn btn-default", 'data-dismiss':"modal",->
              text '关闭'
    nav class:"navbar navbar-inverse navbar-fixed-top", role:"navigation", ->
      div class:"navbar-header", ->
        a class:"navbar-brand", href:"#", -> 'GBOX'
      div class:"collapse navbar-collapse", id:"bs-example-navbar-collapse-1", ->
        ul class:"nav navbar-nav navbar-right", ->
          li class:"dropdown", ->
            a href:'javascript:void(0)', class:"dropdown-toggle", 'data-toggle':"dropdown", ->
              b id: "username", -> @userInfo.name if @userInfo?.name?
              b class:"caret"
            ul class:"dropdown-menu", ->
              li  ->
                a href:'javascript:void(0)',onclick:"modalIputFocus('#myModal', '#txtOriginalPassword')" ,'nodeid':"", -> '修改个人信息'
              li class:'divider', ->
              li ->
                a href:'/logout', -> '退出'


    div class:"col-sm-2", id:"sidebar", role:"navigation", ->
      div class:"list-group", ->
        a href:"javascript:void(0)", onclick:"nav(this, 0)", class:"list-group-item active",->
          span class:"glyphicon glyphicon-user", ->

          text ' 用户管理'
        a href:"javascript:void(0)", onclick:"nav(this, 1)", class:"list-group-item ",id:'mafile',  ->
          span class:"glyphicon glyphicon-file", ->
          text ' 文件管理'


    div class:"col-sm-10", id:'userfield', ->
      div class:"row ", id:"operatearea", ->
        div class:"col-sm-8", ->
          button type:"button", class:"btn btn-primary ",onclick:"modalIputFocus('#container', '#txtName')", ->
            span class:"glyphicon glyphicon-star", ->
            text ' 创建用户'
          button type:"button", class:"btn btn-default sp-btnfix hide", ->
            span class:"glyphicon glyphicon-folder-close ", ->
            text ' 导入用户'
          button type:"button", class:"btn btn-default sp-btnfix hide", ->
            span class:"glyphicon glyphicon-folder-open", ->
            text ' 导出用户'
          button type:"button", class:"btn btn-default sp-btnfix", id:'btnActivate', ->
            span class:"glyphicon glyphicon-ok-sign", ->
            text ' 激活'
          button type:"button", class:"btn btn-default sp-btnfix", id:'btnForbid', ->
            span class:"glyphicon glyphicon-remove-sign", ->
            text ' 禁用'
          button type:"button", class:"btn btn-default sp-btnfix", id:'btnDelete', ->
            span class:"glyphicon glyphicon-trash", ->
            text ' 删除'
        form  role:"form", method:'get', onsubmit:'return false',  ->
          div class:"form-group col-sm-3", ->
            input type:"text", name:'query', id:"txtSearchName", class:"form-control ", placeholder:"请输入用户名或者邮箱", ->
          button type:"button", id:"btnSearch", class:"btn btn-default", -> '搜索'


      div class:"modal fade", id:"container", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
        div class:"modal-dialog", ->
          div class:"modal-content", ->
            div class:"modal-header", ->
              button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
                text '&times;'
              h4 class:"modal-title", id:"newuserLabel", ->
                text '创建用户'
            div class:"modal-body", ->
              form class:"form-horizontal", id: 'password', style: 'margin-top: 10px', ->
                h2 class:"form-signin-heading", ->
                input type:"text", class:"form-control formConFix", id:'txtName', placeholder:'请输入用户名', ->
                input type:"password", class:"form-control formConFix", id:'txtPassword', placeholder:'请输入密码', ->
                input type:"password", class:"form-control formConFix", id:'txtConfirm', placeholder:'请再次密码', ->
                input type:"text", class:"form-control formConFix", id:'txtEmail', placeholder:'请输入邮箱', ->
                textarea  class:"form-control", id:'txtDescription', placeholder:'请输入个人简介', ->
            div class:"modal-footer",->
              button class:"btn btn-primary  col-sm-offset-6", id:"btnCreate", type:"button", ->'创建用户'

              button type:"button", class:"btn btn-default", 'data-dismiss':"modal",->
                text '关闭'
      div class:"row taoverfix", ->
        table class:"table table-hover", id:"userlist", ->
          tr ->
            th class:"col-sm-5", ->
              div class:'dropdowm', ->
                span class:"col-sm-1", ->
                  input type:"checkbox", id:'allUser',->
                span class:"col-sm-4", ->'用户名'
            th class:"col-sm-1", ->'状态'

            th class:"col-sm-2", ->'邮箱'
            th class:"col-sm-4", ->'个人描述'


    div class:"col-sm-10", id:'nodefield', style:'display:none', ->
      div class:"row ", id:"operateFilearea", ->
        div class:"col-sm-8", ->
          form id:'uploadForm', action:'/upload', method:'POST', enctype:'multipart/form-data', ->
            button type:"button", class:"btn btn-primary",  id:'btnDeleteFile', ->
              span class:"glyphicon glyphicon-trash", ->
              text ' 删除'

        div class:"form-group col-sm-3", ->
          input type:"text", class:"form-control ", id:"txtSearchFile",placeholder:"请输入文件名", ->
        button type:"submit", class:"btn btn-default",id:"btnSearchFile", ->'搜索'


      ol class:"breadcrumb", id:'nodenav', 'nodeid':"", 'nodepath':"", ->
        li -> a href:'javascript:void(0)', 'nodeid':"", 'nodepath':"",onclick:"showpath(this)", ->'全部文件'
      div class:"row taoverfix", ->
        table class:"table table-hover",id:"filelist", style:'cursor:pointer',->
          tr id:'filelisthead', ->
            th class:"col-sm-5 thsortbyname", ->
              div class:'dropdowm', ->
                span class:"col-sm-1", ->
                  input type:"checkbox", id:'allFile', ->
                span class:"col-sm-4 ", ->
                  text '文件名'
                  b class:"caret", style:'display:none'

            th class:"col-sm-1 thsortbysize", style:'cursor:pointer', ->
              text '大小'
              b class:"caret", style:'display:none'
            th class:"col-sm-2 thsortbycreatedAt", style:'cursor:pointer', ->
              text '修改日期'
              b class:"caret", style:'display:none'
            th class:"col-sm-1", ->'上传者'
            th class:"col-sm-3", id:'filedir', style:'display:none',  ->'所在目录'
        div style:'text-align:center;', class:'page_y', id:'pager', ->





script type:"text/template", id:"filetemp", style:"display:none", ->
    td ->
      div class:'dropdowm', ->
        span class:"col-sm-1", ->
          input type:"checkbox",value:"{{id}}", class: 'chkFileItem'
        div class:"col-sm-1 ", ->
          div class:"sharefix", ->
            b class :"shareloack ", ->
            b class:" typepic ", ->
          #b class:"col-sm-1 typepic ", ->
        span class:"col-sm-10 sp-filename", nodetype:'{{type}}',title:'{{name}}', -> '{{linkcheck}}'
        span class:"col-sm-4 fileoper", style:'display:none;text-align:right', ->
          a href:'javascript:void(0)', class: 'delfile',title:'删除', ->
            span class:'glyphicon glyphicon-trash', style:'margin-right:10px'
          a href:'javascript:void(0)', class: 'downfile',title:'下载', ->
            span class:'glyphicon glyphicon-download',

    td -> '{{size}}'
    td -> '{{mtime}}'
    td class:'sp-username', -> '{{belongs}}'
    td class:'filedir',style:'display:none', -> '{{path}}'



  script type:"text/template", id:"usertemp", style:"display:none", ->
    td ->
      div class:'dropdowm', ->
        span class:"col-sm-1", ->
          input type:"checkbox",value:"{{id}}", class: 'chkUserItem'
        span class:"col-sm-4 sp-username", style:'cursor:pointer', -> '{{name}}'
        span class:"col-sm-5 col-sm-offset-2 useroper", style:'display:none', ->
          a href:'javascript:void(0)', class: "activated", title:"激活用户", ->
            span class:'glyphicon glyphicon-ok-sign', style:'margin-right:15px'
          a href:'javascript:void(0)', class: "forbidden", title:"禁用用户",->
            span class:'glyphicon glyphicon-remove-sign', style:'margin-right:15px'
          a href:'javascript:void(0)', class: 'deluser',title:'删除', ->
            span class:'glyphicon glyphicon-trash'
    td class:"userstatus", -> '{{activated}}'
    td -> '{{email}}'
    td -> '{{description}}'

  coffeescript ->
    @pager
    @query =
      destpage: 1,
      pagesize: 15,
      query: '',
      sortflag: 'createdAt',
      ordermode: 'desc'

  script src:"model/user.js"
  script src:"model/users.js"
  script src:"model/node.js"
  script src:"model/nodes.js"
  script src:"view/admin.js"
  script src:"view/login.js"
  script src:"view/node.js"
  script src:"js/common.js"


