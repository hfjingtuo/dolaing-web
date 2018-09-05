document.write("<script language=javascript src='/js/jquery-1.7.2.min.js'></script>");
document.write("<script language=javascript src='/js/myjs.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.all.js'></script>");
document.write("<script language=javascript src='/js/layui/layui.js'></script>");
document.write("<script language=javascript src='/js/jquery.cookie.js'></script>");
document.write("<script language=javascript src='/js/jquery.params.js'></script>");
var SERVER_URL = "http://39.104.123.195:8067/dolaing";
var IMAGE_URL = "http://39.104.123.195:8067/dolaing/upload/";
// var SERVER_URL = "http://localhost:8067/dolaing";
// var IMAGE_URL = "http://localhost:8067/dolaing/upload/";

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
            if (data.code == null || data.code == "502" || data.code == "700") {
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

function goLogout() {
    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/logout";
    ajaxObj.success = function () {
        $.cookie('user', '', {expires: -1, path: '/'});
        $.cookie('token', '', {expires: -1, path: '/'});
        location.href = "/login.html";
    }
    ajaxData(ajaxObj);
}

/**
 * 非空判断
 */
function isEmpty(str) {
    if (str != null && str != "") {
        return false;
    }
    return true;
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
    var optionVal = $("#" + dictName + "Val").val();
    console.log("optionVal=" + optionVal);
    var ajaxObj = {
        url: SERVER_URL + "/getDictionary?dictName=" + dictName,
        success: function (data) {
            if (data != null && data.code == '1000') {
                $.each(data.data, function (i, val) {
                    if (optionVal == "") {
                        $("#catId").append('<option value=' + val.dictValue + '>' + val.dictLabel + '</option>');
                    } else {
                        if (optionVal == val.dictValue) {
                            $("#catId").append('<option selected value=' + val.dictValue + '>' + val.dictLabel + '</option>');
                        } else {
                            $("#catId").append('<option value=' + val.dictValue + '>' + val.dictLabel + '</option>');
                        }
                    }
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

/**
 * 初始化头部
 */
Dolaing.view.info = function () {
    var token = $.cookie('token');
    var user = $.cookie('user');
    var userPayAccount = $.cookie('userPayAccount');
    var loginStatusHtml = "";
    var centerUrl = "";

    if (token == null || user == null) {
        loginStatusHtml = '欢迎您！<a href="/login.html">【登录】</a><a href="/registerBuyer.html">【注册】</a>';
    } else {
        Dolaing.user = JSON.parse(user);
        Dolaing.user.userPayAccount = userPayAccount == null ? null : JSON.parse(userPayAccount);
        centerUrl = Dolaing.center.getUrl();
        loginStatusHtml = '欢迎您！<a href=\"' + centerUrl + '\">' + Dolaing.user.account + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:goLogout();">注销</a>';
    }
    var _html = '<div class="auto">' +
        '<h6 class="fl">' + loginStatusHtml + '</h6>' +
        '<ul class="top_ul">' +
        '<li><a href="/index.html">' +
        '<h4 class="fl">网站首页</h4>' +
        // '<img src="/img/img_nav_line.png" class="fl nav_line" />' +
        '</a></li>' +
        /*'<li><a href="#">' +
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
        '</a></li>' +*/
        '</ul>' +
        '</div>';
    $(".top").html(_html);
};


/**
 * 根据类型获取个人中心地址
 * @type {{getUrl: Dolaing.center.getUrl}}
 */
Dolaing.center = {
    farmer: {
        tabMenu: function (menuId) {
            if (menuId == "1") {
                window.location.href = "/web/farmer/farmerCenter.html";
            } else if (menuId == "2") {
                window.location.href = "/web/member/changePassword.html";
            } else if (menuId == "3") {
                goLogout();
            }
        }
    },
    buyer: {
        tabMenu: function (menuId) {
            if (menuId == "1") { //交易记录
                window.location.href = "/web/buyer/buyerCenter.html";
            } else if (menuId == "2") {
                window.location.href = "/web/member/changePassword.html";
            } else if (menuId == "3") {
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
            } else if (menuId == "6") {
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
    },
    getBank: function (bankCode) { //根据银行编号获取银行名称和图标
        var bank;
        switch (bankCode) {
            case "0102" :
                bank = {name: "中国工商银行", image: "/img/banks/bank_02.jpg", code: bankCode};
                break;
            case "0103" :
                bank = {name: "中国农业银行", image: "/img/banks/bank_03.jpg", code: bankCode};
                break;
            case "0104" :
                bank = {name: "中国银行", image: "/img/banks/bank_04.jpg", code: bankCode};
                break;
            case "0105" :
                bank = {name: "中国建设银行", image: "/img/banks/bank_05.jpg", code: bankCode};
                break;
            case "0301" :
                bank = {name: "交通银行", image: "/img/banks/bank_06.jpg", code: bankCode};
                break;
            case "0302" :
                bank = {name: "中信银行", image: "/img/banks/bank_14.jpg", code: bankCode};
                break;
            case "0303" :
                bank = {name: "中国光大银行", image: "/img/banks/bank_01.jpg", code: bankCode};
                break;
            case "0304" :
                bank = {name: "华夏银行", image: "/img/banks/bank_11.jpg", code: bankCode};
                break;
            case "0305" :
                bank = {name: "中国民生银行", image: "/img/banks/bank_09.jpg", code: bankCode};
                break;
            case "0306" :
                bank = {name: "广东发展银行", image: "/img/banks/bank_12.jpg", code: bankCode};
                break;
            case "0307" :
                bank = {name: "深圳发展银行", image: "/img/banks/bank_13.jpg", code: bankCode};
                break;
            case "0308" :
                bank = {name: "招商银行", image: "/img/banks/bank_07.jpg", code: bankCode};
                break;
            case "0309" :
                bank = {name: "兴业银行", image: "/img/banks/bank_10.jpg", code: bankCode};
                break;
            case "0310" :
                bank = {name: "上海浦东发展银行", image: "/img/banks/bank_08.jpg", code: bankCode};
                break;
            default:
                bank = null;
        }

        return bank;


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
            if (fieldObj[i].value == null || (fieldObj[i].value + "").trim() == "") {
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
    var pageView = '<ul><li class="pages_last" onclick="page(' + ((pageNo - 1) <= 0 ? 1 : (pageNo - 1)) + ')">上一页</li>';

    for (var i = 1; i <= totalPages; i++) {
        if (i == pageNo) {
            pageView += '<li class="pages_cur">' + i + '</li>';
        } else {
            pageView += '<li onclick="page(' + i + ')">' + i + '</li>';
        }
    }
    pageView += '<li class="pages_next" onclick="page(' + ((pageNo + 1) > totalPages ? totalPages : (pageNo + 1)) + ')">下一页</li>';
    pageView += '</ul>';
    return pageView;

}


/**
 * 时间处理
 */

Dolaing.date = {
    formatCh: function (dataStr) {
        return dataStr.substr(0, 4) + "年" + dataStr.substr(5, 2) + "月" + dataStr.substr(8, 2) + "日"
    }
}

/**
 * 全选框 点击之后 将 rangeId 内的所有checkbox 做同样操作
 */
Dolaing.selector = function (ele, rangeId) {
    if ($(ele).prop('checked')) {
        $("#" + rangeId + " input[type='checkbox']").each(function () {
            $(this).prop("checked", true);
        });
    } else {
        $("#" + rangeId + " input[type='checkbox']").each(function () {
            $(this).prop("checked", false);
        });
    }
}


/**
 * 计算剩余时间（计时每秒）
 * @param time
 * @param id
 */
function countdown(time, id, type) {
    setInterval(function () {
        if (type == 0) { // 付款
            //获取当前时间
            var now = new Date().getTime();
            //设置截止时间
            var startTime = new Date(time).getTime();
            //时间差
            var leftTime = 1800000 - (now - startTime);//30分钟倒计时
            var minutes = 0, second = 0;
            if (leftTime >= 0) {
                minutes = Math.floor(leftTime / 1000 / 60 % 60);
                second = Math.floor(leftTime / 1000 % 60);
            } else {
                clearInterval();
                $("#timer" + id).text("0分0秒");
                window.location = "/web/seller/sellerOrders.html";
                return;
            }
            if ((minutes == 0 && second <= 1)) {
                clearInterval();
                $("#timer" + id).text("0分0秒");
                window.location = "/web/seller/sellerOrders.html";
                return;
            } else if (minutes == 0) {
                $("#timer" + id).text(second + "秒");
            } else {
                $("#timer" + id).text(minutes + "分" + second + "秒");
            }
        } else if (type == 1) { // 发货或认购
            let nowTime = new Date(time) - new Date;
            if (nowTime < 1000) {
                clearInterval();
                $("#timer" + id).text("0天0小时0分0秒");
            } else {
                let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

                minutes = checkTime(minutes);
                seconds = checkTime(seconds);
                let days = parseInt(nowTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                let hours = parseInt(nowTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                days = checkTime(days);
                hours = checkTime(hours);
                $("#timer" + id).text(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
            }
        }
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function splitTime(time) {
    if(time == null || time == ""){
        return "" ;
    }
    var times = time.split(" ");
    return times[0] + "</br>" + times[1];
}


/**
 * 验证是否为邮箱
 * @param str
 * @returns {boolean}
 */
Dolaing.validate.isEmail = function (str) {
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
}

/**
 * 验证是否为手机号
 * @param str
 * @returns {boolean}
 */
Dolaing.validate.isMobile = function (str) {
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    //如果为1开头则验证手机号码
    if (str.substring(0, 1) == "1") {
        if (!reg.test(str) || str.length != 11) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

/**
 * 验证是否为座机号
 * @param str
 * @returns {boolean}
 */
Dolaing.validate.isPhone = function (str) {
    var reg = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;
    //如果为0开头则验证固定电话号码
    if (str.substring(0, 1) == "0") {
        if (!reg.test(str)) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

/**
 * 身份证验证
 * @param idCard
 * @returns {boolean}
 */
Dolaing.validate.isPersonNo = function (idCard) {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17);//得到最后一位身份证号码
            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                    //alert("恭喜通过验证啦！");
                } else {
                    return false;
                    //alert("身份证号码错误！");
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    //alert("恭喜通过验证啦！");
                    return true;
                } else {
                    return false;
                    //alert("身份证号码错误！");
                }
            }
        }
    } else {
        //alert("身份证格式不正确!");
        return false;
    }

}


Dolaing.openGoodsDetail = function (id) {
    window.open("/goodsDetails.html?id=" + id);
}