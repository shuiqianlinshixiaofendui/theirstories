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

define("widgets/homeCanvas/visitor/createVisitor/createVisitor",
    ["widgets/homeCanvas/visitor/getNodeByIDVisitor/getNodeByIDVisitor"],
    function(GetNodeByIDVisitor){
	
    var createVisitor = dojo.declare([],{
        canvas : Spolo.canvas,
		constructor : function(){
            
		},
        
        visit : function(accepter){
            var parent;
            var getNodeByIDVisitor = new GetNodeByIDVisitor();
            
            if(accepter.parent){
                getNodeByIDVisitor.setParentID(accepter.parent);
                Spolo.root.accept(getNodeByIDVisitor);
                parent = Spolo.currentObj;
            }else{
                parent = Spolo.root;
            }

            switch(accepter.type){
                case "root" :   var root = canvas.display.root({
                                    objid : accepter.id,
                                });
                                canvas.addChild(root);
                                Spolo.root = root;
                                break;
                                
                case "room" :   var room = canvas.display.room({
                                    objid : accepter.id,
                                    roomtype : accepter.roomtype,
                                });
                                parent.addChild(room);
                                break;
                                
                case "wall" :   var wall = canvas.display.wall({
                                    objid : accepter.id,
                                    start : {x:accepter.start[0],y:accepter.start[1]},
                                    end : {x:accepter.end[0],y:accepter.end[1]},
                                    stroke: "3px #0aa",
                                    cap: "round"
                                });
                                parent.addChild(wall);
                                break;
                                
                case "window" : var window = canvas.display.window({
                                    objid : accepter.id,
                                    x : accepter.center[0],
                                    y : accepter.center[1],
                                    width : accepter.width,
                                    stroke: "3px #0aa",
                                    cap: "round"
                                });
                                parent.addChild(window);
                                break;
                                
                case "door" :   var door = canvas.display.door({
                                    objid : accepter.id,
                                    x : accepter.center[0],
                                    y : accepter.center[1],
                                    width : accepter.width,
                                    stroke: "3px #0aa",
                                });
                                parent.addChild(door);
                                break;
            }
        },
       
	});		
	return createVisitor;
});