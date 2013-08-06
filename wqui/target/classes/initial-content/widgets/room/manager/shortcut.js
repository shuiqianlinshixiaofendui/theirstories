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
define("widgets/room/manager/shortcut",["dojo/on", "dojo/dom"],function(on, dom){
    function  getTransformAncestor(node){						
        if(node._parentNodes.length){
            var tagName = node._parentNodes[0]._xmlNode.tagName;
            if(tagName=="Transform" || tagName=="Group" || tagName=="GROUP" || 
                tagName=="INLINE" || tagName=="Inline" ||  // 根节点下的scene的tagName是SCENE,全大写
                tagName=="TRANSFORM" ){
                return getTransformAncestor(node._parentNodes[0]);
            }else{
                if(node._parentNodes[0]._parentNodes[0]){
                    return node._parentNodes[0]._parentNodes[0]._parentNodes[0];
                }else{
                    return node;
                }
            }
        }
        return null;
    }
	
	function getSceneAncestor(node){
        // console.log(node, " node");
        if(typeof(node) != "object" || !node){
            return ;
        }
        if(node._parentNodes.length){
            var tagName = node._parentNodes[0]._xmlNode.tagName;
            if(tagName == "Transform" || tagName == "Group" || tagName == "GROUP" || 
                tagName == "INLINE" || tagName == "Inline" ||  // 根节点下的scene的tagName是SCENE,全大写
                tagName == "TRANSFORM" ){
                return getSceneAncestor(node._parentNodes[0]);
            }else{
                if(node._parentNodes[0]){
                    return node._parentNodes[0];
                }else{
                    return node;
                }
            }
        } else if(node._xmlNode.tagName == "Scene" || node._xmlNode.tagName == "SCENE"){
            return node;
        }
        return null;
    }
	function getSelectObj(){
		var pNodeScene = getSceneAncestor(Spolo.selectedObj);
		var selected_transform = Spolo.selectedObj._xmlNode;
		var _subtype = selected_transform.getAttribute("subtype");
		if(!_subtype && pNodeScene._DEF == "roomEdit_scene"){
			return 1;
		}else {
			// var name = dom.byId("model_name").value;
			// var roomEdit_scene = document.getElementById("roomEdit_scene");
			// var list = roomEdit_scene.getElementsByTagName("TRANSFORM");
			// var selecter = null;
			// for(var i = 0; i < list.length; i++){
				// if(list[i]._x3domNode._DEF == name){
					// selecter = list[i];
					// break;
				// }
			// }
			// if(selecter){
				// Spolo.selectedObj = selecter._x3domNode;
			// }
			return 0;
		}
		
	}
	/**
	 * 获取被选择的模型，在输入框中显示的模型
	 */
	function getSelecterObj(){
		var name = dom.byId("model_name").value;
		if(!name){
			return null;
		}else {
			var roomEdit_scene = document.getElementById("roomEdit_scene");
			var list = roomEdit_scene.getElementsByTagName("TRANSFORM");
			var selecter = null;
			for(var i = 0; i < list.length; i++){
				if(list[i]._x3domNode._DEF == name){
					selecter = list[i];
					break;
				}
			}
			return selecter._x3domNode;
		}
		
	}
	function getModelData(modelObj){
		var name = modelObj._DEF;
		var position = modelObj._vf.translation;
		var node = modelObj._xmlNode;
		var rotation = node.getAttribute("rotation");
		var rot = null;
		if(rotation.indexOf(",") == -1){
			rot = Number(rotation.split(" ")[3]);
		} else {
			rot = Number(rotation.split(",")[3]);
		}
		var angle = Math.round(180 / (Math.PI) * rot);
		
		//var pick_pos = x3dom.fields.SFVec3f.copy(Spolo.viewarea._pickingInfo.pickPos);
		//var offset = modelObj._vf.translation.subtract(pick_pos);
		var data = {"data" : {
			"model_name" : name,
			"position" : position,
			"angle" : angle
		}};
		//向页面发送消息
		on.emit(dom.byId("EditConsole"), "event", data);
	}
	function modelCoordinateOperate(operateObj,coordinateOperateType,x,y){
		var flag = getSelectObj();
		var _modelObj = getSelecterObj();
		var curModel = null;
		if(flag){
			curModel = Spolo.selectedObj;
			getModelData(curModel);
		}else if(_modelObj){
			curModel = _modelObj;
		} 
		if(curModel){
			switch(coordinateOperateType){
				case "move" :
					operateObj.modelCoordinateMoveOperate(curModel, x, y);
					break;
				case "rotation" :
					operateObj.modelCoordinateRotationOperate(curModel, x, y);
					break;
				case "scale" :
					operateObj.modelCoordinateZoomOperate(curModel, x, y);
					break;
			}
		}
	}
	
	var shortcut_operate = dojo.declare([],{
		constructor : function(x3d, x3dEdit,_managerOperate){
            if(_managerOperate){
                var _flag = true ;       // 将鼠标滚轮的消息只发送一次
                var shift = false;      // 点击了shift键
                var pressing = false;
                // 注册鼠标事件
                window.onmousewheel=document.onmousewheel=scrollFunc;  // 注册鼠标滚轮事件
                // 注册键盘事件
                document.addEventListener('keyup', onKeyup, false) ;   // 键盘抬起事件
                document.addEventListener("keydown", onKeydown, false);// 键盘按下事件
            
                var onMousePress_x3domMouse = x3dom.Viewarea.prototype.onMousePress;
                x3dom.Viewarea.prototype.onMousePress = function(x,y,buttonState){
                    /**
                     * 選中模型
                     */
                    _flag = false;
                    Spolo.viewarea = this;
                    pressing = true;
                    
                    // requireNode("cameraOperate", x3d, x3dEdit);
                    // currentNode.clearBind();
                    _managerOperate.clearBind();
                    
                    if(this._pickingInfo.pickObj){
                        var cNode = this._pickingInfo.pickObj;
                        // Spolo.mesh = this._pickingInfo.pickObj._cf.geometry.node._mesh;
                        var pNode = getTransformAncestor(cNode);
                        if(pNode && pNode._DEF != "room_scene_coordinateMap" && pNode._DEF != "roomEdit_scene_coordinateMap" && pNode._DEF != "boundingBox_roomEdit" && pNode._DEF != "boundingBox_room"){
                            Spolo.oldSelectedObj = Spolo.selectedObj;
                            Spolo.selectedObj = pNode;
                        }
                    }
                    // console.log(Spolo.selectedObj, " Spolo.selectedObj");
                    // 鼠标左键 1 ，鼠标中间 4 ，鼠标右键 2
                    
                    // 用户在初始状态下设置了模型可以平移，将鼠标左键设置成模型平移操作
                    if( buttonState & 1 && _managerOperate._coordinateMove ){
                       var type = "move";
						modelCoordinateOperate(_managerOperate,type,x,y);
                    }
                    if( buttonState & 1 && _managerOperate._coordinateRotation ){
						var type = "rotation";
						modelCoordinateOperate(_managerOperate,type,x,y);
                    }
                    if( buttonState & 1 && _managerOperate._coordinateZoom ){
                        var type = "scale";
						modelCoordinateOperate(_managerOperate,type,x,y);
                    }
                    if( buttonState & 1 && _managerOperate._freeModules ){
						if(Spolo.selectedObj){
							var ret = getSelectObj();
							if(ret){
								getModelData(Spolo.selectedObj);
							}
						}
						// console.log("!!!!!");
						// var modelObj = getSelecterObj();
						// console.log("modelObj : " + modelObj);
						// if(modelObj){
							// getModelData(modelObj);
						// }
                    }
					
					/**
					 * bounding box
					 */
					if( buttonState & 1 && _managerOperate._showBBox && _managerOperate._freeModules){
						var selectedModelObj = getSelecterObj();
						if(selectedModelObj){
							_managerOperate.bindingBox(selectedModelObj);
						}
                    }
					
                    // 用户在初始状态下设置了摄像机可以平移，将shift+鼠标左键绑定为摄像机平移
                    if( buttonState & 1 && _managerOperate._cameraMove &&  shift){
                        _managerOperate.bindMove();
                    }
                    // 用户在初始状态下设置了摄像机可以旋转，将鼠标中键按下设置成旋转
                    if( buttonState & 4 && _managerOperate._cameraRotate ){
						_managerOperate.bindRotate();
                    }
                   
                    
                    
                    onMousePress_x3domMouse.call(this,x,y,buttonState);
                }
                
                // var x3dom_viewarea_onMouseRelease = x3dom.Viewarea.prototype.onMouseRelease;
                // x3dom.Viewarea.prototype.onMouseRelease = function (x, y, buttonState){
                    // pressing = false;
                    // _flag = true;
					// _managerOperate.clearBind();
                    
                    // x3dom_viewarea_onMouseRelease.call(this,x,y,buttonState);
                // }
				if(_managerOperate._isMouseResponse){
					// 鼠标拖动事件
					var onDrag_x3domMouse = x3dom.Viewarea.prototype.onDrag;
					x3dom.Viewarea.prototype.onDrag = function (x, y, buttonState){
						_managerOperate.onDrag_x3dom(x, y, buttonState, this, event);
						// onDrag_x3domMouse.call(this, x, y, buttonState);
					}
					
					// 鼠标抬起事件
					var onMouseRelease_x3domMouse = x3dom.Viewarea.prototype.onMouseRelease;
					x3dom.Viewarea.prototype.onMouseRelease = function (x, y, buttonState){
						_managerOperate.onMouseRelease_x3dom(x, y, buttonState, event);
						pressing = false;
						_flag = true;
						_managerOperate.clearBind();
						onMouseRelease_x3domMouse.call(this, x, y, buttonState);
					}
					// 鼠标移动出摄像机视野
					var onMouseOut_x3domMouse = x3dom.Viewarea.prototype.onMouseOut;
					x3dom.Viewarea.prototype.onMouseOut = function (x, y, buttonState){
						var _sceneName = this._scene._DEF;
						/**
						 * 鼠标是从哪个场景中移出
						 */
						_managerOperate.onMouseSceneOut(x, y, buttonState, _sceneName, event);
						onMouseOut_x3domMouse.call(this, x, y, buttonState);
					};
                }
                /**
                    用户在初始状态下设置了摄像机可以缩放，将鼠标滚轮绑定为缩放
                */
                function scrollFunc(){     
                    if(!pressing && _flag){
						_managerOperate.bindScale();
                    }
                }
			
                
                /**
                    键盘抬起事件
                */
                function onKeyup(event){
                    shift = false;
                }
                
                /**
                    键盘按下事件
                */
                function onKeydown(event){
                    if(event.shiftKey){         // key "shift" 
                        shift = true;
                    }else{
                        shift = false;
                    }
                }
                
            }
		}
		
	});	
	return shortcut_operate;
})