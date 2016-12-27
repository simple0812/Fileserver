function turn(obj) {
    var flag = $(obj).attr('showflag');
	$(obj).addClass('active').siblings().removeClass('active');
    $("#nodenav").children().first().siblings().remove()
    $("#nodenav").attr("nodeid",$("#nodenav").children().first().children().attr("nodeid"))
    $("#nodenav").attr("nodepath",$("#nodenav").children().first().attr("nodepath"));
    $('#allFile').prop('checked', false)
    showOper(flag);
    var $sortFlag="type";
    var $orderMode="asc";
    var $nodes;
    switch (flag) {
        case 'all':
            $nodes=nodes.filter(function(node) {
                return node.get('pid') === $('#nodenav').attr('nodeid');
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                 $sortFlag=$('#filelist').attr('thsortby');
                 $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'pic':
            $nodes=nodes.filter(function(node) {
                return node.get('type') === 'picture';
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                $sortFlag=$('#filelist').attr('thsortby');
                $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'doc':
            $nodes=nodes.filter(function(node) {
                return node.get('type') === 'document';
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                $sortFlag=$('#filelist').attr('thsortby');
                $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'video':
            $nodes=nodes.filter(function(node) {
                return node.get('type') === 'video';
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                $sortFlag=$('#filelist').attr('thsortby');
                $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'other':
            $nodes=nodes.filter(function(node) {
                return node.get('type') === 'other';
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                $sortFlag=$('#filelist').attr('thsortby');
                $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'share':
            $nodes=nodes.filter(function(node) {
                return node.get('shared') >0;
            });
            if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
                $sortFlag=$('#filelist').attr('thsortby');
                $orderMode=$('#filelist').attr('ordermode');
            }
            nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
            break;
        case 'othershare': showAllShares();break;
        default :alert("类型出错");break;
    }
	return false;
}

function getNodesByFlag() {
    $('#allFile').prop('checked', false)
    var flag = $('#sidebar').children().children('.active').attr('showflag');
    if (!flag) flag = 'all';
    var $nodes = nodes;
    switch (flag) {
        case "all":
            $nodes = nodes.filter(function(node) {
                return node.get('pid') === $('#nodenav').attr('nodeid');
            });
            break;
        case "pic":
            $nodes = nodes.filter(function(node) {
                return node.get('type') === 'picture';
            });
            break;
        case "doc":
            $nodes = nodes.filter(function(node) {
                return node.get('type') === 'document';
            });
            break;
        case "video":
            $nodes = nodes.filter(function(node) {
                return node.get('type') === 'video';
            });
            break;
        case "other":
            $nodes = nodes.filter(function(node) {
                return node.get('type') === 'other';
            });
            break;
        case "share":
            $nodes = nodes.filter(function(node) {
                return node.get('shared') >0;
            });
            break;
        default :
            $nodes = nodes.filter (function(node) {
                return true;
            })
            break;
    }

    return $nodes;
}


function popBy(obj,flag,message){
	$(obj).popover('destroy');
	$(obj).popover({
			 placement:'bottom',
			 trigger:'manual',
			 content:message
			 });
	if(!flag) {
		$(obj).popover('show');
		return false;
	}
	else {
		$(obj).popover('hide');
		return true;
	}
}

function popDestroy(obj) {
	$(obj).popover('destroy');
	$('#btnLogin').popover('destroy');
	$('#modifyEmail').popover('destroy');
	$('#modifyPassword').popover('destroy');
	$('#modifyDescription').popover('destroy');
}

function nav(obj, flag) {
    $('#allFile').prop('checked', false);
    $("#filelist").find(".caret").hide();
    $(obj).addClass('active').siblings().removeClass('active');

    if(flag ==1) {
        $("#nodefield").show().siblings('.col-sm-10').hide();
        $('#txtSearchFile').val('');
        $('#nodenav').hide();
        showAllFiles();
    }
    else {
        $("#userfield").show().siblings('.col-sm-10').hide();
        $("#nodenav").children().first().siblings().remove();
    }

    return false;
}

function createDir() {
    var $foldername = $("#foldername").val().trim();
    var $message="";
    var $flag=true;
    if($foldername === '') {
        $message="文件名不能为空";
        $flag=false;
    }
    else {
        $.post('/box/'+ $.cookie('token')+'/mkdir', {id:$('#nodenav').attr('nodeid'), name:$('#foldername').val().trim()}, function(json) {
            if(!json) return alert('未知错误');
            if(json.status == 'fail') {
                $flag=false;
                $message=json.result;
                return popBy('#foldername', $flag,$message);
            }
            var node = new Node(json.result)
            nodes.add(node);
            node=node.toJSON();
            var pnode=nodes.get(node.pid);
            var newsize=pnode.toJSON().size+1;
            pnode.set('size',newsize);
            reloadNodes();
            $("#foldername").val('');
            $("#Newfolder").modal('hide');
            popDestroy('#foldername');
        })
    }
    if(!popBy('#foldername', $flag,$message)) return false;
    return true;
}

function renameFolder() {
    var $id = $('#txtRenamefolder').attr('nodeid');
    var $oldname=$('#txtRenamefolder').attr('nodename');
    var $name = $('#txtRenamefolder').val().trim()+$('#postifx').html().trim();
    var $message="";
    var $flag=true;
    if($name === '') {
        $message="文件名不能为空";
        $flag=false;
    }
    else if($oldname !== $name){
        $.ajax({
            type: "PUT",
            url: '/box/'+ $.cookie('token')+'/rename',
            data: JSON.stringify({id: $id, new: $name}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if(!json) return alert('未知错误');
                if(json.status == 'fail')
                    if(json.status == 'fail') {
                        $flag=false;
                        $message=json.result;
                        return popBy('#txtRenamefolder', $flag,$message);
                    }
                $("#Renamefolder").modal('hide');
                var $node = nodes.get($id);
                $node.set('name',$name);
                $node.set('path',json.result.path);
                reloadNodes()
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    }
    else {
        $("#Renamefolder").modal('hide');
    }
    if(!popBy('#txtRenamefolder', $flag,$message)) return false;
    return true;
}


function showpath(obj) {
    if($('#fileupload').length>0) fileUpload();
    $('#filedir').hide()
    $('.filedir').hide()
    $(obj).parent().nextAll().remove();
    var  itvnew = new NodeItemView;
    var $id = $(obj).attr('nodeid');
    return itvnew.showNodes($id);
}

function moveFolder() {
    $ids=JSON.parse($('#Movefile').attr('nodeidf'));
    $idto=$('#Movefile').attr('nodeidt');
    new Node().moveNode($ids,$idto);
    $('#Movefile').modal('hide');
}



function showAllFiles() {
    $("#pager").show();
    $('#nodenav').hide();
    $('#filedir').hide();

    if(!pager.condition) {
        query.query = $("#txtSearchFile").val().trim();
        pager = new Pager (query.pagesize, 0, 1, query, getAllFiles);
        pager.renderNumberStyleHtml( $("#pager")[0]);
        getAllFiles({ mode: 'nums', val: pager.getDefaultIndex() });
    }
    else {
        getAllFiles({ mode: 'nums', val: pager.getDefaultIndex() });
    }
}

function getAllFiles() {
    $("#pager").hide()

    pager.moveIndicator(arguments[0]);
    pager.condition.mid = Math.random()
    $.getJSON('/files', pager.condition, function(json) {
        if(!json) return;
        if(json.status == 'fail') return;

        json.count > 0 ? $("#pager").show() : $("#pager").hide();

        $("#filelisthead").siblings().remove();
        $.each(json.result, function(i, o) {
            if(o.pid === '') return;

            var view = new NodeItemView({model: new Node(o) });
            $("#filelisthead").parent().append(view.render().el);
        })

        pager.setRecordCount(json.recordcount);
        pager.renderNumberStyleHtml($("#pager").get(0));
    })
}

function checkUser(obj) {
    if(obj ==='normal' ) {                 //普通用户搜索文件
        if($('#oshare').hasClass('active')) {               //普通用户搜索其他分享
            query.destpage = 1;
            query.query = $("#txtSearchFile").val().trim();
            pager.condition = query;
            getAllShares();
        }
        else {                                              //普通用户搜索文件
            seaFilCheBla()
        }
    }
    else {                                                  //管理员搜索
        if($('#mafile').hasClass('active')) {               //管理员搜索所有的文件管理员搜索某个用户的文件夹以及文件
            query.destpage = 1;
            query.query = $("#txtSearchFile").val().trim();
            pager.condition = query;
            getAllFiles();
        }
        else {                                              //管理员搜索某个用户的文件夹以及文件
            seaFilCheBla()
        }

    }
}

function seaFilCheBla() {
    $('#sidebar').children().children().first().addClass('active').siblings().removeClass('active');
    showOper('all')
    if($("#txtSearchFile").val().trim()!='') {
        var $sortFlag="type";
        var $orderMode="asc";
        var $nodes=nodes.filter(function(node) {
            var query = $("#txtSearchFile").val().trim();
            return node.get('name').indexOf(query) > -1 ;
        });
        if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
            $sortFlag=$('#filelist').attr('thsortby');
            $orderMode=$('#filelist').attr('ordermode');
        }
        nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
        $('#filedir').show()
        $('.filedir').show()
        var li  = document.createElement('li');
        var a = document.createElement('a');
        a.href = "javascript:void(0)"
        $(a).html('搜索:\''+$("#txtSearchFile").val().trim()+'\'');
        li.appendChild(a);
        $("#nodenav").children().first().after(li);
    }
    else {
        var fid=$("#nodenav").children().first().children().attr('nodeid');
        var  itvnew = new NodeItemView;
        itvnew.showNodes(fid);
        $('#filedir').hide()
        $('.filedir').hide()
    }
}

function reloadNodes() {                                //（新建的时候）重新render页面
    $('#nodenav').children().first().nextAll().remove();
    var  itvnew = new NodeItemView;
    var $id = $('#nodenav').attr('nodeid');
    return  itvnew.showNodes($id);
}

function showOper(flag) {
    switch (flag) {
        case 'all': {
            $('#nodenav').show();$('#uploadForm').show();
            $('#btnNewfolder').show();
            $('#btnNewF').show();$('#btnMoveFile').show();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'pic': {
            $('#nodenav').hide();$('#uploadForm').show();
            $('#btnNewfolder').hide();
            $('#btnNewF').hide();
            $('#btnMoveFile').hide();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'doc': {
            $('#nodenav').hide();
            $('#uploadForm').show();
            $('#btnNewfolder').hide();
            $('#btnNewF').hide();
            $('#btnMoveFile').hide();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'video': {
            $('#nodenav').hide();
            $('#uploadForm').show();
            $('#btnNewfolder').hide();
            $('#btnNewF').hide();
            $('#btnMoveFile').hide();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'other': {
            $('#nodenav').hide();
            $('#uploadForm').show();
            $('#btnNewfolder').hide();
            $('#btnNewF').hide();
            $('#btnMoveFile').hide();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'share': {
            $('#nodenav').hide();
            $('#uploadForm').hide();
            $("#pager").hide();
            $(".belonges").hide();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        case 'othershare': {
            $('#nodenav').hide();
            $('#uploadForm').hide();
            $("#pager").show();
            $('#filedir').hide()
            $('.filedir').hide()
            break;
        }
        default :{
            alert("showoper类型出错");
            break;
        }
    }
}



function showAllShares() {
    $("#filelist").children().children().first().siblings().remove()
    if(!pager.condition) {
        query.query = $("#txtSearchFile").val().trim();
        pager = new Pager (query.pagesize, 0, 1, query, getAllShares);
        pager.renderNumberStyleHtml( $("#pager")[0]);
        getAllShares({ mode: 'nums', val: pager.getDefaultIndex() });

    }
    else {
        getAllShares({ mode: 'nums', val: pager.getDefaultIndex() });
    }

}
function getAllShares() {
    $("#pager").hide()

    pager.moveIndicator(arguments[0]);
    pager.condition.mid = Math.random()
    $.getJSON('/oshare/'+ $.cookie('token'), pager.condition, function(json) {
        if(!json) return;
        if(json.status == 'fail') return;

        json.count > 0 ? $("#pager").show() : $("#pager").hide();

        $("#filelisthead").siblings().remove();
        $.each(json.result, function(i, o) {
            if(o.pid === '') return;

            var view = new NodeItemView({model: new Node(o) });
            $("#filelisthead").parent().append(view.render().el);
            $("#filelist").find('.delfile').hide()
            $("#filelist").find('.sharefile').hide()
            $("#filelist").find('.moreop').hide()
        })
        $(".belonges").show();


        pager.setRecordCount(json.recordcount);
        pager.renderNumberStyleHtml($("#pager").get(0));
    })
}

window.document.onkeypress = function(e) {

    if(e.keyCode != 13) return;

    //响应新建文件夹
    if($("#Newfolder:visible").length > 0) {
      return  createDir();
    }

    if($("#Renamefolder:visible").length > 0) {
        return  renameFolder();
    }

    if($("#Movefile:visible").length > 0) {
        return  moveFolder();
    }
}

function modalIputFocus($modalid,$txtid) {
    $($modalid).modal('show');
    $($modalid).on('shown.bs.modal', function (e) {
        $($txtid).focus();
    })
}

function fileUpload () {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var url = '/upload?path=' + $('#nodenav').attr('nodeid');
    var tmpSize = parseInt($('#usageRate').attr('currentSize'));
    var totalSize = parseInt($('#usageRate').attr('totalSize'));

    $('#fileupload').fileupload({
        url: url,
        dataType: 'json',
        add: function (e, data) {
            $.each(data.files, function (index, file) {
                tmpSize += file.size;
            });
            if(tmpSize > totalSize) {
                alert('用户容量不足，' + data.files[0].name + ' 将不能被上传');
                $('#fileupload').fileupload('disable');
                tmpSize -= data.files[0].size;
            } else {
                data.submit();
            }
        },
        done: function (e, data) {
            if(!data.result) return alert('未知的错误');
            if(data.result.status == 'fail') return alert(data.result.result);

            var node = new Node(data.result.result);
            nodes.add(node);
            node = node.toJSON();
            var pnode = nodes.get(node.pid);
            var newsize = pnode.toJSON().size + 1;
            pnode.set('size', newsize);
            reloadNodes();
            function hideProgress () {
              var p = $('#progress .progress-bar').width();
              var x = $('#progress').width();
	      if(p === x) {
                $('#progress').hide();
                $('#progress .progress-bar').css('width', 0 + '%');
	      }
	    }
            var currentSize = parseInt($('#usageRate').attr('currentSize')) + node.size;
            $('#usageRate').attr('currentSize', currentSize);
            $('#usageRate').children().width(currentSize*100/totalSize + '%');
            $('#currentSize').html(filesize(currentSize).toUpperCase());
            setTimeout(hideProgress, 1000);
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').show();
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

}


$(".taoverfix").height($(document).height()*0.7);

function rmNode($node) {
    var pnode=nodes.get($node.pid)
    var newsize=pnode.toJSON().size-1
    if($node.type !=="directory") {
        var tmpsize = $node.size;
        pnode.set('size',newsize);
        nodes.remove($node);
        var currentSize=$('#usageRate').attr('currentSize');
        currentSize=currentSize-tmpsize;
        $('#usageRate').attr('currentSize',currentSize);
    } else {
        var $nodes = nodes.filter(function(node) {
            return node.get('pid') == $node.id
        });
        $.each($nodes, function(i, o) {
            rmNode(o.toJSON());
        });
        pnode.set('size',newsize);
        nodes.remove($node);
    }
}

function downloadFiles(obj) {
    $(".chkFileItem:checked").each(function(i, o) {
        var tmp = $(o).parent().siblings('.sp-filename');
        if(tmp) {tmp.children('a').get(0).click()};
    })
}

function createCode() {
    var code="";
    var codeLength = 4;//验证码的长度
    var selectChar = [2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J',
        'K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
    //var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
    for(var i=0;i<codeLength;i++) {
       var charIndex = Math.floor(Math.random()*32);
        code +=selectChar[charIndex];
    }
    return code;
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if($('#divpubshare:visible').length>0 || $('#divprishare:visible').length>0) {
        $('#btnComShare').show();
    } else {
        $('#btnComShare').hide();
    }
});

$("#btnPridown").click(function() {
    var url='/node/'+$.cookie('token') + '/'+$('.chkFileItem:checked').val();
    //alert(url);
    $('#Pridown').modal('hide');
    $('#filelist').find(':checkbox').prop('checked', false);
    $('#Pridown').on('hidden.bs.modal', function () {
        window.location.href=url+"?code="+$("#txtPridown").val().trim();
    })

    //$('txtPridown)

});
