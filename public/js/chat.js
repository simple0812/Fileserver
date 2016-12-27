var hostName = window.location.hostname;
var port = window.location.port || 8002;

var socket = io.connect('http://'+hostName+':'+ port)
var uid = $.cookie('token')
var name = $('#i-username').html()

initUser();

socket.on ('updateChat', function(data) {
    renderMsg(data);
})

socket.on ('connected', function(data) {
    $.each(data, function(i, o) {
        $('#right').append('<p>'+o+'</p>')
    })
})

socket.on ('updateUser', function(data) {
    renderUser(data);
})

socket.on ('getUsers', function(data) {
    renderUser(data);
})
function initUser() {
    socket.emit ('addUser', {uid: uid, name: name})
}

function sendMsg() {

    var to = $("#right .active").length? $("#right .active").html() : '';
    var $msg = $('#txtInput').val().trim();
    if($msg === '') return;
    var msg = new Message(name, to, $msg)
    renderMsg(msg);
    socket.emit('msg', msg);
}

function renderMsg(pMsg) {

    if(pMsg.To.length > 0 && (name == pMsg.To || name == pMsg.From))
        $('#commonBox').append(("<i>"+pMsg.From+"  对  </i><i>"+pMsg.To+"  说：</i> <b>"+ pMsg.Content +"</b><br />").replace(name, '我'));
    else if(pMsg.To.length == 0)
        $('#commonBox').append(("<i>"+pMsg.From+"：</i> <b>"+ pMsg.Content +"</b><br />").replace(name, '我'));

    $('#commonBox').get(0).scrollTop = $('#commonBox').get(0).scrollHeight - $('#commonBox').get(0).clientHeight;

    $('#txtInput').get(0).scrollTop = 0
    $('#txtInput').get(0).scrollHeight = $('#txtInput').get(0).clientHeight;

    $('#txtInput').val('').blur()
    setTimeout(function() {
        $('#txtInput').focus()
    }, 0)
}

function logout() {
    socket.emit('logout', name)
}

function selectUser(obj) {
    if($(obj).hasClass('active')) $(obj).removeClass('active')
    else $(obj).addClass('active').siblings().removeClass('active')
}

function renderUser(data) {
    $('#right').empty();
    for(var i = 0, len = data.length; i< len ; i++) {
        if(data[i] != name)
            $('#right').append('<p onclick="selectUser(this)" >'+data[i]+'</p>');
    }
}


window.document.onkeypress = function(e) {
    if (e.keyCode === 13 && e.ctrlKey ) sendMsg();
}


