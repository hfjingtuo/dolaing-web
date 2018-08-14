var BuyerCenter = {
    page : {
        pageSize : 10,
        pageNo : 1
    }
};


/**
 * 未开户
 * @type {string}
 */
BuyerCenter.CONTENT_HTML_1 = '<h1 class="center_right_tip">十分抱歉，</br>您还未设置支付方式，</br>没有订单信息。</h1>' +
    '<div class="btn_submit" style="margin-top: 60px;margin-bottom: 60px;">' +
    '<h3 onclick="BuyerCenter.toOpenAccount();">立即设置</h3>' +
    '</div>';
/**
 * 已开户的时候 显示订单记录
 * @type {string}
 */
BuyerCenter.CONTENT_HTML_2 ='<h1 class="center_right_title">我的订单</h1>' +
    '<div class="operation">' +
    '<div class="batch fl">' +
    '<input type="checkbox" name=""  value="" class="fl selectAll"/>' +
    '<h5 class="fl">全选</h5>' +
    '<button type="button"  class="batchReceive">批量收货</button>' +
    '</div>' +
    '</div>' +
    '<!--列表标题-->' +
    '<div class="orders">' +
    '<div class="orders_box orders_box_title">' +
    '<div class="" style="text-align: left;text-indent: 30px;width: 466px;">' +
    '产品' +
    '</div>' +
    '<div style="width: 125px;">' +
    '交易状态' +
    '</div>' +
    '<div style="width: 161px;">' +
    '总价' +
    '</div>' +
    '<div style="width: 95px;">' +
    '操作' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<!--订单列表-->' +
    '<ul class="orders"  id="orderList">' +
    '</ul>' +
    '<!--操作栏-->' +
    '<div class="operation" style="margin-top: 25px;margin-bottom: 55px;">' +
    '<div class="batch fl">' +
    '<input type="checkbox" name=""  value="" class="fl selectAll"/>' +
    '<h5 class="fl">全选</h5>' +
    '<button type="button"  class="batchReceive" >批量收货</button>' +
    '</div>' +
    '<div class="pages fr"   id="pageView">' +
    '<ul >' +
    '<li class="pages_last">上一页</li>' +
    '<li class="pages_cur">1</li>' +
    '<li class="pages_next">下一页</li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '';





/**
 * 添加内容
 */
BuyerCenter.addContent = function(){
    if(Dolaing.user.userPayAccount != null && Dolaing.user.userPayAccount != ""){
        $("#contentCenter").html(BuyerCenter.CONTENT_HTML_2);
        $(".selectAll").click(function(){
            Dolaing.selector(this , "contentCenter");
        });
        //批量发货
        $(".batchReceive").click(function(){
            BuyerCenter.batchReceive();
        });
        BuyerCenter.findRecords();
    }else{
        $("#contentCenter").html(BuyerCenter.CONTENT_HTML_1);
    }
}

BuyerCenter.batchReceive = function (id){
    layer.confirm('确认收货吗？', {
        btn: ['确认', '取消']
    }, function(){
        BuyerCenter.batchReceiveForm(id);
    });
}

/**
 * 批量收货
 */
BuyerCenter.batchReceiveForm = function (id){
    var ids = "" ;
    var flag = true ;
    if(id != null && id !=""){ //单个收货
        ids = id ;
    }else { //批量收货
        $("#orderList input[type='checkbox']:checked").each(function(){
            if($(this).val().split("-")[1] != 3 ){ //如果不是已发货的订单不允许收货
                layer.alert("请选择已发货的订单进行收货");
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
        url: SERVER_URL+"/orderRecord/batchReceive?ids="+ids ,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                layer.alert("已完成收货");
                BuyerCenter.findRecords();
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

// 跳转到开户页面
BuyerCenter.toOpenAccount = function () {
   window.location.href = "/web/member/openAccount.html?type=1" ;
}


$(function () {
    BuyerCenterMenu.selectMenu(1);
    BuyerCenter.addContent();
});


/**
 * 买家订单记录查询
 */
BuyerCenter.findRecords = function(){
    var postData = "?userId="+Dolaing.user.account + "&pageNo="+BuyerCenter.page.pageNo +"&pageSize="+BuyerCenter.page.pageSize ;
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/queryRecordsByUser"+postData,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                if(data.data !=null){
                    var _html = "";
                    $(data.data.records).each(function(index,record){
                        _html += BuyerCenter.buildDataView(record);
                    });

                    if(data.data.records == null || data.data.records.length == 0 ){
                        _html += '<li style="text-align: center ; padding-top: 20px;">无数据</li>';
                        $("#pageView").html("");
                    }else{
                        $("#pageView").html(Dolaing.page.view(data.data.current,data.data.pages,data.data.total));
                    }
                    $("#orderList").html(_html);
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


BuyerCenter.buildDataView = function(order){
    var _html ='<li>' +
        '<div class="orders_words">' +
        '<input type="checkbox" name="" id="" value="'+order.id+'-'+order.orderStatusFullCode+'" >' +
        '<h5>订单号：'+order.orderSn+'&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：'+order.createTime+'&nbsp;&nbsp;|&nbsp;&nbsp;<span>店铺：'+order.shopName+'</span></h5>' +
        '</div>' ;
    var goods = null ;
    var operate = "" ;
    for(var i =0 ; i< order.orderGoodsVos.length ; i++) {
        goods = order.orderGoodsVos[i] ;
        _html += '<div class="orders_box">' +
        '<div class="orders_box_goods" style="width: 466px;">' +
        '<img src="'+IMAGE_URL+goods.goodsMasterImg+'">' +
        '<div class="fl">' +
        '<h3>' + goods.goodsName + '</h3>' +
        ' <h4>土地编号：' + goods.landSn + '</h4>' +
        '<h4>认购土地面积：' + goods.buyLandArea + goods.landPartAreaUnitName + '</h4>' +
        '</div>' +
        '</div>' +
        '<div class="orders_box_state" style="width: 125px;">' +
            '<h3>' + order.orderStatusFullName + '</h3>' +
            '<h4 class="view_detail"><a href="javascript:BuyerCenter.goDetail(\''+order.id+'\');">查看详情</a></h4>' +
            '</div>' +
            '<div class="orders_box_price" style="width: 161px;">' +
            '<h3 style="width: 161px;font-weight: bold;">￥' + goods.goodsAmount + '元</h3>' +
            '<h4 style="width: 161px;font-size: 12px;color: #666666;">（含运费：￥0元）</h4>' +
            '</div>' ;

        if(order.orderStatusFullCode == "1"){
            operate = '<a href="javascript:BuyerCenter.goPayHtml(\''+order.id+'\')">去付款</a>';
        }else if(order.orderStatusFullCode == "3"){
            operate = '<a href="javascript:BuyerCenter.batchReceive(\''+order.id+'\')">确认收货</a>';
        }
        _html += '<div class="orders_box_operate" style="width: 95px;">' +
            '<h3 class="view_detail" style="width: 95px;">'+operate+'</h3>' +
            '</div>' +
            '</div>' +
            '<h5 class="deliver">预计发货时间：'+Dolaing.date.formatCh(goods.expectDeliverTime)+
            '&nbsp;&nbsp;|&nbsp;&nbsp;预计出货：'+goods.expectPartOutputOrder+goods.expectPartOutputUnitName+'</h5>' +
            '</li>';
    }
    return _html ;
}

/**
 * 交易记录查询
 */
BuyerCenter.findTradeRecords = function(){
    var postData = {
        pageSize:0 ,
        pageNo : 1 ,
        userId : 0
    }

    var ajaxObj = {
        url: SERVER_URL+"/dolaing/AccountRecord/queryRecordsByUser",
        data: JSON.stringify(postData),
        success: function (data) {
            if(data !=null && data.code == '1000'){
                if(data.data !=null){
                    var html = "";
                    var status = "";
                    var processType = "" ;
                   $(data.data.list).each(function(index,record){
                       if(record.status == "1"){
                           status ="已完成" ;
                       }else if(record.status == "0"){
                           status ="未完成" ;
                       }else if(record.status == "-1"){
                           status ="已取消" ;
                       }
                       if(record.processType == "1"){
                           processType ="转入" ;
                       }else if(record.processType == "2"){
                           processType ="支付" ;
                       }
                       var createDay = record.createDate.substr(0,4)+"年"+record.createDate.substr(5,2)+"月"+record.createDate.substr(8,2)+"日"
                       var createHour = record.createDate.substr(11);
                       html += '<tr>' +
                           '<td>'+createDay+'<br>'+createHour+'</td>' +
                           '<td>'+processType+'</td>' +
                           '<td>'+record.remarks+'<br>订单编号：'+record.sourceId+'</td>' +
                           '<td>'+record.amount+'</td>' +
                           '<td>'+status+'</td>' +
                           '</tr>';
                   });

                   $("#tableBody").html(html);
                   //todo
                   $("#pageView").html(Dolaing.page.view(postData.pageNo,postData.pageSize,""));
                }
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
}

/**
 * 去支付页面
 * @param id
 */
BuyerCenter.goPayHtml = function(id){
   window.location.href = "/web/pay/payComplete.html?orderId="+id;
}

BuyerCenter.goDetail = function(id){
    window.location.href = "/web/buyer/orderDetail.html?orderId="+id;
}

/**
 * 分页请求
 * @param pageNo
 */
function page(pageNo){
    BuyerCenter.page.pageNo = pageNo ;
    BuyerCenter.findRecords();
}













