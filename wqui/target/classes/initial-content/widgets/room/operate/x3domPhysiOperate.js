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
 *  处理x3dom物理引擎相关操作
*/

define("widgets/room/operate/x3domPhysiOperate",
    ["widgets/room/Lib/x3domLib",
    "widgets/room/utils/boundingBox"
    ],
function(x3domLib,boundingBox){
    var x3dPJ ;
    var x3domLibObj ;
    var boundingBoxObj ;
    var selectWall ;
    var forEach = Array.prototype.forEach ;
    
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
        var size = max.subtract(min).multiply(0.5);
        return size;
    }
    
    var addObjectForPhysi = function(){
        var allTrans = x3domLibObj.getRoomSceneEditAllTransforms() ; 
        forEach.call(allTrans,function(element){
            var id = element.getAttribute("id");
            var type = element.getAttribute("subtype") ;
            var x3domNode = element._x3domNode ;
            if(type){
                var translation = x3domNode._vf.translation ;
                var transBox = calculateBondingBox(x3domNode) ;
                var pos = {x : translation.x , y : translation.y , z : translation.z};                               
                var size = {x : transBox.x , y : transBox.y , z : transBox.z};
                var rotation = x3domNode._vf.rotation ;
                var rot = {x : rotation.x , y : rotation.y , z : rotation.z , w : rotation.w} ;
                x3dPJ.addObject(id,"0",pos,rot,size);
            }
        }) ;
    }
    
    var x3domPhysiOperate = dojo.declare([],{
        constructor : function(){
            x3domLibObj = new x3domLib() ;
            boundingBoxObj = new boundingBox() ;
            selectWall = Spolo.ModuleContainer ;           // 选中的墙
        },
        openX3domPhysi : function(){
           if(!Spolo.x3domPhysi){                       // 只创建一次
               x3dPJ = new x3domPhysiJs();              // 创建 x3dom 物理引擎对象
               x3dPJ.init();                            // 初始化 x3dom 物理引擎
           }
           if(selectWall){
               var type = selectWall._xmlNode.getAttribute("subType") ;
               switch(type){                                                // 根据不同的类型，创建不同的向量
                   case "FLOOR" :
                        console.log("开启物理引擎：floor") ;
                        x3dPJ.setGravity(0,-100,0);                         // 设置物理引擎重力重心
                        Spolo.x3domPhysi = x3dPJ ;
                   break ;
                   case "CEILING" :
                   break ;
                   case "WALL" :
                        console.log("开启物理引擎： wall") ;               // 墙体需要根据rotation计算出重心的方向呢。。
                        x3dPJ.setGravity(0,0,-100);                         // 设置物理引擎重力重心
                        Spolo.x3domPhysi = x3dPJ ;
                   break ;
               }
               
           }
           
           addObjectForPhysi() ;                        // 只要开启就给场景中的添加物理系统
           Spolo.x3domPhysiOpen = true ;
        },
        closeX3domPhysi : function(){
           if(Spolo.x3domPhysi){
               Spolo.x3domPhysi.clearObjects();
               Spolo.x3domPhysiOpen = false ;
           }
        },
		unload : function(){}
    });
    return x3domPhysiOperate;
});
