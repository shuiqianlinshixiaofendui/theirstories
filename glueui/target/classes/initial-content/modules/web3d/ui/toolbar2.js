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
// Tooltip 操作事件 
define("web3d/ui/toolbar2",
    [	
		"dojo/dom",
		"web3d/ui/initToolbar"
		
	],
	function(dom,initToolbar){
		return dojo.declare([],{
			// 构造函数
			constructor : function(layoutRoot){	   					
				new initToolbar(dom.byId('layout_head'));
			
			}
		});
	}
);