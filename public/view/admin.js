ModifyAdminView = Backbone.View.extend({
    el:"#myModal",

    events: {
	    'blur #txtOriginalPassword' : 'validateOriginalPassword',
	    'focus #txtOriginalPassword' : 'destroytxtOriginalPassword',	
		'blur #txtNewPassword' : 'validatePassword',
		'focus #txtNewPassword' : 'destroytxtPassword',
		'blur #txtComfirmPassword' : 'confirmPassword',
		'focus #txtComfirmPassword' : 'destroytxtConfirm',	  
		'click #modifyPassword':'modifyPassword',
        'keypress': 'modifyPasswordByEnter'
    },

    initialize: function() {

    },
	validateOriginalPassword: function() {
        var $password = $("#txtOriginalPassword").val().trim();
		var $message="";
		var $flag=true;
		if($password === '') {
			$message="原始密码不能为空";
			$flag=false;
		}
		else if($password.length<4)
		{
			$message="原始密码长度不能小于4";
			$flag=false;
		}
        if(!popBy('#txtOriginalPassword', $flag,$message)) return false;
		return true;
    },
	destroytxtOriginalPassword:function(){
		popDestroy('#txtOriginalPassword');
	},		
	validatePassword: function() {
        var $password = $("#txtNewPassword").val().trim();
		var $message="";
		var $flag=true;
		if($password === '') {
			$message="新密码不能为空";
			$flag=false;
		}
		else if($password.length<4)
		{
			$message="新密码长度不能小于4";
			$flag=false;
		}
        if(!popBy('#txtNewPassword', $flag,$message)) return false;
		return true;
    },
	
	destroytxtPassword:function(){
		popDestroy('#txtNewPassword');
	},		
    confirmPassword: function() {
        var $password = $("#txtNewPassword").val().trim();
        var $confirm = $("#txtComfirmPassword").val().trim();
		var $message="";
		var $flag=true;
		if($confirm.length == 0) {
			$message="再次输入密码不能为空";
			$flag=false;
		}
		else if($password != $confirm ) {
			$message="两次输入的密码不匹配";
			$flag=false;
		}
		if(!popBy("#txtComfirmPassword",$flag,$message)) return false;
		return true;
    },
	
	destroytxtConfirm:function(){
		popDestroy('#txtComfirmPassword');
	},	
    modifyPassword: function() {
        var $origPassword = $("#txtOriginalPassword").val().trim();
        var $newPassword = $("#txtNewPassword").val().trim();
        var $comfirmPassword = $("#txtComfirmPassword").val().trim();

		if(!this.validateOriginalPassword() || !this.validatePassword() || !this.confirmPassword())
		return false;
        $.ajax({
            type: "PUT",
            url: "/user/" + $.cookie('token') + '/information',
            data: JSON.stringify({oldpassword: hex_md5($origPassword), newpassword: hex_md5($newPassword)}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
				$('#modifyPassword').popover('destroy');
				if(json.status == 'fail')
				{
					$('#modifyPassword').popover({
					 placement:'left',
					 trigger:'manual',
					 content:json.result
					 });
					return 	$('#modifyPassword').popover('show');
				}

                alert("修改成功")
                $("#myModal").modal('hide')
                $("#txtOriginalPassword").val('');
                $("#txtNewPassword").val('');
                $("#txtComfirmPassword").val('');				
            },
            error: function (err) {
                alert(err.responseText)
            }
        });

    },
    modifyPasswordByEnter: function(e) {
        if(e.keyCode != 13) return;
        this.modifyPassword();
    }


})

UsersView = Backbone.View.extend({
    el:"#userlist",

    events: {
        'click #allUser': 'selectAllUser',
        'click .chkUserItem': 'selectOneUser'
    },

    initialize: function() {
        this.render();
    },

    render: function() {

        users.fetch({url:'/users',
            success:function(collection,res){
                _.templateSettings = {
                    interpolate : /\{\{(.+?)\}\}/g
                };
                $.each(collection.models, function(i, o) {
                    var view = new ItemView({model:o});
                    $("#userlist").children().append(view.render().el);
                })
            },
            error:function(){
                alert('error');
            }
        })
    },

    selectAllUser: function() {
        if($("#allUser:checked").length > 0)
            $(".chkUserItem").prop('checked',true)
        else
            $(".chkUserItem").prop('checked',false)
    },

    selectOneUser: function() {
        if($(".chkUserItem:checked").length == $(".chkUserItem").length)
            $("#allUser").prop('checked',true)
        else
            $("#allUser").prop('checked',false)
    }

})

ItemView = Backbone.View.extend({
    tagName:"tr",
    events: {
        'mouseover': 'showOper',
        'mouseout': 'hideOper',
        'click .deluser': 'delUser',
        'click .activated': 'activateUser',
        'click .forbidden': 'forbidUser',
        'click .sp-username': 'showUserNodes'
    },

    initialize: function() {

    },

    render: function() {

        var tempMode = this.model.toJSON()
        var $temp = _.template($('#usertemp').html(),
           {id:tempMode.id, name: tempMode.name, email: tempMode.email, description: tempMode.description, activated:tempMode.activated});

        $(this.el).html($temp);

        $(this.el).find(".userstatus").html(tempMode.activated ? '已激活' : '已禁用');
        if(!tempMode.activated){
            $(this.el).find('.forbidden').hide()
            $(this.el).find('.activated').show()
        }
        else {
            $(this.el).find('.forbidden').show()
            $(this.el).find('.activated').hide()
        }

        return this;
    },

    showOper: function() {
        $(this.el).find('.useroper').show()
    },

    hideOper: function() {
        $(this.el).find('.useroper').hide()
    },

    delUser: function() {
        if(confirm("确认删除吗？")) {
            new User().deleteUser([this.model.id], this.$el);
        }

    },

    activateUser: function() {
        new User().activated([$(this.el).find('.chkUserItem').val()], true);
    },

    forbidUser: function() {
        new User().activated([$(this.el).find('.chkUserItem').val()], false);
    },

    showUserNodes: function(e) {
        e = window.event || e;
        var target = e.target || e.srcElement;
        $("#pager").hide()
        $('#nodenav').show();
        var $id = $(this.el).find(':checkbox').val();
        $("#nodefield").show().siblings('.col-sm-10').hide();
        $("#txtSearchFile").val('')

        nodes.fetch({url:'/box/'+$id,
            success:function(collection, res){

                _.templateSettings = {
                    interpolate : /\{\{(.+?)\}\}/g
                };
                var $rootNode = collection.models[0];
                var $rootId = $rootNode.get('id');
                var $rootPath = $rootNode.get('path');

                $('#nodenav').attr('nodeid', $rootId).attr('nodepath', $rootPath)
                .children().first().children('a').attr('nodeid', $rootId).attr('nodepath', $rootPath);

                var $firstNodes = collection.filter(function(node) {
                    return node.get('pid') === $rootId;
                })

                $("#filelist").children().children().first().siblings().remove();

                $.each($firstNodes, function(i, o) {
                    var view = new NodeItemView({model: o});
                    $("#filelist").children().append(view.render().el);
                })

            },
            error:function(){
                alert('error');
            }
        })
    }
})

OprateView = Backbone.View.extend({
    el:"#operatearea",
    events: {
        'click #btnSearch': 'searchUser',
        'input #txtSearchName': 'searchUser',
        'propertychange #txtSearchName': 'searchUser',
        'click #btnActivate': 'activateUser',
        'click #btnForbid': 'forbidUser',
        'click #btnDelete': 'deleteUser'
    },

    initialize: function() {

    },

    searchUser: function() {
        $("#userlist").children().children().first().siblings().remove()
        var query = $("#txtSearchName").val().trim();
        var $destUsers = users.filter(function(user) {
            if(query.length == 0) return true;
            return user.get('name').indexOf(query) > -1 || user.get('email').indexOf(query) > -1
        })
        $.each($destUsers, function(i, o) {
            var view = new ItemView({model:o});
            $("#userlist").children().append(view.render().el);
        })
    },

    searchByEnter: function(e) {
        e = window.event || e
        if (e.keyCode == 13) {
            this.searchUser();
        }
    },

    activateUser: function() {
        var $ids = [];
        $(".chkUserItem:checked").each(function(i, o) {
            if($(o).parent().parent().parent().next().html() == '已禁用')
                $ids.push($(o).val());
        })
        if($ids.length == 0) {
            alert('请选择您要激活的用户');
            $(":checkbox:checked").prop('checked', false);
            return;
        }
        if(confirm("确认激活用户吗？")) {
            new User().activated($ids, true);
        }

    },
    forbidUser: function() {
        var $ids = [];
        $(".chkUserItem:checked").each(function(i, o) {

            if($(o).parent().parent().parent().next().html() == '已激活')
                $ids.push($(o).val());
        })
        if($ids.length == 0) {
            alert('请选择您要禁用的用户');
            $(":checkbox:checked").prop('checked', false);
            return;
        }
        if(confirm("确认禁用用户吗？")) {
            new User().activated($ids, false);
        }

    },

    deleteUser: function() {
        var $ids = [];
        $(".chkUserItem:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return alert('请选择您要删除的用户');
        if(confirm("确认删除吗？")) {
            new User().deleteUser($ids);
        }
    }
})


var modifyAdminView = new ModifyAdminView;
var usersView = new UsersView;
var oprateView = new OprateView;
