var SellCenterMenu = {}
/**
 * 获取菜单
 * @param type
 */
SellCenterMenu.infoMenus = function(){
    var openTime = "";
    var userNameText = "";
    var bank = "" ;
    var bankName = "";
    var bankImage = "";
    var cardNoLastFour =  "";
    var shopName = "";
    var brandName = "";
    var businessScope = "";
    var address = "" ;
    if (Dolaing.user.userPayAccount != null  && Dolaing.user.userPayAccount != "" ) {
        bank = Dolaing.center.getBank(Dolaing.user.userPayAccount.bankCode) ;
        bankName = bank == null ?"":bank.name ;
        bankImage = bank == null ?"":bank.image ;
        openTime = Dolaing.user.userPayAccount.createTime.substr(2,2)+"/"+Dolaing.user.userPayAccount.createTime.substr(5,2)+"/"+Dolaing.user.userPayAccount.createTime.substr(8,2);
        userNameText = Dolaing.user.userPayAccount.userNameText ;
        cardNoLastFour = Dolaing.user.userPayAccount.cardNoLastFour ;
    }
    if(Dolaing.user.mallShopVo != null && Dolaing.user.mallShopVo != "" ){
        shopName = Dolaing.user.mallShopVo.shopName;
        brandName = Dolaing.user.mallShopVo.brandName;
        businessScope = Dolaing.user.mallShopVo.businessScope;
        address = Dolaing.user.mallShopVo.provinceLabel +" " + Dolaing.user.mallShopVo.cityLabel;
    }


    //买家未开户
    SellCenterMenu.MENU_HTML_1 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="/img/head.jpg" class="fl"/>' +
        '<h2 class="fl">'+shopName+'</br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：'+brandName+'</h3>' +
        '<h3>经营范围：'+businessScope+'</h3>' +
        '<h3>所在地区：'+address+'</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li  onclick="Dolaing.center.seller.tabMenu(1)">交易记录</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(2)">发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(3)">已发布产品</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(4)">订单列表</li>' +
        '<li  onclick="Dolaing.center.seller.tabMenu(5)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out" onclick="goLogout();">用户退出</h2>' +
        '</div>';

    SellCenterMenu.MENU_HTML_2 = '<div class="center_left_menu">' +
        '<div class="data2">' +
        '<div>' +
        '<img src="/img/head.jpg" class="fl"/>' +
        '<h2 class="fl">'+shopName+'</br><span>好评率98%</span></h2>' +
        '</div>' +
        '<h3>品牌名称：'+brandName+'</h3>' +
        '<h3>经营范围：'+businessScope+'</h3>' +
        '<h3>所在地区：'+address+'</h3>' +
        '</div>' +
        '<ul class="center_left_list">' +
        '<li  onclick="Dolaing.center.seller.tabMenu(1)">交易记录</li>' +
        '<li onclick="Dolaing.center.seller.tabMenu(2)">发布产品</li>' +
        '<li onclick="Dolaing.center.seller.tabMenu(3)">已发布产品</li>' +
        '<li onclick="Dolaing.center.seller.tabMenu(4)">订单列表</li>' +
        '<li onclick="Dolaing.center.seller.tabMenu(5)">修改密码</li>' +
        '</ul>' +
        '<h2 class="center_out" onclick="goLogout();">用户退出</h2>' +
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
SellCenterMenu.addMenu = function(){
    if(Dolaing.user.userPayAccount !=null  && Dolaing.user.userPayAccount != "" ){
        $("#menuCenter").html(SellCenterMenu.MENU_HTML_2);
    }else{
        $("#menuCenter").html(SellCenterMenu.MENU_HTML_1);
    }
}

/**
 * 选择菜单
 */
SellCenterMenu.selectMenu = function (index) {
   $(".center_left_list li").eq(index-1).addClass("center_left_list_cur").siblings().removeClass("center_left_list_cur");
}

$(function () {
    SellCenterMenu.infoMenus();
    SellCenterMenu.addMenu();
});
