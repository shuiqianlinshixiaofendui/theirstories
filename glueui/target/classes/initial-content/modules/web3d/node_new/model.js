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
    处理场景加载中的模型添加删除
    帖子：#1379 #1594
*/

define("web3d/node_new/model",["dojo/topic","dojo/ready","web3d/Lib/syncLib","web3d/Lib/x3domLib","spolo/data/model","web3d/operate/operate_modelList"],function(topic,ready,syncLib,x3domLib,model_data,operate_modelList){
    var scene ;     // 场景中最外层的scene
    var _syncLib ;  // 同步数据
    var _x3domLib ; // x3dom
    var array = {} ; // 添加的模型
    var modelList  ; // operate_modelList   
    var x ;           // 模型的x,y,z值 
    var y ;
    var z ;
    
    /**
        产生模型的随机位置
    **/
    function randomPos(){
        x = Math.random() * 6 - 3;
        y = Math.random() * 6 - 3;
        z = Math.random() * 6 - 3;
    }
    
    /**
        addNode : 创建Transform 和 Inline，在场景中显示出来
        x3dUrl  : 需要加载的x3d格式的url
        modelName  : 模型的名称
    */
    var addNode =function(x3dUrl,modelName){	    
        randomPos() ;           // 产生随机位置
        // var modelDef = modelName + "_TRANSFORM" ;
        // 创建Transform
        var t = document.createElement('Transform');
        t.setAttribute("DEF", modelName) ;
        t.setAttribute("id", modelName) ;
        t.setAttribute("translation", x + " " + y + " " + z );
        t.setAttribute("scale", "1.0000 1.0000 1.0000" );
        
        // 创建Inline
        var inline = document.createElement("Inline") ;
        inline.setAttribute("DEF","Inline") ;
        inline.setAttribute("url",x3dUrl) ;   
        t.appendChild(inline) ;
        
        scene.appendChild(t) ;
    }
    /**
        deleteNode : 删除模型
    **/
    var deleteNode = function(){
        var selectObj = Spolo.selectedObj ;     // 判断当前选中的模型
        if(selectObj){
            var objDef = selectObj._DEF ;
            var trans = _x3domLib.getTransform(objDef) ;
            if(trans != 0){
                scene.removeChild(trans) ;
            }
            _syncLib.deleteItem(objDef,function(){
                modelList.removeReload(objDef) ;        // 不传递格式化后的名称
                alert("删除模型成功") ;
            }) ;
        }
   
    }
    
    
    /**
        sync   : 同步，保证下次加载可以正常显示
        url    : 需要同步的url
        reName : 模型名称
    **/
    var syncItem = function(url,modelName){
        // randomPos() ;           // 产生随机位置
        var json = {
                name : modelName,
                referModel : url,
                type : "MESH",
                location:[x ,y ,z],
                rotation_axis_angle:[0 ,1 ,0 ,0],
                scale:[1 ,1 ,1]
        };
        _syncLib.createItem(json, function(){ // 只有成功？
            modelList.createReload() ;
            alert("添加模型成功") ;
        });
    }
    
                
    var model = dojo.declare([],{
        constructor : function(x3d){
            scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;       // 在最外层的scene ;
            _syncLib = new syncLib();
            _x3domLib = new x3domLib(x3d) ;
            modelList = new operate_modelList(x3d) ;
            
        },
        /**
         *  添加一个模型并且同步  
        */
        addModel : function(nodeData){
            var path = nodeData;        // 公共模型库的路径/content/modellib
            var resourceData = new model_data(path);
            resourceData.getResourceName(      // 使用spolo/data/model获取模型的名称
                function(resourcename){
                    var x3dUrl = path + ".x3d" ; 
                    var modelName = Spolo.CreateNodeName(resourcename) ;        // 在模型名称中添加时间日期，防止名称重复
                    addNode(x3dUrl , modelName) ;  // 添加到场景中
                    syncItem(path,modelName) ;          // 同步
                },
                function(error){
                    console.log(error);
                }
            );
        },
        /**
            删除一个模型
        **/
        deleteModel : function(){
            deleteNode() ;
        },
        unload : function(){
            
        }
    });
    return model;
});
