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
 
define("widgets/ModelListItem/ModelListItem",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
	"dijit/form/CheckBox",
	"dijit/Tooltip",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/parser",
	"dojo/Evented",
	"dojo/on"
],
function(
	declare, WidgetBase, TemplatedMixin, template,
	CheckBox, Tooltip, domStyle,domAttr, parser,
	Evented, on
)
{
	return declare("widgets/ModelListItem/ModelListItem", [ WidgetBase, TemplatedMixin, Evented ], {
		
		name: "未命名",
		referModel: "",
		type: "",
		number: 1,
		path: "",
		key:"",
		
		img: "/widgets/ModelListItem/image/nopreview.jpg",
		checked: false,
		
		templateString: template,
		//baseClass: "modelListItem",
		
		constructor : function(args)
		{
			this.arg = args;
		},
		
		postCreate: function(){
			this.inherited(arguments);
			
			if(this.arg["type"]&&this.arg["type"]=="CAMERA"){
				this.typeNode.innerHTML = "摄像机";
				domAttr.set(this.imageNode, "src", "/widgets/ModelListItem/image/camera.png");
				//隐藏scale
				//domStyle.set(this.scale,"display","none");
			}
			if(this.arg["type"]&&this.arg["type"]=="MESH"){
				this.typeNode.innerHTML = "模型";
				domAttr.set(this.imageNode, "src", "/widgets/ModelListItem/image/nopreview.jpg");
			}
			
			if(this.arg["canModify"])
			{
				// 显示 this.canModify
				domStyle.set(this.canModify, "display", "block");
			}
			else
			{
				// 隐藏 this.canModify
				domStyle.set(this.canModify, "display", "none");
			}
			if(this.arg["modelInfo"])
			{
				// 显示 this.modelInfo
				domStyle.set(this.modelInfo, "display", "block");
			}
			else
			{
				// 隐藏 this.modelInfo
				domStyle.set(this.modelInfo, "display", "none");
			}
			
			if(this.arg["canInstead"])
			{
				// 显示 this.canInstead
				domStyle.set(this.canInstead, "display", "block");
				// 显示 this.canInsteadFromPreview
				domStyle.set(this.canInsteadFromPreview, "display", "block");
			}
			else
			{
				// 隐藏 this.canInstead
				domStyle.set(this.canInstead, "display", "none");
				// 隐藏 this.canInsteadFromPreview
				domStyle.set(this.canInsteadFromPreview, "display", "none");
			}
		}, 
		
		_getCheckedAttr: function(){
			return this.checkNode.checked;
		},
		
		_setCheckedAttr : function(flag){
			// console.log("_setCheckedAttr");
			if( flag==true || flag==false ){
				this._set("checked", flag);
				this.checkNode.checked=flag;
			}else{
				throw("parameter is invalid!");
			}
		},
		
		_setNameAttr : function(value){
			this._set("name",value);
			this.nameNode.innerText = value;
		},
		_setTypeAttr: function(value){
			this._set("type",value);
			this.typeNode.innerText = value;
		},
		_setNumberAttr: function(value){
			this._set("number",value);
			this.numberNode.innerText = value;
		},
		_setInvalidAttr: function(value){
			this._set("invalid",value);
			this.invalidNode.innerText = value;
		},
		_setMaterialAttr: function(value){
			this._set("material",value);
			this.materialNode.innerText = value;
		},
		__onCheckBoxClick : function(){
			this._set("checked",this.checkNode.checked);
		},
		
		
		__onClickModify : function(){
			this.emit("onModify", this);
		},
		__onClickModelInfo : function(){
			this.emit("onModelInfo", this);
		},
		__onClickInstead : function(){
			this.emit("onInstead", this);
		},
		__onClickInsteadFromPreview : function(){
			this.emit("onInsteadFromPreview", this);
		},
		__onWeb3d : function(){
			this.emit("onWeb3d",this);
		},
		getItemName:function(){
			return this.name;
		},
		
		_setImageAttr : function(url){
			this.imageNode.src = url;
		}
		
	});	
	
	
});