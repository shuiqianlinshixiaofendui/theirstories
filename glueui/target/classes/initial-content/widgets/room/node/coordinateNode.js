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
 
define("widgets/room/node/coordinateNode", [
    "widgets/room/utils/boundingBox"
], function(
    BoundingBox
){
    /**
     * 变量
     */
    var _boundingBox = null;
     /**
     * 创建平移坐标系
     */
     function createCoordinate_move(name){
        try{
            var transform_map = document.createElement('Transform');
            transform_map.setAttribute("id", name + "_coordinateMap");
            transform_map.setAttribute("def", name + "_coordinateMap");
            transform_map.setAttribute("rotation", "1 0 0 " + (Math.PI / 2));
            var transform = document.createElement('Transform');
            transform.setAttribute("id", name + "_coordinate");
            transform.setAttribute("def", name + "_coordinate");
            var coordinate = createCoordinate();
            var json_x = {
                def : "arrow_x",
                translation : "0 -5 0",
                rotation : "0 0 1 " + (Math.PI),
                render : true,
                diffuseColor : "0 1 0",
                _heightCone : 1,
                _radiusCone : 0.4
            }
            var arrow_x = createArrow(json_x);
            coordinate[0].appendChild(arrow_x);
            var json_y = {
                def : "arrow_y",
                translation : "0 5 0",
                rotation : "0 0 0 0",
                render : true,
                diffuseColor : "0 0 1",
                _heightCone : 1,
                _radiusCone : 0.4
            }
            var arrow_y = createArrow(json_y);
            coordinate[1].appendChild(arrow_y);
            var json_z = {
                def : "arrow_z",
                translation : "0 -5 0",
                rotation : "1 0 0 " + (Math.PI),
                render : false,
                diffuseColor : "1 0 0",
                _heightCone : 1,
                _radiusCone : 0.4
            }
            var arrow_z = createArrow(json_z);
            coordinate[2].appendChild(arrow_z);
            
            transform.appendChild(coordinate[0]);
            transform.appendChild(coordinate[1]);
            transform.appendChild(coordinate[2]);
            transform_map.appendChild(transform);
            return transform_map;
        } catch(e){
            alert("coordinateNode.js createCoordinate_move error : " + e);
        }
    }
    
     /**
     * 创建缩放坐标系
     */
     function createCoordinate_zoom(name){
        try{
            var transform_map = document.createElement('Transform');
            transform_map.setAttribute("id", name + "_coordinateMap");
            transform_map.setAttribute("def", name + "_coordinateMap");
            transform_map.setAttribute("rotation", "1 0 0 " + (Math.PI / 2));
            var transform = document.createElement('Transform');
            transform.setAttribute("id", name + "_coordinate");
            transform.setAttribute("def", name + "_coordinate");
            var coordinate = createCoordinate();
            var json_x = {
                def : "box_x",
                translation : "0 -5 0",
                rotation : "0 0 1 " + (Math.PI),
                render : true,
                diffuseColor : "0 1 0",
                _size : "0.4 0.4 0.4"
            }
            var arrow_x = createBox(json_x);
            coordinate[0].appendChild(arrow_x);
            var json_y = {
                def : "box_y",
                translation : "0 5 0",
                rotation : "0 0 0 0",
                render : true,
                diffuseColor : "0 0 1",
                _size : "0.4 0.4 0.4"
            }
            var arrow_y = createBox(json_y);
            coordinate[1].appendChild(arrow_y);
            var json_z = {
                def : "box_z",
                translation : "0 -5 0",
                rotation : "1 0 0 " + (Math.PI),
                render : false,
                diffuseColor : "1 0 0",
                _size : "0.4 0.4 0.4"
            }
            var arrow_z = createBox(json_z);
            coordinate[2].appendChild(arrow_z);
            
            transform.appendChild(coordinate[0]);
            transform.appendChild(coordinate[1]);
            transform.appendChild(coordinate[2]);
            transform_map.appendChild(transform);
            return transform_map;
        } catch(e){
            alert("coordinateNode.js createCoordinate_zoom error : " + e);
        }
    }
    
    /**
     * 创建旋转坐标系
     */
     function createCoordinate_rotation(name){
        try{
            var transform_map = document.createElement('Transform');
            transform_map.setAttribute("id", name + "_coordinateMap");
            transform_map.setAttribute("def", name + "_coordinateMap");
            transform_map.setAttribute("rotation", "1 0 0 " + (Math.PI / 2));
            var transform = document.createElement('Transform');
            transform.setAttribute("id", name + "_coordinate");
            transform.setAttribute("def", name + "_coordinate");
            var json_x = {
                def : "circle_x",
                translation : "0 0 0",
                rotation : "0 0 1 " + (Math.PI / 2),
                render : true,
                // rotation : "0 0 0 0",
                diffuseColor : "0 1 0",
                _width : 2,
                _radius : 10
            }
            var circle_x = createCircle(json_x);
            transform.appendChild(circle_x);
            var json_y = {
                def : "circle_y",
                translation : "0 0 0",
                rotation : "0 1 0 " + (Math.PI / 2),
                render : true,
                // rotation : "0 0 0 0",
                diffuseColor : "0 0 1",
                _width : 2,
                _radius : 10
            }
            var circle_y = createCircle(json_y);
            transform.appendChild(circle_y);
            var json_z = {
                def : "circle_z",
                translation : "0 0 0",
                rotation : "1 0 0 " + (Math.PI / 2),
                render : false,
                // rotation : "0 0 0 0",
                diffuseColor : "1 0 0",
                _width : 2,
                _radius : 10
            }
            var circle_z = createCircle(json_z);
            transform.appendChild(circle_z);
            transform_map.appendChild(transform);
            return transform_map;
        } catch(e){
            alert("coordinateNode.js createCoordinate_rotation error : " + e);
        }
    }
    
    /**
     * 创建缩放的圆环
     */
    function createCircle(json){
        try{
            var transform = document.createElement('Transform');
            transform.setAttribute("id", json.def);
            transform.setAttribute("def", json.def);
            transform.setAttribute("translation", json.translation);
            transform.setAttribute("rotation", json.rotation);
            transform.setAttribute("render", json.render);
            var shape = document.createElement('shape');
            shape.setAttribute("id", json.def);
            shape.setAttribute("def", json.def);
            var appearancey = document.createElement('Appearance');
            var materialy = document.createElement('Material');
            materialy.setAttribute("diffuseColor", json.diffuseColor);
            var cir2D = document.createElement("Circle2D");
            cir2D.setAttribute("stroke-width", json._width);
            cir2D.setAttribute("radius", json._radius);
            appearancey.appendChild(materialy);
            shape.appendChild(appearancey);
            shape.appendChild(cir2D);
            transform.appendChild(shape);
            return transform;
        } catch(e){
            alert("coordinateNode.js createCircle error : " + e);
        }
    }
    
    /**
     * 创建十字坐标系
     */
     function createCoordinate(){
        try{
            // var transform = document.createElement('Transform');
            // transform.setAttribute("id", "coordinate");
            // transform.setAttribute("def", "coordinate");
            // transform.setAttribute("translation", "-20 0 0");
            var json_x = {
                def : "coordinate_x",
                translation : "5 0 0",
                rotation : "0 0 1 " + (Math.PI / 2),
                render : true,
                diffuseColor : "0 1 0",
                height : 10,
                radius : 0.06
            }
            var axis_x = createAxis(json_x);
            // axis_x.setAttribute("translation", "0 0 0");
            var json_y = {
                def : "coordinate_y",
                translation : "0 5 0",
                rotation : "0 0 0 0",
                render : true,
                diffuseColor : "0 0 1",
                height : 10,
                radius : 0.06
            }
            var axis_y = createAxis(json_y);
            var json_z = {
                def : "coordinate_z",
                translation : "0 0 -5",
                rotation : "1 0 0 " + (Math.PI / 2),
                render : false,
                diffuseColor : "1 0 0",
                height : 10,
                radius : 0.06
            }
            var axis_z = createAxis(json_z);
            // transform.appendChild(axis_x);
            // transform.appendChild(axis_y);
            // transform.appendChild(axis_z);
            // console.log([axis_x, axis_y, axis_z], " [axis_x, axis_y, axis_z]");
            return [axis_x, axis_y, axis_z];
        } catch(e){
            alert("coordinateNode.js createCoordinate error : " + e);
        }
    }
    
    /**
     * 箭头
    */
    function createArrow(json){
        try{
            var transform = document.createElement('Transform');
            transform.setAttribute("id", json.def);
            transform.setAttribute("def", json.def);
            transform.setAttribute("translation", json.translation);
            transform.setAttribute("rotation", json.rotation);
            transform.setAttribute("render", json.render);
            var shape = document.createElement('shape');
            shape.setAttribute("def", json.def);
            var appearancey = document.createElement('Appearance');
            var materialy = document.createElement('Material');
            materialy.setAttribute("diffuseColor", json.diffuseColor);
            var cone = document.createElement('Cone');
            cone.setAttribute("height", json._heightCone);
            cone.setAttribute("bottomradius", json._radiusCone);
            appearancey.appendChild(materialy);
            shape.appendChild(appearancey);
            shape.appendChild(cone);
            transform.appendChild(shape);
            return transform;
        } catch(e){
            alert("coordinateNode.js createArrow error : " + e);
        }
    }
    
    /**
     * box
    */
    function createBox(json){
        try{
            var transform = document.createElement('Transform');
            transform.setAttribute("id", json.def);
            transform.setAttribute("def", json.def);
            transform.setAttribute("translation", json.translation);
            transform.setAttribute("rotation", json.rotation);
            transform.setAttribute("render", json.render);
            var shape = document.createElement('shape');
            shape.setAttribute("def", json.def);
            var appearancey = document.createElement('Appearance');
            var materialy = document.createElement('Material');
            materialy.setAttribute("diffuseColor", json.diffuseColor);
            var box = document.createElement('Box');
            box.setAttribute("size", json._size);
            appearancey.appendChild(materialy);
            shape.appendChild(appearancey);
            shape.appendChild(box);
            transform.appendChild(shape);
            return transform;
        } catch(e){
            alert("coordinateNode.js createBox error : " + e);
        }
    }
    /**
     * 创建轴
     */
    function createAxis(json){
        try{
            var transform = document.createElement('Transform');
            transform.setAttribute("id", json.def);
            transform.setAttribute("def", json.def);
            transform.setAttribute("translation", json.translation);
            transform.setAttribute("rotation", json.rotation);
            transform.setAttribute("render", json.render);
            var shape = document.createElement('shape');
            shape.setAttribute("id", json.def);
            shape.setAttribute("def", json.def);
            var appearancey = document.createElement('Appearance');
            var materialy = document.createElement('Material');
            materialy.setAttribute("diffuseColor", json.diffuseColor);
            var cylinder = document.createElement('Cylinder');
            cylinder.setAttribute("height", json.height);
			cylinder.setAttribute("radius", json.radius);
            appearancey.appendChild(materialy);
            shape.appendChild(appearancey);
            shape.appendChild(cylinder);
            transform.appendChild(shape);
            return transform;
        } catch(e){
            alert("coordinateNode.js createAxis error : " + e);
        }
    }
    /**
     * 创建动态线
     */
    function createCoordinateLine(json){
        try{
            var transform = document.createElement('Transform');
            transform.setAttribute("id", json.def);
            transform.setAttribute("def", json.def);
            transform.setAttribute("translation", json.translation);
            transform.setAttribute("rotation", json.rotation);
            transform.setAttribute("render", json.render);
            var shape = document.createElement('shape');
            var appearancey = document.createElement('Appearance');
            var materialy = document.createElement('Material');
            materialy.setAttribute("diffuseColor", json.diffuseColor);
            var cylinder = document.createElement('Cylinder');
            cylinder.setAttribute("height", json.height);
			cylinder.setAttribute("radius", json.radius);
            appearancey.appendChild(materialy);
            shape.appendChild(appearancey);
            shape.appendChild(cylinder);
            transform.appendChild(shape);
            return transform;
        } catch(e){
            alert("coordinateNode.js createCoordinateLine error : " + e);
        }
    }
    
    /**
     * 设置坐标系属性
     */
    function setCoordinateProperty(modelObj, coordinate){
        try{
            var translation = modelObj._vf.translation;
            var rotation = modelObj._vf.rotation;
            var scale = modelObj._vf.scale;
            // var _scale = (Number(scale.x) > Number(scale.y) ? Number(scale.x) : Number(scale.y)) > Number(scale.z) ? 
            // (Number(scale.x) > Number(scale.y) ? Number(scale.x) : Number(scale.y)) : Number(scale.z);
            // scale = (Number(_scale) * 2) + " " + (Number(_scale) * 2) + " " + (Number(_scale) * 2);
            var trans = translation.x + " " + translation.y + " " + translation.z;
            
            // 计算模型包围盒
            var bboxCurrent = _boundingBox.getBoundingBox(modelObj);
			var minCurrent = bboxCurrent.min;
			var maxCurrent = bboxCurrent.max;
			var diameterCurrent = maxCurrent.subtract(minCurrent).length();
			var radius = diameterCurrent / 2 * 0.1;
            var size = radius + " " + radius + " " + radius;
            // var size = max.subtract(min);
            // var _size = (Number(size.x) > Number(size.y) ? Number(size.x) : Number(size.y)) > Number(size.z) ? 
            // (Number(size.x) > Number(size.y) ? Number(size.x) : Number(size.y)) : Number(size.z);
            // size = (Number(_size) * 1) + " " + (Number(_size) * 1) + " " + (Number(_size) * 1);
            
            coordinate.setAttribute("translation", trans);
            coordinate.setAttribute("scale", size);
        } catch(e){
            alert("coordinateNode.js setCoordinateProperty error : " + e);
        }
    }
	
	/**
     * 通过mesh返回transform对象
     */
    function  getTransformAncestor(node){						
        if(node._parentNodes.length){
            var tagName = node._parentNodes[0]._xmlNode.tagName;
            if(tagName=="Transform" || tagName=="Group" || tagName=="GROUP" || 
                tagName=="INLINE" || tagName=="Inline" || 
                tagName=="TRANSFORM" ){
                return getTransformAncestor(node._parentNodes[0]);
            }else{
                if(node._parentNodes[0]._parentNodes[0]){
                    return node._parentNodes[0]._parentNodes[0]._parentNodes[0];
                }else{
                    return node;
                }
            }
        } else {
            var def = node._DEF.split("_")[2];
            if(def == "coordinateMap"){
                return node;
            }
            return null;
        }
    }
    
    /**
     * 返回當前transform所屬的scene
     * param : node -- x3dom Object
     */
    function getSceneAncestor(node){
        // console.log(node, " node");
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
    }
    
    /**
     * 公有方法
     */
    return dojo.declare([], {
        constructor : function(x3d){
            // _scene = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
            _boundingBox = new BoundingBox();
		},
        /**
         * 创建平移坐标系
         */
        createMove : function(_sceneName, modelObj){
            try{
                if(modelObj){
                    var _scene = document.getElementById(_sceneName);
                    // console.log(_scene, " _scene");
                    if(_scene){
                        this.removeCoordinate(_sceneName);
                        var coordinateMap = createCoordinate_move(_scene._x3domNode._DEF);
                        _scene.appendChild(coordinateMap);
                        setCoordinateProperty(modelObj, coordinateMap);
                        this.createCoordinateLine(coordinateMap, _sceneName);
                        this.setBelongsDEf(coordinateMap, modelObj._DEF);
                    }
                }
            } catch(e){
                alert("coordinateNode.js createMove error : " + e);
            }
        },
        /**
         * 创建旋转坐标系
         */
        createRotation : function(_sceneName, modelObj){
            try{
                if(modelObj){
                    var _scene = document.getElementById(_sceneName);
                    // console.log(_scene, " _scene");
                    if(_scene){
                        this.removeCoordinate(_sceneName, modelObj);
                        var coordinateMap = createCoordinate_rotation(_scene._x3domNode._DEF);
                        _scene.appendChild(coordinateMap);
                        setCoordinateProperty(modelObj, coordinateMap);
                        this.createCoordinateLine(coordinateMap, _sceneName);
                        this.setBelongsDEf(coordinateMap, modelObj._DEF);
                    }
                }
            } catch(e){
                alert("coordinateNode.js createRotation error : " + e);
            }
        },
        /**
         * 创建缩放坐标系
         */
        createZoom : function(_sceneName, modelObj){
            try{
                if(modelObj){
                    var _scene = document.getElementById(_sceneName);
                    if(_scene){
                        this.removeCoordinate(_sceneName);
                        var coordinateMap = createCoordinate_zoom(_scene._x3domNode._DEF);
                        _scene.appendChild(coordinateMap);
                        setCoordinateProperty(modelObj, coordinateMap);
                        this.createCoordinateLine(coordinateMap, _sceneName);
                        this.setBelongsDEf(coordinateMap, modelObj._DEF);
                    }
                }
            } catch(e){
                alert("coordinateNode.js createZoom error : " + e);
            }
        },
        
        /**
         * 设置坐标系是属于哪个模型
         * 设置关键字为belongs
         * belongs值为模型DEF
         */
        setBelongsDEf : function(coordinateMap, name){
            try{
                coordinateMap.setAttribute("belongs", name);
            } catch(e){
                alert("coordinateNode.js setBelongs error : " + e);
            }
        },
        // createCoordinateMap : function(type){
            // try{
                // if(Spolo.selectedObj && Spolo.selectedObj._DEF != "coordinateMap"){
                    // switch(type){
                        // case 1 :
                            // this.createMove();
                            // break;
                        // case 2 :
                            // this.createRotation();
                            // break;
                        // case 3 :
                            // this.createZoom();
                            // break;    
                        // default :
                            // console.log("without operate ! ");
                    // }
               // }
           // } catch(e){
                // alert("coordinateNode.js createCoordinateMap error : " + e);
            // }
        // },
        /**
         * 创建水平线
         */
        createCoordinateLine : function(coordinateMap, _sceneName){
            try{
                var coordinateLine = document.getElementById("coordinateLine");
                if(coordinateLine == null){
                    // var coordinateMap = document.getElementById("coordinateMap");
                    var coordinateLine_x = {
                        def : _sceneName + "_coordinateLine_x",
                        id : _sceneName + "_coordinateLine_x",
                        translation : "0 0 0",
                        rotation : "0 0 1 " + (Math.PI / 2),
                        diffuseColor : "0.2 0.5 0.5",
                        render : "false",
                        height : 20,
                        radius : 0.05
                    }
                    var coordinateLine_y = {
                        def : _sceneName + "_coordinateLine_y",
                        id : _sceneName + "_coordinateLine_y",
                        translation : "0 0 0",
                        rotation : "0 0 0 0",
                        diffuseColor : "0.2 0.5 0.5",
                        render : "false",
                        height : 20,
                        radius : 0.05
                    }
                    var coordinateLine_z = {
                        def : _sceneName + "_coordinateLine_z",
                        id : _sceneName + "_coordinateLine_z",
                       translation : "0 0 0",
                        rotation : "1 0 0 " + (Math.PI / 2),
                        diffuseColor : "0.2 0.5 0.5",
                        render : "false",
                        height : 20,
                        radius : 0.05
                    }
                    var coordLine_x = createCoordinateLine(coordinateLine_x);
                    var coordLine_y = createCoordinateLine(coordinateLine_y);
                    var coordLine_z = createCoordinateLine(coordinateLine_z);
                    coordinateMap.appendChild(coordLine_x);
                    coordinateMap.appendChild(coordLine_y);
                    coordinateMap.appendChild(coordLine_z);
                }
           } catch(e){
                alert("coordinateNode.js createCoordinateLine error : " + e);
           }
        },
        /**
         * 删除坐标系
         */
        removeCoordinate : function(_sceneName){
            try{
                var _scene = document.getElementById(_sceneName);
                if(_scene){
                    var coordinateMap = document.getElementById(_scene._x3domNode._DEF + "_coordinateMap");
                    if(coordinateMap){
                        _scene.removeChild(coordinateMap);
                    }
                }
            } catch(e){
                alert("coordinateNode.js removeCoordinate error : " + e);
            }
        },
        /**
         * 显示坐标系
         */
        showCoordinate : function(_sceneName){
            try{
                var coordinate = document.getElementById(_sceneName + "_coordinate");
                if(coordinate){
                    coordinate.setAttribute("render", "true");
                }
            } catch(e){
                alert("coordinateNode.js showCoordinate error : " + e);
            }
        },
        /**
         * 隐藏坐标系
         */
        hideCoordinate : function(_sceneName){
            try{
                var coordinate = document.getElementById(_sceneName + "_coordinate");
                if(coordinate){
                    coordinate.setAttribute("render", "false");
                }
            } catch(e){
                alert("coordinateNode.js hideCoordinate error : " + e);
            }
        },
        /**
         * 显示水平线
         */
        showCoordinateLine : function(shape){
            try{
                if(shape){
                    var room_coordinateLine = null;
                    var roomEdit_coordinateLine = null;
                    var _def = shape._xmlNode.getAttribute("def");
                    if(_def && (_def == "coordinate_x" || _def == "arrow_x" || _def == "circle_x" || _def == "box_x")){
                        var room_id = "room_scene_coordinateLine_x";
                        var roomEdit_id = "roomEdit_scene_coordinateLine_x";
                        room_coordinateLine = document.getElementById(room_id);
                        roomEdit_coordinateLine = document.getElementById(roomEdit_id);
                    } else if(_def && (_def == "coordinate_y" || _def == "arrow_y" || _def == "circle_y" || _def == "box_y")){
                        var room_id = "room_scene_coordinateLine_y";
                        var roomEdit_id = "roomEdit_scene_coordinateLine_y";
                        room_coordinateLine = document.getElementById(room_id);
                        roomEdit_coordinateLine = document.getElementById(roomEdit_id);
                    } else if(_def && (_def == "coordinate_z" || _def == "arrow_z" || _def == "circle_z" || _def == "box_z")){
                        var room_id = "room_scene_coordinateLine_z";
                        var roomEdit_id = "roomEdit_scene_coordinateLine_z";
                        room_coordinateLine = document.getElementById(room_id);
                        roomEdit_coordinateLine = document.getElementById(roomEdit_id);
                    }
                    if(room_coordinateLine){
                        room_coordinateLine.setAttribute("render", "true");
                        this.hideCoordinate("room_scene");
                    }
					if(roomEdit_coordinateLine){
                        roomEdit_coordinateLine.setAttribute("render", "true");
                        this.hideCoordinate("roomEdit_scene");
                    }
                }
            } catch(e){
                alert("coordinateNode.js showCoordinateLine error : " + e);
            }
        },
        /**
         * 隐藏水平线
         */
        hideCoordinateLine : function(){
            try{
                var room_coordinateLine_x = document.getElementById("room_scene_coordinateLine_x");
                var room_coordinateLine_y = document.getElementById("room_scene_coordinateLine_y");
                var room_coordinateLine_z = document.getElementById("room_scene_coordinateLine_z");
                if(room_coordinateLine_x){
                    room_coordinateLine_x.setAttribute("render", "false");
                }
                if(room_coordinateLine_y){
                    room_coordinateLine_y.setAttribute("render", "false");
                }
                if(room_coordinateLine_z){
                    room_coordinateLine_z.setAttribute("render", "false");
                }
                this.showCoordinate("room_scene");
				
				var roomEdit_coordinateLine_x = document.getElementById("roomEdit_scene_coordinateLine_x");
                var roomEdit_coordinateLine_y = document.getElementById("roomEdit_scene_coordinateLine_y");
                var roomEdit_coordinateLine_z = document.getElementById("roomEdit_scene_coordinateLine_z");
                if(roomEdit_coordinateLine_x){
                    roomEdit_coordinateLine_x.setAttribute("render", "false");
                }
                if(roomEdit_coordinateLine_y){
                    roomEdit_coordinateLine_y.setAttribute("render", "false");
                }
                if(roomEdit_coordinateLine_z){
                    roomEdit_coordinateLine_z.setAttribute("render", "false");
                }
                this.showCoordinate("roomEdit_scene");
            } catch(e){
                alert("coordinateNode.js hideCoordinateLine error : " + e);
            }
        },
        /**
         * 获取移动方向轴
         */
        getCurAxis : function(shape){
            try{
                if(shape){
                    var _def = shape._xmlNode.getAttribute("def");
                    var axis = null;
                    if(_def && (_def == "coordinate_x" || _def == "arrow_x" || _def == "circle_x" || _def == "box_x")){
                        axis = "x";
                    } else if(_def && (_def == "coordinate_y" || _def == "arrow_y" || _def == "circle_y" || _def == "box_y")){
                        axis = "y";
                    } else if(_def && (_def == "coordinate_z" || _def == "arrow_z" || _def == "circle_z" || _def == "box_z")){
                        axis = "z";
                    }
                    return axis;
                }
                return 0;
            } catch(e){
                alert("coordinateNode.js getCurAxis error : " + e);
            }
        },
		/**
         * 返回坐标系对象
         */
        getCurCoordinateName : function(shape){
            try{
                if(shape){
                    var coordinate = getTransformAncestor(shape);
					var name = coordinate._DEF;
                    if(coordinate && (name.indexOf("_coordinateMap") != -1)){
                        return coordinate._DEF;
                    }
                    return 0;
                }
            } catch(e){
                alert("coordinateNode.js public getCurCoordinateName error : " + e);
            }
        },
        /**
         * 是否允許添加坐標系
         */
        isAllowCoordinate : function(node){
            var _scene = getSceneAncestor(node);
            if(_scene){
                var def = _scene._DEF;
                if(def == "room_scene"){
                    return 1;
                } else if(def == "roomEdit_scene"){
                    return 2;
                }
            }
            return 0;
        },
		unload : function(){}
    });
});