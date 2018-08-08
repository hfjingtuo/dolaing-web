$(document).ready(function(){
    Dolaing.view.info();
    var myorder = $(".enter_myorders");
    myorder.click(function(){
        if(Dolaing.user == null || Dolaing.user.type == null ){
             window.location.href ="/login.html";
        }
        if(Dolaing.user.type == "0" || Dolaing.user.type == "1"){
            window.location.href = "/web/buyer/buyerCenter.html";
        }else if(Dolaing.user.type == "2"){
            window.location.href = "/web/seller/sellerOrders.html";
        }else if(Dolaing.user.type == "3"){
            window.location.href = "/web/farmer/farmerCenter.html";
        }
    });
});