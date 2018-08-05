//预加载方法
$(function () {
    getPublishedGoodsList();
});

function getPublishedGoodsList() {
    $.ajax({
        type: "get",
        data: "pageNo=" + indexData.pageNo + "&pageSize=" + indexData.pageSize,
        url: SERVER_URL + "/seller/publishGoods/list",
        success: function (data) {
            console.log(data);
            var goodsList = data.list;
            console.log(goodsList);
            if (goodsList == null || goodsList.length == 0) {
                indexData.html += '暂无找到已发布商品';
            } else {
                var goods = null;
                for (var i = 0; i < goodsList.length; i++) {
                    goods = goodsList[i];
                    indexData.html += goodsHtml(goods);
                }
                $("#root").html(indexData.html);
                if (goodsList.length < indexData.pageSize) {
                    $("#OK").hide();
                } else {
                    $("#OK").show();
                }
            }

        }
    });
}

function goodsHtml(goods) {
    var html =
        "<li>" +
        " <div class='orders_words'>" +
        " <input type='checkbox' name='' id='' value=''/>" +
        " <h5>创建时间：" + getDateTime(goods.createTime) + "</h5>" +
        " </div>" +
        " <div class='orders_box published_list'>" +
        " <div class='orders_box_goods'>" +
        " <img src='/" + goods.goodsMasterImgs.split(",")[0] + "'/>" +
        " <div class='fl'>" +
        " <h3>" + goods.goodsName + "</h3>" +
        " </div>" +
        " </div>" +
        " <div class='orders_box_state'>" +
        " <h3>" + goods.expectPartOutput + "亩</h3>" +
        " </div>" +
        " <div class='orders_box_state'>" +
        " <h3 style='width: 110px;'>" + goods.expectTotalOutput + "KG</h3>" +
        " </div>" +
        " <div class='orders_box_price' style='margin-right: 1px;'>" +
        " <h3 style='width: 117px;'>" + goods.shopPrice + "元</h3>" +
        " <h4 style='width: 117px;font-size: 12px;color: #666666;'>定金比例：" + goods.depositRatio * 100 + "%</h4>" +
        " </div>" +
        " <div class='orders_box_operate orders_box_operate1'>" +
        " <h3 class='view_detail' style='margin-top: 50px;'><a href='/web/seller/publishGoods.html?id=" + goods.id + "'>编辑</a></h3>" +
        " <h3 class='view_detail'><a href='javascript:void(0)' onclick='delGoods(" + goods.id + ")'>删除</a></h3>" +
        " </div>" +
        " </div>" +
        " </li>"
    return html;
}

function delGoods(goodsId) {
    layer.confirm('确认要删除该商品吗？', {
        btn: ['确认', '取消']
    }, function () {
        $.ajax({
            type: "POST",
            data: "goodsId=" + goodsId,
            url: SERVER_URL + "/seller/deleteGoods",
            success: function (data) {
                console.log(data);
                layer.msg(data.message);
                getPublishedGoodsList();
            },
        });
    });
}