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
 
define("spolo/data/jobs/job/renderjob",
[
	"spolo/data/jobs/job/job",
	"dojo/_base/declare", 	
	"dojo/request/xhr",
	'dojo/on'
],
function(
	Job,
	declare, 
	xhr,
	on
)
{
	return declare("spolo/data/jobs/job/renderjob", [Job], {
		
		getTarget:function(){
			return this.getValue('target');
		},
		getNotifyOID:function(){
			return this.getValue('notifyOID');
		},
		getEmail:function(){
			return this.getValue('email');
		},
		getSP_Render:function(){
			return this.getValue('render');
		},
		getCameraName:function(){
			return this.getValue('cameraName');
		},		
		getSP_handler:function(){
			return this.getValue('sp_handler');
		},
		getResultImageURL:function(bigImage){
			var url;
			if(this.jobInfo.result){
				if(bigImage == true){
					url = this.jobInfo.result.URL;
				}else{
					url = this.jobInfo.result.url;
				}
			}
			return url;
		},
		getResultImagePath:function(){
			var path=this.getValue('resultPath')+"/"+this.getValue('resultFileName')+".png";
			return path;
		},
		getResultExrURL:function(){
			var path=this.baseURL + ".renderjob.result.exr?jobName="+this.getName();
			return path;
		},
		getResult_Pass:function(){
			if(this.jobInfo.result){
				return this.jobInfo.result.pass;
			}
		},
		getResult_convergence:function(){
			if(this.jobInfo.result){
				return this.jobInfo.result.convergence;
			}
		},
		getResult_elapsedTime:function(){
			if(this.jobInfo.result){
				return this.jobInfo.result.elapsedTime;
			}
		},
		getResult_totalRaysSec:function(){
			if(this.jobInfo.result){
				return this.jobInfo.result.totalRaysSec;
			}
		},
		getResult_totalSamplesSec:function(){
			if(this.jobInfo.result){
				return this.jobInfo.result.totalSamplesSec;
			}
		},
		getTasks:function(){
			if(this.jobInfo.tasks){
				var tasks = this.jobInfo.tasks;
				return tasks;
			}
		}
	});	
});