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

define("widgets/CategorySelect/CategorySelect",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/layout/StackContainer",
		"dojo/text!./templates/template.html",
		"dojo/on",
		"dojo/dom-construct",
		"dojo/Evented",
		"spolo/data/folder",
		"dijit/form/CheckBox",
		"dijit/registry"
	],function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, StackContainer, template, 
		on, domConstruct, Evented, folder_cls, CheckBox, registry
	){
	
		// 初始化分类
		function addCategoryItem(jsonObj){
			var dthis = this;
			var path = jsonObj["path"];
			var text = jsonObj["text"];
			var newId = jsonObj["id"];
			var div = domConstruct.create("div",
				{
					style : "padding:2px;display:inline;width:90px;height:35px;padding:5px 0px;float:left;" +
							"margin-right:5px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
				},	this.categoryListNode
			);
			
			var box = domConstruct.create("input",
				{
					value : path,
					type : "checkbox",
					onchange : function()
					{
						inputChange.call(dthis, div, box, label);
					}
				},	div
			);
			for(var index = 0; index < dthis.pathArray.length; index ++)
			{
				if(box.value == dthis.pathArray[index])
				{
					box.checked = true;
				}
			}
			var label = domConstruct.create("label",
				{
					style : "cursor:pointer;display:inline;",
					title : text,
					value : text,
					innerHTML : text
				},	div
			);
			on(label, "click",  function(){
				var checkbox = div.childNodes[0];
				if(checkbox.checked)
				{
					checkbox.checked = false;
					inputChange.call(dthis, div, box, label);
				}
				else
				{
					checkbox.checked = true;
					inputChange.call(dthis, div, box, label);
				}
			});
		}
		
		function inputChange(div, box, label)
		{
			var dthis = this;
			var data = {};
			var newString = "";
			var newText = "";
			var isChecked = false;
			data.checkbox = box;
			data.label = label;
			var children = label.parentElement.parentElement.childNodes;
			for(var index = 0; index < children.length; index ++)
			{
				var localName = children[index].localName;
				if(localName == "div")
				{
					var firstChild = children[index].childNodes[0];
					var secondChild = children[index].childNodes[1];
					if(firstChild.checked)	
					{
						isChecked = true;
						newString = newString + firstChild.value + ";";
						newText = newText + (firstChild.parentElement.childNodes[1].value) + ";";
					}
				}
			}
			data.isChecked = isChecked;
			data.text = newText;
			data.path = newString;
			dthis.emit("onSelectedItemClick", data);
		}
		
		// 刷新分类项
		function refreshCategoryList(path, id){
			this.categoryListNode.innerHTML = "<b>"+this.title2+"</b>";
			loadCategoryItem.call(this, path, id);
		}
		
		// 加载分类
		function loadCategoryItem(path, id){
			var dthis = this;
			this.folder = new folder_cls(path);
			this.folder.getChildren(
				function(array){
					// 添加节点
					for(var i=0;i<array.length;i++){
						var node = array[i];
						var data = {
							path : node.getURI(),
							text : node.getName(),
							id : id
						};
						addCategoryItem.call(dthis, data);
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
			var path = "/"+pathArray[0]+"/"+pathArray[1];
			pathArray.splice(0,2);
			var temp = "";
			for(var i = 0;i < textArray.length;i++)
			{
				var data = {};
				var string = "";
				data["text"] = textArray[i];
				
				if(i == textArray.length - 1)
				{
					temp += pathArray[i];
					string = path + "/" + temp;
					data["path"] = string;
				}
				else
				{
					temp += pathArray[i] + "/";
					string = path + "/" + temp;
					data["path"] = string.slice(0,string.length - 1);
				}
				jsonArray.push(data);
			}
			return jsonArray;
		}
		
		var ret = declare("widgets/CategorySelect/CategorySelect",
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
				this.pathArray = new Array();
			},
			
			//在这里绑定事件
			postCreate: function()
			{
				this.inherited(arguments);
				this.selectedListNode.innerHTML = "<b>"+this.title1+"</b>&nbsp;&nbsp;&nbsp;&nbsp;";
				refreshCategoryList.call(this, this.json["path"], this.json["id"]);
			},
			
			//用户进行属性编辑时初始化已经选择的模型
			initialize : function(json){
				if(json)
				{
					var dthis = this;
					var newpath = json["path"];
					dthis.pathArray = newpath.split(";");
				}
			}
			
		});
		
		return ret;
	});