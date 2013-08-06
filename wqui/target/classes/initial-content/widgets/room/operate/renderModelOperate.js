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

define("widgets/room/operate/renderModelOperate", [], function(){
    /**
     * 私有方法以及属性
     */
    /**
     * 获取group
     */
    function getGroupByType(_scene,subType){
        var array = [];
        var childrens = _scene.children;
        for(var i = 0; i < childrens.length; i++){
            var _subType = childrens[i].getAttribute("subType");
            var nodeName = childrens[i].nodeName;
            if(nodeName == "GROUP" && _subType == subType){
                array.push(childrens[i]);
            }
        }
        return array;
    }
    
    function getAllObj(_sceneEdit){
        var array = [];
        var list = _sceneEdit.getElementsByTagName("group");
        for(var i = 0; i < list.length; i++){
            array.push(list[i].childNodes[0]._x3domNode);
        }
        return array;
    }
    /**
     * getTransformByType
     */
    function getTransformByType(group, subType){
        var array = [];
        var _childNodes = group.childNodes;
        for(var i = 0; i < _childNodes.length; i++){
            var _subType = _childNodes[i].getAttribute("subType");
            var nodeName_child = _childNodes[i].nodeName;
            if(nodeName_child == "TRANSFORM" && _subType == subType){
                // console.log(_childNodes[i], " _childNodes");
                array.push(_childNodes[i]);
            }
        }
        return array;
    }
    /**
     * 公共方法及属性
     */
    return dojo.declare([], {
        constructor : function(x3d, x3dEdit){
            // _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            // _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
		},
        /**
         * 按类型隐藏模型
         */
        hideByType : function(x3d,subType){
            try{
                _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
                var flag = false;
                var group = getGroupByType(_scene,subType);
                // console.log("subType : " + subType);
                for(var idx = 0; idx < group.length; idx++){
                    if(group[idx]){
                        // console.log(group[idx], " group[" + idx + "]");
                        var trans = getTransformByType(group[idx], subType);
                        // console.log(trans, " trans")
                        for(var i = 0; i < trans.length; i++){
                            trans[i]._x3domNode.hide(true);
                            flag = true;
                        }
                    } 
                }
                if(flag){
                    return 1;
                } else {
                    return 0;
                }
            } catch(e){
                alert("hideModelOperate.js hideByType error : " + e);
            }
        },
        /**
         * 按类型显示模型
         */
        showByType : function(x3d,subType){
            try{
                _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
                var flag = false;
                var group = getGroupByType(_scene,subType);
                // console.log("subType : " + subType);
                for(var idx = 0; idx < group.length; idx++){
                    if(group[idx]){
                        // console.log(group[idx], " group[" + idx + "]");
                        var trans = getTransformByType(group[idx], subType);
                        for(var i = 0; i < trans.length; i++){
                            trans[i]._x3domNode.hide(false);
                            flag = true;
                        }
                    } 
                }
                if(flag){
                    return 1;
                } else {
                    return 0;
                }
            } catch(e){
                alert("hideModelOperate.js showByType error : " + e);
            }
        },
        /**
         * 显示所有模型
         */
        showAll : function(x3dEdit){
            _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
            var list = getAllObj(_sceneEdit);
            for(var i = 0 ;i < list.length ;i++){
                list[i].hide(false);
            }
        },
        /**
         * 隐藏所有模型
         */
        hideAll : function(x3dEdit){
            _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
            var list = getAllObj(_sceneEdit);
            for(var i = 0 ;i < list.length ;i++){
                list[i].hide(true);
            }
        },
		unload : function(){}
    });
});