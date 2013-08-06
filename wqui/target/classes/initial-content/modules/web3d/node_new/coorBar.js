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


define("web3d/node_new/coorBar",["dojo/topic","web3d/node_new/axisTranslate"],function(topic,axisTranslate){

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
	
	// 绘制一个中心标志点
	function drawPoint(viewarea){
		var size = 0.02;
		var scene = viewarea._scene;
		
		var trans = document.createElement('Transform');
		trans.setAttribute("id","tagPoint");
		trans.setAttribute("def","tagPoint");
		trans.setAttribute("scale",size+" "+size+" "+size);
		var viewmatrix = viewarea.getViewMatrix();
		var tagPoint_view = new x3dom.fields.SFVec3f(0,0,-1);
		var tagPoint_world = viewmatrix.inverse().mult(x3dom.fields.SFMatrix4f.translation(tagPoint_view)).e3();
		trans.setAttribute("translation",tagPoint_world.x+" "+tagPoint_world.y+" "+tagPoint_world.z);
		
		var shape_node = document.createElement('Shape');
		var appearance_node = document.createElement('Appearance');
		var material_node = document.createElement('Material');
		material_node.setAttribute("diffuseColor",1+" "+0+" "+0);
		var sphere_node = document.createElement('Sphere');
		sphere_node.setAttribute("size",0.0005+" "+0.0005+" "+0.0005);
		
		appearance_node.appendChild(material_node);
		shape_node.appendChild(appearance_node);
		shape_node.appendChild(sphere_node);
		trans.appendChild(shape_node);
		scene._xmlNode.appendChild(trans);
		
	}
	
	function reDrawPoint(viewarea){
		var transPoint=document.getElementById("tagPoint");
		var viewmatrix = viewarea.getViewMatrix();
		var tagPoint_view = new x3dom.fields.SFVec3f(0,0,-5);
		var tagPoint_world = viewmatrix.inverse().mult(x3dom.fields.SFMatrix4f.translation(tagPoint_view)).e3();
		transPoint.setAttribute("translation",tagPoint_world.x+" "+tagPoint_world.y+" "+tagPoint_world.z);
	}
    
    
    var cooBar = dojo.declare([],{
        constructor : function(x3d){
            var viewarea = x3d.runtime.canvas.doc._viewarea;
            //拦截x3dom.Viewarea.prototype.navigateTo
            var old_x3dom_navigateTo = x3dom.Viewarea.prototype.navigateTo;
            x3dom.Viewarea.prototype.navigateTo = function(timeStamp){
                old_x3dom_navigateTo.call(this,timeStamp);
                transformChanged(viewarea) ;
				reDrawPoint(viewarea);
            }
            
            //拦截window.onresize
            window.onresize = function(){
                setTimeout(function(){
                    viewareaWH(viewarea) ;
					reDrawPoint(viewarea);
                }, 100);
            }
			// 绘制中心标志点
			drawPoint(viewarea);
            
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
            var cm=new axisTranslate();
            trascoor.setAttribute("id","trascoor");
            var w=viewarea._width;
            var h=viewarea._height;
            trascoor.setAttribute("translation",(translation.x-w/260+0.2)+" "+(translation.y-h/260+0.2)+" "+(translation.z-(h/102+10)));
            trascoor.setAttribute("scale","0.25 0.25 0.25");
            cm.addCoordinate(trascoor,"");
            trasviewpoint.appendChild(trascoor);
        }
    });
    return cooBar;
});

