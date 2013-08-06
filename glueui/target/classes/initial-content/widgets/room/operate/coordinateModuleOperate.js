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
 
define("widgets/room/operate/coordinateModuleOperate", [
    "widgets/room/utils/x3domRewrite",
    "widgets/room/utils/boundingBox",
	"dojo/on",
	"dojo/dom",
	"widgets/room/Lib/x3domLib",
	"widgets/room/utils/syncX3domWin",
	"widgets/room/node/coordinateNode"
], function(
    X3domRewrite,
    BoundingBox,
	on,
	dom,
	X3domLib,
	SyncX3domWin,
	CoordinateNode
){
    /**
     * 私有方法
     */
	// 控制的模型
    // var _consoleModel = null;
    var _boundingBox = null;
    var _x3d = null;
    var _x3domRewrite = null;
    var SCREEN_2D_X = 0;
	var SCREEN_2D_Y = 0;
    var _isOperate = false;
    var _coordinateName = null;
    var _axisOperate = null;
	// 坐标系dom
    var _coordinateNode = null;
	// 场景数据同步
    var _syncX3domWin = null;
	// lib
    var _x3domLib = null;
    // 模型平移用全局变量
    var DRAG_POS;
	var DRAG_OFFSET = null;
	var _LASTMOUSEX = 0;
	var _LASTMOUSEY = 0;
	//模型缩放用全局变量
	var LAST_LENGTH = 0;
	var TRANS_SCEEN_X = 0;
	var TRANS_SCEEN_y = 0;
    
    // 拖动方法
    function onDrag(x, y, type){
        try{
			if(x == null || y == null){
				return ;
			}
			if(_isOperate){
				var modelObj = getModel();
				// console.log(modelObj, " modelObj11");
				// console.log(_coordinateName, " _coordinateName00");
				if(modelObj){
					switch(type){
						case 1 :
							moveOnCoordinate(x, y, modelObj);
							break;
						case 2 :
							rotationOnCoordinate(x, y, modelObj);
							break;
						case 3 :
							zoomOnCoordinate(x, y, modelObj);
							break;    
						default :
							console.log("without operate ! ");
					}
					// console.log(modelObj, " modelObj22");
					syncCoordinateMap(modelObj);
					syncDomNode(modelObj);
					syncerX3dWin(modelObj);
				}
			}
        } catch(e){
            alert("coordinateModuleOperate.js onDrag error : " + e);
        }
    }
	/**
	 * 通过坐标系取得控制模型
	 */
	function getModel(){
		try{           
            var _coordinateMap = document.getElementById(_coordinateName);
			if(_coordinateMap){
				var def = _coordinateMap.getAttribute("belongs");
				var sceneName = _coordinateName.split("_coordinateMap")[0];
				// console.log(sceneName, " sceneName");
				var transform = null;
				if(sceneName == "room_scene"){
					transform = _x3domLib.getRoomSceneTransform(def);
				} else if(sceneName == "roomEdit_scene"){
					transform = _x3domLib.getRoomSceneEditTransform(def);
				}
				return transform;
			}
			return 0;
        } catch(e){
            alert("coordinateModuleOperate.js private getModel error : " + e);
        }
	}
	/**
     * 同步两个窗口的坐标系与模型
     */
	function syncerX3dWin(modelObj){
		try{           
			// console.log(_maintainObj.load("syncX3domWin"), '_maintainObj.load("syncerX3dWin")');
            _syncX3domWin.syncerNodeModel(modelObj);    
        } catch(e){
            alert("coordinateModuleOperate.js private syncerX3dWin error : " + e);
        }
	}
    /**
     * 同步坐标系与模型
     */
    function syncCoordinateMap(modelObj){
        try{   
			if(modelObj){
				var _sceneObj = null;
				// console.log(modelObj, " modelObj");
				// 计算模型包围盒
				var bboxCurrent = _boundingBox.getBoundingBox(modelObj);
				var minCurrent = bboxCurrent.min;
				var maxCurrent = bboxCurrent.max;
				var diameterCurrent = maxCurrent.subtract(minCurrent).length();
				var radius = diameterCurrent / 2 * 0.1;
				var size = radius + " " + radius + " " + radius;
				if(!_coordinateName){
					_sceneObj = getSceneAncestor(modelObj);
					_coordinateName = _sceneObj._DEF + "_coordinateMap";
				}
				var _coordinateMap = document.getElementById(_coordinateName);
				
				var translation = modelObj._vf.translation;
				var trans = translation.x + " " + translation.y + " " + translation.z;
				if(_coordinateMap){
					_coordinateMap.setAttribute("translation", trans);
					_coordinateMap.setAttribute("scale", size);
				}
				
			}
        } catch(e){
            alert("coordinateModuleOperate.js syncCoordinateMap error : " + e);
        }
    }
    
    /**
     * 同步dom node
     */
    function syncDomNode(modelObj){
        try{         
            if(modelObj){
                var translation = modelObj._vf.translation;
                var def = modelObj._xmlNode.getAttribute("def") + "_edit" ;
                // console.log(modelObj) ;
                var rotation = modelObj._vf.rotation.toAxisAngle();
                var scale = modelObj._vf.scale;
                var _trans = translation.x + " " + translation.y + " " + translation.z;
                var _rot = rotation[0].x + " " + rotation[0].y + " " + rotation[0].z + " " + rotation[1];
                var _scale = scale.x + " " + scale.y + " " + scale.z;
                
                modelObj._xmlNode.setAttribute("translation", _trans);
                modelObj._xmlNode.setAttribute("rotation", _rot);
                modelObj._xmlNode.setAttribute("scale", _scale);
                
                // var vi = obj._x3domNode._vf.translation.x + 0.1;
                // var vi = obj._x3domNode._vf.translation
                // console.log(modelObj) ;
                var pp = {x:translation.x , y:translation.y , z:translation.z};
                // var pr = {x:rotation[0].x , y:rotation[0].y , z:rotation[0].z , w:rotation[1]};
                if(Spolo.x3domPhysiOpen){           // 开启物理引擎
                    // console.log(def) ;
                    Spolo.x3domPhysi.updateObject(def,pp);      // 修改模型位置 
                }
            }
        } catch(e){
            alert("coordinateModuleOperate.js syncDomNode error : " + e);
        }
    }
    /**
     * 鼠标抬起
     */
    function onMouseRelease(x, y){
        // console.log("mouse onMouseRelease ! ");
        try{
			_isOperate = 0;
            // Spolo._maintainObj.load("coordinateNode").hideCoordinateLine();
            _coordinateNode.hideCoordinateLine();
        } catch(e){
            alert("coordinateModuleOperate.js onMouseRelease error : " + e);
        }
    }
	function sendData(modelObj){
		var name = modelObj._DEF;
		var translation = modelObj._vf.translation;
		//var pick_pos = x3dom.fields.SFVec3f.copy(Spolo.viewarea._pickingInfo.pickPos);
		var rotation = modelObj._xmlNode.getAttribute("rotation");
		var rot = null;
		if(rotation.indexOf(",") == -1){
			rot = Number(rotation.split(" ")[3]);
		} else {
			rot = Number(rotation.split(",")[3]);
		}
		var angle = Math.round(180 / (Math.PI) * rot);
		//var offset = Spolo.selectedObj._vf.translation.subtract(pick_pos);
		var data = {"data" : {
			"model_name" : name,
			"position" : translation,
			"angle" : angle
		}};
		on.emit(dom.byId("EditConsole"), "event", data);
	}
    /**
     * 模型平移
     */
    function moveOnCoordinate(x, y, modelObj){
        try{
            var pos = DRAG_POS;
            var _intersect_pos_inCC = Spolo.viewarea.projectVector(pos);
            var translation = modelObj._vf.translation;
            var location = null;
            var _Mouse3D = new x3dom.fields.SFVec3f( (x / Spolo.viewarea._width) * 2 - 1,
												-(y / Spolo.viewarea._height) * 2 + 1,
												_intersect_pos_inCC.z);
            // console.log(_Mouse3D, " _Mouse3D");
            var pos_WC = Spolo.viewarea.unprojectVector(_Mouse3D);
            // console.log(pos_WC, " pos_WC1");
            // console.log(DRAG_OFFSET, " DRAG_OFFSET");
			if(DRAG_OFFSET){
				pos_WC = pos_WC.add(DRAG_OFFSET);
				// console.log(pos_WC, " pos_WC2");
				/**
				 * 由于坐标系旋转90度，Z轴向外，在平移时，要修改对应值。
				 */
				switch(_axisOperate){
					case "x" :
						location = new x3dom.fields.SFVec3f(pos_WC.x, translation.y, translation.z);
						break;
					case "y" :
						location = new x3dom.fields.SFVec3f(translation.x, translation.y, pos_WC.z);
						break;
					case "z" :
						location = new x3dom.fields.SFVec3f(translation.x, pos_WC.x, translation.z);
						break;
				}
				// console.log(_axisOperate, " _axisOperate");
				// console.log(location, " location");
				if(location){
					modelObj.moveTo_WC(location);	
					_LASTMOUSEX = x;
					_LASTMOUSEY = y;
					sendData(modelObj);
				}
			}
        } catch(e){
            alert("coordinateModuleOperate.js moveOnCoordinate error : " + e);
        }
    }
    /**
     * 模型旋转
     */
    function rotationOnCoordinate(x, y, modelObj){
        try{
			var angle = null;
            var rotX = ((x - _LASTMOUSEX)/ Spolo.viewarea._width) * 360;
            var rotY = ((y - _LASTMOUSEY)/Spolo.viewarea._height) * 360;
            var axis = null;
            var flag = false;
            switch(_axisOperate){
                case "x" :
                    axis = new x3dom.fields.SFVec3f(1, 0, 0);
					angle = rotX;
                    break;
                case "y" :
                    axis = new x3dom.fields.SFVec3f(0, 1, 0);
					angle = rotY;
                    flag = true;
                    break;
                case "z" :
                    axis = new x3dom.fields.SFVec3f(0, 0, 1);
					angle = rotX;
                    break;
            }
            if(flag){                
                // object坐标系Y轴旋转
                //modelObj.localRotate(axis, rotY);
				
				var data = {changeAxis : {"rot":angle,"axis":_axisOperate}};
				on.emit(dom.byId("EditConsole"), "event", data);
				
				//绕某坐标轴旋转
				var node = modelObj._xmlNode;
				var angleToRot = (Math.PI)/ 180 * angle;
				var q = x3dom.fields.Quaternion.axisAngle(axis, angleToRot);
				var rot = modelObj._vf.rotation.multiply(q);
				var _rot = rot.toAxisAngle();
				node.setAttribute("rotation", _rot[0].x + " " + _rot[0].y + " " + _rot[0].z + " " + _rot[1]);
				
                _LASTMOUSEX = x;
                _LASTMOUSEY = y;
            }
			//sendData(modelObj);
        } catch(e){
            alert("coordinateModuleOperate.js rotationOnCoordinate error : " + e);
        }
    }
    /**
     * 模型缩放
     */
    function zoomOnCoordinate(x, y, modelObj){
        try{
            var dx = SCREEN_2D_X - TRANS_SCEEN_X;
			var dy = SCREEN_2D_Y - TRANS_SCEEN_y;
			var curr_length = Math.sqrt(dx * dx + dy * dy);
			var rate = curr_length / LAST_LENGTH;
            var oldScale = modelObj._vf.scale;
            var zoom = modelObj._vf.scale.multiply(rate);
            var scale = null;
			switch(_axisOperate){
                case "x" :
                    scale = new x3dom.fields.SFVec3f(zoom.x, oldScale.y, oldScale.z);
                    break;
                case "y" :
                    scale = new x3dom.fields.SFVec3f(oldScale.x, oldScale.y, zoom.z);
                    break;
                case "z" :
                    scale = new x3dom.fields.SFVec3f(oldScale.x, zoom.y, oldScale.z);
                    break;
            }
            
			modelObj.scale(scale);
			LAST_LENGTH = curr_length;
            SCREEN_2D_X = x;
			SCREEN_2D_Y = y;
			sendData(modelObj);
        } catch(e){
            alert("coordinateModuleOperate.js zoomOnCoordinate error : " + e);
        }
    }
    /**
     * 模型操作基本数值
     */
    function modelOperate(modelObj, x , y){
        try{
            var shape = Spolo.viewarea._pickingInfo.pickObj;
            _coordinateNode.showCoordinateLine(shape);
            _coordinateName = _coordinateNode.getCurCoordinateName(shape);
            if(_coordinateName){
                _axisOperate = _coordinateNode.getCurAxis(shape);
                _isOperate = 1;
                // 模型缩放
                var _trans_center = Spolo.viewarea.projectVector(modelObj.getCurrentTransform().multMatrixPnt(new x3dom.fields.SFVec3f(0,0,0)));
                TRANS_SCEEN_X = (_trans_center.x + 1) * Spolo.viewarea._width / 2;
                TRANS_SCEEN_y =-(_trans_center.y - 1) * Spolo.viewarea._height / 2;
                var _last_dx = x - TRANS_SCEEN_X;
                var _last_dy = y - TRANS_SCEEN_y;
                LAST_LENGTH = Math.sqrt(_last_dx * _last_dx + _last_dy * _last_dy);
                // 模型移动
                DRAG_POS = x3dom.fields.SFVec3f.copy(Spolo.viewarea._pickingInfo.pickPos);
                DRAG_OFFSET = modelObj._vf.translation.subtract(DRAG_POS);
                SCREEN_2D_X = x;
                SCREEN_2D_Y = y;
                _LASTMOUSEX = x;
                _LASTMOUSEY = y;
            }
        } catch(e){
            alert("coordinateModuleOperate.js modelOperate error : " + e);
        }
     }
     /**
     * 返回當前transform所屬的scene
     * param : node -- x3dom Object
     */
    function getSceneAncestor(node){
        if(!node || typeof(node) != "object"){
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
	
	/**
     * 返回别一个x3d transform object.
     */
    function getOtherTransformObj(node){
        try{
            _curScene = getSceneAncestor(node);
            if(_curScene && _curScene._DEF && node && node._DEF){
                if(_curScene._DEF != "room_scene"){
                    _scene = document.getElementById("room_scene");
                } else if(_curScene._DEF != "roomEdit_scene"){
                    _scene = document.getElementById("roomEdit_scene");
                } else {
                    alert("_curScene object no exist ! ");
                }
                if(_scene){
                    var arrayTrans = _scene.getElementsByTagName("transform");
                    var nodeDef = node._DEF;
                    for(var i = 0; i < arrayTrans.length; i++){
                        var def = arrayTrans[i].getAttribute("def");
                        if(def == nodeDef){
                            return arrayTrans[i]._x3domNode;
                        }
                    }
                }
            }
        } catch(e){
            alert("coordinateNode.js private getOtherTransformObj error : " + e);
        }
    }
	
    /**
     * 是否允許添加坐標系
     */
    
    /**
     * 公有方法
     */
    return dojo.declare([], {
        _coordinateMove : false,
		_coordinateRotation : false,
		_coordinateZoom : false,
        _curScene : 1,
        constructor : function(x3d){
            _x3d = x3d;
            _boundingBox = new BoundingBox();
            _x3domRewrite = new X3domRewrite();
			_x3domLib = new X3domLib();
			_syncX3domWin = new SyncX3domWin();
			_coordinateNode = new CoordinateNode();
            // var _this = this;
            // var x3dom_viewarea_onDrag = x3dom.Viewarea.prototype.onDrag;
            // x3dom.Viewarea.prototype.onDrag = function(x, y, buttonState){
				// Spolo.viewarea = this;
                // if(buttonState == 1 && _this._coordinateMove){
                    // onDrag(x, y, 1);
                // } else if(buttonState == 1 && _this._coordinateRotation){
                    // onDrag(x, y, 2);
                // } else if(buttonState == 1 && _this._coordinateZoom){
                    // onDrag(x, y, 3);
                // }
                // x3dom_viewarea_onDrag.call(this, x , y, buttonState);
            // }
            // var x3dom_viewarea_onMouseRelease = x3dom.Viewarea.prototype.onMouseRelease;
            // x3dom.Viewarea.prototype.onMouseRelease = function(x, y, buttonState){
                // if(buttonState == 0){
                    // onMouseRelease(x, y);
                // }
                // x3dom_viewarea_onMouseRelease.call(this, x , y, buttonState);
            // }
		},
		// 鼠标拖动事件
		x3domOnDrag : function(x, y, buttonState, viewarea){
			try{
				Spolo.viewarea = viewarea;
				if(buttonState == 1 && this._coordinateMove){
					onDrag(x, y, 1);
				} else if(buttonState == 1 && this._coordinateRotation){
					onDrag(x, y, 2);
				} else if(buttonState == 1 && this._coordinateZoom){
					onDrag(x, y, 3);
				}
			} catch(e){
                alert("coordinateModuleOperate.js public x3domOnDrag error : " + e);
            }
		},
		// 鼠标抬起事件
		x3domOnMouseRelease : function(x, y, buttonState){
			try{
				if(buttonState == 0){
					onMouseRelease(x, y);
				}
			} catch(e){
                alert("coordinateModuleOperate.js public x3domOnMouseRelease error : " + e);
            }
		},
		// 鼠标移出场景事件
		x3domOnMouseSceneOut : function(x, y, buttonState, _sceneName){
			try{
				onMouseRelease(x, y);
			} catch(e){
                alert("coordinateModuleOperate.js public x3domOnMouseSceneOut error : " + e);
            }
		},
        /**
         * 设置坐标系scene
         */
        setCoordinateSceneType : function(type){
            this._curScene = type;
        },
        isAllowCoordinateOperate : function(node, state){
            try{
                // var type = Spolo._maintainObj.load("coordinateNode").isAllowCoordinate(node);
                var type = _coordinateNode.isAllowCoordinate(node);
                if(type && node._xmlNode){
                    var subType = node._xmlNode.getAttribute("subType");
                    if(this._curScene == 3){
                        if(!state && (subType == "WALL" || subType == "CEILING" || subType == "FLOOR")){
                            return 0;
                        }
                        return 1;
                    } else {
                        if(this._curScene == type){
                            if(!state && (subType == "WALL" || subType == "CEILING" || subType == "FLOOR")){
                                return 0;
                            }
                            return 1;
                        }
                        return 0;
                    }
                }
                return 0;
            } catch(e){
                alert("coordinateModuleOperate.js isAllowCoordinateOperate error : " + e);
            }
        },
        // 平移
        modelCoordinateMove : function(modelObj, x , y){
			// console.log(this._curScene, " this._curScene");
            if(modelObj){
                this.clearCoordinate();
                this._coordinateMove = true;
				if(this._curScene == 1){
					_coordinateNode.createMove("room_scene", modelObj);
				} else if(this._curScene == 2){
					_coordinateNode.createMove("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					_coordinateNode.createMove("room_scene", modelObj);
					_coordinateNode.createMove("roomEdit_scene", modelObj);
				}
                modelOperate(modelObj, x , y);
            }
        },
        // 旋转
        modelCoordinateRotation : function(modelObj, x , y){
            if(modelObj){
                this.clearCoordinate();
                this._coordinateRotation = true;
				if(this._curScene == 1){
					_coordinateNode.createRotation("room_scene", modelObj);
				} else if(this._curScene == 2){
					_coordinateNode.createRotation("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					_coordinateNode.createRotation("room_scene", modelObj);
					_coordinateNode.createRotation("roomEdit_scene", modelObj);
				}
                modelOperate(modelObj, x , y);
            }
        },
        // 缩放
        modelCoordinateZoom : function(modelObj, x , y){
            if(modelObj){
                this.clearCoordinate();
                this._coordinateZoom = true;
				if(this._curScene == 1){
					_coordinateNode.createZoom("room_scene", modelObj);
				} else if(this._curScene == 2){
					_coordinateNode.createZoom("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					_coordinateNode.createZoom("room_scene", modelObj);
					_coordinateNode.createZoom("roomEdit_scene", modelObj);
				}
                modelOperate(modelObj, x , y);
            }
            
        },
        clearCoordinate : function(){
            this._coordinateMove = false;
            this._coordinateRotation = false;
            this._coordinateZoom = false;
        },
        removeCoordinate : function(type){
            try{
				if(type == 1){
					_coordinateNode.removeCoordinate("room_scene");
				} else if(type == 2){
					_coordinateNode.removeCoordinate("roomEdit_scene");
				} else if(type == 3){
					_coordinateNode.removeCoordinate("room_scene");
					_coordinateNode.removeCoordinate("roomEdit_scene");
				}
            } catch(e){
                alert("coordinateModuleOperate.js removeCoordinate error : " + e);
            }
        },
        /**
         * 同步坐标系与模型的位置等数据
         */
        updateCoordinate : function(modelObj){
            try{
                syncCoordinateMap(modelObj);
            } catch(e){
                alert("coordinateModuleOperate.js updateCoordinate error : " + e);
            } 
        },
        unload : function(){
			
		}
    });
});