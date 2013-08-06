/**  *  This file is part of the UGE(Uniform Game Engine). *  Copyright (C) by SanPolo Co.Ltd. *  All rights reserved. * *  See http://uge.spolo.org/ for more information. * *  SanPolo Co.Ltd *  http://uge.spolo.org/ *  Any copyright issues, please contact: copr@spolo.org*//** 	摄像机操作入口	cameraActionManager,主要功能，将所有摄像机操作都require进来*/define("web3d/action/cameraActionManager",["dojo/topic"],function(topic){	// currentAction,将new出来的所有摄像机子类都保存到数组中，保证不重复创建	var currentAction = [] ;	function addAction(name,classdefine,x3d){		//采用可读名称，以方便后续使用。		if(!currentAction[name]){			currentAction[name] = new classdefine(x3d);			currentAction.push(name);		}	};		var cameraActionManager = dojo.declare([],{		// 当cameraActionManager被初始化时，将所有camera操作模块都require进来		constructor : function(x3d){			//添加action类			/*			require([				"web3d/node/cameraOperate_mrs",				"web3d/node/cameraOperate",				"web3d/node/cameraOperate_amplify",				"web3d/node/cameraAssisPoint"],				function(cameraOperate_mrs,cameraOperate,cameraOperate_amplify,cameraAssisPoint){					addAction("cameraOperate_mrs",cameraOperate_mrs,x3d);					addAction("cameraOperate",cameraOperate,x3d);					addAction("cameraOperate_amplify",cameraOperate_amplify,x3d);					addAction("cameraAssisPoint",cameraAssisPoint,x3d);			});*/									var cthis = this;			topic.subscribe("toolbar/camera/locked",function(state){				if(!state){					require(["web3d/node/cameraOperate_mrs",							 "web3d/node/cameraOperate_amplify",							 "web3d/node/cameraAssisPoint",							 "web3d/node/cameraOperate_aroundObj"], 							 function(cameraOperate_mrs,cameraOperate_amplify,cameraAssisPoint,cameraOperate_aroundObj){								addAction("cameraOperate_mrs",cameraOperate_mrs,x3d);								addAction("cameraOperate_amplify",cameraOperate_amplify,x3d);								addAction("cameraAssisPoint",cameraAssisPoint,x3d);								addAction("cameraOperate_aroundObj",cameraOperate_aroundObj,x3d);							}					);				}							});			topic.subscribe("toolbar/camera/viewchange",function(){				console.log( "clc" )				require(["web3d/node/cameraOperate"], function(cameraOperate){					addAction("cameraOperate",cameraOperate,x3d);				});							});		}		});	return cameraActionManager; });