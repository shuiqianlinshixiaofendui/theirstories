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
 *	 负责整个ROOM EDIT系统的物理引擎
 */
define("widgets/room/operate/dynamicsOperate",["widgets/room/utils/boundingBox"],function(BoundingBox){
    var _boundingBox = null;
    var _x3d ;
    var _x3dEdit;
    var modelList = [];
    var minx = miny = minz = maxx = maxy = maxz = 0;
    
    var bodies = [];
    
    var dynamicsWorld = null;
    var collisionConfiguration = null;
    var dispatcher = null;
    var overlappingPairCache = null;
    var solver = null;
    
    var initDynamicsWorld = function(){
        collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); // every single |new| currently leaks...
        
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);

        overlappingPairCache = new Ammo.btDbvtBroadphase();

        solver = new Ammo.btSequentialImpulseConstraintSolver();

        dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

        // 设置重力中心
        dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
        
        
    }
    
    // 计算 trans 包围盒大小
    var calculateBondingBox = function(trans){
    
        var bbox = _boundingBox.getBoundingBox(trans);
        
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
    
    // 获取当前场景中所有的模型，然后计算所有模型的包围盒
    var allModelsBundingBox = function(){
    
        _scene = _x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
        
        var childrens = _scene.children;
        
        for(var i = 0; i < childrens.length; i++){
        
            if(childrens[i].nodeName == "GROUP"){
            
                var group = childrens[i];
                for(var j=0;j<group.children.length;j++){
                
                    var trans = group.children[j];
                    
                    var size = calculateBondingBox(trans._x3domNode);
                    
                    var json = {
                        name : trans._x3domNode._DEF,
                        boundingbox : size,
                        position : trans._x3domNode._vf.translation,
                        subType : trans.getAttribute("subType"),
                        ptr : null,
                    };
                    
                    modelList.push(json);
                }
                
            }
            
        }
        
    }
    
    
    // 创建 ammo box
    var createAllAmmoNode = function(){
        // 添加 ammo box
        if(modelList){
            for(var i=0;i<modelList.length;i++){
                var json = modelList[i];
                // console.log(json);
                createAmmoNode(json);
            }
        }
    }
    
    var createAmmoNode = function(json){
        var mass = 0;
        
        mass = 0;   // 此处第一次加载的为1，其余为0
        
        var localInertia = new Ammo.btVector3(0, 0, 0);
        // console.log(json.boundingbox);
        var ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(json.boundingbox.x, json.boundingbox.y, json.boundingbox.z));
        
        var startTransform = new Ammo.btTransform();
        startTransform.setIdentity();
        
        ammoBox.calculateLocalInertia(mass,localInertia);
        
        startTransform.setOrigin(new Ammo.btVector3(json.position.x,json.position.y,json.position.z));
        
        var myMotionState = new Ammo.btDefaultMotionState(startTransform);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, ammoBox, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);
        json.ptr = body.ptr ;
        
        dynamicsWorld.addRigidBody(body);
        bodies.push(body);
        
        return body;
    }
    
    var getAmmoPosition = function(name){
    
        
        
        var cptr;
        for(var i = 0;i < modelList.length ; i++){
            if(modelList[i].name == name)
                cptr = modelList[i].ptr;
        }
        
        var stack = [];
        var oldStr = "";
        var str = "a";
        while (oldStr != str) {
        // for(var i = 0;i< 135;i++){
            dynamicsWorld.stepSimulation(60/60, 10);
            bodies.forEach(function(body) {
            
                if(body.ptr == cptr){
                  
                    if (body.getMotionState()) {
                        var trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking
                        body.getMotionState().getWorldTransform(trans);
                        
                        var x = trans.getOrigin().x().toFixed(2);
                        var y = trans.getOrigin().y().toFixed(2);
                        var z = trans.getOrigin().z().toFixed(2);
                        
                        oldStr = str;
                        str = x + " " + y + " " + z;
                        console.log(str);
                        stack.push(str);
                        
                     }
                     
                }
                
            });
        }
        return stack;
        
    }
    
	var dynamicsOperate = dojo.declare([],{
		
		constructor : function(x3d, x3dEdit){
        
            _x3d = x3d;
            _x3dEdit = x3dEdit;
            _boundingBox = new BoundingBox();
            
            initDynamicsWorld();
            
            this.dynamicsState(true);
            
		},
        
        // 同步场景，x3dom 中添加模型，ammo scene 中同样添加模型 mass ! = 0
        addAmmoNode : function(trans){
            
            // 创建ammo节点
            var size = calculateBondingBox(trans);
            // console.log(size);
                    
            var json = {
                name : trans._DEF,
                boundingbox : size,
                position : trans._vf.translation,
                subType : trans._xmlNode.getAttribute("subType"),
                ptr : null,
            };
            
            modelList.push(json);
            var node = createAmmoNode(json);
            
            // 根据模型基类型算出重力场方向
            var moduleContainer = Spolo.ModuleContainer;
            var gravityVec = null;
            var subtype = moduleContainer._xmlNode.getAttribute("subType");
            if(subtype == "FLOOR"){
                gravityVec = new x3dom.fields.SFVec3f(0,-10,0);
            }
            if(subtype == "CEILING"){
                gravityVec = new x3dom.fields.SFVec3f(0,10,0);
            }
            if(subtype == "WALL"){
                gravityVec = new x3dom.fields.SFVec3f(0,0,-10);
                var viewmat = moduleContainer._vf.rotation.toMatrix();
                gravityVec = viewmat.multMatrixPnt(gravityVec);
            }
            
            dynamicsWorld.setGravity(new Ammo.btVector3(gravityVec.x , gravityVec.y , gravityVec.z));
            
            dynamicsWorld.removeRigidBody(node);
            node.setMassProps(1,new Ammo.btVector3(0, 0, 0));
            dynamicsWorld.addRigidBody(node);
            node.activate();
            var ammoPosition = getAmmoPosition(json.name);
            dynamicsWorld.removeRigidBody(node);
            node.setMassProps(0,new Ammo.btVector3(0, 0, 0));
            dynamicsWorld.addRigidBody(node);
            node.activate();
            
            return ammoPosition.pop();
        },
        
        // 删除模型
        deleteAmmoNode : function(name){
            for(var i = 0;i < modelList.length ; i++){
                if(modelList[i].name == name){
                    dynamicsWorld.removeRigidBody(modelList[i].ptr);
                    break;
                }
            }
        },
        
        // 检测是否碰撞
        isCollision : function(trans){
            var selectObj = Spolo.selectedObj;
            var name = selectObj._DEF;
            var position = selectObj._vf.translation;
            var cptr;
            for(var i = 0;i < modelList.length ; i++){
                if(modelList[i].name == name){
                    cptr = modelList[i].ptr;
                    // break;
                }
            }
            
        },
        
        // 物理系统是否开启
        dynamicsState : function(state){
            
            if(state){
                 // 1 。 计算当前场景中所有模型的包围盒，场景中所有模型的信息都保存在modelList中
                allModelsBundingBox();
                
                // 2 。 根据当前场景中的模型，创建对应的 ammo object 
                createAllAmmoNode();
            }else{
                // 关闭
                Ammo.destroy(collisionConfiguration);
                Ammo.destroy(dispatcher);
                Ammo.destroy(overlappingPairCache);
                Ammo.destroy(solver);
            }
           
        },
		unload : function(){}
		
		
	});	
	return dynamicsOperate;
})