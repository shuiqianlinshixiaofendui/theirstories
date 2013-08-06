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



define("web3d/action/camera",["dojo/topic"],function(topic){
		return dojo.declare([],{
			// 构造函数
			constructor : function(x3d){
			
				var old_x3dom_onDrag = x3dom.Viewarea.prototype.onDrag;
				
				x3dom.Viewarea.prototype.onDrag = function(x,y,buttonState){
					
					if(Spolo.current_view == Spolo.view_list[0]){
							console.log(Spolo.camera_condition);
							if(Spolo.camera_condition == Spolo.condition_list[0]){	
								console.log("无状态");
								if(buttonState & 1){
									old_x3dom_onDrag.call(this,x,y,1);
								}else if(buttonState & 2){
									old_x3dom_onDrag.call(this,x,y,2);
								}else if(buttonState & 4){
									old_x3dom_onDrag.call(this,x,y,4);
								}
							}else if(Spolo.camera_condition == Spolo.condition_list[1]){
								console.log("旋转");
								old_x3dom_onDrag.call(this,x,y,1);
							}else if(Spolo.camera_condition == Spolo.condition_list[2]){
								old_x3dom_onDrag.call(this,x,y,4);
							}else if(Spolo.camera_condition == Spolo.condition_list[3]){
								old_x3dom_onDrag.call(this,x,y,2);
							}
							Spolo.camera_condition == Spolo.condition_list[0];
					}else{
						//alert(Spolo.camera_condition);
						console.log("非自由");
						if(buttonState & 1){
								old_x3dom_onDrag.call(this,x,y,4);
						}else if(buttonState & 2){
							old_x3dom_onDrag.call(this,x,y,2);
						}else if(buttonState & 4){
							old_x3dom_onDrag.call(this,x,y,4);
						}
					}
					//topic.publish("view/selected/viewNotBind");
					topic.publish("viewpoint/transform/changed");
				}
				
				
				topic.subscribe("camera/model",function(id){
					 var nav = this._scene.getNavigationInfo();
					if(id==1){
						 nav.setType("examine", this._viewarea);
						 console.log("examine");
					}else if(id==2){
						nav.setType("fly", this._viewarea);
					}else if(id==3){
						nav.setType("game", this._viewarea);
					}else if(id==4){
						nav.setType("helicopter", this._viewarea);
					}else if(id==5){
						nav.setType("lookat", this._viewarea);
					}
				});
				
				//fast locationing of camera positions
				//it receives an id of the position
				topic.subscribe("camera/locateTo", function(id){
					//init and pre-judgment
					//if the global vieware obj is null, then return
					var viewarea = Spolo.viewarea;
					
					if(!viewarea)
						return;
						
					//init required variables
					topic.publish("cameraPos/init");
							
					//current viewpoint matrix	
					var viewpoint = viewarea._scene.getViewpoint();

					var targ;
					
					if(id == 1)
					{
						//the viewpoint we wish to rotate to
							targ = Spolo._front_tarMat;
							Spolo.current_view = Spolo.view_list[1]; //改变摄像机当前状态，用于模型旋转的判断。
					}else if(id == 2)
					{
						//the viewpoint we wish to rotate to
							targ = Spolo._back_tarMat;
							Spolo.current_view = Spolo.view_list[2];
					}else if(id == 3)
					{
						//the viewpoint we wish to rotate to
							targ = Spolo._left_tarMat;
							Spolo.current_view = Spolo.view_list[3];
					}else if(id == 4)
					{
						//the viewpoint we wish to rotate to
							targ =  Spolo._right_tarMat;
							Spolo.current_view = Spolo.view_list[4];
					}else if(id == 5)
					{
						//the viewpoint we wish to rotate to
							targ =  Spolo._up_tarMat;
							Spolo.current_view = Spolo.view_list[5];
					}else if(id == 6)
					{
						//the viewpoint we wish to rotate to
							targ = Spolo._below_tarMat; 	
							Spolo.current_view = Spolo.view_list[6];
					}else if(id == 7){
						Spolo.current_view = Spolo.view_list[0];
					}
					
					//alert(Spolo.current_view);测试值是否改变
					//animate to the desired position
					viewarea.animateTo(targ, viewpoint);
				});
				
				topic.subscribe("camera/translation",function(x,y,buttonState){
					//alert("sd");
					//Spolo.camera_condition =	if(buttonState & 1)
					// if(buttonState & 1)
						// old_x3dom_onDrag.call(this,x,y,2);
					Spolo.camera_condition = Spolo.condition_list[2]; 
				});
				topic.subscribe("camera/rotate",function(x,y,buttonState){
					//Spolo.camera_condition = Spolo.condition_list[1];
					// if(buttonState & 1)
						// old_x3dom_onDrag.call(this,x,y,1);
					Spolo.camera_condition = Spolo.condition_list[1]; 
				});
				topic.subscribe("camera/farnear",function(x,y,buttonState){
					// if(buttonState & 1)
						// old_x3dom_onDrag.call(this,x,y,4);
					//Spolo.camera_condition = Spolo.condition_list[3];
					Spolo.camera_condition = Spolo.condition_list[3]; 
				});
				
			}
			
		});
	});

