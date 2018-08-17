$(function () {
    var orderId = $.query.get("orderId");
    var sellerReceiveStatus = $.query.get("sellerReceiveStatus");
    var orderStatus = $.query.get("orderStatus");
    // var account = $.cookie('userName');
    var orderNum = 0;
    if (orderStatus == 1 && sellerReceiveStatus == 0) {
        orderNum = 1;
        $("#payDetails").hide();
    } else if (orderStatus == 2 && sellerReceiveStatus == 1) {
        orderNum = 2;
        $("#payDetails").hide();
    } else if (orderStatus == 2 && sellerReceiveStatus == 2) {
        orderNum = 3;
        $("#payDetails").show();
    } else if (orderStatus == 3 && sellerReceiveStatus == 3) {
        $("#payDetails").show();
        orderNum = 4;
    } else if (orderStatus == 100 && sellerReceiveStatus == 3) {
        $("#payDetails").show();
        orderNum = 5;
    } else if (orderStatus == 100 && sellerReceiveStatus == 4) {
        $("#payDetails").show();
        orderNum = 6;
    }
    getOrderDetail(orderId, orderNum);
    if (orderNum == 3 || orderNum == 4 || orderNum == 5 || orderNum == 6) {
        getPayDetail(orderId, orderNum);
    }
});

function getOrderDetail(orderId, orderNum) {
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
                var orderDetailHtml = buildOrderDetailHtml(orderInfoVo, goodsInfo, orderNum);
                if (orderNum == 1 || orderNum == 2) {
                    countdown(goodsInfo.endSubscribeTime, goodsInfo.goodsId); // 认购倒计时
                } else if (orderNum == 3) {
                    countdown(goodsInfo.expectDeliverTime, goodsInfo.goodsId); // 发货倒计时
                }
                $("#orderDetails").html(orderDetailHtml);
            }
        }
    });
}

function buildOrderDetailHtml(order, goods, orderNum) {
    var _html = "";
    if (orderNum == 1) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1-2.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
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
    } else if (orderNum == 2) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1.png\"/></li>" +
            "<li><img src=\"/img/icon_point_2-2.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        $("#payTime").html(splitTime(order.paidTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
            "<div class=\"details_part\">" +
            "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
            "<div class=\"fl details_part_list\">" +
            "<h3>订单当前状态：<span>生产中</span></h3>" +
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
    } else if (orderNum == 3) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1.png\"/></li>" +
            "<li><img src=\"/img/icon_point_2.png\"/></li>" +
            "<li><img src=\"/img/icon_point_3-2.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        $("#payTime").html(splitTime(order.paidTime));
        $("#payTime2").html(splitTime(order.paidTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
            "<div class=\"details_part\">" +
            "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
            "<div class=\"fl details_part_list\">" +
            "<h3>订单当前状态：<span>生产中</span></h3>" +
            "<h3>订单编号：" + order.orderSn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下单时间：" + order.createTime + "</h3>" +
            "<h3>付款时间：" + order.paidTime + "</h3>" +
            "<h3>距离发货日期：" +
            "<span id='timer" + goods.goodsId + "'></span>" +
            "</h3>" +
            "<h3>实付金额：￥<span>" + order.buyerMoneyPaid + "</span></h3>" +
            "<h3>农户ID：" + goods.farmerId + "</h3>" +
            "</div>" +
            "<div class=\" btn_order\">" +
            "<h3>发货</h3>" +
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
    } else if (orderNum == 4) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1.png\"/></li>" +
            "<li><img src=\"/img/icon_point_2.png\"/></li>" +
            "<li><img src=\"/img/icon_point_3.png\"/></li>" +
            "<li><img src=\"/img/icon_point_4-2.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        $("#payTime").html(splitTime(order.paidTime));
        $("#payTime2").html(splitTime(order.paidTime));
        $("#confirmShipTime").html(splitTime(order.deliveredTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
            "<div class=\"details_part\">" +
            "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
            "<div class=\"fl details_part_list\">" +
            "<h3>订单当前状态：<span>待收货</span></h3>" +
            "<h3>订单编号：" + order.orderSn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下单时间：" + order.createTime + "</h3>" +
            "<h3>付款时间：" + order.paidTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发货时间：" + order.deliveredTime + "</h3>" +
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
    } else if (orderNum == 5) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1.png\"/></li>" +
            "<li><img src=\"/img/icon_point_2.png\"/></li>" +
            "<li><img src=\"/img/icon_point_3.png\"/></li>" +
            "<li><img src=\"/img/icon_point_4.png\"/></li>" +
            "<li><img src=\"/img/icon_point_5-2.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        $("#payTime").html(splitTime(order.paidTime));
        $("#payTime2").html(splitTime(order.paidTime));
        $("#confirmShipTime").html(splitTime(order.deliveredTime));
        $("#confirmReceverTime").html(splitTime(order.receivedTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
            "<div class=\"details_part\">" +
            "<img src=\"/img/icon_order_details_1.png\" class=\"fl\"/>" +
            "<div class=\"fl details_part_list\">" +
            "<h3>订单当前状态：<span>已收货</span></h3>" +
            "<h3>订单编号：" + order.orderSn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下单时间：" + order.createTime + "</h3>" +
            "<h3>付款时间：" + order.paidTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发货时间：" + order.deliveredTime + "</h3>" +
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
    } else if (orderNum == 6) {
        $("#imgOrderLine").html("<li><img src=\"/img/icon_point_1.png\"/></li>" +
            "<li><img src=\"/img/icon_point_2.png\"/></li>" +
            "<li><img src=\"/img/icon_point_3.png\"/></li>" +
            "<li><img src=\"/img/icon_point_4.png\"/></li>" +
            "<li><img src=\"/img/icon_point_5.png\"/></li>" +
            "<li><img src=\"/img/icon_point_6.png\"/></li>");
        $("#confirmTime").html(splitTime(order.createTime));
        $("#payTime").html(splitTime(order.paidTime));
        $("#payTime2").html(splitTime(order.paidTime));
        $("#confirmShipTime").html(splitTime(order.deliveredTime));
        $("#confirmReceverTime").html(splitTime(order.receivedTime));
        $("#completeTime").html(splitTime(order.completedTime));
        _html = "<img src=\"/img/img_color_line.png\"/>" +
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
    }
    return _html;
}

var payDetailHtml = "";
var deposit = 0; // 定金
function getPayDetail(orderId, orderNum) {
    var getData = "?orderId=" + orderId  + "&processType=" + 1;
    var ajaxObj = {
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                var payDetailInfo = data.data;
                payDetailHtml += buildPayDetailHtml(payDetailInfo);
                if (orderNum == 6) {
                    deposit = payDetailInfo.amount;
                    $("#payDetails").css('margin-bottom', '60');
                    getPayDetail2(orderId);
                } else {
                    $("#payDetails").html(payDetailHtml);
                }
            }else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

function buildPayDetailHtml(payDetail) {
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
    return _html;
}

function getPayDetail2(orderId) {
    var getData = "?orderId=" + orderId + "&processType=" + 2;
    var ajaxObj = {
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                var payDetailInfo = data.data;
                payDetailHtml += buildPayDetailHtml2(payDetailInfo);
                $("#payDetails").html(payDetailHtml);
            }else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
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

