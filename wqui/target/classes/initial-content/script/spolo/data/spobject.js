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
 
// 定义资源管理模块"spolo/data/resource"
define("spolo/data/spobject", 
[
	"dojo/_base/declare", "dojo/Evented",
	"spolo/data/spsession"
],
function(
	declare, Evented,
	spsession_class
)
{
	// 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = declare("spolo/data/spobject",[Evented], 
	{
		/**
		* 资源管理对象构造函数:根据所传入的路径来构建资源
		*/
		constructor : function(path, spsess, spnode){
			/*
				如果不指定第二个参数，则直接构建一个新的session对象。
				这里不对 UI 层暴露 spsession , 把spsession交给data层来维护。
				如果以后要把 spsession 修改为 page 级的，也就是整个页面中只有一个 spsession ，
				那么就在这个类中定义一个静态的 spsession 即可。
				如果指定了第三个参数，则 this.spnode 就为传入的 spnode
			*/
			
			if(typeof(spnode)=="object"){
				this.spnode = spnode;
				this.spsession = this.spnode.getSession();
			}else{
				if(typeof(spsess)=="object"){
					this.spsession = spsess;
				}else{
					if(path){
						this.spsession = new spsession_class(path);
					}else{
						throw("spobject constructor must have one parameter at least!");
					}
				}
				
				this.spnode = this.spsession.getRootNode();
			}

		},
		
		checkDataIsValid : function()
		{
			if(!this.getNode().isDataValid())
				throw("before you call this, you must call ensureData.");
		},

		/** @brief 确保当前spobject对象的数据被加载。
			参数含义同spnode中的jsonArgs.
		*/
		ensureData : function(jsonArgs){
			return this.spnode.ensureData(jsonArgs);
		},

		/** 获取当前资源节点的名称
		*/
		getName : function()
		{
			this.checkDataIsValid();
			var resourceName = this.getNode().getProperty("resourceName");
			if(!resourceName)
			{
				var nameObj = this.getNode().getPath().split("/");
				resourceName = nameObj[nameObj.length - 1];
			}
			return resourceName;
		},
		
		/** 设置当前资源节点的名称
		*/
		setName : function(name)
		{
			this.getNode().setProperty("resourceName",name);
		},
		
		/** 获得当前资源的数据节点
		*/
		getNode : function()
		{
			return this.spnode;
		},
		
		/**
		* 获取当前资源的URI
		*/
		getURI : function()
		{
			var session = this.getNode().getSession();
			var sessionPath = session.getPath()
			var spnodePath = this.getNode().getPath()
			
			var path = sessionPath + '/' + spnodePath;
			if(sessionPath == spnodePath)
			{
				path = sessionPath;
			}
			return path;
		},
		
		/**
		* 获取基类，如果没有指定，返回空字符串
		*/
		getSuperType : function()
		{
			this.checkDataIsValid();
			return this.getNode().getProperty("sling:resourceSuperType");
		},
		
		/**
		* 设置基类。
		*/
		setSuperType : function(superTypeString)
		{
			this.getNode().setProperty("sling:resourceSuperType",superTypeString);
		},
		
		/**
		* 获取当前资源节点的创建时间.
		*/
		getDate : function(){
			this.checkDataIsValid();
			var dateString = this.getNode().getProperty("jcr:created");
			if(dateString)
			{
				return Date.parse(dateString);
			}
			return dateString;
		},
		
		/**
		* 获取当前资源节点的类型.
		*/
		getType : function(){
			this.checkDataIsValid();
			return this.getNode().getProperty("sling:resourceType");
		},
		
		/**
		* 设置基类。
		*/
		setType : function(resTypeString)
		{
			return this.getNode().setProperty("sling:resourceType",resTypeString);
		},
		
		/**
		* 获取当前资源节点的jcr:primaryType.
		*/
		getPrimaryType : function(){
			this.checkDataIsValid();
			return this.getNode().getProperty("jcr:primaryType");
		},
		
		/**
		* 设置当前资源节点的jcr:primaryType.
		*/
		setPrimaryType : function(primaryTypeString)
		{
			return this.getNode().setProperty("jcr:primaryType",primaryTypeString);
		},
		
		/**
		* 获取当前资源节点的创建者信息.
		*/
		getCreatedBy : function(){
			this.checkDataIsValid();
			return this.getNode().getProperty("jcr:createdBy");
		},
		
		/**
		* 判断当前资源节点是否为一个目录
		*/
		isFolder : function()
		{
			this.checkDataIsValid();
			return (res.getType() == "folder");
		}
		
	});//dojo.declare

	return retClass; // 返回资源对象
});//define end