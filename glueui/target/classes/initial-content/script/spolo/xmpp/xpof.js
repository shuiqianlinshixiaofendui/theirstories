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
define('spolo/xmpp/xpof',
[
'dojo/_base/declare',
'dojo/on',
'dojo/Evented',
'spolo/xmpp/objectstub',
'spolo/xmpp/xmppobjectproxy',
'spolo/xmpp/xmppconnection',
'dojo/_base/unload',
'dojo/json',
'dojo/_base/lang',
'dojo/string'
],
function(
declare,
on,
evented_base,
ObjectStub,
XmppObjectProxy,
XmppConnection,
baseUnload,
dojoJson,
lang,
dojoString
){

/*
 *返回定义的类
 */
	return declare('xpof',[evented_base],{
			/**
			 *构造方法
			 */
			constructor:function(){
			
				this.connection=new XmppConnection();
				
				on(this.connection,'onMessage',lang.hitch(this,this._onMessage));

				on(this.connection,'onConnected',lang.hitch(this,this._onConnected));
				
				on(this.connection,'onDisconnected',lang.hitch(this,this._onDisconnected));
				
				//on(this.connection,'onStatusChanged',function(s){alert(s);});
				
				baseUnload.addOnUnload(this.connection,'pause');
								
				this.stubMap=new Object();	
				this.isConnecting=false;
				this.isConnected=false;				
			},
			login:function(userName,passWord){
				this.isConnecting=true;
				if(!this.connection.resume()){
					if(userName&&passWord){
						this.connection.connect(userName,passWord,false);
					}else{
						this.connection.anonymousConnect();
					}					
				}else{
					//设置一次断线重连（只有resmue失败后进行）
					on.once(this,'onUnready',lang.hitch(this,function(){						
						console.log('xpof连接断开,正在重新连接......');						
						this.isConnecting=true;
						//设置一次提醒从连接后的提醒
						on.once(this,'onReady',lang.hitch(this,function(){						
							console.log('xpof重连接成功');
						}));
						if(userName&&passWord){
							this.connection.connect(userName,passWord,false);
						}else{
							this.connection.anonymousConnect();
						}	
					}));
					this.isConnecting=false;
					this.isConnected=true;
					on.emit(this, 'onReady',null);						
				}					
			},
			logout:function(){
				this.connection.disconnect();
			},
			/**
			 *onMessage
			 *@param Objct msg 传入的消息（应该包含ObjectName来定位一个对象，包含method和parameters来定位一个method并且包含参数）
			 */			
			_onMessage:function (msg) {	
				console.warn(msg.body);
				var strArray=msg.body.split('#');								
				var objname=dojoString.trim(strArray[0]);
				var method=dojoString.trim(strArray[1]);
				var parameters=strArray[2];
				for(var index=3;index<strArray.length;index++){
					parameters=parameters+'#'+strArray[index];
				}
				try{
					parameters=dojoJson.parse(parameters,false);	
				}catch(e){
					alert('xpof_onMessage:'+e+'---message:"'+parameters+'"');
				}	
				
				var stubObject=this.getStubObject(objname);
				if(stubObject){						
					var message = new Object();
					message.method = method;
					message.parameters = parameters;					
					stubObject.onCall(message,msg.from);																	
				}	
								
			},
			/**
			 *连接上服务器的回调
			 */
			_onConnected:function () {
				this.isConnecting=false;
				this.isConnected=true;
				on.emit(this, 'onReady',null);					
			},
			/**
			 *断开连接后的回调
			 */
			_onDisconnected:function() {
				this.isConnecting=false;
				this.isConnected=false;	
				on.emit(this, 'onUnready',null);				
			},
			sendMessage:function(remoteOID,msg){	
				var remoteOID_parsed= remoteOID.split('#');
				var targetJID= remoteOID_parsed[0];
				var objectName= remoteOID_parsed[1];
				var methodName= msg.method;
				var parameters= '{}';
				if(msg.parameters){
					try{
						parameters=dojoJson.stringify(msg.parameters);
					}catch(e){
						alert('sendMessage:'+e);
						return;
					}
				}				
				var msg_parsed = objectName + '#' + methodName + '#' + parameters;
				this.connection.sendMessage(msg_parsed,targetJID);
			},
			getHostJID:function(){		
				return this.connection.getHostJID();
			},
			getHostFullJID:function(){		
				return this.connection.getHostFullJID();
			},
			getStubObject:function(objectName){
				return this.stubMap[objectName];
			},
			registObjectStub:function(objectStub){				
				if(objectStub instanceof ObjectStub){
					var objName='';
					if(arguments.length>1 && (typeof arguments[1] == "string")){
						objName=arguments[1];
						objectStub.setObjectName(objName);						
					}else{
						objName=objectStub.getObjectName();
					}		
					this.stubMap[objName]=objectStub;
				}			
			},				
			getObjectProxy:function(remoteOID){				
				var args=new Object();			
				var objectProxy=new XmppObjectProxy(this,remoteOID);
				return objectProxy;
			}
	});
});