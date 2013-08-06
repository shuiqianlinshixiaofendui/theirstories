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

define("widgets/homeCanvas/visitor/setLineWallVisitor/setLineWallVisitor",["dojo/topic"],function(topic){
	
    var setLineWallVisitor = dojo.declare([],{
    
		constructor : function(){
          
		},
        
        visit : function(accepter){
            if(accepter.type == "wall"){
                accepter.setLineWall();
                
            }
        },
       
	});		
	return setLineWallVisitor;
});