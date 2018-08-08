document.write("<script language=javascript src='/js/jquery-1.7.2.min.js'></script>");
document.write("<script language=javascript src='/js/myjs.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.all.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.js'></script>");
document.write("<script language=javascript src='/js/jquery.cookie.js'></script>");
document.write("<script language=javascript src='/js/jquery.params.js'></script>");
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
        window.location.href = "/login.html";
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


var Dolaing = {
    user: {},
    view: {},
    page: {},
    validate: {}, //验证工具
    dictionary: {}
}

/**
 * 初始化数据字典
 */
Dolaing.dictionary = function (dictName) {
    $.ajax({
        url: SERVER_URL + "/getDictionary/" + dictName,
        method: "GET",
        cache: false,
        dataType: 'json',
        success: function (data) {
            $.each(data, function (i, val) {
                $("#catId").append('<option value=' + val.dictValue + '>' + val.dictLabel + '</option>');
            });
        }
    });
}

/**
 * 初始化头部
 */
Dolaing.view.info = function () {
    var token = $.cookie('token');
    var userName = $.cookie('userName');
    var user = $.cookie('user');
    var payAccountFlag = $.cookie('accountBankCode') == null ? false : true;
    var loginStatusHtml = "";
    var centerUrl = "";

    if (token == null || user == null) {
        loginStatusHtml = '欢迎您！<a href="/login.html">【登录】</a><a href="#">【注册】</a>';
    } else {
        Dolaing.user = JSON.parse(user);
        Dolaing.user.payAccountFlag = payAccountFlag;
        Dolaing.user.bankCode = $.cookie('accountBankCode');
        centerUrl = Dolaing.center.getUrl();
        loginStatusHtml = '欢迎您！<a href=\"' + centerUrl + '\">' + userName + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:goLogout();">注销</a>';
    }
    var _html = '<div class="auto">' +
        '<h6 class="fl">' + loginStatusHtml + '</h6>' +
        '<ul class="top_ul">' +
        '<li><a href="/index.html">' +
        '<h4 class="fl">网站首页</h4>' +
        '<!--<img src="img/nav_arrow_down.png" class="fl nav_arrow"/>-->' +
        '<img src="/img/img_nav_line.png" class="fl nav_line"/>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">关注我们</h4>' +
        '<img src="/img/nav_arrow_down.png" class="fl nav_arrow"/>' +
        '<img src="/img/img_nav_line.png" class="fl nav_line"/>' +
        '<ul class="top_list">' +
        '<li><a href="#">' +
        '<h4 class="fl" style="color: #F76592;">关注我们</h4>' +
        '<img src="/img/nav_arrow_up.png" class="fl nav_arrow"/>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">新手入门</h4>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">入驻帮助</h4>' +
        '</a></li>' +
        '</ul>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">帮助中心</h4>' +
        '<img src="/img/nav_arrow_down.png" class="fl nav_arrow"/>' +
        '<img src="/img/img_nav_line.png" class="fl nav_line"/>' +
        '<ul class="top_list">' +
        '<li><a href="#">' +
        '<h4 class="fl" style="color: #F76592;">帮助中心</h4>' +
        '<img src="/img/nav_arrow_up.png" class="fl nav_arrow"/>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">新手入门</h4>' +
        '</a></li>' +
        '<li><a href="#">' +
        '<h4 class="fl">入驻帮助</h4>' +
        '</a></li>' +
        '</ul>' +
        '</a></li>' +
        '</ul>' +
        '</div>';
    $(".top").html(_html);
};


/**
 * 根据类型获取个人中心地址
 * @type {{getUrl: Dolaing.center.getUrl}}
 */
Dolaing.center = {
    farmer : {
        tabMenu : function(menuId){
            if(menuId == "1"){
                window.location.href = "/web/farmer/farmerCenter.html";
            }else if(menuId == "2"){
                window.location.href = "/web/member/changePassword.html";
            }else if(menuId == "3"){
                goLogout();
            }
        }
    },
    buyer : {
        tabMenu : function(menuId){
            if(menuId == "1"){ //交易记录
                window.location.href = "/web/buyer/buyerCenter.html";
            }else if(menuId == "2"){
                window.location.href = "/web/member/changePassword.html";
            }else if(menuId == "3"){
                goLogout();
            }
        }
    },
    seller: {
        tabMenu: function (menuId) {
            if (menuId == "1") { //交易记录
                window.location.href = "/web/seller/sellerCenter.html";
            } else if (menuId == "2") { //发布产品
                window.location.href = "/web/seller/publishGoods.html";
            } else if (menuId == "3") { //已发布产品
                window.location.href = "/web/seller/publishedGoods.html";
            } else if (menuId == "4") {  //订单列表
                window.location.href = "/web/seller/sellerOrders.html";
            } else if (menuId == "5") {  //修改密码
                window.location.href = "/web/member/changePassword.html";
            }else if(menuId == "6"){
                goLogout();
            }
        }
    },
    getUrl: function () {
        if (Dolaing.user.type == "0" || Dolaing.user.type == "1") {
            return "/web/buyer/buyerCenter.html";
        } else if (Dolaing.user.type == "2") {
            return "/web/seller/sellerCenter.html";
        } else if (Dolaing.user.type == "3") {
            return "/web/farmer/farmerCenter.html";
        }
    }
}


/**
 * 验证是否为空
 * @param fieldObj : name 和 value
 * @param prefix
 * @param suffix
 */
Dolaing.validate.checkBlank = function (fieldObj, prefix, suffix) {
    if (prefix == null) {
        prefix = "请输入";
    }

    if (suffix == null) {
        suffix = "";
    }

    if (fieldObj instanceof Array) {
        for (var i = 0; i < fieldObj.length; i++) {
            if (fieldObj[i].value == null || (fieldObj[i].value+"").trim() == "") {
                layer.alert(prefix + fieldObj[i].name + suffix);
                return false;
            }
        }
    } else {
        if (fieldObj.value == null || fieldObj.value.trim() == "") {
            layer.alert(prefix + fieldObj.name + suffix);
            return false;
        }
    }

    return true;

}


/**
 * 分页
 * 当前页
 * 总页数
 * 数据总条数
 */
Dolaing.page.view = function (pageNo, totalPages, total, pageFun) {
    var pageView = '<div class="pages fr">' +
        '<ul><li class="pages_last" onclick="page(' + ((pageNo - 1) <= 0 ? 1 : (pageNo - 1)) + ')">上一页</li>';

    for (var i = 1; i <= totalPages; i++) {
        if (i == pageNo) {
            pageView += '<li class="pages_cur">' + i + '</li>';
        } else {
            pageView += '<li onclick="page(' + i + ')">' + i + '</li>';
        }
    }
    pageView += '<li class="pages_next" onclick="page(' + ((pageNo + 1) > totalPages ? totalPages : (pageNo + 1)) + ')">下一页</li>';
    pageView += '</ul></div>';
    return pageView;

}


/**
 * 时间处理
 */

Dolaing.date = {
    formatCh : function(dataStr){
        return dataStr.substr(0,4)+"年"+dataStr.substr(5,2)+"月"+dataStr.substr(8,2)+"日"
    }
}

/**
 * 全选框 点击之后 将 rangeId 内的所有checkbox 做同样操作
 */
Dolaing.selector = function ( className ,rangeId){
   if($("."+className).prop('checked')){
       $("#"+rangeId+" input[type='checkbox']").each(function(){
           $(this).prop("checked",true);
       });
   }else{
       $("#"+rangeId+" input[type='checkbox']").each(function(){
           $(this).prop("checked",false);
       });
   }
}





/**
 * 计算剩余时间（计时每秒）
 * @param time
 * @param id
 */
function countdown(time, id) {
    setInterval(function () {
        let nowTime = new Date(time) - new Date;
        let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        let days = parseInt(nowTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(nowTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        days = checkTime(days);
        hours = checkTime(hours);
        $("#timer" + id).text(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function splitTime(time) {
    var times = time.split(" ");
    return times[0] + "</br>" + times[1];
}