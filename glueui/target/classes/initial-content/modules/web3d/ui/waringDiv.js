/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
**/
define("web3d/ui/waringDiv",
    ["dojo/dom","dojo/dom-construct","dijit/form/Button","dojo/on","dijit/Dialog","dijit/form/Button"],
	function(dom,construct,Button,on,Button){
		var flag = true;
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        var content ;
		return dojo.declare([],{			
			constructor : function(containerID1){
                
                if (typeof(Sys.ie) != "undefined" && Sys.ie.split(".")[0] < 9){
					content = "<font color='white' style='font-family:verdana' size='5'>" + "很遗憾,您的浏览器版本OUT了！</font>" 
							+ "<br/><br/>" + "<font color='#a9a9a9' style='font-family:verdana' size='4'>更新最新版本即可支持本页面！" 
							+ "<br/>" + "<a href=http://windows.microsoft.com/en-us/internet-explorer/download-ie><img src='image/ie_big.png' /></a>"
							+ "<br />点击图标链接轻松升级最新版本IE</font>"
                            + "<br />如果您使用的搜狗浏览器，请切换到极速模式下"
                            + "<br />如果您使用的是Windows XP的IE浏览器，请<a href='/libs/GoogleChromeframeStandaloneEnterprise.msi'>点此下载安装插件</a>"
                            + "<br />如果您使用的是Windows 7/Vista/XP SP2 或更高版本系统的IE浏览器，请<a href='http://www.google.com/chromeframe?quickenable=true&hl=zh-CN'>点此下载安装插件</a>"
							+ "<br /><br /><br /><p style='text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#a9a9a9' style='font-family:verdana;text-align:left;' size='4' >您还可以使用以下浏览器</font></p>"
							+ "<br /><br /><br /><a href=http://www.google.cn/intl/zh-CN/chrome/browser/?installdataindex=chinabookmarkcontrol&brand=CHUN><img src='image/chrome.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://firefox.com.cn/download/><img src='image/firefox.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://www.apple.com.cn/safari/><img src='image/safari.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://chrome.360.cn/index.html><img src='image/360.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://ie.sogou.com/><img src='image/sougou.png' /></a>"
							+ "<br /><br /><br />";
					flag = false ;
                }
				if (typeof(Sys.firefox) != "undefined" && Sys.firefox.split(".")[0] < 19) {
                    content = "<font color='white' style='font-family:verdana' size='5'>" + "很遗憾,您的浏览器版本OUT了！</font>" 
							+ "<br/><br/>" + "<font color='#a9a9a9' style='font-family:verdana' size='4'>更新最新版本即可支持本页面！" 
							+ "<br/>" + "<a href=http://firefox.com.cn/download/><img src='image/firefox_big.png' /></a>"
							+ "<br />点击图标链接轻松升级最新版本firefox</font>"
							+ "<br /><br /><br /><p style='text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#a9a9a9' style='font-family:verdana;text-align:left;' size='4' >您还可以使用以下浏览器</font></p>"
							+ "<br /><br /><br /><a href=http://windows.microsoft.com/en-us/internet-explorer/download-ie><img src='image/ie.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://www.google.cn/intl/zh-CN/chrome/browser/?installdataindex=chinabookmarkcontrol&brand=CHUN><img src='image/chrome.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://www.apple.com.cn/safari/><img src='image/safari.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://chrome.360.cn/index.html><img src='image/360.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://ie.sogou.com/><img src='image/sougou.png' /></a>"
							+ "<br /><br /><br />";
					flag = false ;
                }
				if (typeof(Sys.chrome) != "undefined" && Sys.chrome.split(".")[0] < 25) {
                    content = "<font color='white' style='font-family:verdana' size='5'>" + "很遗憾,您的浏览器版本OUT了！</font>" 
							+ "<br/><br/>" + "<font color='#a9a9a9' style='font-family:verdana' size='4'>更新最新版本即可支持本页面！" 
							+ "<br/>" + "<a href=http://www.google.cn/intl/zh-CN/chrome/browser/?installdataindex=chinabookmarkcontrol&brand=CHUN><img src='image/chrome_big.png' /></a>"
							+ "<br />点击图标链接轻松升级最新版本chrome</font>"
							+ "<br /><br /><br /><p style='text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#a9a9a9' style='font-family:verdana;text-align:left;' size='4' >您还可以使用以下浏览器</font></p>"
							+ "<br /><br /><br /><a href=http://windows.microsoft.com/en-us/internet-explorer/download-ie><img src='image/ie.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://firefox.com.cn/download/><img src='image/firefox.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://www.apple.com.cn/safari/><img src='image/safari.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://chrome.360.cn/index.html><img src='image/360.png' /></a>"
							+ " &nbsp;&nbsp;&nbsp;&nbsp;<a href=http://ie.sogou.com/><img src='image/sougou.png' /></a>"
							+ "<br /><br /><br />";
                            
					flag = false ;
                    if(Sys.chrome.split(".")[0] == 17){     // 搜狗浏览器中使用的是chorme 17
                        flag = true ;
                    }
                }
               
				var container1 = dom.byId(containerID1);
				construct.create("font",{
					id:"text",
					innerHTML: content ,
				},container1);
                
                dom.byId('dialog').children[0].style.display = 'none';
                dom.byId('dialog').children[1].style.display = 'none';
				
				construct.create("img",{
					id:"enter",
					innerHTML: "确定",
					src : 'image/enter.png',
					onclick : "dijit.byId('dialog').hide()",
				},container1);
				
				
			},
			
			getFlag : function(){
				return flag;
			}
		});	
	}
);