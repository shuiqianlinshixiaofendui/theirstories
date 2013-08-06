define('spolo/xmpp/helper/octanehandlerhelper',
['dojo/_base/declare','dojo/_base/lang','spolo/xmpp/xmppobjectproxy'],
function(declare,lang,ObjectProxy){

/*
 *返回定义的类
 */
	return declare('octanehandlerhelper',[ObjectProxy],{	
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
			start:function(callback){
				var added=this._addCallback_sequence(callback);
				var args=new Object();
				args['oname']=this.getObjectName();
				if(added!=-1){
					args['sequence']=added;					
				}
				this.invokeMethod('start',args);
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
				if(params['sequence'] && this.callback_sequence[params['sequence']]){
					var result=undefined;
					if(params['result'] && params['result']=='true'){
						result=true;
					}else{
						result=false;
					}
					this.callback_sequence[params['sequence']](result);
					this.callback_sequence[params['sequence']]=undefined;
				}
			},			
			onStop:function(params){
				if(params['sequence'] && this.callback_sequence[params['sequence']]){
					var result=undefined;
					if(params['result'] && params['result']=='true'){
						result=true;
					}else{
						result=false;
					}
					this.callback_sequence[params['sequence']](result);
					this.callback_sequence[params['sequence']]=undefined;
				}
			}
	});
});