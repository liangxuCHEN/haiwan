var edate_obj = {};
var sdate_obj = {};
var pre_reserve_day = 0;//提前预定天数
var show_month = 3;//显示几个月
$(document).ready(function(){
    /*月份切换*/
    $('div.date-scroll a.next').click(function(){
        var next_month_obj = $('div.date-scroll span.now').next('span.cal-title');
        if(next_month_obj.length>0){
            $('div.date-scroll span.cal-title').removeClass('now');
            next_month_obj.addClass('now');
            if(next_month_obj.next('span.cal-title').length<=0){
                $(this).hide();
            }
            $('div.date-scroll a.prev').show();
            setMonthCalendar(next_month_obj,next_month_obj.attr('str_key'),next_month_obj.attr('start_time'));
        }
    });
    $('div.date-scroll a.prev').click(function(){
        var prev_month_obj = $('div.date-scroll span.now').prev('span.cal-title');
        if(prev_month_obj.length>0){
            $('div.date-scroll span.cal-title').removeClass('now');
            prev_month_obj.addClass('now');
            if(prev_month_obj.prev('span.cal-title').length<=0){
                $(this).hide();
            }
            $('div.date-scroll a.next').show();
            setMonthCalendar(prev_month_obj,prev_month_obj.attr('str_key'),prev_month_obj.attr('start_time'));
        }
    });
    /*月份切换结束*/
});

function format_date(str){
    var arr = str.split('-');
    if(arr[1].length<2){
        arr[1] = '0'+arr[1];
    }
    if(arr[2].length<2){
        arr[2] = '0'+arr[2];
    }
    return arr.join('-');
}

function new_date(str) {
    if(isNaN(str)){
        str = str.split('-');
        var date = new Date();
        date.setUTCFullYear(str[0], str[1] - 1, str[2]);
        date.setUTCHours(0, 0, 0, 0);
    }else{
        var date = new Date(str);
    }
    return date;
}
 
 function getDate(){      
        var today = new Date();      
        var day = today.getDate(); 
		if(date<10){
			day = "0"+day;
		}
        var month = today.getMonth() + 1;  
		if(month<10){
			month = "0"+month;
		}			
        var year = today.getFullYear();   
        var date = year + "-" + month + "-" + day;      
        return date; 
    };
	
function selectDate(){
    reset_calendar_data();
	var today = getDate();
	var res ={
		"status": 1,
		"info": "",
		"data": {
			"sdate": {
				today: {
					"id": "1518",
					"time": today,
					"confirm": "1"
				}
			},
			"edate": true,
			"today": today,
			"pre_reserve_day": "1"
		}
	}
	edate_obj = res['data']['edate'];
	sdate_obj = res['data']['sdate'];
	pre_reserve_day = res['data']['pre_reserve_day'];
	var pre_reserve_time = 0;
	if(!isNaN(pre_reserve_day)){
		pre_reserve_time = parseFloat(pre_reserve_day)*86400000;
	}
	var start_time = 0;
	var sdate_month = {};
	var sdate_month_len = 0;
	if(edate_obj){
		var today_obj = new_date(res['data']['today']);
		start_time = today_obj.getTime()+pre_reserve_time;
	}else if(sdate_obj){
		var i=0;
		for(var key in sdate_obj){
			var this_day_obj = new_date(sdate_obj[key]['time']);
			if(i==0){
				var today_obj = this_day_obj;
			}
			var month_key = this_day_obj.getFullYear()+'-'+(this_day_obj.getMonth()+1)+'-01';
			if(!sdate_month[month_key]){
				sdate_month[month_key] = 1;
				sdate_month_len++;
			}
			i++;
		}
		start_time = today_obj.getTime();
	}
	if(start_time){
		var startday_obj  = new_date(start_time);
		var show_m = startday_obj.getMonth()+1;
		var last_day_obj =  new_date(startday_obj.getFullYear()+'-'+show_m+'-01');
		var calender_select_str = [];
		if(edate_obj){
			for(var i=1;i<=show_month;i++){
				calender_select_str.push( '<span class="cal-title '+(i==1?"now":'')+'" str_key="'+last_day_obj.getFullYear()+'-'+(last_day_obj.getMonth()+1)+'-1'+'" start_time="'+start_time+'">'+last_day_obj.getFullYear()+'年'+(last_day_obj.getMonth()+1)+'月</span>');
				if(last_day_obj.getMonth()+1==12){
					last_day_obj.setFullYear(last_day_obj.getFullYear()+1);
					last_day_obj.setMonth(0);
				}else{
					last_day_obj.setMonth(last_day_obj.getMonth()+1);
				}
			}
		}else{
			var show_b = true;
			var already_show_num = 0;
			while(show_b){
				var show_month_str_key = last_day_obj.getFullYear()+'-'+(last_day_obj.getMonth()+1)+'-01';
				if(sdate_month[show_month_str_key]){
					calender_select_str.push('<span class="cal-title '+(already_show_num==0?"now":'')+'" str_key="'+show_month_str_key+'" start_time="'+start_time+'">'+last_day_obj.getFullYear()+'年'+(last_day_obj.getMonth()+1)+'月</span>');
					already_show_num = already_show_num+1;
				}
				if(last_day_obj.getMonth()+1==12){
					last_day_obj.setFullYear(last_day_obj.getFullYear()+1);
					last_day_obj.setMonth(0);
				}else{
					last_day_obj.setMonth(last_day_obj.getMonth()+1);
				}
				if(already_show_num>=sdate_month_len || already_show_num>=show_month){
					show_b = false;
				}
			}
		}
		if(calender_select_str.length>1){
			$('div.date-scroll a.next').show();
		}
		$('div.date-scroll').append(calender_select_str.join(''));
		setMonthCalendar('',startday_obj.getFullYear()+'-'+show_m+'-01',start_time);
		$.colorbox({open:true,inline:true,href:"#calendar_box", width:"600px",opacity:"0.5"});
	}
}

function parse_day(str){
    var week_arr = {'0':'周日',
        '1':'周一',
        '2':'周二',
        '3':'周三',
        '4':'周四',
        '5':'周五',
        '6':'周六'
    };
    return week_arr[str];
}
function setMonthCalendar(t,date_str,start_time){
    if(t){
      $('ul.calender-select li').removeClass('date-now');
      $(t).addClass('date-now');
    }
    reset_calendar(date_str,start_time);
    $.colorbox.resize();
}
/*设置日历框*/
function reset_calendar(date_str,start_time){
    var n_date = 1;
    var show_start_obj = new_date(date_str);
    var show_m = show_start_obj.getMonth()+1;
    s_html = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="calendar-table"><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
    var first_day = show_start_obj.getDay();
    var n_wday = 0;
    s_html +='<tr>';
    while(first_day--){
        bgcolor = ((n_wday==0 || n_wday==6)?'#ebebeb':'#f8f8f8');
        n_wday++;
        s_html += '<td bgcolor="'+bgcolor+'"></td>';
    }
    while (show_m == (show_start_obj.getMonth()+1)) {
        if(n_wday==0){
            s_html +='<tr>';
        }
        for (; n_wday < 7; n_wday++) {
            bgcolor = ((n_wday==0 || n_wday==6)?'#ebebeb':'#f8f8f8');
            if(show_start_obj.getDay()==n_wday && show_m == (show_start_obj.getMonth()+1)){
                var current_date = show_start_obj.getFullYear()+'-'+(show_start_obj.getMonth()+1)+'-'+show_start_obj.getDate();
                var format_current_date = format_date(current_date);
                if(sdate_obj && sdate_obj[format_current_date]){
                    s_html += '<td bgcolor="'+bgcolor+'"><a href="#" onclick="confirm_select_date(this,\''+sdate_obj[format_current_date]['id']+'\',\''+current_date+'\');return false;"><b>'+show_start_obj.getDate()+'</b><span class="status"></span><span style="display:none" class="price">¥<dfn>'+sdate_obj[format_current_date]['aprice']+'</dfn></span></a></td>';
                }else{
                    if(edate_obj && show_start_obj.getTime()>=start_time){
                        s_html += '<td bgcolor="'+bgcolor+'"><a href="#" onclick="confirm_select_date(this,\''+edate_obj['id']+'\',\''+current_date+'\');return false;"><b>'+show_start_obj.getDate()+'</b><span class="status"></span><span style="display:none" class="price" >¥<dfn>'+edate_obj['aprice']+'</dfn></span></a></td>';
                    }else{
                        s_html += '<td bgcolor="'+bgcolor+'"><b>'+show_start_obj.getDate()+'</b></td>';
                    }
                }
            }else{
                s_html += '<td bgcolor="'+bgcolor+'"></td>';
            }
            show_start_obj.setDate(++n_date);
        }
        n_wday = 0;
        s_html +='</tr>';
    }
    s_html +='</table>';
    $('#calendar_select').html(s_html);
}
function reset_calendar_data(){
    $('div.date-scroll span.cal-title').remove();
    $('#calendar_select').html('');
}
/*提交日期选择*/
function confirm_select_date(t,date_id,date){
    $('#travel_date_id').val(date_id);
    $('#select_date').val(date);
    $('#postView').submit();
    reset_calendar_data();
    $.colorbox.close();
}
