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

define("web3d/operate/operate_rollback",["dojo/topic"],function(topic){
	var operrate_rollback = dojo.declare([],{
		constructor : function(x3d){
			topic.subscribe("keybord/rollback/update", function(data){
				require(["web3d/Lib/x3domLib"], function(x3domLib){
					var x3domLib = new x3domLib(x3d);
					var transform = x3domLib.getTransform(data.name);
					if(transform){
						//console.log(transform)
						var rotA = new x3dom.fields.SFVec3f(data.rotation_axis_angle[0], data.rotation_axis_angle[1], data.rotation_axis_angle[2]);
						var _rot = x3dom.fields.Quaternion.axisAngle(rotA, data.rotation_axis_angle[3]); 
						var scale = data.scale[0] + "," + data.scale[1] + "," + data.scale[2];
						var translation = data.location[0] + "," + data.location[1] + "," + data.location[2];
						var rotation = _rot.x + "," + _rot.y + "," + _rot.z + "," + _rot.w;
						// console.log("scale : " + scale);
						// console.log("translation : " + translation);
						// console.log("rotation : " + rotation);
						transform.setAttribute("scale", scale);
						transform.setAttribute("translation", translation);
						transform.setAttribute("rotation", rotation);
					}
				});					
			});
		}
	});
	return operrate_rollback;
});