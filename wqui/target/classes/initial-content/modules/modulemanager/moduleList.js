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
define("modulemanager/moduleList",
	["dojo/query","dojo/on","dojo/mouse","dojo/dom-style","dijit/Tooltip","dijit/TooltipDialog","dijit/popup"],
	function(query, on, mouse, domStyle, Tooltip, TooltipDialog, popup){ 

	var tmpModuleList = {
		0 : {
			url : "/modules/resourcemanager/index0.html",
			label: "我的资源",
			icon : "/image/scenes.png"
		},
		1 : {
			url : "/modules/resourcemanager/index1.html",
			label: "我的场景",
			icon : "/image/scenes.png"
		},
		2 : {
			url : "/modules/resourcemanager/index2.html",
			label: "我的模型",
			icon : "/image/scenes.png"
		},
		3 : {
			url : "/modules/resourcemanager/index3.html",
			label: "云端模型库",
			icon : "/image/scenes.png"
		},
		4 : {
			url : "/modules/resourcemanager/index4.html",
			label: "我的好友",
			icon : "/image/scenes.png"
		},
		5 : {
			url : "/modules/resourcemanager/index5.html",
			label: "我的模型",
			icon : "/image/scenes.png"
		},
		6 : {
			url : "/modules/resourcemanager/index6.html",
			label: "云端模型库",
			icon : "/image/scenes.png"
		},
		7 : {
			url : "/modules/resourcemanager/index7.html",
			label: "我的好友",
			icon : "/image/scenes.png"
		},
		8 : {
			url : "/modules/resourcemanager/index8.html",
			label: "云端模型库",
			icon : "/image/scenes.png"
		},
		9 : {
			url : "/modules/resourcemanager/index9.html",
			label: "我的好友",
			icon : "/image/scenes.png"
		},
		10 : {
			url : "/modules/resourcemanager/index10.html",
			label: "我的模型",
			icon : "/image/scenes.png"
		},
		11 : {
			url : "/modules/resourcemanager/index11.html",
			label: "云端模型库",
			icon : "/image/scenes.png"
		},
		12 : {
			url : "/modules/resourcemanager/index12.html",
			label: "我的好友",
			icon : "/image/scenes.png"
		}
	};

	// 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = dojo.declare("modulemanager/moduleList",[],
	{ // json format
	
		/**
		* 资源管理对象构造函数:根据所传入的路径来构建资源
		*/
		constructor : function(containerID){
			this.displayMaxNum = 8;
			// TODO: get module list
			this.moduleList = tmpModuleList;
			// TODO: initialize module list
			this.initList(containerID);
		},
		
		initList : function(containerID){
			var container = dojo.byId(containerID);
			var count = 0, tooltipContent="", isCreated=false;
			var tooltipDialog;
			
			dijit.Tooltip.defaultPosition=['below','above'];
			
			for(var i in this.moduleList){
				if(count<this.displayMaxNum){
					// create moduleItem
					dojo.create("div",{
						id: this.moduleList[i]["url"],
						innerHTML:this.moduleList[i]["label"],
						className:"moduleItem"
					},container);
					// create moduleItem Tooltip
					new Tooltip({
						connectId: [this.moduleList[i]["url"]],
						label: this.moduleList[i]["url"]
					});
				}else{
					if(!isCreated){
						isCreated = true;
						dojo.create("div",{
							id: "moduleItemMore",
							innerHTML:"更多...",
							className:"moduleItem"
						},container);
					}
					tooltipContent += "<div id=\""+this.moduleList[i]["url"]+"\" class=\"moduleItem\">"
									+ this.moduleList[i]["label"]+"</div>";
				}
				count++;
			}
			
			tooltipContent = "<div style=\"width:300px; height:400px; background:#333;\">"
								+tooltipContent+"</div>";
			
			tooltipDialog = new TooltipDialog({
							id: "ttdItemMore",
							style: "",
							content: tooltipContent,
							onMouseLeave: function(){
								popup.close(tooltipDialog);
							}
						});
			
			query(".moduleItem").on(mouse.enter,function(){
				domStyle.set(this,"color","#fff");
			});
			query(".moduleItem").on(mouse.leave,function(){
				domStyle.set(this,"color","#bcbcbc");
			});
			
			query("#moduleItemMore").on(mouse.enter,function(){
				popup.open({
					popup: tooltipDialog,
					around: dojo.byId('moduleItemMore')
				});
			});
			
		}
		
	});//dojo.declare end
	
	/**
	* 返回当前dojo.declare
	*/
	return retClass; // 返回对象
});//define end