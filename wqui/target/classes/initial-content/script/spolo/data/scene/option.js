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
 
define("spolo/data/scene/option",
[
	"dojo/_base/declare", 
	"dojo/request/xhr",
	"spolo/data/spobject"
],
function(
	declare, 
	xhr,
	spobject
)
{
	var retClass = declare("spolo.data.scene.option", [spobject], {
		
		
		constructor : function(path)
		{
			// 这里会先调用 spobject 的构造函数，在spobject中实例化 spsession 和 spnode
			// 所以这里可以直接 this.spsession 和 this.spnode
			// 这里的path 应该是/content/users/admin/scenelib/scenexxx
		},
		
		getEnvPower : function(callback, errorCallback){
		
			this.spnode.ensureData({
				ignoreCase : true,
				success : function(data){
					var datajson = data.getJson();
					if(datajson["environmentPower"]==undefined){
						datajson["environmentPower"] = "1.0000";
						//console.log(datajson["environmentPower"]);
					}
					callback(datajson["environmentPower"]);
				},	
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				}
			});
			
		},
		
		setEnvPower : function(envpower, callback, errorCallback){
			// 直接使用spsession.addNode 应该不会加载子节点
			this.spsession.addNode({
				nodePath : "/",
				property : { 
					"environmentPower":envpower
					},
				success : function(){
					 if(typeof callback == "function"){
						callback();
					 }else{
						throw("there must be a 'callback' parameter in arguments!");
					 }
				},
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback();
					}else{
						throw(error);
					}
					 
				},
				saving : function(){
				}
			});
		}
		
		
	});	
	
	return retClass;
})