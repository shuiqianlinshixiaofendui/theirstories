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
  *   modules\room javascript入口文件
  */
require([
    "dojo/ready",
    "room/script/menu",
    "room/script/modelEdit",
    "room/script/sidebar",
    "room/script/modelTree"
    ],
function(ready,menu,modelEdit,sidebar,modelTree){
    ready(function(){
        mainWidget.freeModules(true);
        mainWidget.camera_translate(true);
        mainWidget.camera_scale(true);
        mainWidget.camera_rotate(true);
    });
});