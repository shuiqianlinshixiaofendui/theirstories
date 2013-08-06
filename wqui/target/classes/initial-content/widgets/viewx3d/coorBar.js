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

/**
    左下角坐标系
**/


define("widgets/viewx3d/coorBar",["dojo/topic"],function(topic){

    /*坐标系改变*/
	function transformChanged(viewarea){
        var mat_view  = viewarea.getViewMatrix() ;
        var e_viewpoint = viewarea._scene.getViewpoint();
        var e_viewtrafo = e_viewpoint.getTransformation();
        e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
        var e_mat = e_viewtrafo.inverse();
        var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
        rotation.setValue(e_mat);
        var translation = e_mat.e3();
        var rot = rotation.toAxisAngle();
        
        var trasviewpoint=document.getElementById("trasviewpoint");
        var trascoor=document.getElementById("trascoor");
        trasviewpoint.setAttribute("translation",translation.x+" "+translation.y+" "+translation.z);
        trasviewpoint.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z+" "+rot[1]);
        trascoor.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z+" "+(-rot[1]));
    }
    
    /*处理窗口改变问题*/
    function viewareaWH(viewarea){
        var mat_view  = viewarea.getViewMatrix() ;
        var e_viewpoint = viewarea._scene.getViewpoint();
        var e_viewtrafo = e_viewpoint.getTransformation();
        e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
        var e_mat = e_viewtrafo.inverse();
        var translation = e_mat.e3();
        var w=viewarea._width;
        var h=viewarea._height;
        
        var trascoor=document.getElementById("trascoor");
        trascoor.setAttribute("translation",(translation.x-w/260+0.2)+" "+(translation.y-h/260+0.2)+" "+(translation.z-(h/102+10)));
    }
    
    //添加坐标系
    function addCoordinate(node,model){
        var currentCoordinate = node;
        var model_pos;
        var model_name;
        var height_;
        var radius_;
        var translation_;
        var s_height_;
        var s_radius_;
        var height_size;
        var translation_size;
        
        // 坐标系
        var trans = document.createElement('Transform');
        
        if(model._xmlNode){
            model_name =  model._xmlNode.nodeName;
        }
        if(model_name == "Transform" || model_name == "TRANSFORM"){
            model_pos =  model._vf.translation.x+" "+model._vf.translation.y+" "+model._vf.translation.z;
            //console.log("pos                "+model_pos);
            trans.setAttribute("id","coorbar_model");
            trans.setAttribute("def","coorbar_model");
            height_ = height_size;
            radius_ = height_size / 100;
            translation_ = translation_size;
            s_height_ = height_size / 10;
            s_radius_ = height_size / 50;
        }else{
            model_pos = "0 0 0";
            trans.setAttribute("id","coorbar");
            trans.setAttribute("def","coorbar");
            height_ = 1.8;
            radius_ = 0.05;
            translation_ = "0 1.9 0"
            s_height_ = 0.2;
            s_radius_ = 0.1;
        }
        trans.setAttribute("scale","0.5 0.5 0.5");
        trans.setAttribute("translation",model_pos);
        trans.setAttribute("rotation",1+" "+0+" "+0+" "+0);
        /*--------------------------y轴start-----------------------------*/
        var transy0 = document.createElement('Transform');
        transy0.setAttribute("rotation","0 0 1 0");
        var transy = document.createElement('Transform');
        var transy_cylinder = document.createElement('Transform');
        transy_cylinder.setAttribute("translation","0 " + height_/2 + " 0");
        var shapey_cylinder = document.createElement('Shape');
        var appearancey_cylinder = document.createElement('Appearance');
        
        appearancey_cylinder.setAttribute("id","coordinate_y");
        
        appearancey_cylinder.setAttribute("def","color1");
        var materialy_cylinder = document.createElement('Material');
        materialy_cylinder.setAttribute("diffuseColor","0 0 1");
        var cylindery_cylinder = document.createElement('Cylinder');
        cylindery_cylinder.setAttribute("def",'y1');
        cylindery_cylinder.setAttribute("height",height_);
        cylindery_cylinder.setAttribute("radius",radius_);
        var transy_cone = document.createElement('Transform');
        transy_cone.setAttribute("translation",translation_);
        var shapey_cone = document.createElement('Shape');
        var appearancey_cone = document.createElement('Appearance');
        appearancey_cone.setAttribute("use","color1");
        var coney_cone = document.createElement('Cone');
        coney_cone.setAttribute("def",'y2');
        coney_cone.setAttribute("height",s_height_);
        coney_cone.setAttribute("bottomradius",s_radius_);
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
        /*--------------------------y轴end-----------------------------*/
        /*--------------------------x轴start-----------------------------*/
        var transx0 = document.createElement('Transform');
        transx0.setAttribute("rotation","0 0 1 -1.57");
        var transx = document.createElement('Transform');
        var transx_cylinder = document.createElement('Transform');
        transx_cylinder.setAttribute("translation","0 " + height_/2 + " 0");
        var shapex_cylinder = document.createElement('Shape');
        var appearancex_cylinder = document.createElement('Appearance');
        
        appearancex_cylinder.setAttribute("id","coordinate_x");
        
        
        appearancex_cylinder.setAttribute("def","color2");
        var materialx_cylinder = document.createElement('Material');
        materialx_cylinder.setAttribute("diffuseColor","0 1 0");
        var cylinderx_cylinder = document.createElement('Cylinder');
        cylinderx_cylinder.setAttribute("def",'x1');
        cylinderx_cylinder.setAttribute("height",height_);
        cylinderx_cylinder.setAttribute("radius",radius_);
        var transx_cone = document.createElement('Transform');
        transx_cone.setAttribute("translation",translation_);
        var shapex_cone = document.createElement('Shape');
        var appearancex_cone = document.createElement('Appearance');
        appearancex_cone.setAttribute("use","color2");
        var conex_cone = document.createElement('Cone');
        conex_cone.setAttribute("def",'x2');
        conex_cone.setAttribute("height",s_height_);
        conex_cone.setAttribute("bottomradius",s_radius_);
        
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
        /*--------------------------x轴end-----------------------------*/
        /*--------------------------z轴start-----------------------------*/
        var transz0 = document.createElement('Transform');
        transz0.setAttribute("rotation","1 0 0 1.57");
        var transz = document.createElement('Transform');
        var transz_cylinder = document.createElement('Transform');
        transz_cylinder.setAttribute("translation","0 " + height_/2 + " 0");
        var shapez_cylinder = document.createElement('Shape');
        var appearancez_cylinder = document.createElement('Appearance');
        
        appearancez_cylinder.setAttribute("id","coordinate_z");
        
        appearancez_cylinder.setAttribute("def","color3");
        var materialz_cylinder = document.createElement('Material');
        materialz_cylinder.setAttribute("diffuseColor","1 0 0");
        var cylinderz_cylinder = document.createElement('Cylinder');
        cylinderz_cylinder.setAttribute("def",'z1');
        cylinderz_cylinder.setAttribute("height",height_);
        cylinderz_cylinder.setAttribute("radius",radius_);
        var transz_cone = document.createElement('Transform');
        transz_cone.setAttribute("translation",translation_);
        var shapez_cone = document.createElement('Shape');
        var appearancez_cone = document.createElement('Appearance');
        appearancez_cone.setAttribute("use","color3");
        var conez_cone = document.createElement('Cone');
        conez_cone.setAttribute("def",'z2');
        conez_cone.setAttribute("height",s_height_);
        conez_cone.setAttribute("bottomradius",s_radius_);
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
        /*--------------------------z轴end-----------------------------*/
        trans.appendChild(transy0);
        trans.appendChild(transx0);
        trans.appendChild(transz0);
        
        
        // 将坐标系添加到被点击的模型上
        if(currentCoordinate.nodeType==1){
            currentCoordinate.appendChild(trans);
        }else{
            currentCoordinate._xmlNode.appendChild(trans);
        }
    }

    var cooBar = dojo.declare([],{
        constructor : function(x3d){
            var viewarea = x3d.runtime.canvas.doc._viewarea;
            //拦截x3dom.Viewarea.prototype.navigateTo
            var old_x3dom_navigateTo = x3dom.Viewarea.prototype.navigateTo;
            x3dom.Viewarea.prototype.navigateTo = function(timeStamp){
                old_x3dom_navigateTo.call(this,timeStamp);
                transformChanged(viewarea) ;
            }
            
            //拦截window.onresize
            window.onresize = function(){
                setTimeout(function(){
                    viewareaWH(viewarea) ;
                }, 100);
            }
            
            //获取viewpoint的坐标参数
            var mat_view  = viewarea.getViewMatrix() ;
            var e_viewpoint = viewarea._scene.getViewpoint();
            var e_viewtrafo = e_viewpoint.getTransformation();
            e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
            var e_mat = e_viewtrafo.inverse();
            var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
            rotation.setValue(e_mat);
            var translation = e_mat.e3();
            var rot = rotation.toAxisAngle();   
            
            //获取viewpoint，在外层加一个transform
            var scene = viewarea._scene;
            var viewpoint = viewarea._scene.getViewpoint();
            var trasviewpoint=document.createElement('Transform');
            trasviewpoint.setAttribute("id","trasviewpoint");
            trasviewpoint.setAttribute("translation",translation.x+" "+translation.y+" "+translation.z);
            trasviewpoint.setAttribute("rotation",rot[0].x+" "+rot[0].y+" "+rot[0].z);
            scene._xmlNode.appendChild(trasviewpoint);
            scene.removeChild(viewpoint);
            
            //将坐标轴提示加入到transform中
            var trascoor=document.createElement('Transform');
            trascoor.setAttribute("id","trascoor");
            var w=viewarea._width;
            var h=viewarea._height;
            trascoor.setAttribute("translation",(translation.x-w/260+0.2)+" "+(translation.y-h/260+0.2)+" "+(translation.z-(h/102+10)));
            trascoor.setAttribute("scale","0.25 0.25 0.25");
            addCoordinate(trascoor,"");
            trasviewpoint.appendChild(trascoor);
        }
    });
    return cooBar;
});

