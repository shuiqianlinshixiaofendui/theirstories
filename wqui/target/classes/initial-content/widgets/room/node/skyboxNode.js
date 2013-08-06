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
 
define("widgets/room/node/skyboxNode", [
    "widgets/Mask/Mask"
], function(
    Mask
){
    /**
     * 变量
     */
    function createSkybox(_scene){
        try{
            if(_scene && _scene._x3domNode){
                var name = _scene._x3domNode._DEF;
                var _name = name.split("_scene")[0];
                
                // var _skybox = document.createElement('Background');
                // console.log(_name, " _name");
                var _skybox = document.getElementById(_name + "_skybox");
                console.log(_skybox._x3domNode, " _skybox");
                // _skybox.setAttribute("id", _name + "_skybox");
                _skybox.setAttribute("DEF", _name + "_skybox");
                _skybox.setAttribute("transparency", "0");
                _skybox.setAttribute("groundAngle", "0.9 1.5 1.57");
                _skybox.setAttribute("groundColor", "0.6 0.7 0.1 0.4 0.7 0.2 0.1 0.6 0.1 0 0.3 0.1");
                _skybox.setAttribute("skyAngle", "0.9 1.5 1.57");
                _skybox.setAttribute("skyColor", "0.21 0.18 0.66 0.2 0.44 0.85 0.51 0.81 0.95 0.77 0.8 0.82");
                _skybox.setAttribute("groundTransparency", "0.5 0.5 0.5 0.5");
                _skybox.setAttribute("skyTransparency", "0.5 0.5 0.5 0.5");
                _scene.appendChild(_skybox);
                
            }
        } catch(e){
            alert("skyboxNode.js private createSkybox error : " + e);
        }
    }
    
    /**
      * 加载进度
      */
    function x3dIsLoading(){
        var flag = true;
        var count = 0;
        var old_x3dom_tick = x3dom.X3DCanvas.prototype.tick;
        x3dom.X3DCanvas.prototype.tick = function(){  
            if((this.doc.downloadCount === 0) && (this.doc.needRender === 0) && flag){
                count++;
            }
            if(count > 1 && flag){
                flag = false;
                var timeout = setTimeout(function(){
                    Mask.hide();
                },500);
            }
            old_x3dom_tick.call(this);
        }
    }
    
    /**
     * 公有方法
     */
    return dojo.declare([], {
        constructor : function(){
            
		},
        createSkybox : function(name){
            try{
                var _scene = document.getElementById(name);
                Mask.show();
                createSkybox(_scene);
                x3dIsLoading();
            } catch(e){
                alert("skyboxNode.js public createSkybox error : " + e);
            }
        },
		unload : function(){}
    });
});