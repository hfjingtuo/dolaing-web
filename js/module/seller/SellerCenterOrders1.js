$(function () {
    /***初始化左侧菜单**/
    SellCenterMenu.selectMenu(4);
    var orderId = $.query.get("orderId");
    getOrderDetail1(orderId);
});

function getOrderDetail1(orderId) {
    var getData = "?orderId=" + orderId;
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/sellerOrderDetail/getOrder" + getData,
        success: function (data) {
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var orderInfoVo = data.orderInfoVo;
                var goodsInfo = orderInfoVo.orderGoodsVos[0];
                var orderDetailHtml = buildOrderDetailHtml(orderInfoVo, goodsInfo);
                countdown(goodsInfo.endSubscribeTime, goodsInfo.goodsId); // 认购倒计时
                $("#orderDetails").html(orderDetailHtml);
            }
        }
    });
}

function buildOrderDetailHtml(order, goods) {
    $("#confirmTime").html(splitTime(order.createTime));
    var _html = "<img src=\"/img/img_color_line.png\"/>" +
        "<div class=\"details_part\">" +
        "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
        "<div class=\"fl details_part_list\">" +
        "<h3>订单当前状态：<span>待付款</span></h3>" +
        "<h3>订单编号：" + order.orderSn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下单时间：" + order.createTime + "</h3>" +
        "<h3>距离结束认购还有：" +
        "<span id='timer" + goods.goodsId + "'></span>" +
        "</h3>" +
        "<h3>应付金额：￥<span>" + order.buyerOrderAmount + "</span></h3>" +
        "<h3>农户ID：" + goods.farmerId + "</h3>" +
        "</div>" +
        "</div>" +
        "<div class=\"details_part\">" +
        "<img src=\"/img/icon_order_details_2.png\" class=\"fl\"/>" +
        "<div class=\"fl details_part_list\">" +
        "<h3>收货人：" + order.consignee + "</h3>" +
        "<h3>联系电话：" + order.mobile + "</h3>" +
        "<h3>收货地址：" + order.fullAddress + "</h3>" +
        "</div>" +
        "</div>";
    return _html;
}
