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
 
define("spolo/data/myPreviewDetail",
[
	"dojo/_base/declare", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"dojo/request/xhr",
	"dojo/json",
	"spolo/data/queryClass",
	"spolo/data/folder"
],
function(
	declare,  
	spsession,
	spnode,
	xhr,
	JSON,
	queryClass,
	folder
)
{
	
	/****************************************************************/
	/*******************全局变量*****************************************/
	/****************************************************************/
	
	
	
	
	/****************************************************************/
	/*******************私有方法*************************************/
	/****************************************************************/
	
	

	/****************************************************************/
	/*******************公有方法*************************************/
	/****************************************************************/
	
	var retClass =  declare("spolo/data/myPreviewDetail", [folder], {
	
		constructor : function(path)
		{
			this.ref = null;
			this.path = path;
		}
    });
	
	
	/****************************************************************/
	/*******************静态方法*************************************/
	/****************************************************************/
	
	//从上传的场景中获取效果图
	retClass.getPreviewFromScene = function(path ,callback , errorCallback){
		var node_path = path ;
		if(!node_path){
			throw("path is undefined");
		}
		queryClass.query({
			nodePath : node_path
			orderDesc : "jcr:created",
			load : function(data){
				if(typeof(callback) == "function"){
					var previewData = data["data"]
					callback(previewData);
				}else{
					throw("callback is not a function");
				}
			},
			error : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback(error);
				}else{
					throw("errorCallback is not a function");
				}
			}
		});
	}
	return retClass;	
});