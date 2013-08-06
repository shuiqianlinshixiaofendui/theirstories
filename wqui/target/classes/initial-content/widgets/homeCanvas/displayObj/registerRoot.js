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

define("widgets/homeCanvas/displayObj/registerRoot",["dojo/topic"],function(topic){
	
    
    var registerRoot = dojo.declare([],{
        
		constructor : function(){
            var constructor = function (settings, core) {
            
                return oCanvas.extend({
                    core: core,
                    
                    accept : function(visitor){
                        visitor.visit(this);
                        if(this.children.length > 0){
                            for(var i=0;i<this.children.length;i++){
                                this.children[i].accept(visitor);
                            }
                        }
                    }
                }, settings);
                
            };
            oCanvas.registerDisplayObject("root", constructor);
		},
       
	});		
	return registerRoot;
});