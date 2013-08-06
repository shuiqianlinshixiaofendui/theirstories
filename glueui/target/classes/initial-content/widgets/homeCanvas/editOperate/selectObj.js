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
 
define("widgets/homeCanvas/editOperate/selectObj",
[
	"dojo/_base/declare","dojo/dom","dojo/topic",
],
function(declare,dom,topic){

    var selectObj = declare([], {
        
        constructor : function(){
            
            var svg = dom.byId("widgets/homeCanvas/homeCanvas_0");
            var lastObj = null;
            var oldStroke;
            
            for(var i=0;i<svg.childNodes.length;i++){
                Spolo.eventManager.addEvent(svg.childNodes[i],"click", changeColor);
            }
            function changeColor(evt)
            {
                if(lastObj){
                    if(lastObj != evt.target){
                        lastObj.style.stroke = oldStroke;
                        lastObj = evt.target;
                    }
                }else{
                    lastObj = evt.target;
                    oldStroke = evt.target.style.stroke;
                }

                evt.target.style.stroke = "red";
                Spolo.selectedObj = evt.target;
            }
            
            topic.subscribe("clearObjColor",function(){
                if(lastObj){
                    lastObj.style.stroke = oldStroke;
                    lastObj = null;
                }
            });
		},
        
	});
	
	return selectObj;
});