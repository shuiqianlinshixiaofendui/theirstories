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
define("web3d/Lib/x3domLib",["dojo/_base/declare"],function( declare ){
	/**
	 * 格式化名称
	 * 1. 在名称中，其它字符均改成下划线
	 * 2. 名称以数字开头，在数字前加下划线。
	 */
	function formatName(items_data_name){
		var items_name_character1 = items_data_name.substr(0,1);
		if(parseInt(items_name_character1)){
			items_data_name = "_" + items_data_name;
		}
		for(i = 0; i < items_data_name.split(".").length; i++){
			items_data_name = items_data_name.replace(".", "_");
		}
		return items_data_name;
	}
	function scene(x3d){
		var _scene = x3d.runtime.canvas.doc._viewarea._scene;
		var _xmlNode = _scene._xmlNode;
		var children = _xmlNode.children;
		for(var i = 0; i < children.length; i++){
			if(children[i].nodeName == "INLINE"){
				var _x3domNode = children[i]._x3domNode;
				var _childNodes = _x3domNode._childNodes;
				for(var j = 0; j < _childNodes.length; j++){
					if(_childNodes[j]._DEF){
						return _childNodes;
					}
					return 0;
				}
			}
		}
		return 0;
	}
	function transform(x3d){
		var _scene = x3d.runtime.canvas.doc._viewarea._scene;
        // console.log(_scene, " _scene");
        var _xmlNode = _scene._xmlNode;
        var _childNodes = _xmlNode.childNodes;
        // console.log(_childNodes, " _childNodes");
        return _childNodes;
	}
    /**
     * 去除默认的transform
     */
    function removeTransform(_def){
        if((_def == "grid") || (_def == "tagPoint") || (_def == "cameraLookatModule") || (_def == "trasviewpoint") || (_def == "boundingbox")){
            return 0;
        }
        return 1;
    }
    
	return declare("web3d/Lib/x3domLib", [], {
		constructor : function(x3d){
			// 初始化
			this._x3d = x3d;
		},
		/**
		 * 更新x3dom旋转、平移、缩放属性数据。
		 */
		/**
		 * 通过Scene的DEF获取Scene对象
		 * param : name -- Scene的DEF。
		 */
		// getScene : function (name){
			// var sceneList = scene(this._x3d);
			// for(var l = 0; l < sceneList.length; l++ ){
				// if(sceneList[l]._DEF === name){
					// var nodes = sceneList[l];
					// var xmlnode = nodes._xmlNode;
					// return xmlnode;
				// }
			// }
			// return 0;
		// },
		/**
		 * 通过模型DEF获取模型对象
		 * param : name -- 模型的DEF。
		 */
		getTransform : function (name){
			var transformList = transform(this._x3d);
			for(var i = 0; i < transformList.length; i++ ){
                if(transformList[i].nodeName == "TRANSFORM"){
                    var _def = transformList[i].getAttribute("def") ;
                    // if(_def === formatName(name)){
                    if(_def === name){
                        // var nodes = transformList[i];
                        // var xmlnode = nodes._xmlNode;
                        return transformList[i];
                    }
                }
            }
			return 0;
		},
		/**
		 * 获取x3d transform list
		 */
		getTransformList : function(){
            var transformList = transform(this._x3d);
			var transArray = [];
			for(var i = 0; i < transformList.length; i++){
				if(transformList[i].nodeName == "TRANSFORM"){
                    var _def = transformList[i].getAttribute("def") ;
                    if(_def && removeTransform(_def)){
                        transArray.push(transformList[i]._x3domNode);
                    }
					
				}
			}
			return transArray;
		}
	});
});