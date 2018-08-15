$(function () {
    initGoodsData();
    selectArea("45", "country");
});

function selectArea(parentId, type) {
    if ("province" == type) {
        $("#city").html("").append('<option value="">请选择市</option>');
        $("#district").html("").append('<option value="">请选择区</option>');
    } else if ("city" == type) {
        $("#district").html("").append('<option value="">请选择区</option>');
    }
    $.ajax({
        url: SERVER_URL + "/changeArea/" + parentId,
        method: "GET",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log("type=" + type);
            console.log(data);
            $.each(data, function (i, val) {
                if (parentId == "45") {
                    $("#province").append('<option value=' + val.id + '>' + val.chName + '</option>');
                } else {
                    if ("province" == type) {
                        $("#city").append('<option value=' + val.id + '>' + val.chName + '</option>');
                    } else if ("city" == type) {
                        $("#district").append('<option value=' + val.id + '>' + val.chName + '</option>');
                    }
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
    var ajaxObj = {
        url: SERVER_URL + "/goods/detail?goodsId=" + goodsId,
        success: function (data) {
            console.log(data);
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var mallGoods = data.data.mallGoods;
                    var mallShop = data.data.mallShop;

                    goodsNum = new BigDecimal(goodsNum + "");
                    var depositRatio = new BigDecimal(mallGoods.depositRatio + "");//定金比例
                    var shopPrice = new BigDecimal(mallGoods.shopPrice + "");//商品价格
                    var deposit = depositRatio.multiply(shopPrice).multiply(goodsNum).setScale(2);//定金
                    var totalPrice = shopPrice.multiply(goodsNum).setScale(2);//商品总价
                    var retainage = totalPrice - deposit;//尾款

                    $("#goodsId").val(mallGoods.id);
                    $("#depositRatioVal").val(depositRatio);
                    $("#shopId").val(mallShop.id);
                    $("#shopName").text("店铺：" + mallShop.shopName);
                    $("#inventory").val(mallGoods.goodsNumber);//库存
                    $("#goodsNum").val(goodsNum);//购物车
                    $("#goodsName").text(mallGoods.goodsName);
                    $("#deliveryTime").text("预计发货时间：" + getDate(mallGoods.endSubscribeTime));
                    $("#goodsMasterImg").attr('src', IMAGE_URL + mallGoods.goodsMasterImgs.split(",")[0]);
                    $("#landTotalArea").text(mallGoods.landTotalArea + "亩");
                    $("#expectTotalOutputUnit").text(mallGoods.expectTotalOutputUnit + "kg");
                    $("#catName").text(data.data.catName);
                    $("#breeds").text(mallGoods.breeds);
                    $("#shopPrice").text(shopPrice);
                    $("#price").val(shopPrice);
                    $(".totalPrice").text(totalPrice);//商品总价
                    $("#isFreeShipping").text("邮资：包邮");
                    $("#deposit").text(deposit);//定金
                    $("#retainage").text(retainage.toFixed(2));//尾款
                    $("#depositRatio").text("下单支付认购全款，其中的 " + depositRatio * 100 + "% 作为定金发放给卖家。");
                    $("#expectDeliverTime").text("(在" + getDate(mallGoods.expectDeliverTime) + "前卖家发货，买家确认收货后，平台向卖家支付尾款)");
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
}

//加的效果
function add() {
    var n = $("#goodsNum").val();//购物车
    var inventory = $("#inventory").val();//库存
    var price = $("#price").val();//单价
    var depositRatioVal = $("#depositRatioVal").val();//定金比例
    var num = parseInt(n) + 1;
    if (num > parseInt(inventory)) {
        return;
    }
    $("#goodsNum").val(num);

    num = new BigDecimal(num + "");
    depositRatioVal = new BigDecimal(depositRatioVal + "");
    price = new BigDecimal(price + "");//商品价格

    var totalPrice = price.multiply(num).setScale(2);//商品总价
    var deposit = price.multiply(num).multiply(depositRatioVal).setScale(2);//定金
    var retainage = totalPrice - deposit;//尾款

    $(".totalPrice").text(totalPrice);//商品总价
    $("#deposit").text(deposit);//定金
    $("#retainage").text(retainage.toFixed(2));//尾款
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

    num = new BigDecimal(num + "");
    depositRatioVal = new BigDecimal(depositRatioVal + "");
    price = new BigDecimal(price + "");//商品价格

    var totalPrice = price.multiply(num).setScale(2);//商品总价
    var deposit = price.multiply(num).multiply(depositRatioVal).setScale(2);//定金
    var retainage = totalPrice - deposit;//尾款

    $(".totalPrice").text(totalPrice);//商品总价
    $("#deposit").text(deposit);//定金
    $("#retainage").text(retainage.toFixed(2));//尾款
}

function payConfirm() {
    var shopId = $("#shopId").val();
    var goodsId = $("#goodsId").val();
    var consignee = $("#consignee").val();
    var phone = $("#phone").val();
    var province = $("#province").val();
    var city = $("#city").val();
    var district = $("#district").val();
    var address = $("#address").val();
    var goodsNum = $("#goodsNum").val();
    var remarks = $("#remarks").val();
    if (isEmpty(consignee)) {
        layer.tips("请输入收货联系人", '#consignee', {
            tips: [2, '#f76592']
        });
        $("#consignee").focus();
        return false;
    }
    if (isEmpty(phone)) {
        layer.tips("请输入联系人电话", '#phone', {
            tips: [2, '#f76592']
        });
        $("#phone").focus();
        return false;
    }
    if (isEmpty(province)) {
        layer.tips("请选择省", '#province', {
            tips: [2, '#f76592']
        });
        $("#province").focus();
        return false;
    }
    if (isEmpty(city)) {
        layer.tips("请选择市", '#city', {
            tips: [2, '#f76592']
        });
        $("#city").focus();
        return false;
    }
    if (isEmpty(district)) {
        layer.tips("请选择区", '#district', {
            tips: [2, '#f76592']
        });
        $("#district").focus();
        return false;
    }
    if (isEmpty(address)) {
        layer.tips("请输入收货具体地址", '#address', {
            tips: [2, '#f76592']
        });
        $("#address").focus();
        return false;
    }
    var totalPrice = parseFloat($("#shopPrice").text() * (goodsNum));
    var goods = {};
    goods.shopId = parseInt(shopId);
    goods.goodsId = parseInt(goodsId);
    goods.consignee = consignee;
    goods.mobile = phone;
    goods.province = parseInt(province);
    goods.city = parseInt(city);
    goods.district = parseInt(district);
    goods.address = address;
    goods.goodsNum = parseInt(goodsNum);
    goods.remarks = remarks;
    goods.buyerOrderAmount = totalPrice;

    console.log(JSON.stringify(goods));
    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/order/generateOrder";
    ajaxObj.data = JSON.stringify(goods);
    ajaxObj.success = function (data) {
        console.log(data);
        var code = data.code;
        var message = data.data;
        console.log(data);
        if ('1000' == code) {
            location.href = "/web/pay/payComplete.html?orderId=" + message;
        } else if (500 == code) {
            layer.alert(message);
            return;
        }
    }
    ajaxData(ajaxObj);
}