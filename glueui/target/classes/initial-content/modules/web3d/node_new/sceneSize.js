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

define("web3d/node_new/sceneSize", ["dojo/topic"], function(topic){
    return dojo.declare([],{
        constructor : function(x3d){
            // 计算场景大小
            var x3domViewarea = x3d.runtime.canvas.doc._viewarea;
            var d;
            if(x3domViewarea._scene._lastMin && x3domViewarea._scene._lastMax){
                d = (x3domViewarea._scene._lastMax.subtract(x3domViewarea._scene._lastMin)).length();
                d = (d < x3dom.fields.Eps) ? 1 : d;
            } else {
                min = x3dom.fields.SFVec3f.MAX();
                max = x3dom.fields.SFVec3f.MIN();

                ok = x3domViewarea._scene.getVolume(min, max, true);
                if(ok){
                    x3domViewarea._scene._lastMin = min;
                    x3domViewarea._scene._lastMax = max;
                }

                d = ok ? (max.subtract(min)).length() : 10;
                d = (d < x3dom.fields.Eps) ? 1 : d;
            }
            Spolo.sceneSize = d;
            // console.log("Spolo.sceneSize : " + Spolo.sceneSize);
        }
    });
});
