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

define("widgets/menu/ThirdNav/main",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./template/template.html",
		"dojo/query",
		"dojo/Evented"
	],function
	(
		declare,_WidgetBase, _TemplatedMixin, template, 
		query, Evented
	){
		//重写setTimeout方法
		var __sto = setTimeout;     
		window.setTimeout = function(callback,timeout,param)
		{     
			var args = Array.prototype.slice.call(arguments,2);     
			var _cb = function()
			{     
				callback.apply(null,args);     
			}     
			return __sto(_cb,timeout);     
		}
		//初始化事件
		function initEvent()
		{
			var dthis = this;
			var time;
			require(["dojo/query","dojox/NodeList/delegate","dojo/dom-construct"],function(query,delegate,domConstruct)
			{
				//二级导航条的鼠标滑动事件
				query(dthis.thirdnav_overlayNode).delegate(".secNav","mouseover",function()
				{
					if(time != undefined)
					{
						clearTimeout(time);
					}
					var left = this.offsetLeft;
					var top = this.offsetTop;
					var firstnavpath = this.getAttribute("firstnavpath");
					var path = this.getAttribute("path");
					var secondCatData = getThirdDataByFirst.call(dthis,firstnavpath,path);
					if(secondCatData.length > 0)
					{
						var json = 
						{
							"left":left,
							"top":top,
							"catData":secondCatData
						};
						setTimeout(function()
						{
							showThirdNav.call(dthis,json);
						},200);
					}
					else
					{
						domConstruct.empty(dthis.thirdnav_thirdnavNode);
					}
				});
				query(dthis.thirdnav_overlayNode).delegate(".secNav","mouseout",function()
				{
					var html = dthis.thirdnav_thirdnavNode.innerHTML;
					if(html != "")
					{
						time = setTimeout(function()
						{
							domConstruct.empty(dthis.thirdnav_thirdnavNode);
						},200);
					}
				});
				//小箭头添加事件
				query(dthis.thirdnav_overlayNode).delegate(".caret","click",function()
				{
					var sib = query(this).next().children()[0];
					var path = sib.getAttribute("path");
					var left = sib.offsetLeft;
					var top = sib.offsetTop;
					var firstnavpath = sib.getAttribute("firstnavpath");
					var secondCatData = getThirdDataByFirst.call(dthis,firstnavpath,path);
					if(secondCatData.length > 0)
					{
						var json = 
						{
							"left":left,
							"top":top,
							"catData":secondCatData
						};
						showThirdNav.call(dthis,json);
					}
				});
				//三级分类的鼠标事件
				query(dthis.thirdnav_thirdnavNode).delegate(".dropdown-menu","mouseover",function(){
					clearTimeout(time);
				});
				query(dthis.thirdnav_thirdnavNode).delegate(".dropdown-menu","mouseout",function(){
					//clearTimeout(time);
					var html = dthis.thirdnav_thirdnavNode.innerHTML;
					if(html != "")
					{
						time = setTimeout(function()
						{
							domConstruct.empty(dthis.thirdnav_thirdnavNode);
						},600);
					}
				});
				/////////////////////////////////////以下是发送事件和显示导航数据，两者进行合并/////////////////////////////////////////////
				query(dthis.thirdnav_navbarNode).delegate(".firstNav","click",function()//点击一级导航
				{
					var path = this.getAttribute("path");
					var li = query(this).parents("li")[0];
					changeStyle.call(dthis,li);
					var data = 
					{
						"catData":dthis.arrData,
						"path":path
					};
					var catData = getSecondNavDataByPath.call(dthis,data);
					var json = 
					{
						"catData":catData,
						"path":path
					};
					showSecondNav.call(dthis,json);
					var flag = check.call(dthis,path);
					if(flag)
					{
						emitEvent.call(dthis,path);
					}
				});
				query(dthis.thirdnav_overlayNode).delegate(".secNav","click",function()//二级导航点击
				{
					var path = this.getAttribute("path");
					var flag = check.call(dthis,path);
					if(flag)
					{
						emitEvent.call(dthis,path);
					}
				});
				query(dthis.thirdnav_thirdnavNode).delegate(".thirdNav","click",function()
				{
					var path = this.getAttribute("path");
					var flag = check.call(dthis,path);
					if(flag)
					{
						emitEvent.call(dthis,path);
					}
				});
			});
		}
		//发送事件
		function emitEvent(path)
		{
			var dthis = this;
			require(["dojo/on"],function(on)
			{
				var json = 
				{
					path:path
				};
				dthis.emit("changeNav",json);
			});
		}
		//根据第一级导航找到第三极导航的对应数据
		function getThirdDataByFirst(firstnavpath,path){
			var dthis = this;
			var firData = 
			{
				"catData":dthis.arrData,
				"path":firstnavpath
			};
			var firstCatData = getSecondNavDataByPath.call(dthis,firData);
			var secData =
			{
				"catData":firstCatData,
				"path":path
			};
			var secondCatData = getSecondNavDataByPath.call(dthis,secData);
			return secondCatData;
		}
		//检查点击的分类是否应该发送事件
		function check(path)
		{
			var dthis = this;
			if(dthis.path == path)
			{
				return false;
			}
			else
			{
				dthis.path = path;
				return true;
			}
		}
		//初始化一级导航
		function initNavData(cateData){
			var dthis = this;
			require(["dojo/dom-construct","dojo/query","dojo/dom-attr"],function(domConstruct,query,domAttr){
				console.log("一级导航的数据：");
				console.log(cateData);
				if(cateData.length)
				{
					var div = domConstruct.create("div",
						{
							class:"navbar-inner"
						},
						dthis.thirdnav_navbarNode
					);
					var ul = domConstruct.create("ul",
						{
							class:"nav"
						},
						div
					);
					for(var i = 0;i < cateData.length;i++)
					{
						var li = domConstruct.create("li",
							{},
							ul
						);
						var a = domConstruct.create("a",
							{
								class:"firstNav",
								name:cateData[i]["resourceName"],
								path:cateData[i]["path"],
								innerHTML:cateData[i]["resourceName"],
								title:cateData[i]["resourceName"]
							},
							li
						);
						if(i == 0)
						{
							domAttr.set(query(li)[0],"class","active");
							if(cateData[i]["totalNum"] > 0)
							{
								var json = 
								{
									"catData":cateData[i]["catData"],
									"path":cateData[i]["path"]
								};
								showSecondNav.call(dthis,json);
							}
							else
							{
								dthis.thirdnav_overlayNode.innerHTML = "没有分类了...";//这里有待优化
							}
						}
					}
				}
			});
		}
		//获取二级导航
		function showSecondNav(json)
		{
			var dthis = this;
			require(["dojo/dom-construct"],function(domConstruct)
			{
				console.log("二级导航的数据");
				console.log(json["catData"]);
				dthis.thirdnav_overlayNode.innerHTML = "";
				var cateData = json["catData"];
				var path = json["path"];
				var ul = domConstruct.create("ul",
					{
						class:"breadcrumb"
					},
					dthis.thirdnav_overlayNode
				);
				for(var i = 0;i < cateData.length;i++)
				{
					if(cateData[i]["catData"].length > 0)
					{
						var span = domConstruct.create("span",
							{
								class:"caret"
							},
							ul
						);
					}
					var li = domConstruct.create("li",
						{},
						ul
					);
					var a = domConstruct.create("a",
						{
							name:cateData[i]["resourceName"],
							path:cateData[i]["path"],
							firstnavpath:path,
							innerHTML:cateData[i]["resourceName"],
							class:"secNav",
							title:cateData[i]["resourceName"]
						},
						li
					);
				}
			});
		}
		//显示三级导航
		function showThirdNav(json)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-style","dojo/dom-construct"],function(query,domStyle,domConstruct){
				var catData = json["catData"];
				var left = json["left"];
				var top = json["top"];
				dthis.thirdnav_thirdnavNode.innerHTML = "";
				var totalUL = Math.ceil(catData.length / 6);
				var widthul = 0;
				var ul = domConstruct.create("ul",
					{
						class:"dropdown-menu"
					},
					dthis.thirdnav_thirdnavNode
				);
				for(var i = 0;i < totalUL;i++)
				{
					var min = Math.min(catData.length,(i + 1) * 6);
					for(var key = i * 6;key < min;key++)
					{
						var li = domConstruct.create("li",
							{
							},
							ul
						);
						var a = domConstruct.create("a",
							{
								name:catData[key]["resourceName"],
								path:catData[key]["path"],
								innerHTML:catData[key]["resourceName"],
								class:"thirdNav",
								title:catData[key]["resourceName"]
							},
							li
						);
						widthul += query(li).style("width")[0];
					}
				}
				widthul = widthul / catData.length;
				domStyle.set(query(dthis.thirdnav_thirdnavNode)[0],"width",(widthul * totalUL + 50)  + "px");
				domStyle.set(query(dthis.thirdnav_thirdnavNode)[0],"left",(left - 10) + "px");
			});
		}
		//根据path找到对应的二级导航的数据
		function getSecondNavDataByPath(data)
		{
			var dthis = this;
			var arrData = data["catData"];
			var path = data["path"];
			var catData;
			for(var key = 0;key < arrData.length;key++)
			{
				var arrDataPath = arrData[key]["path"];
				if(arrDataPath == path)
				{
					catData = arrData[key]["catData"];
					break;
				}
			}
			return catData;
		}
		//鼠标滑过时对应的修改样式
		function changeStyle(li)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-attr","dojo/dom-class","dojo/NodeList-traverse"],function(query,domAttr,domClass)
			{
				domAttr.set(li,"class","active");
				var sib = query(li).siblings();
				for(var i = 0;i < sib.length;i++)
				{
					if(domClass.contains(sib[i],"active"))
					{
						domClass.remove(sib[i],"active");
					}
				}
			});
		}
		var ret = declare("widgets/menu/ThirdNav/main",[_WidgetBase, _TemplatedMixin, Evented],
		{
			hrefURL : require.toUrl("widgets/menu/ThirdNav/css/style.css"), // 定义widget的css样式文件
			// 指定template
			templateString: template,
			constructor:function()
			{
				this.arrData = [];//缓冲返回的三级分类的数据
				this.path = "";//缓存当前点击选中的分类的path
			},
			postCreate: function()
			{
				this.inherited(arguments);
			},
			initialize:function(cateData)
			{
				this.arrData = cateData;
				initNavData.call(this,cateData);
				initEvent.call(this);
			}
		});
		return ret;
	});