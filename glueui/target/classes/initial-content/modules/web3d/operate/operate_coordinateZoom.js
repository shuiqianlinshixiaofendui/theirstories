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

define("web3d/operate/operate_coordinateZoom",["dojo/topic","dojo/_base/lang"],function(topic,lang){
	return dojo.declare([],{
		constructor : function(trans){
			var viewarea = Spolo.viewarea;
			var mouseState = false ; // 标识鼠标当前状态
			var coordShape = null ;  // 缓冲当前的被点中的坐标系
			var selectModel = null ; // 缓冲当前的被点中需要移动的物体
			var lastPoint = 0;
			
			var mousePress_x;
			var mousePress_y;
			var  mousePressscale;
			var viewarea_point;
			
			var x3d = document.getElementById("_sp_x3d_main_tag");
			x3d.runtime.noNav();
			// 捕获鼠标按下事件
			this.onMousePressHandle = topic.subscribe("system/onMousePress", function(x,y,buttonState){
				if(!mouseState && Spolo.modelOperationMode==2 && Spolo.OperationMode == 2 && Spolo.selectedObj){
					
					mouseState = true;
					mousePress_x = x;
					mousePress_y = y;
					mousePressscale = Spolo.selectedObj._vf.scale;
					var _width = viewarea._width;
					var _height = viewarea._height;
					viewarea_point = Math.sqrt(_width*_width+_height*_height);
					
				}				
			});	
			// 捕获鼠标抬起事件
			this.onMouseReleaseHandle = topic.subscribe("system/onMouseRelease", function(x,y,buttonState){
				if(mouseState && Spolo.modelOperationMode==2 && Spolo.OperationMode == 2){
					mouseState = false;
					coordShape = null;
					selectModel = null;
					// 当鼠标抬起时		
					topic.publish("coorDrag/mouseUp_zoom1");
					/**
					 * 获取模型数据
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
			var lastPoint = 0;	
			// 获取鼠标当前在屏幕上的位置
			this.onDragHandle = topic.subscribe("system/onDrag", function(x,y,buttonState){
				
				// 当鼠标按下时
				if(mouseState && Spolo.modelOperationMode==2 && Spolo.OperationMode == 2){
					/**
						缓冲当前的被点中的坐标系和需要移动的物体
					*/
					// 如果当前没有物体被点中
					if(!coordShape && !selectModel){
						coordShape = Spolo.viewarea._pickingInfo.pickObj;// 被点中的坐标系 
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
                    var viewmatrix = Spolo.viewarea.getViewMatrix();

                    pos = Spolo.selectedObj._vf.translation;
                    var _intersect_pos_inCC = Spolo.viewarea.projectVector(pos);
                    
                    var _Mouse3D = new x3dom.fields.SFVec3f( (x / Spolo.viewarea._width) * 2 - 1,
                                                        -(y / Spolo.viewarea._height) * 2 + 1,
                                                        _intersect_pos_inCC.z);
                    var cpos = Spolo.viewarea.unprojectVector(_Mouse3D);
                    
                    var init3D = new x3dom.fields.SFVec3f( (mousePress_x / Spolo.viewarea._width) * 2 - 1,
                                                        -(mousePress_y / Spolo.viewarea._height) * 2 + 1,
                                                        _intersect_pos_inCC.z);
                    var ipos = Spolo.viewarea.unprojectVector(init3D);
                    
					// 计算当前点到物体中心的距离
					var point = cpos.subtract(pos).length();
                    // 计算点击点到物体中心的距离
                    var point2 = ipos.subtract(pos).length();
                    difference_point = point/point2;
					
					switch (id){
						
						case "zoomCoordinate_x" :
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_x_zoom1",Spolo.selectedObj);
							//将缩放值赋予模型
							//Spolo.selectedObj._xmlNode.setAttribute("scale",difference_point+" "+Spolo.selectedObj._vf.scale.y+" "+Spolo.selectedObj._vf.scale.z);
							Spolo.selectedObj._vf.scale = new x3dom.fields.SFVec3f(difference_point,Spolo.selectedObj._vf.scale.y,Spolo.selectedObj._vf.scale.z);
							Spolo.selectedObj.scale(Spolo.selectedObj._vf.scale);
							break;
						case "zoomCoordinate_y" :
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_y_zoom1",Spolo.selectedObj);
							//将缩放值赋予模型
							//Spolo.selectedObj._xmlNode.setAttribute("scale",Spolo.selectedObj._vf.scale.x+" "+difference_point+" "+Spolo.selectedObj._vf.scale.z);
							Spolo.selectedObj._vf.scale = new x3dom.fields.SFVec3f(Spolo.selectedObj._vf.scale.x,difference_point,Spolo.selectedObj._vf.scale.z);
							Spolo.selectedObj.scale(Spolo.selectedObj._vf.scale);
							break;
						case "zoomCoordinate_z" : 
							
							// 当模型在坐标系下移动时，publish一个消息，坐标系module接收这个消息，改变坐标系
							topic.publish("coorDrag/coor_z_zoom1",Spolo.selectedObj);
							//将缩放值赋予模型
							//Spolo.selectedObj._xmlNode.setAttribute("scale",Spolo.selectedObj._vf.scale.x+" "+Spolo.selectedObj._vf.scale.y+" "+difference_point);
							Spolo.selectedObj._vf.scale = new x3dom.fields.SFVec3f(Spolo.selectedObj._vf.scale.x,Spolo.selectedObj._vf.scale.y,difference_point);
							Spolo.selectedObj.scale(Spolo.selectedObj._vf.scale);
							break;
					}
				}
			}
		},
		
		// 删除node
		unload : function (){
			if(this.onMousePressHandle){
				this.onMousePressHandle.remove();
			}
			if(this.onMouseReleaseHandle){
				this.onMouseReleaseHandle.remove();
			}
			if(this.onDragHandle){
				this.onDragHandle.remove();
			}
		}
		
		
	});
});