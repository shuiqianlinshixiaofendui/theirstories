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

var Spolo;

// start spolo code scope
(function() {
    // 鼠标是否选中模型
    Spolo.isMouseInModel = null;
    // 选中模型对象
    Spolo.selectedObj = null;
    // 摄像机对象
    Spolo.viewarea = null;
    // 设置全局加载变量
    Spolo.loadLib = null;
	// MESH
	Spolo.mesh = null;
	//上一次选中模型的对象
	Spolo.oldSelectedObj = null;
    // 操作类型，摄像机"1"或者模型"2" 
    Spolo.operateState = 1;
    // 模型操作类型，1是自由模式，2是坐标系模式
    Spolo.modelOperateState = 1;
    // 坐标系模式操作类型
    Spolo.modelCoordinateOperateState = 1;
    // 选中的地板或墙
    Spolo.ModuleContainer = null;
    // 浏览页面旋转中心位置
    Spolo.capPosition = new x3dom.fields.SFVec3f(0,0,0);
    // 编辑页面旋转中心位置
    Spolo.capPositionEdit = new x3dom.fields.SFVec3f(0,0,0);
    // 物理系统
    Spolo.dynamicsSys = null;
    // x3dom引擎对象
    Spolo.x3domPhysi ;
    // x3dom引擎是否开启
    Spolo.x3domPhysiOpen ;
    // 
    Spolo.x3domPhysiRemove ;
})();