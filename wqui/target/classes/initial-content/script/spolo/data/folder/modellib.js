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
 
define("spolo/data/folder/modellib",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"spolo/data/spsession",
	"spolo/data/queryClass",	
	"spolo/data/folder"
],
function(
	declare, 
	xhr,
	spsession,
	queryClass,
	folder
)
{
	var retClass = declare("spolo.data.folder.modellib", [folder], {
		
		constructor : function()
		{
		}
		
	});	
	/**@brief : 删除云端模型库中模型
	   @callback ：成功的回调函数
	   @errorCallback : 失败的回调函数	
	*/
	retClass.remove = function(path, callback, errorCallback){
		if(!path){
			throw("there must be a 'path' parameter");
		}
		var rootpath = "/content/modellib"
		var sps = new spsession(rootpath);
		sps.removeNode(path);
		sps.save({
			success : function(){
				if(typeof callback == "function"){
					callback();
				}
			},
			failed : function(error){
				if(typeof errorCallback == "function"){
					errorCallback(error);
				}else{
					throw(error);
				}
				
			}
		});
	}
	/**@brief : 删除云端模型库中模型同时删除云端效果图中的模型
	   @callback ：成功的回调函数
	   @errorCallback : 失败的回调函数	
	*/
	retClass.removeRefs = function(srcpath, callback, errorCallback){
		if(!srcpath){
			throw("there must be a 'srcpath' parameter");
		}
		function batchRemove(pathArray){
			var sps = new spsession("/content");
			sps.removeNode(srcpath);
			if(pathArray){
				for(var path in pathArray){
					// chrome 中输出数组中hasObject
					if(path != "hasObject" && pathArray[path]){
						sps.removeNode(pathArray[path]);
					}
				}
			}
			
			sps.save({
				success : function(){
					if(typeof callback == "function"){
						callback();
						delete sps;
					}
				},
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
					
				}
			});
		}
		
		var rootPath = "/content/previewlib";
		var modelPath = srcpath;
		var args = {
			nodePath  : rootPath,
			properties:{
				modelpath : modelPath
			},
			load : function(data){
				console.log(data);
				if(typeof(data) == "object" && data["totalNum"]>0){
					var pathArray = [];
					for(var path in data["data"]){
					    console.log(path);
						pathArray.push(path);
					}
					batchRemove(pathArray);
				}
				if(typeof(data) == "object" && data["totalNum"]==0){
					batchRemove();
				}
			},	
			error : function(error){
				if(typeof(errorCallback)=="function")
					errorCallback(false);
			}
		}
		queryClass.query(args);
	}
	
	/**@brief getModellist : 获取云端模型库或者是个人模型库的模型信息
	   @param args : json 格式参数
			@code{.js}
				var args = {
					isPersonalLib : true , 				// 判断是个人模型库还是公共模型库，默认为公共
					fuzzyProperties : { // 查询条件
						term : "",					// 查询条件,(optional)
						resourceName : "",			// resourceName,(optional)
						keyInfo : "",				// keyInfo,(optional)
						introduction : "",			// introduction,(optional)
						publishAuthor : "",			// publishAuthor,(optional)
						categoryPath : "/content/modellibcategory/modelcategory/folder2013513133333706958385",   // 模型分类,(optional)
						stylePath : "/content/modellibcategory/modelstyle/folder20135131333502373311689;",		 // 风格,(optional)
						madeOfPath : "/content/modellibcategory/modelmadeof/folder2013513133476317421845",		 // 主材,(optional)
						brandPath : "/content/modellibcategory/modelbrand/folder2013513133424148489410",		 // 品牌,(optional)
						roomPath : "/content/modellibcategory/room/folder20135131332389551718669;",				 // 居室,(optional)
						sightfeelingPath : "/content/modellibcategory/sightfeeling/folder20135131333169269617307;",	// 视觉感受,(optional)
					},
					timeRangesProperties : { // 按照时间范围进行查询
						startTime:"2006-08-19T10:11:38.281+02:00",	// 起始时间
						endTime:"2017-08-19T10:11:38.281+02:00"     // 结束时间
					},
					limit : "10",// 每页个数
                    offset : "0",// 从第几页开始
                    success : function(data){},// 成功的回调函数
                    failed : function(){},//失败调用的回调函数，可以有也可以没有  					
				}
			@endcode
	**/
	retClass.getModellist = function(args){
		// 参数判断
		if(!args["success"]||typeof args["success"] != "function"){
			console.error("[modellib.getModellist ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		// 默认为公共模型库
		var isPersonalLib = args["isPersonalLib"];
		var path = "/content/modellib";
		if(isPersonalLib){
			path = "/content/users/" + Spolo.getUserId() + "/modellib";
		}
        if(args["isRoom"]){
			path = "/content/roomlib";
		}
		
		
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
		
		// 参数的获取
		var url = path + ".query2";
		var data = {};
		data["limit"] = limit;
		data["offset"] = offset;
		data["type"] = "model";
		// 模糊查询条件
		if(typeof args["fuzzyProperties"] != "undefined"){
			
			var fuzzyProperties = args["fuzzyProperties"];
            console.log(fuzzyProperties);
			
			if(typeof fuzzyProperties["term"] != "undefined"){
				var term = fuzzyProperties["term"];
				data["0_resourceName"] = term;
				data["0_keyInfo"] = term;
				data["0_introduction"] = term;
				data["0_jcr:createdBy"] = Spolo.encodeUname(term);
				data["sub"] = "1";
				// data["type"] = "model";
			}
			
			if(typeof fuzzyProperties["resourceName"] != "undefined"){
				var resourceName = fuzzyProperties["resourceName"];
				data["1_resourceName"] = resourceName;
			}
			
			
			if(typeof fuzzyProperties["keyInfo"] != "undefined"){
				var keyInfo = fuzzyProperties["keyInfo"];
				data["1_keyInfo"] = keyInfo;
			}
			
			
			if(typeof fuzzyProperties["introduction"] != "undefined"){
				var introduction = fuzzyProperties["introduction"];
				data["1_introduction"] = introduction;
			}
			
			
			if(typeof fuzzyProperties["jcr:createdBy"] != "undefined"){
				var publishAuthor = fuzzyProperties["jcr:createdBy"];
				data["1_jcr:createdBy"] = publishAuthor;
			}
			
            
			if(typeof fuzzyProperties["categoryPath"] != "undefined"){
				var categoryPath = fuzzyProperties["categoryPath"];
				data["1_categoryPath"] = categoryPath;
			}
			
			if(typeof fuzzyProperties["stylePath"] != "undefined"){
				var stylePath = fuzzyProperties["stylePath"];
				data["1_stylePath"] = stylePath;
			}
			
			if(typeof fuzzyProperties["madeOfPath"] != "undefined"){
				var madeOfPath = fuzzyProperties["madeOfPath"];
				data["1_madeOfPath"] = madeOfPath;
			}
			
			if(typeof fuzzyProperties["brandPath"] != "undefined"){
				var brandPath = fuzzyProperties["brandPath"];
				data["1_brandPath"] = brandPath;
			}
			
			if(typeof fuzzyProperties["roomPath"] != "undefined"){
				var roomPath = fuzzyProperties["roomPath"];
				data["1_roomPath"] = roomPath;
			}
			
			if(typeof fuzzyProperties["sightfeelingPath"] != "undefined"){
				var sightfeelingPath = fuzzyProperties["sightfeelingPath"];
				data["1_sightfeelingPath"] = sightfeelingPath;
			}
            
            if(typeof fuzzyProperties["areaPath"] != "undefined"){
				var areaPath = fuzzyProperties["areaPath"];
				data["1_areaPath"] = areaPath;
			}
			
		}
		// 时间范围查询条件
		if(typeof args["timeRangesProperties"] != "undefined"){
			
			var timeRangesProperties = args["timeRangesProperties"];
			
			if(typeof timeRangesProperties["startTime"] != "undefined"){
				var startTime = timeRangesProperties["startTime"];
				data["bd"] = startTime;
			}
			
			if(typeof timeRangesProperties["endTime"] != "undefined"){
				var endTime = timeRangesProperties["endTime"];
				data["ed"] = endTime;
			}
		
		}
		
		// 查询结果进行排序
		if(args["orderAsc"]){
			
			data["order"] = "asc"
			
			var orderAsc = args["orderAsc"];
			
			data["by"] = orderAsc;
			
		}else if(args["orderDesc"]){
			
			data["order"] = "des"
			
			var orderDesc  = args["orderDesc"];
		
			data["by"] = orderDesc;
			
		}else{
			// 默认按照 publishdate 进行降序排列
			data["order"] = "des";
			
			data["by"] = "jcr:created";
		}
		
		// 发送ajax 请求
        console.log(data);
		xhr(url,{
			handleAs : "json",
			method : "GET",
			query : data　　
		}).then(
			function(data){
                console.log(data);
				var data = addPreiview(data);
				args["success"](data);
			},
			function(error){
				if(args["failed"] && typeof args["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[modellib.getModellist2 ERROR]: call getModellist occurs error",error);
				return;
			}
		);
		
		function addPreiview(data){
			// 获取preview
			for(var modelpath in data["data"]){
				
				var modeldata = data["data"][modelpath];
				
				var preview_path = modelpath + ".preview";
					
				data["data"][modelpath]["preview"] = preview_path;
				
			}
			// 返回数据
			return data;
		}
	}
	
	/**@brief getModellist2 : 获取云端模型库的模型信息
	   @param args : json 格式参数
			@code{.js}
				var args = {
					fuzzyProperties : { // 查询条件
						term : "",					// 查询条件,(optional)
					},
					timeRangesProperties : { // 按照时间范围进行查询
						startTime:"2006-08-19T10:11:38.281+02:00",	// 起始时间
						endTime:"2017-08-19T10:11:38.281+02:00"     // 结束时间
					},
					limit : "10",// 每页个数
                    offset : "0",// 从第几页开始
                    success : function(data){},// 成功的回调函数
                    failed : function(){},//失败调用的回调函数，可以有也可以没有  					
				}
			@endcode
	**/
	retClass.getModellist2 = function(args){
		// 参数判断
		if(!args["success"]||typeof args["success"] != "function"){
			console.error("[modellib.getModellist2 ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
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
		
		// 参数的获取
		var url = "/content/modellib.query2";
		var data = {};
		data["limit"] = limit;
		data["offset"] = offset;
		
		// 模糊查询条件
		if(typeof args["fuzzyProperties"] != "undefined"){
			
			var fuzzyProperties = args["fuzzyProperties"];
			
			if(typeof fuzzyProperties["term"] != "undefined"){
				var term = fuzzyProperties["term"];
				data["0_resourceName"] = term;
				data["0_keyInfo"] = term;
				data["0_introduction"] = term;
				data["0_jcr:createdBy"] = Spolo.encodeUname(term);
				data["sub"] = "1";
				data["type"] = "model";
			}
			
			if(typeof fuzzyProperties["resourceName"] != "undefined"){
				var resourceName = fuzzyProperties["resourceName"];
				data["1_resourceName"] = resourceName;
			}
			
			
			if(typeof fuzzyProperties["keyInfo"] != "undefined"){
				var keyInfo = fuzzyProperties["keyInfo"];
				data["1_keyInfo"] = keyInfo;
			}
			
			
			if(typeof fuzzyProperties["introduction"] != "undefined"){
				var introduction = fuzzyProperties["introduction"];
				data["1_introduction"] = introduction;
			}
			
			
			if(typeof fuzzyProperties["jcr:createdBy"] != "undefined"){
				var publishAuthor = fuzzyProperties["jcr:createdBy"];
				data["1_jcr:createdBy"] = publishAuthor;
			}
			
			if(typeof fuzzyProperties["categoryPath"] != "undefined"){
				var categoryPath = fuzzyProperties["categoryPath"];
				data["1_categoryPath"] = categoryPath;
			}
			
			if(typeof fuzzyProperties["stylePath"] != "undefined"){
				var stylePath = fuzzyProperties["stylePath"];
				data["1_stylePath"] = stylePath;
			}
			
			if(typeof fuzzyProperties["madeOfPath"] != "undefined"){
				var madeOfPath = fuzzyProperties["madeOfPath"];
				data["1_madeOfPath"] = madeOfPath;
			}
			
			if(typeof fuzzyProperties["brandPath"] != "undefined"){
				var brandPath = fuzzyProperties["brandPath"];
				data["1_brandPath"] = brandPath;
			}
			
			if(typeof fuzzyProperties["roomPath"] != "undefined"){
				var roomPath = fuzzyProperties["roomPath"];
				data["1_roomPath"] = roomPath;
			}
			
			if(typeof fuzzyProperties["sightfeelingPath"] != "undefined"){
				var sightfeelingPath = fuzzyProperties["sightfeelingPath"];
				data["1_sightfeelingPath"] = sightfeelingPath;
			}
            
            if(typeof fuzzyProperties["areaPath"] != "undefined"){
				var areaPath = fuzzyProperties["areaPath"];
				data["1_areaPath"] = areaPath;
			}
			
		}
		// 时间范围查询条件
		if(typeof args["timeRangesProperties"] != "undefined"){
			
			var timeRangesProperties = args["timeRangesProperties"];
			
			if(typeof timeRangesProperties["startTime"] != "undefined"){
				var startTime = timeRangesProperties["startTime"];
				data["bd"] = startTime;
			}
			
			if(typeof timeRangesProperties["endTime"] != "undefined"){
				var endTime = timeRangesProperties["endTime"];
				data["ed"] = endTime;
			}
		
		}
		
		// 查询结果进行排序
		if(args["orderAsc"]){
			
			data["order"] = "asc"
			
			var orderAsc = args["orderAsc"];
			
			data["by"] = orderAsc;
			
		}else if(args["orderDesc"]){
			
			data["order"] = "des"
			
			var orderDesc  = args["orderDesc"];
		
			data["by"] = orderDesc;
			
		}else{
			// 默认按照 publishdate 进行降序排列
			data["order"] = "des";
			
			data["by"] = "jcr:created";
		}
		
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			method : "GET",
			query : data　　
		}).then(
			function(data){
				var data = addPreiview(data);
				args["success"](data);
			},
			function(error){
				if(args["failed"] && typeof args["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[modellib.getModellist2 ERROR]: call getModellist occurs error",error);
				return;
			}
		);
		
		function addPreiview(data){
			// 获取preview
			for(var modelpath in data["data"]){
				
				var modeldata = data["data"][modelpath];
				
				var preview_path = modelpath + ".preview";
					
				data["data"][modelpath]["preview"] = preview_path;
				
			}
			// 返回数据
			return data;
		}
		
	}
	
	return retClass;
})