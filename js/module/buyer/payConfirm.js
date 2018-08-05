$(function () {
    initGoodsData();
});

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

                $("#goodsId").val(mallGoods.id);
                $("#shopName").text("店铺：" + mallShop.shopName);
                $("#goodsName").text(mallGoods.goodsName);
                //$("#deliveryTime").text("预计发货时间：" + getDateByAdd(mallGoods.endSubscribeTime, parseInt(mallGoods.plantingCycle)));
                $("#deliveryTime").text("预计发货时间：" + getDate(mallGoods.endSubscribeTime));
                $("#goodsMasterImg").attr('src', "/" + mallGoods.goodsMasterImgs.split(",")[0]);
                $("#landTotalArea").text(mallGoods.landTotalArea + "亩");
                $("#expectTotalOutputUnit").text(mallGoods.expectTotalOutputUnit + "kg");
                $("#breeds").text("品种：" + mallGoods.breeds);
                $("#shopPrice").text(mallGoods.shopPrice);
                $(".totalPrice").text(parseInt(mallGoods.shopPrice) * parseInt(goodsNum));//商品总价
                $("#isFreeShipping").text("邮资：" + ("1" == mallGoods.isFreeShipping ? "包邮" : "自费"));
                $("#deposit").text(mallGoods.shopPrice / 2);//定金
            }
        }
    });
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