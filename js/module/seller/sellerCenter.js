var SellerCenter = {
    page : {
        pageSize : 5 ,
        pageNo : 1
    }
};

/**
 * 未开户
 * @type {string}
 */
SellerCenter.CONTENT_HTML_1 = '<h1 class="center_right_tip">十分抱歉，</br>您还未设置支付方式，</br>没有订单信息。</h1>' +
    '<div class="btn_submit" style="margin-top: 60px;margin-bottom: 60px;">' +
    '<h3 onclick="SellerCenter.toOpenAccount();">立即设置</h3>' +
    '</div>';
/**
 * 已开户的时候 显示订单记录
 * @type {string}
 */
SellerCenter.CONTENT_HTML_2 ='<h1 class="record_title">交易记录</h1>' +
    '<table border="0" cellspacing="0" cellpadding="0" class="record">' +
    '<thead>' +
    '<tr>' +
    '<th>日期</th>' +
    '<th>交易类型</th>' +
    '<th>交易内容</th>' +
    '<th>金额</th>' +
    '<th>交易状态</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody id="tableBody">' +
    '<tr>' +
    '<td>2018年07月23日</br>03:26:30</td>' +
    '<td>转入</td>' +
    '<td>由平台转入定金</br>订单编号：975663746128473</td>' +
    '<td>300.00</td>' +
    '<td>交易成功</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '<!--操作栏-->' +
    '<div class="operation" id="pageView" style="margin-top: 25px;margin-bottom: 55px;">' +
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
SellerCenter.infoMenus = function(){
    //买家未开户
    SellerCenter.MENU_HTML_1 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="/img/img_goods1.jpg" class="fl"/>' +
        '<h2 class="fl">共荣农业合作社</br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：奔富1988</h3>' +
        '<h3>经营范围：果蔬种植销售</h3>' +
        '<h3>所在地区：贵州省 清镇市</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur" onclick="Dolaing.center.seller.tabMenu(1)">交易记录</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(2)">发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(3)">已发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(4)">订单列表</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(5)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out" onclick="goLogout();">用户退出</h2>' +
        '</div>';

    SellerCenter.MENU_HTML_2 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="/img/img_goods1.jpg" class="fl"/>' +
        '<h2 class="fl">共荣农业合作社</br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：奔富1988</h3>' +
        '<h3>经营范围：果蔬种植销售</h3>' +
        '<h3>所在地区：贵州省 清镇市</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur" onclick="Dolaing.center.seller.tabMenu(1)">交易记录</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(2)">发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(3)">已发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(4)">订单列表</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(5)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out" onclick="goLogout();">用户退出</h2>' +
        '</div>' +
        '<!--银行卡-->' +
        '<div class="bank_card">' +
        '<img src="/img/img_bank_logo.png" class="fl"/>' +
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
SellerCenter.addMenu = function(){

    if(Dolaing.user.payAccountFlag){
        $("#menuCenter").html(SellerCenter.MENU_HTML_2);
    }else{
        $("#menuCenter").html(SellerCenter.MENU_HTML_1);
    }
}

/**
 * 添加内容
 */
SellerCenter.addContent = function(){
    if(Dolaing.user.payAccountFlag){
        $("#contentCenter").html(SellerCenter.CONTENT_HTML_2);
        SellerCenter.findTradeRecords();
    }else{
        $("#contentCenter").html(SellerCenter.CONTENT_HTML_1);
    }
}

// 跳转到开户页面
SellerCenter.toOpenAccount = function () {
    $("#")
    window.location.href = "/web/member/openAccount.html?type=1&name=张" ;
}


$(function () {
    SellerCenter.infoMenus();
    SellerCenter.addMenu();
    SellerCenter.addContent();
});

SellerCenter.findTradeRecords = function(){
    var postData = "?userId="+Dolaing.user.account + "&pageNo="+SellerCenter.page.pageNo +"&pageSize="+SellerCenter.page.pageSize ;
    var ajaxObj = {
        url: SERVER_URL+"/accountRecord/queryRecordsByUser"+postData,
        success: function (data) {
            if(data !=null && data.code == '1000'){
                if(data.data !=null){
                    var html = "";
                    var status = "";
                    var processType = "" ;
                    $(data.data.records).each(function(index,record){
                        if(record.status == "1"){
                            status ="交易完成" ;
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
                        var createDay = record.createTime.substr(0,4)+"年"+record.createTime.substr(5,2)+"月"+record.createTime.substr(8,2)+"日"
                        var createHour = record.createTime.substr(11);
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
                    console.log("当前页"+data.data.current +" 总页数:"+data.data.pages +" 总数："+data.data.total);
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

/**
 * 分页请求
 * @param pageNo
 */
function page(pageNo){
    SellerCenter.page.pageNo = pageNo ;
    SellerCenter.findTradeRecords();
}