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
 *  封装scene中的内容，向其他同事提供数据 
 *  帖子 ： #2226 
**/

define("widgets/room/Lib/sceneLib",["spolo/data/scene"],function(scene){
    
    var sceneObj ;      // scene 对象
    
    
    var sceneLib = dojo.declare([],{
        constructor : function(){
            var loc = window.location.href;
            // var scenePath = loc.substr(loc.indexOf("?path=")+6);
            var scenePath = "/content/users/admin/scenelib/scene201304161023464940006980";
            sceneObj = new scene(scenePath);
        },
        /**@brief 获取类型为MESH的全部数据
           @param operate 回调函数
        **/
        getAllMeshList : function(operate){
            sceneObj.getMeshs(function(items){
                operate(items) ;
            }, null, true);
           
        },
        /**@brief 获取类型为CAMERA的全部数据
           @param operate 回调函数
        **/
        getAllCameraList : function(operate){
            sceneObj.getCameras(function(items){
               operate(items) ;
            }, null, true);
        },
        /**@brief 获取类型为MESH和CAMERA的全部数据
           @param operate 回调函数
        **/
        getMeshAndCamera : function(operate){
            sceneObj.ensureItems(function(items){
               operate(items) ;
            }, null, true);
        },
        /**@brief 当模型的位置等信息修改后同步
           @param json 需要同步的数据，可以是多个模型
        **/
        updateItemByJson : function(json){
            sceneObj.ensureItems(function(items){
                for(var j in json){
                    var json_data = json[j] ;                   // 当前json
                    var json_def = json_data.DEF ;
                    
                    var json_location = json_data.location ;    // 依次取出json中的数据
                    var json_scale = json_data.scale ;
                    var json_rotation = json_data.rotation ;
                    
                    for(var i=0; i<items.length; i++){          // 一次查找后台中和json中对象的数据
                        var item_name = items[i].data.name ;
                        if( item_name == json_def){             // 名称相同就同步
                            var item_location = items[i].data.location ;    // 依次取出item中的数据
                            var item_scale = items[i].data.scale ;
                            var item_rotation = items[i].data.rotation_axis_angle ;
                            
                            item_location[0] = json_location[0];            // 同步location
                            item_location[1] = json_location[1];
                            item_location[2] = json_location[2];
                                
                            item_scale[0] = json_scale[0];                  // 同步scale
                            item_scale[1] = json_scale[1];
                            item_scale[2] = json_scale[2];
                            
                            item_rotation[0] = json_rotation[0];            // 同步rotation
                            item_rotation[1] = json_rotation[1];
                            item_rotation[2] = json_rotation[2];
                            item_rotation[3] = json_rotation[3];
                            
                            items[i].data["sp:client:dirty"] = "true";  
                        }
                    }
                }
                sceneObj.saveItems();                               
            }, null, true); 
        },
        /**@brief 添加模型
           @param json 添加模型的信息
        **/
        createModel : function(json,callback){
            var flag ;
            sceneObj.createItem("MESH", json);
            sceneObj.saveItems(callback ); 
        },
        /**@brief 删除模型
           @param def 删除模型的def
        **/
        removeModel : function(def,callback){
           sceneObj.ensureItems(function(items){
               for(var i = 0 ; i < items.length ; i ++) {
                    if(def == items[i].data.name){
                        sceneObj.removeItem(items[i]) ;
                        sceneObj.saveItems(callback);
                    }
               }
            }, null, true);
        },
		/**
		 * 组装数据
		 */
		assembledData : function(callback){
			try{
				/*
				var list = [];
				sceneObj.ensureItems(function(items){
					for(var i = 0 ; i < items.length ; i ++) {
						if(items[i].data.type == "MESH"){
							// console.log(items[i].data, " items[" + i + "].data");
							var _location = items[i].data.location ;
							var _scale = items[i].data.scale ;
							var _rotation = items[i].data.rotation_axis_angle ;
							var _referModel = items[i].data.referModel ;
							var _hide = items[i].data.hide ;
							var date = {
								name : items[i].data.name + i,
								subType : "WALL",
								referModel : _referModel,
								hide : _hide,
								location : [_location[0], _location[1], _location[2]],
								rotation : [_rotation[0], _rotation[1], _rotation[2], _rotation[3]],
								scale : [_scale[0], _scale[1],_scale[2]]
							}
							list.push(date);
						}
					}
					callback(list);
				}, null, true);
				*/
				var list = [
					 {
						name : "qiang_1",
						subType : "WALL",
						referModel : "/modules/room/Test_Fangti/qiang_1",
						isLock : true,
						location : [1900, -200, 0],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					},
					{
						name : "qiang_2",
						subType : "WALL",
						referModel : "/modules/room/Test_Fangti/qiang_2",
						isLock : false,
						location : [-1900, -200, 0],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					},
					{
						name : "qiang_3",
						subType : "WALL",
						referModel : "/modules/room/Test_Fangti/qiang_3",
						isLock : true,
						location : [0, 100, 2300],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					},
					{
						name : "qiang_4",
						subType : "WALL",
						referModel : "/modules/room/Test_Fangti/qiang_4",
						isLock : true,
						location : [-500, 0, -2300],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					},
					{
						name : "tianpeng",
						subType : "CEILING",
						referModel : "/modules/room/Test_Fangti/tianpeng",
						isLock : false,
						location : [0, 1500, 0],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					},
					{
						name : "dimian",
						subType : "FLOOR",
						referModel : "/modules/room/Test_Fangti/dimian",
						isLock : false,
						location : [0, -1500, 0],
						rotation : [1, 0, 0, 0],
						scale : [1,1,1]
					}
				];
				callback(list);
			} catch(e){
				alert("sceneLib.js public assembledData error : " + e);
			}	
		}
    });
    return sceneLib;
});
