
function confirmSubmitEditPwd() {
    var oldPwd = $("#oldPwd").val().trim();
    var newPwd = $("#newPwd").val().trim();
    var rePwd = $("#rePwd").val().trim();
    if (oldPwd == "") {
        layer.tips("请输入账号原密码", '#oldPwd', {
            tips: [2, '#f76592']
        });
        $("#oldPwd").focus();
        return false;
    }
    if (newPwd == "") {
        layer.tips("请输入新密码", '#newPwd', {
            tips: [2, '#f76592']
        });
        $("#newPwd").focus();
        return false;
    }
    if (newPwd.length < 6 || newPwd.length > 20) {
        layer.tips("密码长度为6-20位", '#newPwd', {
            tips: [2, '#f76592']
        });
        $("#newPwd").focus();
        return false;
    }
    if (rePwd == "") {
        layer.tips("请再次输入密码", '#rePwd', {
            tips: [2, '#f76592']
        });
        $("#rePwd").focus();
        return false;
    }
    if (rePwd != newPwd) {
        layer.tips("两次密码输入不一致", '#rePwd', {
            tips: [2, '#f76592']
        });
        $("#rePwd").focus();
        return false;
    }
    var password = {};
    password.oldPwd = oldPwd;
    password.newPwd = newPwd;
    password.rePwd = rePwd;
    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/confirmSubmitEditPwd";
    ajaxObj.data = JSON.stringify(password);
    ajaxObj.success = function (data) {
        var code = data.code;
        var message = data.message;
        if (500 == code || 501 == code) {
            layer.tips(message, "#oldPwd", {
                tips: [2, "#f76592"]
            });
            $("#oldPwd").focus();
        } else if (502 == code) {
            layer.tips(message, "#newPwd", {
                tips: [2, "#f76592"]
            });
            $("#newPwd").focus();
        } else if (503 == code) {
            layer.tips(message, "#rePwd", {
                tips: [2, "#f76592"]
            });
            $("#rePwd").focus();
        } else {
            layer.alert("修改密码成功", function (index) {
                layer.close(index);
                location.href = "/web/seller/publishedGoods.html";
            });
        }
    }
    ajaxData(ajaxObj);
}