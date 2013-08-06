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
 
define("spolo/data/scene/item",
[
	"dojo/_base/declare", 
	"dojo/request/xhr"
],
function(
	declare, 
	xhr
)
{
	return declare("spolo.data.scene.item", [], {
		/** 我们直接在json对象的基础上修改json对象.
		*/
		constructor : function(json,scene)
		{
			this.data = json;
			this.scene = scene;
		},
		getScene : function()
		{
			return this.scene;
		},
		getType : function()
		{
			return this.data.type;
		},
		getName : function() {
			return this.data.name;
		},
		isDirty : function(){
			return this.scene.isItemDirty(this.data);
		},
		setName : function(name) {
			this.data.name = name;
			this.scene.markItemDirty(this.data);
		}
	});	
})