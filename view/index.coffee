doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf8'
    link href:"css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"css/common.css", rel:"stylesheet", media:"screen"
    link href:"css/pager.css", rel:"stylesheet", media:"screen"
    link href:"css/style.css", rel:"stylesheet", media:"screen"
    link href:"css/jquery.fileupload.css", rel:"stylesheet", media:"screen"
    title 'GBOX'
    script src:"js/jquery-1.10.2.js"
    script src:"js/underscore.js"
    script src:"js/backbone.js"
    script src:"js/bootstrap.min.js"
    script src:"js/md5.js"
    script src:"js/jquery.cookies.js"
    script src:"js/filesize.min.js"
    script src:"js/util.js"
    script src:"js/pager.js"
    coffeescript ->
      $ -> fileUpload()

  body style:"padding-top:70px;", ->
    div class:"modal fade", id:"Newfolder", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title", id:"myNewfolderLabel", ->
              text '新建文件夹'
          div class:"modal-body", ->
            input type:"text", class:"form-control", id:"foldername", placeholder:"请输入文件(夹)名", ->
            div class:"col-sm-offset-9 diabtnfix", ->
              button type:"button", id:'btnNewfolder', class:"btn btn-primary ", onclick:"createDir()",->
                text '确定'
              button type:"button", class:"btn btn-default sp-btnfix", 'data-dismiss':"modal",->
                text '关闭'
    div class:"modal fade", id:"Renamefolder", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title ", id:"myRenamefolder", ->
              text '重命名'
          div class:"modal-body", ->
            div class:"input-group ", ->
              input type:"text", class:"form-control", id:"txtRenamefolder", placeholder:"请输入文件(夹)名",  ->
              span class:"input-group-addon",id:"postifx", ->
            div class:"col-sm-offset-9 diabtnfix", ->
              button type:"button", id:'btnRenamefolder', class:"btn btn-primary ",onclick:"renameFolder()", ->
                text '确定'
              button type:"button", class:"btn btn-default sp-btnfix", 'data-dismiss':"modal",->
                text '关闭'
    div class:"modal fade", id:"Movefile", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", style:'position:relative', ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title ", id:"myMovefile",  ->
              text '移动文件'
          div class:"modal-body", ->
            ul class:'nav', id:"dirlist", style:' overflow: hidden', ->
          div class:"modal-footer",->
            button type:"button", id:'btnMoveFolder', class:"btn btn-primary ",onclick:"moveFolder()", ->
              text '确定'
            button type:"button", class:"btn btn-default ", 'data-dismiss':"modal",->
              text '关闭'
    div class:"modal fade", id:"Sharefile", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", style:'position:relative', ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title ", id:"mySharefile",  ->
              text '分享文件'
          div class:"modal-body", style:"height:200px", ->
            ul class:"nav nav-pills",id:"sharetabs", ->
              li class:"active", ->
                a href:"#pubshare", 'data-toggle':"tab", ->'公共分享'
              li ->
                a href:"#prishare", 'data-toggle':"tab", ->'私密分享'
            div class:"tab-content ", style:"margin-top:50px;", ->
              div class:"tab-pane fade in active",id:"pubshare", ->
                button class :"btn btn-primary",id:"btnpubshare", ->'创建公共链接'
                div class:"input-group", id:"divpubshare", style:"display:none", ->
                  span class:"input-group-addon", ->'公开链接'
                  input type:"text", class:"form-control ", id:"txtpubshare", placeholder:"请输入文件(夹)名", ->
              div class:"tab-pane fade ",id:"prishare", ->
                button class :"btn btn-primary",id:"btnprishare", ->'创建私密链接'
                div id:"divprishare", style:"display:none", ->
                  div class:"input-group col-sm-12 formConFix", ->
                    span class:"input-group-addon", ->'私密链接'
                    input type:"text", class:"form-control ", id:"txtprishare", placeholder:"请输入文件(夹)名",  ->
                  div class:"input-group col-sm-4 ", ->
                    span class:"input-group-addon", ->'提取密码'
                    input type:"text", class:"form-control ", id:"txtpricode", placeholder:"请输入文件(夹)名",  ->
          div class:"modal-footer",->
            button type:"button", id:'btnComShare', class:"btn btn-primary ", style:"display:none", ->
              text '确定'
            button type:"button", class:"btn btn-default ", 'data-dismiss':"modal",->
              text '关闭'

    div class:"modal fade", id:"Pridown", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
      div class:"modal-dialog", ->
        div class:"modal-content", style:'position:relative', ->
          div class:"modal-header", ->
            button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
              text '&times;'
            h4 class:"modal-title ", id:"myPridown",  ->
              text '私密下载'
          div class:"modal-body",style:"height:60px",  ->
            div class:"input-group col-sm-6 ", ->
              span class:"input-group-addon", ->'提取密码'
              input type:"text", class:"form-control ", id:"txtPridown", placeholder:"请输入提取密码",  ->
          div class:"modal-footer",->
            button type:"button", id:'btnPridown', class:"btn btn-primary ",  ->
              text '确定'
            button type:"button", class:"btn btn-default ", 'data-dismiss':"modal",->
              text '关闭'
    nav class:"navbar navbar-inverse navbar-fixed-top", role:"navigation", ->
      div class:"navbar-header", ->
        a class:"navbar-brand", href:"#", -> 'GBOX'
      div class:"collapse navbar-collapse", id:"bs-example-navbar-collapse-1", ->
        ul class:"nav navbar-nav navbar-right", ->
          li class:"dropdown", ->
            a href:'javascript:void(0)', class:"dropdown-toggle", 'data-toggle':"dropdown", ->
              b id: "usertype", style:"display:none", -> @userInfo.type if @userInfo?.type?
              b id: "username", -> @userInfo.name if @userInfo?.name?
              b class:"caret"
            ul class:"dropdown-menu", ->
              li ->
                a href:'javascript:void(0)', onclick:"modalIputFocus('#myModal', '#txtNewMail')", -> '修改个人信息'
              li class:'divider', ->
              li ->
                a href:'/logout', -> '退出'

    div class:"col-sm-2", id:"sidebar", role:"navigation", ->
      div class:"list-group", ->
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'all', class:"list-group-item active", ->
          span class:"glyphicon glyphicon-home", ->
          text ' 全部文件'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'pic', class:"list-group-item ", ->
          span class:"glyphicon glyphicon-picture", ->
          text ' 图片'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'doc', class:"list-group-item ", ->
          span class:"glyphicon glyphicon-file", ->
          text ' 文档'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'video', class:"list-group-item ", ->
          span class:"glyphicon glyphicon-facetime-video", ->
          text ' 视频'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'other', class:"list-group-item ", ->
          span class:"glyphicon glyphicon-plus", ->
          text ' 其他'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'share', class:"list-group-item ",id:'myshare', ->
          span class:"glyphicon glyphicon-send", ->
          text ' 我的分享'
        a href:"javascript:void(0)", onclick:"turn(this)", showflag:'othershare', class:"list-group-item ", id:'oshare',  ->
          span class:"glyphicon glyphicon-shopping-cart", ->
          text ' 他人分享'
      div ->
        div id:"usageRate", class:"progress", currentSize:"#{@userInfo.currentSize}", totalSize:"#{@userInfo.totalSize}",->
          div class:"progress-bar progress-bar-primary", 'ria-valuenow':"60", 'aria-valuemin':"0", 'aria-valuemax':"100",style:"width: #{@userInfo.currentSize*100/@userInfo.totalSize}%;",->
       # text "#{filesize(@userInfo.currentSize)}/#{filesize(@userInfo.totalSize)}"
        p style:'position:relative; top: -15px;', ->
          span id:'currentSize', ''
          text '/'
          span id:'totalSize', ''
        coffeescript ->
          currsize = $('#usageRate').attr('currentSize')
          totalsize = $('#usageRate').attr('totalSize')
          $('#currentSize').html (filesize(currsize).toUpperCase())
          $('#totalSize').html (filesize(totalsize).toUpperCase())


    div class:"col-sm-10", id:'nodefield', ->
      div class:"row ", id:"operateFilearea", ->
        div class:"col-sm-8", ->
          form id:'uploadForm', ->
            span class: 'btn btn-primary fileinput-button', ->
              i class:"glyphicon glyphicon-upload"
              span -> ' 上传文件'
              input id:"fileupload", type:"file", name:"files[]", multiple: 'multiple', style: 'width: 90px; height: 30px; display: block;'
            button type:"button",  class:"btn btn-default sp-btnfix", id:'btnNewF',onclick:"modalIputFocus('#Newfolder', '#foldername')", ->
              span class:"glyphicon glyphicon-folder-close", ->
              text ' 新建文件夹'
            button type:"button", class:"btn btn-default sp-btnfix",  id:'btnDeleteFile', ->
              span class:"glyphicon glyphicon-trash", ->
              text ' 删除'
            button type:"button", class:"btn btn-default sp-btnfix", id:'btnMoveFile',  ->
              span class:"glyphicon glyphicon-move", ->
              text ' 移动'
            button type:"button", class:"btn btn-default sp-btnfix", id:'btnDownFiles',  onclick:'downloadFiles(this)', ->
              span class:"glyphicon glyphicon-download", ->
              text ' 下载'

            button type:"button", class:"btn btn-default sp-btnfix", id:'btnShareFile',style:'display:none', ->
              span class:"glyphicon glyphicon-share-alt", ->
              text ' 分享'
        div class:"form-group col-sm-3", ->
          input type:"text", class:"form-control", id:"txtSearchFile",placeholder:"请输入文件名", ->
        button type:"submit", class:"btn btn-default",id:"btnSearchFile", ->'搜索'
      div id:"progress", class:"progress",style:"display:none", ->
        div class:"progress-bar progress-bar-primary"
      div id:"files", class:"files"

      div class:"modal fade", id:"myModal", 'tabindex':"-1", 'role':"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true", ->
        div class:"modal-dialog", ->
          div class:"modal-content", ->
            div class:"modal-header", ->
              button type:"button",class:"close",'data-dismiss':"modal",'aria-hidden':"true", ->
                text '&times;'
              h4 class:"modal-title", id:"myModalLabel", ->
                text '修改个人信息'
            div class:"modal-body", ->
              form class:"form-horizontal", id: 'email', ->
                h5 class:"modal-title", style:"margin-bottom:10px;", -> '修改邮箱:'
                input type:"text", class:"form-control formConFix", id:"txtOriginalMail", placeholder:"原邮箱", disabled:'true',
                value:"#{@userInfo.email if @userInfo?.email?}", ->
                input type:"text", class:"form-control formConFix", id:"txtNewMail", placeholder:"请输入新邮箱", ->
                button type:"button", id:'modifyEmail', class:"btn btn-primary col-sm-offset-10",->
                  text '保存修改'
              form class:"form-horizontal", id: 'password', style: 'margin-top: 10px', ->
                h5 class:"modal-title", style:"margin-bottom:10px;", -> '修改密码:'
                input type:"password", class:"form-control formConFix", id:"txtOriginalPassword", placeholder:"请输入原密码", ->
                input type:"password", class:"form-control formConFix", id:"txtNewPassword", placeholder:"请输入新密码", ->
                input type:"password", class:"form-control formConFix", id:"txtComfirmPassword", placeholder:"请确认新密码", ->
                button type:"button", id:'modifyPassword', class:"btn btn-primary col-sm-offset-10",->
                  text '保存修改'
              form class:"form-horizontal", id: 'description', style: 'margin-top: 10px', ->
                h5 class:"modal-title", style:"margin-bottom:10px;", -> '修改个人注释:'
                textarea rows:"3", class:"form-control formConFix", id:"txtDescription", placeholder:"请输入个人注释", ->
                  @userInfo.description if @userInfo?.description?
                button type:"button",id:'modifyDescription',  class:"btn btn-primary col-sm-offset-10",->
                  text '保存修改'
            div class:"modal-footer",->
              button type:"button", class:"btn btn-default", 'data-dismiss':"modal",->
                text '关闭'
      ol class:"breadcrumb", id:'nodenav', 'nodeid':"#{@userInfo.nodeid}", 'nodepath':"#{@userInfo.nodepath}", ->
        li -> a href:'javascript:void(0)', 'nodeid':"#{@userInfo.nodeid}", 'nodepath':"#{@userInfo.nodepath}",onclick:"showpath(this)", ->'全部文件'
      div class:"row taoverfix", ->
        table class:"table table-hover ",id:"filelist",->
          tr id:'filelisthead', ->
            th class:"col-sm-5 dropup thsortbyname", style:'cursor:pointer', enabled:'enabled', ->
              div class:'dropdowm', ->
                span class:"col-sm-1", ->
                  input type:"checkbox", id:'allFile', ->
                span class:"col-sm-4 ", ->
                  text '文件名'
                  b class:"caret", style:'display:none'
            th class:"col-sm-2 dropup thsortbysize", style:'cursor:pointer', ->
              text '大小'
              b class:" caret", style:'display:none'
            th class:"col-sm-2 dropdown thsortbycreatedAt", style:'cursor:pointer', ->
              text '修改日期'
              b class:" caret", style:'display:none'
            th class:"col-sm-1 dropdown belonges", style:'display:none',  ->
             text '上传者'
            th class:"col-sm-2", id:'filedir', style:'display:none',  ->'所在目录'
        div style:'text-align:center;', class:'page_y', id:'pager', ->
  script type:"text/template", id:"filetemp", style:"display:none", ->
    td ->
      div class:'dropdowm', ->
        span class:"col-sm-1 ", ->
          input type:"checkbox",value:"{{id}}", class: 'chkFileItem'
        div class:"col-sm-1 ", ->
          div class:"sharefix", ->
            b class :"shareloack ", ->
            b class:" typepic ", ->
        span class:"col-sm-10 sp-filename ", nodetype:'{{type}}', title:'{{name}}', -> '{{linkcheck}}'
        span class:"col-sm-4 fileoper", style:'display:none;text-align:right;', ->
          a href:'javascript:void(0)', class: 'delfile',title:'删除', ->
            span class:'glyphicon glyphicon-trash', style:'margin-right:10px'
          a href:'javascript:void(0)', class: 'downfile',title:'下载', ->
            span class:'glyphicon glyphicon-download', style:'margin-right:10px'
          a href:'javascript:void(0)', class: 'sharefile', ->
            span class:'glyphicon ', style:'margin-right:10px'
          a href:'javascript:void(0)',class:"dropdown-toggle moreop", 'data-toggle':"dropdown",title:'更多操作', ->
            span class:'glyphicon glyphicon-chevron-down',  ->
              ul class:"dropdown-menu",style:"min-width:80px;margin-left:150px;", ->
                li ->
                  a href:'javascript:void(0)',class:'Movefile','data-toggle':"modal", 'data-target':"#Movefile", -> '移动到'
                li class:'divider', ->
                li ->
             #     a href:'javascript:void(0)',class:'renameFile','data-toggle':"modal", 'data-target':"#Renamefolder", -> '重命名'
                  a href:'javascript:void(0)',class:'renameFile',onclick:"modalIputFocus('#Renamefolder', '#txtRenamefolder')", -> '重命名'
      div class:'nodeurl',style:"display:none", ->
    #  div class:'nodeurl ', ->
        #a href:"atbb.html", ->'a.html'
    td class:"userstatus", -> '{{size}}'
    td -> '{{mtime}}'
    td class:'belonges',style:'display:none', -> '{{belongs}}'
    td class:'filedir',style:'display:none', -> '{{path}}'
  script type:"text/template", id:"dirlisttemp", style:"display:none", ->
    div ->
      span class:' col-sm-offset-1  selectedfile'
      b class:'moveFileImg', ->
      a href:'javascript:void(0)', 'nodeid':"{{id}}", 'nodepath':"{{path}}", class:'moveTo', ->"#{if '{{name}}' is 'root' then '全部文件' else '{{name}}'}"

  coffeescript ->
    @pager
    @query =
      destpage: 1,
      pagesize: 15,
      query: '',
      sortflag: 'createdAt',
      ordermode: 'desc'
  script src:"model/node.js"
  script src:"model/nodes.js"
  script src:"view/user.js"
  script src:"view/node.js"
  script src:"js/jquery.iframe-transport.js"
  script src:"js/vendor/jquery.ui.widget.js"
  script src:"js/jquery.fileupload.js"
  script src:"js/common.js"


