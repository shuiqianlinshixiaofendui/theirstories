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
define('spolo/xmpp/objectstubimpl',
['dojo/_base/declare','dojo/_base/lang','spolo/xmpp/objectstub'],
function(declare,lang,ObjectStub){//on  evented_base 去掉

/*
 *返回定义的类
 */
	return declare('objectstubimpl',[ObjectStub],{			
			getImpl:function(object){
				return this.impl;
			},
			setImpl:function(object){
				this.impl=object;
			},
			onCall:function(call,from){
				if(this.impl && this.impl[call.method]){
					var result=this.impl[call.method](call.parameters);
					var remoteObjName = call.parameters['objname'];
					var eventName = call.parameters['eventName'];
					if(remoteObjName && eventName && result && from){
						this.invokeMethod(eventName,result,(from+'#'+remoteObjName));
					}
				}				
			}
	});
});