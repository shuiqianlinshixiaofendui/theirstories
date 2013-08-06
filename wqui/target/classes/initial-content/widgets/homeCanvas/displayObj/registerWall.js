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

define("widgets/homeCanvas/displayObj/registerWall",["widgets/homeCanvas/visitor/setChildCanSelectVisitor/setChildCanSelectVisitor"],function(setChildCanSelectVisitor){
	
    var registerWall = dojo.declare([],{
		constructor : function(){
            var constructor = function (settings, core) {
            
                return oCanvas.extend({
                    core: core,
                    childCanSelect : true,
                    lineWall : true ,
                    isPointerInside : function(pointerObject){
                        var x1 = this.start.x;
                        var y1 = this.start.y;
                        var x2 = this.end.x;
                        var y2 = this.end.y;
                        var x0 = pointerObject.x;
                        var y0 = pointerObject.y;
                        var left = 0;
                        var right = 0;
                        if(x1 != x2 && y1!=y2){
                            var left = (x0-x1)/(x2-x1);
                            var right = (y0-y1)/(y2-y1);
                        }
                        var maxX = x1 > x2 ? x1 : x2 ;
                        var minX = x1 < x2 ? x1 : x2 ;
                        var maxY = y1 > y2 ? y1 : y2 ;
                        var minY = y1 < y2 ? y1 : y2 ;
                        var flag = (x0>minX-3 && maxX+3>x0 && y0>minY-3 && maxY+3>y0 && Math.abs(left-right)<0.1);
                        if(this.childCanSelect){
                            return flag;
                        }else{
                            return false;
                        }
                    },
                    draw : function(){
                        var canvas = core.canvas;
                        canvas.beginPath();
                        
                        if(this.lineWall){
                            canvas.moveTo(this.start.x,this.start.y);
                            canvas.lineTo(this.end.x,this.end.y);
                            
                            var radius_x = 1.5;
                            var radius_y = 1.5;
                            var point1_x = this.start.x;
                            var point1_y = this.start.y;
                            var point2_x = this.end.x;
                            var point2_y = this.end.y;
                            var EllipseToBezierConstant = 0.276142374915397,
                                o = {x: radius_x * 2 * EllipseToBezierConstant, y: radius_y * 2 * EllipseToBezierConstant};

                            // Draw the curves that will form the ellipse
                            canvas.moveTo(point1_x - radius_x, point1_y);
                            canvas.bezierCurveTo(point1_x - radius_x, point1_y - o.y, point1_x - o.x, point1_y - radius_y, point1_x, point1_y - radius_y);
                            canvas.bezierCurveTo(point1_x + o.x, point1_y - radius_y, point1_x + radius_x, point1_y - o.y, point1_x + radius_x, point1_y);
                            canvas.bezierCurveTo(point1_x + radius_x, point1_y + o.y, point1_x + o.x, point1_y + radius_y, point1_x, point1_y + radius_y);
                            canvas.bezierCurveTo(point1_x - o.x, point1_y + radius_y, point1_x - radius_x, point1_y + o.y, point1_x - radius_x, point1_y);
                            
                            canvas.moveTo(point2_x - radius_x, point2_y);
                            canvas.bezierCurveTo(point2_x - radius_x, point2_y - o.y, point2_x - o.x, point2_y - radius_y, point2_x, point2_y - radius_y);
                            canvas.bezierCurveTo(point2_x + o.x, point2_y - radius_y, point2_x + radius_x, point2_y - o.y, point2_x + radius_x, point2_y);
                            canvas.bezierCurveTo(point2_x + radius_x, point2_y + o.y, point2_x + o.x, point2_y + radius_y, point2_x, point2_y + radius_y);
                            canvas.bezierCurveTo(point2_x - o.x, point2_y + radius_y, point2_x - radius_x, point2_y + o.y, point2_x - radius_x, point2_y);
                        }else{
                            var angle = this.getToward();
                            var sindix = Math.sin(angle/180*Math.PI)*10;
                            var cosdix = Math.cos(angle/180*Math.PI)*10;
                            if(this.start.x<=this.end.x || this.start.y ==this.end.y){
                                canvas.moveTo(this.start.x + sindix - cosdix,this.start.y - cosdix - sindix);
                                canvas.lineTo(this.end.x + sindix + cosdix,this.end.y - cosdix + sindix);
                                
                                canvas.moveTo(this.start.x - sindix + cosdix,this.start.y + cosdix + sindix);
                                canvas.lineTo(this.end.x - sindix - cosdix,this.end.y + cosdix - sindix);
                            }else{
                                canvas.moveTo(this.start.x + cosdix - sindix,this.start.y - sindix - cosdix);
                                canvas.lineTo(this.end.x + cosdix + sindix,this.end.y - sindix + cosdix);
                                
                                canvas.moveTo(this.start.x - cosdix + sindix,this.start.y + sindix + cosdix);
                                canvas.lineTo(this.end.x - cosdix - sindix,this.end.y + sindix - cosdix);
                            }
                        }
                        
                        // Do stroke
                        if (this.strokeWidth > 0) {
                            canvas.lineWidth = this.strokeWidth;
                            canvas.strokeStyle = this.strokeColor;
                            canvas.stroke();
                            
                            canvas.fillStyle = this.strokeColor;
                            canvas.fill();
                        }
                        
                        canvas.closePath();
                        // console.log("sin180:"+ Math.sin(180/180*Math.PI));
                        
                    },
                    
                    setLineWall : function(){
                        this.lineWall = !this.lineWall;
                    },
                    
                    // 计算朝向,此方向角度是按顺时针方向计的
                    getToward : function(){ 
                        var xdis = this.end.x - this.start.x;
                        var ydis = this.end.y - this.start.y;
                        var dis = Math.sqrt(xdis * xdis + ydis * ydis);
                        var angle = Math.asin(ydis / dis);
                        var angle2 = angle/Math.PI * 180;
                        if(this.end.x < this.start.x){
                            if(this.end.y < this.start.y){
                                angle2 = angle2 - 90;
                            }else{
                                if(this.end.y > this.start.y){
                                    angle2 = angle2 + 90;
                                }else{
                                    angle2 = angle2 + 180;
                                }
                            }
                        }
                        return angle2;
                    },
                    
                    accept : function(visitor){
                        visitor.visit(this);
                        if(this.children.length > 0){
                            for(var i=0;i<this.children.length;i++){
                                this.children[i].accept(visitor);
                            }
                        }
                    },
                    
                    setChildCanSelect : function(value){
                        var sccsVisitor = new setChildCanSelectVisitor(value);
                        if(this.children.length > 0){
                            for(var i=0;i<this.children.length;i++){
                                this.children[i].accept(sccsVisitor);
                            }
                        }
                    },
                }, settings);
                
            };
            oCanvas.registerDisplayObject("wall", constructor);
		},
       
	});		
	return registerWall;
});