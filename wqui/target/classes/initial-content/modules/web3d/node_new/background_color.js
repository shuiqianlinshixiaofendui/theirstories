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
	添加backgroud节点，设置color
*/
define("web3d/node_new/background_color",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
					var	parent = x3d.runtime.canvas.doc._viewarea._scene;
					
					var bg = document.createElement('Background');
					bg.setAttribute("skyColor",0+" "+0+" "+0);

					parent._xmlNode.appendChild(bg);
					
					
			}, 
		});
	}
);
