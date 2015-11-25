/**
 * Created by bingxin on 2015/3/27.
 */
		var tabImg = [],
			$tourSlider = $("#tour-slider");
		if ($("#isErpImage").val()=='0') {
	    	$tourSlider.children().each(function(){
	    		var src = $(this).children("img").attr("src");
	    		tabImg.push('<div class="ctrl_wrap"><img src="'+src+'" width="126" height="86"></img></div>' +
	    		'<div class="ponity_shadow"></div><div class="ponity"></div>');
	    	});
		} else {
			var json = $("#imgsmaList").val();
			var obj = eval(json);
			$(obj).each(function (index){
				var val = obj[index];
				tabImg.push('<div class="ctrl_wrap"><img src="'+val.name_url+'" width="126" height="86"></img></div>' +
	    		'<div class="ponity_shadow"></div><div class="ponity"></div>');
			});
		}
		$tourSlider.responsiveSlides({
			auto: true,
			animtype: "fade",
			pager: true,
			speed: 500,
			namespace: "tourSlider",
			width: 690,
			tabsEle: tabImg,
			timeout: 30000 //5秒换一次图片
		});
		
var TourDetailUtils = { //初始化详情页JS所有内容
	directorInitialize : function(tourId,callback){//查询新版SKU
		var date = new Date();
		var month = date.getMonth();
		var dateYYYY_MM = date.getFullYear()+"-"+((month<10)?"0":"")+(month+1);
		$.ajax({
			type: "post",
			url:"/tourDetail/queryTourSkuByAjaxFromERP.html",
			dataType: 'json',
			async: false,
			data:{
				tourid:tourId,
				date:dateYYYY_MM
			},
			success: function(result){
				if(result.code=200){
					callback(result.data);
				}
			}
		});
	},
	isPaymentDivBlock : false,
	submbuyBind : function(){
		$("#submbuy").click(function(){
			//绑定弹窗事件
			var __widowWidth = $(window).width();
			var __popWidth = $("#paymentDiv").width(); //Loading为要显示的div
			var __left = (__widowWidth - __popWidth)/2 + 'px';
			var __windowHeight = $(window).height();
			var __popHeight = $("#paymentDiv").height();
			var __top = (__windowHeight-__popHeight)/2 + 'px';
			$.blockUI({
				message: $('#paymentDiv'),
				css: {
					cursor: '',
					left:__left,
					width:__popWidth+'px',
					top:__top,position:'fixed' //居中
				},
				overlayCSS: {
					cursor : 'default'
				}
			});
			TourDetailUtils.isPaymentDivBlock = true;
		});
		$(".paymentDiv_close").click(function(){
			$.unblockUI();
			TourDetailUtils.isPaymentDivBlock = false;
		});
	},
	onReSize : function(){
		window.onresize = function() {
			if (!TourDetailUtils.isPaymentDivBlock)return;
			var __widowWidth = $(window).width();
			var __popWidth = $("#paymentDiv").width(); //Loading为要显示的div
			var __left = (__widowWidth - __popWidth) / 2 + 'px';
			var __windowHeight = $(window).height();
			var __popHeight = $("#paymentDiv").height();
			var __top = (__windowHeight - __popHeight) / 2 + 'px';
			$.blockUI({
				message: $('#paymentDiv'),
				css: {
					cursor: '',
					left: __left,
					width: __popWidth + 'px',
					top: __top, position: 'fixed' //居中
				},
				overlayCSS: {
					cursor: 'default'
				}
			});
		}
	},
	onKeyDown : function(){
		window.onkeydown = function(e){
			if(TourDetailUtils.isPaymentDivBlock && e.keyCode ==27){
				$.unblockUI();
				TourDetailUtils.isPaymentDivBlock = false;
			}
		}
	},
	getNewMonthLinkage : function(tourId,month,callback){
		$.ajax({
			type: "post",
			url:"/tourDetail/queryErpLinkage.html",
			dataType: 'json',
			async: false,
			data:{
				tourid:tourId,
				date:month
			},
			success: function(result){
				if(result.code==200){
					callback(result.data);
				}else{
					//TODO
					callback({pl_linkage:{"0h":0,"0l":0,"1h":0,"1l":0,"2h":0,"2l":0,"3h":0,"3l":0,"4h":0,"4l":0,"5h":0,"5l":0,"6h":0,"6l":0,"7h":0,"7l":0,"8h":0,"8l":0,"9h":0,"9l":0,"10h":0,"10l":0,"11h":0,"11l":0,"12h":0,"12l":0,"13h":0,"13l":0,"14h":0,"14l":0,"15h":0,"15l":0,"16h":0,"16l":0,"17h":0,"17l":0,"18h":0,"18l":0,"19h":0,"19l":0,"20h":0,"20l":0,"21h":0,"21l":0,"22h":0,"22l":0,"23h":0,"23l":0,"24h":0,"24l":0,"25h":0,"25l":0,"26h":0,"26l":0,"27h":0,"27l":0,"28h":0,"28l":0,"29h":0,"29l":0,"31h":0,"31l":0}});
				}
			},
			error: function(){
				callback({pl_linkage:{"0h":0,"0l":0,"1h":0,"1l":0,"2h":0,"2l":0,"3h":0,"3l":0,"4h":0,"4l":0,"5h":0,"5l":0,"6h":0,"6l":0,"7h":0,"7l":0,"8h":0,"8l":0,"9h":0,"9l":0,"10h":0,"10l":0,"11h":0,"11l":0,"12h":0,"12l":0,"13h":0,"13l":0,"14h":0,"14l":0,"15h":0,"15l":0,"16h":0,"16l":0,"17h":0,"17l":0,"18h":0,"18l":0,"19h":0,"19l":0,"20h":0,"20l":0,"21h":0,"21l":0,"22h":0,"22l":0,"23h":0,"23l":0,"24h":0,"24l":0,"25h":0,"25l":0,"26h":0,"26l":0,"27h":0,"27l":0,"28h":0,"28l":0,"29h":0,"29l":0,"31h":0,"31l":0}});

			}
		});
	},
	bindRemind : function () {
		var _this = this;
		//绑定到货提醒事件
		$(".product_remind").click(function () {
			$("#remind_phone").val("");
			$("#remind_email").val("");
			_this.unRemindMsg();
			$.blockUI({
				message: $('#remindDiv'),
				css: {
					top: '36%',
					left: '35%'
				},
				overlayCSS: {
					cursor: 'default'
				}
			});
		});
		$("#remind_close").on("click", function () {
			$.unblockUI();
		});


		$("#remind_phone").blur(function () {
			var value = $(this).val();
			if (value != "" && !common_isTelphone(value)) {
				_this.remindMsg("手机格式不正确");
				$(this).addClass("remind_error");
			} else {
				if (!$("#remind_email").hasClass("remind_error")) {
					_this.unRemindMsg();
				}
				$(this).removeClass("remind_error");
			}
		});

		$("#remind_email").blur(function () {
			var value = $(this).val();
			if (value != "" && !common_checkEmail(value)) {
				_this.remindMsg("邮箱格式不正确");
				$(this).addClass("remind_error");
			} else {
				if (!$("#remind_phone").hasClass("remind_error")) {
					_this.unRemindMsg();
				}
				$(this).removeClass("remind_error");
			}
		});

		$("#remind_submit").click(function () {
			var $phone = $("#remind_phone"),
				phoneVal = $phone.val(),
				$email = $("#remind_email"),
				emailVal = $email.val();
			if (phoneVal == "" && emailVal == "") {
				$.unblockUI();
				return
			}

			if ($("#login_error").hasClass("hwlayout_error")) {
				return;
			}

			$.ajax({
				type: "get",
				url: "/tourShortageNotify",
				dataType: 'json',
				data: {
					"tour_id": $("#tour_id").val(),
					phone: phoneVal,
					email: emailVal
				},
				success: function (result) {
					if (result.code == 200) {
						$.unblockUI();
					} else {
						$("#login_error").html("*" + result.data);
						$("#login_error").addClass("hwlayout_error");
					}
				}
			});

		});
	},

	fetchComment: function(pageNo) {
		$.ajax({
			url: '/user/viewCommentOrder.html?tourId=' + tourId + "&pageNo=" + pageNo + "&cache=" + new Date(),
			dataType: 'json',
			type: 'get',
			success: function(action) {
				if(action && action.status == 1) {
					var reviews = action.reviews;
					var totalNum = action.totalNum;
					var avg = action.avg;
					var pageNo = action.pageNo;
					if(totalNum > 0) {
						var orderLi = "<li id = 'order_li'><a href='#order_comment'>用户点评<span id='yhdpnum'>"+totalNum+"</span><b></b></a></li>";
						if($("#order_li").length==0){
							$("#tour_xg").before(orderLi);
						}

						var html = "<div class='content-title'>";
						html += "<div name='tour_yhdp' id='tour_yhdp' class='tour-maobiao'></div>";
						html += "<b></b><span class='title-big'>用户点评</span>";
						html += "</div>";
						html += "<div class='xgpf'>";
						html += "<div id='xzw_starSys' class='star floatL'>";
						html += "<div id='xzw_starBox'>";
						html += "<ul class='stars' id='star'>";
						html += "<li><a href='javascript:void()'  class='one-star'>1</a></li>";
						html += "<li><a href='javascript:void()'  class='one-star'>2</a></li>";
						html += "<li><a href='javascript:void()'  class='one-star'>3</a></li>";
						html += "<li><a href='javascript:void()'  class='one-star'>4</a></li>";
						html += "<li><a href='javascript:void()' class='one-star'>5</a></li>";
						html += "</ul>";
						html += "<div class='current-rating' id='showb' style='width:"+avg*20+"px'></div>";
						html += "</div></div>";
						html += "<span class='score'>"+avg+"分</span>";
						html += "<span cass='number'>  共"+totalNum+"条点评</span>";
						html += "</div>";

						html += "<div class='tour-box-content'>";

						for(var i = 0; i < reviews.length; i++) {
							var obj = reviews[i];

							var icon = "/res/images/tour/tour-dp-icon01.png";
							var tg = obj.totalgrade/20;
							var processgrade = obj.processgrade;
							var itemgrade = obj.itemgrade;
							var servicegrade = obj.servicegrade;
							var sir = "";
							if(itemgrade == 5) {
								sir = "非常棒，值得再去";
							} else if(itemgrade == 4) {
								sir = "还不错，去一次就行了";
							} else if(itemgrade == 3) {
								sir = "感觉一般般";
							}

							var spg = "";
							if(processgrade == 5) {
								spg = "非常棒";
							} else if(processgrade == 4) {
								spg = "很好";
							} else if(processgrade == 3) {
								spg = "还不错";
							} else if(processgrade == 2) {
								spg = "马马虎虎";
							} else if(processgrade == 1) {
								spg = "不满意";
							}

							var ssg = "";
							if(servicegrade == 5) {
								ssg = "非常棒";
							} else if(servicegrade == 4) {
								ssg = "很好";
							} else if(servicegrade == 3) {
								ssg = "还不错";
							} else if(servicegrade == 2) {
								ssg = "马马虎虎";
							} else {
								ssg = "不满意";
							}

							var flag = false;
							if(i == 0) {
								if(obj.isgood == 1) {
									flag = true;
									icon = "/res/images/tour/tour-dp-icon00.png";
									html += "<div class='infos-evaluate-top'>";
									html += "<dl>";
									html += "<dt><img src='/res/images/tour/tour-dp-icon00.png'/>";
									html += "<div class='name' style='overflow:hidden;height:22px;'>" + obj.finalName + " </div>";
									html += "<div class='time'>"+obj.createTime+"</div>";
									html += "</dt>";
									html += "<dd>";
									html += "<div class='dp-xj'>";
									html += "<div class='floatL dp-dp'>";//评论星级start
									html += "<div class='floatL'>点评：</div>";
									html += "<div id='xzw_starSys' class='star floatL'><div id='xzw_starBox'>";
									html += "<ul class='stars' id='star'>";
									html += "<li><a href='javascript:void()'  class='one-star'>1</a></li>";
									html += "<li><a href='javascript:void()'  class='one-star'>2</a></li>";
									html += "<li><a href='javascript:void()'  class='one-star'>3</a></li>";
									html += "<li><a href='javascript:void()'  class='one-star'>4</a></li>";
									html += "<li><a href='javascript:void()'  class='one-star'>5</a></li>";
									html += "</ul>";
									html += "<div class='current-rating' id='showb' style='width:"+obj.totalgrade+"px'></div>";
									html += "<div class='clear'></div>";
									html += "</div></div>";
									html += "</div>";//评论星级end
									html += "<div class='floatL ywxm'>游玩项目：<span>"+sir+"</span></div>";
									html += "<div class='floatL ywgc'>游玩过程：<span>"+spg+"</span></div>";
									html += "<div class='floatL ywgc'>游玩服务：<span>"+ssg+"</span></div>";
									html += "<div class='clear'></div>";
									html += "</div>";
									html += "<div>"+obj.review+"</div>"; //评论内容
									var imagesurl = obj.imagesurl;
									if(imagesurl) {
										var imgs = imagesurl.split(",");
										if(imgs.length > 0) {
											html += "<div class='imgs'><ul>";
											for(var j = 0; j < imgs.length;j++) {
												var imgPath = imgs[j];
												html += "<li  style='cursor:pointer' id='"+obj.id+"'>" +
												"<img class='select_commentimg' style='height:100%' data='"+obj.id+"' src='" + imageHead + "/" + imgPath +
												"'/><div id='show_"+obj.id+"' class=''></div></li>";
											}
											html += "</ul>";
											html += "<div class='clear'></div>";
											html += "<div class='imgsdetail' id='imgsdetail_"+obj.id+"' style='display:none'>";
											html += "<img  id='commentimg_"+obj.id+"' src='" + imageHead + "/" + imgs[0] + "'/>";
											html += "</div>" +
											"</div>";
										}
									}
									html += "<div class='hot'></div>";
									html += "</dd>";
									html += "</dl>";
									html += "</div>";
								}

								html += "<div class='infos-evaluate'>";
							} else if(tg >= 3 && tg < 4) {
								icon = "/res/images/tour/tour-dp-icon02.png";
							} else if(tg >= 0 && tg <= 2) {
								icon = "/res/images/tour/tour-dp-icon03.png";
							}

							if(!flag) {

								html += "<dl>";
								html += "<dt>";
								html += "<img src='"+icon+"' alt='' />";
								html += "<div class='name' style='overflow:hidden;height:22px;'>" + obj.finalName + " </div>";
								html += "<div class='time'>"+obj.createTime+"</div>";
								html += "</dt>";
								html += "<dd>";
								html += "<div class='dp-xj'>";
								html += "<div class='floatL dp-dp'>";//评论星级start
								html += "<div class='floatL'>点评：</div>";
								html += "<div id='xzw_starSys' class='star floatL'><div id='xzw_starBox'>";
								html += "<ul class='stars' id='star'>";
								html += "<li><a href='javascript:void()'  class='one-star'>1</a></li>";
								html += "<li><a href='javascript:void()'  class='one-star'>2</a></li>";
								html += "<li><a href='javascript:void()'  class='one-star'>3</a></li>";
								html += "<li><a href='javascript:void()'  class='one-star'>4</a></li>";
								html += "<li><a href='javascript:void()'  class='one-star'>5</a></li>";
								html += "</ul>";
								html += "<div class='current-rating' id='showb' style='width:"+obj.totalgrade+"px'></div>";
								html += "<div class='clear'></div>";
								html += "</div></div>";
								html += "</div>";//评论星级end

								html += "<div class='floatL ywxm'>游玩项目：<span>"+sir+"</span></div>";
								html += "<div class='floatL ywgc'>游玩过程：<span>"+spg+"</span></div>";
								html += "<div class='floatL ywgc'>游玩服务：<span>"+ssg+"</span></div>";
								html += "<div class='clear'></div>";
								html += "</div>";
								html += "<div>"+obj.review + "</div>"; //评论内容

								var imagesurl = obj.imagesurl;
								if(imagesurl) {
									var imgs = imagesurl.split(",");
									if(imgs.length > 0) {
										html += "<div class='imgs'><ul>";
										for(var j = 0; j < imgs.length;j++) {
											var imgPath = imgs[j];
											html += "<li  style='cursor:pointer' id='"+obj.id+"'>" +
											"<img class='select_commentimg' style='height:100%' data='"+obj.id+"' src='" + imageHead + "/" + imgPath +
											"'/><div id='show_"+obj.id+"' class=''></div></li>";
										}
										html += "</ul>";
										html += "<div class='clear'></div>";
										html += "<div class='imgsdetail' id='imgsdetail_"+obj.id+"' style='display:none'>";
										html += "<img  id='commentimg_"+obj.id+"' src='" + imageHead + "/" + imgs[0] + "'/>";
										html += "</div>" +
										"</div>";
									}
								}
								if(obj.isgood == 1) {

									html += "<div class='hot'></div>";
								} else {
									html += "<div class='hot'></div>";
								}
								html += "</dd></dl>";
							}
						}
						html += "</div>";
						var pageWith = 10;
						var totalPage = 1;
						if(totalNum%6 == 0) {
							totalPage = totalNum/6;
						} else {
							totalPage = totalNum/6+1;
						}
						totalPage = parseInt(totalPage);
						if(totalPage >= 2) {
							html += "<div class='page'>";
							if(pageNo == 1) {
								html += "<a href='javascript:void()'>上一页</a>&nbsp;";
							} else {
								html += "<a href='javascript:TourDetailUtils.fetchComment("+(pageNo - 1)+")'>上一页</a>&nbsp;";
							}
							if(totalPage > pageWith) {
								if((pageNo + 1) <= pageWith) {
									for(var i = 1; i < pageWith; i++) {
										if(pageNo == i) {
											html += "<a href='javascript:void()' class='hover'>"+pageNo+"</a>&nbsp;";
										} else {
											html += "<a href='javascript:TourDetailUtils.fetchComment("+i+")'>" + i + "</a>&nbsp;";
										}
									}
									if(pageNo == totalPage) {
										html += "<a href='javascript:void()' class='hover'>"+totalPage+"</a>";
									} else {
										html += "...<a href='javascript:TourDetailUtils.fetchComment(" + totalPage + ")'>" + totalPage + "</a>";
									}

								} else if(pageNo >= (totalPage - pageWith + 2)) {
									html += "<a href='javascript:TourDetailUtils.fetchComment(1)'>1</a>&nbsp;";
									for(var i = totalPage - pageWith + 1; i < totalPage; i++) {
										if(pageNo == i) {
											html += "<a href='javascript:void()' class='hover'>"+pageNo+"</a>&nbsp;";
										} else {
											html += "<a href='javascript:TourDetailUtils.fetchComment("+i+")'>" + i + "</a>&nbsp;";
										}
									}
									if(pageNo == totalPage) {
										html += "...<a href='javascript:void()' class='hover'>" + totalPage + "</a>";
									} else {
										html += "...<a href='javascript:TourDetailUtils.fetchComment(" + totalPage + ")'>" + totalPage + "</a>";
									}
								} else {
									html += "<a href='javascript:TourDetailUtils.fetchComment(1)'>1</a>&nbsp;";
									for(var i = pageNo; i < (pageNo + 1); i++) {
										if(pageNo == i) {
											html += "<a href='javascript:void()' class='hover'>"+pageNo+"</a>&nbsp;";
										} else {
											html += "<a href='javascript:TourDetailUtils.fetchComment("+i+")'>" + i + "</a>&nbsp;";
										}
									}
									if(pageNo == totalPage) {
										html += "<a href='javascript:void()' class='hover'>"+totalPage+"</a>";
									} else {

										html += "...<a href='javascript:TourDetailUtils.fetchComment(" + totalPage + ")'>" + totalPage + "</a>";
									}
								}
							} else {
								for(var i = 1; i <= totalPage; i++) {
									if(pageNo == i) {
										html += "<a href='javascript:void()' class='hover'>"+pageNo+"</a>&nbsp;";
									} else {
										html += "<a href='javascript:TourDetailUtils.fetchComment("+i+")'>" + i + "</a>&nbsp;";
									}
								}
							}

							if(pageNo < totalPage) {
								html += "<a href='javascript:TourDetailUtils.fetchComment("+(pageNo + 1)+")'>下一页</a>";
							} else {
								html += "<a href='javascript:void()'>下一页</a>";
							}

							html += "</div>";
						}
						html += "</div>";
						$(".tour-evaluate").show();
						$(".tour-evaluate").children().remove();
						$(".tour-evaluate").append(html);

						//给每个图片添加点击事件
						$(".select_commentimg").each(function(){
							$(this).click(function(){
								var src = $(this).attr("src");
								var id = $(this).attr("data");
								var cimg = $("#imgsdetail_" + id).attr("da");
								var currSrc = $("#commentimg_"+id).attr("src");
								if(cimg=="1" && src == currSrc) {
									$("#imgsdetail_"+id).hide();
									$("#imgsdetail_" + id).attr("da","0");
									$(this).parent("li").each(function(){
										$(this).removeClass("hover");
										$(this).children("div").removeClass("ponity_shadow");
									});
									return;
								}

								//去掉所有已经被展开的图片
								$(".imgs ul li").each(function() {
									$(this).removeClass("hover");
									$(this).children("div").removeClass("ponity_shadow");
									$("#imgsdetail_" + $(this).attr("id")).hide();
									$("#imgsdetail_" + $(this).attr("id")).attr("da","0");
								});

	//							$(this).parent("li").siblings().each(function(){
	//								$(this).removeClass("hover");
	//								$(this).children("div").removeClass("ponity_shadow");
	//
	//							});
								$("#imgsdetail_"+id).show();
								$("#commentimg_"+id).attr("src",src);
								$("#imgsdetail_" + id).attr("da","1");
								$(this).next().addClass("ponity_shadow");
								$(this).parent().addClass("hover");
							});
							$(".imgs li").each(function(){
								$(this).mousemove(function(){
									$(this).siblings().each(function(){
										var imgdetails = $("#imgsdetail_"+$(this).attr("id")).attr("da");
										var currSrc = $("#commentimg_"+$(this).attr("id")).attr("src");
										var src = $(this).children("img").attr("src");
										if(imgdetails != "1" || src != currSrc) {  //确保不会把当前选中的图片样式移除
											$(this).removeClass("hover");
										}
									});
									$(this).addClass("hover");
								}).mouseout(function(){
									var imgdetails = $("#imgsdetail_"+$(this).attr("id")).attr("da");
									var currSrc = $("#commentimg_"+$(this).attr("id")).attr("src");
									var src = $(this).children("img").attr("src");
									if(imgdetails != "1" || src != currSrc) {
										$(this).removeClass("hover");
									}
								});
							});
						});
					}
				}
			}
		});
	},
	fetchQA: function (pageNo) {
		$.ajax({
			url: '/fetchQAList?tourId=' + tourId + "&pageNo=" + pageNo + "&cache=" + new Date(),
			dataType: 'json',
			type: 'get',
			success: function (action) {
				var html = "<div class='content-title'>";
				html += "<b></b><span class='title-big'>问题咨询</span></div>";
				html += "<div class='tour-box-content'>";
				html += "<div class='infos-qa'> ";
				var hre = 'javascript:TourDetailUtils.addQuestion();';
				if (action && action.status == 1) {
					var qas = action.qas;
					var pageSize = action.pageSize;
					var pageNo = action.pageNo;
					var totalPage = action.totalPage;
					if (qas.length > 0) {
						$("#zxNum").show();
						$("#zxNum").html(action.totalSize);

						html += "<div class='btn'><a href="+hre+">我要提问</a></div>";
						for (var i = 0; i < qas.length; i++) {
							var obj = qas[i];
							var id = obj.id;
							var question = obj.question;
							var answer = obj.answer;
							var createTime = obj.createTime;
							var email = obj.email;
							var phone = obj.phone;
							html += "<dl>";
							html += "<dt>" + question;
							html += "<span>(" + (email ? email : phone) + " " + createTime + ")</span>";
							html += "</dt>";
							if (answer) {
								html += "<dd>客服回答：" + answer + "</dd>";
							}
							html += "</dl>";
						}
					} else {
						html += "<div class='empty-qa' style=''>对产品有任何疑问，请使用<a href="+hre+">在线提问</a>咨询，我们将第一时间进行答复。</div>";
					}
					html += "</div>";
					var pageWith = 10;
					if (totalPage > 1) {
						html += "<div class='page'>";
						if (pageNo == 1) {
							html += "<a href='javascript:void()'>上一页</a>&nbsp;";
						} else {
							html += "<a href='javascript:TourDetailUtils.fetchQA(" + (pageNo - 1) + ")'>上一页</a>&nbsp;";
						}
						if (totalPage > pageWith) {
							if ((pageNo + 1) <= pageWith) {
								for (var i = 1; i < pageWith; i++) {
									if (pageNo == i) {
										html += "<a href='javascript:void()' class='hover'>" + pageNo + "</a>&nbsp;";
									} else {
										html += "<a href='javascript:TourDetailUtils.fetchQA(" + i + ")'>" + i + "</a>&nbsp;";
									}
								}
								if (pageNo == totalPage) {
									html += "<a href='javascript:void()' class='hover'>" + totalPage + "</a>";
								} else {
									html += "...<a href='javascript:TourDetailUtils.fetchQA(" + totalPage + ")'>" + totalPage + "</a>";
								}

							} else if (pageNo >= (totalPage - pageWith + 2)) {
								html += "<a href='javascript:void()'>1</a>&nbsp;";
								for (var i = totalPage - pageWith + 1; i < totalPage; i++) {
									if (pageNo == i) {
										html += "<a href='javascript:void()' class='hover'>" + pageNo + "</a>&nbsp;";
									} else {
										html += "<a href='javascript:TourDetailUtils.fetchQA(" + i + ")'>" + i + "</a>&nbsp;";
									}
								}
								if (pageNo == totalPage) {
									html += "...<a href='javascript:void()' class='hover'>" + totalPage + "</a>";
								} else {
									html += "...<a href='javascript:TourDetailUtils.fetchQA(" + totalPage + ")'>" + totalPage + "</a>";
								}
							} else {
								html += "<a href='javascript:void()'>1</a>&nbsp;";
								for (var i = pageNo; i < (pageNo + 1); i++) {
									if (pageNo == i) {
										html += "<a href='javascript:void()' class='hover'>" + pageNo + "</a>&nbsp;";
									} else {
										html += "<a href='javascript:TourDetailUtils.fetchQA(" + i + ")'>" + i + "</a>&nbsp;";
									}
								}
								if (pageNo == totalPage) {
									html += "<a href='javascript:void()' class='hover'>" + totalPage + "</a>";
								} else {

									html += "...<a href='javascript:TourDetailUtils.fetchQA(" + totalPage + ")'>" + totalPage + "</a>";
								}
							}
						} else {
							for (var i = 1; i <= totalPage; i++) {
								if (pageNo == i) {
									html += "<a href='javascript:void()' class='hover'>" + pageNo + "</a>&nbsp;";
								} else {
									html += "<a href='javascript:TourDetailUtils.fetchQA(" + i + ")'>" + i + "</a>&nbsp;";
								}
							}
						}
						if (pageNo < totalPage) {
							html += "<a href='javascript:TourDetailUtils.fetchQA(" + (pageNo + 1) + ")'>下一页</a>";
						} else {
							html += "<a href='javascript:void()'>下一页</a>";
						}

						html += "</div>";
					}

				} else {
					html += "<div class='empty-qa' style=''>对产品有任何疑问，请使用<a href="+hre+">在线提问</a>咨询，我们将第一时间进行答复。</div></div>";
				}
				html += "</div>";
				$(".tour-qa").children().remove();
				$(".tour-qa").append(html);
				$(".tour-qa").show();
			},
			error: function () {

			}
		});
	},
	/**
	 * 产品详情悬浮、锚标
	 */
	detailFixed : function(){
		var $tournav = $(".tour-nav"),
			toTop = $("#tour_content_warp").offset().top,
			winTop = $(window).scrollTop(),
			navHeight = 54;
		$tournav.children().each(function(){
			$(this).on("click",function(){
				var $aTag = $(this).find("a");
				if($aTag.hasClass("hover")){
					return false;
				}
				$tournav.find(".hover").removeClass("hover");
				$aTag.addClass("hover");
				var targetId = $aTag.attr("href");
				$(window).scrollTop($(targetId).offset().top);
				return false;
			});
		});
		$(window).scroll(function(){
			winTop = $(window).scrollTop();
			if(winTop >= toTop + navHeight){
				$tournav.css({
					"position":"fixed",
					"top" : 0
				});
			} else {
				var $firstNav = $tournav.children().eq(0).find("a");
				if(!$firstNav.hasClass("hover")){
					$tournav.find(".hover").removeClass("hover");
					$firstNav.addClass("hover");
				}
				$tournav.css({
					"position":"static",
					"top" : "auto"
				});
			}
			//锚标签
			$tournav.children().each(function(){
				var targetId = $(this).find("a").attr("href");
				targettop = $(targetId).scrollTop();
				if($(targetId).offset().top  <= winTop + navHeight){
					//&& $(targetId).offset().top + $(targetId).parent().innerHeight() >= winTop +navHeight) {
					var $navEle = $("a[href="+targetId+"]");
					if(!$navEle.hasClass("hover")) {
						$tournav.find(".hover").removeClass("hover");
						$navEle.addClass("hover");
					}

				}
			});
		});


	},
	//客服相关
	customerService:function (){
		if($(".tour_related").length > 0){
			this.loadImg($(".tour_related"));
		}
		//在线客服
		$(".zxkfli").on("mouseenter",function () {
			$(".zaixiankefu").attr("style","display:block");
		});
		$(".zxkfli").on("mouseleave",function () {
			$(".zaixiankefu").attr("style","display:none");
		});
	},
	backToTop:function (){
		//点击图标时跳转
		$("#backToTop").click(function(){
			$('body,html').animate({scrollTop:0},800);
		});
		$(window).scroll(function () {
			if($(window).scrollTop() <300){
				$(".backToTop").hide();
			} else {
				$(".backToTop").show();
			}
		});
	},
	//添加问题
	addQuestion: function () {
		var useremail = $("#useremail").val();
    	var userphone = $("#userphone").val();
    	var str = userphone!=""?userphone:useremail!=""?useremail:"";
    	
    	if(str==""){//用户未登陆去跳转页
    		window.location.href="/signIn.html?targetUrl="+window.location.href+"?tour_zxtw";
    		return;
    	}
    	
		if ($("#askquestions").attr("id")) {
			$("#askquestions").show();
		} else {

			var html = "<div id='askquestions' class='hwlayout_box'><div class='hwlayout_box_text'><p class='fsize16'>在线提问<span class='fsize12'>(最长不能超过1000字)</span><p>";
			html += "<textarea id='question'></textarea>";
			html += "<p> <input type='text' value='"+str+"' id='contract'/> <span>我们的解答将通过你预留的联系方式直接发送给你。</span>";
			html += "</p>";
			html += "<p class='qabtn'>";
			html += "<input type='button' id='submit_question' value='提交问题' class='layout_btn_red'/>";
			html += "&nbsp;&nbsp;<input type='button' id='close_dialog' value='关闭' class='layout_btn_gray'/>";
			html += "</p></div></div>";
			var pos = $(document.body).position();
			var height = pos.height;
			height = height / 2 - 200;
			var question_dialog = $.layer({
				type: 1,
				offset: [height + 'px', ''],
				title: false, //不显示默认标题栏
				shadeClose: true, //开启点击遮罩关闭层
				closeBtn: false,
				area: ['680px', '400px'],
				page: {html: html}
			});
			$("#contract").focus(function () {
				var value = $(this).val();
				if (!value || "输入你的手机号/邮箱地址" == value) {
					$(this).val('');
				}
			}).blur(function () {
				var value = $(this).val();
				if (!value || "输入你的手机号/邮箱地址" == value) {
					$(this).val("输入你的手机号/邮箱地址");
				}
			});

			$("#submit_question").click(function () {
				var question = $("#question").val();
				var contract = $("#contract").val();
				if (!question || question.length < 4 || question.length > 1000) {
					layer.tips('问题的字数必须在4--1000之间', "#question", 2, 280, 0, ['background-color:#e10979; color:#fff', '#e10979']);
					return;
				}
				if (question && contract && "输入你的手机号/邮箱地址" != contract) {
					var email = "";
					var phone = "";
					var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					var phoneReg = /\d{11}/;
					if (emailReg.test(contract)) {
						email = contract;
					} else {
						if (phoneReg.test(contract)) {
							phone = contract;
						} else {
							layer.tips('您输入的联系方式不正确', "#contract", 2, 280, 0, ['background-color:#e10979; color:#fff', '#e10979']);
							return;
						}
					}
					$.ajax({
						url: '/questionTour',
						data: {'question': question, 'tourId': tourId, 'email': email, 'phone': phone},
						type: 'post',
						dataType: 'json',
						success: function (action) {
							if (action && action.status == 1) {
								layer.alert(action.msg, 1);
								layer.close(question_dialog);
							} else {
								var msg = action.msg;
								var target = "";
								if (action.status == -2) {
									target = "#question";
								} else if (action.status == -3) {
									target = "#contract";
								} else if (action.status == -1) {
									target = "#askquestions";
								}
								layer.tips(msg, target, 2, 280, 0, ['background-color:#e10979; color:#fff', '#e10979']);
							}
						}
					})
				} else {
					layer.tips('联系方式不能为空', "#contract", 2, 280, 0, ['background-color:#e10979; color:#fff', '#e10979']);
				}
			});

			//关闭弹出层
			$("#close_dialog").click(function () {
				layer.close(question_dialog);
			});
		}
	},
	typeTips: function(){
		$("#qijiashuoming").find(".type_tips").each(function () {

			$(this).on("mouseenter",function () {

				$(".tips_contentqjsm").attr("style","display:block");
			});
			$(this).parent().on("mouseleave",function () {
				$(".tips_contentqjsm").attr("style","display:none");

			})


		});
		$("#erciqueren").find(".type_tips").each(function () {

			$(this).on("mouseenter",function () {
				$(".tips_erciqueren").attr("style","display:block");
			});
			$(this).parent().on("mouseleave",function () {
				$(".tips_erciqueren").attr("style","display:none");
			})
		});
	}

};

var Director = (function(){
	/**
	 * Director
	 * @param tourId tourId
	 * @constructor
	 */
	function Director(tourId){
		this.tourId = tourId;
		//当前场景
		this.currentScence;

		this.currentDay = 0;

		this.memoryJudgeCodeL = 2147483647;
		this.memoryJudgeCodeH = 2147483647;

		//暂定
		this.linkage_dic;
		this.product;
		this.skuspec;

		//this.sellstart_dateMap={};
		//this.sellend_dateMap={};
		this.sellstart_date;
		this.sellend_date;

		this.skuPriceMap={};

		this.skuEle={};
		this.personEle={};
		//场景池
		this.scencePool={};

		//绑定弹窗事件
		TourDetailUtils.submbuyBind();

		TourDetailUtils.bindRemind();

		//TourDetailUtils.tourSlider();

		TourDetailUtils.fetchComment(1);

		TourDetailUtils.fetchQA(1);

		TourDetailUtils.detailFixed();

		TourDetailUtils.customerService();

		TourDetailUtils.backToTop();

		TourDetailUtils.typeTips();

		TourDetailUtils.onReSize();

		TourDetailUtils.onKeyDown();

	};

	Director.prototype.initialize = function(){
		var __this__ = this;
		TourDetailUtils.directorInitialize(this.tourId,function(data){
			__this__.linkage_dic = data.pl_linkage_dic;
			__this__.product = data.pl_product;
			__this__.skuspec = eval("("+data.pl_product.skuspec+")");
			var plSku = data.pl_sku;
			var tempMinDate=1000000;
			var tempMaxDate=0;
			for(var i = 0;i<plSku.length;i++){
				var priceInfo = eval("("+plSku[i].price_info+")");
				__this__.skuPriceMap[plSku[i].sku] = {};
				for (var pI in priceInfo){
					var firstP = priceInfo[pI];
					var s = firstP.s;
					var p = parseInt(firstP.p,'10');
					var mp = parseInt(firstP.mp,'10');
					if(s!=0 && p!=0 && mp!=0) {
						__this__.skuPriceMap[plSku[i].sku].p = parseInt(firstP.p,'10');
						__this__.skuPriceMap[plSku[i].sku].mp = parseInt(firstP.mp,'10');
						break;
					}
				}
				__this__.skuPriceMap[plSku[i].sku].sku_id=plSku[i].skuid;
				__this__.skuPriceMap[plSku[i].sku].min=plSku[i].min_num;
				__this__.skuPriceMap[plSku[i].sku].max=plSku[i].max_num;
				//__this__.sellstart_dateMap[plSku[i].sku] = plSku[i].sellstart_date;
				//__this__.sellend_dateMap[plSku[i].sku] = plSku[i].sellend_date;
				if(plSku[i].sellstart_date) {
					var thisMinDate = (parseInt(plSku[i].sellstart_date.substr(0, 4),'10') * 100 + parseInt(plSku[i].sellstart_date.substr(5, 2),'10'));
					if (thisMinDate < tempMinDate)tempMinDate = thisMinDate;
				}
				if(plSku[i].sellend_date) {
					var thisMaxDate = (parseInt(plSku[i].sellend_date.substr(0, 4),'10') * 100 + parseInt(plSku[i].sellend_date.substr(5, 2),'10'));
					if (thisMaxDate > tempMaxDate)tempMaxDate = thisMaxDate;
				}
			}

			var mmppMinPriceMap = {};

			for(var mmpp in __this__.skuPriceMap){
				if(!__this__.skuPriceMap[mmpp].p || __this__.skuPriceMap[mmpp].p==0)continue;
				var thisKey = mmpp.substr(0,2);
				if(!mmppMinPriceMap[thisKey]){
					 mmppMinPriceMap[thisKey]=__this__.skuPriceMap[mmpp].p;
				}else{
					if(__this__.skuPriceMap[mmpp].p<mmppMinPriceMap[thisKey]){
						mmppMinPriceMap[thisKey]=__this__.skuPriceMap[mmpp].p;
					}
				}
			}

			//TODO 取start_date、end_date极限值
			__this__.sellstart_date = (tempMinDate+"").substr(0,4)+"-"+(tempMinDate+"").substr(4,2);
			__this__.sellend_date = (tempMaxDate+"").substr(0,4)+"-"+(tempMaxDate+"").substr(4,2);
			var linkage_dic = __this__.linkage_dic;
			//============================ render ======================================
			var skuspec = __this__.skuspec;
			var lHtml = "",rHtml = "";
			//Insert buyTotal 出游人群
			//var buyTotal = '<ul><li><span class="buy-grey">出游人群：</span>';
			for (var i = 0;i<skuspec.length;i++){

				var thisSkuSpec = skuspec[i];
				if(thisSkuSpec.skutype!=1){
					lHtml+='<div class="sku-sel"> <div class="title">'+thisSkuSpec.skuname+'：</div><div class="text">';
					for(var j = 0;j<thisSkuSpec.skuitem.length;j++){
						lHtml+='<span>'+thisSkuSpec.skuitem[j].spec+'</span>';
					}
					lHtml+='</div></div>';
				}else{
					var rHtmlFirstPersonDefaultCount = true;
					for(var j = 0;j<thisSkuSpec.skuitem.length;j++){
						var thisAge = thisSkuSpec.skuitem[j];
						var isFirstPersonCount =0;
						if(rHtmlFirstPersonDefaultCount){
							isFirstPersonCount=1;
							rHtmlFirstPersonDefaultCount=false;
						}
						if(thisAge.explain!=""){
							rHtml += ' <div class="field-select">' +
							'<div class="field-type" travellertype="' + thisAge.travellerType + '" person="' + thisAge.spec + '"> ' + thisAge.spec + '<span class="field-range">(' + thisAge.explain + ')</span>' +
							'</div> <div class="num-counter"><span class="reduce">-</span> <input readonly="true" value="' +
							 isFirstPersonCount+
							'"> <span class="add">+</span></div>' +
							'<div class="field-price"><em style="display: inline;">&nbsp;¥' + '</em></div></div>';
							//buyTotal+="<span class='en'>"+thisAge.spec+"</span> / ";
						}
					}
				}
			}
			//$("#showBuyHtml .rq").html(buyTotal.substr(0,buyTotal.length-3)+"</li></ul>");
			//Insert buyTotal 出游人群

			$skuSelect = $("#skuSelect");
			$fieldText = $("#field-text");
			$skuSelect.html(lHtml);
			$fieldText.html(rHtml);
			$skuSelect.find("span").each(function(){
				var itsHtml = $(this).html();
				var dicNum = linkage_dic[itsHtml];
				__this__.skuEle["$"+dicNum] = new Spirit(itsHtml,dicNum,$(this));
				$(this).click(function(){
					if($(this).hasClass("hover")){
						$(this).removeClass("hover");
					}else{
						$(this).parent().find("span").removeClass("hover");
						$(this).addClass("hover");
					}
					__this__.shader();
				});
			});
			$fieldText.find(".field-type").each(function(){
				var itsHtml = $(this).attr("person");
				var dicNum = linkage_dic[itsHtml];
				__this__.personEle["$"+dicNum] = new Spirit(itsHtml,dicNum,$(this).parent());
			});

			for(var mmmppp in __this__.personEle){
				__this__.personEle[mmmppp].$Ele.attr("minPrice",mmppMinPriceMap[__this__.personEle[mmmppp].name]);
			}

			$fieldText.find(".field-select").each(function(){
				var $input = $(this).find("input");
				$(this).find(".reduce").click(function(){
					var count = parseInt($input.val(),'10');
					var min = parseInt($(this).parent().parent().attr("min"),'10');
					var max = parseInt($(this).parent().parent().attr("max"),'10');
					if(isNaN(max)||isNaN(min))return;
					if(count==min) {
						$input.val(0);
						__this__.shader();
					}else if(count>min){
						$input.val(count-1);
						__this__.shader();
					}else if(count!=0 && count<min-1){
						$input.val(min);
						__this__.shader();
					}
				});
				$(this).find(".add").click(function(){
					var count = parseInt($input.val(),'10');
					var min = parseInt($(this).parent().parent().attr("min"),'10');
					var max = parseInt($(this).parent().parent().attr("max"),'10');
					if(isNaN(max)||isNaN(min))return;
					if(count == 0){
						$input.val(min);
						__this__.shader();
					}else if(count<max){
						$input.val(count+1);
						__this__.shader();
					}else if(count>max+1){
						$input.val(max);
						__this__.shader();
					}
				});
			});



		});



		$("#buyNow").click(function() {
			var $ddd = $("#myDateTime .selected");
			if($ddd.length==0){
				$("#errorTips").show().empty().html('<p><b class="tips"></b> 请选使用日期</p>');
				setTimeout(function (){
					$("#errorTips").hide();
				}, 2000);
				return ;
			}

			var allAreZeroFlag = true;
			var flag = true;
			$("#field-text div[travellertype]").each(function() {
				var personT = $(this).attr("travellertype") + "";
				var inputV=	$(this).parent().find("input").val();
				var minP=$(this).parent().find("input").attr("min");
				if(inputV != "0"){
					allAreZeroFlag = false;
				}
				if (personT === "1") {
					$("#adult_num").val(inputV);
				} else {
					if(inputV!="0"&&(0<parseInt(inputV,'10')<parseInt(minP,'10'))){
						$("#errorTips").show().empty().html('<p><b class="tips"></b>最小购买数量必须为:'+minP +'</p>');
						setTimeout(function (){
							$("#errorTips").hide();
						}, 2000);
						flag = false;
						return ;
					}
					if (personT === "2") {
						$("#child_num").val(inputV);
					} else if (personT === "3") {
						$("#baby_num").val(inputV);
					} else if (personT === "4") {
						$("#older_num").val(inputV);
					}
				}
			});
			if(!flag){
				return ;
			}
			if(allAreZeroFlag){
				$("#errorTips").show().empty().html('<p><b class="tips"></b>最小购买数量必须不全为0</p>');
				setTimeout(function (){
					$("#errorTips").hide();
				}, 2000);
				flag = false;
				return ;
			}
			var ddd = parseInt($ddd.html(),'10');
			var start_time = __this__.currentScence.month+((ddd<10)?"-0":"-")+ddd;

			var personEle = __this__.personEle;
			var totalPrice = 0;
			for(var pE in personEle){
				var thisPE = personEle[pE];
				if(!thisPE.$Ele.hasClass("disablePerson")){
					var aPrice = thisPE.$Ele.attr("p");
					var count = thisPE.$Ele.find("input").val();
					totalPrice+=aPrice*count;
				}
			}

			var eachSkuFlag = true;
			$("#skuSelect .sku-sel").each(function(){
				if($(this).find(".hover").size()<1){
					eachSkuFlag = false;
				}
			});
			if(!eachSkuFlag){
				$("#errorTips").show().empty().html('<p><b class="tips"></b>请检查您的预订选项!</p>');
				setTimeout(function (){
					$("#errorTips").hide();
				},2000);
				return;
			}


			var skuRear = "";
			var skuEle = __this__.skuEle;
			for(var sE in skuEle){
				if(skuEle[sE].$Ele.hasClass("hover")){
					skuRear+="+"+skuEle[sE].name;
				}
			}
			var skuFlag = true;
			$("#field-text div[travellertype]").each(function(){
				var aSkuName = $(this).attr("person")+skuRear;
				if(__this__.skuPriceMap[aSkuName] && skuFlag){
					$("#sku_id").val(__this__.skuPriceMap[aSkuName].sku_id);
					skuFlag = false;
				}
			});
			if(skuFlag){
				$("#errorTips").show().empty().html('<p><b class="tips"></b>请检查您的预订选项!</p>');
				setTimeout(function (){
					$("#errorTips").hide();
				},2000);
				return;
			}

			$("#start_time").val(start_time);
			$("#total_amt").val(totalPrice);
			// 显示longding中
			$.blockUI({ // 购买中...
				message : $('#load_img'),
				css : {
					top : '36%',
					left : '45%',
					width : 'auto'
				}
			});
			$("#middle_page").val($(".fm").serialize());
			$("#submit_middle").submit();
		});

		return this;
	};

	/**
	 * 日历的布局显示
	 * director.render(month)
	 * @param month YYYY-MM
	 * @returns scence
	 */
	Director.prototype.render = function(month){
		var __this__ = this;
		var newScence = this.scencePool[month];
		if(!newScence){
			newScence = new Scence(this.tourId,month);
			this.scencePool[month]=newScence;
		}

		this.memoryJudgeCodeL = 2147483647;

		var eleSpirits = {};
		//=================== render start =======================
		var fullYear = parseInt(month.substr(0,4),'10'),thisMonth = parseInt(month.substr(5,2),'10');
		var first_d  = new Date(fullYear,thisMonth-1,1).getDay(),all_d   = new Date(fullYear,thisMonth,0).getDate();
		//if(all_d<this.currentDay)this.currentDay=0;
		var calendarHtml='<div class="year-month"><span class="month-lft"><b></b></span><span class="month-fc"></span>'+fullYear+'年'+thisMonth+'月 <span class="month-rgt"><b></b></span></div>' +
			'<table border="0" cellspacing="0" cellpadding="0"  bgcolor="#ffffff"><tr>' +
			'<td >日</td><td >一</td><td >二</td><td >三</td><td >四</td><td >五</td><td >六</td>';
		for(var i=0;i<((all_d+first_d)==28?28:(all_d+first_d)<36?35:42);i++){
			if(i%7==0)
				calendarHtml+="</tr><tr>";
			calendarHtml+='';
			if(first_d<=i&&i<(all_d+first_d)){
				var i_d=i-first_d+1;
				calendarHtml+="<td class='usable'>"+i_d+"</td>";
			}else{
				calendarHtml+="<td>&nbsp;</td>";
			}
		}
		var $myDateTime = $("#myDateTime");
		$myDateTime.html(calendarHtml+"</tr></table>");


		//=================== render   end =======================
		$myDateTime.find(".month-lft").click(function(){
			if(__this__.sellstart_date==__this__.currentScence.month)return;
			if(thisMonth==1){
				__this__.render((fullYear-1)+"-12");
			}else{
				__this__.render(fullYear+(thisMonth<11?"-0":"-")+(thisMonth-1));
			}
		});
		$myDateTime.find(".month-rgt").click(function(){
			if(__this__.sellend_date==__this__.currentScence.month)return;
			if(thisMonth==12){
				__this__.render((fullYear+1)+"-01");
			}else{
				__this__.render(fullYear+(thisMonth<9?"-0":"-")+(thisMonth+1));
			}
		});

		$myDateTime.find("td[class]").each(function(){
			var itsHtml = $(this).html();
			eleSpirits["$"+itsHtml] = new Spirit(itsHtml,itsHtml,$(this));
			$(this).click(function(){
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
					__this__.currentDay = 0;
				}else{
					if(__this__.currentDay!=0 && __this__.currentScence.dayEle["$"+__this__.currentDay]) {
						__this__.currentScence.dayEle["$"+__this__.currentDay].$Ele.removeClass("selected");
					}
					__this__.currentDay = $(this).html();
					__this__.currentScence.dayEle["$"+__this__.currentDay].$Ele.addClass("selected");
				}
				__this__.shader();
			});
		});
		newScence.assignSpirits(eleSpirits);
		if(all_d>=this.currentDay && this.currentDay>0){
			eleSpirits["$"+this.currentDay].$Ele.addClass("selected");
		}


		this.currentScence = newScence;
		this.shader();
		return newScence;
	};

	/**
	 * shader 刷新 设置 可用不可用
	 */
	Director.prototype.shader = function(){
		var needReShaderFlag = true;
		var __this__ = this;
		var dayEle = this.currentScence.dayEle;
		var linkage = this.currentScence.linkage;
		var skuEle = this.skuEle;
		var personEle = this.personEle;
		var judgeSet = [];
		var judgeResultL = linkage["0l"];
		var judgeResultH = linkage["0h"];

		var updatePrice = "";

		if(this.currentDay!=0) {
			judgeSet.push(this.currentDay);
		}

		for(var sE in skuEle){
			if(skuEle[sE].$Ele.hasClass("hover")){
				judgeSet.push(skuEle[sE].linkage);
				updatePrice+="+"+skuEle[sE].name;
			}
		}
		//linkage_dic对应linkage数据的取逻辑与（高地位分别）
		for(var i = 0;i<judgeSet.length;i++){
			if(judgeSet[i]) {
				var lAge = linkage[judgeSet[i] + "l"];
				var hAge = linkage[judgeSet[i] + "h"];
				if(lAge && hAge) {
					judgeResultL &= linkage[judgeSet[i] + "l"];
					judgeResultH &= linkage[judgeSet[i] + "h"];
				}
			}
		}

		var changedJudgeResultH = this.memoryJudgeCodeH^judgeResultH;
		var changedJudgeResultL = this.memoryJudgeCodeL^judgeResultL;
		var cur=1;
		for (var i=0;i<31;i++){
			if((changedJudgeResultL&cur)!=0) {
				var thisEleSpirit = dayEle["$"+(i+1)];
				if(!thisEleSpirit)continue;
				var thisEle = thisEleSpirit.$Ele;
				if((judgeResultL&cur)!=0){
					//置为可用
					thisEle.removeClass("nousable").addClass("usable").removeAttr("style");
					thisEle.click(function(){
						if($(this).hasClass("selected")){
							$(this).removeClass("selected");
							__this__.currentDay = 0;
						}else{
							if(__this__.currentDay!=0) {
								__this__.currentScence.dayEle["$"+__this__.currentDay].$Ele.removeClass("selected");
							}
							__this__.currentDay = $(this).html();
							__this__.currentScence.dayEle["$"+__this__.currentDay].$Ele.addClass("selected");
						}
						__this__.shader();
					});
				}else{
					//置为不可用
					if(thisEle.hasClass("selected")) {
						thisEle.removeClass("selected");
						//__this__.currentDay = 0;
					}
					thisEle.removeClass("usable").addClass("nousable").css({"cursor":"auto"}).unbind();
				}
			}

			if((changedJudgeResultH&cur)!=0) {
				var skuE = skuEle["$"+(i+32)];
				var personE = personEle["$"+(i+32)];
				if((judgeResultH&cur)!=0){
					//置为可用
					if(skuE){
						skuE.$Ele.css({"cursor":"pointer"}).removeClass("disableSku").click(function(){
							if($(this).hasClass("hover")){
								$(this).removeClass("hover");
							}else{
								$(this).parent().find("span").removeClass("hover");
								$(this).addClass("hover");
							}
							__this__.shader();
						});
					}
					if(personE){
						personE.$Ele.removeClass("disablePerson");
					}
				}else{
					//置为不可用
					//$(this).css({"cursor":"auto"}).unbind();
					if(skuE){
						if(skuE.$Ele.hasClass("hover")){
							skuE.$Ele.removeClass("hover");
							needReShaderFlag = false;
						}
						skuE.$Ele.css({"cursor":"auto"}).addClass("disableSku").unbind();
					}
					if(personE){
						personE.$Ele.addClass("disablePerson");
					}
				}
			}
			cur<<=1;
		}

		//min_days_before_book


		var tempD=new Date();
		tempD.setDate(tempD.getDate()+min_days_before_book);
		var tempM=tempD.getMonth();
		//var willDate = new Date(tempD.getFullYear()+'-'+tempM+'-'+tempD.getDate());
		var willDate = new Date();
		willDate.setUTCFullYear(tempD.getFullYear(), tempM, tempD.getDate());
		willDate.setUTCHours(0, 0, 0, 0);
		var willYear = willDate.getFullYear();
		var willMonth = willDate.getMonth()+1;
		var willDay = willDate.getDate();

		var currentYear = parseInt(__this__.currentScence.month.substr(0,4),'10');
		var currentMonth = parseInt(__this__.currentScence.month.substr(5,2),'10');
		if((willYear==currentYear&&currentMonth<willMonth)||currentYear<willYear) {
			//全不可
			for(var theEle in __this__.currentScence.dayEle){
				var $theEle = __this__.currentScence.dayEle[theEle];
				if($theEle.$Ele.hasClass("selected")) {
					$theEle.$Ele.removeClass("selected");
					__this__.currentDay = 0;
				}
				$theEle.$Ele.removeClass("usable").addClass("nousable").css({"cursor":"auto"}).unbind();
			}
		}else if((willYear==currentYear&&currentMonth==willMonth)){
			//部分不可
			for(var theEle in __this__.currentScence.dayEle){
				var $theEle = __this__.currentScence.dayEle[theEle];
				if($theEle.linkage<willDay) {
					if ($theEle.$Ele.hasClass("selected")) {
						$theEle.$Ele.removeClass("selected");
						__this__.currentDay = 0;
					}
					$theEle.$Ele.removeClass("usable").addClass("nousable").css({"cursor": "auto"}).unbind();
				}
			}
		}


		for(var updatePriceEle in personEle){

			var thisPrice = this.skuPriceMap[personEle[updatePriceEle].name+updatePrice];
			if(thisPrice) {
				personEle[updatePriceEle].$Ele.attr("p", thisPrice.p);
				personEle[updatePriceEle].$Ele.attr("mp", thisPrice.mp);

				personEle[updatePriceEle].$Ele.attr("min", thisPrice.min);
				personEle[updatePriceEle].$Ele.attr("max", thisPrice.max);

				personEle[updatePriceEle].$Ele.attr("minPrice", thisPrice.minPrice);
			}else{
				personEle[updatePriceEle].$Ele.attr("p", 0);
				personEle[updatePriceEle].$Ele.attr("mp", 0);
				//personEle[updatePriceEle].$Ele.attr("min", 1);
				//personEle[updatePriceEle].$Ele.attr("max", 1);
			}

		}
		this.memoryJudgeCodeL = judgeResultL;
		this.memoryJudgeCodeH = judgeResultH;

		//TODO 绘制右上角

		var text =this.currentDay==0?'<p>使用日期：<span style="color:#f52e4b;">* 请选择</span></p>':'<p >使用日期：'+this.currentScence.month.replace("-","年")+'月'+this.currentDay+'日</p>';
		$("#skuSelect").find(".sku-sel").each(function (){
			var title=	$(this).find(".title").text();
			text +="<p>"+title+"<span >"+$(this).find(".hover").text()+"</span></p>";
		});
		$("#tripInfo").html(text);


		this.refreshPrice();

		if(!needReShaderFlag){
			__this__.shader();
		}
	};

	Director.prototype.refreshPrice = function(){
		var personEle = this.personEle;
		var totalMarketPrice = 0;
		var totalPrice = 0;
		var firstFlag = true;
		var firstTotal = 0;
		for(var pE in personEle){
			var thisPE = personEle[pE];
			if(!thisPE.$Ele.hasClass("disablePerson")){
				var aPrice = thisPE.$Ele.attr("p");
				var aMPrice = thisPE.$Ele.attr("mp");
				var count = parseInt(thisPE.$Ele.find("input").val(),'10');

				var aMin = parseInt(thisPE.$Ele.attr("min"),'10');
				var aMax = parseInt(thisPE.$Ele.attr("max"),'10');
				if(aMin && aMax && aMin!=0 && aMax!=0 && count!=0){
					if(count<aMin){count=aMin;thisPE.$Ele.find("input").val(count);}
					if(count>aMax){count=aMax;thisPE.$Ele.find("input").val(count);}
				}

				if(aMPrice==0){
					//TODO minPrice
					var thisMinPrice = thisPE.$Ele.attr("minPrice");
					if(thisMinPrice && thisMinPrice!=0){
						thisPE.$Ele.find("em").html("¥ "+thisMinPrice);
						if(firstFlag) {
							firstTotal = thisMinPrice;
							firstFlag = false;
						}
					}else {
						thisPE.$Ele.find("em").html("¥ 0");
					}
				}else{
					thisPE.$Ele.find("em").html(" ¥ "+(aPrice));
				}
				totalMarketPrice+=aMPrice*count;
				totalPrice+=aPrice*count;
			}else{
				thisPE.$Ele.find("em").html(" ¥ 0");
			}
		}
		if(totalPrice==0){
			$("#totalMoney").html("总价 <b>¥"+firstTotal+"</b>");
			$("#savingMoney").html("共为您节省： ");
		}else{
			$("#totalMoney").html("总价 <b>¥"+totalPrice+"</b>");
			$("#savingMoney").html("共为您节省： <span>¥ "+(totalMarketPrice-totalPrice)+"</span>");
		}

	};


	//============================================================
	return Director;
})();

var Scence = (function(){


	/**
	 * Scence
	 * @param tourId tourId
	 * @param month month
	 * @constructor
	 */
	function Scence(tourId,month){
		this.dayEle = {};
		this.month = month;
		var __this__ = this;
		TourDetailUtils.getNewMonthLinkage(tourId,month,function(data){
			__this__.linkage = data.pl_linkage;
		});
	};


	Scence.prototype.assignSpirits = function(eleSpiris){
		this.dayEle = eleSpiris;
		//this.dayEle.$1.$Ele.html("ok");
	};


	//======================================================
	return Scence;
})();

var Spirit = (function(){
	/**
	 * Spirit
	 * @param name innerHTML
	 * @param linkage lin编号
	 * @param $Spirit DOM实体
	 * @constructor
	 */
	function Spirit(name,linkage,$Ele){
		//innerHTML
		this.name = name;
		//lin编号
		this.linkage = linkage;
		//DOM实体
		this.$Ele = $Ele;
	};



	//======================================================
	return Spirit;
})();







/*
 var director = new Director(tourId);
 director.initialize();
 var nowMonthDate = new Date();
 var nowYear = nowMonthDate.getFullYear();
 var nowMonth = nowMonthDate.getMonth()
 var startYear = parseInt(director.sellstart_date.substr(0,4));
 var startMonth = parseInt(director.sellstart_date.substr(5,2));
 var endYear = parseInt(director.sellend_date.substr(0,4));
 var endMonth = parseInt(director.sellend_date.substr(5,2));
 if((startYear==nowYear&&startMonth>nowMonth)||startYear>nowYear) {
 director.render(director.sellstart_date);
 }else if((endYear==nowYear&&endYear<nowYear)||endYear<nowYear){
 director.render(director.sellend_date);
 }else{
 director.render(nowYear + (nowMonth < 10 ? "-0" : "-") + (nowMonth + 1));
 }
 */