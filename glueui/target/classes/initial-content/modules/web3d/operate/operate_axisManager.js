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

define("web3d/operate/operate_axisManager",["dojo/topic"],function(topic){
	var pan;
	var rotation;
	var zoom;
	var model_isLocked;
	var viewarea_axis;
	var modelManageType = 1 ;
		
	// 此消息响应添加坐标系消息
	function axisAdd(trans){
		//判断是否是模型操作模式。
		if(Spolo.OperationMode==2){
			//如果坐标轴不存在
			if(document.getElementById("coorbar_model")==null){
				var scene = viewarea_axis._scene;
				//根据判断条件添加相应的坐标轴
				if(modelManageType==1){
					//trans.replaceDragger();
					pan.addCoordinate(scene,trans);
					trans.replaceDragger("operate_coordinateTranslate");
					//console.log(trans);
				}else if(modelManageType==2){
					//trans.replaceDragger();
					rotation.addCoordinate(scene,trans);
					trans.replaceDragger("operate_coordinateRotation");
				}else{
					//trans.replaceDragger();
					zoom.addCoordinate(scene,trans);
					trans.replaceDragger("operate_coordinateZoom");
				}
			}
		}
	}
	
	// 此消息响应删除坐标系消息
	function axisDelete(){
		//根据判断条件删除相应的坐标轴
		if(modelManageType==1){
			pan.deleteCoordinate();
		}else if(modelManageType==2){
			rotation.deleteCoordinate();
		}else{
			zoom.deleteCoordinate();
		}
	}

	var operate_axisManager = dojo.declare([],{
		
		constructor : function(x3d){
			require(["web3d/node_new/axisTranslate"],function(axisPan){
				pan = new axisPan();
			});
			model_isLocked = true;
			viewarea_axis = x3d.runtime.canvas.doc._viewarea;
		},
		
		// 平移操作
		coor_translate : function(){
			
			require(["web3d/node_new/axisTranslate"],function(axisPan){
				pan = new axisPan();
			});
			if(Spolo.modelOperationMode==2){
				if(model_isLocked){
					//先删除其他状态的坐标轴，如果是自己则不删除
					var tag = false;
					if(modelManageType!=1){
						axisDelete();
						tag = true;
					}
					modelManageType = 1;
					//如果当前模型不为空，则执行添加操作。
					
					if(Spolo.selectedObj!=null && (tag || (document.getElementById("coorbar_model") == null))){
						axisAdd(Spolo.selectedObj);
					}
				}
			}
		},
		
		// 旋转操作
		coor_rotate : function(){
			require(["web3d/node_new/axisRotation"],function(axisRotation){
				rotation = new axisRotation();
			});
			if(Spolo.modelOperationMode==2){
				if(model_isLocked){
					//先删除其他状态的坐标轴，如果是自己则不删除
					var tag = false;
					if(modelManageType!=2){
						axisDelete();
						tag = true;
					}
					modelManageType = 2;
					//如果当前模型不为空，则执行添加操作。
					if(Spolo.selectedObj!=null && tag){
						axisAdd(Spolo.selectedObj);
					}
				}
			}
		},
		
		// 缩放操作
		coor_scale : function(){
			require(["web3d/node_new/axisZoom"],function(axisZoom){
				zoom = new axisZoom();
			});
			if(Spolo.modelOperationMode==2){
				if(model_isLocked){
					//先删除其他状态的坐标轴，如果是自己则不删除
					var tag = false;
					if(modelManageType!=3){
						axisDelete();
						tag = true;
					}
					modelManageType = 3;
					//如果当前模型不为空，则执行添加操作。
					if(Spolo.selectedObj!=null && tag){
						axisAdd(Spolo.selectedObj);
					}
				}
			}
		},
		
		// 添加坐标轴
		axisAdd : function(trans){
			axisAdd(trans);
		},
		
		// 删除坐标轴
		axisDelete : function(){
			axisDelete();
		},
		
		// 删除node
		unload : function (){
			
		}
	});
	return operate_axisManager; 
});