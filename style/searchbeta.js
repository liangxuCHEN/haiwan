var searchThemeAndCity = {
	bindMore: function() {
		var _this = this;
		var themeHeight = $("#theme_content").height();
		$("#theme_more_click").on("click", function() {
			var $wrap = $(this).parent().next();
			_this.moreAction($(this), $wrap, 143, 82, themeHeight)
		});
		$("#city_more").on("click", function() {
			var $wrap = $(this).parent().next();
			_this.moreAction($(this), $wrap, 158, 97, themeHeight)
		})
	},
	moreAction: function($this, $wrap, downHeight, upHeight, changeHeight) {
		if ($this.hasClass("theme_more_down")) {
			$this.removeClass("theme_more_down");
			$this.removeClass("down");
			if ($wrap.hasClass("scroll")) {
				$wrap.scrollTop(0);
				$wrap.removeClass("scroll");
			}
			$wrap.css("max-height", upHeight);
			$this.html("更多")
		} else {
			$this.addClass("theme_more_down");
			$this.addClass("down");
			$wrap.css("max-height", downHeight);
			if (changeHeight > downHeight) {
				$wrap.addClass("scroll");
			}
			$this.html("收起");
		}
	},
	/**
	 * 国家的Tab，鼠标滑过 显示对应的内容
	 */
	tabChange: function() {
		var $tab = $("#country_tab_title");
		$tab.children().each(function(index) {
			$(this).on("mouseenter", function() {
				if ($(this).hasClass("country_cur")) {
					return;
				}
				$tab.find(".country_cur").removeClass("country_cur");
				$(this).addClass("country_cur");
				var $tabContent = $(".cur_right");
				$tabContent.find(".country_content_cur").removeClass("country_content_cur");
				$tabContent.children().eq(index).addClass("country_content_cur");
			});
		});
	},
	/**
	 * 取消当前选择
	 */
	cancelCur: function() {
		$(".search_cancel").on("click", function(event) {
			event.preventDefault();
			var type = $(this).parent().attr("rel");
			var cancelid = $(this).attr("rel");
			if (type == "theme") {
				$("#themeEname").val("AllThemes");
			}
			if (type == "country") {
				$("#cityName").val("AllCitys");
			}
			if (type == "city") {
				$("#cityName").val($("#search_country_en").attr("rel"));
			}
			if (type == "label") {
				$("#labelName").val("AllLabel");
			}
			this.remove();
			
			//计算最小的
			var maxId = 1;
			$(".search_cancel").each(function(index,elem){
				var id = $(elem).attr("rel");
				if(parseInt(id) > parseInt(maxId) && parseInt(cancelid) > parseInt(id)){
					maxId = id;
				}
			})
			$("#cityName").val(maxId);
			search_beginSearchWithOut();
		})
	},
	/**
	 * 点击选择国家、城市、主题
	 */
	searchClick: function() {
		//选择国家
		if ($(".search_country_click").length > 0) {
			$(".search_country_click").on("click", function(event) {
				event.preventDefault();
				$("#cityName").val($(this).attr("rel"));
				search_beginSearchWithOut();
			});
		}

		//选择城市
		if ($(".search_city_click").length > 0) {
			$(".search_city_click").on("click", function(event) {
				event.preventDefault();
				$("#cityName").val($(this).attr("rel"));
				search_beginSearchWithOut();
			});
		}

		//选择主题
		if ($(".search_theme_click").length > 0) {
			$(".search_theme_click").on("click", function(event) {
				event.preventDefault();
				$("#themeEname").val($(this).attr("rel"));
				search_beginSearchWithOut();
			});
		}

		//选择标签
		if ($(".search_label_click").length > 0) {
			$(".search_label_click").on("click", function(event) {
				event.preventDefault();
				$("#labelName").val($(this).attr("rel"));
				search_beginSearchWithOut();
			});
		}
	},
	init: function() {
		this.bindMore();
		this.tabChange();
		this.cancelCur();
		this.searchClick();
	}
};
$(document).ready(function() {
	searchThemeAndCity.init();
	//选中对应的主题
	$(".header_themlist").find(".selected").removeClass("selected");
	var headerCurTheme = $("#search_header_name").val();
	$(".header_themlist").children().each(function() {
		var thisTheme = $(this).attr("rel");
		if (headerCurTheme != "" && thisTheme == headerCurTheme) {
			$(this).addClass("selected");
		}
	});

	/**
	 * 异步加载图片
	 * @author tian
	 */
	var public = common_checkbrowse();
	var showeffect = "";
	if ((public['is'] == 'msie' && public['ver'] < 8.0)) { //根据浏览器版本来显示不同的滤镜效果
		showeffect = "show"
	} else {
		showeffect = "fadeIn"
	}
	$("img.lazy_img").lazyload({
		event: "scrollstop",
		effect: showeffect //加载图片使用的效果(fadeIn(淡入),slideDown(下拉)
	});

	/**
	 * 初始化城市搜索框参数
	 */
	$('#search_page_city_input').typeahead({
		name: 'city_names_hint',
		prefetch: '/res/data/city_hint7.json',
		template: '<p>{{value}}</p>',
		limit: 12, //匹配显示最大数目
		engine: Hogan
	});

	//搜索
	$('#search_page_city_input').bind('typeahead:selected', function(obj, datum, city_name) {
		var city_name = datum.value
		if (city_name == "") {
			//window.location.reload(true);
			return;
		}
		$("#cityName").val(city_name);
		$("#themeEname").val("AllThemes");
		search_beginSearchWithOut();
	});

	//回车搜索
	$('#search_page_city_input').on('keypress', function(event) {
		if (event.keyCode == "13") {
			var city_name = $(this).val();
			if (city_name == "") {
				//window.location.reload(true);
				return;
			}
			$("#cityName").val(city_name);
			$("#themeEname").val("AllThemes");
			search_beginSearchWithOut();
		}
	});


	/**
	 * date picker
	 * 时间控件
	 */
	$('input.start_date').Zebra_DatePicker({
		direction: true,
		pair: $('input.end_date')
	});
	$('input.end_date').Zebra_DatePicker({
		direction: 1
	});
	$('body').on('click', '.dp_daypicker', function() {
		$("#searchTime").show();
	});
	/**
	 * 价格滑动条事件
	 */
	var PRICE_HIGH = $("#maxPrice").val() == "" ? 28000 : (parseInt($("#maxPrice").val()) + 10);
	var PRICE_LOW = $("#minPrice").val() == "" ? 0 : $("#minPrice").val();
	var price_low = PRICE_LOW;
	var price_high = PRICE_HIGH;
	var price = common_getParameterByName('price')
	if (price == "-" || price == "" || price == "null") {
		price = price_high + "-" + price_low;
	} else {
		price_low = parseInt(price.split('-')[0]);
		price_high = parseInt(price.split('-')[1]);
		if (price_low < PRICE_LOW) price_low = PRICE_LOW;
		if (price_high > PRICE_HIGH) price_high = PRICE_HIGH;
	}
	//	$("#lowPrice").val(price_low);
	//	$("#highPrice").val(price_high);


	$('.price .text .no').html('¥' + PRICE_LOW + ' - ' + '¥' + PRICE_HIGH);
	//价格条的刻度单位
	$("#price_bar").noUiSlider({
		range: [PRICE_LOW, PRICE_HIGH],
		start: [price_low, price_high],
		step: 1
			//,margin: 100
			,
		slide: function() {
			var values = $(this).val();
			$(this).next('div').text(
				"¥" + values[0].split('.')[0] + " - " + "¥" + values[1].split('.')[0]
			);
			$("#lowPrice").val(values[0].split('.')[0]);
			$("#highPrice").val(values[1].split('.')[0]);
			$("#searchPrice").show();
		}
	});

	/**
	 * 价格 搜索按钮
	 */
	$("#searchPrice").click(function() {
		//搜索
		search_beginSearch("");
	});

	/**
	 * 时间 搜索按钮
	 */
	$("#searchTime").click(function() {
		//搜索
		search_beginSearch("");
	});
	/**
	 * tour图片动态轮播
	 */
	slidey = null;
	var interval_id = null;
	$('div.list .img').hover(function() {
			slidey = $(this).unslider();
			$(this).find('ol.dots').show();
			var data = slidey.data('unslider');
			data.next();
			interval_id = setInterval(data.next, 2500);
		},
		function() {
			clearInterval(interval_id);
			$(this).find('ol.dots').hide();
		}
	);

	/**
	 * 排序后，页面刷新时记录之前选择排序项
	 */
	var orderByType = $("#orderType").val();
	if (orderByType == "duration") {
		$('#sortDuration').attr("src", "/res/images/icon-point01.jpg");
	} else if (orderByType == "soldprice_yuan") {
		$('#sortPrice').attr("src", "/res/images/icon-point01.jpg");
	}



	/**
	 * 持续时间
	 */
	//搜索返回后，选中之前持续时间
	if ($("#duration").val() != "") {
		var duration = $("#duration").val();
		if (duration.Contain("A")) {
			$("li input[value='A']").prop("checked", true);
		}
		if (duration.Contain("B")) {
			$("li input[value='B']").prop("checked", true);
		}
		if (duration.Contain("C")) {
			$("li input[value='C']").prop("checked", true);
		}
		if (duration.Contain("D")) {
			$("li input[value='D']").prop("checked", true);
		}
		if (duration.Contain("E")) {
			$("li input[value='E']").prop("checked", true);
		}
	}
	//点击事件
	$("input[name='duration']").click(function() {
		search_beginSearch("");
	});

	/**
	 * 服务语言
	 */
	//搜索返回后，选中之前选中服务语言
	if ($("#langua").val() != "") {
		var str = $("#langua").val();
		if (str.Contain('mandarin')) {
			$("ul  input[value='mandarin']").prop("checked", true);
		}
		if (str.Contain('cantonese')) {
			$("ul  input[value='cantonese']").prop("checked", true);
		}
		if (str.Contain('english')) {
			$("ul  input[value='english']").prop("checked", true);
		}
		if (str.Contain('japanese')) {
			$("ul  input[value='japanese']").prop("checked", true);
		}
		if (str.Contain('russian')) {
			$("ul  input[value='russian']").prop("checked", true);
		}
		if (str.Contain('french')) {
			$("ul  input[value='french']").prop("checked", true);
		}
		if (str.Contain('korean')) {
			$("ul  input[value='korean']").prop("checked", true);
		}
	}
	$("input[name='lang']").click(function() {
		search_beginSearch("");
	});

	/**
	 * @author qianlong
	 * 实现回到top
	 */

	//点击图标时跳转
	$("#backToTop").click(function() {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
	});
	//滚轮滑动时显示按钮
	window.onscroll = function() {
		if ($(window).scrollTop() < 300) {
			$("#backToTop").attr("style", "display:none");
		} else {
			$("#backToTop").attr("style", "display:block")
		}
	}


	/**
	 * 去掉旅游线路末尾“-”
	 */
	var allLineSpan = $(".intro span");
	for (var i = 0; i < allLineSpan.length; i++) {
		var temp = allLineSpan.eq(i).html();
		var lastIndex = temp.lastIndexOf('-');
		allLineSpan.eq(i).html(temp.substr(0, lastIndex));
	}
});



/**
 * 获取选中 服务语言 信息
 */
function search_getLanguageInfo() {
		var langStr = "";
		$("input[name='lang']").each(function() {
			if ($(this).prop("checked")) {
				langStr += $(this).val() + "-";
			}
		});
		return langStr;
	}
	/**
	 * 获取选中 游玩时间
	 */

function search_getDurationInfo() {
	var durationStr = "";
	$("input[name='duration']").each(function() {
		if ($(this).prop("checked")) {
			durationStr += $(this).val() + "-";
		}
	});
	return durationStr;
}

/**
 * 排序
 */
function sort_by_price() {
	search_beginSearch("price")
}

function sort_by_duration() {
	search_beginSearch("duration")
}

function sort_by_default() {
	search_beginSearch("")
}

function getTypeid(){
	return $("#cityName").val();
}

/**
 * 带条件搜索
 */
function search_beginSearch(orderByType) {
	var typeid = getTypeid();
	var order = orderByType;
	var lowPrice = $("#lowPrice").val();
	var highPrice = $("#highPrice").val();
	var url = '/plus/travel2/search.php?typeid=' + typeid 
		+ '&orderby=' + order 
		+ '&highPrice=' + highPrice
		+ '&lowPrice='+lowPrice;
	window.location.href = url;
}

/**
 * 不带条件搜索
 */
function search_beginSearchWithOut() {
	//var themeEname = $("#themeEname").val();
	$.blockUI({ //搜索中...
		message: $('#load_img'),
		css: {
			top: '36%',
			left: '45%',
			width: 'auto'
		}
	});
	//var labelname = $("#labelName").val();
	var typeid = getTypeid();
	
	var url = '/plus/travel2/search.php?typeid=' + typeid;
	window.location.href = url;
}


$(function() {
	$('.product').hover(function() {
			$(this).addClass("hover");
			$(this).find(".intro").show();
		}),
		$('.product').mouseleave(function() {
			$(this).removeClass("hover");
			$(this).find(".intro").hide();
		})


	var $toggleBtn = $('#showAll');
	$toggleBtn.click(function() {
		var inner_li = $('#ywsj');
		var inner_li2 = $('#fwyy');



		if (inner_li.is(":visible")) {
			inner_li.hide();
			inner_li2.hide();
			$(this).find(".more").show();
			$(this).find(".more2").hide();
			$(this).attr("u-behavior", "search_showAll_close");
		} else {
			inner_li.show();
			inner_li2.show();
			$(this).find(".more").hide();
			$(this).find(".more2").show();
			$(this).attr("u-behavior", "search_showAll_open");
		}
		var behaviorCode = $(this).attr("u-behavior");

		$.ajax({
			type: "post",
			async: true,
			url: "/addsyslogs" + window.location.search,
			dataType: "json",
			data: {
				behaviorCode: behaviorCode,
				referer: document.referrer,
				url: window.location.href
			}
		});

		return false;
	})

})

var sorttype = $('#orderType').val();
if (sorttype == '') {
	$('#sortdefault').addClass("hover");
} else if (sorttype == 'duration') {
	$('#sortduration').addClass("hover");
} else if (sorttype == 'soldprice_yuan') {
	$('#sortprice').addClass("hover");
}