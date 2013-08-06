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
 
define("widgets/room/node/referCoordinateNode", [
    "widgets/Mask/Mask"
], function(
    Mask
){
    /**
     * 变量
     */
    var _viewarea = null;
    /**
     * 创建设置固定坐标系
     */
    function referCoordinate(_scene){
        try{
            //拦截window.onresize
            window.onresize = function(){
                setTimeout(function(){
                    viewareaWH(_viewarea);
                }, 100);
            }
            //获取viewpoint的坐标参数
            var mat_view  = _viewarea.getViewMatrix() ;
            var e_viewpoint = _viewarea._scene.getViewpoint();
            var e_viewtrafo = e_viewpoint.getTransformation();
            e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
            var e_mat = e_viewtrafo.inverse();
            var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
            rotation.setValue(e_mat);
            var translation = e_mat.e3();
            var rot = rotation.toAxisAngle();   
            var trasviewpoint = document.createElement('Transform');
            trasviewpoint.setAttribute("id", "trasviewpoint");
            // trasviewpoint.setAttribute("translation", translation.x + " " + translation.y + " " + translation.z);
            trasviewpoint.setAttribute("translation", "-0.00006123725142970216 34116.21438577579 1.4551915228366852e-11");
            trasviewpoint.setAttribute("rotation", rot[0].x + " " + rot[0].y + " " + rot[0].z);
            trasviewpoint.setAttribute("scale", "500 500 500");
            _scene.appendChild(trasviewpoint);
            //将坐标轴提示加入到transform中
            var trascoor = document.createElement('Transform');
            trascoor.setAttribute("id", "trascoor");
            var w = _viewarea._width;
            var h = _viewarea._height;
            trascoor.setAttribute("translation", (translation.x - w / 260 + 0.2) + " "
            +(translation.y - h / 260 + 0.2) + " " + (translation.z - (h / 102 + 10 )));
            trascoor.setAttribute("scale", "0.25 0.25 0.25");
            createCoordinate(trascoor);
            trasviewpoint.appendChild(trascoor);
        } catch(e){
            alert("referCoordinateNode.js private referCoordinate error : " + e);
        }
    }
    
    /**
     * 创建十字坐标系
    */
    function createCoordinate(node){
        try{
            // 缓冲被点击模型
			currentCoordinate = node;
			var model_pos;
			var model_name;
			/**
			 * 坐标系
             */
			trans = document.createElement('Transform');
            model_pos = "0 0 0";
            trans.setAttribute("id", "coorbar");
            trans.setAttribute("def", "coorbar");
			trans.setAttribute("scale", "0.5 0.5 0.5");
			trans.setAttribute("translation", model_pos);
			trans.setAttribute("rotation", "1 0 0 " + -Math.PI/2);
			/**
             * y轴
             */
			var transy0 = document.createElement('Transform');
			transy0.setAttribute("rotation", "0 0 1 0");
			var transy = document.createElement('Transform');
			var transy_cylinder = document.createElement('Transform');
			transy_cylinder.setAttribute("translation", "0 0.9 0");
			var shapey_cylinder = document.createElement('Shape');
			var appearancey_cylinder = document.createElement('Appearance');
			appearancey_cylinder.setAttribute("id", "coordinate_y");
			appearancey_cylinder.setAttribute("def", "color1");
			var materialy_cylinder = document.createElement('Material');
			materialy_cylinder.setAttribute("diffuseColor", "0 0 1");
			var cylindery_cylinder = document.createElement('Cylinder');
			cylindery_cylinder.setAttribute("def", 'y1');
			cylindery_cylinder.setAttribute("height", 1.8);
			cylindery_cylinder.setAttribute("radius", 0.05);
			var transy_cone = document.createElement('Transform');
			transy_cone.setAttribute("translation", "0 1.9 0");
			var shapey_cone = document.createElement('Shape');
			var appearancey_cone = document.createElement('Appearance');
			appearancey_cone.setAttribute("use", "color1");
			var coney_cone = document.createElement('Cone');
			coney_cone.setAttribute("def", 'y2');
			coney_cone.setAttribute("height", 0.2);
			coney_cone.setAttribute("bottomradius", 0.1);
			appearancey_cylinder.appendChild(materialy_cylinder);
			shapey_cylinder.appendChild(appearancey_cylinder);
			shapey_cylinder.appendChild(cylindery_cylinder);
			transy_cylinder.appendChild(shapey_cylinder);
			shapey_cone.appendChild(appearancey_cone);
			shapey_cone.appendChild(coney_cone);
			transy_cone.appendChild(shapey_cone);
			transy.appendChild(transy_cylinder);
			transy.appendChild(transy_cone);
			transy0.appendChild(transy);
            
            /**
             * x轴
             */
			var transx0 = document.createElement('Transform');
			transx0.setAttribute("rotation", "0 0 1 -1.57");
			var transx = document.createElement('Transform');
			var transx_cylinder = document.createElement('Transform');
			transx_cylinder.setAttribute("translation", "0 0.9 0");
			var shapex_cylinder = document.createElement('Shape');
			var appearancex_cylinder = document.createElement('Appearance');
			appearancex_cylinder.setAttribute("id", "coordinate_x");
			appearancex_cylinder.setAttribute("def", "color2");
			var materialx_cylinder = document.createElement('Material');
			materialx_cylinder.setAttribute("diffuseColor", "0 1 0");
			var cylinderx_cylinder = document.createElement('Cylinder');
			cylinderx_cylinder.setAttribute("def", 'x1');
			cylinderx_cylinder.setAttribute("height", 1.8);
			cylinderx_cylinder.setAttribute("radius", 0.05);
			var transx_cone = document.createElement('Transform');
			transx_cone.setAttribute("translation", "0 1.9 0");
			var shapex_cone = document.createElement('Shape');
			var appearancex_cone = document.createElement('Appearance');
			appearancex_cone.setAttribute("use", "color2");
			var conex_cone = document.createElement('Cone');
			conex_cone.setAttribute("def", 'x2');
			conex_cone.setAttribute("height", 0.2);
			conex_cone.setAttribute("bottomradius", 0.1);
			
			appearancex_cylinder.appendChild(materialx_cylinder);
			shapex_cylinder.appendChild(appearancex_cylinder);
			shapex_cylinder.appendChild(cylinderx_cylinder);
			transx_cylinder.appendChild(shapex_cylinder);
			shapex_cone.appendChild(appearancex_cone);
			shapex_cone.appendChild(conex_cone);
			transx_cone.appendChild(shapex_cone);
			transx.appendChild(transx_cylinder);
			transx.appendChild(transx_cone);
			transx0.appendChild(transx);
			
            /**
             * z轴
             */
			var transz0 = document.createElement('Transform');
			transz0.setAttribute("rotation", "1 0 0 1.57");
			var transz = document.createElement('Transform');
			var transz_cylinder = document.createElement('Transform');
			transz_cylinder.setAttribute("translation", "0 0.9 0");
			var shapez_cylinder = document.createElement('Shape');
			var appearancez_cylinder = document.createElement('Appearance');
			
			appearancez_cylinder.setAttribute("id", "coordinate_z");
			
			appearancez_cylinder.setAttribute("def", "color3");
			var materialz_cylinder = document.createElement('Material');
			materialz_cylinder.setAttribute("diffuseColor", "1 0 0");
			var cylinderz_cylinder = document.createElement('Cylinder');
			cylinderz_cylinder.setAttribute("def", 'z1');
			cylinderz_cylinder.setAttribute("height", 1.8);
			cylinderz_cylinder.setAttribute("radius", 0.05);
			var transz_cone = document.createElement('Transform');
			transz_cone.setAttribute("translation", "0 1.9 0");
			var shapez_cone = document.createElement('Shape');
			var appearancez_cone = document.createElement('Appearance');
			appearancez_cone.setAttribute("use", "color3");
			var conez_cone = document.createElement('Cone');
			conez_cone.setAttribute("def", 'z2');
			conez_cone.setAttribute("height", 0.2);
			conez_cone.setAttribute("bottomradius", 0.1);
			appearancez_cylinder.appendChild(materialz_cylinder);
			shapez_cylinder.appendChild(appearancez_cylinder);
			shapez_cylinder.appendChild(cylinderz_cylinder);
			transz_cylinder.appendChild(shapez_cylinder);
			shapez_cone.appendChild(appearancez_cone);
			shapez_cone.appendChild(conez_cone);
			transz_cone.appendChild(shapez_cone);
			transz.appendChild(transz_cylinder);
			transz.appendChild(transz_cone);
			transz0.appendChild(transz);
			
			trans.appendChild(transy0);
			trans.appendChild(transx0);
			trans.appendChild(transz0);
			
			// 将坐标系添加到被点击的模型上
			node.appendChild(trans);
        } catch(e){
            alert("referCoordinateNode.js private createCoordinate error : " + e);
        }
    }
    
    /**
     * 
     */
    function referChanged(viewarea){
        try{
            var mat_view  = viewarea.getViewMatrix() ;
            var e_viewpoint = viewarea._scene.getViewpoint();
            var e_viewtrafo = e_viewpoint.getTransformation();
            e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
            var e_mat = e_viewtrafo.inverse();
            var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
            rotation.setValue(e_mat);
            var translation = e_mat.e3();
            var rot = rotation.toAxisAngle();
            
            var trasviewpoint = document.getElementById("trasviewpoint");
            var trascoor = document.getElementById("trascoor");
            if(trasviewpoint){
                trasviewpoint.setAttribute("translation", translation.x + " " + translation.y + " " + translation.z);
                trasviewpoint.setAttribute("rotation", rot[0].x+" "+rot[0].y+" "+rot[0].z + " " + rot[1]);
            }
            if(trascoor){
                trascoor.setAttribute("rotation", rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + (-rot[1]));
            }
        } catch(e){
            alert("referCoordinateNode.js private referChanged error : " + e);
        }
    }
    
    /**
     * 处理窗口改变问题
     */
    function viewareaWH(viewarea){
        var mat_view  = viewarea.getViewMatrix() ;
        var e_viewpoint = viewarea._scene.getViewpoint();
        var e_viewtrafo = e_viewpoint.getTransformation();
        e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
        var e_mat = e_viewtrafo.inverse();
        var translation = e_mat.e3();
        var w = viewarea._width;
        var h = viewarea._height;
        
        var trascoor = document.getElementById("trascoor");
        trascoor.setAttribute("translation", (translation.x - w / 260 + 0.2) + 
        " " + (translation.y - h / 260 + 0.2) + " " + (translation.z - (h / 102 + 10)));
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
        constructor : function(x3d){
            _viewarea = x3d.runtime.canvas.doc._viewarea;
            //拦截x3dom.Viewarea.prototype.navigateTo
            var old_x3dom_navigateTo = x3dom.Viewarea.prototype.navigateTo;
            x3dom.Viewarea.prototype.navigateTo = function(timeStamp){
                old_x3dom_navigateTo.call(this, timeStamp);
                referChanged(this);
            }
		},
        createReferCoordinate : function(name){
            try{
                var _scene = document.getElementById(name);
                Mask.show();
                referCoordinate(_scene);
                x3dIsLoading();
            } catch(e){
                alert("referCoordinateNode.js public createReferCoordinate error : " + e);
            }
        },
        removeReferCoordinate : function(name){
            try{
                
            } catch(e){
                alert("referCoordinateNode.js public removeReferCoordinate error : " + e);
            }
        },
		unload : function(){}
    });
});