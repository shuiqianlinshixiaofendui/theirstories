/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/
 
// 在首页头部显示应用列表
define("modulemanager/action/navAction",["dojo/topic","dojo/domReady!","modulemanager/node/navItem"],function(topic,domReady,navItem){

	// 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = dojo.declare("modulemanager/action/navAction",[],
	{
		/**
		* 资源管理对象构造函数:根据所传入的路径来构建资源
		*/
		constructor : function(){
		}
		
	});//dojo.declare end
	/**
	* 订阅nav初始化事件
	*/
	topic.subscribe("modulemanager/node/navigator/ready",function(nav){
		/**
		*获取相关API类对象
		*/
		var users = Spolo.getCurrentUser();
		var modules = Spolo.getModules();
		//初始化用户应用数据
		var tmpModuleList = {};
		//获取所有系统应用
		modules.getSysModules(function(moduleItem){
			//通过系统应用json数据获取用户应用
			users.getModules(moduleItem,function(usetAppItem){
				for(var i in usetAppItem){
					var module = usetAppItem[i];
					//用户应用数据
					tmpModuleList[i] = ({
						"name": module.resourceName || module.name,
						"description": module.description || "",
						"id": module.url,
						"icon": "/modules/"+module.url+"/images/icon.png"
					});
				}
				//发布执行初始化navItem消息
				topic.publish("modulemanager/node/navItem/init",nav,tmpModuleList);
			},function(){
				console.log("获取用户应用失败！");
				//发布执行初始化navItem消息
				topic.publish("modulemanager/node/navItem/init",nav,tmpModuleList);
			});
		},function(error){
			//不存在用户应用或是获取应用失败
			//发布执行初始化navItem消息
			topic.publish("modulemanager/node/navItem/init",nav,tmpModuleList);
		});
	});
	/**
	* 订阅执行初始化navItem消息
	*/
	topic.subscribe("modulemanager/node/navItem/init",function(nav,tmpModuleList){
		//nav初始化完毕，清空窗口中loading...的提示字符
		nav.container.set("content",""); 
		var item = new navItem(nav.id,tmpModuleList);	
	});
	
	/**
	* 返回当前dojo.declare
	*/
	return retClass; // 返回对象
});//define end