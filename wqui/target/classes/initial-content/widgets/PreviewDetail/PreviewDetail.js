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

define("widgets/PreviewDetail/PreviewDetail",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./templates/template.html",
		"widgets/List/List",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/keys",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/dom-style",
		"dojo/Evented",
		"dijit/registry",
		"widgets/SlideShow/SlideShow",
		"widgets/Pagination/Pagination",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-data"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, template, List,
		query, on, dom,keys, lang, domConstruct,domStyle, Evented,registry, SlideShow, Pagination
	){		
		/**
		*初始化List组件
		*/
		function initListWidget(){
			// console.log("PrevieDetail initListWidget");
			var listJson = new Object();
			if(this.isRadio != undefined){
				listJson.isRadio = this.isRadio;
			}
			//使用list方式布局
			listJson.listType = "list";
			//默认不为选择模式
			listJson.isSelectModel = false;
			this.listWidget = new List(listJson);
			this.listWidget.lineNumber = 1;
			// this.listWidget.addItems(this.data);
			this.listWidget.placeAt(this.modelList_list);
			// 添加加载提示
			this.listWidget.listNode.innerHTML = "<div style='margin-left:10px;margin-top:10px;display:inline;float:left;'>加载中，请稍等...</div>";	
		}
		/**
		*初始化分页组件
		*/
		function initPaginationWidget(){
			var jsons = {
				prevLabel:"上一页",
				nextLabel:"下一页",
				total:0
			};
			this.PaginationWidget = new Pagination(jsons);
			this.PaginationWidget.placeAt(this.modelList_pagination);
		}
		/**
		*初始化slideShow模块
		*/
		function initSlideShowModule(){
			var iframeNode = domConstruct.create("iframe",{
				className : "iframeNode",
				src : "/modules/slideShow/index.html",
				style : {
					"height" : "100%",
					"width" : "100%",
					"border" : "none",
					"padding" :"0px",
					"margin" : "0px",
					"overflow" : "hidden"
				}
			},this.effect_img);
		}
		
		/**
		*设置当前模式为替换模式
		*/
		function setInsteadStyle(){
			domStyle.set(this.addToScene,"display","none");
			domStyle.set(this.insteadModel,"display","block");
			domStyle.set(this.selectAll,"display","none");
			/*
			//全选所有页的功能注释掉
			domStyle.set(this.selectAllPage,"display","none");
			*/
		}

		
		var ret = declare("widgets/PreviewDetail/PreviewDetail",[_WidgetBase, _TemplatedMixin, Evented ],{
			// 指定template
			templateString: template,
			
			constructor:function(json){
				if(json){
					this.isRadio = json.isRadio || false;
					this.isInsteadModel = json.isInsteadModel || false;
				}
				//this.data = json.data;
			},
			// 设置效果图
			setEffectImg:function(src){
				query("img",this.effect_img).attr("src",src);
			},
			setAddModelButton : function(){
				domStyle.set(this.modelList_btnGroup,"display","none");
				//var sTop =this.sTopContainer.style.height.split("px");
				var filterGroup = domStyle.get(this.modelList_filterGroup,"height");
				domStyle.set(this.sTopContainer,"height",filterGroup+"px");	
				/*domStyle.set(this.sCenterContainer,"top",filterGroup+"0px");			
				var sCenter =this.sCenterContainer.style.height.split("px");	
				domStyle.set(this.sCenterContainer,"height",parseFloat(sTop[0])+parseFloat(sCenter[0])+"px"); */
				//this.modellistNode.resize();
				//this.modellistLayoutNode.resize();
				var parentWidget = registry.getEnclosingWidget(this.modellistNode);
				parentWidget.resize();
			},
			/**
			*设置SlideShow模块中的实体内容
			*/
			addPreviewItemToSlideShow : function(data){
				Spolo.setData("previewData", data);
			},
			// 根据传递的itemid值选中item项
			selectedByItemId : function(itemid){
				this.listWidget.selectByItemId([itemid]);
			},
			postCreate: function()
			{
				/**
				*List组件
				*/
				// initListWidget.call(this);
				
				/**
				*分页插件
				*/
				// initPaginationWidget.call(this);
				
				/**
				*slideShow模块
				*/
				initSlideShowModule.call(this);
				
				// //如果是替换模型的模式
				// if(this.isInsteadModel){
					// setInsteadStyle.call(this);
				// }
				
				// // 设置按钮事件
				// var dthis = this;
				// on(dthis.addToScene,"click",function(){
					// var array = dthis.listWidget.getSelectNodes();
					// dthis.emit("onAddToScene",array)
				// });
				// on(dthis.insteadModel,"click",function(){
					// var array = dthis.listWidget.getSelectNodes();
					// dthis.emit("onInsteadModel",array)
				// });
				
				// // 全选/取消
				// $(dthis.selectAll).toggle(function(){
					// dthis.listWidget.selectAll();
					// query(this).innerHTML("取消当前页");
				// },function(){
					// dthis.listWidget.unSelectAll();
					// query(this).innerHTML("全选当前页");
				// });
				// /*
				// //全选所有页的功能注释掉
				// $(dthis.selectAllPage).toggle(function(){
					// dthis.listWidget.selectAll();
					// query(this).innerHTML("取消所有页");
				// },function(){
					// dthis.listWidget.unSelectAll();
					// query(this).innerHTML("全选所有页");
				// })
				// */
				// on(dthis.toSearchNode,"click",function(){
					// dthis.emit("onSearch");
				// });
				// on(dthis.searchNode, "keyup", function(event) {
					// switch(event.keyCode) {
						// case keys.ENTER:
							// dthis.searchNode.blur();
							// dthis.emit("onSearch");
							// break;
						// default:
							// break;
					// }
				// });
				
				// // 发出 postCreateReady 消息
				// this.emit("postCreateReady");
			}
		});
		
		return ret;
	});