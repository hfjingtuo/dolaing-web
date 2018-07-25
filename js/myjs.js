$().ready(function(){

	//登录
	$('.login_box_tab li').click(function(){
		$('.login_box_tab li').removeClass('login_box_tab_cur');
		$(this).addClass('login_box_tab_cur');
	})

	//商品图片切换
	$('.img_small li').mouseenter(function(){
			var $t = $(this).index();
			$('.img_big li').hide();
			$('.img_small li img').removeClass('img_small_cur');
			$(".img_big li").eq($t).show();
			$('.img_small li img').eq($t).addClass('img_small_cur')
	})
	
	//商品详情内容切换
	$('.goods_main_right_tab li').click(function(){
		$('.goods_main_right_tab li').removeClass('goods_main_right_tab_cur');
		$(this).addClass('goods_main_right_tab_cur');
		var $t = $(this).index();
		$('.goods_main_right_content1').hide();
		$(".goods_main_right_content1").eq($t).show();
	})
	
	//店铺内容切换
	$('.shop_list li').click(function(){
		$('.shop_list li').removeClass('shop_list_cur');
		$(this).addClass('shop_list_cur');
	})
	
	
	
	
	
	
	
	
	
	
	
})


























