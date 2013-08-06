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

define("widgets/room/manager/managerOperate",[
    
], function(
    
){

    var _x3d;
    var _x3dEdit;
    var _this;
	var _lastNodeName = null;
	var _currentNode = null;
	function requireNode(nodeName){
        var name = null;
        if(nodeName.split("_operate")[1] == "" || nodeName.split("Operate")[1] == ""){
            name = "widgets/room/operate/" + nodeName;
			require([name], 
				function(nodeName){
					// 如果当前节点名字与上一次加载的节点名字不一致，才能够加载节点，否则不加载节点
					if(nodeName != _lastNodeName){
						if(_currentNode){
							_currentNode.unload();
							_currentNode = null;
						}
						// console.log(nodeName, " nodeName operate");
						_currentNode = new nodeName( _x3d, _x3dEdit );
						_lastNodeName = nodeName;
					}
				}
			);
		}
	}
        
	return dojo.declare([],{
		_freeModules : false,
		_isWallCoordinateState : false,
		_coordinateMove : false,
		_coordinateRotation : false,
		_coordinateZoom : false,
        _curScene : 1,
        _moduleMove : false,
		_moduleRotate : false,
        _cameraMove : false,
        _cameraScale : false,
        _cameraRotate : false,
		_showBBox : false,
		_isMouseResponse : false,
        
        constructor : function(x3d, x3dEdit){
            _this = this;
            _x3d = x3d;
            _x3dEdit = x3dEdit;
			requireNode("initViewpointOperate");
			requireNode("viewOperate");
			requireNode("coordinateModuleOperate");
			requireNode("cameraOperate");
			requireNode("dynamicsOperate");
		},
        
        camera_translate : function(state){
            this._cameraMove = state;
        },
        
        camera_scale : function(state){
            this._cameraScale = state;
        },
        
        camera_rotate : function(state){
            this._cameraRotate = state;
        },
		clearBind : function(){
			requireNode("cameraOperate");
			_currentNode.clearBind();
		},
		bindMove : function(){
			requireNode("cameraOperate");
            _currentNode.bindMove();
		},
        bindRotate : function(){
			requireNode("cameraOperate");
            _currentNode.bindRotate();
		},
		bindScale : function(){
			requireNode("cameraOperate");
            _currentNode.bindScale();
		},
		
        module_translate : function(state){
            this._moduleMove = state;
        },
        
        setModelRender : function(canvas, name, render){
            if(render){
				requireNode("renderModelOperate");
				_currentNode.showByType(canvas, name);
            } else {
				requireNode("renderModelOperate");
				_currentNode.hideByType(canvas, name);
            }
        },
        
        IsShowBBox : function(state){
            try{
				this._showBBox = state;
				if(state){
					requireNode("selectModelOperate");
					_currentNode.createBox();
				}
            } catch(e){
                alert("managerOperate.js createBBox error : " + e);
            }
        },
        freeModules : function(state){
            try{
               this._freeModules = state;
               this.clearCoordinateOperate();
				requireNode("coordinateModuleOperate");
				_currentNode.removeCoordinate(this._curScene);
            } catch(e){
                alert("managerOperate.js freeModules error : " + e);
            }
        },
		bindingBox : function(selectedModelObj){
			requireNode("selectModelOperate");
			_currentNode.bindingBox(selectedModelObj);
		},
        clearFreeModulesOperate : function(){
            this._freeModules = false;
			requireNode("selectModelOperate");
			_currentNode.hideBoundingBox();
        },
		// setCoordinateSceneType : function(_curScene){
			// requireNode("coordinateModuleOperate");
			// _currentNode.setCoordinateSceneType(_curScene);
		// },
		// isAllowCoordinateOperate : function(modelObj, state){
			// requireNode("coordinateModuleOperate");
			// return _currentNode.isAllowCoordinateOperate(modelObj, state);
		// },
		modelCoordinateMoveOperate : function(modelObj, x, y){
			requireNode("coordinateModuleOperate");
			_currentNode.setCoordinateSceneType(this._curScene);
			var state = this._isWallCoordinateState;
			var ret = _currentNode.isAllowCoordinateOperate(modelObj, state);
			if(ret){
				_currentNode.modelCoordinateMove(modelObj, x, y);
			}
		},
		modelCoordinateRotationOperate : function(modelObj, x, y){
			requireNode("coordinateModuleOperate");
			_currentNode.setCoordinateSceneType(this._curScene);
			var state = this._isWallCoordinateState;
			var ret = _currentNode.isAllowCoordinateOperate(modelObj, state);
			if(ret){
				_currentNode.modelCoordinateRotation(modelObj, x, y);
			}
		},
		modelCoordinateZoomOperate : function(modelObj, x, y){
			requireNode("coordinateModuleOperate");
			_currentNode.setCoordinateSceneType(this._curScene);
			var state = this._isWallCoordinateState;
			var ret = _currentNode.isAllowCoordinateOperate(modelObj, state);
			if(ret){
				_currentNode.modelCoordinateZoom(modelObj, x, y);
			}
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
        modelCoordinateMove : function(state){
            this.clearCoordinateOperate();
            this._coordinateMove = state;
            this.clearFreeModulesOperate();
        },
        modelCoordinateRotation : function(state){
            this.clearCoordinateOperate();
            this._coordinateRotation = state;
            this.clearFreeModulesOperate();
        },
        modelCoordinateZoom : function(state){
            this.clearCoordinateOperate();
            this._coordinateZoom = state;
            this.clearFreeModulesOperate();
        },
        clearCoordinateOperate : function(){
            this._coordinateMove = false;
            this._coordinateRotation = false;
            this._coordinateZoom = false;
        },
		updateCoordinate : function(){
            requireNode("coordinateModuleOperate");
			_currentNode.updateCoordinate();
        },
        
        setPosition : function(x,y,pos_z){
			requireNode("modelOperate");
			_currentNode.MovePos(x,y,pos_z);
        },
        
        setRotation : function(angle,axis){
			requireNode("modelOperate");
			_currentNode.RotateAngle(angle,axis);
        },
        setScale : function(scaleValue){
			requireNode("modelOperate");
			_currentNode.Scale(scaleValue);
        },
       
        
        module_rotate : function(){
            this._moduleRotate = true;
        },
        
        clearOperate : function(){
            this._moduleMove = false;
            this._moduleRotate = false;
            this._cameraMove = false;
            this._cameraScale = false;
        },
        
        exec : function(){
            if(this._moduleMove == true){
				requireNode("modelOperate");
				_currentNode.MoveDrag();
            }
            if(this._moduleRotate == true){
				requireNode("modelOperate");
				_currentNode.RotateDrag();
            }
            if(this._cameraMove == true){
				requireNode("modelOperate");
				_currentNode.MoveDrag();
            }
            if(this._cameraScale == true){
				requireNode("modelOperate");
				_currentNode.ScaleDrag();
            }
        },
        
        getModelList : function(name){
			requireNode("modelListOperate");
			
            return _currentNode.getModelList(name);
        },
        
        focusOnObj : function(){
			requireNode("focusonobjOperate");
			_currentNode.focusOnObj();
        },
        
        showAll : function(){
			requireNode("renderModelOperate");
			_currentNode.showAll(_x3dEdit);
            this.setModelRender(_x3dEdit,"CEILING", false);
			requireNode("viewOperate");
			_currentNode.focusOnObj();
        },
        
        hideAll : function(){
			requireNode("renderModelOperate");
			_currentNode.hideAll(_x3dEdit);
        },
        
        changeWindow : function(){
			requireNode("changeWindowOperate");
        },
        
        changePerspective : function(tag){
			requireNode("changePerspectiveOperate");
            switch(tag){
                case 1 : 
					_currentNode.x3dPerspective();
                    break;
                case 2 :
					_currentNode.x3dOrtho();	
                    break;
                case 3 :  
					_currentNode.x3dEditPerspective();	
                    break;
                case 4 :
					_currentNode.x3dEditOrtho();	
                    break;
            }
        },
        openX3domPhysi : function(){
			requireNode("x3domPhysiOperate");
			_currentNode.openX3domPhysi();	
        },
        closeX3domPhysi : function(){
			requireNode("x3domPhysiOperate");
			_currentNode.closeX3domPhysi();	
        },
		
		/**
		 * 事件引发操作，比如：鼠标、键盘
		 */
		onDrag_x3dom : function(x, y, buttonState, viewarea, event){
			if( this._isMouseResponse && _currentNode.x3domOnDrag ){
				_currentNode.x3domOnDrag(x, y, buttonState, viewarea, event);
			}
		},
		onMouseRelease_x3dom : function(x, y, buttonState, event){
			if( this._isMouseResponse && _currentNode.x3domOnMouseRelease ){
				_currentNode.x3domOnMouseRelease(x, y, buttonState);
			}
		},
		
		setMouseResponse : function(state){
			this._isMouseResponse = state;
		},
        removeCoordinate : function(){
            try{
				requireNode("coordinateModuleOperate");
                _currentNode.removeCoordinate(this._curScene);
            } catch(e){
                alert("managerOperate removeCoordinate error : " + e);
            }
           
        },
		/**
		 * 鼠标是从哪个场景中移出
		 * param : _sceneName -- 场景名，scene name。
		 */
		onMouseSceneOut : function(x, y, buttonState, _sceneName, event){
			try{
				if( this._isMouseResponse && _currentNode.x3domOnMouseSceneOut ){
					_currentNode.x3domOnMouseSceneOut(x, y, buttonState, _sceneName);
				}
            } catch(e){
                alert("managerOperate public mouseSceneOut error : " + e);
            }
		}
	});	
});