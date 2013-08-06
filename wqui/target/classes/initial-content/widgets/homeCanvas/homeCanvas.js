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
 
define("widgets/homeCanvas/homeCanvas",
[
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./templates/template.html",
    "dojo/topic",
    "widgets/homeCanvas/eventManager",
    "widgets/homeCanvas/initCanvas/initCanvas",
    "widgets/homeCanvas/initCanvas/viewBoxOperate",
    "widgets/homeCanvas/editOperate/selectObj",
    "widgets/homeCanvas/editOperate/extendLine",
    "widgets/homeCanvas/editOperate/drag",
],
function(
	declare,WidgetBase,TemplatedMixin,template,topic,
    EventManager,InitCanvas,ViewBoxOperate,SelectObj,ExtendLine,Drag
)
{
    var homeCanvas = declare("widgets/homeCanvas/homeCanvas", [ WidgetBase, TemplatedMixin], {
        templateString: template,
        
        constructor : function(path){
            this.data = path;
		},
        
        postCreate : function(){
			new EventManager();
            new InitCanvas(this.data,this.svgDiv);
		},
        
        initViewBoxOperate : function(){
            // 添加缩放窗口操作
            this.viewBoxOperate = new ViewBoxOperate();
            this.viewBoxOperate.viewBoxScale();
        },
        
        // 添加移动窗口操作
        moveViewBox : function(){
            this.clearAllEvent();
            this.viewBoxOperate.viewBoxMove();
        },
        
        // 清空当前绑定的事件
        clearAllEvent : function(){
            topic.publish("clearObjColor");
            Spolo.eventManager.clearAllEvent();
        },
        
        // 选择图形
        selectObj : function(){
            this.clearAllEvent();
            new SelectObj();    
        },
        
        // 拉伸直线
        extendLine : function(){
            this.clearAllEvent();
            new ExtendLine();
        },
        
        // 拖拽图形
        dragObj : function(){
            this.clearAllEvent();
            new Drag();
        },
	});
	
	return homeCanvas;
});