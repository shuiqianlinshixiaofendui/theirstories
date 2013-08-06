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

define("widgets/homeCanvas/visitor/deleteVisitor/deleteVisitor",["dojo/topic"],function(topic){
	var deleteFun = function(){
        if(!Spolo.isHaveOne){
            this.remove();
            Spolo.canvas.redraw();
            Spolo.isHaveOne = true;
        }
    };
    
    var deleteVisitor = dojo.declare([],{
        canvas : Spolo.canvas,
        parentID : "",
		constructor : function(){
           Spolo.root.bind("mouseup",function(){
                Spolo.isHaveOne = false;
            });
		},
        
        visit : function(accepter){
            switch(accepter.type){
                case "root" :   break;
                case "room" :   break;
                default : accepter.bind("click", deleteFun);
            }
        },
       
	});		
	return deleteVisitor;
});