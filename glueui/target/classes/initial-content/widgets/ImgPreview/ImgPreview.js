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
	"dijit/form/CheckBox"
],
function(
	declare, WidgetBase, TemplatedMixin, template,
	CheckBox
)
{
	return declare("widgets/ModelListItem/ModelListItem", [ WidgetBase, TemplatedMixin ], {
		
		name: "未命名",
		location: "0 0 0",
		scale: "1 1 1",
		rotation_axis_angle: "0 0 1 0",
		referModel: "",
		type: "",
		path: "",
		
		img: "/widgets/ModelListItem/image/nopreview.jpg",
		checked: false,
		
		templateString: template,
		//baseClass: "modelListItem",
		
		postCreate: function(){
			this.inherited(arguments);
		},
		
		_getCheckedAttr: function(){
			return this.checkNode.checked;
		},
		
		_setCheckedAttr: function(flag){
			// console.log("_setCheckedAttr");
			if( flag==true || flag==false ){
				this._set("checked", flag);
				this.checkNode.checked=flag;
			}else{
				throw("parameter is invalid!");
			}
		},
		
		__onCheckBoxClick: function(){
			// console.log("__onCheckBoxClick");
			// console.log(this.checkNode);
			this._set("checked",this.checkNode.checked);
		}
		
	});	
	
	
});