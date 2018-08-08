$(function () {
    var orderId = $.query.get("orderId");
    var account = $.cookie('userName');
    getOrderDetail6(orderId);
    getPayDetail1(orderId, account);
    getPayDetail2(orderId, account);
});

function getOrderDetail6(orderId) {
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
                $("#orderDetails").html(orderDetailHtml);
            }
        }
    });
}

var payDetailHtml = "";
function getPayDetail1(orderId, account) {
    var getData = "?orderId=" + orderId + "&account=" + account + "&processType=" + 1;
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var payDetailInfo = data.payDetailVo;
                payDetailHtml = buildPayDetailHtml1(payDetailInfo);
            }
        }
    });
}

function getPayDetail2(orderId, account) {
    var getData = "?orderId=" + orderId + "&account=" + account + "&processType=" + 2;
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var payDetailInfo = data.payDetailVo;
                payDetailHtml += buildPayDetailHtml2(payDetailInfo);
                $("#payDetails").html(payDetailHtml);
            }
        }
    });
}

function buildOrderDetailHtml(order, goods) {
    $("#confirmTime").html(splitTime(order.createTime));
    $("#payTime").html(splitTime(order.paidTime));
    $("#payTime2").html(splitTime(order.paidTime));
    $("#confirmShipTime").html(splitTime(order.deliveredTime));
    $("#confirmReceverTime").html(splitTime(order.receivedTime));
    $("#completeTime").html(splitTime(order.completedTime));
    var _html = "<img src=\"/img/img_color_line.png\"/>" +
        "<div class=\"details_part\">" +
        "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
        "<div class=\"fl details_part_list\">" +
        "<h3>订单当前状态：<span>已完成</span></h3>" +
        "<h3>订单编号：" + order.orderSn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下单时间：" + order.createTime + "</h3>" +
        "<h3>付款时间：" + order.paidTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发货时间：" + order.deliveredTime + "</h3>" +
        "<h3>完成时间：" + order.completedTime + "</h3>" +
        "<h3>实付金额：￥<span>" + order.buyerMoneyPaid + "</span></h3>" +
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

var deposit; // 定金
function buildPayDetailHtml1(payDetail) {
    var _html = "<div class=\"details_part\">" +
        "<img src=\"/img/icon_order_details_3.png\" class=\"fl\" style=\"margin-top: 30px;\"/>" +
        "<div class=\"fl details_part_list\">" +
        "<h3>付款方式：" + payDetail.paymentName + "</h3>" +
        "<h3>付款时间：" + payDetail.createTime + "</h3>" +
        "<h3>到账时间：" + payDetail.updateTime + "</h3>" +
        "<h3>证联交易号：" + payDetail.seqId + "</h3>" +
        "</div>" +
        "<h1 class=\"fr details_part_money\" >￥<span style=\"color: #F76096;font-weight: bold;font-size: 18px;\">" + payDetail.amount + "</span>" +
        "</br><span style=\"color: #F76096;margin-right: 4px;\">定金</span></h1>" +
        "</div>";
    deposit = payDetail.amount;
    return _html;
}

function buildPayDetailHtml2(payDetail) {
    var total = deposit + payDetail.amount;
    var _html = "<div class=\"details_part\">" +
        "<div class=\"fl details_part_list\" style=\"margin-left: 90px;\">" +
        "<h3>付款方式：" + payDetail.paymentName + "</h3>" +
        "<h3>付款时间：" + payDetail.createTime + "</h3>" +
        "<h3>到账时间：" + payDetail.updateTime + "</h3>" +
        "<h3>证联交易号：" + payDetail.seqId + "</h3>" +
        "</div>" +
        "<h1 class=\"fr details_part_money\" >￥<span style=\"color: #F76096;font-weight: bold;font-size: 18px;\">" + payDetail.amount + "</span>" +
        "</br><span style=\"color: #F76096;margin-right: 4px;\">尾款</span></h1>" +
        "</div>" +
        "<div class=\"details_part\">" +
        "<div class=\"fl details_part_list\" style=\"margin-left: 90px;margin-top: 27px;\">" +
        "<h3>含运费（0元）</h3>" +
        "</div>" +
        "<h1 class=\"fr details_part_money\" style=\"margin-top: 20px;\">￥" +
        "<span style=\"color: #F76096;font-weight: bold;font-size: 18px;\">" + total + "</span>" +
        "</br><span style=\"color: #F76096;margin-right: 4px;\">总计</span>" +
        "</h1>" +
        "</div>";
    return _html;
}

