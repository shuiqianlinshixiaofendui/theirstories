/** 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/

/** 
	模型高亮
	帖子：#941
*/

/*负责模型的隐藏和显示。*/

define("web3d/action/modelHiden",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d)
			{
				// 模型隐藏
				topic.subscribe("modelHiden/hiden", function(def){	
					var sceneChild = x3d.firstElementChild.children ;	// scene下的transform 
					for(var i = 0 ; i < sceneChild.length ; i ++){
						var nodeName = sceneChild[i].nodeName ;
						if(nodeName == "TRANSFORM"){
							var trans_def = sceneChild[i].getAttribute("DEF") ; // 仍然存在潜在bug。
							if(trans_def == def){
								var trans_render = sceneChild[i].getAttribute("render") ;
								if(typeof(trans_render)=="" || trans_render == null || trans_render == "true"){
									sceneChild[i].setAttribute("render","false") ;	
								}else if(trans_render == "false"){
									sceneChild[i].setAttribute("render","true") ;
								}
								
							}
						}
					}
					
				});
			}
		});
	}
);

