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
 
define("widgets/homeCanvas/editOperate/extendLine",
[
	"dojo/_base/declare","dojo/dom","dojo/topic",
],
function(declare,dom,topic){

    var extendLine = declare([], {
        
        constructor : function(){
            var target = Spolo.selectedObj;
            dstr = target.attributes[0].value;
            var darray = this.resolveD(dstr);
            
            // 在两端加两个点
            var svg = document.getElementById("widgets/homeCanvas/homeCanvas_0");
            var xmlns = "http://www.w3.org/2000/svg";
            var node = document.createElementNS (xmlns, "circle");
            node.setAttributeNS (null, "id", "circle1");
            node.setAttributeNS (null, "cx", darray[0]);
            node.setAttributeNS (null, "cy", darray[1]);
            node.setAttributeNS (null, "r", target.getAttribute("stroke-width")*1.5);
            node.setAttributeNS (null, "stroke", target.getAttribute("stroke"));
            svg.appendChild(node);
            var node2 = document.createElementNS (xmlns, "circle");
            node2.setAttributeNS (null, "id", "circle2");
            node2.setAttributeNS (null, "cx", darray[darray.length-2]);
            node2.setAttributeNS (null, "cy", darray[darray.length-1]);
            node2.setAttributeNS (null, "r", target.getAttribute("stroke-width")*1.5);
            node2.setAttributeNS (null, "stroke", target.getAttribute("stroke"));
            svg.appendChild(node2);
            
            // 给两个点添加拖拽事件
            this.pointDrag(node,darray);
            this.pointDrag(node2,darray);

		},
        
        resolveD : function(dstr){
            // 将指令与值用空格分隔
            for(var i = 1 ;i<dstr.length;i++){
                if(dstr[i]=='M' || dstr[i]=='m' || dstr[i]=='L' || dstr[i]=='l' || dstr[i]=='Z' || dstr[i]=='z'){
                    var dstr1 = dstr.slice(0, i-1);
                    var dstr2 = dstr.slice(i);
                    dstr = dstr1 + " " + dstr2;
                }
            }
            
            //去掉没用的信息
            var darray = dstr.split(" ");
            var haveM = false;
            for(var i = 0 ;i < darray.length; i++){
                if(darray[i].charAt(0) == 'M' || darray[i].charAt(0) == 'm'){
                    if(haveM){
                        darray.splice(i,2);
                    }else{
                        haveM = true;
                        darray[i] = darray[i].slice(1);
                    }
                }
                if(darray[i].charAt(0) == 'L' || darray[i].charAt(0) == 'l'){
                    darray[i] = darray[i].slice(1);
                }
                if(darray[i].charAt(0) == 'Z' || darray[i].charAt(0) == 'z'){
                    haveM = false;
                    darray.splice(i,1);
                }
                haveM = false;
            }
            return darray;
        },
        
        // 拖拽事件
        pointDrag : function(target,darray){
            var svg = document.getElementById("widgets/homeCanvas/homeCanvas_0");
            var flag = false;
            Spolo.eventManager.addEvent(target,"mousedown", down);
            Spolo.eventManager.addEvent(svg,"mousemove", move);
            Spolo.eventManager.addEvent(svg,"mouseup", up);
            
            var p = svg.createSVGPoint();
            
            var dragStartX,dragStartY,objPosX,objPosY,x,y;
            function down(evt){
                if(!flag){
                    flag = true;

                    var CTM = svg.getScreenCTM();
                    p.x = evt.x;
                    p.y = evt.y;
                    var svgPoint = p.matrixTransform( CTM.inverse());
                    
                    dragStartX = svgPoint.x;
                    dragStartY = svgPoint.y;
                    
                    objPosX = parseFloat(target.getAttribute("cx"));
                    objPosY = parseFloat(target.getAttribute("cy"));
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
                    
                    target.setAttribute("cx",objPosX+x);
                    target.setAttribute("cy",objPosY+y);
                    // target.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
                    if(evt.target.id == "circle1"){
                        Spolo.selectedObj.setAttribute("d","M"+(objPosX+x)+" "+(objPosY+y)+" L"+darray[darray.length-2]+" "+darray[darray.length-1]+" Z");
                        darray[0] = objPosX+x;
                        darray[1] = objPosY+y;
                    }
                    if(evt.target.id == "circle2"){
                        Spolo.selectedObj.setAttribute("d","M"+darray[0]+" "+darray[1]+" L"+(objPosX+x)+" "+(objPosY+y)+" Z");
                        darray[darray.length-2] = objPosX+x;
                        darray[darray.length-1] = objPosY+y;
                    }
                }
            }
            
            function up(evt) { 
                flag = false;
            }
        },
        
	});
	
	return extendLine;
});