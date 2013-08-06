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
	dragger_new 文件主要管理模型平移 旋转 缩放操作
	
*/
define("web3d/operate/operate_freeModule",["dojo/topic", "web3d/node_new/selectModuleState"],function(topic, selectModuleState){
	
	//XXX 需要获得runtime对象获取变换矩阵与对摄像机控制
	var x3d = document.getElementById("_sp_x3d_main_tag");
	var model_oprate_state = 0;
	var MODEL_TRANSLATE = 0;
	var MODEL_ROTATE_PROJECTPLANE = 1;
	var MODEL_ROTATE_ITSELF = 2;
	var MODEL_SCALE = 3;
	var SCREEN_2D_X = 0;
	var SCREEN_2D_Y = 0;
	//模型缩放用全局变量
	var LAST_LENGTH = 0;
	var TRANS_SCEEN_X = 0;
	var TRANS_SCEEN_y = 0;
	//模型平移用全局变量
	var DRAG_POS;
	var DRAG_OFFSET;
	var _LASTMOUSEX = 0;
	var _LASTMOUSEY = 0;
	var _Sylb = null;
	//模型旋转的旋转轴定义 X=1，y=2，z=3
	var model_rotate_state = 1;
	var selectModuleS = null;
	
	
	var mouseState = false;
	
	/**
		模型平移
	*/
	function modelTranslate(x, y){
		if(Spolo.selectedObj){
			var pos = DRAG_POS;
			var _intersect_pos_inCC = Spolo.viewarea.projectVector(pos);
			
			var _Mouse3D = new x3dom.fields.SFVec3f( (x / Spolo.viewarea._width) * 2 - 1,
												-(y / Spolo.viewarea._height) * 2 + 1,
												_intersect_pos_inCC.z);
			//console.log("model translate _Mouse3D : " + _Mouse3D);
			
			//先把坐标系换算为世界坐标系。
			var pos_WC = Spolo.viewarea.unprojectVector(_Mouse3D);
			//减去模型中心点和鼠标点击位置的偏差
			pos_WC = pos_WC.add(DRAG_OFFSET);
			//change to LC 
			Spolo.selectedObj.moveTo_WC(pos_WC);		
			//selectModuleS.selectedMove();
		}
	};
	
	/**
	 * 围绕物体自身坐标系旋转
	 * param : x -- 鼠标当前二维坐标x值。
	 * param : y -- 鼠标当前二维坐标y值。
	 */
	function modelRotateItself(x, y){
		var viewarea = Spolo.viewarea;
		var selectedObj = Spolo.selectedObj;

		// var dx = x - viewarea._lastX;
		// var dy = y - viewarea._lastY;
		if (selectedObj)
		{
			// var alpha = (dy * 2 * Math.PI) / viewarea._width;
			// var beta = (dx * 2 * Math.PI) / viewarea._height;
		
	
			// var axis_x = new x3dom.fields.SFVec3f(0,1,0);
			// var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
			// axis_x = cctowc.multMatrixVec(axis_x);
			// axis_x = selectedObj.getCurrentTransform().inverse().multMatrixVec(axis_x);
			// selectedObj.localRotate(axis_x,beta);
			
			// var axis_y = new x3dom.fields.SFVec3f(1,0,0);
			// axis_y = cctowc.multMatrixVec(axis_y);
			// axis_y = selectedObj.getCurrentTransform().inverse().multMatrixVec(axis_y);
			// selectedObj.localRotate(axis_y,alpha);
			
			var rotY = ((x - _LASTMOUSEX)/ viewarea._width) * 2*Math.PI;
			var rotX = ((y - _LASTMOUSEY)/viewarea._height) * 2*Math.PI;
			
			var axisX = new x3dom.fields.SFVec3f(1,0,0);
			var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
			axisX = cctowc.multMatrixVec(axisX);
			axisX = selectedObj.getCurrentTransform().inverse().multMatrixVec(axisX);
			selectedObj.localRotate(axisX,rotX);
			
			var axisY = new x3dom.fields.SFVec3f(0,1,0);
			var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
			axisY = cctowc.multMatrixVec(axisY);
			axisY = selectedObj.getCurrentTransform().inverse().multMatrixVec(axisY);
			selectedObj.localRotate(axisY,rotY);
		}
			
		

		// viewarea._dx = dx;
		// viewarea._dy = dy;

		// viewarea._lastX = x;
		// viewarea._lastY = y;
	};
	
	//绕X轴旋转 
	function modelRotateX(x,y){
		var viewarea = Spolo.viewarea;
		var selectedObj = Spolo.selectedObj;
		var rotY = ((x - _LASTMOUSEX)/ viewarea._width) * 2*Math.PI;
		var rotX = ((y - _LASTMOUSEY)/viewarea._height) * 2*Math.PI;
		
		var axisX = new x3dom.fields.SFVec3f(1,0,0);
		// var _axisX = axisX;
		// var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
		// axisX = cctowc.multMatrixVec(axisX);
		// axisX = selectedObj.getCurrentTransform().inverse().multMatrixVec(axisX);
		selectedObj.localRotate(axisX,rotX-rotY);
		// selectModuleS.selectedRot(_axisX,rotX-rotY);
	};
	//绕Y轴旋转
	function modelRotateY(x,y){
		var viewarea = Spolo.viewarea;
		var selectedObj = Spolo.selectedObj;
		var rotY = ((x - _LASTMOUSEX)/ viewarea._width) * 2*Math.PI;
		var rotX = ((y - _LASTMOUSEY)/viewarea._height) * 2*Math.PI;
		
		var axisY = new x3dom.fields.SFVec3f(0,1,0);
		// var _axisY = axisY;
		// var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
		// axisY = cctowc.multMatrixVec(axisY);
		// axisY = selectedObj.getCurrentTransform().inverse().multMatrixVec(axisY);
		selectedObj.localRotate(axisY,rotX-rotY);
		// selectModuleS.selectedRot(_axisY, rotX-rotY);
	};
	//绕Z轴旋转
	function modelRotateZ(x,y){
		var viewarea = Spolo.viewarea;
		var selectedObj = Spolo.selectedObj;
		var rotY = ((x - _LASTMOUSEX)/ viewarea._width) * 2*Math.PI;
		var rotX = ((y - _LASTMOUSEY)/viewarea._height) * 2*Math.PI;
		
		var axisZ = new x3dom.fields.SFVec3f(0,0,1);
		// var _axisZ = axisZ;
		// var cctowc = x3d.runtime.getCameraToWorldCoordinatesMatrix();
		// axisZ = cctowc.multMatrixVec(axisZ);
		// axisZ = selectedObj.getCurrentTransform().inverse().multMatrixVec(axisZ);
		selectedObj.localRotate(axisZ,rotX-rotY);
		// selectModuleS.selectedRot(_axisZ,rotX-rotY);
	};
	/**
	 * 围绕投射平面坐标系旋转
	 * param : x -- 鼠标当前二维坐标x值。
	 * param : y -- 鼠标当前二维坐标y值。
	 */
	 
	function modelRotateProjectPlane(x, y){
		// 获取摄像机对象
		var viewarea = Spolo.viewarea;
		var selectedObj = Spolo.selectedObj;
		// 判断是否选中物体对象
		if(selectedObj){
			// console.log("model rotate project plane !!! \n");
			// console.log("model rotate in project plane start !!! \n");
			// 计算旋转弧度
			var rotX = ((_LASTMOUSEX - SCREEN_2D_X) / viewarea._width) * 2 * Math.PI;
			var rotY = ((_LASTMOUSEY - SCREEN_2D_Y) / viewarea._height) * 2 * Math.PI;
			// 旋转轴
			var vector_x = new x3dom.fields.SFVec3f(1, 0, 0);
			var vector_z = new x3dom.fields.SFVec3f(0, 0, -1);
			/**
			 * 将旋转矩阵转成投射平面坐标系
			 * 在投射平面坐标系的旋转轴
			 */
			// 投射平面坐标系的旋转轴
			var projectionMatrix = viewarea.getProjectionMatrix();
			vector_x = projectionMatrix.multMatrixVec(vector_x);
			vector_z = projectionMatrix.multMatrixVec(vector_z);
			// console.log("model rotate in project plane rot vector_x : " + vector_x);
			// console.log("model rotate in project plane rot vector_z : " + vector_z);
			/**
			 * 将投射平面坐标系的旋转矩阵转成世界坐标系的旋转矩阵
			 * 在世界坐标系的旋转轴
			 */
			// 将投射平面的旋转向量转化到世界坐标系下
			var CToWMatrix = x3d.runtime.getCameraToWorldCoordinatesMatrix();
			vector_x = CToWMatrix.multMatrixVec(vector_x);
			vector_z = CToWMatrix.multMatrixVec(vector_z);
			// console.log("model rotate project plane vector_x world : " + vector_x);
			// console.log("model rotate project plane vector_z world : " + vector_z);
			/**
			 * 将世界坐标系下旋转向量转化到模型坐标系
			 * 在世界坐标系的旋转轴
			 */
			vector_x = Spolo.selectedObj.getCurrentTransform().inverse().multMatrixVec(vector_x);
			vector_z = Spolo.selectedObj.getCurrentTransform().inverse().multMatrixVec(vector_z);
			// console.log("model rotate project plane vector_x model : " + vector_x);
			// console.log("model rotate project plane vector_z model : " + vector_z);
			// 设置模型旋转
			Spolo.selectedObj.localRotate(vector_x, rotY);
			Spolo.selectedObj.localRotate(vector_z, rotX);
			// 设置二维鼠标坐标
			SCREEN_2D_X = x;
			SCREEN_2D_Y = y;
			// console.log("model rotate in project plane end !!! \n");
		}
		
	}
	
	
	/**
		模型缩放
	*/
	function modelScale(){
		if(Spolo.selectedObj){
			var dx = SCREEN_2D_X - TRANS_SCEEN_X;
			var dy = SCREEN_2D_Y - TRANS_SCEEN_y;
			var curr_length = Math.sqrt(dx*dx + dy*dy);
			var rate = curr_length / LAST_LENGTH;
			
			Spolo.selectedObj._vf.scale = Spolo.selectedObj._vf.scale.multiply(rate);
			Spolo.selectedObj.scale(Spolo.selectedObj._vf.scale);
			
			LAST_LENGTH = curr_length;
			//selectModuleS.selectedScale();
		}
	};
	
	/*
	 * 格式化名称
	 */
	function formatName(name){
		name = name.split('.');
		var _name = "";
		for(var i = 0; i < name.length; i++){
			_name += ("_" + name[i]);
		}
		var isNub = _name.substring(1, 2);

		if(!/^[0-9]*$/.exec(isNub)){
			_name = _name.substring(1, _name.length);
		}
		return _name;
	}
	
	
	
	var operate_freeModule = dojo.declare([],{
		// 当 moduleActionManager 被初始化时，将所有 module 操作模块都require进来
		constructor : function(x3d){
			selectModuleS = new selectModuleState(x3d);
            // 为使firefox兼容event而设置
			var shift = false;
			var keyboard = {
				keydown : function ( event ){
					if(event.shiftKey){
						shift = true;
					}else{
						shift = false;
					}
				},
				keyup : function ( event ){
					shift = false;
				}
			}
			document.addEventListener("keydown", keyboard.keydown, false);
			document.addEventListener("keyup", keyboard.keyup, false);
			
			var model_isLocked = true;
			
			// 订阅 onMousePress
			this.PressHandle = topic.subscribe("system/onMousePress",function(x , y, buttonState){
				if(Spolo.OperationMode == 2){	
					SCREEN_2D_X = x;
					SCREEN_2D_Y = y;
					_LASTMOUSEX = x;
					_LASTMOUSEY = y;
				//	console.log("onmouse press !!! \n");
				//	console.log("onmouse press SCREEN_2D_X : " + SCREEN_2D_X + " \n");
				//	console.log("onmouse press SCREEN_2D_Y : " + SCREEN_2D_Y + " \n");
					mouseState = true;
					//计算此时屏幕坐标系下鼠标与模型中心的距离此时屏幕坐标系下鼠标与模型中心的距离
					if(Spolo.selectedObj && Spolo.selectedObj._DEF != "boundingBox"){
						selectModuleS.addBox();
						// 模型缩放
						var _trans_center = Spolo.viewarea.projectVector(Spolo.selectedObj.getCurrentTransform().multMatrixPnt(new x3dom.fields.SFVec3f(0,0,0)));
						TRANS_SCEEN_X = (_trans_center.x + 1) * Spolo.viewarea._width / 2;
						TRANS_SCEEN_y =-(_trans_center.y - 1) * Spolo.viewarea._height / 2;
						var _last_dx = x - TRANS_SCEEN_X;
						var _last_dy = y - TRANS_SCEEN_y;
						LAST_LENGTH = Math.sqrt(_last_dx * _last_dx + _last_dy * _last_dy);
						
						// 模型移动
						DRAG_POS = x3dom.fields.SFVec3f.copy(Spolo.viewarea._pickingInfo.pickPos);
						DRAG_OFFSET = Spolo.selectedObj._vf.translation.subtract(DRAG_POS);
					}
				}
			});
			
			// 订阅 onMouseRelease
			this.ReleaseHandle = topic.subscribe("system/onMouseRelease",function(){
				if(Spolo.OperationMode == 2){	
					mouseState = false;
					
					/**
					 * 将数据更新到JCR中
					 */
					// if(Spolo.selectedObj){
						// var data = {
							// _def : Spolo.selectedObj._DEF,
							// translation : Spolo.selectedObj._vf.translation,
							// rotation : Spolo.selectedObj._vf.rotation,
							// scale : Spolo.selectedObj._vf.scale
						// };
						// topic.publish("syncer/syncerdata", data);
					// }
				}
			});
			
			// 订阅 onDrag 事件
			this.onDragHandle = topic.subscribe("system/onDrag",function(x,y,buttonState){
				//console.log(Spolo.modelOperationMode + " 1 " + model_isLocked + " 2 " + mouseState + " 3 " + Spolo.selectedObj.isLocked() + " 4 ");
				if(Spolo.OperationMode == 2){	
					if(Spolo.dataSync){
						var camera_json = Spolo.dataSync.get_camera_data();
						model_isLocked = camera_json.camera_locked;
					}
					
					
					if(Spolo.modelOperationMode == 1 && !shift){
						
						if(mouseState && Spolo.isMouseInModel && buttonState == 1){
							if(Spolo.selectedObj && !Spolo.selectedObj.isLocked()){
								// 这里不要注释掉，这里console一下，说明一下dragger_new文件在运行
							//	console.log(" dragger_new  running !!!");
								// 记录鼠标当前值
								switch (model_oprate_state){
									case MODEL_TRANSLATE :
										modelTranslate(x, y);
										break ;
									case MODEL_ROTATE_PROJECTPLANE :
										modelRotateProjectPlane(x, y);
										break ;
									case MODEL_ROTATE_ITSELF :
										//绕X轴旋转
										if(model_rotate_state==1){
											modelRotateX(x, y);
										}
										//绕y轴旋转
										if(model_rotate_state==2){
											modelRotateY(x, y);
										}
										//绕z轴旋转
										if(model_rotate_state==3){
											modelRotateZ(x, y);
										}
										break ;
									case MODEL_SCALE :
										// 设置二维鼠标坐标
										SCREEN_2D_X = x;
										SCREEN_2D_Y = y;
										modelScale();
										break ;
								}
								_LASTMOUSEX = x;
								_LASTMOUSEY = y;
							}
						}
					}
				}
			});
			
		},
		
		// 模型平移
		model_translate : function(){
			if(model_oprate_state != MODEL_TRANSLATE){
				model_oprate_state = MODEL_TRANSLATE;
			}
		},
		
		// 模型旋转
		model_rotate : function(state){
			//if(model_rotate_state != state){
				model_oprate_state = MODEL_ROTATE_ITSELF;
				model_rotate_state = state;
			//}
		},
		
		// 模型缩放
		model_scale : function(){
			if(model_oprate_state != MODEL_SCALE){
				model_oprate_state = MODEL_SCALE;
			}
		},
		
		unload : function (){
			if(this.PressHandle){
				this.PressHandle.remove();
			}
			if(this.ReleaseHandle){
				this.ReleaseHandle.remove();
			}
			if(this.onDragHandle){
				this.onDragHandle.remove();
			}
		}
	
	});
	return operate_freeModule; 
});