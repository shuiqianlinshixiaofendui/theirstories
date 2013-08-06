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

define("widgets/homeCanvas/displayObj/registerDoor",["widgets/homeCanvas/visitor/setChildCanSelectVisitor/setChildCanSelectVisitor"],function(setChildCanSelectVisitor){
    var registerDoor = dojo.declare([],{
		constructor : function(){
            var constructor = function (settings, core) {
            
                return oCanvas.extend({
                    core: core,
                    direction : "clockwise",
                    childCanSelect : true,
                    isPointerInside : function(pointerObject){
                        var pointer = core.tools.transformPointerPosition(this, this.abs_x + this.width/2, this.abs_y, 0, pointerObject);
                        var D = Math.sqrt(Math.pow(pointer.x - (this.abs_x + this.width/2), 2) + Math.pow(pointer.y - this.abs_y, 2));
                        var x0 = pointer.x;
                        var y0 = pointer.y;
                        var x1 = this.abs_x - this.width/2;
                        var y1 = this.abs_y;
                        var x2 = this.abs_x + this.width/2;
                        var y2 = this.abs_y - this.width;
                        var minX = x1 > x2 ? x2 : x1;
                        var maxX = x1 < x2 ? x2 : x1;
                        var minY = y1 > y2 ? y2 : y1;
                        var maxY = y1 < y2 ? y2 : y1;
                        var flag = (x0>minX-3 && maxX+3>x0 && y0>minY-3 && maxY+3>y0);
                        if(this.childCanSelect){
                            return ((D < this.width) && flag);
                        }else{
                            return false;
                        }
                        
                    },
                    
                    draw : function(){
                        var canvas = core.canvas;
                        canvas.beginPath();
                        
                        var start = 180;
                        var end = -90;
                        canvas.arc(this.abs_x + this.width/2, this.abs_y, this.width, start * Math.PI / 180, end * Math.PI / 180, (this.direction === "anticlockwise"));
                        canvas.moveTo(this.abs_x + this.width/2,this.abs_y - this.width);
                        canvas.lineTo(this.abs_x + this.width/2,this.abs_y);
                        
                        // Do stroke
                        if (this.strokeWidth > 0) {
                            canvas.lineWidth = this.strokeWidth;
                            canvas.strokeStyle = this.strokeColor;
                            canvas.stroke();
                            
                        }
                        this.rotation = this.parent.getToward();
                        canvas.closePath();
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
            oCanvas.registerDisplayObject("door", constructor);
		},
       
	});		
	return registerDoor;
});