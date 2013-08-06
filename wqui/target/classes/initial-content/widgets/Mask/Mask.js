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

define("widgets/Mask/Mask",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/Evented",
		"spolo/data/folder",
		"dojo/NodeList-fx"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, 
		query, on, dom, lang, domConstruct, Evented
	){
		// 记录动画状态
		var Animation = 0;
		
		var ret = declare("widgets/Mask/Mask",[_WidgetBase, _TemplatedMixin, Evented ],{
			
			constructor:function(){
			},
			postCreate: function(){
				
			}
			
		});
		
		var Client = {
			viewportWidth: function() {
				return self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
			},        
			viewportHeight: function() {
				return self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
			}
		}

		// 设置遮罩层的位置
		function setMaskPos(){
			var w = Client.viewportWidth();
			var h = Client.viewportHeight();
			var mask = query(".mask");
			var maskMsg = query(".maskMsg");
			var logWindow = query(".logWindow");
			
			//实时将屏幕的大小同步至遮罩
			mask.style({width:w+"px",height:h+"px"});
			
			//实时调整消息层的位置
			var left = ((w - (maskMsg.style("width")[0]+4))/2)+"px";
			var top = ((h - (maskMsg.style("height")[0]+4))/2) - (logWindow.style("display") == "block" ? 150 : 0)+"px";
			maskMsg.style({left:left,top:top});
		}
		
		// 设置log窗口的位置
		function setShowWindowPos(resize){
			var w = Client.viewportWidth();
			var h = Client.viewportHeight();
			var maskMsg = query(".maskMsg");
			var logWindow = query(".logWindow");
			// msg与logWindow的间距
			var margin_bottom = 10;
			
			var left = (w - (logWindow.style("width")[0]+4))/2+"px";
			var top = (maskMsg.style("top")[0]+maskMsg.style("height")[0]+4+margin_bottom)+"px";
			logWindow.style({left:left,top:top});
			
			// resize事件时不执行showLogWindow操作
			if(!resize){
				$(logWindow).slideDown(700,function(){
					logWindow.style({display:"block"})
					Animation = 1;// 可执行折叠操作
				});
			}
		}
		
		window.onresize = function(){
			setMaskPos();
			setShowWindowPos(true);
		};
		
		
		/**
		*显示遮罩层
		*/
		ret.show = function(){
			var h = Client.viewportHeight();
			var w = Client.viewportWidth();
			
			// 创建包围层
			var wrapDIV = domConstruct.create("div",
			{
				id:"wrapDIV",
				style:{
					display:"none"
				}
			},document.body);
			
			//创建遮罩层
			domConstruct.create("div",
			{
				className:"mask",
				style:{
					"position": "absolute",
					"left": "0px",
					"top": "0px",
					"z-index": "1001",
					"background": "#fff"
				}
			},wrapDIV);
			
			//创建提示层
			domConstruct.create("div",
			{
				className:"maskMsg",
				innerHTML:"<div class='mainMsg'>"+
					"<img class='message' src='/widgets/Mask/images/mask_loading.gif'/>"+
					"<div class='divMsg'>处理中...</div>"+
					"<img class='processDetail' src='/widgets/Mask/images/detailUp.png'/>"+
					"<img class='close' src='/widgets/Mask/images/close.png'/>"+
					"</div>"
			},wrapDIV);
			
			//创建log窗口
			domConstruct.create("ul",
			{
				className:"logWindow"
			},wrapDIV);
			
			// 显示遮罩
			$(wrapDIV).fadeIn(200,function(){
				$(".maskMsg",wrapDIV).fadeIn(300,function(){
				});
			});
			
			// 处理详情
			on(query(".mainMsg .processDetail"),"click",function(){
				if(Animation == 0){// 执行展开动画
					// 显示log窗口
					ret.showLogWindow();
				}
				if(Animation == 1){// 执行折叠动画
					this.src = "/widgets/Mask/images/detailUp.png";
					Animation = 2;// 动画正在执行
					// 隐藏log窗口
					ret.hideLogWindow();
				}
			});
			
			setMaskPos();
		};
		/**
		*隐藏遮罩层
		*/
		ret.hide = function(){
			//删除遮罩层
			$(".maskMsg,.logWindow","#wrapDIV").fadeOut(300,function(){
				//orphan()
				$("#wrapDIV").fadeOut(300,function(){
					//domConstruct.destroy(wrapDIV);
					$(".maskMsg,.logWindow").stop();//结束正在执行的动画
					Animation = 0;//可继续执行展开
					$("#wrapDIV").remove();
				});
			});
		};
		/**
		*处理过程消息
		*/
		ret.message = function(content,type){
			if(typeof(content) == "boolean" && type == undefined){
				type = content;
				content = false;
			}else if(typeof(content) == "boolean" && typeof(type) == "string"){
				// 参数互换
				var temp = content;
				content = type;
				type = temp;
			}
			if(type){
				$(".mainMsg .message").attr("src","/widgets/Mask/images/success.png");
				$(".mainMsg .divMsg").html(content || "处理完成！");
			}else if(type == false){
				$(".mainMsg .message").attr("src","/widgets/Mask/images/failure.png");
				$(".mainMsg .divMsg").html(content || "处理失败！");
			}else{
				$(".mainMsg .divMsg").html(content || "未知状态");
				if(!content){
					ret.appendLogItem("未知状态，程序未被指定状态。");
				}
			}
			
			// 处理完毕后添加关闭功能
			if(typeof(type) == "boolean"){
				$(".mainMsg .close").fadeIn(500,function(){
					on(query(".mainMsg .close"),"click",function(){
						$(".maskMsg,.logWindow").stop();//结束正在执行的动画
						Animation = 0;//可继续执行展开
						ret.hide();
					});
				});
			}
		}
		/**
		*显示log窗口
		*/
		ret.showLogWindow = function(){
			// 设置按钮已展开
			query(".mainMsg .processDetail").attr("src","/widgets/Mask/images/detailDown.png");
			Animation = 2;// 动画正在执行
			var top = query(".maskMsg").style("top")[0] - 150;
			$(".maskMsg").animate({"top":top},500,function(){
				// 设置log窗口的位置
				setShowWindowPos();
			});
		};
		/**
		*隐藏log窗口
		*/
		ret.hideLogWindow = function(){
			var logWindow = query(".logWindow");
			$(logWindow).slideUp(700,function(){
				var top = query(".maskMsg").style("top")[0] + 150;
				$(".maskMsg").animate({"top":top},500,function(){
					Animation = 0;// 可执行展开操作
				});
			});
		}
		/**
		*追加log项
		*/
		ret.appendLogItem = function(content){
			$(".logWindow").append("<li>"+content+"</li>");
		}
		/**
		*清空log项
		*/
		ret.ClearLogItem = function(){
			$(".logWindow").empty();
		}
		return ret;
	});