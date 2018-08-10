var OrderDetail = {} ;
$(function () {
    debugger;
    BuyerCenterMenu.selectMenu(1);
    OrderDetail.orderId = $.query.get("orderId");
    OrderDetail.getOrderDetail1(OrderDetail.orderId);
});


OrderDetail.getOrderDetail1 = function(orderId) {
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/detail?orderId="+orderId ,
        type : "get",
        success: function (data) {
            if(data !=null && data.code == '1000'){
                var orderDetailHtml = OrderDetail.buildOrderDetailHtml(data.data.orderInfoVo, data.data.userAccountRecord);
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
 * @param orderInfoVo
 * @param goodsInfo
 */
OrderDetail.buildOrderDetailHtml = function (orderInfoVo, userAccountRecord) {
   if(orderInfoVo.orderStatusFullCode == "1"){
       $("#detailContent").html(OrderDetail.buildStatus1(orderInfoVo, userAccountRecord));
   }else if(orderInfoVo.orderStatusFullCode == "2"){
       $("#detailContent").html(OrderDetail.buildStatus2(orderInfoVo, userAccountRecord));
   }else if(orderInfoVo.orderStatusFullCode == "3"){
       $("#detailContent").html(OrderDetail.buildStatus3(orderInfoVo, userAccountRecord));
   }else if(orderInfoVo.orderStatusFullCode == "100"){
       $("#detailContent").html(OrderDetail.buildStatus100(orderInfoVo, userAccountRecord));
   }
}



OrderDetail.buildStatus1 = function(orderInfoVo, userAccountRecord){
    var farmer  = orderInfoVo.orderGoodsVos[0].farmerId;
    var _html = '<div class="order_line" style="width: 550px;margin: 40px 150px 25px;">' +
        '<ul class="order_line2">' +
        '<li><img src="/img/icon_point_1-2.png"></li>' +
        '</ul>' +
        '<ul class="order_line1">' +
        '<li>' +
        '<h3>确认订单</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>2018 07 07<br>23:22:55</h4>' +
        '</li>' +
        '<li>' +
        '<h3>付款</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '<li>' +
        '<h3>完成发货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '<li>' +
        '<h3>确认发货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '</ul>' +
        '<img src="/img/img_grey_line.png" class="bg_grey_line" style="width: 460px;">' +
        '</div>' +
        '<!--详情-->' +
        '<div class="details">' +
        '<img src="/img/img_color_line.png">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_1.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>订单当前状态：<span>待付款</span></h3>' +
        '<h3>订单编号：'+orderInfoVo.orderSn+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '下单时间：'+orderInfoVo.createTime+'</h3>' +
        '<h3>距离认购结束还有：约56天23小时38分钟09秒</h3>' +
        '<h3>应付金额：￥<span>'+orderInfoVo.buyerOrderAmount+'</span></h3>' +
        '<h3>农户ID：'+farmer+'</h3>' +
        '</div>' +
        '<div class=" btn_order" onclick="OrderDetail.goPayHtml(\''+orderInfoVo.id+'\')">' +
        '<h3>去付款</h3>' +
        '</div>' +
        '</div>' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_2.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>收货人：'+orderInfoVo.consignee+'</h3>' +
        '<h3>联系电话：'+orderInfoVo.mobile+'</h3>' +
        '<h3>收货地址：'+orderInfoVo.fullAddress+'</h3>' +
        '</div>' +
        '</div>' +
        '</div>';
    return _html ;
}

OrderDetail.buildStatus2 = function(orderInfoVo, userAccountRecord){
    var farmer  = orderInfoVo.orderGoodsVos[0].farmerId;
    var _html = '<div class="order_line" style="width: 550px;margin: 40px 150px 25px;">' +
        '<ul class="order_line2">' +
        '<li><img src="/img/icon_point_1.png"></li>' +
        '<li><img src="/img/icon_point_2-2.png"></li>' +
        '</ul>' +
        '<ul class="order_line1">' +
        '<li>' +
        '<h3>确认订单</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.createTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>付款</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.paidTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>完成发货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '<li>' +
        '<h3>确认收货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '</ul>' +
        '<img src="/img/img_grey_line.png" class="bg_grey_line" style="width: 460px;">' +
        '</div>'+
        '<div class="details">' +
        '<img src="/img/img_color_line.png">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_1.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>订单当前状态：<span>生产中</span></h3>' +
        '<h3>订单编号：'+orderInfoVo.orderSn+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '下单时间：'+orderInfoVo.createTime+'</h3>' +
        '<h3>付款时间：'+orderInfoVo.paidTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>' +
         //距离发货日期：约56天23小时38分钟09秒 <h3>距离发货日期：约56天23小时38分钟09秒</h3>
        '<h3>实付金额：￥<span>'+orderInfoVo.buyerMoneyPaid+'</span></h3>' +
        '<h3>农户ID：'+farmer+'</h3>' +
        '</div>' +
        '</div>' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_2.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>收货人：'+orderInfoVo.consignee+'</h3>' +
        '<h3>联系电话：'+orderInfoVo.mobile+'</h3>' +
        '<h3>收货地址：'+orderInfoVo.fullAddress+'</h3>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="details">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_3.png" class="fl" style="margin-top: 30px;">' +
        '<div class="fl details_part_list">' +
        '<h3>付款方式：证联支付</h3>' +
        '<h3>付款时间：'+(userAccountRecord == null ? '--' :userAccountRecord.createTime )+'</h3>' +
        '<h3>到账时间：'+(userAccountRecord == null ? '--' :userAccountRecord.updateTime )+'</h3>' +
        '<h3>证联交易号：'+(userAccountRecord == null ? '--' :userAccountRecord.seqId)+'</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+(userAccountRecord == null ? '--' :userAccountRecord.amount)+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">全款</span></h1>' +
        '</div>' +
        '<div class="details_part">' +
        '<div class="fl details_part_list" style="margin-left: 90px;margin-top: 27px;">' +
        '<h3>含运费（0元）</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money" style="margin-top: 20px;">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+orderInfoVo.goodsAmount+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">总计</span>' +
        '</h1>' +
        '</div>' +
        '</div>' ;

    return _html ;

}


OrderDetail.buildStatus3 = function(orderInfoVo, userAccountRecord){
    var farmer  = orderInfoVo.orderGoodsVos[0].farmerId;
    var _html = '<div class="order_line" style="width: 550px;margin: 40px 150px 25px;">' +
        '<ul class="order_line2">' +
        '<li><img src="/img/icon_point_1.png"></li>' +
        '<li><img src="/img/icon_point_2.png"></li>' +
        '<li><img src="/img/icon_point_3-2.png"></li>' +
        '</ul>' +
        '<ul class="order_line1">' +
        '<li>' +
        '<h3>确认订单</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.createTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>付款</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.paidTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>完成发货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.deliveredTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>确认收货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '</li>' +
        '</ul>' +
        '<img src="/img/img_grey_line.png" class="bg_grey_line" style="width: 460px;">' +
        '</div>'+
        '<div class="details">' +
        '<img src="/img/img_color_line.png">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_1.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>订单当前状态：<span>待收货</span></h3>' +
        '<h3>订单编号：'+orderInfoVo.orderSn+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '下单时间：'+orderInfoVo.createTime+'</h3>' +
        '<h3>付款时间：'+orderInfoVo.paidTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '发货时间：'+orderInfoVo.deliveredTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '</h3>' +
        '<h3>实付金额：￥<span>'+orderInfoVo.buyerMoneyPaid+'</span></h3>' +
        '<h3>农户ID：'+farmer+'</h3>' +
        '</div>' +
        '<div class=" btn_order" onclick="OrderDetail.receive(\''+orderInfoVo.id+'\')">' +
        '<h3>确认收货</h3>' +
        '</div>'+
        '</div>' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_2.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>收货人：'+orderInfoVo.consignee+'</h3>' +
        '<h3>联系电话：'+orderInfoVo.mobile+'</h3>' +
        '<h3>收货地址：'+orderInfoVo.fullAddress+'</h3>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="details">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_3.png" class="fl" style="margin-top: 30px;">' +
        '<div class="fl details_part_list">' +
        '<h3>付款方式：证联支付</h3>' +
        '<h3>付款时间：'+(userAccountRecord == null ? '--' :userAccountRecord.createTime )+'</h3>' +
        '<h3>到账时间：'+(userAccountRecord == null ? '--' :userAccountRecord.updateTime )+'</h3>' +
        '<h3>证联交易号：'+(userAccountRecord == null ? '--' :userAccountRecord.seqId)+'</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+(userAccountRecord == null ? '--' :userAccountRecord.amount)+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">全款</span></h1>' +
        '</div>' +
        '<div class="details_part">' +
        '<div class="fl details_part_list" style="margin-left: 90px;margin-top: 27px;">' +
        '<h3>含运费（0元）</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money" style="margin-top: 20px;">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+orderInfoVo.goodsAmount+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">总计</span>' +
        '</h1>' +
        '</div>' +
        '</div>' ;

    return _html ;

}

OrderDetail.buildStatus100 = function(orderInfoVo, userAccountRecord){
    var farmer  = orderInfoVo.orderGoodsVos[0].farmerId;
    var _html = '<div class="order_line" style="width: 550px;margin: 40px 150px 25px;">' +
        '<ul class="order_line2">' +
        '<li><img src="/img/icon_point_1.png"></li>' +
        '<li><img src="/img/icon_point_2.png"></li>' +
        '<li><img src="/img/icon_point_3.png"></li>' +
        '<li><img src="/img/icon_point_4-2.png"></li>' +
        '</ul>' +
        '<ul class="order_line1">' +
        '<li>' +
        '<h3>确认订单</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.createTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>付款</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.paidTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>完成发货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.deliveredTime)+'</h4>' +
        '</li>' +
        '<li>' +
        '<h3>确认收货</h3>' +
        '<img src="/img/icon_point_default.png">' +
        '<h4>'+splitTime(orderInfoVo.receivedTime)+'</h4>' +
        '</li>' +
        '</ul>' +
        '<img src="/img/img_grey_line.png" class="bg_grey_line" style="width: 460px;">' +
        '</div>'+
        '<div class="details">' +
        '<img src="/img/img_color_line.png">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_1.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>订单当前状态：<span style="color: #333333;">已完成</span></h3>' +
        '<h3>订单编号：'+orderInfoVo.orderSn+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '下单时间：'+orderInfoVo.createTime+'</h3>' +
        '<h3>付款时间：'+orderInfoVo.paidTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '发货时间：'+orderInfoVo.deliveredTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '收货时间：' +orderInfoVo.receivedTime+
        '</h3>' +
        '<h3>完成时间：'+orderInfoVo.receivedTime+'</h3>' +
        '<h3>实付金额：￥<span>'+orderInfoVo.buyerMoneyPaid+'</span></h3>' +
        '<h3>农户ID：'+farmer+'</h3>' +
        '</div>' +
        '</div>' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_2.png" class="fl">' +
        '<div class="fl details_part_list">' +
        '<h3>收货人：'+orderInfoVo.consignee+'</h3>' +
        '<h3>联系电话：'+orderInfoVo.mobile+'</h3>' +
        '<h3>收货地址：'+orderInfoVo.fullAddress+'</h3>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="details">' +
        '<div class="details_part">' +
        '<img src="/img/icon_order_details_3.png" class="fl" style="margin-top: 30px;">' +
        '<div class="fl details_part_list">' +
        '<h3>付款方式：证联支付</h3>' +
        '<h3>付款时间：'+(userAccountRecord == null ? '--' :userAccountRecord.createTime )+'</h3>' +
        '<h3>到账时间：'+(userAccountRecord == null ? '--' :userAccountRecord.updateTime )+'</h3>' +
        '<h3>证联交易号：'+(userAccountRecord == null ? '--' :userAccountRecord.seqId)+'</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+(userAccountRecord == null ? '--' :userAccountRecord.amount)+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">全款</span></h1>' +
        '</div>' +
        '<div class="details_part">' +
        '<div class="fl details_part_list" style="margin-left: 90px;margin-top: 27px;">' +
        '<h3>含运费（0元）</h3>' +
        '</div>' +
        '<h1 class="fr details_part_money" style="margin-top: 20px;">￥' +
        '<span style="color: #F76096;font-weight: bold;font-size: 18px;">'+orderInfoVo.goodsAmount+'</span>' +
        '<br><span style="color: #F76096;margin-right: 4px;">总计</span>' +
        '</h1>' +
        '</div>' +
        '</div>' ;

    return _html ;

}



/**
 * 收货
 */
OrderDetail.receive = function (id){
    if(id == null || id == ""){
        layer.alert("收货失败");
        return false ;
    }
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/batchReceive?ids="+id ,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                layer.alert("已完成收货");
                window.location.reload();
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}


OrderDetail.goPayHtml = function(id){
 window.location.href = "/web/pay/payComplete.html?orderId="+id;
}
