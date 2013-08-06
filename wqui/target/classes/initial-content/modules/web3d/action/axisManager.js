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

/**
	此模块为模型添加坐标系，此坐标系代表模型本身的坐标系
	而且还负责删除坐标系
*/

define("web3d/action/axisManager",["dojo/topic"],function(topic){

	return dojo.declare([],{
		constructor : function(x3d){
			var model_isLocked = true;
			var locked_camera = false; //当前模型的操作状态。
			// 响应模型锁定事件
			topic.subscribe("toolbar/camera/locked",function(isLockedStatus){
				model_isLocked = isLockedStatus;
			});
			
			var viewarea_axis = x3d.runtime.canvas.doc._viewarea;
			require(["web3d/node/axisPan","web3d/node/axisRotation","web3d/node/axisZoom"],function(axisPan,axisRotation,axisZoom){
				var modelManageType = 1 ;
				
				var pan = new axisPan();
				
				var rotation = new axisRotation();
				
				var zoom  = new axisZoom();
				
				//接收二维信息，用来判断当前是哪种模型的操作方式。
				topic.subscribe("toolbar/model/translate", function(){
					if(locked_camera){
						if(Spolo.modelOperationMode==2){
							if(model_isLocked){
								//先删除其他状态的坐标轴，如果是自己则不删除
								var tag = false;
								if(modelManageType!=1){
									topic.publish("axisManager/axisDelete");
									tag = true;
								}
								modelManageType = 1;
								//如果当前模型不为空，则执行添加操作。
								if(Spolo.selectedObj!=null && tag){
									topic.publish("axisManager/axisAdd",Spolo.selectedObj);
								}
							}
						}
					}
				});
				
				topic.subscribe("toolbar/model/rotate", function(){
					if(locked_camera){
						if(Spolo.modelOperationMode==2){
							if(model_isLocked){
								//先删除其他状态的坐标轴，如果是自己则不删除
								var tag = false;
								if(modelManageType!=2){
									topic.publish("axisManager/axisDelete");
									tag =true;
								}
								modelManageType = 2;
								//如果当前模型不为空，则执行添加操作。
								if(Spolo.selectedObj!=null && tag){
									topic.publish("axisManager/axisAdd",Spolo.selectedObj);
								}
							}
						}
					}
				});
				
				topic.subscribe("toolbar/model/scale", function(){
					if(locked_camera){
						if(Spolo.modelOperationMode==2){
							if(model_isLocked){
								//先删除其他状态的坐标轴，如果是自己则不删除
								var tag = false;
								if(modelManageType!=3){
									topic.publish("axisManager/axisDelete");
									tag =true;
								}
								modelManageType = 3;
								//如果当前模型不为空，则执行添加操作。
								if(Spolo.selectedObj!=null && tag){
									topic.publish("axisManager/axisAdd",Spolo.selectedObj);
								}
							}
						}
					}
				});
				
				//订阅模型旋转消息
				topic.subscribe("toolbar/model/rotate_itself", function(){
					topic.publish("toolbar/model/rotate");
				});
				//订阅模型旋转消息
				topic.subscribe("toolbar/model/rotate_projectplane", function(){
					topic.publish("toolbar/model/rotate");
				});
				
				// 此消息响应添加坐标系消息
				topic.subscribe("axisManager/axisAdd", function(trans){
					if(locked_camera){
						//如果坐标轴不存在
						if(document.getElementById("coorbar_model")==null){
							var scene = viewarea_axis._scene;
							//根据判断条件添加相应的坐标轴
							if(modelManageType==1){
								//trans.replaceDragger();
								pan.addCoordinate(scene,trans);
								trans.replaceDragger("coordinateDragPan");
								//console.log(trans);
							}else if(modelManageType==2){
								//trans.replaceDragger();
								rotation.addCoordinate(scene,trans);
								trans.replaceDragger("coordinateDragRotation");
							}else{
								//trans.replaceDragger();
								zoom.addCoordinate(scene,trans);
								trans.replaceDragger("coordinateDragZoom");
							}
						}
					}
				});
				
				// 此消息响应删除坐标系消息
				topic.subscribe("axisManager/axisDelete", function(){
					//根据判断条件删除相应的坐标轴
					if(modelManageType==1){
						pan.deleteCoordinate();
					}else if(modelManageType==2){
						rotation.deleteCoordinate();
					}else{
						zoom.deleteCoordinate();
					}
				});
				
				topic.subscribe("toolbar/camera/locked", function(state){
					//判断当前的操作模式。
					if(state){
						locked_camera = true;
					}else{
						locked_camera = false;
					}
					if(document.getElementById("coorbar_model")!=null){
						topic.publish("axisManager/axisDelete");
					}
				});
			
			});
		}
	});
});