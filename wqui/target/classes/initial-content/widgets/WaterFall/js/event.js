/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 

define("widgets/WaterFall/js/eventEmit",
[
    "dojo/dom",
    "dojo/_base/declare"
    
],
function(
	dom,declare
)
{

    var eventEmit = declare([], {
        
       
        
        constructor : function(){
            /*
            this.emit("ImageClick",function(){
                clssName = query(".picList");
                clssName.on("click",function(){
                    var list = query(this).children("div").children();
                    var message = list.innerHTML();
                });
                
                return message;
            });
            */
		}
        
       
        
                
	});
	
	return eventEmit;
});