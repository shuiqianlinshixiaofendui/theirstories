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

/**
* Moudle: material
*/

define("spolo/data/material",
[
	"dojo/_base/declare", 
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/spobject",
	"spolo/data/spnode",
	"spolo/data/spsession",
	"spolo/data/queryClass",
	"spolo/data/history",
	"spolo/data/folder",
	"spolo/data/util/image"
],
function(
	declare,
	xhr,
	lang,
	spobject, 
	spnode,
	spsession,
	queryClass,
	history_cls,
	folder_cls,
	image_cls
){

	var ret_class = declare("spolo.data.material",[spobject], {
	
		constructor : function(path)
		{
			this.ref = null;
			this.path = path;
		},
		
		/**@brief download : 下载材质
		**/
		download : function(){
			var url = this.spnode.getFullpath();
			url += ".download";
			
			require(["dojo/request/iframe"], function(ioIframe){
				var dframe = "SPdownloadMATERIALIframe"; 
				var iframe = ioIframe.create(dframe);
				ioIframe.setSrc(iframe, url, true);
			});	
		},
		
		/**@brief update : 上传一个material
		   @param formID : form 表单ID
		   @param option ： JSON 格式的参数
				@code{.js}
					var option = {
						name : "", // 材质名称
						type : "", // 材质分类
						keyInfo : "",       // 关键字
						introduction : "" , // 材质描述
						load : function(data){},	// 成功的回调函数
						error : function(error){}   // 失败的回调函数
					
					}
				@endcode
		**/
		update : function(formID, option){
			// 参数判断
			if(!formID){
				console.error("[ERROR]: formID is undefined!");
				return;
			}
			if(!option){
				console.error("[ERROR]: option is undefined!");
				return;
			}
			if(!option.name){
				console.error("[ERROR]: option.name is undefined!");
				return;
			}
			
			if(!option.load || typeof option.load != "function"){
				console.error("[ERROR]: option.load is undefined! or not function!");
			}
			// require iframe
			require(["dojo/request/iframe","dojo/dom"], 
				lang.hitch(this,function(iframe,dom){
					var data = {};
					var handleAs = "json";
					data["useNginx"] = true;
					var notify_func_name = null;
					//指定了通知notifier并且不支持断点上传.
					if(option && option.notifier && !option.resumable )
					{
						data["useNginx"] = false;
						if(typeof option.notifier == "function")
						{
							notify_func_name = "_sp_material_notifier_" + notifier_seq;
							notifier_seq++;
							window[notify_func_name] = function(msg){
								option.notifier(msg);
							}
							data["notifier"] = "window.parent." + notify_func_name;
						}else{
							data["notifier"] = "window.parent." + option.notifier;
						}
					}
					
					if(option && option.debug)
					{
						data["debug"] = option.debug;
						handleAs = "text";
					}
					
					if(option && option.handleAs)
					{
						handleAs = option.handleAs;
					}
					
					var	url;
					
					if(data["useNginx"])
					{//使用nginx.
						url = "/upload";
						data["spi_target"] = this.path + ".update";
					}else{
						url = this.path + ".update";
					}
					
					data["matname"] = option.name;
					
					if(option && typeof option.type != "undefined"){
						data["mattype"] = option.type;
					}
					
					if(option && typeof option.keyInfo != "undefined"){
						var keyInfo = option.keyInfo;
						keyInfo = Spolo.inputEncode(keyInfo);
						data["keyInfo"] = keyInfo;
					}
					
					if(option && typeof option.introduction != "undefined"){
						var introduction = option.introduction;
						introduction = Spolo.inputEncode(introduction);
						data["introduction"] = introduction;
					}
					
					iframe(url,{
						form: dom.byId(formID),
						method : "POST",
						data : data,
						handleAs: handleAs
					}).then(
						function(data){
						
							if(notify_func_name)
								delete window[notify_func_name];
							// 成功的回调函数
							option.load(data);
						
						},
						function(error){
							if(notify_func_name)
								delete window[notify_func_name];
							if(option && option.error && typeof option.error == "function")
							{
								option.error(error);
								return;
							}
							console.error("[ERROR]: call createMaterial occurs error" + error);
							return;
						}
					
					);// iframe end
				})// dojohitch end
			);// require end	
		}
		
	});	
	
	/**@brief getInfo : 获取材质的相信信息
	   @param args : JSON 格式的参数
			@code{.js}
				var args = {
					path : "/content/material/materialxxx", 	// 材质路径
					separator : "",								// 材质多级分类之间的分割符
					success : function(json){},					// 成功的回调函数,参数为获取的信息
					failed : function(error){}					// 失败的回调函数 (optional)
				}
			@endcode
	**/
	ret_class.getInfo = function(args){
		// 参数判断
		if(!args["path"]){
			console.error("[ERROR]: args['path'] is undefined!");
			return;
		}
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined or not function!");
			return;
		}
		
		if(!args["separator"]){
			var separator = ">>";	
		}else{
			var separator = args["separator"];
		}
		
		
		var path = args["path"];
		var spss = new spsession(path);
		var node = spss.getRootNode();
		
		// 通过spsession 和spnode 获取信息
		node.ensureData({
			success : function(spnode){
				// 资源名称
				var resourceName = spnode.getProperty("resourceName");
				// 简介
				var introduction = spnode.getProperty("introduction");
				if(typeof introduction != "undefined"){
					introduction = Spolo.inputDecode(introduction);
				}
				// 关键字
				var keyInfo = spnode.getProperty("keyInfo");
				if(typeof keyInfo != "undefined"){
					keyInfo = Spolo.inputDecode(keyInfo);
				}
				// 发布者
				var publishAuthor = spnode.getProperty("publishAuthor");
				if(!publishAuthor){
					publishAuthor = spnode.getProperty("jcr:createdBy");
				}
				// 发布时间
				var publishdate = spnode.getProperty("publishdate");
				if(!publishdate){
					publishdate = spnode.getProperty("jcr:created");
				}
				// 材质分类
				var categoryName = spnode.getProperty("categoryName");
				if(!categoryName){
					// 预览图
					var preview = path + ".preview";
					var infoJson = {
						"resourceName" : resourceName,
						"introduction" : introduction,
						"keyInfo" : keyInfo,
						"publishAuthor" : publishAuthor,
						"publishdate" : publishdate,
						"categoryName" : categoryName,
						"categoryPath" : "",
						"preview" : preview
					}
					args["success"](infoJson);
					delete spss;
					return;
				}else{

					var categoryPath = categoryName;
					
					folder_cls.getFullName({
						path : categoryPath,
						separator : separator,
						success : function(categoryName){
							// 预览图
							var preview = path + ".preview";
							var infoJson = {
								"resourceName" : resourceName,
								"introduction" : introduction,
								"keyInfo" : keyInfo,
								"publishAuthor" : publishAuthor,
								"publishdate" : publishdate,
								"categoryName" : categoryName,
								"categoryPath" : categoryPath,
								"preview" : preview
							}
							args["success"](infoJson);
							delete spss;
							return;
						},
						failed : function(error){
							if(args["failed"] && typeof args["failed"] == "function"){
								args["failed"](error);
								delete spss;
								return;
							}
							console.error("[INFO] call getInfo occurs error",error);
							delete spss;
							return;
						}
					});
					return;
				}
				
				
			},
			failed : function(error){
				if(args["failed"] && typeof args["failed"] == "function"){
					args["failed"](error);
					delete spss;
					return;
				}
				console.error("[INFO] call getInfo occurs error",error);
				delete spss;
				return;
			}
		});
	}
	
	return ret_class;
});
