/* 
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */

define("widgets/Toolbar/Toolbar",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-construct",
		"dojo/Evented",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/cookie",
		"dijit/Menu",
		"dijit/form/DropDownButton",
		"dijit/CheckedMenuItem",
		"dijit/form/Button",
		"dijit/form/ComboButton",
		"dijit/form/ToggleButton",
		"dijit/ToolbarSeparator",
		"dojox/form/BusyButton",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-traverse",
		"dojo/NodeList-fx"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, template, 
		query, on, dom, lang,array, domConstruct, Evented, domClass,domStyle,domAttr, cookie, Menu,DropDownButton, CheckedMenuItem,Button,ComboButton,ToggleButton,ToolbarSeparator,BusyButton
	){
		//全选事件
		var selectAll = "selectAll";
		//排序事件
		var sortable = "sortable";
		//按时间排序 新到旧
		var publishdateDesc = {
			sortName : "publishdate",
			order : "orderDesc"
		};
		//按时间排序 旧到新
		var publishdateAsc = {
			sortName : "publishdate",
			order : "orderAsc"
		};
		//按名称排序 z-a
		var resourceNameDesc = {
			sortName : "resourceName",
			order : "orderDesc"
		};
		//按名称排序 a-z
		var resourceNameAsc = {
			sortName : "resourceName",
			order : "orderAsc"
		};
		//按创建时间 最新
		var createDesc = {
			sortName : "jcr:created",
			order : "orderDesc"
		};
		//按创建时间 最旧
		var createAsc = {
			sortName : "jcr:created",
			order : "orderAsc"
		};
		//缩略图视图事件
		var gridList = "gridList";
		//列表视图事件
		var rowList = "rowList";
		//编辑事件
		var editable = "editable";
		//名称排序
		var name_order = "name_order";
		//时间排序
		var time_order = "time_order";
		//选择模式事件
		var optional = "optional";
		//多选
		var multipleChoice = "multipleChoice";
		//删除事件
		var erasable  = "erasable";
		//按发布时间搜索 
		var searchByPublish = "searchByPublish";
		//渲染模型预览图
		var renderModel = "renderModel";
		//渲染所有模型预览图
		var renderAllModel = "renderAllModel";
		
		
		//排序
		var sortItems = [
			{
				name : "resourceNameDesc",
				label : "按名称(z-a)",
				event : resourceNameDesc
			},
			{
				name : "resourceNameAsc",
				label : "按名称(a-z)",
				event : resourceNameAsc
			},
			{
				name : "publishdateDesc",
				label : "发布时间(最新)",
				event : publishdateDesc
			},
			{
				name : "publishdateAsc",
				label : "发布时间(最旧)",
				event : publishdateAsc
			},
			{
				name : "createDesc",
				label : "创建时间(最新)",
				event : createDesc
			},
			{
				name : "createAsc",
				label : "创建时间(最旧)",
				event : createAsc
			}
		];
		//下拉菜单组
		var dropBtn = [
			{
				title : "排序",
				groupId : "sort",
				data : [
					{
						name : sortable,
						title : sortable,
						groupId : "sort",
						event : sortable,
						showLabel : true,
						label : "排序",
						iconClass : 'dijitEditorIcon dijitEditorIconInsertOrderedList',
						items : sortItems
					}
				]
			}
		];
		
		// order
		var orderOperation = [
			{
				title : "状态",
				groupId : "state",
				data :[
					{
						name : time_order,
						event : time_order,
						groupId : "curl",
						showLabel : true,
						label : "时间",
						title : "时间",
						checked : true,
						iconClass : "orderRise"
					},
					{
						name : name_order,
						event : name_order,
						groupId : "curl",
						showLabel : true,
						label : "名称",
						title : "名称",
						checked : true,
						iconClass : "orderRise"
					}
				]
			}
		];
			
		
		//切换状态工具数据
		var toggleStateBtn = [
			{
				title : "状态",
				groupId : "state",
				data :[
					{
						name : selectAll,
						event : selectAll,
						showLabel : true,
						groupId : "state",
						label : "全选",
						toggleLabel : "取消",
						title : "全选",
						iconClass : "dijitEditorIcon dijitEditorIconSelectAll"
					},{
						name : editable,
						event : editable,
						showLabel : true,
						groupId : "state",
						label : "编辑模式",
						toggleLabel : "关闭编辑",
						title : "编辑",
						iconClass : "dijitEditorIcon dijitEditorIconWikiword"
					},{
						name : optional,
						event : optional,
						showLabel : true,
						groupId : "state",
						label : "选择模式",
						toggleLabel : "关闭选择",
						title : "选择模式",
						iconClass : "dijitIconPackage"
					}
				]
			}
			
		];
		//简单动作组数据
		var simpleActionBtn = {
			curl : {
				title : "增删改查",
				groupId : "curl",
				data : [
					{
						name : multipleChoice,
						event : multipleChoice,
						groupId : "curl",
						showLabel : true,
						label : "添加模型",
						title : "添加模型",
						checked : true
					},
					{
						name : erasable,
						event : erasable,
						groupId : "curl",
						showLabel : true,
						label : "删除选中项",
						title : "删除选中项",
						checked : true,
						iconClass : "dijitEditorIcon dijitEditorIconDelete"
					},
					{
						name : searchByPublish,
						event : searchByPublish,
						groupId : "curl",
						showLabel : true,
						label : "按发布时间搜索",
						title : "按发布时间搜索",
						checked : true
					},
					{
						name : renderModel,
						event : renderModel,
						groupId : "curl",
						showLabel : true,
						widget : "BusyButton",
						busyLabel : "正在请求渲染...",
						label : "渲染模型预览图",
						title : "渲染模型预览图",
						checked : true,
						iconClass : "dijitEditorIcon dijitEditorIconInsertImage"
					},
					{
						name : renderAllModel,
						event : renderAllModel,
						groupId : "curl",
						showLabel : true,
						widget : "BusyButton",
						busyLabel : "正在请求渲染...",
						label : "渲染所有模型预览图",
						title : "渲染所有模型预览图",
						checked : true,
						iconClass : "dijitEditorIcon dijitEditorIconInsertImage"
					}
				]
			}
		}
		
		//初始化工具栏
		function initToolbar(){
			var dthis = this;
			//状态
			for(var index in orderOperation){
				if(typeof(orderOperation[index] == "object")){
					var group = orderOperation[index];
					
					for(var pro in group["data"]){
						var proData = group["data"][pro];
						if(typeof(proData)=="object"){
							if(dthis[proData.name] == true){
								dthis[proData.groupId][proData.name] = createToggleBtn.call(dthis,proData);
								dthis.addMenuItem(dthis[proData.groupId][proData.name]);
							}
						}
					}
					
				}
				
			}
			//下拉菜单
			// for(var index in dropBtn){
				// if(typeof(dropBtn[index]) == "object"){
					// var group = dropBtn[index];
					// 创建元素前，先创建分割线
					// var seporation = createSeporation(group["title"]);
					// dthis.addMenuItem(seporation);
					// dthis[group["groupId"]]["sep"] = seporation;
					
					// for(var pro in group["data"]){
						// var proData = group["data"][pro];
						// if(typeof(proData)=="object"){
							// if(dthis[proData.name] == true){
								// dthis[proData.groupId][proData.name] = createDropDownButton.call(dthis,proData);
								// dthis.addMenuItem(dthis[proData.groupId][proData.name]);
							// }
						// }
					// }
				// }
			// }
			//状态
			for(var index in toggleStateBtn){
				if(typeof(toggleStateBtn[index] == "object")){
					var group = toggleStateBtn[index];
					if(group["groupId"]!=undefined && group["groupId"] != "view"){
						//创建元素前，先创建分割线
						// var seporation = createSeporation(group["title"]);
						// dthis.addMenuItem(seporation);
						// dthis[group["groupId"]]["sep"] = seporation;
					}
					
					for(var pro in group["data"]){
						var proData = group["data"][pro];
						if(typeof(proData)=="object"){
							if(dthis[proData.name] == true){
								dthis[proData.groupId][proData.name] = createToggleBtn.call(dthis,proData);
								dthis.addMenuItem(dthis[proData.groupId][proData.name]);
							}
						}
					}
					
				}
				
			}
			
			
			//简单动作
			for(var index in simpleActionBtn){
				if(typeof(simpleActionBtn[index] == "object")){
					var group = simpleActionBtn[index];
					//创建元素前，先创建分割线
					// var seporation = createSeporation(group["title"]);
					// dthis.addMenuItem(seporation);
					// dthis[group["groupId"]]["sep"] = seporation;
					for(var pro in group["data"]){
						var proData = group["data"][pro];
						if(typeof(proData)=="object"){
							if(dthis[proData.name] == true){
								var widgetNode;
								if(proData.widget == "BusyButton"){
									widgetNode = createBusyBtn.call(dthis,proData);
								}else{
									widgetNode = createBtn.call(dthis,proData);
								}
								dthis[proData.groupId][proData.name] = widgetNode;
								dthis.addMenuItem(dthis[proData.groupId][proData.name]);
							}
						}
					}
					
				}
			}
		}
		function createSeporation(data){
			var dthis = this;
			var seporation = new ToolbarSeparator(data);
			return seporation;
		}
		function createDropDownButton(data){
			var dthis = this;
			var dropData = {
				showLabel : data.showLabel ? data.showLabel : "",
				iconClass : data.iconClass ? data.iconClass : "",
				title : data.title ? data.title : "",
				label : data.label ? data.label : "",
				onClick : function(){}
			}
			if(data["items"] != undefined){
				dropData.dropDown = createMenu.call(dthis,data["items"]);
			}
			var dropDownBtn = new DropDownButton(dropData);
			return dropDownBtn;
		}
		//创建menu
		function createMenu(data){
			var dthis = this;
			var pMenu = new Menu({
				style:"display:none"
			});
			for(var index in data){
				if(typeof(data[index]) == "object"){
					var checkItem = createCheckItem.call(dthis,data[index]);
					pMenu.addChild(checkItem);
				}
			}
			
			return pMenu;
		}
		
		//创建item
		function createCheckItem(data){
			var dthis = this;
			//某一排序项被点击
			function setCheckBox(){
				if (!this.get("checked")) {  
					this.set("checked", true);
				}
				array.forEach(this.getParent().getChildren(),
					function(mi) {
						if (mi != this) {
							mi.set("checked", false);
						}
					},
				this);
				dthis.emit(sortable,this.event);
			}
			var checkItem = new CheckedMenuItem({
				label : data["label"] != undefined ? data["label"] : "",
				event : data["resourceNameDesc"] != undefined ? data["resourceNameDesc"] : {},
				onClick : setCheckBox
			}); 
			lang.mixin(checkItem,data);
			return checkItem;
		}
		
		function createToggleBtn(data){
			var dthis = this;
			var toggleData = {
				showLabel : data.showLabel ? data.showLabel : "",
				  checked : data.checked ? data.checked : "",
				iconClass : data.iconClass ? data.iconClass : "",
				//baseClass : data.baseClass ? data.baseClass : "",
				title : data.title ? data.title : "",
				onClick : function(){
					if(this["clearOther"]==true){
						clearOtherCheck.call(this,dthis,this["groupId"]);
					}
					if(typeof(data.onClick)=="function"){
						data.onClick.call(this,dthis)||"";
					}
				},
				onChange: function(val){
					if(typeof(data.onChange)=="function"){
						data.onChange.call(this,dthis,val);
					}
					var toggoLabel = this["toggleLabel"];
					if(toggoLabel != undefined && toggoLabel != ""){
						this["toggleLabel"] = this.get("label");
						this.set("label",toggoLabel);
					}
					dthis.emit(this.event,val);
				},
				label: data.label
			}
			if(data.baseClass != undefined && data.baseClass != ""){
				toggleData.baseClass = data.baseClass;
			}
			if(data.cssStateNodes != undefined && data.cssStateNodes != ""){
				toggleData.cssStateNodes = data.cssStateNodes;
			}
			
			var togglebtn = new ToggleButton(toggleData);
			
			
			lang.mixin(togglebtn,data);
			return togglebtn;
			
		}
		//添加普通button到toolbar
		function createBtn(data){
			var dthis = this;
			var btn = new Button({
				label: data.label,
				showLabel : data.showLabel,
				iconClass : data.iconClass,
				title : data.title,
				onClick: function(){
					if(typeof(data.onClick) == "function"){
						data.onClick.call(this);
					}
					dthis.emit(this.event);
				}
			
			});
			lang.mixin(btn,data);
			return btn;
			
		}
		//添加忙碌button
		function createBusyBtn(data){
			var dthis = this;
			var busyBtn = new BusyButton({
				label: data.label,
				showLabel : data.showLabel,
				iconClass : data.iconClass,
				busyLabel : data.busyLabel,
				title : data.title,
				_onClick: function(){
					//this.setLabel(this.busyLabel);
					this.makeBusy();
					if(typeof(data.onClick) == "function"){
						data.onClick.call(this);
					}
					dthis.emit(this.event);
				}
			
			});
			lang.mixin(busyBtn,data);
			return busyBtn;
		}
		function isTrue(obj){
			var re = false;
			if(obj!=undefined){
				var objStr = obj.toString();
				if(objStr == "true"){
					re = true;
				}
			}
			return re;
		}
		
		//清空选中
		function clearOtherCheck(dthis,groupName){
			var viewObj = this;
			var arr = dthis[groupName];
			if(arr != undefined){
				for(var index in arr){
					if(arr[index] != viewObj){
						if(typeof(arr[index]) == "object"){
							if(typeof(arr[index].get)=="function"){
								if(arr[index].get("checked") == true){
									if(typeof(arr[index].set)=="function"){
										arr[index].set("checked",false);
									}
								}
							}
							
						}
					}
					
				}
			}
		}
		//摧毁工具栏中的组件
		function destroyWidgets(data){
			for(var index in data){
				if(typeof(data[index]) == "object"){
					if(typeof(data[index].destroy)=="function"){
						data[index].destroy();
					}
				}
			}
		}
		//摧毁工具栏中的组件
		function displayWidgets(data,display){
			for(var index in data){
				if(typeof(data[index]) == "object"){
					if(typeof(data[index].destroy)=="function"){
						displayWidget(data[index],display);
					}
				}
			}
		}
		//隐藏并禁用工具栏中的组件
		function displayWidget(widget,display){
			if(widget){
				if(display == true || display == "true"){
					domStyle.set(widget.domNode,"display","inline-block");
					widget.set('disabled', false)
				}else{
					domStyle.set(widget.domNode,"display","none");
					widget.set('disabled', true)
				}
			}
		}
		//禁用工具栏中的组件
		function disableWidget(widget,disabled){
			if(widget){
				if(disabled == true || disabled == "true"){
					widget.set('disabled', true);
				}else{
					widget.set('disabled', false);
				}
			}
		}
		//取消忙碌按钮的忙碌状态
		function noBusyWidget(widget){
			if(widget && typeof(widget.resetTimeout) == "function"){
				widget.resetTimeout(0);
			}
		}
		//根据widgetName获取widget
		function getWidgetByName(name){
			var widget;
			var dthis = this;
			var widgets = lang.mixin(dthis.state,lang.mixin(dthis.view,dthis.curl));
			for(var widName in widgets){
				if(typeof(widgets[widName]) == "object"){
					if(widName == name){
						widget = widgets[widName];
					}
				}
			}
			return widget;
		}
		var ret = declare("widgets/Toolbar/Toolbar",[_WidgetBase, _TemplatedMixin, Evented ],{
			baseClass:"toolbar",
			// 指定template
			templateString: template,
			// 下拉菜单组
			sort:{},
			// 状态切换组
			state:{},
			// 视图切换组
			view:{},
			// 简单动作组
			curl:{},
			
			constructor:function(json){
				this.sortable = json["sortable"];
				this.selectAll = json["seletAll"];
				this.gridList = json["gridList"];
				this.rowList = json["rowList"];
				this.editable = json["editable"];
				this.time_order = json["time_order"];
				this.name_order = json["name_order"];
				this.optional = json["optional"];
				this.renderModel = json["renderModel"];
				this.renderAllModel = json["renderAllModel"];
				this.searchByPublish = json["searchByPublish"];
				this.multipleChoice = json["multipleChoice"];
				this.sortData = json["sortData"];
			},
			postCreate: function(){
				
				//初始化工具栏
				initToolbar.call(this);
				this.emit("postCreateReady");
			},
			_onClick: function(e){
				return this.onClick(e);
			},
			onClick: function(e){ // nothing here: the extension point!
				
			},
			addMenuItem : function(domNode){
				var node = domNode;
				console.log(typeof(node.domNode));
				if(node.domNode != undefined){
					node = node.domNode;
				}
				domConstruct.place(node,this.toolbarNode, "last");
				//domNode.placeAt(this.toolbarNode,"last");
			},
			destroyAdminControl : function(){
				//摧毁管理员权限的功能
				//摧毁简单动作组
				destroyWidgets.call(this,this.curl);
				//摧毁状态切换组
				destroyWidgets.call(this,this.state);
			},
			displayAdminControl : function(display){
				//隐藏并禁用管理员权限的功能
				//摧毁简单动作组
				displayWidgets.call(this,this.curl,display);
				//摧毁状态切换组
				displayWidgets.call(this,this.state,display);
			},
			/**
			 * 是否隐藏并禁用组件
			 */
			displaySelectAll : function(display){
				displayWidget.call(this,getWidgetByName.call(this,selectAll),display);
			},
			displaySortable : function(display){
			
			},
			displayEditable : function(display){
				displayWidget.call(this,getWidgetByName.call(this,editable),display);
			},
			// time and name
			displayTime_order : function(display){
				displayWidget.call(this,getWidgetByName.call(this,time_order),display);
			},
			displayName_order : function(display){
				displayWidget.call(this,getWidgetByName.call(this,name_order),display);
			},
			
			displayOptional : function(display){
				displayWidget.call(this,getWidgetByName.call(this,optional),display);
			},
			displayErasable : function(display){
				displayWidget.call(this,getWidgetByName.call(this,erasable),display);
			},
			displayRenderModel : function(display){
				displayWidget.call(this,getWidgetByName.call(this,renderModel),display);
			},
			displayRenderAllModel : function(display){
				displayWidget.call(this,getWidgetByName.call(this,renderAllModel),display);
			},
			displaySearchByPublish : function(display){
				displayWidget.call(this,getWidgetByName.call(this,searchByPublish),display);
			},
			displayMultipleChoice : function(display){
				displayWidget.call(this,getWidgetByName.call(this,multipleChoice),display);
			},
			/**
			 * 是否禁用组件
			 */
			disableSelectAll : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,selectAll),disable);
			},
			disableSortable : function(disable){
			
			},
			disableEditable : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,editable),disable);
			},
			disableTime_order : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,time_order),disable);
			},
			disableName_order : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,name_order),disable);
			},
			disableOptional : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,optional),disable);
			},
			disableErasable : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,erasable),disable);
			},
			disableRenderModel : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,renderModel),disable);
			},
			disableRenderAllModel : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,renderAllModel),disable);
			},
			disableSearchByPublish : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,searchByPublish),disable);
			},
			disableMultipleChoice : function(disable){
				disableWidget.call(this,getWidgetByName.call(this,multipleChoice),disable);
			},
			/**
			 * 忙碌按钮恢复初始状态
			 */
			noBusyRenderModel : function(){
				noBusyWidget.call(this,getWidgetByName.call(this,renderModel));
			},
			noBusyRenderAllModel : function(){
				noBusyWidget.call(this,getWidgetByName.call(this,renderAllModel));
			}
		});
		
		return ret;
	});