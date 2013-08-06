/**  *  This file is part of the UGE(Uniform Game Engine). *  Copyright (C) by SanPolo Co.Ltd. *  All rights reserved. * *  See http://uge.spolo.org/ for more information. * *  SanPolo Co.Ltd *  http://uge.spolo.org/ *  Any copyright issues, please contact: copr@spolo.org*//** 	模型操作入口	moduleActionManager,主要功能，管理场景中所有模型操作节点node*/define("web3d/action/moduleActionManager",["dojo/topic"],function(topic){	// currentAction,将new出来的所有摄像机子类都保存到数组中，保证不重复创建	var currentAction = [] ;	function addAction(name,classdefine,x3d){		//采用可读名称，以方便后续使用。		if(!currentAction[name]){			currentAction[name] = new classdefine(x3d);			currentAction.push(name);		}	};		var moduleActionManager = dojo.declare([],{		// 当 moduleActionManager 被初始化时，将所有 module 操作模块都require进来		constructor : function(x3d){			//添加action类			/*			require([				"web3d/node/dragger_new","web3d/action/axisManager"],				function(dragger_new,axisManager){					addAction("dragger_new",dragger_new,x3d);					addAction("axisManager",axisManager,x3d);			});			*/						var cthis = this;			// 当用户在页面上选择“模型操作”时，加载dragger_new方法			topic.subscribe("toolbar/camera/locked",function(){				require(["web3d/node/dragger_new"], function(dragger_new){					addAction("dragger_new",dragger_new,x3d);				});			});			// topic.subscribe("toolbar/model/selectModeFree",function(num){				// if(num == 2){					require(["web3d/action/axisManager"], function(axisManager){						addAction("axisManager",axisManager,x3d);					});				// }			// });								}		});	return moduleActionManager; });