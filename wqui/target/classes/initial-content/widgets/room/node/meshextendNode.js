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

define("widgets/room/node/meshextendNode", [],function(){
	return dojo.declare([],{
        constructor : function(){
            x3dom.nodeTypes.Transform.prototype.hide = function(flag)
            { 
                this._vf.render = !flag;
                this._xmlNode.setAttribute("render",!flag);
            };
        },
		unload : function(){}
    });
})