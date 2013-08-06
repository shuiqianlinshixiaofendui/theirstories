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
 *  description  : control div animation
 **/
 
 //  注意修改模板信息 
define("widgets/Dialog/js/animation",
[
    "dojo/dom",
    "dojo/on",
	"dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/_base/fx",
    "dojo/fx/easing"
],
function(
	dom,on,declare,domConstruct,Evented,domStyle,fx,fxEasing
)
{
    function animation_1(_this){
        _this.divNode.style.opacity = 0;
        var fadeArgs = {
            node: _this.divNode.id,
            duration : 2000
        };
        fx.fadeIn(fadeArgs).play();
    }
    
    function animation_2(_this){
        var ef = fxEasing["bounceOut"];
        fx.animateProperty({
            node: _this.divNode.id,
            properties: {
              marginLeft: {
                start: 200,
                end: 0,
                unit: "px"
              }
            },
            easing: ef,
            duration: 5000
          }).play();
    
    }
    
    function animation_3(_this){
        var ef = fxEasing["backOut"];
        fx.animateProperty({
            node: _this.divNode.id,
            properties: {
              marginLeft: {
                start: 200,
                end: 0,
                unit: "px"
              }
            },
            easing: ef,
            duration: 5000
          }).play();
    
    }
    
    function animation_4(_this){
        var placeAtDivStyle = domStyle.getComputedStyle(_this.divNode);
        var placeAtDivWidth = parseFloat( placeAtDivStyle.width );
        console.log(placeAtDivWidth + " placeAtDivWidth")
        var ef = fxEasing["backOut"];
        fx.animateProperty({
            node: _this.divNode.id,
            properties: {
              width: {
                start: 0,
                end: placeAtDivWidth,
                unit: "px"
              }
            },
            easing: ef,
            duration: 5000
          }).play();
    
    }
    
    var animation = declare([Evented], {
        
        // 初始化时，需要获取执行动画的 div (dom node)
        constructor : function(){
            this.animationList = [1,2,3,4]; // animation list ， 动画类，包含了多少个动画
            this.animation = 0; // 当前播放的动画，初始化动画是 0 
            this.divNode;
        },
        
        setAnimation : function(args,domNode){
            var aNum = parseInt(args);
            this.divNode = domNode;
            // 如果 传入的动画是 animation 对象已有的动画，则执行动画，否则执行默认动画
            for( var i=0;i<this.animationList.length;i++ ){
                console.log(aNum + "   ---   " + i)
                if(aNum == this.animationList[i]){
                    this.animation = aNum;
                }
            }
            
        },
        
        // 开始执行动画
        playAnimation : function(){
            // 根据 setAnimation 设置的动画，开始执行该动画
            console.log(this.animation + " currentN ")
            switch(this.animation){
                case 1 :
                    animation_1(this);
                    break;
                case 2 :
                    animation_2(this);
                    break;
                case 3 :
                    animation_3(this);
                    break;
                case 4 :
                    animation_4(this);
                    break;
            }
        },
        
        // 清空已经设置的动画
        clearAnimationState : function(){
            this.animation = 0;
        }
                
	});
	
	return animation;
});