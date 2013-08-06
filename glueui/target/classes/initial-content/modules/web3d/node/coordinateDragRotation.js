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

define("web3d/node/coordinateDragRotation",["dojo/topic","dojo/_base/lang"],function(topic,lang){
return dojo.declare([],{
		constructor : function(trans){
			var mouseState = false ; // 标识鼠标当前状态
			var coordShape = null ;  // 缓冲当前的被点中的坐标系
			var selectModel = null ; // 缓冲当前的被点中需要移动的物体
			var lastPoint = 0;
			
			var mousePress_x;
			var mousePress_y;
			var  mousePressrotation;
			//var viewarea_point;
			
			var x3d = document.getElementById("_sp_x3d_main_tag");
			x3d.runtime.noNav();
			// 捕获鼠标按下事件
			topic.subscribe("system/onMousePress", function(x,y,buttonState){
				if(!mouseState && Spolo.modelOperationMode==2){
					mouseState = true;
					mousePress_x = x;
					mousePress_y = y;
					//获取模型当前朝向
					mousePressrotation = Spolo.selectedObj._vf.rotation;
				}				
			});	
			// 捕获鼠标抬起事件
			topic.subscribe("system/onMouseRelease", function(x,y,buttonState){
				if(mouseState && Spolo.modelOperationMode==2){
					mouseState = false;
					coordShape = null;
					selectModel = null;
					// 当鼠标抬起时		
					topic.publish("coorDrag/mouseUp_Rotation");
				}
			});
			var lastPoint = 0;	
			// 获取鼠标当前在屏幕上的位置
			topic.subscribe("system/onDrag", function(x,y,buttonState){
				
				// 当鼠标按下时
				if(mouseState && Spolo.modelOperationMode==2){
					/**
						缓冲当前的被点中的坐标系和需要移动的物体
					*/
					// 如果当前没有物体被点中
					if(!coordShape && !selectModel){
						coordShape = Spolo.viewarea._pickingInfo.pickObj;// 被点中的坐标系 
						//console.log(coordShape);
						if(coordShape){
							selectModel = Spolo.selectedObj;//coordShape._parentNodes[0]._parentNodes[0]._parentNodes[0]._parentNodes[0]._parentNodes[0];//  shape._parentNodes[0]._parentNodes[0]当前坐标系的父节点
						}
					}
					// 将需要移动的模型交给计算函数
					moveOnCoordinate(x,y,coordShape,selectModel);
				}
	
			
			});
			
			function moveOnCoordinate(x,y,shape,theMoveObject){
				if(shape && theMoveObject){
					// 获取box id <box id="coordinate_x">
					var cylinder = shape._xmlNode.innerHTML;			
					var id = $(cylinder+"appearance").attr("id");
					var rotX = ((x - mousePress_x)/Spolo.viewarea._width) * 2*Math.PI;
					var rotY = ((y - mousePress_y)/Spolo.viewarea._height) * 2*Math.PI;
					//console.log(mousePressrotation.w-rotX-rotY);
					switch (id){
						
						case "mater_Rotation0" :
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_z_Rotation",Spolo.selectedObj);
							//将旋转值赋予模型
							Spolo.selectedObj.localRotate(new x3dom.fields.SFVec3f(0,0,1),(rotX-rotY));
							//_xmlNode.setAttribute("rotation",0+" "+0+" "+1+" "+(mousePressrotation.w-rotX-rotY));
							
							break;
						case "mater_Rotation1" :
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_y_Rotation",Spolo.selectedObj);
							//将旋转值赋予模型trans.localRotate(axis,rotX-rotY);
							Spolo.selectedObj.localRotate(new x3dom.fields.SFVec3f(1,0,0),(rotX-rotY));
							//Spolo.selectedObj._xmlNode.setAttribute("rotation",1+" "+0+" "+0+" "+(mousePressrotation.w-rotX-rotY));
							break;
						case "mater_Rotation2" : 
							
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_x_Rotation",Spolo.selectedObj);
							//将旋转值赋予模型
							Spolo.selectedObj.localRotate(new x3dom.fields.SFVec3f(0,1,0),(rotX-rotY));
							//Spolo.selectedObj._xmlNode.setAttribute("rotation",0+" "+1+" "+0+" "+(mousePressrotation.w-rotX-rotY));
							break;
					}
					mousePress_x = x;
					mousePress_y = y;
				}
			}
		}
		
		
	});
});