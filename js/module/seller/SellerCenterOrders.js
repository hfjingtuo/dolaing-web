$(function () {
    var orderId = $.query.get("orderId");
    var sellerReceiveStatus = $.query.get("sellerReceiveStatus");
    var orderStatus = $.query.get("orderStatus");
    // var account = $.cookie('userName');
    var orderNum = 0;
    if (orderStatus == 1 && sellerReceiveStatus == 0) {
        orderNum = 1;
        $("#payDetails").hide();
    } else if (orderStatus == 2 && sellerReceiveStatus == 0) {
        orderNum = 2;
        $("#payDetails").hide();
    } else if (orderStatus == 2 && (sellerReceiveStatus == 1 || sellerReceiveStatus == 2)) {
        orderNum = 3;
        $("#payDetails").show();
    } else if (orderStatus == 3) {
        $("#payDetails").show();
        orderNum = 4;
    } else if (orderStatus == 100 && (sellerReceiveStatus != 3 && sellerReceiveStatus != 4)) {
        $("#payDetails").show();
        orderNum = 5;
    } else if (orderStatus == 100 && (sellerReceiveStatus == 3 || sellerReceiveStatus == 4)) {
        $("#payDetails").show();
        orderNum = 6;
    }
    getOrderDetail(orderId, orderNum);
    if (orderNum == 3 || orderNum == 4 || orderNum == 5 || orderNum == 6) {
        getPayDetail(orderId, orderNum, sellerReceiveStatus);
    }
});

var total = 0; // 商品总金额
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
                total = orderInfoVo.goodsAmount;
                var goodsInfo = orderInfoVo.orderGoodsVos[0];
                var orderDetailHtml = buildOrderDetailHtml(orderInfoVo, goodsInfo, orderNum);
                if (orderNum == 1) {
                    countdown(orderInfoVo.createTime, goodsInfo.goodsId, 0); // 付款倒计时
                } else if (orderNum == 2 || orderNum == 3) {
                    countdown(goodsInfo.expectDeliverTime, goodsInfo.goodsId, 1); // 发货倒计时
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
            "<h3>距离付款结束时间还有：" +
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
            "<h3>距离发货日期：" +
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
        var shipHtml = "";
        if (order.sellerReceiveStatus == 2) {
            shipHtml = "<div class=\" btn_order\">" +
                '<h3 onclick="ship(\'' + order.id + '\')">发货</h3>' +
                "</div>";
        }
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
            shipHtml +
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

function getPayDetail(orderId, orderNum, sellerReceiveStatus) {
    var getData = "?orderId=" + orderId + "&processType=" + 1;
    var ajaxObj = {
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                var payDetailInfo = data.data;
                payDetailHtml += buildPayDetailHtml(payDetailInfo, orderNum, sellerReceiveStatus);
                if (orderNum == 6) {
                    $("#payDetails").css('margin-bottom', '60');
                    getPayDetail2(orderId, sellerReceiveStatus);
                } else {
                    $("#payDetails").html(payDetailHtml);
                }
            } else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

function buildPayDetailHtml(payDetail, orderNum, sellerReceiveStatus) {
    var arrivalTime = "";
    var arrivalStatus = "<br><span style=\"color: #F76096;margin-right: -8px;\">(到账中)</span>";
    if ((orderNum == 3 && sellerReceiveStatus == 2) || orderNum == 4 || orderNum == 5 || orderNum == 6) {
        arrivalTime = "<h3>到账时间：" + (payDetail == null || payDetail == "" ? '--' : payDetail.updateTime) + "</h3>";
        arrivalStatus = "<br><span style=\"color: #F76096;margin-right: -8px;\">(已到账)</span>";
    }
    var _html = "<div class=\"details_part\">" +
        "<img src=\"/img/icon_order_details_3.png\" class=\"fl\" style=\"margin-top: 30px;\"/>" +
        "<div class=\"fl details_part_list\">" +
        "<h3>付款方式：" + (payDetail == null || payDetail == "" ? '--' : payDetail.paymentName) + "</h3>" +
        "<h3>付款时间：" + (payDetail == null || payDetail == "" ? '--' : payDetail.createTime) + "</h3>" +
        arrivalTime +
        "<h3>证联交易号：" + (payDetail == null || payDetail == "" ? '--' : payDetail.seqId) + "</h3>" +
        "</div>" +
        "<h1 class=\"fr details_part_money\" >￥<span style=\"color: #F76096;font-weight: bold;font-size: 18px;\">" + (payDetail == null || payDetail == "" ? '--' : payDetail.amount) + "</span>" +
        "</br><span style=\"color: #F76096;margin-right: 4px;\">定金</span>" +
        arrivalStatus +
        "</h1>" +
        "</div>";
    return _html;
}

function getPayDetail2(orderId, sellerReceiveStatus) {
    var getData = "?orderId=" + orderId + "&processType=" + 2;
    var ajaxObj = {
        type: "GET",
        url: SERVER_URL + "/accountRecord/getPayDetail" + getData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                var payDetailInfo = data.data;
                payDetailHtml += buildPayDetailHtml2(payDetailInfo, sellerReceiveStatus);
                $("#payDetails").html(payDetailHtml);
            } else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

function buildPayDetailHtml2(payDetail, sellerReceiveStatus) {
    var arrivalTime = "";
    var arrivalStatus = "<br><span style=\"color: #F76096;margin-right: -8px;\">(到账中)</span>";
    if (sellerReceiveStatus == 4) {
        arrivalTime = "<h3>到账时间：" + (payDetail == null || payDetail == "" ? '--' : payDetail.updateTime) + "</h3>";
        arrivalStatus = "<br><span style=\"color: #F76096;margin-right: -8px;\">(已到账)</span>";
    }
    var _html = "<div class=\"details_part\">" +
        "<div class=\"fl details_part_list\" style=\"margin-left: 90px;\">" +
        "<h3>付款方式：" + (payDetail == null || payDetail == "" ? '--' : payDetail.paymentName) + "</h3>" +
        "<h3>付款时间：" + (payDetail == null || payDetail == "" ? '--' : payDetail.createTime) + "</h3>" +
        arrivalTime +
        "<h3>证联交易号：" + (payDetail == null || payDetail == "" ? '--' : payDetail.seqId) + "</h3>" +
        "</div>" +
        "<h1 class=\"fr details_part_money\" >￥<span style=\"color: #F76096;font-weight: bold;font-size: 18px;\">" + (payDetail == null || payDetail == "" ? '--' : payDetail.amount) + "</span>" +
        "</br><span style=\"color: #F76096;margin-right: 4px;\">尾款</span>" +
        arrivalStatus +
        "</h1>" +
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

/**
 * 发货
 * @param id
 * @returns {boolean}
 */
function ship(id) {
    if (id == null || id == "") {
        layer.alert("发货失败");
        return false;
    }
    var ajaxObj = {
        url: SERVER_URL + "/orderRecord/batchDeliver?ids=" + id,
        success: function (data) {
            if (data != null && data.code == '1000') {
                layer.alert("已完成发货", function (index) {
                    window.location.href = "/web/seller/SellerCenterOrders.html?orderId=" + id + "&sellerReceiveStatus=" + 2 + "&orderStatus=" + 3;
                    layer.close(index);
                });
            } else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);

}

