$(document).ready(function(){
	
	
	
	//清除登陆信息。
	$("#uloginout").click(function() {
		  $.cookie("uloginflag", null,{path:'/'});
		  $.cookie("uloginpowerid", null,{path:'/'});
	});
	  
	var thisPageUrl=window.location.href;
	if('true'== $.cookie("uloginflag")){
		  loginMemue($.cookie("uloginpowerid"),thisPageUrl);
	}else{
		$.ajax({
			type:"post",
			url:'/getLoginUserInfo?v='+Math.random(),
			dataType: 'json',
			async : true, 
			success: function(json){
				  if(json.code==200){
					  $.cookie("uloginflag", "true",{path:'/'});
					  loginMemue(json.data.power_id,thisPageUrl);
				  }else{
					  $('#au_login').hide();
					  $('#un_login').show();
				  }
				  
			}
		});
	}

	
	//app下载广告，关闭后1年不显示。
	if(1== $.cookie("closeAppAd")){
		  $('#footer-app-download-div').hide();
	}else{
		 $('#footer-app-download-div').show();
	}
	$("#footer_app_phone_del").click(function() {
		  var date = new Date();  
       date.setTime(date.getTime() + (365*24 * 60 * 60 * 1000)); 
		  $.cookie("closeAppAd", 1,{ path: '/', expires: date });
		  $('#footer-app-download-div').hide();
	});
	
	
	
});

function loginMemue(power_id,thisPageUrl){
	  $('#au_login').show();
	  $('#un_login').hide();
	  
	  if(thisPageUrl.indexOf("userOrderList")!=-1||thisPageUrl.indexOf("userInfo")!=-1
			  ||thisPageUrl.indexOf("userOrderDetail")!=-1||thisPageUrl.indexOf("userPassword")!=-1
			  ||thisPageUrl.indexOf("userCoupons")!=-1||thisPageUrl.indexOf("userTravel")!=-1){
		  
		  $('#U_ROLE_USER').addClass("topbar_hover");
	  }else{
		  $('#U_ROLE_USER').addClass("widthB");
	  }
}

/**
 * hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 **/
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = jQuery.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type == "mouseenter"
            if (e.type == "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);

/*
 * jQuery Superfish Menu Plugin - v1.7.4
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

;(function ($) {
	"use strict";

	var methods = (function () {
		// private properties and methods go here
		var c = {
				bcClass: 'sf-breadcrumb',
				menuClass: 'sf-js-enabled',
				anchorClass: 'sf-with-ul',
				menuArrowClass: 'sf-arrows'
			},
			ios = (function () {
				var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
				if (ios) {
					// iOS clicks only bubble as far as body children
					$(window).load(function () {
						$('body').children().on('click', $.noop);
					});
				}
				return ios;
			})(),
			wp7 = (function () {
				var style = document.documentElement.style;
				return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
			})(),
			toggleMenuClasses = function ($menu, o) {
				var classes = c.menuClass;
				if (o.cssArrows) {
					classes += ' ' + c.menuArrowClass;
				}
				$menu.toggleClass(classes);
			},
			setPathToCurrent = function ($menu, o) {
				return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
					.addClass(o.hoverClass + ' ' + c.bcClass)
						.filter(function () {
							return ($(this).children(o.popUpSelector).hide().show().length);
						}).removeClass(o.pathClass);
			},
			toggleAnchorClass = function ($li) {
				$li.children('a').toggleClass(c.anchorClass);
			},
			toggleTouchAction = function ($menu) {
				var touchAction = $menu.css('ms-touch-action');
				touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
				$menu.css('ms-touch-action', touchAction);
			},
			applyHandlers = function ($menu, o) {
				var targets = 'li:has(' + o.popUpSelector + ')';
				if ($.fn.hoverIntent && !o.disableHI) {
					$menu.hoverIntent(over, out, targets);
				}
				else {
					$menu
						.on('mouseenter.superfish', targets, over)
						.on('mouseleave.superfish', targets, out);
				}
				var touchevent = 'MSPointerDown.superfish';
				if (!ios) {
					touchevent += ' touchend.superfish';
				}
				if (wp7) {
					touchevent += ' mousedown.superfish';
				}
				$menu
					.on('focusin.superfish', 'li', over)
					.on('focusout.superfish', 'li', out)
					.on(touchevent, 'a', o, touchHandler);
			},
			touchHandler = function (e) {
				var $this = $(this),
					$ul = $this.siblings(e.data.popUpSelector);

				if ($ul.length > 0 && $ul.is(':hidden')) {
					$this.one('click.superfish', false);
					if (e.type === 'MSPointerDown') {
						$this.trigger('focus');
					} else {
						$.proxy(over, $this.parent('li'))();
					}
				}
			},
			over = function () {
				var $this = $(this),
					o = getOptions($this);
				clearTimeout(o.sfTimer);
				$this.siblings().superfish('hide').end().superfish('show');
			},
			out = function () {
				var $this = $(this),
					o = getOptions($this);
				if (ios) {
					$.proxy(close, $this, o)();
				}
				else {
					clearTimeout(o.sfTimer);
					o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
				}
			},
			close = function (o) {
				o.retainPath = ($.inArray(this[0], o.$path) > -1);
				this.superfish('hide');

				if (!this.parents('.' + o.hoverClass).length) {
					o.onIdle.call(getMenu(this));
					if (o.$path.length) {
						$.proxy(over, o.$path)();
					}
				}
			},
			getMenu = function ($el) {
				return $el.closest('.' + c.menuClass);
			},
			getOptions = function ($el) {
				return getMenu($el).data('sf-options');
			};

		return {
			// public methods
			hide: function (instant) {
				if (this.length) {
					var $this = this,
						o = getOptions($this);
					if (!o) {
						return this;
					}
					var not = (o.retainPath === true) ? o.$path : '',
						$ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
						speed = o.speedOut;

					if (instant) {
						$ul.show();
						speed = 0;
					}
					o.retainPath = false;
					o.onBeforeHide.call($ul);
					//$ul.delay(6000).attr("style","display:none");
					//$ul.clearQueue().delay(200).hide(0);
					$ul.hide(0);
					/*$ul.stop(true, true).animate(o.animationOut, speed, function () {
						var $this = $(this);
						o.onHide.call($this);
					});*/
				}
				return this;
			},
			show: function () {
				var o = getOptions(this);

				if (!o) {
					return this;
				}
                if(o.hoverStyle){
                    var $parent = this.parent().parent();
                    var $children = this.children("ul");
                    var leftHeight = $parent.height();
                    
                    var rightHeight = $children.height();
                    if(rightHeight > leftHeight){
                        var selfHeight = this.innerHeight();
                        //处于第几个
                        var curIndex = $parent.children().children().index(this);

                        var marginTop = selfHeight * curIndex;
                        if(o.toTopMargin){
                            marginTop += o.toTopMargin;
                        }
                        $children.css({
                           // "margin-top" : "-" + marginTop + "px"
                        });
                    } else {
                        this.children("ul").css(o.hoverStyle);
                    }
                }
              //  alert(o.hoverClass)
				var $this = this.addClass(o.hoverClass),
					$ul = $this.children(o.popUpSelector);
				if(this.find("ul").attr("class")==="Europe"){//欧洲的城市过多，
					this.find("ul").css({"height":"530px"});	
				}
               // alert(this.html())
				o.onBeforeShow.call($ul);
				//$ul.delay(6000).attr("style","display:block");
				//$ul.clearQueue().delay(200).show(0);
				$ul.show(0);
				/*$ul.stop(true, true).animate(o.animation, o.speed, function () {
					o.onShow.call($ul);
				});*/
				return this;
			},
			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						o = $this.data('sf-options'),
						$hasPopUp;
					if (!o) {
						return false;
					}
					$hasPopUp = $this.find(o.popUpSelector).parent('li');
					clearTimeout(o.sfTimer);
					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					// remove event handlers
					$this.off('.superfish').off('.hoverIntent');
					// clear animation's inline display style
					$hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
						return style.replace(/display[^;]+;?/g, '');
					});
					// reset 'current' path classes
					o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
					$this.find('.' + o.hoverClass).removeClass(o.hoverClass);
					o.onDestroy.call($this);
					$this.removeData('sf-options');
				});
			},
			init: function (op) {
				return this.each(function () {
					var $this = $(this);
					if ($this.data('sf-options')) {
						return false;
					}
					var o = $.extend({}, $.fn.superfish.defaults, op),
						$hasPopUp = $this.find(o.popUpSelector).parent('li');
					o.$path = setPathToCurrent($this, o);

					$this.data('sf-options', o);

					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					applyHandlers($this, o);

					$hasPopUp.not('.' + c.bcClass).superfish('hide', true);

					o.onInit.call(this);
				});
			}
		};
	})();

	$.fn.superfish = function (method, args) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
		}
	};

	$.fn.superfish.defaults = {
		popUpSelector: 'ul,.sf-mega', // within menu context
		hoverClass: 'sfHover',
		pathClass: 'overrideThisToUse',
		pathLevels: 1,
		delay: 800,
		animation: {opacity: 'show'},
		animationOut: {opacity: 'hide'},
		speed: 'normal',
		speedOut: 'normal',
		cssArrows: true,
		disableHI: false,
		onInit: $.noop,
		onBeforeShow: $.noop,
		onShow: $.noop,
		onBeforeHide: $.noop,
		onHide: $.noop,
		onIdle: $.noop,
		onDestroy: $.noop,
        // hoverStyle : {
        //     "margin-top" : "-3px"
        // },
        toTopMargin : 16
	};

	// soon to be deprecated
	$.fn.extend({
		hideSuperfishUl: methods.hide,
		showSuperfishUl: methods.show
	});

})(jQuery);

$(document).ready(function(){
	
    $('#dropdown_menu').superfish({
        speed: 'fast',
        speedOut: 'fast',
        delay: '100',
        disableHI: true
    });
    
	$('li .wx-icon-down').mouseenter(function(){
		$(this).parent().css("border-bottom","none");
		$(this).next().show();
		$(this).addClass("wx-hover");
	});
	$("li.wx-icon-block").mouseleave(function(){
		$(this).children().eq(1).hide();
		$(this).children().eq(0).removeClass("wx-hover");
	});

    //begin---------------主题bander选中
    var moreSelected = true;
    var $themeChildren = $(".header_themlist").children();
    $themeChildren.each(function () {
        var themeVal = $(this).find("a").attr("rel");
        var selectedTheme = $("#themeEname").val();
        if(selectedTheme && selectedTheme === themeVal){
            moreSelected = false;
            $themeChildren.removeClass("selected");
            $(this).addClass("selected");
        }
    });
    if(moreSelected && $("#themeEname").length > 0){
        $themeChildren.removeClass("selected");
        $(".moreitems").find(".more").addClass("selected");
    }
    //end-----------主题bander选中
    if(!$("#isHomeBander").val()){
        //如果不是主页，旅游产品目的地的显示和隐藏
        var $categorys = $(".categorys");
        $categorys.css("cursor","pointer");
        $categorys.addClass("down");
        $categorys.mouseenter(function(){
            $(this).removeClass("down");
            $(this).addClass("up");
            $(this).find(".continents").show();
        });
        $categorys.mouseleave(function(){
            $(this).addClass("down");
            $(this).removeClass("up");
            $(this).find(".continents").hide();
        });
    } else {
        $themeChildren.eq(0).addClass("selected");
    }
    //机+酒特卖页
    if(window.location.pathname.indexOf("sales.html") != -1){
        $themeChildren.removeClass("selected");
        $themeChildren.removeClass("hover");
        $(".header_themlist").find(".flashsales_hot").addClass("selected");
    }

    //电话下拉框
    $(".header_tel_top").mouseenter(function () {
    	$(this).children().eq(0).addClass("tel-hover");
        $(this).children().eq(1).show();
    });

    $(".header_tel_top").mouseleave(function () {
        $(this).children().eq(0).removeClass("tel-hover");
        $(this).children().eq(1).hide();
    });

    //更多分类下拉框
    $(".moreitems").mouseenter(function(){
        var $children = $(this).children();
        $children.eq(1).show();
        $children.eq(0).addClass("up");
    });
    $(".moreitems").mouseleave(function(){
        var $children = $(this).children();
        $children.eq(1).hide();
        $children.eq(0).removeClass("up");
    });

    $(".header_themlist").children().each(function () {
        var $navContent = $(this).find(".navitems_content");
        $(this).on("mouseenter", function () {
            $(this).addClass("hover");
            $navContent.show();
        });
        $(this).on("mouseleave",function () {
            $navContent.hide();
            $(this).removeClass("hover");
        })
    });
});


//解决IE8不支持数组的indexOf方法
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;  
     var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len; 
     for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
 

//新浪微博
$(document).ready(function(){
	$("#weixin").mouseover(function(){
		$(".footer_wxin").fadeIn("slow");
	});
	
	$("#weixin").mouseout(function(){
		$(".footer_wxin").fadeOut("slow");
	});
	
});

