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

define("widgets/funcButton/funcButton",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dojo/dom-construct",
		"dijit/_TemplatedMixin",
		"dojo/text!./templates/template.html",
		"dojo/dom-style",
		"dojo/query",
		"dojo/dom",
		"dojo/on",
		"dojo/Evented"
	],function(declare,_WidgetBase,domConstruct,_TemplatedMixin,template,domStyle,query,dom,on, Evented){
		
		return declare("widgets/funcButton/funcButton",[_WidgetBase,_TemplatedMixin, Evented],{
			
			// 默认button属性
			label:"button",
			btnImg:"",
			href:"javascript:void(0)",
			alt:"",
			id:"",
			markCls:"",
			movCls:"",
			
			// 指定template
			templateString: template,
			
			// 鼠标划入 -- mouseover 事件处理
			mouseover: function(){
				var cls = this.markCls;
				var node = this.id;
				var clsname = this.movCls;
				// 设置鼠标划入时button状态
				query("." + clsname).style("color","#000000")
									.style("opacity","1");
				
				// 鼠标划出事件
				query("#" + node).connect("mouseleave",function(){
					// 设置鼠标划出时button的样式 -- 恢复默认状态
					query("." + clsname).style("color","#8e8e8e")
										.style("opacity","0.7");
				});
			},
			
			// postCreate is a predefined event 
			// handler that is executed when widget 
			// is created and initialized
			postCreate: function(){
				this.inherited(arguments);
				
				// 定义鼠标点击事件
				this.connect(this.domNode,"onclick","increment");
				
			},
			
			// 鼠标点击事件处理
			increment: function(){
				
				// 获取所点击 button ，并发送消息
				this.emit("btnClick", this);
				
				// 获取被点击 button 的标记类名
				var cls = this.markCls;
				var clsname = this.movCls;
				
				// 给图标和文字部分追加 class 名称 ock
				query("." + cls).addClass("ock");
				
				// 删除 clsname 类名
				query("." + clsname).removeClass(clsname);
				
				// 获取 class 为 ock 的所有元素
				var ockDom = query(".ock");
				
				// 遍历所有 class 为 ock 的元素,并进行相应的动画设置
				for(var index = 0; index < ockDom.length; index ++){
					
					// 获取并保存元素的 className
					var clsString = ockDom[index].className;
					
					// 判断是否为当前点击的 button
					if(clsString.split(" ")[1] == cls){
						
						// 设置button被点击时的样式
						query(".ock").style("color","#000000")
									 .style("opacity","1");
						
					}else{
						
						// 删除cls 类名
						query(ockDom[index]).removeClass("ock");
						
						// 追加 mov_XXX 类名
						var moveCls = "mov_" + clsString.split(" ")[1];
						query(ockDom[index]).addClass(moveCls);
						
						// 设置button样式为默认状态样式
						query(ockDom[index]).style("color","#8e8e8e")
											  .style("opacity","0.7");
						
					}
				}
			}
			
		});
	});