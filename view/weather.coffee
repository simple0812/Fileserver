doctype 5
html ->
  head ->
    meta name:"viewport", content="width=device-width, initial-scale=1.0", charset:'utf-8'
    link href:"/css/bootstrap.min.css", rel:"stylesheet", media:"screen"
    link href:"/css/common.css", rel:"stylesheet", media:"screen"
    title '天气信息输入'
    script src:"/js/jquery-1.10.2.js"
    script src:"/js/bootstrap.min.js"
    coffeescript ->
      popoverUtil = (obj, message, time) ->
        $(obj).popover('destroy')
        time = time || 1000
        $(obj).popover {placement:'bottom',trigger:'manual',content: message}
        $(obj).popover('show')
        hide = ->
          $(obj).popover('hide')
        setTimeout hide, time

      @addWeather = (e) ->
        #alert($('#weatherSel').val())
        weather = $('#weatherSel').val()
        maxTempture = $('#maxTempTxt').val()
        minTempture = $('#minTempTxt').val()
        reg = /^-?\d+$/

        return popoverUtil "#maxTempTxt", "最高温度格式不正确", 5000 unless maxTempture.match(reg)
        return popoverUtil "#maxTempTxt", "最高温度过大", 5000 if maxTempture > 70
        return popoverUtil "#minTempTxt", "最低温度格式不正确", 5000 unless minTempture.match(reg)
        return popoverUtil "#minTempTxt", "最低温度过小", 5000 if minTempture < -70

        return popoverUtil "#minTempTxt", "最低温度不能大于最高温度", 5000 if parseInt(maxTempture) < parseInt(minTempture)

        $.post '/weather', {weather:weather, maxtemperature: maxTempture, mintemperature: minTempture}, (json) ->
          return popoverUtil "#weatherBtn", "未知错误" unless json?
          return popoverUtil "#weatherBtn", json.result if(json.status is 'fail')
          popoverUtil "#weatherBtn", '设置成功'


  body ->
    div class:"navbar navbar-inverse navbar-fixed-top", role:"navigation", ->
      div class:"container", ->
        div class:"navbar-header", ->
          button type:"button", class:"navbar-toggle", 'data-toggle':"collapse", 'data-target':".navbar-collapse", ->
            span class:"sr-only", -> 'Toggle navigation'
            span class:"icon-bar"
            span class:"icon-bar"
            span class:"icon-bar"
          a class:"navbar-brand", href:"#", ->'天气信息'
        div class:"collapse navbar-collapse hide", ->
          ul class:"nav navbar-nav", ->
    div class:"container", id:'weatherBody',style:'margin-top:80px;',   ->
      form class:"form-horizontal col-sm-8 col-sm-push-3", ->
        h2 class:"form-signin-heading col-sm-offset-3", -> ''
        div class:"form-group", ->
          label for:"weatherSelect", class:"col-sm-3 control-label", ->'天气情况：'
          div class:"col-sm-5", ->
            select class:"form-control", id:'weatherSel', weather:"#{@weather.weather}", ->
              option ->'晴'
              option ->'雾'
              option ->'阴天'
              option ->'多云'
              option ->'暴雪'
              option ->'阵雪'
              option ->'大雪转暴雪'
              option ->'大雪'
              option ->'中雪转大雪'
              option ->'中雪'
              option ->'小雪转中雪'
              option ->'小雪'
              option ->'雷阵雨加雪'
              option ->'雨夹雪'
              option ->'冻雨'
              option ->'暴雨'
              option ->'暴雨转大暴雨'
              option ->'超大暴雨'
              option ->'雷阵雨'
              option ->'大暴雨'
              option ->'大暴雨转超大暴雨'
              option ->'大雨转暴雨'
              option ->'大雨'
              option ->'阵雨'
              option ->'中雨转大雨'
              option ->'中雨'
              option ->'小雨转中雨'
              option ->'小雨'
              option ->'浮尘'
              option ->'扬沙'
              option ->'沙尘暴'




              option ->'超沙尘暴'
            coffeescript ->
              $('#weatherSel').val($('#weatherSel').attr('weather'))
        div class:"form-group", ->
          label for:"maxTempTxt", class:"col-sm-3 control-label", ->'最高温度：'
          div class:"col-sm-5", ->
            input type:"text", value:"#{@weather.maxtemperature}", class:"form-control", id:'maxTempTxt', placeholder:'请输入最高温度', ->

        div class:"form-group", ->
          label for:"minTempTxt", class:"col-sm-3 control-label", ->'最低温度：'
          div class:"col-sm-5", ->
            input type:"text", class:"form-control ", id:'minTempTxt', value:"#{@weather.mintemperature}", placeholder:'请输入最低温度', ->

        div class:"form-group", ->
          div class:"col-sm-5 col-sm-offset-3", ->
            button class:"btn btn-lg btn-primary col-sm-12", id:"weatherBtn", onclick:"addWeather()", type:"button",  ->'确定'
