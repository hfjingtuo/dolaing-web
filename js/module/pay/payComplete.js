/**
 * 初始化订单相关数据
 */
$(function () {
    var orderId = $.query.get("orderId");
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/order/detail/" + orderId,
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