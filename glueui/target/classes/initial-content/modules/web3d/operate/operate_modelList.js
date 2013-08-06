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

/***
    处理模型列表 #1483 #1594
*/

define("web3d/operate/operate_modelList",["dojo/topic","web3d/Lib/syncLib","web3d/Lib/x3domLib"],function(topic,syncLib,x3domLib){
    var _syncLib ;      // 定义syncLib
    var _x3domLib ;
    var array = {} ;    // 向2维发送的json，刷新左侧我的场景部分
    var scene ;         // 外层的scene
    
    /**
        从jcr中取得全部的模型，适用于第一次加载时
    **/
    var getAllModel = function(){
        _syncLib.getItemsByType("MESH",function(items){
            for(var i=0;i<items.length;i++){
                array[i] = {"modelName":items[i].data.name,"DEF":items[i].data.name,"modelRender":"true"};
            }
            topic.publish("command/module_action/modelList",array) ;        // 发送给2维
        });
    }
    
    /**
        添加模型的时候刷新左侧列表
    **/
    var createRefresh = function(){    
        array = {} ;    
        var trans = _x3domLib.getTransformList() ;
        var count = 0 ;
        for(var i = 0 ; i < trans.length ;i ++){
            var trans_render = trans[i]._xmlNode.getAttribute("render") ;
            var trans_def = trans[i]._DEF ;
            if(trans_def.indexOf("camera") != -1){  // 不添加摄像机
                continue ;
            }
            array[count] = {"modelName":trans_def,"DEF":trans_def,"modelRender":trans_render};
            count ++ ;
        }
        topic.publish("command/module_action/modelList",array) ;       
    }
    
    /**
        删除模型时候刷新左侧列表
        modelName : 删除的模型的name
    **/
    var removeRefresh = function(modelName){
        array = {} ;
        var trans = _x3domLib.getTransformList() ;
        var count = 0 ;
        for(var i = 0 ; i < trans.length ;i ++){
            var trans_def = trans[i]._DEF ;
            if(trans_def.indexOf("camera") != -1){  // 不添加摄像机
                continue ;
            }
            if(trans_def == modelName){ // 不添加删除过的
                continue ;
            }
            var trans_render = trans[i]._xmlNode.getAttribute("render") ;
            array[count] = {"modelName":trans_def,"DEF":trans_def,"modelRender":trans_render};
            count ++ ;
        }
        topic.publish("command/module_action/modelList",array) ;
    }
	

	var operate_modelList = dojo.declare([],{
		constructor : function(x3d){
            scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode ;
			_syncLib = new syncLib() ;
            _x3domLib  = new x3domLib(x3d) ;
		},
        // 添加时候的加载
        createReload : function(){
            createRefresh() ;
        },
        // 删除时候的加载
        removeReload : function(modelName){
            removeRefresh(modelName) ;
        },
        // init_action中的加载
        loadModelList : function(){
            getAllModel() ;
        }
	});
	return operate_modelList;
});

