/**
 * 验证手机号是否被注册
 */
function validUserName() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: SERVER_URL + "/validUserName",
        data: "userName=" + $("#userName").val().trim(),
        success: function (data) {
            var message = data.message;
            if (501 == data.code) {
                layer.tips(message, '#userName', {
                    tips: [2, '#f76592']
                });
            }
        }
    });
}

/**
 * 验证码获取
 */
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
$(function () {
    $("#btnSendCode").on('click', function () {
        var userName = $("#userName").val().trim();
        var pwd = $("#pwd").val().trim();
        var confirmPwd = $("#confirmPwd").val().trim();
        var phoneRegex = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (userName == "") {
            layer.tips("请输入手机号", '#userName', {
                tips: [2, '#f76592']
            });
            $("#userName").focus();
            return false;
        }
        if (!phoneRegex.test(userName)) {
            layer.tips("手机号格式不正确", '#userName', {
                tips: [2, '#f76592']
            });
            $("#userName").focus();
            return false;
        }
        if (pwd == "") {
            layer.tips("请输入密码", '#pwd', {
                tips: [2, '#f76592']
            });
            $("#pwd").focus();
            return false;
        }
        if (pwd.length < 6 || pwd.length > 20) {
            layer.tips("密码长度为6-20位", '#pwd', {
                tips: [2, '#f76592']
            });
            $("#pwd").focus();
            return false;
        }
        if (confirmPwd == "") {
            layer.tips("请再次输入密码", '#confirmPwd', {
                tips: [2, '#f76592']
            });
            $("#confirmPwd").focus();
            return false;
        }
        if (confirmPwd != pwd) {
            layer.tips("两次输入密码不一致", '#confirmPwd', {
                tips: [2, '#f76592']
            });
            $("#confirmPwd").focus();
            return false;
        }
        var disabled = $("#btnSendCode").attr("disabled");
        if (disabled) {
            return false;
        }
        var index = layer.load(1, {
            shade: [0.3, '#000'] //0.1透明度的白色背景
        });
        // 向后台发送处理数据
        $.ajax({
            type: "POST",
            dataType: "json",
            url: SERVER_URL + "/code/msgCode",
            data: "phone=" + userName,
            success: function (data) {
                console.log(data);
                var message = data.message;
                var code = data.code;
                console.log(message);
                if (200 == code) {
                    curCount = count;
                    // 设置button效果，开始计时
                    $("#btnSendCode").attr("disabled", "disabled");
                    $("#btnSendCode").css("color", "red");
                    $("#btnSendCode").html(curCount + "s后获取");
                    // 启动计时器timer处理函数，1秒执行一次
                    InterValObj = window.setInterval(SetRemainTime, 1000);
                    layer.tips("短信验证码发送成功", '#msgCode', {
                        tips: [2, '#f76592']
                    });
                    $("#msgCode").focus();
                } else if (501 == code) {
                    layer.tips(message, '#msgCode', {
                        tips: [2, '#f76592']
                    });
                    $("#msgCode").focus();
                }else{
                    layer.tips(message, '#msgCode', {
                        tips: [2, '#f76592']
                    });
                    curCount = code;
                    $("#btnSendCode").attr("disabled", "disabled");
                    $("#btnSendCode").css("color", "red");
                    $("#btnSendCode").html(curCount + "s后获取");
                    InterValObj = window.setInterval(SetRemainTime, 1000);
                    $("#msgCode").focus();
                }
                layer.close(index);
            }
        });
    });
});

function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);
        $("#btnSendCode").removeAttr("disabled");
        $("#btnSendCode").css("color", "");
        $("#btnSendCode").html("获取验证码");
    } else {
        curCount--;
        $("#btnSendCode").html(curCount + "s后获取");
    }
}

/**
 * 提交注册
 */
function register() {
    var userName = $("#userName").val().trim();
    var pwd = $("#pwd").val().trim();
    var confirmPwd = $("#confirmPwd").val().trim();
    var msgCode = $("#msgCode").val().trim();
    var phoneRegex = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (userName == "") {
        layer.tips("请输入用户名", '#userName', {
            tips: [2, '#f76592']
        });
        $("#userName").focus();
        return false;
    }
    if (!phoneRegex.test(userName)) {
        layer.tips("手机号格式不正确", '#userName', {
            tips: [2, '#f76592']
        });
        $("#userName").focus();
        return false;
    }
    if (pwd == "") {
        layer.tips("请输入密码", '#pwd', {
            tips: [2, '#f76592']
        });
        $("#pwd").focus();
        return false;
    }
    if (pwd.length < 6 || pwd.length > 20) {
        layer.tips("密码长度为6-20位", '#pwd', {
            tips: [2, '#f76592']
        });
        $("#pwd").focus();
        return false;
    }
    if (confirmPwd == "") {
        layer.tips("请再次输入密码", '#confirmPwd', {
            tips: [2, '#f76592']
        });
        $("#confirmPwd").focus();
        return false;
    }
    if (confirmPwd != pwd) {
        layer.tips("两次输入密码不一致", '#confirmPwd', {
            tips: [2, '#f76592']
        });
        $("#confirmPwd").focus();
        return false;
    }
    if (msgCode == "") {
        layer.tips("请输入短信验证码", '#msgCode', {
            tips: [2, '#f76592']
        });
        $("#msgCode").focus();
        return false;
    }
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/register",
        data: "userName=" + userName + "&password=" + pwd + "&msgCode=" + msgCode,
        success: function (data) {
            var code = data.code;
            var message = data.message;
            if (500 == code || 501 == code) {
                layer.tips(message, "#userName", {
                    tips: [2, "#f76592"]
                });
                $("#userName").focus();
            } else if (503 == code) {
                layer.tips(message, "#msgCode", {
                    tips: [2, "#f76592"]
                });
                $("#msgCode").focus();
            } else if (502 == code) {
                layer.tips(message, "#pwd", {
                    tips: [2, "#f76592"]
                });
                $("#pwd").focus();
            } else {
                location.href = "/registerSuccess.html";
            }
        },
    });
    return true;
}