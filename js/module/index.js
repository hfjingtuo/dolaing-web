//预加载方法
$(function () {
    getIndex();

});

//执行方法
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
                }
            }
            $("#root").html(indexData.html);
            if (goodsList.length < indexData.pageSize) {
                $("#OK").hide();
            } else {
                $("#OK").show();
            }
            return true;
        }
    });

}

function goodsHtml(goods) {

    var date1 = new Date();  //开始时间
    var date2 = new Date(goods.endSubscribeTime.replace(/-/, "/"))    //结束时间
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    //认购结束时间
    var timeStampDiff = days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒";
    var isFreeShipping = goods.isFreeShipping;
    if ("1" == isFreeShipping) {
        isFreeShipping = "包邮";
    }
    var html =
        "<li title='" + goods.goodsName + "'>" +
        "<a href=" + goods.id + "\"/goods_details.html?id=\">" +
        "<img src=\"" + goods.goodsMasterImgs + "\" class=\"home_list_goods\"/>" +
        "<h3>" + goods.goodsName + "</h3>" +
        "<h4>" + goods.goodsBrief + "</h4>" +
        "<div class=\"home_list_price\">" +
        "<h5 class=\"fl\"><span style=\"font-size: 16px;\">￥</span>&nbsp;" + goods.shopPrice + "&nbsp;" +
        "<span style=\"font-size: 14px;color: #E85526;\">元</span></h5>" +
        "<img src=\"img/sign_free.png\" class=\"fr\"/>" +
        "<h6>" + isFreeShipping
        + "</h6></div>" +
        "<h6 class=\"home_list_time\">剩余：<span>" + timeStampDiff + "</span></h6>" +
        "</a></li>"
    return html;
}


function getIndexMore() {
    indexData.pageNo += 1;
    getIndex();
}
