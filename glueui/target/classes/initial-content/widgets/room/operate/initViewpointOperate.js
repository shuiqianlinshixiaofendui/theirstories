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

define("widgets/room/operate/initViewpointOperate", [],
function(){

    return dojo.declare([],{
        constructor : function(x3d,x3dEdit){
            var _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            var _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
            viewpoint = _scene._x3domNode.getViewpoint();
            viewpointEdit = _sceneEdit._x3domNode.getViewpoint();
            var dis = _scene._x3domNode._lastMax;
            var maxdis = dis.x > dis.y ? (dis.x > dis.z ? dis.x : dis.z) : (dis.y > dis.z ? dis.y : dis.z) ;
            for(var i = 0;i<viewpoint._stack._bindBag.length;i++){
                var nodeName = viewpoint._stack._bindBag[i]._xmlNode.nodeName ;
                if(nodeName == "ORTHOVIEWPOINT"){
                    console.log(maxdis * 10);
                    viewpoint._stack._bindBag[i]._xmlNode.setAttribute("zFar" , maxdis * 10);
                }
            };
            for(var i = 0;i<viewpointEdit._stack._bindBag.length;i++){
                var nodeName = viewpointEdit._stack._bindBag[i]._xmlNode.nodeName ;
                if(nodeName == "ORTHOVIEWPOINT"){
                    viewpointEdit._stack._bindBag[i]._xmlNode.setAttribute("zFar" , maxdis * 10);
                }
            };
        },
        unload : function(){}
    });
    
});