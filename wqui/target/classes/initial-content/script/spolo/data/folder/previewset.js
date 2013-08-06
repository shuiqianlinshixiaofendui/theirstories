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
 
define("spolo/data/folder/previewset",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/spsession",
	"spolo/data/queryClass",	
	"spolo/data/folder",
	"spolo/data/util/image"
],
function(
	declare, 
	xhr,
	lang,
	spsession,
	queryClass,
	folder,
	image_cls
)
{
	var retClass = declare("spolo.data.folder.previewset", [folder], {
	
		constructor : function(path)
		{
			// 此处的path 为/content/previewlib/scenexxx 或者是 /content/users/userxx/previewlib/scenexx
			this.ref = null;
			this.path = path;
		},
		
		/**@brief createPreview : 上传一张效果图到效果图集下
		   @param formID : 表单名称
		   @param option ： JSON 格式的参数
				@code{.js}
					var option = {
						load : function(data){},  // 成功的回调函数
						error : function(error){} // 失败的回调函数(optional)
					}
				@endcode
		**/
		createPreview : function(formID, option){
			
			require(["dojo/request/iframe","dojo/dom"], 
				lang.hitch(
					this,
					function(ioIframe,dom){
						var content = {};
						var handleAs = "json";
						content["useNginx"] = true;
						
						if(option && option.filename){
							content["filename"] = option.filename;
						}
						
						
						
						
						
						if(option && option.handleAs)
						{
							handleAs = option.handleAs;
						}
						
						
						var	url = this.spnode.getFullpath() + ".createPreview";
						// alert(url);
						// alert(option.load);
						// alert(dom.byId(formID));
						
						
						ioIframe(url,{
							form: dom.byId(formID),
							method : "POST",
							data : content,
							handleAs: handleAs
						}).then(
						
							function(data){
								
								if(option && option.load && typeof option.load == "function")
								{
									option.load(data);
									return;
								}
								console.error("[ERROR]: option.load is undefined ! or not function!");
								return;
							},
							
							function(error){
								
								if(option && option.error && typeof option.error == "function")
								{
									option.error(error);
									return;
								}
								console.error("[ERROR]: call createPreview occurs error!"+ error);
								return;
							}
						);// iframe end
					}// function end
				)// lang hitch end
			);// require end
		}
		
	});	

	/**@brief getAllPreviews : 获取当前效果图集的所有效果图 
	   @param args : JSON 格式的参数
			@code{.js}
				var args = {
					path ： "/content/previewlib/scenexxx", //效果图集路径 
					limit : "4",  // 每页长度,(optional)
					offset ："0", // 偏移量,(optional)
					orderDesc : "jcr:created", // 按照时间降序排列, (optional) 与orderAsc 二选一
					orderAsc : "",			   // 按照时间升序排列, (optional) 与orderDesc 二选一
					success : function(data){} , // 成功的回调函数,参数为数组形式的效果图路径
					failed : function(err){},	 // 失败的回调函数,(optional)	
				}
			@endcode
	**/
	retClass.getAllPreviews = function(args){
		// 参数判断
		if(!args["path"]){
			console.error("[ERROR]:args['path'] is undefined!");
			return;
		}else{
			var path = args["path"];
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined! or not function!");
			return;
		}
		
		// limit = -1 查询全部
		if(typeof args["limit"] == "undefined"){
			
			var limit = -1;			
		}else{
			var limit = args["limit"];
		}
		if(typeof args["offset"] == "undefined"){
		
			var offset = 0;
		
		}else{
			var offset = args["offset"];
		}
		
		// 查询参数
		var queryArgs = {
			nodePath : path,
			fuzzyProperties : {
				"sling:resourceType" : "preview"
			},
			limit : limit,
			offset : offset,
			load : function(data){
				if(typeof data == "object" && data["totalNum"] >= 0){
					
					var pathArray = [];
					var totalNum = data["totalNum"];
					var data = data["data"];
					for(var path in data){
						var imgpath = path + ".image";
						// var imgpath = path;
						// imagepath = image_cls.convert({
							// "path" : imagepath,
							// "width" : 235,
							// "height" : 235
							
						// });
						pathArray.push(imgpath);
					}
					
					args["success"](pathArray, totalNum);
					return;
				}
			},
			error : function(error){
				if(args["failed"] && typeof args["failed"]=="function"){
					args["failed"](error);
					return;
				}
				console.error("[ERROR]: call getAllPreviews occurs error"+error);
				return;
					
			}
		};
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
			queryArgs["orderDesc"] = "jcr:created";
		}
		// 执行查询
		queryClass.query(queryArgs);
	}
	
	/**@brief getInfo 获取效果图集的属性信息
	   @param path : 效果图集路径 /content/previewlib/scenexxx
       @param callback : 成功的回调函数, 参数是json 格式的对象
       @param errorCallback : 失败的回调函数(optional)	   
	**/
	retClass.getInfo = function(path, callback, errorCallback){
		
		// 参数判断
		if(!path){
			console.error("[ERROR]: path is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		
		// 使用spnode 和spsession 获取信息
		var spss = new spsession(path);
		var node = spss.getRootNode();
		node.ensureData({
			success : function(spnode){
				
				// 分别获取信息
				var resourceName = spnode.getProperty("resourceName");
				var publishAuthor = spnode.getProperty("publishAuthor");
				if(!publishAuthor){
					publishAuthor = Spolo.getUserId();
				}
				var publishDate = spnode.getProperty("publishdate");
				if(!publishDate){
					publishDate = spnode.getProperty("jcr:created");
				}
				var previewCategory = spnode.getProperty("previewCategory");
				var introduction = spnode.getProperty("introduction");
				if(typeof introduction != "undefined"){
					introduction = Spolo.inputDecode(introduction);
				}
				var previewRoom = spnode.getProperty("previewRoom");
				var previewStyle = spnode.getProperty("previewStyle");
				
				// json 对象
				var jsonData = {};
				jsonData["resourceName"] = resourceName;
				jsonData["publishAuthor"] = publishAuthor;
				jsonData["publishDate"] = publishDate;
				jsonData["previewCategory"] = previewCategory;
				jsonData["introduction"] = introduction;
				jsonData["previewRoom"] = previewRoom;
				jsonData["previewStyle"] = previewStyle;
				
				// 成功的回调函数
				callback(jsonData);
				// 删除spsession
				delete spss;
			},
			failed : function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call getInfo occurs error !" + error);
				return;
			}
		});
	}
	return retClass;
})