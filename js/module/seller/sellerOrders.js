var SellerOrder = {
    page : {
        pageSize : 10,
        pageNo : 1
    }
};

$(function () {
    $(".selectAll").click(function(){
        Dolaing.selector("selectAll" , "contentCenter");
    });
    //批量发货
    $(".batchDeliver").click(function(){
        SellerOrder.batchDeliver();
    });
    SellerOrder.infoMenus();
    SellerOrder.findRecords();
});

SellerOrder.infoMenus = function(){

}

SellerOrder.findRecords = function(){
    var postData = "?userId="+Dolaing.user.account + "&pageNo="+SellerOrder.page.pageNo +"&pageSize="+SellerOrder.page.pageSize ;
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/queryRecordsByUser"+postData,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                if(data.data !=null){
                    var _html = "";
                    $(data.data.records).each(function(index,record){
                        _html += SellerOrder.buildDataView(record);
                    });

                    $("#orderList").html(_html);
                    $("#pageView").html(Dolaing.page.view(data.data.current,data.data.pages,data.data.total));
                }
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}


SellerOrder.buildDataView = function(order){
    var _html ='<li>' +
        '                <div class="orders_words">' +
        '                    <input type="checkbox" name=""  value="'+order.id+'-'+order.orderStatusFullCode+'" />' +
        '                    <h5>订单号：'+order.orderSn+'&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：'+order.createTime+'&nbsp;&nbsp;</h5>' +
        '                </div>' ;
    var goods = null ;
    for(var i =0 ; i< order.orderGoodsVos.length ; i++){
        goods = order.orderGoodsVos[i] ;
        _html += '  <table border="0" cellspacing="0" cellpadding="0" class="grid_seller seller_list_content">' +
            '                    <tr>' +
            '                        <td>' +
            '                            <img src="'+IMAGE_URL+goods.goodsMasterImg+'"/>' +
            '                            <div class="fl">' +
            '                                <h3>'+goods.goodsName+'</h3>' +
            '                                <h4>土地编号：'+goods.landSn+'</h4>' +
            '                                <h4>认购土地面积：'+goods.buyLandArea+goods.landPartAreaUnitName+'</h4>' +
            '                            </div>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>买家：'+order.userId+'</h3>' +
            '                            <h3>农户：'+goods.farmerId+'</h3>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>'+order.orderStatusFullName+'</h3>' +
            '                            <h3 class="link">查看详情</h3>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>应得金额</h3>' +
            '                            <h2 class="money">￥'+order.sellerReceivableAmount+'</h2>' +
            '                            <h3>（定金比例'+goods.depositRatioLabel+'）</h3>' +
            '                            <h3>总额：'+goods.goodsAmount+'</h3>' +
            '                        </td>' ;
        if(order.orderStatusFullCode == "2"){
            _html += ' <td class="middle">' +
            ' <h3 class="link" onclick="SellerOrder.batchDeliver(\''+order.id+'\')">发&nbsp;&nbsp;货</h3>' +
            '</td>' ;
        }else{
            _html += ' <td class="middle"></td>' ;
        }
        _html += '</tr>' +
            '                </table>' +
            '                <h5 class="deliver">预计发货时间：'+ Dolaing.date.formatCh(goods.expectDeliverTime)
            +'&nbsp;&nbsp;|&nbsp;&nbsp;预计出货：'+goods.expectPartOutputOrder+goods.expectPartOutputUnitName+'</h5>' ;
    }
    _html +='</li>' ;
    return _html ;
}



/**
 * 批量发货
 */
SellerOrder.batchDeliver = function(id){
    var ids = "" ;
    var flag = true ;
    if(id != null && id !=""){ //单个发货
        ids = id ;
    }else { //批量发货
        $("#orderList input[type='checkbox']:checked").each(function(){
            if($(this).val().split("-")[1] != 2 ){ //如果不是生产中的订单不允许发货
                layer.alert("请选择生产中的订单进行发货");
                flag = false ;
                return false ;
            }
            ids+= $(this).val().split("-")[0] +",";
        });
        if(!flag){
            return false ;
        }
        if(ids == ""){
            layer.alert("请选择待发货的订单");
            return false ;
        }
        ids = ids.substr(0,ids.length-1);
    }
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/batchDeliver?ids="+ids ,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                layer.alert("已完成发货");
                SellerOrder.findRecords();
            }else{
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
function page(pageNo){
    SellerOrder.page.pageNo = pageNo ;
    SellerOrder.findRecords();
}