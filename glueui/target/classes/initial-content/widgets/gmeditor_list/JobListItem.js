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
 
define("widgets/JobListItem/JobListItem",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/template.html",
	"dojo/Evented"
],
function(declare, WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, template, Evented)
{
	return declare("widgets/JobListItem/JobListItem", 
				[ WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, Evented ], {
					templateString: template,
					render: "",
					jobInfo:"",
					name: "未命名",			
					referModel: "",
					type: "",
					target: "",
					statue: "",
					path: "",
					id:"",
					img: "/widgets/ModelListItem/image/nopreview.jpg",
					url: "/widgets/ModelListItem/image/nopreview.jpg",
					checked: false,
				constructor: function(o){		
					//根据params中的path缓冲一个model对象
					this.render = o;		
				},					
							
				//这里是显示Job信息的 				
				setJobInfo:function(Job){						
						var count = 0;
						this.target = Job["渲染分类"];
						if(Job!=undefined){
							
						    this.jobInfo="<div style='width:500px; float:left ;margin-left:25px' >";
							for(var name in Job){
								this.jobInfo +="<div style='margin-left:90px;float:left;'>"+name+":"+Job[name]+"</div>";								
								if(count%3 == 0){	
									this.jobInfo +="<br/>";
								}
								count++;
							}		
							this.jobInfo +="</div>"	
							this.showRenderMsg.innerHTML=this.jobInfo;
							this.showRenderMsg.style.display="block",
							this.showRenderBtn.style.display="none";
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
				xxxx : function(){
					this.emit("modify", this.path);
				}
								
	});	
});