var getCookieOrderInfoField = function( key ) {
    if( !cookieOrderInfo )
        return false;
    var info  = "";
    if( 'destlist' == key   )
        info = !cookieOrderInfo.destlist ? "" : cookieOrderInfo.destlist;
    if( 'peoplenum' == key )
        info = !cookieOrderInfo.peoplenum ? "" : cookieOrderInfo.peoplenum;
    if( 'userinfo' == key )
        info = !cookieOrderInfo.userinfo ? "" : cookieOrderInfo.userinfo;
    if( !$.isPlainObject( info ) )
        return false;
    if( $.isEmptyObject( info ) )
        return false;
    return info;
};

var getStorageLocal = function( key ) {
    var str = $.cookie(key);
    if( !str ) return false;
    var json = JSON.parse( str );
    if( !$.isPlainObject( json ) || $.isEmptyObject( json ) )
        return false;
    return json;
};

var $imList = $("#trip_order");
//cookieOrderInfo = getStorageLocal("lc_order_info");
var pcReload = function(){
    //固定目的地
    var destList = getStorageLocal( "destlist" );
    var $imList = $("#trip_order");
    if( destList ) {
        var $secondPg = $("#second_pg");
        var selectText = destList.select;
        var selectIndex = destList.index;
        var tabIndex = destList.tab_index;
        var destText = '';
        var jsonText = {};

        wx.getSolidDestHtml(); //显示
        if( selectText ) {
            $("#tab_dest_list").find("li").eq(tabIndex).addClass("on").siblings().removeClass("on");
            var $divId = $(arrDestTab[tabIndex]);
            $divId.show().siblings(".city-tab-bd").hide();

            var tempArr = selectIndex.split(",");
            var $list = $divId.find("li");
            if( 2 == tabIndex ) { //出境结构
                var pIndex = destList.p_index;
                var $list = $divId.find("dl.row-item").eq(pIndex).find("li");
            }

            for(var i in tempArr) {
                $list.eq(tempArr[i]).find("span").addClass("col-selected");
            }

            var tmpArray = selectText.split(",");
            for(var key in tmpArray) {
                jsonText[tmpArray[key]] = tmpArray[key];
            }
            //禁用获取目的地
            //wx.dest_click_status = 1;
        }

        var otherText = destList.other;
        if( otherText ) {
            //wx.dest_click_status = 1;
            var divobj = $secondPg.find("div.im-change");
            $("#other_dest").val(otherText).show().addClass("col-disabled").attr("disabled", true);
            jsonText[otherText] = otherText;
        }
        var tmpArray = [];
        for(var text in jsonText) {
            tmpArray.push( text );
        }
        var destText = tmpArray.join(',');
        $("#destination").val( destText );

        //禁用选择我的目的地
        //$("#first_pg").find("a.im-btn").addClass("col-disabled");
        if( destText ) {
            wx.dest_click_status = 1;
            cookieAdvistor["dest"] = destText;
            setCookieAdvistor(cookieAdvistor);

            var $firstBtns = $("#first_pg").find("a.im-btn");
            if('不确定'==destText){
                $("#other_dest").val( destText );
                $firstBtns.eq(1).addClass("col-disabled");
                $firstBtns.eq(0).removeClass("col-disabled");
            }
            else{
                $firstBtns.eq(0).addClass("col-disabled");
                $firstBtns.eq(1).removeClass("col-disabled");
            }
            $secondPg.find("div.im-btns").hide().next().show();
            var destTips = "我想要去" + destText;
            if('不确定'==destText) {
                destTips = '我的行程' + destText;
            }
            $secondPg.next().show().find("p").text(destTips);
            $secondPg.find("span.col-btn").each(function(i){
                var _class = $(this).attr("class");
                if( -1 === _class.indexOf("col-selected") ) {
                    $(this).addClass("col-disabled");
                }
            });
        }
        //事件绑定
        wx.getSolidDestHtml();
        wx.firstGetDestBindClick();
    }

    //子目的地
    var subDestList = getStorageLocal("subdestlist_bak");
    if( subDestList ) {
        var _html = wx.secondChildDest(subDestList.list);
        $imList.append(_html);
        wx.threeInit();

        var $threePg = $("#three_pg");
        var selectIndex = subDestList.index;
        var childDestText = "";
        if( -1 !== selectIndex ) {
            wx.child_dest_click_status = 1;
            var liobj = $threePg.find("ul.list-row").children("li.col2");
            var arrIndex = selectIndex.split(",");
            var arrChildDest = [];
            for( var i in arrIndex ) {
                liobj.eq(arrIndex[i]).children().addClass("col-selected");
                arrChildDest.push(liobj.eq(arrIndex[i]).children().text());
            }
            var $imChange = $threePg.find("div.im-change");
            $imChange.find("a.im-btn").show().addClass("col-disabled");
            $imChange.find("input").hide().val("");
            childDestText = arrChildDest.join(",");
        }
        else{
            childDestText = subDestList.other;
            if( childDestText ) {
                wx.child_dest_click_status = 1;
                var $imChange = $threePg.find("div.im-change");
                $imChange.find("a.im-btn").hide();
                $imChange.find("input").addClass("col-disabled").show();
                $threePg.find("div.im-btns").hide().next().show();
                $threePg.find("input").val(childDestText);
            }
        }
        if( -1 === subDestList.index && !childDestText ) {
            //$threePg.next().show().find("p").text("&nbsp;");
        }
        else{
            $threePg.find("li.col2>span").each(function(i){
                var _class = $(this).attr("class");
                if( -1 === _class.indexOf("col-selected") ) {
                    $(this).addClass("col-disabled");
                }
            });
            $threePg.next().show().find("p").text("我想要去" + childDestText);
        }
    }

    //子目的地
    var subDestList = getStorageLocal("subdestlist");
    if( subDestList ) {
        var _html = wx.secondChildDest(subDestList.list);
        $imList.append(_html);
        wx.threeInit();

        var $threePg = $("#three_pg");
        var selectIndex = subDestList.index;
        var childDestText = "";
        var arrChildDest = [];


        var liobj = $threePg.find("ul.list-row").children("li.col2");
        if( -1 !== subDestList.index ) {
            var arrIndex = selectIndex.split(",");
            var arrChildDest = [];
            for( var i in arrIndex ) {
                liobj.eq(arrIndex[i]).children().addClass("col-selected");
                arrChildDest.push(liobj.eq(arrIndex[i]).children().text());
            }
        }

        if( subDestList.other ) {
            arrChildDest.push(subDestList.other);
        }
        childDestText = arrChildDest.join(",");

        if( -1 === subDestList.index && !subDestList.other ){}
        else{
            cookieAdvistor["dest"] = childDestText;
            setCookieAdvistor(cookieAdvistor);

            wx.child_dest_click_status = 1;
            $("#child_dest").val(subDestList.other).addClass("col-disabled").attr("disabled", true);
            $threePg.find("li.col2>span").each(function(i){
                var _class = $(this).attr("class");
                if( -1 === _class.indexOf("col-selected") ) {
                    $(this).addClass("col-disabled");
                }
            });
            $threePg.next().show().find("p").text("我想要去" + childDestText);
        }

    }

    //天数
    var destDays = getStorageLocal("destdays");
    if( destDays ) {
        var _html = wx.getRouteHtml( destDays.list );
        $imList.append( _html );
        noComfirmStatus = (destDays.index==1) ? true : false;
        wx.fourInit();
        var $fourPg = $("#four_pg");
        daysTripJson = ($.isPlainObject(destDays.list) && !$.isEmptyObject(destDays.list)) ? destDays.list : {};
        var currentDay = (!destDays.days || isNaN(destDays.days)) ? 0 : parseInt(destDays.days);
        if( !currentDay ) { //reload
            return false;
        }
        if( noComfirmStatus ) {
            $("#outmonth").val( destDays.month).addClass("col-disabled").attr("disabled", "disabled");
            $("#outdate").val( destDays.date ).addClass("col-disabled").attr("disabled", "disabled");
        }
        else{
            $("#outmonth").val("");
            $("#outdate").val( "" );
        }
        if( currentDay ) {
            wx.days_click_status = 1;
            $("#set_days").val( currentDay ).addClass("col-disabled").attr("disabled", "disabled");
            $fourPg.find("li.col3").each(function(i){
                var $li = $(this);
                var _text = $li.find("span").text();
                _text = !_text ? 0 : parseInt( _text );
                if( _text == currentDay ) {
                    $li.find("span").addClass("col-selected");
                    $li.siblings().removeClass("col-selected");
                }
            });
        }

        $fourPg.find("a.im-btn").addClass("col-disabled");
        if( subDestList ) {
            $threePg.find("div.im-btns").hide().next().show();
        }

        if( currentDay ) {
            cookieAdvistor["days"] = currentDay;
            setCookieAdvistor(cookieAdvistor);

            $fourPg.find("div.im-btns").hide().next().show();
            var daymsg = "我选择了"+currentDay+"天的行程";
            if(currentDay>15) {
                daymsg = "我选择了15天以上的行程";
            }
            $fourPg.next().show().find("p").text( daymsg );
        }

        var tempLen = daysTripJson.length;
        var daysFlag = true;
        if(tempLen==0 || !daysTripJson[currentDay]) {
            daysFlag = false;
        }

        if( !daysFlag || currentDay>15 || (noComfirmStatus && currentDay) ) { //手动天数
            var $sixPg = $("#six_pg");
            var length = $sixPg.length;
            var _html = wx.getSixPepleHtmlCode();
            $imList.append( _html );
        }
    }

    //行程单
    var triplist = getStorageLocal( "triplist" );
    var is_trip = false;
    if( triplist ) {
        var tripIds = triplist.list.join(',');
        var selectIndex = ( !isNaN( triplist.index ) ) ? parseInt(triplist.index) : 0;
        var $fivePg = $("#five_pg");
        var routeId = "";

        $.ajax({
            type:"GET",
            url:"/route/getTripList",
            async:false,
            data:{"id":tripIds},
            dataType:"json",
            success:function( data ) {
                if( data.status && 1==parseInt(data.status) ){
                    var _html = wx.getFiveHtml(data.data);
                    $imList.append(_html);
                    wx.fiveInit();
                    //wx.tripInputParams( data.data[paramTripId] );
                    //$("#trip_id").val( paramTripId );
                    return true;
                }
            },
            complete:function(){
                if( selectIndex>0 || "next"==triplist.other ) {
                    wx.getSixPepleHtmlCode();
                }
            }
        });


        if( -1 !== selectIndex ) {
            routeId = selectIndex;
            var $selectTrip = $("#trip_list_" + routeId);
            $selectTrip.find("a.btn-green").addClass("col-selected");
            var _text = $selectTrip.find("div.jour-tit>span").text();
            $fivePg.next().show().find("p").text("请对行程"+_text+"帮我报价");
            //is_trip = true;
        }

        /*oid重载*/
        var tripId = isNaN(triplist.trip_id) ? 0 : parseInt(triplist.trip_id);
        if( tripId>0 ) {
            var _html = '';
            $("#destination").val(triplist.dest);
            _html += '<br><input type="hidden" name="set_days" id="set_days" value="'+triplist.days+'">';
            $("#token").after( _html );
            routeId = tripId;
        }

        $("input[name=trip_id]").val(routeId);
        if( destDays ) {
            $fourPg.find("div-btns").hide().next().show();
        }
    }

    //人数
    var pepleNum = getStorageLocal( "peoplenum" );
    var is_show = false;
    if( pepleNum ) {
        //先判断是否存在人数模块
        var length = $("#six_pg").length;
        if( length > 0) {}
        else{
            var _html = wx.getSixPepleHtmlCode();
            $imList.append( _html );
        }

        var $sixPg = $("#six_pg");

        var adult = pepleNum.adult || 1;
        var child = pepleNum.child || 0;
        var old = pepleNum.old || 0;
        var contnet = pepleNum.contnet || "";

        adult = isNaN( adult ) ? 0 : parseInt( adult );
        child = isNaN( child ) ? 0 : parseInt( child );
        old = isNaN( old ) ? 0 : parseInt( old );

        if( adult>0 ) {
            $sixPg.find("#adult_num").prev().removeClass("num-invalid");
        }
        if( child>0 ) {
            $sixPg.find("#child_num").prev().removeClass("num-invalid");
        }
        if( old>0 ) {
            $sixPg.find("#old_num").prev().removeClass("num-invalid");
        }

        var content = pepleNum.content || "";
        $("#adult_num").val( adult );
        $("#child_num").val( child );
        $("#old_num").val( old );
        $("#trip_content").val( content );

        var total = parseInt(adult) + parseInt(child) + parseInt(old);
        $sixPg.next().show().find("p").text("我们一共"+total+"个人");
        $sixPg.find("input").addClass("col-disabled").attr("disabled", true);
        $("#trip_content").addClass("col-disabled").attr("disabled", true);
        $sixPg.find("div.im-btns").hide().next().show();

        $sixPg.find("span.increase").removeAttr("onclick");
        $sixPg.find("span.descrease").removeAttr("onclick");
        is_show = true;
    }
    /*else{
        if(is_trip) {
            var _html = wx.getSixPepleHtmlCode();
            $imList.append( _html );
        }
    }*/

    //联系方式
    var userinfo = getStorageLocal( "userinfo" );
    if( userinfo ) {
        var _html = wx.getContactHtml();
        $imList.append(_html);
        wx.sevenInit();

        var $sevenPg = $("#seven_pg");

        $("#username").val( userinfo.realname ).addClass("col-disabled").attr("disabled", true);
        $("#contact").val( userinfo.mobile ).addClass("col-disabled").attr("disabled", true);
        $("#calltype").val( userinfo.calltype ).addClass("col-disabled").attr("disabled", true);
        $sevenPg.find("div.im-btns").hide().next().show();
        //提示语放到聊天加载完成之后 lc 2014.06.12
        //$sevenPg.next().show().find("p").text("我的称呼是"+userinfo.realname+"，我的联系方式是" + userinfo.mobile);
        if( pepleNum ) {
            $sixPg.find("div.im-btns").hide().next().show();
        }
    }
    else{
        if( is_show ) { //
            var _html = wx.getContactHtml();
            $imList.append(_html);
            wx.sevenInit();
        }
    }

    //订单信息
    var orderinfo = getStorageLocal( "submitorder" );
    if( orderinfo ) {
        //提示语放到了聊天之后
        //var _html = wx.eightSiteTips();
        //$imList.append(_html);
        ///wx.eightInit();
        var orderId = orderinfo.order_id;
        var orderSn = orderinfo.order_sn;
        $("#order_id").val( orderId );
        $("#order_sn").val( orderSn );
        wx.submit_status = 1; //禁止重新提交
        wx.submitOkBindResetClick();
        //启动聊天
        var tempOrderId = isNaN(orderinfo.order_id) ? 0 : parseInt( orderinfo.order_id );
        if( tempOrderId > 0 ) {
            zoomOrderSn =  orderSn;

            imChat.orderId = tempOrderId;
            imChat.preReadStatus = 1;
            imChat.getPreMsg();
            //20141202 lc 屏蔽
            //imChat.resetChatBox( 1 );

            //从cookie中获取order_sn；ajax获取右侧订单信息
            imChat.getRightOrderInfo( orderSn );
        }
    }

    return true;
};

if( !orderSn ){ //order_sn 单独流程
    pcReload();
}
