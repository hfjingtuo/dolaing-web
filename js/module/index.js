//预加载方法
$(function () {
    getIndex();
    initTopData();
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
    }else {
        isFreeShipping = "自费";
    }
    var html =
        "<li title='" + goods.goodsName + "'>" +
        "<a href='/goodsDetails.html?id=" + goods.id +"'>"+
        "<img src=\"" + goods.goodsMasterImgs.split(",")[0] + "\" class=\"home_list_goods\"/>" +
        "<h3>" + goods.goodsName + "</h3>" +
        "<h4>" + goods.goodsBrief + "</h4>" +
        "<div class=\"home_list_price\">" +
        "<h5 class=\"fl\"><span style=\"font-size: 16px;\">￥</span>&nbsp;" + goods.shopPrice + "&nbsp;" +
        "<span style=\"font-size: 14px;color: #E85526;\">元</span></h5>" +
        "<img src=\"img/sign_free.png\" class=\"fr\"/>" +
        "<h6>" + isFreeShipping
        + "</h6></div>" +
        "<h6 class=\"home_list_time\">剩余：<span id='timer" + goods.id + "'></span></h6>" +
        "</a></li>"
    return html;
}

function getIndexMore() {
    indexData.pageNo += 1;
    getIndex();
}

function countdown(endSubscribeTime, goodsId) {
    setInterval(function () {
        let nowTime = new Date(endSubscribeTime) - new Date;
        let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        let days = parseInt(nowTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(nowTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        days = checkTime(days);
        hours = checkTime(hours);
        $("#timer" + goodsId).text(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}