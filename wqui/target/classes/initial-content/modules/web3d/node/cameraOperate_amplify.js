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
* 实现摄像机的推进放大功能
*/


define("web3d/node/cameraOperate_amplify",["dojo/topic"],function(topic){
	var cameraOperate = dojo.declare([],{
		constructor : function(x3d){
			var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 0 0 1").toMatrix();
			var oldrotmat;
			topic.subscribe("shortcut3d/camera/amplify",function(){
				if(Spolo.viewarea._pickingInfo.pickObj){
					var viewarea = x3d.runtime.canvas.doc._viewarea;
					var viewmatrix = viewarea.getViewMatrix();
					var viewpoint = viewarea._scene.getViewpoint();
					var pick_transfo_world = Spolo.selectedObj._trafo.e3();
					
					//使红点置于物体上
					topic.publish("cameraOperate_mrs/cameraPosition",pick_transfo_world);
					
					var scale = Spolo.selectedObj._vf.scale;
					
					var pick_mesh = Spolo.viewarea._pickingInfo.pickObj._cf.geometry.node._mesh;
					
					//计算包围盒最大距离
					// console.log(Spolo.selectedObj);

					//遍历包围盒
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
						}
					}
					var maxvec = new x3dom.fields.SFVec3f(logcoords[0],logcoords[1],logcoords[2]);
					
					maxvec = maxvec.multComponents(scale);
					
					var fov = viewpoint.getFieldOfView();
					
					var dist1 = Math.abs((maxvec.x) / Math.tan(fov/2.0));
					var dist2 = Math.abs((maxvec.y) / Math.tan(fov/2.0));
					var dist3 = Math.abs((maxvec.z) / Math.tan(fov/2.0));
					
					var dis1 = (dist1 > dist2 ? (dist1 > dist3 ? dist1 : dist3) : (dist2 > dist3 ? dist2 : dist3));
					
					//计算要到达的点
					var dis = new x3dom.fields.SFVec3f(0,0,dis1);
					var disvec_view = dis.add(viewmatrix.e3());
					disvec_matrix_view = x3dom.fields.SFMatrix4f.translation(disvec_view);
					var disvec_matrix_world = viewmatrix.inverse().mult(disvec_matrix_view);
					
					var tarvec = pick_transfo_world.add(disvec_matrix_world.e3());
					tarvec_matrix_view = x3dom.fields.SFMatrix4f.translation(tarvec.negate());
					//旋转角度
					var rotmat = current_rotmat.mult(viewarea._rotMat.mult(viewarea._transMat));
					current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 0 0 1").toMatrix();
					if(oldrotmat){
						rotmat = oldrotmat.mult(rotmat);
					}
					rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));
					
					var tar = rotmat.mult(tarvec_matrix_view);
					
					viewarea.animateTo(tar, viewpoint);
					
					oldrotmat = rotmat;
				}
			});
			
			topic.subscribe("shortcut3d/camera/reset_a", function(){
				oldrotmat = null;
			});
			
			topic.subscribe("toolbar/camera/locateToFront", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 0 0 1").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToBack", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 3.14").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToLeft", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 1.57").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToRight", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 -1.57").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToTop", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 1.57").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToBottom", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 -1.57").toMatrix();
			});
			topic.subscribe("toolbar/camera/locateToFree", function(){
				current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 0 0 1").toMatrix();
			});
			
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
		}
	});
	
	return cameraOperate;
});

