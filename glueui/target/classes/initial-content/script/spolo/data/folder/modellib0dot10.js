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
 
define("spolo/data/folder/modellib0dot10",
[
	"dojo/_base/declare",
	"dojo/dom",
	"spolo/data/spsession",
	"spolo/data/queryClass",	
	"spolo/data/folder"
],
function(
	declare, 
	dom,
	spsession,
	queryClass,
	folder
)
{
	var retClass = declare("spolo.data.folder.modellib0dot10", [folder], {
		
		constructor : function()
		{
		}
		
		
	});	
	
	retClass.getModellib = function(args){
		
		// var serverCallback = function(data){
			// args["success"](data);
			// return;
		// };
		// window.serverCallback = serverCallback;
		
	
		// var head = query("head")[0];
		// var script = dom.create("script",{
			// src:"http://0.10/content/modellib.query?.....&callback=serverCallback"+
		// },head);
	
		var callback = function(data){
			// 这里需要处理一下返回的数据
			for(var condition in data["data"]){
				data["data"][condition]["preview"] = "http://192.168.0.10" + condition + ".preview";
			}
			args["success"](data);
			return;
		};
		window.callback = callback;
		
		if(typeof args["limit"] != "undefined"){
			var limit = args["limit"];
		}else{
			var limit = -1;
		}
		
		if(typeof args["offset"] != "undefined"){
			var offset = args["offset"];
		}else{
			var offset = -1;
		}
		
		if(typeof args["expression"] != "undefined"){
			var expression = args["expression"];
		}else{
			var expression = "/jcr:root/content/modellib/*[jcr:like(@sling:resourceType,'model')] order by @jcr:created  descending";
		}
		
		require(["dojo/request/script"], function(script){
			//var url = "http://192.168.2.63/content/modellib.query";
			var url = "http://192.168.0.10/content/modellib.query";
			var data = {};
			data["language"] = "xpath";
			data["limit"] = limit;
			data["offset"] = offset;
			data["expression"] = expression;
			data["isiframe"] = true;
			//data["callback"] = serverCallback;
			script.get(url, {
				jsonp : "callback",
				query : data 
			}).then(
				function(data){
				// Do something with the response data
				
					callback(data);
					//serverCallback(data);
					//args["success"](data);
					return;
				},		
			    function(error){
				// Handle the error condition
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					console.error("[ERROR]: call getModellib occurs error!"+error);
					
			    }
			);
			  // Progress events are not supported
		});
	}
	
	/**@brief getModellist ： 同modellib.getModellist 方法一致。
	**/
	retClass.getModellist = function(args){
		
		if(!args["success"]||typeof args["success"] != "function"){
			console.error("[modellib0dot10.getModellist ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		var callback = function(data){
			
			// 这里需要处理一下返回的数据
	
			args["success"](data);
			return;
		};
		window.callback = callback;
		
		if(typeof args["limit"] == "undefined"){
			var limit = -1;
		}else{
			var limit = args["limit"];
		}
		
		if(typeof args["offset"] == "undefined"){
			var offset = -1;
		}else{
			var offset = args["offset"];
		}
		
		
		
		require(["dojo/request/script"], function(script){
		
			// 参数的获取
			// var url = "http://devvm.spolo.org/content/modellib.modellist";
			var url = "http://192.168.0.10/content/modellib.modellist";
			var data = {};
			data["limit"] = limit;
			data["offset"] = offset;
			data["isiframe"] = true;
			
			// 模糊查询条件
			if(typeof args["fuzzyProperties"] != "undefined"){
				
				var fuzzyProperties = args["fuzzyProperties"];
				
				if(typeof fuzzyProperties["term"] != "undefined"){
					var term = fuzzyProperties["term"];
					data["term"] = term;
				}
				
				if(typeof fuzzyProperties["publishAuthor"] != "undefined"){
					var publishAuthor = fuzzyProperties["publishAuthor"];
					data["publishAuthor"] = Spolo.encodeUname(publishAuthor);
				}
				
				if(typeof fuzzyProperties["resourceName"] != "undefined"){
					var resourceName = fuzzyProperties["resourceName"];
					data["resourceName"] = resourceName;
				}
				
				if(typeof fuzzyProperties["keyInfo"] != "undefined"){
					var keyInfo = fuzzyProperties["keyInfo"];
					data["keyInfo"] = keyInfo;
				}
				
				if(typeof fuzzyProperties["introduction"] != "undefined"){
					var introduction = fuzzyProperties["introduction"];
					data["introduction"] = introduction;
				}
				
				if(typeof fuzzyProperties["categoryPath"] != "undefined"){
					var categoryPath = fuzzyProperties["categoryPath"];
					data["categoryPath"] = categoryPath;
				}
				
				if(typeof fuzzyProperties["stylePath"] != "undefined"){
					var stylePath = fuzzyProperties["stylePath"];
					data["stylePath"] = stylePath;
				}
				
				if(typeof fuzzyProperties["madeOfPath"] != "undefined"){
					var madeOfPath = fuzzyProperties["madeOfPath"];
					data["madeOfPath"] = madeOfPath;
				}
				
				if(typeof fuzzyProperties["brandPath"] != "undefined"){
					var brandPath = fuzzyProperties["brandPath"];
					data["brandPath"] = brandPath;
				}
				
				if(typeof fuzzyProperties["roomPath"] != "undefined"){
					var roomPath = fuzzyProperties["roomPath"];
					data["roomPath"] = roomPath;
				}
				
				if(typeof fuzzyProperties["sightfeelingPath"] != "undefined"){
					var sightfeelingPath = fuzzyProperties["sightfeelingPath"];
					data["sightfeelingPath"] = sightfeelingPath;
				}
				
			}
			// 时间范围查询条件
			if(typeof args["timeRangesProperties"] != "undefined"){
				
				var timeRangesProperties = args["timeRangesProperties"];
				
				if(typeof timeRangesProperties["startTime"] != "undefined"){
					var startTime = timeRangesProperties["startTime"];
					data["startdate"] = startTime;
				}
				
				if(typeof timeRangesProperties["endTime"] != "undefined"){
					var endTime = timeRangesProperties["endTime"];
					data["enddate"] = endTime;
				}
			
			}
			
			// 查询结果进行排序
			if(args["orderAsc"]){
				
				var orderAsc = args["orderAsc"];
				switch(orderAsc){
					case "resourceName" : 
										data["sortByElem"] = "resourceName"; 
										break;
					case "publishdate" : 
										data["sortByElem"] = "publishdate"; 
										break;
					case "jcr:created" : 
										data["sortByElem"] = "jcr:created"; 
										break;
					default : 
							break;
				}
			}else if(args["orderDesc"]){
				
				var orderDesc  = args["orderDesc"];
				switch(orderDesc){
					case "resourceName" : 
										data["sortByElem"] = "resourceNameDesc"; 
										break;
					case "publishdate" : 
										data["sortByElem"] = "publishdateDesc"; 
										break;
					case "jcr:created" : 
										data["sortByElem"] = "jcr:createdDesc"; 
										break;
					default : 
							break;
				}
				
			}else{
				// 默认按照 publishdate 进行降序排列
				data["sortByElem"] = "publishdateDesc";
			}
			
			//data["callback"] = serverCallback;
			script.get(url, {
				jsonp : "callback",
				query : data 
			}).then(
				function(data){
				// Do something with the response data
					var data = dealData(data);
					callback(data);
					
					
					return;
				},		
			    function(error){
				// Handle the error condition
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					console.error("[ERROR]: call getModellib occurs error!"+error);
					
			    }
			);
			
			// 处理调用restful 接口返回的数据
			function dealData(data){
				// 获取preview
				for(var modelpath in data["data"]){
					var modeldata = data["data"][modelpath];
					var preview = modeldata["preview"];
					var previewcase = modeldata["preview_case"];
					
					if(preview!="false"){
						// 模型自身的预览图
						var previewurl = modelpath + ".preview";
						data["data"][modelpath]["previewurl"] = previewurl;
						// return data;
					}else{
						// 与模型关联的效果图的预览图
						if(previewcase["totalNum"]!=0){
							for(var refmodelpath in previewcase["data"]){
								// console.log("refmodelpath",refmodelpath);
								var previewpath = refmodelpath.substring(0,refmodelpath.lastIndexOf("/model/"));
								var previewurl = previewpath + ".image";
								data["data"][modelpath]["previewurl"] = previewurl;
								// return data;
								break;
							}
						}else{
							data["data"][modelpath]["previewurl"] = "false";
							// return data;
						}
					}
				}
				
				return data;
			}

		});
	}
	return retClass;
})