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
 
define("widgets/JobDialog/JobDialog",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/template.html",
	"dojo/Evented",
	"dojo/dom-construct",
	"dojo/dom",
	"dojo/query",
	"dijit/Dialog",
	"dojox/validate/web"
],
function(declare, WidgetBase, TemplatedMixin, _WidgetsInTemplateMixin, template, Evented,domConstruct,dom,query,Dialog,validate){
		return declare("widgets/JobDialog/JobDialog", 
			[ WidgetBase, TemplatedMixin,_WidgetsInTemplateMixin,Evented], {
				templateString: template,
				tDialog:null,
				bassClass: "jobDialog",
				checked: false,
				
				constructor : function(obj){
					this.tDialog = obj;						
				},
				
				postCreate : function(){
					if(this.tDialog.currUser != "admin"){
						this.email.value = this.tDialog.currUser;	
					}
				},		
				
				getJobInfo:function(){
					var jobInfo = {};
					jobInfo.jobType= "render";	
					jobInfo.resultFileName = this.reName.value;
					jobInfo.render = this.renderSelect.value;
					jobInfo.target = this.targetSelect.value;
					
					if(this.email.value) {
						jobInfo.email = this.email.value;
					}
					

					if (jobInfo['render'] == "slg"){						
						this.noticeInfo("暂不支持SLG...");						
						return;
					}
					//dijit.byId('createJobProperties').hide();
					//检查文件名是否填入了,否则为默认
					if(!jobInfo.resultFileName){
						jobInfo.resultFileName = "result";
					}						
					return jobInfo;
				},
							  
				//add camera checkBox
				createCamera:function(index,cameraname){				
					var node = dojo.byId("cameras");
					var tmp = 2;
					var checkbox = {
						type : "checkbox",  
						value : cameraname,
					};
					var nodes = query("#cameras input");
					var lable = {innerHTML:cameraname}
					var cNode= domConstruct.create("input",checkbox,node);
					domConstruct.create("lable",lable,node);
					index++; //下标从0开始 5个一行index+1		
					if(cameraname < 10){
						 tem = 4;
					}			
					if(index%tmp==0)	{
						domConstruct.create("br",checkbox,node); 	
					}				
				},			

				//build jobs and it contains jobInfo +cameraName  return an json
				createJobs : function(callback){					
					var jobArray = new Array();
					var jobInfo = this.getJobInfo();		
					var cameraList = this.__getSelected();
					var camLen = cameraList.length;
					if(!jobInfo) return;
					if(camLen){
						for(var index = 0; index < camLen;index++){
							var job = {};
							job.resultFileName=jobInfo.resultFileName;
							job.render=jobInfo.render;
							job.target=jobInfo.target;
							job.jobType=jobInfo.jobType;
							if(jobInfo.email) job.email = jobInfo.email;
							job.cameraName =cameraList[index]; 				
							jobArray.push(job);	
							//console.log(job);
						}
					}else{
							this.noticeInfo("最少需要一个camera!");	
							return;
					}
					callback(jobArray);
					//this.tDialog.dialog.hide();
				},
				
				// notice show fg: error
				noticeInfo : function (info){					
					var errorDialog = new Dialog({
							title: "警告!",
							content:info,
							style: "width: 300px"
						});
					errorDialog.show();
				},	
				
				//get the selected cameras 
				__getSelected : function(){
					var cameraSelected = [];
					var nodes = query("#cameras input");
					var nLength = nodes.length;
					for(var i = 0;i < nLength;i++){
						if(nodes[i].checked == true){
							cameraSelected.push(nodes[i].value);
						}
					}
					return cameraSelected;					
				},	

				//check  email‘s format
				__checkEmail:function(){
					var email = this.email.value;
					var currUser = this.tDialog.currUser;

					if(email == "admin" && currUser == "admin"){
						email = "";
					}
					if(email == ""){
						//email = currUser;		
						return;						
					} else {
						var s = validate.isEmailAddress(email);
						if(!s) {
							this.noticeInfo("阿欧，邮箱格式错误！\n格式如: xx@xx.com ");
						}						
					}
						//console.log(email);
				},						

				//select all
				__onselectAll : function(flag){
					query("#cameras input").attr("checked",true);							
				},	
				
				//cancle select
				__onCanscleAll : function(){
					query("#cameras input").attr("checked",false);
	
				},	
				
				// 创建按钮还需要去调用UI部分的API部分，所以先把事件发送出去。
				__onCreateJob : function(){ 
					this.emit("createJob",{});
				}
			});	
});
