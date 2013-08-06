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
    处理场景加载中的模型添加删除 #2298
*/

define("widgets/room/node/modelNode",["spolo/data/model","widgets/room/Lib/sceneLib","widgets/room/Lib/x3domLib","widgets/room/utils/boundingBox","widgets/room/utils/syncX3domWin"],function(model_data,sceneLib,x3domLib,boundingBox,syncX3domWin){

    var sceneLibObj ;
    var x3domLibObj ;
    var modelObj ;          // model_data
    var boundingBoxObj ;    // 模型的boundingBox
    var selectWall ;        // 选中的墙
    var roomSceneGroup ;    // roomScene中的group
    var modelJson ;         // 添加模型的信息，以json格式存在
    
    /**
    *  @brief 产生包围盒
    *  @param trans 产生包围盒的transform，结构为transform/inline/scene
    **/
    var calculateBondingBox = function(trans){
        var bbox = boundingBoxObj.getBoundingBox(trans);
        if(bbox == 0){
            return 0 ;
        }
        minx = bbox.min.x;
        miny = bbox.min.y;
        minz = bbox.min.z;
        maxx = bbox.max.x;
        maxy = bbox.max.y;
        maxz = bbox.max.z;
        var min = new x3dom.fields.SFVec3f(minx,miny,minz);
        var max = new x3dom.fields.SFVec3f(maxx,maxy,maxz);
        var size ;
        if(Spolo.x3domPhysiOpen){
            size = max.subtract(min).multiply(0.97);        // 使用物理引擎
        }else{
            size = max.subtract(min).multiply(0.5);         // 不使用物理引擎
        }
        return size;
    }
    
    /**
    *  @brief 创建transform和inline
    **/
    var createTransform = function(isRoomScene){
        // 创建transform
        var t = document.createElement('Transform');
        t.setAttribute("DEF", modelJson.name) ;
        var temp ;
        isRoomScene == true ? temp = "_scene" : temp = "_edit" ;                
        t.setAttribute("id", modelJson.name + temp) ;            // 方便使用document.getElementById 
        t.setAttribute("translation", "0 0 0");      // 初始添加的位置是0,0,0
        t.setAttribute("scale", "5 5 5" );
        t.setAttribute("rotation", "1 0 0 0" );
        
        // 创建Inline
        var inline = document.createElement("Inline") ;
        inline.setAttribute("DEF","Inline") ;
        inline.setAttribute("url",modelJson.url) ;   
        t.appendChild(inline) ;
        return t ;
    }
    
    /**
    *  @brief 产生tranform的translation
    *  @param size transform的box
    **/
    var getTranslation = function(size){
       var translation = selectWall._vf.translation ; 
       var type = selectWall._xmlNode.getAttribute("subType") ;
       var gravityVec ;
       switch(type){                                                // 根据不同的类型，创建不同的向量
           case "FLOOR" :
                 gravityVec = new x3dom.fields.SFVec3f(0,-10,0);
           break ;
           case "CEILING" :
                 gravityVec = new x3dom.fields.SFVec3f(0,10,0);
           break ;
           case "WALL" :
                gravityVec = new x3dom.fields.SFVec3f(0,0,-10);
                var viewmat = selectWall._vf.rotation.toMatrix();    
                console.log("wall rotation-->"+selectWall._vf.rotation) ;
                gravityVec = viewmat.multMatrixPnt(gravityVec);
           break ;
       }
       
       // msxc 为墙是按照那条轴旋转的
       var maxc = Math.abs(gravityVec.x) > Math.abs(gravityVec.y)           
       ? (Math.abs(gravityVec.z) > Math.abs(gravityVec.x)) ? "z" : "x"
       : (Math.abs(gravityVec.z) > Math.abs(gravityVec.y)) ? "z" : "y";
       
       var tansX = translation.x - size.x ; 
       var tansY = translation.y - size.y ;
       var tansZ = translation.z - size.z ;
       
       switch(maxc){                
           case "x":                // 按照x轴旋转
                if(gravityVec.x < 0){       
                   tansX =  translation.x + size.x ;
                }
                console.log("x方向") ;
                result = tansX + " " + translation.y + " " + translation.z;
           break;
           case "y":                // 按照y轴旋转
                if(gravityVec.y < 0){
                   tansY = translation.y + size.y ;
                }
                console.log("y方向") ;
                result = translation.x + " " + tansY + " " + translation.z;
           break;
           case "z":                // 按照z轴旋转
                if(gravityVec.z < 0){
                  tansZ = translation.z + size.z ;
                }
                console.log("z方向") ;
                result = translation.x + " " + translation.y + " " + tansZ;
           break;
           default:
                result = 0 ;
           break ;
       }
       return result ;
       
    }
   
   /**
    *  @brief 向room_x3d中的group添加transform和inline
    **/
    var addNodeForRoom =function(){	    
        var roomSceneTrans = createTransform(true) ;                                       // 这里居然要创建两次transform
        var roomEditTrans = createTransform(false) ;
        var transId = roomEditTrans.getAttribute("id") ;
        roomSceneGroup = selectWall._parentNodes[0] ;
        roomSceneGroup._xmlNode.appendChild(roomSceneTrans) ;                          // 添加到room_x3d中的group
        var group = x3domLibObj.getRoomSceneEditGroupByDef(roomSceneGroup._DEF) ;      // room_scene_edit中的group
        group._xmlNode.appendChild(roomEditTrans) ;
        
        var flag = true;                                                                // tick只执行一次
        var count = 0;                                                                  // 没添加一个inline只判断一次
        var old_x3dom_tick = x3dom.X3DCanvas.prototype.tick;
        x3dom.X3DCanvas.prototype.tick = function(){  
            if(Spolo.x3domPhysiOpen && Spolo.x3domPhysiRemove){
                Spolo.x3domPhysi.tick();
            }    
            if((this.doc.downloadCount === 0 ) && flag){
                count++;
            }
            if(count > 1 && flag){
                flag = false;
                var size = calculateBondingBox(roomEditTrans._x3domNode) ;
                if(size == 0){                                                          // 如果为0
                    flag = true ;                                                       // 重新进入tick
                    console.log("inline没完成") ;
                    return ;
                }
                if(Spolo.x3domPhysiOpen){                                  // 开启物理引擎
                    
                    var editId = roomEditTrans.getAttribute("id") ;
                    console.log("添加的id-->"+editId) ;
                    
                    var type = selectWall._xmlNode.getAttribute("subType") ;
                    switch(type){                                                // 根据不同的类型，创建不同的向量
                        case "FLOOR" :
                             console.log("添加模型：floor") ;
                             var translation = selectWall._vf.translation ;
                             var editPos = {x : translation.x , y:"50" , z : translation.z};                               
                             var editBox = {x : size.x , y : size.y , z : size.z};
                             var editRotation = roomEditTrans._x3domNode._vf.rotation ;
                             var editRot = {x : editRotation.x , y : editRotation.y , z : editRotation.z , w : editRotation.w} ;
                             Spolo.x3domPhysi.addObject(editId,"1",editPos,editRot,editBox);      
                        break ;
                        case "CEILING" :
                              
                        break ;
                        case "WALL" :
                            console.log("添加模型；wall") ;
                            // var translation = selectWall._vf.translation ;
                            var editPos = {x : "0" , y:"-100" , z : "0"};                               
                            var editBox = {x : size.x , y : size.y , z : size.z};
                            var editRotation = roomEditTrans._x3domNode._vf.rotation ;
                            var editRot = {x : editRotation.x , y : editRotation.y , z : editRotation.z , w : editRotation.w} ;
                            Spolo.x3domPhysi.addObject(editId,"1",editPos,editRot,editBox);      
                        break ;
                    }
                       
                }else{
                    var result = getTranslation(size) ; 
                    console.log("添加translation-->"+result) ;
                    roomSceneTrans.setAttribute("translation", result  );                 // 等inline添加结束后修改模型位置
                    roomEditTrans.setAttribute("translation", result  );  
                }
            }
            old_x3dom_tick.call(this);
        }
    }
    
    /**
     * 在删除模型时，同时，检测模型是否存在选中盒或者坐标系。
     */
    function removeCoorOrboundingBox(modelId){
        try{
            var model = document.getElementById(modelId);
            var boundingBoxRoomEdit = document.getElementById("boundingBox_roomEdit");
            var roomEditSceneCoor = document.getElementById("roomEdit_scene_coordinateMap");
            var roomSceneCoor = document.getElementById("room_scene_coordinateMap");
            if(roomSceneCoor){
                var belongs = roomSceneCoor.getAttribute("belongs");
                var room_scene = document.getElementById("room_scene");
                if((belongs == modelId) && room_scene){
                    room_scene.removeChild(roomSceneCoor);
                }
            }
            if(roomEditSceneCoor){
                var belongs = roomEditSceneCoor.getAttribute("belongs");
                var roomEdit_scene = document.getElementById("roomEdit_scene");
                if((belongs == modelId) && roomEdit_scene){
                    roomEdit_scene.removeChild(roomEditSceneCoor);
                }
            }
            if(boundingBoxRoomEdit){
                var belongs = boundingBoxRoomEdit.getAttribute("belongs");
                var roomEdit_scene = document.getElementById("roomEdit_scene");
                if((belongs == modelId) && roomEdit_scene){
                    boundingBoxRoomEdit.setAttribute("render", "false");
                    boundingBoxRoomEdit.setAttribute("belongs", "");
                }
            }
        } catch(e){
            alert("modelNode.js private removeCoorOrboundingBox error : " + e);
        }
    }
    
    /**
        syncItem   : 同步，保证下次加载可以正常显示
        url    : 需要同步的url
        modelName : 模型名称
    **/
    var syncItem = function(url,modelName){
        // 需要取得模型的ID
        modelObj.getID(function(ID){
            var json = {
                ID : ID,
                name : modelName,
                referModel : url,
                type : "MESH",
               // location:[x ,y ,z],
                rotation_axis_angle:[0 ,1 ,0 ,0],
                scale:[5 ,5 ,5]
            };
            sceneLibObj.createModel(json);
        },
        function(error){
          console.log(error);
        });
        
    }
    /**
    *  @brief 将roomEdit中的transform删除
    *  @param modelId 需要删除的模型id
    **/
    var removeChildForRoomEdit = function(modelId){
		var edit_modelId = modelId + "_edit";
        var delModel = document.getElementById(edit_modelId) ;                       // 重新获取删除的transform
        var delModelDef = delModel._x3domNode._DEF ;
        var editTrans = x3domLibObj.getRoomSceneEditTransform(delModelDef) ;    // 需要删除的transform
        var editGroup = editTrans._parentNodes[0]._xmlNode ;                    // transform的父亲
        editGroup.removeChild(delModel) ;                                       // 删掉roomEdit_scene中的transform
        if(Spolo.x3domPhysiOpen){                                  // 开启物理引擎
            Spolo.x3domPhysi.removeObject(edit_modelId);           // 删除物理系统中的模型
        }
    }
    
    /**
    *  @brief 删除两个x3d中的transform
    *  @param modelId 需要删除的模型id
    **/
    var deleteNode = function(modelId){
		var scene_modelId = modelId + "_scene";
        var deleteModel = document.getElementById(scene_modelId) ;
        if(deleteModel){
            var delModelDef = deleteModel._x3domNode._DEF ;
            var sceneTrans = x3domLibObj.getRoomSceneTransform(delModelDef) ;               // 需要删除的transform
            var sceneGroup = sceneTrans._parentNodes[0]._xmlNode ;                          // transform的父亲
            sceneGroup.removeChild(deleteModel) ;                                           // 删掉roomEdit_scene中的transform
            
            removeChildForRoomEdit(modelId) ;                                                //  删除也需要分两次删除
            removeCoorOrboundingBox(modelId);
        }
    }
    
                
    var modelNode = dojo.declare([],{
        constructor : function(){
            sceneLibObj = new sceneLib() ;
            x3domLibObj = new x3domLib() ;
            boundingBoxObj = new boundingBox() ;
        },
        /**
         *  添加一个模型并且同步  
        */
        addModel : function(nodeData,modelName){
            Spolo.x3domPhysiRemove = true ;
            var x3dUrl = nodeData + ".x3d" ; 
            selectWall = Spolo.ModuleContainer ;           // 选中的墙
            modelObj = new model_data(nodeData);
            modelJson = {url : x3dUrl , name : modelName} ;
            addNodeForRoom() ;                    // 添加到场景中
            // syncItem(nodeData,modelName) ;              // 同步
        },
        /**
            删除一个模型
        **/
        deleteModel : function(modelId){
            deleteNode(modelId) ;
        },
		unload : function(){}
    });
    return modelNode;
});
