

Array.prototype.objCount = function(c) { return c; }

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

String.format = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }

    return str;
}

String.formatArgs = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    var args = arguments[1];
    for (var i = 0; i < args.length; i++) {
        var re = new RegExp('\\{' + i + '\\}', 'gm');
        str = str.replace(re, args[i]);
    }

    return str;
}

String.prototype.trim = function () {
    var str = this,
        whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0, len = str.length; i < len; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    for (i = str.length - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

Array.indexOf = function() {
    var arr = arguments[0];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == arguments[1])
            return i;
    }

    return -1;
}

Array.prototype.Clone = function() {
    var objClone;
    if (this.constructor == Object) {
        objClone = new this.constructor();
    } else {
        objClone = new this.constructor(this.valueOf());
    }
    for (var key in this) {
        if (objClone[key] != this[key]) {
            if (typeof (this[key]) == 'object') {
                objClone[key] = this[key].Clone();
            } else {
                objClone[key] = this[key];
            }
        }
    }
    objClone.toString = this.toString;
    objClone.valueOf = this.valueOf;
    return objClone;
}

Array.prototype.indexOf = function(v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == v)
            return i;
    }

    return -1;
}

Array.prototype.removeAt = function(index) {
    var part1 = this.slice(0, index);
    var part2 = this.slice(index);

    part1.pop();

    return part1.concat(part2);
}

Array.prototype.remove = function(item) {
    //return this.removeAt(this.indexOf(item));
    var regString = ("," + this.join(",") + ",").replace("," + arguments[0] + ",", ",");

    if (regString != ",")
        return regString.substr(1, regString.length - 2).split(",");
    else
        return [];
}


function $get() { return document.getElementById(arguments[0]); }

function pagerDelegate(obj, method, mode) {
    var delegate = function() {
        var args = [];
        args.push(mode);
        method.apply(obj, args);
    }

    return delegate;
}

function HtmlDecode(txt) {
    var ele = document.createElement("DIV");

    ele.innerHTML = txt;
    var output = ele.innerText || ele.textContent;

    ele = null;
    return output;
}



var win = null;
function NewWindow(mypage, myname, w, h, scroll) {
    LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
    settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',resizable';
    win = window.open(mypage, myname, settings);
    win.focus();
}

function OpenModalWindow(openpage, textid, width, height) {
    var obj = new Object();
    obj.value = "";

    str = window.showModalDialog(openpage, obj, "dialogWidth=" + width + "px;dialogHeight=" + height + "px");
    $("#" + textid).val(str);
}
function OpenModalWindowByValue(openpage, txtvalue, width, height) {
    var obj = new Object();
    obj.value = txtvalue;

    str = window.showModalDialog(openpage, obj, "dialogWidth=" + width + "px;dialogHeight=" + height + "px");

}

function ModalWindowClose(result) {
    window.returnValue = result;
}


function getWeek() {
    var weekOfDay = (new Date()).getDay();
    if (weekOfDay == 1)
        document.write("星期一");
    if (weekOfDay == 2)
        document.write("星期二");
    if (weekOfDay == 3)
        document.write("星期三");
    if (weekOfDay == 4)
        document.write("星期四");
    if (weekOfDay == 5)
        document.write("星期五");
    if (weekOfDay == 6)
        document.write("星期六");
    if (weekOfDay == 0)
        document.write("星期日");
}

function getTimes() {
    now = new Date();
    hour = now.getHours()
    if (hour < 6) { document.write("凌晨好"); }
    else if (hour < 9) { document.write("早上好"); }
    else if (hour < 12) { document.write("上午好"); }
    else if (hour < 14) { document.write("中午好"); }
    else if (hour < 17) { document.write("下午好"); }
    else if (hour < 19) { document.write("傍晚好"); }
    else if (hour < 22) { document.write("晚上好"); }
    else { document.write("夜里好"); }
}


function UrlDecode(str) {
    alert(str);
    var ret = "";
    for (var i = 0; i < str.length; i++) {
        var chr = str.charAt(i);
        if (chr == "+") {
            ret += " ";
        }
        else if (chr == "%") {
            var asc = str.substring(i + 1, i + 3);
            if (parseInt("0x" + asc) > 0x7f) {
                ret += asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
                i += 5;
            }
            else {
                ret += asc2str(parseInt("0x" + asc));
                i += 2;
            }
        }
        else {
            ret += chr;
        }
    }
    return ret;
}

function getQueryString(key) {
    var value = "";
    var sURL = window.document.URL;

    if (sURL.indexOf("?") > 0) {
        var arrayParams = sURL.split("?");
        var arrayURLParams = arrayParams[1].split("&");

        for (var i = 0; i < arrayURLParams.length; i++) {
            var sParam = arrayURLParams[i].split("=");

            if ((sParam[0] == key) && (sParam[1] != "")) {
                value = sParam[1];
                break;
            }
        }
    }

    return value;
}


//-----------------------------------------------------
//    选中当前模块下的所有页面 checkbox
//-----------------------------------------------------
function sel_pagebox(formobj, ckid, ckval, ckele) {
    //var obj = eval(formobj.name.toString() + ".ck_page" + ckval.toString());

//    for (var i = 0; i < formobj.elements.length; i++) {
//        var ele = formobj.elements[i];
    var input = $("input[type=checkbox]");

    for (var i = 0; i < input.length; i++) {
        var ele = input.get(i);

        if (ele.name == ("ck_page" + ckval.toString()))
            ele.checked = ckele.checked;
    }
}

//-----------------------------------------------------
//    如果选中某页面的 checkbox ，则要回选其所归属的模块
//-----------------------------------------------------
function sel_modulebox(formobj, ckele) {
    var moduleval = ckele.name.toString().substring(7);

    // 如果 当前的页面 checkbox 为选中状态，则判断模块是否为选中，若不是则选中
    if (ckele.checked) {
//        for (var i = 0; i < formobj.elements.length; i++) {
//            var ele = formobj.elements[i];
        var input = $("input[type=checkbox]");

        for (var i = 0; i < input.length; i++) {
            var ele = input.get(i);

            if (ele.value == moduleval) {
                if (ele.name.toString().indexOf("ck_module") != -1)
                    ele.checked = true;
            }
        }
    }
    else {
        var hasck = false;
//        for (var i = 0; i < formobj.elements.length; i++) {
//            var ele = formobj.elements[i];
        var input = $("input[type=checkbox]");

        for (var i = 0; i < input.length; i++) {
            var ele = input.get(i);

            if (ele.name.toString() == ckele.name.toString()) {
                if (ele.checked) {
                    hasck = true;
                    break;
                }
            }
        }

        if (!hasck) {
//            for (var i = 0; i < formobj.elements.length; i++) {
//                var ele = formobj.elements[i];
            var input = $("input[type=checkbox]");

            for (var i = 0; i < input.length; i++) {
                var ele = input.get(i);

                if (ele.value == moduleval) {
                    if (ele.name.toString().indexOf("ck_module") != -1)
                        ele.checked = false;
                }
            }
        }

    }
}


//-----------------------------------------------------
//    根据 parm 值反选页面中的 Module 对象
//-----------------------------------------------------
function pageItemChecked(parm, formobj) {
//    for (var i = 0; i < formobj.elements.length; i++) {
//        var ele = formobj.elements[i];
    var input = $("input[type=checkbox]");

    for (var i = 0; i < input.length; i++) {
        var ele = input.get(i);

        if (ele.name == ("ck_page" + parm) && ele.checked)
            return true;
    }

    return false;
}

function Overmxw(parm1) {
    $("#" + parm1).toggle();
}
//----------------------------------------------------
//返回日期
//---
function initArray() {
    for (i = 0; i < initArray.arguments.length; i++)
        this[i] = initArray.arguments[i];
}
var isnMonths = new initArray("1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月");
var isnDays = new initArray("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日");
today = new Date();
hrs = today.getHours();
min = today.getMinutes();
sec = today.getSeconds();
clckh = "" + ((hrs > 12) ? hrs - 12 : hrs);
clckm = ((min < 10) ? "0" : "") + min; clcks = ((sec < 10) ? "0" : "") + sec;
clck = (hrs >= 12) ? "下午" : "上午";
var stnr = "";
var ns = "0123456789";
var a = "";
function getFullYear(d) {
    yr = d.getYear(); if (yr < 1000)
        yr += 1900; return yr;
}




function arrayBinder(arr, stepCount, prevName, nextName, handler) {
    this.tlist = (arr == null) ? [] : arr;
    this.stepCount = stepCount;
    this.prevElement = document.getElementById(prevName);
    this.nextElement = document.getElementById(nextName);

    this.eventHandler = handler;

    this.push = function() {
        var args = arguments[0].split(",");

        // 正常操作时保存当前步骤到历史记录链表
        if (args.length == 5 && this.tlist.length < this.stepCount)
            this.tlist.push(new Array(args[0], args[1], args[2], args[3], args[4], (this.tlist.length > 0) ? this.tlist[this.tlist.length - 1][0] : ""));

        if (this.tlist.length > this.stepCount)
            this.tlist.shift();

        // 当链表长度大于1并且最后一个元素不为null时为“上一步”元素定义事件处理函数
        if (this.tlist.length > 1 && this.tlist[this.tlist.length - 1] != null) {

            var tmp = this.tlist[this.tlist.length - 1];

            // 对于当前操作行为是“上一步”时定位当前操作步骤在链表中对应的数据
            if (args.length > 5) {
                for (var j = 0; j < this.tlist.length; j++) {
                    if (this.tlist[j][0] == args[0]) {
                        tmp = this.tlist[j];
                        break;
                    }
                }
            }

            for (var i = 0; i < this.tlist.length; i++) {
                var ele = this.tlist[i];

                // 注册“上一步”行为的处理函数
                if (ele[0] == tmp[5]) {
                    this.prevElement.onclick = methodDelegate(this, this.eventHandler, new Array(ele[0], ele[1], ele[2], ele[3], ele[4], true));
                    break;
                }
            }

        }

        // 定义“下一步”元素事件处理函数
        var tmpp = this.tlist[this.tlist.length - 1];

        for (var j = 0; j < this.tlist.length; j++) {
            if (this.tlist[j][1] == args[4]) {
                tmpp = this.tlist[j];
                break;
            }
        }

        this.nextElement.onclick = methodDelegate(this, this.eventHandler, new Array(tmpp[0], tmpp[1], tmpp[2], tmpp[3], tmpp[4], true));
    }

    this.prepareData = function() {
        var args = arguments[0].split(",");
        var argsArr = new Array(args[0].trim(), args[1].trim(), args[2].trim(), args[3].trim(), args[4].trim(), (this.tlist.length > 0) ? this.tlist[this.tlist.length - 1][0] : "");

        this.tlist.push(argsArr);

        return argsArr.Clone();
    }
}

function parseArgs() {
    var arr = [];
    var args = (arguments.length == 1) ? arguments[0] : null;

    if (args == null)
        return arr;

    for (var i = 0; i < args.length; i++) {
        arr.push(args[i]);
    }

    return arr;
}

function methodDelegate(obj, method, data) {
    var delegate = function() {
        var args = [];
        args.push(data);
        method.apply(obj, args);
    }

    return delegate;
}

function beforeLeftFrame() {
    return arguments[0];
}

function leftPage() {
    return arguments[0].length > 0;
}

function gTop() {
    var pV = arguments.callee;

    if (!pV.VZ) {
        try {
            if (window != parent)
            { pV.VZ = parent.gTop ? parent.gTop() : parent.parent.gTop(); } else {
                pV.VZ = window;
            }
        } catch (aG) { pV.VZ = window; }
    }

    return pV.VZ;
}

function getScriptParams() {
    var jsFileName = arguments[0];

    var rName = new RegExp(jsFileName + "(\\?(.*))?$")
    var jss = document.getElementsByTagName('script');

    for (var i = 0; i < jss.length; i++) {
        var j = jss[i];
        if (j.src && j.src.match(rName)) {
            var oo = j.src.match(rName)[2];
            if (oo && (t = oo.match(/([^&=]+)=([^=&]+)/g))) {
                for (var l = 0; l < t.length; l++) {
                    r = t[l];
                    var tt = r.match(/([^&=]+)=([^=&]+)/);

                    if (tt && tt[1] == arguments[1]) {
                        //                        document.write('参数：' + tt[1] + '，参数值：' + tt[2] + '<br />');
                        return tt[2];
                    }
                }
            }
        }
    }

    return "";
}



function confirmsuffix(ele) {
    var type = "pic";
    if (arguments[1] != "")
        type = arguments[1];
    if (ele.value == "")
        return true;

    var filename = ele.value;
    var exName = filename.substr(filename.lastIndexOf(".") + 1).toUpperCase();
    if (type == "video") {
        if (exName == "WMV" || exName == "FLV" || exName == "ASF" || exName == "SWF" || exName == "AVI" || exName == "MPEG")
            return true;
        else {
            alert("视频只能是 FLV,WMV,ASF,SWF,AVI,MPEG 格式!");
        }
    }
    else if (type == "music") {
        if (exName == "MP3" || exName == "WMA")
            return true;
        else {
            alert("文件格式只能是 MP3,WMA格式!");
        }
    }
    else if (type == "pic") {
        if (exName == "GIF" || exName == "JPG" || exName == "JPEG" || exName == "BMP" || exName == "PNG")
            return true;
        else {
            alert("图片只能是 jpg,bmp,png 或 gif 格式!");
        }
    }
    else {
        if (exName == "GIF" || exName == "JPG" || exName == "JPEG" || exName == "BMP" || exName == "PNG")
            return true;
        else {
            alert("图片只能是 jpg,bmp,png 或 gif 格式!");
        }
    }

    ele.select();
    ele.value = "";
    document.execCommand("delete");
    try {
        ele.form.submit();
    }
    catch (expt) { }
    return false;
}

function isEmail(str) {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(str);
}
function IsTelephone(obj)// 正则判断电话号码
{
    var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(^0{0,1}15[0-9]{9}$)|(^0{0,1}14[0-9]{9}$)|(^0{0,1}18[0-9]{9}$)/;
    if (pattern.test(obj)) {
        return true;
    }
    else {
        return false;
    }
}

function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

function getScrollTopBy(name) {
    var tag = document.getElementById(name);
    return tag.scrollTop;
}



function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
        var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
}


function getClientHeightBy(name) {

    var tag = document.getElementById(name);
    var clientHeight = 0;

    return tag.clientHeight;
}

function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

function getScorllHeightBy(name) {
    var tag = document.getElementById(name);
    return tag.scrollHeight;
}


function reachBottom() {
    if ((getScrollTop() + getClientHeight()) / getScrollHeight() >= 1 && getScrollTop()>0) {
        return true;
    } else {
        return false;
    }

}

function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}

function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

function loadBarSize() {
    for (var i = 0; i < arguments.length; i++) {
        $("#img" + (i + 1)).animate({ width: eval('"' + (arguments[i] / 100) * 300 + '"') }, 1500);
    }

}

//textarea插入
function insertText(obj,str) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;

    } else {
        obj.value += str;
    }

}

//textarea移动光标
function moveCursor(obj, length){
    obj.focus();
    var len = length || obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character',len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}