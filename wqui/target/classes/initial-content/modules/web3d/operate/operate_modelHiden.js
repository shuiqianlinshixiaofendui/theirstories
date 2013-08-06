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

/***
    处理模型隐藏 #1469
*/

define("web3d/operate/operate_modelHiden",["dojo/topic","web3d/Lib/x3domLib"],function(topic,x3domLib){
	var _x3domLib ; // 定义x3domLib
    var scene ;
    /**
        modelHide : 模型隐藏
                    如果模型隐藏则显示，否则隐藏
        def : 模型的def
    **/
    var modelHiden = function(def){
        var trans = _x3domLib.getTransform(def) ;
        if(trans != 0){
            var trans_render = trans.getAttribute("render") ;
            if(typeof(trans_render)=="" || trans_render == null || trans_render == "true"){     
                trans.setAttribute("render","false") ;	
            }else if(trans_render == "false"){
                trans.setAttribute("render","true") ;
            }
        }
    }
    
    var operate_modelHiden = dojo.declare([],{
		constructor : function(x3d){
            scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;       // 在最外层的scene ;
			_x3domLib = new x3domLib(x3d) ;
		},
        hidenModel : function(def) {
            modelHiden(def) ;
        },
		unload : function (){}
	});
	return operate_modelHiden;
});