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

define("widgets/room/utils/boundingBox", [],function(){
	return dojo.declare([],{
        constructor : function(){
            
            x3dom.fields.BoxVolume = function(min, max)
            {
                if (arguments.length < 2) {
                    this.min = new x3dom.fields.SFVec3f(0, 0, 0);
                    this.max = new x3dom.fields.SFVec3f(0, 0, 0);
                    this.valid = false;
                }
                else {
                    // compiler enforced type check for min/max would be nice
                    this.min = min;
                    this.max = max;
                    this.valid = true;
                }
            };

            x3dom.fields.BoxVolume.prototype.transform = function(m)
            {
                var xmin, ymin, zmin;
                var xmax, ymax, zmax;

                xmin = xmax = m._03;
                ymin = ymax = m._13;
                zmin = zmax = m._23;

                // calculate xmin and xmax of new transformed BBox
                var a = this.max.x * m._00;
                var b = this.min.x * m._00;

                if (a >= b) {
                    xmax += a;
                    xmin += b;
                }
                else {
                    xmax += b;
                    xmin += a;
                }

                a = this.max.y * m._01;
                b = this.min.y * m._01;

                if (a >= b) {
                    xmax += a;
                    xmin += b;
                }
                else {
                    xmax += b;
                    xmin += a;
                }
                
                a = this.max.z * m._02;
                b = this.min.z * m._02;

                if (a >= b) {
                    xmax += a;
                    xmin += b;
                }
                else {
                    xmax += b;
                    xmin += a;
                }

                // calculate ymin and ymax of new transformed BBox
                a = this.max.x * m._10;
                b = this.min.x * m._10;

                if (a >= b) {
                    ymax += a;
                    ymin += b;
                }
                else {
                    ymax += b;
                    ymin += a;
                }

                a = this.max.y * m._11;
                b = this.min.y * m._11;

                if (a >= b) {
                    ymax += a;
                    ymin += b;
                }
                else {
                    ymax += b;
                    ymin += a;
                }

                a = this.max.z * m._12;
                b = this.min.z * m._12;

                if (a >= b) {
                    ymax += a;
                    ymin += b;
                }
                else {
                    ymax += b;
                    ymin += a;
                }

                // calculate zmin and zmax of new transformed BBox
                a = this.max.x * m._20;
                b = this.min.x * m._20;

                if (a >= b) {
                    zmax += a;
                    zmin += b;
                }
                else {
                    zmax += b;
                    zmin += a;
                }

                a = this.max.y * m._21;
                b = this.min.y * m._21;

                if (a >= b) {
                    zmax += a;
                    zmin += b;
                }
                else {
                    zmax += b;
                    zmin += a;
                }

                a = this.max.z * m._22;
                b = this.min.z * m._22;

                if (a >= b) {
                    zmax += a;
                    zmin += b;
                }
                else {
                    zmax += b;
                    zmin += a;
                }

                this.min.x = xmin;
                this.min.y = ymin;
                this.min.z = zmin;
                
                this.max.x = xmax;
                this.max.y = ymax;
                this.max.z = zmax;
            };

        },
        // 只适用于我们的transform/inline/secene结构
        getBoundingBox : function(selectObj)
        { 
            var scene
            if(selectObj._childNodes[0]._childNodes[0]){
                scene = selectObj._childNodes[0]._childNodes[0];
            }
            if(scene){
                scene.updateVolume();
                var max = scene._lastMax;
                var min = scene._lastMin;
                var scale = selectObj._xmlNode.getAttribute("scale").split(" ");
                var rotation = selectObj._xmlNode.getAttribute("rotation").split(" ");
                var translation = selectObj._xmlNode.getAttribute("translation").split(" ");
                
                var trans_scale = new x3dom.fields.SFMatrix4f.scale(new x3dom.fields.SFVec3f(scale[0],scale[1],scale[2]));
                var axis = new x3dom.fields.SFVec3f(rotation[0],rotation[1],rotation[2]);
                var trans_rotation = new x3dom.fields.Quaternion.axisAngle(axis,rotation[3]).toMatrix();
                
                var boxvolume = new x3dom.fields.BoxVolume(min,max);
                
                boxvolume.transform(trans_rotation.mult(trans_scale));
                var p = new x3dom.fields.SFVec3f(parseFloat(translation[0]),parseFloat(translation[1]),parseFloat(translation[2]));
                boxvolume.max = boxvolume.max.add(p);
                boxvolume.min = boxvolume.min.add(p);
                
                return boxvolume;
            }
            return 0 ;
        },
        
        // 只缩放，没有平移旋转的包围盒
        getScaleBoundingBox : function(selectObj){
            var scene;
            if(selectObj._childNodes[0]._childNodes[0]){
                scene = selectObj._childNodes[0]._childNodes[0];
            }
            if(scene){
                scene.updateVolume();
                var max = scene._lastMax;
                var min = scene._lastMin;
                var scale = selectObj._xmlNode.getAttribute("scale").split(" ");
                
                var trans_scale = new x3dom.fields.SFMatrix4f.scale(new x3dom.fields.SFVec3f(scale[0],scale[1],scale[2]));
                
                var boxvolume = new x3dom.fields.BoxVolume(min,max);
                
                boxvolume.transform(trans_scale);
                boxvolume.max = boxvolume.max;
                boxvolume.min = boxvolume.min;
                
                return boxvolume;
            }
            return 0 ;
        },
        
        getInitBoundingBox : function(selectObj){
            var scene;
            if(selectObj._childNodes[0]._childNodes[0]){
                scene = selectObj._childNodes[0]._childNodes[0];
            }
            if(scene){
                scene.updateVolume();
                var max = scene._lastMax;
                var min = scene._lastMin;
                return [min,max];
            }
            return 0 ;
        },
        
    });
})