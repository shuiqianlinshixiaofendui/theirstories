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
 
define("spolo/data/model",
[
	"dojo/_base/declare", 
	"dojo/request/xhr",
	"spolo/data/spobject",
	"spolo/data/spnode",
	"spolo/data/spsession",
	"spolo/data/queryClass",
	"spolo/data/history",
	"spolo/data/util/image"
],
function(
	declare,
	xhr,
	spobject, 
	spnode,
	spsession,
	queryClass,
	history_cls,
	image_cls
){

	var ret_class = declare("spolo.data.model",[spobject],{
 		
		constructor : function(path){
			this.ref = null;
			this.path = path;
		},
		
		// getXXX setXXX 模型的属性。
		initData : function(callback){
			this.spnode.ensureData({
				success: function(data){
					callback(data);
				},
				failed : function(err){
					console.error(err);
				}
			});
		},		
		
		save: function(callback, errback){
			this.spnode.save({
				success: function(data){
					callback(data);
				},
				failed : function(err){
					errback(err);
				}
			});
		},

		setResourceName : function(value){
			this.spnode.setProperty("resourceName", value);
		},
		getResourceName : function(callback, errorCallback){
			if(arguments.length==0){
				return this.spnode.getProperty("resourceName");
			}else{
				this.spnode.ensureData({
					success: function(data){
						//console.log(data.getJson()["resourceName"]);
						callback(data.getJson()["resourceName"]);
					},
					failed : function(err){
						if(typeof errorCallback == "function"){
							errorCallback(err);
						}else{
							throw(err);
						}
						
					}
				});
			}
			
		},
		
		
		setStylePath : function(value){
			this.spnode.setProperty("stylePath", value);
		},
		getStylePath : function(){
			return this.spnode.getProperty("stylePath");
		},
		// 设置下载次数
		setDownloadCount : function(){
		
			var downloadCount = this.spnode.getProperty("downloadCount");
		
			if(!downloadCount){
				downloadCount  = 1;
			}else{
				downloadCount ++;
			}
			
			this.spnode.setProperty("downloadCount", downloadCount);
		},
		getDownloadCount : function(){
			var downloadCount = this.spnode.getProperty("downloadCount");
			
			if(!downloadCount){
				downloadCount = 0;
			}
			
			return downloadCount;
		},
		
		setMadeOfPath : function(value){
			this.spnode.setProperty("madeOfPath", value);
		},
		getMadeOfPath : function(){
			return this.spnode.getProperty("madeOfPath");
		},
		
		
		setBrandPath : function(value){
			this.spnode.setProperty("brandPath", value);
		},
		getBrandPath : function(){
			return this.spnode.getProperty("brandPath");
		},
		
		setRoomPath : function(value){
			this.spnode.setProperty("roomPath", value);
		},
		getRoomPath : function(){
			return this.spnode.getProperty("roomPath");
		},
		
		setColorSystemPath : function(value){
			this.spnode.setProperty("colorSystemPath", value);
		},
		getColorSystemPath : function(){
			return this.spnode.getProperty("colorSystemPath");
		},
		
		setPrice : function(value){
			this.spnode.setProperty("price", value);
		},
		getPrice : function(){
			return this.spnode.getProperty("price");
		},
        
        setArea : function(value){
			this.spnode.setProperty("area", value);
		},
		getArea : function(){
			return this.spnode.getProperty("area");
		},
		// 设置introduction 时需要进行特殊字符的转义
		setIntroduction : function(value){
			var value = Spolo.inputEncode(value);
			this.spnode.setProperty("introduction", value);
		},
		// 获取introduction 时需要进行特殊字符的反转义
		getIntroduction : function(){
			var introduction = this.spnode.getProperty("introduction");
			introduction = Spolo.inputDecode(introduction);
			return introduction;
		},
		
		setKeyInfo : function(value){
			var value = Spolo.inputEncode(value);
			this.spnode.setProperty("keyInfo", value);
		},
		getKeyInfo : function(){
			var keyInfo = this.spnode.getProperty("keyInfo");
			keyInfo = Spolo.inputDecode(keyInfo);
			return keyInfo;
		},
		
		// 获取 publishAuthor 属性
		getPublishAuthor : function(){
			var publishAuthor = this.spnode.getProperty("jcr:createdBy");
			if(!publishAuthor){
				console.log("call getPublishAuthor publishAuthor is undefined!");
				return "";
			}
			return publishAuthor;
		},
		
		// 获取 publishdate 属性
		getPublishdate : function(){
			var publishdate = this.spnode.getProperty("jcr:created");
			if(!publishdate){
				console.log("call getPublishdate publishdate is undefined!");
				return "";
			}
			return publishdate;
		},
		
		getID : function(callback , errorCallback){
			if(arguments.length==0){
				return this.spnode.getProperty("ID");
			}else{
				this.spnode.ensureData({
					success: function(data){
						if(typeof(callback) == "function")
							callback(data.getJson()["ID"]);
					},
					failed : function(err){
						if(typeof(errorCallback) == "function")
							errorCallback(err);
						else
							throw(err);
					}
				});
			}
		},
		
		uploadPreview : function(formID,option)
		{
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				
				
				
				
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				
				
				var	url = this.spnode.getFullpath() + ".uploadpreview";
				// alert(url);
				// alert(option.load);
				// alert(dom.byId(formID));
				
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
				
				
			}));
		},
		
		//  从obj 中更新model
		updatamodelFromobj : function(formID,option)
		{
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				if(option && option.author)
				{
					content["author"] = option.author;
				}else
				{
					content["author"] = Spolo.getUserId();
				}
				if(option && option.msg)
				{
					content["msg"] = option.msg;
				}
				var	url = this.spnode.getFullpath() + ".shmodelUpdate.POST";
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						
						if(option && option.error)
						{
                            option.error(error);
						}
					}
			   });
				
				
			}));
		},
		
		// 获取系统默认的系统图片
		getDefaultPreview : function(){
			return "/modules/scenedetail/images/nopreview.jpg";
		},
		
		/**@brief 获取图片
		   @param callback : 图片地址已回调函数参数的形式返回
		   @param failedCallback ： 当请求的图片不存在，调用此回调函数
           @param errorCallback : 请求失败的回调函数，返回404 错误，有客户端捕获 		   
		**/
		getPreview : function(callback, failedCallback, errorCallback){
			var url = this.spnode.getFullpath();
			url += ".preview";
			
			xhr(url,{
					handleAs : "text",
					method : "GET"
			}).then(
				function(suc){
				    // 存在返回url 地址
					if(suc.match("false")){
						if(typeof failedCallback == "function"){
							failedCallback();
						}
					}else{
						callback(url);
					}
				    	
				},	
				function(error){
					// 不存在返回404 错误
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				}
			);
			
		},
		
		/**@brief 保存模型X3d数据
		   @param data : 模型的3d数据(json格式字符串)
		   @param callback : 执行成功的回调函数
		   @param errorCallback : 失败的回调函数
		**/
		setX3dData : function(data , success , failed){
			var spss = new spsession(this.path);
			var node = spss.getRootNode();
			node.setProperty("X3dData",data);
			node.save({
				success : function(){
					success();
					delete spss;
				},
				failed : function(err){
					error(err);
				}
			});
		},
		
		/**@brief 获取模型X3d数据
		   @param callback : 成功的回调函数
		   @param errorCallback : 失败的回调函数	   
		**/
		getX3dData : function(success , failed){
			var spss = new spsession(this.path);
			var node = spss.getRootNode();
			node.ensureData({
				success : function(spnode){
					try{
						//有可能model没有X3dData属性
						var data = spnode.getProperty("X3dData");
						if(data == undefined)
							success("");
						else
							success(data);
					}catch(e){
						success("");
					}	
					delete spss;
				},
				failed : function(err){
					error(err);
				}
			});
		},
		
		/**@brief  history 当前模型的历史版本记录
		   @param args : JSON 格式的参数
		   @code{.js}
				var args = {
					kw : "",							// (optional) 查询条件
					sd : "",							// (optional) 查询起始时间
					ed : "",							// (optional) 查询终止时间
					success : function(data){},			// 成功的回调函数
					failed : function(error){},			// (optional)失败的回调函数
				}
			@endcode
		**/
		history : function(args){
			// 进行参数判断
		
			if(!args["success"] || typeof args["success"] != "function"){
				console.error("[ERROR]:args['success'] is undefined!");
				return;
			}
			// 拼接history.history() 调用参数
			var path = this.spnode.getFullpath();
			
			var historyArgs = {};
			
			historyArgs["path"] = path;
			
			if(typeof args["kw"] != "undefined"){
				historyArgs["kw"] = args["kw"];
			}
			
			if(typeof args["sd"] != "undefined"){
				historyArgs["sd"] = args["sd"];
			}
			
			if(typeof args["ed"] != "undefined"){
				historyArgs["ed"] = args["ed"];
			}
			
			historyArgs.success = function(jsonData){
				args["success"](jsonData);
			}
			
			historyArgs.failed = function(error){
				if(args["failed"] && typeof args["failed"] == "function"){
					args["failed"](error);
					return;
				}
				console.error("[ERROR]: call history occurs error!" + error);
				return;
			}
			
			history_cls.history(historyArgs);
		},
		
		
		/**@brief  reversion 将当前的模型数据回滚到指定的版本号
		   @param hver : 要回滚的版本号
		**/
		reversion : function(hver, callback, errorCallback){
			// 进行参数判断
			if(!hver){
				console.error("[ERROR]: hver is undefined!");
				return;
			}
			if(!callback|| typeof callback != "function"){
				console.error("[ERROR]: callback is undefined!");
				return;
			}
			var path = this.spnode.getFullpath();
			var hver = hver;
			history_cls.reversion(
				path,
				hver,
				function(jsonData){
					callback(jsonData);
				},
				function(error){
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						console.error("[ERROR]: reversion failed!" + error);
						return;
					}	
				}
			);
		},
		
		/**@breif logMessage : 提交修改信息到git 系统
		   @param args ： JSON 格式参数
				@code{.js}
					var args = {
						message : "", 	// 修改信息
						success ：function(data){},
						failed ：function(data){}
					}
				@endcode
		**/
		logMessage : function(args){
			// 参数判断
			// 参数判断
			var userId = Spolo.getUserId();
			if(userId=="anonymous"){
				console.error("[ERROR]:the session is failed, please login again!");
				return;
			}
			
			if(!args["success"] || typeof args["success"] != "function"){
				console.error("[ERROR]: args['success'] is undefined! or not function!");
				return;
			}
			
			// 拼接请求路径
			var path = this.spnode.getFullpath();
			var url = path + ".modellog";
			var data = {};
			data["username"] = userId;
			if(!args["message"]){
				data["info"] = "auto add message log!";
			}else{
				var message = args["message"];
				data["info"] = message;
			}
			
			// 发送ajax 请求
			xhr(url,{
				method : "GET",
				handleAs : "json",
				query : data
			}).then(
				function(data){
					// 根据请求回来的信息进行判断是否成功
					if(data["suc"]==true){
						args["success"](data);
					}else{
						if(args["failed"] && typeof args["failed"] == "function"){
							args["failed"](data);
							return;
						}
						console.error("[ERROR]: call logMessage occures error!" + data);
						return;
					}
				},
				function(error){
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					console.error("[ERROR]: call logMessage occures error!" + error);
					return;
				}
			);
		}
		
	});//declare end
	
	/**@brief checkMaterials : 检查模型材质是否缺失
	   @param pathArray :　模型全路径数组
       @param callback ： 成功的回调函数, 参数为JSON 格式的判定信息
       @param errorCallback : 失败的回调函数, 可有可无	   
    **/	
	ret_class.checkMaterials = function(pathArray, callback, errorCallback){
		// 参数检测
		if(!pathArray || !(pathArray instanceof Array) || pathArray.length == 0){
			console.error("[ERROR]: pathArray is undefined or not Array or null");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		// 拼接查询语句
		var url = pathArray[0];
		url += ".checkmaterials";
		var data = {};
		var pathsString = pathArray.join(",");
		data["models"] = pathsString;
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			method : "GET",
			query : data
		}).then(
			function(jsonData){
				callback(jsonData);
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
				}
				console.error("[ERROR]:call checkMaterials occurs error!" + error);
				return;
			}
		);
	}
	
	/**@brief  createrenderjob 对多个模型进行渲染
	   @param pathArray ： 效果图数组路径 /content/users/admin/previewlib/scenexx/preview1
	   @param callback ： callback 成功的回调函数	
	   @param errorCallback ： errorCallback 失败的回调函数	
	**/
	ret_class.createrenderjob = function(pathArray, callback, errorCallback){
		// 参数判定
		if(typeof pathArray == "undefined" || !(pathArray instanceof Array) || pathArray.length==0){
			console.error("[ERROR]: pathArray is undefined! or null");
			return;
		}
		if(!callback && typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		if(!errorCallback && typeof errorCallback != "function"){
			console.error("[ERROR]: errorCallback is undefined! or not function!");
			return;
		}
		
		
		var xhrCount = 0; // send ajax count	
			
		for(var i=0;i<pathArray.length; i++){
			var path = pathArray[i];
			var url = path + ".createrenderjob";
			
			xhr(url,{
				handleAs : "text",
				method : "GET"
			}).then(
				function(data){
					xhrCount ++;
					if(xhrCount == pathArray.length){
						// 根据data 值进行回调函数的调用
						// 成功
						if(data=="suc"){
							callback(data);
						}else{
					    // 失败
							errorCallback(data);				
						}
					}
					
				},
				function(error){
					errorCallback(error);
				}
			);
		}
		
	}
	
	/**@brief  download : 下载模型的ocs、obj、blender 格式
	   @param path :  当前preview节点路径 /content/modellib/modelxxx
	   @param format_str : 下载模型的格式 blend,obj,ocs,max
	   @param version : 下载某一个版本的模型
	*/
	ret_class.download = function(path, format_str, version){
		// 参数判断
		if(!path||!format_str){
			console.error("[ERROR]: parameter path or format_str is undefined!");
			return;
		}
		// 下载格式选择
		var format = format_str;
		switch(format){
			case "blend": 
					format = format_str + ".zip";
					break;
			case "obj":
					format = format_str + ".zip";
					break;
			case "ocs":	
					format = format_str + ".zip";
					break;
			case "max":
					format = format_str + ".zip";
					break;
			default:
					break;
		}
		// url 路径拼接
		var url = path;
		url += "." + format;
		if(!version){
			url = url ;
		}else{
			url += "?version=" + version;
		}
		
		require(["dojo/io/iframe"], function(ioIframe){
			var dframe = "SPDownloadIframe"; 
			var iframe = ioIframe.create(dframe);
			ioIframe.setSrc(iframe, url, true);
		});
	}
	
	
	/**@brief getImage 获取图片 1. 首先或者模型缩略图2. 与之关联的效果图3. 需要给一个默认的图片
	   @param path : 传入当前节点的路径
	   @param callback : 图片地址已回调函数参数的形式返回
	   @param failedCallback ： 当请求的图片不存在，调用此回调函数	   
	**/
	ret_class.getImage = function(path, callback, failedCallback){
		// 方法参数验证
		if(!path){
			throw("path is undefined!");
		}
		if(!callback || typeof callback !="function"){
			throw("callback is undefined or callback is't function!");
		}
		if(!failedCallback || typeof failedCallback !="function"){
			throw("failedCallback is undefined or failedCallback is't function!");
		}
		var url = path;
		url += "";
		// 1. 获取模型缩略图 getPreviewByPath
		ret_class.getPreviewByPath(
			path, 
			function(modelImage){
				callback(modelImage);
			},
			function(error){
				// 2. 获取与模型相关的效果图 getPreviewFirstImage
				ret_class.getPreviewFirstImage({
					path : path,
					imageExist : function(previewImage){
						callback(previewImage);
					},
					imageNotExist : function(){
						// 3. 需要ui给一个默认的缩略图
						failedCallback();
					},
					error : function(error){
						throw("call getImage occurs wrong when calling getPreviewFirstImage function!");
					}
				});
			}
		);
	
	}
	
	/**@brief 获取图片
	   @param path : 传入当前node 的Name
	   @param callback : 图片地址已回调函数参数的形式返回
	   @param failedCallback ： 当请求的图片不存在，调用此回调函数
	   @param errorCallback : 请求失败的回调函数，可选参数。 		   
	**/
	ret_class.getPreviewByPath = function(path, callback, failedCallback, errorCallback){
	    
		// 参数判断
		if(!path){
			console.error("[model.getPreviewByPath ERROR]:path is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[model.getPreviewByPath ERROR]: callback is undefined or not function!");
			return;
		}
		if(!failedCallback || typeof failedCallback != "function"){
			console.error("[model.getPreviewByPath ERROR]: failedCallback is undefined or not function!");
			return;
		}
		// 拼接请求路径
		var url = path;
		url += ".preview";
		
		// 发送ajax 请求
		xhr(url,{
				handleAs : "text",
				method : "GET"
		}).then(
			function(suc){
				// 判断是否调用系统默认的图片
				if(suc.match("false")){
					if(typeof failedCallback == "function"){
						failedCallback();
					}
				}else{
					callback(url);
				}
				
			},	
			function(error){
				if(typeof errorCallback == "function"){
					errorCallback(error);
				}else{
					throw(error);
				}
				
			}
		);
		
	}
	
	/**@brief getFormat ：获取传入的模型的类型例如max、blender 等等。
	   @param path : 传入的模型的path
	   @param callback : 成功的回调函数，回调函数中的参数就是需要的数据。
	   @param errorCallback : 请求失败的回调函数，可选参数。 		   
	**/
	ret_class.getFormat = function(path, callback, errorCallback){
	    
		// 参数判断
		if(!path){
			console.error("[model.getFormat ERROR]:path is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[model.getFormat ERROR]: callback is undefined or not function!");
			return;
		}
		
		// 请求参数拼接
		var url = path;
		url += ".format";
		
		// 发送ajax 请求
		xhr(url,{
				handleAs : "json",
				method : "GET"
		}).then(
			function(data){
				// 对json 格式的数据进行格式的修改
				// console.log(data);
				var format_arr = [];
				for(var i=0; i<data.length; i++){
					for(var style in data[i]){
						format_arr.push(style);
					}
				}
				// var format_str = format_arr.join(",");
				callback(format_arr);
			},	
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[model.getFormat ERROR]: call getFormat occures error",error);
				return;
				
				
			}
		);
		
	}
	
	/**@brief 判断model是不是和preview关联
		   @param path : 节点的路径
		   @param callback : 执行成功的回调函数,返回true/false
           @param errorCallback : 执行失败的回调函数,返回false,失败原因在于content节点下没有previewlib子节点.		   
		**/
	ret_class.isReferPreview = function(path , callback , errorCallback){
	
		var rootPath = "/content/previewlib";
		var modelPath = path;
		var args = {
			nodePath  : rootPath,
			properties:{
				modelpath : modelPath
			},
			load : function(data){
				if(typeof(data) == "object" && data["totalNum"]>0)
					callback(true);
				else
					callback(false);
			},	
			error : function(error){
				if(typeof(errorCallback)=="function")
					errorCallback(false);
			}
		}
		queryClass.query(args);
	}
	
	/**@brief 获取与模型相关的效果图,现在只查询云端效果图
	   @param path ： 模型路径
       @param callback ： 成功的回调函数
       @param errorCallback ：没有获取到相关的效果图 	   
	**/
	ret_class.getPreviewURLsByURL = function(path, callback, errorCallback){
		if(!path){
			throw("there must be a 'path' parameter in arguments!");
		}

		var publicpath = "/content/previewlib";
		var modelPath = path;
	
		var loadfunc = function(data){
			if(typeof(data) == "object" && data["totalNum"]>0){
				
				for(var url in data["data"]){
					url = url.substring(0,url.lastIndexOf("/"));
					url = url.substring(0,url.lastIndexOf("/"));
					url = url.substring(0,url.lastIndexOf("/"));
					//url = url + ".image";
					//urls.push(url);
					if(typeof(callback) == "function"){
						callback(url);
					}else{
						throw("there must be a callback function in arguments ");
					}
					break;
				}
				
			}else{
				if(typeof(errorCallback)=="function"){
					errorCallback();
				}else{
					throw("there hasn't a scene preview reference this model");
				}	
			}
		}
		var errorfunc = function(error){
			// 查询失败
			throw(error);
		}
		
		var publicpathargs = {
			nodePath  :publicpath,
			properties:{
				"modelpath" : modelPath
			},
			offset:0,
			limit:1,
			load : loadfunc,
			error : errorfunc
		}
		
		// 查询/content/previewlib/ 下的关联模型
		queryClass.query(publicpathargs);
		
		
	}
	
	
	/**@brief 获取模型关联效果图集中的第一张图
	
	**/
	ret_class.getPreviewFirstImage = function(args){
		var path = args["path"];
		if(!path){
			throw("there must be a 'path' parameter in arguments!");
		}
		
		var imageExist = args["imageExist"];
		if(!imageExist){
			throw("there must be a 'imageExist' parameter in arguments!");
		}
		
		var imageNotExist = args["imageNotExist"];
		if(!imageNotExist){
			throw("there must be a 'imageNotExist' parameter in arguments!");
		}
		
		var errorCallback = args["error"];
		
		var publicpath = "/content/previewlib";
		var modelPath = path;
		
		var loadfunc = function(data){
			var modelList = data["data"];
			var resPath;
			for(var key in modelList){
				resPath = key;
				break;
			}
			
			if(resPath){
				resPath = resPath.substring(0, resPath.indexOf("/model/"));
				//resPath += ".image";
				resPath = image_cls.convert({
					"path" : resPath,
					"width" : 192,
					"height" : 192
					
				});
				imageExist(resPath);
			}else{
				imageNotExist();
			}
		}
		
		var errorfunc = function(error){
			if(errorCallback){
				errorCallback(error);
			}
		}
		
		var publicpathargs = {
			nodePath  : publicpath,
			properties:{
				"modelpath" : modelPath
			},
			offset:0,
			limit:1,
			load : loadfunc,
			error : errorfunc
		}
		queryClass.query(publicpathargs);
	}
	
	return ret_class;
});//define end