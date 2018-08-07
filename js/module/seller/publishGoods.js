function publishGoods() {
    var goodsName = $("#goodsName").val();
    var shopPrice = $("#shopPrice").val();
    var depositRatio = $("#depositRatio").val();
    var isFreeShipping = $("#isFreeShipping").val();
    var catId = $("#catId").val();
    var breeds = $("#breeds").val();
    //var brandId = $("#brandId").val();
    //var brandName = $("#brandName").val();
    var plantingCycle = $("#plantingCycle").val();//生长周期
    var startPlantime = $("#startPlantime").val();
    var endPlantime = $("#endPlantime").val();
    var expectPartOutput = $("#expectPartOutput").val();
    var landSn = $("#landSn").val();
    var landAddress = $("#landAddress").val();
    var landPartArea = $("#landPartArea").val();
    var goodsNumber = $("#goodsNumber").val();

    //var goodsBrief = $("#goodsBrief").val();
    var goodsDesc = $("#goodsDesc").val();
    var goodsMasterImgs = $("#goodsMasterImgs").val();
    var goodsDescImgs = $("#goodsDescImgs").val();
    var landImgs = $("#landImgs").val();
    var farmerId = $("#farmerId").val();

    var startSubscribeTime = $("#startSubscribeTime").val();
    var endSubscribeTime = $("#endSubscribeTime").val();

    //var termsOfService = $("#endSubscribeTime");//同意协议

    if (!isEmpty(goodsName)) {
        layer.tips("请输入商品标题", '#goodsName', {
            tips: [2, '#f76592']
        });
        $("#goodsName").focus();
        return false;
    }
    if (!isEmpty(shopPrice)) {
        layer.tips("请输入商品单价", '#shopPrice', {
            tips: [2, '#f76592']
        });
        $("#shopPrice").focus();
        return false;
    }
    if (!isEmpty(depositRatio)) {
        layer.tips("请输入定金比例", '#depositRatio', {
            tips: [2, '#f76592']
        });
        $("#depositRatio").focus();
        return false;
    }
    if (!isEmpty(isFreeShipping)) {
        layer.tips("请选择是否包邮", '#isFreeShipping', {
            tips: [2, '#f76592']
        });
        $("#isFreeShipping").focus();
        return false;
    }
    if (!isEmpty(catId)) {
        layer.tips("请选择商品品类", '#catId', {
            tips: [2, '#f76592']
        });
        $("#catId").focus();
        return false;
    }
    if (!isEmpty(breeds)) {
        layer.tips("请输入商品品种", '#breeds', {
            tips: [2, '#f76592']
        });
        $("#breeds").focus();
        return false;
    }
    /*if (!isEmpty(brandName)) {
        layer.tips("请输入商品品牌", '#brandName', {
            tips: [2, '#f76592']
        });
        $("#brandId").focus();
        return false;
    }*/
    if (!isEmpty(plantingCycle)) {
        layer.tips("请输入生长周期", '#plantingCycle', {
            tips: [2, '#f76592']
        });
        $("#plantingCycle").focus();
        return false;
    }
    if (!isEmpty(plantingCycle)) {
        layer.tips("请选择种植开始时间", '#startPlantime', {
            tips: [2, '#f76592']
        });
        $("#startPlantime").focus();
        return false;
    }
    if (!isEmpty(plantingCycle)) {
        layer.tips("请选择种植结束时间", '#endPlantime', {
            tips: [2, '#f76592']
        });
        $("#endPlantime").focus();
        return false;
    }
    var expectPartOutputMatch = /^(?!0+(?:\.0+)?$)\d+(?:\.\d{1,2})?$/;
    if (!isEmpty(expectPartOutput)) {
        layer.tips("请输入预计单位产量", '#expectPartOutput', {
            tips: [2, '#f76592']
        });
        $("#expectPartOutput").focus();
        return false;
    }
    if (!expectPartOutputMatch.test(expectPartOutput)) {
        layer.tips("预计单位产量保留2位小数", '#expectPartOutput', {
            tips: [2, '#f76592']
        });
        $("#expectPartOutput").focus();
        return false;
    }
    if (!isEmpty(landSn)) {
        layer.tips("请输入土地编号", '#landSn', {
            tips: [2, '#f76592']
        });
        $("#landSn").focus();
        return false;
    }
    if (!isEmpty(landAddress)) {
        layer.tips("请输入土地所在地", '#landAddress', {
            tips: [2, '#f76592']
        });
        $("#landAddress").focus();
        return false;
    }
    if (!isEmpty(landPartArea)) {
        layer.tips("请输入每单位土地面积", '#landPartArea', {
            tips: [2, '#f76592']
        });
        $("#landPartArea").focus();
        return false;
    }
    if (!isEmpty(goodsNumber)) {
        layer.tips("请输入商品库存", '#goodsNumber', {
            tips: [2, '#f76592']
        });
        $("#goodsNumber").focus();
        return false;
    }
    if (!isEmpty(startSubscribeTime)) {
        layer.tips("请输入认购开始时间", '#startSubscribeTime', {
            tips: [2, '#f76592']
        });
        $("#startSubscribeTime").focus();
        return false;
    }
    if (!isEmpty(endSubscribeTime)) {
        layer.tips("请输入认购结束时间", '#endSubscribeTime', {
            tips: [2, '#f76592']
        });
        $("#endSubscribeTime").focus();
        return false;
    }
    var goods = {};
    goods.goodsName = goodsName;
    goods.shopPrice = shopPrice;
    goods.depositRatio = depositRatio;
    goods.isFreeShipping = isFreeShipping;
    goods.catId = catId;
    goods.breeds = breeds;
    //goods.brandId = brandName;
    goods.plantingCycle = plantingCycle;
    goods.plantime = startPlantime + "," + endPlantime;
    goods.expectPartOutput = expectPartOutput;
    goods.landSn = landSn;
    goods.landAddress = landAddress;
    goods.landPartArea = landPartArea;
    goods.goodsNumber = goodsNumber;
    //goods.goodsBrief = goodsBrief;
    goods.goodsDesc = goodsDesc;
    goods.goodsMasterImgs = goodsMasterImgs;
    goods.goodsDescImgs = goodsDescImgs;
    goods.landImgs = landImgs;
    goods.farmerId = farmerId;

    goods.startSubscribeTime = startSubscribeTime;
    goods.endSubscribeTime = endSubscribeTime;

    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/seller/publishGoods";
    ajaxObj.data = JSON.stringify(goods);
    ajaxObj.success = function (data) {
        var code = data.code;
        var message = data.message;
        console.log(data);
        if (200 == code) {
            layer.alert("商品发布成功", function (index) {
                location.href = "/web/seller/publishedGoods.html";
                layer.close(index);
            });
        } else if (500 == code) {
            layer.alert(message);
        }
    }
    ajaxData(ajaxObj);
}
