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
        data: "pageNo=" + indexData.pageNo + "&pageSize=" + indexData.pageSize + "&goodsId=",
        url: SERVER_URL + "/getAllGoods",
        success: function (data) {
            if (data.data != null) {
                var goodsList = data.data.records;
                console.log(goodsList);
                $(goodsList).each(function (index, goods) {
                    indexData.html += goodsHtml(goods);
                    countdown(goods.endSubscribeTime, goods.id);//认购倒计时
                });
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
        "<h5 class=\"fl\">" + goods.shopPrice + "&nbsp;" +
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

/**
 * 计算剩余时间（计时每秒）
 * @param time
 * @param id
 */
function countdown(time, id) {
    setInterval(function () {
        let nowTime = new Date(time) - new Date;
        if (nowTime < 1000){
            clearInterval();
            window.location.reload();
        }
        console.log(nowTime);
        let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        let days = parseInt(nowTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(nowTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        days = checkTime(days);
        hours = checkTime(hours);

        $("#timer" + id).text(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}