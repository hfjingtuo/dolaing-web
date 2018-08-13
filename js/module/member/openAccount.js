var Account ={
    data : {
        custType : 0 ,     //开户类型 0 为个人  1为企业
        userNameText : null,
        certType : null ,
        certId : null ,
        orgId : null,
        bankCode : null ,
        cardNo : null ,
        mobile : null ,
        payPassWord : null
    }
}


/**
 * 开户
 */
Account.register = function(){
    Account.buildData();
    if(!Account.validate()){
        return false ;
    }

    if(Account.data.payPassWord.trim().length < 6){
        layer.alert("支付密码不允许小于6位");
        return false ;
    }
    if(Account.data.payPassWord.trim() !=Account.data.confirmPayPassWord ){
        layer.alert("密码不一致");
        return false ;
    }
    if(Account.data.identifyingCode == null || Account.data.identifyingCode.trim() ==  ""){
        layer.alert("请输入验证码");
        return false ;
    }
    //验证是否读过了协议
    if(!$("#readAgreement").prop('checked')){
        layer.alert("请先阅读dolaing用户协议");
        return false ;
    }
    var ajaxObj = {
        url: SERVER_URL+"/payAccount/marginRegister",
        data: JSON.stringify(Account.data),
        success: function (data) {
            if(data !=null && data.code == '1000'){
                layer.alert('开户成功');
                $.cookie('userPayAccount', JSON.stringify(data.data.userPayAccount),{ path: '/'});
                setTimeout(function() {
                    window.location.href = Dolaing.center.getUrl();
                }, 1500);
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
 * 验证码获取
 */
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
/**
 * 开户短信下发
 * @returns {boolean}
 */
Account.marginRegisterSms = function(){
    Account.buildData();
    if(!Account.validate()){
       return false ;
    }
    console.log("账户数据--->"+Account.data);
    var ajaxObj = {
        timeout: 10000,
        url: SERVER_URL+"/payAccount/marginRegisterSms",
        data : JSON.stringify(Account.data),
        success: function (data) {
            if(data !=null && data.code == '1000'){
                $(".btnSendCode").attr("disabled", "disabled");
                $(".btnSendCode").css("color", "red");
                curCount = 60 ;
                $(".btnSendCode").html("等待"+curCount + "秒");
                InterValObj = window.setInterval(SetRemainTime, 1000);
                layer.alert("已发送短信息", {
                    icon: 1
                });
                // $("#smsButton").removeClass("btn-primary").addClass("btn-default");
                // $("#smsButton").attr("disabled",true);
                // setTimeout(function() {
                //     $("#smsButton").removeClass("btn-default").removeClass("active").addClass("btn-primary");
                //     $('#smsButton').removeAttr("disabled");
                // }, 60000);
            }else{
                layer.alert(data.msg, {
                    icon: 0
                });
            }
        }
    }
    ajaxData(ajaxObj);
}

function SetRemainTime(){
    if (curCount == 0) {
        window.clearInterval(InterValObj);
        $(".btnSendCode").removeAttr("disabled");
        $(".btnSendCode").css("color", "");
        $(".btnSendCode").html("获取验证码");
    } else {
        curCount--;
        $(".btnSendCode").html("等待"+curCount + "秒");
    }
}


Account.tab = function(id){
    if(id=="companyTab"){
        Account.data.custType = 1 ;
        $("#companyTab").addClass("center_set_tab_cur");
        $("#personTab").removeClass("center_set_tab_cur");
        $("#personForm").hide();
        $("#companyForm").show();
    }else{
        Account.data.custType = 0 ;
        $("#personTab").addClass("center_set_tab_cur");
        $("#companyTab").removeClass("center_set_tab_cur");
        $("#companyForm").hide();
        $("#personForm").show();
    }
}

Account.buildData = function(){
    Account.data.confirmPayPassWord = null ;
    //个人
    if(Account.data.custType == 0){
        Account.data.userNameText = $("#personForm input[name='userNameText']").val() ;
        Account.data.certType = $("#personForm input[name='certType']").val() ;
        Account.data.certId = $("#personForm input[name='certId']").val() ;
        Account.data.orgId = null ;
        Account.data.bankCode = $("#personForm select[name='bankCode']").val() ;
        Account.data.cardNo = $("#personForm input[name='cardNo']").val() ;
        Account.data.mobile = $("#personForm input[name='mobile']").val() ;
        Account.data.payPassWord = $("#personForm input[name='payPassWord']").val() ;
        Account.data.confirmPayPassWord = $("#personForm input[name='confirmPayPassWord']").val() ;
        Account.data.identifyingCode = $("#personForm input[name='identifyingCode']").val() ;
    }else if(Account.data.custType == 1){
        Account.data.userNameText = $("#companyForm input[name='userNameText']").val() ;
        Account.data.certType = $("#companyForm select[name='certType']").val() ;
        Account.data.certId = $("#companyForm input[name='certId']").val() ;
        Account.data.orgId = $("#companyForm input[name='orgId']").val() ;
        Account.data.bankCode = $("#companyForm select[name='bankCode']").val() ;
        Account.data.cardNo = $("#companyForm input[name='cardNo']").val() ;
        Account.data.mobile = $("#companyForm input[name='mobile']").val() ;
        Account.data.payPassWord = $("#companyForm input[name='payPassWord']").val() ;
        Account.data.confirmPayPassWord = $("#companyForm input[name='confirmPayPassWord']").val() ;
        Account.data.identifyingCode = $("#companyForm input[name='identifyingCode']").val() ;
    }
}

/**
 * 数据验证
 */
Account.validate = function () {
    var validateFlag = true ;
    //个人
    if(Account.data.custType == 0){
        validateFlag = Dolaing.validate.checkBlank(
            [
                {name:"真实姓名",value:Account.data.userNameText},
                {name:"证件号码",value:Account.data.certId},
                {name:"银行卡号",value:Account.data.cardNo},
                {name:"手机号",value:Account.data.mobile},
                {name:"支付密码",value:Account.data.payPassWord}
            ]
        );
        if(!validateFlag){
           return validateFlag ;
        }
        validateFlag = Dolaing.validate.checkBlank(
            [
                {name:"所属银行",value:Account.data.bankCode}
            ] ,"请选择"
        );
    }else if(Account.data.custType == 1){
        validateFlag = Dolaing.validate.checkBlank(
            [
                {name:"真实姓名",value:Account.data.userNameText},
                {name:"证件号码",value:Account.data.certId},
                {name:"组织机构",value:Account.data.orgId},
                {name:"银行卡号",value:Account.data.cardNo},
                {name:"手机号",value:Account.data.mobile},
                {name:"支付密码",value:Account.data.payPassWord}
            ]
        );
        if(!validateFlag){
            return validateFlag ;
        }
        validateFlag = Dolaing.validate.checkBlank(
            [
                {name:"所属银行",value:Account.data.bankCode},
                {name:"证件类型",value:Account.data.certType}
            ] ,"请选择"
        );
    }
    return validateFlag ;
}


Account.checkPayPassword = function(){
    //个人
    if(Account.data.custType == 0){
        Account.data.payPassWord = $("#personForm input[name='payPassWord']").val() ;
        Account.data.confirmPayPassWord = $("#personForm input[name='confirmPayPassWord']").val() ;
    }else{
        Account.data.payPassWord = $("#companyForm input[name='payPassWord']").val() ;
        Account.data.confirmPayPassWord = $("#companyForm input[name='confirmPayPassWord']").val() ;
    }
    if(Account.data.confirmPayPassWord !="" && Account.data.payPassWord != Account.data.confirmPayPassWord){
        layer.alert("密码不一致，请输入一致的密码");
    }
}


$(function () {
    var type = Dolaing.getParameter("type");
    if(type == "3"){ //如果是农户则只有个人
      $("#companyTab").remove();
      $("#companyForm").remove();
      $("#personTab").unbind();
    }else{
       $("#companyTab").show();
    }
});
