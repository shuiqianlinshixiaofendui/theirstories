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
 *  author : wangxiaodong@3dly.net
 *  wiki   : ....
 *  description  : glue dialog
 **/
 
//  注意修改模板信息 
define("widgets/Dialog/main",
[
    "dojo/dom",
    "dojo/on",
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
    "dojo/dom-construct",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/_base/fx",
    "widgets/Dialog/js/animation"
],
function(
	dom,on,declare,WidgetBase,TemplatedMixin,template,domConstruct,Evented,domStyle,fx,animation
)
{
    // get Dialog placeAt Div size
    function dynamic_get_screen_size(_this){
    
        var placeAtDivStyle = domStyle.getComputedStyle(_this.widget_dialog.parentNode);
        var parentDivWidth = parseFloat(placeAtDivStyle.width);
        var parentDivHeight = parseFloat(placeAtDivStyle.height);
        console.log("Dialog Widget Log : w & h -- " + _this.width + " & " + _this.height);
        _this.width = parentDivWidth;
        _this.height = parentDivHeight;
       
    }
    
    // 打开 dialog
    function open_dialog(_this){
    
        /** 其实dialog的宽，高不需要设置，用户只需要设置placeAt的div的宽高，就是在设置dialog的宽高了 */
        
        // 设置 dialog 样式 , 设置 dialog 的样式，其实就是动态的改变template的css样式即可。
        if(_this.style != 0){
            _this._set("hrefURL", require.toUrl("widgets/Dialog/css/style_"+ _this.style + ".css"));
            _this.dialog_css.href = _this.hrefURL;
        }else{
            _this._set("hrefURL", require.toUrl("widgets/Dialog/css/style_"+ 1 + ".css"));
            _this.dialog_css.href = _this.hrefURL;
        }
        
        // 设置 placeAt Div Display 
        _this.parentNode.style.display = "block";
        _this.widget_dialog.style.display = "block";
       
        // 根据 dialog 动画，设置开启动画
        if(_this.ani != 0){
            _this.animationCls.setAnimation(_this.ani,_this.parentNode);
            _this.animationCls.playAnimation();
        }
        
    }
    
    function close_dialog(_this){
        _this.parentNode.style.display = "none";
    }
     
     // 如果按下 ESC 键，自动关闭 dialog
     dojo.connect(document, "onkeyup", function(event) {
        if(event.keyCode == 27){
            thisObj.parentNode.style.display = "none";
            var maskNode = dojo.byId("dialog_mask");
            if(maskNode){
              maskNode.style.display = "none";
            }
        }
     });
    
    var main = declare([ WidgetBase, TemplatedMixin,Evented], {
        
        hrefURL : require.toUrl("widgets/Dialog/css/style_1.css"), // 定义widget的css样式文件
        templateString : template, // widget模板
        thisObj : null, // 存储当前this对象 传递this的方式，尽量使用call(this)，调用私有方法是，将this传进去
        
        
        constructor : function(){
        }, // 构造函数
        
        // 初始化函数，在初始化函数中，初始化widget的全局变量.  在加入主dom树前运行
        postCreate : function(){
            this.width;
            this.height;
            this.ani;
            this.style;
            this.parentNode;
            thisObj = this;
            
            this.animationCls = new animation();
            //_this = this; // 记录this变量
            
           
		},
        
        // 在加入主dom树后运行，启动dialog，首先隐藏当前dialog。当接收到open命令后，在打开dialog
        startup : function(){
            // startup 的时候，先将dialog隐藏，当用户想要显示的时候，在给予显示
            this.parentNode = this.widget_dialog.parentNode;
            this.parentNode.style.display = "none";
            
            on(this.dialog_close_button,"click",function(){
                this.parentNode.style.display = "none";
                var maskNode = dojo.byId("dialog_mask");
                if(maskNode){
                  maskNode.style.display = "none";
                }
            });
        },
        
        
        // 打开 dialog , 用户在placeAt的时候，就已经设置了宽高了，没有必要再open的时候在设置宽高了。
        dialog_open : function(aniArgs,style){
            //console.log("Dialog Widget Log : args length -- " + arguments.length);
            var size = dynamic_get_screen_size(this); // 记录当前 dialog 组建的宽度，高度
            var args_length = arguments.length; // 参数长度
            switch(args_length){
                case 0 : // 默认不填参数，动画和样式都是默认值
                    this.ani = 0;
                    this.style = 0;
                    break;
                case 1 : // 如果用户只填写一个参数，默认设置动画
                    this.ani = aniArgs; 
                    this.style = 0;
                    break;
                case 2 : // 当用户填写两个参数时，默认第一个参数是动画参数，第二个参数是样式参数
                    this.ani = aniArgs;
                    this.style = style;
                    break;
            }
            
            open_dialog(this); // 打开 dialog widge
      
   
        },
        
        // 关闭 dialog
        dialog_close : function(){
            close_dialog(this);
            var maskNode = dojo.byId("dialog_mask");
            if(maskNode){
              maskNode.style.display = "none";
            }
        },
        
        // 设置 dialog 模式化与非模式化 默认是非模式化,如果调用isMode方法，没用设置参数，也默认为非模式化
        isMode : function(args){
            if(arguments.length != 0 && args==true){
                var styleString = "position:absolute;left:0px;top:0px;width:"+$(document).width()+"px;height:"+$(document).height()+"px;background-color:rgb(112, 112, 112);overflow:hidden;margin: 0 auto;z-index:9998;"
                domConstruct.create("div", {className:"dialog_mask",id:"dialog_mask",style:styleString},document.body);
            }
        },
        
        // 兼容其他Widget
        
        /**
            首先，可以把其他Widget注入到Dialog里面来
            然后，将注入进来的 Widgets placeAt 到DIV中
            根据注入的 Widget 参数进行设置，调整注入进来的Widget的位置
            不需要返回 Widget 对象，Dialog 只负责了placeAt一个对象，并不需要返回给用户对象，是用户将对象placeAt到Dialog Widget中来
        */
        injectWidget : function(widgetObj,json){
            //widgetObj == Waterfall
            // Json -->  Widget style
            /*
            Json = {
                left : 0,
                top : 0,
                width : 100,
                height : 100
            }
            */
            var styleString ;
            switch(Object.keys(json).length){
                case 3 :
                    styleString = "position:relative;z-index:9998;margin-left:"+json.left+"px;width:"+json.width+"px;margin-top:"+json.top+"px;";
                    break;
                case 4 : 
                    styleString = "position:relative;z-index:9998;margin-left:"+json.left+"px;width:"+json.width+"px;margin-top:"+json.top+"px;height:"+json.height+"px;" ;
                    break;
            }
           
            var placeAtDom = domConstruct.create("div", {style:styleString},this.dialog_widgets_placeAt);
            widgetObj.placeAt(placeAtDom);
            
        },
        
        // 注入dom节点，允许用户直接添加dom对象
        injectDomNode : function(node,json){
            var styleString ;
            switch(Object.keys(json).length){
                case 3 :
                    styleString = "position:relative;z-index:9998;margin-left:"+json.left+"px;width:"+json.width+"px;margin-top:"+json.top+"px;";
                    break;
                case 4 : 
                    styleString = "position:relative;z-index:9998;margin-left:"+json.left+"px;width:"+json.width+"px;margin-top:"+json.top+"px;height:"+json.height+"px;" ;
                    break;
            }
           
            var placeAtDom = domConstruct.create("div", {style:styleString},this.dialog_widgets_placeAt);
            domConstruct.place(node,placeAtDom,"last");
        },
        
        modifyPrompt : function(args){
            this.dialog_prompt.innerHTML = args;
        }
       
                
	});
	
	return main;
});