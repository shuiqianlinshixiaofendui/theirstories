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
 
define("widgets/homeCanvas/initCanvas/viewBoxOperate",
[
    "dojo/dom"
],
function(
    dom
)
{
    var viewBoxOperate = dojo.declare([],{
        
        constructor : function()
		{
        },
        
        viewBoxScale : function(){
            var svg = dom.byId("widgets/homeCanvas/homeCanvas_0");
            svg.addEventListener("mousewheel", scale, false);
            function scale(evt){
                
                var svgWidth = svg.width.baseVal.value;
                var svgHeight = svg.height.baseVal.value;
                var viewBoxX = svg.viewBox.baseVal.x;
                var viewBoxY = svg.viewBox.baseVal.y;
                var viewBoxWidth = svg.viewBox.baseVal.width;
                var viewBoxHeight = svg.viewBox.baseVal.height;
    
                if (evt.wheelDelta > 0){
                    var x = viewBoxX  - parseFloat((evt.x - svg.offsetLeft) / svgWidth * viewBoxWidth * 0.1);
                    var y = viewBoxY - parseFloat((evt.y - svg.offsetTop) / svgHeight * viewBoxHeight * 0.1);
                    svg.setAttribute("viewBox",x + " " + y + " " + viewBoxWidth*1.1 + " " + viewBoxHeight*1.1);
                }else{
                    var x = parseFloat(viewBoxX)  + parseFloat((evt.x - svg.offsetLeft) / svgWidth * viewBoxWidth /11);
                    var y = parseFloat(viewBoxY) + parseFloat((evt.y - svg.offsetTop) / svgHeight * viewBoxHeight /11);
                    svg.setAttribute("viewBox",x + " " + y + " " + viewBoxWidth/1.1 + " " + viewBoxHeight/1.1);
                }
            }
        },
        
        viewBoxMove : function(){
            // 平移窗口
            // 自己注册drag事件
            var viewBoxdrag = function(){
                var flag = false;
                Spolo.eventManager.addEvent(svg,"mousedown", down);
                Spolo.eventManager.addEvent(svg,"mousemove", move);
                Spolo.eventManager.addEvent(svg,"mouseup", up);
                
                var svgWidth = svg.width.baseVal.value;
                var svgHeight = svg.height.baseVal.value;
                var dragStartX,dragStartY,objPosX,objPosY,viewBoxX,viewBoxY,viewBoxWidth,viewBoxHeight;
                function down(evt){
                    if(!flag){
                        flag = true;

                        viewBoxX = svg.viewBox.baseVal.x;
                        viewBoxY = svg.viewBox.baseVal.y;
                        viewBoxWidth = svg.viewBox.baseVal.width;
                        viewBoxHeight = svg.viewBox.baseVal.height;
                        
                        dragStartX = parseFloat(evt.x / svgWidth * viewBoxWidth);
                        dragStartY = parseFloat(evt.y / svgHeight * viewBoxHeight);
                        
                        objPosX = parseFloat(viewBoxX);
                        objPosY = parseFloat(viewBoxY);
                    }
                }
                
                function move(evt) {
                    if (flag) {
                        dragEndX = parseFloat(evt.x / svgWidth * viewBoxWidth);
                        dragEndY = parseFloat(evt.y / svgHeight * viewBoxHeight);
                        shiftX = dragEndX - dragStartX;
                        shiftY = dragEndY - dragStartY;
                        var x = -objPosX + shiftX;
                        var y = -objPosY + shiftY;
                        svg.setAttribute("viewBox",-x + " " + -y + " " + viewBoxWidth + " " + viewBoxHeight);
                    }
                }
                
                function up(evt) { 
                    flag = false;
                }
            }
            
            var svg = dom.byId("widgets/homeCanvas/homeCanvas_0");
            viewBoxdrag(svg);
        },
		
	});
	
	return viewBoxOperate;
});