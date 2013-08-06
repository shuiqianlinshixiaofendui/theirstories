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

define("widgets/room/operate/changeWindowOperate", [],
function(){

    return dojo.declare([],{
        constructor : function(x3d,x3dEdit){
            var style = x3d.getAttribute("style");
            var z_index = style.split(";");
            console.log(z_index);
            if(z_index[z_index.length-2] == "z-index:2"){
                x3d.setAttribute("style","height:100%; width:100%;position:absolute;z-index:1;");
                x3dEdit.setAttribute("style","background-color: rgb(170, 170, 170);height:30%; width:30%;position:absolute;z-index:2;");
            }else{
                x3d.setAttribute("style","background-color: rgb(170, 170, 170);height:30%; width:30%;position:absolute;z-index:2;");
                x3dEdit.setAttribute("style","height:100%; width:100%;position:absolute;z-index:1;");
            }
        },
		unload : function(){}
    });
    
});