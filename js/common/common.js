document.write("<script language=javascript src='/js/jquery-1.7.2.min.js'></script>");
document.write("<script language=javascript src='/js/myjs.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.all.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.js'></script>");
document.write("<script language=javascript src='/js/jquery.cookie.js'></script>");

var SERVER_URL = "http://localhost:8080/dolaing";

function ajaxData(ajaxObj) {
    if (ajaxObj.type == null || ajaxObj.type == "") {
        ajaxObj.type = "POST";
    }

    if (ajaxObj.url == null || ajaxObj.url == "") {
        return false;
    }

    if (ajaxObj.contentType == null || ajaxObj.contentType == undefined) {
        ajaxObj.contentType = "application/json; charset=utf-8";
    }

    if (ajaxObj.timeout == null || ajaxObj.timeout == undefined) {
        ajaxObj.timeout = 5000;
    }

    if (ajaxObj.cache == null || ajaxObj.cache == undefined) {
        ajaxObj.cache = false;
    }

    /**
     * 传递的数据 返回给成功的结果
     */
    if (ajaxObj.params == null || ajaxObj.params == undefined) {
        ajaxObj.params = null;
    }

    /**
     * 传递的数据 返回给成功的结果
     */
    if (ajaxObj.authorization == null || ajaxObj.authorization == undefined) {
        ajaxObj.authorization = true;
    }

    var index = layer.load(0, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    var token = $.cookie('token');
    var Authorization = "Bearer " + token;
    if (ajaxObj.authorization && (token == null || token == "")) {
        window.location.href = "./login.html";
        return false;
    }
    $.ajax({
        type: ajaxObj.type,
        url: ajaxObj.url,
        data: ajaxObj.data,
        contentType: ajaxObj.contentType,
        timeout: ajaxObj.timeout,
        cache: ajaxObj.cache,
        dataType: ajaxObj.dataType,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        },
        async: (ajaxObj.async == null ? true : false),
        success: function (data) {
            if (data.code == null || data.code == "502") {
                window.location.href = "/login.html";
                return;
            }

            if (ajaxObj.success != null && typeof(ajaxObj.success) === "function") {
                ajaxObj.success(data, ajaxObj.params);
            }
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            /**
             * 错误处理 待补充完整
             */
            if (XmlHttpRequest.status != null) {
                layer.alert("服务链接失败,请稍后再试。", {
                    icon: 2
                });
            }
            if (ajaxObj.error != null && typeof(ajaxObj.error) === "function") {
                ajaxObj.error();
            }
        },
        complete: function (XmlHttpRequest, textStatus, errorThrown) {
            layer.close(index);
            if (ajaxObj.complete != null && typeof(ajaxObj.complete) === "function") {
                ajaxObj.complete();
            }
        }
    });
}

//设置全局变量
var indexData = {
    pageSize: 9,
    pageNo: 1,
    html: ""
};

/**
 * 获取时间
 * @param str
 * @returns {年月日}
 */
function getDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
    return oTime;
}

/**
 * 获取时间
 * @param str
 * @returns {年月日时分秒}
 */
function getDateTime(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
    return oTime;
}

//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

/**
 * 初始化头部数据
 */
function initTopData() {
    var token = $.cookie('token');
    var userName = $.cookie('userName');
    if (token != null) {
        var html = "欢迎您！<a href='/web/seller/publishGoods.html'>" + userName + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href='javascript:goLogout();'>注销</a>";
        $("#loginStatus").html(html);
    }
}

function goLogin() {
    var redirectUrl = location.href;
    $.cookie('redirectUrl', redirectUrl, { path: "/"});
    location.href = "/login.html";
}

function goLogout() {
    $.cookie('redirectUrl', '', {expires: -1});
    location.href = "/login.html";
}

/**
 * 非空判断
 */
function isEmpty(str) {
    if (str != null && str != "") {
        return true;
    }
    return false;
}