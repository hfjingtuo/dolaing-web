var PublishedGoods = {
    page: {
        pageSize: 5,
        pageNo: 1
    }
};

//预加载方法
$(function () {
    /***初始化左侧菜单**/
    SellCenterMenu.selectMenu(3);
    getPublishedGoodsList();
    $(".selectAll").click(function () {
        Dolaing.selector(this, "contentCenter");
    });
    /***批量删除**/
    $(".batchDelete").click(function () {
        batchDelete();
    });
});

function getPublishedGoodsList() {
    var getData = "?pageNo=" + PublishedGoods.page.pageNo + "&pageSize=" + PublishedGoods.page.pageSize;
    var ajaxObj = {
        url: SERVER_URL + "/publishGoods/list" + getData,
        success: function (data) {
            if (data != null && data.code == '1000') {
                if (data.data != null) {
                    var _html = "";
                    $(data.data.records).each(function (index, record) {
                        _html += goodsHtml(record);
                    });
                    $("#root").html(_html);
                    $("#pageView").html(Dolaing.page.view(data.data.current, data.data.pages, data.data.total));
                }
            } else {
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

/**
 * 分页请求
 * @param pageNo
 */
function page(pageNo) {
    PublishedGoods.page.pageNo = pageNo;
    getPublishedGoodsList();
}

function goodsHtml(goods) {
    var html =
        "<li>" +
        " <div class='orders_words'>" +
        " <input type='checkbox' value='" + goods.id + "'/>" +
        " <h5>创建时间：" + getDateTime(goods.createTime) + "</h5>" +
        " </div>" +
        " <div class='orders_box published_list'>" +
        " <div class='orders_box_goods'>" +
        " <img style='cursor: pointer' onclick='Dolaing.openGoodsDetail(\""+goods.id +"\")' src='" + IMAGE_URL + goods.goodsMasterImgs.split(",")[0] + "'/>" +
        " <div class='fl'>" +
        " <h3 style='cursor: pointer' onclick='Dolaing.openGoodsDetail(\""+ goods.id +"\")'>" + goods.goodsName + "</h3>" +
        " </div>" +
        " </div>" +
        " <div class='orders_box_state'>" +
        " <h3>" + goods.expectPartOutput + "亩</h3>" +
        " </div>" +
        " <div class='orders_box_state'>" +
        " <h3 style='width: 110px;'>" + goods.expectPartOutput + "KG</h3>" +
        " </div>" +
        " <div class='orders_box_price' style='margin-right: 1px;'>" +
        " <h3 style='width: 117px;'>" + goods.shopPrice + "元</h3>" +
        " <h4 style='width: 117px;font-size: 12px;color: #666666;'>定金比例：" + goods.depositRatio * 100 + "%</h4>" +
        " </div>" +
        " <div class='orders_box_operate orders_box_operate1'>" +
        " <h3 class='view_detail' style='margin-top: 50px;'><a href='/web/seller/publishGoods.html?id=" + goods.id + "'>编辑</a></h3>" +
        " <h3 class='view_detail'><a href='javascript:void(0)' onclick='batchDelete(" + goods.id + ")'>删除</a></h3>" +
        " </div>" +
        " </div>" +
        " </li>"
    return html;
}

/**
 * 批量删除
 */
function batchDelete(id) {
    var ids = "";
    var flag = true;
    if (id != null && id != "") { //单个删除
        ids = id;
    } else { //批量删除
        $("#root input[type='checkbox']:checked").each(function () {
            ids += $(this).val().split("-")[0] + ",";
        });
        if (!flag) {
            return false;
        }
        if (ids == "") {
            layer.msg("请选择需要删除的商品", {icon: 5});
            return false;
        }
        ids = ids.substr(0, ids.length - 1);
    }
    layer.confirm('确认要删除该商品吗？', {
        btn: ['确认', '取消']
    }, function () {
        var ajaxObj = {
            url: SERVER_URL + "/batchDeleteGoods?ids=" + ids,
            success: function (data) {
                if (data != null && data.code == '1000') {
                    layer.msg("删除成功", {icon: 1});
                    getPublishedGoodsList();
                } else {
                    layer.msg(data.msg, {icon: 5});
                }
            }
        }
        ajaxData(ajaxObj);
    });
}

function goGoodsDetail(id) {
    window.location.href = "/goodsDetails.html?id="+id;
}