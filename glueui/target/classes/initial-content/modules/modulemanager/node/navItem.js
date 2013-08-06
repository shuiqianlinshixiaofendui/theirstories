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
define("modulemanager/node/navItem",["dojo/topic","dojo/dom-construct","dojo/query","dojo/on","dojo/mouse","dojo/dom-style","dijit/Tooltip","dijit/TooltipDialog","dijit/popup","dijit/registry"],
function(topic, domConstruct, query, on, mouse, domStyle, Tooltip, TooltipDialog, popup, registry){
	/**
	* 订阅是否存在配置模块选项
	*/
	topic.subscribe("modulemanager/node/navItem/hasModuleConfig",function(currentModule,container){
		//获取用户Api类对象
		var modules = Spolo.getModules();
		//是否存在该模块的相关配置
		modules.hasModuleConfig(currentModule,function(){
			// navigation bar常用按钮之一 -- 配置App的属性。
			domConstruct.create("a",
			{
				id: "configModule",
				style:{
					"color": "#bcbcbc",
					"float": "right",
					"padding": "8px 10px 0px 10px",
					"font-size": "13px",
					"font-weight": "bold",
					"cursor": "pointer",
					"margin-right": "30px"
				},
				innerHTML: "配置模块",
				href : "/content/users/"+Spolo.getUserId()+"/modules/"+currentModule+"/config.html"
			},container);
		},function(){
			//console.log("不存在该模块的配置信息！");
		},function(){
			//console.log("获取模块配置信息失败！");
		});
	});
	
	// 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = dojo.declare("modulemanager/node/navItem",[],
	{
	/**
	* 资源管理对象构造函数:根据所传入的路径来构建资源
	*/
		constructor : function(containerID,tmpModuleList){
			this.displayMaxNum = 9;
			// TODO: get module list
			this.moduleList = tmpModuleList;
			// TODO: initialize module list
			this.initList(containerID);
		},
		initList : function(containerID){
			var container = dojo.byId(containerID);
			var count = 0, tooltipContent="", isCreated=false;
			var tooltipDialog;
			//记录tooltipDialog状态
			var isOpen = false;
			dijit.Tooltip.defaultPosition=['below','above'];
			
			//创建应用管理模块标签
			domConstruct.create("div",
			{
				id: "modulemanager",
				style:{
					"float": "left",
					"padding": "8px 10px 0px 20px",
					"font-size": "13px",
					"font-weight": "bold",
					"cursor": "pointer",
				},
				innerHTML: "<image width='17' height='17' src='/modules/modulemanager/images/icon.png'/>"
			},container);
			
			new Tooltip({
				connectId: "modulemanager",
				label: "应用管理中心"
			});
			
			for(var i in this.moduleList){
				if(count<this.displayMaxNum){
					// create moduleItem
					domConstruct.create("div",
					{
						id: this.moduleList[i]["id"],
						className:"moduleItem",
						style:{
							"float": "left",
							"padding": "8px 10px 0px 10px",
							"font-size": "13px",
							"font-weight": "bold",
							"cursor": "pointer"
						},
						innerHTML:this.moduleList[i]["name"]
					},container);
					
					
					
					// create moduleItem Tooltip
					new Tooltip({
						connectId: [this.moduleList[i]["id"]],
						label: this.moduleList[i]["description"]
					});
				}else{
					if(!isCreated){
						isCreated = true;
						domConstruct.create("div",
						{
							id: "moduleItemMore",
							className:"moduleItem",
							style:{
								"float": "left",
								"padding": "8px 10px 0px 10px",
								"font-size": "13px",
								"font-weight": "bold",
								"cursor": "pointer"
							},
							innerHTML:"更多..."
						},container);
					}
					tooltipContent += "<div id=\""+this.moduleList[i]["id"]+"\" class=\"moduleItem\">"
									+ this.moduleList[i]["name"]+"</div>";
				}
				count++;
			}
			
			tooltipContent = "<div style=\"width:270px; height:400px; background:#333;padding-left:20px;\">"
								+tooltipContent+"</div>";
			
			tooltipDialog = new TooltipDialog({
				id: "ttdItemMore",
				style: "",
				content: tooltipContent,
				onMouseEnter: function(){
					isOpen = true;
				},
				onMouseLeave: function(){
					isOpen = false;
					query("#moduleItemMore").removeClass("fouccItem");
					popup.close(this);
				}
			});
			
			//退出标签
			domConstruct.create("a",
			{
				id: "exitSys",
				style:{
					"color": "#bcbcbc",
					"float": "right",
					"padding": "8px 10px 0px 10px",
					"font-size": "13px",
					"font-weight": "bold",
					"cursor": "pointer",
					"margin-right": "30px"
				},
				innerHTML: "退出",
				href : "/system/sling/logout.html"
			},container);
			
			//显示当前用户
			domConstruct.create("div",
			{
				id: "currentUser",
				style:{
					"color": "#bcbcbc",
					"float": "right",
					"padding": "8px 10px 0px 10px",
					"font-size": "13px",
					"font-weight": "bold",
					"cursor": "pointer",
					"margin-right": "10px"
				},
				innerHTML: Spolo.decodeUname(Spolo.getUserId())
			},container);

			query(".moduleItem").on(mouse.enter,function(){
				query(this).addClass("fouccItem");
			});
			query(".moduleItem").on(mouse.leave,function(){
				if(query(this).attr("id") != "moduleItemMore"){
					query(this).removeClass("fouccItem");
				}
			});
			
			query("#moduleItemMore").on(mouse.enter,function(){
				popup.open({
					popup: tooltipDialog,
					around: dojo.byId('moduleItemMore')
				});
			});
			query("#moduleItemMore").on(mouse.leave,function(){
				//提高程序稳定性
				isOpen = false;
				setTimeout(function(){
					if(!isOpen){
						query("#moduleItemMore").removeClass("fouccItem");
						popup.close(tooltipDialog);
					}
				},1);
			});
			
			//将模块的url填充至iframe
			//使用jQuery中的live()为动态创建元素添加事件
			$(".moduleItem").live("click",function(){
				if(query(this).attr("id") != "moduleItemMore"){
					if(isOpen){
						query("#moduleItemMore").attr("innerHTML","更多...&nbsp;in&nbsp;<<font color='#fff'>"+query(this).attr("innerHTML")+"</font>>");
					}else{
						if(query("#moduleItemMore").attr("innerHTML") != "更多..."){
							query("#moduleItemMore").attr("innerHTML","更多...");
						}
					}
					//对所以模块标签高亮做清空，设置当前模块高亮
					query(".moduleItem").removeClass("selectedItem");
					query(this).addClass("selectedItem");
					query("#_sp_mainframe_iframe").attr("src","/modules/"+this.id+"/index.html");
					
					//记录当前打开的模块
					var currentModule = query(this).attr("id").toString();

					//清空原有配置模块选项
					$("#configModule") ? $("#configModule").remove() : null;
					
					//发出是否存在配置模块选项消息
					topic.publish("modulemanager/node/navItem/hasModuleConfig",currentModule,container);	
				}
			});
			
			//应用管理
			$("#modulemanager").live("click",function(){
				var apps = this.id;
				//设置整个容器隐藏
				$("#_sp_main_container").fadeOut(500,function(){
					query("#_sp_mainframe_iframe").attr("src","/modules/"+apps+"/index.html");
					//隐藏首页导航
					$("#_sp_navigator").css({"display":"none"})
					//下层容器往上提
					$("#_sp_mainframe_content").css({"top":"0px","height":"100%"});
					//设置整个容器显示
					$("#_sp_main_container").fadeIn(500,function(){});	
				});
			});
			
			//默认点击第一个
			$(".moduleItem:first").trigger("click");

			$("#configModule,#currentUser,#exitSys").live("mouseenter",function(){
				query(this).style("color","#fff");
			});
			$("#configModule,#currentUser,#exitSys").live("mouseleave",function(){
				query(this).style("color","#bcbcbc");
			});
		}
	});//dojo.declare end
	/**
	* 返回当前dojo.declare
	*/
	return retClass; // 返回对象
});//define end