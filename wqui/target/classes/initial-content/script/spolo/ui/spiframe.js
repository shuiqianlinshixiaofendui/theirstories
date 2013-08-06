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
 * 入口文件的js脚本
 *
 * @version $Rev: $, $Date: 2007-03-27 16:30:52 +0200 (Tue, 27 Mar 2007) $
 */


if(!Spolo){
	console.error("spdialog depend on Spolo! please load .js file script/spolo.js!");
}

if(Spolo.ui){
	console.error("Spolo.ui already exists!");
}
 
var _spDialog;
var _spDialogData;
var _spDialogEmit;
var _spDialogHide;

(function(){

	if(!Spolo){
		console.error("script.Spolo is undefined!");
		return ;
	}
	
	// 获取当前显示区域的宽高
	var Client = {
		viewportWidth: function() {
			return self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
		},        
		viewportHeight: function() {
			return self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
		},        
		viewportSize: function() {
			return { width: this.viewportWidth(), height: this.viewportHeight() };
		}
	};
	
	// 保存所有的 spdialog
	var rootWindow = Spolo.getRoot();
	var SPDDK = "spddk";	// SanPolo Dialog Data Key
	var SPDD = "_spDialogData";
	
	var spdialogMap = {
		/*
			dialog : dijit.Dialog,
			data : {}, 		// new spDialog 时传入的参数.
			handle : {}		// 返回给 spdialog 使用者的 handle , 所有的方法都是通过此 handle 来调用, 
							// 继承了 dojo.Evented , 具有处理事件能力.
		*/
	};

	/*
		spDialog 的入口方法
	*/
	_spDialog = function(args)
	{
		var id = args["id"];
		if(!id){
			// 生成随机ID
			id = Spolo.CreateNodeName("_spdialog");
		}
		
		spdialogMap[id] = {};
		
		console.log("");
		console.log("==========================================");
		console.log("[INFO]创建 spdialog : " + id );
			
		var widthradio = args["widthradio"];
		if(!widthradio){
			widthradio = 0.9;
		}
		
		var heightradio = args["heightradio"];
		if(!heightradio){
			heightradio = 0.9;
		}
		
		var title = args["title"];
		if(!title){
			title = "";
		}
		
		var content = args["content"];
		var url = args["url"];
		if(!content&&!url){
			console.log("弹出spdialog时没有给内容");
			return;
		}
		
		// 处理传入的参数
		var data = args["data"];
		if(data){
			setSpDialogData(data, id);
		}
		
		// 如果用户自定义的 id , 并且该 id 已经存在了, 则把该 id 对应的 spdialog 释放掉, 再重新 new 
		var existDialog = spdialogMap[id]["dialog"];
		if(existDialog){
			console.log("[INFO]spdialog "+id+" 已经存在, 先执行 destory ...");
			spdialogMap[id]["dialog"].destroy();
		}
	
		require(["dijit/Dialog","dojo/query","dojo/on","dojo/dom-construct"],function(Dialog, query, on, domConstruct){

			var width = Math.ceil(Client.viewportWidth() * widthradio);
			var height = Math.ceil(Client.viewportHeight() * heightradio);
			// 校正 dojo dialog 布局中的bug.
			var padding = 0;	// 修改dialog默认的padding值
			var dwidth = width - padding*2;
			var dheight = height - padding*2 - 24;
			var iframeWidth = dwidth - 2;
			var iframeHeight = dheight - 3;
		
			// 如果地址栏为空
			if(url){
				// 在 url 中记录当前 dialog 的 id , 为 Spolo.getSpDialogData() 方法做准备
				url = takeSpDialogId(url, id);
				//创建iframe对象
				content = domConstruct.create("iframe",{
					src : url,
					// style : "border:none;"
					style : "width:"+ iframeWidth +"px;height:"+ iframeHeight +"px;border:none;"
				});
			}
			var dialog = new Dialog({
				id : id,
				title : title,
				content : content,
				style : "width:"+width+"px;height:"+height+"px;background-color:#fff;"
				// style : "background-color:#fff;"
			});
			
			// 记录每一个 spdialog 对象, 及其宽和高, 为窗口大小自适应功能准备数据
			spdialogMap[id]["dialog"] = dialog;
			spdialogMap[id]["widthradio"] = widthradio;
			spdialogMap[id]["heightradio"] = heightradio;
			
			// 显示 dialog 
			dialog.show();
			
			// 校正 dojo dialog 布局中的bug.
			query("#"+id+" .dijitDialogPaneContent").style({
				padding: padding+"px", 
				width: dwidth+"px", 
				height: dheight+"px"
			});
			query("#"+id+" iframe").style({
				width: dwidth+"px", 
			});
			
			// 监听dialog的关闭事件, 释放dialog中的内容			
			dialog.on("cancel",function(){
				var id = this.id;
				console.log("[INFO]关闭 spdialog : " + id );
				console.log("[INFO]销毁 spdialog : " + id );
				spdialogMap[id]["dialog"].destroy();
				console.log("[INFO]从 spdialogMap 中删除 " + id + " 的数据.");
				delete spdialogMap[id];
				console.log("[INFO]当前 spdialogMap 中的数据是: ");
				console.log(spdialogMap);
			});
			
			// 回调函数
			var callback = args["callback"];
			/*
				这里返回 spdialog 中的 iframe window 对象,
				返回之前需要把 dojo/Evented mixin 到一个对象中, 这样该对象就可以使用 emit 方法来向外部传递消息了,
				spdialog中发出事件时需要调用根窗口中的 _spDialogEmit 方法, 然后根据 spdialog 的ID取出 evented 对象并执行 emit .
			*/
			if(callback && typeof(callback)=="function"){	// 如果使用者给了回调函数这个参数, 说明他需要得到此dialog的对象
				var callbackEvented = function(eventObj){
					console.log("[INFO]为 spdialog "+id+" 添加一个 handle ...");
					spdialogMap[id]["handle"] = eventObj;
				}
				// 调用生成 handle 的方法
				setDialogHandle(id, callbackEvented);

				// 这里返回 sp dialog map 
				console.log("[INFO]为 spdialog "+id+" 返回一个 handle");
				console.log(spdialogMap[id]["handle"]);
				callback(spdialogMap[id]["handle"]);
			}
		});
	}
	
//================================================================================================
	// 自适应窗口大小的改变
	function resizeSpDialog(){
		for(var id in spdialogMap){
			var widthradio = spdialogMap[id]["widthradio"];
			var heightradio = spdialogMap[id]["heightradio"];
			var width = Math.ceil(Client.viewportWidth() * widthradio);
			var height = Math.ceil(Client.viewportHeight() * heightradio);
			// 校正 dojo dialog 布局中的bug.
			var padding = 0;	// 修改dialog默认的padding值
			var dwidth = width - padding*2;
			var dheight = height - padding*2 - 24;
			var iframeWidth = dwidth - 2;
			var iframeHeight = dheight - 3;
			require(["dojo/query"],function(query){
				query("#"+id).style({
					width: width+"px",
					height: height+"px"
				});
				// 校正 dojo dialog 布局中的bug.
				query("#"+id+" .dijitDialogPaneContent").style({
					padding: padding+"px", 
					width: dwidth+"px", 
					height: dheight+"px"
				});
				query("#"+id+" iframe").style({
					width: dwidth+"px", 
					height: iframeHeight+"px"
				});
			});
		}
	}
	// 当浏览器窗口调整时自动调整 spdialog
	window.onresize = function(){
		resizeSpDialog();
	}
	
	// 在 spDialog 中调用关闭窗口的方法
	_spDialogHide = function(id){
		if(!id){
			console.error("[ERROR]spdialog _spDialogEmit ERROR: spdialog _spDialogEmit spddk is undefined!");
			return;
		}
		var spd = spdialogMap[id]["dialog"];
		spd.hide();
	}
	
//================================================================================================
	// 如果dialog中有iframe, 在 iframe 的 url 中记录当前dialog的id
	function takeSpDialogId(url, id){
		if(url.indexOf("?")>0){
			url += "&"+SPDDK+"="+id;
		}else{
			url += "?"+SPDDK+"="+id;
		}
		return url;
	}
	// 处理 spdialog 的参数传递问题
	function setSpDialogData(data, id){
		console.log("[INFO]向 spdialog {"+ id + "} 中传入数据:");
		console.log(data);
		if(!spdialogMap[id]){
			spdialogMap[id] = {};
		}
		spdialogMap[id]["data"] = data;
	}
	// 在弹出的 spdialog 中的iframe中取数据, 
	// 如果在iframe中还嵌套了一层iframe, 在第二层iframe中无法使用此方法
	_spDialogData = function(id){	// spdWindow : SanPolo dialog window
		if(!id){
			console.error("spdialog getDialogData spddk is undefined!");
			return;
		}
		if(!spdialogMap[id]){
			spdialogMap[id] = {};
		}
		if(!spdialogMap[id]["data"]){
			spdialogMap[id]["data"] = {};
		}
		return spdialogMap[id]["data"];
	}
	
//================================================================================================	
	
	// 准备一个 Evented 的对象, 也是 spdialog 的 handle 
	function setDialogHandle(id, callback){
		require(["dojo/_base/declare","dojo/Evented"], function(declare,Evented){
			var EventedObj = declare([Evented], {
				constructor: function(id){
					this.id = id;
				},
				// 通过 handle 关闭 spdialog 的方法
				hide: function(){
					_spDialogHide(this.id);
				}
			});
			var evtobj = new EventedObj(id);
			callback(evtobj);
		});
	}
	
	// 为 spdialog 中的 iframe window 对象添加 Evented 支持
	_spDialogEmit = function(id, eventType, param){		// spdWindow : SanPolo dialog window
		if(!id){
			console.error("spdialog _spDialogEmit ERROR: spdialog _spDialogEmit spddk is undefined!");
			return;
		}
		spdialogMap[id]["handle"].emit(eventType, param);
	}
	
//================================================================================================	
	
	
})();
/*
	

_spDialog({
	id:"asdfsdfsdf",
	widthradio: 0.9,
	heightradio:0.9,
	title:"",
	content:"<div>sdf</div>",
	url:"fuck.html"
});
*/