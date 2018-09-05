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
    '</tbody>' +
    '</table>' +
    '<!--操作栏-->' +
    '<div class="operation" style="margin-top: 25px;margin-bottom: 55px;">' +
    '<div class="pages fr" id="pageView">' +
    '</div>' +
    '</div>';



/**
 * 添加内容
 */
SellerCenter.addContent = function(){
    if(Dolaing.user.userPayAccount !=null){
        $("#contentCenter").html(SellerCenter.CONTENT_HTML_2);
        SellerCenter.findTradeRecords();
    }else{
        $("#contentCenter").html(SellerCenter.CONTENT_HTML_1);
    }
}

// 跳转到开户页面
SellerCenter.toOpenAccount = function () {
    window.location.href = "/web/member/openAccount.html?type=1" ;
}


$(function () {
    SellCenterMenu.selectMenu(1);
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
                            processType ="转入" ;
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
                    console.log("当前页"+data.data.current +" 总页数:"+data.data.pages +" 总数："+data.data.total);
                    if(data.data.records == null || data.data.records.length == 0 ){
                        html += '<tr><td colspan="5">无数据</td></tr>';
                        $("#pageView").html("");
                    }else{
                        $("#pageView").html(Dolaing.page.view(data.data.current,data.data.pages,data.data.total));
                    }

                    $("#tableBody").html(html);
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