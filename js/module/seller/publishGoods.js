$(function () {
    /***初始化左侧菜单**/
    SellCenterMenu.selectMenu(2);

    var goodsId = $.query.get("id");
    if (goodsId != null && goodsId != "") {
        /***初始化商品编辑页数据**/
        getPublishedGoods(goodsId);
    } else {
        /**初始化品类下拉框**/
        Dolaing.dictionary("catId");
        /**初始化种植时间下拉框**/
        for (var month = 1; month < 13; month++) {
            $("#startPlantime").append('<option value=' + month + '>' + month + '月</option>');
            $("#endPlantime").append('<option value=' + month + '>' + month + '月</option>');
        }
        /**获取下级的所有农户**/
        getAllFarmer(null);
    }
});

function getAllFarmer(farmerId) {
    var ajaxObj = {
        url: SERVER_URL + "/getAllFarmer",
        success: function (data) {
            console.log(data.data);
            if (data != null && data.code == '1000') {
                $.each(data.data, function (i, val) {
                    if (farmerId != null) {
                        if (val.account == farmerId) {
                            $("#farmerId").append('<option selected value=' + val.account + '>' + val.account + '【' + val.name + '】</option>');
                        } else {
                            $("#farmerId").append('<option value=' + val.account + '>' + val.account + '【' + val.name + '】</option>');
                        }
                    }else {
                        $("#farmerId").append('<option value=' + val.account + '>' + val.account + '【' + val.name + '】</option>');
                    }
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

/**
 * 动态计算商品产量、土地面积信息
 */
function showGoodsArea() {
    var expectPartOutput = $("#expectPartOutput").val();
    var landPartArea = $("#landPartArea").val();
    var goodsNumber = $("#goodsNumber").val();
    var totalArea = 0;
    var totalPartOutput = 0;
    if (goodsNumber != null && goodsNumber != "") {
        if (landPartArea != null && landPartArea != "") {
            totalArea = landPartArea * goodsNumber;
        }
        if (expectPartOutput != null && expectPartOutput != "") {
            totalPartOutput = expectPartOutput * goodsNumber;
        }
    }
    $("#showGoodsArea").html("总面积：约" + totalArea + "亩 &nbsp;&nbsp;&nbsp;&nbsp;总产量：约" + totalPartOutput + "KG");
}

function publishGoods() {
    var goodsName = $("#goodsName").val();
    var shopPrice = $("#shopPrice").val();
    var depositRatio = $("#depositRatio").val();
    var isFreeShipping = $("#isFreeShipping").val();
    var catId = $("#catId").val();
    var breeds = $("#breeds").val();
    var plantingCycle = $("#plantingCycle").val();//生长周期
    var startPlantime = $("#startPlantime").val();
    var endPlantime = $("#endPlantime").val();
    var expectPartOutput = $("#expectPartOutput").val();
    var landSn = $("#landSn").val();
    var landAddress = $("#landAddress").val();
    var landPartArea = $("#landPartArea").val();
    var goodsNumber = $("#goodsNumber").val();
    var goodsDesc = $("#goodsDesc").val();
    var goodsMasterImgs = $("#goodsMasterImgs").val();
    var goodsDescImgs = $("#goodsDescImgs").val();
    var landImgs = $("#landImgs").val();
    var farmerId = $("#farmerId").val();
    var subscribeTime = $("#subscribeTime").val();

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
        layer.tips("请输入定金比例1-100", '#depositRatio', {
            tips: [2, '#f76592']
        });
        $("#depositRatio").focus();
        return false;
    }
    var depositRatioRegex = /(^[1-9][0-9]$)|(^100&)|(^[1-9]$)$/;
    if (!depositRatioRegex.test(depositRatio)) {
        layer.tips("定金比例应在1-100范围内", '#depositRatio', {
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
    if (!isEmpty(plantingCycle)) {
        layer.tips("请输入生长周期", '#plantingCycle', {
            tips: [2, '#f76592']
        });
        $("#plantingCycle").focus();
        return false;
    }
    if (!isEmpty(startPlantime)) {
        layer.tips("请选择种植开始时间", '#startPlantime', {
            tips: [2, '#f76592']
        });
        $("#startPlantime").focus();
        return false;
    }
    if (!isEmpty(endPlantime)) {
        layer.tips("请选择种植结束时间", '#endPlantime', {
            tips: [2, '#f76592']
        });
        $("#endPlantime").focus();
        return false;
    }
    if (startPlantime > endPlantime) {
        layer.tips("种植开始时间不能大于结束时间", '#startPlantime', {
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
    if (!isEmpty(subscribeTime)) {
        layer.tips("请选择认购时限", '#subscribeTime', {
            tips: [2, '#f76592']
        });
        $("#subscribeTime").focus();
        return false;
    }
    var subscribeTimes = subscribeTime.split("至");
    var startSubscribeTime = new Date(subscribeTimes[0]);
    var endSubscribeTime = new Date(subscribeTimes[1]);
    var goods = {};
    goods.goodsName = goodsName;
    goods.shopPrice = shopPrice;
    goods.depositRatio = depositRatio;
    goods.isFreeShipping = isFreeShipping;
    goods.catId = catId;
    goods.breeds = breeds;
    goods.plantingCycle = plantingCycle;
    goods.plantime = startPlantime + "," + endPlantime;
    goods.expectPartOutput = expectPartOutput;
    goods.landSn = landSn;
    goods.landAddress = landAddress;
    goods.landPartArea = landPartArea;
    goods.goodsNumber = goodsNumber;
    goods.goodsDesc = goodsDesc;
    goods.goodsMasterImgs = goodsMasterImgs;
    goods.goodsDescImgs = goodsDescImgs;
    goods.landImgs = landImgs;
    goods.farmerId = farmerId;

    goods.startSubscribeTime = startSubscribeTime;
    goods.endSubscribeTime = endSubscribeTime;

    var ajaxObj = {};
    ajaxObj.url = SERVER_URL + "/publishGoods";
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

function getPublishedGoods(goodsId) {
    var ajaxObj = {
        url: SERVER_URL + "/publishedGoods/detail?goodsId=" + goodsId,
        success: function (data) {
            console.log(data);
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var goodsMasterImgHtml = "";
                    var landImgHtml = "";
                    var goodsDescImgHtml = "";

                    var goodsMasterImg = null;
                    var landImg = null;
                    var goodsDescImg = null;

                    var mallGoods = data.data;

                    $("#goodsId").val(mallGoods.id);
                    $("#catIdVal").val(mallGoods.catId);
                    $("#goodsName").val(mallGoods.goodsName);
                    $("#shopPrice").val(mallGoods.shopPrice);
                    $("#depositRatio").val(mallGoods.depositRatio * 100);
                    $("#breeds").val(mallGoods.breeds);
                    $("#plantingCycle").val(mallGoods.plantingCycle);
                    $("#expectPartOutput").val(mallGoods.expectPartOutput);
                    $("#landSn").val(mallGoods.landSn);
                    $("#landAddress").val(mallGoods.landAddress);
                    $("#landPartArea").val(mallGoods.landPartArea);
                    $("#goodsNumber").val(mallGoods.goodsNumber);
                    $("#goodsDesc").val(mallGoods.goodsDesc);
                    $("#subscribeTime").val(mallGoods.startSubscribeTime.substr(0, 10) + " 至 " + mallGoods.endSubscribeTime.substr(0, 10));

                    //加载商品产量、土地面积信息
                    showGoodsArea();
                    /**获取下级的所有农户**/
                    getAllFarmer(mallGoods.farmerId);

                    var plantime = mallGoods.plantime.split(",");
                    var startPlantime = plantime[0];
                    var endPlantime = plantime[1];
                    for (var month = 1; month < 13; month++) {
                        if (startPlantime == month) {
                            $("#startPlantime").append('<option selected value=' + month + '>' + month + '月</option>');
                        } else {
                            $("#startPlantime").append('<option value=' + month + '>' + month + '月</option>');
                        }
                        if (endPlantime == month) {
                            $("#endPlantime").append('<option selected value=' + month + '>' + month + '月</option>');
                        } else {
                            $("#endPlantime").append('<option value=' + month + '>' + month + '月</option>');
                        }
                    }

                    var goodsMasterImgs = mallGoods.goodsMasterImgs.split(",");
                    goodsMasterImgHtml += "<li><img src='/img/bg_upload.png' id='uploadMasterImg' style='width: 150px;height: 150px'><input type='file' accept='image/*'/></li>"
                    for (var i = 0; i < goodsMasterImgs.length; i++) {
                        goodsMasterImg = goodsMasterImgs[i];
                        goodsMasterImgHtml += "<li><img src='" + IMAGE_URL + goodsMasterImg + "' style='width: 150px;height: 150px'></li>"
                    }
                    $("#showMasterImgs").html(goodsMasterImgHtml);

                    var landImgs = mallGoods.landImgs.split(",");
                    landImgHtml += "<li><img src='/img/bg_upload.png' id='uploadLandImg' style='width: 150px;height: 150px'><input type='file' accept='image/*'/></li>"
                    for (var i = 0; i < landImgs.length; i++) {
                        landImg = landImgs[i];
                        landImgHtml += "<li><img src='" + IMAGE_URL + landImgs + "' style='width: 150px;height: 150px'></li>"
                    }
                    $("#showLandImgs").html(landImgHtml);

                    var goodsDescImgs = mallGoods.goodsDescImgs.split(",");
                    goodsDescImgHtml += "<li><img src='/img/bg_upload.png' id='uploadDescImg' style='width: 150px;height: 150px'><input type='file' accept='image/*'/></li>"
                    for (var i = 0; i < goodsDescImgs.length; i++) {
                        goodsDescImg = goodsDescImgs[i];
                        goodsDescImgHtml += "<li><img src='" + IMAGE_URL + goodsDescImg + "' style='width: 150px;height: 150px'></li>"
                    }
                    $("#showDescImgs").html(goodsDescImgHtml);

                    /**初始化品类下拉框**/
                    Dolaing.dictionary("catId");
                }
            } else {
                layer.alert(data.message, function (index) {
                    location.href = "/web/seller/publishedGoods.html";
                    layer.close(index);
                });
            }
        }
    }
    ajaxData(ajaxObj);
}
