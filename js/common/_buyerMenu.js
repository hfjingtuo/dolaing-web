var BuyerCenterMenu = {}

/**
 * 获取菜单
 * @param type
 */
BuyerCenterMenu.infoMenus = function(){
    var openTime = "";
    var userNameText = "";
    var bank = "" ;
    var bankName = "";
    var bankImage = "";
    var cardNoLastFour =  "";
    if (Dolaing.user.userPayAccount != null ) {
        bank = Dolaing.center.getBank(Dolaing.user.userPayAccount.bankCode) ;
        bankName = bank == null ?"":bank.name ;
        bankImage = bank == null ?"":bank.image ;
        openTime = Dolaing.user.userPayAccount.createTime.substr(2,2)+"/"+Dolaing.user.userPayAccount.createTime.substr(5,2)+"/"+Dolaing.user.userPayAccount.createTime.substr(8,2);
        userNameText = Dolaing.user.userPayAccount.userNameText ;
        cardNoLastFour = Dolaing.user.userPayAccount.cardNoLastFour ;
    }

    //买家未开户
    BuyerCenterMenu.MENU_HTML_1 = '<div class="center_left_menu">' +
        '<div class="data1">' +
        '<img src="../../img/img_goods2.jpg"/>' +
        '<h1>'+Dolaing.user.account+'</h1>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur"  onclick="Dolaing.center.buyer.tabMenu(1)">我的订单</li>' +
        '<li  onclick="Dolaing.center.buyer.tabMenu(2)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out"onclick="Dolaing.center.buyer.tabMenu(3)">用户退出</h2>' +
        '</div>';

    //买家订单列表
    BuyerCenterMenu.MENU_HTML_2 = '<div class="center_left_menu">' +
        '<div class="data1">' +
        '<img src="/img/img_goods2.jpg"/>' +
        '<h1>'+Dolaing.user.account+'</h1>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li class="center_left_list_cur"  onclick="Dolaing.center.buyer.tabMenu(1)">我的订单</li>' +
        '<li  onclick="Dolaing.center.buyer.tabMenu(2)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out"onclick="Dolaing.center.buyer.tabMenu(3)">用户退出</h2>' +
        '</div>' +
        '<!--银行卡-->' +
        '<div class="bank_card">' +
        '<img src="'+bankImage+'" class="fl"/>' +
        '<div class="fl bank_card1">' +
        '<h2>'+bankName+'</h2>' +
        '<h3>尾号'+cardNoLastFour+'</h3>' +
        '</div>' +
        '<h3 class="fr" style="margin: 46px 20px 0 0;">已绑定</h3>' +
        '<div class="bank_card2">' +
        '<h3 class="fl">'+userNameText+'</h3>' +
        '<h3 class="fr">'+openTime+'</h3>' +
        '</div>' +
        '</div>';
}





/**
 * 添加菜单
 */
BuyerCenterMenu.addMenu = function(){
    if(Dolaing.user.userPayAccount !=null){
        $("#menuCenter").html(BuyerCenterMenu.MENU_HTML_2);
    }else{
        $("#menuCenter").html(BuyerCenterMenu.MENU_HTML_1);
    }
}

/**
 * 选择菜单
 */
BuyerCenterMenu.selectMenu = function (index) {
    $(".center_left_list li").eq(index-1).addClass("center_left_list_cur").siblings().removeClass("center_left_list_cur");
}

$(function () {
    BuyerCenterMenu.infoMenus();
    BuyerCenterMenu.addMenu();
});
