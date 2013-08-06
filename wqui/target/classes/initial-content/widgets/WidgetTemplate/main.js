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
 *  author : [作者]
 *  wiki   : [这里是当前widget对应的wiki地址]
 *  description  : [这里是当前widget的描述]
 **/
 
//  注意修改模板信息 
define("widgets/WidgetTemplate/main",
[
    "dojo/dom",
    "dojo/on",
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
    "dojo/dom-construct",
    "dojo/Evented"
],
function(
	dom,on,declare,WidgetBase,TemplatedMixin,template,domConstruct,Evented
)
{
    
    
    
    
    var main = declare([ WidgetBase, TemplatedMixin,Evented], {
        
        hrefURL : require.toUrl("widgets/WidgetTemplate/css/style.css"), // 定义widget的css样式文件
        templateString : template, // widget模板
        _this : null, // 存储当前this对象 传递this的方式，尽量使用call(this)，调用私有方法是，将this传进去
        
        
        constructor : function(){
            
        }, // 构造函数
        
        // 初始化函数，在初始化函数中，初始化widget的全局变量
        postCreate : function(){
            _this = this; // 记录this变量
		},
        
        // 公共方法
        init : function(){
            //获取 template dom 节点
            // this.test;
            _this.emit("WidgetTemplate_ready");
        }
        
       
                
	});
	
	return main;
});