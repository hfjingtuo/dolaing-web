function login(){
    var userName = $("#userName").val();
    var pwd = $("#pwd").val();
    if (userName == "") {
        layer.tips("请输入手机号", '#userName', {
            tips : [ 2, '#f76592' ]
        });
        $("#userName").focus();
        return false;
    }
    if (pwd == "") {
        layer.tips("请输入密码", '#pwd', {
            tips : [ 2, '#f76592' ]
        });
        $("#pwd").focus();
        return false;
    }
    $.ajax({
        type: "POST",
        url:  SERVER_URL + "/login",
        data: "username=" + userName + "&password=" + pwd,
        success: function (data) {
            console.log(data);
            var message = data.message;
            if(data.code =="500"){
                layer.tips(message, "#userName", {
                    tips : [ 2, "#f76592" ]
                });
            }else{
                $.cookie('token', data.token);
                location.href = SERVER_URL + "/index.html";
            }
        },
    });
    return true;
}