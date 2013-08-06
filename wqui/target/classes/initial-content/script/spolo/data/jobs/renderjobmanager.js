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
define("spolo/data/jobs/renderjobmanager",
[
	"dojo/_base/declare", 
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/jobs/job/renderjob",	
	"dojo/request/xhr",
	"dojo/json",
	"dojo/on",
	"dojo/Evented",
	"spolo/xmpp/xpofutil",
	'spolo/xmpp/helper/jobschedulehelper'
],
function(
	declare, 
	spobject, 
	spsession,
	RenderJob,
	xhr,
	JSON,
	on,
	evented_base,
	xpofutil,
	JobScheduleHelper
)
{
	return declare("spolo/data/jobs/renderjobmanager", [spobject,evented_base], {
		/**	@brief	jobmanager构造方法
		*@param isRealTime 是否是实时通信的    
		* 如果是实时通信的，需要引入jsjac库"<script type="text/javascript" src="/libs/jsjac-1.3.4/jsjac.js"></script>"
		*/
		constructor : function(path, spsess, spnode,isRealTime){
			this.init(isRealTime);			
		},
		/**	@brief	jobmanager初始化方法
		*@param isRealTime 是否是实时通信的  
		*       如果是实时通信的jobManager，应该在scene.js中getJobs时传入(callback,true),
		* 在callback中获取到jobmanager对象之后可以监听该对象的事件（on(jobmanager,'事件名称'，callback);）
		* 事件名称有：	onCreated			创建完成
		* 				onDispatching		正在派遣等待处理
		*				onDoing				正在处理
		*				onFinished			处理完成
		*				onFinishedError		处理时出错
		*				JobStatusChanged    job状态改变
		*/
		init:function(isRealTime){
			var jobManager=this;
			jobManager.jobList = {};
			//判断是否为实时通信的
			if(isRealTime){
				//生成一个jobStatusListener
				jobManager.jobStatusListener={};
				jobManager.jobStatusListener.onJobStatusChanged=function(jobInfo){
					var jobName=jobInfo.base['name'];
					var job=jobManager.jobList[jobName];
					if(job){
						job.setJobInfo(jobInfo);
						var status=job.getStatus();
						on.emit(jobManager, 'JobStatusChanged',job);
						switch(status){
							case 'created':{
								on.emit(jobManager, 'onCreated',job);	
								break;
							}
							case 'dispatching':{
								on.emit(jobManager, 'onDispatching',job);
								break;
							}
							case 'doing':{
								on.emit(jobManager, 'onDoing',job);
								break;
							}
							case 'finished':{
								on.emit(jobManager, 'onFinished',job);
								break;
							}
							case 'finish_error':{
								on.emit(jobManager, 'onFinishedError',job);
								break;
							}
						}
					}
				}
				//生成xpof的impl注册参数
				args={obj:jobManager.jobStatusListener,objName:"jobStatusListener"};
				//注册jobStatusListener，并且通过回调获取OID
				xpofutil.registObjectImpl(args,function(OID){
					jobManager.jobStatusListener.OID=OID;				
				});
				//得到scheduleHelper
				xpofutil.getGlobalInstance(function(xpof){
					jobManager.jobscheduler = new JobScheduleHelper(xpof,"scheduler@spolo.org/scheduler#jobSchduler");
				});
			}
		},
		/**	@brief	创建一组job，对应的esp为app/scene/jobs/createJobs.POST.esp
		*@param args = {
		*		jobsInfo:[jobInfo,jobInfo....],	//所有要创建的job信息数组
		*		success : function(){
		*			//单个job创建完成的回调
		*		},
		*		failed : function(){
		*			//单个job创建完成的回调
		*		},
		*		creating : function(){
		*			//创建中的回调
		*		},
		*       notifier : function(){
		*		}
		*		finished : function(){
		*			//所有job创建完成的回调
		*		}
		*	} 
		*/
		createJobs:function(args){
			var jobManager=this;
			if(!args || !args['jobsInfo']){
				return false;
			}else{
				var notifyFunc = args["notifier"];
				if(typeof notifyFunc != "function"){
					delete notifyFunc;
				}
				var creatingFunc=args["creating"];
				if(creatingFunc){
					creatingFunc();						
				}
				var finishedFunc = args['finished'];
				var successFunc = args['success'];
				var failedFunc = args['failed'];
				//获取所有jobInfo
				var jobs=args['jobsInfo'];
				//生成createjob参数
				var createJobArgs_array = new Array();
				var createJobArgs_array_index=0;
				for(var index=0;index<jobs.length;index++){
					var  createJobArgs={
						jobInfo:jobs[index],
						notifier : notifyFunc,						
						success : function(job){
							if(successFunc){
								successFunc(job);
							}
							createJobArgs_array_index++;
							if(createJobArgs_array_index < createJobArgs_array.length){
								jobManager.createJob(createJobArgs_array[createJobArgs_array_index]);
							}else{
								if(finishedFunc){
									finishedFunc();
								}
							}
						},
						failed : function(reason){
							console.error(reason);
							if(failedFunc){
								failedFunc(reason);
							}
							createJobArgs_array_index++;
							if(createJobArgs_array_index < createJobArgs_array.length){
								jobManager.createJob(createJobArgs_array[createJobArgs_array_index]);
							}else{
								if(finishedFunc){
									finishedFunc();
								}
							}
						}
					};
					createJobArgs_array.push(createJobArgs);
				}
				//开始创建job
				if(createJobArgs_array.length>0){
					jobManager.createJob(createJobArgs_array[createJobArgs_array_index]);
				}				
			}
		},
		/**	@brief	创建一个job，对应的esp为app/scene/jobs/updateJobs.POST.esp
		*@param args = {
		*		jobInfo:{
		*			cameraName:'cameraName',
		*			email:'渲染完成后通知的email地址',
		*			target:'product/sample',
		*			render:'octane',
		*			resultFileName:your File name},	
		*		success : function(){
		*		},
		*		failed : function(){
		*		},
		*		creating : function(){
		*		},
		*       notifier : function(){
		*		}
		*	} 
		*/
		createJob : function(args){
			var jobManager = this;
			if(!args || !args['jobInfo']){
				return false;
			}
			var notifyFunc = args["notifier"];
			if(typeof notifyFunc != "function"){
				delete notifyFunc;
			}
			var creatingFunc=args["creating"];
			if(creatingFunc){
				creatingFunc();						
			}
			var successFunc=function(jobInfo){
				var job = new RenderJob(jobInfo,jobManager.getURI());
				jobManager.jobList[job.getName()] = job;
				if(args['success']){
					args['success'](job);				
				}
			};
			var failedFunc=function(error){
				if(args['failed']){
					args['failed'](error);
				}
			};
			// 设置请求参数
			var url = jobManager.getURI()+".renderjob.createJob";
			var content = args['jobInfo'];
			if(notifyFunc){
				cometNotifyFunctionName = "renderjobmanager_createjob_comet_notify";
				window[cometNotifyFunctionName] = notifyFunc;
				content['cometNotifyFunctionName'] = "window.parent." + cometNotifyFunctionName;
			}
			
			content['_charset_'] = "UTF-8";
			require(["dojo/request/iframe"],function(iframe){
				iframe.post(url,{
					data : content,
					handleAs: "json"
				}).then(
					//callback
					function(msg){
						if(msg.result == 'true'){							
							successFunc(msg.jobInfo);							
						}else {
							failedFunc(msg.reason);			
						}		
					},
					//errback
					function(error){	
						failedFunc(error.toString());
					}
				);
			});
		},
		/** @brief 在当前场景上传一个job.
		*	@param  formID 一个formid或者form dom节点
		*	@param	args ={ 
		* 			jobInfo:{ 
		*					jobType:'render',
		*					render:'octane',
		*					resultFileName:your File name,
		*					email:"渲染完成后通知的email地址",
		*					pass:"采样率",
		*					cameraName:"渲染的摄像机名称"
		*			},
		*			success : (optional) 当数据被加载成功之后的回调函数.
		*			failed : (optional) 当发生错误时的回调函数.
		*			uploading : (optional) 正在上传
		*			}
		*  	@param	是否使用nginx服务器，默认不使用。
		**/
		uploadJob:function(formID,args,useNginx){
			var jobManager=this;
			if(!formID || !args){
				return false;
			}	
			if(args['uploading']){
				args['uploading']();
			}
			var successFunc=function(jobInfo){
				var job = new RenderJob(jobInfo,jobManager.getURI());
				jobManager.jobList[job.getName()] = job;
				if(args['success']){
					args['success'](job);				
				}
			};
			var failedFunc=function(error){
				if(args['failed']){
					args['failed'](error);
				}
			};	
			
			var jobsNode=this.spnode;			
			require(["dojo/request/iframe"],function(iframe){
				var content = {};
				if(typeof args['jobInfo'] == "object"){
					content = args['jobInfo'];
				}
				var	url;
				if(useNginx==false){
					url= jobsNode.getFullpath() + ".renderjob.uploadJob";
				}else{
					url = "/upload";
					content["spi_target"] = jobsNode.getFullpath() + ".renderjob.uploadJob";
					content["useNginx"] = true;
				}
				content['_charset_']="UTF-8";
				iframe.post(url,{
					form: formID,
					data : content,
					handleAs: "json"
				}).then(
					function(msg){
						if(msg.result == 'true'){							
							successFunc(msg.jobInfo);							
						}else {
							failedFunc(msg.reason);			
						}		
					},
					function(error){	
						failedFunc(error.toString());
					}
				);
			});
		},
		/** @brief  通过json创建一个渲染job.
		*	@param  formID 一个formid或者form dom节点
		*	@param	args ={ 
		* 			jobInfo:{ 
		*					resultFileName:your File name,
		*					email:"渲染完成后通知的email地址",
		*					pass:"采样率",
		*					cameraName:"渲染的摄像机名称"/["渲染的","摄像机名称","数组"]
		*			},
		*			success : (optional) 当数据被加载成功之后的回调函数.
		*			failed : (optional) 当发生错误时的回调函数.
		*			uploading : (optional) 正在上传
		*			}
		*  	@param	是否使用nginx服务器，默认不使用。
		**/
		createJobWithJson:function(formID,args,useNginx,useCloudrender){
			var jobManager=this;
			if(!formID || !args){
				return false;
			}	
			if(args['uploading']){
				args['uploading']();
			}
			var successFunc=function(jobInfo){
				var job = new RenderJob(jobInfo,jobManager.getURI());
				jobManager.jobList[job.getName()] = job;
				if(args['success']){
					args['success'](job);				
				}
			};
			var failedFunc=function(error){
				if(args['failed']){
					args['failed'](error);
				}
			};	
			
			var jobsNode=this.spnode;			
			require(["dojo/request/iframe"],function(iframe){
				var content = {};
				if(typeof args['jobInfo'] == "object"){
					if(Object.prototype.toString.apply(args['jobInfo']['cameraName']) === '[object Array]'){
						args['jobInfo']['cameraName']=args['jobInfo']['cameraName'].toString();
					}
					content = args['jobInfo'];
				}
				var	url;
				if(useNginx==false){
					url= jobsNode.getFullpath() + ".renderjob.createJobWithJson";
				}else{
					url = "/upload";
					content["spi_target"] = jobsNode.getFullpath() + ".renderjob.createJobWithJson";
					content["useNginx"] = true;
				}
				if(useCloudrender == true){
					useCloudrender = "true";
				}else{
					useCloudrender = "false";
				}
				content['useCloudrender'] = useCloudrender;
				content['_charset_']="UTF-8";
				iframe.post(url,{
					form: formID,
					data : content,
					handleAs: "json"
				}).then(
					function(msg){
						if(msg.result == 'true'){							
							successFunc(msg.jobInfo);							
						}else {
							failedFunc(msg.reason);			
						}		
					},
					function(error){	
						failedFunc(error.toString());
					}
				);
			});
		},
		/**删除renderjob
		*@param args = {
		*		jobName: string/array<string>,//如果jobName为数组，批量删除
		*		success : function(){		
		*		},
		*		failed : function(){
		*		},
		*		saving : function(){
		*		}
		*	} 
		*/
		deleteJob: function(args){
			var jobList=this.jobList;
			if(!args || !args['jobName']){
				return false;
			}
			//得到job信息
			var jobName=args['jobName'];
			if(args && args['saving']){
				args['saving']();
			}
			var successFunc=function(success){
				for(var index=0;index<success.length;index++){
					var successInfo = success[index];
					delete jobList[successInfo.jobName];
					if(args['success']){
						args['success'](successInfo.jobName);
					}
				}	
			};
			var failedFunc=function(fail){
				for(var index=0;index<fail.length;index++){
					var failInfo = fail[index];
					if(args['failed']){
						args['failed'](failInfo.jobName+":"+failInfo.reason , failInfo.jobName);
					}
				}		
			};
			// 设置请求参数
			var url = this.getURI()+".deleteJobs";
			var content={jobName:jobName};
			xhr( url, {
				handleAs: "json",
				method: "POST",
				data: content
			}).then(
				function(msg){					
					if(successFunc){
						if(successFunc){
							successFunc(msg.success);			
						}
						if(failedFunc){
							failedFunc(msg.fail);			
						}
					}
				},
				function(e){
					if(args['failed']){
						args['failed'](e);			
					}
				}				
			);
		},
		/**	@brief	加载job信息,参数callback可以没有
		*@param callback 如果得到所有job的信息，传入一个由job对象填充的对象，
		*该对象一个属性就是一个job对象，属性名是job的name，如果获取失败则什么也不传入
		*/
		ensureJobs:function(callback){
			var currentNode=this.getNode();
			var jobManager=this;	
			
			var success = function(jobInfoList){
				console.log('loading jobs list success!');				
				jobManager.jobList = {};
				var jobList_data = jobInfoList;
				for(var name in jobList_data){
					var job = new RenderJob(jobList_data[name],jobManager.getURI());						
					jobManager.jobList[name] = job;
				}
				if(callback){
					callback(jobManager.jobList);
				}				
			};
			var failed = function(error){
				console.error('loading jobs list failed!'+error);
				if(callback){
					callback();
				}
			};
			var url=this.getURI()+".getjob?r=" + Math.round(Math.random() * 10000);
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
		/**获取一个由job对象填充的对象，该对象的一个属性是一个job对象。
		*@param callback中传入这个对象
		*@param boolean ignoreCache 忽略缓存，直接从服务器读取。
		*该方法会判断缓存中是否有job信息，如果没有就直接ensureJobs
		*/
		getJobs : function(callback,ignoreCache){
			if(!callback){
				throw("方法getJobs必须传入一个function");
			}
			if(ignoreCache == true){
				this.ensureJobs(callback);
			}else{
				if(this.jobList){
					callback(this.jobList);
				}else{
					this.ensureJobs(callback);
				}	
			}					
		},
		/**从缓存中获取一个job对象。
		*@param jobName jobName
		*/
		getJob : function(jobName,callback,ignoreCache){
			var jobManager=this;
			if(!jobName&&!callback){
				return;
			}
			var job=jobManager.jobList[jobName];
			if(ignoreCache){
				job.ensureJob(function(jobObject){
					if(!jobObject){
						delete  jobManager.jobList[jobName];
					}
					callback(jobObject);
				});
			}else{
				callback(job);
			}
		},
		/**	@brief	修改一个job，对应的esp为app/scene/jobs/updateJobs.POST.esp
		*@param args = {
		*		jobInfo:{jobName:'jobName',***},	
		*		success : function(){
		*		},
		*		failed : function(){
		*		},
		*		updating : function(){
		*		}
		*	} 
		*/
		updatejob:function(args){
			var jobManager = this;
			if(!args || !args['jobInfo']){
				return false;
			}
			
			var updatingFunc=args["updating"];
			if(updatingFunc){
				updatingFunc();						
			}
			var successFunc=function(jobInfo){
				var job = new RenderJob(jobInfo,jobManager.getURI());
				jobManager.jobList[job.getName()] = job;
				if(args['success']){
					args['success'](job);				
				}
			};
			var failedFunc=function(error){
				if(args['failed']){
					args['failed'](error);
				}
			};
			// 设置请求参数
			var url = jobManager.getURI()+".renderjob.updateJobs";
			var content = args['jobInfo'];
			content['_charset_']="UTF-8";
			xhr( url, {
				handleAs: "json",
				method: "POST",
				data: content
			}).then(
				function(msg){	
					if(msg.result == 'true'){							
						successFunc(msg.jobInfo);							
					}else{
						failedFunc(msg.reason);			
					}				
				},
				function(e){
					failedFunc(e.toString());			
				}				
			);
		},
		/**	@brief 获取handlers的数量信息
		*@param callback 如果正常得到信息，callback中返回一个对象data，该对象：
		*                 	data.totally;			//全部handler数量
		*					data.totally_notbusy ;	//全部 空闲 handler数量
		*					data.octane ;			//octane handler数量
		*					data.octane_notbusy;	//空闲 octane handler数量
		*					data.slg;				//slg handler数量
		*					data.slg_notbusy;		//空闲 slg handler数量 
		*/
		queryHandlersInfo:function(callback){
			var currentNode = this.getNode();
			var jobManager=this;	
			
			var success = function(data){
				console.log('loading handlersInfo success!');
				console.log(data);					
				if(typeof callback == "function"){
					callback(data);
				}				
			};
			var failed = function(error){
				console.error('loading jobs list failed!'+error);
				if(typeof callback == "function"){
					callback();
				}
			};
			var url=this.getURI()+".renderjob.queryHandlersInfo?r=" + Math.round(Math.random() * 10000);
			xhr( url, {
				handleAs: "json",
				method: "GET"
			}).then(
				function(msg){	
					if(msg.result == true){
						success(msg.data);
					}else{
						failed(msg.reason);			
					}				
				},
				function(e){
					failed(e);
				}				
			);
		},
		/**	@brief 通过xpof(xmpp实时通信)从schedule获取jobinfo
		*@param jobName 可以是一个jobname字符串，或者是一个jobname 的字符串数组。如果不存在query所有job
		*/
		queryJobProcess:function(callback,jobName){
			var jobManager = this;
			if(typeof callback != "function"){
				throw "the parameter \"callback\" is not a function";
			}else if(!jobManager.jobscheduler){
				console.log("jobscheduler not exists");
				throw "this jobManager is not a realtime jobManager!";
			}else{
				var callback_getJobs = function(){
					//设置query后的回调
					var callback_query = function(params){
						for(var name in jobManager.jobList){
							var job = jobManager.jobList[name];
							if(job.getJobID() == params.jobid){
								jobManager.getJob(name,function(job){callback(job);},true);
								break;
							}
						}
					};
					//判断jobName参数并进行对应的query操作
					if(!jobName){
						for(var name in jobManager.jobList){
							var job = jobManager.jobList[name];
							if(job.getStatus() != "finished"){
								jobManager.jobscheduler.queryJobInfo(job.getJobID(),callback_query);
							}
						}	
					}else if(typeof jobName == "string"){
						var job = jobManager.jobList[jobName];
						if(job){
							if(job.getStatus() != "finished"){
								jobManager.jobscheduler.queryJobInfo(job.getJobID(),callback_query);
							}
						}else{
							throw "job \""+jobName+"\" not exists";
						}
					}else if(Object.prototype.toString.apply(jobName) === '[object Array]'){
						for(var index=0 ;index<jobName.length;index++){
							var job = jobManager.jobList[jobName[index]];
							if(job){
								if(job.getStatus() != "finished"){
									jobManager.jobscheduler.queryJobInfo(job.getJobID(),callback_query);
								}
							}
						}
					}else{
						throw "parameter jobName wrong!";
					}
				}
				//先判断是否有joblist，如果没有则先获取joblist
				var isempty = true;
				for(var name in jobManager.jobList){
					isempty = false;
					break;
				}
				if(isempty){
					jobManager.getJobs(
						function(joblist){
							callback_getJobs();
						},
						true
					);
				}else{
					callback_getJobs();
				}
			}
		},
		setJobRealTime:function(jobName){
			if(jobManager.jobStatusListener){
				var getJob_callback = function(job){
					var OID = jobManager.jobStatusListener.OID;
					var notifyOID = job.getNotifyOID();
					if(OID!=notifyOID){
						var updateArgs={
							jobInfo:{jobName:jobName,notifyOID:OID}
						}
						jobManager.updatejob(updateArgs);
					}				
				}
				jobManager.getJob(jobName,getJob_callback);	
			}else{
				throw "jobManager is not realtime";
			}
		}
	});	
});