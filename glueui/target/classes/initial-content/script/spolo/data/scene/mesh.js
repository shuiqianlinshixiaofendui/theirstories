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
 
define("spolo/data/scene/mesh",
[
	"dojo/_base/declare", 
	"spolo/data/scene/item"
],
function(
	declare, 
	item
)
{
	return declare("spolo.data.scene.mesh", [item], {
		/** 我们直接在json对象的基础上修改json对象.
		*/
		constructor : function()
		{
		},
		getName : function() {
			return this.data.name;
		},
		getLocation : function() {
			return this.data.location;
		},
		
		getRotation : function() {
			return this.data.rotation_axis_angle;
		},
		
		getScale :function() {
			return this.data.scale;
		}
	});	
})