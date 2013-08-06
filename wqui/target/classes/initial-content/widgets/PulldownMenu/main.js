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
 *  description  : This is a widget for pull-down menu by ourselves，it shows categoris of any datas.
 **/
 
//  注意修改模板信息 
define("widgets/PulldownMenu/main",
[
    "dojo/dom",
    "dojo/query",
    "dojo/on",
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
    "dojo/dom-construct",
    "dojo/Evented"
],
function(
	dom,query,on,declare,WidgetBase,TemplatedMixin,template,domConstruct,Evented
)
{
    var main = declare([ WidgetBase, TemplatedMixin,Evented], {
        
        // hrefURL : require.toUrl("widgets/PulldownMenu/css/style.css"), // 定义widget的css样式文件
		hrefURL : require.toUrl("/libs/bootstrap/css/bootstrap.min.css"), // 定义widget的css样式文件
        templateString : template, // widget模板
        _this : null, // 存储当前this对象 传递this的方式，尽量使用call(this)，调用私有方法是，将this传进去
        _flag: false,     
        constructor : function(array){
			this.array = array;           
        }, // 构造函数
        
        // 初始化函数，在初始化函数中，初始化widget的全局变量
        postCreate : function(){
            _this = this; // 记录this变量
		
		},
        // 公共方法
        init : function(){
			var maxLength = this._orderArray(this.array); //先算一下字符的最大长度
			var array = this.array;
			if(this.array.length){
				for(var index=0;index<array.length;index++){
					var item = array[index];
					if(index%3==0&&index>0){
						var li1 = domConstruct.create("li", {className:"divider"},this.myul);					
					}
					var li = domConstruct.create("li", {},this.myul);

					//li.style.width = (item.length*12).toString()+"px";			
					var a = domConstruct.create("a", {innerHTML:item},li);
					
					//监听a的鼠标点击事件
					on(a,"click",function(){
						_this._OnmouseClick(this);
					});
				}
					this._changeSize(maxLength);
			}
		},
		
		//设置默认的显示
		setDefaultValue:function(value){
			this.default.innerHTML = value;
		},	
		
		//自动修改ul的宽度
		_changeSize:function(num){		
			num = num*14+30;
			this.myul.style.width = num.toString()+"px";
		},
		
		//获取最大长度
		_orderArray:function(){
			var array = this.array;
			var _array = new Array();
			
			for(var index = 0;index < array.length;index++){	
				_array.push(array[index].length);
			}	
			return Math.max.apply(null, _array)
		},

		//发布分类的鼠标左键点击事件
		_OnmouseClick:function(obj){
			this.setDefaultValue(obj.innerHTML);
			this.emit("aOnClick",obj);
		},

	});	
	return main;
});