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
	摄像机子模块
	负责处理摄像机事件：
	* 摄像机推进放大
*/

define("web3d/operate/operate_amplifyView",["dojo/topic"],function(topic){
	var current_rotmat;
	var viewarea;
	var viewpoint;
	
	//获得当前视角
	// function getCurrentView(){
		// if(Spolo.current_view == Spolo.view_list[0]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 0").toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[1]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 0").toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[2]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 "+Math.PI).toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[3]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 "+Math.PI/2).toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[4]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 "+(-Math.PI/2)).toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[5]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 "+Math.PI/2).toMatrix();
		// }else if(Spolo.current_view == Spolo.view_list[6]){
			// current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 "+(-Math.PI/2)).toMatrix();
		// }
	// }
	
	// 计算包围盒离中心最远的点到中心的距离
	function calculateDis(){
		//console.log("viewarea._pickingInfo.pickObj :" + viewarea._pickingInfo.pickObj);
		var dis;
		if(viewarea._pickingInfo.pickObj){
			var scale = Spolo.selectedObj._vf.scale;
			var pick_mesh = viewarea._pickingInfo.pickObj._cf.geometry.node._mesh;

			// 遍历包围盒
			// findMesh(Spolo.selectedObj);
			
			var coords = pick_mesh._positions[0];
			var n = coords.length;
			var logcoords = [];
			var maxdis = Math.sqrt((coords[0] * coords[0]) + (coords[1] * coords[1]) + (coords[2] * coords[2]));
			for (var i=3; i<n; i+=3){
				var t = Math.sqrt((coords[i + 0] * coords[i + 0]) + (coords[i + 1] * coords[i + 1]) + (coords[i + 2] * coords[i + 2]));
				if(maxdis < t){
					maxdix = t;
					logcoords[0] = coords[i + 0];
					logcoords[1] = coords[i + 1];
					logcoords[2] = coords[i + 2];
				} else {
					logcoords[0] = coords[0];
					logcoords[1] = coords[1];
					logcoords[2] = coords[2];
				}
			}
			var maxvec = new x3dom.fields.SFVec3f(logcoords[0],logcoords[1],logcoords[2]);
			
			maxvec = maxvec.multComponents(scale);
			
			var fov = viewpoint.getFieldOfView();
			
			var dis1 = Math.abs((maxvec.x) / Math.tan(fov/2.0));
			var dis2 = Math.abs((maxvec.y) / Math.tan(fov/2.0));
			var dis3 = Math.abs((maxvec.z) / Math.tan(fov/2.0));
			
			dis = (dis1 > dis2 ? (dis1 > dis3 ? dis1 : dis3) : (dis2 > dis3 ? dis2 : dis3));
		} else {
			dis = 0;
		}
		return dis;
	}
	
	// 遍历包围盒
	// function findMesh(node){
		// if(node._mesh){
			// console.log("find");
		// }
		// if(node._childNodes && node._childNodes.length != 0){
			// for(var i=0 ; i<node._childNodes.length ; i++){
				// findMesh(node._childNodes[i]);
			// }
		// }
	// }
	
	
	var operate_amplifyView = dojo.declare([],{
		
		constructor : function(x3d){
			viewarea = x3d.runtime.canvas.doc._viewarea;
			viewpoint = viewarea._scene.getViewpoint();
			var sync = Spolo.dataSync;
			var data = sync.get_camera_data();
			current_rotmat = data.current_rotmat;
		},
		
		// 响应摄像机推进放大操作(此处怎么记录oldrotmat成为难点)
		amplify : function(){
		
			var viewmatrix = viewarea.getViewMatrix();
			//console.log("Spolo.selectedObj : " + Spolo.selectedObj);
			if(Spolo.selectedObj){
				var pick_transfo_world = Spolo.selectedObj._trafo.e3();
			
				var sync = Spolo.dataSync;
				var data = sync.get_camera_data();
				
				// 将红心置于被点击物体上
				var cap = data.cameraAssisPoint;
				cap.receivePos(pick_transfo_world);
				
				var oldrotmat = data.last_matrix;
				
				// 计算要到达的点
				var calculate_dis = calculateDis();
				//console.log("calculate_dis :" + calculate_dis);
				if(calculate_dis){
					var dis = new x3dom.fields.SFVec3f(0,0,calculate_dis);
					var disvec_view = dis.add(viewmatrix.e3());
					disvec_matrix_view = x3dom.fields.SFMatrix4f.translation(disvec_view);
					var disvec_matrix_world = viewmatrix.inverse().mult(disvec_matrix_view);
					
					var tarvec = pick_transfo_world.add(disvec_matrix_world.e3());
					tarvec_matrix_view = x3dom.fields.SFMatrix4f.translation(tarvec.negate());
					
					// 计算旋转角度
					var rotmat = current_rotmat.mult(viewarea._rotMat.mult(viewarea._transMat));
					current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 0 0 1").toMatrix();
					
					var sync = Spolo.dataSync;
					var data = sync.get_camera_data();
					data.current_rotmat = current_rotmat;
					sync.update_camera_data(data);
					
					rotmat = oldrotmat.mult(rotmat);
					rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));
					
					var tar = rotmat.mult(tarvec_matrix_view);
					
					viewarea.animateTo(tar, viewpoint);
					
					// 保存oldrotmat
					data.last_matrix = rotmat;
					sync.update_camera_data(data);
					
					topic.publish("command/viewpoint_action/aroundObjRotate");
					//Spolo.selectedObj = null;
				}
			}
		},
		
		unload : function (){
			
		}
	});	
	return operate_amplifyView;
});