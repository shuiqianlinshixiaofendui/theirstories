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

define("widgets/LibView/LibView",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/Evented",
		"widgets/Category/Category",
		"widgets/List/List",
		"widgets/Toolbar/Toolbar",
		"widgets/Pagination/Pagination"
	],function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
		query, on, dom, Evented, 
		Category, List,Toolbar, Pagination
	){
	
		// 初始化按钮事件
		function initButtonEvent(){
			var dthis = this;
			/**
			*按钮事件
			*/
			on(dthis.toolbar,"selectAll",function(data){
				if(data){
					dthis.emit("onSelectAll");
				}else{
					dthis.emit("onUnSelectAll");
				}
			});
			on(dthis.toolbar,"sortable",function(data){
				dthis.emit("onSort",data);
			});
			on(dthis.toolbar,"gridList",function(data){
				if(data == true){
					dthis.emit("onShowThumbnail");
				}
			});
			on(dthis.toolbar,"rowList",function(data){
				if(data == true){
					dthis.emit("onShowList");
				}
			});
			on(dthis.toolbar,"editable",function(data){
				if(data){
					dthis.emit("onOpenEditModel");
				}else{
					dthis.emit("onCloseEditModel");
				}
			});
			on(dthis.toolbar,"optional",function(data){
				if(data){
					dthis.emit("onOpenSelectModel");
				}else{
					dthis.emit("onCloseSelectModel");
				}
			});
			on(dthis.toolbar,"erasable",function(){
				var items = dthis.listWidget.getSelectNodes();
				dthis.emit("onDelSelectItem",items);
			});
			on(dthis.toolbar,"renderModel",function(){
				if(dthis.renderPreview)
				{
					var items = dthis.listWidget.getSelectNodes();
					dthis.emit("onRenderPreview",items);
				}
			});
			on(dthis.toolbar,"renderAllModel",function(){
				if(dthis.renderPreview)
				{
					var items = dthis.listWidget.getSelectNodes();
					dthis.emit("onRenderAllPreview",items);
				}
			});
			
			// order
			on(dthis.toolbar,"time_order",function(data){
				if(data){
					this.state.time_order.set("iconClass","orderRise");
					dthis.emit("onTimeOrderRise");
				}else{
					this.state.time_order.set("iconClass","orderDrop");
					dthis.emit("onTimeOrderDrop");
				}
			});
			on(dthis.toolbar,"name_order",function(data){
				if(data){
					this.state.name_order.set("iconClass","orderRise");
					dthis.emit("onNameOrderRise");
				}else{
					this.state.name_order.set("iconClass","orderDrop");
					dthis.emit("onNameOrderDrop");
				}
			});
			/* //全选/取消按钮切换事件
			$(".selectBtn",dthis.buttonListNode).live("click",function(){
				$(this).toggle(function(){
					dthis.emit("onSelectAll");
					$(this).text("取消");
				},function(){
					dthis.emit("onUnSelectAll");
					$(this).text("全选");
				}).trigger("click");
			});
			
			//List方式布局
			$(".rowList",dthis.buttonListNode).live("click",function(){
				dthis.emit("onShowList");
				$(this).siblings(".gridList").removeClass("gridListOn").addClass("gridListOff");
				$(this).removeClass("rowListOff").addClass("rowListOn");
			});
			
			//大图方式布局
			$(".gridList",dthis.buttonListNode).live("click",function(){
				dthis.emit("onShowThumbnail");
				$(this).siblings(".rowList").removeClass("rowListOn").addClass("rowListOff");
				$(this).removeClass("gridListOff").addClass("gridListOn");
			});
			
			//启动/关闭编辑模式
			$(".editModel",dthis.buttonListNode).live("click",function(){
				$(this).toggle(function(){
					dthis.emit("onOpenEditModel");
					$(this).text("关闭编辑模式");
				},function(){
					dthis.emit("onCloseEditModel");
					$(this).text("编辑模式");
				}).trigger("click");
			});
			
			//启动/关闭选择模式
			$(".selectModel",dthis.buttonListNode).live("click",function(){
				$(this).toggle(function(){
					dthis.emit("onOpenSelectModel");
					$(this).text("关闭选择模式");
				},function(){
					dthis.emit("onCloseSelectModel");
					$(this).text("选择模式");
				}).trigger("click");
			});
			
			//删除选中元素
			$(".delSelectItem",dthis.buttonListNode).live("click",function(){
				var items = dthis.listWidget.getSelectNodes();
				dthis.emit("onDelSelectItem",items);
			});
			
			//渲染模型预览图
			$(".renderPreview",dthis.buttonListNode).live("click",function(){
				if(dthis.renderPreview)
				{
					var items = dthis.listWidget.getSelectNodes();
					dthis.emit("onRenderPreview",items);
				}
			});  */
		}
		
		var ret = declare("widgets/LibView/LibView",
				[_WidgetBase, _WidgetsInTemplateMixin, _TemplatedMixin, Evented ],
		{
			
			// 指定template
			templateString: template,
			
			constructor:function(){
				
				
				//List widget
				this.listWidget = new List();
				//toolbar widget
				var config = {
					//isRadio:true //是否打开单选模式。默认为多选。单选模式下禁止全选与取消功能。
					// sortable : true, //排序
					// gridList : true,//列表视图
					// rowList : true,//缩率图视图
					// seletAll : true,//全选
					name_order : true, // 名称排序
					time_order : true, // 时间排序
					optional : true, // 选择模式
					editable : true,    //编辑模式
					erasable : true,  // 删除选中项
					renderModel : true, //渲染模型效果图
					renderAllModel : true //渲染所有模型效果图
				}
				this.toolbar = new Toolbar(config);
				//Pagination widget
				/**
				*分页插件
				*/
				var jsons = {
					prevLabel:"上一页",
					nextLabel:"下一页",
					total:0
				};
				this.PaginationWidget = new Pagination(jsons);
				this.renderPreview = true;
			},
			
			postCreate:function(){
				this.listWidget.placeAt(this.ListNode);
				this.PaginationWidget.placeAt(this.pageListNode);
				this.toolbar.placeAt(this.buttonListNode);
				//初始化按钮事件
				initButtonEvent.call(this);
				this.emit("postCreateReady");
			},
			
			// 隐藏显示功能按钮
			displayButtonList:function(flag){
				this.toolbar.displayAdminControl(flag);
			},
			displayRenderButton:function(flag){
				this.toolbar.displayRenderModel(flag);	
			},
			displayRenderAllButton:function(flag){
				this.toolbar.displayRenderAllModel(flag);	
			}
			
		});
		
		return ret;
	});