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

define("widgets/room/operate/changePerspectiveOperate", [],
function(){

    var viewpoint;
    var viewpointEdit;
    return dojo.declare([],{
        constructor : function(x3d,x3dEdit){
            this.x3d = x3d;
            this.x3dEdit = x3dEdit;
        },
        
        x3dPerspective : function(){
            viewpoint = this.x3d.runtime.canvas.doc._scene.getViewpoint();
            if(viewpoint._xmlNode.tagName == "ORTHOVIEWPOINT"){
                var oldmat = viewpoint._viewMatrix;
                for(var i = 0;i<viewpoint._stack._bindBag.length;i++){
                   viewpoint._stack._bindBag[i].setView(oldmat);
                };
                this.x3d.runtime.nextView();
            }
        },
        
        x3dOrtho : function(){
            viewpoint = this.x3d.runtime.canvas.doc._scene.getViewpoint();
            if(viewpoint._xmlNode.tagName == "VIEWPOINT"){
                var oldmat = viewpoint._viewMatrix;
                for(var i = 0;i<viewpoint._stack._bindBag.length;i++){
                   viewpoint._stack._bindBag[i].setView(oldmat);
                };
                this.x3d.runtime.nextView();
            }
        },
        
        x3dEditPerspective : function(){
            viewpointEdit = this.x3dEdit.runtime.canvas.doc._scene.getViewpoint();
            if(viewpointEdit._xmlNode.tagName == "ORTHOVIEWPOINT"){
                var oldmat = viewpointEdit._viewMatrix;
                for(var i = 0;i<viewpointEdit._stack._bindBag.length;i++){
                   viewpointEdit._stack._bindBag[i].setView(oldmat);
                };
                this.x3dEdit.runtime.nextView();
            }
        },
        
        x3dEditOrtho : function(){
            viewpointEdit = this.x3dEdit.runtime.canvas.doc._scene.getViewpoint();
            if(viewpointEdit._xmlNode.tagName == "VIEWPOINT"){
                var oldmat = viewpointEdit._viewMatrix;
                for(var i = 0;i<viewpointEdit._stack._bindBag.length;i++){
                   viewpointEdit._stack._bindBag[i].setView(oldmat);
                };
                this.x3dEdit.runtime.nextView();
            }
        },
        unload : function(){}
        
    });
    
});