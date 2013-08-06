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
 * 同步模型数据到JCR
 */

define("web3d/operate/operate_syncerdata", ["dojo/topic","dojo/on","web3d/Lib/syncLib","web3d/Lib/x3domLib"], function(topic,on,syncLib,x3domLib){
    var _syncLib;               // 实例化的syncLib
    var _x3domLib;              // 实例化的x3domLib
    var scene_data = {} ;       // scene中的数据

    /**
        从Scene中读取出全部的信息
    **/
    var getDataFromScene = function(){
        var transList = _x3domLib.getTransformList();       
        for(var i = 0; i < transList.length; i++){
            var trans_def = transList[i]._DEF;
            var index = trans_def.indexOf("camera") ;
            if(index != -1){
                continue ;
            }
            var vf = transList[i]._vf ;  
            // 将格式转换成与后台相同的格式 ， 即四位小数
            var trans_location = new Array( vf.translation.x.toFixed(4) , vf.translation.y.toFixed(4) , 
                                            vf.translation.z.toFixed(4));
            var trans_scale = new Array(vf.scale.x.toFixed(4) , vf.scale.y.toFixed(4) ,vf.scale.z.toFixed(4));
            
            var trans_axis = vf.rotation.toAxisAngle() ;
            var trans_rotation = new Array( trans_axis[0].x , trans_axis[0].y , trans_axis[0].z ,
                                            trans_axis[1].toFixed(4)) ;
                                            
            scene_data[i] = {"DEF" : trans_def , "location" : trans_location ,
                             "scale" : trans_scale , "rotation" : trans_rotation} ;
        }
    }
    
    /**
    *  getDataFromMesh ：从后台读取出全部的信息，逐一进行比较。
    *                    最后修改
    **/
    var getDataFromMesh = function() {
        var sync_data = {} ;                // 保存需要修改的数据
        var count = 0 ;                     // 记录需要修改的数据个数
        _syncLib.getItemsByType("MESH",function(items){
          for(var i = 0 ; i < items.length ; i ++) {
                var mesh_name = items[i].data.name ;
                var mesh_location = items[i].data.location ;
                var mesh_scale = items[i].data.scale ;
                var mesh_rotation = items[i].data.rotation_axis_angle ;
                for(var j in scene_data){
                    var data = scene_data[j] ;      
                    if(data.DEF === mesh_name ){
                        // 这里需要将数字转换成字符串再进行比较
                        if(data.location.toString() === mesh_location.toString()
                           && data.scale.toString() === mesh_scale.toString() 
                           && data.rotation[3].toString() === mesh_rotation[3].toString()){
                          continue ;
                        }else{
                            sync_data[count] = data ;
                            count ++ ;
                        }
                    }
                }
            }
            topic.publish("sys/save_console","数据同步中...");       // 发送同步信息
            _syncLib.updateItemByJson(sync_data) ;                   // 同步数据
            _syncLib.isFinish(function (){
                topic.publish("sys/save_console","数据同步完成！");  //数据同步完成
            });
            
        }) ;
        
    }
    
    /**
    *    syncItem ：从scene中获取数据并进行同步
    **/
    var syncItem = function(){
        getDataFromScene() ;        // 从Scene中获取数据
        getDataFromMesh() ;         // 从后台获取数据
    }
    
    
    var operate_syncerdata = dojo.declare([],{
		constructor : function(x3d){
			_syncLib = new syncLib() ;
            _x3domLib = new x3domLib(x3d) ;
		},
        /**
            同步模型信息
        **/
        syncModel : function(){
            syncItem() ;
        },
        unload : function (){}
	});
	return operate_syncerdata;
});