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
* 控制摄像机的浏览模式转化，视角转化
* 固定视角下的平移、旋转、缩放
* 等功能
*/


define("web3d/node/cameraOperate",["dojo/topic"],function(topic){
	
	// 摄像机的状态
	var cameraState = 0;
		
	// 记录摄像机视角
	var CAMERA_FREE = 0;
	var CAMERA_OTHERS = 1;
	var CAMERA_MOVE = 2; 
	var CAMERA_ROTATE = 3; 
	var CAMERA_SCALE = 4;
	
	//摄像机是否锁定
	var camera_isLocked = false;
	
	//绕物体变换模式是否锁定
	var aroundObj_isLocked;
	

	var cameraOperate = dojo.declare([],{
		constructor : function(x3d){
			var viewarea = x3d.runtime.canvas.doc._viewarea;
			var nav = viewarea._scene.getNavigationInfo();
			topic.publish("camera/cameraOperate/getAroundObjLocked",this);

			//接收到工具栏消息绕物体变换模式锁定/解锁
			topic.subscribe("toolbar/camera/rotateAtModel",function(){
				if(Spolo.selectedObj){
					aroundObj_isLocked = !aroundObj_isLocked;
				}
				
				if(!aroundObj_isLocked && (Spolo.current_view != Spolo.view_list[0])){
					// 使红点置于原位置
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			
			//接收到推进放大消息绕物体变换模式锁定
			topic.subscribe("shortcut3d/camera/amplify",function(){
				aroundObj_isLocked = true;
			});
			
			//接收到工具栏消息绕物体变换模式解锁
			topic.subscribe("toolbar/camera/reset",function(){
				aroundObj_isLocked = false;
			});
			
			// 响应reset摄像机
			topic.subscribe("toolbar/camera/reset",function(){
				// 当reset按钮点击后，将对摄像机所有操作都清空
				if(Spolo.current_view != Spolo.view_list[0]){
					dx = 0 ;
					dy = 0 ;
					// 并且将摄像机设置到初始位置
					viewarea._rotMat = x3dom.fields.SFMatrix4f.identity();
					viewarea._transMat = x3dom.fields.SFMatrix4f.identity();
					viewarea._movement = new x3dom.fields.SFVec3f(0, 0, 0);
					
					//红心位置复原
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			
			//摄像机锁定
			topic.subscribe("toolbar/camera/locked",function(isLockedStatus){
				camera_isLocked = isLockedStatus;
			});
			
			//浏览模式变化
			topic.subscribe("toolbar/camera/modeToCheck",function(){
				nav.setType("examine", this._viewarea);
				console.log("examine");
			});
			/*----------------------------若不考虑减速，飞行模式使用此部分start-------------------------------
			topic.subscribe("toolbar/camera/modeToFly",function(){
				old_x3dom_navigateTo = x3dom.Viewarea.prototype.navigateTo;
				x3dom.Viewarea.prototype.navigateTo = function(timeStamp){
					var navi = this._scene.getNavigationInfo();
					navi._vf.speed = 0;
					old_x3dom_navigateTo.call(this,timeStamp);
				}
				nav.setType("fly", this._viewarea);
				console.log("fly");
			});
			----------------------------若不考虑减速，飞行模式使用此部分end-------------------------------*/
			// topic.subscribe("toolbar/camera/modeToGame",function(){
				// nav.setType("game", this._viewarea);
				// console.log("game");
			// });
			// topic.subscribe("toolbar/camera/modeToHelicopter",function(){
				// nav.setType("helicopter", this._viewarea);
				// console.log("helicopter");
			// });
			// topic.subscribe("toolbar/camera/modeToSee",function(){
				// nav.setType("lookat", this._viewarea);
				// console.log("lookat");
			// });
			
			//视角变化
			topic.subscribe("toolbar/camera/locateToFront", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 0").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[1];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToBack", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 3.14").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[2];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToLeft", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 1.57").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[3];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToRight", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 -1.57").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[4];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToTop", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 1.57").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[5];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToBottom", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("1 0 0 -1.57").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[6];
				viewarea.animateTo(targ, viewpoint);
				cameraState = CAMERA_OTHERS;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			topic.subscribe("toolbar/camera/locateToFree", function(){
				topic.publish("cameraPos/init");
				var viewpoint = viewarea._scene.getViewpoint();
				var current_rotmat = x3dom.fields.Quaternion.parseAxisAngle("0 1 0 0").toMatrix();
				current_rotmat.setTranslate(new x3dom.fields.SFVec3f(0,0,-10));
				var targ = current_rotmat;
				Spolo.current_view = Spolo.view_list[0];
				viewarea.animateTo(targ, viewpoint);
				topic.publish("toolbar/camera/translate");
				cameraState = CAMERA_FREE;
				if(!aroundObj_isLocked){
					var pointposition = new x3dom.fields.SFVec3f(0,0,0);
					topic.publish("cameraOperate_mrs/cameraPosition",pointposition);
				}
			});
			
			topic.subscribe("system/onDrag", function(x, y, buttonState){
				if(cameraState != 0 && !camera_isLocked && !aroundObj_isLocked){
					myOnDrag(x, y, buttonState);
				}
			});
			
			//重写ondrag
			var myOnDrag = function (x, y, buttonState){
				myOnDrag = function(x,y,buttonState){
					if(initBool==true){
						// should onmouseover/-out be handled on drag?
						var viewarea = x3d.runtime.canvas.doc._viewarea;
						viewarea.handleMoveEvt(x, y, buttonState);

						var navi = viewarea._scene.getNavigationInfo();
						if (navi._vf.type[0].length <= 1 || navi._vf.type[0].toLowerCase() === "none") {
							return;
						}

						var dx = x - viewarea._lastX;
						var dy = y - viewarea._lastY;
						var min, max, ok, d, vec;
						var viewpoint = viewarea._scene.getViewpoint();

						if (navi._vf.type[0].toLowerCase() === "examine")
						{
							if (buttonState & 1 && !event.shiftKey)//left
							{
								if(cameraState == CAMERA_OTHERS){
									move(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}else if(cameraState == CAMERA_MOVE){
									move(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}else if(cameraState == CAMERA_ROTATE){
									rotate(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}else if(cameraState == CAMERA_SCALE){
									scale(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}
							}
							
							if (buttonState & 1 && event.shiftKey)//left+shift
							{
								if(cameraState == CAMERA_OTHERS){
									rotate(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}
							}
						
							if (buttonState & 2)//right
							{
								if(cameraState == CAMERA_OTHERS){
									scale(viewarea,dx,dy,min,max,ok,d,vec,viewpoint);
								}
							}
							
							
						}

						viewarea._dx = dx;
						viewarea._dy = dy;

						viewarea._lastX = x;
						viewarea._lastY = y;
					}
				}				
			};
			
			//平移操作
			var move = function(viewarea,dx,dy,min,max,ok,d,vec,viewpoint){
					if (viewarea._scene._lastMin && viewarea._scene._lastMax)
					{
						d = (viewarea._scene._lastMax.subtract(viewarea._scene._lastMin)).length();
						d = (d < x3dom.fields.Eps) ? 1 : d;
					}
					else
					{
						min = x3dom.fields.SFVec3f.MAX();
						max = x3dom.fields.SFVec3f.MIN();

						ok = viewarea._scene.getVolume(min, max, true);
						if (ok) {
							viewarea._scene._lastMin = min;
							viewarea._scene._lastMax = max;
						}

						d = ok ? (max.subtract(min)).length() : 10;
						d = (d < x3dom.fields.Eps) ? 1 : d;
					}
					//x3dom.debug.logInfo("PAN: " + min + " / " + max + " D=" + d);
					//x3dom.debug.logInfo("w="+viewarea._width+", h="+viewarea._height);

					vec = new x3dom.fields.SFVec3f(d*dx/viewarea._width, d*(-dy)/viewarea._height, 0);
					viewarea._movement = viewarea._movement.add(vec);

					//TODO; move real distance along viewing plane
					viewarea._transMat = viewpoint.getViewMatrix().inverse().
						mult(x3dom.fields.SFMatrix4f.translation(viewarea._movement)).
						mult(viewpoint.getViewMatrix());
			}
			
			//旋转操作
			var rotate = function(viewarea,dx,dy,min,max,ok,d,vec,viewpoint){
				var alpha = (dy * 2 * Math.PI) / viewarea._width;
				var beta = (dx * 2 * Math.PI) / viewarea._height;
				var gama = Math.sqrt(alpha*alpha)>Math.sqrt(beta*beta) ? alpha : beta;
				var mat = viewarea.getViewMatrix();

				var mz = x3dom.fields.SFMatrix4f.rotationZ(gama);
				//var my = x3dom.fields.SFMatrix4f.rotationY(beta);

				var center = viewpoint.getCenterOfRotation();
				mat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));

				viewarea._rotMat = viewarea._rotMat.
					mult(x3dom.fields.SFMatrix4f.translation(center)).
					mult(mat.inverse()).
					mult(mz.inverse()).
					mult(mat).
					mult(x3dom.fields.SFMatrix4f.translation(center.negate()));
			}
			
			//缩放操作
			var scale = function(viewarea,dx,dy,min,max,ok,d,vec,viewpoint){
				if (viewarea._scene._lastMin && viewarea._scene._lastMax)
				{
					d = (viewarea._scene._lastMax.subtract(viewarea._scene._lastMin)).length();
					d = (d < x3dom.fields.Eps) ? 1 : d;
				}
				else
				{
					min = x3dom.fields.SFVec3f.MAX();
					max = x3dom.fields.SFVec3f.MIN();

					ok = viewarea._scene.getVolume(min, max, true);
					if (ok) {
						viewarea._scene._lastMin = min;
						viewarea._scene._lastMax = max;
					}

					d = ok ? (max.subtract(min)).length() : 10;
					d = (d < x3dom.fields.Eps) ? 1 : d;
				}
				//x3dom.debug.logInfo("ZOOM: " + min + " / " + max + " D=" + d);
				//x3dom.debug.logInfo((dx+dy)+" w="+viewarea._width+", h="+viewarea._height);

				vec = new x3dom.fields.SFVec3f(0, 0, d*(dx+dy)/viewarea._height);
				viewarea._movement = viewarea._movement.add(vec);

				//TODO; move real distance along viewing ray
				viewarea._transMat = viewpoint.getViewMatrix().inverse().
					mult(x3dom.fields.SFMatrix4f.translation(viewarea._movement)).
					mult(viewpoint.getViewMatrix());
			}
			
			//控制鼠标第一次按下时不执行操作
			var initBool = false;
			topic.subscribe("system/onMousePress",function(x,y,buttonState){
			   if( viewarea._lastX == -1 || viewarea._lastY == -1){
					viewarea._lastX = x;
					viewarea._lastY = y;
					initBool = true;
				}else{
					initBool = true;
				}
			});
			
			topic.subscribe("system/onMouseRelease",function(x,y,buttonState){
				viewarea._lastX = -1;
				viewarea._lastY = -1;
			});
			
			//固定视角下的缩放
			topic.subscribe("toolbar/camera/farnear", function(){
				cameraState = CAMERA_SCALE;
			});
			//固定视角下的平移
			topic.subscribe("toolbar/camera/translate", function(){
				cameraState = CAMERA_MOVE;
			});
			//固定视角下的旋转
			topic.subscribe("toolbar/camera/rotate", function(){
				cameraState = CAMERA_ROTATE;
			});			
			
			function calculatePoint(){
				var viewmatrix = viewarea.getViewMatrix();
				var pointposition = x3dom.fields.SFMatrix4f.translation(new x3dom.fields.SFVec3f(0,0,-10)).mult(viewmatrix.inverse());
				return pointposition;
			}
			
			
			/*---------------------------------------若考虑减速，飞行模式使用此部分start-----------------------*/
			topic.subscribe("toolbar/camera/modeToFly",function(){
				x3dom.Viewarea.prototype.navigateTo = function(timeStamp)
				{
					var navi = this._scene.getNavigationInfo();
					var needNavAnim = ( navi._vf.type[0].toLowerCase() === "game" ||
										(this._lastButton > 0 &&
										(navi._vf.type[0].toLowerCase() === "fly" ||
										 navi._vf.type[0].toLowerCase() === "walk" ||
										 navi._vf.type[0].toLowerCase() === "helicopter" ||
										 navi._vf.type[0].toLowerCase().substr(0, 5) === "looka")) );
					
					this._deltaT = timeStamp - this._lastTS;

					if (needNavAnim)
					{
						var avatarRadius = 0.25;
						var avatarHeight = 1.6;
						var avatarKnee = 0.75;  // TODO; check max. step size

						if (navi._vf.avatarSize.length > 2) {
							avatarRadius = navi._vf.avatarSize[0];
							avatarHeight = navi._vf.avatarSize[1];
							avatarKnee = navi._vf.avatarSize[2];
						}

						// get current view matrix
						var currViewMat = this.getViewMatrix();
						var dist = 0;

						// check if forwards or backwards (on right button)
						var step = 0;
						step *= (this._deltaT * navi._vf.speed);

						var phi = Math.PI * this._deltaT * (this._pressX - this._lastX) / this._width / 5;
						var theta = Math.PI * this._deltaT * (this._pressY - this._lastY) / this._height / 5;

						if (this._needNavigationMatrixUpdate === true)
						{
							this._needNavigationMatrixUpdate = false;
							
							// reset examine matrices to identity
							this._rotMat = x3dom.fields.SFMatrix4f.identity();
							this._transMat = x3dom.fields.SFMatrix4f.identity();
							this._movement = new x3dom.fields.SFVec3f(0, 0, 0);

							var angleX = 0;
							var angleY = Math.asin(currViewMat._02);
							var C = Math.cos(angleY);
							
							if (Math.abs(C) > 0.0001) {
								angleX = Math.atan2(-currViewMat._12 / C, currViewMat._22 / C);
							}

							// too many inversions here can lead to distortions
							this._flyMat = currViewMat.inverse();
							
							this._from = this._flyMat.e3();
							this._at = this._from.subtract(this._flyMat.e2());

							if (navi._vf.type[0].toLowerCase() === "helicopter")
								this._at.y = this._from.y;
							
							if (navi._vf.type[0].toLowerCase().substr(0, 5) !== "looka")
								this._up = new x3dom.fields.SFVec3f(0, 1, 0);
							else
								this._up = this._flyMat.e1();

							this._pitch = angleX * 180 / Math.PI;
							this._yaw = angleY * 180 / Math.PI;
							this._eyePos = this._from.negate();
						}

						var tmpAt = null, tmpUp = null, tmpMat = null;
						var q, temp, fin;
						var lv, sv, up;

						if (navi._vf.type[0].toLowerCase() === "game")
						{
							this._pitch += this._dy;
							this._yaw   += this._dx;

							if (this._pitch >=  89) this._pitch = 89;
							if (this._pitch <= -89) this._pitch = -89;
							if (this._yaw >=  360) this._yaw -= 360;
							if (this._yaw < 0) this._yaw = 360 + this._yaw;
							
							this._dx = 0;
							this._dy = 0;

							var xMat = x3dom.fields.SFMatrix4f.rotationX(this._pitch / 180 * Math.PI);
							var yMat = x3dom.fields.SFMatrix4f.rotationY(this._yaw / 180 * Math.PI);

							var fPos = x3dom.fields.SFMatrix4f.translation(this._eyePos);

							this._flyMat = xMat.mult(yMat).mult(fPos);

							// Finally check floor for terrain following (TODO: optimize!)
							var flyMat = this._flyMat.inverse();

							var tmpFrom = flyMat.e3();
							tmpUp = new x3dom.fields.SFVec3f(0, -1, 0);

							tmpAt = tmpFrom.add(tmpUp);
							tmpUp = flyMat.e0().cross(tmpUp).normalize();

							tmpMat = x3dom.fields.SFMatrix4f.lookAt(tmpFrom, tmpAt, tmpUp);
							tmpMat = tmpMat.inverse();

							this._scene._nameSpace.doc.ctx.pickValue(this, this._width/2, this._height/2,
										this._lastButton, tmpMat, this.getProjectionMatrix().mult(tmpMat));

							if (this._pickingInfo.pickObj)
							{
								dist = this._pickingInfo.pickPos.subtract(tmpFrom).length();
								//x3dom.debug.logWarning("Floor collision at dist=" + dist.toFixed(4));

								tmpFrom.y += (avatarHeight - dist);
								flyMat.setTranslate(tmpFrom);

								this._eyePos = flyMat.e3().negate();
								this._flyMat = flyMat.inverse();

								this._pickingInfo.pickObj = null;
							}

							this._scene.getViewpoint().setView(this._flyMat);

							return needNavAnim;
						}   // game
						else if (navi._vf.type[0].toLowerCase() === "helicopter")
						{
							var typeParams = navi.getTypeParams();

							if (this._lastButton & 2)
							{
								var stepUp = this._deltaT * this._deltaT * navi._vf.speed;
								stepUp *= 0.1 * (this._pressY - this._lastY) * Math.abs(this._pressY - this._lastY);
								typeParams[1] += stepUp;

								navi.setTypeParams(typeParams);
							}

							if (this._lastButton & 1) {
								step *= this._deltaT * (this._pressY - this._lastY) * Math.abs(this._pressY - this._lastY);
							}
							else {
								step = 0;
							}

							theta = typeParams[0];
							this._from.y = typeParams[1];
							this._at.y = this._from.y;

							// rotate around the up vector
							q = x3dom.fields.Quaternion.axisAngle(this._up, phi);
							temp = q.toMatrix();

							fin = x3dom.fields.SFMatrix4f.translation(this._from);
							fin = fin.mult(temp);

							temp = x3dom.fields.SFMatrix4f.translation(this._from.negate());
							fin = fin.mult(temp);

							this._at = fin.multMatrixPnt(this._at);

							// rotate around the side vector
							lv = this._at.subtract(this._from).normalize();
							sv = lv.cross(this._up).normalize();
							up = sv.cross(lv).normalize();

							lv = lv.multiply(step);

							this._from = this._from.add(lv);
							this._at = this._at.add(lv);

							// rotate around the side vector
							q = x3dom.fields.Quaternion.axisAngle(sv, theta);
							temp = q.toMatrix();

							fin = x3dom.fields.SFMatrix4f.translation(this._from);
							fin = fin.mult(temp);

							temp = x3dom.fields.SFMatrix4f.translation(this._from.negate());
							fin = fin.mult(temp);

							var at = fin.multMatrixPnt(this._at);

							this._flyMat = x3dom.fields.SFMatrix4f.lookAt(this._from, at, up);

							this._scene.getViewpoint().setView(this._flyMat.inverse());

							return needNavAnim;
						}   // helicopter

						// rotate around the up vector
						q = x3dom.fields.Quaternion.axisAngle(this._up, phi);
						temp = q.toMatrix();

						fin = x3dom.fields.SFMatrix4f.translation(this._from);
						fin = fin.mult(temp);

						temp = x3dom.fields.SFMatrix4f.translation(this._from.negate());
						fin = fin.mult(temp);

						this._at = fin.multMatrixPnt(this._at);

						// rotate around the side vector
						lv = this._at.subtract(this._from).normalize();
						sv = lv.cross(this._up).normalize();
						up = sv.cross(lv).normalize();
						//this._up = up;

						q = x3dom.fields.Quaternion.axisAngle(sv, theta);
						temp = q.toMatrix();

						fin = x3dom.fields.SFMatrix4f.translation(this._from);
						fin = fin.mult(temp);

						temp = x3dom.fields.SFMatrix4f.translation(this._from.negate());
						fin = fin.mult(temp);

						this._at = fin.multMatrixPnt(this._at);

						// forward along view vector
						if (navi._vf.type[0].toLowerCase().substr(0, 5) !== "looka")
						{
							var currProjMat = this.getProjectionMatrix();

							if (step < 0) {
								// backwards: negate viewing direction
								tmpMat = new x3dom.fields.SFMatrix4f();
								tmpMat.setValue(this._last_mat_view.e0(), this._last_mat_view.e1(), 
												this._last_mat_view.e2().negate(), this._last_mat_view.e3());
								
								this._scene._nameSpace.doc.ctx.pickValue(this, this._width/2, this._height/2,
											this._lastButton, tmpMat, currProjMat.mult(tmpMat));
							}
							else {
								this._scene._nameSpace.doc.ctx.pickValue(this, this._width/2, this._height/2, this._lastButton);
							}

							if (this._pickingInfo.pickObj)
							{
								dist = this._pickingInfo.pickPos.subtract(this._from).length();

								if (dist <= avatarRadius) {
									step = 0;
								}
							}

							lv = this._at.subtract(this._from).normalize().multiply(step);

							this._at = this._at.add(lv);
							this._from = this._from.add(lv);

							// finally attach to ground when walking
							if (navi._vf.type[0].toLowerCase() === "walk")
							{
								tmpAt = this._from.addScaled(up, -1.0);
								tmpUp = sv.cross(up.negate()).normalize();  // lv

								tmpMat = x3dom.fields.SFMatrix4f.lookAt(this._from, tmpAt, tmpUp);
								tmpMat = tmpMat.inverse();

								this._scene._nameSpace.doc.ctx.pickValue(this, this._width/2, this._height/2,
											this._lastButton, tmpMat, currProjMat.mult(tmpMat));

								if (this._pickingInfo.pickObj)
								{
									dist = this._pickingInfo.pickPos.subtract(this._from).length();

									this._at = this._at.add(up.multiply(avatarHeight - dist));
									this._from = this._from.add(up.multiply(avatarHeight - dist));
								}
							}
							this._pickingInfo.pickObj = null;
						}
						
						this._flyMat = x3dom.fields.SFMatrix4f.lookAt(this._from, this._at, up);

						this._scene.getViewpoint().setView(this._flyMat.inverse());
					}
					topic.publish("viewpoint/transform/changed");
					return needNavAnim;
				};
				nav.setType("fly", this._viewarea);
				console.log("fly");
			});
			/*---------------------------------------若不考虑减速，飞行模式使用此部分end--------------------------------------*/
		},
		
		setFlag : function(flag){
			aroundObj_isLocked = flag;
		}
	});
	
	return cameraOperate;
});