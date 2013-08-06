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
define("spolo/data/jobs/previewjobmanager",
[
	"dojo/_base/declare", 
	"spolo/data/jobs/job/renderjob",	
	"dojo/request/xhr",
	"dojo/on",
	"dojo/Evented",
	"spolo/xmpp/xpofutil",
	"spolo/data/jobs/renderjobmanager",
	"dojo/Evented",
	"dojo/_base/lang"
],
function(
	declare, 
	RenderJob,
	xhr,
	on,
	evented_base,
	xpofutil,
	RenderJobManager,
	evented_base,
	lang
)
{
	return declare("spolo/data/jobs/previewjobmanager", [evented_base], {
		constructor:function(path, spsess, spnode){
			this.renderJobManager=new RenderJobManager(path, spsess, spnode,true);
			this.init();
		},
		/**	@brief	previewjobmanager初始化方法
		*/
		init:function(){
			on(this.renderJobManager,'onCreated',lang.hitch(this,"onCreated"));
			on(this.renderJobManager,'onDispatching',lang.hitch(this,"onDispatching"));
			on(this.renderJobManager,'onDoing',lang.hitch(this,"onDoing"));
			on(this.renderJobManager,'onFinished',lang.hitch(this,"onFinished"));
			on(this.renderJobManager,'onFinishedError',lang.hitch(this,"onFinishedError"));
		},
		onCreated:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			on.emit(this, 'onCreated',message);			
		},
		onDispatching:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			on.emit(this, 'onDispatching',message);	
		},
		onDoing:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			on.emit(this, 'onRendering',message);	
		},
		onFinished:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			message.url=job.getResultImageURL();
			on.emit(this, 'onFinished',message);	
		},
		onFinishedError:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			on.emit(this, 'onError',message);	
		},
		onCreating:function(job){
			var message={};
			message.cameraName=job.getCameraName();
			on.emit(this, 'onCreating',message);	
		},
		onCreateFailed:function(reason){
			var message={};
			message.reason=reason;
			on.emit(this, 'onCreateFailed',message);	
		},
		/**创建preview的job
		* @params cameras 数组
		* @params creating  function 开始创建时调用
		* @params createFinished  所有指定的camera的任务创建完成后调用
		*/
		createPreviews:function(cameras,creating,createFinished){
			//将数组转换成map
			var cameras_map={};
			for(var index_1=0; index_1<cameras.length;index_1++){
				cameras_map[cameras[index_1]]=cameras[index_1];
			}
			var renderJobManager=this.renderJobManager;
			var previewJobManager=this;
			//检测是否已经有对应的job，如果有则删除
			var getJobCallBack=function(jobs){
				//遍历已有的list
				for(var name in jobs){
					var job = jobs[name];
					var jobStatus = job.getStatus();
					var cameraName = job.getCameraName();
					//对比cameraName						
					if(cameras_map[cameraName]){
						job.deleteThisJob({});
					}				
				}
				
				//创建对应的cameraPreview job
				var jobsInfo=[];
				for(var index=0; index<cameras.length;index++){
					var jobInfo={
						cameraName:cameras[index],
						jobType:'render',
						target:'sample',
						render:'octane'
					};
					jobsInfo.push(jobInfo);
				}
				args = {
					jobsInfo:jobsInfo,	//所有要创建的job信息数组
					success : function(job){
						//单个job创建完成的回调
						previewJobManager.onCreating(job);
					},
					failed : function(reason){
						//单个job创建完成的回调
						previewJobManager.onCreateFailed(reason);
					},
					creating:creating,
					finished:createFinished
				} 
				renderJobManager.createJobs(args);
			};
			renderJobManager.getJobs(getJobCallBack,true);			
		},
		getPreviews:function(cameras){
			//将数组转换成map
			var cameras_map={};
			for(var index_1=0; index_1<cameras.length;index_1++){
				cameras_map[cameras[index_1]]=cameras[index_1];
			}
			var renderJobManager=this.renderJobManager;
			var previewJobManager=this;
			var getJobCallBack=function(jobs){
				//遍历已有的list
				for(var name in jobs){
					var job = jobs[name];
					var jobStatus = job.getStatus();
					var cameraName = job.getCameraName();
					//对比cameraName						
					if(cameras_map[cameraName]){
						switch(jobStatus){
							case 'creating':{
								previewJobManager.onCreating(job);
								break;
							}
							case 'created':{
								previewJobManager.onCreated(job);
								break;
							}
							case 'dispatching':{
								previewJobManager.onDispatching(job);
								break;
							}
							case 'doing':{
								previewJobManager.onDoing(job);
								break;
							}
							case 'finished':{
								previewJobManager.onFinished(job);
								break;
							}
						}
					}				
				}
			};
			renderJobManager.getJobs(getJobCallBack,true);		
		}
	});	
});