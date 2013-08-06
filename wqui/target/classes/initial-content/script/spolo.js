/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */

/**
 *  utils保存了未分类的函数集。
 *
 * @version $Rev: $, $Date: 2007-03-27 16:30:52 +0200 (Tue, 27 Mar 2007) $
 */

var Spolo;

// start spolo code scope
(function() {

//兼容其它名称空间给出的Spolo
if(!Spolo)
	Spolo = new Object();
	
Spolo.NAME_OF_THIS_FILE = "spolo.js";
Spolo.PATH_OF_THIS_FILE = "/script/spolo.js";


// 设置需要实时更新的属性
// Spolo.userid
// Spolo.encodeid
// Spolo.worksapce
// Spolo.currentNode
// Spolo.nodeName
	var userid = "anonymous";
	var encodeid = "anonymous";
	var workspace = "workspace";
	var currentNode = "/content";
	var createNode = "createNode";
	
	// 得到用户ID
	var getterUid = function(){
		var session = Spolo.getSessionInfo();
		if(session!=undefined)
			userid = session["userID"];
		return userid;
	}
	// 得到编码后的用户ID
	var getterEuid = function(){
		return Spolo.encodeUname(getterUid());
		//return encodeURIComponent(getterUid());
		//return getterUid();
	}
	// 得到用户工作区
	var getterWorkspace = function(){
		var session = Spolo.getSessionInfo();
		if(session!=undefined)
			workspace = session["workspace"];
		return workspace;
	}
	// 得到当前读取的节点
	var getterNode = function(){
		var __spolo_url = window.location.href.replace('http://','');
		var nodeName = __spolo_url.substr(__spolo_url.lastIndexOf('/'));
		nodeName = nodeName.substr(0,nodeName.indexOf('.'));
		__spolo_url = __spolo_url.substr(__spolo_url.indexOf('/'));
		__spolo_url = __spolo_url.substr(0,__spolo_url.lastIndexOf('/'));
		return __spolo_url + nodeName;
	}
	Spolo.getUserId = function(){
		var session = Spolo.getSessionInfo();
		if(session!=undefined)
			userid = session["userID"];
		return userid;
	}
	Spolo.getEncodeId = function(){
		return Spolo.encodeUname(getterUid());		
	}
	Spolo.getWorkspace = function(){
		var session = Spolo.getSessionInfo();
		if(session!=undefined)
			workspace = session["workspace"];
		return workspace;
	}
	Spolo.getCurrentNode = function(){
		var __spolo_url = window.location.href.replace('http://','');
		var nodeName = __spolo_url.substr(__spolo_url.lastIndexOf('/'));
		nodeName = nodeName.substr(0,nodeName.indexOf('.'));
		__spolo_url = __spolo_url.substr(__spolo_url.indexOf('/'));
		__spolo_url = __spolo_url.substr(0,__spolo_url.lastIndexOf('/'));
		return __spolo_url + nodeName;
	}
	
/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 * Faster than using regex...
 */
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true? token.toLowerCase() : undefined;
        while((i = (
            _token !== undefined? 
                str.toLowerCase().indexOf( 
                            _token, 
                            i >= 0? i + newToken.length : 0
                ) : str.indexOf(
                            token,
                            i >= 0? i + newToken.length : 0
                )
        )) !== -1 ) {
            str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
        }
    }
	return str;
};	

//decode的栈:_ --> % ,then unescape.
Spolo.decodeUname = function(uname){
	if(uname!="admin"){
		uname = uname.substring(1);
	}
	return decodeURIComponent(uname.replaceAll("_","%"));
}

Spolo.encodeUname = function(uname){
	var retname = "";
	
	for(var i = 0 ; i < uname.length ; i++)
	{
		var c = uname[i];
		switch(c)
		{
		case '@':
		case '_':
		case '*':
			retname += '_';
			retname += c.charCodeAt(0).toString(16);
			break;
		default:
			retname += c;
		}
		
	}
	if(retname!="admin"){
		retname = "_"+retname;
	}
	
	return encodeURIComponent(retname).replaceAll("%","_");
}

//节点命名策略，node类型+当前毫秒数
Spolo.CreateNodeName = function(nodeType)
{
	var nodeDate = new Date();
	var year = nodeDate.getFullYear().toString();
	var month = nodeDate.getMonth().toString();
	var day = nodeDate.getDate().toString();
	var hour = nodeDate.getHours().toString();
	var minute = nodeDate.getMinutes().toString();
	var second = nodeDate.getSeconds().toString();
	var millisecond = nodeDate.getMilliseconds().toString();
	var random = Math.random(millisecond).toString().substring(2,9);
	return nodeType+year+month+day+hour+minute+second+millisecond+random;
}

//语言特性扩展:
Array.prototype.hasObject = (
  !Array.indexOf ? function (o)
  {
    var l = this.length + 1;
    while (l -= 1)
    {
        if (this[l - 1] === o)
        {
            return true;
        }
    }
    return false;
  } : function (o)
  {
    return (this.indexOf(o) !== -1);
  }
);


/**
  获取Spolo.currentUser;
*/
Spolo.getCurrentUser = function(){  
    var wind = window; 
    var windp = wind.parent;
   
    if(typeof Spolo.currentUser == "undefined"){
        wind = windp;
        while(!wind.Spolo.currentUser){
            windp = windp.parent;
        }	
    }
    return wind.Spolo.currentUser;      
}

/**
  获取Spolo.modules;
*/
Spolo.getModules = function(){  
    var wind = window; 
    var windp = wind.parent;
    
    if(typeof Spolo.modules == "undefined"){
        wind = windp;
        while(!wind.Spolo.modules){
            windp = windp.parent;
        }	
    }
    return wind.Spolo.modules;      
}

/**@brief 将\ 转义成_#_ ,防止json 串的不标准。
**/
Spolo.inputEncode = function(inputString){
	if(!inputString){
		// console.log("inputString is undefined!");
		return "";
	}
	var inputString = inputString.replaceAll("\n","_#n_");
	inputString = inputString.replaceAll("\\","_#_");
	//var inputString = escape(inputString);
	return inputString;
}

/**@brief 将_#_ 转义成 \ 防止json 串的不标准。
**/
Spolo.inputDecode = function(inputString){
	if(!inputString){
		// console.log("inputString is undefined!");
		return "";
	}
	var inputString = inputString.replaceAll("_#n_","\n");
	inputString = inputString.replaceAll("_#_","\\");
	//var inputString = unescape(inputString);
	return inputString;
}

/**@brief 设置Spolo.setData
   @param key : 关键字
   @param value ： 值 
*/
Spolo.setData = function(key, value){
   
	Spolo.getRoot().Spolo[key] = value;
}


/**@brief 设置Spolo.getData
   @param key : 关键字
*/
Spolo.getData = function(key){
  
	return Spolo.getRoot().Spolo[key];
}


/**@brief 得到根window
*/
Spolo.getRoot = function(){
	var wind = window;
	var windp = window.parent;
	var loops = 0;			// 循环次数
	if(typeof Spolo.isRoot == "undefined"){
	    wind = windp;
		while(typeof wind.Spolo == "undefined"||typeof wind.Spolo.isRoot == "undefined"){
			wind = windp;
			windp = windp.parent;
			loops ++;
			if(loops == 20){
				console.error("[Spolo.getRoot ERROR]:can not found parent window");
				return;
			}
		}
	}
	return wind;
	
}

// spdialog iframe src 中保存的 id 的 key值; spddk : SanPolo Dialog Data Key
Spolo.spddk = "spddk";

/**@brief 在根window对象下弹出dialog对话框
			如果widthradio/heightradio/widthpx/heightpx都没有赋值
			将按照widthradio==widthradio==0.9自适应处理
	@param args = {
		widthradio : 窗口宽度,  	// 0.1--1之间的值, 占浏览器显示区域的百分比; 可选, 默认为0.9;
		heightradio : 窗口高度, 	// 0.1--1之间的值; 可选, 默认为0.9;
		widthpx : 窗口像素宽度,     // 默认为800
		heightpx : 窗口像素高度,    // 默认为600
		title : "窗口标题", 		// 可选, 默认空
		url : "xxxx.html",		// content 与 url 任选其一, 推荐使用 url 
		content : DOM,			// 不推荐此方式
		data : {},				// 传入的参数, 支持 JSON 格式
		callback : function(spdialog){}
	}
*/
Spolo.dialog = function(args){
	var rootWindow = Spolo.getRoot();
	if(!rootWindow._spDialog){
		console.error("Spolo.dialog ERROR: script.spolo.ui.spdialog is undefined!!");
		return;
	}
	rootWindow._spDialog(args);
}

/*
	获取 new spdialog 时传入的参数
*/
Spolo.getDialogData = function(){
	var rootWindow = Spolo.getRoot();
	if(!rootWindow._spDialogData || typeof(rootWindow._spDialogData)!="function"){
		console.error("Spolo.getDialogData ERROR: this window is not spDialog window!");
		return;
	}
	var cwid = Spolo.getParameter(Spolo.spddk);
	return rootWindow._spDialogData(cwid);
}

/*
	隐藏 sp dialog , 此方法只能在 sp dialog 内部使用
*/
Spolo.dialogHide = function(){
	var rootWindow = Spolo.getRoot();
	if(!rootWindow._spDialogHide || typeof(rootWindow._spDialogHide)!="function"){
		console.error("Spolo.dialogHide ERROR: this window is not spDialog window!");
		return;
	}
	var cwid = Spolo.getParameter(Spolo.spddk);
	return rootWindow._spDialogHide(cwid);
}

/*
	判断当前 window 是否为 spdialog 的 iframe window
	如果是, 则调用根页面中的 _spDialogEmit 方法来转发事件
	@param eventName : 消息的名称, string
	@param param : 参数, object
*/
Spolo.dialogEmit = function(eventName, param){
	var rootWindow = Spolo.getRoot();
	if(!rootWindow._spDialogEmit || typeof(rootWindow._spDialogEmit)!="function"){
		console.error("Spolo.emit ERROR: this window is not spDialog window!");
		return;
	}
	var cwid = Spolo.getParameter(Spolo.spddk);
	rootWindow._spDialogEmit(cwid, eventName, param);
}

/*
	从当前窗口的地址栏中获取GET方式传递的参数
	@param param参数名称
*/
Spolo.getParameter = function(param){
	var value = "";
	var paramSearch = param+"=";
	var paramStr = window.location.search;
	var decode_paramStr = decodeURIComponent(paramStr).substring(1);
	var paramsArr = [];
	if(decode_paramStr.search(/&/)!=-1){
		paramsArr = decode_paramStr.split("&");
	}
	if(paramsArr[0]){
		var item;
		for(var i=0; i<paramsArr.length; i++){
			item = paramsArr[i];
			if(item.indexOf(param+"=")!=-1){
				value = item.substr(item.indexOf(param+"=")+paramSearch.length);
			}
		}
	}else{
		value = decode_paramStr.substr(decode_paramStr.indexOf(param+"=")+paramSearch.length);
	}
	return value;
}


/**@brief 根据iframe的id得到iframe的window对象
*/
function isWin(obj){ 
	return /Window|global/.test({}.toString.call(obj))||obj==obj.document&&obj.document!=obj; 
}
var getIframeDocument = function(element) {  
    return  element.contentDocument || element.contentWindow.document;  
};  
//向上寻找iframe的window
function getParentWindow(iframeid,wind){
	if(wind.name){
		var iframeName = wind.name;
		if(iframeid == iframeName){
		 	return wind;
		}else{
			if(wind.parent){
				return getParentWindow(iframeid,wind.parent);
			}
		}
	}
}
//向下寻找iframe的window
function getChildrenWindow(iframeid,wind){
	if(wind.name){
		var iframeName = wind.name;
		if(iframeid == iframeName){
		 	return wind;
		}else{
			if(wind.document.getElementsByTagName("iframe")){
				var iframes = wind.document.getElementsByTagName("iframe");
				for(var i=0; i<iframes.length; i++){
					return getChildrenWindow(iframeid,iframes[i].contentWindow);
				}
			}
		}
	}
}
Spolo.getWindowByIframeId = function(iframeid,wind){
	 
	if( !wind || !isWin(wind) ){
		wind = window;
	}
	if(wind&&isWin(wind)){
		var parentWindow = getParentWindow(iframeid,wind);
		var childrenWindow = getChildrenWindow(iframeid,wind);
		if(parentWindow){
			return parentWindow;
		}else if(childrenWindow){
			return childrenWindow;
		}
	}
	return;	
};

Spolo.notify = function(json){
	var dismissQueue = true;
	if(json["dismissQueue"] && typeof json["dismissQueue"] == "boolean")
	{
		dismissQueue = json["dismissQueue"];
	}
	var theme = "defaultTheme";
	if(json["theme"] && typeof json["theme"] == "string")
	{
		theme = json["theme"];
	}
	var timeout = 1000;
	if(json["timeout"] && typeof json["timeout"] == "number")
	{
		timeout = json["timeout"];
	}
	var root = this.getRoot();
	root.noty({
		text : json["text"],
		type : json["type"],
		dismissQueue : dismissQueue,
		layout : "topCenter",
		theme : theme,
		timeout : timeout
	});
};


/** 把地址栏的参数转换为 map
*/
Spolo.getUrlVars = function() 
{
	var map = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		map[key] = value;
	});
	return map;
};

/** 获取地址栏中的redirect 参数
*/
Spolo.getUrlRedirectPar = function()
{
	var map = {};
	var parts = window.location.href.replace(/[?&]+(redirect)=(.*)/gi, function(m,key,value) {
		// console.log(m);
		map[key] = value;
	});
	return map;
}

/**	把 map 转换为地址栏参数
	Usage:
	var data = { 'first name': 'George', 'last name': 'Jetson', 'age': 110 };
	var querystring = EncodeQueryData(data);
*/
Spolo.encodeQueryData = function(data)
{
   var ret = [];
   for (var d in data){
	  ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	}  
   return ret.join("&");
};

/**	url 带参数跳转
*/
Spolo.redirectWithVars = function(url, map)
{
	if(!url){
		console.error("url is undefined!");
		return;
	}
	var querystring;
	if(map){
		querystring = Spolo.encodeQueryData(map);
	}
	if(querystring){
		querystring = decodeURIComponent(querystring);
		if(url.indexOf("?")!=-1 && url.indexOf("=")!=-1){
			url += "&";
		}else{
			url += "?";
		}
	}else{
		querystring = "";
	}
	// alert(url+querystring);
	// console.log(url+querystring);
	window.location.href = url + querystring;
};

/**@brief Spolo.redirect ： 实现带参数的url 跳转
*/
Spolo.redirect = function(url)
{	
	// 参数判断
	if(!url){
		console.error("[Spolo.redirect ERROR]: url is undefined!");
		return;
	}
	// 获取map参数
	var map = Spolo.getUrlVars();
	// 将获取的参数，同要跳转的url 进行拼接
	Spolo.redirectWithVars(url, map);
}

/** 实现webui主动获取gutil cookie 的方式来自动登录
*/
if(!Spolo.gutil)
{
	Spolo.gutil = {};
}

var gutilAutoLogin = function(data)
{
	var name = data["uname"];
	var pwd = data["pwd"];
	
	if(!name || !pwd)
	{
		if(Spolo.gutil.login.nocookie)
		{
			Spolo.gutil.login.nocookie();
		}
		else
		{
			alert("Spolo.gutil.login.nocookie is undefined!!");
		}
		return;
	}
	if(!require || typeof(require)!="function")
	{
		alert("dojo require is undefined!");
		return;
	}
	var postData = "_charset_=UTF-8&resource=/&resource=form&j_username="+name+"&j_password="+pwd;
	require(["dojo/request/xhr"],function(xhr){
		xhr("/j_security_check",
			{
				method: "POST",
				handleAs : "text",
				data: postData
			}
		).then(
			function(msg)
			{
				// alert("login success!");
				if(Spolo.gutil.login.loginSuc)
				{
					Spolo.gutil.login.loginSuc(name, pwd);
				}
			},
			function(err)
			{
				// alert("[Spolo.gutil.login error]: \r\n 用户名或密码错误! \r\n 如果确定输入的用户名和密码是正确的，那么请联系管理员删除本地 auth.xml 文件。 \r\n"+err);
				
				Spolo.gutil.logout(
					function(){
						
						if(Spolo.gutil.login.cookieExpired)
						{
							Spolo.gutil.login.cookieExpired();
						}
						
					}
				);
				
			}
		);
	});
}

Spolo.gutil.login = function(loginSuc, nocookie, cookieExpired)
{
	window.gutilAutoLogin = gutilAutoLogin;
	var src = "http://127.0.0.1:10828/getCookie?callback=gutilAutoLogin";
	var script = document.createElement("SCRIPT");
	script.src = src;
	Spolo.gutil.login.loginSuc = loginSuc;
	Spolo.gutil.login.nocookie = nocookie;
	Spolo.gutil.login.cookieExpired = cookieExpired;
	if(document.head)
	{
		// test ~~~
		// gutilAutoLogin({"uname":"_caobin_403dly.net","pwd":"123456"});
		// test ^^^
		
		document.head.appendChild(script);
	}
	else
	{
		alert("document.head is undefined!!");
		return;
	}
}

var gutilAutoLogout = function()
{
    // alert("gutilAutoLogout -- start");
	if(!require || typeof(require)!="function")
	{
		alert("dojo require is undefined!");
		return;
	}
	
	require(["dojo/request/xhr"],function(xhr){
		xhr("/system/sling/logout.html",
			{
				method: "POST",
				handleAs : "text"
			}
		).then(
			function(msg)
			{
				// window.alert("logout success!");
				if(Spolo.gutil.logout.logoutSuc)
				{
					Spolo.gutil.logout.logoutSuc();
				}
			},
			function(err)
			{
				alert("Spolo.gutil.logout error: "+err);
				// alert(err);
				if(Spolo.gutil.logout.logoutErr){
					Spolo.gutil.logout.logoutErr(err);
				}
			}
		);
	});
}

/**@ Spolo.gutil.logout : gutil 进行登出操作
**/
Spolo.gutil.logout = function(logoutSuc, logoutErr)
{
	var url = "http://127.0.0.1:10828/removecookie";

	Spolo.gutil.logout.logoutSuc = logoutSuc;
	Spolo.gutil.logout.logoutErr = logoutErr;
	// 调用Spolo.scriptCrossDomain 进行跨域
	Spolo.scriptCrossDomain(url,gutilAutoLogout);
	
}

/**@brief scriptCrossDomain : script 跨域
**/
Spolo.scriptCrossDomain = function(url,callback){
	// 参数判断
	if(!url){
		console.error("[Spolo.scriptCrossDomain ERROR]: url is undefined!");
		return;
	}
	if(!callback || typeof callback != "function"){
		console.error("[Spolo.scriptCrossDomain ERROR]: callback is undefined or not function!");
		return;
	}
	var src = url;
	// 为了防止serverCallback 重复导致的覆盖问题
	var serverCallback = Spolo.CreateNodeName("callback");
	
	// var src = "http://127.0.0.1:10828/removecookie?callback=gutilAutoLogout";
	// src += "=callback";
	if(src.indexOf("?")>=0){
	   src += "&callback="+serverCallback; 
	}else{
	   src += "?callback="+serverCallback;
	}
	
	window[serverCallback] = callback;
	var script = document.createElement("SCRIPT");
	script.src = src;
	
	if(document.head){
		document.head.appendChild(script);
	}else{
		alert("[Spolo.scriptCrossDomain ERROR]: document.head is undefined!");
		return;
	}	
}

/**@brief Spolo.getSessionInfo : 获取sling sessionInfo
   @return session ：{"userID":"admin","workspace":"default","authType":"FORM"}	
**/
Spolo.getSessionInfo = function(){
	
	var session = null;
	
	require(["dojo/request/xhr"],function(xhr){
			
		var url = "/system/sling/info.sessionInfo.json";
		
		xhr(url,{
			handleAs : "json",
			method : "GET",
			sync : true
		}).then(
			function(response){
				session = response;
			},
			function(error){
				console.error("[Spolo.getSessionInfo ERROR]: Maybe the login session is lost,need to login again!",error);
				alert("[Spolo.getSessionInfo ERROR]: Maybe the login session is lost,need to login again!",error);
				return;
			}
		);
	});
	
	return session;
}
// end spolo code scope 
})();