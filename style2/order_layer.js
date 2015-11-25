var maxSecond = 59; //倒计时
var orderLayer = {};

//弹窗
orderLayer.validMobile = function (mobile) {
    mobile = !mobile ? '' : mobile;
    $("#valid_mobile").val( mobile );
    $.colorbox({open:true,inline:true,href:"#inline_content1", width:"600px",complete:function(){
        memberLogin.getWeixinImg(2);
    }});
};

//发送sms，按钮重置
orderLayer.reloadSecond = function reloadSecond() {
    for(var i=maxSecond;i>=0;i--) {
        window.setTimeout('updateSecond(' + i + ')', (maxSecond-i) * 1000);
    }
};

//发送sms
orderLayer.getSms  = function() {
    $smsBtn = $("#sms_btn");
    var stop = $smsBtn.attr("rel");
    stop = (!stop || isNaN(stop)) ? 0 : parseInt( stop );
    if( 1 == stop ) return false;

    var _mobile = this.getMobile();
    if( !this.isValidMobile( _mobile ) ) {
        this.setErrMsg("手机号码格式错误");
        return false;
    }
    $.ajax({
        type:"POST",
        url:"/ordercext/validMobile",
        data:{mobile:_mobile},
        dataType:"json",
        success:function(data){
            if( data.status && 1 == data.status) {
                orderLayer.reloadSecond();
                $("#sms_success").addClass("form-notice-ok").removeClass("form-notice-wrong").show().html("");
            }
            else{
                $("#sms_success").addClass("form-notice-wrong").removeClass("form-notice-ok").show().html(data.info);
                $smsBtn.removeClass("resend-btn").attr("rel", "");
            }
        }
    });
};

//验证
orderLayer.submitInfo = function() {
    $submitBtn = $("#valid_btn");
    var stop = $submitBtn.attr("rel");
    stop = (!stop || isNaN(stop)) ? 0 : parseInt( stop );
    if( 1 == stop ) return false;

    var _mobile = this.getMobile();
    if( !this.isValidMobile( _mobile ) ) {
        this.setErrMsg("手机号码格式错误");
        return false;
    }
    var _code = this.getCode();
    if( !this.isValidCode( _code ) ) {
        this.setSmsErrMsg("验证码格式错误", 1);
        return false;
    }
    this.setSmsErrMsg("验证码输入正确", 2);

    $submitBtn.attr("rel", "1").val("处理中…");
    $.ajax({
        type:"POST",
        url:"/ordercext/validCode",
        data:{mobile:_mobile, code:_code},
        dataType:"json",
        success:function(data){
            if( !$.isPlainObject( data ) || $.isEmptyObject( data ) ) {
                orderLayer.setErrMsg("验证程序错误，请联系网站管理人员");
                return false;
            }
            else{
                if( data.status && 1 == data.status )
                    $("#inline_content1").colorbox.close()
                else{
                    //orderLayer.setErrMsg(data.info);
                    orderLayer.setSmsErrMsg(data.info, 1);
                }
            }
        },
        complete:function(){
            $submitBtn.attr("rel", "").val("提交");
        }
    });
};

//获取手机号码
orderLayer.getMobile = function() {
    return $.trim( $("#valid_mobile").val() );
};

//获取验证码
orderLayer.getCode = function() {
    return $.trim( $("#valid_code").val() );
};

//获取订单编号
orderLayer.getOrderId = function(){
    var orderId = $.trim( $("#order_id").val() );
    return $.isNumeric( orderId ) ? parseInt( orderId ) : 0;
};

//获取选择回访选项
orderLayer.getCalltime = function(){
    var callType = $("#call_tips>li.current").attr("rel");
    return $.isNumeric( callType ) ? parseInt( callType ) : 0;
};


//手机号错误信息
orderLayer.setErrMsg = function(msg){
    $("#mobile_err_msg").show().html(msg);
};

//手机号错误信息
orderLayer.setSmsErrMsg = function(msg, type){
    if( 1 == type )
        $("#sms_success").addClass("form-notice-wrong").removeClass("form-notice-ok").show().html(msg);
    else
        $("#sms_success").addClass("form-notice-ok").removeClass("form-notice-wrong").show().html(msg);
};

//按钮秒数提醒
function updateSecond( i ) {
    i = (!i || isNaN(i)) ? 0 : parseInt( i );
    var $smsBtn = $("#sms_btn");
    var $smsSuccess = $("#sms_success");
    if( i > 0 ) {
        $smsSuccess.show();
        $smsBtn.addClass("resend-btn").attr("rel", "1").html( i + "秒后重新发送");
    }
    else{
        $smsSuccess.hide();
        $smsBtn.removeClass("resend-btn").attr("rel", "").html("获取短信");
    }
}

//校验手机11位手机号码
orderLayer.isValidMobile = function( mobile ) {
    var rule = /^1[3|4|5|7|8]{1}[0-9]{9}$/;
    return rule.test( mobile );
}

orderLayer.isValidCode = function( code ) {
    var rule = /^\d{6}$/;
    return rule.test( code );
}