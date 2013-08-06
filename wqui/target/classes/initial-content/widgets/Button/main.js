/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://glue.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://glue.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 *  
 *  author : yangkangkang@spolo.org
 *  description  :创建按钮
 **/
define("widgets/Button/main",[
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
	"dojo/Evented",
	"dojo/dom-construct",
	"dojo/on"
	],
function(WidgetBase,TemplatedMixin,template,Evented,domConstruct,on){
	function initCss(){
		if(this.data.style == "style1"){
			this.seleced_style = "button blue";
		}else if(this.data.style == "style2"){
			this.seleced_style = "button gray";
		}else{
			this.seleced_style = "button blue";
		}
	}
	function initFont(obj,i){
		if(this.font){
			if(this.font.title){
				var content = this.font.title;
				var label = domConstruct.create("label",{innerHTML:content[i]},obj);
			}
			for(var key in this.font){
				obj.style[key] = this.font[key];
			}
		}
	}
	function initImage(obj,i){
		var img = domConstruct.create("img",{},obj);
		if(this.Image){
			for(var key in this.Image){
				if(key == "src"){
					if(this.Image[key][i] == " "){
						img.style.display = "none";
					}else{
						img.setAttribute(key,require.toUrl(this.Image[key][i]));
					}
				}
				img.style[key] = this.Image[key];
			}
		}else{
			img.style.display = "none";
		}
	}
	function initButtonSize(obj){
		for(var key in this.buttonSize){
			obj.style[key] = this.buttonSize[key];
			if(this.buttonSize.height){
				obj.style.lineHeight = this.buttonSize.height;
			}
		}
	}
	function initClickEvent(obj,style){
		var _this = this;
		on(obj,"click",function(){
			if(_this.button_number > 1){
				this.className = style + " active";
			}
			if((_this.curObj != this)){
				if(_this.curObj){
					_this.curObj.className = style;
				}
			}
			_this.curObj = this;
			_this.emit("click",{})
			
		})
	}
	function createButton(){
		var fatherObj = this.show_button;
		if(this.button_number > 1){
			var btn_group = domConstruct.create("div",{class:"button_group"},fatherObj);
			fatherObj = btn_group;
		}
		for(var i = 0;i< this.button_number; i++){
			if(fatherObj){
				var btn = domConstruct.create("div", {class: this.seleced_style}, fatherObj);
				initFont.call(this, btn, i);
				initImage.call(this, btn, i);
				initButtonSize.call(this, btn);
				initClickEvent.call(this, btn, this.seleced_style);
			}
		}
	}
	
	var retClass = dojo.declare("widgets/Button/main",[WidgetBase, TemplatedMixin, Evented],{
		hrefURL:require.toUrl("widgets/Button/css/style.css"),
		templateString : template,
		content : null,
		change_content : null,
		button_number:null,
		curObj: null,
		font:null,
		buttonSize:null,
		Image:null,
		seleced_style:null,
		constructor:function(data){
			if(typeof(data) != "object"){
				alert("error: data type is not an object !");
			}else{
				this.data = data;
			}
			this.button_number = (data.buttonNumber)?data.buttonNumber:1;
			for(var key in this.data){
					switch (key){
						case "font":
							this.font = this.data[key];
						break;
						case "image":
							this.Image = this.data[key];
						break;
						case "button_size":
							 this.buttonSize = this.data[key];
						break;
					}
				}
		},
		postCreate : function(){
			initCss.call(this);
			createButton.call(this);
		},
		// _changeButtonContent:function(){
			// var buttonObj = this.button_label;
			// /**
			// *判断浏览器
            // */
			// if(this.content && this.change_content){
				// if(navigator.appName == "Microsoft Internet Explorer"){
					// if(buttonObj.innerText == this.content){
						// buttonObj.innerText = this.change_content;
					// }else if(buttonObj.innerText == this.change_content){
						// buttonObj.innerText = this.content;
					// }else{
						// console.log("buttonObj.innerText is error !");
					// }
				// }else{
					// if(buttonObj.textContent == this.content){
						// buttonObj.textContent = this.change_content;
					// }else if(buttonObj.textContent == this.change_content){
						// buttonObj.textContent = this.content;
					// }else{
						// console.log("buttonObj.textContent is error !");
					// }
				// }
			// }
		// },
	})
	return retClass
})