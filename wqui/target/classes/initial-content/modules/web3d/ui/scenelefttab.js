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
define("web3d/ui/scenelefttab",
    [		
		"web3d/ui/initSceneList",
		"web3d/ui/initMyViewlist"
	],
	function(initSceneList,initMyViewlist){
		return dojo.declare([],{
			// 构造函数
					constructor : function(layoutRoot){	   					
					new initSceneList(dojo.byId('tcpMyScene'));				
					new initMyViewlist(dojo.byId('tcpMyView'));	
			
			}
		});
	}
);