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
 
// 在首页头部显示应用列表/导航菜单
define("modulemanager/node/navigator",
	["dojo/query","dojo/dom", "dijit/layout/ContentPane", "dojo/topic", "dojo/domReady!", "dijit/registry"],
	function(query, dom, ContentPane, topic, domReady, registry){
	
	// 
    var retClass = dojo.declare("modulemanager/node/navigator",[],
	{
	
		/**
		* @brief 构造方法，初始化 navigator 组件
		*/
		constructor : function(containerID){
			
			this.displayMaxNum = 8;
			
			this.id = "_sp_navigator";
			this.region = "top";
			this.style = "height:30px; background:#333; padding:0px; border:none; overflow:hidden;";
			this.initContent = "loading...";
			
			this.parent = registry.byId(containerID);
			
			// 初始化 navigator 的容器
			this.container = new ContentPane({
				id: this.id,
				region: this.region,
				style: this.style,
				content: this.initContent
			});
			this.parent.addChild(this.container);
			
			// 发出初始化完毕的消息
			topic.publish("modulemanager/node/navigator/ready",this);
		},
		
		/**
			@brief 
		*/
		
		
	});//dojo.declare end
	
	/**
	* 返回当前dojo.declare
	*/
	return retClass; // 返回对象
});//define end