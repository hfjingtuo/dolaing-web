$(function () {
    $.cookie('token', '', {expires: -1});
    $.cookie('accountBankCode', '', {expires: -1});
    $.cookie('user', '', {expires: -1});
    $.cookie('userName', '', {expires: -1})
});

function login() {
    var userName = $("#userName").val();
    var pwd = $("#pwd").val();
    if (userName == "") {
        layer.tips("请输入手机号", '#userName', {
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
    $.ajax({
        type: "POST",
        url: SERVER_URL + "/login",
        data: "userName=" + userName + "&password=" + pwd,
        success: function (data) {
            console.log(data);
            var message = data.message;
            if (data.code == "500") {
                layer.tips(message, "#userName", {
                    tips: [2, "#f76592"]
                });
            } else {
                $.cookie('token', data.token,{ path: '/'});
                $.cookie('accountBankCode', data.accountBankCode,{expires:7, path: '/'});
                $.cookie('user', JSON.stringify(data.user),{ path: '/'});
                $.cookie('userName', userName,{ path: '/'});
                location.href = "/index.html";
            }
        },
    });
    return true;
}