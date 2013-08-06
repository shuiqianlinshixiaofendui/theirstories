/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: spolo@spolo.org
 *  
 *  author : houdongqiang
 *  wiki   : null
 *  description  : 用作图片显示缩略图的控件。
 **/
 
//  注意修改模板信息 
define("widgets/ImgItem/main",
[
    "dojo/dom",
    "dojo/on",
	"dojo/query",
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
    "dojo/dom-construct",
    "dojo/Evented"
],
function(
	dom,on,query,declare,WidgetBase,TemplatedMixin,template,domConstruct,Evented
)
{
    var main = declare([ WidgetBase, TemplatedMixin,Evented], {
        
        hrefURL : require.toUrl("widgets/ImgItem/css/style.css"), // 定义widget的css样式文件
        templateString : template, // widget模板
        _this : null, // 存储当前this对象 传递this的方式，尽量使用call(this)，调用私有方法是，将this传进去
		date:"",
		person:"",
        
        constructor : function(json){
            this.json = json;
        }, // 构造函数
        
        // 初始化函数，在初始化函数中，初始化widget的全局变量
        postCreate : function(){
            _this = this; // 记录this变量
		},
        
        // 公共方法
        init : function(){

		   var item = this.json;
			var desHTML = "";
			if(item){
				for(var name in item){
					if( name == "url" ){
						this.url = item[name];
						}
						else{
							desHTML += '<p data-dojo-attach-point="author" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" >'
								+name+':'+item[name]+'</p>';
						}						
				}
				this.description.innerHTML = desHTML;   
			}
		},
		
		//点击预览事件，发送图片的url
		_onmouseClickOfPreview:function(obj){
			this.emit("onClickOfPreview",this.url)
		
		},		
		
		//点击下载事件，发送图片的url
		_onmouseClickOfDown:function(obj){
			this.emit("onClickOfDown",this.url)		
		}
                
	});
	
	return main;
});