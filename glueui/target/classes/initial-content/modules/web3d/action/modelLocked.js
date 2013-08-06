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
	帖子：#939
*/

/*负责模型的锁定和解锁。*/

define("web3d/action/modelLocked",["dojo/topic","dojo/_base/xhr"],
	function(topic,xhr){
		return dojo.declare([],{
			constructor : function(x3d)
			{
				// 用来修改jcr中的属性
				var modifyModelLocked = function(baseURI,value){
					xhr.post({
						url: baseURI + ".json",
						load: function(data) {
						},
						error: function(err) {
							console.log("error:", err);
						},
						content:{
							"_charset_":"UTF-8",
							"islocked":value
						}
					});
				}
				// 模型锁定
				topic.subscribe("modelLocked/locked", function(def){		// 2D部分只需要publish一会即可
					//通过dojo维护transform中的islocked
					var sceneChild = x3d.firstElementChild.children ;	// scene下的transform 
					for(var i = 0 ; i < sceneChild.length ; i ++){
						var nodeName = sceneChild[i].nodeName ;
						if(nodeName == "TRANSFORM"){
							var trans_def = sceneChild[i].getAttribute("DEF") ; // 仍然存在潜在bug。
							if(trans_def == def){
								var trans_baseURI = sceneChild[i].getAttribute("baseURI") ;
								var trans_locked = sceneChild[i].getAttribute("islocked") ;
								if(typeof(trans_locked)=="" || trans_locked == null || trans_locked == "true"){
									sceneChild[i].setAttribute("islocked","false") ;	// 同时需要修改DOM中的值
									modifyModelLocked(trans_baseURI,"false") ;
								}else if(trans_locked == "false"){
									sceneChild[i].setAttribute("islocked",true) ;
									modifyModelLocked(trans_baseURI,"true") ;
								}
								
							}
						}
					}
					
				});
			}
		});
	}
);

