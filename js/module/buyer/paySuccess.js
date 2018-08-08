var PaySuccess = {
    orderId : "" ,
} ;
/**
 * 初始化订单相关数据
 */
$(function () {
    PaySuccess.orderId = $.query.get("orderId");
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/order/detail/" + PaySuccess.orderId,
        success: function (data) {
            console.log(data);
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var orderInfo = data.orderInfo;
                $("#orderSn").html(orderInfo.orderSn);
                $("#orderCreateTime").html(orderInfo.createTime);
                $("#consignee").html(orderInfo.consignee);
                $("#mobile").html(orderInfo.mobile);
                $("#address").html(orderInfo.province + orderInfo.city + orderInfo.district + orderInfo.address);
            }
        }
    });
});

