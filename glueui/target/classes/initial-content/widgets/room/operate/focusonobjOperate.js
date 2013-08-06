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

define("widgets/room/operate/focusonobjOperate", ["dojo/on","dojo/dom"],
function(on,dom){

    var boundingBox = null;
    return dojo.declare([],{
        constructor : function(x3d,x3dEdit){
            this.x3d = x3dEdit;
            require(["widgets/room/utils/boundingBox"], function(BoundingBox){
                boundingBox = new BoundingBox();
            });
        },
        
        focusOnObj : function(){
            var flag = false;
            if(Spolo.selectedObj){
                var _subtype = Spolo.selectedObj._xmlNode.getAttribute("subType");
                if(_subtype == "FLOOR" || _subtype == "WALL"){
                    Spolo.ModuleContainer = Spolo.selectedObj;
                    flag = true;
                }
            }
            if(flag){
                var selectedObj = Spolo.selectedObj;
                
                
                var _scene = this.x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
                var list = _scene.getElementsByTagName("group");
                var def = selectedObj._xmlNode.getAttribute("def");
                //隐藏所有
                for(var i = 0; i < list.length; i++){
                    for(var j = 0; j < list[i].childNodes.length; j++){
                        list[i].childNodes[j]._x3domNode.hide(true);
                    }
                }
                // 显示选中物体
                for(var i = 0; i < list.length; i++){
                    if(list[i].childNodes[0].getAttribute("def") == def + "_edit"){
                        for(var j = 0; j < list[i].childNodes.length; j++){
                            list[i].childNodes[j]._x3domNode.hide(false);
                        }
                    }
                }
                
                // 计算包围盒
                var bbox = boundingBox.getScaleBoundingBox(selectedObj);
                var max = bbox.max;
                var min = bbox.min;
                
                // 转到指定位置
                
                var viewarea = this.x3d.runtime.canvas.doc._viewarea;
                var viewpoint = viewarea._scene.getViewpoint();
                var fov = viewpoint.getFieldOfView();

                var subtype = selectedObj._xmlNode.getAttribute("subType");
                var x = "x", y = "y", z = "z";
                var sign = 1;
                switch(subtype){
                    case "CEILING" : sign = -1;
                    case "FLOOR" : z = "y"; x = "x"; y = "z"; break;
                    case "WALL" :
                }
                var dia = max.subtract(min);
                var dist1 = (dia[y]/2.0) / Math.tan(fov/2.0) + sign * (dia[z]/2.0);
                var dist2 = (dia[x]/2.0) / Math.tan(fov/2.0) + sign * (dia[z]/2.0);
                
                var OrthoX = dia[x]/2.0;
                var OrthoY = dia[y]/2.0;

                dia = min.add(dia.multiply(0.5));
                dia[z] += sign * (dist1 > dist2 ? dist1 : dist2) * 1.001;
                
                var translation = selectedObj._vf.translation;
                
                var axis = new x3dom.fields.SFVec3f(1,0,0);
                var rotation = x3dom.fields.Quaternion.axisAngle(axis,0);
                var viewmat = selectedObj._vf.rotation.inverse().toMatrix();
                var viewmat2 = selectedObj._vf.rotation.toMatrix();
                var point1 = new x3dom.fields.SFVec3f(0,0,0);
                var point2 = viewmat2.multMatrixPnt(new x3dom.fields.SFVec3f(0,0,dia[z]));
                var maxc = Math.abs(point2.x) > Math.abs(point2.y) ? (Math.abs(point2.z) > Math.abs(point2.x)) ? "z" : "x": (Math.abs(point2.z) > Math.abs(point2.y)) ? "z" : "y";
                switch(maxc){
                    case "x" :
                        point1.x = translation.x + point2.x;
                        point1.y = translation.y;
                        point1.z = translation.z;
                        break;
                    case "y" :
                        point1.x = translation.x;
                        point1.y = translation.y + point2.y;
                        point1.z = translation.z;
                        break;
                    case "z" :
                        point1.x = translation.x;
                        point1.y = translation.y;
                        point1.z = translation.z + point2.z;
                        break;
                }
                
                if(Spolo.x3domPhysiOpen){
                    switch(_subtype){                                                // 根据不同的类型，创建不同的向量
                        case "FLOOR" :
                            console.log("开启物理引擎：floor") ;
                            Spolo.x3domPhysi.setGravity(0,-100,0);                         // 设置物理引擎重力重心
                        break ;
                        case "CEILING" :
                        break ;
                        case "WALL" :
                            console.log("开启物理引擎： wall") ;              // 墙体需要根据rotation计算出重心的方向呢。。
                            Spolo.x3domPhysi.setGravity(0,0,-100);                         // 设置物理引擎重力重心
                        break ;
                    }
                }
                
                if(subtype == "FLOOR"){
                    axis = new x3dom.fields.SFVec3f(1,0,0);
                    rotation = x3dom.fields.Quaternion.axisAngle(axis,Math.PI/2);
                    viewmat = rotation.toMatrix();
                    point1 = new x3dom.fields.SFVec3f(translation.x, translation.y+dia[z], translation.z);
                }
                if(subtype == "CEILING"){
                    axis = new x3dom.fields.SFVec3f(1,0,0);
                    rotation = x3dom.fields.Quaternion.axisAngle(axis,-Math.PI/2);
                    viewmat = rotation.toMatrix();
                    point1 = new x3dom.fields.SFVec3f(translation.x, translation.y+dia[z], translation.z);
                }
                
                viewmat = viewmat.mult(x3dom.fields.SFMatrix4f.translation(point1.multiply(-1)));

                viewarea.animateTo(viewmat, viewpoint);
                
                if( x3dom.isa( viewpoint, x3dom.nodeTypes.OrthoViewpoint) ) {
                    var mindia = OrthoX > OrthoY ? OrthoX : OrthoY ;
                    
                    var p = viewpoint._vf.fieldOfView;
                    var proportion = mindia/p[3];
                    var left = p[0] * -proportion;
                    var right = p[2] * proportion;
                    var bottom = -mindia;
                    var top = mindia;
                    if(bottom > 0 || top < 0){
                        return;
                    }
                    var newFov = new x3dom.fields.MFFloat([left, bottom, right, top]);
                    viewpoint._vf.fieldOfView = newFov;
                    viewpoint._projMatrix = null;
                }
                //向ui发送消息，清空编辑框中的信息。
                var data = {"deleteData" :true};
				on.emit(dom.byId("EditConsole"), "event", data);
            }
            
        },
		unload : function(){}
        
    });
    
});