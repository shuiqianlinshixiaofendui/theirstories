define('spolo/xmpp/helper/slghandlerhelper',
['dojo/_base/declare','dojo/_base/lang','spolo/xmpp/xmppobjectproxy'],
function(declare,lang,ObjectProxy){

/*
 *返回定义的类
 */
	return declare('slghandlerhelper',[ObjectProxy],{	
			constructor:function(xpof,remoteOID){				
				this.callback_sequence=new Object();
				this.sequence=0;
				xpof.registObjectStub(this);
			},	
			_addCallback_sequence:function(callback){
				if(callback && callback instanceof Function){
					this.sequence++;
					this.callback_sequence[this.sequence.toString()]=callback;
					return this.sequence;
				}
				return -1;
			},
			_onReturn:function(params){
				if(params['sequence'] && this.callback_sequence[params['sequence']]){
					this.callback_sequence[params['sequence']](params);
					this.callback_sequence[params['sequence']]=undefined;
				}
			},
			start:function(callback){
				var added=this._addCallback_sequence(callback);
				var args=new Object();
				args['oname']=this.getObjectName();
				if(added!=-1){
					args['sequence']=added;					
				}
				this.invokeMethod('start',args);
			},
			
			step:function(callback){
				var added=this._addCallback_sequence(callback);
				var args=new Object();
				args['oname']=this.getObjectName();
				if(added!=-1){
					args['sequence']=added;
				}
				this.invokeMethod('step',args);
			},
			
			stop:function(callback){
				var added=this._addCallback_sequence(callback);
				var args=new Object();
				args['oname']=this.getObjectName();
				if(added!=-1){
					args['sequence']=added;					
				}
				this.invokeMethod('stop',args);
			},
			
			onStart:function(params){
				this._onReturn(params);
			},			
			onStep:function(params){
				this._onReturn(params);
			},
			onStop:function(params){
				this._onReturn(params);
			}
	});
});