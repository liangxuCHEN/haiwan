var _timeout = 600;
var _layer_timeout = 2000;
var page_redirect = false;
var cookieOrderInfo = {};
var cookieAdvistor = {};
var $imScroll = $("#im_scroll");
var $alertTips = $("#alert_tips");
var $tripOrder = $("#trip_order");
var noComfirmStatus = false; //set_days use
var selectMonth = null;
var selectDay = null;
//form params
var starttime = "";
var daysTripJson = [];
var destSelectJson = {"area_text":""};

var inDestination = "";
var arrDestTab = ["#tab_hot_dest", "#tab_in_dest", "#tab_out_dest"];
//
var formParamsArea = {};

function go_trip_url(id){
    window.open('http://www.6renyou.com/xingcheng/'+id);
  }


function _pay(_sn,_id){
    page_redirect = true;
    location.href='/orderc/selectTrip?sn='+_sn+'&trip_id='+_id;
}

function setCookieAdvistor( cookieJson ) {
    var cookieStr = "";
    for(var key in cookieJson) {
        cookieStr += key + "=" + cookieJson[key] + "&&";
    }
    $.cookie('advistor_info',cookieStr, {expires:30, path:'/',domain:'.6renyou.com'});
}

function alertLayer(message) {
    $alertTips.find("div.tips-item p").text(message);
    $alertTips.show();
    setTimeout(function(){
        $alertTips.hide();
    }, _layer_timeout);
}

function scrollBottom() {
    $imScroll.animate({scrollTop:$tripOrder.height()},400);
}

function storageSave( key, value ) {
    pcOrderCookie.storageSave( key, value );
    return true;
}

//重新咨询
function newChat(){
    clearCookie();
    page_redirect = true;
    newStatus = 1;
    location.href=location.href;
}

function continueChat(){
    continueStatus = 1;
    $('div.mask-disable').hide();
}

function add_people(obj){
    var num = $(obj).prev().find("input").val();
    if(isNaN(num)){
        num = 0;
        $(obj).addClass("valuecomb_disable");
    }else{
        num = parseInt(num)+1;
        $(obj).siblings("span").removeClass("valuecomb_disable");
    }
    $(obj).prev().find("input").val(num);
}
function minus_people(obj){
    var num = $(obj).next().find("input").val();
    if(isNaN(num) || num<=1){
        num = 0;
        $(obj).addClass("valuecomb_disable");
    }else{
        num = parseInt(num)-1;
        $(obj).siblings("span").removeClass("valuecomb_disable");
    }
    $(obj).next().find("input").val(num);
}

var YearMonth = {
    init:function() {
        var _html = this.getMonth();
        selectMonth.empty().append( _html );
        selectMonth.get(0).selectedindex=0;
        this.setDay();
        selectMonth.change(function() {
            YearMonth.setDay();
        });
    },
    getMonth:function() {
        var _maxLen = months.length;
        var _html = '<option value="" value="">月份</option><option value="none" value="">不确定</option>';
        for( var _key in months ) {
            _html += '<option value="'+_key+'">'+months[_key]+'</option>';
        }
        return _html;
    },
    getDay:function() {
        var _month = selectMonth.val();
        var _arrTemp = _month.split("-");
        var _year = _arrTemp[0];
        _month = parseInt(_arrTemp[1]) - 1;
        var _arrTemp = currMonth.split("-");
        var _currYear = _arrTemp[0];
        var _currMonth = _arrTemp[1];
        var _currDay = _arrTemp[2];
        var _myTime = new Date(_year, _month, 1);
        var _maxDay = 28;
        for(var i=28;i<32;i++){
            _myTime.setDate(i);
            if(_myTime.getDate()==1){
                break;
            }
            _maxDay = i;
        }
        var _html = '<option value="" value="">日期</option><option value="none" value="">不确定</option>';
        var _start = 1;
        if( _year==_currYear && (_month+1)==_currMonth ) _start = _currDay;
        for( var i=_start; i<=_maxDay; i++ ) {
            _html+="<option value='"+i+"'>"+i+"日</option>";
        }
        return _html;
    },
    setDay:function(){
        var _html = this.getDay();
        selectDay.empty().append( _html );
    }
};


var wx = {
    //接受的DEST，与solid_dest相比；是否有匹配
    param_dest_select_status:0,
    submit_status:0,
    first_dest_click_status:0, //目的地 第一次 点击状态
    first_child_dest_click_status:0,
    first_days_click_status:0, //天数 第一次 点击状态
    dest_click_status:0, //渲染 重新提交  确定  修改此值
    child_dest_click_status:0, //渲染 重新提交  确定  修改此值
    days_click_status:0, //渲染 重新提交  确定  修改此值
    days_type:0, //1表示可以选择天数
    solid_dest_list:""
};

wx.firstGetDestBindClick = function() {
    wx.secondInit();
    var $firstPg = $("#first_pg");
    var clickCount = 0; //防止事件多次累加
    $firstPg.find("div.im-btns").on({
        click:function(){
            if(1 == wx.submit_status) return false;
            //wx.param_dest_select_status = 1;
            var $this = $(this);
            var btnIndex = $this.index();
            if( $this.hasClass("col-disabled") ){
                return false;
            }
            $this.addClass("col-disabled").siblings().removeClass("col-disabled");
            var tmpDest = '';
            if( 0 == btnIndex ) {
                noComfirmStatus = false;
                $("#second_pg").find("div.im-btns").show().next().hide();
                $("#tab_dest_list li").eq(0).addClass("on").siblings().removeClass("on");
                $("ul.lc-first-dest span.col-btn").removeClass("col-selected col-disabled");
                $("#tab_hot_dest").show().siblings(".city-tab-bd").hide();
                $("#second_pg").next().hide().nextAll().remove();
                $("#other_dest").removeClass("col-selected col-disabled").removeAttr("disabled");
                wx.first_dest_click_status=0;
                wx.getSolidDestHtml();
                //if( 1 != clickCount  ) wx.secondInit(); 20141104
                storageSave("destlist",null);
                clickCount = 1;

                storageSave("subdestlist",null);
                storageSave("destdays",null);
                storageSave("triplist",null);
                storageSave("peoplenum", null);
                storageSave("userinfo", null);
            }
            else{
                if(1 == wx.submit_status) return false;
                //直接填写天数
                noComfirmStatus = true;
                tmpDest = '不确定';
                var jsonList = $.cookie("destlist");
                jsonList = {"select":"","tab_index":-1,"p_index":-1, "index":-1, "other":tmpDest};

                storageSave("destlist",jsonList);
                $("#second_pg").hide().next().hide().nextAll().remove();
                storageSave("subdestlist",null);
                storageSave("destdays",null);
                storageSave("triplist",null);
                storageSave("peoplenum", null);
                storageSave("userinfo", null);
                var _html = wx.getRouteHtml( [] );
                $("#trip_order").append(_html);
                wx.fourInit();
            }


            $("#other_dest").val(tmpDest);
            $("#destination").val(tmpDest);
            //inDestination = tmpDest;
        },
        mouseover:function(){
            if( 1 === wx.param_dest_select_status || 1 == wx.submit_status )
                return false;
            $(this).addClass("btn-normal").removeClass("btn-default");
        },
        mouseout:function(){
            if( 1 === wx.param_dest_select_status || 1 == wx.submit_status )
                return false;
            $(this).addClass("btn-default").removeClass("btn-normal");
        }
    }, "a.im-btn");
};

//固定目的地
wx.getSolidDestHtml = function() {
    $("#second_pg").show();
    scrollBottom();
};


wx.secondInit = function(){
    wx.secondBindClick();
};

wx.paramDestOther = function() {
    if( paramDest && 0 === wx.param_dest_select_status ) {
        wx.param_dest_select_status = 1;
        $("#destination").prev().hide();
        var $imbtns = $("#first_pg").find("div.im-btns a.im-btn");
        if(paramDest=="不确定")
            $imbtns.eq(1).addClass("col-disabled");
        else{
            $imbtns.eq(0).addClass("col-disabled");
        }
        $("#destination").val( paramDest );
    }
    return true;
};

//第二步骤  事件
wx.secondBindClick = function() {
    var $secondPg = $("#second_pg");
    $("#tab_dest_list").on("click", "li", function(){
        if(1 === wx.dest_click_status || 1 === wx.first_dest_click_status)
            return false;
        var $li = $(this);
        var _index = $li.index();
        $li.addClass("on").siblings().removeClass("on");
        $(arrDestTab[_index]).show().siblings(".city-tab-bd").hide();
        var _index = $li.index();
        $("#other_dest").val("");
    });

    $("ul.lc-first-dest").on("click", "li", function(){
        if(1 === wx.dest_click_status || 1 === wx.first_dest_click_status)
            return false;
        var $li = $(this);
        var $span = $li.find("span");
        var result = $span.hasClass("col-selected");
        var tabRel = $("#tab_dest_list>li.on").attr("rel"); //判断在那个类型下
        if("hot"==tabRel) {
            $("#tab_in_dest,#tab_out_dest").find("li>span.col-selected").removeClass("col-selected");
            result ? $span.removeClass("col-selected") : $span.addClass("col-selected");
            ($span.hasClass("col-selected")) ? $li.siblings().find("span").removeClass("col-selected") : ""; //热门中只能单选
        }
        else if("out"==tabRel) {
        	//这里吧 tab_hot_dest也添加进去
            $("#tab_hot_dest,#tab_in_dest,#tab_out_dest").find("li>span.col-selected").removeClass("col-selected");
            result ? $span.removeClass("col-selected") : $span.toggleClass("col-selected");
            var liArea = $li.attr("darea"); //获取到该目的地所在大洲
            var areaText = formParamsArea.area_text ? $.trim(formParamsArea.area_text) : ""; //已选取目的地所在的大洲
            if(areaText && areaText!=liArea) {
                formParamsArea = {"area_text":liArea};
                $li.parent().parent().parent().siblings().find("span").removeClass("col-selected");
            }
            else{
                formParamsArea.area_text = liArea;
            }
        }
        else{
            $("#tab_hot_dest,#tab_out_dest").find("li>span.col-selected").removeClass("col-selected");
            result ? $span.removeClass("col-selected") : $span.toggleClass("col-selected");
        }

        inDestination = $span.hasClass("col-selected") ? $.trim($span.text()) : "";
    });

    $("#other_dest").keyup(function(){
        var dest = $.trim( $(this).val() );
        var tabRel = $("#tab_dest_list>li.on").attr("rel"); //判断在那个类型下
        if( dest ) {
            ("hot"==tabRel) ? $("ul.lc-first-dest:eq(0)").find("li>span.col-selected").removeClass("col-selected") : "";
            $("#destination").val( dest );
        }
    });

    var writeTips = "输入其它目的地";
    $("#other_dest").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    //确定选择
    $secondPg.find("div.im-btns a.im-btn").click(function(){
        var $secondPg = $("#second_pg");
        var tmpdestArr = [];
        var tmpindexArr = [];
        var listJson = {};
        $secondPg.find("ul.lc-first-dest>li").find("span.col-selected").each(function(){
            var $self = $(this);
            var text = $.trim($self.text());
            tmpdestArr.push(text);
            listJson[text] = text;
            var index = $self.parent().index();
            tmpindexArr.push(index);
        });

        var _input = $.trim($("#other_dest").val());
        if( !tmpdestArr.length && !_input ) {
            alertLayer("请选择目的地");
            return false;
        }
        $secondPg.find("div.im-change").find("a.im-btn").addClass("col-disabled");
        $("#other_dest").attr("disabled","disabled"); //禁用
        var _selectDest = tmpdestArr.join(",");
        if(_input) {tmpdestArr.push(_input); listJson[_input]=_input;}
        var listArray = [];
        for(var key in listJson) {
           listArray.push(key);
        }
        var _dest = listArray.join(",");
        $("#destination").val( _dest );

        cookieAdvistor["dest"] = _dest;
        setCookieAdvistor(cookieAdvistor);

        var jsonList = $.cookie("destlist");
        if( !jsonList )
            jsonList = {"select":_selectDest,"tab_index":-1,"p_index":-1, "index":-1, "other":_input};
        else
            jsonList = JSON.parse( jsonList );

        storageSave("subdestlist",null);
        storageSave("destdays",null);
        storageSave("triplist",null);
        storageSave("peoplenum", null);
        storageSave("userinfo", null);
        if( _selectDest ) {
            var _tabIndex = $("#tab_dest_list").find(".on").index(); //tab索引
            var $divId = $(arrDestTab[_tabIndex]);
            var _index = $divId.find("span.col-selected").parent().index();//li
            var _parentIndex = -1;
            if( 2==_tabIndex ) { //出境
                _parentIndex = $divId.find("span.col-selected").parents("dl.row-item").index(); //dl
            }

            jsonList.select = _selectDest;
            jsonList.tab_index = _tabIndex;
            jsonList.p_index = _parentIndex;
            jsonList.index = tmpindexArr.join(",");
            jsonList.other = _input;
        }
        else{
            jsonList.select = "";
            jsonList.tab_index = -1;
            jsonList.p_index = -1;
            jsonList.index = -1;
            jsonList.other = _input;
        }
        storageSave("destlist", jsonList );

        $("#destination").val(_dest);
        var $fistList = $("ul.lc-first-dest");
        $fistList.find("span.col-btn").addClass("col-disabled");
        $fistList.find("span.col-selected").removeClass("col-disabled");
        $secondPg.find("div.im-btns").hide().next().show();
        var destTips = "我想要去" + _dest;
        if("不确定"==_dest) {
            destTips = '我的行程' + _dest;
        }
        $secondPg.next().find("p").text(destTips);
        $secondPg.next().show();

        wx.first_dest_click_status=1;
        wx.dest_click_status = 0;
        //显示第三页
        var maxLen = tmpdestArr.length;
        if(maxLen>1) {
            wx.getMoreDestDays( _dest );
        }
        else{
            inDestination = _dest; //多个城市用到
            wx.getChildDest();
        }
    });

    wx.getMoreDestDays =function(dest){
        $.ajax({
            type:"POST",
            url:"/ordercext/getMoreDestDays",
            data:{"dest":dest},
            dataType:"json",
            success:function(data){
                if(!$.isPlainObject(data) || $.isEmptyObject(data)) {
                    var _html = wx.getRouteHtml( [] );
                    $tripOrder.append(_html);
                    wx.fourInit();
                    scrollBottom();
                    return false;
                }
                if( data.status==1 ) {
                    var _html = wx.getRouteHtml( data.data );
                    $("#trip_order").append(_html);
                    wx.fourInit();
                    scrollBottom();
                }
                else{
                    var _html = wx.getRouteHtml( [] );
                    $tripOrder.append(_html);
                    wx.fourInit();
                    scrollBottom();
                }
            },
            error:function(data){
                var _html = wx.getRouteHtml( [] );
                $tripOrder.append(_html);
                wx.fourInit();
                scrollBottom();
            }
        });
    };

    $secondPg.find("div.finished-sel button.im-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        var $secondPg = $("#second_pg");
        var $imChange = $secondPg.find("div.im-change");
        $secondPg.find("div.im-btns").show().next().hide(); //重新提交隐藏
        $secondPg.find("a.im-btn").removeClass("col-disabled");
        $secondPg.find("ul.lc-first-dest>li").find("span").removeClass("col-disabled col-selected"); //清除选中
        $imChange.find("a.im-btn").show().next().hide();//设定显示，input隐藏
        $("#other_dest").val("").removeAttr("disabled").removeClass("col-disabled"); //input值空
        $secondPg.next().hide().find("p").html("&nbsp;");
        $secondPg.next().nextAll().remove();
        wx.dest_click_status = 0; //取消禁止点击
        wx.first_dest_click_status=0;

        wx.child_dest_click_status = 0; //子目的地解禁
        wx.first_child_dest_click_status = 0;

        wx.days_click_status = 0; //天数解禁
        wx.first_days_click_status = 0;
    });
    scrollBottom();
};

//第三步骤 获取子目的地
wx.getChildDest = function() {
    var _dest = $.trim( $("#destination").val() );
    
    //这里不管他 不调用
    $.get("/plus/travel/selectDest.php",{dest:_dest}, function(data){
        if( !data || $.isEmptyObject(data)) {
            alertLayer("网络连接错误，无法获取数据1");
            return false;
        }
        var _status = parseInt( data.status );
        if( 2 == _status ){

            //有下级
            var _html = wx.secondChildDest(data.data);
            $("#trip_order").append(_html);
            wx.threeInit();
        }
        else if( 1 == _status ) {
            //无下级
            wx.getRouteDays( data.data );
        }
        else if( 0 == _status ) {
            //没有此目的地
            var _html = wx.getRouteHtml( data.data.days );
            $("#trip_order").append(_html);
            wx.fourInit();
            //没有目的地，直接天数
        }
        else{
            //错误
            alertLayer("应用程序错误");
            return false;
        }
    }, "json");
};

//获取上一级已经选择或填写的目的地
wx.getSelectDest = function() {
    var selectDest = [];
    $("#second_pg").find("li.col3>span").each(function(){
        var _class = $(this).attr("class");
        if( -1 !== _class.indexOf("col-selected") ) {
            selectDest.push($(this).text());
        }
    });
    var _dest = selectDest.join(",");
    var _otherDest = $.trim( $("#destination").val() );
    var _dest = _dest || _otherDest;
    return _dest;
};

//子目的
wx.secondChildDest = function( _data ) {
    var jsonList = JSON.parse($.cookie("subdestlist"));
    if( !jsonList ) {
        jsonList = {"list": _data, "index":-1, "other":""};
        storageSave( "subdestlist", jsonList );
    }

    var _html = [];
    _html.push('<li class="im-item me" id="three_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">'+inDestination+'有多个景区，您想去哪几个？<span class="c9">(可多选)</span></div>');
    _html.push('        <div class="city-list">');
    _html.push('            <ul class="list-row clearfix">');
    for(var id in _data){
    _html.push('                <li class="col2"><span class="col-btn" rel="'+_data[id]['id']+'">'+_data[id]['name']+'</span></li>');
    }
    _html.push('                <!--li class="col2"><span class="col-btn igreen">更多...</span></li-->');
    _html.push('            </ul>');
    _html.push('            <div class="im-change">');
    _html.push('                <a href="javascript:void(0)" class="im-btn btn-other" style="display:none;">其他目的地</a>');
    _html.push('                <input name="child_dest" id="child_dest" type="text" class="ipt-txt" maxleng="50" placeholder="在这里填写其它目的地" value="" style="display: block;"/>');
    _html.push('            </div>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="submit">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display:none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('                <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('                <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="three_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

//第三部，初始化字目的地
wx.threeInit = function() {
    this.threeBindClichk();
};

wx.threeBindClichk = function() {
    var $threePg = $("#three_pg");
    var _otherBtn = $threePg.find("a.im-btn");
    //字目的地选择
    $threePg.find("li.col2").on("click", "span", function(){
        if( 1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status )
            return false;
        var _class = $(this).attr("class");
        if( -1 === _class.indexOf("col-selected") )
            $(this).addClass("col-selected");
        else{
            $(this).removeClass("col-selected");
        }
    });

    //其它设定
    _otherBtn.bind("click", function(){
        if( 1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status)
            return false;
        $threePg.find("li.col2>span").removeClass("col-selected");
        $(this).hide().next().show();
    });

    var writeTips = "在这里填写其它目的地";
    $("#child_dest").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    //重新提交
    $threePg.find("button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        var $imChange = $threePg.find("div.im-change");
        $threePg.find("li.col2>span").removeClass("col-selected col-disabled");
        $threePg.find("div.im-btns").show().next().hide(); //确认选择
        $("#child_dest").val("").removeClass("col-disabled").removeAttr("disabled");
        $threePg.next().hide().find("p").html("&nbsp;");
        $threePg.next().nextAll().remove();

        wx.child_dest_click_status = 0; //子目的地解禁
        wx.first_child_dest_click_status = 0;

        wx.days_click_status = 0; //天数解禁
        wx.first_days_click_status = 0;
    });

    wx.threeChildDestConfirm();

    scrollBottom();
};

wx.threeChildDestConfirm = function( ) {
    var $threePg = $("#three_pg");
    $("#three_pg").find("div.im-btns button.im-btn").click(function(){
        if(1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status)
            return false;
        var jsonList = JSON.parse( $.cookie("subdestlist") ); //subdestlistselect  本地化存储
        var destText = []; //文本
        var ids = []; //ID
        var other = $.trim( $("#child_dest").val() ); //
        var otherId = "";
        var childDest = "";
        var ArrIndex = [];
        var $selected = $threePg.find("li.col2>span.col-selected");
        var length = $selected.length;
        if( !other && 0 === length ) {
            alertLayer("请选择或填写目的地");
            return false;
        }
        wx.first_child_dest_click_status = 1;

        $threePg.find("li.col2>span").each(function(i){
            var _text = $.trim( $(this).text() );
            var _id = $(this).attr("rel");
            var _class = $(this).attr("class");
            var _num = _class.indexOf("col-selected");
            var _index = $(this).parent().index();

            if( -1 !== _num ) {
                destText.push(_text);
                ids.push( _id );
                ArrIndex.push(_index);
            }
            else{
                $(this).addClass( "col-disabled" );
            }
            if( other == _text &&  -1===_num ) {
                destText.push( _text );
                ids.push( _id );
            };
        });
        $("#child_dest").addClass("col-disabled").attr("disabled", true);

        //本地化
        if( ArrIndex.length > 0)
            jsonList.index = ArrIndex.join(",");
        jsonList.other = other;

        storageSave("destdays",null);
        storageSave("triplist",null);
        storageSave("peoplenum", null);
        storageSave("userinfo", null);
        storageSave("subdestlist", jsonList);

        $threePg.find("div.im-btns").hide().next().show();
        if( length > 0 ) {
            childDest = destText.join(",");
            if( other && -1 === $.inArray(other, destText) ) {
                childDest += "," + other;
                var _html = wx.getRouteHtml( {} );
                $("#trip_order").append(_html);
                wx.fourInit();
            }
            else{

                var _ids = ids.join(",");
                if( ids.length > 1 ) {
                    var _json = {"id":_ids,"name":childDest};
                    //wx.getRouteDays( _json, "/route/getDaysMoreDest" ); //子目的地线路
                    wx.getRouteDays( _json ); //子目的地线路
                }
                else{
                    var _json = {"id":_ids,"name":childDest};
                    wx.getRouteDays( _json ); //子目的地线路
                }
            }

            cookieAdvistor["dest"] = childDest;
            setCookieAdvistor(cookieAdvistor);
            $threePg.next().show().find("p").text( "我想要去" + childDest );
        }
        else{
            cookieAdvistor["dest"] = other;
            setCookieAdvistor(cookieAdvistor);
            $threePg.next().show().find("p").text( "我想要去" + other );
            //填写
            var childDest = destText.join(",")
            if( -1 === $.inArray(other, destText) ) {
                childDest += "," + other;
                var _html = wx.getRouteHtml( {} );
                $("#trip_order").append(_html);
                wx.fourInit();
            }
            else{
                $.get("/plus/travel/getDays.php", {dest:other}, function(data){
                    if( !data || $.isEmptyObject( data ) ) {
                        alertLayer("获取天数失败");
                        return false;
                    }
                    if( data.status && 1 == parseInt( data.status )) {
                        var _html = wx.getRouteHtml( data.data );
                    }
                    else{
                        var _html = wx.getRouteHtml( {} );
                    }
                    $("#trip_order").append(_html);
                    wx.fourInit();
                },"json");
            }

        }
    });
};

//第四步骤 天数
//{dest:data.id, type:"days"}
wx.getRouteDays = function(data, url) {
    url = url || "/plus/travel/getDays.php";
    $.get(url, { "dest":data.name }, function(data){
        if( !data || $.isEmptyObject( data )) {
            alertLayer("获取天数失败");
            return false;
        }
		var status = parseInt(data.status);
		if(0==status){
			alertLayer("没有找到推荐的行程");
            return false;
		}
        if(1==status ){
            var _html = wx.getRouteHtml( data.data );
            $("#trip_order").append(_html);
            wx.fourInit();
        }
    }, "json");
};

//天数HMTL
wx.getRouteHtml = function ( data ) { //获取天数
    var jsonList = $.cookie( "destdays" );
    if( !jsonList ) {
        jsonList = {"list":data, "index":parseInt(noComfirmStatus), "days":"", "month":"", "date":""};
    }
    else{
        jsonList = JSON.parse( jsonList );
        jsonList.list = data;
    }
    daysTripJson = ($.isPlainObject(data) && !$.isEmptyObject(data)) ? data : {};
    storageSave("destdays", jsonList ); //天数*/

    var _html = [];
    _html.push('<li class="im-item me" id="four_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">出行天数</div>');
    /*select day*/
    _html.push('        <div class="city-list">');
    _html.push('            <ul class="list-row clearfix">');
    for( var day in data ) {
        wx.days_type = 1;
        day = (!day || isNaN(day)) ? 0 : parseInt( day );
        if(day>15) {
            continue;
        }
        _html.push('                <li class="col3"><span class="col-btn"><i class="f24" rel="'+data[day]+'">'+day+'</i>天</span></li>');
    }
    _html.push('            </ul>');
    _html.push('        </div>');
    /*select day end*/
    _html.push('        <div class="im-form">');
    _html.push('            <ul class="form-list">');
    /*No confirm*/
    _html.push('                <li id="outdate_box" style="display:none;">');
    _html.push('                    <h3>选择出行日期：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <select style="width:100px;" class="ipt-txt select-txt select-txt-date" name="outmonth" id="outmonth">');
    _html.push('                        </select>');
    _html.push('                        <select class="ipt-txt select-txt select-txt-date" name="outdate" id="outdate">');
    _html.push('                        </select>');
    _html.push('                        </select>');
    _html.push('                   </span>');
    _html.push('                </li>');
    _html.push('                <li class="tips-li" id="daytips_box" style="display: none;">');
    _html.push('                    <span class="tips-img tips-img-error mr5"></span>注：若不确定具体日期，可选择不确定 。');
    _html.push('                </li>');
    /*No confirm start*/
    _html.push('                <li>');
    _html.push('                    <h3>游玩天数：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <select name="set_days" id="set_days" class="ipt-txt select-txt">');
    _html.push('                            <option value="">请选天数</option>');
	_html.push('                            <option value="1">1天</option>');
    _html.push('                            <option value="2">2天</option>');
    _html.push('                            <option value="3">3天</option>');
    _html.push('                            <option value="4">4天</option>');
    _html.push('                            <option value="5">5天</option>');
    _html.push('                            <option value="6">6天</option>');
    _html.push('                            <option value="7">7天</option>');
    _html.push('                            <option value="8">8天</option>');
    _html.push('                            <option value="9">9天</option>');
    _html.push('                            <option value="10">10天</option>');
    _html.push('                            <option value="11">11天</option>');
    _html.push('                            <option value="12">12天</option>');
    _html.push('                            <option value="13">13天</option>');
    _html.push('                            <option value="14">14天</option>');
    _html.push('                            <option value="15">15天</option>');
    _html.push('                            <option value="16">15天以上</option>');
    _html.push('                        </select>');
    _html.push('                    </span> </li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="button">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display:none;">');
    _html.push('            <div class="sel-item-l"><i class="icon-success mr5"></i>已选择</div>');
    _html.push('            <div class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></div>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="four_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    return _html.join("");
};

wx.fourInit = function() {
    selectMonth = $("#outmonth");
    selectDay = $("#outdate");

    YearMonth.init();
    scrollBottom();
    this.fourBindClick();
    this.showInput();
};

//选择天数不存在；只能填写天数
wx.showInput =function() {
    noComfirmStatus ? $("#outdate_box,#daytips_box").show() : $("#outdate_box,#daytips_box").hide();
    return true;
};

//天数事件绑定
wx.fourBindClick = function() {
    var $fourPg = $("#four_pg");
    //天数选择
    $fourPg.find("li.col3>span").bind("click", function() {
        if( 1===wx.days_click_status || 1===wx.first_days_click_status )
            return false;
        var $self = $(this);
        var _day = "";
        if( $self.hasClass("col-selected") ) {
            $self.removeClass("col-selected");
        }
        else{
            $self.addClass("col-selected").parent().siblings().children("span").removeClass("col-selected");
            var _text = $self.text();
            _day = (!_text) ? "" : parseInt(_text);
        }
        $("#set_days").val( _day );
    });
    //确认选择
    $fourPg.find("div.im-btns button.im-btn").click(function(){
        var setDays = $.trim( $("#set_days").val() );
        setDays = (!setDays || isNaN(setDays)) ? 0 : parseInt(setDays);
        if( !setDays ) {
            alertLayer( "请选择或指定天数" );
            return false;
        }
        if( isNaN( setDays ) || !/^\d{1,3}$/.test(setDays) ) {
            alertLayer("请输入数字，数字长度请限制在3位");
            return false;
        }

        wx.first_days_click_status = 1;
        wx.days_click_status = 0;

        //隐藏并禁用
        $fourPg.find("div.im-btns").hide().next().show();
        $("#set_days,#outmonth,#outdate").addClass("col-disabled").attr("disabled", true);

        //本地化存储
        storageSave("triplist",null);
        storageSave("peoplenum", null);
        storageSave("userinfo", null);

        var jsonList = JSON.parse($.cookie("destdays"));
        var selectIndex = noComfirmStatus ? 1 : 0;
        var _month = $.trim($("#outmonth").val());
        var _date = $.trim($("#outdate").val());
        if(!jsonList) {
            jsonList = {"list":[], "index":selectIndex, "days":setDays, "month":_month, "date":_date};
        }
        jsonList.index = selectIndex;
        jsonList.days = setDays;
        jsonList.month = _month;
        jsonList.date = _date;
        storageSave( "destdays", jsonList );

        cookieAdvistor["days"] = setDays;
        setCookieAdvistor(cookieAdvistor);

        var daymsg = "我选择了"+setDays+"天的行程";
        if( setDays>15 ) {
            daymsg = "我选择了15天以上的行程";
        }
        $fourPg.next().show().find("p").text( daymsg );
        wx.getTripList();
    });
    //天数设定
    $fourPg.find("div.im-change a.im-btn").bind("click", function(){
        if( 1 === wx.days_click_status || 1 === wx.first_days_click_status )
            return false;
        $fourPg.find("li.col3>span").removeClass("col-selected");
        $(this).hide().next().show().val("");
    });

    var writeTips = "在这里填写游玩天数";
    $("#set_days").bind({
        change:function(){
            var $self = $(this);
            var _day = $self.val();
            _day = (!_day || isNaN(_day)) ? 0 : parseInt( _day );
            var $span = $fourPg.find("li.col3").find("span.col-selected");
            var _tday = $span.text();
            _tday = (!_tday || isNaN(_tday)) ? 0 : parseInt( _tday );
            if(_day>0 && _day!=_tday) {
                $span.removeClass("col-selected");
            }
            $fourPg.find("li.col3").each(function(i){
                var $li = $(this);
                var _text = $li.find("span").text();
                _text = !_text ? 0 : parseInt( _text );
                if( _text == _day ) {
                    $li.find("span").addClass("col-selected");
                    $li.siblings().removeClass("col-selected");
                }
            });
        }
    });

    //重新提交
    $fourPg.find("div.finished-sel button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        wx.first_days_click_status = 0;
        wx.days_click_status = 0;
        $fourPg.find("div.im-btns").show().next().hide();
        $fourPg.find("li.col3>span").removeClass("col-selected col-disabled");
        var $imChange = $fourPg.find("div.im-change");
        $imChange.find("a.im-btn").removeClass("col-disabled").hide();
        $("#set_days,#outmonth,#outdate").removeAttr("disabled").removeClass("col-disabled").show();

        var _day = $("#set_days").val();
        _day = (!_day || isNaN(_day)) ? 0 : parseInt( _day );
        $fourPg.find("li.col3").each(function(i){
            var $li = $(this);
            var _text = $li.find("span").text();
            _text = !_text ? 0 : parseInt( _text );
            if( _text == _day ) {
                $li.find("span").addClass("col-selected");
                $li.siblings().removeClass("col-selected");
            }
        });

        $fourPg.next().hide().find("p").text("&nbsp;");
        $fourPg.next().nextAll().remove();
    });
};
//获取天数
wx.getSelectDays = function(){
    return $.trim($("#set_days").val()) || 0;
}

//得到线路行程单
wx.getTripList = function(){
    var $fourPg = $("#four_pg");
    var days = $("#set_days").val();
    days = (!days || isNaN(days)) ? 0 : parseInt(days);
    var routeIds = null;
    var length = daysTripJson.length;

    var daysFlag = true;
    if(length==0 || !daysTripJson[days]) {
        daysFlag = false;
    }

    if( !daysFlag || days>15 ) {
        //直接人数
        wx.getSixPepleHtmlCode();
        return false; //不返回，导致两个人数
    }
    else{
    	//routeIds = daysTripJson[days].join(",");
    	if(daysTripJson[days] instanceof Array){
    		routeIds = Array.prototype.slice.call(daysTripJson[days]).join(",");
    	}else{
    		routeIds = daysTripJson[days];
    	}
        
    }

    if( !routeIds ) {
        //直接人数
        wx.getSixPepleHtmlCode();
    }
    else{
        $.get("/plus/travel/getTripList.php", {"id":routeIds}, function( data ){
            if( data.status && 1==parseInt(data.status) ){
                var _html = wx.getFiveHtml(data.data);
                $("#trip_order").append(_html);
                wx.fiveInit();
                return true;
            }
            //直接人数
            wx.getSixPepleHtmlCode();
        }, "json");
    }

};

//第五步骤  行程单
wx.getFiveHtml = function(data) {
    var len = 0;
    var arrTripIds = [];
    for(var key in data) {
        len+=1;
        var arrRow = data[key];
        arrTripIds.push( arrRow["id"] );
    }

    var jsonList = $.cookie( "triplist" );
    if( !jsonList ) {
        jsonList = {"len":len, "list":arrTripIds, "index":-1, "other":""};
    }
    else{
        jsonList = JSON.parse( jsonList );
        jsonList.list = arrTripIds;
    }
    storageSave("triplist",jsonList ); //保存天数筛选出来的数据

    var _html = [];

    _html.push('<li class="im-item me" id="five_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">为您推荐了<span class=" corange">'+len+'个参考行程</span></div>');
    _html.push('        <div class="jour-cont">');
    _html.push('            <ul class="jour-list">');
    var loop = 0;
    var dataLen = data.length;
    for(var i=0; i<dataLen; i++){
        loop+=1;
        var arrRow = data[i];
        var routeid = arrRow["id"];
        var routeurl = arrRow["url"];
    _html.push('                <li id="trip_list_'+routeid+'" class="jour-item clearfix">');
    _html.push('                    <div class="jour-tit"><span class="j-xc-num">行程'+loop+'</span><a href="/xingcheng/'+routeid+'" target="_blank">'+arrRow.title+'</a></div>');
    _html.push('                    <div class="jour-cost">参考价格：<i class="jour-price">'+arrRow.min_cost+'～'+arrRow.max_cost+'</i>元 <span class="clude-txt">不含往返大交通</span></div>');
    _html.push('                    <div class="jour-wp clearfix">');
    _html.push('                        <div class="jour-img"><a href="'+routeurl+'" target="_blank"><img src="'+arrRow.img+'" width=220 height=145/></a></div>');
    _html.push('                        <div class="jour-line">');
    _html.push('                            <div class="jour-dw">');
    _html.push('                                <div class="jour-line-list">');
    var detail = arrRow.detail;
    for( var day in detail ) {
    _html.push('                                    <dl class="j-day-dl">');
    _html.push('                                        <dt>DAY'+day+'</dt>');
    _html.push('                                        <dd>'+detail[day]+'</dd>');
    _html.push('                                    </dl>');
    }
    _html.push('                                </div>');
    _html.push('                                <p class="pt10"><a href="javascript:void(0)" class="j-more">查看更多...</a></p>');
    _html.push('                            </div>');
    _html.push('                            <div class="jour-btns">');
    _html.push('                                <div class="left col2"><a href="'+routeurl+'" target=_blank class="im-btn btn-yellow mr15">查看详细</a></div>');
    _html.push('                                <div class="left col2"><a href="javascript:void(0)" class="im-btn btn-green" rel="'+routeurl+'">参考并询价</a></div>');
    _html.push('                            </div>');
    _html.push('                        </div>');
    _html.push('                    </div>');
    _html.push('                </li>');
    }//end
    _html.push('                </ul>');
    _html.push('            </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <span class="im-txt">都不符合我的要求，请</span>');
    _html.push('            <a href="javascript:;" class="im-btn btn-normal">重新帮我规划一个</a>');
    _html.push('            <input type="hidden" name="trip_id" id="trip_id" value="">');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    _html.push('<li class="im-item you" id="five_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

wx.fiveInit = function() {
    wx.fiveBindClick();
};

//第五步骤 绑定事件
wx.fiveBindClick = function() {
    var $fivePg = $("#five_pg");
    var jsonList = JSON.parse( $.cookie("triplist") ); //本地化存储
    $fivePg.find("li.jour-item a.btn-green").click(function(){
        if( 1 === wx.submit_status )
            return false;
        $routeId = $(this).attr("rel");
        $("#trip_id").val($routeId);
        //本地化
        var selectIndex = $(this).parent().parent().parent().index();
        jsonList.other = "";
        jsonList.index = $routeId; //本地化存储
        storageSave("triplist", jsonList);

        storageSave("peoplenum", null);
        storageSave("userinfo", null);

        $fivePg.find("div.col2 a.btn-green").removeClass("col-selected");
        $(this).addClass("col-selected");

        var _text = $(this).parents("div.jour-wp").siblings("div.jour-tit").find("span").text();
        $fivePg.next().nextAll().remove();
        $fivePg.next().show().find("p").text("请对"+_text+"帮我报价");
        var _html = wx.sixOrderHtml();
        $("#trip_order").append(_html);
        wx.sixInit();
    });

    //详细行程显示和隐藏
    $fivePg.find("li.jour-item").each(function(i){
        $(this).find("div.jour-line-list").children("dl:gt(3)").hide();
        $(this).find("div.jour-dw").find("p>a").click(function(){
            //if( 1 === wx.submit_status )
            //    return false;
            var _text = $(this).text();
            if( -1 === _text.indexOf("更多") ) {
                $(this).text("查看更多...");
                $(this).parent().siblings("div.jour-line-list").children("dl:gt(3)").hide();
            }
            else{
                $(this).parent().siblings("div.jour-line-list").children("dl:gt(3)").show();
                $(this).text("点击收起");
            }
        });
    });

    //都不符合要求
    $fivePg.find("div.im-btns>a.im-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        //本地存储
        var jsonList = JSON.parse( $.cookie("triplist") ); //本地化存储
        jsonList.index = -1;
        jsonList.other = "next";
        storageSave("triplist", jsonList);

        storageSave("peoplenum", null);
        storageSave("userinfo", null);

        $fivePg.find("div.col2 a.btn-green").removeClass("col-selected");
        $(this).next().val(""); //input值空
        $fivePg.next().hide().find("p").text("&nbsp;");
        $fivePg.next().nextAll().remove();
        var _html = wx.sixOrderHtml();
        $("#trip_order").append(_html);
        wx.sixInit();
    });

    scrollBottom();
};

//第六步骤  人数
wx.getSixPepleHtmlCode = function() {
    var _html = wx.sixOrderHtml();
    $("#trip_order").append( _html );
    wx.sixInit();
};
//人数界面
wx.sixOrderHtml = function(){
    var _html = [];
    _html.push('<li class="im-item me" id="six_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">请提供您的人数和服务要求</div>');
    _html.push('        <div class="im-form">');
    _html.push('            <ul class="form-list">');
    _html.push('                <li>');
    _html.push('                    <h3>几个人出游：</h3>');
    _html.push('                    <div class="fRight">');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">成人</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease"></span>');
    _html.push('                                <span class="ct"><input name="adult_num" id="adult_num" type="text" class="textbox" value="1"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                        </div>');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">儿童</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease valuecomb_disable"></span>');
    _html.push('                                <span class="ct"><input name="child_num" id="child_num" type="text" class="textbox" value="0"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                            <span class="peptxtsmall">0-11岁</span>');
    _html.push('                        </div>');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">老人</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease valuecomb_disable"></span>');
    _html.push('                                <span class="ct"><input name="old_num" id="old_num" type="text" class="textbox" value="0"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                            <span class="peptxtsmall">65岁以上</span>');
    _html.push('                        </div>');
    _html.push('                    </div>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>其它要求：</h3>');
    _html.push('                    <div class="fRight">');
    _html.push('                        <textarea name="trip_content" id="trip_content" class="area-txt" placeholder="在这里填写您的要求"/></textarea>');
    _html.push('                    </div>');
    _html.push('                </li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button href="javascript:;" class="im-btn btn-normal" type="button">确认提交</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display: none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('               <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('               <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('           </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="six_tips" style="display: none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

wx.sixInit = function(){
    wx.sixBindClick();
};

wx.sixBindClick = function(){
    $sixPg = $("#six_pg");
    $sixPg.find("button.im-btn").click(function(){
        var total = 0;
        $sixPg.find("input").each(function(i){
            var num = $(this).val();
            num = num || 0;
            total += (isNaN(num) ? 0 : parseInt(num));
        });
        if( total<1 ) {
            alertLayer("请指定成人或儿童、老人的人数");
            return false;
        }
        $sixPg.find("input").attr("disabled", "disabled");
        $("#trip_content").attr("disabled", "disabled");
        $(this).parent().hide().next().show();
        $sixPg.next().show().find("p").text("我们一共"+total+"个人");
        wx.localSavePeple(); //人数本地存储数据
        var _html = wx.getContactHtml();
        $("#trip_order").append(_html);
        wx.sevenInit();
    });

    var writeTips = "在这里填写您的要求";
    $("#trip_content").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    $sixPg.find("button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        $sixPg.find("input.num-value-txt").removeAttr("disabled").removeClass("col-disabled");
        $sixPg.find("textarea[name=trip_content]").removeAttr("disabled").removeClass("col-disabled");
        $sixPg.find("span.cui-number-ma").removeClass("cui-disabled");
        $(this).parent().parent().parent().hide().prev().show();
        $sixPg.next().hide().find("p").text("&nbsp;");
        $sixPg.next().nextAll().remove();

        $sixPg.find("span.num-minus").attr("onclick", "minus_people(this);");
        $sixPg.find("span.num-add").attr("onclick", "add_people(this);");
    });

    $sixPg.find("span.decrease").attr("onclick", "minus_people(this);");
    $sixPg.find("span.increase").attr("onclick", "add_people(this);");

    scrollBottom();
};

//本地化
wx.localSavePeple = function() {
    var adult = $("#adult_num").val();
    var child = $("#child_num").val();
    var old = $("#old_num").val();
    var content = $("#trip_content").val();
    storageSave("userinfo", null);
    var peoplenum = {"adult":adult, "child":child, "old":old, "content":content};
    storageSave("peoplenum", peoplenum);
    return true;
};


//第七步骤；姓名和手机
wx.getContactHtml = function(){
    var _html = [];
    _html.push('<li class="im-item me" id="seven_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">请留下您的联系方式，方便报价过程中和您沟通</div>');
    _html.push('        <div class="im-form">');
    _html.push('            <ul class="form-list">');
    _html.push('                <li>');
    _html.push('                    <h3>您的称呼：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                            <input type="text" class="ipt-txt" name="username" id="username" maxlength="20" id="" placeholder="请输入您的称呼" value="'+memberInfo['username']+'">');
    _html.push('                     </span>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>联系方式：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <input type="text" class="ipt-txt" name="contact" id="contact" maxlength="20" placeholder="请输入您的手机号码" value="'+memberInfo['contact']+'">');
    _html.push('                    </span>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>QQ：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <input type="text" class="ipt-txt" name="qq" id="qq" maxlength="20" placeholder="请输入您的QQ号码" >');
    _html.push('                    </span>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>微信号：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <input type="text" class="ipt-txt" name="wechat" id="wechat" maxlength="20" placeholder="请输入您的微信号码" >');
    _html.push('                    </span>');
    _html.push('                </li>');
    if(!memberInfo['wx_openid']){
        _html.push('                <li>');
        _html.push('                    <h3>方便联系时间：</h3>');
        _html.push('                    <span class="fRight">');
        _html.push('                        <select class="ipt-txt select-txt" name="calltype" id="calltype">');
        _html.push('                            <option value="3">全天均可</option>');
        _html.push('                            <option value="4">午休时间</option>');
        _html.push('                            <option value="5">18点以后</option>');
        //_html.push('                            <option value="6">打电话前先发短信</option>');
        _html.push('                        </select>');
        _html.push('                    </span>');
        _html.push('                </li>');
    }

    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="button">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display: none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('                <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('                <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="seven_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};


wx.sevenInit = function() {
    wx.sevenBindClick();
};


wx.sevenBindClick = function () {
    var $sevenPg = $("#seven_pg");
    $sevenPg.find("div.im-btns button.im-btn").click(function() {
        var _contact = $.trim($("#contact").val()) || '';
        var mobile =  /\d+/;
        if( !_contact  || !mobile.test(_contact)) {
            alertLayer("请填写您的手机号码");
            return false;
        }
        var _username = $.trim($("#username").val()) || '';
        if( !_username ) {
            alertLayer("请填写您的姓名");
            return false;
        }
        wx.saveUserInfo(); //用户信息，本地化存储
        $("#username").addClass("col-disabled").attr("disabled", true);
        $("#contact").addClass("col-disabled").attr("disabled", true);
        $("#calltype").addClass("col-disabled").attr("disabled", true);
        $(this).parent().hide().next().show();
        //Ajax
        wxAjax.saveOrder();
    });
    $sevenPg.find("div.finished-sel button.resel-btn").click(function() {
        if( 1 === wx.submit_status )
            return false;
        $("#username").removeClass("col-disabled").removeAttr("disabled");
        $("#contact").removeClass("col-disabled").removeAttr("disabled");
        $("#calltype").removeClass("col-disabled").removeAttr("disabled");

        $sevenPg.find("div.finished-sel").hide().prev().show();
        $sevenPg.next().hide().find("p").text("&nbsp;");
        $sevenPg.next().nextAll().remove();
    });

    var writeTips = "请输入您的称呼";
    $("#username").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    writeTips2 = "请输入您的手机号码";
    $("#contact").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips2 ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips2);
            }
        }
    });

    scrollBottom();
};

wx.saveUserInfo = function() {
    var realname = $("#username").val() || "";
    var mobile = $("#contact").val() || "";
    var calltype = $("#calltype").val() || "";
    var userinfo = {"realname":realname, "mobile":mobile, "calltype":calltype};
    storageSave( "userinfo", userinfo );
    return true;
};

//订单重新提交后，可以清除cookie
wx.submitOkBindResetClick = function() {
    $tripOrder.find("div.finished-sel button.resel-btn").click(function() {
        mastDisableStatus = 1;
        $("#mask_disable").show();
    });
};

var wxAjax = {
    getDays:function(){
        var days = $.trim($("#set_days").val());
        days = (!days || isNaN(days)) ? 0 : parseInt(days);
        return days;
    },
    getStartTime:function(){
        if( !noComfirmStatus ){
            starttime = "";
            return "目的地已确定";
        }
        var _month = $.trim($("#outmonth").val());
        var _date = $.trim($("#outdate").val());
        if(!_month) {
            starttime = "没有选择日期";
            return "没有选择日期";
        }
        if( "none"==_month ) {
            starttime = "不确定日期";
            return "出发日期:不确定";
        }
        if("none"==_date || !_date) {
            starttime = _month;
            return "出发日期:"+_month;
        }
        starttime = (_month + "-" +_date);
        return "出发日期:" + starttime;
    },
    getOrderId:function() {
        return $.trim($("input[name=order_id]").val()) || "";
    },
    getAdult:function() {
        return $.trim($("#adult_num").val()) || 0;
    },
    getChild:function() {
        return $.trim($("#child_num").val()) || 0;
    },
    getOld:function() {
        return $.trim($("#old_num").val()) || 0;
    },
    getDest:function() {
        var _childDest = $.trim($("#child_dest").val()) || "";
        var _dest = $.trim($("#destination").val()) || "";
        if( !_dest || _childDest ) {
            alertLayer("获取目的地错误");
            return false;
        }
        if( !_childDest ) {
            _dest = _childDest;
        }
        return _dest;
    },
    getDestText:function() {
        var $threePg = $("#three_pg");
        var _dest = $.trim($("#second_pg").find("li.col3>span.col-selected").text()) || $.trim($("#destination").val());
        var _childDest = '';
        var listDest = [];
        var childNum = $threePg.find("li.col2>span.col-selected").length;
        if( _dest ) {
            listDest.push( _dest );
        }
        if( childNum>0 ){
            $threePg.find("li.col2>span.col-selected").each(function(i){
                listDest.push($.trim($(this).text()) );
            });

        }

        var childOther = $.trim($("#child_dest").val()) || "";
        if( childOther ) {
            listDest.push( childOther );
        }
        _childDest = listDest.join( "," );

        _dest = (_childDest || _dest);
        return _dest;
    },
    getContact:function() {
        return $.trim($("#contact").val()) || "";
    },
    getUsername:function() {
        return $.trim($("#username").val()) || "";
    },
    getTripId:function(){
        var _tripId = $.trim($("#trip_id").val()) || 0;
        return isNaN(_tripId) ? 0 : parseInt(_tripId);
    },
    getToken:function() {
        return $.trim($("#token").val());
    },
    getTripContent:function(){
        return $.trim( $( "#trip_content" ).val() );
    },
    saveOrder:function() {
        var token = this.getToken();
        if( !token ) {
            alertLayer("请先刷新页面，否则订单不允许提交");
            return false;
        }
        var _mobile = this.getContact();
        var params = {
            "order_id":this.getOrderId(),
            "dest":this.getDestText(),
            "adult":this.getAdult(),
            "child":this.getChild(),
            "old":this.getOld(),
            "oid":this.getTripId(),
            "mobile":_mobile,
            "realname":this.getUsername(),
            days:this.getDays(),
            token:this.getToken(),
            user_demand:this.getTripContent() + " " + this.getStartTime(),
            "calltype":$("#calltype").val(),
            "qq":$("#qq").val(),
            "wechat":$("#wechat").val(),
            "starttime":starttime,
            "fields":"starttime,text;order_id,text;dest,text;adult,int;child,int;old,int;oid,int;realname,text;mobile,text;days,int;user_demand,multitext;calltype,text;qq,text;wechat,text",
             "hash":orderhash
        };

        $.post("/plus/travel/saveorder.php", params, function(data){
            if( !data || $.isEmptyObject( data ) ) {
                alertLayer("订单提交失败1");
                $("#seven_pg").next().hide().find("p").text("");
                return false;
            }

            if( 1 == data.status ) {
                if( 1 != data.data.is_valid ) {
                   // orderLayer.validMobile( _mobile );
                }
                wx.submitOkBindResetClick();
                wxAjax.saveOrderCallback( data.data );
                return true;
            }else if(data.msg != undefined){
            	alertLayer(data.msg);
                $("#eight_pg").next().hide().find("p").text("");
                return false;
            }
            else{
                alertLayer("订单提交失败2");
                $("#eight_pg").next().hide().find("p").text("");
               return false;
            }
        },"json");
    }
};

wxAjax.saveOrderCallback = function( json ) {
    //获取右侧订单信息
    var _contact = wxAjax.getContact();

    zoomOrderSn =  json.order_sn;
    json.mobile = _contact;
    $("#order_id").val( json.order_id );
    $("#order_sn").val( json.order_sn );
    $("#member_id").val( json.member_id );
    imChat.orderId = json.order_id;
    storageSave( "submitorder", JSON.stringify( json ) );
    $("#token").val("");

    wxAjax.clearCookie();
    imChat.getRightOrderInfo( json.order_sn );

    wx.submit_status = 1;
    //20141202 屏蔽
    //imChat.resetChatBox( 1 ); //显示留言
    //imChat.getPreMsg(); //获取留言前10条
	
	//直接显示完成
	var _html = wx.eightSiteTips();
    $tripOrder.append( _html );
    wx.eightInit();
    return true;
};

wxAjax.clearCookie = function() {
    cookieList = pcOrderCookie.cookieList;
    for( var i in cookieList ) {
        if( "submitorder" == cookieList[i] )
            continue;
        storageSave( cookieList[i], null );
    }
};

wx.eightSiteTips = function() {
    var _html = [];
    _html.push('<li class="im-item me" id="eight_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="thanks-cont">');
    _html.push('            <div class="thanks-top">');
    _html.push('                <div class="thank-flag"><span class="thank-icon"></span></div>');
    _html.push('                <div class="thank-txt">感谢您选择VINER旅游小团服务!</div>');
    _html.push('            </div>');
    _html.push('            <div class="thanks-dw">');
    if(  this.isChkWorktime() ){
    _html.push('                <p class="c9">1对1旅行管家已经收到您的定制需求，会和您电话沟通细节和初步行程报价。我们的呼出号码为(区号法国)<i class="igreen">0033-782051820</i>，请注意接听。</p>');
    }
    else{
    _html.push('                <p class="c9">我们会在工作时间和您电话沟通细节和初步行程报价。我们的呼出号码为(区号法国)<i class="igreen">0033-782051820</i>，请注意接听。</p>');
    }
    _html.push('            </div>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    return _html.join("");
};

wx.isChkWorktime = function() {
    var _hour = $.trim( $("#server_hour").val() ) || "";
    if( !_hour || isNaN( _hour ) ) {
        var date = new Date();
        var tempHour = date.getHours();
        var tempMim = date.getMinutes();
        _hour = tempHour + "." + tempMim;
    }
    _hour = parseFloat( _hour );
    if( _hour>=9.0 && _hour <= 18.0 ) {
        return true;
    }
    return false;
};

wx.eightInit = function(){
    scrollBottom();
};

wx.tripInputParams = function( json ){
    var dest = !json.destination ? "" : $.trim( json.destination );
    var days = isNaN( json.days ) ? 0 : parseInt(json.days);

    var jsonList = JSON.parse( $.cookie("triplist") );
    jsonList.trip_id = paramTripId;
    jsonList.dest = dest;
    jsonList.days = days;
    storageSave("triplist", jsonList);

    cookieAdvistor["dest"] = dest;
    cookieAdvistor["days"] = days;
    setCookieAdvistor(cookieAdvistor);

    var _html = [];
    $("#destination").val( dest );
    _html.push('<br><input type="hidden" name="set_days" id="set_days" value="'+days+'">');
    $("#token").after( _html.join("") );
    return true;
};

var imChat = {
    tipNumTime:0, //
    tipNumTitle:document.title,
    tipNumTimer:null,
    tipNum:0,
    firstId:0,
    lastId:0,
    orderId:0, //订单编号
    noReadTimes:0, //总循环次数
    noReadLoading:0, //AJAX状态；1请求；0中断
    noReadInterval:3000,
    isLine:0, //客服是否在线
    preReadScrollType:0, //点击更多状态
    preReadStatus:0, //reload状态，1跳过eight_pg
    existsChatIds:{} //已存在chat_id
};

//更多或前10条记录
imChat.getPreMsg =  function(_func) {
    _func = _func || "imChat.getPreMsgCallback";
    var $loadMore = $("#load_more");
    $loadMore.hide().next().show();
    /**
    $.ajax({
        type: "get",
        url: 'http://im.6renyou.com/chat',
        data: {
            a:'g_user_msg',
            first_id:this.firstId,
            id_type:2,
            get_normal:1,
            to_type:1,
            to_user:this.orderId,
            oid:this.orderId,
            callback:_func,
            from_type:2,
            from_user:operatorUid
        },
        dataType:"script",
        error:function(){

        }
    });
    **/
};

//回调没有操作，只有last_id获取
imChat.getPreMsgLastIdCallback = function( json ) {
    if( json["status"] && 1 === parseInt( json['status'] ) ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total>0 ) {
            if(0 == imChat.preReadScrollType){
                this.lastId = json['data'][0]['id'];
            }
        }
    }
    if( 0 === imChat.noReadTimes ) {
        //未启动，就执行
        setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
    }
};

imChat.getPreMsgCallback = function( json ) {
    if( json["status"] && 1 === parseInt( json['status'] ) ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total>0 ) {
            if(0 == imChat.preReadScrollType){
                this.lastId = json['data'][0]['id'];
            }
            if( 1 === imChat.preReadScrollType ) {
                $("#first_pg").after(imChat.getMsgHtml(json));
                //$imScroll.scrollTop( 0 );
                $imScroll.animate({scrollTop:0},800);
            }
            else {
                $tripOrder.append( imChat.getMsgHtml(json) );
                //$imScroll.scrollTop( $tripOrder.height() );
                $imScroll.animate({scrollTop:$tripOrder.height()},800);
            }
            this.firstId = json['data'][_total-1]['id'];
        }
        var $loadMore = $("#load_more");
        if( _total < 10 ) {
            $loadMore.hide().next().hide();
        }
        else{
            $loadMore.show().next().hide();
        }
        imChat.isLineStatus(json['line']);

        //订单完成，留言读取完毕，显示提示语
        imChat.getOrderTips();
    }

    if( 0 === imChat.noReadTimes ) {
        //未启动，就执行
        setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
    }
};


imChat.getOrderTips = function() {
    if( orderSn || 1===imChat.preReadStatus )
        return false;
    /*setTimeout(function() {
            var _html = wx.eightSiteTips();
            $tripOrder.append( _html );
            wx.eightInit();
    }, _timeout);*/
    return true;
};

//循环获取聊天消息
imChat.getNoReadMsg = function (){
    if( 1===this.noReadLoading ){
        return false;
    }
    this.noReadLoading = 1;
    /**
    $.ajax({
        type: "get",
        url: 'http://im.6renyou.com/chat',
        data: {
            a:'g_user_msg',
            id_type:1,
            last_id:imChat.lastId,
            custom_line:imChat.isLine,
            to_type:1,
            to_user:imChat.orderId,
            oid:imChat.orderId,
            callback:"imChat.getNoReadMsgCallback",
            from_type:2,
            from_user:operatorUid
        },
        dataType: 'script',
        error:function(){
            imChat.noReadLoading = 0;
        }
    });
    **/
};
imChat.getNoReadMsgCallback = function( json ) {
    imChat.noReadLoading = 0; //1个AJAX请求完成后；状态置为0
    if(  json["status"] && 1 === parseInt( json["status"] )  ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total > 0 ) {
            imChat.lastId = json['data'][0]['id'];
            imChat.tipNum += _total;

            if(!imChat.tipNumTimer){ //标题提示
                imChat.tipTitle();
            }
            $tripOrder.append(imChat.getMsgHtml(json));
            //$imScroll.scrollTop( $tripOrder.height() );
            $imScroll.animate({scrollTop:$tripOrder.height()},300);
        }
        imChat.isLineStatus(json['line']);
    }
    imChat.noReadTimes += 1;
    setTimeout(function(){imChat.getNoReadMsg();}, imChat.noReadInterval); //循环取消息
};
imChat.sendMsg = function( obj ) {
    if( !imChat.orderId ) {
        alert("请您先下订单");
        return false;
    }
    if( 1 == $(obj).attr("rel") )
        return false;
    var message = $.trim( $("#message_input").val() );
    if( !message ) {
        alert("请留言");
        return false;
    }
    if( message.length > 200 ){
        alert("请少于200字");
        return false;
    }
    message = '<p class="im-you-txt">'+message+'</p>';
    var params = {message:message,oid:imChat.orderId};
    $(obj).attr("rel", 1)
    
    alert("暂不支持发送消息");
    /**
    $.post("http://www.6renyou.com/ordercext/sendChat", params, function( json ) {
        if( 1 === json.status ) {
            imChat.existsChatIds[json.last_id] = 1;
            $tripOrder.append(imChat.getMsgTpl(json.message, 2));
            $("#message_input").val("");
            //$imScroll.scrollTop( $tripOrder.height() );
            $imScroll.animate({scrollTop:$tripOrder.height()},600);
            if( 0 === imChat.noReadTimes ){
                imChat.getNoReadMsg();
            }
        }
        $(obj).attr("rel",'0');
    }, "json");
    **/
};

imChat.getMsgTpl = function( msg, type ) {
    var _html = [];
    if( 2 == type ) {
        _html.push('<li class="im-item you">');
        _html.push('    <div class="im-content">');
        _html.push('        <div class="im-info">');
        _html.push(msg);
        _html.push('        </div>');
        _html.push('        <span class="chat-triangle"></span>');
        _html.push('    </div>');
        _html.push('</li>');
    }
    else{
        _html.push('<li class="im-item me">');
        _html.push('    <div class="im-content">');
        _html.push('        <div class="im-info">');
        _html.push(msg);
        _html.push('        </div>');
        _html.push('        <span class="chat-triangle"></span>');
        _html.push('    </div>');
        _html.push('</li>');
    }

    return _html.join("");
};

imChat.getMsgHtml = function(json){
    var _h = [];
    for(var i=json['c']-1;i>=0;i--){
        var row = json['data'][i];
        var chatId = row['id'];
        if( imChat.existsChatIds[chatId] ){
            imChat.tipNum -= 1;
            continue;
        }

        if(row['to_type']=='2'){
            _h.push( imChat.getMsgTpl(row['message'], 2) );
        }
        else if(row['to_type']=='1'){
            _h.push( imChat.getMsgTpl(row['message'], 1) );
        }
    }
    return _h.join('');
};

imChat.resetTipTitle = function(){
    if( imChat.tipNumTimer ){
        clearTimeout(imChat.tipNumTimer);
    }
    imChat.tipNumTimer = null;
    setTimeout(function(){
        document.title = imChat.tipNumTitle;
    },100);
    imChat.tipNum = 0;
};

imChat.tipTitle = function(){
    if(this.tipNumTimer){
        clearTimeout(this.tipNumTimer);
    }
    if(this.tipNum > 0){
          this.tipNumTimer = setTimeout(function () {
            if( imChat.tipNum > 0 ) {
              imChat.tipNumTime++;
              if (imChat.tipNumTime % 2 == 0) {
                  document.title = "【"+imChat.tipNum+"条新消息】" + imChat.tipNumTitle;
              }else {
                  document.title = "【         】" + imChat.tipNumTitle;
              }
              imChat.tipTitle();
            }
          }, 600);
    }
};
imChat.isLineStatus = function( line ) {
    imChat.isLine = line;
    $("#chat_online>div.six-img").show();
    $("#chat_online>i.six-txt").show();
    if(parseInt(line)==1){
        $('#chat_online div.six-img span').removeClass('six-outline').addClass('six-online');
        $('#chat_online i.six-txt').html('在线');
        $('#chat_online div.chat-r-top div.no-line').hide();
        $('#send_input_box input.chat-send-btn').val('发送');
    }
    else{
        if($('#chat_online i.six-txt').html()=='在线'){
            $('#chat_online div.six-img span').removeClass('six-online').addClass('six-outline');
            $('#chat_online i.six-txt').html('离线');
            imChat.tipOffline();
        }
        if($('#chat_online div.no-line').length<=0){
            imChat.tipOffline();
        }
    }
};

imChat.tipOffline = function() {
    if($('#chat_online div.no-line').attr('hand') != '1'){
        //$('#chat_online div.no-line').show();
    }
    $('#send_input_box input.chat-send-btn').val('留言');
};

imChat.getRightOrderInfo = function( orderSn ) {
	//直接返回了。不获取
	return;
    $.ajax({
        type:'get',
        url:'/plus/travel/getOrder.php',
        data:{"sn":orderSn,"type":"right"},
        success:function(right_str){
            if(right_str){
                $('#chat_order_right').html(right_str);
            }
        }
    });
};

imChat.resetChatBox = function ( isShow ) { //0隐藏；1显示
    if( 1 === isShow ) { //留言框显示时，聊天框高度降低；
        $("#im_scroll").css( "height","451px" );
        $("#send_input_box").show();
    }
    else{
        $("#im_scroll").css( "height","533px" );
        $("#send_input_box").hide();
    }
    return true;
};

//20141101 lc add
var selectParamDest = function( _sDest ){
    if( !_sDest ) return false;
    var isSelect = false;
    if( !isSelect ) {
        $("#tab_in_dest .lc-first-dest").find("li").each(function(){
            var $span = $(this).find("span");
            var spanText = $span.text();
            spanText = $.trim( spanText );
            if( _sDest == spanText ) {
                $("#tab_dest_list").find("li").eq(1).addClass("on").siblings().removeClass("on");
                $span.addClass("col-selected");
                $("#tab_in_dest").show().siblings(".city-tab-bd").hide();
                isSelect = true;
                return true;
            }
        });
    }

    if( !isSelect ) {
        $("#tab_out_dest .lc-first-dest").find("li").each(function(){
            var $span = $(this).find("span");
            var spanText = $span.text();
            spanText = $.trim( spanText );
            if( _sDest == spanText ) {
                $("#tab_dest_list").find("li").eq(2).addClass("on").siblings().removeClass("on");
                $span.addClass("col-selected");
                $("#tab_out_dest").show().siblings(".city-tab-bd").hide();
                isSelect = true;
                return true;
            }
        });
    }
    if( !isSelect ) {
        $("#tab_hot_dest .lc-first-dest").find("li").each(function(){
            var $span = $(this).find("span");
            var spanText = $span.text();
            spanText = $.trim( spanText );
            if( _sDest == spanText ) {
                $("#tab_dest_list").find("li").eq(0).addClass("on").siblings().removeClass("on");
                $span.addClass("col-selected");
                $("#tab_hot_dest").show().siblings(".city-tab-bd").hide();
                isSelect = true;
                return true;
            }
        });
    }

    if( !isSelect ) {
        $("#other_dest").val( _sDest );
    }
};


$(document).ready(function(){
    $('div.chat-item-tit span').click(function(){
        if($(this).hasClass('fold-up')){
            $(this).removeClass('fold-up').addClass('fold-down');
            $(this).parents('div.chat-info-item').find('div.chat-item-detail').hide();
        }
        else{
            $(this).removeClass('fold-down').addClass('fold-up');
            $(this).parents('div.chat-info-item').find('div.chat-item-detail').show();
        }
    });

    if( orderSn ) {
        orderSnId = isNaN(orderSnId)  ? 0 : parseInt( orderSnId );
        if( orderSnId > 0 ) {
            imChat.orderId = orderSnId;
            imChat.getPreMsg();
            setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
            $("#first_pg").hide();
            //20141202 lc 屏蔽
            //imChat.resetChatBox( 1 );
        }
        return;
    }

    paramTripId = isNaN(paramTripId) ? 0 : parseInt( paramTripId );
    if( paramTripId > 0 ) {
        $("#first_pg").hide();
        if( 1 === mastDisableStatus ) //如果有弹层，禁止下执行
            return false;
        $.get("/plus/travel/getTripList.php", {"id":paramTripId}, function( data ){
            if( data.status && 1==parseInt(data.status) ){
                var _html = wx.getFiveHtml(data.data);
                $("ul.im-list").append(_html);
                wx.fiveInit();
                wx.tripInputParams( data.data[0] );
                $("#trip_id").val( paramTripId );
                return true;
            }
            //直接人数
            wx.getSixPepleHtmlCode();
        }, "json");
    }
    else {
        var length =  $("#second_pg").length;
        if( 1 === mastDisableStatus ) //如果有弹层，禁止下执行
        {
            if( $("#second_pg").is(":hidden") )
                $("#first_pg").hide(); //有oid=3775  跳转到  dest=昆明；隐藏first_pg
            else{
                $("#first_pg").show();
            }
            return false;
        }

        if( length > 0 ) {
            $("#first_pg").show();
            $("#token").nextAll().remove();
        }
        wx.firstGetDestBindClick();
        if( paramDest ) {
            var destlist = $.cookie("destlist");
            if( !destlist ) {
                selectParamDest( paramDest ); //20141101 lc add
                var _html = wx.getSolidDestHtml();
                //$("#trip_order").append(_html);
                //wx.secondInit(); 20141104
            }

            wx.paramDestOther();
            var subdestlist = $.cookie('subdestlist');
            if( !subdestlist ) {
                $("#second_pg").find("div.im-btns a.im-btn:first").click();
            }
        }
    }
});