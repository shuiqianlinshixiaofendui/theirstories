/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("spolo/data/history",
[
	"dojo/_base/declare", 
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"dojo/request/xhr",
	"dojo/json"
],
function(
	declare, 
	spobject, 
	spsession,
	spnode,
	xhr,
	JSON
)
{

	
	/****************************************************************/
	/*******************私有方法*************************************/
	/****************************************************************/
	
	
	
	
	/****************************************************************/
	/*******************公有方法*************************************/
	/****************************************************************/
	
	var retClass =  declare("spolo/data/history", [], {
	
		constructor : function()
		{
		}
		
    });
	
	/**@brief  history 查询给定节点的历史版本记录
	   @param args : JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/modellib/modexxx", // 要查询的历史版本记录的资源
					kw : "",							// (optional) 查询条件
					sd : "",							// (optional) 查询起始时间
					ed : "",							// (optional) 查询终止时间
					success : function(data){},			// 成功的回调函数
					failed : function(error){},			// (optional)失败的回调函数
				}
			@endcode
	**/
	retClass.history = function(args){
		// 路径查询
		if(!args["path"]){
			console.error("[ERROR]:path is undefined!");
			return;
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]:args['success'] is undefined!");
			return;
		}
		// 拼接路径
		var url = args["path"] + ".history"; 
		var data = {};
		if(typeof args["kw"] != "undefined"){
			data["kw"] = args["kw"];
		}
		if(typeof args["sd"] != "undefined"){
			// data["sd"] = encodeURIComponent(args["sd"]);
			data["sd"] = args["sd"];
			
		}
		if(typeof args["ed"] != "undefined"){
			// data["ed"] = encodeURIComponent(args["ed"]);
			data["ed"] = args["ed"];
		}
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json", // 应该是json 格式，暂时修改为text
			method : "GET",
			query : data
		}).then(
			// 成功的返回数据
			function(jsonData){
				// 需要进行判断
				if(jsonData["success"]=="true"){
					args["success"](jsonData);
					return;
				}else{
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](jsonData);
						return;
					}
					console.error("[ERROR]: call history occures error!"+ error);
					return;
				}
				
			},
			// 失败返回的数据
			function(error){
				if(args["failed"] && typeof args["failed"] == "function"){
					args["failed"](jsonData);
					return;
				}
				console.error("[ERROR]: call history occures error!"+ error);
				return;
			}
		);
	}
	
	/**@brief  reversion 将数据回滚到指定的版本号
	   @param path : 要回滚的节点的路径
	   @param hver : 要回滚的版本号
	**/
	retClass.reversion = function(path, hver, callback, errorCallback){
		// 路径查询
		if(!path||!hver){
			console.error("[ERROR]:path or hver is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]:callback is undefined!");
			return;
		}
		// 拼接路径
		var url = path + ".reversion"; 
		var data = {};
		data["hver"] = hver;
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			query : data,
			method : "GET"
		}).then(
			// 成功的返回数据
			function(jsonData){
				// 需要进行判断
				if(jsonData["success"]=="true"){
					callback(jsonData);
				}else{
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback(jsonData);
					}
				}
			},
			// 失败返回的数据
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
				}
			}
		);
	}
	return retClass;
	
});