//设置全局变量
var indexData = {
    pageSize: 12,
    pageNo: 1,
    html: ""
};
//预加载方法
$(function () {
    getIndex();
});

function getIndex() {
    $.ajax({
        type: "post",
        data: "pageNo=" + indexData.pageNo + "&pageSize=" + indexData.pageSize,
        url: SERVER_URL + "/index",
        success: function (data) {
            var goodsList = data.list;
            console.log(goodsList);
            if (goodsList == null || goodsList.length == 0) {
                indexData.html += '暂无找到相关商品';
            } else {
                var goods = null;
                for (var i = 0; i < goodsList.length; i++) {
                    goods = goodsList[i];
                    indexData.html += goodsHtml(goods);
                    countdown(goods.endSubscribeTime, goods.id);//认购倒计时
                }
                $("#root").html(indexData.html);
                if (goodsList.length < indexData.pageSize) {
                    $("#OK").hide();
                } else {
                    $("#OK").show();
                }
            }
        }
    });
}

function goodsHtml(goods) {
    var isFreeShipping = goods.isFreeShipping;
    if ("1" == isFreeShipping) {
        isFreeShipping = "包邮";
    } else {
        isFreeShipping = "自费";
    }
    var html =
        "<li title='" + goods.goodsName + "'>" +
        "<a target=\"_blank\" href='/goodsDetails.html?id=" + goods.id + "'>" +
        "<div class='home_list_goods'>" +
        "<img src='" + IMAGE_URL + goods.goodsMasterImgs.split(',')[0] + "'/></div>" +
        "<h3>" + goods.goodsName + "</h3>" +
        "<h4>" + goods.goodsDesc + "</h4>" +
        "<div class=\"home_list_price\">" +
        "<h5 class=\"fl\"><span style=\"font-size: 16px;\">￥</span>&nbsp;" + goods.shopPrice + "&nbsp;" +
        "<span style=\"font-size: 14px;color: #E85526;\">元</span></h5>" +
        "<img src=\"img/sign_free.png\" class=\"fr\"/>" +
        "<h6>" + isFreeShipping +
        "</h6></div>" +
        "<h6 class=\"home_list_time\">剩余：<span id='timer" + goods.id + "'></span></h6>" +
        "</a></li>";
    return html;
}

function getIndexMore() {
    indexData.pageNo += 1;
    getIndex();
}