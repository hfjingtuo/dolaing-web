var PaySuccess = {
    orderId : "" ,
} ;
/**
 * 初始化订单相关数据
 */
$(function () {
    PaySuccess.orderId = $.query.get("orderId");
    var ajaxObj = {
        url: SERVER_URL + "/order/detail?orderId=" + PaySuccess.orderId,
        success: function (data) {
            console.log(data.data);
            if (data != null && data.code == '1000') {
                var orderInfo = data.orderInfo;
                $("#orderSn").html(orderInfo.orderSn);
                $("#orderCreateTime").html(orderInfo.createTime);
                $("#consignee").html(orderInfo.consignee);
                $("#mobile").html(orderInfo.mobile);
                $("#address").html(orderInfo.address);
            }else {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            }
        }
    }
    ajaxData(ajaxObj);
});

