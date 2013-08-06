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
	负责处理摄像机的视角
*/
define("widgets/room/operate/viewOperate",["widgets/room/utils/boundingBox"],function(BoundingBox){
    var _boundingBox = null;
    var minx = 0,miny = 0,minz = 0,maxx = 0,maxy = 0,maxz = 0;
	var viewOperate = dojo.declare([],{
		//获取天棚的包围盒
		ceiling_bbox : function(){ 
			var childrens = _scene.children;
			var flag = false;
            for(var i = 0; i < childrens.length; i++){
				if(childrens[i].nodeName == "GROUP"){
					var groups = childrens[i];
					var trans = groups.children[0];
					var _subtype = trans.getAttribute("subType");
					if(_subtype == "CEILING" ){
						var bbox = _boundingBox.getBoundingBox(trans._x3domNode);
                        if(!flag){
                            minx = bbox.min.x;
                            miny = bbox.min.y;
                            minz = bbox.min.z;
                            maxx = bbox.max.x;
                            maxy = bbox.max.y;
                            maxz = bbox.max.z;
                            flag = true;
                        }else{
                            minx = minx > bbox.min.x ? bbox.min.x : minx ;
                            miny = miny > bbox.min.y ? bbox.min.y : miny ;
                            minz = minz > bbox.min.z ? bbox.min.z : minz ;
                            maxx = maxx > bbox.max.x ? maxx : bbox.max.x;
                            maxy = maxy > bbox.max.y ? maxy : bbox.max.y;
                            maxz = maxz > bbox.max.z ? maxz : bbox.max.z;
                        }
						var min = new x3dom.fields.SFVec3f(minx,miny,minz);
						var max = new x3dom.fields.SFVec3f(maxx,maxy,maxz);
					}
				}
				
			}
			return [min,max];
		},
		constructor : function(x3d, x3dEdit){
            this.x3d = x3d;
            this.x3dEdit = x3dEdit;
			_scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
            _boundingBox = new BoundingBox();
			this.TopView();
		},
		TopView :function(){
			var bbox = this.ceiling_bbox();
			var min = bbox[0];
			var max = bbox[1];
            // 计算包围盒中心
            var center = (min.add(max)).multiply(0.5);
            // 计算包围盒直径
            var size = max.subtract(min);
            var diameter = size.length();
            var camera = document.getElementById("camera");
            // console.log(camera, " camera");
            // console.log(center, " center");
            // 因为旋转，位置轴要对应
            var pos = center.x + " " + center.z + " " + center.y;
            camera.setAttribute("position", pos);
            // 转到指定位置
            var x = "z", y = "x", z = "y";
            var sign = 1;
            var from = new x3dom.fields.SFVec3f(0, 0, -1);
            var to = new x3dom.fields.SFVec3f(0, sign, 0);
                        
            var quat = x3dom.fields.Quaternion.rotateFromTo(from, to);
            var viewmat = quat.toMatrix();
            
            var viewarea = this.x3d.runtime.canvas.doc._viewarea;
            var viewareaEdit = this.x3dEdit.runtime.canvas.doc._viewarea;
            var viewpoint = viewarea._scene.getViewpoint();
            var viewpointEdit = viewareaEdit._scene.getViewpoint();
            var fov = viewpoint.getFieldOfView();

            var dia = max.subtract(min);
            var dist1 = (dia[y]/2.0) / Math.tan(fov/2.0) - sign * (dia[z]/2.0);
            var dist2 = (dia[x]/2.0) / Math.tan(fov/2.0) - sign * (dia[z]/2.0);

            dia = min.add(dia.multiply(0.5));
            dia[z] += sign * (dist1 > dist2 ? dist1 : dist2) * 1.001;
            
            viewmat = viewmat.mult(x3dom.fields.SFMatrix4f.translation(dia.multiply(-1)));

            viewarea.animateTo(viewmat, viewpoint);
            viewareaEdit.animateTo(viewmat, viewpointEdit);
            
		},
		unload : function(){}
		/*//获取目标位置
			 var translation = this.ceiling_location();
			//获取摄像机的位置
			var childrens = _scene.children;
			for(var i = 0; i < childrens.length; i++){
				//console.log(childrens[i].nodeName,"childrens[i].nodeName");
				if(childrens[i].nodeName == "VIEWPOINT"){
					var viewpoint = childrens[i];
					viewpoint.setAttribute("position",translation);
					var rot = "1 0 0" + " " + (- Math.PI/2);
					viewpoint.setAttribute("orientation",rot);
					//console.log(viewpoint,"viewpoint1");
					break;
				}
				
			}*/
	});	
	return viewOperate;
})