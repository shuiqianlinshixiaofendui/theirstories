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
	��ģ��Ϊģ�������ת����ϵ
*/

define("web3d/node/axisRotation",["dojo/topic"],function(topic){
	// ���屻���ģ��
	var currentCoordinate = null;
	// �����Զ�������ϵtrans
	var trans = null;
	// ������ӵ�����ϵ
	var coordTransform = null ;
	
	var line = null ;
	
	var lineBool = false;
	var currentNode = null;
	
	function createLine(coor,model){
		//����ֱ��ʱ��������ϵ��
		document.getElementById("coorbar_model").setAttribute("render","false");
		// ������갴��x����ϵʱ������������ϵ�Ƴ�
		
		var lineT = document.createElement('Transform');
		
		// ����lineT
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
		//��������ϵ��ʾ�������¸�ֵ��
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
				// Ȼ������x���򴴽�һ��ֱ�ߣ���ʾ��ǰģ��������������ֱ���˶�
				createLine(coor,model);	
				lineBool = true;
			}
		}
	}
	
	return dojo.declare([],{
		constructor : function(x3d){
			
			// ������Ϣ��������ϵ�ı��ֱ�� x����
			topic.subscribe("coorDrag/coor_x_Rotation", function(model){
				moveLine("x",model);
			});
			
			// ������Ϣ��������ϵ�ı��ֱ�� y����
			topic.subscribe("coorDrag/coor_y_Rotation", function(model){
				moveLine("y",model);
			});
			
			// ������Ϣ��������ϵ�ı��ֱ�� z����
			topic.subscribe("coorDrag/coor_z_Rotation", function(model){
				moveLine("z",model);
			});
			
			// ������Ϣ�������̧��ʱ 
			topic.subscribe("coorDrag/mouseUp_Rotation", function(){
				if(document.getElementById("coorbar_model")){
					removeLine();
				}
			});
			
		},
		
		addCoordinate : function(node,model){
			// ���屻���ģ��
			currentCoordinate = node;
			var model_pos;
			var model_name;
			
			
			
			/** 
				��ǰnode���������ϵ��transform�����ǾͲ�������ϵ�ˡ�
				û�м���ִ��������루������뻹ûд�أ�
			*/
			// ����ϵ
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
			trans.setAttribute("scale",model._vf.scale.x/2+" "+model._vf.scale.y/2+" "+model._vf.scale.z/2);
			trans.setAttribute("translation",model_pos);
			//���������涨����{}������ģ��  
			{	
				//�������Ի�ı����
				 var x,y,z,r,red,green,blue;
				//�������Σ�������ƴװһ����Ĳ���
				/*����*****ѭ����ʼ_for.start**********************����**/
				for(var i=0;i<3;i++){
					 /*3.1_*.start******��ʼ�����Բ���****************************************************_*/			
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
						cir2D.setAttribute("radius",4);
						appr_node.appendChild(mater);
						shape_node.appendChild(appr_node);
						shape_node.appendChild(cir2D);
						t.appendChild(shape_node);								
						trans.appendChild(t);
						
					/*3.2_*.end************************************************************************_*/	
											
				}	
				/*________*****ѭ������_for.end**********************________**/	
			}
			/*_*____����ִ��ģ�����__________________*_*/
			
			
			// ������ϵ��ӵ��������ģ����
			if(currentCoordinate.nodeType==1){
				currentCoordinate.appendChild(trans);
				
			}else{
				currentCoordinate._xmlNode.appendChild(trans);
			}
			//console.log(trans);
			// ����Node�ڵ�
			currentNode = node;
			// ������ӵ�����ϵ
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