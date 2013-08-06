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

define("widgets/homeCanvas/displayObj/registerWindow",["widgets/homeCanvas/visitor/setChildCanSelectVisitor/setChildCanSelectVisitor"],function(setChildCanSelectVisitor){
    var registerWindow = dojo.declare([],{
		constructor : function(){
            var constructor = function (settings, core) {
            
                return oCanvas.extend({
                    core: core,
                    deep : 20,
                    childCanSelect : true,
                    isPointerInside : function(pointerObject){
                        var xx = this.abs_x - 0.5*this.width ; 
                        var yy = this.abs_y - 0.5*this.deep ; 
                        var pointer = core.tools.transformPointerPosition(this, xx, yy, 0, pointerObject),
                            stroke = (this.strokePosition === "outside") ? this.strokeWidth : ((this.strokePosition === "center") ? this.strokeWidth / 2 : 0);

                        var f = ((pointer.x > xx - this.origin.x - stroke) && (pointer.x < xx + this.width - this.origin.x + stroke) && (pointer.y > yy - this.origin.y - stroke) && (pointer.y < yy + this.deep - this.origin.y + stroke));
                        if(this.childCanSelect){
                            return f;
                        }else{
                            return false;
                        }
                    },
                    
                    draw : function(){
                        var canvas = core.canvas;
                        
                        
                        canvas.beginPath();
                        // Do background
                        canvas.fillStyle = canvas.fillStyle;
                        canvas.fillRect(this.abs_x - 0.5*this.width  , this.abs_y - 0.5*this.deep  , this.width, this.deep);
                        
                        // 中间线
                        var start = [this.abs_x - 0.5*this.width,this.abs_y];
                        var end = [this.abs_x + 0.5*this.width,this.abs_y];
                        canvas.moveTo(start[0],start[1]);
                        canvas.lineTo(end[0],end[1]);

                        canvas.lineWidth = this.strokeWidth;
                        canvas.strokeStyle = this.strokeColor;
                        canvas.stroke();
                        
                        // Do stroke
                        if (this.strokeWidth > 0) {
                            canvas.lineWidth = this.strokeWidth;
                            canvas.strokeStyle = this.strokeColor;
                            canvas.strokeRect(this.abs_x - 0.5*this.width  , this.abs_y - 0.5*this.deep  , this.width, this.deep);
                            canvas.stroke();
                            
                            canvas.fillStyle = this.strokeColor;
                            canvas.fill();
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
            oCanvas.registerDisplayObject("window", constructor);
		},
       
	});		
	return registerWindow;
});