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


// 定义数据操作模块 "spolo/data/spnode"

define("spolo/data/spnode",  
[
	"dojo/_base/declare"
],
function(
	declare
)
{	

	function getAbsPath(relPath){
		if(relPath)
			return this.jsonnode["sp::client::path"] +'/'+ relPath;
		else
			return this.jsonnode["sp::client::path"];
	}

	/**
		这里定义 spnode 的事件类型
	*/
    var retClass = declare("spolo/data/spnode",[ ],
	{	
		
		/**
			@brief 构造一个 spnode 对象
			@param spsession 对象
			@param 可以是一个 relPath ，也可以直接是一个 jsonnode
			
		*/
		constructor : function(spsession, param){
		
			// 保存了 spsession 对象。
			this.spsession = spsession;
			
			// 保存了 jsonnode 对象。
			if(typeof(param)=="object"){
				this.jsonnode = param;
			}else{
				this.jsonnode = this.spsession.getJsonNode(relPath);
			}
			
			// 保存了 spobject 对象。
			this.spobject = null;
			
			// 保存当前节点的名称
			this.nodeName = null;

		},
		
		/**
			@brief 获取操作当前节点的 spsession
		*/
		getSession : function()
		{
			return this.spsession;
		},
		
		/**	@brief 在当前节点指定相对路径下添加一个节点。
			@param args = {
				nodePath : "tddata001",
				property : {
					resName : "新场景11", 
					author : "管理员11", 
					price : 111000, 
					tdName : "donwww" 
				},
				replaceExist: false
			}
			@return 当前节点
		*/
		addNode : function(args)
		{
			var absPath = getAbsPath.call(this, args["nodePath"]);
			args["nodePath"] = absPath;
			return this.spsession.addNode(args);
		},
		
		/**	@brief 删除指定路径下的节点
		*/
		removeNode : function(relPath){
			var absPath = getAbsPath.call(this, relPath);
			this.spsession.removeNode(absPath);
			return this;
		},
		
		/**	@brief 从节点下的指定相对路径中获取一个 spnode 
			@param jsonArgs : 包含 : relPath 相对路径 , 回调函数:sucess , failed , loading 
		*/
		getNode : function(relPath , successFunc , failedFunc ,  loadingFunc )
		{
			var absPath = getAbsPath.call(this, relPath);
			return this.spsession.getNode(absPath , successFunc , failedFunc , loadingFunc );
		},
		
		/**	@brief 
			
		*/
		getNodes : function(relPath)
		{
			var absPath = getAbsPath.call(this, relPath);
			return this.spsession.getNodes(absPath);
		},
		
		/**	@brief	确定当前节点的数据是否被加载；
				如果加载了直接从缓存中返回
				如果没加载则从服务端jcr中加载
			@param jsonArgs = {
				ignoreCache : false,
				success : function(){},
				failed : function(){},
				loading : function(){}
			}
		*/
		ensureData : function(jsonArgs)
		{
			jsonArgs["spnode"] = this;
			this.spsession.ensureNode(jsonArgs);
		},
		
		/** @brief 设置当前节点忽略缓存
		**/
		ignoreCache : function(){
			this["jsonnode"]["sp::client::dataState"] = 0;
			var jsonnode = this["jsonnode"];
			for(var i in jsonnode){
				if(i.indexOf("sp::client::")<0){
					delete jsonnode[i];
				}
			}
		},
		
		/** @brief 	从当前节点得到 JSON 格式的数据
		*/
		getJson : function()
		{
			return this.spsession.getJSONFromNode(this);
		},
		
		/**	@brief	获取当前节点的所有子节点
			@return	子节点都是原生的 jcr 格式
		**/
		getNodesJson : function()
		{
			return this.spsession.getNodesJsonFromNode(this);
		},
		
		/**	@brief	判断指定路径下的节点是否存在
			@param args = {
						nodePath: "",
						existed : function(){
						},
						notExist : function(){
						},
						checking : function(){
						}
					};
		*/
		hasNode : function(args)
		{
			var relPath = args["nodePath"];
			var absPath = getAbsPath.call(this, relPath);
			args["absPath"] = absPath;
			this.spsession.hasNode(args);
		},
		
		/** @brief	获取当前节点的指定属性值
				下面的同步方法调用者调用之前需要确保node已经ensure.
		**/
		getProperty : function(propname)
		{
			return this.jsonnode[propname];
		},
		
		/**	@brief	修改当前节点的属性值
			
		*/
		setProperty : function(propName, value)
		{
			var args = {
				spnode: this,
				propertyName: propName,
				value : value
			};
			this.spsession.setProperty(args);
		},
		
		/**	@brief	检查节点的指定属性是否存在
				下面的同步方法调用者调用之前需要确保node已经ensure.
		*/
		hasProperty : function(propName)
		{
			if(this.jsonnode[propname])
				return true;
			else
				return false;
		},
		
		/**	@brief	获得当前节点的所有属性，包括子节点。
				调用者调用之前需要确保node已经ensure.
			@return 返回JSON格式
		**/
		getProperties : function()
		{
			return this.spsession.getJSONFromNode(this);
		},
		
		/**	@brief 获取当前数据节点的相对路径，相对于当前 spsession 的路径
		*/
		getPath : function()
		{
			return this.jsonnode["sp::client::path"];
		},
		
		/**	@brief 获取当前数据节点的全路径.
		*/
		getFullpath : function()
		{
			var rootPath = this.spsession.getPath();
			var nodePath = this.getPath();	// session 的根节点路径就是 session.rootPath
			if(rootPath == nodePath){	// 如果this.node就是session的根节点
				return rootPath;		// 直接返回根路径
			}else{
				return rootPath + "/" + nodePath;	// 否则根路径拼接当前节点的相对路径
			}
		},

		/**	@brief 得到当前节点名称
		*/
		getName : function()
		{
			return this.nodeName;
		},
		
		/** @brief 当前节点的数据是否已经有效。
		*/
		isDataValid : function()
		{
			return this.spsession.isDataValid(this);// == 2; //this.STATE_LOADED
		},
		
		isChildValid : function()
		{
			return this.spsession.isChildValid(this);// == 2; //this.STATE_LOADED
		},		
		
		/**	@brief 获取数据的加载状态，确定数据是否已经被加载
		// 返回值的可能结果查看静态方法部分。
		*/
		getState : function()
		{
			return this.jsonnode["sp::client::dataState"];
		},
		
		/**	@brief 保存节点
			TODO: 单独 save 当前节点
			@param args = {
				success : function(){
				},
				failed : function(){
				},
				saving : function(){
				}
			}
		*/
		save : function(args)
		{	
			this.spsession.save(args);
		},
		
		/**	@brief 获取对应资源的派生类对象。传入两个函数对象来获取
		* call resource.ensureData
		* callBy User
		* resHandler: CallBack function(resourceInstance, errorHandler)
		* onError: CallBack function(error)
		*/
		getSPObject : function(resHandler,onError)
		{
			// 已经获取了子节点。直接返回子节点数组。
			if(this.spobject)
			{
				resHandler(this.spobject);
				return;
			}
			else
			{	

				function onSuccess(node){
					// var dataType;
					// if(node["jsonnode"]){
						// dataType = node["jsonnode"]["sling:resourceType"];
					// } 
					// if(!dataType){
						// onError("sling:resourceType is undefined of this node");
						// return;
					// }

					// require(["spolo/data/"+dataType], dojo.hitch(this,function(res_type){ // 这里的 this 是传进来的当前这个 spnode
						// 这里直接把 spnode 传进去，让 spobject 可以直接使用 spnode
						// this.spobject = new res_type(this);
						// 执行UI层的回调函数			
						// resHandler(this.spobject);
					// }));
				}
				
				// this.ensure(dojo.hitch(this,onSuccess),onError);	// 这里的 this 是当前这个 spnode
			}
		},
		
		/**	@brief 删除当前数据中的某个属性
		*/
		removeProperty : function(propName)
		{
			this.spsession.removeProperty(this, propName);
		}
		
	});//dojo.declare
	
	
	/*****************************************
		下面是静态方法、属性
	******************************************/
	return retClass;  // 返回当前对象
	
});//define end