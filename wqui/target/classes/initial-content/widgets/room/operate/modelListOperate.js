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

define("widgets/room/operate/modelListOperate", [
    "widgets/room/node/groupRoomNode"
], function(
    GroupRoomNode
){
    /**
     * 私有方法以及属性
     */
    var _groupRoomNode = null;
    /**
     * 公共方法及属性
     */
    return dojo.declare([], {
        constructor : function(x3d){
            _groupRoomNode = new GroupRoomNode(x3d);
		},
        getModelList : function(name){
            var _childrenList = _groupRoomNode.childrenList(name);
            var array = [];
            for(var i = 0; i < _childrenList.length; i++){
                var _def = _childrenList[i].getAttribute("def");
                array.push(_def);
            }
            return array;
        },
		unload : function(){}
    });
});