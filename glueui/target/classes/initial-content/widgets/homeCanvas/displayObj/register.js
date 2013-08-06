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

define("widgets/homeCanvas/displayObj/register",[
        "widgets/homeCanvas/displayObj/registerRoot",
        "widgets/homeCanvas/displayObj/registerRoom",
        "widgets/homeCanvas/displayObj/registerWall",
        "widgets/homeCanvas/displayObj/registerWindow",
        "widgets/homeCanvas/displayObj/registerDoor",
    ],function(registerRoot,registerRoom,registerWall,registerWindow,registerDoor){
    
    var register = dojo.declare([],{
        
		constructor : function(){
            new registerRoot();
            new registerRoom();
            new registerWall();
            new registerWindow();
            new registerDoor();
		},
       
	});		
	return register;
});