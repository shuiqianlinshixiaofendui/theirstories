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

define("widgets/room/node/cameraNode", [], function(){
    
    return dojo.declare([], {
        constructor : function(x3d,x3dEdit){
            _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
			this.createViewpoint();
		},
        /**
         * 创建Viewpoint
         */
        createViewpoint : function(){
            var viewPoint = document.createElement('OrthoViewpoint');
			viewPoint.setAttribute("DEF", "camera");
			viewPoint.setAttribute("id", "camera");
			viewPoint.setAttribute("position", "0 0 10");
			viewPoint.setAttribute("orientation", "1 0 0 0");
			_scene.appendChild(viewPoint);
            
            var viewPointEdit = document.createElement('Viewpoint');
			viewPointEdit.setAttribute("DEF", "cameraEdit");
			viewPointEdit.setAttribute("id", "cameraEdit");
			viewPointEdit.setAttribute("position", "0 0 10");
			viewPointEdit.setAttribute("orientation", "1 0 0 0");
			_sceneEdit.appendChild(viewPointEdit);
        },
		unload : function(){}
    });
});