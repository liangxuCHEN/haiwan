var catchEvent = function(eventObj,event,eventHandler){
	if(eventObj.addEventListener){
		eventObj.addEventListener(event,eventHandler,false);
	}else if(eventObj.attachEvent){
		event = "on" + event;
		eventObj.attachEvent(event,eventHandler);
	}
}
var checkMobile = function(){
	//判断浏览器类型 start
	var sUserAgent= navigator.userAgent.toLowerCase();
	var bIsIpad= sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp= sUserAgent.match(/midp/i) == "midp";
	var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid= sUserAgent.match(/android/i) == "android";
	var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile";
	//判断浏览器类型 end
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		return true;
	}else{
		return false;
	}
}
var SearchCheck = false;
var focusSearch = function(n){
	if(n == 1){
		clearTimeout(SearchCheck);
		SearchCheck = setTimeout(function(){document.getElementById("hot_key").style.display = "block";},200);
	}else if(n == 2){
		clearTimeout(SearchCheck);
		 SearchCheck = setTimeout(function(){document.getElementById("hot_key").style.display = "none";},200);
	}
}
var floow_start = function(){
	qq_load();
	weibo_load();
}
var qq_load = function(){
	var oBox = document.getElementById("divQQbox");
	var oLine = document.getElementById("divOnline");
	var oMenu = document.getElementById("divMenu");
	var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	setTimeout(function ()
	{
		clearInterval(oBox.timer);
		//var iTop = parseInt((document.documentElement.clientHeight - oBox.offsetHeight)/2) + iScrollTop;
		var iTop = 120 + iScrollTop;
		oBox.timer = setInterval(function ()
		{
			var iSpeed = (iTop - oBox.offsetTop) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			oBox.offsetTop == iTop ? clearInterval(oBox.timer) : (oBox.style.top = oBox.offsetTop + iSpeed + "px");
		}, 10)
	}, 50)
	var mobile = checkMobile();
	if(mobile){
		oBox.onclick = function ()
		{
			var _this = this;
			if(oLine.style.display == "none"){
				_this.style.width = 198 + "px";
				oLine.style.display = "block";
				oMenu.style.display = "none";
			}else{
				_this.style.width = '';
				oLine.style.display = "none";
				oMenu.style.display = "block";
			}
		};
	}else{
		oBox.onmouseover = function ()
		{
			var _this = this;
			_this.style.width = 198 + "px";
			oLine.style.display = "block";
			oMenu.style.display = "none";
		};
		oBox.onmouseout = function ()
		{
			var _this = this;
			_this.style.width = '';
			oLine.style.display = "none";
			oMenu.style.display = "block";
		};
	}
}
var weibo_load = function(){
	var wBox = document.getElementById("weiboMain");
	if(!wBox) return false ;
	var wLine = document.getElementById("weibo_list");
	var wMenu = document.getElementById("weibo_menu");
	var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	setTimeout(function ()
	{
		clearInterval(wBox.timer);
		var iTop = 120 + iScrollTop;
		wBox.timer = setInterval(function ()
		{
			var iSpeed = (iTop - wBox.offsetTop) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			wBox.offsetTop == iTop ? clearInterval(wBox.timer) : (wBox.style.top = wBox.offsetTop + iSpeed + "px");
		}, 10)
	}, 50)
	var mobile = checkMobile();
	if(mobile){
		wBox.onclick = function ()
		{
			var _this = this;
			if(wLine.style.display == "none"){
				_this.style.width = 120 + "px";
				wLine.style.display = "block";
				wMenu.getElementsByTagName("img")[0].className = "press_open";
			}else{
				_this.style.width = '';
				wLine.style.display = "none";
				wMenu.getElementsByTagName("img")[0].className = "press_hide";
			}
		};
	}else{
		wBox.onmouseover = function ()
		{
			var _this = this;
			_this.style.width = 120 + "px";
			wLine.style.display = "block";
			wMenu.getElementsByTagName("img")[0].className = "press_open";
		};
		wBox.onmouseout = function ()
		{
			var _this = this;
			_this.style.width = '';
			wLine.style.display = "none";
			wMenu.getElementsByTagName("img")[0].className = "press_hide";
		};
	}

}

catchEvent(window,"load",floow_start);
catchEvent(window,"resize",floow_start);
catchEvent(window,"scroll",floow_start);

/*
	函数名：AJAX
	功能：AJAX
*/
var AJAX = function(url,method){
	this.xmlhttp;
	this.url = url;
	this.method = method;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		this.xmlhttp=new XMLHttpRequest();
	}else{// code for IE6, IE5
		this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

}
AJAX.prototype.back = function(fun){
	var _this = this;
	var xmlhttp= _this.xmlhttp;
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			var flag = xmlhttp.responseText;
			return fun(flag);
		}
	}
}
AJAX.prototype.submit = function(datas){
	var _this = this;
	var xmlhttp= _this.xmlhttp;
	xmlhttp.open(_this.method,_this.url,true);
	if(datas){
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send(datas);
	}else{
		xmlhttp.send();
	}
}
/*
	加入收藏
*/
function addFavorite2() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
  try{
   window.external.addFavorite(url, title);
  }catch(e){
   alert('由于您的浏览器不支持,请按 Ctrl+D 手动收藏!');
  }
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
    else {
  alert('由于您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
}