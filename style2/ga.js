function get_uri_val(k) {
    var _v = location.search.match(new RegExp("[\?\&]" + k + "=([^\&]*)(\&?)", "i"));
    return _v ? _v[1] : null;
}
function get_cookie(a){
    var pos = document.cookie.indexOf(a + '=');
    if (pos === -1){
        return null;
    } else {
        var pos2 = document.cookie.indexOf(';',pos);
        if(pos2 === -1) {
            return unescape(document.cookie.substring( pos + a.length + 1));
        } else {
            return unescape(document.cookie.substring( pos + a.length + 1,pos2));
        }
    }
}
function set_cookie(k,v,d){
    document.cookie = k + "="+ escape (v) + ";expires=" + d.toGMTString()+";path=/;domain=6renyou.com"; 
}
var _a = 'fdata';
var _b = get_cookie(_a);
if(_b === null){
    var _v = get_uri_val('frm');
    if(_v === null){
        _v = '6renyou';
    }
    var _e = 7*24*60*60*1000;
    var _d = new Date();
    _d.setTime(_d.getTime() + _e);
    var _c = [];
    _c.push('fid='+ _v);
    _c.push('time='+ _d.getTime());
    var _s = _c.join("&");
    set_cookie(_a,_s,_d);
}
    
