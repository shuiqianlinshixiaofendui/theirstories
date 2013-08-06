/** 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/

define("widgets/room/manager/managerNode",[
    "widgets/room/node/groupRoomNode",
	"widgets/room/Lib/sceneLib",
	"dojo/dom"
], function(
    GroupRoomNode,
	SceneLib,
	dom
){
    /**
     * 私有方法
     */
    var _sceneLib = null;
    var _lastNodeName = null;
    var _currentNode = null;
    var _x3d = null;
    var _x3dEdit = null;
	
	function requireNode(nodeName){
        var name = null;
		if(nodeName.split("_node")[1] == "" || nodeName.split("Node")[1] == ""){
            name = "widgets/room/node/" + nodeName;
			require([name], 
				function(nodeName){
					// 如果当前节点名字与上一次加载的节点名字不一致，才能够加载节点，否则不加载节点
					if(nodeName != _lastNodeName){
						if(_currentNode){
							_currentNode.unload();
							_currentNode = null;
						}
						// console.log(nodeName, " nodeName node");
						_currentNode = new nodeName(_x3d, _x3dEdit);
						_lastNodeName = nodeName;
					}
				}
			);
		}
	}
	
	
    function createSkybox(name){
		requireNode("skyboxNode");
		_currentNode.createSkybox(name);
    }
	
	/**
	 * 获取被选择的模型，在输入框中显示的模型
	 */
	function getSelecterObj(){
		var name = dom.byId("model_name").value;
		if(!name){
			return Spolo.selectedObj;
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
	
    /**
     * 公有方法
     */
	return dojo.declare([],{
        _curScene : 1,
        _isWallCoordinateState : false,
        _coordinateMove : false,
		_coordinateRotation : false,
		_coordinateZoom : false,
        // 设置天空盒
        _skybox_roomState : false,
        _referCoordinateRoomEdit : false,
        // 设置参照坐标系
        _referCoordinateRoom : false,
        _referCoordinateRoom : false,
		constructor : function(x3d, x3dEdit, mainWidget){
			_x3d = x3d; 
			_x3dEdit = x3dEdit;
			_sceneLib = new SceneLib();
			requireNode("cameraNode");
            _groupRoomNode = GroupRoomNode(x3d, x3dEdit , mainWidget);
			requireNode("meshextendNode");
            this.processData();
		},
        processData : function(){
			// 获取组装数据
			var callback = function(list){
				_groupRoomNode.createRoom(list);
			}
			_sceneLib.assembledData(callback);		
        },
        /**
         * 坐标系是否可以控制墙体
         */
        setWallCoordinate : function(state){
            this._isWallCoordinateState = state;
        },
        /**
         * 设置坐标系scene
         */
        setCoordinateScene : function(type){
            this._curScene = type;
        },
        isAllowCoordinate : function(node){
            try{
				requireNode("coordinateNode");
				var type = _currentNode.isAllowCoordinate(node);
                // console.log(node, " node subtype");
                if(type && node._xmlNode){
                    var subType = node._xmlNode.getAttribute("subType");
                    if(this._curScene == 3){
                        if(!this._isWallCoordinateState && (subType == "WALL" || subType == "CEILING" || subType == "FLOOR")){
                            return 0;
                        }
                        return 1;
                    } else {
                        if(this._curScene == type){
                            if(!this._isWallCoordinateState && (subType == "WALL" || subType == "CEILING" || subType == "FLOOR")){
                                return 0;
                            }
                            return 1;
                        }
                        return 0;
                    }
                }
                return 0;
            } catch(e){
                alert("managerNode.js isAllowCoordinate error : " + e);
            }
        },
        removeCoordinate : function(){
            try{
               // _maintainObj.load("coordinateNode").removeCoordinate();
            } catch(e){
                alert("managerNode.js removeCoordinate error : " + e);
            }
        },
        modelCoordinateMove : function(state){
            this.clearCoordinateOperate();
            this._coordinateMove = state;
            // this.removeCoordinate();
			var modelObj = getSelecterObj();
            var ret = this.isAllowCoordinate(modelObj);
            if(ret){
				if(this._curScene == 1){
					requireNode("coordinateNode");
					_currentNode.createMove("room_scene", modelObj);
				} else if(this._curScene == 2){
					requireNode("coordinateNode");
					_currentNode.createMove("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					requireNode("coordinateNode");
					_currentNode.createMove("room_scene", modelObj);
					requireNode("coordinateNode");
					_currentNode.createMove("roomEdit_scene", modelObj);
				}
            }
        },
        modelCoordinateRotation : function(state){
            this.clearCoordinateOperate();
            this._coordinateRotation = state;
            // this.removeCoordinate();
			var modelObj = getSelecterObj();
            var ret = this.isAllowCoordinate(modelObj);
            if(ret){
				if(this._curScene == 1){
					requireNode("coordinateNode");
					_currentNode.createRotation("room_scene", modelObj);
				} else if(this._curScene == 2){
					requireNode("coordinateNode");
					_currentNode.createRotation("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					requireNode("coordinateNode");
					_currentNode.createRotation("room_scene", modelObj);
					requireNode("coordinateNode");
					_currentNode.createRotation("roomEdit_scene", modelObj);
				}
            }
        },
        modelCoordinateZoom : function(state){
            this.clearCoordinateOperate();
            this._coordinateZoom = state;
            // this.removeCoordinate();
			var modelObj = getSelecterObj();
            var ret = this.isAllowCoordinate(modelObj);
            if(ret){
				if(this._curScene == 1){
					requireNode("coordinateNode");
					_currentNode.createZoom("room_scene", modelObj);
				} else if(this._curScene == 2){
					requireNode("coordinateNode");
					_currentNode.createZoom("roomEdit_scene", modelObj);
				} else if(this._curScene == 3){
					requireNode("coordinateNode");
					_currentNode.createZoom("room_scene", modelObj);
					requireNode("coordinateNode");
					_currentNode.createZoom("roomEdit_scene", modelObj);
				}
            }
        },
        clearCoordinateOperate : function(){
            this._coordinateMove = false;
            this._coordinateRotation = false;
            this._coordinateZoom = false;
        },
        /**
         * 设置天空盒
         */
        setRoomScene : function(state){
            try{
                this._skybox_roomState = state;
                if(state){
                    createSkybox("room_scene");
                }
            } catch(e){
                alert("managerNode.js setRoomScene error : " + e);
            }
        },
        setRoomEditScene : function(state){
            try{
                this._skybox_roomEditState = state;
                if(state){
                    createSkybox("roomEdit_scene");
                }
            } catch(e){
                alert("managerNode.js setRoomEditScene error : " + e);
            }
        },
        // 设置参照坐标系
        setReferCoordinateRoom : function(state){
            try{
                this._referCoordinateRoom = state;
                if(state){
					requireNode("referCoordinateNode");
					_currentNode.createReferCoordinate("room_scene");
                }
            } catch(e){
                alert("mainWidget.js setReferCoordinateRoom error : " + e);
            }
        },
        setReferCoordinateRoomEdit : function(state){
            try{
                this._referCoordinateRoomEdit = state;
                if(state){
					requireNode("referCoordinateNode");
					_currentNode.createReferCoordinate("roomEdit_scene");
                }
            } catch(e){
                alert("mainWidget.js setReferCoordinateRoomEdit error : " + e);
            }
        },
        // 添加模型
        addModel : function(url,modelNode){
			requireNode("modelNode");
			_currentNode.addModel(url,modelNode);
        },
        // 删除模型
        deleteModel : function(name){
			requireNode("modelNode");
			_currentNode.deleteModel(name);
        }
	});	
});