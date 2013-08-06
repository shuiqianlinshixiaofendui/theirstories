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
 
define("widgets/room/operate/cameraOperate", ["dojo/_base/declare","dojo/topic"], function(declare,topic){
    
    var x3domViewarea = null;
    var _x3d = null;
    var _x3dEdit = null;
    
    function cameraRotate(){
		
        var alpha = (dy * 2 * Math.PI) / x3domViewarea._width;
		var beta = (dx * 2 * Math.PI) / x3domViewarea._height;
		var mat = x3domViewarea.getViewMatrix();

		var mx = x3dom.fields.SFMatrix4f.rotationX(alpha);
		var my = x3dom.fields.SFMatrix4f.rotationY(beta);

        var center = Spolo.capPosition;
		mat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));
		
       
        x3domViewarea._rotMat = x3domViewarea._rotMat
            .mult(x3dom.fields.SFMatrix4f.translation(center))
            .mult(mat.inverse())
            .mult(mx)
            .mult(mat)
            .mult(x3dom.fields.SFMatrix4f.translation(center.negate()))	
        
            .mult(x3dom.fields.SFMatrix4f.translation(center))		
            .mult(my)		
            .mult(x3dom.fields.SFMatrix4f.translation(center.negate()))
			
	}
    
    function cameraMove(thisid){
		
        var capPosition_world;
        if(thisid == "room_x3d"){
            capPosition_world = Spolo.capPosition;
        }else{
            capPosition_world = Spolo.capPositionEdit;
        }
		var viewmatrix = x3domViewarea.getViewMatrix();
		var capPosition_view = x3dom.fields.SFMatrix4f.translation(capPosition_world).mult(viewmatrix);
	
		if (x3domViewarea._scene._lastMin && x3domViewarea._scene._lastMax)
		{
			d = (x3domViewarea._scene._lastMax.subtract(x3domViewarea._scene._lastMin)).length();
			d = (d < x3dom.fields.Eps) ? 1 : d;
		}
		else
		{
			min = x3dom.fields.SFVec3f.MAX();
			max = x3dom.fields.SFVec3f.MIN();

			ok = x3domViewarea._scene.getVolume(min, max, true);
			if (ok) {
				x3domViewarea._scene._lastMin = min;
				x3domViewarea._scene._lastMax = max;
			}

			d = ok ? (max.subtract(min)).length() : 10;
			d = (d < x3dom.fields.Eps) ? 1 : d;
		}

		vec = new x3dom.fields.SFVec3f(d*dx/x3domViewarea._width, d*(-dy)/x3domViewarea._height, 0);
		x3domViewarea._movement = x3domViewarea._movement.add(vec);

		//TODO; move real distance along viewing plane
		x3domViewarea._transMat = viewpoint.getViewMatrix().inverse().
		mult(x3dom.fields.SFMatrix4f.translation(x3domViewarea._movement)).
		mult(viewpoint.getViewMatrix());
		
		// 移动后将旋转中心位置改变
		var viewmatrix2 = x3domViewarea.getViewMatrix();
		capPosition_view_new = new x3dom.fields.SFVec3f(0,0,capPosition_view._23);
		capPosition_world_new = viewmatrix2.inverse().mult(x3dom.fields.SFMatrix4f.translation(capPosition_view_new)).e3();
		Spolo.capPosition = capPosition_world_new;
        if(thisid == "room_x3d"){
            Spolo.capPosition = capPosition_world_new;
        }else{
            Spolo.capPositionEdit = capPosition_world_new;
        }
	}
    
    function cameraScale(thisid){
		
        var capPosition;
        if(thisid == "room_x3d"){
            capPosition = Spolo.capPosition;
        }else{
            capPosition = Spolo.capPositionEdit;
        }
		
		// 获取摄像机位置
		var viewmatrix = x3domViewarea.getViewMatrix();
		var cameraPosition = x3dom.fields.SFMatrix4f.translation(new x3dom.fields.SFVec3f(0,0,0)).mult(viewmatrix.inverse()).e3();
		
		var distance = cameraPosition.subtract(capPosition);
		
	
		if (x3domViewarea._scene._lastMin && x3domViewarea._scene._lastMax)
		{
			d = (x3domViewarea._scene._lastMax.subtract(x3domViewarea._scene._lastMin)).length();
			d = (d < x3dom.fields.Eps) ? 1 : d;
		}
		else
		{
			min = x3dom.fields.SFVec3f.MAX();
			max = x3dom.fields.SFVec3f.MIN();

			ok = x3domViewarea._scene.getVolume(min, max, true);
			if (ok) {
				x3domViewarea._scene._lastMin = min;
				x3domViewarea._scene._lastMax = max;
			}

			d = ok ? (max.subtract(min)).length() : 10;
			d = (d < x3dom.fields.Eps) ? 1 : d;
		}
        
		vec = new x3dom.fields.SFVec3f(0, 0, d*(dx+dy)/x3domViewarea._height);
		
		if( distance.length()-vec.z <=0.5){
			if(vec.z <0){
			
			}else{
				return;
			}
		}
		
		x3domViewarea._movement = x3domViewarea._movement.add(vec);
        
       
        if( x3dom.isa( viewpoint, x3dom.nodeTypes.OrthoViewpoint) ) {
            var factorX =  d*(dx+dy)/x3domViewarea._height;
            var factorY =  d*(dx+dy)/x3domViewarea._width;
            var p = viewpoint._vf.fieldOfView;
            var left = p[0] - factorX;
            var right = p[2] + factorX;
            var bottom = p[1] - factorY;
            var top = p[3] + factorY;
            if(bottom > 0 || top < 0){
				return;
			}
            var newFov = new x3dom.fields.MFFloat([left, bottom, right, top]);
            viewpoint._vf.fieldOfView = newFov;
            viewpoint._projMatrix = null;
        } else {
            //TODO; move real distance along viewing ray
            x3domViewarea._transMat = viewpoint.getViewMatrix().inverse().
            mult(x3dom.fields.SFMatrix4f.translation(x3domViewarea._movement)).
            mult(viewpoint.getViewMatrix());
        }
        
	}
    
    var moveState = false;
    var rotateState = false;
    var scaleState = false;
    return declare([], {
        constructor : function(x3d, x3dEdit){
			_x3d = x3d;
			_x3dEdit = x3dEdit;
			/*
            x3dom.Viewarea.prototype.onDrag = function (x, y, buttonState){
                var thisid = event.target.id.split("-");
                if(thisid[1] == "room_x3d"){
                    x3domViewarea = x3d.runtime.canvas.doc._viewarea;
                }else{
                    x3domViewarea = x3dEdit.runtime.canvas.doc._viewarea;
                }
                x3domViewarea.handleMoveEvt(x, y, buttonState);
                
                // 当第一次操作时，x3domViewarea._lastX和x3domViewarea._lastY是-1，所以第一次操作需要缓冲一下，第二次onDrag时才开始正式的操作
                if( x3domViewarea._lastX == -1 || x3domViewarea._lastY == -1){
                    x3domViewarea._lastX = x;
                    x3domViewarea._lastY = y;
                }else{
                    dx = x - x3domViewarea._lastX;
                    dy = y - x3domViewarea._lastY;
                    
                    viewpoint = x3domViewarea._scene.getViewpoint();
                    
                    if(rotateState){
                        if(thisid[1] == "room_x3d"){
                            cameraRotate();
                        }
                    }
                    if (moveState){
                       cameraMove(thisid[1]);
                    }
                    if (scaleState){
                       cameraScale(thisid[1]);
                    }
                    
                    x3domViewarea._dx = dx;
                    x3domViewarea._dy = dy;

                    x3domViewarea._lastX = x;
                    x3domViewarea._lastY = y;                                    
                }
                
            };
			*/
		},
		x3domOnDrag : function (x, y, buttonState, event){
			var thisid = event.target.id.split("-");
			if(thisid[1] == "room_x3d"){
				x3domViewarea = _x3d.runtime.canvas.doc._viewarea;
			}else{
				x3domViewarea = _x3dEdit.runtime.canvas.doc._viewarea;
			}
			x3domViewarea.handleMoveEvt(x, y, buttonState);
			
			// 当第一次操作时，x3domViewarea._lastX和x3domViewarea._lastY是-1，所以第一次操作需要缓冲一下，第二次onDrag时才开始正式的操作
			if( x3domViewarea._lastX == -1 || x3domViewarea._lastY == -1){
				x3domViewarea._lastX = x;
				x3domViewarea._lastY = y;
			}else{
				dx = x - x3domViewarea._lastX;
				dy = y - x3domViewarea._lastY;
				
				viewpoint = x3domViewarea._scene.getViewpoint();
				
				if(rotateState){
					if(thisid[1] == "room_x3d"){
						cameraRotate();
					}
				}
				if (moveState){
				   cameraMove(thisid[1]);
				}
				if (scaleState){
				   cameraScale(thisid[1]);
				}
				
				x3domViewarea._dx = dx;
				x3domViewarea._dy = dy;

				x3domViewarea._lastX = x;
				x3domViewarea._lastY = y;                                    
			}
			
		},
        
        bindMove : function(){
            moveState = true;
        },
        
        bindRotate : function(){
            rotateState = true;
        },
        
        bindScale : function(){
            scaleState = true;
        },
        
        clearBind : function(){
            moveState = false;
            rotateState = false;
            scaleState = false;
        },
        
        unload : function(){
        
        },
        
    });
});