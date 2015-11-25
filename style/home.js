$(document).ready(function(){
	//主页延迟加载图片cdn图片
	config=["http://img01.haiwaner.com","http://img02.haiwaner.com","http://img03.haiwaner.com"],
	$("img[data-original]").each(function (index){
		var url =	$(this).attr("data-original");
		$(this).attr("data-original",config[index%3]+url);
	});
	//顶部大图片轮换
	HomeJS.init();		
	/**
	 * 异步加载热门图片
	 * @author tian
	 */
	var public = common_checkbrowse(); 
	var showeffect = ""; 
	if ((public['is'] == 'msie' && public['ver'] < 8.0)) { //根据浏览器版本来显示不同的滤镜效果
	showeffect = "show" ;
	} else { 
	showeffect = "fadeIn" ;
	} 
	//滚动停止加载
	$("img.lazy_img").lazyload({
		event:"scroll",
	     effect:showeffect ,
	     skip_invisible : false,
	     failure_limit   : 12
	});
	
	//轮播图片下一页的延迟出发
	$(".carouselR").click(function() {
		var container=$(this).parent().find(".content_list");
			$("img.lazy_img").lazyload({         
			     container: 	container
			});
	});
	
});
/**
 * 首页的js
 */
var HomeJS={
		init:function (){
		this.initNivoSlider();
		this.initBackToTopBar();
		this.backToTop();
		this.middleTabCarousell();
		this.carousellCentralSection();
		this.hotcountryCarousellLeft();
		this.preAndNextPage();
		this.home_queryTourPrice();
		},
		/**
		 * 首页顶部大图片轮换
		 */
		initNivoSlider:	function (){
			$("#home-slider").responsiveSlides({
		         auto: true,
		         pager: true,
		         nav: true,
		         hidenav : true,
		         speed: 500,
		         namespace: "homewrap",
		         prevText: "",
		         nextText: "",
		         timeout: 8000 //8秒换一次图片
		     });
		},
		/**
		 * 主题图片的轮播
		 */
		themeSlider :function (){
	        $(".theme_slider").each(function () {
	            var $imgel = $(this).children().eq(1).children(),
	                $slideItems = $(this).children().eq(0),
	                imgWidth  = $slideItems.width();
	            $imgel.each(function(index){
	                var $self = $(this);
	                //如果不是当前显示的的图片，鼠标进入时，图片变换
	                $self.mouseenter(function(){
	                    if(!$self.hasClass("current")){
	                        $imgel.removeClass("current");
	                        $self.addClass("current");
	                        var leftVal = "-" + index * imgWidth + (index == 0 ? "" : "px");
	                        $slideItems.animate({
	                            left: leftVal
	                        });
	                    }
	                });
	            });
	        });
		},
		/**
		 * 根据tour id 查询价格
		 */
		queryTourPrice:function (){
			
		},
		initBackToTopBar:function (){
		//	$("#backToTop").show();
			var backToTopObj = 	$("#backToTop ul");
			$(".product").each(function (){
				var name = $(this).data("name");
				var hrefName=$(this).attr("name");
				backToTopObj.append("<li><a href='#"+hrefName+"' class='hover'>"+name+"</a></li>");
			});
			backToTopObj.append("<li id='goToTop'><a><b></b></a></li>");
			$("#backToTop ul li a").each(function(){
				if($(this).parent().attr("id")!="goToTop"){
		            $(this).on("click",function(){
		            	$("#backToTop ul li a").removeAttr("style");
		                var $aTag = $(this);
		                $aTag.css({"background-color":"#fa139b"});
		                var targetId = $aTag.attr("href");
		                $(window).scrollTop($(targetId).offset().top);
		                return false;
		            });
		         }
		      });

		},
		/**
		 * 右下则导航
		 */
		backToTop:function (){
			$("#arrow-wrapper").click(function() {
			    $('html, body').animate({
			        scrollTop: $("#dest-search").offset().top
			    }, 1000);
			});
				/**
				 * top 按钮
				 */	
				//点击图标时跳转
				$("#goToTop").click(function(){
					 $('body,html').animate({scrollTop:0},500);
					 //alert(typeof foot);
				});
				/**
				 * 检查元素是否在可视范围内
				 */
				$.fn.isOnScreen = function(settings){ 
					var win = $(window);
				    var viewport = {
				        top : win.scrollTop(),
				        left : win.scrollLeft()
				    };
				    viewport.right = viewport.left + win.width();
				    viewport.bottom = viewport.top + win.height();
				    var bounds = this.offset();
				    bounds.right = bounds.left + this.outerWidth();
				    bounds.bottom = bounds.top + this.outerHeight();
				    var threshold = 0;
				    if(settings && settings.threshold){
				    	threshold = settings.threshold;
				    }
				    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom - threshold < bounds.top || viewport.top > bounds.bottom + threshold));
			    };
				//滚轮滑动时显示按钮
				window.onscroll =  function(){
					if($(window).scrollTop()<900){
						 $("#backToTop").hide();
					}else{
						$("#backToTop").show();
					}
					//如果标题在可视范围内，则改变标题的图标，并以渐进的方式显示出来
					var settings = {
							threshold : 180
					};
					$(".title > i").each(function(){
						var $self = $(this);
						var isOnScreen = $self.isOnScreen(settings);
						if(!$self.hasClass("on") && isOnScreen){
							$self.hide();
							$self.addClass("on");
							$self.fadeIn(800);
						}
					});
				if($(".product:last").find("dl:last").find(".name").isOnScreen(settings)||$(".footer").isOnScreen(settings)){
					$("#backToTop").css({"position":"absolute","bottom":"0px"});
				}else {
					$("#backToTop").css({"position":"fixed","bottom":"40px"});
				}
				$(".product").each(function (){
					if($(this).isOnScreen({threshold : 260})){
					$("#backToTop ul li a").removeAttr("style");
		              var name = $(this).attr("name");
		              $("#backToTop ul li a").each(function (){
		            	  if(("#"+name)==$(this).attr("href")){
		            		  $(this).css({"background-color":"#fa139b","color":"#ffffff"});
		            	  }
		              });
					}
				});
				};
		},
		/**
		 * 首页中部轮播
		 */
		carousellCentralSection:function (){
			$(".carousellCentralDiv").each(function (){
			    var page = 1;
			    var i = 3; //每版放3个图片
				var parentObj = $(this);
				parentObj.find(".carouselL").on("click",function(){
					var content = parentObj.find(".carousellCentralSection");
					 var content_list = content.find(".content_list");
					 var v_width =845;
					 var len = content.find("dl").length;
					 var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
					 if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
					 	 if(page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
					 		content_list.animate({ left : '-='+v_width*(page_count-1) }, "slow");
							page = page_count;
						}else if(page>0){
							content_list.animate({ left : '+='+v_width }, "slow");
							page--;
						}
					}
				});
				parentObj.find(".carouselR").on("click",function(){
				    //绑定click事件carousellCentralSection
					 var content = parentObj.find(".carousellCentralSection");
					 var content_list = content.find(".content_list");
					 var v_width =845;
					 var len = content.find("dl").length;
					 var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
					 if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
						  if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
							//content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面
							page = 1;
							content_list.css("left","0px");
						  }else{
							content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面
							page++;
						 }
					 }
				});
			});
		},
		/**
		 * tab页
		 */
		middleTabCarousell:function (){
			$(".middleTabCarousell").each(function (){
				var middleTabCarousellObj=$(this);
				$(this).find("div ul li").each(function (){
					 $(this).on("click",function(){
						 var liObj = $(this);
						 liObj.siblings().removeClass("hover").find("div").remove();
						 liObj.addClass("hover");
						 liObj.append("<div class='tab-arrow'><b></b></div>");
						 var index=	liObj.data("index");
						 middleTabCarousellObj.find(".middleTabLists").hide();
						 middleTabCarousellObj.find(".middleTabLists[index="+index+"]").show(); ;
					 });
				});
				//给左右分页加事件
					$(this).find(".carouselL").on("click",function(){
					var visibleObj = middleTabCarousellObj.find(".middleTabLists:visible");
					var index = visibleObj.attr("index");
					if(parseInt(index)>0){
						visibleObj.hide().prev().show();
						middleTabCarousellObj.find("div ul li").removeClass("hover").find("div").remove();
						middleTabCarousellObj.find("div ul li[data-index="+(parseInt(index)-1)+"]").show().addClass("hover").append("<div class='tab-arrow'><b></b></div>");
					}
					});
					$(this).find(".carouselR").on("click",function(){		
					var visibleObj = middleTabCarousellObj.find(".middleTabLists:visible");
					var index = visibleObj.attr("index");
					if(parseInt(index)< middleTabCarousellObj.find(".middleTabLists").length-1){
						visibleObj.hide().next().show();
						middleTabCarousellObj.find("div ul li").removeClass("hover").find("div").remove();
						middleTabCarousellObj.find("div ul li[data-index="+(parseInt(index)+1)+"]").show().addClass("hover").append("<div class='tab-arrow'><b></b></div>");
					}
				});
			});
		},
		/**
		 * 两张大图轮播
		 */
		hotcountryCarousellLeft:function (){
			//初始化宽度
			 var _focus_lock = true;
			$("#triangle-down-ul").width((  $("#triangle-down-div").width()+6)*Math.ceil($("#triangle-down-div").find("li").length /2));
			 $(".hotcountry .pagination").empty().html(' <a href="">'+1+'</a>/<a href="">'+	Math.ceil($("#triangle-down-div").find("li").length / 2)+'</a>');
			var page = 1;
		    var i = 2; //每版放2个图片
			$(".hotcountry .text").find(".toleft").on("click",function(){
				scrollLeft();
			});
			function scrollLeft(){//向左滚动
				 var content = $("#triangle-down-div");
				 var content_list = content.find("#triangle-down-ul");
				 var v_width = content.width()+6;
				 var len = content.find("li").length;
				 var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
				 if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
				 	 if(page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
				 		content_list.animate({ left : '-='+v_width*(page_count-1) }, "slow");
						page = page_count;
					}else{
						content_list.animate({ left : '+='+v_width }, "slow");
						page--;
					}
				}
				 $(".hotcountry .pagination").empty().html(' <a href="">'+page+'</a>/<a href="">'+page_count+'</a>');
			}
			$(".hotcountry .text").find(".toright").on("click",function(){
				scrollRight();
			});
			function scrollRight(){//向右滚动
				 var content = $("#triangle-down-div");
				 var content_list = content.find("#triangle-down-ul");
				 var v_width = content.width()+4;
				 var len = content.find("li").length;
				 var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数
				 if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画
					  if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
						content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面
						page = 1;
						//content_list.css("left","0px");
					  }else{
						content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面
						page++;
					 }
				 }
				 $(".hotcountry .pagination").empty().html(' <a href="">'+page+'</a>/<a href="">'+page_count+'</a>');
			}
			var int=setInterval(scrollRight,6000);
			$("#triangle-down-div ul").hover(
				function() {
				    if (_focus_lock) {
				        clearInterval(int);
				        _focus_lock = false;
				    }
				},
				function() {
				    if (_focus_lock == false) {
				        int = setInterval(scrollRight, 6000);
				        _focus_lock = true;
				    }
				});
			$(".hotcountry").find(".pause").on("click",function(){
				   if (_focus_lock) {
				        clearInterval(int);
				        _focus_lock = false;
				    }
			});
			$(".hotcountry").find(".rerun").on("click",function(){
				clearInterval(int); 
				var content_list=$("#triangle-down-ul").stop();
				page = 1;
				content_list.css("left","0px");
				int=setInterval(scrollRight,6000);
				 $(".hotcountry .pagination").empty().html(' <a href="">'+page+'</a>/<a href="">'+	Math.ceil($("#triangle-down-div").find("li").length / 2)+'</a>');
			});
		},
		/**
		 * 媒体报道
		 */
		preAndNextPage:function (){
	        var $content = $("#footer_media_content"),
	                $children = $content.children(),
	                total = $children.size(),
	                $prev = $("#footer_page_prev"),
	                $next = $("#footer_page_next");
	        if(total < 2){
	            $(".pages").hide();
	            return
	        }
	        //初始化
	        $content.find(".pager_cur").each(function () {
	            $(this).removeClass("hover");
	            $("#footer_media_content").children().eq(0).addClass("hover");
	        });
	        $prev.click(function () {
	            var idx = $children.index($content.find(".pager_cur"));
	            if(idx == 0){
	                return;
	            }
	            if($next.hasClass("disabled")){
	                $next.removeClass("disabled");
	            }
	            if(idx - 1 == 0){
	                $(this).addClass("disabled");
	            } else {
	                if($(this).hasClass("disabled")){
	                    $(this).removeClass("disabled");
	                }
	            }
	            $content.find(".pager_cur").removeClass("pager_cur");
	            $children.eq(idx - 1).addClass("pager_cur");
	        });
	        $next.click(function () {
	            var idx = $children.index($content.find(".pager_cur"));
	            if(idx == total - 1){
	                return;
	            }
	            if($prev.hasClass("disabled")){
	                $prev.removeClass("disabled");
	            }
	            if(idx == total - 2){
	                $(this).addClass("disabled");
	            } else {
	                if($(this).hasClass("disabled")){
	                    $(this).removeClass("disabled");
	                }
	            }
	            $content.find(".pager_cur").removeClass("pager_cur");
	            $children.eq(idx + 1).addClass("pager_cur");
	        });
		},

		/**
		 * 根据tour id 查询价格
		 */
		home_queryTourPrice:function (){
			// 根据tour_id ajax查询价格,折扣等信息
			// 第一部分
			var tour_ids = "";
			$(".pricedd").each(function (){
				tour_ids += $(this).attr("id");
					tour_ids += "-";
			});
			tour_ids = tour_ids.substring(0, tour_ids.length-1);
			var tourArray = tour_ids.split('-');
			var tourSplitLen = Math.round(tourArray.length / 2);
			var tourArray1 = tourArray.splice(0, tourSplitLen);
			var  tour_ids=tourArray1.join("-") + "-" + tourArray.join("-");
			var priceList;
			$.ajax({
				type:"post",
				url:'/queryTourPrice' ,
				data:{
					tour_ids:tour_ids
					},
				dataType: 'json',
				async : false, 
				success: function(json){
					priceList=json.data; 
					for(var i=0;i<priceList.length;i++){
		    		//	var str = '<span class="discount"><em>'+(priceList[i].discount*10)+'</em>%</span> <span class="price" >   <s>市场价'+priceList[i].marketprice_yuan+'</s>	<span class="vip" > <div class="ponity"></div>  <div class="ponity_shadow"></div>￥'+priceList[i].soldprice_yuan+'</span></span>';
		    			  
		    			var str = '<span class="discount">￥<em>'+priceList[i].soldprice_yuan+'</em></span> <span class="price" >   市场价: '+priceList[i].marketprice_yuan+'	</span>';
		    			if($("#"+priceList[i].tourId).data("type")==="div"){
		    				str+='<div class="clear"></div>'	;
		    			}
		    			$("."+priceList[i].tourId).empty().html(str);
					}
				}
			});
		}
};

