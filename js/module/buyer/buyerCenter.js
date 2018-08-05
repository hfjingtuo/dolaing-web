var BuyerCenter = {
    page : {
        pageSize : 1,
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
    '<input type="checkbox" name=""  value="" class="fl"/>' +
    '<h5 class="fl">全选</h5>' +
    '<button type="button">批量收货</button>' +
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
    '<div  id="pageView" class="operation" style="margin-top: 25px;margin-bottom: 55px;">' +
    '<div class="batch fl">' +
    '<input type="checkbox" name=""  value="" class="fl"/>' +
    '<h5 class="fl">全选</h5>' +
    '<button type="button">批量收货</button>' +
    '</div>' +
    '<div class="pages fr">' +
    '<ul>' +
    '<li class="pages_last">上一页</li>' +
    '<li class="pages_cur">1</li>' +
    '<li class="pages_next">下一页</li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '';





/**
 * 获取菜单
 * @param type
 */
BuyerCenter.infoMenus = function(){
    //买家未开户
    BuyerCenter.MENU_HTML_1 = '<div class="center_left_menu">' +
        '<div class="data1">' +
        '<img src="../../img/img_goods2.jpg"/>' +
        '<h1>'+Dolaing.user.account+'</h1>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur">我的订单</li>' +
        '<li>修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out">用户退出</h2>' +
        '</div>';

    //买家订单列表
    BuyerCenter.MENU_HTML_2 = '<div class="center_left_menu">' +
        '<div class="data1">' +
        '<img src="/img/img_goods2.jpg"/>' +
        '<h1>'+Dolaing.user.account+'</h1>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur">我的订单</li>' +
        '<li>修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out">用户退出</h2>' +
        '</div>' +
        '<!--银行卡-->' +
        '<div class="bank_card">' +
        '<img src="img/img_bank_logo.png" class="fl"/>' +
        '<div class="fl bank_card1">' +
        '<h2>建设银行</h2>' +
        '<h3>尾号7890</h3>' +
        '</div>' +
        '<h3 class="fr" style="margin: 46px 20px 0 0;">已绑定</h3>' +
        '<div class="bank_card2">' +
        '<h3 class="fl">王二麻子</h3>' +
        '<h3 class="fr">18/08/01</h3>' +
        '</div>' +
        '</div>';
}





/**
 * 添加菜单
 */
BuyerCenter.addMenu = function(){

    if(Dolaing.user.payAccountFlag){
       $("#menuCenter").html(BuyerCenter.MENU_HTML_2);
    }else{
       $("#menuCenter").html(BuyerCenter.MENU_HTML_1);
    }
}

/**
 * 添加内容
 */
BuyerCenter.addContent = function(){
    if(Dolaing.user.payAccountFlag){
        $("#contentCenter").html(BuyerCenter.CONTENT_HTML_2);
        BuyerCenter.findRecords();
    }else{
        $("#contentCenter").html(BuyerCenter.CONTENT_HTML_1);
    }
}

// 跳转到开户页面
BuyerCenter.toOpenAccount = function () {
   window.location.href = "/web/member/openAccount.html?type=1" ;
}


$(function () {
    BuyerCenter.infoMenus();
    BuyerCenter.addMenu();
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


BuyerCenter.buildDataView = function(order){
    var _html ='<li>' +
        '<div class="orders_words">' +
        '<input type="checkbox" name="" id="" value="">' +
        '<h5>订单号：'+order.orderSn+'&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：'+order.createTime+'&nbsp;&nbsp;|&nbsp;&nbsp;<span>店铺：'+order.shopName+'</span></h5>' +
        '</div>' ;
    var goods = null ;
    var operate = "" ;
    for(var i =0 ; i< order.orderGoodsVos.length ; i++) {
        goods = order.orderGoodsVos[i] ;
        _html += '<div class="orders_box">' +
        '<div class="orders_box_goods" style="width: 466px;">' +
        '<img src="img/img_goods1.jpg">' +
        '<div class="fl">' +
        '<h3>' + goods.goodsName + '</h3>' +
        ' <h4>土地编号：' + goods.landSn + '</h4>' +
        '<h4>认购土地面积：' + goods.buyLandArea + goods.landPartAreaUnitName + '</h4>' +
        '</div>' +
        '</div>' +
        '<div class="orders_box_state" style="width: 125px;">' +
            '<h3>' + order.orderStatusFullName + '</h3>' +
            '<h4 class="view_detail"><a href="#">查看详情</a></h4>' +
            '</div>' +
            '<div class="orders_box_price" style="width: 161px;">' +
            '<h3 style="width: 161px;font-weight: bold;">￥' + goods.goodsAmount + '元</h3>' +
            '<h4 style="width: 161px;font-size: 12px;color: #666666;">（含运费：￥0元）</h4>' +
            '</div>' ;

        if(order.orderStatusFullCode == "1"){
            operate = '<a href="#">去付款</a>';
        }else if(order.orderStatusFullCode == "3"){
            operate = '<a href="#">确认收货</a>';
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
 * 分页请求
 * @param pageNo
 */
function page(pageNo){
    BuyerCenter.page.pageNo = pageNo ;
    BuyerCenter.findRecords();
}












