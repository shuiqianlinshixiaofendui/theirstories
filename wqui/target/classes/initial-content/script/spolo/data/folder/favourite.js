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
 
define("spolo/data/folder/favourite",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/spsession",
	"spolo/data/queryClass",	
	"spolo/data/folder"
],
function(
	declare, 
	xhr,
	lang,
	spsession,
	queryClass,
	folder
)
{
	
	/**@brief hasFolder判断是否存在favourite 文件夹
	   @param path : 某一个用户路径	"/content/users/userxx"
	**/
	 function hasFolder(path,callback, errorCallback){
		// 参数判断
		if(!path){
			console.error("[ERROR]: path is undefined!");
			return;
		}
		if(!callback||typeof callback != "function"){
			cosnole.error("[ERROR]: callback is undefined!");
			return;
		}
		if(!errorCallback||typeof errorCallback != "function"){
			cosnole.error("[ERROR]: errorCallback is undefined!");
			return;
		}
		// 拼接路径
		var url = path;
		url += ".1.json";
		// 发送ajax 请求
		xhr(url,{
			handleAs : "json",
			method : "GET"
		}).then(
			function(dataJson){
				for(var data in dataJson){
					if(data=="favourite"){
						// 存在
						callback();
						return;
					}
				}
				// 不存在
				errorCallback();
				return;
			},
			
			function(error){
				console.error("[ERROR]:call hasFolder occurs error"+ error);
				return;
			}
		);
	}

	/**@brief createFavourite 创建favourite、favourite/model 、favourite/preview
	   @param path : 创建的路径 "/content/users/userxxx"	
	**/
	function createFavourite(path, callback, errorCallback){
		if(!path){
			console.error("[ERROR]:path is undefined!");
			return;
		}
		if(!callback||typeof callback != "function"){
			cosnole.error("[ERROR]: callback is undefined!");
			return;
		}
		if(!errorCallback||typeof errorCallback != "function"){
			cosnole.error("[ERROR]: errorCallback is undefined!");
			return;
		}
		var sps = new spsession(path);
		var node = sps.getRootNode();
		node.addNode({
			nodePath : "favourite",
			property : {
				"sling:resourceType":"folder",
				"resourceName":"收藏夹"
			}
		});
		node.addNode({
			nodePath : "favourite/model",
			property : {
				"sling:resourceType":"folder",
				"resourceName":"模型收藏夹"
			}
		});
		node.addNode({
			nodePath : "favourite/preview",
			property : {
				"sling:resourceType":"folder",
				"resourceName":"效果图收藏夹"
			}
		});
		node.save({
			success : function(){
				console.log("[INFO]: createFavourite success!");
				callback();
				delete sps;
			},
			failed : function(){
				console.log("[INFO]: createFavourite failed!");
				errorCallback();
				delete sps;
			},
		});
	}
	
	/**@brief isFaved 判断给定的数据是否已经收藏了
	**/
	function isFaved(type, path, callback, errorCallback){
		// 参数判断
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(typeof type == "undefined"|| (type!="model"&&type!="preview")){
			console.error("[ERROR]: type is undefined or illegal!");
			return;
		}
		if(typeof path == "undefined"){
			console.error("[ERROR]: path is undefined!");
			return;
		}
		if(typeof callback == "undefined" || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		
		var userpath = "/content/users/" + userId;
		// 1.1 判断是否存在favourite
		hasFolder(
			userpath, 
			function(){
				//args["success"]();
				// 1.2.1 存在, 进行判断
				doJudgement();
			},
			function(){
				// 1.2.2 不存在, 则进行创建
				console.log("[INFO]: the path is't exist!");
				createFavourite(
					userpath, 
					function(){
						callback(false);
						return;
					},
					function(){
						callback(false);
						console.error("[ERROR]: call createFavourite occurs down!");
						return;
					}
				);
			}
		)
		
		function doJudgement(){
			var nodePath = "/content/users/"+ userId + "/favourite/" + type;
			var properties = {};
			properties["sling:resourceType"] = type;
			if(type == "model"){
				properties["modelpath"] = path;
				
			}
			if(type == "preview"){
				properties["previewpath"] = path;
			}
			var queryArgs = {
				"nodePath" : nodePath,
				"properties" : properties,
				"load" : function(data){
					if(typeof data == "object" && data["totalNum"]>=0){
						if(data["totalNum"]==0){
							callback(false);
						}
						if(data["totalNum"]==1){
							callback(true);
						}
					}
				},
				"failed" : function(error){
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback(error);
						return;
					}
					console.error("[ERROR]: call isFaved failed! " + error);
					return;
				}
			};
			
			queryClass.query(queryArgs);
		}
		
	}
	
	/**@brief deleteFavs : 删除收藏的珍品
	   @param type : 珍品类型, "model","preview"
	   @param refpath : 珍品的真实地址,即存在收藏下的modelpath 或者previewpath
	   @param callback : 成功的回调函数,无参数
       @param errorCallback : (optional) 失败的回调函数	   
	**/
	function deleteFavs(type, refpath, callback, errorCallback){
		// 参数的判断
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(!type || (type != "model" && type != "preview")){
			console.error("[ERROR]: type is undefined or error!");
			return;
		}
		if(!refpath){
			console.error("[ERROR]: refpath is undefined!");
			return;
		}
		if(!callback|| typeof callback != "function"){
			cosnole.error("[ERROR]: callback is undefined!");
			return;
		}
		
		// 删除收藏的珍品
		function delFav(favname){
			
			var path = "/content/users/" + userId + "/favourite"; 
			var sps = new spsession(path);
			var favname =  type + "/" + favname;
			sps.removeNode(favname); 
			
			sps.save({
				success : function(){
					callback();
					delete sps;
					return;
				},
				failed : function(){
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback();
						return;
					}
					
					console.error("[ERROR]: call deleteFavs occurs wrong!");
					delete sps;
					return;
				},
				saving : function(){
					//console.log("");
					//console.log("removing this.rootNode.removeNode");
				}
			});
		}
		
		//1.1 通过refpath 找到
		// 在/content/users/userxx/favourite/model/modelxx 这个具体路径或者是
		// 在/content/users/userxx/favourite/preview/previewxx 这个具体路径
		var expression = "/jcr:root/content/users/" + userId + "/favourite/" + type + "/*[jcr:contains(@" + type + "path,\""+refpath+"\")]";
		var queryArgs = {
			"expression" : expression,
			"load" : function(data){
				if(typeof data == "object"){
					if(data["totalNum"]==0){
						var error = "[ERROR]:refpath is not exist!";
						if(errorCallback && typeof errorCallback == "function"){
							errorCallback(error);
							return;
						}
						console.error("[ERROR]: call deleteFavs occurs error !" + error);
						return;
					}
					if(data["totalNum"]==1){
						for(var path in data["data"]){
							var favname = path.substring(path.lastIndexOf("/")+1);
							console.log(favname);
							
							//1.2 传递path, 通过spsession 进行删除
							delFav(favname);
							
							return;
						}
					}
				}
			},
			"error" : function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call deleteFavs occurs error !" + error);
				return;
			}
		}
		
		queryClass.executeXpath(queryArgs);
		
	
	}
	
	
	var retClass = declare("spolo.data.folder.favourite", [folder], {
	
		constructor : function(path)
		{
				
		}
		
		
		
		
		
	});	
	
	
	/**@brief addFavModel 新增收藏的模型
	   @param modelpath ： 收藏的模型的路径 // "/content/modellib/modelxxx"
	   @param callback ： 执行成功的回调函数
	   @param errorCallback ： 执行失败的回调函数，可选
	**/
	retClass.addFavModel = function(modelpath, callback, errorCallback){
		// 参数判定
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(!modelpath){
			console.error("[ERROR]:modelpath is undefined!");
			return;
		}
		if(!callback||typeof callback != "function"){
			console.error("[ERROR]:callback is undefined!");
			return;
		}
		var userpath = "/content/users/" + userId;
		lang.hitch(this, hasFolder(
			userpath, 
			function(){
				//args["success"]();
				doAddFavModel();
			},
			function(){
				console.log("[INFO]: the path is't exist!");
				createFavourite(
					userpath, 
					function(){
						doAddFavModel();
					},
					function(){
						console.error("[ERROR]: call createFavourite occurs down!");
						return;
					}
				);
			})
		);
		
		function doAddFavModel(){
			var favpath = userpath + "/favourite";
			
			var sps = new spsession(favpath);
			var favmodel = "model/" + Spolo.CreateNodeName("favmodel");
			var resourceName = modelpath.substring(modelpath.lastIndexOf("/")+1);
			var addArgs = {
				nodePath : favmodel,
				property : { 
					modelpath : modelpath, 
					resourceName : resourceName,
					"sling:resourceType" : "model"
				},
				success : function(){
					callback();
					delete sps;
				},
				failed : function(){
					if(errorCallback){
						errorCallback();
					}else{
						console.error("[ERROR]: call addFavModel occurs wrong!");
					}
					delete sps;
				},
				saving : function(){
					//console.log("this.spsession.addNode saving");
				}
			};
			
			sps.addNode(addArgs);
		}
	}
	
	/**@brief addFavPreview 收藏的效果图
	   @param previewpath ： 收藏的效果图的路径 // "/content/previewlib/scenexxxx"
	   @param callback ： 执行成功的回调函数
	   @param errorCallback ： 执行失败的回调函数，可选
	**/
	retClass.addFavPreview = function(previewpath, callback, errorCallback){
		// 参数判定
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(!previewpath){
			console.error("[ERROR]:previewpath is undefined!");
			return;
		}
		if(!callback||typeof callback != "function"){
			console.error("[ERROR]:callback is undefined!");
			return;
		}
		var userpath = "/content/users/" + userId;
		lang.hitch(this, hasFolder(
			userpath, 
			function(){
				//args["success"]();
				doAddFavPreview();
			},
			function(){
				console.log("[INFO]: the path is't exist!");
				createFavourite(
					userpath, 
					function(){
						doAddFavPreview();
					},
					function(){
						console.error("[ERROR]: call createFavourite occurs down!");
						return;
					}
				);
			})
		);
		
		function doAddFavPreview(){
			var favpath = userpath + "/favourite";
			
			var sps = new spsession(favpath);
			var favpreview = "preview/" + Spolo.CreateNodeName("favpreview");
			var resourceName = previewpath.substring(previewpath.lastIndexOf("/")+1);
			var addArgs = {
				nodePath : favpreview,
				property : { 
					previewpath : previewpath, 
					resourceName : resourceName,
					"sling:resourceType" : "preview"
				},
				success : function(){
					callback();
					delete sps;
				},
				failed : function(){
					if(errorCallback){
						errorCallback();
					}else{
						console.error("[ERROR]: call AddFavPreview occurs wrong!");
					}
					delete sps;
				},
				saving : function(){
					//console.log("this.spsession.addNode saving");
				}
			};
			
			sps.addNode(addArgs);
		}
	}
	
	/**@brief delFavModel : 删除收藏的模型珍品
	   @param refpath ： 收藏的模型的真实路径，即modelpath 属性
       @param callback ： 成功的回调函数，无参数
       @param errorCallback ： (optional) 失败的回调函数	   
	**/
	retClass.delFavModel = function(refpath, callback, errorCallback){
		// 参数的判断
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		
		if(!refpath){
			console.error("[ERROR]: refpath is undefined!");
			return;
		}
		if(!callback|| typeof callback != "function"){
			cosnole.error("[ERROR]: callback is undefined!");
			return;
		}
		
		// 调用公共方法 deleteFavs
		lang.hitch(this, deleteFavs(
			"model",
			refpath,
			function(){
				callback();
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call delFavModel occurs error!" + error);
				return;
			}
		));
		
	}
	
	/**@brief delFavPreview : 删除收藏的效果图珍品
	   @param refpath ： 收藏的效果图的真实路径，即previewpath 属性
       @param callback ： 成功的回调函数，无参数
       @param errorCallback ： (optional) 失败的回调函数	   
	**/
	retClass.delFavPreview = function(refpath, callback, errorCallback){
		// 参数的判断
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		
		if(!refpath){
			console.error("[ERROR]: refpath is undefined!");
			return;
		}
		if(!callback|| typeof callback != "function"){
			cosnole.error("[ERROR]: callback is undefined!");
			return;
		}
		
		// 删除收藏的珍品
		// 调用公共方法 deleteFavs
		lang.hitch(this, deleteFavs(
			"preview",
			refpath,
			function(){
				callback();
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call delFavPreview occurs error!" + error);
				return;
			}
		));
		
	}
	
	/**@brief getAllFavPreviews 获取所有的收藏的模型
	   @param args : JSON 格式参数
			@code{.js}
				var args = {
					value : "", 	// 查询条件
					limit : "10",
					offset : "0",
					success ：function(){},
					failed ：function(){},// optional
				}
			@endcode
	**/
	retClass.getAllFavPreviews = function(args){
		// 参数判定
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(!args["limit"]||!args["offset"]||!args["success"]){
			console.error("[ERROR]: args['limit'] or args['offset'] or args['success'] is undefined!");
			return;
		}
		
		var userpath = "/content/users/" + userId;
		lang.hitch(this, hasFolder(
			userpath, 
			function(){
				//args["success"]();
				doSearch();
			},
			function(){
				console.log("[INFO]: the path is't exist!");
				createFavourite(
					userpath, 
					function(){
						doSearch();
					},
					function(){
						console.error("[ERROR]: call createFavourite occurs down!");
						return;
					}
				);
			})
		);
		
		
		function doSearch(){
			// 参数的获取
			var favpath = "/content/users/" + userId + "/favourite";
			var limit = args["limit"];
			var offset = args["offset"];
			
			var url = favpath + ".favourite";
			var data = {};
			data["type"] = "preview";
			data["start"] = offset;
			data["length"] = limit;
			if(typeof args["value"] != "undefined"){
				var value = args["value"];
				value = value.replace(/(^\s*)|(\s*$)/g, "");
				if(value!=""){
					data["value"] = args["value"];
				}
			}
			// 发送ajax 请求
			xhr(url,{
				handleAs : "json",
				method : "GET",
				query : data
			}).then(
				function(data){
					//console.log("load");
					//console.log(data);
					if(typeof(data) == "object" && data["count"]>=0){
						var totalNum = data["count"];
						delete data["count"];
						var data = data["data"];
						args["success"](data, totalNum);
					}
				},
				function(error){
					if(args["failed"]||typeof args["failed"]== "function"){
						args["failed"](error);
						return;
					}else{
						console.error("[ERROR]: call getAllFavPreviews occurs wrong! " + error);
						return;
					}
				}
			);
		}
		
	}
	
	/**@brief getAllFavModels 获取所有的收藏的模型
	   @param args : JSON 格式参数
			@code{.js}
				var args = {
					value : "",		// 搜索keyvalue
					limit : "10",
					offset : "0",
					success ：function(){},
					failed ：function(){}
				}
			@endcode
	**/
	retClass.getAllFavModels = function(args){
		// 参数判定
		var userId = Spolo.getUserId();
		if(userId=="anonymous"){
			console.error("[ERROR]:the session is failed, please login again!");
			return;
		}
		if(!args["limit"]||!args["offset"]||!args["success"]){
			console.error("[ERROR]: args['limit'] or args['offset'] or args['success'] is undefined!");
			return;
		}
		
		var userpath = "/content/users/" + userId;
		lang.hitch(this, hasFolder(
			userpath, 
			function(){
				//args["success"]();
				doSearch();
			},
			function(){
				console.log("[INFO]: the path is't exist!");
				createFavourite(
					userpath, 
					function(){
						doSearch();
					},
					function(){
						console.error("[ERROR]: call createFavourite occurs down!");
						return;
					}
				);
			})
		);
		
		function doSearch(){
			var favpath = "/content/users/" + userId + "/favourite";
		
			var limit = args["limit"];
			var offset = args["offset"];
			//测试查询方法query
			
			var url = favpath + ".favourite";
			var data = {};
			data["type"] = "model";
			data["start"] = offset;
			data["length"] = limit;
			if(typeof args["value"] != "undefined"){
				var value = args["value"];
				value = value.replace(/(^\s*)|(\s*$)/g, "");
				if(value!=""){
					data["value"] = args["value"];
				}
			}
			// 发送ajax 请求
			xhr(url,{
				handleAs : "json",
				method : "GET",
				query : data
			}).then(
				function(data){
					//console.log("load");
					//console.log(data);
					if(typeof(data) == "object" && data["count"]>=0){
						var totalNum = data["count"];
						delete data["count"];
						var data = data["data"];
						args["success"](data, totalNum);
					}
				},
				function(error){
					if(args["failed"]||typeof args["failed"]== "function"){
						args["failed"](error);
						return;
					}else{
						console.error("[ERROR]: call getAllFavPreviews occurs wrong! " + error);
						return;
					}
				}
			);
		
		}
			
	}
	
	/**@brief isFavModel 判断是否已经收藏了此模型
	   @param modelpath :　传入的模型路径 // /content/modellib/modelxxx
	   @param callback :　 成功的回调函数，其中的参数为boolean ：true or false
	   @param errorCallback ： 失败的回调函数（optional）
	**/
	retClass.isFavModel = function(modelpath, callback, errorCallback){
		// 参数判定
		if(typeof modelpath == "undefined"){
			console.error("[ERROR]: modelpath is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function");
			return;
		}
		// 调用私用方法 isFaved
		lang.hitch(this, isFaved(
			"model",
			modelpath,
			function(isFaved){
				callback(isFaved);
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call isFavModel failed!" + error);
				return;
			}
		));
	}
	
	/**@brief isFavPreview 判断是否已经收藏了此效果图
	   @param previewpath :　传入的效果图路径 // /content/previewlib/scenexxx
	   @param callback :　 成功的回调函数，其中的参数为boolean ：true or false
	   @param errorCallback ： 失败的回调函数（optional）
	**/
	retClass.isFavPreview = function(previewpath, callback, errorCallback){
		// 参数判定
		if(typeof previewpath == "undefined"){
			console.error("[ERROR]: previewpath is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function");
			return;
		}
		// 调用私用方法 isFaved
		lang.hitch(this, isFaved(
			"preview",
			previewpath,
			function(isFaved){
				callback(isFaved);
			},
			function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call isFavPreview failed!" + error);
				return;
			}
		));
	}
	return retClass;
})