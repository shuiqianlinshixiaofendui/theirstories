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

define("widgets/homeCanvas/visitor/selectVisitor/selectVisitor",["dojo/topic"],function(topic){

    var changeColor = function(){
        if(!Spolo.isHaveOne){
            this.stroke = "3px #f00";
            Spolo.currentObj = this;
            this.redraw();
            Spolo.isHaveOne = true;
        }
    };
    
    var selectVisitor = dojo.declare([],{
        canvas : Spolo.canvas,
        parentID : "",
		constructor : function(){
            var lastObj = null;
            Spolo.root.bind("mousedown",function(){
            if(lastObj){
                if(lastObj != Spolo.currentObj){
                    lastObj.stroke = "3px #0aa";
                    lastObj.redraw();
                    lastObj = Spolo.currentObj ;
                }
            }else{
                lastObj = Spolo.currentObj;
            }
            });
            
            Spolo.root.bind("mouseup",function(){
                Spolo.isHaveOne = false;
            });
		},
        
        visit : function(accepter){
            switch(accepter.type){
                case "root" :   break;
                case "room" :   break;
                default : accepter.bind("mousedown", changeColor);
            }
        },
       
	});		
	return selectVisitor;
});