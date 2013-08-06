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

define("widgets/homeCanvas/visitor/getNodeByIDVisitor/getNodeByIDVisitor",["dojo/topic"],function(topic){
	
    var getNodeByIDVisitor = dojo.declare([],{
        canvas : Spolo.canvas,
        parentID : "",
		constructor : function(){
            
		},
        
        visit : function(accepter){
            if(accepter.objid == parentID){
                Spolo.currentObj = accepter;
            }
            
        },
        
        setParentID : function(arg){
            parentID = arg;
        },
       
	});		
	return getNodeByIDVisitor;
});