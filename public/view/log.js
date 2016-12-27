LogView = Backbone.View.extend({
    el:"#logList",

    events: {
    },

    initialize: function() {
        this.render();
    },
    render: function() {
        logs.fetch({url:'/log',
            success:function(collection,res){
                _.templateSettings = {
                    interpolate : /\{\{(.+?)\}\}/g
                };
            },
            error:function(){
                alert('error');
            }
        });
//        var log=new Log;
//        logs.add(log);
//        var log=new Log;
//        log.set({message:'下载'});
//        logs.add(log);
    },
    logItem:function(logs) {
        $("#logList").children().children().first().siblings().remove();
        $.each(logs, function(i, o) {
            var view = new LogItemView({model:o});
            $("#logList").children().append(view.render().el);

        })
    }
})

LogItemView = Backbone.View.extend({
    tagName:"tr",

    events: {
    },

    initialize: function() {

    },
    render: function() {
        var tempMode = this.model.toJSON();
        var $temp = _.template($('#logTemplate').html(),
            {filename:tempMode.filename, message: tempMode.message, timestamp: tempMode.timestamp,
                username: tempMode.username, NID:tempMode.NID});
        $(this.el).html($temp);
        switch (tempMode.message) {
            case '上传':$(this.el).css('background','#F08080');break;
            case '下载':$(this.el).css('background','#90EE90');break;
            default :alert("message错误");break;
        }
        return this;
    }
})

OprateLogView = Backbone.View.extend({
    el:"#operateLogArea",
    events: {
        'input #searchLogTxt': 'searchLogByInput',
        'prototypechange #searchLogTxt': 'searchLogByInput',
        'click #searchLogBtn': 'searchLog'
    },

    initialize: function() {
    },
//    log5D:function() {
//        $("#log5dBtn").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
//        var $logs = this.getlogs(function(log) {
//            var b = new moment() - 5 * 24 * 60 * 60 * 1000;
//            var c = new moment(log.get('timestamp'));
//            return c>b ;
//        });
//        logView.logItem($logs);
//    },
//    log15D:function() {
//        $("#log15dBtn").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
//        var $logs = this.getlogs(function(log) {
//            var b = new moment() - 15 * 24 * 60 * 60 * 1000;
//            var c = new moment(log.get('timestamp'));
//            return c>b ;
//        });
//        logView.logItem($logs);
//    },
//    log30D:function() {
//        $("#log30dBtn").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
//        var $logs = this.getlogs(function(log) {
//            var b = new moment() - 30 * 24 * 60 * 60 * 1000;
//            var c = new moment(log.get('timestamp'));
//            return c>b ;
//        });
//        logView.logItem($logs);
//    },

    getlogs:function($condition) {
        return logs.filter($condition);
    },
    searchLog: function() {
        var $logs = this.getlogs(function(log) {
            return log.get('message').indexOf($("#searchLogTxt").val().trim())>-1
                || log.get('username').indexOf($("#searchLogTxt").val().trim())>-1
                || log.get('filename').indexOf($("#searchLogTxt").val().trim())>-1 ;
        });
        logView.logItem($logs);
    },
    searchLogByInput: function() {

        if($("#adminUsers").hasClass('active')) return;
        if($("#adminNodes").hasClass('active')) return;
        this.searchLog();
    }
})

var logView = new LogView;
var oprateLogView=new OprateLogView;

