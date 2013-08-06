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


/** @brief scene是管理场景的action.使用方法类似于在models/show.esp中使用switcher——甚至更简单。两行：
 <code>
	var scene_event_action;
	require([""spolo/action/scene"],function(sceneAction){
		scene_event_action = new sceneAction();
		scene_event_action.onadd();
	}
 </code>
 以上代码就是scene/show.esp中所需要的全部代码!


**/

define("web3d/action/scene",["web3d/action/event","web3d/action/switcher"],
	function(evtcls){
		return dojo.declare([evtcls,switchercls],{
			constructor : function(args){
				//聚合一个switcher.
				this.switcher = new switchercls();
				this.onDocumentMouseDown = dojo.hitch(this,this.__onDocumentMouseDown);
			},
			__onDocumentMouseDown : function(e)
			{
				//这里遍历spolo.scene来获取当前命中的对象。并调用this.switcher.setgrabber()来设置命中的对象。
				//注意，你不需要考虑模式(pane,scale,rotate)问题。所以，就是这些代码，不应该超过100行的——除非需求增加。
				//另外，因为要通知pane.js你这里处理了鼠标事件，需要设置一个全局变量(spolo名称空间)，up/out时清除。这部分可以遇到时再说。
			},
			onadd : function()
			{//action被激活，添加onmousedown事件。
				this.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
			}
		});				
	}
);

