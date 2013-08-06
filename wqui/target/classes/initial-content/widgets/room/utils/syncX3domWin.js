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
 * 同步两个x3d场景节点数据
 */

define("widgets/room/utils/syncX3domWin", [], function(){
    /**
     * 私有方法
     */
    var _curScene = null;
    var _scene = null;
    /**
     * 返回當前transform所屬的scene
     * param : node -- x3dom Object
     */
    function getSceneAncestor(node){
        try{
            if(typeof(node) != "object" || !node){
                return ;
            }
            if(node._parentNodes.length){
                var tagName = node._parentNodes[0]._xmlNode.tagName;
                if(tagName == "Transform" || tagName == "Group" || tagName == "GROUP" || 
                    tagName == "INLINE" || tagName == "Inline" ||  // 根节点下的scene的tagName是SCENE,全大写
                    tagName == "TRANSFORM" ){
                    return getSceneAncestor(node._parentNodes[0]);
                }else{
                    if(node._parentNodes[0]){
                        return node._parentNodes[0];
                    }else{
                        return node;
                    }
                }
            } else if(node._xmlNode.tagName == "Scene" || node._xmlNode.tagName == "SCENE"){
                return node;
            }
            return null;
        } catch(e){
            alert("syncX3dom.js private getSceneAncestor error : " + e);
        }
    }
    
    /**
     * 返回别一个x3d transform object.
     */
    function getTransformObj(node){
        try{
            _curScene = getSceneAncestor(node);
            if(_curScene && _curScene._DEF && node && node._DEF){
                if(_curScene._DEF != "room_scene"){
                    _scene = document.getElementById("room_scene");
                } else if(_curScene._DEF != "roomEdit_scene"){
                    _scene = document.getElementById("roomEdit_scene");
                } else {
                    alert("_curScene object no exist ! ");
                }
                if(_scene){
                    var arrayTrans = _scene.getElementsByTagName("transform");
                    var nodeDef = node._DEF;
                    for(var i = 0; i < arrayTrans.length; i++){
                        var def = arrayTrans[i].getAttribute("def");
                        if(def == nodeDef){
                            return arrayTrans[i];
                        }
                    }
                }
            }
        } catch(e){
            alert("syncX3dom.js private getTransformObj error : " + e);
        }
    }
    
    /**
     * 公有方法
     */
    return dojo.declare([],{
        constructor : function(x3d, x3dEdit){
			
        },
        syncerNodeModel : function(modelObj){
			try{
				// console.log(0);
				if(modelObj){
					var syncerObj = getTransformObj(modelObj);
					// console.log(_scene._x3domNode._DEF, " _scene._x3domNode._DEF");
					if(syncerObj && _scene){
						var _translation = modelObj._xmlNode.getAttribute("translation");
						var _rotation = modelObj._xmlNode.getAttribute("rotation");
						var _scale = modelObj._xmlNode.getAttribute("scale");
						// console.log(_translation, " _translation");
						// syncerObj._x3domNode._trafo.setValues(_trafo);
						syncerObj.setAttribute("translation", _translation);
						syncerObj.setAttribute("rotation", _rotation);
						syncerObj.setAttribute("scale", _scale);
						var _coordinateMap = document.getElementById(_scene._x3domNode._DEF + "_coordinateMap");
						// console.log(_coordinateMap, " _coordinateMap");
						// console.log(_curScene, " _curScene");
						if(_coordinateMap && _curScene){
							var _coordinateMapOther = document.getElementById(_curScene._DEF + "_coordinateMap");
							var _trans_curScene = _coordinateMapOther.getAttribute("translation");
							var _rot_curScene = _coordinateMapOther.getAttribute("rotation");
							var _scale_curScene = _coordinateMapOther.getAttribute("scale");
							// console.log(_trans_curScene, " _trans_curScene");
							// console.log(_rot_curScene, " _rot_curScene");
							// console.log(_scale_curScene, " _scale_curScene");
							_coordinateMap.setAttribute("translation", _trans_curScene);
							_coordinateMap.setAttribute("rotation", _rot_curScene);
							_coordinateMap.setAttribute("scale", _scale_curScene);
						}
					}
				}
			} catch(e){
				alert("syncX3dom.js private syncerNodeModel error : " + e);
			}
		},
        syncerNodeCamera : function(){
            
        }
    });
});
