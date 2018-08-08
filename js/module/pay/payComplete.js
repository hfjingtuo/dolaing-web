var PayComplete = {
    orderId : "" ,
} ;
/**
 * 初始化订单相关数据
 */
$(function () {
    PayComplete.orderId = $.query.get("orderId");
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/order/detail/" + PayComplete.orderId,
        success: function (data) {
            console.log(data);
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var orderInfo = data.orderInfo;
                $("#orderSn").html("订单编号：" + orderInfo.orderSn + "&nbsp;&nbsp;&nbsp;下单时间：" + getDateTime(orderInfo.createTime));
                $("#userId").text("账户名称：" + orderInfo.userId);
                var receiptInformation = " 收货人：" + orderInfo.consignee + "</br> 收货电话：" + orderInfo.mobile + "</br>收货地址：" + orderInfo.address;
                $("#receiptInformation").html(receiptInformation);
                $("#buyerOrderAmount").text("￥" + orderInfo.buyerOrderAmount);
                timer(orderInfo.createTime);//订单倒计时
            }
        }
    });
});

function timer(timeStr) {
    var countdown = document.getElementById("countdown");
    setInterval(function () {
        //获取当前时间
        var now = new Date().getTime();
        //设置截止时间
        var startTime = new Date(timeStr).getTime();
        //时间差
        var leftTime = 1800000 - (now - startTime);//30分钟倒计时
        var minutes, second;
        if (leftTime >= 0) {
            minutes = Math.floor(leftTime / 1000 / 60 % 60);
            second = Math.floor(leftTime / 1000 % 60);
        }else {
            window.location = "/web/buyer/buyerCenter.html";
        }
        if ((minutes == 0 && second == 1) || countdown.innerHTML == "undefined分undefined秒") {
            window.location = "/web/buyer/buyerCenter.html";
        } else if (minutes == 0) {
            countdown.innerHTML = second + "秒";
        } else {
            countdown.innerHTML = minutes + "分" + second + "秒";
        }
    }, 1000);
}


/**
 * 支付方法
 */
PayComplete.pay = function(){
    var payPassword = $("#payPassword").val();
    var validateFlag = Dolaing.validate.checkBlank([
             {name:"支付密码",value:payPassword},
             {name:"订单号",value:PayComplete.orderId}]);
    if(!validateFlag){
        return validateFlag ;
    }

    if(payPassword.trim().length < 6 ){
         layer.alert("支付密码错误");
    }

    var ajaxObj = {
        timeout: 15000,
        url: SERVER_URL+"/orderRecord/pay?orderId="+PayComplete.orderId + "&payPassword="+payPassword,
        success: function (data) {
            console.log(data);
            if(data !=null && data.code == '1000'){
                window.location.href = "/web/pay/paySuccess.html?orderId="+PayComplete.orderId;
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);

}
