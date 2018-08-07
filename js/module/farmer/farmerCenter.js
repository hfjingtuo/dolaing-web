var FarmerCenter = {
    page : {
        pageSize : 1,
        pageNo : 1
    }
};
/**
 * 未开户
 * @type {string}
 */
FarmerCenter.CONTENT_HTML_1 = '<h1 class="center_right_tip">十分抱歉，</br>您还未设置支付方式，</br>没有订单信息。</h1>' +
    '<div class="btn_submit" style="margin-top: 60px;margin-bottom: 60px;">' +
    '<h3 onclick="FarmerCenter.toOpenAccount();">立即设置</h3>' +
    '</div>';
/**
 * 已开户的时候 显示订单记录
 * @type {string}
 */
FarmerCenter.CONTENT_HTML_2 = '<h1 class="record_title"><a href="#">首页</a>&nbsp;>&nbsp;订单列表</h1>' +
    '<table border="0" cellspacing="0" cellpadding="0" class="con grid_seller seller_list_tit">' +
    '<tr>' +
    '<td>产品</td>' +
    '<td>买家</td>' +
    '<td>交易状态</td>' +
    '<td>价格</td>' +
    '<td>操作</td>' +
    '</tr>' +
    '</table>' +
    '<ul class="con" id="orderList">' +
    '<li>' +
    '<div class="orders_words">' +
    '<input type="checkbox" name="" id="" value="" />' +
    '<h5>订单号：178526133249436583&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：2018-07-04 10:35:33</h5>' +
    '</div>' +
    '<table border="0" cellspacing="0" cellpadding="0" class="grid_seller seller_list_content">' +
    '<tr>' +
    '<td>' +
    '<img src="img/img_goods1.jpg"/>' +
    '<div class="fl">' +
    '<h3>凤山村20分0.1亩红心猕猴桃认购开放一二三四五六七八九十</h3>' +
    '<h4>土地编号：0246</h4>' +
    '<h4>认购土地面积：1亩</h4>' +
    '</div>' +
    '</td>' +
    '<td class="middle">' +
    '<h3>定金：288.00</br>未到账</h3>' +
    '<h3 style="margin-top: 10px;">尾款：288.00</br>未到账</h3>' +
    '</td>' +
    '<td class="middle">' +
    '<h3>待付款</h3>' +
    '</td>' +
    '<td class="middle">' +
    '<h3>应得金额</h3>' +
    '<h2 class="money">￥72.00</h2>' +
    '<h3>（定金比例10%）</h3>' +
    '<h3>总额：720.00</h3>' +
    '</td>' +
    '<td class="middle">' +
    '<!--<h3 class="link">发&nbsp;&nbsp;货</h3>-->' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '<h5 class="deliver">预计发货时间：2018年10月12日&nbsp;&nbsp;|&nbsp;&nbsp;预计出货：600kg</h5>' +
    '</li>' +
    '' +
    '</ul>' +
    '<div class="operation" id="pageView" style="margin-top: 25px;margin-bottom: 55px;">' +
    '<div class="pages fr">' +
    '<ul>' +
    '<li class="pages_last">上一页</li>' +
    '<li class="pages_cur">1</li>' +
    '<li class="pages_next">下一页</li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '</div>';

/**
 * 获取菜单
 * @param type
 */
FarmerCenter.infoMenus = function(){
    //买家未开户
    FarmerCenter.MENU_HTML_1 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="/img/img_goods1.jpg" class="fl">' +
        '<h2 class="fl">共荣农业合作社<br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：奔富1988</h3>' +
        '<h3>经营范围：果蔬种植销售</h3>' +
        '<h3>所在地区：贵州省 清镇市</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur">订单列表</li>' +
        '<li>修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out">用户退出</h2>' +
        '</div>';

    //买家订单列表
    FarmerCenter.MENU_HTML_2 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="img/img_goods1.jpg" class="fl">' +
        '<h2 class="fl">共荣农业合作社<br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：奔富1988</h3>' +
        '<h3>经营范围：果蔬种植销售</h3>' +
        '<h3>所在地区：贵州省 清镇市</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur">订单列表</li>' +
        '<li>修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out">用户退出</h2>' +
        '</div>' +
        '<!--银行卡-->' +
        '<div class="bank_card">' +
        '<img src="img/img_bank_logo.png" class="fl">' +
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
FarmerCenter.addMenu = function(){

    if(Dolaing.user.payAccountFlag){
        $("#menuCenter").html(FarmerCenter.MENU_HTML_2);
    }else{
        $("#menuCenter").html(FarmerCenter.MENU_HTML_1);
    }
}

/**
 * 添加内容
 */
FarmerCenter.addContent = function(){
    if(Dolaing.user.payAccountFlag){
        $("#contentCenter").html(FarmerCenter.CONTENT_HTML_2);
    }else{
        $("#contentCenter").html(FarmerCenter.CONTENT_HTML_1);
    }
}

// 跳转到开户页面
FarmerCenter.toOpenAccount = function () {
    $("#")
    window.location.href = "/web/member/openAccount.html?type=3" ;
}


$(function () {
    FarmerCenter.infoMenus();
    FarmerCenter.addMenu();
    FarmerCenter.addContent();
    FarmerCenter.findRecords();
});



/**
 * 买家订单记录查询
 */
FarmerCenter.findRecords = function(){
    var postData = "?userId="+Dolaing.user.account + "&pageNo="+FarmerCenter.page.pageNo +"&pageSize="+FarmerCenter.page.pageSize ;
    var ajaxObj = {
        url: SERVER_URL+"/orderRecord/queryRecordsByUser"+postData,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                if(data.data !=null){
                    var _html = "";
                    $(data.data.records).each(function(index,record){
                        _html += FarmerCenter.buildDataView(record);
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


FarmerCenter.buildDataView = function(order){
    var _html ='<li>' +
        '                <div class="orders_words">' +
        '                    <input type="checkbox" name=""  value="" />' +
        '                    <h5>订单号：'+order.orderSn+'&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：'+order.createTime+'&nbsp;&nbsp;</h5>' +
        '                </div>' ;
    var goods = null ;
    var dStatus = "" ;//定金收款状态
    var wStatus = "" ;//尾款收款状态
    for(var i =0 ; i< order.orderGoodsVos.length ; i++){
        goods = order.orderGoodsVos[i] ;
        if(order.farmerReceiveStatus == 0){
            dStatus = "未到账" ;
            wStatus =  "未到账" ;
        }else if(order.farmerReceiveStatus == 1){
            dStatus = "到账中" ;
            wStatus =  "未到账" ;
        }else if(order.farmerReceiveStatus == 2){
            dStatus = "已到账" ;
            wStatus =  "未到账" ;
        }else if(order.farmerReceiveStatus == 3){
            dStatus = "已到账" ;
            wStatus =  "到账中" ;
        }else if(order.farmerReceiveStatus == 4){
            dStatus = "已到账" ;
            wStatus =  "已到账" ;
        }

        _html += '  <table border="0" cellspacing="0" cellpadding="0" class="grid_seller seller_list_content">' +
            '                    <tr>' +
            '                        <td>' +
            '                            <img src="img/img_goods1.jpg"/>' +
            '                            <div class="fl">' +
            '                                <h3>'+goods.goodsName+'</h3>' +
            '                                <h4>土地编号：'+goods.landSn+'</h4>' +
            '                                <h4>认购土地面积：'+goods.buyLandArea+goods.landPartAreaUnitName+'</h4>' +
            '                            </div>' +
            '                        </td>' +
            '<td class="middle">' +
            '<h3>定金：'+goods.depositPayment+'<br>'+dStatus+'</h3>' +
            '<h3 style="margin-top: 10px;">尾款：'+goods.balancePayment+'<br>'+wStatus+'</h3>' +
            '</td>' +
            '                        <td class="middle">' +
            '                            <h3>'+order.orderStatusFullName+'</h3>' +
            '                        </td>' +
            '                        <td class="middle">' +
            '                            <h3>应得金额</h3>' +
            '                            <h2 class="money">￥'+order.farmerReceivableAmount+'</h2>' +
            '                            <h3>（定金比例'+goods.depositRatioLabel+'）</h3>' +
            '                            <h3>总额：'+goods.goodsAmount+'</h3>' +
            '                        </td>' ;
        if(order.orderStatusFullCode == "2"){
            _html += ' <td class="middle">' +
                ' <h3 class="link">发&nbsp;&nbsp;货</h3>' +
                '</td>' ;
        }else{
            _html += ' <td class="middle"></td>' ;
        }
        _html += '</tr>' +
            '                </table>' +
            '                <h5 class="deliver">预计发货时间：'+Dolaing.date.formatCh(goods.expectDeliverTime)
            +'&nbsp;&nbsp;|&nbsp;&nbsp;预计出货：'+goods.expectPartOutputOrder+goods.expectPartOutputUnitName+'</h5>' ;
    }
    _html +='</li>' ;
    return _html ;
}

// FarmerCenter.findTradeRecords = function(){
//     var postData = {
//         pageSize:0 ,
//         pageNo : 1 ,
//         userId : 0
//     }
//
//     var ajaxObj = {
//         url: SERVER_URL+"/dolaing/AccountRecord/queryRecordsByUser",
//         data: JSON.stringify(postData),
//         success: function (data) {
//             if(data !=null && data.code == '1000'){
//                 if(data.data !=null){
//                     var html = "";
//                     var status = "";
//                     var processType = "" ;
//                     $(data.data.list).each(function(index,record){
//                         if(record.status == "1"){
//                             status ="已完成" ;
//                         }else if(record.status == "0"){
//                             status ="未完成" ;
//                         }else if(record.status == "-1"){
//                             status ="已取消" ;
//                         }
//                         if(record.processType == "1"){
//                             processType ="转入" ;
//                         }else if(record.processType == "2"){
//                             processType ="支付" ;
//                         }
//                         var createDay = record.createDate.substr(0,4)+"年"+record.createDate.substr(5,2)+"月"+record.createDate.substr(8,2)+"日"
//                         var createHour = record.createDate.substr(11);
//                         html += '<tr>' +
//                             '<td>'+createDay+'<br>'+createHour+'</td>' +
//                             '<td>'+processType+'</td>' +
//                             '<td>'+record.remarks+'<br>订单编号：'+record.sourceId+'</td>' +
//                             '<td>'+record.amount+'</td>' +
//                             '<td>'+status+'</td>' +
//                             '</tr>';
//                     });
//
//                     $("#tableBody").html(html);
//                     //todo
//                     $("#pageView").html(Dolaing.page.view(postData.pageNo,postData.pageSize,""));
//                 }
//             }else{
//                 layer.alert(data.msg, {
//                     icon: 0
//                 });
//             }
//         }
//     }
// }
//

/**
 * 分页请求
 * @param pageNo
 */
function page(pageNo){
    FarmerCenter.page.pageNo = pageNo ;
    FarmerCenter.findRecords();
}





