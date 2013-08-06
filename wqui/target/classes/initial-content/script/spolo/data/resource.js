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
 
 
/****************
    已废弃
*****************/
 
 
 
// 定义资源管理模块"spolo/data/resource"
define("spolo/data/resource",["dojo/_base/xhr"],function(xhr){ // json format

	var GLUE_CONST_ISFOLDER = 0;
	var GLUE_CONST_ISFILE = 1;
	var GLUE_CONST_IGNORE = 2;

	//全局变量GLUE_ResTypeMap保存了当前系统支持的全部资源类型的信息。
	var GLUE_ResTypeMap = {
		"scenelib" : {
			type : GLUE_CONST_ISFOLDER,
			icon : "/image/scenes.png"
		},
		"materiallib" : {
			type : GLUE_CONST_ISFILE,
			icon : "/image/scenes.png"
		},
		"x3dlib" : {
			type : GLUE_CONST_ISFILE,
			icon : "/image/scenes.png"
		}
	};
	
	//resource state:
	
	var RES_UNLOAD = 0;
	var RES_SELF_LOADED = 1;
	var RES_CHILD_LOADED = 2;
	var RES_DETAIL_LOADED = 3;
	
	/** 将json 文件里的数据(from jcr)合并进入resource对象中。
	*	本方法为resource的私有方法。
	*	请使用mergetData.call(this,jsonData)来调用。
	*/
	function mergeData(json_data)
	{
		var res = this;
		// 解析json文件内容（对应的jcr中的<K,V>属性），构建资源对象。（属性的顺序是按照创建的顺序所排列的）

		for(var i in json_data)		
		{
			//isChild记录了json_data[i]是否是一个孩子节点数据的逻辑值。
			var isChild = false;	// 先假设属性不是子节点

			if(typeof json_data[i] == "object") // "Everything" in JavaScript is an Object
			{
				var child = json_data[i];
				var slingResType = child["sling:resourceType"];
				var glueResInfo;
				
				if(slingResType)// sling:resourceType 特殊处理
				{
					glueResInfo = GLUE_ResTypeMap[slingResType];
				}else{
					//glueResInfo = getMineTypeFromExt(child,i);
					//根据后缀设置当前child的"sling:resourceType",这方便后续计算(上下文菜单等).
					//child["sling:resourceType"] = glueResInfo.cls;
				}
				if(glueResInfo && glueResInfo.type != GLUE_CONST_IGNORE)
				{
					//TODO: 这里添加类型信息。
					var child_res = new retClass(res.path + "/" + i);
					dojo.mixin(child_res,json_data[i]);
					//child.isFolder = (glueResInfo.type == GLUE_CONST_ISFOLDER);
					child_res.name = i;
					if(child["sp:name"])
						child_res.name = child["sp:name"];
					res.children.push(child_res);
					if(res.sp_loaded_state < RES_SELF_LOADED)
						res.sp_loaded_state = RES_SELF_LOADED;
					isChild = true;
				}
				//else
				// {
					// alert("no information about type '" + child["sling:resourceType"] + "',please modify script/spolo/page/resinfo.js");
				// }
			}
			
			// 当前属性不是一个子节点。将其加入到当前资源对象里。
			if(!isChild)
			{
				res[i] = json_data[i];
			}
		}
		
		if(res.sp_loaded_state < RES_CHILD_LOADED)
			res.sp_loaded_state = RES_CHILD_LOADED;
	}

	// 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = dojo.declare("spolo/data/resource",[],
	{ // json format
	
		res : null,
		
		/**
		* 资源管理对象构造函数:根据所传入的路径来构建资源
		*/
		constructor : function(path){
			res = this;
			res.path = path; 					// 用来指定要加载的资源路径
			res.children = []; 				// 子节点集合，先设置为空集
			res.name = "";  					// 节点名称
			res.sp_detail = null; 				// 加载的实际资源

			
			/**sp_loaded分为如下几个等级。我们使用四个等级顺序来判断加载阶段:
			0: 未加载: RES_UNLOAD
			1: 从父节点中加载,已经具有了第一级属性，但是没有子节点属性。 RES_SELF_LOADED
			2: 从当前节点加载,除了1,还具有一级节点属性。 RES_CHILD_LOADED
			3: detail对象已经被创建。 RES_DETAIL_LOADED
			4+: 由detail对象规定。
			**/
			this.sp_loaded_state = RES_UNLOAD; 	// 初始化的加载阶段标识
		},
		
		xhrJsonGet : function(successHandler,errorHandler){
			dojo.xhrGet(
				{
					url:this.path + ".1.json", 		// 资源以json对象表示。
					handleAs: "json",				// 返回的对象作为json处理
					load:successHandler,			// load_success_handler
					error:function(error)			// load_fail_handler
					{								
						errorHandler(error.message)
					}
				}
			);
		},
		
		xhrJsonPost : function(info,successHandler,errorHandler){
			xhr.post(
				{
					url:this.path, 			// 资源以json对象表示。
					load:successHandler,			// load_success_handler
					error:function(error)			// load_fail_handler
					{								
						errorHandler(error.message)
					},
					content:info,
					// sync:false
				}
			);
		},
		
		/**
		* 获取当前资源节点的名称
		*/
		getName : function()
		{
			var resourceName = null;
			if(res["resourceName"])
			{
				resourceName = res["resourceName"];
			}
			else
			{
				var nameObj = res.path.split("/");
				resourceName = nameObj[nameObj.length - 1];
			}
			return resourceName;
		},
		
		/**
		* 设置当前资源节点的名称
		*/
		setName : function(name)
		{
			if(name != null && name != undefined)
			{
				function onSuccess(data) {
					// console.log("setName successful");
				}
				function onError(error){
					alert(error);
				}
				var info = {
					"resourceName" : name
				}
				this.xhrJsonPost(info,onSuccess,onError)
				
			}
		},
		
		/**
		* 获取当前资源的URI
		*/
		getURI : function()
		{
			return res.path;
		},
		
		/**
		* 获取基类，如果没有指定，返回空字符串
		*/
		getSuperType : function()
		{
			var superType = null;
			if(res["sling:resourceSuperType"])
			{
				superType = res["sling:resourceSuperType"];
			}
			return superType;
		},
		
		/**
		* 设置基类。
		*/
		setSuperType : function(superTypeString)
		{
			if(superTypeString != null && superTypeString != undefined)
			{
				function onSuccess(data) {
					// console.log("setSuperType successful");
				}
				function onError(error){
					alert(error);
				}
				var info = {
					"sling:resourceSuperType" : superTypeString
				}
				this.xhrJsonPost(info,onSuccess,onError)
			}
		},
		
		
		/**
		* 获取当前资源节点的创建时间.
		*/
		getDate : function(){
			var dateString = null;
			if(res["jcr:created"])
			{
				var date = res["jcr:created"]
				var dateObj = new Date(Date.parse(date));
				return dateObj;
			}
			return dateString;
		},
		
		/**
		* 获取当前资源节点的类型.
		*/
		getType : function(){
			var type = null;
			if(res["sling:resourceType"])
			{
				type = res["sling:resourceType"];
			}
			return type;
		},
		
		/**
		* 设置基类。
		*/
		setType : function(resTypeString)
		{
			if(resTypeString != null && resTypeString != undefined)
			{
				function onSuccess(data) {
					// console.log("setType successful");
				}
				function onError(error){
					alert(error);
				}
				var info = {
					"sling:resourceType" : resTypeString
				}
				this.xhrJsonPost(info,onSuccess,onError)
			}
		},
		
		/**
		* 获取当前资源节点的创建者信息.
		*/
		getCreatedBy : function(){
			var createdby = null;
			if(res["jcr:createdBy"])
			{
				createdby = res["jcr:createdBy"];
			}
			return createdby;
		},
		
		/**
		* 判断当前资源节点是否为一个目录
		*/
		isFolder : function()
		{
			var flag = false;
			var type = res.getType();
			if(type == "folder")
			{
				flag = true;
			}
			return flag;
		},
		
		/**
		* 返回当前对象是否已经被加载。如果已经被加载，getType,getName,getCreatedBy,getDate等方法有效。
		*/
		isLoaded : function(item)
		{
			//TODO
		},
			
		/**
		* 删除当前节点
		*/
		remove : function()
		{
			function onSuccess(data) {
				// console.log("remove successful");
			}
			function onError(error){
				alert(error);
			}
			var info = {
				":operation" : "delete"
			}
			this.xhrJsonPost(info,onSuccess,onError)
		},
		
		/**
		* 确保当前资源节点的数据已经加载完毕。
		* call resource.mergeData
		* callBy resource.getDetail
		* resHandler: function(resourceInstance, errorHandler)
		* onError: function(error)
		*/
		ensureData : function(resHandler,onError)
		{
			if(res.sp_loaded_state >= RES_SELF_LOADED) // 从父节点中加载,已经具有了第一级属性。
			{
				resHandler(res);
				return;
			}
			
			// 属性没有加载完成，那么加载它。
			// console.log("resource ---- check Date");
			
			// 使用Ajax xmlHTTPRequest去加载资源。
			function onSuccess(data){		// load_success_handler
				// console.log(data);	
				mergeData.call(res,data);						
				resHandler(res);
			}
			
			this.xhrJsonGet(onSuccess,onError);
			
		},
		
		/**
		* 获取对应资源的派生类对象。传入两个函数对象来获取
		* call resource.ensureData
		* callBy User
		* resHandler: CallBack function(resourceInstance, errorHandler)
		* onError: CallBack function(error)
		*/
		getDetail : function(resHandler,onError)
		{
			// 已经获取了子节点。直接返回子节点数组。
			if(this.sp_loaded_state >= RES_DETAIL_LOADED)
			{
				resHandler(this.sp_detail);
				return;
			}
			else
			{
				// 尚未获取子节点的情况下
				function onSuccess(data){ // 当资源加载后
					var dataType = data.getType();
					require(["spolo/data/" + dataType], function(res_type){ // 当确定资源类型后
					
						this.sp_detail = new res_type(data);
						
						if(this.sp_loaded_state < RES_DETAIL_LOADED)
							this.sp_loaded_state = RES_DETAIL_LOADED;
							
						resHandler(this.sp_detail);
					} );
				};
				this.ensureData(onSuccess,onError); 
			}
		}
		
	});//dojo.declare
	
	/**
	* 返回当前类型菜单数据
	*/
	retClass.getCommandData = function(resTypeString){
		//TODO:
	
	}
	return retClass; // 返回资源对象
});//define end