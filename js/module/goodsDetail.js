$(document).ready(function () {
    /*var token = $.cookie('token');
    if (token == null) {
        window.location.href = "login.html";
    }*/
    var goodsId;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    goodsId = str.split("=")[1];
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/goods/detail/" + goodsId,
        success: function (data) {
            console.log(data);
            var html = "";
            var goodsMasterImg = null;
            var mallGoods = data.mallGoods;
            var mallShop = data.mallShop;
            var goodsMasterImgs = mallGoods.goodsMasterImgs.split(",");
            for (var i = 0; i < goodsMasterImgs.length; i++) {
                goodsMasterImg = goodsMasterImgs[i];
                html += "<li><img src='" + goodsMasterImg + "'/></li>";
            }
            console.log(html);
            $("#goodsMasterImg").html(html);

            $("#goodsName").text(mallGoods.goodsName);
            $("#goodsNumber").text("件 [ 库存：" + mallGoods.goodsNumber + "件 ]");
            $("#deposit").text("定金：￥" + mallGoods.shopPrice * mallGoods.depositRatio + "元");//定金=单价*定金比例
            $("#goodsDesc").text(mallGoods.goodsDesc);
            $("#landSn").text("地块编号：" + mallGoods.landSn);
            $(".landAddress").text("所在地：" + mallGoods.landAddress);
            $("#landPartArea").text("每单位土地面积：" + mallGoods.landPartArea + mallGoods.landPartAreaUnit);
            $("#expectPartOutput").text("预计单位产量：" + mallGoods.expectPartOutput + mallGoods.expectPartOutputUnit);
            $("#plantingCycleUnit").text("种植周期：" + mallGoods.plantingCycleUnit + "天");
            $(".brandName").text("品牌名：" + mallGoods.brandName);
            $("#isFreeShipping").text("1" == mallGoods.isFreeShipping ? "包邮" : "不包邮");
            $("#endSubscribeTime").text(mallGoods.endSubscribeTime);

            $("#businessScope").text("经营范围：" + mallShop.businessScope);

            timer(mallGoods.endSubscribeTime);//认购倒计时
        }
    });
});

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
    var n = $("#num").val();
    var num = parseInt(n) + 1;
    $("#num").val(num);
}

//减的效果
function minus() {
    var n = $("#num").val();
    if (n <= 1) {
        return
    }
    var num = parseInt(n) - 1;
    $("#num").val(num);
}