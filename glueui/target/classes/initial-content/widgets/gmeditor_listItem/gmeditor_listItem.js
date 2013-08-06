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
 
define("widgets/gmeditor_listItem/gmeditor_listItem",
[
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/on",
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/template.html",
	"dojo/Evented"
],
function(domConstruct,domStyle,domClass,domAttr,on,declare, WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, template, Evented)
{
    var  msg1 = [];
	var msg2 = [];
	var viewChildTask = "viewChildTask";
	
	return declare("widgets/gmeditor_listItem/gmeditor_listItem", 
				[ WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, Evented ], {
					templateString: template,
					render: "",
					jobInfo:"",
					name: "未命名",			
					referModel: "",
					target: "",
					statue: "",
					path: "",
					viewSubTask : "",
					id:"",
					img: "/widgets/ModelListItem/image/nopreview.jpg",
					url: "/widgets/ModelListItem/image/nopreview.jpg",					
					checked: false,
				constructor: function(o){		
					//根据params中的path缓冲一个model对象
					this.render = o;					
					this.initJsonData(o);
					this.childTaskHtml;
					this.activeId;
				},		
				//初始化Msg显示的数据
				initJsonData:function(data){	
					msg1 = [];
					msg2 = [];
				   for(var i in data){						
					if(i!=="id"&&i!="type"&&i!="name"&&i!="viewSubTask"){		
						var json = {"key":i,"value":data[i]};						
						if(msg1.length<3){
							msg1.push(json);
						}else{
							msg2.push(json);
						}						
					}					
				   }				
				},
				//这里是显示Job信息的 				
				setJobInfo:function(Job){	
					msg1 = [];
					msg2 = [];
					for(var i in Job){						
					if(i!=="id"&&i!="type"&&i!="name"){		
						var json = {"key":i,"value":Job[i]};						
						if(msg1.length<3){
							msg1.push(json);
						}else{
							msg2.push(json);
						}						
					}					
				   }
					var str1="";
					var str2="";					
					for(var i=0;i<msg1.length;i++){
						str1+=msg1[i]["key"]+" : "+msg1[i]["value"]+" <br/>";	
					}
					str2+=str1;
					for(var i=0;i<msg2.length;i++){
						str2+=msg2[i]["key"]+" : "+msg2[i]["value"]+" <br/>";
					}		
					this.showMsg1.innerHTML=str1;
					this.showMsg2.innerHTML=str2;				

				},				
				postCreate:function(){
					var str1="";
					var str2="";					
					for(var i=0;i<msg1.length;i++){
						str1+=msg1[i]["key"]+" : "+msg1[i]["value"]+" <br/>";	
					}
					str2+=str1;
					for(var i=0;i<msg2.length;i++){
						str2+=msg2[i]["key"]+" : "+msg2[i]["value"]+" <br/>";
					}		
					this.showMsg1.innerHTML=str1;
					this.showMsg2.innerHTML=str2;
					if(typeof this.viewSubTask == "boolean"){
						this.displayViewSubTask(this.viewSubTask);
					}
				},			
					
				updateIcon : function(path){
					this.renderIcon.src = this.render.src = path;
				},
				_onStartRender: function(){	
					this.emit("onStartClick",this.render);		
				},
				_onStopRender:function(){
					this.emit("onStopClick",this.render);
				},
				_onProgressRender:function(){
					this.emit("onProgressClick",this.render);
				},
				_getCheckedAttr: function(){
					return this.checkNode.checked;
				},
				_onRenderIconClick : function(){			
					this.emit("onRenderIconClick",this.render);
				},
				_onPicClick : function(){
					if(this.data.getResultImageURL){
						this.emit("onPicClick",this.data.getResultImageURL());
					}else{
						this.emit("onPicClick",this.data.URL);
					}
				},
				_onDetailClick:function(){
					if(this.showMsg1.style.display=="block"){
						this.showMsg1.style.display="none";
						this.showMsg2.style.display="block";						
					}else{
						this.showMsg1.style.display="block";
						this.showMsg2.style.display="none";		
					}
					
				},	
				_onViewSubTask:function(){
					//显示子任务窗口
					this.emit(viewChildTask,this.getData());
				},		
				_setCheckedAttr : function(flag){
					if( flag==true || flag==false ){
						this._set("checked", flag);
						this.checkNode.checked=flag;
					}else{
						throw("parameter is invalid!");
					}
				},
				_setNameAttr : function(value){
					this.nameNode.innerText = value;
				},
				__onCheckBoxClick : function(){
					this._set("checked",this.checkNode.checked);
					this.emit("checkBoxClick",{});
				},	
				__onClickModify : function(){
					this.emit("onModify", this);
				},
				getItemName:function(){
					return this.name;
				},
				addPictures:function(data){
				   if(!data){
						console.error("[INFO] data 不存在!~");
					}
					var _table =domConstruct.create("table",{},this.showPictures);
					var _tr = domConstruct.create("tr",{},_table);					
					for(var i in data){
						var _dthis = this;
						var _td = domConstruct.create("td",{},_tr);
						var _currentImg = domConstruct.create("img",{src:data[i],width:60,height:60},_td);	
						on(_currentImg,"click",function(){
							_dthis.emit("getPicInfo",this);
						});	
					}							
				},
				setPictures:function(innerHtml){
					this.showPictures.innerHTML = innerHtml;
				},
				setMsg1:function(innerHtml){
					this.showMsg1.innerHTML = innerHtml;
				},
				setMsg2:function(innerHtml){
					this.showMsg2.innerHTML = innerHtml;
				},
				setData:function(data){
					this.data = data;
				}, 
				getData:function(){
					return this.data;
				},
				displayViewSubTask:function(dis){
					var display = ""
					if(dis){
						display = "block";
					}else{
						display = "none";
					}
					if(this._viewSubTask){
						domStyle.set(this._viewSubTask,"display",display);
					}
				},
				xxxx : function(){
					this.emit("modify", this.path);
				}	
	});	
});