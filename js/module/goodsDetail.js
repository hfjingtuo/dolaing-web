$(function () {
    var goodsId = $.query.get("id");
    var ajaxObj = {
        url: SERVER_URL + "/goods/detail?goodsId=" + goodsId,
        authorization: false,
        success: function (data) {
            console.log(data);
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var html = "";
                    var goodsMasterImg = null;
                    var mallGoods = data.data.mallGoods;
                    var mallShop = data.data.mallShop;
                    $("#goodsId").val(mallGoods.id);
                    var goodsMasterImgs = mallGoods.goodsMasterImgs.split(",");
                    for (var i = 0; i < goodsMasterImgs.length; i++) {
                        goodsMasterImg = goodsMasterImgs[i];
                        html += "<li><img src='" + IMAGE_URL + goodsMasterImg + "'/></li>";
                    }
                    $("#bigImg").html("<img src='" + IMAGE_URL + goodsMasterImgs[0] + "'/>");
                    $("#goodsMasterImg").html(html);

                    $("#goodsName").text(mallGoods.goodsName);
                    $("#goodsBrief").text(mallGoods.goodsBrief);

                    $("#plantingCycle").text("种植周期：" + mallGoods.plantingCycle + "天");
                    $("#catId").text("品类：" + data.data.catName);
                    $("#breeds").text("品种：" + mallGoods.breeds);
                    $("#brandName").text("品牌名称：" + mallShop.brandName);

                    $("#goodsDesc").text(mallGoods.goodsDesc);
                    $("#landSn").text("地块编号：" + mallGoods.landSn);
                    $("#landAddress").text("所在地：" + mallGoods.landAddress);
                    $("#landPartArea").text("每单位土地面积：" + mallGoods.landPartArea + ("2" == mallGoods.landPartAreaUnit ? "亩" : "公顷"));
                    $("#expectPartOutput").text("预计单位产量：" + mallGoods.expectPartOutput + ("1" == mallGoods.expectPartOutputUnit ? "kg" : "t"));

                    $("#goodsNumber").text("件 [ 库存：" + mallGoods.goodsNumber + "件 ]");
                    $("#inventory").val(mallGoods.goodsNumber);

                    $("#isFreeShipping").text("1" == mallGoods.isFreeShipping ? "包邮" : "自费");

                    $("#deposit").text("定金：￥" + mallGoods.shopPrice * mallGoods.depositRatio + "元");//定金=单价*定金比例
                    var endSubscribeDays = checkTime(parseInt((new Date(mallGoods.endSubscribeTime) - new Date) / 1000 / 60 / 60 / 24, 10));//认购结束剩余的天数
                    var deliveryDays = parseInt(endSubscribeDays) + parseInt(mallGoods.plantingCycle);//预计发货时间=认购结束时间+生长周期
                    $("#deliveryDays").text("生产完成后" + deliveryDays + "天内发货");
                    $("#endSubscribeTime").text("预计最晚：" + getDate(mallGoods.endSubscribeTime));
                    $("#area").text("所在地区：" + (1 == mallGoods.province ? "贵州省" : "贵州省") + (1 == mallGoods.city ? "清镇市" : "清镇市"));

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

function subscription() {
    var user = $.cookie('user');
    var type = JSON.parse(user).type;
    console.log("type=" + type);
    if ("1" == type) {
        var goodsId = $("#goodsId").val();
        var goodsNum = $("#goodsNum").val();
        window.location.href = "/web/pay/payConfirm.html?goodsId=" + goodsId + "&goodsNum=" + goodsNum;
    }else {
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