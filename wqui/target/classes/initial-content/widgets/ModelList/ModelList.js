/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("widgets/ModelList/ModelList",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
	"dijit/form/CheckBox",
	// 引入自定义的Widget -- ModelListItem
	"widgets/ModelListItem/ModelListItem",
	"dojo/dom"
],
function(
	declare,
	WidgetBase,
	TemplatedMixin,
	template,
	CheckBox,
	ModelListItem,
	dom
)
{
	function	order(objects, field, desc)
	{
		var flag = objects instanceof Array
		var children = [];
		// console.log(flag);
		
		if(flag)
		{
			var result;
			if(desc)
			{
				//sheng
				result = objects.sort();
			}
			else
			{
				//jiang
				objects.sort();
				result = objects.reverse();
			}
			return result;
		}
		else
		{
			for(var index in objects)
			{
				objects[index]["index"] = index;
				children.push(objects[index][field]);
			}
			var result;
			if(desc)
			{
				//sheng
				result = children.sort();
			}
			else
			{
				//jiang
				children.sort();
				result = children.reverse();
			}
			return result;
		}
	}
	
	return declare("widgets/ModelList/ModelList", [ WidgetBase, TemplatedMixin ], {
		// 指定template
		templateString: template,
		
		// 构造函数
		constructor : function(args)
		{
			// 成员为json串，用来创建ModelListItem
			this.arg = args;
			// 保存创建之后的ModelListItem
			this.childrenItem = [];
		},
		
		// postCreate is a predefined event 
		// handler that is executed when widget 
		// is created and initialized
		postCreate : function(){
			// Run any parent postCreate processes - can be done at any point
			this.inherited(arguments);
			
			// 保存template中的data-dojo-attach-point="listNode"的div标签 
			// console.log(this.listNode);
			var listNodeDiv = this.listNode;
			
			// 遍历构造的数组，创建ModelListItem
			for( var index = 0; index < this.arg.length; index ++ )
			{
				// 创建ModelListItem，并显示在template中的div标签
				var modelListItem = new ModelListItem(this.arg[index]);//
				modelListItem.placeAt(listNodeDiv);
				
				// 将创建好的ModelListItem放到数组中保存
				this.childrenItem.push(modelListItem);
				
			}
		},
		
		
		getSelectedItem : function()
		{
			var _this = this;
			var selectedItem = [];
			for( var index = 0; index < _this.childrenItem.length; index ++ )
			{
				if( _this.childrenItem[index].checkNode.checked == true ){
					_this.childrenItem[index]["index"] = index;
					selectedItem.push(_this.childrenItem[index]);
				}
			}
			return selectedItem;
		},
		
		
		orSelectAllItem : function(flag){
			for( var index = 0; index < this.childrenItem.length; index ++ )
			{
				if( flag==true || flag==false ){
					this.childrenItem[index]._setCheckedAttr(flag);
					this.childrenItem[index].checkNode.checked = flag;
				}else{
					throw("parameter is invalid!");
				}
			}
		},
		
		
		addModelListItem : function(args){
			// 创建一个全新的ModelListItem
			var modelListItem = new ModelListItem(args);
			
			// placeAt，放到listNode的div标签下
			var listNodeDiv = this.listNode;
			modelListItem.placeAt(listNodeDiv);
			
			// 将创建好的ModelListItem放到数组中保存
			this.childrenItem.push(modelListItem);
			
			return modelListItem;
		},
		
		
		removeModelListItem : function(){
			var listNodeDiv = this.listNode;
			
			var node = dom.byId("authorContainer");
			var _this = this;
			var selectedItem = this.getSelectedItem();
			// console.log(selectedItem)
			
			for( var index = selectedItem.length-1; index > -1; index -- )
			{
				if( node && node["children"][selectedItem[index]["index"]] )
				{
					node.removeChild(node["children"][selectedItem[index]["index"]]);
					_this.childrenItem.splice(selectedItem[index]["index"], 1);
				}
			}
		},
		
		orderModelListItem : function (property, field, desc)
		{
			// objects = this.childrenItem;
			var objects = [];
			for( var index = 0; index < this.childrenItem.length; index ++ )
			{
				objects.push(this.childrenItem[index][property]);
			}
			
			// console.log(objects);
			var resultOrder = order(objects, field, desc);
			
			// console.log(resultOrder);
			
			for( var i = 0; i < resultOrder.length; i ++ )
			{
				for( var a = 0; a < this.childrenItem.length; a ++ )
				{
					if(this.childrenItem[a][property] == resultOrder[i])
					{
						// console.log(resultOrder[i]);
						var listNodeDiv = this.listNode;
						this.childrenItem[a].placeAt(listNodeDiv);
					}
				}
				
			}
			
		}
		
		
	});	
	
	
});