//设置全局变量
var leftData = {
    pageSize: 2,
    pageNo: 1,
    html: ""
};

$(function () {
    /*****加载左侧商品列表*********/
    getLeftGoods();
    /*****加载商品详情页*********/
    var goodsId = $.query.get("id");
    var ajaxObj = {
        url: SERVER_URL + "/goods/detail?goodsId=" + goodsId,
        authorization: false,
        success: function (data) {
            console.log(data);
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var bigImgHtml = "";
                    var goodsMasterImgHtml = "";
                    var goodsMasterImg = null;
                    var mallGoods = data.data.mallGoods;
                    var mallShop = data.data.mallShop;
                    $("#goodsId").val(mallGoods.id);
                    var goodsMasterImgs = mallGoods.goodsMasterImgs.split(",");
                    for (var i = 0; i < goodsMasterImgs.length; i++) {
                        goodsMasterImg = goodsMasterImgs[i];
                        if (i == 0) {
                            bigImgHtml += "<li style='display: block;'><img src='" + IMAGE_URL + goodsMasterImg + "'/></li>";
                            goodsMasterImgHtml += "<li><img class='img_small_cur' src='" + IMAGE_URL + goodsMasterImg + "'/></li>";
                        } else {
                            bigImgHtml += "<li><img src='" + IMAGE_URL + goodsMasterImg + "'/></li>";
                            goodsMasterImgHtml += "<li><img src='" + IMAGE_URL + goodsMasterImg + "'/></li>";
                        }
                    }
                    $("#bigImg").html(bigImgHtml);
                    $("#goodsMasterImg").html(goodsMasterImgHtml);
                    //$("ul").removeAttr("id");

                    $("#goodsName").text(mallGoods.goodsName);
                    $("#goodsBrief").text(mallGoods.goodsBrief);

                    $("#plantingCycle").text("种植周期：" + mallGoods.plantingCycle + "天");
                    $("#catId").text("品类：" + data.data.catName);
                    $("#breeds").text("品种：" + mallGoods.breeds);
                    $("#brandName").text("品牌名称：" + mallShop.brandName);

                    $("#landSn").text("地块编号：" + mallGoods.landSn);
                    $("#landAddress").text("所在地：" + mallGoods.landAddress);
                    $("#landPartArea").text("每单位土地面积：" + mallGoods.landPartArea + ("2" == mallGoods.landPartAreaUnit ? "亩" : "公顷"));
                    $("#expectPartOutput").text("预计单位产量：" + mallGoods.expectPartOutput + ("1" == mallGoods.expectPartOutputUnit ? "kg" : "t"));

                    $("#goodsNumber").text("件 [ 库存：" + mallGoods.goodsNumber + "件 ]");
                    $("#inventory").val(mallGoods.goodsNumber);

                    $("#isFreeShipping").text("1" == mallGoods.isFreeShipping ? "包邮" : "自费");

                    $("#deposit").text("定金：￥" + new BigDecimal(mallGoods.shopPrice + "").multiply(new BigDecimal(mallGoods.depositRatio + "")).setScale(2) + "元");//定金=单价*定金比例
                    var endSubscribeDays = checkTime(parseInt((new Date(mallGoods.endSubscribeTime) - new Date) / 1000 / 60 / 60 / 24, 10));//认购结束剩余的天数
                    var deliveryDays = parseInt(endSubscribeDays) + parseInt(mallGoods.plantingCycle);//预计发货时间=认购结束时间+生长周期
                    $("#deliveryDays").text("生产完成后" + deliveryDays + "天内发货");
                    $("#endSubscribeTime").text("预计最晚：" + getDate(mallGoods.endSubscribeTime));
                    $("#area").text("所在地区：" + data.data.address);

                    /***********土地现状*****/
                    $("#landImg").html("<img src='" + IMAGE_URL + mallGoods.landImgs.split(',')[0] + "'/>");
                    /************产品介绍***/
                    var landImgsHtml = "";
                    var landImg = "";
                    var landImgs = mallGoods.landImgs.split(",");
                    for (var i = 0; i < landImgs.length; i++) {
                        landImg = landImgs[i];
                        landImgsHtml += "<img src='" + IMAGE_URL + landImg + "'/>";
                    }
                    var goodsDescImgHtml = "";
                    var goodsDescImg;
                    var goodsDescImgs = mallGoods.goodsDescImgs.split(",");
                    for (var i = 0; i < goodsDescImgs.length; i++) {
                        goodsDescImg = goodsDescImgs[i];
                        goodsDescImgHtml += "<img src='" + IMAGE_URL + goodsDescImg + "'/>";
                    }

                    var goodsHtml = "<h2>土地现状</h2>" + landImgsHtml + "<div class='goods_main_right_content_line'></div>" +
                        "<h2>产品介绍</h2><p>" + mallGoods.goodsDesc + "</p>" + goodsDescImgHtml;
                    $("#goodsDesc").html(goodsHtml);

                    $("#userId").text("店主：" + mallShop.userId);
                    $(".shopName").text(mallShop.shopName);
                    $("#businessScope").text("经营范围：" + mallShop.businessScope);

                    timer(mallGoods.endSubscribeTime);//认购倒计时
                }
            } else {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            }
        }
    }
    ajaxData(ajaxObj);
});

/**
 * 加载左侧商品列表
 */
function getLeftGoods() {
    $.ajax({
        type: "post",
        data: "pageNo=" + leftData.pageNo + "&pageSize=" + leftData.pageSize,
        url: SERVER_URL + "/index",
        success: function (data) {
            var goodsList = data.list;
            console.log(goodsList);
            if (goodsList != null && goodsList.length != 0) {
                var goods = null;
                for (var i = 0; i < goodsList.length; i++) {
                    goods = goodsList[i];
                    leftData.html += goodsHtml(goods);
                    countdown(goods.endSubscribeTime, goods.id);//认购倒计时
                }
                $("#leftGoods").html(leftData.html);
            }
        }
    });
}

function goodsHtml(goods) {
    var isFreeShipping = goods.isFreeShipping;
    if (1 == isFreeShipping) {
        isFreeShipping = "包邮";
    } else {
        isFreeShipping = "自费";
    }
    var html =
        "<li title='" + goods.goodsName + "'>" +
        "<a href='/goodsDetails.html?id=" + goods.id + "'>" +
        "<img src='" + IMAGE_URL + goods.goodsMasterImgs.split(',')[0] + "' class='home_list_goods'/>" +
        "<h3>" + goods.goodsName + "</h3>" +
        "<h4>" + goods.goodsDesc + "</h4>" +
        "<div class=\"home_list_price\">" +
        "<h5 class=\"fl\"><span style=\"font-size: 16px;\">￥</span>&nbsp;" + goods.shopPrice + "&nbsp;" +
        "<span style=\"font-size: 14px;color: #E85526;\">元</span>\n" +
        " </h5>" +
        " <img src=\"/img/sign_free.png\" class=\"fr\"/>" +
        "<h6>" + isFreeShipping + "</h6>" +
        " </div>" +
        " <h6 class=\"home_list_time\">剩余：<span id='timer" + goods.id + "'></span></h6>" +
        "</a></li>"
    return html;
}

function subscription() {
    var user = Dolaing.user;
    var type = user.type;
    console.log("type=" + type);
    if (user == null || type == null) {
        window.location.href = "/login.html";
    } else if (type != null && "1" == type) {
        var goodsId = $("#goodsId").val();
        var goodsNum = $("#goodsNum").val();
        window.location.href = "/web/pay/payConfirm.html?goodsId=" + goodsId + "&goodsNum=" + goodsNum;
    } else {
        layer.alert("您是卖家用户,不允许购买此商品")
    }
}

function timer(timeStr) {
    setInterval(function () {
        let nowTime = new Date(timeStr) - new Date;
        let minutes = parseInt(nowTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(nowTime / 1000 % 60, 10);//计算剩余的秒数

        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        let days = parseInt(nowTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        let hours = parseInt(nowTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        days = checkTime(days);
        hours = checkTime(hours);
        document.getElementById('timer').innerHTML = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
    }, 1000);
}

function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//加的效果
function add() {
    var n = $("#goodsNum").val();//购物车
    var inventory = $("#inventory").val();//库存
    var num = parseInt(n) + 1;
    if (num > parseInt(inventory)) {
        return;
    }
    $("#goodsNum").val(num);
}

//减的效果
function minus() {
    var n = $("#goodsNum").val();
    if (n <= 1) {
        return
    }
    var num = parseInt(n) - 1;
    $("#goodsNum").val(num);
}