var SellerOrder = {
    page : {
        pageSize : 5 ,
        pageNo : 1
    }
};

$(function () {
    SellerOrder.infoMenus();
    SellerOrder.findRecords();
});

SellerOrder.infoMenus = function(){

}

SellerOrder.findRecords = function(){
    var postData = "?userId="+Dolaing.user.account + "&pageNo="+SellerOrder.page.pageNo +"&pageSize="+SellerOrder.page.pageSize ;
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
    SellerOrder.page.pageNo = pageNo ;
    SellerOrder.findTradeRecords();
}