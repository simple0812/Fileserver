Node = Backbone.Model.extend({

 //  url: '/regist',
    initialize: function() {

    },
    deleteNode: function(ids, el) {
        $.ajax({
            type: "DELETE",
            url: "/nodes/"+ $.cookie('token'),
            data: JSON.stringify(ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
                if(json.status == 'fail') return alert(json.result);

                $('.chkFileItem:checked').parent().parent().parent().parent().remove();
                $("#allFile").prop('checked', false);
                if(el) $(el).remove();
                for(var i = 0, len = ids.length; i < len; i++) {

                    var $node =  nodes.get(ids[i]);
                    $node=$node.toJSON();
                    rmNode($node);
                }
                var currentSize=$('#usageRate').attr('currentSize');
                var totalSize=$('#usageRate').attr('totalSize');
                $('#usageRate').children().width(currentSize*100/totalSize + '%');
                $('#currentSize').html (filesize(currentSize));

            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    },
    moveNode:function(ids,idto) {
        $.ajax({
            type: "put",
            url: "/box/"+ $.cookie('token')+"/move",
            data: JSON.stringify({ids: ids, to: idto}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
                if(json.status == 'fail') return alert(json.result);
                window.location.reload();
            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    },
    shareNode: function(flag,ids,code) {
        $.ajax({
            type: "put",
            url:"/box/"+$.cookie('token')+"/share",
            data: JSON.stringify({shared: flag, ids: ids,code:code}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
                if(json.status == 'fail') return alert(json.result);
                alert(json.result)
                $('.chkFileItem:checked').parent().parent().parent().parent().remove();
                $("#allFile").prop('checked', false);
                for(var i = 0, len = ids.length; i < len; i++) {
                    var $node =  nodes.get(ids[i])
                    $node.set('shared',flag);
                    $node.set('_authCode',code);
                }

            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    }
})
