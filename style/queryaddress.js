$(document).ready(function () {

	$.ajax({
		type:"post",
		url:'/header/queryCountry?v='+Math.random(),
		dataType: 'json',
		async : false, 
		success: function(json){
			  if(json.code==200){
				  AllLocationJson=json.data.location;
				  AllThemesInJson=json.data.themeList;
			  }
		}
	});
    //搜索框信息
    $('#header_search_box .typeahead').typeahead({
        name: 'city_names_hint',
        prefetch: '/res/data/city_hint7.json',
        template: '<p>{{value}}</p>',
        limit:12,//匹配显示最大数目
        engine: Hogan
    });

    //当用户点击搜索时
    $('#header_search_button').click(function(){
        header_search();
    });
    //回车搜索
    $("#header_search_city_input").keyup(function(event){
        if(event.keyCode ==13){
            header_search();
        }
    });
    //搜索
  function header_search(){
	        var searchName = $('#header_search_city_input').val();
	        if(searchName==""){
	        	searchName=$('#defaultSearch').val();
	        }
	        var locationName="AllCitys";
	        var themeName="AllThemes";
	        //判断是否是搜索国家
	        var loctionUrl=searchLocationCountryUrl($.trim(searchName));
	        if(loctionUrl!=""){
	        	 window.location.href =loctionUrl;
	        	return false;
	        }
	        //搜索时候目的地和主题优先级最高，然后是普通关键词
	        if(AllLocationJson.indexOf("\""+searchName+"\"")!=-1){//目的地时
	        	   window.location.href ="/search/"+searchName+"_AllThemes.html";
	        }else  if(AllThemesInJson.indexOf("\""+searchName+"\"")!=-1){
	        	   window.location.href ="/search/AllCitys_"+searchName+".html";
	        }else{
	     	   window.location.href ="/search/AllCitys_AllThemes.html?keyword="+searchName;
	        }
        }
  locationCountryUrl();
 //导向国家的连接
  function  locationCountryUrl (){
	  $(".categorys").find("a").each(function (){
		  var href=$(this).attr("href");
		  if(href==="/search/France_AllThemes.html"){
			  $(this).attr("href","/countrybeta/10.html");
		  }else if(href=="/search/Bali_AllThemes.html"){
			  $(this).attr("href","/countrybeta/70.html");
		  }else if(href==="/search/United-States_AllThemes.html"){
			  $(this).attr("href","/countrybeta/111.html");
		  }/*else if(href==="/search/Japan_AllThemes.html"){
			  $(this).attr("href","/country/Japan.html");
		  }*/else if(href==="/search/Taiwan_AllThemes.html"){
			  $(this).attr("href","/countrybeta/303.html");
		  }/*else if(href==="/search/Thailand_AllThemes.html"){
			  $(this).attr("href","/country/Thailand.html");
		  }*//*else if(href==="/search/South-Korea_AllThemes.html"){
			  $(this).attr("href","/country/south%20korea.html");
		  }*//*else if(href==="/search/GangAoTai_AllThemes.html"){
			  $(this).attr("href","/country/gangaotai.html");
		  }*//*else if(href==="/search/New-Zealand_AllThemes.html"){
			  $(this).attr("href","/country/new%20zealand.html");
		  }*/else if(href==="/search/Indonesia_AllThemes.html"){
			  $(this).attr("href","/countrybeta/70.html");
		  }/*else if(href==="/search/Spain_AllThemes.html"){
			  $(this).attr("href","/country/Spain.html");
		  }*//*else if(href==="/search/Italy_AllThemes.html"){
			  $(this).attr("href","/country/Italy.html");
		  }*/else if(href==="/search/the-United-Kingdom_AllThemes.html"){
			  $(this).attr("href","/countrybeta/9.html");
		  }else if(href==="/search/Germany_AllThemes.html"){
			  $(this).attr("href","/countrybeta/141.html");
		  }/*else if(href==="/search/Russia_AllThemes.html"){
			  $(this).attr("href","/country/Russia.html");
		  }*//*else if(href==="/search/Turkey_AllThemes.html"){
			  $(this).attr("href","/country/Turkey.html");
		  }*/else if(href==="/search/UAE_AllThemes.html"){
			  $(this).attr("href","/countrybeta/157.html");
		  }/*else if(href==="/search/Singapore_AllThemes.html"){
			  $(this).attr("href","/country/singapore.html");
		  }*/else if(href==="/search/Hong-Kong_AllThemes.html"){
			  $(this).attr("href","/countrybeta/140.html");
		  }else if(href==="/search/Japan_AllThemes.html"){
			  $(this).attr("href","/countrybeta/67.html");
		  }else if(href==="/search/Russia_AllThemes.html"){
			  $(this).attr("href","/countrybeta/363.html");
		  }else if(href==="/search/Singapore_AllThemes.html"){
			  $(this).attr("href","/countrybeta/120.html");
		  }
		  
	  });
  }
  //搜索的时候导向国家的连接
  function searchLocationCountryUrl(val){
	 if(val==="巴厘岛"){
		  return "/countrybeta/70.html";
	  }else /*if(val==="澳大利亚"){
		  return "/country/Australia.html";
	  }else */if(val==="美国专题"){
		  return "/countrybeta/111.html";
	  }/*else if(val==="日本专题"){
		  return "/country/Japan.html";
	  }*/else if(val==="台湾"){
		  return "/countrybeta/303.html";
	  }/*else if(val==="泰国专题"){
		  return "/country/Thailand.html";
	  }*//*else if(val==="韩国专题"){
		  return "/country/south%20korea.html";
	  }*/else if(val==="香港"){
		  return "/countrybeta/140.html";
	  }/*else if(val==="新西兰"){
		  return "/country/new%20zealand.html";
	  }*/else if(val==="巴厘岛"){
		  return "/countrybeta/70.html";
	  }/*else if(val==="西班牙"){
		  return "/country/Spain.html";
	  }*/else if(val==="法国专题"){
		  return "/countrybeta/10.html";
	  }/*else if(val==="意大利"){
		  return "/country/Italy.html";
	  }*//*else if(val==="英国专题"){
		  return "/countrybeta/9.html";
	  }*/else if(val==="德国"){
		  return "/countrybeta/141.html";
	  }/*else if(val==="俄罗斯"){
		  return "/country/Russia.html";
	  }*//*else if(val==="土耳其"){
		  return "/country/Turkey.html";
	  }*/else if(val==="阿联酋"){
		  return "/countrybeta/157.html";
	  }else if(val==="日本"){
		  return "/countrybeta/67.html";
	  }else if(val==="俄罗斯"){
		  return "/countrybeta/363.html";
	  }else if(val==="印度尼西亚"){
		  return "/countrybeta/70.html";
	  }else if(val==="台湾"){
		  return "/countrybeta/303.html";
	  }else if(val==="英国"){
		  return "/countrybeta/9.html";
	  }
	  return "";
}
});


