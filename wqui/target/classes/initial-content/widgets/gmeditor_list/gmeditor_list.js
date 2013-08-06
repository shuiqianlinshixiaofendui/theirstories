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
 
define("widgets/gmeditor_list/gmeditor_list",
[
	"dojox/image/Lightbox",
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
	"dijit/form/CheckBox",
	"dojo/Evented",
	"dojo/on"
],
function(
	Lightbox,
	declare,
	WidgetBase,
	TemplatedMixin,
	template,
	CheckBox,
	Evented,
	on
)
{
	
	var gmeditor_list = declare("widgets/gmeditor_list/gmeditor_list", [ WidgetBase, TemplatedMixin ,Evented], {
		// 指定template
		templateString: template,
		// 构造函数
		constructor : function(){					
			this.childrenItem = {};
		},
		/*页面加载的时候会调用这个方法来进行初始化
		*/
		postCreate : function(){
			this.inherited(arguments);
			var listNodeDiv = this.listNode;
		},
		getItemByName:function(jobName){
			if(!jobName){
				return ;
			}
			return this.childrenItem[jobName];
		},
		getSelectedItem : function(){
			var _this = this;
			var selectedItem = [];
			var index = 0;
			for( var name in _this.childrenItem)
			{
				if( _this.childrenItem[name].checkNode.checked == true ){
					_this.childrenItem[name]["index"] = index;
					 selectedItem.push(_this.childrenItem[name]);
				}
				index++;
			}
			return selectedItem;
		},
		
		
		orSelectAllItem : function(flag){
			for( var name in this.childrenItem){
				if( flag==true || flag==false ){
					this.childrenItem[name]._setCheckedAttr(flag);
					this.childrenItem[name].checkNode.checked = flag;
				}else{
					throw("parameter is invalid!");
				}
			}
		},
		
		addJobListItem : function(jobListItem){			
			var listNodeDiv = this.listNode;
			jobListItem.placeAt(listNodeDiv);						
			this.childrenItem[jobListItem.name]=jobListItem;
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
			on(jobListItem,"viewChildTask",function(r){
				d_this.emit("viewChildTask",r);
			});	
			on(jobListItem,"onPicClick",function(url){
				if(url){			
					dojo.require("dijit.Dialog");
					myDialog = new dijit.Dialog({
						title: "图片展示",
						content: "<image src='"+url+"'/>",
						style: "width: auto;height:auto;"
					});	
					myDialog.show();						
				}
			});	
			return jobListItem;
		},
		removeAllItems:function(){
			var _this = this;
			var listNodeDiv = _this.listNode;
			for(var index in this.childrenItem){
				while (listNodeDiv.hasChildNodes()) {
					listNodeDiv.removeChild(listNodeDiv.lastChild);
				}
			}
			_this.childrenItem = {};
		},
		removeItemByName:function(name){
			var listNodeDiv = this.listNode;			
			var _this = this;
			var selectedItem = this.getSelectedItem();		
			for( var index = selectedItem.length-1; index > -1; index -- ){
				if( listNodeDiv && listNodeDiv["children"][selectedItem[index]["index"]]==listNodeDiv["children"][this.childrenItem[name]["index"]]){
					listNodeDiv.removeChild(listNodeDiv["children"][selectedItem[index]["index"]]);
					delete _this.childrenItem[selectedItem[index]["name"]];
				}
			}
		},
		removeSelectedItem : function(){
			var listNodeDiv = this.listNode;			
			var _this = this;
			var selectedItem = this.getSelectedItem();			
			for( var index = selectedItem.length-1; index > -1; index -- ){
				if( listNodeDiv && listNodeDiv["children"][selectedItem[index]["index"]] ){
					listNodeDiv.removeChild(listNodeDiv["children"][selectedItem[index]["index"]]);
					delete _this.childrenItem[selectedItem[index]["name"]];
				}
			}
		},
		
		orderModelListItem : function (property, field, desc){
			var objects = [];
			for( var name in this.childrenItem){
				objects.push(this.childrenItem[name][property]);
			}
			var resultOrder = order(objects, field, desc);				
			for( var i = 0; i < resultOrder.length; i ++ ){
				for( var name in this.childrenItem){
					if(this.childrenItem[name][property] == resultOrder[i]){						
						var listNodeDiv = this.listNode;
						this.childrenItem[name].placeAt(listNodeDiv);
					}
				}			
			}			
		},
		updateMsg : function(item,obj,msgData){
			var tesjson= msgData["msg1"];
			var tesjson2 = msgData["msg2"];
			var task = msgData["subTask"];
		
			var msg1InnerHtml ="";
			for(var name in tesjson){
				if(name=="下载图片"){
					msg1InnerHtml += "<a href=\""+tesjson[name]+"\" >"+name+"</a>" +"<br/>"	
				}else{
					msg1InnerHtml +=name+":"+tesjson[name]+"<br/>";
				}	
			}	
			console.log(tesjson);
			item.setMsg1(msg1InnerHtml);
			// var msg2InnerHTML ="";						
			// for(var name in tesjson2){
				// msg2InnerHTML +=name+":"+tesjson2[name]+"<br/>";
			// }	
			// item.setMsg2(msg2InnerHTML);
			//console.log(tesjson2["resultImgURL"]);
			if(!tesjson2["resultImgURL"]){
				item.setPictures("<img src='/widgets/ModelListItem/image/nopreview.jpg' width=100 height=100>");
			}else{
				item.setPictures("<img src="+tesjson2["resultImgURL"]+" width=100 height=100>");
			}
			item.setData(obj);
		},
		updateJobMsg:function(job,msgData){
			var item = this.getItemByName(job.getName());
			this.updateMsg(item,job,msgData);
		},
		updateTaskMsg:function(task,msgData){
			var item = this.getItemByName(task["name"]);
			this.updateMsg(item,task,msgData);
		}
	});	
	return gmeditor_list;
	
});