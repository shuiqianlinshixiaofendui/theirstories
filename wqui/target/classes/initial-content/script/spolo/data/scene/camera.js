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
 
define("spolo/data/scene/camera",
[
	"dojo/_base/declare", 
	"spolo/data/scene/item"
],
function(
	declare, 
	item
)
{
	return declare("spolo.data.scene.camera", [item], {
		/** 我们直接在json对象的基础上修改json对象.
		*/
		constructor : function()
		{
		},
		getName : function() {
			return this.data.name;
		},
		getCenterOfRotation : function() {
			return this.data.centerOfRotation;
		},
		
		getPosition : function() {
			return this.data.position;
		},
		
		getOrientation :function() {
			return this.data.orientation;
		},
		
		getFieldOfView	: function() {
			return this.data.fieldOfView;
		},
		
		getDescription : function()	{
			return this.data.description;
		},
		setRenderSelected : function(){
			this.data.select = 1;
			this.scene.markItemDirty(this.data);
		}
		
	});	
})