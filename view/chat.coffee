doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "聊天室"
    link href:"css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    script src:"js/jquery-1.10.2.js"
    script src:"/socket.io/socket.io.js"
    script src:"js/jquery.cookies.js"
    script src:"model/message.js"

    style ->
      """
       h2 i { font-weight:normal; font-size:10px}
       #left {width:70%; float:left; margin-top:60px; padding:0 20px;}
       #rightside {width:30%; float:left; height:445px; margin-top:60px; background:rgba(100,118,135,0.9);}
       #rightside h4 {width:100%; background:rgba(0,138,0,0.9); padding:0; margin:0; height:40px; line-height:40px; color:white; text-align:center;}
       #right {width:100%; height:100%; over-flow:auto;}
       #prvateBox, #commonBox, #prvateBox {border:1px solid #000; width:100%; height:400px;}
       #right .active { background:rgba(250,104,0,0.9) }
       #right p { cursor: pointer; width:100%; background:rgba(135,121,78,0.9); margin:0; padding:0; padding-left:10px;color:white; height:30px; line-height:30px; border-bottom:1px solid #999;  }
       #commonBox { overflow: auto;  padding:0 10px;}
       #txtInput { width:100%; margin-bottom:10px;}
       """

  body ->

    div class:"navbar navbar-inverse navbar-fixed-top", role:"navigation", ->
      div class:"container", ->
        div class:"navbar-header", ->
          button type:"button", class:"navbar-toggle", 'data-toggle':"collapse", 'data-target':".navbar-collapse", ->
            span class:"sr-only", -> 'Toggle navigation'
            span class:"icon-bar"
            span class:"icon-bar"
            span class:"icon-bar"
          a class:"navbar-brand", href:"#", ->'聊天室'
        div class:"collapse navbar-collapse hide", ->
          ul class:"nav navbar-nav", ->
            li class:"active", ->
              a href:"#", ->
                text '欢迎您，'
                span id:"i-username", -> "#{@userInfo.name}"
    div id:'left', ->
      div id:"commonBox", ->
      textarea id:'txtInput', ->
      button class:"btn btn-lg btn-primary", type:"button", id:'btnSend', onclick:"sendMsg()", ->'发送'
      button class:"btn btn-lg btn-default", style:"margin-left:10px; ",type:"button",  onclick:"$('#txtInput').val('')", ->'清空'
      i  style:"position:relative; top:10px; left:5px;", -> "(按control + enter键发送)"
    div id:'rightside', ->
      h4  ->
        text '聊天室在线人员'
        i style:"font-size:10px; font-weight:normal", ->'(点击选中后私聊)'
      div id:'right', ->

  script src:"/js/chat.js"