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
    console.log(getDateTime(timeStr));
    console.log(timeStr);
    console.log(new Date().getTime());
    console.log(new Date(timeStr).getTime());
    setInterval(function () {
        let nowTime = new Date(timeStr) - new Date;
        let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        countdown.innerHTML = minutes + "分" + seconds + "秒";
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}