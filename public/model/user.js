User = Backbone.Model.extend({

    url: '/register',

    initialize: function() {

    },
    login: function(user) {
        $.post('/login', user, function(json) {
            if(!json) return alert('未知错误');
            if(json.status == 'fail') 
			{
				$('#btnLogin').popover('destroy');
				$('#btnLogin').popover({
				 placement:'bottom',
				 trigger:'manual',
				 content:json.result
				 });
				return 	$('#btnLogin').popover('show');
			}
            if(json.result.type == 'normal') {
                window.location.href = '/'
            }
            else {
                window.location.href = '/admin'
            }

        })
    },
    activated: function(ids, flag ) {

        $json = {activate: flag, ids: ids};

        $.ajax({
            type: "PUT",
            url: "/user/activate",
            data: JSON.stringify($json),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
                if(json.status == 'fail') return alert(json.result);

                alert('修改成功')

                for(var i = 0, len = ids.length; i < len; i++) {

                    $(":checkbox[value="+ids[i]+"]").parent().parent().parent()
                        .next().html(flag? '已激活' : '已禁用');

                    $(":checkbox").prop('checked', false);


                    if(flag){
                        $(":checkbox[value="+ids[i]+"]").parent().siblings('.useroper')
                            .children('.activated').hide().siblings('.forbidden').show();

                        users.models[i].set('activated',true)
                    }

                    else {
                        $(":checkbox[value="+ids[i]+"]").parent().siblings('.useroper')
                            .children('.activated').show().siblings('.forbidden').hide();

                        users.models[i].set('activated',false)

                    }


                    //alert(users.models[i].get('name'))
                }
            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    },

    deleteUser: function(ids, el) {
        $.ajax({
            type: "DELETE",
            url: "/user",
            data: JSON.stringify(ids),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
                if(json.status == 'fail') return alert(json.result);

                alert('删除成功')
                $('.chkUserItem:checked').parent().parent().parent().parent().remove();
                $("#allUser").prop('checked', false);
                if(el) $(el).remove();

                for(var i = 0, len = ids.length; i < len; i++) {

                   var $user =  users.filter(function(user) {
                        return user.get('id') == ids[i]
                    })

                   users.remove($user);
                }

            },
            error: function (err) {
                alert(err.responseText)
            }
        });
    }
})