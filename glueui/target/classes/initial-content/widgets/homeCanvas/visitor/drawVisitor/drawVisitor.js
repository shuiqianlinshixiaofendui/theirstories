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

define("widgets/homeCanvas/visitor/drawVisitor/drawVisitor",
    ["dojo/topic"],
    function(topic){
	
    var getNearPoint = function(line){
        var x1 = line.start.x;
        var x2 = line.end.x;
        var y1 = line.start.y;
        var y2 = line.end.y;
        if(x1!=x2 && y1!=y2){
            var b = canvas.mouse.y+(x2-x1)/(y2-y1)*canvas.mouse.x;
            var x = (b+(y2-y1)*x1/(x2-x1)-y1)/((y2-y1)/(x2-x1)+(x2-x1)/(y2-y1));
            var y = b-(x2-x1)/(y2-y1)*x;
        }else{
            if(x1==x2){
                var x=x1;
                var y=canvas.mouse.y;
            }else{
                var x=canvas.mouse.x;
                var y=y1;
            }
        }
        return [x,y];
    };
        
    var drawVisitor = dojo.declare([],{
        canvas : Spolo.canvas,
        drawOperate : "",
        haveOneWall : false,
		constructor : function(){
            
		},
        
        
        visit : function(accepter){
            switch(drawOperate){
                case "door" :   if(accepter.type == "wall"){
                                    accepter.setChildCanSelect(false);
                                    accepter.bind("click", function(){
                                        var nearPoint = getNearPoint(this);
                                        var door = canvas.display.door({
                                            objid : accepter.objid + "_door" + (accepter.children.length+1),
                                            x : nearPoint[0],
                                            y : nearPoint[1],
                                            width : 50,
                                            stroke: "3px #0aa",
                                            rotation : accepter.getToward(),
                                        });
                                        this.addChild(door);
                                    });
                                }
                                break;
                case "window" : if(accepter.type == "wall"){
                                    accepter.setChildCanSelect(false);
                                    accepter.bind("click", function(){
                                        var nearPoint = getNearPoint(this);
                                        var window = canvas.display.window({
                                            objid : accepter.objid + "_window" + (accepter.children.length+1),
                                            x : nearPoint[0],
                                            y : nearPoint[1],
                                            width : 50,
                                            stroke: "3px #0aa",
                                            rotation : accepter.getToward(),
                                        });
                                        this.addChild(window);
                                    });
                                }
                                break;
                case "wall" :   if(accepter.type == "room"){
                                    accepter.setChildCanSelect(false);
                                    if(!this.haveOneWall){
                                        require(["widgets/homeCanvas/visitor/drawVisitor/drawWall"], function(drawWall){
                                            new drawWall();
                                        });
                                        this.haveOneWall = true;
                                    }
                                }
                                break;
            }
        },
        
        setDrawOperate : function(value){
            drawOperate = value;
        },
       
	});		
	return drawVisitor;
});