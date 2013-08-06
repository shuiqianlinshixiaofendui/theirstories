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
 
define("widgets/JobList/JobList",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
	"dijit/form/CheckBox",
	"dojo/Evented",
	"dojo/on"
],
function(
	declare,
	WidgetBase,
	TemplatedMixin,
	template,
	CheckBox,
	Evented,
	on
)
{
	return declare("widgets/JobList/JobList", [ WidgetBase, TemplatedMixin ,Evented], {
		// 指定template
		templateString: template,
		// 构造函数
		constructor : function(){					
			this.childrenItem = [];
		},
		/*页面加载的时候会调用这个方法来进行初始化
		*/
		postCreate : function(){
			this.inherited(arguments);
			var listNodeDiv = this.listNode;
		},
		
		getSelectedItem : function(){
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
			for( var index = 0; index < this.childrenItem.length; index ++ ){
				if( flag==true || flag==false ){
					this.childrenItem[index]._setCheckedAttr(flag);
					this.childrenItem[index].checkNode.checked = flag;
				}else{
					throw("parameter is invalid!");
				}
			}
		},
		
		addJobListItem : function(jobListItem){			
			var listNodeDiv = this.listNode;
			jobListItem.placeAt(listNodeDiv);						
			this.childrenItem.push(jobListItem);
			var d_this = this;
			on(jobListItem,"onStartClick",function(r){
				d_this.emit("onStartClick",r);
			});
			on(jobListItem,"onStopClick",function(r){
				d_this.emit("onStopClick",r);
			});
			on(jobListItem,"onProgressClick",function(r){
				d_this.emit("onProgressClick",r);
			});
			on(jobListItem,"onRenderIconClick",function(r){
				d_this.emit("onRenderIconClick",r);
			});							
			on(jobListItem,"checkBoxClick",function(){
				d_this.emit("checkBoxClick",{});			
			});			
			return jobListItem;
		},
		
		removeSelectedItem : function(){
			var listNodeDiv = this.listNode;			
			var _this = this;
			var selectedItem = this.getSelectedItem();			
			for( var index = selectedItem.length-1; index > -1; index -- ){
				if( listNodeDiv && listNodeDiv["children"][selectedItem[index]["index"]] ){
					listNodeDiv.removeChild(listNodeDiv["children"][selectedItem[index]["index"]]);
					_this.childrenItem.splice(selectedItem[index]["index"], 1);
				}
			}
		},
		
		orderModelListItem : function (property, field, desc){
			var objects = [];
			for( var index = 0; index < this.childrenItem.length; index ++ ){
				objects.push(this.childrenItem[index][property]);
			}
			var resultOrder = order(objects, field, desc);				
			for( var i = 0; i < resultOrder.length; i ++ ){
				for( var a = 0; a < this.childrenItem.length; a ++ ){
					if(this.childrenItem[a][property] == resultOrder[i]){						
						var listNodeDiv = this.listNode;
						this.childrenItem[a].placeAt(listNodeDiv);
					}
				}			
			}			
		}		
		
	});	
	
	
});