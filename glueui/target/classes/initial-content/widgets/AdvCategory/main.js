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

define("widgets/AdvCategory/main",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./template/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/Evented",
		"dojo/NodeList-traverse"
	],function
	(
		declare,_WidgetBase, _TemplatedMixin, template, 
		query, on, domConstruct, domAttr, Evented
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
		//根据条件更新当前选中的分类的变量
		function updateSelectCategory(catpath,path,isradio,cat)
		{
			var dthis = this;
			if(dthis.selectedcategory[catpath].length == 0)
			{
				dthis.selectedcategory[catpath].push(path);
			}
			else
			{
				if(isradio == false)//如果是多选
				{
					var flag = false;
					for(var i = 0;i < dthis.selectedcategory[catpath].length;i++)
					{
						if(dthis.selectedcategory[catpath][i] == path)
						{
							var temp;
							temp = dthis.selectedcategory[catpath][i];
							dthis.selectedcategory[catpath][i] = dthis.selectedcategory[catpath][dthis.selectedcategory[catpath].length - 1];
							dthis.selectedcategory[catpath][dthis.selectedcategory[catpath].length - 1] = temp;
							dthis.selectedcategory[catpath].pop();
							flag = true;
							break;
						}
					}
					if(!flag)
					{
						dthis.selectedcategory[catpath].push(path);
					}
				}
				else//单选
				{
					var sela = getSelectedSpan.call(dthis,cat);//得到的是已选分类a标签
					var selspan = query(sela).children()[0];
					var selspanarr = query(selspan).children(".multicategory"); 
					var isleaf = selspanarr[selspanarr.length - 1].getAttribute("isleaf");
					if(isleaf == "false")
					{
						dthis.selectedcategory[catpath].push(path);
					}
					else
					{
						dthis.selectedcategory[catpath].pop();
						dthis.selectedcategory[catpath].push(path);
					}
				}
			}
		}
		//初始化事件
		function initEvent()
		{
			var dthis = this;
			require(["dojo/query","dojox/NodeList/delegate","dojo/dom-attr","dojo/on","dojo/mouse","dojo/dom-style","dojo/NodeList-traverse"],function(query,delegate,domAttr,on,mouse,domStyle){
				//多级分类(包括上面显示的和更多选项中的多级)点击发出事件，并进行dom操作
				query(dthis.categorylistNode).delegate(".cat_item_radio","click",function()//单选事件
				{
					var catpath = query(this).parent(".cat_body")[0].getAttribute("path");
					var path = this.attributes["path"].nodeValue;
					var cat = domAttr.get(query(this)[0],"alt");
					var json = 
					{
						"path":path
					};
					updateSelectCategory.call(dthis,catpath,path,true,cat);
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					dthis.clickcat = this;
					dthis.subdiv = query(this).parent()[0];
					dthis.emit("subcatItem",json);//发出事件，得到子类
				});
				query(dthis.overlayNode).delegate(".cat_item_radio","click",function()//单选事件
				{
					//这里更新选中的分类
					var path = this.attributes["path"].nodeValue;
					var cat = domAttr.get(query(this)[0],"alt");
					var catpath = query(this)[0].getAttribute("catpath");
					var json = 
					{
						"path":path
					};
					updateSelectCategory.call(dthis,catpath,path,true,cat);
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					dthis.clickcat = this;
					dthis.subdiv = query(this).parent()[0];
					dthis.emit("subcatItem",json);//发出事件，得到子类
				});
				//多选分类事件处理
				query(dthis.categorylistNode).delegate(".cat_item","click",function()//多选事件
				{
					//这里更新选中的分类
					var cat = domAttr.get(query(this)[0],"alt");
					var path = query(this)[0].getAttribute("path");
					var catpath = query(this)[0].getAttribute("catpath");
					updateSelectCategory.call(dthis,catpath,path,false);
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					catItemClick.call(dthis,this,this.innerHTML,cat,catpath);
				});
				query(dthis.overlayNode).delegate(".cat_item","click",function()//多选事件
				{
					//这里更新选中的分类
					var cat = domAttr.get(query(this)[0],"alt");
					var path = query(this)[0].getAttribute("path");
					var catpath = query(this)[0].getAttribute("catpath");
					updateSelectCategory.call(dthis,catpath,path,false);
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					catItemClick.call(dthis,this,this.innerHTML,cat,catpath);
				});
				//鼠标滑过显示同级分类事件
				query(dthis.category_selectedListNode).delegate(".multicategory","mouseover",function()
				{
					var path = this.getAttribute("path");
					var json = 
					{
						"path":path
					};
					dthis.mouse_selcat = this;
					dthis.emit("siblingcatItem",json);//发出事件，得到同级分类
				});
				query(dthis.category_selectedListNode).delegate(".multicategory","mouseout",function()
				{
					dthis.time = setTimeout(function()
					{
						require(["dojo/query","dojo/dom-style"],function(query,domStyle){
							query(dthis.equalmainNode)[0].innerHTML = "";
							domStyle.set(query(dthis.category_equalcat_overlayNode)[0],"visibility","hidden");
						});
					},600);
				});
				query(dthis.category_equalcat_overlayNode).on(mouse.enter,function()
				{
					clearTimeout(dthis.time);
				});
				query(dthis.category_equalcat_overlayNode).on(mouse.leave,function()
				{
					dthis.time = setTimeout(function()
					{
						require(["dojo/query","dojo/dom-style"],function(query,domStyle){
							query(dthis.equalmainNode)[0].innerHTML = "";
							domStyle.set(query(dthis.category_equalcat_overlayNode)[0],"visibility","hidden");
						});
					},600);
				});
			});
		}
		//将初始化的分类显示在前端(只显示父级的分类名称),需再支持一个方法显示某分类下的子分类
		function showInitCategory(cateData)
		{
			var count = 0;
			var dthis = this;
			require(["dojo/dom-construct","dojo/on","dojo/mouse","dojo/query","dojo/dom-attr","dojo/dom-style"],function(domConstruct,on,mouse,query,domAttr,domStyle)
			{
				for(var key = 0;key < cateData.length;key++)
				{
					if(cateData[key]["catData"].length > 0)
					{
						var isradio = cateData[key]["isradio"];
						dthis.selectedcategory[cateData[key]["path"]] = [];
						if(count < 3)
						{
							var div = domConstruct.create
							(
								"div",
								{
									class:"category_list",
									alt:cateData[key]["resourceName"],
									catpath:cateData[key]["path"],
									isradio:isradio+""
								},
								dthis.categorylistNode
							);
							var divhead = domConstruct.create
							(
								"div",
								{
									class:"cat_head",
									innerHTML:"<span class=\"note_bold\">"+cateData[key]["resourceName"]+"</span>",
									//innerHTML:"<span class=\"note_bold\">"+"家装家居(last)</span>",
									path:cateData[key]["path"],
									isradio:isradio+""
								},
								div
							);
							var cleardiv = domConstruct.create
							(
								"div",
								{
									style:"clear:both;"
								},
								dthis.categorylistNode
							);
							var divbody = domConstruct.create
							(
								"div",
								{
									class:"cat_body",
									path:cateData[key]["path"],
									style:"max-height:120px;overflow:auto;height:auto;"
								},
								div
							);
							//显示某一分类下的一级子分类方法
							getSubCategory.call(dthis,cateData[key],divbody,cateData[key]["isradio"]);
							count++;
						}
						else
						{	
							function itemmouse(cateData,div,isradio,cat)
							{
								var sela;
								on(a,mouse.enter,function(evt)
								{
									sela = this;
									if(dthis.morecategory_time != undefined)
									{
										clearTimeout(dthis.morecategory_time);
									}
									setTimeout(function()
									{
										div.innerHTML = "";
										var jsondiv = 
										{
											"div":div,
											"left":dthis.offsetLeft,
											"top":dthis.offsetTop
										};
										getMoreSubCategory.call(dthis,cateData,jsondiv,isradio,a);
										changeBorderStyle.call(dthis,true);
									},200);
									if(dthis.text != "")
									{
										changeBorderStyle.call(dthis,true);
										div.innerHTML = dthis.text;
									}
								});
								on(a,mouse.leave,function(evt)
								{
									sela = this;
									dthis.morecategory_time = setTimeout(function()
									{								
										changeBorderStyle.call(dthis,false);
										emptydiv.call(dthis);
									},200);
								});
								on(morediv,mouse.enter,function(evt)
								{
									clearTimeout(dthis.morecategory_time);
								});
								on(morediv,mouse.leave,function(evt)
								{
									dthis.morecategory_time = setTimeout(function()
									{
										dthis.text = div.innerHTML;
										changeBorderStyle.call(dthis,false);
										emptydiv.call(dthis);
									},200);
								});
							}
							var a = domConstruct.create
							(
								"a",
								{
									class:"cat_more_item",
									innerHTML:cateData[key]["resourceName"],
									path:cateData[key]["path"],
									isradio:cateData[key]["isradio"]+"",
									alt:cateData[key]["resourceName"]
								},
								dthis.catmorebodyNode
							);
							if(count == 3)
							{
								dthis.offsetLeft = a.offsetLeft;
								dthis.offsetTop = a.offsetTop;
							}
							count++;
							var morediv = dthis.overlayNode;
							domAttr.set(query(morediv)[0],"alt",cateData[key]["resourceName"]);
							var alt = domAttr.get(query(morediv)[0],"alt");
							itemmouse.call(dthis,cateData[key],morediv,cateData[key]["isradio"],alt);
						}
					}
				}
			});
		}
		//显示某一分类下的一级子分类方法
		function getSubCategory(cateData,div,isradio)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-attr","dojo/dom-style","dojo/dom-construct"],function(query,domAttr,domStyle,domConstruct){
				for(var key = 0;key < cateData["catData"].length;key++)
				{
					var a;
					if(isradio == true || isradio == "true")
					{
						a = domConstruct.create
						(
							"a",
							{
								class:"cat_item_radio",
								alt:cateData["resourceName"],
								path:cateData["catData"][key]["path"],
								innerHTML:cateData["catData"][key]["resourceName"],
								catpath:cateData["path"]
							},
							div
						);
					}
					else
					{
						a = domConstruct.create
						(
							"a",
							{
								class:"cat_item",
								alt:cateData["resourceName"],
								path:cateData["catData"][key]["path"],
								innerHTML:cateData["catData"][key]["resourceName"],
								catpath:cateData["path"]
							},
							div
						);
					}
				}
			});
		}
		//显示更多选项中的分类子类
		function getMoreSubCategory(cateData,json,isradio,d_this)
		{
			var dthis = this;
			var div = json["div"];
			var left = json["left"];
			var top = json["top"];
			require(["dojo/query","dojo/dom-attr","dojo/dom-style","dojo/dom-construct"],function(query,domAttr,domStyle,domConstruct){
				var innerhtml = "";
				if(isradio == false)//如果是多选
				{
					for(var key = 0;key < cateData["catData"].length;key++)
					{
						var a = domConstruct.create
						(
							"a",
							{
								alt:cateData["resourceName"],
								class:"cat_item",
								path:cateData["catData"][key]["path"],
								innerHTML:cateData["catData"][key]["resourceName"],
								catpath:cateData["path"],
								isradio:isradio
							},
							div
						);
					}
					showSelectedMultiCate.call(dthis,cateData["resourceName"]);
				}
				else//单选
				{
					var a = getSelectedSpan.call(dthis,cateData["resourceName"]);
					if(a != undefined)
					{
						//这里发出事件，用来获取子分类
						var selspan = query(a).children()[0];
						var selspanarr = query(selspan).children(".multicategory");
						var path = query(selspanarr[selspanarr.length - 1])[0].getAttribute("path");
						var json = 
						{
							"path":path
						};
						dthis.cat = domAttr.get(query(d_this)[0],"alt");
						dthis.catpath = d_this.getAttribute("path");
						dthis.subdiv = div;
						dthis.emit("moreCategoryItem",json);
					}
					else
					{
						for(var key = 0;key < cateData["catData"].length;key++)
						{
							var a = domConstruct.create
							(
								"a",
								{
									alt:cateData["resourceName"],
									class:"cat_item_radio",
									path:cateData["catData"][key]["path"],
									innerHTML:cateData["catData"][key]["resourceName"],
									catpath:cateData["path"],
									isradio:isradio
								},
								div
							);
						}
					}
				}
				domStyle.set(query(div)[0],"left",left + "px");
				domStyle.set(query(div)[0],"top",(top + 20) + "px");
				domAttr.set(query(div)[0],"alt",cateData["resourceName"]);
			});
		}
		//选择出已选择的分类，并在下面的分类中显示已选中的状态(多选)
		function showSelectedMultiCate(catname){
			var dthis = this;
			require(["dojo/query","dojo/dom-style","dojo/NodeList-traverse"],function(query,domStyle){
				var selname = getSelCategory.call(dthis,catname);
				if(selname.length)
				{
					var currname = query(dthis.overlayNode).children();
					for(var i = 0;i < selname.length;i++)
					{
						for(var j = 0;j < currname.length;j++)
						{
							if(selname[i] == currname[j].innerHTML)
							{
								domStyle.set(query(currname)[j],"backgroundPosition","0 -207.5px");
							}
						}
					}
				}
			});
		}
		//通过当前鼠标滑过选中的组来得到已经选择的组的分类
		function getSelCategory(cat)
		{
			var dthis = this;
			var selname = [];
			require(["dojo/query","dojo/dom-attr"],function(query,domAttr){
				var a = getSelectedSpan.call(dthis,cat);
				if(a != undefined)
				{
					var text = a.getAttribute("text");
					selname = text.split("：")[1].split("、");
				}
			});
			return selname;
		}
		//改变边框样式
		function changeBorderStyle(flag)
		{
			var dthis = this;
			require(["dojo/dom-style","dojo/query"],function(domStyle,query){
				if(flag)
				{
					domStyle.set(dthis.overlayNode,"border","1px solid #ddd");
					//domStyle.set(a,"border-bottom-color","#fff");
					
				}
				else
				{
					domStyle.set(dthis.overlayNode,"border","0px solid #ddd");
					//domStyle.set(a,"border-bottom-color","#ddd");
				}
			});
		}
		//清空更多选项中div中的内容
		function emptydiv(){
			var dthis = this;
			require(["dojo/query"],function(query)
			{
				dthis.overlayNode.innerHTML = "";
			});
		}
															/*以下是处理点击事件的函数*/
			

													/*以下处理的是单选*/
		//遍历得到的子分类，显示在相应的位置
		function showSubCategory(json)//path指的是点击某一个分类的路径
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-construct","dojo/dom-attr","dojo/NodeList-traverse"],function(query,domConstruct,domAttr)
			{
				var div = json["subdiv"];
				var cat = json["catgroup"];
				var catname = json["catname"];
				var subcatarr = json["subcatarr"];
				var path = json["path"];
				var catpath = json["catpath"];
				var sela = getSelectedSpan.call(dthis,cat);//得到的是a标签
				var selspan = query(sela).children()[0];
				var selspanarr = query(selspan).children(".multicategory");
				var selpath;
				if(sela)
				{
					var isleaf = (selspanarr[selspanarr.length - 1]).getAttribute("isleaf");
					if(subcatarr.length)
					{
						if(isleaf == "false")
						{
							getMultiSelectCate.call(dthis,catname,cat,path,subcatarr,catpath);
						}
						else
						{
							domAttr.set(query(selspanarr[selspanarr.length - 1])[0],"path",path);
							domAttr.set(query(selspanarr[selspanarr.length - 1])[0],"isleaf","false");
							query(selspanarr[selspanarr.length - 1])[0].innerHTML = catname;
						}
						refreshCate.call(dthis,subcatarr,div,cat,catpath);
					}
					else
					{
						var isleaf = (selspanarr[selspanarr.length - 1]).getAttribute("isleaf");
						var selpath = (selspanarr[selspanarr.length - 1]).getAttribute("path");
						//如果不是叶子节点，那么就进行追加
						if(isleaf == "false")
						{
							getMultiSelectCate.call(dthis,catname,cat,path,subcatarr,catpath);
							//从更多选项中拿出一个分类，并且发出事件
							getCategoryFromMoreItem.call(dthis);
						}
					}
				}
				else
				{
					showMulCategory.call(dthis,catname,cat,path,subcatarr,catpath);
					if(subcatarr.length)
					{
						refreshCate.call(dthis,subcatarr,div,cat,catpath);//如果有子类，那么刷新对应的div
					}
					else
					{
						getCategoryFromMoreItem.call(dthis);
					}
				}
			});
		}
		//从更多选项中拿出一个分类，并且发出事件
		function getCategoryFromMoreItem()
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-construct","dojo/NodeList-traverse"],function(query,domConstruct)
			{
				var div = query(dthis.clickcat).parents(".category_list")[0];//首先检查点击的是上面的分类还是更多选项中的分类
				if(div)
				{
					var morecatarr = query(dthis.catmorebodyNode).children();
					if(morecatarr.length > 0)
					{
						var path = morecatarr[0].getAttribute("path");
						var jsondata = 
						{
							path:path
						};
						dthis.catpath = path;
						dthis.cat = morecatarr[0].getAttribute("alt");
						dthis.isradio = morecatarr[0].getAttribute("isradio");
						if(morecatarr.length == 1)
						{
							dthis.offsetLeft = query(dthis.catmorebodyNode).children()[0].offsetLeft;
							dthis.offsetTop = query(dthis.catmorebodyNode).children()[0].offsetTop;
						}
						domConstruct.destroy(morecatarr[0]);
						dthis.emit("addCategory",jsondata);
					}
					domConstruct.destroy(div);
				}
				else//如果点击的是更多选项中的分类
				{
					var morecatarr = query(dthis.catmorebodyNode).children();
					var alt = dthis.clickcat.getAttribute("alt");
					if(morecatarr.length > 0)
					{
						if(morecatarr.length == 1)
						{
							dthis.offsetLeft = query(dthis.catmorebodyNode).children()[0].offsetLeft;
							dthis.offsetTop = query(dthis.catmorebodyNode).children()[0].offsetTop;
						}
						for(var i = 0;i < morecatarr.length;i++)
						{
							var catname = morecatarr[i].getAttribute("alt");
							if(catname == alt)
							{
								domConstruct.destroy(morecatarr[i]);
								break;
							}
						}
						dthis.overlayNode.innerHTML = "";
					}
					if(query(dthis.catmorebodyNode).children().length > 0)
					{
						dthis.offsetLeft = query(dthis.catmorebodyNode).children()[0].offsetLeft;
						dthis.offsetTop = query(dthis.catmorebodyNode).children()[0].offsetTop;
					}
				}
			});
		}
		//刷新分类数据
		function refreshCate(subCatArr,div,cat,catpath)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-construct"],function(query,domConstruct)
			{
				var text = div.innerHTML.trim();
				if(text != "")
				{
					domConstruct.empty(div);
				}
				for(var key = 0;key < subCatArr.length;key++)
				{
					var cate = domConstruct.create
					(
						"a",
						{
							class : "cat_item_radio",
							innerHTML : subCatArr[key]["resourceName"],
							alt:cat,
							path:subCatArr[key]["path"],
							catpath:catpath
						},
						div
					);
				}
			});
		}
		//显示已经选择的多级分类(单选)
		function getMultiSelectCate(text,cat,path,subcatarr,catpath)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-attr"],function(query,domAttr){
				var isleaf = false;
				if(subcatarr.length)
				{
					isleaf = false;
				}
				else
				{
					isleaf = true;
				}
				var sela = getSelectedSpan.call(dthis,cat);//得到的是a标签
				var selspan = query(sela).children()[0];
				var selSpanText = selspan.textContent;
				var newText = "";
				selspan.innerHTML += "<span class=\"arrow\">></span>"+"<span class=\"multicategory\" path=\""+path+"\" isleaf=\""+isleaf+"\" alt=\""+cat+"\" catpath=\""+catpath+"\">"+text+"</span>";
				domAttr.set(sela,"text",selspan.innerHTML);
				domAttr.set(sela,"path",path);
			});	
		}
		//通过已经选中的分类判断是否已经选中当前组
		function getCategoryNameBySelected(cat)
		{
			var flag = false;//默认是还没有选择
			var dthis = this;
			require(["dojo/query","dojo/dom-attr","dojo/NodeList-traverse"],function(query,domAttr){
				var sel = query(".category_selectedList .category_selecteditem");
				if(sel.length){
					for(var i = 0;i < sel.length;i++){
						var alt = domAttr.get(query(sel[i])[0],"alt");
						if(alt != undefined){
							if(alt == cat){
								flag = true;
								break;
							}
						}
					}
				}
			});
			return flag;
		}
		//获取某个已经选中的分类的标签
		function getSelectedSpan(cat)
		{
			var a;
			var dthis = this;
			require(["dojo/query","dojo/dom-attr","dojo/NodeList-traverse"],function(query,domAttr){
				var sel = query(dthis.category_selectedListNode).children(".category_selecteditem");
				for(var i = 0;i < sel.length;i++)
				{
					var alt = domAttr.get(sel[i],"alt");
					if(alt == cat){
						a = sel[i];
						break;
					}
				}
			});
			return a;
		}
		//显示多级分类(单选)
		function showMulCategory(text,cat,path,subCatArr,catpath)
		{
			var dthis = this;
			require(["dojo/dom-construct","dojo/query","dojo/mouse","dojo/on","dojo/dom-attr","dojo/NodeList-traverse"],function(domConstruct,query,mouse,on,domAttr){
				var isleaf = false;//默认不是叶子节点
				if(subCatArr.length)
				{
					isleaf = false;
				}
				else
				{
					isleaf = true;
				}
				var a = domConstruct.create("a",
					{
						class : "category_selecteditem",
						text : cat + "：" + text,
						alt:cat,
						path:path,
						catpath:catpath
					},
					dthis.category_selectedListNode
				);
				var span = domConstruct.create
				(
					"span",
					{
						class:"mulselectedSpan",
						innerHTML : "<span>"+cat+"</span>" + "：" + "<span class=\"multicategory\" path=\""+path+"\" isleaf=\""+isleaf+"\" alt=\""+cat+"\" catpath=\""+catpath+"\">"+text+"</span>",
					},
					a
				);
				var spanX = domConstruct.create
				(
					"span",
					{
						class : "close_x",
						innerHTML : "X"
					},
					a
				);
				query(spanX).on("click",function()//这里更新选中的分类(单选)
				{
					var catpath = domAttr.get(query(this).parent()[0],"catpath");
					var alt = domAttr.get(query(this).parent()[0],"alt");
					dthis.selectedcategory[catpath] = [];
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					domConstruct.destroy(query(this).parent()[0]);
					var div = getCategoryBySelected.call(dthis,cat);
					if(div)
					{
						var divclass = domAttr.get(div,"class");
						//判断是在上面还是在更多选项中
						if(divclass == "category_list")
						{
							dthis.subdiv = query(div).children(".cat_body")[0];
							dthis.cat = div.getAttribute("alt");
							dthis.catpath = div.getAttribute("catpath");
							var json = 
							{
								path:dthis.catpath
							};
							dthis.emit("moreCategoryItem",json);
						}
					}
					else
					{
						//判断上面显示分类的个数
						var catnum = query(dthis.categorylistNode).children(".category_list");
						if(catnum.length < 3)
						{
							dthis.cat = cat;
							dthis.catpath = catpath;
							dthis.isradio = "true";
							var json = 
							{
								path:dthis.catpath
							};
							dthis.emit("addCategory",json);
							//addCategory.call(dthis,dthis.subcatarr);
						}
						else
						{
							addCategoryToMore.call(dthis,alt,catpath);
						}
					}
				});
			});
		}
		//根据各个分类名称找到被删除的分类
		function getDelCategoryPath(cat)
		{
			var dthis = this;
			var path,divbody;
			var json = {};
			require(["dojo/dom-attr","dojo/query","dojo/NodeList-traverse"],function(domAttr,query)
			{
				var cates = query(".cat_head");
				for(var index = 0;index < cates.length;index++)
				{
					var text = cates[index].textContent;
					if(text == cat)
					{
						path = cates[index].getAttribute("path");
						divbody = query(cates[index]).siblings("div")[0];
						json["path"] = path;
						json["divbody"] = divbody;
						break;
					}
				}
			});
			return json;
		}
														/*以下处理的是多选*/
		//点击分类调用的显示方法(多选)
		function catItemClick(d_this,innerhtml,cat,catpath)
		{
			var dthis = this;
			require(["dojo/dom-style","dojo/dom-construct","dojo/query","dojo/dom-attr","dojo/NodeList-traverse"],
				function(domStyle,domConstruct,query,domAttr)
				{
					var pos = domStyle.get(d_this,"backgroundPosition");
					if(pos == "0px -192.5px")//显示选中状态
					{
						domStyle.set(d_this,"backgroundPosition","0 -207.5px");
						getCurrSelect.call(dthis,innerhtml,d_this,cat,catpath);
					}
					else//取消选中
					{
						domStyle.set(d_this,"backgroundPosition","0 -192.5px");
						var chi = query(dthis.category_selectedListNode).children();
						for(var i = 1;i < chi.length;i++){
							var text = query(chi[i])[0].attributes["text"].nodeValue;
							var idArr = text.split("：")[1].split("、");
							for(var key = 0;key < idArr.length;key++){
								if(innerhtml == idArr[key]){
									if(idArr.length == 1)
									{
										domConstruct.destroy(chi[i]);
									}
									else
									{
										var sela = getSelectedSpan.call(dthis,cat);//得到的是a标签
										var selspan = query(sela).children()[0];
										var str = selspan.innerHTML.split("：")[1];
										var index = str.indexOf(idArr[key],0);
										if(index == 0)
										{
											str = str.substring(index + 1 + idArr[key].length,str.length);
										}
										else
										{
											str = str.substring(0,index - 1) + str.substring(index + idArr[key].length,str.length);
										}
										selspan.innerHTML = selspan.innerHTML.split("：")[0] + "：" + str;
										domAttr.set(sela,"text",selspan.innerHTML);
										domAttr.set(sela,"title",selspan.innerHTML);
									}
								}
							}
						}
					}
				}
			);
		}
		//显示已选中分类(多选)
		function getCurrSelect(text,d_this,cat,catpath)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-attr","dojo/NodeList-traverse"],
				function(query,domAttr)
				{
					var flag = getCategoryNameBySelected(cat);
					if(flag)//已经选择过这个组的分类,先找到对应的元素
					{
						var sela = getSelectedSpan.call(dthis,cat);//得到的是a标签
						var selspan = query(sela).children()[0];
						selspan.innerHTML = selspan.innerHTML.split("：")[0] + "：" + text + "、" + selspan.innerHTML.split("：")[1];
						domAttr.set(sela,"text",selspan.innerHTML);
						domAttr.set(sela,"title",selspan.innerHTML);
					}
					else
					{
						showSelectedCategory.call(dthis,text,d_this,cat,catpath);
					}
				}
			);
		}
		//显示已经选中的分类
		function showSelectedCategory(text,d_this,cat,catpath)
		{
			var dthis = this;
			require(["dojo/dom-construct","dojo/on","dojo/dom-style","dojo/query","dojo/NodeList-traverse"],function(domConstruct,on,domStyle,query){
				var a = domConstruct.create("a",
					{
						class : "category_selecteditem",
						text : cat + "：" + text,
						alt:cat,
						title : cat + "：" + text,
						catpath:catpath
					},
					dthis.category_selectedListNode
				);
				var span = domConstruct.create("span",
					{//如果超出规定的长度，则通过下面的样式来解决
						class:"selectedSpan",
						innerHTML : cat + "：" + text
					},
					a
				);
				var spanX = domConstruct.create("span",
					{
						class : "close_x",
						innerHTML : "X"
					},
					a
				);
				query(spanX).on("click",function()
				{//这里更新选中的分类(多选)
					var catpath = domAttr.get(query(this).parent()[0],"catpath");
					dthis.selectedcategory[catpath] = [];
					dthis.emit("categoryItemChange",dthis.selectedcategory);//发出分类改变的事件
					domConstruct.destroy(query(this).parent()[0]);
					var json = getDelCategoryPath.call(dthis,cat);
					var div = json["divbody"];
					var chi = query(div).children();
					for(var i = 0;i < chi.length;i++)
					{
						domStyle.set(chi[i],"backgroundPosition","0 -192.5px");
					}
				});
			});
		}
		//切换分类时执行的方法
		function switchCategory()
		{
			var dthis = this;
			require(["dojo/dom-style","dojo/query","dojo/dom-attr","dojo/dom-construct","dojo/NodeList-traverse"],function(domStyle,query,domAttr,domConstruct){
				//删除dthis.mouse_selcat后面的分类
				var nextAll = query(dthis.mouse_selcat).nextAll();
				for(var i = 0;i < nextAll.length;i++)
				{			
					domConstruct.destroy(nextAll[i]);
				}
				var cat = domAttr.get(query(dthis.mouse_selcat)[0],"alt");
				var catpath = domAttr.get(query(dthis.mouse_selcat)[0],"catpath");
				//修改dthis.mouse_selcat的属性
				var sela = getSelectedSpan.call(dthis,cat);
				var selspan = query(sela).children()[0];
				var selspanarr = query(selspan).children(".multicategory");
				var changespan = selspanarr[selspanarr.length - 1];
				domAttr.set(changespan,"path",query(dthis.clickcat)[0].getAttribute("path"));
				var divclass = domAttr.get(dthis.subdiv,"class");
				if(dthis.subcatarr.length)
				{
					var alt = dthis.clickcat.getAttribute("alt");
					var catpath = dthis.clickcat.getAttribute("catpath");
					domAttr.set(changespan,"isleaf","false");
					var deldiv = getCategoryBySelected.call(dthis,alt);
					if(deldiv != undefined)//下面有对应的div
					{
						if(divclass == "cat_body")
						{
							refreshCate.call(dthis,dthis.subcatarr,dthis.subdiv,cat,catpath);
						}
					}
					else
					{
						addCategoryToMore.call(dthis,alt,catpath);
					}
				}
				else
				{
					var catname = dthis.clickcat.getAttribute("alt");
					var deldiv = getCategoryBySelected.call(dthis,catname);
					if(deldiv != undefined)//如果有对应的div
					{
						if(divclass == "cat_body")
						{
							refreshCate.call(dthis,dthis.siblingcatarr,dthis.subdiv,cat,catpath);
						}
						else
						{
							var morecatarr = query(dthis.catmorebodyNode).children();
							if(morecatarr.length == 1)
							{
								dthis.offsetLeft = query(dthis.catmorebodyNode).children()[0].offsetLeft;
								dthis.offsetTop = query(dthis.catmorebodyNode).children()[0].offsetTop;
							}
							domConstruct.destroy(deldiv);
						}
					}
					domAttr.set(changespan,"isleaf","true");
					
				}
				changespan.innerHTML = query(dthis.clickcat)[0].innerHTML;
				dthis.mouse_selcat = changespan;
			});
		}
		//根据已选中的分类名称找到下面对应的分类
		function getCategoryBySelected(catname)
		{
			var dthis = this;
			var deldiv;
			require(["dojo/query","dojo/dom-construct"],function(query,domConstruct)
			{
				var catdivarr = query(dthis.categorylistNode).children(".category_list");
				if(catdivarr.length)
				{
					for(var i = 0;i < catdivarr.length;i++){
						if(catdivarr[i].getAttribute("alt") == catname)
						{
							deldiv = catdivarr[i];
							break;
						}
					}
				}
				if(deldiv == undefined)
				{
					var morecatarr = query(dthis.catmorebodyNode).children();
					if(morecatarr.length)
					{
						for(var i = 0;i < morecatarr.length;i++){
							if(morecatarr[i].getAttribute("alt") == catname)
							{
								deldiv = morecatarr[i];
								break;
							}
						}
					}
				}
			});
			return deldiv;
		}
		//获取更多选项中的数据(包括关闭所选分类时，div显示最初级的数据)
		function getMoreItem(json)
		{
			var dthis = this;
			require(["dojo/dom-construct","dojo/query"],function(domConstruct,query){
				var subcatarr = json["subcatarr"];
				var cat = json["cat"];
				var catpath = json["catpath"];
				dthis.subdiv.innerHTML = "";
				if(subcatarr.length)
				{
					for(var key = 0;key < subcatarr.length;key++)
					{
						var a = domConstruct.create
						(
							"a",
							{
								alt:cat,
								class:"cat_item_radio",
								path:subcatarr[key]["path"],
								innerHTML:subcatarr[key]["resourceName"],
								catpath:catpath
							},
							dthis.subdiv
						);
					}
				}
				else
				{
					for(var key = 0;key < dthis.siblingcatarr.length;key++)
					{
						var a = domConstruct.create
						(
							"a",
							{
								alt:cat,
								class:"cat_item_radio",
								path:dthis.siblingcatarr[key]["path"],
								innerHTML:dthis.siblingcatarr[key]["resourceName"],
								catpath:catpath
							},
							dthis.subdiv
						);
					}
				}
			});
		}
		//添加一个分类
		function addCategory(subCatArr)
		{
			var dthis = this;
			require(["dojo/dom-style","dojo/query","dojo/dom-construct","dojo/on","dojo/NodeList-traverse"],function(domStyle,query,domConstruct,on){
				var div = domConstruct.create
				(
					"div",
					{
						class:"category_list",
						alt:dthis.cat,
						catpath:dthis.catpath
					},
					dthis.categorylistNode
				);
				var divhead = domConstruct.create
				(
					"div",
					{
						class:"cat_head",
						innerHTML:"<span class=\"note_bold\">"+dthis.cat+"</span>",
						path:dthis.catpath,
						isradio:dthis.isradio
					},
					div
				);
				var cleardiv = domConstruct.create
				(
					"div",
					{
						style:"clear:both;"
					},
					dthis.categorylistNode
				);
				var divbody = domConstruct.create
				(
					"div",
					{
						class:"cat_body",
						path:dthis.catpath,
						style:"max-height:120px;overflow:auto;height:auto;"
					},
					div
				);
				var cateData = {};
				cateData["resourceName"] = dthis.cat;
				cateData["path"] = dthis.catpath;
				cateData["catData"] = subCatArr;
				if(query(dthis.catmorebodyNode).children().length > 0)
				{
					dthis.offsetLeft = query(dthis.catmorebodyNode).children()[0].offsetLeft;
					dthis.offsetTop = query(dthis.catmorebodyNode).children()[0].offsetTop;
				}
				getSubCategory.call(dthis,cateData,divbody,dthis.isradio);
				var selname = getSelCategory.call(dthis,cateData["resourceName"]);
				var div = getCategoryBySelected.call(dthis,cateData["resourceName"]);
				var aArr = query(div).children(".cat_body").children();
				for(var i = 0;i < aArr.length;i++)
				{
					for(var j = 0;j < selname.length;j++)
					{
						if(aArr[i].textContent == selname[j])
						{
							domStyle.set(query(aArr)[i],"backgroundPosition","0 -207.5px");
							break;
						}
					}
				}
			});
		}
		//在更多选项中添加一个分类
		function addCategoryToMore(alt,catpath)
		{
			var dthis = this;
			require(["dojo/query","dojo/dom-construct","dojo/mouse","dojo/NodeList-traverse"],function(query,domConstruct,mouse){
				var a = domConstruct.create
				(
					"a",
					{
						class:"cat_more_item",
						innerHTML:alt,
						path:catpath,
						isradio:"true",
						alt:alt
					},
					dthis.catmorebodyNode
				);
				on(a,mouse.enter,function(evt)
				{
					var json = {
						path:catpath
					};
					dthis.cat = alt;
					dthis.catpath = catpath;
					dthis.mouse_a = a;
					dthis.emit("moreCategory",json);
				});
				on(a,mouse.leave,function(evt)
				{
					dthis.morecategory_time = setTimeout(function()
					{								
						changeBorderStyle.call(dthis,false);
						emptydiv.call(dthis);
					},200);
				});
				on(dthis.overlayNode,mouse.enter,function(evt)
				{
					clearTimeout(dthis.morecategory_time);
				});
				on(dthis.overlayNode,mouse.leave,function(evt)
				{
					dthis.morecategory_time = setTimeout(function()
					{
						dthis.text = dthis.overlayNode.innerHTML;
						changeBorderStyle.call(dthis,false);
						emptydiv.call(dthis);
					},200);
				});
			});
		}
		/*以下是鼠标滑过已选分类时显示的某分类的兄弟节点*/
		/*TODO*/
		//动态创建div，显示同级元素分类
		function createDivAndShowCategory(json)
		{
			var dthis = this;
			require(["dojo/dom-style","dojo/query","dojo/dom-construct","dojo/on","dojo/NodeList-traverse"],function(domStyle,query,domConstruct,on){
				domStyle.set(dthis.category_equalcat_overlayNode,"visibility","visible");
				domStyle.set(dthis.category_equalcat_overlayNode,"left",json["x"] + "px");
				domStyle.set(dthis.category_equalcat_overlayNode,"top",(json["y"]+25) + "px");
				domStyle.set(dthis.category_equalcat_overlayNode,"border","solid 1px #d9d9d9");
				query(dthis.equalmainNode).empty();
				var totalUL = Math.ceil(dthis.siblingcatarr.length / 3);
				var widthul = 0;
				for(var i = 0;i < totalUL;i++)
				{
					var ul = domConstruct.create
					(
						"ul",
						{
							style : "list-style:none;float:left;padding:10px;"
						},
						dthis.equalmainNode
					);
					var min = Math.min(dthis.siblingcatarr.length,(i + 1) * 3);
					for(var j = i * 3;j < min;j++)
					{
						if(dthis.siblingcatarr[j]["resourceName"] != "undefined")
						{
							var li = domConstruct.create(
								"li",
								{},
								ul
							);
							var a = domConstruct.create
							(
								"a",
								{
									class:"cat_multitem",
									title:dthis.siblingcatarr[j]["resourceName"],
									path:dthis.siblingcatarr[j]["path"],
									innerHTML:dthis.siblingcatarr[j]["resourceName"],
									alt:json["catgroup"],
									catpath:json["catpath"]
								},
								li
							);
							if(dthis.siblingcatarr[j]["resourceName"] == json["text"])
							{
								query(a).style("color","#4c8efb")
										.style("fontWeight","bold");
								dthis.a = a;
							}
							query(a).on("click",function()
							{	//切换样式
								//这里更新选中的分类
								var color = query(this).style("color");
								var fontWeight = query(this).style("font-weight");
								domStyle.set(dthis.a,"color",color[0]);
								domStyle.set(dthis.a,"fontWeight","normal");
								domStyle.set(this,"color","#4c8efb");
								domStyle.set(this,"fontWeight",'bold');
								dthis.a = this;
								var data = 
								{
									path:this.getAttribute("path")
								};
								dthis.clickcat = this;//缓存点击的分类对象
								var catdiv = query(dthis.categorylistNode).children(".category_list").children(".cat_body");
								for(var i = 0;i < catdiv.length;i++)
								{
									var catpath = this.getAttribute("catpath");
									if(catpath == catdiv[i].getAttribute("catpath"))
									{
										dthis.subdiv = catdiv[i];
										break;
									}
								}
								dthis.emit("switchSiblingCategory",data);
							});
						}
					}
					widthul += query(ul).style("width")[0] + 30;
				}
				domStyle.set(dthis.category_equalcat_overlayNode,"width",widthul + "px");
			});
		}
		var ret = declare("widgets/AdvCategory/main",[_WidgetBase, _TemplatedMixin, Evented],
		{
			hrefURL : require.toUrl("widgets/AdvCategory/css/style.css"), // 定义widget的css样式文件
			// 指定template
			templateString: template,
			constructor:function()
			{
				this.clickcat;//缓存点击的分类对象
				this.subdiv;//缓存刷新数据的div
				this.subcatarr = [];//获取到的某分类的子分类
				this.siblingcatarr = [];//同级分类
				this.time;//创建时间
				this.a;//鼠标滑过之后，在显示同级分类的div中记录的当前的分类
				this.mouse_selcat;//缓存鼠标滑过的分类对象
				this.selectedcategory = {};//缓存选中的分类
				this.cat;//分类的组名
				this.catpath;//分类的路径
				this.isradio;//分类的类别
				this.offsetLeft;//记录更多选项中第一个分类的位置信息
				this.offsetTop;//记录更多选项中第一个分类的位置信息
				this.morecategory_time;
				this.text = "";//缓存dthis.overlayNode中的内容
				this.mouse_a;//鼠标滑过之后的a标签
			},
			postCreate: function()
			{
				this.inherited(arguments);
			},
			initialize : function(catedata)
			{
				console.log("初始化时返回的分类数据：");
				console.log(catedata);
				showInitCategory.call(this,catedata);
				initEvent.call(this);
			},
			getSubCategory:function(subCatArr)
			{
				this.subcatarr = subCatArr;
				var json = 
				{
					"subdiv":this.subdiv,
					"catgroup":domAttr.get(query(this.clickcat)[0],"alt"),
					"subcatarr":this.subcatarr,
					"catname":this.clickcat.textContent,
					"path":this.clickcat.getAttribute("path"),
					"catpath":this.clickcat.getAttribute("catpath")
				};
				showSubCategory.call(this,json);
			},
			getSibCategory:function(siblingCatArr)
			{
				var dthis = this;
				dthis.siblingcatarr = siblingCatArr;
				if(dthis.time != undefined)
				{
					clearTimeout(dthis.time);
				}
				var json = 
				{
					"x":dthis.mouse_selcat.offsetLeft,
					"y":dthis.mouse_selcat.offsetTop,
					"path":dthis.mouse_selcat.getAttribute("path"),
					"text":dthis.mouse_selcat.textContent,
					"catgroup":domAttr.get(query(dthis.mouse_selcat)[0],"alt"),
					"catpath":dthis.mouse_selcat.getAttribute("catpath")
				};
				setTimeout(function()
				{
					createDivAndShowCategory.call(dthis,json);
				},300);
			},
			switchCategory:function(subCatArr)
			{
				this.subcatarr = subCatArr;
				switchCategory.call(this);
			},
			getMoreSubCategory:function(subCatArr)
			{
				this.subcatarr = subCatArr;
				var json = 
				{
					"subcatarr":this.subcatarr,
					"cat":this.cat,
					"catpath":this.catpath
				};
				getMoreItem.call(this,json);
			},
			addCategory:function(subCatArr)
			{
				this.subcatarr = subCatArr;
				addCategory.call(this,subCatArr);
			},
			getMoreCategory:function(subCatArr)
			{
				var dthis = this;
				dthis.subcatarr = subCatArr;
				var cateData = {};
				cateData["resourceName"] = dthis.cat;
				cateData["path"] = dthis.catpath;
				cateData["catData"] = dthis.subcatarr;
				if(dthis.morecategory_time != undefined)
				{
					clearTimeout(dthis.morecategory_time);
				}
				setTimeout(function()
				{
					dthis.overlayNode.innerHTML = "";
					var jsondiv = 
					{
						"div":dthis.overlayNode,
						"left":dthis.offsetLeft,
						"top":dthis.offsetTop
					};
					getMoreSubCategory.call(dthis,cateData,jsondiv,true,dthis.mouse_a);
					changeBorderStyle.call(dthis,true);
				},200);
				if(dthis.text != "")
				{
					changeBorderStyle.call(dthis,true);
					dthis.overlayNode.innerHTML = dthis.text;
				}
			}
		});
		return ret;
	});