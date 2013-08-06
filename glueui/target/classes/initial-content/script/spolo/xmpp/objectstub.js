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
define('spolo/xmpp/objectstub',
['dojo/_base/declare','dojo/_base/lang','dojox/uuid/generateRandomUuid'],
function(declare,lang,generateRandomUuid){

/*
 *返回定义的类
 */
	return declare('objectstub',[],{
			/**
			 *构造方法
			 */
			constructor:function(xpof){							
				this.xpof=xpof;
				this.objname=generateRandomUuid();
			},
			setObjectName:function(name){
				if(typeof name == "string"){
					this.objname=name;
				}
			},
			getObjectName:function(){
				return this.objname;
			},
			getOID:function(){
				return this.getXpof().getHostFullJID()+'#'+this.getObjectName();
			},			
			getXpof:function(){
				return this.xpof;
			},	
			onCall:function(call,from){
				if(this[call.method]){
					this[call.method](call.parameters);
				}	
			},
			invokeMethod:function(remoteOID,method,parameters){
				var msg=new Object();
				msg.method=method;
				msg.parameters=parameters;				
				this.getXpof().sendMessage(remoteOID,msg);
			}	
			
	});

});