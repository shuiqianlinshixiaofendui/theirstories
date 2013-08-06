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

define("widgets/homeCanvas/visitor/setChildCanSelectVisitor/setChildCanSelectVisitor",["dojo/topic"],function(topic){
    
    var setChildCanSelectVisitor = dojo.declare([],{
		constructor : function(value){
           this.flag = value;
		},
        
        visit : function(accepter){
            if(accepter.childCanSelect != "undefined"){
                accepter.childCanSelect = this.flag;
            }
        },
       
	});		
	return setChildCanSelectVisitor;
});