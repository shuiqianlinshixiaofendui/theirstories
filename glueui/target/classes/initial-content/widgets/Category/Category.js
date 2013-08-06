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

define("widgets/Category/Category",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/layout/StackContainer",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/Evented",
		"spolo/data/folder"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, StackContainer, template, 
		query, on, dom, lang, domConstruct, Evented, 
		folder_cls
	){
	
	
		// 删除分类项的事件名称
		var selectedItemCloseEventName = "onSelectedItemClose";
		// 点击被选中分类项的事件名称
		var selectedItemClickEventName = "onSelectedItemClick";
		// 点击分类时的事件名称
		var categoryItemClickEventName = "onCategoryItemClick";
		// 最后一层分类
		var isLastLayerEventName = "onCategoryIsLastLayer";
		// 当前选中的所有分类列表改变时
		var selectedListChangedEventName = "onSelectedListChanged";
		
		// 添加选中的分类项
		function addSelectedItem(jsonObj){
			var path = jsonObj["path"];
			var text = jsonObj["text"];
			if(text != ""){
				var div = domConstruct.create("div", 
					{ 
						className : "categoryTemplate_selectedListItem",
						id : path,
						title : text
					},	this.selectedListNode
				);
			
				var a = domConstruct.create("a", 
					{ 
						innerHTML :  "&nbsp;"+text+"&nbsp;"
					},	div
				);
			
				var closeDiv = domConstruct.create("div", 
					{ 
						className : "categoryTemplate_selectedListItem_close",
						innerHTML :  "×"
					},	div
				);
			
				var array = getCurrentSelectedItems.call(this);
				this.emit(selectedListChangedEventName, array);
			
				var dthis = this;
				on(closeDiv, "click",  function(){
					closeSelectedItem.call(this, dthis);
				});
			
				on(a, "click",  function(){
					selectedItemClick.call(this, dthis);
				});
			}					
		}
		
		// 删除选中节点
		function delSelectedItem(item){
			if(!item)return;
			var nodes = this.selectedListNode.children;
			var flag = false;
			var node;
			for(var key=0; key<nodes.length; key++){
				node = nodes[key];
				if(node["id"]==item["id"]){
					flag = true;
				}
				if(flag){
					domConstruct.destroy(node);
					key--;
				}
			}
			var array = getCurrentSelectedItems.call(this);
			this.emit(selectedListChangedEventName, array);
		}

		// 点击被选中的分类项时
		function selectedItemClick(dthis){
			var pe = this.parentElement;	// 获取父节点
			var path = pe.id;
			// 发出删除分类项事件
			var data = {
				path : pe.id,
				text : pe.title
			};
			dthis.emit(selectedItemClickEventName, data);
			// 刷新分类项
			refreshCategoryList.call(dthis, path);
			// 删除节点
			delSelectedItem.call(dthis, pe.nextElementSibling);
		}
		
		// 关闭选中的分类时
		function closeSelectedItem(dthis){
			var pe = this.parentElement;	// 获取父节点
			var path = pe.id;
			var data = {
				path : pe.id,
				text : pe.title
			};
			// 发出删除分类项事件
			dthis.emit(selectedItemCloseEventName, data);
			// 刷新分类项
			var dpath = path.substring(0, path.lastIndexOf("/"));
			refreshCategoryList.call(dthis, dpath);
			// 删除节点
			delSelectedItem.call(dthis, pe);
		}
		
		// 获取当前选中的分类层级名称
		function getCurrentSelectedItems(){
			var nodes = this.selectedListNode.children;
			var array = [];
			var json = {};
			var data, node, str="", lastPath;
			for(var key = 0; key < nodes.length; key ++){
				node = nodes[key];
				if(node["id"]&&node["title"]){
					data = {
						path: node["id"],
						text: node["title"]
					};
					str+=node["title"]+">>";
					lastPath = node["id"];
					array.push(data);
				}
			}
			json["label"] = str.substring(0,str.length-2);
			json["path"] = lastPath;
			json["array"] = array;
			return json;
		}
		
		// 初始化分类
		function addCategoryItem(jsonObj){
			var path = jsonObj["path"];
			var text = jsonObj["text"];
			var a = domConstruct.create("a", 
				{ 
					className : "categoryTemplate_categoryItem",
					id : path,
					title : text,
					innerHTML :  text
				},	this.categoryListNode
			);
			
			var dthis = this;
			on(a, "click",  function(){
				// 向选中分类列表中添加项
				var data = {
					path : this.id,
					text : this.title
				};
				// 调用分类项被选中的方法
				categoryItemClick.call(dthis, data);
			});
		}
		
		// 点击分类项时
		function categoryItemClick(data){
			addSelectedItem.call(this, data);
			// 发出分类被选中的事件
			this.emit(categoryItemClickEventName, data);
			// 刷新分类项
			refreshCategoryList.call(this, data.path);
		}
		
		// 刷新分类项
		function refreshCategoryList(path){
			this.categoryListNode.innerHTML = "<b>"+this.title2+"</b>";
			loadCategoryItem.call(this, path);
		}
		
		// 加载分类
		function loadCategoryItem(path){
			var dthis = this;
			this.folder = new folder_cls(path);
			this.folder.getChildren(
				function(array){
					// 添加节点
					var newNameArray = new Array();
					for(var i = 0; i < array.length; i ++){
						var node = array[i];
						var name = node.getName()
						newNameArray.push(name);
					}
					newNameArray.sort(function(a,b){
						return a.toLowerCase().localeCompare(b.toLowerCase());                           
					});
					for(var index = 0; index < newNameArray.length; index ++)
					{
						for(var i = 0; i < array.length; i ++)
						{
							if(newNameArray[index] == array[i].getName())
							{
								var node = array[i];
								var url = node.getURI()
								var name = node.getName()
								var data = {
									path : url,
									text : name
								};
								addCategoryItem.call(dthis, data);
								break;
							}
						}
					}
					if(array.length>0){
						dthis.emit(isLastLayerEventName, false);
					}else{
						dthis.emit(isLastLayerEventName, true);
						dthis.categoryListNode.innerHTML = "<b>"+dthis.title2+"（已经是最后一级）</b>";
					}
				},
				function(err){
					console.error(err);
				}
			);
		}
		
		//将json数据转化成json数组
		function jsonConvertArray(json){
			var jsonArray = new Array();
			var textArray = json["text"].split(">>");
			var pathArray = json["path"].substring(1).split("/");
			var path = "";
			if(json["type"] == "previewlib")
			{
				path = "/" + pathArray[0] + "/" + pathArray[1];
				pathArray.splice(0,2);
			}else if(json["type"] == "modellibcategory")
			{
				path = "/" + pathArray[0] + "/" + pathArray[1] + "/" + pathArray[2];
				pathArray.splice(0,3);
			}
			var temp = "";
			for(var i = 0;i < textArray.length;i++)
			{
				var data = {};
				var string = "";
				data["text"] = textArray[i];
				
				if(i == textArray.length - 1)
				{
					if(pathArray.length > 0)
					{
						temp += pathArray[i];
						string = path + "/" + temp;
					}
					else
					{
						string = path;
					}
					data["path"] = string;
				}
				else
				{
					if(pathArray.length > 0)
					{
						temp += pathArray[i] + "/";
						string = path + "/" + temp;
						data["path"] = string.slice(0,string.length - 1);
					}
					else
					{
						string = path;
						data["path"] = string.slice(0,string.length - 1);
					}
				}
				jsonArray.push(data);
			}
			return jsonArray;
		}
		
		var ret = declare("widgets/Category/Category",
				[ StackContainer, _WidgetBase, _WidgetsInTemplateMixin, _TemplatedMixin, Evented ],{
			
			// 指定template
			templateString: template,
			
			constructor:function(json){
				dthis = this;
				this.className = ".categoryTemplate";
				this.json = json;
				
				this.title1 = "已选择：";
				// this.title2 = "请选择：";
				this.title2 = "";
				if(json["title1"]) this.title1 = json["title1"];
				if(json["title2"]) this.title2 = json["title2"];
			},
			
			// initialize:function(){
				// refreshCategoryList.call(this, this.json["path"]);
			// },
			
			//在这里绑定事件
			postCreate: function()
			{
				this.inherited(arguments);
				this.selectedListNode.innerHTML = "<b>"+this.title1+"</b>&nbsp;&nbsp;&nbsp;&nbsp;";
				//refreshCategoryList.call(this, this.json["path"]);
				//setSelectedItem.call(this,this.json);
			},
			
			//用户进行属性编辑时初始化已经选择的模型
			initialize: function(json){
				var path = this.json["path"];
				if(json){
					var jsonArray = jsonConvertArray.call(this,json);
					var data;
					for(var i=0;i<jsonArray.length;i++)
					{
						addSelectedItem.call(this, jsonArray[i]);
						data = jsonArray[i];
					}
					path = data["path"];
				}
				if(path){
					refreshCategoryList.call(this, path);
				}
			}
			
		});
		
		return ret;
	});