/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
**/

/**
	
*/

define("widgets/homeCanvas/visitor/drawVisitor/drawWall",
    ["dojo/topic"],
    function(topic){
    
    // drawWall计算画水平线还是竖直线
    var keepVertical = function(pstart,pend){
        if(Math.abs(pstart.x - pend.x) >= Math.abs(pstart.y - pend.y)){
            return false;
        }else{
            return true;
        }
    };
    
    // 计算两点间距离
    var pToPLength = function(pstart,pend){
        var xdis = pstart[0] - pend[0];
        var ydis = pstart[1] - pend[1];
        var dis = Math.sqrt(xdis * xdis + ydis * ydis);
        return dis;
    };
    
    // 修改直线的长度
    var setLength = function(currentLine,value){
        var dX, dY, length, angle;

        // Find current length and angle
        dX = Math.abs(currentLine.end.x - currentLine.start.x);
        dY = Math.abs(currentLine.end.y - currentLine.start.y);
        length = Math.sqrt(dX * dX + dY * dY);
        angle = Math.asin(dX / length);

        // Calculate new values
        dX = Math.sin(angle) * value;
        dY = Math.cos(angle) * value;
        
        var directionX = (currentLine.end.x > currentLine.start.x) ? 1 : -1 ;
        var directionY = (currentLine.end.y > currentLine.start.y) ? 1 : -1 ;
        currentLine.end.x = currentLine.start.x + dX * directionX;
        currentLine.end.y = currentLine.start.y + dY * directionY;
    };
    
    var keepVerticalOrHorizontal = true ;
	var minLength = 50;
    
    topic.subscribe("wall/setMinLength",function(value){
        if(value>0){
            minLength = value;
        }
    });
    
    topic.subscribe("wall/setKeepVerticalOrHorizontal",function(){
        keepVerticalOrHorizontal = !keepVerticalOrHorizontal;
    });
            
    var drawWall = dojo.declare([],{
        canvas : Spolo.canvas,
        
        
		constructor : function(){
            var parent = Spolo.root.children[Spolo.root.children.length - 1];
            var drawing = false;
            var currentLine = null;
            
            
            canvas.bind("click",function(){
                var startx,starty;
                if(drawing){
                    startx = currentLine.end.x;
                    starty = currentLine.end.y;
                }else{
                    startx = canvas.mouse.x;
                    starty = canvas.mouse.y;
                    drawing = true;
                }
                
                var wall = canvas.display.wall({
                    objid : parent.objid + "_wall" + (parent.children.length+1),
                    start : {x:startx,y:starty},
                    end : {x:startx,y:starty},
                    stroke: "3px #0aa",
                    cap: "round"
                });
                parent.addChild(wall);
                currentLine = wall;
                canvas.timeline.start();
            });
            
            canvas.setLoop(function(){
                var endx,endy;

                if(keepVerticalOrHorizontal){
                    var isVertical = keepVertical(currentLine.start,canvas.mouse);
                    if(!isVertical){
                        var dis = pToPLength([currentLine.start.x,currentLine.start.y],[canvas.mouse.x,currentLine.start.y]);
                        var numOfMinLength = (dis - (dis % minLength)) / minLength;
                        var directionX = (canvas.mouse.x > currentLine.start.x) ? 1 : -1 ;
                        currentLine.end.x = currentLine.start.x + numOfMinLength * minLength * directionX;
                        currentLine.end.y = currentLine.start.y;
                    }else{
                        var dis = pToPLength([currentLine.start.x,currentLine.start.y],[currentLine.start.x,canvas.mouse.y]);
                        var numOfMinLength = (dis - (dis % minLength)) / minLength;
                        var directionY = (canvas.mouse.y > currentLine.start.y) ? 1 : -1 ;
                        currentLine.end.x = currentLine.start.x;
                        currentLine.end.y = currentLine.start.y + numOfMinLength * minLength * directionY;
                    }
                }else{
                    var dis = pToPLength([currentLine.start.x,currentLine.start.y],[canvas.mouse.x,canvas.mouse.y]);
                    var numOfMinLength = (dis - (dis % minLength)) / minLength;
                    currentLine.end.x = canvas.mouse.x;
                    currentLine.end.y = canvas.mouse.y;
                    setLength(currentLine,numOfMinLength * minLength );
                }
               
            });
            
            canvas.bind("dblclick",function(){
                canvas.mouse.cancel();
                canvas.timeline.stop();
                setTimeout(function(){
                    drawing = false;
                    currentLine = null;
                },100);
                parent.removeChild(parent.children[parent.children.length - 1]);
                parent.removeChild(parent.children[parent.children.length - 1]);
            });
		},
        
        setKeepVerticalOrHorizontal : function(){
            keepVerticalOrHorizontal = !keepVerticalOrHorizontal;
        },
        
        setMinLength : function(value){
            if(value>0){
                minLength = value;
            }
        },
        
	});		
	return drawWall;
});