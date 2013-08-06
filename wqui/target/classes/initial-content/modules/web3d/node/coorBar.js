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
define("web3d/node/coorBar",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
				var viewarea = x3d.runtime.canvas.doc._viewarea;
				
				//拦截x3dom.Viewarea.prototype.navigateTo
				var old_x3dom_navigateTo = x3dom.Viewarea.prototype.navigateTo;
				x3dom.Viewarea.prototype.navigateTo = function(timeStamp){
					old_x3dom_navigateTo.call(this,timeStamp);
					topic.publish("viewpoint/transform/changed");
				}
				
				//拦截window.onresize
				window.onresize = function(){
					setTimeout(function(){
						topic.publish("viewpoint/viewareaWAndH/changed");
					}, 100);
				}
				
				require(["web3d/node/axisPan"],function(axisPan){
					//获取viewpoint的坐标参数
					var mat_view  = viewarea.getViewMatrix() ;
					var e_viewpoint = viewarea._scene.getViewpoint();
					var e_viewtrafo = e_viewpoint.getTransformation();
					e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
					var e_mat = e_viewtrafo.inverse();
					var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
					rotation.setValue(e_mat);
					var translation = e_mat.e3();
					var rot = rotation.toAxisAngle();
					
					//获取viewpoint，在外层加一个transform
					var scene = viewarea._scene;
					var viewpoint = viewarea._scene.getViewpoint();
					var trasviewpoint=document.createElement('Transform');
					trasviewpoint.setAttribute("id","trasviewpoint");
					trasviewpoint.setAttribute("translation",translation.x+" "+translation.y+" "+translation.z);
					trasviewpoint.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z);
					trasviewpoint.appendChild(viewpoint._xmlNode);
					scene._xmlNode.appendChild(trasviewpoint);
					scene.removeChild(viewpoint);
					
					//将坐标轴提示加入到transform中
					var trascoor=document.createElement('Transform');
					var cm=new axisPan();
					trascoor.setAttribute("id","trascoor");
					var w=viewarea._width;
					var h=viewarea._height;
					trascoor.setAttribute("translation",(translation.x-w/260+0.2)+" "+(translation.y-h/260+0.2)+" "+(translation.z-(h/102+10)));
					trascoor.setAttribute("scale","0.25 0.25 0.25");
					cm.addCoordinate(trascoor,"");
					trasviewpoint.appendChild(trascoor);
				});	  
				topic.subscribe("viewpoint/transform/changed",function(){
					var mat_view  = viewarea.getViewMatrix() ;
					var e_viewpoint = viewarea._scene.getViewpoint();
					var e_viewtrafo = e_viewpoint.getTransformation();
					e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
					var e_mat = e_viewtrafo.inverse();
					var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
					rotation.setValue(e_mat);
					var translation = e_mat.e3();
					var rot = rotation.toAxisAngle();
					
					var trasviewpoint=document.getElementById("trasviewpoint");
					var trascoor=document.getElementById("trascoor");
					trasviewpoint.setAttribute("translation",translation.x+" "+translation.y+" "+translation.z);
					trasviewpoint.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z+" "+rot[1]);
					trascoor.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z+" "+(-rot[1]));
					//console.log(translation.x+" "+translation.y+" "+translation.z+"---------"+rot[0].x+" "+rot[0].y+" "+rot[0].z+" "+rot[1]);
				});
				topic.subscribe("viewpoint/viewareaWAndH/changed",function(){
					var mat_view  = viewarea.getViewMatrix() ;
					var e_viewpoint = viewarea._scene.getViewpoint();
					var e_viewtrafo = e_viewpoint.getTransformation();
					e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
					var e_mat = e_viewtrafo.inverse();
					var translation = e_mat.e3();
					var w=viewarea._width;
					var h=viewarea._height;
					
					var trascoor=document.getElementById("trascoor");
					trascoor.setAttribute("translation",(translation.x-w/260+0.2)+" "+(translation.y-h/260+0.2)+" "+(translation.z-(h/102+10)));
				});
			}
		});
	}
);

