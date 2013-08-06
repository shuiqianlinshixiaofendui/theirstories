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
 * 动态加载库 
 */

define("widgets/room/utils/maintainObj", [], function(){
    /**
     * 私有方法
     */
    /**
     * 动态加载, 库路径
     */
    var libFiles = {
        "groupRoomNode" : "widgets/room/node/groupRoomNode",
        "sceneLib" : "widgets/room/Lib/sceneLib",
        "x3domLib" : "widgets/room/Lib/x3domLib",
        "modelOperate" : "widgets/room/operate/modelOperate",
        "cameraOperate" : "widgets/room/operate/cameraOperate",
        "modelListOperate" : "widgets/room/operate/modelListOperate",
        "renderModelOperate" : "widgets/room/operate/renderModelOperate",
		"viewOperate": "widgets/room/operate/viewOperate",
		"cameraNode": "widgets/room/node/cameraNode",
		"selectModelOperate":"widgets/room/operate/selectModelOperate",
		// "ui_widget": "widgets/room/ui/ui_widget",
        "meshextendNode" : "widgets/room/node/meshextendNode",
        "focusonobjOperate" : "widgets/room/operate/focusonobjOperate",
        "coordinateNode" : "widgets/room/node/coordinateNode",
        "changeWindowOperate" : "widgets/room/operate/changeWindowOperate",
        "mouseX3dom" : "widgets/room/utils/mouseX3dom",
        "coordinateModuleOperate" : "widgets/room/operate/coordinateModuleOperate",
        "changePerspectiveOperate" : "widgets/room/operate/changePerspectiveOperate",
		"x3domRewrite" : "widgets/room/utils/x3domRewrite",
        "initViewpointOperate" : "widgets/room/operate/initViewpointOperate",
        "dynamicsOperate" : "widgets/room/operate/dynamicsOperate",
        "skyboxNode" : "widgets/room/node/skyboxNode",
        "referCoordinateNode" : "widgets/room/node/referCoordinateNode",
        "modelNode" : "widgets/room/node/modelNode",
        "x3domPhysi": "widgets/room/operate/x3domPhysiOperate",
        "syncX3domWin": "widgets/room/utils/syncX3domWin"
    };
    /**
     * 公有方法
     */
    return dojo.declare([],{
        constructor : function(x3d, x3dEdit){
            if(typeof(x3d) != "undefined"){
                this._x3d = x3d;
            } else {
                this._x3d = document.getElementById("room_x3d");
            }
            
            if(typeof(x3dEdit) != "undefined"){
                this._x3dEdit = x3dEdit;
            } else {
                this._x3dEdit = document.getElementById("room_x3dEdit");
            }
        },
        load : function(libname){
            var libfile = libFiles[libname];
            var obj = null;
            var _this = this;
            require([libfile], function(libname){
                obj = new libname(_this._x3d , _this._x3dEdit);
            });
            // console.log(obj, " obj");
            return obj;
        }
    });
});
