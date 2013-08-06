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
 
define("widgets/homeCanvas/editOperate/drag",
[
    "dojo/_base/declare",

],
function(
    declare
)
{
    var drag = declare([], {
		
		constructor : function()
		{
            var svg = document.getElementById("widgets/homeCanvas/homeCanvas_0");
            for(var i=0;i<svg.childNodes.length;i++){
                drag(svg.childNodes[i]);
            }
            
            function drag(target){
                var flag = false;
                Spolo.eventManager.addEvent(target,"mousedown", down);
                Spolo.eventManager.addEvent(svg,"mousemove", move);
                Spolo.eventManager.addEvent(svg,"mouseup", up);
                
                var p = svg.createSVGPoint();
                
                var dragStartX,dragStartY,objPosX,objPosY,x,y,oldColor,translateStr;
                function down(evt){
                    if(!flag){
                        flag = true;

                        var CTM = svg.getScreenCTM();
                        p.x = evt.x;
                        p.y = evt.y;
                        var svgPoint = p.matrixTransform( CTM.inverse());
                        
                        dragStartX = svgPoint.x;
                        dragStartY = svgPoint.y;
                        
                        oldColor = target.getAttribute("stroke");
                        target.style.stroke = "red";
                        Spolo.selectedObj = target;
                        
                        translateStr = target.getAttributeNS(null, "transform");
                    }
                }
                
                function move(evt) {
                    if (flag) {
                        var CTM = svg.getScreenCTM();
                        p.x = evt.x;
                        p.y = evt.y;
                        var svgPoint = p.matrixTransform( CTM.inverse());
                        
                        dragEndX = svgPoint.x;
                        dragEndY = svgPoint.y;
                        x = dragEndX - dragStartX;
                        y = dragEndY - dragStartY;
                        

                        target.setAttributeNS(null, "transform", translateStr+" translate(" + x + "," + y + ")");
                    }
                }
                
                function up(evt) { 
                    if(oldColor){
                        Spolo.selectedObj.style.stroke = oldColor;
                    }
                    flag = false;
                }
            }
        },
		
	});
	
	return drag;
});