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
	此模块为模型添加旋转坐标系
*/

define("web3d/node_new/axisRotation",["dojo/topic"],function(topic){
	// 缓冲被点击模型
	var currentCoordinate = null;
	// 缓冲自定义坐标系trans
	var trans = null;
	// 缓冲添加的坐标系
	var coordTransform = null ;
	
	var line = null ;
	
	var lineBool = false;
	var currentNode = null;
	
	var coordinateDragRotation;
	
	function createLine(coor,model){
		//创建直线时隐藏坐标系。
		document.getElementById("coorbar_model").setAttribute("render","false");
		// 当接鼠标按下x坐标系时，将自身坐标系移出
		
		var lineT = document.createElement('Transform');
		
		// 缓冲lineT
		line = lineT;
		lineT.setAttribute("id","line");
		lineT.setAttribute("translation",model._vf.translation.x+" "+model._vf.translation.y+" "+model._vf.translation.z);
		var lineShape = document.createElement('shape');
		var appearancey_cylinder = document.createElement('Appearance');
		appearancey_cylinder.setAttribute("id","coordinate_line");
		var materialy_cylinder = document.createElement('Material');
		materialy_cylinder.setAttribute("diffuseColor","0.2 0.5 0.5");
		var lineBox = document.createElement('box');
		switch(coor){
			case "x" :
				lineBox.setAttribute("size",5000+" "+10+" "+10);
				break;
			case "y" :
				lineBox.setAttribute("size",10+" "+5000+" "+10);
				break;
			case "z" :
				lineBox.setAttribute("size",10+" "+10+" "+5000);
				break;
		}
		appearancey_cylinder.appendChild(materialy_cylinder);
		lineShape.appendChild(appearancey_cylinder);
		
		lineT.appendChild(lineShape);
		lineShape.appendChild(lineBox);
		if(currentNode!=null){
			if(currentNode.nodeType==1){
				currentNode.appendChild(lineT);
			}else{
				currentNode._xmlNode.appendChild(lineT);
			}
		}
	}
	function removeLine(){
		//设置坐标系显示，并重新赋值。
		document.getElementById("coorbar_model").setAttribute("render","true");
		document.getElementById("coorbar_model").setAttribute("translation",Spolo.selectedObj._vf.translation.x+" "+Spolo.selectedObj._vf.translation.y+" "+Spolo.selectedObj._vf.translation.z);
		lineBool = false;
		if(currentNode!=null){
			if(currentNode._xmlNode.nodeType==1){
				for(var i=0;i < currentNode._xmlNode.childNodes.length;i++){
					if(currentNode._xmlNode.childNodes[i].id == "line" ){
						currentNode._xmlNode.removeChild(currentNode._xmlNode.childNodes[i]) ;
					}
				}
			//	currentNode.removeChild(line);
			}else{
				currentNode._xmlNode.removeChild(line);
			}
		}
		
	}
	
	function moveLine(coor,model){
		if(trans){
			if(!lineBool){
				// 然后，沿着x方向创建一条直线，表示当前模型正在沿着这条直线运动
				createLine(coor,model);	
				lineBool = true;
			}
		}
	}
	
	return dojo.declare([],{
		constructor : function(x3d){
		
			require(["web3d/operate/operate_coordinateRotation"],function(coordinateDragRotation){
				coordinateDragRotation = new coordinateDragRotation();
			});
			
			// 接收消息，将坐标系改变成直线 x方向
			this.coorDrag_coorxHandle = topic.subscribe("coorDrag/coor_x_Rotation1", function(model){
				moveLine("x",model);
			});
			
			// 接收消息，将坐标系改变成直线 y方向
			this.coorDrag_cooryHandle = topic.subscribe("coorDrag/coor_y_Rotation1", function(model){
				moveLine("y",model);
			});
			
			// 接收消息，将坐标系改变成直线 z方向
			this.coorDrag_coorzHandle = topic.subscribe("coorDrag/coor_z_Rotation1", function(model){
				moveLine("z",model);
			});
			
			// 接收消息，当鼠标抬起时 
			this.coorDrag_mouseUpHandle = topic.subscribe("coorDrag/mouseUp_Rotation1", function(){
				if(document.getElementById("coorbar_model")){
					removeLine();
				}
			});
			
		},
		
		addCoordinate : function(node,model){
            var scale = new x3dom.fields.SFVec3f(1, 1, 1);
            if(model._xmlNode){
				model_name =  model._xmlNode.nodeName;
			}
			if(model_name == "Transform" || model_name == "TRANSFORM"){
                 scale = model._vf.scale;
            }
            //计算缩放倍数
            var k = 0;
            if(k < scale.x){
                k = scale.x;
            }
            if(k < scale.y){
                k = scale.y;
            }
            if(k < scale.z){
                k = scale.z;
            }
            if(k > 1){
                k = k / 1.5;
            }
			// 缓冲被点击模型
			currentCoordinate = node;
			var model_pos;
			var model_name;
			var radius;
            // console.log(Spolo.selectedObj);
			if(Spolo.mesh){
                var mesh = Spolo.mesh;
                // console.log(mesh);
                var _min = new x3dom.fields.SFVec3f(0,0,0);
                var _max = new x3dom.fields.SFVec3f(0,0,0);
                mesh.getBBox(_min, _max, true);
                _min = mesh._min;
                _max = mesh._max;
                var size = _max.subtract(_min);
                var _size = Math.sqrt(Math.pow(size.x, 2) + Math.pow(size.y, 2) + Math.pow(size.z, 2));
                radius = _size * 2 * k;
            }
            // console.log("radius : " + radius);
			
			/** 
				当前node如果有坐标系的transform，我们就不加坐标系了。
				没有继续执行下面代码（这里代码还没写呢）
			*/
			// 坐标系
			trans = document.createElement('Transform');
			
			if(model._xmlNode){
				model_name =  model._xmlNode.nodeName;
			}
			if(model_name == "Transform" || model_name == "TRANSFORM"){
				model_pos =  model._vf.translation.x+" "+model._vf.translation.y+" "+model._vf.translation.z;
				//console.log("pos                "+model_pos);
				trans.setAttribute("id","coorbar_model");
				trans.setAttribute("def","coorbar_model");
			}else{
				model_pos = "0 0 0";
				trans.setAttribute("id","coorbar");
				trans.setAttribute("def","coorbar");
			}
			trans.setAttribute("scale",model._vf.scale.x/2+" "+model._vf.scale.y/2+" "+model._vf.scale.z/2);
			trans.setAttribute("translation",model_pos);
			//我在这里面定义了{}来区分模块  
			{	
				//定义属性会改变的量
				 var x,y,z,r,red,green,blue;
				//创建三次，下面是拼装一个轴的操作
				/*——*****循环开始_for.start**********************——**/
				for(var i=0;i<3;i++){
					 /*3.1_*.start******初始轴属性操作****************************************************_*/			
						if(i==0){
							x=0;y=1;z=0;r=0;red=1;green=0;blue=0;
						}
						if(i==1){
							x=0;y=1;z=0;r=1.57;red=0;green=1;blue=0;
						}
						if(i==2){
							x=1;y=0;z=0;r=4.72;red=0;green=0;blue=1;
						}
					 /*3.1_*.end**************************************************************************_*/	
					 /*3.2_*.start************************************************************************_*/
						var t = document.createElement('Transform');
						t.setAttribute("id","circle_Rotation"+i);
						t.setAttribute("def","circle_Rotation"+i);
						t.setAttribute("translation",0.0+" "+0.0+" "+0.0);
						t.setAttribute("rotation",x+" "+y+" "+z+" "+r);
						var shape_node = document.createElement('Shape');
						var appr_node = document.createElement('Appearance');
						appr_node.setAttribute("id","mater_Rotation"+i);
						appr_node.setAttribute("def","mater_Rotation"+i);
						var mater = document.createElement('Material');
						mater.setAttribute("emissiveColor",red+" "+green+" "+blue);
						var cir2D = document.createElement("Circle2D");
						cir2D.setAttribute("id","cir2D"+i);
						cir2D.setAttribute("radius",radius);
						appr_node.appendChild(mater);
						shape_node.appendChild(appr_node);
						shape_node.appendChild(cir2D);
						t.appendChild(shape_node);								
						trans.appendChild(t);
						
					/*3.2_*.end************************************************************************_*/	
											
				}	
				/*________*****循环结束_for.end**********************________**/	
			}
			/*_*____整个执行模块结束__________________*_*/
			
			
			// 将坐标系添加到被点击的模型上
			if(currentCoordinate.nodeType==1){
				currentCoordinate.appendChild(trans);
				
			}else{
				currentCoordinate._xmlNode.appendChild(trans);
			}
			//console.log(trans);
			// 缓冲Node节点
			currentNode = node;
			// 缓冲添加的坐标系
			coordTransform = trans;
		},
		deleteCoordinate : function(){
			if(currentCoordinate!=null){
				if(currentCoordinate.nodeType==1){
					currentCoordinate.removeChild(coordTransform)
				}else{
					currentCoordinate._xmlNode.removeChild(coordTransform)
				}
				//currentCoordinate._xmlNode.removeChild(coordTransform)
				currentCoordinate = null;
				//Spolo.selectedObj = null;
				
				if(this.coorDrag_coorxHandle){
					this.coorDrag_coorxHandle.remove();
				}else if(this.coorDrag_cooryHandle){
					this.coorDrag_cooryHandle.remove();
				}else if(this.coorDrag_coorzHandle){
					this.coorDrag_coorzHandle.remove();
				}else if(this.coorDrag_mouseUpHandle){
					this.coorDrag_mouseUpHandle.remove();
				}
			}
		},
		
		// 删除node
		unload : function (){
			if(this.coorDrag_coorxHandle){
				this.coorDrag_coorxHandle.remove();
			} 
            if(this.coorDrag_cooryHandle){
				this.coorDrag_cooryHandle.remove();
			} 
            if(this.coorDrag_coorzHandle){
				this.coorDrag_coorzHandle.remove();
			}
            if(this.coorDrag_mouseUpHandle){
				this.coorDrag_mouseUpHandle.remove();
			}
		}
	});
});