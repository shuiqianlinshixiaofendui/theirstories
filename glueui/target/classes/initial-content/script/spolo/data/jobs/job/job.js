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
 
define("spolo/data/jobs/job/job",
[
	"dojo/_base/declare", 	
	"dojo/request/xhr"
],
function(
	declare, 
	xhr
)
{
	return declare("spolo/data/jobs/job/job", [], {
		constructor:function(jobInfo,baseURL){
			this.jobInfo=jobInfo;
			this.baseURL=baseURL;
		},
		/**	@brief	加载job信息,参数callback可以没有
		*@param callback 如果得到所有job的信息，传入一个由job对象填充的对象，
		*该对象一个属性就是一个job对象，属性名是job的name，如果获取失败则什么也不传入
		*/
		ensureJob:function(callback){
			var jobObject=this;	
			
			var success = function(jobInfo){
				console.log('loading job success!');				
				jobObject.jobInfo=jobInfo;
				if(callback){
					callback(jobObject);
				}				
			};
			var failed = function(error){
				console.log('loading job failed!'+error);
				delete jobObject.jobInfo;
				if(callback){
					callback();
				}
			};
			var jobName=jobObject.getName();
			var url=jobObject.baseURL + ".getjob?jobName="+jobName+"&r=" + Math.round(Math.random() * 10000);
			xhr( url, {
				handleAs: "json",
				method: "GET"
			}).then(
				function(msg){	
					if(msg.result == 'true'){				
						success(msg.jobInfo);
					}else{
						failed(msg.reason);			
					}				
				},
				function(e){
					failed(e);
				}				
			);
		},
		getName:function(){
			return this.getValue('name');
		},
		getJobType:function(){
			return this.getValue('jobType');
		},
		getUserID:function(){
			return this.getValue('userID');
		},
		getCreateTime:function(){
			var createTime = this.getValue('createTime');
			var date = new Date(new Number(createTime));
			return date;
		},
		getStatus:function(){
			return this.getValue('status');
		},
		getJobID:function(){
			return this.getValue('jobid');
		},
		getSP_sequence:function(){
			return this.getValue('sp_sequence');
		},
		getJsonObject:function(){
			return this.jobInfo;
		},
		getValue:function(key){
			var resultValue;
			if(this.jobInfo.base && this.jobInfo.schedule){
				if(this.jobInfo.base[key]){
					resultValue =  this.jobInfo.base[key];
				}else{
					resultValue = this.jobInfo.schedule[key];
				}
			}else{
				resultValue = this.jobInfo[key];
			}
			return resultValue;
		},
		setJobInfo:function(jobInfo){
			this.jobInfo=jobInfo;
		}
	});	
});