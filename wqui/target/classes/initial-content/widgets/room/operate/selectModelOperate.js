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

define("widgets/room/operate/selectModelOperate", [
    "widgets/room/utils/boundingBox",
    "dojo/topic"
], function(
    BoundingBox,
    topic
){
    var _boundingBox = null;
	function createBBox(name){
		var transform = document.createElement("Transform");
		transform.setAttribute("DEF", name);
		transform.setAttribute("id", name);
		transform.setAttribute("render", "false");
		var shape_node = document.createElement("Shape");
		var appearance_node = document.createElement("Appearance");
		var material_node = document.createElement("Material");
		material_node.setAttribute("transparency", "0.7");
		material_node.setAttribute("diffuseColor", "#ffa500");
		var box_node = document.createElement("Box");
		appearance_node.appendChild(material_node);
		shape_node.appendChild(appearance_node);
		shape_node.appendChild(box_node);
		transform.appendChild(shape_node);
		return transform;
	}
	
	
	/**
	 * 共有方法
	 */
	var selectModuleState = dojo.declare([],{		
		constructor : function(x3d){
			room_scene = document.getElementById("room_scene");
			roomEdit_scene = document.getElementById("roomEdit_scene");
            _boundingBox = new BoundingBox();
		},
		/**
		 * 将包围盒与选中的模型绑定
		*/
		bindingBox : function(modelObj){
			var translation = modelObj._xmlNode.getAttribute("translation");
			var rotation = modelObj._xmlNode.getAttribute("rotation");
			var scale = modelObj._xmlNode.getAttribute("scale");
			
			var bbox = _boundingBox.getInitBoundingBox(modelObj);
			var min = bbox[0];
			var max = bbox[1];
			var size = max.subtract(min);
			var boundingBox = document.getElementById("boundingBox_room");
			var boundingBox_roomEdit = document.getElementById("boundingBox_roomEdit");
			boundingBox_roomEdit.setAttribute("render", "true");
			boundingBox_roomEdit.setAttribute("belongs", modelObj._DEF);
			boundingBox_roomEdit.setAttribute("translation", translation);
			boundingBox_roomEdit.setAttribute("rotation", rotation);
			boundingBox_roomEdit.setAttribute("scale", scale);
			 
			var x3dom_node = boundingBox_roomEdit._x3domNode._childNodes[0];
			var shape_node = x3dom_node._childNodes;
			for(var i = 0; i < shape_node.length; i++){
				if(shape_node[i]._xmlNode.nodeName == "BOX"){
					var _box_node = shape_node[i];
					_box_node._xmlNode.setAttribute("size", size.x + " " + size.y + " " + size.z);
					
				} 
			}
			
			return 1;
		},
        // 隐藏box
        hideBoundingBox : function(){
            var boundingBox = document.getElementById("boundingBox_roomEdit");
			boundingBox._x3domNode._xmlNode.setAttribute("render", "false");
			return 1;
        },
		 // 创建box
		createBox : function(){
			var room_s = createBBox("boundingBox_room");	
			room_scene.appendChild(room_s);
			var roomEdit_s = createBBox("boundingBox_roomEdit");	
			roomEdit_scene.appendChild(roomEdit_s);
			return 1;	
		},
		unload : function(){}
	});
	return selectModuleState;
 });