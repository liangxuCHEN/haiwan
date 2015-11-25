var mobileMsg = "请输入手机号码";
var maxSecond = 59;
var imgId = 0;
var imgTicket = "";
var scanTimer = null;
var stopFlag = false;
var scanAjax = null;//二维码扫描轮询ajax

var memberLogin = {
    getMobile:function(){
        return $.trim( $("#mobile").val() );
    },
    getSmscode:function(){
        return $.trim( $("#sms_code").val() );
    },
    setMobileErr:function(msg){
        $("#mobile_msg").addClass("InforTipsWrong").removeClass("InforTipsWrite").html(msg).show();
    },
    setPwdErr:function(msg){
        $("#sms_code_msg").addClass("InforTipsWrong").removeClass("InforTipsWrite").html(msg).show();
    },
    setMobileFocus:function(){
        $("#mobile").focus();
    },
    setLoginErrMsg:function(msg, type){
        (type==1) ? $("#login_err_msg").show().find("p").html(msg) : $("#login_err_msg").hide().find("p").html("");
    },
    setPasswordFocus:function(){
        $("#sms_code").focus();
    },
    reloadSecond:function reloadSecond() {
        for(var i=maxSecond;i>=0;i--) {
            window.setTimeout('updateSecond2(' + i + ')', (maxSecond-i) * 1000);
        }
    },
    getWeixinImg:function( callType ){
        var _rel = $("#wx_login_img").attr("rel");
        _rel = isNaN(_rel)?'':parseInt( _rel );
        if( 1 == _rel ) {
            return false;
        }
        $.ajax({
            url : "http://www.6renyou.com/member/getWeixinImg",
            cache : false,
            timeout:10000,
            dataType:'json',
            success :function(data) {
                if (data.url != '') {
                    $('#wx_login_img').attr({'src':data.url, width:188, height:188, "rel":1, "chkid":data.id});
                    imgId=data.id;
                    imgTicket=data.ticket;
                    //微信扫描
                    memberLogin.checkWeixinScan( callType );
                }
            }
        });
    },
    checkWeixinScan:function( callType ){
        if( stopFlag  || scanAjax){
            return false;
        }
        scanAjax = true;
        scanTimer = setTimeout(function(){
            if(stopFlag){
                scanAjax = null;
                return false;
            }
            scanAjax = $.ajax({
                url : 'http://www.6renyou.com/member/checkWeixinScan',
                cache : false,
                timeout:3000,
                type:'POST',
                data:{'id':imgId,'ticket':imgTicket},
                dataType:'json',
                success :function(data) {
                    scanAjax = null;
                    if (!data.openid) {
                        memberLogin.checkWeixinScan( callType );
                        return false;
                    }
                    scanTimer = null; //扫描成功清除定时
                    memberLogin.weixinLogin( data.openid, callType );
                },
                error: function() {
                    scanAjax = null;
                    memberLogin.checkWeixinScan( callType );
                }
            });
        }, 3000);
    },
    weixinLogin:function( openId, callType ){
        if( !openId ) {
            alert("请先使用微信扫描二维码");
            return false;
        }
        var  dataJson = {"id":openId};
        var method = "chkWexinLogin";
        if( 2 == callType ) {
            var memberId = $.trim( $("#member_id").val() );
            method = "chkOrderWexinLogin";
            dataJson["mid"] = memberId;
        }
        $.ajax({
            type:"POST",
            url:"/member/" + method,
            data:dataJson,
            dataType:"json",
            success:function( data ){
                if( data.status && 1==data.status ) {
                    if( 1 == callType ){
                        window.location.href="/member/index";
                    }else if( 2 == callType ){
                        $("#inline_content1").colorbox.close();
                    }
                }
                else if(data.status && 2==data.status) {
                    //跳转注册页
                    window.location.href = "/member/register";
                }
                else{
                    alert(data.info);
                }
            },
            error:function(xhr, ep) {
                alert("微信扫描失败");
            }
        });
    },
    getPwd:function(){
        $smsBtn = $("#sms_btn");
        var stop = $smsBtn.attr("rel");
        stop = (!stop || isNaN(stop)) ? 0 : parseInt( stop );
        if( 1 == stop ) return false;

        var _mobile = this.getMobile();
        if( !_mobile || _mobile==mobileMsg) {
            this.setMobileErr( "请输入手机号码" );
            this.setMobileFocus();
            return false;
        }
        if( !isValidMobile( _mobile ) ) {
            this.setMobileErr( "手机号码格式错误" );
            this.setMobileFocus();
            return false;
        }
        $.ajax({
            type:"POST",
            url:"/member/getSmscode",
            data:{mobile:_mobile},
            dataType:"json",
            success:function( data ){
                if( data.status && 1==data.status ) {
                    memberLogin.reloadSecond();
                }
                else{
                     memberLogin.setLoginErrMsg(data.info, 1)
                }
            }
        });
    },
    ajaxLogin:function(){
        var $submitBtn = $("#submit_btn");
        var stop = $submitBtn.attr("rel");
        stop = (!stop || isNaN(stop)) ? 0 : parseInt( stop );
        if( 1 == stop ) return false;

        this.setLoginErrMsg("", 2);
        var _mobile = this.getMobile();
        if( !_mobile || _mobile == mobileMsg) {
            this.setMobileErr( "请输入手机号码" );
            this.setMobileFocus();
            return false;
        }
        if( !isValidMobile( _mobile ) ) {
            this.setMobileErr( "手机号码格式错误" );
            this.setMobileFocus();
            return false;
        }
        var _password = $.trim( $("#sms_code").val() );
        if( !_password ) {
            this.setPwdErr( "请输入密码" );
            this.setPasswordFocus();
            return false;
        }
        /*if( !isValidCode( _password ) ) {
            this.setPwdErr( "密码格式错误" );
            this.setLoginErrMsg("密码长度6-16位，只能有数字、字母、下划线组成",1);
            this.setPasswordFocus();
            return false;
        }*/

        $submitBtn.attr("rel", 1).val("请稍后，正在登陆……");
        $.ajax({
            type:"POST",
            url:"/member/chkLogin",
            data:$("#login_form").serializeArray(),
            dataType:"json",
            success:function(data){
                if( !$.isPlainObject( data ) || $.isEmptyObject( data ) ) {
                    memberLogin.setLoginErrMsg("应用程序错误，请联系网站管理人员", 1);
                    return false;
                }
                else{
                    (data.status && 1==data.status) ? window.location.href = '/member/index' :memberLogin.setLoginErrMsg(data.info, 1);
                }
            },
            complete:function(){
                $submitBtn.attr("rel", "").val("登陆");
            }
        });
    }
};


var userRegister = {
    nameTip:"在这里填写您的姓名",
    mobileTip:"在这里填写手机号码",
    getName:function(){
        return $.trim( $("#realname").val() );
    },
    getMobile:function(){
        return $.trim( $("#mobile").val() );
    },
    chkMobile:function(){
        var _mobile = this.getMobile();
        return isValidMobile( _mobile );
    },
    setMobileErr:function(msg,type){
        if( 1 == type )
            $("#mobile_msg").addClass("InforTipsWrong").removeClass("InforTipsWrite").show().html(msg);
        else
            $("#mobile_msg").addClass("InforTipsWrite").removeClass("InforTipsWrong").show().html(msg);
    },
    setNameErr:function(msg,type){
        if( 1 == type )
            $("#name_msg").addClass("InforTipsWrong").removeClass("InforTipsWrite").show().html(msg);
        else
            $("#name_msg").addClass("InforTipsWrite").removeClass("InforTipsWrong").show().html(msg);
    },
    saveInfo:function() {
        var _mobile = this.getMobile();
        if( !_mobile || _mobile==this.mobileTip ) {
            this.setMobileErr("请填写手机号码", 1);
            return false;
        }
        if( !this.chkMobile() ) {
            this.setMobileErr("手机格式错误", 1);
            return false;
        }
        var _name = this.getName();
        if( !_name || _name==this.nameTip ) {
            this.setMobileErr("请填写姓名", 1);
            return false;
        }
        document.reg_form.submit();
    }
};

var modifyPassword  = {

};


//按钮秒数提醒
function updateSecond2( i ) {
    i = (!i || isNaN(i)) ? 0 : parseInt( i );
    var $smsBtn = $("#sms_btn");
    if( i > 0 ) {
        $smsBtn.addClass("btn-disable").attr("rel", "1").html( i + "秒后可重新获取");
    }
    else{
        $smsBtn.removeClass("btn-disable").attr("rel", "").html("发送密码给我");
    }
}

//校验手机11位手机号码
function isValidMobile( mobile ) {
    var rule = /^1[3|4|5|7|8]{1}[0-9]{9}$/;
    return rule.test( mobile );
}

function isValidCode( mobile ) {
    var rule = /^[a-zA-Z0-9_]{6,16}$/;
    return rule.test( mobile );
}