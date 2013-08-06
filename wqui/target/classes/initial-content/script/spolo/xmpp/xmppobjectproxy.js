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
define('spolo/xmpp/xmppobjectproxy',
['dojo/_base/declare','spolo/xmpp/objectstub'],
function(declare,objectstub){//on  evented_base 去掉

/*
 *返回定义的类
 */
	return declare('xmppobjectproxy',[objectstub],{
			/**
			 *构造方法
			 */
			constructor:function(xpof,remoteOID){								
				this.remoteOID=remoteOID;								
			},
			getRemoteOID:function(){
				return this.remoteOID;
			},	
			invokeMethod:function(method,parameters){				
				this.inherited(arguments,[this.getRemoteOID(),method,parameters]);
			}
	});
});