/*! ResponsiveSlides.js v1.54
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

(function ($, window, i) {
    $.fn.responsiveSlides = function (options) {
        // Default settings
        var settings = $.extend({
            "animtype": "fade",
            "width": 700,
            "height": 300,
            "itemNum" : 1,
            "itemMargin": 5,
            "auto": true,             // Boolean: Animate automatically, true or false
            "speed": 500,             // Integer: Speed of the transition, in milliseconds
            "timeout": 4000,          // Integer: Time between slide transitions, in milliseconds
            "pager": false,           // Boolean: Show pager, true or false
            "nav": false,             // Boolean: Show navigation, true or false
            "hidenav": false,
            "random": false,          // Boolean: Randomize the order of the slides, true or false
            "pause": false,           // Boolean: Pause on hover, true or false
            "pauseControls": true,    // Boolean: Pause when hovering controls, true or false
            "prevText": "Previous",   // String: Text for the "previous" button
            "nextText": "Next",       // String: Text for the "next" button
            "maxwidth": "",           // Integer: Max-width of the slideshow, in pixels
            "navContainer": "",       // Selector: Where auto generated controls should be appended to, default is after the <ul>
            "manualControls": "",     // Selector: Declare custom pager navigation
            "namespace": "rslides",   // String: change the default namespace used
            "before": $.noop,         // Function: Before callback
            "after": $.noop,           // Function: After callback
            "tabsEle": null
        }, options);
        responsiveSlide(this,options,settings);
    };

    function responsiveSlide(self,options,settings){
        // Index for namespacing
        i++;

        /*begin-------------------定义变量-----------------*/
        var $this = $(self),

        // Local variables
            vendor,
            selectTab,
            startCycle,
            restartCycle,
            rotate,
            $tabs,

        // Helpers
            index = 0,
            $slide = $this.children(),
            length = $slide.size(),
            fadeTime = parseFloat(settings.speed),
            waitTime = parseFloat(settings.timeout),
            maxw = parseFloat(settings.maxwidth),
            itemsWidth = settings.itemNum*(settings.width + settings.itemMargin + 1),

        // Namespacing
            namespace = settings.namespace,
            namespaceIdx = namespace + i,

        // Classes
            navClass = namespace + "_nav " + namespaceIdx + "_nav",
            activeClass = namespace + "_here",
            visibleClass = namespaceIdx + "_on",
            slideClassPrefix = namespaceIdx + "_s",

        // Pager
            $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

        // Styles for visible and hidden slides
            visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
            hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1},

        // Detect transition support
           /* supportsTransitions = (function () {
                var docBody = document.body || document.documentElement;
                var styles = docBody.style;
                var prop = "transition";
                if (typeof styles[prop] === "string") {
                    return true;
                }
                // Tests for vendor specific prop
                vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
                prop = prop.charAt(0).toUpperCase() + prop.substr(1);
                var i;
                for (i = 0; i < vendor.length; i++) {
                    if (typeof styles[vendor[i] + prop] === "string") {
                        return true;
                    }
                }
                return false;
            })(),*/
            // Fading animation
            fadeTo = function (idx) {
                settings.before(idx);
                // If CSS3 transitions are supported
                /*if (supportsTransitions) {
                    $slide
                        .removeClass(visibleClass)
                        .css(hidden)
                        .eq(idx)
                        .addClass(visibleClass)
                        .css(visible);
                    index = idx;
                    setTimeout(function () {
                        settings.after(idx);
                    }, fadeTime);
                    // If not, use jQuery fallback
                } else {*/
                    $slide
                        .stop()
                        .fadeOut(fadeTime, function () {
                            $(this)
                                .removeClass(visibleClass)
                                .css(hidden)
                                .css("opacity", 1);
                        })
                        .eq(idx)
                        .fadeIn(fadeTime, function () {
                            $(this)
                                .addClass(visibleClass)
                                .css(visible);
                            settings.after(idx);
                            index = idx;
                        });
                //}
            },
            // slid animation
            slideTo = function(idx){
                $slide.removeClass(visibleClass);
                var leftVal = -idx* settings.width;
                $this.animate({
                    left: leftVal
                },function(){
                    index = idx;
                    if($slide.eq(idx).attr("data-clone") === "last"){
                        $this.css({'left': -settings.width });
                        index = 1;
                    } else if($slide.eq(idx).attr("data-clone") === "first"){
                        $this.css({'left': -settings.width *(length - 2)});
                        index = length - 2;
                    };
                    $slide.eq(index)
                        .addClass(visibleClass);
                });

            },
            carouselTo = function(idx,isPrev){
                $slide.removeClass(visibleClass);
                if(!isPrev){
                    //下一个
                    index = idx + settings.itemNum;
                } else {
                    index = idx - settings.itemNum;
                }
                var leftVal = -index* (settings.width + settings.itemMargin);
                $this.animate({
                    left: leftVal
                },function(){

                    $slide.eq(index)
                        .addClass(visibleClass);
                });
            }
        /*end-------------------定义变量-----------------*/
            
        if(settings.animtype === "slide" && settings.itemNum == 1 && settings.nav){
            // create two extra elements which are clones of the first and last slides
            var $clone_first    = $slide.eq(0).clone();
            var $clone_last     = $slide.eq(length-1).clone();
            // add them to the DOM where we need them
            $clone_first.attr({'data-clone' : 'last', 'data-slide' : 0}).appendTo($this).show();
            $clone_last.attr({'data-clone' : 'first', 'data-slide' : 0}).prependTo($this).show();
            //克隆两个之后，子元素的个数发生改变
            $slide = $this.children();
            length = $slide.size();
        }

        if(settings.itemNum > 1){
            //滚动带的形式，一次显示多于一张
            $slide.css("margin-right",settings.itemMargin);
            $this.parent().css("width",itemsWidth);
        }

        // Random order
        if (settings.random) {
            $slide.sort(function () {
                return (Math.round(Math.random()) - 0.5);
            });
            $this
                .empty()
                .append($slide);
        }

        // Add ID's to each slide
        $slide.each(function (i) {
            this.id = slideClassPrefix + i;
        });

        // Add max-width and classes
        $this.addClass(namespace + " " + namespaceIdx);
        if (options && options.maxwidth) {
            $this.css("max-width", maxw);
        }

        if(settings.animtype === "slide"){
            //如果是slide,定义样式
            // update the dimensions to the slider to accomodate all the slides side by side
            $slide.css({
                'width'     : settings.width,
                'height'    : settings.height,
                'float'         : 'left',
                'position'      : 'relative',
                'display'       : 'list-item'
            });
            var slideLeft = 0;
            if(settings.itemNum == 1){
                //从第二张图片开始显示
                index = 1;
                slideLeft = -settings.width;
            }

            $slide
                .eq(index)
                .addClass(visibleClass);

            $this.css({
                'width'     : settings.width * (settings.nav ? length + 2 : length),
                'height'    : settings.height,
                'left'      : slideLeft,
                'overflow'  : 'hidden',
                'position'  : 'relative'
            });

        } else {
            //如果是fade，定义样式
            // Hide all slides, then show first one
            $slide
                .hide()
                .css(hidden)
                .eq(0)
                .addClass(visibleClass)
                .css(visible)
                .show();

            // CSS transitions
            /*if (supportsTransitions) {
                $slide
                    .show()
                    .css({
                        // -ms prefix isn't needed as IE10 uses prefix free version
                        "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
                        "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
                        "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
                        "transition": "opacity " + fadeTime + "ms ease-in-out"
                    });
            }*/
        }

        // Only run if there's more than one slide
        if ($slide.size() > 1) {

            // Make sure the timeout is at least 100ms longer than the fade
            if (waitTime < fadeTime + 100) {
                return;
            }

            // Pager
            if (settings.pager && !settings.manualControls) {
                var tabMarkup = [];
                $slide.each(function (i) {
                    if(undefined === $(this).attr("data-clone")){
                        var n = i + 1;
                        if(settings.tabsEle){
                            tabMarkup +=
                                "<li>" + settings.tabsEle[i] + "</li>";
                        } else {
                            tabMarkup += "<li></li>";
                        }

                    }
                });
                $pager.append(tabMarkup);

                // Inject pager
                if (options.navContainer) {
                    $(settings.navContainer).append($pager);
                } else {
                    $this.after($pager);
                }
            }

            // Manual pager controls
            if (settings.manualControls) {
                $pager = $(settings.manualControls);
                $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
            }

            // Add pager slide class prefixes
            if (settings.pager || settings.manualControls) {
                $pager.find('li').each(function (i) {
                    $(this).addClass(slideClassPrefix + (i + 1));
                    //添加u-behavior标记，统计用户行为
                    $(this).attr("u-behavior","banner_"+slideClassPrefix + (i + 1));
                });
            }

            // If we have a pager, we need to set up the selectTab function
            if (settings.pager || settings.manualControls) {
                $tabs = $pager.find('li');

                // Select pager item
                selectTab = function (idx) {
                    $tabs
                        .closest("li")
                        .removeClass(activeClass)
                        .eq(idx)
                        .addClass(activeClass);
                };
            }

            // Auto cycle
            if (settings.auto) {

                startCycle = function () {
                    rotate = setInterval(function () {
                        // Clear the event queue
                        $slide.stop(true, true);
                        var idx = index + 1 < length ? index + 1 : 0;
                        var mtype = settings.animtype;
                        // Remove active state and set new if pager is set
                        if (settings.pager || settings.manualControls) {
                            if(mtype === "slide") {
                                if(index == (length - 2)){
                                    //最后一张跟显示的第一张相同，所以，应该是第一个点
                                    selectTab(0);
                                } else if(index == 0){
                                    //第一张和最后一张相同，对应的应该是最后一个点
                                    selectTab(length);
                                } else {
                                    selectTab(index);
                                }
                            } else {
                                selectTab(idx);
                            }
                        }
                        if(mtype === "slide"){
                            slideTo(idx);
                        } else {
                            fadeTo(idx);
                        }
                    }, waitTime);
                };

                // Init cycle
                startCycle();
            }

            // Restarting cycle
            restartCycle = function () {
                if (settings.auto) {
                    // Stop
                    clearInterval(rotate);
                    // Restart
                    startCycle();
                }
            };

            // Pause on hover
            if (settings.pause) {
                $this.hover(function () {
                    clearInterval(rotate);
                }, function () {
                    restartCycle();
                });
            }

            // Pager click event handler
            if (settings.pager || settings.manualControls) {
            	//为父添加样式
            	$this.parent().css("position","relative");
                $tabs.bind("click", function (e) {
                    e.preventDefault();

                    if (!settings.pauseControls) {
                        restartCycle();
                    }

                    // Get index of clicked tab
                    var idx = $tabs.index(this);


                    if(settings.animtype === "slide"){
                        if($this.queue("fx").length){
                            return;
                        }
                        // Remove active state from old tab and set new one
                        selectTab(idx);
                        // Do the animation
                        slideTo(idx + 1);
                    } else {
                        // Break if element is already active or currently animated
                        if (index === idx || $("." + visibleClass).queue('fx').length) {
                            return;
                        }
                        selectTab(idx);
                        fadeTo(idx);
                    }
                })
                    .eq(0)
                    .closest("li")
                    .addClass(activeClass);

                // Pause when hovering pager
                if (settings.pauseControls) {
                    $tabs.hover(function () {
                        clearInterval(rotate);
                    }, function () {
                        restartCycle();
                    });
                }
            }

            // Navigation
            if (settings.nav) {
                var navMarkup =
                    //添加u-behavior标记，统计用户行为
                    "<a href='#' class='" + navClass + " prev' u-behavior='banner_homewrapNavPrev'>" + settings.prevText + "</a>" +
                    "<a href='#' class='" + navClass + " next' u-behavior='banner_homewrapNavNext'>" + settings.nextText + "</a>";

                // Inject navigation
                if (options.navContainer) {
                    $(settings.navContainer).append(navMarkup);
                } else {
                    $this.after(navMarkup);
                }

                var $trigger = $("." + namespaceIdx + "_nav"),
                    $prev = $trigger.filter(".prev");
                if (settings.hidenav) {
                    //鼠标滑入时显示左右选，离开时不显示
                    $trigger.hide();
                    var $parent = $trigger.parent();
                    $parent.on("mouseenter", function () {
                        $trigger.show();
                    }).on("mouseleave", function () {
                        $trigger.hide();
                    });

                }
                // Click event handler
                $trigger.bind("click", function (e) {
                    e.preventDefault();
                    var $visibleClass = $("." + visibleClass);
                    var queueLen = 0;
                    if(settings.animtype == "slide"){
                        //如果是slide,则是父的ul在执行动画
                        queueLen = $this.queue('fx').length;
                    } else {
                        queueLen = $visibleClass.queue('fx').length;
                    }
                    // Prevent clicking if currently animated
                    if (queueLen) {
                        return;
                    }

                    //  Adds active class during slide animation
                    //  $(this)
                    //    .addClass(namespace + "_active")
                    //    .delay(fadeTime)
                    //    .queue(function (next) {
                    //      $(this).removeClass(namespace + "_active");
                    //      next();
                    //  });

                    // Determine where to slide
                    if(settings.itemNum === 1){
                        var idx = $slide.index($visibleClass),
                            prevIdx = idx - 1,
                            nextIdx = idx + 1 < length ? index + 1 : 0;
                        // Go to slide
                        if(settings.animtype === "slide"){
                            if(prevIdx == -1){
                                prevIdx = length - 1;
                            }
                            if(nextIdx == 0){
                                nextIdx = 2;
                            }

                            slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
                        } else {
                            fadeTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
                        }
                    } else {
                        var idx = $slide.index($visibleClass);
                        var isPrev = $(this)[0] === $prev[0] ? true : false;
                        if(isPrev && idx === 0){
                            //到最前
                            return;
                        }
                        if(!isPrev && (length - idx <= settings.itemNum)){
                            //到最后
                            return;
                        }
                        carouselTo(idx,isPrev);
                    }

                    if (settings.pager || settings.manualControls) {
                        if(settings.animtype === "slide"){
                            if(nextIdx == length - 1){
                                nextIdx = 1;
                            }
                            if(prevIdx == 0) {
                                prevIdx = length - 2;
                            }
                            selectTab($(this)[0] === $prev[0] ? (prevIdx-1) : (nextIdx - 1));
                        } else {
                            selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
                        }
                    }

                    if (!settings.pauseControls) {
                        restartCycle();
                    }
                });

                // Pause when hovering navigation
                if (settings.pauseControls) {
                    $trigger.hover(function () {
                        clearInterval(rotate);
                    }, function () {
                        restartCycle();
                    });
                }
            }

        }

        // Max-width fallback
        if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
            var widthSupport = function () {
                $this.css("width", "100%");
                if ($this.width() > maxw) {
                    $this.css("width", maxw);
                }
            };

            // Init fallback
            widthSupport();
            $(window).bind("resize", function () {
                widthSupport();
            });
        }

        if(options.height){
            $this.css({"height" : options.height});
        }

    }
})(jQuery, this, 0);
