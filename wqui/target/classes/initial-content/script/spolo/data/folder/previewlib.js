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
 
define("spolo/data/folder/previewlib",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"spolo/data/queryClass",	
	"spolo/data/folder",
	"spolo/data/util/image"
],
function(
	declare, 
	xhr,
	queryClass,
	folder,
	image_cls
)
{
	var retClass = declare("spolo.data.folder.previewlib", [folder], {
	
		constructor : function(path)
		{
			// 此处的path 是/content/users/admin/previewlib/scenexxx
			// 或者path 是/content/previewlib/scenexxx
			// 为了兼顾二者将path 指定为"/content"
			if(path !="/content"){
				throw("The path is must '/content' !!");
			}
			
		}
		
	});	
	
	/**@brief createModelsPreview : 批量为模型创建renderjob
	   @param path : 效果图集路径 /content/previewlib 或者是 /content/users/userxx/previewlib
	   @param callback :　成功的回调函数
	   @param errorCallback ：失败的回调函数
	**/
	retClass.createModelsPreview = function(path, callback, errorCallback){
		// 参数判断
		if(!path){
			console.error("[ERROR]: path is null or undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		
		// 拼接路径
		var url = path;
		url += ".createModelsPreview";
		
		// 发送ajax 请求
		xhr(url, {
			handleAs : "json",
			method : "GET"
		}).then(
			function(data){
				callback(data);
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call createModelsPreview occurs error !" + error);
				return;
			}
		);
	}
	
	/**@brief getFirstPreviewPath 返回云端效果图中的一个场景路径 /content/previewlib/scenexxx/previewxx
	   @param path  云端效果图场景path ,/content/previewlib/scenexxx
	   @param callback ：成功的回调函数
	   @param errorCallback : 失败的回调函数	
	*/
	retClass.getFirstPreviewPath = function(path, callback, errorCallback){
		if(!path){
			throw("there must be a 'path' parameter");
		}
		var rootPath = path;
		var sceneName = path.substring(path.lastIndexOf("/")+1);
		var args = {
			nodePath  : rootPath,
			fuzzyProperties : {
				"sling:resourceType":"preview",
				"scene": sceneName
			},
			offset:0,
			limit:1,
			load : function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]>0){
					var pathArray = [];
					var data = data["data"];
					for(var path in data){
						pathArray.push(path);
					}
					callback(pathArray);
				}
			},	
			error : function(error){
				if(typeof(errorCallback)=="function"){
					errorCallback(false);
				}else{
					throw(error);
				}	
			}
		}
		queryClass.query(args);
	}
	
	/**@brief : 返回云端效果图中的一个场景路径
	   @callback ：成功的回调函数
	   @errorCallback : 失败的回调函数	
	*/
	retClass.getPreviewImages = function(path, callback, errorCallback){
		if(!path){
			throw("there must be a 'path' parameter");
		}
		
		var rootPath = path;
		var sceneName = path.substring(path.lastIndexOf("/")+1);
		var args = {
			nodePath  : rootPath,
			fuzzyProperties : {
				"sling:resourceType":"preview",
				"scene": sceneName
			},
			load : function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]>0){
					var pathArray = [];
					var data = data["data"];
					for(var path in data){
						//path = path + ".image";
						var imgpath = image_cls.convert({
							"path" : path,
							"width" : 192,
							"height" : 192
							
						});
						pathArray.push(imgpath);
					}
					callback(pathArray);
				}
			},	
			error : function(error){
				if(typeof(errorCallback)=="function"){
					errorCallback(false);
				}else{
					throw(error);
				}	
			}
		}
		queryClass.query(args);
	}
	
	/**@brief : 判断所给的效果图是否已经发布
	   @param pathArray : 个人效果图的路径集合/content/users/admin/previewlib/scenexxx
	   @param callback : 成功的回调函数,参数为json
	   @param errorCallback : (optional)失败的回调函数.
	**/
	retClass.isPublished = function(pathArray, callback, errorCallback){
		// 拼接路径
		var pathStrings = pathArray.join(",");
		var url = "/content/previewlib.isPublished?scenes=" + pathStrings ;
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			method : "GET"
		}).then(
			function(jsonData){
				//console.log(jsonData);
				if(typeof(callback) == "function"){
					callback(jsonData);
				}else{
					throw("there must be a 'callback' parameter in arguments!");
				}
			},	
			function(error){
				if(typeof(errorCallback)=="function"){
					errorCallback(error);
				}else{
					throw(error);
				}	
			}
		);
		
	}
	
	/** @brief 支持批量删除发布在云端效果图的效果图
		@param pathArray : 传入的path 数组
		@param callback ： (optional)成功调用的回调函数	
		@param errorCallback ： (optional)失败调用的回调函数
	**/
	retClass.batchRemove = function(pathArray, callback, errorCallback){
		// 拼接路径
		var pathStrings = pathArray.join(",");
		var url = "/content/previewlib.deletepreviews?nodes=" + pathStrings ;
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json", // 返回的数据必须是按照json 格式
			method : "GET"
		}).then(
			function(jsonData){
				//console.log(data);
				if(typeof(callback) == "function"){
					callback(jsonData);
				}else{
					throw("there must be a 'callback' parameter in arguments!");
				}
			},	
			function(error){
				if(typeof(errorCallback)=="function"){
					errorCallback(error);
				}else{
					throw(error);
				}	
			}
		);
		
	}
	
	/**@brief searchforstatics 获取用户的统计信息
	   @param args : JSON 格式的参数
			@code{.js}
				var args = {
					publishAuthor : "admin",                     // 发布者
					startTime ："2007-08-19T10:11:38.281+02:00", // 起始时间
					endTime : "2013-08-19T10:11:38.281+02:00",   // 终止时间
					success : function(){}, 					 // 成功的回调函数
					failed ：function(){}						 // 失败的回调函数(optional)		
				}
			@endcode
	**/
	retClass.searchforstatics = function(args){
		// 参数检查 以及值的获取
		if(args["publishAuthor"]=="undefined"){
			console.error("[ERROR]: args['publishAuthor'] is undefined!");
			return;
		}
		if(args["success"]=="undefined" || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined!");
			return;
		}
		if(args["startTime"]!="undefined"||args["endTime"]!="undefined"){
			var timeRangesProperties = {};
		}
		if(args["startTime"]!="undefined"){
			var startTime = args["startTime"];
			timeRangesProperties["startTime"] = {"publishdate":startTime}; 
		}
		if(args["endTime"]!="undefined"){
			var endTime = args["endTime"];
		    timeRangesProperties["endTime"] = {"publishdate":endTime};
		}
		// 将用户名进行编码
		var publishAuthor = Spolo.encodeUname(args["publishAuthor"]);
		
		// 查询语句
		var queryArgs = {
			"nodePath" : "/content/previewlib",
			"properties" : {
				"publishAuthor" : publishAuthor,
				"sling:resourceType" : "folder"
			},
			"orderDesc" : "publishdate",
			"load" : function(data){
				if(typeof data == "object" && data["totalNum"] >= 0){
					//console.log(data);
					// 获取模型的数量
					getModelsNum(
						data, 
						function(modelsTotal){
						
							data["modelsTotal"] = modelsTotal;
							console.log("[INFO]: searchforstatics:");
							console.log(data);
							args["success"](data);	
					});
				}
			},
			"failed" : function(error){
				if(args["failed"] || typeof args["failed"] != "function"){
					args["failed"](error);
					return;
				}
				console.error("[ERROR]: call searchforstatics occurs wrong " + error);
				return;
			}
		}
		if(timeRangesProperties!="undefined"){
			queryArgs["timeRangesProperties"] = timeRangesProperties;
		}
		queryClass.query(queryArgs);
		
		// 获取模型的数量
		function getModelsNum(data, callback){
		    var pathsArray = [];
			for(var path in data["data"]){
				//console.log(path);
				pathsArray.push(path);
			}
			// 如果用户没有发布效果图，直接返回0
			if(pathsArray.length==0){
				callback(0);
				return;
			}
			var url = "/content/previewlib" + ".statics";
			var content = {};
			content["previews"] = pathsArray.join(",");
			xhr(url,{
				handleAs : "json",
				method : "POST",
				// query : content
				data : content
			}).then(
				function(jsonData){
					//console.log(jsonData);
					callback(jsonData["totalNum"]);
				},
				function(error){
					console.error("[ERROR]: call getModelsNum occurs wrong!"+ error);
					return;
				}
			);
		}
	}
	return retClass;
})