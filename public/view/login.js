

LoginView = Backbone.View.extend({
    el:"#container",

    events:{
        'blur #txtName': 'validateName',
		'focus #txtName' : 'destroytxtName',
        'blur #txtPassword' : 'validatePassword',
        'focus #txtPassword' : 'destroytxtPassword',
        'click #btnLogin' : 'login',
        'blur #txtConfirm' : 'confirmPassword',
        'focus #txtConfirm' : 'destroytxtConfirm',
        'blur #txtEmail': 'validateEmail',
        'focus #txtEmail' : 'destroytxtEmail',
        'click #btnRegist' : 'regist',
        'click #btnCreate' : 'createUser',
		'keypress'  : "loginOnEnter"

    },
	
    initialize: function() {
    },
	
    validateName: function() {
        var $name = $("#txtName").val().trim();
		var $message="";
		var $flag=true;
		if($name === '') {
			$message="用户不能为空";
			$flag=false;
		}
		if(!popBy("#txtName",$flag,$message)) return false;
		return true;
    },	
	
	destroytxtName:function(){
		popDestroy('#txtName');
	},	
	
    validatePassword: function() {
        var $password = $("#txtPassword").val().trim();
		//var $confirm = $("#txtConfirm").val().trim();
		var $message="";
		var $flag=true;
		if($password === '') {
			$message="密码不能为空";
			$flag=false;
		}
		else if($password.length<4)
		{
			$message="密码长度不能小于4";
			$flag=false;
		}
		//if($confirm.length!==0) this.confirmPassword();
        if(!popBy('#txtPassword', $flag,$message)) return false;
		return true;
    },
	
	destroytxtPassword:function(){
		popDestroy('#txtPassword');
	},	
	
    login:function() {
        var $user = new User;
        var $name = $("#txtName").val().trim();
        var $password = $(this.el).find("#txtPassword").val().trim();
		if(!this.validateName() || !this.validatePassword())
		return false;
        $user.login({name: $name, password: hex_md5($password), mid: Math.random()});
    },


    confirmPassword: function() {
        var $password = $("#txtPassword").val().trim();
        var $confirm = $("#txtConfirm").val().trim();
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
		if(!popBy("#txtConfirm",$flag,$message)) return false;
		return true;
    },
	
	destroytxtConfirm:function(){
		popDestroy('#txtConfirm');
	},	
	
    validateEmail: function() {
        var regMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var $email = $("#txtEmail").val().trim();
		var $message="";
		var $flag=true;
		if(!regMail.test($email))  {
		var $message="邮箱格式不正确";
		var $flag=false;
		}
		if(!popBy('#txtEmail', $flag,$message)) return false;
		return true;
    },
	
	destroytxtEmail:function(){
		popDestroy('#txtEmail');
	},	
    regist: function() {
        var $user = new User;
        var $name = $("#txtName").val().trim();
        var $password = $("#txtPassword").val().trim();
        var $email = $("#txtEmail").val().trim();
        var $description = $("#txtDescription").val().trim();
		if(!this.validateName() || !this.validatePassword() || !this.confirmPassword() || !this.validateEmail())
		    return false;

        $user.save(
            {name: $name, password: hex_md5($password), email: $email, description: $description},
            {
            success: function(model, json) {
                if(!json) return alert('fail');
                if(json.status !='success') return alert(json.result);

                window.location.href = '/';

            },
            error: function(model, error) {
                alert(error.responseText)
            }
        });
    },
    createUser: function() {
        var $user = new User;
        var $name = $("#txtName").val().trim();
        var $password = $("#txtPassword").val().trim();
        var $email = $("#txtEmail").val().trim();
        var $description = $("#txtDescription").val().trim();
        if(!this.validateName() || !this.validatePassword() || !this.confirmPassword() || !this.validateEmail())
            return false;

        $.post('/user/create',{name: $name, password: hex_md5($password), email: $email, description: $description}, function(json) {
            $("#container").modal('hide');

            if(!json) return alert('fail');
            if(json.status !='success') return alert(json.result);

            var user = new User(json.result)
            var view = new ItemView({model:user});
            $("#userlist").children().append(view.render().el);
            $("#txtName").val('')
            $("#txtPassword").val('')
            $("#txtEmail").val('')
            $("#txtDescription").val('')
            $("#txtConfirm").val('')
            users.add(user)

        })

    },
	loginOnEnter: function(e) {
      e = window.event || e

      if(e.keyCode !== 13) return;
      if($("#btnLogin").length > 0)
          return this.login();
      else if($('#btnCreate').length > 0 )
          return this.createUser();
    }

});

var loginView = new LoginView();
