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
define('spolo/xmpp/xmppconnection',
['dojo/_base/declare','dojo/on','dojo/Evented','dojo/_base/lang'],
function(declare,on,evented_base,lang){
/*
 *返回定义的类
 */
	function _getHostDoamin(){		
			var domain = "null";			
			url = window.location.href;
			var regex = /.*\:\/\/([^\/]*).*/;
			var match = url.match(regex);
			if((typeof match != "undefined" )&& (null != match)){
				domain = match[1];
			}				
			return domain;
	};
	return declare('xmppconnection',[evented_base],{
			/**
			 *构造方法
			 */
			constructor:function(){},
			/**
			 *连接
			 *@param string username xmpp服务器的用户名
			 *@param string password  密码
			 *@param boolean isRegister 是否为注册
			 */
			connect:function(username,password,isRegister) {				
					try {   			
						this.con = new JSJaCHttpBindingConnection({httpbase : 'http://'+_getHostDoamin()+'/http-bind/' ,cookie_prefix:'spolo_jsjac',oDbg :new JSJaCConsoleLogger(1)}); 					
						// setup args for connect method
						this._setupConnection();
						oArgs = new Object();
						oArgs.domain = 'spolo.org';
						oArgs.username = username;
						oArgs.resource = 'glue_web_client';
						oArgs.pass = password;
						oArgs.register = isRegister;
						this.con.connect(oArgs);
					} catch (e) {
						console.error('connect:');
						console.error(e.toString());
					} finally {
						return false;
					}
			},
			/**
			 *匿名连接
			 */
			anonymousConnect:function(){				
					try {   			
						this.con = new JSJaCHttpBindingConnection({httpbase : 'http://'+_getHostDoamin()+'/http-bind/' ,cookie_prefix:'spolo_jsjac',oDbg :new JSJaCConsoleLogger(1)}); 					
						// setup args for connect method
						this._setupConnection();
						oArgs = new Object();
						oArgs.domain = 'spolo.org';
						oArgs.resource = 'glue_web_client';
						oArgs.authtype = "saslanon";
						oArgs.username=''
						oArgs.register = false;
						this.con.connect(oArgs);
					} catch (e) {
						console.error('connect:');
						console.error(e.toString());
					} finally {
						return false;
					}
			},
			/**
			 *使用cookie重连接
			 */
			resume:function(){			
				try {// try to resume a session
                    this.con = new JSJaCHttpBindingConnection({
						cookie_prefix:'spolo_jsjac',
                        oDbg : new JSJaCConsoleLogger(1)
                    });
					this.con.registerHandler('ondisconnect', lang.hitch(this,this._handleDisconnected));
                    this._setupConnection();
					var success=this.con.resume();
                    return success;
				
                } catch (e) {
					return false;
                }
				return false;
			},
			/**
			 *暂停，使用cookie保存数据
			 */
			pause:function(){
				if ( typeof this.con != 'undefined' &&this.con &&this.con.connected()) {
                    // save backend type
                    if (this.con._hold)// must be binding
                        (new JSJaCCookie('btype', 'binding')).write();
                    else
                        (new JSJaCCookie('btype', 'polling')).write();
                    if (this.con.suspend) {
						this.con._last_requests = {};
                        this.con.suspend();
                    }
                }
			},
			/**
			 *处理收到iq消息的回调
			 *@param JSJaCPacket oIQ jsjac通信的包
			 */
			_handleIQ:function (oIQ) { 
				this.con.send(oIQ.errorReply(ERR_FEATURE_NOT_IMPLEMENTED));
				on.emit(this, 'onIQ', oIQ);														
			},
			/**
			 *处理收到Presence消息的回调
			 *@param JSJaCPacket oJSJaCPacket jsjac通信的包
			 */
			_handlePresence:function (oJSJaCPacket) { 
				on.emit(this, 'onPresence', oJSJaCPacket);														
			},
			/**
			 *处理收到error消息的回调
			 *@param JSJaCPacket oJSJaCPacket jsjac通信的包
			 */
			_handleError:function (e) { 
				if (this.con.connected()){
                    this.con.disconnect();
				}
				on.emit(this, 'onError', e);														
			},			
			
			_handleIqVersion:function (iq) {
                this.con.send(iq.reply([iq.buildNode('name', 'jsjac simpleclient'), iq.buildNode('version', JSJaC.Version), iq.buildNode('os', navigator.userAgent)]));
                return true;
            },

            _handleIqTime:function (iq) {
                var now = new Date();
                this.con.send(iq.reply([iq.buildNode('display', now.toLocaleString()), iq.buildNode('utc', now.jabberDate()), iq.buildNode('tz', now.toLocaleString().substring(now.toLocaleString().lastIndexOf(' ') + 1))]));
                return true;
            },
			
			
			/**
			 *处理收到消息的回调
			 *@param JSJaCPacket oJSJaCPacket jsjac通信的包
			 */
			_handleMessage:function (oJSJaCPacket) { 
				var msg=new Object();
				msg.body=oJSJaCPacket.getBody();
				msg.from=oJSJaCPacket.getFrom();
				on.emit(this, 'onMessage', msg);														
			},
			/**
			 *连接上服务器的回调
			 */
			_handleConnected:function () {	
				var p=new JSJaCPresence();
				p.setShow('chat');
				p.setStatus('available');
				this.con.send(p);
				on.emit(this, 'onConnected',null);		
			},
			_handleStatusChanged:function (status) {					
				on.emit(this, 'onStatusChanged',status);		
			},
			/**
			 *断开连接后的回调
			 */
			_handleDisconnected:function() {  
				on.emit(this, 'onDisconnected',null);
			},
			/**
			 *设置连接的回调
			 */
			_setupConnection:function(){
				this.con.registerHandler('message', lang.hitch(this,this._handleMessage));     
				this.con.registerHandler('onconnect', lang.hitch(this,this._handleConnected));     
				this.con.registerHandler('ondisconnect', lang.hitch(this,this._handleDisconnected));	

                this.con.registerHandler('presence', lang.hitch(this,this._handlePresence));
                this.con.registerHandler('iq', lang.hitch(this,this._handleIQ));
				this.con.registerHandler('onerror', lang.hitch(this,this._handleError));
				this.con.registerHandler('status_changed', lang.hitch(this,this._handleStatusChanged));

				this.con.registerIQGet('query', NS_VERSION, lang.hitch(this,this._handleIqVersion));
                this.con.registerIQGet('query', NS_TIME, lang.hitch(this,this._handleIqTime));				
			},			
			/**
			 *断开连接
			 */
			disconnect:function(){
				var p = new JSJaCPresence();
				p.setStatus('unavailable');
				p.setShow('away');
                this.con.send(p);
                this.con.disconnect();
			},
			/**
			 *发送消息
			 *@param string msg 消息字符串
			 */
			sendMessage:function(msg,sendTo){		
					var type='chat';
					if (!msg||msg == ''){			
						return false;		
					}
					if(!sendTo||sendTo==''){
						return false;
					}
					if (sendTo.indexOf('@') == -1){
						sendTo += '@' + this.con.domain;
					}
                   
					try {
						var oMsg = new JSJaCMessage();
						oMsg.setTo(new JSJaCJID(sendTo));
						oMsg.setBody(msg);
						oMsg.setType(type);
						this.con.send(oMsg);
						return true;
					} catch (e) {
						console.error('send message:');
						console.error(e.toString());
						return false;
					}		
			},
			/**
			 *得到当前用户在xmpp服务器的jid
			 */
			getHostFullJID:function(){	
				return this.con.fulljid;
			},
			getHostJID:function(){	
				return this.con.jid;
			}
			
	});
});