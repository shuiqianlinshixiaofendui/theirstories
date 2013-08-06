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

define("widgets/SuperList/SuperList",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/Evented",
		"dojo/dom-class",
		"dojo/cookie",
		"widgets/List/List",
		"widgets/Pagination/Pagination",
		"dojo/ready",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-traverse",
		"dojo/NodeList-fx"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, template, 
		query, on, dom, lang, domConstruct, Evented, domClass, cookie, List, Pagination, ready
	){
		// 初始化List组件
		function initListWidget(){
			this.listWidget = new List();
			// 多页选择参数
			this.listWidget.currentPage = 1;
		}
		
		// 初始化Pagination组件
		function initPaginationWidget(){
			var json = {
				prevLabel:"上一页",
				nextLabel:"下一页",
				total:0
			};
			this.paginationWidget = new Pagination(json);
		}
		
		// 初始化List组件容器大小
		function initListWidgetContainerSize(){
			var listAreaH = query(this.listArea).parent().style("height")[0];
			var paginationAreaH = this.paginationArea.offsetHeight;
			query(this.listArea).style("height",(listAreaH-paginationAreaH)+"px");
		}
		
		var ret = declare("widgets/SuperList/SuperList",[_WidgetBase, _TemplatedMixin, Evented],{
			// 指定template
			templateString: template,
			
			constructor:function(){
				// 初始化List组件
				initListWidget.call(this);
				
				// 初始化Pagination组件
				initPaginationWidget.call(this);
			},
			/**
			* 往List组件中添加数据
			*/
			addItems:function(itemids,isClear){
				this.listWidget.addItems(itemids,isClear);
			},
			/**
			* 设置缩略图
			*/
			setItemImage:function(itemid,url){
				this.listWidget.setItemImage(itemid,url);
			},
			/**
			* 添加字段
			*/
			addDomNode:function(itemId,domNode){
				this.listWidget.addDomNode(itemId,domNode);
			},
			postCreate: function(){
				// 组装组件
				this.listWidget.placeAt(this.listArea);
				this.paginationWidget.placeAt(this.paginationArea);
				
				// 设置List自适应容器大小
				var dthis = this;
				ready(function(){
					//初始化List组件容器大小
					initListWidgetContainerSize.call(dthis);
				});
				
				// 改变窗口大小时调整list容器的大小。防止被分页组件覆盖住
				on(window,"resize",function(){
					// 实时调整List组件容器大小
					initListWidgetContainerSize.call(dthis);
				})
			}
		});
		
		return ret;
	});