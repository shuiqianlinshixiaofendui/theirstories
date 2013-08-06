/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("widgets/room/operate/modelOperate", [
	"dojo/_base/declare",
	"widgets/room/Lib/x3domLib",
	"dojo/dom",
	"widgets/room/operate/coordinateModuleOperate",
	"widgets/room/utils/boundingBox",
], function(declare,x3domLib,dom,coordinateModuleOperate,BoundingBox){
	var box = document.getElementById("boundingBox_roomEdit");
	var old_angle = 0;
	var _x3domLib = null;
	var _viewarea = null;
	var _coordinateModuleOperate = null;
	
	function getSelectObj(){
		var name = dom.byId("model_name").value;
		if(!name){
			return null;
		}else {
			var roomEdit_scene = document.getElementById("roomEdit_scene");
			var list = roomEdit_scene.getElementsByTagName("TRANSFORM");
			var selecter = null;
			for(var i = 0; i < list.length; i++){
				if(list[i]._x3domNode._DEF == name){
					selecter = list[i];
					break;
				}
			}
			return selecter._x3domNode;
		}
		
	}
	function getLockObj(size,modelObj){
		var lockObj = Spolo.ModuleContainer;
		var name = lockObj._xmlNode.getAttribute("subType");
		var trans = lockObj._vf.translation;
		var model_trans = modelObj._vf.translation;
		switch(name){
			case "FLOOR" :
				model_trans.y = trans.y + size.y;
			break;
			case "WALL" :
				model_trans.z = trans.z + size.z;
			break;
			case "CEILING" :
				model_trans.y = trans.y - size.y;
			break;
				
		}
		var node = modelObj._xmlNode;
		node.setAttribute("translation", model_trans.x + " " + model_trans.y + " " + model_trans.z);
		
		var def = modelObj._DEF;
		var roomScene_selectedObj = _x3domLib.getRoomSceneTransform(def);
		var trans = roomScene_selectedObj._xmlNode;
		trans.setAttribute("translation", model_trans.x + " " + model_trans.y + " " + model_trans.z);
	}
	function getBoundingBox(modelObj){
		var bbox = _BoundingBox.getBoundingBox(modelObj);
		var min = bbox.min;
		var max = bbox.max;
		var size = max.subtract(min).multiply(0.5);
		return size;
	}
	
    return declare([], {
        constructor : function(x3d, x3dEdit){
			_x3domLib = new x3domLib();
			_viewarea = x3dEdit.runtime.canvas.doc._viewarea;
			_coordinateModuleOperate = new coordinateModuleOperate();
			_BoundingBox = new BoundingBox();
		},
        
        MovePos : function(x,y,pos_z){
			var modelObj = getSelectObj();
			if(modelObj){
				var viewarea_x = (x / _viewarea._width) * 2 - 1;
				var viewarea_y = 1 -(y / _viewarea._height) * 2;
				var pos_CC = new x3dom.fields.SFVec3f(viewarea_x,viewarea_y,pos_z);
				var pos_WC = _viewarea.unprojectVector(pos_CC);
				//pos_WC = pos_WC.add(offset);
				var pos = pos_WC.x + " " + pos_WC.y + " " + pos_WC.z;
				var node = modelObj._xmlNode;
				node.setAttribute("translation", pos);
				box.setAttribute("translation", pos);
                _coordinateModuleOperate.updateCoordinate(modelObj);
				
				var def = modelObj._DEF;
				var roomScene_selectedObj = _x3domLib.getRoomSceneTransform(def);
				var trans = roomScene_selectedObj._xmlNode;
				trans.setAttribute("translation", pos);
			}
        },
        
        RotateAngle : function(angle,axis){
			var rot_axis = "";
			if(axis == "axisX"){
				axis = new x3dom.fields.SFVec3f(1, 0, 0);
			}else if(axis == "axisY"){
				axis = new x3dom.fields.SFVec3f(0, 1, 0);
			}else if(axis == "axisZ"){
				axis = new x3dom.fields.SFVec3f(0, 0, 1);
			}
			var modelObj = getSelectObj();
			if(modelObj){
				var selectedObj = modelObj;
				var node = selectedObj._xmlNode;
				var cur_angle = (Math.PI)/ 180 * angle;
				var new_angle = cur_angle - old_angle;
				if(new_angle){
					var q = x3dom.fields.Quaternion.axisAngle(axis, new_angle);
					var rot = selectedObj._vf.rotation.multiply(q);
					// 将四元数转换成：轴+ 旋转弧度值
					var _rot = rot.toAxisAngle();
					node.setAttribute("rotation", _rot[0].x + " " + _rot[0].y + " " + _rot[0].z + " " + _rot[1]);
					box.setAttribute("rotation", _rot[0].x + " " + _rot[0].y + " " + _rot[0].z + " " + _rot[1]);
				
					var def = selectedObj._DEF;
					var roomScene_selectedObj = _x3domLib.getRoomSceneTransform(def);
					var trans = roomScene_selectedObj._xmlNode;
					trans.setAttribute("rotation", _rot[0].x + " " + _rot[0].y + " " + _rot[0].z + " " + _rot[1]);
					
				}
				old_angle = cur_angle ;
                // Spolo._maintainObj.load("coordinateModuleOperate").updateCoordinate();
				_coordinateModuleOperate.updateCoordinate(modelObj);
			}
		},
        Scale:function(scaleValue){
			var modelObj = getSelectObj();
			if(modelObj){
				var selectedObj = modelObj;
				var node = selectedObj._xmlNode;
				var _scale = selectedObj._vf.scale;
				_scale.x = _scale.x * scaleValue;
				_scale.y = _scale.y * scaleValue;
				_scale.z = _scale.z * scaleValue;
				_scale = _scale.x + " " + _scale.y + " " + _scale.z;
				node.setAttribute("scale",_scale);
				box.setAttribute("scale",_scale);
				var _size = getBoundingBox(modelObj);
				getLockObj(_size,modelObj);
				_coordinateModuleOperate.updateCoordinate(modelObj);
				
				var def = selectedObj._DEF;
				var roomScene_selectedObj = _x3domLib.getRoomSceneTransform(def);
				var trans = roomScene_selectedObj._xmlNode;
				trans.setAttribute("scale", _scale);
			}
		},
		
        MoveDrag : function(){
            
        },
        
        RotateDrag : function(){
            
        },
		unload : function(){}
    });
});