/**
 * @author qianlong 把带，的string 转为 数字
 */
function commom_dealString(str){
	return str.replace(",","");
}
/**
 * @author qianlong 处理单个非空的验证
 */
function common_validateInput(val){
	if(val=="" ){
		return false;
	}else if(val== "null"){
		return false;
	}else if(val.length > 200){
		return false;
	} 
	return true;
}
/**
 * 判断字符串的开头
 * 
 * @author tian
 * @param str
 * @return
 */
String.prototype.startWith=function(str){     
	  var reg=new RegExp("^"+str);     
	  return reg.test(this);        
	} 
/**
 * 替换字符串中字符
 * 
 * @author tian
 * @param str
 * @return
 */
String.prototype.replaceWith=function(srcStr,repStr){   
	var reg=new RegExp(srcStr,"g"); // 创建正则RegExp对象
  var newstr=this.replace(reg,repStr);    
	  return newstr;        
	} 

/**
 * 判断一个字符串是否包含指定字符 包含返回true 不包含返回false
 * 
 * @author tian
 * @param strArray
 * @returns {Boolean}
 */

String.prototype.Contain=function(strArray){
    if(strArray) {
        if(strArray.constructor==Array) {
            for(var i=0;i<strArray.length;i++)  {
                for(var j=0;j<this.length;j++) {
                    var arr=strArray[i];
                    var temp;
                    if(arr)  {
                        if(arr.length>1) {
                            temp=this.substr(j,arr.length);
                        }
                        else {
                            temp=this.substr(j,1);
                        }
                        if(arr==temp) {
                            return true;
                        }
                    }
                }
            } 
        }  else {
            if(strArray.constructor==String) {
                for(var i=0;i<this.length;i++) {
                    if(this.length-i>=strArray.length) {
                        if(this.substr(i,strArray.length)==strArray) {
                            return true;
                            break;
                        }
                    }
                }
            }
            else {
            	layer.msg("参数有误！" , 1 , 8 , "");
            }
        }
    }
    return false;
};

/**
 * @author qianlong 处理得到的金额数字
 *  return str num 123,12或者 12300.00
 *  type = 0 变成12300.00
 *  type = 1 变成12,312
 */
function common_number(num,decimal){
        var xiaoshu = "";
        //先判断数字是否超过小数点3位。
        if(num.indexOf(".") != -1){
            var numArray = num.split(".");
            if(numArray[1].length>3){
            //	alert(num);
            	//num=num.toFixed(2);
            	//alert();
            	num=parseFloat(num).toFixed(2);
            }
        }
        
        if(num.indexOf(".") != -1){
            var numArray = num.split(".");
            num = numArray[0];
            if(decimal){
                xiaoshu = numArray[1];
            }
        }
		var length = num.length;
		var result = "";
		for(var i=0 ; i< length/3 + 1 ; i++){
				if((length-3*(i+1))<=0){
					result = num.substring(0,length-3*i)+result;
				}else{
					result += ","+num.substring((length-3*(i+1)),(length-3*i));
				}
			}
        if(decimal&&xiaoshu!=""){
        	if(xiaoshu.length>3){
        		return  (parseFloat(result + "." +xiaoshu)).toFixed(2);
        	}else{
        		 return result + "." +xiaoshu;
        		}
           
        }
		return result ;
}



  /**
	 * 判断字符串是否以某个结尾 *
	 * 
	 * @author tian
	 * @param str
	 * @return
	 */
	String.prototype.endWith=function(str){     
	  var reg=new RegExp(str+"$");     
	  return reg.test(this);        
	}
	
	/**
	 * 定位锚点
	 * @author tian
	 * id 
	 * time 滑动时间-单位毫秒
	 */
	function common_ancho(id,time){
	       var pos = $(id).offset().top;
	       $("html,body").animate({scrollTop: pos},time);
	}
	/**
	 * 只能英文和数字
	 * @author tian
	 */
	function common_isLetterOrNum(val){
		var re = /^[a-zA-Z0-9]+$/;  
		 if(re.test(val)) return false;  
		 return true;  
	}
	/**
	 * 校验邮箱格式 true--合格
	 * @author tian
	 */
	function common_checkEmail(email){
		if(email.search(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/) == -1){
				return  false;
		}
		  return true;
	}
	/**
	 * @author qianlong 验证中文
	 * 
	 */
	function common_isChinese(val){
		var re =/u4e00-u9fa5/;  
		 if(re.test(val)) return false;  
		 return true;  
	}
	/**
	 * @author qianlong 验证英文
	 * 
	 */
	function common_isEnglish(val){
		var re = /^[A-Za-z]+$/;  
		 if(re.test(val)) return false;  
		 return true;  
	}
	/**
	 * @author qianlong 验证电话号码 正确为true 不正确false
	 */
	function common_isTelphone(val){
		if(/^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/.test(val)){ 
			// 验证手机号
		   return true; 
		  } 
		  return false;
	} 
	
	function common_isPhone(val){
		if(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(val)){
			 // 验证固话号
			 return true;
		  }
		return false;
	}
	
	function common_getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	
	/**
	 * js 构造post提交
	 * 
	 * @author tian
	 * @param URL
	 * @param PARAMS
	 *            /调用方法 如 post('pages/statisticsJsp/excel.action', {html
	 *            :prnhtml,cm1:'sdsddsd',cm2:'haha'});
	 */
	function common_post(URL, PARAMS) {        
	    var temp = document.createElement("form");        
	    temp.action = URL;        
	    temp.method = "post";        
	    temp.style.display = "none";        
	    for (var x in PARAMS) {        
	        var opt = document.createElement("textarea");        
	        opt.name = x;        
	        opt.value = PARAMS[x];        
	        temp.appendChild(opt);        
	    }        
	    document.body.appendChild(temp);        
	    temp.submit();        
	    return temp;        
	} 
	
	
	/**
	 * 获取所有城市json {"奥克兰":"Auckland","伦敦":"London","日本":"London"}
	 */
	function common_getAllCityJson(){
		var str;
		$.ajax({
			type:"post",
			url:'/isThemeName',
			data:{},
			dataType: 'json',
			async : false, 
			success: function(json){
				str=json.data;
			}
		});
		return str;
	}
	
	
	
	
	/**
	 * @author qianlong 对数据进行判断，看是不是数字
	 * 
	 */
	function common_isnan(val){
		if(isNaN(val)){
			return 0;
		}
		return val;
	}
	
	/**
	 * @author qianlong 邮政编码的验证
	 */
	function common_validatePostCode(val){
		if(/^[0-9]{6}$/.test(val)){
			return true ;
		}
		return false;
	}

	/**
	 * 判断一个时间字符串是否在某个时间段内 0--否 1--是
	 */
	function common_checkEndTime(startDate,endDate,paraDate){ 
	    var start=new Date(startDate.replace("-", "/").replace("-", "/"));  
       var end=new Date(endDate.replace("-", "/").replace("-", "/"));  
       var para=new Date(paraDate.replace("-", "/").replace("-", "/"));  
	    if(start>=para&&para>end){  
	        return 1;  
	    }  
	    return 0;  
	}
	
	/**
	 * @author qianlong
	 * 把时间段10个值传过来，加上当前的日期，判断属于哪个时间段
	 * 
	 */
	function common_checkPersonType(paraDate,params){
		if(common_checkEndTime(params[8],params[9],paraDate)){
			return ".visitor";
		}else if(common_checkEndTime(params[0],params[1],paraDate) ){
			return ".adult";
		}else if(common_checkEndTime(params[2],params[3],paraDate)){
			return ".child";
		}else if(common_checkEndTime(params[4],params[5],paraDate)){
			return ".baby";
		}else if(common_checkEndTime(params[6],params[7],paraDate)){
			return ".old";
		}else{
			return "none";
		}
	}

    function common_checkPersonNum(range,paraDate) {
        for(var key in range){
            if(range.hasOwnProperty(key)){

                if(common_checkEndTime(range[key].beginDate,range[key].endDate,paraDate)){
                    return range[key].personType;
                }
            }
        }
        return false;
    }
	/**
	 * @author qianlong
	 * @param val
	 * @returns {String}
	 */
	function common_returnZh(val){
		if(val == ".adult"){
			return "成人";
		}else if(val == ".child"){
			return "儿童";
		}else if(val == ".baby"){
			return "婴儿";
		}else if(val == ".old"){
			return "老人";
		}else if(val == ".visitor"){
			return "";
		}
	}
	/**
	 * @author qianlong
	 * @param val
	 * @returns {int}
	 */
	function common_returnInt(val){
		if(val == ".adult"){
			return 1;
		}else if(val == ".child"){
			return 2;
		}else if(val == ".baby"){
			return 3;
		}else if(val == ".old"){
			return 4;
		}else if(val == ".visitor"){
			return 5;
		}
	}
	/**
	 * @author qianlong
	 * @param data
     * @param type
	 * 比较价格类型能够选择的最大最小值
	 * type = 0-最小值 1最大值
	 */
	
	
	function common_compare(data,type){
		var numArray = [];
		if(data.adult_range != undefined){
			numArray.push(data.adult_range.split('-')[type]);
		}
		if(data.child_range != undefined){
			numArray.push(data.child_range.split('-')[type]);
		}
		if(data.baby_range != undefined){
			numArray.push(data.baby_range.split('-')[type]);
		}
		if(data.older_range != undefined){
			numArray.push(data.older_range.split('-')[type]);
		}
		if(data.visitor_range != undefined){
			numArray.push(data.visitor_range.split('-')[type]);
		}
		
		if(type == 0){
			var min = parseInt(numArray[0]);
			for(var i=0;i<numArray.length;i++){
				if(min > parseInt(numArray[i])){
					min = parseInt(numArray[i]);
				}
			}
			return min;
		}
		
		if(type == 1){
			var max = parseInt(numArray[0]);
			for(var i=0;i<numArray.length;i++){
				if(max < parseInt(numArray[i])){
					max = parseInt(numArray[i]);
				}
			}
			return max;
		}
		
	}
	
	  function common_compare_array(data,type) {
	        if(type == 0){
	            var min = parseInt(data[0]);
	            for(var i=0;i<data.length;i++){
	                if(min > parseInt(data[i])){
	                    min = parseInt(data[i]);
	                }
	            }
	            return min;
	        }

	        if(type == 1){
	            var max = parseInt(data[0]);
	            for(var i=0;i<data.length;i++){
	                if(max < parseInt(data[i])){
	                    max = parseInt(data[i]);
	                }
	            }
	            return max;
	        }
	    }
	
	

	/**
	 * 用JQ判断浏览器类型及版本
	 * @author tian
	 */
	function common_checkbrowse() { 
	var ua = navigator.userAgent.toLowerCase(); 
	var isthis = (ua.match(/\b(chrome|opera|safari|msie|firefox)\b/) || ['', 'mozilla'])[1]; 
	var r = '(?:' + isthis + '|version)[\\/: ]([\\d.]+)'; 
	var v = (ua.match(new RegExp(r)) || [])[1]; 
	return { 
	'is': r, 
	'ver': v
	} 
	}
    //支持ie的trim方法
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }

    /**
     * 日期查
     * @param start 2014-8-16
     * @param end 2014-8-18
     * @returns {number}
     */
    function common_timegap(start, end) {
        var startDate = new Date(start);  //开始时间
        var endDate = new Date(end);    //结束时间
        var timeGap = endDate.getTime()-startDate.getTime()  //时间差的毫秒数
        //计算出相差天数
        return Math.floor(timeGap/(24*3600*1000))
    }

