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
	坐标模式下的模型平移
	帖子：#1103
*/

/*负责在坐标模式下，点中某一条坐标轴进行相应的移动。*/

define("web3d/node/coordinateDragPan",["dojo/topic"],function(topic){
	return dojo.declare([],{
		constructor : function(){
			var mouseState = false ; 			// 标识鼠标当前状态
			var coordShape = null ; 		 	// 缓冲当前的被点中的坐标系
			var x3d = document.getElementById("_sp_x3d_main_tag") ;
			var x3domViewarea = x3d.runtime.canvas.doc._viewarea;
			
			// 捕获鼠标按下事件
			topic.subscribe("system/onMousePress", function(x,y,buttonState){
				if(!mouseState && Spolo.modelOperationMode==2){
					mouseState = true;
				}				
			});	
			// 捕获鼠标抬起事件
			topic.subscribe("system/onMouseRelease", function(x,y,buttonState){
				if(mouseState && Spolo.modelOperationMode==2){
					mouseState = false;
					coordShape = null;
					topic.publish("coorDrag/mouseUp");// 当鼠标抬起时
					x3domViewarea._lastX = -1;
					x3domViewarea._lastY = -1;
				}
			});
			
			// 获取鼠标当前在屏幕上的位置
			topic.subscribe("system/onDrag", function(x,y,buttonState){
				if(mouseState){// 当鼠标按下时
					if(!coordShape && Spolo.modelOperationMode==2){
						coordShape = Spolo.viewarea._pickingInfo.pickObj;// 被点中的坐标系 
					}
					moveOnCoordinate(x,y,coordShape);
				}
			});
			
			/**
			    修改模型在某一轴上的位置
				x : 当前鼠标的x
				y : 当前鼠标的y
				shape : 被点中的坐标系
			*/
			function moveOnCoordinate(x,y,shape){
				if(shape){
					var pos_LC;	                                // 世界坐标系下的向量
					var cylinder = shape._xmlNode.innerHTML;			
					var id = $(cylinder+"appearance").attr("id");
					if(!Spolo.selectedObj){
						return ;
					}
                    var trans_pos = Spolo.selectedObj._vf.translation;      // 点中模型的translation
                    
					if( x3domViewarea._lastX == -1 || x3domViewarea._lastY == -1){      
						x3domViewarea._lastX = x;
						x3domViewarea._lastY = y;
					}else{
                        var mouse_x = (x / Spolo.viewarea._width) * 2 - 1;      // 将屏幕坐标系的的原点移动到屏幕中心
                        var mouse_y = -(y / Spolo.viewarea._height) * 2 + 1;    // 屏幕坐标系的y轴方向改成与世界坐标系相同
                        var mouse_lastX = (x3domViewarea._lastX / Spolo.viewarea._width) * 2 - 1;   // 记录的上一次的鼠标的位置
                        var mouse_lastY = -(x3domViewarea._lastY / Spolo.viewarea._height) * 2 + 1;
                        var mouse3D = new x3dom.fields.SFVec3f(mouse_x, mouse_y, 0);
                        var mouse3D_last = new x3dom.fields.SFVec3f(mouse_lastX, mouse_lastY, 0);
                        var posWC = Spolo.viewarea.unprojectVector(mouse3D);    // 转换到世界坐标系下
                        var posWC_last = Spolo.viewarea.unprojectVector(mouse3D_last); 
                        var offset = posWC.subtract(posWC_last) ;               // 将两次世界坐标下的坐标做差
                    
						switch (id){
						case "coordinate_x" :
							topic.publish("coorDrag/coor_x",Spolo.selectedObj);	                      
                            pos_LC = new x3dom.fields.SFVec3f(trans_pos.x+offset.x*100,trans_pos.y,trans_pos.z) ;
							Spolo.selectedObj.moveTo_WC(pos_LC);	       // 移动模型		
							break;
						case "coordinate_y" :
							topic.publish("coorDrag/coor_y",Spolo.selectedObj);
							pos_LC = new x3dom.fields.SFVec3f(trans_pos.x,trans_pos.y+offset.y*100,trans_pos.z) ;
							Spolo.selectedObj.moveTo_WC(pos_LC);
							break;
						case "coordinate_z" : 
							topic.publish("coorDrag/coor_z",Spolo.selectedObj);
                            pos_LC = new x3dom.fields.SFVec3f(trans_pos.x,trans_pos.y,trans_pos.z+offset.z*100) ;
							Spolo.selectedObj.moveTo_WC(pos_LC);	
							break;
						}
                        x3domViewarea._lastX = x;					   // 当前的鼠标位置就是下一次的鼠标位置
						x3domViewarea._lastY = y;
					}
				}
			}
		}
	});
});