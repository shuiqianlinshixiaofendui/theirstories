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
 
 /**
    room widget 主文件入口
 */
 
define("widgets/room/mainWidget",
[
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./templates/template.html",
    "widgets/room/manager/managerNode",
    "widgets/room/manager/managerOperate",
    "widgets/room/manager/shortcut"
],
function(
	declare,WidgetBase,TemplatedMixin,template,
    ManagerNode, ManagerOperate, Shortcut
)
{
    var _mouseSelectorOperate = null;
    var _managerOperate = null;
    var _managerNode = null;
    var _x3d ;
    var _x3dEdit ;
	var _initWidget = null;
    // 设置参照坐标系
    var referCoordinateRoomEdit_state = false;
    var referCoordinateRoom_state = false;
    // 坐标系
    var _curScene = null;
    var isWallCoordinateState = false;
    var coordinateModelMove_state = false;
    var coordinateModelRotation_state = false;
    var coordinateModelZoom_state = false;
    // 自由模式
    var freeModules_state = false;
    var showBBox_state = false;
    // 天空盒
    var skybox_roomState = false;
    var skybox_roomEditState = false;
    
    var camera_move_state = false;
    var camera_scale_state = false;
    var camera_rotate_state = false;
    var model_move_state = false;
	// 鼠标响应状态
    var isMouseResponse_state = false;
    
    var mainWidget = declare([ WidgetBase, TemplatedMixin], {
        url : "",
        templateString: template,
        
        constructor : function(url){
            this.url = url;
		},
        
        postCreate : function(){
			_this = this;
            this.roomx3d.url=this.url;
           
            // 当x3dom标签加载完成后，动态加载每一个inline
            x3dom.Runtime.prototype.ready = function(){
                if(this.doc.id == "room_x3dEdit"){
                    _x3d = document.getElementById("room_x3d");
                    _x3dEdit = document.getElementById("room_x3dEdit");
                    _managerNode = new ManagerNode(_x3d, _x3dEdit,_this);
                }
            }
		},
        
        // 当所有inline的模型加载完成后，自动执行initFun方法。可以在本方法中添加初始化的对象
        initFun : function(){
            _managerOperate = new ManagerOperate(_x3d, _x3dEdit);
            // 初始化天空盒
            _managerNode.setRoomScene(skybox_roomState);
            _managerNode.setRoomEditScene(skybox_roomEditState);
            // 初始化CEILING隐藏
            _managerOperate.setModelRender(_x3d,"CEILING", false);
            _managerOperate.hideAll();
            _managerOperate.IsShowBBox(showBBox_state);
            
            
            // 当_managerOperate加载完成后，才能够调用_managerOperate的方法
            _managerOperate.camera_translate(camera_move_state);
            _managerOperate.camera_scale(camera_scale_state);
            _managerOperate.camera_rotate(camera_rotate_state);
            _managerOperate.module_translate(model_move_state);
            
            // 坐标系
            _managerNode.setCoordinateScene(_curScene);
            _managerOperate.setCoordinateScene(_curScene);
            _managerNode.modelCoordinateMove(coordinateModelMove_state);
            _managerOperate.modelCoordinateMove(coordinateModelMove_state);
            _managerNode.modelCoordinateRotation(coordinateModelRotation_state);
            _managerOperate.modelCoordinateRotation(coordinateModelRotation_state);
            _managerNode.modelCoordinateZoom(coordinateModelZoom_state);
            _managerOperate.modelCoordinateZoom(coordinateModelZoom_state);
            _managerNode.setWallCoordinate(isWallCoordinateState);
            _managerOperate.setWallCoordinate(isWallCoordinateState);
            // 自由模式
            _managerOperate.freeModules(freeModules_state);
            // 设置参照坐标系
            _managerNode.setReferCoordinateRoom(referCoordinateRoom_state);
            _managerNode.setReferCoordinateRoomEdit(referCoordinateRoomEdit_state);
			_managerOperate.setMouseResponse(isMouseResponse_state);
			new Shortcut(_x3d, _x3dEdit, _managerOperate);
        },
		
		// 设置鼠标事件开关，是否拦截响应鼠标事件
        setMouseResponse : function(state){
            isMouseResponse_state = state;
        },
		
        // 摄像机平移
        camera_translate : function(state){
            camera_move_state = state;
        },
        
        camera_scale : function(state){
            camera_scale_state = state;
        },
        
        camera_rotate : function(state){
            camera_rotate_state = state;
        },
        
        // 模型平移
        module_translate : function(state){
            model_move_state = state;
        },
        
        
        freeModules : function(state){
            try{
                freeModules_state = state;
                if(_managerOperate){
                    _managerOperate.freeModules(state);
                }
            } catch(e){
                alert("mainWidget.js freeModules error : " + e);
            }
        },
        /**
         * 坐标系是否可以控制墙体
         */
        setWallCoordinate : function(state){
            try{
                isWallCoordinateState = state;
                if(_managerNode){
                    _managerNode.setWallCoordinate(state);
                }
                if(_managerOperate){
                    _managerOperate.setWallCoordinate(state);
                }
            } catch(e){
                alert("mainWidget.js setScene error : " + e);
            }
        },
        /**
         * 坐标系所在的scene设置
         */
        setCoordinateScene : function(type){
            try{
                console.log(type, " setCoordinateScene type");
                _curScene = type;
            } catch(e){
                alert("mainWidget.js setScene error : " + e);
            }
        },
        coordinateModelMove : function(state){
            try{
                coordinateModelMove_state = state;
                if(_managerNode){
                    _managerNode.modelCoordinateMove(state);
                }
                if(_managerOperate){
                    _managerOperate.modelCoordinateMove(state);
                }
            } catch(e){
                alert("mainWidget.js coordinateModelMove error : " + e);
            }
        },
        coordinateModelRotation : function(state){
            try{
                coordinateModelRotation_state = state;
                if(_managerNode){
                    _managerNode.modelCoordinateRotation(state);
                }
                if(_managerOperate){
                    _managerOperate.modelCoordinateRotation(state);
                }
            } catch(e){
                alert("mainWidget.js coordinateModelRotation error : " + e);
            }
        },
        coordinateModelZoom : function(state){
            try{
                coordinateModelZoom_state = state;
                if(_managerNode){
                    _managerNode.modelCoordinateZoom(state);
                }
                if(_managerOperate){
                    _managerOperate.modelCoordinateZoom(state);
                }
            } catch(e){
                alert("mainWidget.js coordinateModelZoom error : " + e);
            }
        },
        // 天空盒
        setRoomScene : function(state){
            try{
                skybox_roomState = state;
            } catch(e){
                alert("mainWidget.js setRoomScene error : " + e);
            }
        },
        setRoomEditScene : function(state){
            try{
                skybox_roomEditState = state;
            } catch(e){
                alert("mainWidget.js setRoomEditScene error : " + e);
            }
        },
        // 设置参照坐标系
        setReferCoordinateRoom : function(state){
            try{
                referCoordinateRoom_state = state;
            } catch(e){
                alert("mainWidget.js setReferCoordinateRoom error : " + e);
            }
        },
        setReferCoordinateRoomEdit : function(state){
            try{
                referCoordinateRoomEdit_state = state;
            } catch(e){
                alert("mainWidget.js setReferCoordinateRoomEdit error : " + e);
            }
        },
        setPosition : function(x,y,pos_z){
            _managerOperate.setPosition(x,y,pos_z);
        },
        
        setRotation : function(angle,axis){
            _managerOperate.setRotation(angle,axis);
        },
        setScale : function(scaleVale){
            _managerOperate.setScale(scaleVale);
        },
        
        
        module_rotate : function(){
            _managerOperate.clearOperate();
            _managerOperate.module_rotate();
            _managerOperate.exec();
        },
        
        saveScene : function(url){
        
        },
		
        getModuleList : function(name){
            return _managerOperate.getModelList(name);
        },
        
        focusOnObj : function(x,y){
            _managerOperate.focusOnObj();
            _managerOperate.removeCoordinate() ;        // 切换墙体时，将坐标系删除
        },
        
        showAll : function(){
            _managerOperate.showAll();
        },
        
        changeWindow : function(){
            _managerOperate.changeWindow();
        },
        
        changePerspective : function(tag){
            _managerOperate.changePerspective(tag);
        },
        // 添加模型
        addModel : function(url , modelName){
            _managerNode.addModel(url,modelName) ;
        },
        // 删除模型
        deleteModel : function(name) {
             _managerNode.deleteModel(name) ;
        },
		
		IsShowBBox : function(state){
			 showBBox_state = state;
			 if(_managerOperate){
				_managerOperate.IsShowBBox(showBBox_state);
			 }
		},
		bindingBox : function(selectedModelObj){
			 if(_managerOperate){
				_managerOperate.bindingBox(selectedModelObj);
			 }
		},
        openX3domPhysi : function(){
            _managerOperate.openX3domPhysi() ;
        },
        closeX3domPhysi : function(){
            _managerOperate.closeX3domPhysi() ;
        }
        
	});
	
	return mainWidget;
});