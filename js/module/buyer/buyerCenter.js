var BuyerCenter = {};

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
    '<div class="" style="text-align: left;text-indent: 30px;">' +
    '产品' +
    '</div>' +
    '<div class="">' +
    '交易状态' +
    '</div>' +
    '<div class="">' +
    '价格' +
    '</div>' +
    '<div class="">' +
    '操作' +
    '</div>' +
    '</div>' +
    '</div>' +
    '' +
    '<!--订单列表-->' +
    '<ul class="orders">' +
    '' +
    '</ul>' +
    '<!--操作栏-->' +
    '<div class="operation" style="margin-top: 25px;margin-bottom: 55px;">' +
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
    '</div>';





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















