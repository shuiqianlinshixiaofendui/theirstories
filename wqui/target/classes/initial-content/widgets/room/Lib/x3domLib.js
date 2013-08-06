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
 *  获取x3dom节点中
 *  帖子 ： #2330 
**/

define("widgets/room/Lib/x3domLib",[],function(){
    var x3domLib = dojo.declare([],{
        constructor : function(){
           
        },
        /**
        *  @brief 根据def查找room_scene 中的group
        *  @param def ：group的def
        **/
        getRoomSceneGroupByDef : function(def){
            var roomScene = document.getElementById("room_scene") ;
            var roomSceneChildren = roomScene._x3domNode._childNodes ;
            for(var i = 0 ; i < roomSceneChildren.length ; i ++){
                var roomSceneGroupDef = roomSceneChildren[i]._DEF ;                 // group 的DEF
                if(roomSceneGroupDef == def){                                       // 找到room_x3dEdit中的对应group
                    return roomSceneChildren[i] ;
                }
            }
            return null ;
        }, 
        /**
        *  @brief 根据def查找room_scene 中的transform
        *  @param def ：transform的def
        **/
        getRoomSceneTransform : function(def){
            var roomScene = document.getElementById("room_scene") ;
            //  name 的名字居然可以不区分大小写。。
            var roomSceneTransList = roomScene.getElementsByTagName("TraNsform") ;          // 查找room_scene中全部的transform
            for(var i = 0 ; i < roomSceneTransList.length ; i ++){
                var transDef = roomSceneTransList[i]._x3domNode._DEF ;
                if(transDef == def){
                    return roomSceneTransList[i]._x3domNode;
                }
            }
            return null ;
        },
        /**
        *  @brief room_scene中的全部transform
        **/
        getRoomSceneAllTransforms : function(){
            var roomEdit = document.getElementById("room_scene") ;
            var roomEditTransList = roomEdit.getElementsByTagName("Transform") ;          // 查找room_scene中全部的transform
            if(roomEditTransList){
                return roomEditTransList ;
            }
            return null ;
        },
        /********************************roomEdit_scene********************************/
        /**
        *  @brief 根据def查找roomEdit_scene中的group
        *  @param def ：group的def
        **/
        getRoomSceneEditGroupByDef : function(def){
             var roomSceneEdit = document.getElementById("roomEdit_scene") ;
             var roomSceneEditChildren = roomSceneEdit._x3domNode._childNodes ;
             for(var i = 0 ; i < roomSceneEditChildren.length ; i ++){
                 var roomSceneEditGroupDef = roomSceneEditChildren[i]._DEF ;
                 if(roomSceneEditGroupDef == def){
                    return roomSceneEditChildren[i] ;
                 }
             }
             return null ;
        },
        /**
        *  @brief 根据def查找roomEdit_scene 中的transform
        *  @param def ：transform的def
        **/
        getRoomSceneEditTransform : function(def){
            var roomEdit = document.getElementById("roomEdit_scene") ;
            var roomEditTransList = roomEdit.getElementsByTagName("Transform") ;       // 查找roomEdit_scene中全部的transform
            for(var i = 0 ; i < roomEditTransList.length ; i ++){
                var transDef = roomEditTransList[i]._x3domNode._DEF ;
                if(transDef == def){
                    return roomEditTransList[i]._x3domNode;
                }
            }
            return null ;
        },
        /**
        *  @brief roomEdit_scene中的全部transform
        **/
        getRoomSceneEditAllTransforms : function(){
            var roomEdit = document.getElementById("roomEdit_scene") ;
            var roomEditTransList = roomEdit.getElementsByTagName("Transform") ;      // 查找roomEdit_scene中全部的transform
            if(roomEditTransList){
                return roomEditTransList ;
            }
            return null ;
        }
    });
    
    return x3domLib;
});
