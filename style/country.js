$(document).ready(function(){
	//顶部大图片轮换
	CountryJS.init();
	$("#sellocation").click(function() {
		$("#laylocation").show();
		$("#laytheme").hide();
	 });
	 
	 $("#seltheme").click(function() {
		 if($("#sellocation").val()!="全部"){
		$("#laytheme").show();
		$("#laylocation").hide();
	}
	 });
	
	$(".locationitem").click(function() {
		$("#sellocation").val($(this).text());
		$("#hidlocation").val($(this).attr("id"));
		$("#locationtitle").html($(this).text());
		changeLocation();
		$("#laylocation").hide();
		$("#seltheme").val("全部");
		$("#hidtheme").val("AllThemes");
		$("#themetitle").html("全部");
		
		})
		
		
		
function addListener(element, e, fn) {
    if (element.addEventListener) {
        element.addEventListener(e, fn, false);
    } else {
        element.attachEvent("on" + e, fn);
    }
}
addListener(document, "click",
function(evt) {
    var evt = window.event ? window.event: evt,
    target = evt.srcElement || evt.target;
    if (target.id == "laylocation"||target.id == "laytheme") {
        return;
    } else {
    	if((target.id!="laylocation"&&target.id!="sellocation"))
    	$("#laylocation").hide();	
    	if((target.id!="seltheme"&&target.id!="laytheme"))
    	$("#laytheme").hide();	
    }
});
});
var CountryJS={
		init:function (){
		//	this.carousellCentralSection();
			this.replaceUrl();
			this.queryTourPrice();
			this.bannerShow();
			this.hiddenDt();
			this.loadingMore();
			this.lazyloadImg();
			this.btnSearch();
			this.loading();
		},
		replaceUrl:function (){
			config=["http://img01.haiwaner.com","http://img02.haiwaner.com","http://img03.haiwaner.com"],
			$("img.lazy_img").each(function (index){
				var url = $(this).data("original");
				$(this).attr("data-original",config[index%3]+url);
			});
		},
		 /**
		 * 异步加载热门图片
		 */
		btnSearch:function (){
			$("#btn_search").click(function() {
				var location=$("#hidlocation").val();
				var theme=$("#hidtheme").val();
				window.open('/search/'+location+'_'+theme+'.html ');
			})
		},
		lazyloadImg:function (){
			var public = common_checkbrowse(); 
			var showeffect = ""; 
			if ((public['is'] == 'msie' && public['ver'] < 8.0)) { //根据浏览器版本来显示不同的滤镜效果
			showeffect = "show" 
			} else { 
			showeffect = "fadeIn" 
			} 
			$(".big-carousel img.lazy_img").lazyload({
			event:"scrollstop",
			effect:showeffect   
			});
		},
		/**
		 * 根据tour id 查询价格
		 */
		queryTourPrice:function () {
			// 根据tour_id ajax查询价格,折扣等信息
			// 第一部分
			var tour_ids = "";
			$(".price").each(function (){
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
				type : "post",
				url : '/queryTourPriceCountry',
				data : {
					tour_ids : tour_ids
				},
				dataType : 'json',
				async : false,
				success : function(json) {
					priceList = json.data;
					for (var i = 0; i < priceList.length; i++) {
						var htmlStr = "<em>￥</em>" + priceList[i].soldprice_yuan;
						$("." + priceList[i].tourId).html(htmlStr);
					}
				}
			});
		},
		carousellCentralSection:function (){
			var page = 1;
			var i = 2; //每版放3个图片
			$(".pointerLeft").on("click",function(){
				var content = $(".carousellCentralSection");
				 var content_list = content.find(".content_list");
				 var v_width = content.width();
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
			$(".pointerRight").on("click",function(){
			    //绑定click事件carousellCentralSection
				 var content =$(".carousellCentralSection");
				 var content_list = content.find(".content_list");
				 var v_width = content.width();
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
		},
		bannerShow:function (){
			$(".bannertitle").click(function() {
			$(".bannertitle").removeClass("hover_banner_title");
			$(this).addClass("hover_banner_title");
			var tempid = $(this).prop("id");
			var num = tempid.split("_")[1];
			$("#bannermap li").each(function() {
				$(this).hide();
			});
			$("#banner_" + num).show();
			});
		},
		hiddenDt:function (){
			$("dl[class^='product-']").children("dt").css({"overflow":"hidden"});
		},
		loadingMore:function (){
			var productListObj = $(".productlist");
			if(productListObj.length>3){
				productListObj.each(function (){
				$(this).index();
				var index=	parseInt($(this).data("index"));
				if(index>3){
					$(this).hide();
				}
				});
			}else {
				$(".loadMoreContent").hide();
				$(".loadOver").show();	
			}
			/*$("#loadingMore").click(function() {
				var indexC= $(".productlist:visible").length;
				$(".productlist:hidden").each(function (){
					indexC++;
					var index=	parseInt($(this).data("index"));
					if(index==indexC){
					$(this).show();
					}
					if(indexC%3==0){
						return false;
					}
				});
				if($(".productlist:visible").length==$(".productlist").length)
				{
					$(".loadMoreContent").hide();
				}
				$(".big-carousel img.lazy_img").lazyload();
			});*/
		},
		loading:function (){
			var flag = true;
			$(window).scroll(function(){
				aa=parseInt($(".big-carousel").height()); //获取文档的高度
				oo=parseInt($(".big-carousel").scrollTop()); //获取滚动条到顶部的垂直高度
				var settings = {
						threshold : 180
				}
				if(/*flag&&(aa-oo)<900*/flag&&$("#travelListTitle").isOnScreen(settings)&&$(".productlist:visible").length!=$(".productlist").length){
					flag = false;
					$(".loadMoreContent").show();
					setTimeout(function (){
						var indexC= $(".productlist:visible").length;
						$(".productlist:hidden").each(function (){
							indexC++;
							var index=	parseInt($(this).data("index"));
							if(index==indexC){
							$(this).show();
							}
							if(indexC%3==0){
								return false;
							}
						});
						if($(".productlist:visible").length==$(".productlist").length)
						{
							$(".loadMoreContent").hide();
							$(".loadOver").show();	
						}
						$(".loadMoreContent").hide();
						$(".big-carousel img.lazy_img").lazyload();
						flag = true;
					}, 1500);
				}
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
			     
			    var bounds = $("body").offset();
			    bounds.right = bounds.left + $("body").outerWidth();
			    bounds.bottom = bounds.top + $("body").outerHeight();
			    
			    var threshold = 0;
			    if(settings && settings.threshold){
			    	threshold = settings.threshold
			    }
			      
			    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom - threshold < bounds.top || viewport.top > bounds.bottom + threshold));
		    };
			
		}
}

function changeLocation(){
	
	getTheamBylocation($("#hidlocation").val());
 	$(".themeitem").click(function() {
 			$("#seltheme").val($(this).text());
 			$("#hidtheme").val($(this).attr("id"));
 			$("#themetitle").html($(this).text());
 			$("#laytheme").hide();
 			})
}
function getTheamBylocation(locationname){
	$.ajax({
		type : "get",
		url : '/querySearchParam',
		data : {
			location : locationname
		},				
		dataType : 'json',
		async : false,
		success : function(json) {
			ThemeList = json.data;
			var html="";
			for (var i = 0; i < ThemeList.length; i++) {
				 ThemeList[i].theme_en_name;
				 ThemeList[i].theme_name;
				 html+=' <span class="themeitem" id="'+ThemeList[i].theme_en_name+'" name="'+ThemeList[i].theme_en_name+'">'+ThemeList[i].theme_name+'</span>';
			}
			$(".themeitem").remove();
			$("#themetitle").parent().append(html);
			
		}
	});
}