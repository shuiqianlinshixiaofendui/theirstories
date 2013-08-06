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
 
define("spolo/data/folder/scenelib",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/spsession",
	"spolo/data/queryClass",	
	"spolo/data/folder",
	"spolo/data/scene"
],
function(
	declare, 
	xhr,
	lang,
	spsession,
	queryClass,
	folder,
	scene_cls
)
{
	// 创建Date 类型的publishdate
	function createPublishdate(path, successFunc, failedFunc){
		var url = path;
		var content = {};
		
		content["_charset_"] = "UTF-8";
		content["publishdate"] = (new Date()).toISOString();
		content["publishdate@TypeHint"] = "Date";

		xhr(url, {
			handleAs: "text",
			method: "POST",
			data: content
		}).then(
		dojo.hitch(this, function(msg) {
			// 保存成功 , 执行回调
			if (successFunc)
				successFunc(msg);
		}), 
		dojo.hitch(this, function(e) {
			if (failedFunc)
				failedFunc(e);
		})
		);
	}
	
	var retClass = declare("spolo.data.folder.scenelib", [folder], {
	
		constructor : function(path)
		{
	
		}
		
	});	
	
	/**@brief : 在jcr 资源中/content/users/userxx/scenelib 下创建一个scene
	   @param args : Json 格式的参数
		 @code{.js}
			var args = {
				sceneName ： "新场景", 
				isFileScene : 0, // 标识的是以上传文件的形式新建场景 0 或者1
				success : function(scene){}, // 成功的回调函数,scene 为scene 对象
				failed : function(){} // 失败的回调函数
			}
		 @endcode
	**/
	retClass.createScene = function(args){
		// 1. 用户是否登录
		// 2. 参数的判断
			// 2.1 参数的判断
			// 2.2 参数的获取
		// 3. jcr 中创建节点
		// 4. 根据参数判断是否带场景文件
			// 4.1 是：创建场景
			// 4.2 否：创建空场景
		// 5. 将场景对象返回
			
		// 1. 	
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[folder.createScene ERROR]:the session is failed, please login again!");
			return;
		}
		
		// 2.
		// 2.1	
		if(!args["sceneName"]){
			console.error("[folder.createScene ERROR]:args['sceneName'] is undefined!");
			return;	
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[folder.createScene ERROR]:args['success'] is undefined! or not function!");
			return;
		}
		// 2.2
		var sceneName = args["sceneName"];
		// jcr 中资源 /content/users/admin/scenelib
		var scenelibPath = "/content/users/" + userId + "/scenelib";
	
		var sceneNodeName = Spolo.CreateNodeName("scene");	

		var scenePath = scenelibPath + '/' + sceneNodeName;	
		
		var sceneJson = {
			nodePath : sceneNodeName,
			property : {
				resourceName : sceneName,
				"sling:resourceType":"scene",
				"isProcessing": "2",
				"publishAuthor": userId
			}
		};
		
		if(args["isFileScene"]){	// 如果是上传文件方式的新建场景，添加一个正在处理的标识
							// 此标识由后端Python拆分完场景之后修改为 false
							// 我的场景模块中点击场景时，如果此属性为 true，则不能打开。
			sceneJson["property"]["isProcessing"] = "0";
		}
		
		// 3.
		function createSceneNode(callback){
			
			var spss = new spsession(scenelibPath);
		
			spss.addNode(sceneJson);
			// 如果创建空场景，
			// 则默认在场景下添加 model 节点，避免获取模型列表时出现404错误。
			spss.addNode({
				nodePath: scenePath + "/model",
				property : {
					"sling:resourceType":"folder"
				}
			});
			spss.addNode({
				nodePath: scenePath + "/material",
				property : {
					"sling:resourceType":"folder"
				}
			});
			// 保存节点
			spss.save({
				success : function(){
					// 为scene 节点，创建publishdate 属性
					createPublishdate(
						scenePath,
						function(){
							callback();
						},
						function(error){
							console.error("[[folder.createScene ERROR]]:createPublishdate occurs wrong"+error);
							return;
						}
					)
					delete spss;
				},
				failed : function(error){
					if(args["failed"]&&(typeof args["failed"]=="function")){
						args["failed"](error);
						delete spss;
						return;
					}
					
					console.error("[folder.createScene ERROR]:createSceneNode is failed",error);
					delete spss;
					return;
				}
			});
			
		}
		
		createSceneNode(
			function(){
				var newScene = new scene_cls(scenePath);
				args["success"](newScene, scenePath);
			}
		);
		
	}
	
	
	/**@brief copyModelsToScene 从一个场景sceneyy copy 模型到另一个场景scenexx
	   @param args : JSON 格式参数
			@code{.js}
				var args = {
					srcpath : "/content/users/admin/scenelib/sceneyy",
					scenepath : "/content/users/admin/scenelib/scenexx",
					modelsArray : [{ID:'id1',name:'name1',referModel:'/content/modellib/modelxx',num:'3'},
									{ID:'id2',name:'name2',referModel:'/content/modellib/modelyy',num:'3'}],
					camerasArray : ['camera1','camera2'],				
					successs : function(){},// 成功的回调函数
					failed : function(){}// 失败的回调函数
				}
			@endcode
	**/
	retClass.copyModelsToScene = function(args){
		
		// 参数的判定
		if(!args["srcpath"] && args["camerasArray"]){
			console.error("[ERROR]: args['srcpath'] is undefined!");
			return;
		}
		
		if(!args["scenepath"]){
			console.error("[ERROR]:args['scenepath'] is undefined!");
			return;
		}
		
		if(!args["modelsArray"]||args["modelsArray"].length<=0){
			console.error("[ERROR]:args['modelsArray'] is undefined or null!");
			return;
		}
		
		if(!args["success"]||typeof args["success"] != "function"){
			console.error("[ERROR]:args['success'] is undefined!");
			return;
		}
		
		
		
		var scenepath = args["scenepath"];
		var modelsArray = args["modelsArray"];
		
		
		var failedFunc = function(error){
			if(args["failed"]&&typeof args["failed"]=="function"){
				args["failed"](error);
				return;
			}else{
				console.error("[ERROR]:call copyModelsToScene occurs wrong "+ error);
				return;
			}
		}
		
		// 如果需要复制CAMERA
		function getCamerasArray(callback){
		
			//if(args["camerasArray"]){
				var srcpath = args["srcpath"];
				var cameraNames = args["camerasArray"];
				var srcscene = new scene_cls(srcpath);
				srcscene.getCameras(
					function(cameras){
						var resultcameras = [];
						for(var i = 0 ; i < cameraNames.length ; i ++){
							for(var j = 0; j < cameras.length ; j ++){
								if(cameraNames[i]==cameras[j]["data"]["name"]){
									resultcameras.push(cameras[j]["data"]);
									break;
								}
							}
						}
						callback(resultcameras);
					},
					function(error){
						failedFunc(error);
					},
					true
				);
			//}
		}
		
		// 通过scenepath 获取一个scene 对象
		var destscene = new scene_cls(scenepath);
		
		// ensureItems 是为了防止新加入的items 的重名
		destscene.ensureItems(
			function(){
				// 添加模型 到缓存中
				for(var i=0;i<modelsArray.length;i++){
					var modelJson = modelsArray[i];
					var count = modelJson["count"];
					destscene.addItemsByCount(modelJson,count);
				}
				if(args["camerasArray"]){
					getCamerasArray(
						function(cameras){
							for(var i=0;i<cameras.length;i++){
								var cameraJson = cameras[i];
								destscene.createItem("CAMERA",cameraJson);
							}
							// 保存添加的摄像机以及模型
							destscene.saveItems(
								function(){
									args["success"]();
									return;
								},
								function(error){
									failedFunc(error);
									return;
								}
							
							);
							
							return;
						}
					
					);
				}else{
					// 保存添加的模型
					destscene.saveItems(
						function(){
							args["success"]();
							return;
						},
						function(error){
							failedFunc(error);
							return;
						}
					
					);
				}
				
			},
			function(error){
				failedFunc(error);
			},
			true
		);
		
	}
	
	
	/**@brief createSceneBySelfModels从自身创建子场景
	   @param args : JSON 格式参数
			@code{.js}
				var args = {
					sceneName : "子场景",
					modelsArray : [{ID:'id1',name:'name1',referModel:'/content/modellib/modelxx',num:'3'},
									{ID:'id2',name:'name2',referModel:'/content/modellib/modelyy',num:'3'}],
					successs : function(){},// 成功的回调函数
					failed : function(){}// 失败的回调函数
				}
			@endcode
	**/
	retClass.createSceneBySelfModels = function(args){
		
		var userId = Spolo.getUserId();
		
		var sceneName = args["sceneName"];
		
		var modelsArray = args["modelsArray"];
		
		//var parantPath = this.spnode.getFullpath();
		var parentScene = args["parentScene"];
		if(args["sceneName"]){
			var sceneName = args["sceneName"];
		}else{
			throw("args['sceneName'] is undefined!");
		}
		// jcr 中资源 /content/users/admin/scenelib
		var scenelibPath = "/content/users/" + userId + "/scenelib";
		// create new sceneName
		var sceneNodeName = Spolo.CreateNodeName("scene");	
		// create new scenePath in jcr 
		var scenePath = scenelibPath + '/' + sceneNodeName;	
		//var publishdate = new Date().toString().replace("中国标准时间","CST");
		var sceneJson = {
			nodePath : sceneNodeName,
			property : {
				resourceName : sceneName,
				"sling:resourceType":"scene",
				//"isProcessing": "2"
				"isProcessing": "2",
				//"publishdate": publishdate,
				"publishAuthor": userId,
				"parentScene":parentScene
			}
		};
		
		var spss = new spsession(scenelibPath);
		
		spss.addNode(sceneJson);
		// 如果创建空场景，
		// 则默认在场景下添加 model 节点，避免获取模型列表时出现404错误。
		spss.addNode({
			nodePath: scenePath + "/model",
			property : {
				"sling:resourceType":"folder"
			}
		});
		spss.addNode({
			nodePath: scenePath + "/material",
			property : {
				"sling:resourceType":"folder"
			}
		});
	
		// save spss.addNode operate.
		var sucFuc = lang.hitch(this,function(){
			if(args["success"]&&(typeof args["success"]=="function")){
				lang.hitch(this,
					createPublishdate(
						scenePath,
						function(){
							// create scene object
							var newScene = new scene_cls(scenePath);
							
							// 创建一个空场景
							newScene.createEmptyScene(
								function(suc){
									// 向空场景中添加模型
									
									for(var i=0;i<modelsArray.length;i++){
										var modelJson = modelsArray[i];
										var count = modelJson["count"];
										newScene.addItemsByCount(modelJson,count);
									}
									
									// 保存添加的模型
									newScene.saveItems(
										function(suc){
											args["success"]();
										},
										function(error){
											errFuc(error);
										}
									);
								},
								function(error){
									throw(error);
								}
							);
							
							delete spss;
						},
						function(){
							console.error("[ERROR]:createPublishdate occurs wrong"+error);
							return;
						}
					)
				);
				
			}else{
				console.error("[ERROR]:args['success'] is undefined!");
				return;
			}
		});
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"]=="function")){
				args["failed"](error);
			}else{
				throw(error + "create newScene is failed");
			}
		}
		
		spss.save({
			success : sucFuc,
			failed : errFuc
		});
		
	}
	
	
	/**@brief : 通过path 获取某一个scene 的status
	   @param args : Json 格式的参数
		 @code{.js}
			var args = {
				path : /content/users/admin/scenelib/scenexx ,
				success : function(){}, // 成功的回调函数
				failed : function(){} // 失败的回调函数
			}
		 @endcode
	**/
	retClass.getSceneStatus = function(args){
		// 检查参数合法
		if(typeof args != "object"){
			return;
		}
		
		if(args["path"]){
			var path = args["path"];
		}else{
			throw("there must be a 'path' paramter in arguments!");
		}
		
		// 拼接请求路径	
		var url = path + ".getStatus";
		
		var sucFuc = function(scenestate){
			if(args["success"]&&(typeof args["success"] == "function")){
				args["success"](scenestate);
			}else{
				throw("there must be a 'success' parameter in arguments!");
			}
		}
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"] == "function")){
				args["failed"](error);
			}else{
				throw(error);
			}
		}
		// 发送ajax 请求
		xhr(url,{
			handleAs:"json",
			method : "GET"
		}).then(
			function(scenestate){								
				sucFuc(scenestate);
			},	
			function(error){
				errFuc(error);
			}
		);	
	}
		
	/**@brief : 通过query 获取某一个用户下的scenelib 下的场景的状态
	   @param args : Json 格式的参数
		 @code{.js}
			var args = {
				offset : 0, // 偏移量
				limit : 10, // 限制量
				success : function(){}, // 成功的回调函数
				failed : function(){} // 失败的回调函数
			}
		 @endcode
	**/
	retClass.getScenesStatusByQuery = function(args){
		
		//1. 判断参数是否合法
		if(args["offset"]!=undefined && 
			args["limit"]!=undefined ){
			var offset = args["offset"];
			var limit = args["limit"];	
		}else{
			throw("there must be a 'offset' and 'limit' parameter in arguments!");
		}
		
		
		//2.1 拼接请求路径
		var path = "/content/users/" + Spolo.getUserId() + "/scenelib";		
		var url =  path + ".getSceneStatus";
		
		//2.2 请求数据
		var data = {};
		data["offset"] = offset;
		data["limit"] = limit;
		
		var sucFuc = function(scenestate){
			if(args["success"]&&(typeof args["success"] == "function")){
				args["success"](scenestate);
			}else{
				throw("there must be a 'success' parameter in arguments!");
			}
		}
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"] == "function")){
				args["failed"](error);
			}else{
				throw(error);
			}
		}
		
		//3. 发送ajax 请求
		xhr(url,{
			handleAs:"json",
			method : "GET",
			query:data
		}).then(
			function(scenestate){
				sucFuc(scenestate);
			},	
			function(error){
				errFuc(error);
			}
		);
	}
	
	/**@brief : 通过queryClass 获取某一个用户下的scenelib 下的所有场景
	   @param args : Json 格式的参数
		 @code{.js}
			var args = {
				offset : 0, // 偏移量
				limit : 10, // 限制量
				orderDesc : "jcr:created", //(optional)默认为"jcr:created"
				success : function(data["data"],data["totalNum"]){}, // 成功的回调函数
				failed : function(){} // 失败的回调函数
			}
		 @endcode
	**/
	retClass.getScenesByQuery = function(args){
		
		//1. 判断参数是否合法
		if(typeof args != "object"){
			return;
		}
		
		//2. queryClass 类中的参数赋值
		var scenelibPath = "/content/users/" + Spolo.getUserId() + "/scenelib";	
		var expression = "/jcr:root" + scenelibPath + "/*[jcr:contains(@sling:resourceType,'scene')]";
		if(args["offset"]!=undefined && 
			args["limit"]!=undefined ){
			var offset = args["offset"];
			var limit = args["limit"];	
		}else{
			console.error("[ERROR]there must be a 'offset' and 'limit' parameter in arguments!");
			return;
		}
		
		var loadFuc = function(data){
			if(typeof(data) == "object" && data["totalNum"]>=0){
				// 获取场景的总数
				var totalNum = data["totalNum"];
				if(args["success"]&&(typeof args["success"] == "function")){
					args["success"](data["data"], totalNum);
					return;
				}else{
					console.error("[INFO]there must be a 'success' parameter in arguments!");
					return;
				}
			}
			
		}
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"] == "function")){
				args["failed"](error);
				return;
			}else{
				//throw(error);
				console.error("[ERROR]:call getScenesByQuery occurs wrong" + error);
				return;
			}
		}
		
		var queryArgs = {
			// "nodePath" : scenelibPath,
			// "properties" : {
				// "sling:resourceType":"scene"
			// },
			// "orderDesc" : orderDesc,
			"expression" : expression,
			"limit" : limit,  
			"offset" : offset,
			"load" : loadFuc,
			"error" : errFuc
		}
		// 拼接查询条件 降序或者升序
		if( args["orderAsc"]!=undefined&& args["orderDesc"]!=undefined){
			console.error("[ERROR]: args['orderAsc'] and args['orderDesc'] must't exist at one time!");
			return;
		}else if( args["orderAsc"]!=undefined&& args["orderDesc"]==undefined){
			var orderAsc = args["orderAsc"];
			queryArgs["orderAsc"] = orderAsc;
		}else if( args["orderAsc"]==undefined && args["orderDesc"]!=undefined){
			var orderDesc = args["orderDesc"];
			queryArgs["orderDesc"] = orderDesc;
		}else{
			queryArgs["orderDesc"] = "jcr:created"
		}
		//3. 执行queryClass 中的query  方法
		queryClass.executeXpath(queryArgs);
	}
	
	/**@brief searchforScenes : 在我的场景中进行场景的搜索
	   @param args :　JSON 格式的参数
			@code{.js}
				var args = {
					fuzzyProperties : { // 查询条件 , 可以有也可以没有
						resourceName : ""
					},
					timeRangesProperties : { // 按照时间范围进行查询 , 可以有也可以没有
						startTime:{"jcr:created" : "2006-08-19T10:11:38.281+08:00"},
						endTime:{"jcr:created" : "2017-08-19T10:11:38.281+08:00"}
					},
					limit : "10",// 每页个数
                    offset : "0",// 从第几页开始
					orderDesc ："publishdate", // 按条件进行降序,同orderAsc 不能同时存在 
					orderAsc ： "publishdate", // 按条件进行升序,同orderDesc 不能同时存在
                    success : function(data){},// 成功的回调函数
                    failed : function(){},//失败调用的回调函数，可以有也可以没有  	
				}
			@endcode
	**/
	retClass.searchforScenes = function(args){
		// 参数判断
		if( args["limit"]==undefined ||
			args["offset"]==undefined ||
			args["success"]==undefined ){
			console.error("args['type']  or args['limit'] or args['offset'] is undefined!");
			return;
		}
		// 为queryClass 的查询条件预备	
		var nodePath = "/content/users/" + Spolo.getUserId() + "/scenelib";
		// var expression = "/jcr:root" + nodePath + "/*";
		
		var limit = args["limit"];
		var offset = args["offset"];
		if(args["fuzzyProperties"]){
			var fuzzyProperties = args["fuzzyProperties"];
		}else{
			var fuzzyProperties = {};
		}
		
		var type = "scene";
		
		if(args["orderAsc"]&&args["orderDesc"]){
			console.error("[ERROR]:args['orderAsc'] and args['orderDesc'] is't exist at one time!");
			return;
		}
		
		// 查询条件组装
		var baseQueryArgs = {
			"nodePath"  : nodePath,
			"isLocal" : true,
			"fuzzyProperties" : fuzzyProperties,
			"offset" : offset,
			"limit" : limit,
			"error" : function(error){
				if(args["failed"]&&typeof args["failed"]=="function"){
					args["failed"](error);
					return;
				}else{
					//throw(error);
					console.error("[ERROR]:failed to getScenesByQuery!");
					return;
				}
			}
		}
		
		if(args["orderAsc"]){
			var orderAsc = args["orderAsc"];
			baseQueryArgs["orderAsc"] = orderAsc;
		}else if(args["orderDesc"]){
			var orderDesc  = args["orderDesc"];
			baseQueryArgs["orderDesc"] = orderDesc;
		}else{
			// 默认按照 publishdate 进行降序排列
			baseQueryArgs["orderDesc"] = "publishdate";
		}
		
		// baseQueryArgs["fuzzyProperties"]["sling:resourceType"] = type;
		baseQueryArgs["expression"] += "[jcr:contains(@sling:resourceType,\""+ type +"\")]";
		if(args["keywordProperties"]){
			var keywordProperties = args["keywordProperties"];
			baseQueryArgs["keywordProperties"] = keywordProperties;
		}
		// 时间范围参数的获取
		if(args["timeRangesProperties"]){
			var timeRangesProperties = args["timeRangesProperties"];
			baseQueryArgs["timeRangesProperties"] = timeRangesProperties;
		}
		// 0. search 中没有输入查询条件
		if(baseQueryArgs["fuzzyProperties"]["resourceName"]==undefined){
			baseQueryArgs["load"] = function(data){
				if(typeof(data) == "object" && data["totalNum"]>=0){
					if(args["success"]&&typeof args["success"]=="function"){
						args["success"](data);
					}else{
						console.error("[ERROR] :args['success'] is not undefined!");
						return;
					}
					
				}
			}
			queryClass.query(baseQueryArgs);
			return;
		}
		
		
		var resourceName = baseQueryArgs["fuzzyProperties"]["resourceName"];
		delete baseQueryArgs["fuzzyProperties"]["resourceName"];
		baseQueryArgs["keywordProperties"] = {};
		// 处理查询成功的data，将数据已数组形式返回
		function conditionMatch(data, type, resourceName){
			var conditionArray = [];
			for(var _data in data["data"]){
				var _data_type = data["data"][_data][type];
				
				if(_data_type.indexOf(resourceName)==0){
					conditionArray.push(_data_type);
				}
			}
			var cleanArray = cleanFilterValues(conditionArray);
			return cleanArray;
		}
		
		// 处理查询成功的data，将数组中相同的数据进行过滤
		function cleanFilterValues(values) {
			var unique = {};
			//get rid of duplicates
			return dojo.filter(values, function(value) {
				if (!unique[value]) {
					unique[value] = true;
					return true;
				}
			return false;
		  }).sort();
		} 
		
		// 1. 按resourceName 进行查询
		var argsResourceName = lang.clone(baseQueryArgs);
		argsResourceName["keywordProperties"]["resourceName"] = resourceName;
		argsResourceName["load"] = function(data){
			//console.log(data);
			if(typeof(data) == "object" && data["totalNum"]>=0){
				if(args["success"]&&typeof args["success"]=="function"){
					var _conditionArray = conditionMatch(data, "resourceName", resourceName);
					console.log(data);
					console.log(_conditionArray);
					args["success"](data, _conditionArray);
					return;
				}else{
					console.error("[ERROR]:args['success'] is not undefined!");
					return;
				}
				
			}
		}
		// 执行查询
		queryClass.query(argsResourceName);	
	}
	
	/**@brief  getSubScenesByQuery: 获取所有子场景
	   @param args : Json 格式的参数
	   @code{.js}
			var args = {
				offset : 0, // 偏移量
				limit : 10, // 限制量
				orderDesc : "jcr:created", //(optional)默认为"jcr:created"
				success : function(data["data"],data["totalNum"]){}, // 成功的回调函数
				failed : function(){} // 失败的回调函数
			}
	    @endcode
	**/
	retClass.getSubScenesByQuery = function(args){
		//1. 判断参数是否合法
		if(typeof args != "object"){
			return;
		}
		
		//2. queryClass 类中的参数赋值
		var scenelibPath = "/content/users/" + Spolo.getUserId() + "/scenelib";	
		
		if(args["offset"]!=undefined && 
			args["limit"]!=undefined ){
			var offset = args["offset"];
			var limit = args["limit"];	
		}else{
			console.error("[ERROR]there must be a 'offset' and 'limit' parameter in arguments!");
			return;
		}
		
		var loadFuc = function(data){
			if(typeof(data) == "object" && data["totalNum"]>=0){
				// 获取场景的总数
				var totalNum = data["totalNum"];
				if(args["success"]&&(typeof args["success"] == "function")){
					args["success"](data["data"], totalNum);
					return;
				}else{
					console.error("[INFO]there must be a 'success' parameter in arguments!");
					return;
				}
			}
			
		}
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"] == "function")){
				args["failed"](error);
				return;
			}else{
				//throw(error);
				console.error("[ERROR]:call getSubScenesByQuery occurs wrong" + error);
				return;
			}
		}
		
		var queryArgs = {
			"nodePath" : scenelibPath,
			"properties" : {
				"sling:resourceType":"scene"
			},
			"fuzzyProperties" : {
				"parentScene":"scene"
			},
			//"orderDesc" : orderDesc,
			"limit" : limit,  
			"offset" : offset,
			load : loadFuc,
			error : errFuc
		}
		// 拼接查询条件 降序或者升序
		if( args["orderAsc"]!=undefined&& args["orderDesc"]!=undefined){
			console.error("[ERROR]: args['orderAsc'] and args['orderDesc'] must't exist at one time!");
			return;
		}else if( args["orderAsc"]!=undefined&& args["orderDesc"]==undefined){
			var orderAsc = args["orderAsc"];
			queryArgs["orderAsc"] = orderAsc;
		}else if( args["orderAsc"]==undefined && args["orderDesc"]!=undefined){
			var orderDesc = args["orderDesc"];
			queryArgs["orderDesc"] = orderDesc;
		}else{
			queryArgs["orderDesc"] = "jcr:created"
		}
		//3. 执行queryClass 中的query  方法
		queryClass.query(queryArgs);
	
	}
	
	/**@brief getSubScenesFromScene:获取当前场景的子场景
	   @param args : Json 格式的参数
	   @code{.js}
			var args = {
				parentScene : "/content/users/admin/scenelib/scenexxx", // 当前场景全路径
				offset : 0, // 偏移量
				limit : 10, // 限制量
				orderDesc : "jcr:created", //(optional)默认为"jcr:created"
				success : function(data["data"],data["totalNum"]){}, // 成功的回调函数
				failed : function(){} // 失败的回调函数
			}
		@endcode
	**/
	retClass.getSubScenesFromScene = function(args){
		//1. 判断参数是否合法
		if(typeof args != "object"){
			return;
		}
		
		//2. queryClass 类中的参数赋值
		var scenelibPath = "/content/users/" + Spolo.getUserId() + "/scenelib";	
		
		if(args["offset"]!=undefined && 
			args["limit"]!=undefined ){
			var offset = args["offset"];
			var limit = args["limit"];	
		}else{
			console.error("[ERROR]there must be a 'offset' and 'limit' parameter in arguments!");
			return;
		}
		
		if(!args["parentScene"]){
			console.error("[ERROR]: parentScene is undefined!");
			return;
		}else{
			var parentScene = args["parentScene"];
		}
		
		
		var loadFuc = function(data){
			if(typeof(data) == "object" && data["totalNum"]>=0){
				// 获取场景的总数
				var totalNum = data["totalNum"];
				if(args["success"]&&(typeof args["success"] == "function")){
					args["success"](data["data"], totalNum);
					return;
				}else{
					console.error("[INFO]there must be a 'success' parameter in arguments!");
					return;
				}
			}
			
		}
		
		var errFuc = function(error){
			if(args["failed"]&&(typeof args["failed"] == "function")){
				args["failed"](error);
				return;
			}else{
				//throw(error);
				console.error("[ERROR]:call getSubScenesFromScene occurs wrong" + error);
				return;
			}
		}
		
		var queryArgs = {
			"nodePath" : scenelibPath,
			"properties" : {
				"sling:resourceType":"scene",
				"parentScene":parentScene
			},
			//"orderDesc" : orderDesc,
			"limit" : limit,  
			"offset" : offset,
			load : loadFuc,
			error : errFuc
		}
		// 拼接查询条件 降序或者升序
		if( args["orderAsc"]!=undefined&& args["orderDesc"]!=undefined){
			console.error("[ERROR]: args['orderAsc'] and args['orderDesc'] must't exist at one time!");
			return;
		}else if( args["orderAsc"]!=undefined&& args["orderDesc"]==undefined){
			var orderAsc = args["orderAsc"];
			queryArgs["orderAsc"] = orderAsc;
		}else if( args["orderAsc"]==undefined && args["orderDesc"]!=undefined){
			var orderDesc = args["orderDesc"];
			queryArgs["orderDesc"] = orderDesc;
		}else{
			queryArgs["orderDesc"] = "jcr:created"
		}
		//3. 执行queryClass 中的query  方法
		queryClass.query(queryArgs);
	}
	
	return retClass;
})