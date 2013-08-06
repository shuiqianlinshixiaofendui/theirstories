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

define("web3d/operate/operate_viewList",["dojo/topic","web3d/Lib/syncLib","web3d/Lib/x3domLib"],function(topic,syncLib,x3domLib){

    var _syncLib ;            // syncLib实例
    var _x3domLib ;          // x3dom实例
    var all_viewpoint = {} ; // 缓存全部的视角   
    var scene ;             // 缓存scene
    
    /**
    *  getCurrentViewpoint ： 从x3dom中获取当前视角
    **/
    var getCurrentViewpoint = function(){
        var viewarea = Spolo.viewarea;
        var C_CenterOfRotation = viewarea._pick ;         
        var mat_view  = viewarea.getViewMatrix() ;
        var e_viewpoint = viewarea._scene.getViewpoint();
        var e_viewtrafo = e_viewpoint.getTransformation();
        e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
        var e_mat = e_viewtrafo.inverse();
        var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
        rotation.setValue(e_mat);
        var translation = e_mat.e3();
        var rot = rotation.toAxisAngle();
        
        var json = {"position" : translation , "centerOfRotation" : C_CenterOfRotation , 
                    "orientation" : rot} ;
        return json ;
    }
    
    var createCamera = function(json){
        for(var i = 0 ; i < json.length ; i ++){
            // 创建viewpoint
            var t = document.createElement('viewpoint');
            var jsonData = json[i].data ;
            t.setAttribute("DEF", jsonData.name) ;
            t.setAttribute("position", jsonData.position[0] + " " + jsonData.position[1] + " " + jsonData.position[2] );
            t.setAttribute("centerOfRotation", jsonData.centerOfRotation[0] + " " + jsonData.centerOfRotation[1] + " " + jsonData.centerOfRotation[2]);
            
            t.setAttribute("orientation", jsonData.orientation[0] + " " + jsonData.orientation[1] + " " + jsonData.orientation[2] + " " + jsonData.orientation[3]);
            
            t.setAttribute("description", jsonData.description);
            scene.appendChild(t) ;
        }
    }
    
    /**
    * getAllViewFromJcr  ： 从后台读取的数据
    **/
    var getAllViewFromJcr = function(flag){
        _syncLib.getCameras(function(cameras){
            all_viewpoint = cameras ;
            createCamera(all_viewpoint) ;
            if(flag){                                               // true ：向2维发布消息 ; false ： 不向2维发布
                topic.publish("command/viewpoint_action/viewList",cameras) ;    
            }
        }) ;	
    }
    
    /**
    *   viewAdd : 获取当前场景中的饿视角，同时保存
    **/
    var viewAdd = function (){
        var view_info = getCurrentViewpoint() ;                     // 获取当前viewpoint信息
        
        // 将获取的数据进行格式化，即4为小数
        var pos_x = view_info.position.x.toFixed(4) ;               // format position
        var pos_y = view_info.position.y.toFixed(4) ;
        var pos_z = view_info.position.z.toFixed(4) ;
        
        var rot_x = view_info.centerOfRotation.x.toFixed(4) ;       // format rotation
        var rot_y = view_info.centerOfRotation.y.toFixed(4) ;
        var rot_z = view_info.centerOfRotation.z.toFixed(4) ;
        
        var ori_x = view_info.orientation[0].x.toFixed(4) ;         // format orientation
        var ori_y = view_info.orientation[0].y.toFixed(4) ;
        var ori_z = view_info.orientation[0].z.toFixed(4) ;
        var ori_a = view_info.orientation[1].toFixed(4) ;
        
        // 创建并设置viewpoint信息           
        var name = Spolo.CreateNodeName("camera") ;                 // 添加的视角名称唯一
        var view = document.createElement("Viewpoint");  
        view.setAttribute("DEF",name) ;
        view.setAttribute("position", pos_x + " " + pos_y + " " +  pos_z );         
        view.setAttribute("centerOfRotation",rot_x + " " + rot_y + " " + rot_z ) ;     
        view.setAttribute("orientation",ori_x + " " + ori_y + " " + ori_z + " " + ori_a ) ;  
        view.setAttribute("description","暂时没有描述哦")  ; 
        view.bind = false ;
        scene.appendChild(view) ;                                   // 将创建viewpoint保存在最外层的scene中
         
        // 需要同步的数据，格式为数组
        var json = {"name" : name , "type" : "CAMERA" , "description" : "暂时没有描述哦",
                    "position" : [pos_x , pos_y, pos_z],
                    "orientation" : [ori_x , ori_y , ori_z , ori_a] };
        
        _syncLib.createItem(json);                                  // 同步数据
        
        topic.publish('command/viewpoint_action/addResult', json); 	// 向2维发布添加视角信息
    }
    
    /**
    *  viewSelectFromBlender : 从blender中的数据选择
    *  parameters :
    *           viewname - 选中视角的名称
    **/
    var viewSelectFromBlender = function(viewname){
        var viewpoint = _x3domLib.getTransform(viewname) ; 
        viewpoint.bind = true ;                                     // 绑定blender读取的viewpoint
    }
    
    /**
    *  viewSelectFromScene ：从场景中最外层的Scene中选择
    *  parmeters      : 
    *           viwename - 选中视角的名称    
    **/
    var viewSelectFromScene = function(viewname){
        var scene_child = scene.childNodes ;
        for(var i = 0 ; i < scene_child.length ; i ++ ){
            var nodeName = scene_child[i].nodeName ;
            if(nodeName == "VIEWPOINT"){
                var nodeDef = scene_child[i].getAttribute("def") ;
                if(nodeDef == viewname){
                    scene_child[i].setAttribute("bind",true);       // 绑定scene中的viewpoint
                } 
            }
        } 
    }
    
    
    /**
    * viewModify     ： 修改我的视角
    * parameters     :
    *     viewname       -  需要修改视角的名称
    *     description    -  视角的描述信息
    */
    var viewModify = function(viewname,description){
        getAllViewFromJcr(false) ;                              // 重新从blender中获取数据，并且不向2维发布消息
        for(var i = 0 ; i < all_viewpoint.length ; i ++){
            var view = all_viewpoint[i].data ;                      // 当前比较的视角
            var name = view.name ;
            if(name == viewname){
                var position = view.position ;
                var orientation = view.orientation ;
                var fieldOfView = view.fieldOfView ;
                // 需要同步的数据
                var json = {"name" : viewname, "orientation" : orientation, "position" : position, 
                            "fieldOfView" : fieldOfView, "description" : description };
                           
                _syncLib.setCameras(json) ;                         // 更新数据
            }
        }
    }
    
    /**
    * viewDelete ： 删除视角
    * parameters :
    *       viewname    - 视角的名称
    **/
    var viewDelete = function(viewname){
        _syncLib.deleteItem(viewname) ;
    }
    
    var operate_viewList = dojo.declare([],{
        constructor : function(x3d){
            _syncLib = new syncLib() ;
            _x3domLib = new x3domLib(x3d) ;
            scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;       // 在最外层的scene ;
        },
        /*添加视角*/
        addView : function(){
			viewAdd() ;
		}, 
        /*从blender中选中视角*/
        selectViewFromBlender : function(viewname){
			viewSelectFromBlender(viewname) ;
		},
        /*从Scene中选中视角*/
        selectViewFromScene : function(viewname){
            viewSelectFromScene(viewname) ;
        }, 
        /*删除是视角*/
        deleteView : function(viewname){
			viewDelete(viewname) ;
		}, 
        /*修改视角*/
        modifyView : function(viewname,description){
			viewModify(viewname,description) ;
		},
        loadViewList : function(){
            getAllViewFromJcr(true) ;
        },
        unload : function(){}
    });
    return operate_viewList ;
});
