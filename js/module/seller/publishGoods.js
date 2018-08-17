/**
 * 图片全局变量
 * @type {string}
 */
var MASTERIMG_URL = "";
var LANDIMG_URL = "";
var GOODSDESCIMG_URL = "";


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
                    } else {
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
    $("#showGoodsArea").html("总面积：约" + totalArea.toFixed(2) + "亩 &nbsp;&nbsp;&nbsp;&nbsp;总产量：约" + totalPartOutput.toFixed(2) + "KG");
}

/**
 * 发布商品
 * @returns {boolean}
 */
function publishGoods() {
    var goodsId = $("#goodsId").val();//编辑商品
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
    var farmerId = $("#farmerId").val();
    var subscribeTime = $("#subscribeTime").val();
    var subscribeTimes = subscribeTime.split("至");
    var startSubscribeTime = subscribeTimes[0];
    var endSubscribeTime = subscribeTimes[1];
    var protocol = $("#protocol").is(':checked');

    if (isEmpty(goodsName)) {
        layer.tips("请输入商品标题", '#goodsName', {
            tips: [2, '#f76592']
        });
        $("#goodsName").focus();
        return false;
    }
    if (goodsName.length > 0 && goodsName.length < 60) {
        layer.tips("商品标题应在1-60字符内", '#goodsName', {
            tips: [2, '#f76592']
        });
        $("#goodsName").focus();
        return false;
    }
    if (isEmpty(shopPrice)) {
        layer.tips("请输入商品单价", '#shopPrice', {
            tips: [2, '#f76592']
        });
        $("#shopPrice").focus();
        return false;
    }
    var shopPriceRegex = /^[0-9]*$/;
    if (!shopPriceRegex.test(shopPrice)) {
        layer.tips("只接受大于1的整数", '#shopPrice', {
            tips: [2, '#f76592']
        });
        $("#shopPrice").focus();
        return false;
    }
    if (parseInt(shopPrice) < 1) {
        layer.tips("商品单价至少1元", '#shopPrice', {
            tips: [2, '#f76592']
        });
        $("#shopPrice").focus();
        return false;
    }
    if (isEmpty(depositRatio)) {
        layer.tips("请输入定金比例1-100", '#depositRatio', {
            tips: [2, '#f76592']
        });
        $("#depositRatio").focus();
        return false;
    }
    var depositRatioRegex = /(^[1-9][0-9]$|^[0-9]$|^100$)/;
    if (!depositRatioRegex.test(depositRatio)) {
        layer.tips("定金比例应在1-100范围内", '#depositRatio', {
            tips: [2, '#f76592']
        });
        $("#depositRatio").focus();
        return false;
    }
    if (isEmpty(isFreeShipping)) {
        layer.tips("请选择是否包邮", '#isFreeShipping', {
            tips: [2, '#f76592']
        });
        $("#isFreeShipping").focus();
        return false;
    }
    if (isEmpty(catId)) {
        layer.tips("请选择商品品类", '#catId', {
            tips: [2, '#f76592']
        });
        $("#catId").focus();
        return false;
    }
    if (isEmpty(breeds)) {
        layer.tips("请输入商品品种", '#breeds', {
            tips: [2, '#f76592']
        });
        $("#breeds").focus();
        return false;
    }
    if (isEmpty(plantingCycle)) {
        layer.tips("请输入生长周期", '#plantingCycle', {
            tips: [2, '#f76592']
        });
        $("#plantingCycle").focus();
        return false;
    }
    if (isEmpty(startPlantime)) {
        layer.tips("请选择种植开始时间", '#startPlantime', {
            tips: [2, '#f76592']
        });
        $("#startPlantime").focus();
        return false;
    }
    if (isEmpty(endPlantime)) {
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
        $("#startPlantime").focus();
        return false;
    }
    if (startPlantime == endPlantime) {
        layer.tips("种植结束时间要大于开始时间", '#endPlantime', {
            tips: [2, '#f76592']
        });
        $("#endPlantime").focus();
        return false;
    }
    var expectPartOutputMatch = /^(?!0+(?:\.0+)?$)\d+(?:\.\d{1,2})?$/;
    if (isEmpty(expectPartOutput)) {
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
    if (isEmpty(landSn)) {
        layer.tips("请输入土地编号", '#landSn', {
            tips: [2, '#f76592']
        });
        $("#landSn").focus();
        return false;
    }
    if (isEmpty(landAddress)) {
        layer.tips("请输入土地所在地", '#landAddress', {
            tips: [2, '#f76592']
        });
        $("#landAddress").focus();
        return false;
    }
    if (isEmpty(landPartArea)) {
        layer.tips("请输入每单位土地面积", '#landPartArea', {
            tips: [2, '#f76592']
        });
        $("#landPartArea").focus();
        return false;
    }
    if (isEmpty(goodsNumber)) {
        layer.tips("请输入商品库存", '#goodsNumber', {
            tips: [2, '#f76592']
        });
        $("#goodsNumber").focus();
        return false;
    }
    var formData = new FormData();

    var masterImgs = "";
    var landImgs = "";
    var descImgs = "";
    if (isEmpty(goodsId)) {
        var masterImgInputs = $("#showMasterImgs input[name='masterImg']");
        var landImgInputs = $("#showLandImgs input[name='landImg']");
        var descImgInputs = $("#showDescImgs input[name='descImg']");

        if (masterImgInputs.length == 0) {
            layer.alert("请上传商品主图");
            return false;
        }
        if (landImgInputs.length == 0) {
            layer.alert("请上传商品土地图");
            return false;
        }
        if (descImgInputs.length == 0) {
            layer.alert("请上传商品详细图");
            return false;
        }

        for (var i = 0; i < masterImgInputs.length; i++) {
            masterImgs = masterImgInputs[i].files[0];
            console.log(masterImgs[0]);
            formData.append("masterImgs", masterImgs);
        }
        landImgs = landImgInputs[0].files[0];
        formData.append("landImgs", landImgs);
        for (var i = 0; i < descImgInputs.length; i++) {
            descImgs = descImgInputs[i].files[0];
            formData.append("descImgs", descImgs);
        }
    } else {
        var masterImgInputs = $("#showMasterImgs input[name='masterImg']");
        var landImgInputs = $("#showLandImgs input[name='landImg']");
        var descImgInputs = $("#showDescImgs input[name='descImg']");

        var masterImgsSize = $("#showMasterImgs li").length - 1;
        var landImgsSize = $("#showLandImgs li").length - 1;
        var descImgsSize = $("#showDescImgs li").length - 1;

        if (masterImgInputs.length + masterImgsSize == 0) {
            layer.alert("请上传商品主图");
            return false;
        }
        if (landImgInputs.length + landImgsSize == 0) {
            layer.alert("请上传商品土地图");
            return false;
        }
        if (descImgInputs.length + descImgsSize == 0) {
            layer.alert("请上传商品详细图");
            return false;
        }

        for (var i = 0; i < masterImgInputs.length; i++) {
            masterImgs = masterImgInputs[i].files[0];
            console.log(masterImgs[0]);
            formData.append("masterImgs", masterImgs);
        }
        landImgs = landImgInputs[0].files[0];
        formData.append("landImgs", landImgs);
        for (var i = 0; i < descImgInputs.length; i++) {
            descImgs = descImgInputs[i].files[0];
            formData.append("descImgs", descImgs);
        }
        formData.append("masterImgsUrl", MASTERIMG_URL.substr(0, MASTERIMG_URL.length - 1));
        formData.append("landImgsUrl", LANDIMG_URL.substr(0, LANDIMG_URL.length - 1));
        formData.append("descImgsUrl", GOODSDESCIMG_URL.substr(0, GOODSDESCIMG_URL.length - 1));
    }
    if (isEmpty(goodsDesc)) {
        layer.tips("请填写商品描述", '#goodsDesc', {
            tips: [2, '#f76592']
        });
        $("#subscribeTime").focus();
        return false;
    }
    if (isEmpty(subscribeTime)) {
        layer.tips("请选择认购时限", '#subscribeTime', {
            tips: [2, '#f76592']
        });
        $("#subscribeTime").focus();
        return false;
    }
    if (!protocol) {
        layer.alert("您还没有阅读并同意《商品发布协议》");
        return false;
    }

    formData.append("goodsId", goodsId);
    formData.append("goodsName", goodsName);
    formData.append("shopPrice", shopPrice);
    formData.append("depositRatio", depositRatio);
    formData.append("isFreeShipping", isFreeShipping);
    formData.append("catId", catId);
    formData.append("breeds", breeds);
    formData.append("plantingCycle", plantingCycle);
    formData.append("plantime", startPlantime + "," + endPlantime);
    formData.append("expectPartOutput", expectPartOutput);
    formData.append("landSn", landSn);
    formData.append("landAddress", landAddress);
    formData.append("landPartArea", landPartArea);
    formData.append("goodsNumber", goodsNumber);
    formData.append("goodsDesc", goodsDesc);
    formData.append("farmerId ", farmerId);
    formData.append("startSubscribeTime", startSubscribeTime);
    formData.append("endSubscribeTime", endSubscribeTime);

    var Authorization = "Bearer " + $.cookie('token');
    $.ajax({
        url: SERVER_URL + '/publishGoods',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'JSON',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", Authorization);
        }
    }).done(function (res) {
        console.log(res);
        var code = res.code;
        var message = res.message;
        if (200 == code) {
            layer.alert("商品发布成功", function (index) {
                location.href = "/web/seller/publishedGoods.html";
                layer.close(index);
            });
        } else if (500 == code) {
            layer.alert(message);
        }
    }).fail(function (res) {
        layer.alert(res);
    });
}

/**
 * 上传图片
 * @param type
 */
function uploadImg(type) {
    var masterImgs = $('#uploadMasterImg')[0].files;
    var landImgs = $('#uploadLandImg')[0].files;
    var descImgs = $('#uploadDescImg')[0].files;
    var masterImgsSize = $("#showMasterImgs li").length;
    var landImgsSize = $("#showLandImgs li").length;
    var descImgsSize = $("#showDescImgs li").length;
    var maxImgSize = 3 * 1024 * 1024;

    console.log("type=" + type);
    console.log("masterImgsSize=" + masterImgsSize);
    console.log("landImgsSize=" + landImgsSize);
    console.log("descImgsSize=" + descImgsSize);

    if ("masterImg" == type) {
        if (masterImgs.length > 5) {
            layer.alert("宝贝主图最多允许上传5张");
            return;
        }
        if (masterImgsSize > 5) {
            layer.alert("宝贝主图最多允许上传5张");
            return;
        }
        for (let file of masterImgs) {
            if (file.size > maxImgSize) {
                layer.alert("图片不能超过3MB");
                return;
            }
            let img = new Image;
            img.src = URL.createObjectURL(file);
            img.title = file.name;

            var newInput = $("#uploadMasterImg").clone();
            newInput.removeAttr("id");
            newInput.attr("name", "masterImg");
            newInput.removeAttr("onchange");
            newInput.css("display", "none");
            var newLi = document.createElement("li");
            $(newLi).append("<img src='/img/icon_delete_img.png' class='upload_img1' onclick='this.parentNode.parentNode.removeChild(this.parentNode)'/>" +
                "<img src='" + img.src + "'style='width: 150px;height: 150px' class='upload_img2'>");
            $(newLi).append(newInput);
        }
        $('#showMasterImgs').append(newLi);
    } else if ("landImg" == type) {
        if (landImgs.length > 1) {
            layer.alert("土地图最多允许上传1张");
            return;
        }
        if (landImgsSize > 1) {
            layer.alert("土地图最多允许上传1张");
            return;
        }
        for (let file of landImgs) {
            if (file.size > maxImgSize) {
                layer.alert("图片不能超过3MB");
                return;
            }
            let img = new Image;
            img.src = URL.createObjectURL(file);
            img.title = file.name;

            var newInput = $("#uploadLandImg").clone();
            newInput.removeAttr("id");
            newInput.attr("name", "landImg");
            newInput.removeAttr("onchange");
            newInput.css("display", "none");
            var newLi = document.createElement("li");
            $(newLi).append("<img src='/img/icon_delete_img.png' class='upload_img1' onclick='this.parentNode.parentNode.removeChild(this.parentNode)'/>" +
                "<img src='" + img.src + "'style='width: 150px;height: 150px' class='upload_img2'>");
            $(newLi).append(newInput);
        }
        $('#showLandImgs').append(newLi);
    } else if ("descImg" == type) {
        if (descImgs.length > 3) {
            layer.alert("商品详情图最多允许上传3张");
            return;
        }
        if (descImgsSize > 3) {
            layer.alert("商品详情图最多允许上传3张");
            return;
        }
        for (let file of descImgs) {
            if (file.size > maxImgSize) {
                layer.alert("图片不能超过3MB");
                return;
            }
            let img = new Image;
            img.src = URL.createObjectURL(file);
            img.title = file.name;

            var newInput = $("#uploadDescImg").clone();
            newInput.removeAttr("id");
            newInput.attr("name", "descImg");
            newInput.removeAttr("onchange");
            newInput.css("display", "none");
            var newLi = document.createElement("li");
            $(newLi).append("<img src='/img/icon_delete_img.png' class='upload_img1' onclick='this.parentNode.parentNode.removeChild(this.parentNode)'/>" +
                "<img src='" + img.src + "'style='width: 150px;height: 150px' class='upload_img2'>");
            $(newLi).append(newInput);
        }
        $('#showDescImgs').append(newLi);
    }
}

/**
 * 删除图片
 */
function deleteImg(obj, type) {
    if ("masterImg" == type) {
        console.log("=" + MASTERIMG_URL);
        var imgUrl = $(obj).siblings()[0].alt + ",";
        MASTERIMG_URL = MASTERIMG_URL.replace(imgUrl, "");
        console.log("==" + MASTERIMG_URL);
    } else if ("landImg" == type) {
        var imgUrl = $(obj).siblings()[0].alt + ",";
        LANDIMG_URL = LANDIMG_URL.replace(imgUrl, "");
        console.log("==" + LANDIMG_URL);
    } else if ("goodsDescImg" == type) {
        var imgUrl = $(obj).siblings()[0].alt + ",";
        GOODSDESCIMG_URL = GOODSDESCIMG_URL.replace(imgUrl, "");
        console.log("==" + GOODSDESCIMG_URL);
    }
    obj.parentNode.parentNode.removeChild(obj.parentNode);
}

/**
 * 加载已发布商品编辑详情页
 * @param goodsId
 */
function getPublishedGoods(goodsId) {
    var ajaxObj = {
        url: SERVER_URL + "/publishedGoods/detail?goodsId=" + goodsId,
        success: function (data) {
            console.log(data);
            if (data != null && data.code == '1000') {
                if (data.data != null && data.data) {
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
                    goodsMasterImgHtml += "<li>" +
                        "<img src=\"/img/bg_upload.png\" style=\"width: 150px;height: 150px\" class=\"upload_img2\" onclick=\"$(this).parent().find('#uploadMasterImg').click();\">\n" +
                        "<input id=\"uploadMasterImg\" type=\"file\" name=\"file\" accept=\"image/*\" onchange=\"uploadImg('masterImg')\" multiple/></li>";
                    for (var i = 0; i < goodsMasterImgs.length; i++) {
                        goodsMasterImg = goodsMasterImgs[i];
                        goodsMasterImgHtml += "<li><img src='/img/icon_delete_img.png' class='upload_img1' onclick='deleteImg(this,\"masterImg\")'/>" +
                            "<img src='" + IMAGE_URL + goodsMasterImg + "' alt='" + goodsMasterImg + "' style='width: 150px;height: 150px' class='upload_img2'></li>";
                    }
                    $("#showMasterImgs").html(goodsMasterImgHtml);
                    MASTERIMG_URL = mallGoods.goodsMasterImgs + ",";

                    var landImgs = mallGoods.landImgs.split(",");
                    landImgHtml += "<li>" +
                        "<img src=\"/img/bg_upload.png\" style=\"width: 150px;height: 150px\" class=\"upload_img2\" onclick=\"$(this).parent().find('#uploadLandImg').click();\">\n" +
                        "<input id=\"uploadLandImg\" type=\"file\" name=\"file\" accept=\"image/*\" onchange=\"uploadImg('landImg')\" multiple/></li>";
                    for (var i = 0; i < landImgs.length; i++) {
                        landImg = landImgs[i];
                        landImgHtml += "<li><img src='/img/icon_delete_img.png' class='upload_img1' onclick='deleteImg(this,\"landImg\")'/>" +
                            "<img src='" + IMAGE_URL + landImg + "'alt='" + landImg + "'  style='width: 150px;height: 150px' class='upload_img2'></li>";
                    }
                    $("#showLandImgs").html(landImgHtml);
                    LANDIMG_URL = mallGoods.landImgs + ",";

                    var goodsDescImgs = mallGoods.goodsDescImgs.split(",");
                    goodsDescImgHtml += "<li>" +
                        "<img src=\"/img/bg_upload.png\" style=\"width: 150px;height: 150px\" class=\"upload_img2\" onclick=\"$(this).parent().find('#uploadDescImg').click();\">\n" +
                        "<input id=\"uploadDescImg\" type=\"file\" name=\"file\" accept=\"image/*\" onchange=\"uploadImg('descImg')\" multiple/></li>";
                    for (var i = 0; i < goodsDescImgs.length; i++) {
                        goodsDescImg = goodsDescImgs[i];
                        goodsDescImgHtml += "<li><img src='/img/icon_delete_img.png' class='upload_img1' onclick='deleteImg(this,\"goodsDescImg\")'/>" +
                            "<img src='" + IMAGE_URL + goodsDescImg + "' alt='" + goodsDescImg + "'  style='width: 150px;height: 150px' class='upload_img2'></li>";
                    }
                    $("#showDescImgs").html(goodsDescImgHtml);
                    GOODSDESCIMG_URL = mallGoods.goodsDescImgs + ",";

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
