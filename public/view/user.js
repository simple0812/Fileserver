UserView = Backbone.View.extend({
    el:"#myModal",

    events: {
	  'blur #txtNewMail': 'validateEmail',
	  'focus #txtNewMail' : 'destroytxtEmail',
      'click #modifyEmail':'modifyEmail',
	  'blur #txtOriginalPassword' : 'validateOriginalPassword',
	  'focus #txtOriginalPassword' : 'destroytxtOriginalPassword',
	  'blur #txtNewPassword' : 'validatePassword',
	  'focus #txtNewPassword' : 'destroytxtPassword',
	  'blur #txtComfirmPassword' : 'confirmPassword',
	  'focus #txtComfirmPassword' : 'destroytxtConfirm',	  
      'click #modifyPassword':'modifyPassword',
      'click #modifyDescription':'modifyDescription'
    },

    initialize: function() {

    },
	validateEmail: function() {
        var regMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var $email = $("#txtNewMail").val().trim();
		var $message="";
		var $flag=true;
		if(!regMail.test($email))  {
		var $message="邮箱格式不正确";
		var $flag=false;
		}
		if(!popBy('#txtNewMail', $flag,$message)) return false;
		return true;
    },
	
	destroytxtEmail:function(){
		popDestroy('#txtEmail');
	},	
    modifyEmail: function() {
        //alert('mail')
        var origEmail = $("#txtOriginalMail").val().trim();
        var newEmail = $("#txtNewMail").val().trim();
		if(!this.validateEmail())
		    return false;
		/*
        if(newEmail.length == 0) return alert('请输入新邮箱');

        var regMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ ;
        if(!regMail.test(newEmail)) return alert('邮箱格式不正确');

        if(newEmail === origEmail) return alert('您的邮箱未修改');
		*/
        $.ajax({
            type: "PUT",
            url: "/user/"+ $.cookie('token') +"/information",
            data: JSON.stringify({email:newEmail}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');				
				$('#modifyEmail').popover('destroy');
				if(json.status == 'fail')
				{
					$('#modifyEmail').popover({
					 placement:'left',
					 trigger:'manual',
					 content:json.result
					 });
					return 	$('#modifyEmail').popover('show');
				}
               // if(json.status == 'fail') return alert(json.result);

                alert(json.result)
                $("#txtOriginalMail").val(newEmail)
                $("#txtNewMail").val('')
                //$(this.el).popover('hide');
                $("#myModal").modal('hide')
            },
            error: function (err) {
                alert(err.responseText)
            }
        });


    },
	validateOriginalPassword: function() {
        var $password = $("#txtOriginalPassword").val().trim();
		//var $confirm = $("#txtConfirm").val().trim();
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
		//if($confirm.length!==0) this.confirmPassword();
        if(!popBy('#txtOriginalPassword', $flag,$message)) return false;
		return true;
    },
	destroytxtOriginalPassword:function(){
		popDestroy('#txtOriginalPassword');
	},		
    validatePassword: function() {
        var $password = $("#txtNewPassword").val().trim();
		//var $confirm = $("#txtConfirm").val().trim();
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
		//if($confirm.length!==0) this.confirmPassword();
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
        //alert('word')
        var oldpassword = $("#txtOriginalPassword").val().trim();
        var newpassword = $("#txtNewPassword").val().trim();
        var confrimPassword = $("#txtComfirmPassword").val().trim();
		if(!this.validateOriginalPassword() || !this.validatePassword() || !this.confirmPassword())
		return false;
		/*
        if(originalPassword.length == 0) return alert('原始密码不能为空');
        if(newPassword.length == 0) return alert('新密码不能为空');
        if(confrimPassword.length == 0) return alert('确认密码不能为空');

        if(confrimPassword !== newPassword) return alert('新密码与确认密码不匹配');
		*/
        $.ajax({
            type: "PUT",
            url: "/user/"+ $.cookie('token')+"/information",
            data: JSON.stringify({oldpassword: hex_md5(oldpassword), newpassword: hex_md5(newpassword)}),
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

                alert(json.result)
				popDestroy('#modifyPassword');
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

    modifyDescription: function() {
        var description = $("#txtDescription").val().trim();

        $.ajax({
            type: "PUT",
            url: "/user/"+ $.cookie('token')+"/information",
            data: JSON.stringify({description:description}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json)  return alert('未知的错误');
				$('#modifyDescription').popover('destroy');
				if(json.status == 'fail')
				{
					$('#modifyDescription').popover({
					 placement:'left',
					 trigger:'manual',
					 content:json.result
					 });
					return 	$('#modifyDescription').popover('show');
				}

                alert(json.result)
                $("#myModal").modal('hide')
            },
            error: function (err) {
                alert(err.responseText)
            }
        });

    }

})

var userView = new UserView;