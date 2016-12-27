NodesView = Backbone.View.extend({
    el:"#filelist",

    events: {
        'click #allFile': 'selectAllFile',
        'click .chkFileItem': 'selectOneFile',
        'click .thsortbyname': 'sortByName',
        'click .thsortbysize': 'sortBySize',
        'click .thsortbycreatedAt': 'sortByDate'
    },

    initialize: function() {
        this.render('/box/'+ $.cookie('token'));
    },
    render: function(urls) {
        var that = this;
        nodes.fetch({url:urls,
            success:function(collection,res){
                _.templateSettings = {
                    interpolate : /\{\{(.+?)\}\}/g
                };
                var $nodes =nodes.filter(function(node) {
                    return node.get('pid') === $('#nodenav').attr('nodeid');
                })
                that.sortNodeList($nodes, 'type');
            },
            error:function(){
                alert('error');
            }
        });
    },
    sortByName : function() {

        if($('#mafile').length > 0 && $('#mafile').hasClass('active')) {
            this.sortFilesByCodetion('name');
        }
        else if($('#oshare').length > 0 && $('#oshare').hasClass('active')) {
            this.sortShareByCodetion('name');
        }
        else {
            this.sortCheSearch('name');
        }
    },
    sortByDate : function() {
        if($('#mafile').length > 0 && $('#mafile').hasClass('active')) {
            this.sortFilesByCodetion('createdAt');
        }
        else if($('#oshare').length > 0 && $('#oshare').hasClass('active')) {
            this.sortShareByCodetion('createdAt');
        }
        else {
            this.sortCheSearch('createdAt');
        }
    },
    sortBySize : function() {
        if($('#mafile').length > 0 && $('#mafile').hasClass('active')) {
            this.sortFilesByCodetion('size');
        }
        else if($('#oshare').length > 0 && $('#oshare').hasClass('active')) {
            this.sortShareByCodetion('size');
        }
        else {
            this.sortCheSearch('size');
        }
    },
    prepareSortList: function(pClass) {
        var $orderMode = $(this.el).find(pClass).attr('ordermode');
        $('#filelist').attr('thsortby',pClass.split('.thsortby').pop());
        $('#allFile').prop('checked', false)
        $orderMode = $orderMode ? $orderMode : 'asc';
        $(this.el).find(pClass).attr('ordermode', $orderMode.toLowerCase() === 'asc'? 'desc' :'asc');
        var $class = $orderMode === 'asc'? 'dropup' : 'dropdown';
        $(this.el).find('.caret').hide();
        $(this.el).find(pClass).removeClass('dropdowm').removeClass('dropup').addClass($class)
            .find('.caret').show();
        $('#filelist').attr('ordermode',$orderMode);
        return $orderMode;
    },
    sortNodeList: function(pnodes, sortFlag, orderMode) {
        if(!sortFlag) sortFlag = 'type';

        pnodes = _.sortBy(pnodes, function (node) {
            var $sortFlag = node.get(sortFlag);
            if(typeof ($sortFlag) === 'string') return $sortFlag.toLowerCase();
            return $sortFlag;
        })

        if (!orderMode) orderMode = 'asc';
        $("#filelist").children().children().first().siblings().remove();
        $.each(pnodes, function(i, o) {
            var view = new NodeItemView({model:o});
            if(orderMode.toLowerCase().trim() == 'asc')
                $("#filelist").children().append(view.render().el);
            else
                $("#filelist").children().children().first().after(view.render().el);
        })
    },
    sortFilesByCodetion:function ($sortflag) {
        var $orderMode = this.prepareSortList('.thsortby'+$sortflag);
        query.destpage = 1;
        query.query = $("#txtSearchFile").val().trim();
        query.ordermode = $orderMode;
        query.sortflag = $sortflag;
        pager.condition = query;
        getAllFiles({ mode: 'nums', val: pager.getDefaultIndex() });
    },
    sortCheSearch:function ($sortflag) { //检查是不是搜索结果，在排序
        var $orderMode = this.prepareSortList('.thsortby'+$sortflag);
        var $nodes=nodes.filter(function(node) {
            var query = $("#txtSearchFile").val().trim();
            return node.get('name').indexOf(query) > -1 ;
        });
        if( !$("#nodenav").children().first().next().html() ||  $("#nodenav").children().first().next().html().indexOf('搜索')<0) {
            $nodes=getNodesByFlag();
            this.sortNodeList($nodes, $sortflag, $orderMode);
        }
        else {
            this.sortNodeList($nodes, $sortflag, $orderMode);
            $('.filedir').show();
        }
    },
    sortShareByCodetion:function ($sortflag) {
        var $orderMode =  this.prepareSortList('.thsortby'+$sortflag);
        query.destpage = 1;
        query.query = $("#txtSearchFile").val().trim();
        query.ordermode = $orderMode;
        query.sortflag = $sortflag;
        pager.condition = query;
        getAllShares({ mode: 'nums', val: pager.getDefaultIndex() });
    },
    selectAllFile: function(e) {
        //e = window.event || e;

        if($("#allFile:checked").length > 0)
            $(".chkFileItem").prop('checked',true);
        else
            $(".chkFileItem").prop('checked',false);

        if (e && e.stopPropagation) {
            //支持W3C
            e.stopPropagation();
        }
        else {
            //IE的方式
            window.event.cancelBubble = true;
        }

    },

    selectOneFile: function() {
        if($(".chkFileItem:checked").length == $(".chkFileItem").length)
            $("#allFile").prop('checked',true)
        else
            $("#allFile").prop('checked',false)
    }
})

NodeItemView = Backbone.View.extend({
    tagName:"tr",

    events: {
        'mouseover': 'showOper',
        'mouseout': 'hideOper',
        'click .renameFile':'Renamefolder',
        'click .sp-filename': 'showChildren',
        'click .Movefile': 'moveFile',
        'click .delfile': 'deleteNode',
        'click .sharefile':'shareNode',
        'click .pridownload':'pridownload'
       // 'click .sp-username': 'showUserNodes'

    },

    initialize: function() {

    },
    render: function() {
        var tempMode = this.model.toJSON();
        var url='/node/' + $.cookie('token') + '/' + tempMode.id;
        var arr=tempMode.path.split('/');
        arr.pop();
        var nowpath = arr.join('/');
        var linkcheck=tempMode.name;
        if(tempMode.type!=='directory') {
            tempMode.size=filesize(tempMode.size).toUpperCase();
            if(tempMode.shared===2) {
                if(!$('#usertype').html()  || tempMode.belongs===$('#username').html()) {
                    linkcheck="<a href="+"'"+url+"'"+">"+tempMode.name+"</a>"
                }
                else {
                    linkcheck="<a href='javascript:void(0)' class='pridownload'>"+tempMode.name+"</a>"
                }
            } else {
                linkcheck="<a href="+"'"+url+"'"+">"+tempMode.name+"</a>"
            }
        }
        var $temp = _.template($('#filetemp').html(),
            {id:tempMode.id, name: tempMode.name, size: tempMode.size,
                mtime: tempMode.mtime, belongs:tempMode.belongs, type:tempMode.type,path:nowpath,linkcheck:linkcheck});

        if(tempMode.pid!='') {
            $(this.el).html($temp);
            $(this.el).children().children().children().children().children('b').last().addClass('ty'+tempMode.type);
            var $sp_ico= $(this.el).find('.sharefile').children();
            this.renderShare($sp_ico,tempMode.shared);
            if(tempMode.type=='directory') {
                $(this.el).find('.sp-filename').addClass('curpointer');
                $(this.el).find('.downfile').hide();
                $(this.el).find('.sharefile').hide();
            }
            else {
                if(tempMode.shared===2) {
                    $(this.el).children().children().children().children().children('b').first().addClass('locked');
                    if(!$('#usertype').html()  || tempMode.belongs===$('#username').html() )  {
//                        var url='/node/'+tempMode.id;
                        $(this.el).find('.downfile').attr('href',url);
                    }
                    else {
                        $(this.el).find('.downfile').addClass("pridownload");
                    }
                    if($("#myshare").hasClass('active')) {
                        var span = document.createElement('span');
                        $(span).addClass("col-sm-12")
                        $(span).html('提取码:'+tempMode._authCode)
                        $(this.el).find('.nodeurl').append(span);
                    }

                } else {
//                    var url='/node/'+tempMode.id;
                    $(this.el).find('.downfile').attr('href',url);
                }
            }
        }
        else {
            $('#nodenav').attr('nodeid', tempMode.id).attr('nodepath',tempMode.path);
        }
        return this;
    },
    renderShare:function($sp_ico,flag) {
        var shareClass="glyphicon-share-alt";
        var sharetitle="分享"
        if(flag) {
            shareClass="glyphicon-share";
            sharetitle="取消分享"
        }
        $sp_ico.addClass(shareClass);
        $sp_ico.attr('title',sharetitle);
    },

    showOper: function() {
        $(this.el).find('.sp-filename').removeClass("col-sm-10").addClass("col-sm-6");
        $(this.el).find('.fileoper').show();
        $(this.el).find('.nodeurl').show();
    },

    hideOper: function() {
        $(this.el).find('.sp-filename').removeClass("col-sm-6").addClass("col-sm-10")
        $(this.el).find('.fileoper').hide()
        $(this.el).find('.nodeurl').hide();
    },

    Renamefolder:function() {
        $('#txtRenamefolder').popover('destroy');
        var tempMode = this.model.toJSON();
        $('#txtRenamefolder').attr('nodeid', tempMode.id);
        $('#txtRenamefolder').attr('nodename', tempMode.name);
        var postifx='';
        var $filename=tempMode.name;
        if(tempMode.name.split('.').length>1) {
            var arr=tempMode.name.split('.');
            arr.pop();
            $filename = arr.join('.');
            postifx='.'+tempMode.name.split('.').pop();
        }
        $('#txtRenamefolder').val($filename);
        $('#postifx').html(postifx)
    },

    showChildren: function() {


        $('#filedir').hide()
        var $type = $(this.el).find('.sp-filename').attr('nodetype');
        if($type != 'directory') return;
        var $id = $(this.el).find(':checkbox').val();
        this.showNodes($id,false);
    },
    showNodes: function(id,flag) {
        $("#filelist").children().children().first().siblings().remove()
        var $node = nodes.get(id);

        if(!flag) {
            $("#nodenav").attr('nodeid',id).attr('nodepath',$node.get('path'));
            if($("#fileupload").length>0) fileUpload();
            $("#nodenav").children().first().siblings().remove()
            var prenode=nodes.get($node.get('id'));
            var prepid=prenode.get('pid');
            while(prepid!='') {
                var li  = document.createElement('li');
                var a = document.createElement('a');
                a.href = "javascript:void(0)"
                var dirname=prenode.get('name');
                $(a).attr('title',dirname);
                if(dirname.length>4) {
                    dirname=dirname.substring(0,4)+"...";
                }
                $(a).html(dirname)
                $(a).attr('nodeid',prenode.id);
                $(a).attr('nodepath',prenode.get('path'));
                $(a).attr('onclick','showpath(this)');
                li.appendChild(a);
                prenode=nodes.get(prenode.get('pid'));
                prepid=prenode.get('pid');
                $("#nodenav").children().first().after(li);
            }
        }
        var $sortFlag="type";
        var $orderMode="asc";
        var $nodes = nodes.filter(function(node) {
            return node.get('pid') == id;
        });
        if($('#filelist').attr('thsortby') && $('#filelist').attr('ordermode')) {
            $sortFlag=$('#filelist').attr('thsortby');
            $orderMode=$('#filelist').attr('ordermode');
        }
        nodesView.sortNodeList($nodes,$sortFlag,$orderMode);
    },
    moveFile: function() {
        var $mvid = $(this.el).find(':checkbox').val();
        $('#filelist').find(':checkbox').prop('checked', false)
        $(this.el).find(':checkbox').prop('checked', true)
        $('#Movefile').attr('nodeidf', JSON.stringify([$mvid]));
        var $nodes = nodes.filter(function(node) {
            return node.get('pid') == '' && node.get('type') == 'directory'
        })
        _.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g
        };
        $("#dirlist").children().remove()

        $.each($nodes, function(i, o) {
            var view = new PathItemView({model:o});
            $("#dirlist").append(view.render().el);
        })

    },
    deleteNode: function() {
        var $id = $(this.el).find(':checkbox').val();
        if(confirm("确认删除吗？")) {
            new Node().deleteNode([$id], this.$el)
        }
    },
    shareNode: function() {
        var $id = $(this.el).find(':checkbox').val();
        var $sp_ico=$(this.el).find('.sharefile').children();
        this.shareClass($sp_ico,$id);
    },
    shareClass:function ($sp_ico,$id) {
        var sharelock=$(this.el).children().children().children().children().children('b').first();
        if($sp_ico.hasClass('glyphicon-share-alt')) {
            var $node=nodes.get($id);
            $node=$node.toJSON();
            var url='/node/'+$node.id;
            url=window.location.host+url;
            this.resetShModal();
            $('#Sharefile').modal('show');
            $('#btnpubshare').click(function() {
                $('#btnpubshare').hide();
                $('#divpubshare').show();
                $('#txtpubshare').val(url);
                $('#btnComShare').show();
            });
            $('#btnprishare').click(function() {
                $('#btnprishare').hide();
                $('#txtprishare').val(url);
                var code=createCode();
                $('#txtpricode').val(code);
                $('#divprishare').show();
                $('#btnComShare').show();
            });
            $('#btnComShare').one('click',function() {
                if($("#Sharefile").find('li').first().hasClass("active") && $('#divpubshare:visible').length>0) {
                    new Node().shareNode(1,[$id]);
                    $('#Sharefile').modal('hide');
                } else if($('#divprishare:visible').length>0){
                    var code=$('#txtpricode').val();
                    new Node().shareNode(2,[$id],code);
                    $(sharelock).addClass('locked');
                    $('#Sharefile').modal('hide');
                }
                $sp_ico.removeClass('glyphicon-share-alt');
                $sp_ico.addClass('glyphicon-share');
                $sp_ico.attr('title','取消分享');
            });
            $sp_ico.removeClass('glyphicon-share-alt');
            $sp_ico.addClass('glyphicon-share');
            $sp_ico.attr('title','取消分享');
        } else if($sp_ico.hasClass('glyphicon-share')) {
            new Node().shareNode(0,[$id]);
            $sp_ico.removeClass('glyphicon-share');
            $sp_ico.addClass('glyphicon-share-alt');
            $sp_ico.attr('title','分享');
            $(sharelock).removeClass('locked');
            if($("#myshare").hasClass("active")) {
                $(this.el).remove();
            }
        }
    },
    resetShModal: function() {
        $('#btnpubshare').show();
        $('#divpubshare').hide();
        $('#txtpubshare').val('');
        $('#btnprishare').show();
        $('#divprishare').hide();
        $('#txtprishare').val('');
        $('#txtpricode').val('');
        $('#btnComShare').hide();
        $("#sharetabs a:first").tab('show')
    },
    pridownload:function() {
        $('#filelist').find(':checkbox').prop('checked', false)
        $(this.el).find(':checkbox').prop('checked', true)
      //  var node = this.model.toJSON();
      //  $('#Pridown').attr('nodeid',node.id);
        $('#txtPridown').val('');
        $('#Pridown').modal('show');
    }
//
//    showUserNodes: function() {
//        //alert('x')
//    }
})

PathItemView =Backbone.View.extend({
    tagName:"li",
    events: {
        'click .selectedfile':'filePlus',
        'click .moveTo': 'moveTo'
    },

    initialize: function() {

    },
    render: function() {
        var tempMode = this.model.toJSON()
        var $rootId = tempMode.id;
        var $nodes = nodes.filter(function(node) {
            return node.get('pid') == $rootId && node.get('type') == 'directory'
        })
        var plus='sp-blank';
        if($nodes.length>0) {
           plus='sp-plus';
        }
        var $temp = _.template($('#dirlisttemp').html(),
            {id:tempMode.id,name:tempMode.name,path: tempMode.path});

        $(this.el).html($temp);
        if(tempMode.name === 'root')
        $(this.el).children('div').children('a').html('全部文件')
        $(this.el).children('div').children('span').addClass(plus);

        return this;
    },
    filePlus:function(e) {
      e = window.event || e
      var target = e.srcElement || e.target
        if(!$(target).hasClass('sp-plus') && !$(target).hasClass('sp-minus')) return
        if($(target).siblings('ul:visible').length===0) {
            $(target).removeClass('sp-plus');
            $(target).addClass('sp-minus');
            $(target).parent().parent().siblings('li').find('ul:visible').hide()
            $.each($(target).parent().parent().siblings('li').find('span'), function(i, o) {
                if ($(o).hasClass('sp-plus') || $(o).hasClass('sp-minus')) $(o).addClass('sp-plus')
            })
           if($(target).siblings('ul').length==0){
               var $ul=document.createElement('ul');
               $($ul).addClass('nav col-sm-offset-1')
               $(target).parent().append($ul);
               var $rootId = $(target).siblings('a').attr('nodeid')
               var $nodes = nodes.filter(function(node) {
                   return node.get('pid') == $rootId && node.get('type') == 'directory'
               })
               _.templateSettings = {
                   interpolate : /\{\{(.+?)\}\}/g
               };

               if($nodes.length == 0) return;
               $.each($nodes, function(i, o) {
                   var tempMode = o.toJSON()
                   var $rootId = tempMode.id;
                   var $nodes = nodes.filter(function(node) {
                       return node.get('pid') == $rootId && node.get('type') == 'directory'
                   })
                   var plus='sp-blank';
                   if($nodes.length>0) {
                       plus='sp-plus';
                   }
                   var $temp = _.template($('#dirlisttemp').html(),
                       {id:tempMode.id,name:tempMode.name,path: tempMode.path});
                   $($ul).append('<li>'+$temp+'</li>');
                   $($ul).children('li').children('div').children('span').addClass(plus);
               })
           }
           else {
               $(target).siblings('ul').show();
           }
        }
        else {
            $(target).addClass('sp-plus');
            $(target).removeClass('sp-minus');
            $(target).siblings('ul').hide();
       }
    },
    moveTo:function(e) {
        e = window.event || e
        var target = e.srcElement || e.target
        $('.divselected').remove();
        var $div=document.createElement('div');
        $($div).addClass('divselected');
        $(target.parentNode).prepend($div)
        var $nodeidt=$(target).attr('nodeid');
        $('#Movefile').attr('nodeidt', $nodeidt);

    }
})



OprateFileView = Backbone.View.extend({
    el:"#operateFilearea",
    events: {
        'input #txtSearchFile': 'searchFileByInput',
        'prototypechange #txtSearchFile': 'searchFileByInput',
        'click #btnSearchFile': 'searchFile',
        'click #btnDeleteFile': 'deleteFile',
        'click #btnMoveFile': 'moveFiles',
        'keypress': "searchByEnter",
        'click #btnShareFile': 'shareFiles'
    },

    initialize: function() {

    },

    searchFile: function() {
        $("#nodenav").children().first().siblings().remove();
        checkUser($('#usertype').html());
    },
    seachFileByConditon:function(conditon) {
        $("#filelist").children().children().first().siblings().remove()

        var $destFiles = nodes.filter(conditon)

        $.each($destFiles, function(i, o) {
            var view = new NodeItemView({model:o});
            $("#filelist").children().append(view.render().el);
        })
    },
    searchByEnter: function(e) {
        e = window.event || e
        if (e.keyCode == 13) {
            this.searchFile();
        }

    },
    searchFileByInput: function() {

      if($("#oshare").hasClass('active')) return;
      if($("#mafile").hasClass('active')) return;
      this.searchFile();
    },

    deleteFile: function() {
        var $ids = [];
        $(".chkFileItem:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return alert('请选择您要删除的文件或者文件夹');
        if(confirm("确认删除吗？")) {
            new Node().deleteNode($ids);
        }
    },
    moveFiles:function() {
        var $ids = [];
        $(".chkFileItem:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return alert('请选择您要移动的文件或者文件夹');
        $('#Movefile').modal('show')
        $('#Movefile').attr('nodeidf', JSON.stringify($ids));
        var $nodes = nodes.filter(function(node) {
            return node.get('pid') == '' && node.get('type') == 'directory'
        })
        _.templateSettings = {
            interpolate : /\{\{(.+?)\}\}/g
        };
        $("#dirlist").children().remove()

        $.each($nodes, function(i, o) {
            var view = new PathItemView({model:o});
            $("#dirlist").append(view.render().el);
        })
    },
    shareFiles:function() {
        var $ids = [];
        $(".chkFileItem:checked").each(function(i, o) {
            $ids.push($(o).val());
        })
        if($ids.length == 0) return alert('请选择您要分享的文件或者文件夹');
        new Node().shareNode($ids);
    }
})
var nodesView = new NodesView;
var oprateFileView = new OprateFileView;
