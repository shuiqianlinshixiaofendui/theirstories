define('spolo/xmpp/helper/jobschedulehelper',
['dojo/_base/declare','dojo/_base/lang','spolo/xmpp/xmppobjectproxy'],
function(declare,lang,ObjectProxy){

/*
 *返回定义的类
 */
	return declare('jobschedulehelper',[ObjectProxy],{	
			constructor:function(xpof,remoteOID){				
				this.callback_sequence=new Object();
				this.sequence=0;
				xpof.registObjectStub(this);
			},
			_addCallback_sequence:function(callback){
				if(callback && callback instanceof Function){
					this.sequence++;
					var sequenceString = this.sequence.toString();
					var proxyHelper = this;
					this.callback_sequence[sequenceString]=callback;
					setTimeout(function(){
						if(proxyHelper.callback_sequence[sequenceString]){
							delete proxyHelper.callback_sequence[sequenceString];
							throw("jobschedulehelper: invoke out of time!");
						}
					},10000);
					return this.sequence;
				}
				return -1;
			},	
			queryJobInfo:function(jobid,callback){
				var sequence = this._addCallback_sequence(callback);
				var args = new Object();
				args['OID'] = this.getOID();				
				args['jobid'] = jobid;
				if(sequence != -1){
					args['sequence'] = sequence;					
				}
				this.invokeMethod('queryJobInfo',args);
			},
			onQueryJobInfo:function(params){
				if(params['sequence'] && this.callback_sequence[params['sequence']]){
					this.callback_sequence[params['sequence']](params);
					delete this.callback_sequence[params['sequence']];
				}
			}
	});
});