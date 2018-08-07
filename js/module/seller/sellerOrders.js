var SellerOrder = {
    page: {
        pageSize: 1,
        pageNo: 1
    }
};

$(function () {
    SellerOrder.infoMenus();
    SellerOrder.findRecords();
});

SellerOrder.infoMenus = function () {

}

SellerOrder.findRecords = function () {
    var postData = "?userId=" + Dolaing.user.account + "&pageNo=" + SellerOrder.page.pageNo + "&pageSize=" + SellerOrder.page.pageSize;
    var ajaxObj = {
        url: SERVER_URL + "/orderRecord/queryRecordsByUser" + postData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var _html = "";
                    $(data.data.records).each(function (index, record) {
                        _html += SellerOrder.buildDataView(record);
                    });

                    $("#orderList").html(_html);
                    $("#pageView").html(Dolaing.page.view(data.data.current, data.data.pages, data.data.total));
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


SellerOrder.buildDataView = function (order) {
    var _html = '<li>' +
        '                <div class="orders_words">' +
        '                    <input type="checkbox" name=""  value="" />' +
        '                    <h5>订单号：' + order.orderSn + '&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：' + order.createTime + '&nbsp;&nbsp;</h5>' +
        '                </div>';
    var goods = null;
    for (var i = 0; i < order.orderGoodsVos.length; i++) {
        goods = order.orderGoodsVos[i];
        _html += '  <table border="0" cellspacing="0" cellpadding="0" class="grid_seller seller_list_content">' +
            '                    <tr>' +
            '                        <td>' +
            '                            <img src="/img/img_goods1.jpg"/>' +
            '                            <div class="fl">' +
            '                                <h3>' + goods.goodsName + '</h3>' +
            '                                <h4>土地编号：' + goods.landSn + '</h4>' +
            '                                <h4>认购土地面积：' + goods.buyLandArea + goods.landPartAreaUnitName + '</h4>' +
            '                            </div>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>买家：' + order.userId + '</h3>' +
            '                            <h3>农户：' + goods.farmerId + '</h3>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>' + order.orderStatusFullName + '</h3>' +
            '                            <h3 class="link">查看详情</h3>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>应得金额</h3>' +
            '                            <h2 class="money">￥' + order.sellerReceivableAmount + '</h2>' +
            '                            <h3>（定金比例' + goods.depositRatioLabel + '）</h3>' +
            '                            <h3>总额：' + goods.goodsAmount + '</h3>' +
            '                        </td>';
        if (order.orderStatusFullCode == "2") {
            _html += ' <td class="middle">' +
                ' <h3 class="link">发&nbsp;&nbsp;货</h3>' +
                '</td>';
        } else {
            _html += ' <td class="middle"></td>';
        }
        _html += '</tr>' +
            '                </table>' +
            '                <h5 class="deliver">预计发货时间：' + getDate(goods.expectDeliverTime)
            + '&nbsp;&nbsp;|&nbsp;&nbsp;预计出货：' + goods.expectPartOutputOrder + goods.expectPartOutputUnitName + '</h5>';
    }
    _html += '</li>';
    return _html;
}

/**
 * 分页请求
 * @param pageNo
 */
function page(pageNo) {
    SellerOrder.page.pageNo = pageNo;
    SellerOrder.findRecords();
}