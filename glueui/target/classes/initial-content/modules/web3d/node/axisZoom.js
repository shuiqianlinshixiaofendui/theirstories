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
	此模块为模型添加缩放坐标系
*/

define("web3d/node/axisZoom",["dojo/topic"],function(topic){
// 缓冲被点击模型
	var currentCoordinate = null;
	// 缓冲自定义坐标系trans
	var trans = null;
	// 缓冲添加的坐标系
	var coordTransform = null ;
	
	var line = null ;
	
	var lineBool = false;
	var currentNode = null;
	
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
				lineBox.setAttribute("size",1000+" "+0.02+" "+0.02);
				break;
			case "y" :
				lineBox.setAttribute("size",0.02+" "+1000+" "+0.02);
				break;
			case "z" :
				lineBox.setAttribute("size",0.02+" "+0.02+" "+1000);
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
			
			// 接收消息，将坐标系改变成直线 x方向
			topic.subscribe("coorDrag/coor_x_zoom", function(model){
				moveLine("x",model);
			});
			
			// 接收消息，将坐标系改变成直线 y方向
			topic.subscribe("coorDrag/coor_y_zoom", function(model){
				moveLine("y",model);
			});
			
			// 接收消息，将坐标系改变成直线 z方向
			topic.subscribe("coorDrag/coor_z_zoom", function(model){
				moveLine("z",model);
			});
			
			// 接收消息，当鼠标抬起时 
			topic.subscribe("coorDrag/mouseUp_zoom", function(){
				if(document.getElementById("coorbar_model")){
					removeLine();
				}
			});
			
		},
		
		addCoordinate : function(node,model){
			// 缓冲被点击模型
			currentCoordinate = node;
			var model_pos;
			var model_name;
			
			
			
			/** 
				当前node如果有坐标系的transform，我们就不加坐标系了。
				没有继续执行下面代码（这里代码还没写呢）
			*/
			// 坐标系
			trans = document.createElement('Transform');
			
			if(model._xmlNode){
				model_name =  model._xmlNode.nodeName;
			}
			if(model_name== "TRANSFORM"){
				model_pos =  model._vf.translation.x+" "+model._vf.translation.y+" "+model._vf.translation.z;
				//console.log("pos                "+model_pos);
				trans.setAttribute("id","coorbar_model");
				trans.setAttribute("def","coorbar_model");
			}else{
				model_pos = "0 0 0";
				trans.setAttribute("id","coorbar");
				trans.setAttribute("def","coorbar");
			}
			trans.setAttribute("scale","0.5 0.5 0.5");
			trans.setAttribute("translation",model_pos);
			trans.setAttribute("rotation",1+" "+0+" "+0+" "+0);
			/*--------------------------y轴start-----------------------------*/
			var transy0 = document.createElement('Transform');
			transy0.setAttribute("rotation","0 0 1 0");
			var transy = document.createElement('Transform');
			var transy_cylinder = document.createElement('Transform');
			transy_cylinder.setAttribute("translation","0 0.9 0");
			var shapey_cylinder = document.createElement('Shape');
			var appearancey_cylinder = document.createElement('Appearance');
			
			appearancey_cylinder.setAttribute("id","zoomCoordinate_y");
			
			appearancey_cylinder.setAttribute("def","color1");
			var materialy_cylinder = document.createElement('Material');
			materialy_cylinder.setAttribute("diffuseColor","0 0 1");
			var cylindery_cylinder = document.createElement('Cylinder');
			cylindery_cylinder.setAttribute("def",'y1');
			cylindery_cylinder.setAttribute("height",1.8);
			cylindery_cylinder.setAttribute("radius",0.05);
			var transy_cone = document.createElement('Transform');
			transy_cone.setAttribute("translation","0 1.9 0");
			var shapey_cone = document.createElement('Shape');
			var appearancey_cone = document.createElement('Appearance');
			appearancey_cone.setAttribute("use","color1");
			var coney_cone = document.createElement('Box');
			coney_cone.setAttribute("def",'y2');
			coney_cone.setAttribute("size","0.2 0.2 0.2");
			appearancey_cylinder.appendChild(materialy_cylinder);
			shapey_cylinder.appendChild(appearancey_cylinder);
			shapey_cylinder.appendChild(cylindery_cylinder);
			transy_cylinder.appendChild(shapey_cylinder);
			shapey_cone.appendChild(appearancey_cone);
			shapey_cone.appendChild(coney_cone);
			transy_cone.appendChild(shapey_cone);
			transy.appendChild(transy_cylinder);
			transy.appendChild(transy_cone);
			transy0.appendChild(transy);
			/*--------------------------y轴end-----------------------------*/
			/*--------------------------x轴start-----------------------------*/
			var transx0 = document.createElement('Transform');
			transx0.setAttribute("rotation","0 0 1 -1.57");
			var transx = document.createElement('Transform');
			var transx_cylinder = document.createElement('Transform');
			transx_cylinder.setAttribute("translation","0 0.9 0");
			var shapex_cylinder = document.createElement('Shape');
			var appearancex_cylinder = document.createElement('Appearance');
			
			appearancex_cylinder.setAttribute("id","zoomCoordinate_x");
			
			
			appearancex_cylinder.setAttribute("def","color2");
			var materialx_cylinder = document.createElement('Material');
			materialx_cylinder.setAttribute("diffuseColor","0 1 0");
			var cylinderx_cylinder = document.createElement('Cylinder');
			cylinderx_cylinder.setAttribute("def",'x1');
			cylinderx_cylinder.setAttribute("height",1.8);
			cylinderx_cylinder.setAttribute("radius",0.05);
			var transx_cone = document.createElement('Transform');
			transx_cone.setAttribute("translation","0 1.9 0");
			var shapex_cone = document.createElement('Shape');
			var appearancex_cone = document.createElement('Appearance');
			appearancex_cone.setAttribute("use","color2");
			var conex_cone = document.createElement('Box');
			conex_cone.setAttribute("def",'x2');
			conex_cone.setAttribute("size","0.2 0.2 0.2");
			
			appearancex_cylinder.appendChild(materialx_cylinder);
			shapex_cylinder.appendChild(appearancex_cylinder);
			shapex_cylinder.appendChild(cylinderx_cylinder);
			transx_cylinder.appendChild(shapex_cylinder);
			shapex_cone.appendChild(appearancex_cone);
			shapex_cone.appendChild(conex_cone);
			transx_cone.appendChild(shapex_cone);
			transx.appendChild(transx_cylinder);
			transx.appendChild(transx_cone);
			transx0.appendChild(transx);
			/*--------------------------x轴end-----------------------------*/
			/*--------------------------z轴start-----------------------------*/
			var transz0 = document.createElement('Transform');
			transz0.setAttribute("rotation","1 0 0 1.57");
			var transz = document.createElement('Transform');
			var transz_cylinder = document.createElement('Transform');
			transz_cylinder.setAttribute("translation","0 0.9 0");
			var shapez_cylinder = document.createElement('Shape');
			var appearancez_cylinder = document.createElement('Appearance');
			
			appearancez_cylinder.setAttribute("id","zoomCoordinate_z");
			
			appearancez_cylinder.setAttribute("def","color3");
			var materialz_cylinder = document.createElement('Material');
			materialz_cylinder.setAttribute("diffuseColor","1 0 0");
			var cylinderz_cylinder = document.createElement('Cylinder');
			cylinderz_cylinder.setAttribute("def",'z1');
			cylinderz_cylinder.setAttribute("height",1.8);
			cylinderz_cylinder.setAttribute("radius",0.05);
			var transz_cone = document.createElement('Transform');
			transz_cone.setAttribute("translation","0 1.9 0");
			var shapez_cone = document.createElement('Shape');
			var appearancez_cone = document.createElement('Appearance');
			appearancez_cone.setAttribute("use","color3");
			var conez_cone = document.createElement('Box');
			conez_cone.setAttribute("def",'z2');
			conez_cone.setAttribute("size","0.2 0.2 0.2");
			appearancez_cylinder.appendChild(materialz_cylinder);
			shapez_cylinder.appendChild(appearancez_cylinder);
			shapez_cylinder.appendChild(cylinderz_cylinder);
			transz_cylinder.appendChild(shapez_cylinder);
			shapez_cone.appendChild(appearancez_cone);
			shapez_cone.appendChild(conez_cone);
			transz_cone.appendChild(shapez_cone);
			transz.appendChild(transz_cylinder);
			transz.appendChild(transz_cone);
			transz0.appendChild(transz);
			/*--------------------------z轴end-----------------------------*/
			trans.appendChild(transy0);
			trans.appendChild(transx0);
			trans.appendChild(transz0);
			
			
			// 将坐标系添加到被点击的模型上
			if(currentCoordinate.nodeType==1){
				currentCoordinate.appendChild(trans);
			}else{
				currentCoordinate._xmlNode.appendChild(trans);
			}
			
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
			}
		}
	});
});