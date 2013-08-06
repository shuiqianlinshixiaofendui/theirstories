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
 
define("spolo/data/preview",
[
	"dojo/_base/declare", 
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"spolo/data/folder/previewlib",
	"dojo/request/xhr",
	"dojo/json",
	"spolo/data/queryClass",
	"dojo/_base/lang"
],
function(
	declare, 
	spobject ,
	spsession,	
	spnode,
	previewlib_cls,
	xhr,
	JSON,
	queryClass,
	lang
	
)
{ 
	////////////////私有方法//////////////////////////////
	////////////////公有方法//////////////////////////////
	var retClass =  declare("spolo/data/preview", [spobject], {
		constructor : function(path)
		{
			this.ref = null; 
			this.path = path;
		},
		
		/**@brief remove ： 将当前效果图进行删除
		   @param callback : 成功的回调函数
           @param errorCallback : 失败的回调函数(optional)		   
		**/
		remove : function(callback, errorCallback){
			// 参数判定
			if(!callback && typeof callback != "function"){
				console.error("[ERROR]: callback is undefined or not function!");
				return;
			}
			
			// url 拼接
			var path = this.spnode.getFullpath();
			var url  = path + ".delete";
			
			// 发送ajax 请求
		    xhr(url, {
				handleAs : "json",
				method : "GET"
			}).then(
				function(data){
					if(data["suc"]){
						callback(data);
						return;
					}else{
						if(errorCallback && typeof errorCallback == "function"){
							errorCallback(data);
							return;
						}
						console.error("[ERROR]: failed remove" + data);
						return;
						
					}
					
				},
				function(error){
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback(error);
						return;
					}
					console.error("[ERROR]: failed remove" + error);
					return;
				}
			);
		}	
		
	});
	
	//存储预览图下模型信息的数组
	retClass.modelsJSONArray = []; 
	
	/**@brief  createModelsPreview 对多个效果图进行渲染 /content/previewlib/scenexx/previewxx
	   @param pathArray ： 效果图数组路径 /content/previewlib/scenexx
	   @param callback ： callback 成功的回调函数	
	   @param errorCallback ： errorCallback 失败的回调函数	
	**/
	retClass.createModelsPreview = function(pathArray, callback, errorCallback){
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
		
		
		var xhrCount = 0; // send ajax count for createModelsPreview	
		var _xhrCount = 0; // send ajax count for getFirstPreviewPath
		var previewsArray = []; // store get previewPath from pathArray
		
		
		getPreviewPathFromPreivewlib(
			pathArray,
			function(previewsArray){
				_createModelsPreview(previewsArray);
			}	
		);
		
		// 执行从/content/previewlib/scene2013225235978419193283/ 获取某一张效果图
		function getPreviewPathFromPreivewlib(pathArray, sucFuc){
			
			for(var j=0;j<pathArray.length; j++){
				var scenepath = pathArray[j];
				previewlib_cls.getFirstPreviewPath(
					scenepath,
					function(previewpaths){
						_xhrCount ++;
						var previewpath = previewpaths[0];
						previewsArray.push(previewpath);
						
						if(_xhrCount == pathArray.length){
							sucFuc(previewsArray);
						}
					},
					function(error){
						console.error("[ERROR]:createModelsPreview 's getFirstPreviewPath wrong!" + error);
						return;
					}
				);	
			
			}
				
		}
		
		// 执行创建渲染任务
		function _createModelsPreview(pathArray){
			for(var i=0;i<pathArray.length; i++){
				var path = pathArray[i];
				var url = path + ".createModelsPreview";
				
				xhr(url,{
					handleAs : "json",
					method : "GET"
				}).then(
					function(data){
						xhrCount ++;
						if(xhrCount == pathArray.length){
							// 不管返回的信息，直接将数据返回给ui
							callback(data);
	
						}
						
					},
					function(error){
						
						errorCallback(error);
						
					}
				);
			}
		
		}
		
		
	}
	
	/**@brief  downloadTextures 下载预览图中的所有效果图
	   @param path :  当前preview节点路径 /content/users/_chenyang_40spolo.org/previewlib/job80
	*/
	retClass.downloadTextures = function(path){
		var url = path;
		url += "/task_1.download";
        //gutil not support download in iframe.
        //window.location = url;
        parent.window.location = url;
	}
	
	/**@brief :listModels 列举预览图所包含的模型信息
		 * @param : 
		 *	path : 当前preview节点路径
		 *  callback : 成功的回调函数
		 *  errorCallback : 失败的回调函数
		 *
	*/
	retClass.listModels = function(path , callback , errorCallback){
		
		//调用preview.modelist的restful接口
		var url = path + ".modellist"; 
		//通过ajax,调用restful接口,获取模型引用的JSON
		xhr(url,{
			handleAs:"json"
		}).then(
			function(data){ 
				if(typeof(callback) == "function") {
					callback(data);
				}
			},
			function(error){
				//console.log("Error") ; 
				if(typeof(errorCallback)== "function"){
					errorCallback(error);
				}
			}
		);
	}
	
	/**@brief listModelsByGroup 列举预览图所包含的模型信息
	   @param args : JSON 形式的字符串
			@code{.js}
				args = {
					path : 当前preview节点路径,
					start : 开始的页数,默认为0,
					startmodelpath : 关联的模型,
					length : 每页的长度,默认为50,
					success : 成功的回调函数,(data["data"],data["count"],data["startmodelindex"])
					failed : 失败的回调函数。
				}
			@endcode	
	**/
	retClass.listModelsByGroup = function(args){
		
		//调用preview.modelist的restful接口
		var data = {};
		
		if(args["path"]!=undefined){
			var path = args["path"];
			var url = path + ".modellist";
		}else{
			throw("there must be a 'path' parameter in arguments!");
		}
		if(args["start"]!=undefined&&args["length"]!=undefined){
			var start = args["start"];
			var length = args["length"];
			//url = url + "?start=" + start + "&length=" + length;
			data["start"] = start;
			data["length"] = length;
		}else{
			console.log("default : start is 0 and length is 50!");
		}
		if(args["startmodelpath"]!=undefined){
			var startmodelpath = args["startmodelpath"];
			data["startmodelpath"] = startmodelpath;
		}
		//通过ajax,调用restful接口,获取模型引用的JSON
		xhr(url,{
			handleAs:"json",
			query : data,
			method : "GET"
		}).then(
			function(data){ 
				if((args["success"])&&(typeof args["success"] == "function")) {
					// 分离data 和count
					var count = data["count"];
					delete data["count"];
					if(data["startmodelindex"]!=undefined){
						var startmodelindex = data["startmodelindex"];
						delete data["startmodelindex"];
						args["success"](data,count,startmodelindex);
						return;
					}
					if(data["startmodelindex"]==undefined){
						args["success"](data,count);
						return;
					}
				}
			},
			function(error){
				//console.log("Error") ; 
				if((args["failed"])&&(typeof args["failed"] == "function")) {
					args["failed"](error);
				}else{
					throw(error);
				}
			}
		);
	}
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
	*/
	retClass.getName = function(previewScenePath,success,error){
		if(!previewScenePath){
			console.error("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				var name = spnode.getProperty("resourceName");
				success(name);
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
		name="效果图名称"
	*/
	retClass.setName = function(previewScenePath,name,success,error){
		if(!previewScenePath){
			console.error("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.setProperty("resourceName",name);
		node.save({
			success : function(){
				success();
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
	*/
	retClass.getCategory = function(previewScenePath,success,error){
		if(!previewScenePath){
			throw("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				var previewCategory = spnode.getProperty("previewCategory");
				success(previewCategory);
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
		category="工装效果"
	*/
	retClass.setCategory = function(previewScenePath,category,success,error){
		if(!previewScenePath){
			throw("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.setProperty("previewCategory",category);
		node.save({
			success : function(){
				success();
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
	*/
	retClass.getPreviewProperty = function(previewScenePath,success,error){
		if(!previewScenePath){
			throw("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				var previewCategory = spnode.getProperty("previewCategory");
				var previewStyle = spnode.getProperty("previewStyle");
				var previewRoom = spnode.getProperty("previewRoom");
				var introduction = spnode.getProperty("introduction");
				introduction = Spolo.inputDecode(introduction);
				var previewPropertyJson = {
					"previewCategory" : previewCategory,
					"previewStyle" : previewStyle,
					"previewRoom" : previewRoom,
					"introduction" : introduction
				}
				success(previewPropertyJson);
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
		previewPropertyJson = {
			"previewCategory" : "",
			"previewStyle" : "",
			"previewRoom" : "",
			"introduction" : ""
		}
	*/
	retClass.setPreviewProperty = function(previewScenePath,previewPropertyJson,success,error){
		if(!previewScenePath){
			throw("previewScenePath is undefined!");
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.setProperty("previewCategory",previewPropertyJson["previewCategory"]);
		node.setProperty("previewStyle",previewPropertyJson["previewStyle"]);
		node.setProperty("previewRoom",previewPropertyJson["previewRoom"]);
		
		var introduction = previewPropertyJson["introduction"];
		introduction = Spolo.inputEncode(introduction);
		
		//node.setProperty("introduction",previewPropertyJson["introduction"]);
		node.setProperty("introduction",introduction);
		
		node.save({
			success : function(){
				success();
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
	*/
	retClass.getPublishAuthor = function(previewScenePath,success,error){
		if(!previewScenePath){
			console.error("[ERROR]: previewScenePath is undefined!");
			return;
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				var publishAuthor = spnode.getProperty("publishAuthor");
				if(!publishAuthor){
					publishAuthor = Spolo.getUserId();
				}
				success(publishAuthor);
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/*
		previewScenePath="/content/previewlib/scene2013225235978419193283/sucai02_chaji"
	*/
	retClass.getPublishdate = function(previewScenePath,success,error){
		if(!previewScenePath){
			console.error("[ERROR]: previewScenePath is undefined!");
			return;
		}
		var spss = new spsession(previewScenePath);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				var publishdate = spnode.getProperty("publishdate");
				if(!publishdate){
					publishdate = spnode.getProperty("jcr:created");
				}
				success(publishdate);
				delete spss;
			},
			failed : function(err){
				error(err);
			}
		});
	}
	
	/**@brief searchModels : 根据条件搜索关联的模型
	   @param args ：JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/previewlib/scene2013225235978419193283/preview1",
					keyWord  : "",  // 查询条件
					start : 0,		// 页数的开始位置
					length ： 4,	// 每页的长度
					success ： function(data, count){}, // 成功的回调函数，data 数据，count 总数
					failed ： function(error){}			// (optional)失败的回调函数
				}
			@endcode
	**/
	retClass.searchModels = function(args){
		// 参数判断
		if(typeof args["path"] == "undefined"){
			console.error("[ERROR]: args['path'] is undefined!");
			return;
		}
		if(typeof args["keyWord"] == "undefined"){
			console.error("[ERROR]:args['keyWord'] is undefined!");
			return;
		}
		if(typeof args["success"] == "undefined" || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		// 拼接请求url
		var url = args["path"];
		url += ".searchmodel";
		var data = {};
		data["keyWord"] = args["keyWord"];
		if(typeof args["start"] != "undefined"){
			data["start"] = args["start"];
		}
		if(typeof args["length"] != "undefined"){
			data["length"] = args["length"];
		}
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			method : "GET",
			query : data
		}).then(
			function(jsondata){
				console.log(jsondata);
				// 分离data 和count
				var count = jsondata["count"];
				delete jsondata["count"];
				args["success"](jsondata,count);
				return;
			},
			function(error){
				if(args["failed"]&& typeof args["failed"] == "function"){
					args["failed"](error);
				}
				console.error("[ERROR]: call searchModels occurs wrong!"+ error);
				return;
			}
		);
		
	}
	
	/*
		发布效果图之前的检查
		@path 该路径对应的节点必须是 sling:resourceType=preview
	*/
	retClass.validate = function(args){
		var path = args["previewPath"];
		if(!path){
			console.error("path is undefined!");
		}
		var notifyFunc = args["notifier"];
		if(!notifyFunc){
			console.error("notifier is undefined!");
		}
		var errorCallback = args["error"];
		var finished = args["finished"];
		if(!finished){
			console.error("finished is undefined!");
		}
		
		var loadfunc = function(data){
			var list = data["data"];
			var checkPath;
			for(var key in list){
				checkPath = key;
				break;
			}
			if(!checkPath){
				console.error("preview validate : 此场景没有效果图!");
				return;
			}
			require(["dojo/io/iframe","dojo/dom"], function(ioIframe,dom){
				var url = checkPath + ".check";
				var content = {};
				var notifierName = "_sp_notify_preview_check";
				window[notifierName] = function(msg){
					notifyFunc(msg);
				}
				
				content["notifier"] = "window.parent." + notifierName;
				
				ioIframe.send({
					form: null,
					method : "POST",
					content : content,
					url: url,
					handleAs: "text",
					load : function(msg){
						window[notifierName](msg);
						if(typeof(finished)== "function"){
							finished();
						}else{
							console.error("finished is not function!!");
						}
					},
					error : function(error){
						window[notifierName](error);
					}
			   });
			   
			});
		}
		
		var errorfunc = function(err){
			console.error(err);
		}
		
		queryClass.query({
			nodePath  : path,
			properties:{
				"sling:resourceType" : "preview"
			},
			offset:0,
			limit:1,
			load : loadfunc,
			error : errorfunc
		});
		
	}
	
	
	return retClass ; 
});