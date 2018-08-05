$(function () {
    initGoodsData();
    selectArea("45");
});

function selectArea(parentId) {
    $.ajax({
        url: SERVER_URL + "/changeArea/" + parentId,
        method: "GET",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (i, val) {
                if (parentId == "45") {
                    $("#province").append('<option value=' + val.id + '>' + val.chName + '</option>');
                } else {
                    $("#city").append('<option value=' + val.id + '>' + val.chName + '</option>');
                }
            });
        }
    });
}

/**
 * 初始化商品相关数据
 */
function initGoodsData() {
    var goodsId = $.query.get("goodsId");
    var goodsNum = $.query.get("goodsNum");
    $.ajax({
        type: "GET",
        url: SERVER_URL + "/goods/detail/" + goodsId,
        success: function (data) {
            console.log(data);
            if (500 == data.code) {
                layer.alert(data.message, function (index) {
                    location.href = "/index.html";
                    layer.close(index);
                });
            } else {
                var mallGoods = data.mallGoods;
                var mallShop = data.mallShop;
                var depositRatio = mallGoods.depositRatio;//定金比例
                $("#goodsId").val(mallGoods.id);
                $("#depositRatioVal").val(depositRatio);
                $("#shopName").text("店铺：" + mallShop.shopName);
                $("#inventory").val(mallGoods.goodsNumber);//库存
                $("#goodsNum").val(goodsNum);//购物车
                $("#goodsName").text(mallGoods.goodsName);
                //$("#deliveryTime").text("预计发货时间：" + getDateByAdd(mallGoods.endSubscribeTime, parseInt(mallGoods.plantingCycle)));
                $("#deliveryTime").text("预计发货时间：" + getDate(mallGoods.endSubscribeTime));
                $("#goodsMasterImg").attr('src', "/" + mallGoods.goodsMasterImgs.split(",")[0]);
                $("#landTotalArea").text(mallGoods.landTotalArea + "亩");
                $("#expectTotalOutputUnit").text(mallGoods.expectTotalOutputUnit + "kg");
                $("#breeds").text("品种：" + mallGoods.breeds);
                $("#shopPrice").text(mallGoods.shopPrice);
                $("#price").val(mallGoods.shopPrice);
                $(".totalPrice").text(parseInt(mallGoods.shopPrice) * parseInt(goodsNum));//商品总价
                $("#isFreeShipping").text("邮资：" + ("1" == mallGoods.isFreeShipping ? "包邮" : "自费"));
                $("#deposit").text(parseInt(mallGoods.shopPrice) * goodsNum * depositRatio);//定金
                $("#retainage").text(parseInt(mallGoods.shopPrice) * goodsNum * (1 - depositRatio));//尾款
                $("#depositRatio").text("下单支付认购全款，其中的 " + depositRatio * 100 + "% 作为定金发放给卖家。");
                $("#expectDeliverTime").text("(在" + getDate(mallGoods.expectDeliverTime) + "前卖家发货，买家确认收货后，平台向卖家支付尾款)");
            }
        }
    });
}

//加的效果
function add() {
    var n = $("#goodsNum").val();//购物车
    var inventory = $("#inventory").val();//库存
    var price = $("#price").val();//单价
    var depositRatioVal = $("#depositRatioVal").val();//单价
    var num = parseInt(n) + 1;
    if (num > parseInt(inventory)) {
        return;
    }
    $("#goodsNum").val(num);
    $(".totalPrice").text(parseInt(price) * parseInt(num));//商品总价
    $("#deposit").text(parseInt(price) * num * depositRatioVal);//定金
    $("#retainage").text(parseInt(price) * num * (1 - depositRatioVal));//尾款
}

//减的效果
function minus() {
    var price = $("#price").val();//单价
    var depositRatioVal = $("#depositRatioVal").val();//单价
    var n = $("#goodsNum").val();//购物车
    if (n <= 1) {
        return
    }
    var num = parseInt(n) - 1;
    $("#goodsNum").val(num);
    $(".totalPrice").text(parseInt(price) * parseInt(num));//商品总价
    $("#deposit").text(parseInt(price) * num * depositRatioVal);//定金
    $("#retainage").text(parseInt(price) * num * (1 - depositRatioVal));//尾款
}

function payConfirm() {
    var goodsId = parseInt($("#goodsId").val());
    var consignee = $("#consignee").val();
    var phone = $("#phone").val();
    var province = parseInt($("#province").val());
    var city = parseInt($("#city").val());
    var address = $("#address").val();
    var goodsNum = parseInt($("#goodsNum").val());
    var remarks = $("#remarks").val();
    var totalPrice = $("#shopPrice").text() * parseInt(goodsNum);
    if (!isEmpty(consignee)) {
        layer.tips("请输入收货联系人", '#consignee', {
            tips: [2, '#f76592']
        });
        $("#consignee").focus();
        return false;
    }
    if (!isEmpty(phone)) {
        layer.tips("请输入联系人电话", '#phone', {
            tips: [2, '#f76592']
        });
        $("#phone").focus();
        return false;
    }
    if (!isEmpty(province)) {
        layer.tips("请选择省份", '#province', {
            tips: [2, '#f76592']
        });
        $("#province").focus();
        return false;
    }
    if (!isEmpty(city)) {
        layer.tips("请选择城市", '#city', {
            tips: [2, '#f76592']
        });
        $("#city").focus();
        return false;
    }
    if (!isEmpty(address)) {
        layer.tips("请输入收货具体地址", '#address', {
            tips: [2, '#f76592']
        });
        $("#address").focus();
        return false;
    }
    var goods = {};
    goods.goodsId = goodsId;
    goods.consignee = consignee;
    goods.mobile = phone;
    goods.province = province;
    goods.city = city;
    goods.address = address;
    goods.goodsNum = goodsNum;
    goods.remarks = remarks;
    goods.buyerOrderAmount = totalPrice;

    console.log(JSON.stringify(goods));
    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/order/generateOrder";
    ajaxObj.data = JSON.stringify(goods);
    ajaxObj.success = function (data) {
        var code = data.code;
        var message = data.message;
        console.log(data);
        if (200 == code) {
            location.href = "/web/pay/payComplete.html?orderId=" + message;
        } else if (500 == code) {
            layer.alert(message);
            return;
        }
    }
    ajaxData(ajaxObj);
}