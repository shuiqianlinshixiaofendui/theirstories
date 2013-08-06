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
 *  dynamicsWorldmics world 
 *  dynamicsWorldmics object
 */
     //  x3domPhysiJs 对象
 (function() {    
     x3domPhysiJs = function(){
     
        this.collisionConfiguration = null ;
        
        this.dispatcher = null ;
        
        this.overlappingPairCache = null ;
        
        this.solver = null ;
        
        this.dynamicsWorld = null;
        
        this.bodies = []; // x3domPhysiJs body list
        
        this.transform = new Ammo.btTransform();

     };
     
     // 初始化 x3domPhysiJs
     x3domPhysiJs.prototype.init = function(){
        
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); // every single |new| currently leaks...
            
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);

        this.overlappingPairCache = new Ammo.btDbvtBroadphase();

        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        
        this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
      
     };
     
     //  设置重力场位置
     x3domPhysiJs.prototype.setGravity = function(x,y,z){
        this.dynamicsWorld.setGravity(new Ammo.btVector3(x, y, z));
     };

     /**
      *     向 x3domPhysiJs 世界中添加对象
      *     需要四个参数
      *     * id 
      *     * mass 对象质量
      *     * position(json) 位置 , position.x position.y position.z
      *     * size(json) 大小 , size.x size.y size.z
      */
     x3domPhysiJs.prototype.addObject = function(id,mass,position,rotation,size){
        
        
        var localInertia = new Ammo.btVector3(0, 0, 0);
        // console.log(json.boundingbox);
        var ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(size.x/2, size.y/2, size.z/2));
        
        // var transform = new Ammo.btTransform();
        this.transform.setIdentity();
        
        ammoBox.calculateLocalInertia(mass,localInertia);
        
        this.transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
        this.transform.setRotation(new Ammo.btQuaternion( rotation.x, rotation.y, rotation.z, rotation.w));
        
        var myMotionState = new Ammo.btDefaultMotionState(this.transform);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, ammoBox, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);
        body.id = id ;
        
        
        this.dynamicsWorld.addRigidBody(body);
        this.bodies.push(body);
     };
     
     // 获取所有刚体 bodies
     x3domPhysiJs.prototype.getBodies = function(){
        return this.bodies;
     };
     
     // tick
     x3domPhysiJs.prototype.tick = function(){
     
        this.dynamicsWorld.stepSimulation(1/60, 10);
        
        
        
        this.bodies.forEach(function(body) {
        
              
            if (body.getMotionState()) {
                var trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking
                body.getMotionState().getWorldTransform(trans);
                
                var x = trans.getOrigin().x().toFixed(2) ;
                var y = trans.getOrigin().y().toFixed(2) ;
                var z = trans.getOrigin().z().toFixed(2) ;
                
                var rotation_x = trans.getRotation().x().toFixed(2);
                var rotation_y = trans.getRotation().y().toFixed(2);
                var rotation_z = trans.getRotation().z().toFixed(2);
                var rotation_w = trans.getRotation().w().toFixed(2);
                
                var position = x + " " + y + " " + z;
                
               
                
                
                var axis;
                var qu = new x3dom.fields.Quaternion(rotation_x,rotation_y,rotation_z,rotation_w);
                if(qu){
                    axis = qu.toAxisAngle();
                }
                
                var rotation = axis[0].x + " " + axis[0].y + " " + axis[0].z + " " + axis[1];
                
                var t = document.getElementById(body.id);
                if(t){                                          // 当模型删除的时候不在执行
                    t.setAttribute("translation",position);
                    t.setAttribute("rotation",rotation);
                }
               
              
                
             }
                 
            
        });
        
        
     };
    
    
     // 销毁物理系统(这个方法尽量不要使用，这个会引起浏览器卡死)
     x3domPhysiJs.prototype.destroy = function(){
        Ammo.destroy(this.collisionConfiguration);
        Ammo.destroy(this.dispatcher);
        Ammo.destroy(this.overlappingPairCache);
        Ammo.destroy(this.solver);
     };
     
     
     // 清除物理世界中的模型，清除模型后，允许用户再次添加模型
     x3domPhysiJs.prototype.clearObjects = function(){
       
        for(var i=0;i<this.bodies.length;i++){
        
            this.dynamicsWorld.removeRigidBody( this.bodies[i] );
            
        }
        this.bodies = [];
        
     }
     Array.prototype.remove = function(from, to) {      // 删除数组中特定的元素
        var rest = this.slice((to || from) + 1 || this.length);       
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
     };
     
     // 删除物理世界中某一个模型
     x3domPhysiJs.prototype.removeObject = function(id){
        
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
            
                this.dynamicsWorld.removeRigidBody( this.bodies[i] );
                
                // delete this.bodies[i];
                this.bodies.remove(i) ;                 // 将数组中的元素删除，数组长度和下标会自动修改
            }
            
        }
        
     }
     
     // 重新设置模型的信息 ( 包括，位置，大小) 
     x3domPhysiJs.prototype.updateObject = function(id,position,rotation){
        // console.log(position.x + " ---  " + position.y + " --- " + position.z)
        console.log(id) ;
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                            
                this.bodies[i].getMotionState().getWorldTransform( this.transform );
                
                if ( position ) {
                    this.transform.setOrigin(new Ammo.btVector3( position.x, position.y, position.z ));
                }
                
                if ( rotation ) {
                    this.transform.setRotation(new Ammo.btQuaternion( rotation.x, rotation.y, rotation.z, rotation.w ));
                }
                
                this.bodies[i].setWorldTransform( this.transform );
                this.bodies[i].activate();
                
               
            }
            
        }
          
        
        
     }
     
     // 修改一个模型的质量
     x3domPhysiJs.prototype.updateMass  = function(id,mass){
        
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                this.dynamicsWorld.removeRigidBody( this.bodies[i] );
                this.bodies[i].setMassProps( mass, new Ammo.btVector3(0, 0, 0) );
                this.dynamicsWorld.addRigidBody( this.bodies[i] );
                this.bodies[i].activate();
            }
            
        }
        
     }
     
     
     //***************************************************************************************************************
     
     
     // 测试 applyCentralImpulse (中央冲力)
     x3domPhysiJs.prototype.applyCentralImpulse = function(id,x,y,z){
     
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                
                this.bodies[i].applyCentralImpulse(new Ammo.btVector3( x, y, z));
                
                this.bodies[i].activate();
            }
            
        }
        
     }
     
     // 测试 applyImpulse
     
     x3domPhysiJs.prototype.applyImpulse = function(id,x,y,z){
     
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                
                this.bodies[i].applyImpulse(
                    new Ammo.btVector3( 20,20,20 ),
                    new Ammo.btVector3( 20,20,20 )
                );
                this.bodies[i].activate();
            }
            
        }
        
     }
     
     //  测试角速度 
     /**
        给定一个id，并且给定旋转轴，模型能够围绕着旋转轴进行有惯性旋转
     */
     x3domPhysiJs.prototype.setAngularVelocity = function(id,x,y,z){
     
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                
                this.bodies[i].setAngularVelocity(
                    new Ammo.btVector3( x, y, z )
                );
                this.bodies[i].activate();
                
            }
            
        }
        
     }
      
     // 测试角速度因素
     x3domPhysiJs.prototype.setAngularFactor = function(id,x,y,z){
     
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                
                this.bodies[i].setAngularFactor(
                    new Ammo.btVector3( x, y, z )
                );
                
            }
            
        }
        
     }
     
     // 测试 setCcdSweptSphereRadius
     x3domPhysiJs.prototype.setCcdSweptSphereRadius = function(id){
     
        for(var i=0;i<this.bodies.length;i++){
            
            if( this.bodies[i].id == id ){
                
                this.bodies[i].setActivationState( 40 );
                this.bodies[i].activate();
                
            }
            
        }
        
     }
     
 
    return x3domPhysiJs;
    
 })();
 
 
 
 
 
 
 
 
 