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
define("spolo/data/folder",
[
	"dojo/_base/declare", 
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/spobject",
	"spolo/data/spsession",
	"spolo/data/queryClass"
],
function(
	declare, 
	xhr,
	lang,
	spobject,
	spsession,
	queryClass
)
 {
	/**
	*	folder模块
	*/
	var retClass = dojo.declare("spolo/data/folder", [spobject], {
		
		/**
		*	构造函数，构造函数获取json对象
		*/
		constructor : function(path){
			this.children = [];
			this._path = path;
			this.parent = null;
		},
		
		/**
			获得根节点。
		*/
		getRoot : function(onItem, onError){
			var _this = this;
			this.spnode.ensureData({
				success : function(){
					onItem(_this);
				},
				failed : function(error){
					onError(error);
				},
			});
		},
		
		/**
			判断当前资源节点是否为一个目录
			也可以理解为判断当前资源节点下是否有子节点
		*/
		mayHaveChildren : function()
		{
			var flag = false;
			var type = this.getPrimaryType();
			if(type == "sling:Folder" || type == "nt:folder")
			{
				flag = true;
			}
			return flag;
		},
		
		getRadio : function(){
			this.checkDataIsValid();
			var isradio = undefined;
			isradio = this.getNode().getProperty("isradio");
			return isradio;
		},
		
		setRadio : function(bool){
			this.getNode().setProperty("isradio",bool);
		},
		
		/**
			重命名。
		*/
		rename : function(resName, onComplete, onError)
		{
			this.setName(resName);
			this.spnode.save({
				existNodeReplace : false,	// 是否覆盖已经存在的节点；添加节点的时候用到。
				success : function(){
					// console.log("success save spnode.setName");
					onComplete();
				},
				failed : function(error){
					// console.log("failed save spnode.setName");
					onError(error);
				},
				saving : function(){
					// console.log("saving save spnode.setName");
				}
			});
		},
		
		/**
			以数组存储方式获取当前节点下的全部子节点。
		*/
		getChildren : function(onComplete, onError)
		{
			//// console.log(this._path)
			
			var oldPath = this._path;
			var _this = this;
			this.spnode.ensureData({
				success : function(spnode){
					var arrayArgs = spnode.getNodes();
					// // console.log(arrayArgs);
					var children = [];
					
					
					if(!_this.children.length)
					{
						for(var index = 0; index < arrayArgs.length; index ++)
						{
							var childFolder = new retClass("","",arrayArgs[index]);
							var name = childFolder.getName();
							if(name != "rep:policy"){
								childFolder.parent = _this;
								children.push(childFolder);
							}
						}
						_this.children = children;
					}
					
					onComplete(_this.children);
				},
				failed : function(error){
					onError(error);
				}
			});
		},
		
		/**
			以JSON存储方式获取当前节点下的全部子节点。
		*/
		getChildJSON : function(onComplete, onError)
		{
			var oldPath = this._path;
			var _this = this;
			this.spnode.ensureData({
				success : function(spnode){
					var jsonArgs = spnode.getNodesJson();
					// // console.log(jsonArgs);
					onComplete(jsonArgs);
				},
				failed : function(error){
					onError(error);
				}
			});
		},
		
		/**
		* create
		*/
		create : function(json, onSuccess, onError)
		{
			// var json = {
				// resourceName : ,
				// jcr:primaryType : 
			// }
			var oldPath = this._path;
			var _this = this;
			
			// var spnode = this.spsession.getRootNode();
			
			if(json["jcr:primaryType"] == undefined)
			{
				json["jcr:primaryType"] = "sling:Folder";
			}
			
			var folderNodeName = Spolo.CreateNodeName("folder");
			
			var resNode = _this.spnode.addNode({
				nodePath : folderNodeName,
				property : json
			});
			
			_this.spnode.save({
				existNodeReplace : false,	// 是否覆盖已经存在的节点；添加节点的时候用到。
				success : function(){
					// console.log("success save spnode.addNode");
					var childFolder = new retClass("", "", resNode);
					childFolder.parent = _this;
					_this.children.push(childFolder);
					onSuccess(childFolder);
				},
				failed : function(){
					// console.log("failed save spnode.addNode");
					onError();
				},
				saving : function(){
					// console.log("saving save spnode.addNode");
				}
			});
		},
		
		/**
			删除当前节点。
		*/
		remove : function(onSuccess, onError)
		{
			// this.spsession.removeNode("");
			this.spnode.removeNode();
			var _this = this;
			this.spnode.save({
				success : function(){
					var list = _this.parent.children;
					for(var index = 0; index < list.length; index++)
					{
						if(list[index] == _this)
						{
							// console.log("success remove this.spnode.removeNode :"+list[index].getName());
							list.splice(index, 1);
							delete _this;
						}
					}
					onSuccess();
				},
				failed : function(){
					// console.log("failed remove this.spnode.removeNode");
					onError();
				},
				saving : function(){
					// console.log("removing this.spnode.removeNode");
				}
			});
		},
		
		/** @brief 支持批量删除
			@param pathArray : 传入的path 数组
			@param sucFun ： (optional)成功调用的回调函数	
			@param failedFun ： (optional)失败调用的回调函数
			@param savingFun ： (optional)正在保存调用的回调函数
		**/
		batchRemove : function(pathArray, sucFun, failedFun, savingFun){
			
			for(var path in pathArray){
				// chrome 中输出数组中hasObject
				if(path != "hasObject" && pathArray[path]){
					this.spsession.removeNode(pathArray[path]);
				}
			}
			
			this.spsession.save({
				success : function(){
					if(typeof sucFun == "function"){
					    //console.log("");
						//console.log("success");
						sucFun();
					}
				},
				failed : function(error){
					if(typeof failedFun == "function"){
						//console.log("");
						//console.log("failed");
						failedFun(error);
					}
					
				},
				saving : function(){
					if(typeof savingFun == "function"){
						//console.log("");
						//console.log("saving");
						savingFun();
					}
					
				}
			});
		}
		
	});
	
	/**@brief searchforLibs 实现根据resourceName 进行查询
	   @param args : json 格式参数
			@code{.js}
				var args = {
					nodePath : "", // 1./content/modellib 2. /content/previewlib
					fuzzyProperties : { // 查询条件
						resourceName : "",
						madeOfPath : "/content/categorylib/biaoqiang"
					},
					timeRangesProperties : { // 按照时间范围进行查询
						startTime:{"jcr:created" : "2006-08-19T10:11:38.281+02:00"},
						endTime:{"jcr:created" : "2017-08-19T10:11:38.281+02:00"}
					},
					limit : "10",// 每页个数
                    offset : "0",// 从第几页开始
                    success : function(data){},// 成功的回调函数
                    failed : function(){},//失败调用的回调函数，可以有也可以没有  					
				}
			@endcode
	**/
	retClass.searchforLibs = function(args){
	    //do{
			// 参数判定
			if( args["nodePath"]==undefined ||
				args["fuzzyProperties"]==undefined ||
				args["limit"]==undefined ||
				args["offset"]==undefined ||
				args["success"]==undefined ){
				
				console.error("args['nodePath'] or args['type'] or args['fuzzyProperties'] or args['limit'] or args['offset'] is undefined!");
				return;
			}
				
			var nodePath = args["nodePath"];
			var limit = args["limit"];
			var offset = args["offset"];
			if(args["fuzzyProperties"]){
				var fuzzyProperties = args["fuzzyProperties"];
			}else{
				var fuzzyProperties = {};
			}
			
			console.log(nodePath);
            if(nodePath.indexOf("modellib")>=0){
				var type = "model";
			}else if(nodePath.indexOf("previewlib")>=0){
				var type = "folder";
			}else if(nodePath.indexOf("roomlib")>=0){
				var type = "model";
			}else{
				console.error("Now, search is only for modellib and previewlib resource!");
				return;
			}
			
			if(args["orderAsc"]&&args["orderDesc"]){
				console.error("[ERROR]:args['orderAsc'] and args['orderDesc'] is't exist at one time!");
				return;
			}
			
			// 查询条件组装
			var baseQueryArgs = {
				nodePath  : nodePath,
				fuzzyProperties : fuzzyProperties,
				//keywordProperties : keywordProperties,
				//orderDesc: "jcr:created",
				//orderDesc: "publishdate",
				offset:offset,
				limit:limit,
				error : function(error){
					if(args["failed"]&&typeof args["failed"]=="function"){
						args["failed"](error);
					}else{
						//throw(error);
						console.error("[ERROR]:failed to searchforLibs!");
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
				// 默认按照 jcr:created 进行降序排列
				baseQueryArgs["orderDesc"] = "jcr:created";
			}
			baseQueryArgs["fuzzyProperties"]["sling:resourceType"] = type;
			if(args["keywordProperties"]){
				var keywordProperties = args["keywordProperties"];
				baseQueryArgs["keywordProperties"] = keywordProperties;
			}
			// 添加按publishAuthor 进行搜索
			if(baseQueryArgs["fuzzyProperties"]["jcr:createdBy"]){
                console.log(baseQueryArgs["fuzzyProperties"]["jcr:createdBy"]);
				var publishAuthor = baseQueryArgs["fuzzyProperties"]["jcr:createdBy"];
				baseQueryArgs["fuzzyProperties"]["jcr:createdBy"] = Spolo.encodeUname(publishAuthor);
			}
			
			// 时间范围参数的获取
			if(args["timeRangesProperties"]){
				var timeRangesProperties = args["timeRangesProperties"];
				baseQueryArgs["timeRangesProperties"] = timeRangesProperties;
			}
			// 0. search 中没有输入查询条件
			//if(!baseQueryArgs["keywordProperties"]){
			if(baseQueryArgs["fuzzyProperties"]["resourceName"]==undefined){
				baseQueryArgs["load"] = function(data){
					if(typeof(data) == "object" && data["totalNum"]>=0){
						if(args["success"]&&typeof args["success"]=="function"){
							args["success"](data);
							return;
						}else{
							console.error("[ERROR]:args['success'] is not undefined!");
							return;
						}
						
					}
				}
				queryClass.query(baseQueryArgs);
				return;
			}
			
			
			//var resourceName = baseQueryArgs["keywordProperties"]["resourceName"];
			//delete baseQueryArgs["keywordProperties"]["resourceName"];
			var resourceName = baseQueryArgs["fuzzyProperties"]["resourceName"];
			delete baseQueryArgs["fuzzyProperties"]["resourceName"];
			baseQueryArgs["keywordProperties"] = {};
			// 处理查询成功的data，将数据已数组形式返回
			function conditionMatch(data, type, resourceName){
				var conditionArray = [];
				for(var _data in data["data"]){
					var _data_type = data["data"][_data][type];
					
					// 判断如果是publishAuthor 需要进行编码
					if(type=="publishAuthor"&&_data_type.indexOf(resourceName)==0){
						_data_type = Spolo.decodeUname(_data_type);
						conditionArray.push(_data_type);
						continue;
					}
					
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
			// 4. 按publishAuthor 进行查询 	
			var argsAuthor = lang.clone(baseQueryArgs);
			// 在这里需要将用户名进行编码
			var publishAuthor = resourceName;
			publishAuthor = Spolo.encodeUname(publishAuthor);
			argsAuthor["keywordProperties"]["publishAuthor"] = publishAuthor;
			argsAuthor["load"] = function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]>=0){
					if(args["success"]&&typeof args["success"]=="function"){
						var _conditionArray = conditionMatch(data, "publishAuthor",publishAuthor);
						console.log(data);
						console.log(_conditionArray);
						args["success"](data, _conditionArray);
						return;
					}
					console.error("[ERROR]:args['success'] is not undefined!");
					return;
					
					
				}
			}
			// 3. 按introduction 进行查询
			var argsIntroduction = lang.clone(baseQueryArgs);
			argsIntroduction["keywordProperties"]["introduction"] = resourceName;
			argsIntroduction["load"] = function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]==0){
					queryClass.query(argsAuthor);
					return;
				}
				if(typeof(data) == "object" && data["totalNum"]>0){
					if(args["success"]&&typeof args["success"]=="function"){
						var _conditionArray = conditionMatch(data, "introduction", resourceName);
						console.log(data);
						console.log(_conditionArray);
						args["success"](data, _conditionArray);
						return;
					}
						
					console.error("[ERROR]:args['success'] is not undefined!");
					return;
					
				}
			}
			// 2. 按keyInfo 进行查询
			var argsKeyInfo = lang.clone(baseQueryArgs);
			argsKeyInfo["keywordProperties"]["keyInfo"] = resourceName;
			argsKeyInfo["load"] = function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]==0){
					queryClass.query(argsIntroduction);
					return;
				}
				if(typeof(data) == "object" && data["totalNum"]>0){
					if(args["success"]&&typeof args["success"]=="function"){
						var _conditionArray = conditionMatch(data, "keyInfo", resourceName);
						console.log(data);
						console.log(_conditionArray);
						args["success"](data,_conditionArray);
						return;
					}
					
					console.error("[ERROR]:args['success'] is not undefined!");
					return;
					
					
				}
			}
			
			// 1. 按resourceName 进行查询
			var argsResourceName = lang.clone(baseQueryArgs);
			argsResourceName["keywordProperties"]["resourceName"] = resourceName;
			argsResourceName["load"] = function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]==0){
					queryClass.query(argsKeyInfo);
					return;
				}
				if(typeof(data) == "object" && data["totalNum"]>0){
					if(args["success"]&&typeof args["success"]=="function"){
						var _conditionArray = conditionMatch(data, "resourceName", resourceName);
						console.log(data);
						console.log(_conditionArray);
						args["success"](data, _conditionArray);
						return;
					}
					
					console.error("[ERROR]:args['success'] is not undefined!");
					return;
					
				}
			}
			// 执行查询
			queryClass.query(argsResourceName);
		//}while(false);
	}
	
	/**@brief publicLibSort 实现根据resourceName 进行查询
	   @param args : json 格式参数
			@code{.js}
				var args = {
					nodePath : "", // 1./content/modellib 2. /content/previewlib
					resoucreName : "",// 查询条件
					limit : "10",// 每页个数
                    offset : "0",// 从第几页开始
					orderAsc : "",// 升序排序 同降序二选一
					orderDesc : "", // 降序排序 同升序二选一
                    success : function(data){},// 成功的回调函数
                    failed : function(){},//失败调用的回调函数，可以有也可以没有  					
				}
			@endcode
	**/
	retClass.publicLibSort = function(args){
		// 判断参数是否正确
		if( args["nodePath"]==undefined ||
			args["resourceName"]==undefined ||
			args["limit"]==undefined ||
			args["offset"]==undefined ||
			args["success"]==undefined ){
			
			throw("args['nodePath'] or args['type'] or args['resoucreName'] or args['limit'] or args['offset'] is undefined!");
		}
		
		var nodePath = args["nodePath"];
		var resourceName = args["resourceName"];
		var limit = args["limit"];
		var offset = args["offset"];
		
		// 区分是查询 公共模型库 还是公共效果图
		if(nodePath.indexOf("modellib")>=0){
			var type = "model";
		}else if(nodePath.indexOf("previewlib")>=0){
			var type = "folder";
		}else{
			throw("Now, search is only for modellib and previewlib resource!");
		}
		// 成功的函数
		var loadFuc = function(data){
			//console.log(data);
			if(typeof(data) == "object" && data["totalNum"]>=0){
				if(args["success"]&&typeof args["success"]=="function"){
					args["success"](data);
				}else{
					throw("args['success'] is not undefined!");
				}
				
			}
		}
		// 失败的函数
		var errFuc = function(error){
			
			if(args["failed"]&&typeof args["failed"]=="function"){
				args["failed"](error);
			}else{
				throw(error);
			}
		}
		// queryClass 需要的参数拼接
		var queryArgs = {
			nodePath  : nodePath,
			fuzzyProperties : {
				"resourceName" : resourceName,
				"sling:resourceType" : type
			},
			offset:offset,
			limit:limit,
			load : loadFuc,
			error : errFuc
		}
		// 拼接查询条件 降序或者升序
		if( args["orderAsc"]!=undefined&& args["orderDesc"]==undefined){
			var orderAsc = args["orderAsc"];
			queryArgs["orderAsc"] = orderAsc;
		}else if( args["orderAsc"]==undefined && args["orderDesc"]!=undefined){
			var orderDesc = args["orderDesc"];
			queryArgs["orderDesc"] = orderDesc;
		}
		// 执行查询
		queryClass.query(queryArgs);
	
	}
	
	
	/** @brief 发布效果图或者是发布模型
		@param type : preview 发布效果图,TODO:model 发布模型
	    @param args: JSON 格式, 在这里出入一个JSON, 其中isPublishModel 可选
			@code{.js}
				var args = {
					path : "/content/users/admin/previewlib/scenexx/xxxx",
					targetPath : "/content/modelib/modelxxx",
					isPublishModel : "True",// 默认为"False"
					success : function(){},
					failed : function(){}
				}
			@endcode		
    **/
	retClass.publish = function(type, args){
		var url;
		// 发布效果图 
		// 如果包含发布模型，则效果图和模型都是发布到公共的模型库和公共效果图
		if(type == "preview"){
			if(!args["path"]){
				throw("there must be a 'path' parameter in args!");
			}
			var path = args["path"];
			if(!args["isPublishModel"]){
				var isPublishModel = "False";
			}else{
				var	isPublishModel = args["isPublishModel"];
			}
			url = path + ".publishPreview?isPublishModel=" + isPublishModel;
			
		}
		// 发布模型，则有选择是发布到公共模型库还是个人模型库
		if(type == "model"){
		    if(!args["path"]){
				throw("there must be a 'path' parameter in args!");
			}
			var path = args["path"];
			if(!args["targetPath"]){
				throw("there must be a 'targetPath' parameter in args!");
			}
			var targetPath = args["targetPath"];
			url = path + ".publish" + targetPath +"/" + Spolo.CreateNodeName("model"); 
						
		}
		
		xhr(url, {
			handleAs : "text",
			method : "GET"
		}).then(
			function(suc){
				if(type == "preview"){
					if(args["success"]&&typeof args["success"] == "function"){
						args["success"](suc);
					}else{
						throw("there must be a success parameter in args!");
					}
				}
				if(type == "model"){
					// 检测模型中的ocm
					if(suc == "suc"){
						if(args["success"]&&typeof args["success"] == "function"){
							args["success"](suc);
						}else{
							throw("there must be a success parameter in args!");
						}
					}else{
						if(args["failed"]&& typeof args["failed"] == "function"){
							args["failed"](suc);
						}else{
							throw(suc);
						}
					}
				}
				
			},
			function(err){
				if(args["failed"]&& typeof args["failed"] == "function"){
					args["failed"](err);
				}else{
					throw(err);
				}
			}
		);
			
	}
	
	/**@brief getFullName : 根据路径获取全部名称
	   @param args : JSON 格式参数
			@code{.js}
				var args = {
					path : "/content/modellibcategory/folderxxx/folderyyy",	// 要获取的路径的中文名称
					separator : "",											// 分隔符
					success : function(data){},								// 成功的回调函数
					failed : function(error){}								// 失败的函数,(optional)	
				}
			@endcode
	**/
	retClass.getFullName = function(args){
		// 参数判断
		if(!args["path"]){
			console.error("[ERROR]: args['path'] is undefined!");
			return;
		}
		if(!args["separator"]){
			var separator = ";";
		}else{
			var separator = args["separator"]
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined or not function!");
			return;
		}
		// 这里开始进行判断、获取
		var path = args["path"];
		var pathArr = path.split("/");
		var total = pathArr.length;
		if(total<2){
			console.error("[ERROR]: args['path'] is error");
			return;	
		}
		var count = 0;
		var resourceNameArr = [];
		var basePath = "/" + pathArr[1] + "/" + pathArr[2]; 
		// for(var i=0;i<pathArr.length;i++){
			// console.log(i,pathArr[i]);
		// }
		// console.log(basePath);
		// for(var i=3 ; i<pathArr.length ; i++){
		for(var i=3 ; i<pathArr.length ; i++){
			basePath += "/" + pathArr[i];
			
			// console.log(basePath);
			
			getResourceNameByPath(i, basePath);
		}
		
		// 通过path 获取resourceName
		function getResourceNameByPath(index, path){
			var spss = new spsession(path);
			var node = spss.getRootNode();
			node.ensureData({
				success : function(node){
					var resourceName = node.getProperty("resourceName");
					if(!resourceName){
						resourceName = node.getProperty("nodeName");
					}
					// console.log(index,resourceName);
					
					checkGetResourcenameCount(index, resourceName);
					
				},
				failed : function(error){
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					console.error("[ERROR]: call getFullName failed!",error);
					return;
				}
			});
			
		}
		
		// 检测获取的resourceName 是否够数
		function checkGetResourcenameCount(index, name){
			
			resourceNameArr[index-3]=name;
			count ++;
			//i++
			// console.log(total, count);
			// console.log(total, (count+3));
			if(total==(count+3)){
				var fullname = resourceNameArr.join(separator);
				args["success"](fullname, resourceNameArr);
			}
		}
		
	}
	
	/**@brief getCategory : 获取分类信息
	   @param args ： JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/materiallib",	// 获取的分类的数据
					success : function(data){},     // 成功的回调函数
					failed : function(error){}		// 失败调用的回调函数,(optional)
				}
			@endcode
	**/
	retClass.getCategory = function(args){
		// 参数判定
		if(!args["path"]){
			console.error("[ERROR]: args['path'] is undefined!");
			return;
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined or not function!");
			return;
		}
		// 获取二级目录
		function getLevel2(pathArr){
			
			// 二级目录的回调
			var count = 0;
			// 三级目录的回调
			var l3count1 = 0;
			
			function getLevel2OneByone(path,index){
				var _spss = new spsession(path);
				var _nodelL1 = _spss.getRootNode();
				_nodelL1.ensureData({
					success : function(node){
						// var level1Data = {};
						var l1Data = {};
						var level1ResourceName = node.getProperty("resourceName");
						var level1Path = node.getFullpath();
						var level1IsRadio = node.getProperty("isradio");
						l1Data["path"] = level1Path;
						l1Data["resourceName"] = level1ResourceName;
						
						level1Data[level1Path] = {};
						level1Data[level1Path]["resourceName"] = level1ResourceName;
						
						var level2 = node.getNodes();
						var level2length = level2.length;
						
						if(typeof level1IsRadio != "undefined"){
							level1Data[level1Path]["isradio"] = level1IsRadio;
							if(level1IsRadio=="true"){
								l1Data["isradio"] = true;
							}else{
								l1Data["isradio"] = false;
							}
							
						}
						level1Data[level1Path]["totalNum"] = level2length;
						l1Data["totalNum"] = level2length;
						
						level1Data[level1Path]["catData"] = {};
						l1Data["catData"] = [];
						for(var j = 0 ; j < level2.length ; j ++){
						
							var l2Data = {};
							var level2Path = level2[j].getFullpath();
							var level2ResourceName = level2[j].getProperty("resourceName");
							
							// 去掉rep:policy 和allow 节点
							if(!level2ResourceName){
								continue;
							}
							
							l2Data["path"] = level2Path;
							
							l2Data["resourceName"] = level2ResourceName;
							l1Data["catData"].push(l2Data);
						
						}
						
						level1DataArray[index] = l1Data;
						count ++;
						// console.log("count",count);
						if(count == pathArr.length){
							// args["success"](level1DataArray);
							// console.log(level1DataArray);
							var resultData = level1DataArray;
							var l3pathArray = [];
							function getL3pathsArray(){
				
								for(var i = 0 ; i < level1DataArray.length ; i ++ ){
									// console.log(i);
									// console.log(level1DataArray[i]);
									
									var l1catData = level1DataArray[i]["catData"];
									var l1catDatalength = l1catData.length;
									var l3count = 0;
									
									for(var j=0; j<l1catDatalength; j++){
										var l2path = l1catData[j]["path"]
										// console.log(l2path);
										//getLevel3OneByone(l2path,i,j);
										var l3pathObj = {};
										l3pathObj["l1"] = i;
										l3pathObj["l2"] = j;
										l3pathObj["path"] = l2path;
										l3pathArray.push(l3pathObj);
									}
									
								}
								// 如果不存在第三级数据，则直接返回
								if(!l3pathArray.length){
									args["success"](level1DataArray);
									return;
								}
								
							}
							function getLevel3OneByone(path, index1, index2){
						
								resultData[index1]["catData"][index2]["catData"] = [];
								// console.log(path);
								
								var ll2spss = new spsession(path);
								var ll2node = ll2spss.getRootNode();
								ll2node.ensureData({
									success : function(node){
										l3count1 ++;
										var l3nodesArray = node.getNodes();
										// console.log(l3nodesArray);
										for(var k=0; k<l3nodesArray.length; k++){
											var l3Data = {};
										
											// console.log(l3nodes[k].getFullpath());
											// console.log(l3nodes[k].getProperty("resourceName"));
											
											var l3path = l3nodesArray[k].getFullpath();
											var l3resourceName = l3nodesArray[k].getProperty("resourceName");
											
											if(!l3resourceName){
												continue;
											}
											
											l3Data["path"] = l3path;
											l3Data["resourceName"] = l3resourceName;
											// console.log("l3Data_path",l3path,"l3Data_resourceName",l3resourceName);
										
											resultData[index1]["catData"][index2]["catData"].push(l3Data);
											
										}
										
										
										if(l3count1==l3pathArray.length){
											// console.log(resultData);
											args["success"](resultData);
											return;
										}
									}
								});
								
							}
							getL3pathsArray();
							// console.log("l3pathArray");
							// console.log(l3pathArray);
							
							
							
							
							// 遍历 l3pathArray
							for(var i=0; i<l3pathArray.length; i++){
								var path = l3pathArray[i]["path"];
								var l1Index = l3pathArray[i]["l1"];
								var l2Index = l3pathArray[i]["l2"];
								// console.log("l1Index",l1Index,"l2Index",l2Index,"path",path);
								getLevel3OneByone(path, l1Index, l2Index);
								
							}
							

							// return;
						}
						
					},
					failed : function(error){
						if(args["failed"] && typeof ags["failed"] == "function"){
							args["failed"](error);
							return;
						}
						console.error("[ERROR]: call getCategory failed", error);
						return;
					}
				});
			}
			
			for(var i = 0 ; i < pathArr.length ; i ++){
				var path = pathArr[i];
				var level1Data = {};
				var level1DataArray = [];
				getLevel2OneByone(path,i);	
			}
		}
		// 获取一级目录
		var path = args["path"];
		var spss = new spsession(path);
		var nodeL1 = spss.getRootNode();
		nodeL1.ensureData({
			success : function(node){
				
				var pathArr = [];
				var level1 = node.getNodes();
				
				for(var i = 0; i < level1.length ; i++){
					
					var path = level1[i].getFullpath();
					var resourceName = level1[i].getProperty("resourceName");
				
					// 去掉rep:policy 和allow 节点
					if(!resourceName){
						continue;
					}
		
					pathArr.push(path);
				}
				// 当不存在第一级目录，需要直接返回，不需要在查找二级目录了
				if(!pathArr.length){
					args["success"](pathArr);
					return;
				}else{
					// 一级目录不为空
					getLevel2(pathArr);
				}	
			
			},
			failed : function(error){
				if(args["failed"] && typeof ags["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[ERROR]: call getCategory failed", error);
				return;
			}
		});
		
	}
	
	/**@brief getSubCategory : 获取子分类信息
	   @param args ： JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/materiallib",	// 获取的分类的数据
					success : function(data){},     // 成功的回调函数
					failed : function(error){}		// 失败调用的回调函数,(optional)
				}
			@endcode
	**/
	retClass.getSubCategory = function(args){
		// 参数判定
		if(!args["path"]){
			console.error("[folder.getSubCategory ERROR]: args['path'] is undefined!");
			return;
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[folder.getSubCategory ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		// 获取一级目录
		var path = args["path"];
		var spss = new spsession(path);
		var nodeL1 = spss.getRootNode();
		nodeL1.ensureData({
			success : function(node){
				
				var level1 = node.getNodes();
				var subCatArray = [];
				for(var i = 0; i < level1.length ; i++){
					var l1Data = {};
					// console.log(i,level1[i].getFullpath());
					// console.log(i,level1[i].getProperty("resourceName"));
					var path = level1[i].getFullpath();
					var resourceName = level1[i].getProperty("resourceName");
					// var resourceName = level1[i].getName();
					// 去掉rep:policy 和allow 节点
					if(!resourceName){
						continue;
					}
					
					l1Data["path"] = path;
					l1Data["resourceName"] = resourceName;
					
					subCatArray[i] = l1Data;
				}

				args["success"](subCatArray);
				return;
			},
			failed : function(error){
				if(args["failed"] && typeof ags["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[folder.getSubCategory ERROR]: call getSubCategory failed", error);
				return;
			}
		});
		
	}
	
	/**@brief getSiblingCategory : 获取同级分类信息
	   @param args ： JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/materiallib",	// 获取的分类的数据
					success : function(data){},     // 成功的回调函数
					failed : function(error){}		// 失败调用的回调函数,(optional)
				}
			@endcode
	**/
	retClass.getSiblingCategory = function(args){
		// 参数判定
		if(!args["path"]){
			console.error("[folder.getSiblingCategory ERROR]: args['path'] is undefined!");
			return;
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[folder.getSiblingCategory ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		// 获取一级目录
		var path = args["path"];
		// console.log("path");
		// console.log(path.substring(0,path.lastIndexOf("/")));
		path = path.substring(0,path.lastIndexOf("/"));
		var spss = new spsession(path);
		var nodeL1 = spss.getRootNode();
		nodeL1.ensureData({
			success : function(node){
				
				var level1 = node.getNodes();
				var siblingCatArr = [];
				for(var i = 0; i < level1.length ; i++){
					var jsonData = {};
					// console.log(i,level1[i].getFullpath());
					// console.log(i,level1[i].getProperty("resourceName"));
					var path = level1[i].getFullpath();
					var resourceName = level1[i].getProperty("resourceName");
					
					// var resourceName = level1[i].getName();
					// 去掉rep:policy 和allow 节点
					if(!resourceName){
						continue;
					}
				
					jsonData["path"] = path;
					jsonData["resourceName"] = resourceName;
					
					siblingCatArr[i] = jsonData;
				}
			
				args["success"](siblingCatArr);
				return;
			},
			failed : function(error){
				if(args["failed"] && typeof ags["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[folder.getSiblingCategory ERROR]: call getSiblingCategory failed", error);
				return;
			}
		});
	}
	
	return retClass; // 返回资源对象

});