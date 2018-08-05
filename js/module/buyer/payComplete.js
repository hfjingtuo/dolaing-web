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
                var receiptInformation = " 收货人：" + orderInfo.consignee + "</br> 收货电话：" + orderInfo.mobile + "</br>收货地址：" + orderInfo.province + orderInfo.city + orderInfo.district + orderInfo.address;
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
