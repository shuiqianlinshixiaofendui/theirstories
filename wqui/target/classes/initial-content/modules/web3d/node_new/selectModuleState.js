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

/***
    处理模型反选效果
*/

define("web3d/node_new/selectModuleState", ["dojo/topic"], function(topic){
	var min = null;
	var max = null;
	var oldRot = 0;
	var parent = null;
	//获取box的直径径       
	function GetDiameter(){
		//console.log("Spolo.viewarea._pickingInfo.pickObj :" + Spolo.viewarea._pickingInfo.pickObj);
		if(Spolo.mesh){
			min = new x3dom.fields.SFVec3f(0, 0, 0);
			max = new x3dom.fields.SFVec3f(0, 0, 0);
			var mesh = Spolo.mesh;
			mesh.getBBox(min, max, true);
			max = mesh._max;
			min = mesh._min;
			var size = max.subtract(min);
			return size;
		}
	}
	//求坐标原点离模型中心位置的偏移量
	function GetOffset(diameter){
		var radius = diameter.multiply(0.5);
		var offset = max.subtract(radius); 
		return offset;
	}
	
	var selectModuleState = dojo.declare([],{		
		constructor : function(x3d){
			this._x3d = x3d;
		},
		/**
		 * 1.选中模型后，先将之前选中的模型中添加的box删除
		   2.创建一个box
		   2.获取选中模型的位置坐标原点离模型中心位置的偏移量offset。
		   3.将box的中心移到模型的中心位置上。
		   4.设置box的大小
		*/
		addBox : function(){
			if(Spolo.selectedObj){
                // console.log("123") ;
				// console.log(Spolo.selectedObj._DEF);
				// console.log(Spolo.oldSelectedObj);
                topic.publish("command/module_action/modelLight",Spolo.selectedObj._DEF) ;
				if((Spolo.oldSelectedObj==null)||(Spolo.selectedObj._DEF != Spolo.oldSelectedObj._DEF)){
					this.removeBox();
				}
				var selecter = Spolo.selectedObj;
				var flag = false;
				var childNodes = selecter._childNodes;
				for(var i = 0; i < childNodes.length; i++){
					if(childNodes[i]._DEF == "boundingBox"){
						flag = true;
						break;
					}
				}
				if(Spolo.selectedObj._DEF != "boundingBox" && Spolo.selectedObj._DEF && !flag){
					var translation = Spolo.selectedObj._vf.translation;
					var rotation = Spolo.selectedObj._vf.rotation;
					var scale = Spolo.selectedObj._vf.scale;
                    // 计算位置
                    var diameter = selecter.getBoundingBoxSize();
                    var drag_pos = x3dom.fields.SFVec3f.copy(Spolo.viewarea._pickingInfo.pickPos);
                    // console.log(drag_pos, " drag_pos");
                    var offset_b = x3dom.fields.SFVec3f.copy(0, 0, 0).subtract(drag_pos);
					var offset_m = Spolo.selectedObj._vf.translation.subtract(drag_pos);
					var offset = offset_m.subtract(offset_b);
                    
					var	trans  = this.createBox();
					selecter._xmlNode.appendChild(trans);
					var childNodes = selecter._childNodes;
					var boundingBox = null;
					for(var i = 0; i < childNodes.length; i++){
						if(childNodes[i]._DEF == "boundingBox"){
							boundingBox = childNodes[i];
							boundingBox._xmlNode.setAttribute("render", "true");
							boundingBox._xmlNode.setAttribute("scale", "1.55 1.2 1.2");
							
						}
					}
					// console.log(boundingBox, " boundingBox");
					var x3dom_node = boundingBox._childNodes[0];
					var shape_node = x3dom_node._childNodes;
					for(var i = 0; i < shape_node.length; i++){
						if(shape_node[i]._xmlNode.nodeName == "BOX"){
							var _box_node = shape_node[i];
							_box_node._xmlNode.setAttribute("size", diameter.x + " " + diameter.y + " " + diameter.z);
							
						} 
					}
				}
			}
		},
		
		 // 创建box
		 
		createBox : function(){
			
				//创建一个透明的box，初始状态设置为隐藏
				var transform = document.createElement("Transform");
				transform.setAttribute("_DEF", "boundingBox");
				transform.setAttribute("id", "boundingBox");
				transform.setAttribute("render", "false");
				var shape_node = document.createElement("Shape");
				var appearance_node = document.createElement("Appearance");
				var material_node = document.createElement("Material");
				material_node.setAttribute("transparency", "0.7");
				material_node.setAttribute("diffuseColor", "#FF00FF");
				var box_node = document.createElement("Box");
				appearance_node.appendChild(material_node);
				shape_node.appendChild(appearance_node);
				shape_node.appendChild(box_node);
				transform.appendChild(shape_node);
				return transform;
		},
		// 点击其它模型时删除之前的box
		removeBox : function(){
			
			if(Spolo.oldSelectedObj){
				var childNodes = Spolo.oldSelectedObj._childNodes;
				for(var i = 0; i < childNodes.length; i++){
					if(childNodes[i]._DEF == "boundingBox"){
						Spolo.oldSelectedObj.removeChild(childNodes[i]);
						break;
					}
				}
                var _childNodes = Spolo.oldSelectedObj._xmlNode.childNodes;
                for(var i = 0; i < _childNodes.length; i++){
                    var _def = _childNodes[i].getAttribute("_DEF") ;
					if(_def == "boundingBox"){
						Spolo.oldSelectedObj._xmlNode.removeChild(_childNodes[i]);
						break;
					}
				}
			}
		},
		//切换模式时，删除当前的box
		removeCurBox : function(){
			if(Spolo.selectedObj){
				var childNodes = Spolo.selectedObj._childNodes;
				for(var i = 0; i < childNodes.length; i++){
					if(childNodes[i]._DEF == "boundingBox"){
						Spolo.selectedObj.removeChild(childNodes[i]);
					}
				}
			}
		},
        unload : function(){
            
        }
	});
	return selectModuleState;
 });