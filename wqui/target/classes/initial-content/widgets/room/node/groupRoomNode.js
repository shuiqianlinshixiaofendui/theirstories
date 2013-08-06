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

define("widgets/room/node/groupRoomNode", [
    "widgets/Mask/Mask"
], function(
    Mask
){
    /**
     * 私有方法以及属性
     */
     var _scene = null;
     var _list = null;
     var _handle = null;
     var _mainWidget;
     /**
      * 创建group
      */
     function groupBuild(name, subType){
        // console.log(name, " name");
        var group = document.createElement('Group');
        group.setAttribute("DEF", name + "_Group");
        group.setAttribute("subType", subType);
        return group;
     }
     /**
      * 创建transform
      */
     function transBuild(transData){
        // console.log(transData, " transData");
        // var name = transData.name;
        var referModel = null;
        var keyList = {};
        // var subType = transData.subType;
        // var isLock = transData.isLock;
        var location = [0, 0, 0];
        var scale = [1, 1, 1];
        var rotation = [0, 0, 0, 0];
        if(typeof(transData.name) != "undefined"){
            transData.DEF = transData.name;
            keyList["name"] = "name";
            // delete transData.name;
        } else {
            transData._DEF = null;
        }
        if(typeof(transData.referModel) != "undefined"){
            referModel = transData.referModel;
            keyList["referModel"] = "referModel";
            // delete transData.referModel;
        }
        if(typeof(transData.location) == "object"){
            location = transData.location;
            keyList["location"] = "location";
            // delete transData.location;
        }
        if(typeof(transData.scale) == "object"){
            scale = transData.scale;
            keyList["scale"] = "scale";
            // delete transData.scale;
        }
        if(typeof(transData.rotation) == "object"){
            rotation = transData.rotation;
            keyList["rotation"] = "rotation";
            // delete transData.rotation;
        }
        var trans = document.createElement('Transform');
        // trans.setAttribute("_DEF", name);
        // trans.setAttribute("subType", subType);
        // trans.setAttribute("isLock", isLock);
		// console.log(keyList, "keyList");
		// console.log(transData.subType, "transData.subType");
        for(var i in transData){
			// console.log(typeof(keyList[i]), i);
            if(typeof(transData[i]) != "object" && typeof(keyList[i]) == "undefined"){
				// console.log(transData[i], "transData[" + i +"]");
                trans.setAttribute(i, transData[i]);
            }
        }
        trans.setAttribute("id",transData.name) ;
        trans.setAttribute("translation", location[0] + " " + location[1] + " " + location[2] );
        trans.setAttribute("scale", scale[0] + " " + scale[1] + " " + scale[2]);
        trans.setAttribute("rotation",rotation[0] + " " + rotation[1] + " " + rotation[2] + " " + rotation[3]) ;
        // 创建Inline
        var inline = document.createElement("Inline");
        // inline.setAttribute("DEF","data_inline");
        inline.setAttribute("url", referModel + ".x3d");   
        trans.appendChild(inline);
        return trans;
        // group.appendChild(trans);
        // _scene.appendChild(group);
     }
     /**
      * 设置节点_x3domNode属性
      * param : node -- trans._x3domNode
      * param : property -- 属性值
      */
     function setNodeProperty(node, property){
        var location = [0, 0, 0];
        var scale = [1, 1, 1];
        var rotation = [0, 0, 0, 0];
        if(typeof(property.location) == "object"){
            location = property.location;
        }
        if(typeof(property.scale) == "object"){
            scale = property.scale;
        }
        if(typeof(property.rotation) == "object"){
            rotation = property.rotation;
        }
        node._DEF = property._DEF;
        node._vf.translation.x = location[0];
        node._vf.translation.y = location[1];
        node._vf.translation.z = location[2];
        node._vf.scale.x = scale[0];
        node._vf.scale.y = scale[1];
        node._vf.scale.z = scale[2];

        var axis = new x3dom.fields.SFVec3f(rotation[0],rotation[1],rotation[2]);
        var quaternion = new x3dom.fields.Quaternion.axisAngle(axis,rotation[3]);
        node._vf.rotation.x = quaternion.x;
        node._vf.rotation.y = quaternion.y;
        node._vf.rotation.z = quaternion.z;
        node._vf.rotation.w = quaternion.w;
        /*
        node._vf.rotation.x = rotation[0];
        node._vf.rotation.y = rotation[1];
        node._vf.rotation.z = rotation[2];
        node._vf.rotation.w = rotation[3];
        */
     }
     /**
      * 获取group对象
      */
     function getGroup(name){
        var childrens = _scene.children;
        // console.log(childrens, " childrens");
        for(var i = 0; i < childrens.length; i++){
            var _def = childrens[i].getAttribute("def");
            var nodeName = childrens[i].nodeName;
            if(nodeName == "GROUP" && _def == (name + "_Group")){
                return childrens[i];
            }
        }
        return 0;
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
                // 判断inline是否加载完成
                if(_list && _list.length){
                    createNode(_list[0]);
                } else {
                    var timeout = setTimeout(function(){
                        Mask.hide();
                        
                        if(_mainWidget){
                            _mainWidget.initFun();
                        }
                        
                    },500);
                }
            }
            old_x3dom_tick.call(this);
        }
    }
    /**
     * 创建节点
     */
    function createNode(json){
        if(typeof(json.subType) == "undefined"){
            return ;
        }
        if(typeof(json) == "object"){
            _list.shift();
            // console.log(_list, " _list");
            // console.log(_list.length, " _list.length");
            var name = json.name;
            var group = groupBuild(name, json.subType);
            _scene.appendChild(group);
            var trans = transBuild(json);
            group.appendChild(trans);
            // setNodeProperty(trans._x3domNode, json);
            
            var group = groupBuild(name, json.subType);
            _sceneEdit.appendChild(group);
            json.name = json.name + "_edit" ;
            var trans = transBuild(json);
            group.appendChild(trans);
            // setNodeProperty(trans._x3domNode, json);
            
            x3dIsLoading();
        }
    }
    /**
     * 公共方法及属性
     */
    return dojo.declare([], {
        constructor : function(x3d, x3dEdit ,mainWidget){
            _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            _sceneEdit = x3dEdit.runtime.canvas.doc._viewarea._scene._xmlNode;
            _mainWidget = mainWidget;
		},
        /**
         * 创建墙体
         */
        createRoom : function(list){
            try{
                if(typeof(list) == "object" && list.length){
                    Mask.show();
                    _list = list;
                    // console.log(list, " list");
                    createNode(list[0]);
                    return 1;
                } else {
                    return 0;
                }
            } catch(e){
                alert("groupRoomNode.js, createRoom error : " + e);
            }
        },
        addNode : function(json){
            try{
                if(typeof(json.subType) == "undefined"){
                    return ;
                }
                if(typeof(json) == "object"){
                    Mask.show();
                    var group = groupBuild(json.name, json.subType);
                    _scene.appendChild(group);
                    var trans = transBuild(json);
                    group.appendChild(trans);
                    // setNodeProperty(trans._x3domNode, json);
                    x3dIsLoading();
                    return 1;
                } else {
                    return 0;
                }
            } catch(e){
                alert("groupRoomNode.js, addNode error : " + e);
            }
        },
        removeNode : function(name){
            try{
                var childrens = _scene.children;
                var flag = 0;
                // console.log(childrens, " childrens");
                for(var i = 0; i < childrens.length; i++){
                    var _def = childrens[i].getAttribute("def");
                    if(_def == (name + "_Group")){
                        _scene.removeChild(childrens[i]);
                        flag = 1;
                    }
                }
                if(flag){
                    return 1;
                } else {
                    return 0;
                }
            } catch(e){
                alert("groupRoomNode.js, removeNode error : " + e);
            }
        },
        /**
         * group 子节点
         * param : name -- group name
         */
        childrenList : function(name){
            try{
                var array = [];
                // var group = getGroup(name);
                // var _childNodes = group.childNodes;
                // for(var i = 0; i < _childNodes.length; i++){
                    // var _def_child = _childNodes[i].getAttribute("def");
                    // var nodeName_child = _childNodes[i].nodeName;
                    // if(nodeName_child == "TRANSFORM" && _def_child != name){
                        // array.push(_childNodes[i]);
                    // }
                // }
                return array;
            } catch(e){
                alert("groupRoomNode.js, childrenList error : " + e);
            }
        },
		unload : function(){}
    });
});