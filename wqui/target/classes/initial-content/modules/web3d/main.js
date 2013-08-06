/* 
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

// 3d 的入口文件 

x3dom.Runtime.prototype.ready = function(){
	//我们全部的功能列表支持都是从场景的x3d标签开始的。我们会为其扩展一个属性_sp_actions[]数组。下标为action的名称。
	var x3d = document.getElementById("_sp_x3d_main_tag");
	if(!x3d._sp_actions)
		x3d._sp_actions = {};

	//init x3d width and height
	x3dom.Viewarea._width  =  (x3d.getAttribute("width").split("px")[0]).valueOf();
	x3dom.Viewarea._height   =  (x3d.getAttribute("height").split("px")[0]).valueOf();
	
	var addAction = function(name,classdefine){
		//采用可读名称，以方便后续使用。
		//if(!x3d._sp_actions[classdefine._meta.ctor])
		//	x3d._sp_actions[classdefine._meta.ctor] = new classdefine(x3d);
		if(!x3d._sp_actions[name])
			x3d._sp_actions[name] = new classdefine(x3d);
	};
	
	//update globla viewarea obj
	Spolo.viewarea = x3dom.Viewarea;
	
	//添加action类
	require([
		"web3d/action/shortcut3d",
		"web3d/action/view",
		"web3d/action/mouseSelector",
		"web3d/action/child",
		"web3d/action/linearedit",
		"web3d/action/modelListManager",
		"web3d/action/cameraActionManager",
		"web3d/node/grid",
		"web3d/node/coorBar",
		"web3d/ui/toolbar2",
		"web3d/action/moduleActionManager"
		], 
		function(shortcut3d,view,mouseSelector,child,linearedit,modelListManager,cameraActionManager,grid,coorBar,toolbar2,moduleActionManager){
			addAction("shortcut3d",shortcut3d);
			addAction("view",view);
			addAction("mouseSelector",mouseSelector);
			addAction("child",child);
			addAction("linearedit",linearedit);
			// addAction("render",render);
			addAction("modelListManager",modelListManager);	// 模型列表管理模块 #950
			addAction("cameraActionManager",cameraActionManager);
			addAction("grid",grid);
			addAction("coorBar",coorBar);
			addAction("toolbar2",toolbar2);	// 场景名称显示、重命名的Action
			addAction("moduleActionManager",moduleActionManager);	// 加载摄像机管理器
			//TODO: 下面代码演示了如何建立初始事件关注。
			Spolo.cmdmap["onKeyPress_z"] = "view/showall";
	});
}
