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
define('spolo/xmpp/xpofutil',
[
'dojo/on',
'dojo/_base/window',
'spolo/xmpp/xpof',
'spolo/xmpp/objectstubimpl'
],
function(
on,
window,
Xpof,
StubImpl
){
	xpofutil={};
	xpofutil.getGlobalInstance=function(callback){
		if(!window.global.xpof_global_instance || !(window.global.xpof_global_instance instanceof Xpof)){
			console.log('xpof_global_instance不存在，正在创建... ...');
			window.global.xpof_global_instance=new Xpof();
			console.log('xpof_global_instance创建完成');
		} 			
		if(!window.global.xpof_global_instance.isConnected){
			on(window.global.xpof_global_instance,'onReady',function(){						
				console.log('xpof_global_instance连接完成');
				callback(window.global.xpof_global_instance);
			});
			if(!window.global.xpof_global_instance.isConnecting){
				console.log('xpof_global_instance正在连接... ...');
				window.global.xpof_global_instance.login();		
			}						
		}else{
			console.log('xpof_global_instance已连接');
			callback(window.global.xpof_global_instance);
		}
	};
	/**
	*args={xpof:xpof,obj:obj,objName:objName}
	*/
	xpofutil.registObjectImpl=function(args,callback){
		var xpof=args["xpof"];
		var obj=args["obj"];
		var name=args["objName"];		
		if(!obj){
			return;
		}
		if(!xpof){
			xpofutil.getGlobalInstance(function(xpof_instance){
				var stub=new StubImpl(xpof_instance);
				stub.setImpl(obj);
				xpof_instance.registObjectStub(stub,name);
				if(typeof callback=="function"){
					callback(stub.getOID());
				}
			});
		}else{
			var stub=new StubImpl(xpof);
			stub.setImpl(obj);
			xpof.registObjectStub(stub,name);
			if(typeof callback=="function"){
				callback(stub.getOID());
			}
		}
	};
/*
 *返回定义的类
 */
	return xpofutil;
});