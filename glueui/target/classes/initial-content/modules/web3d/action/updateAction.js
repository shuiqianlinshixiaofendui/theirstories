/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
**/

/*
	该类主要负责向jcr中更新数据
*/

define(["dojo/_base/xhr"],function(xhr){

	var updateAction = new Object();
	
	updateAction.__cameraCache = "";
	
	/*
		用户身份认证
	*/
	function authentication(){
		if(Spolo.getUserId()=="anonymous"){
			return false;
		}else{
			return true;
		}
	}
	
	/*
		向当前场景中添加一个模型
		@par1 ：当前场景节点的URL
		@par2 : 模型的地址，格式： /content/models/category01/subcate01/m01
		@par5 : 回调函数
	*/
	updateAction.addNode = function(parentNode, factoryUrl, callback){ 
		if(authentication()==false){
			return;
		}
	
		if(!parentNode.restUrl){
			callback(false);
			return;
		}
												   // 这里parentNode 如果是 loadableScene 的话 , restUrl 是带 /tddata 的
		var updateUrl = parentNode.restUrl + '/',  // 这里加斜线是为了让jcr自动编号这个节点
			pdata = "";
			
		pdata = pdata.concat("_charset_=utf-8");
		pdata = pdata.concat("&factory="+factoryUrl);
		pdata = pdata.concat("&position=0,0,0");
		pdata = pdata.concat("&rotation=0,0,0");
		pdata = pdata.concat("&scale=1,1,1");
		pdata = pdata.concat("&sling:resourceType=scenes");
	
		xhr.post({
			url : updateUrl,
			postData : pdata,
			handleAs : "text",
			load : function(response){
				callback(response);
			},
			error : function(response){
				callback(response);
			}
			
		});
	};
	
	/*
		更新单个模型的数据
		@par1 : 必须是loadable类型
	*/
	updateAction.updateNode = function(node, callback){
		if(authentication()==false){
			return;
		}
	
		if(!node.restUrl){
			callback(false);
			return;
		}
		
		var updateUrl = node.restUrl,
			data = "",
			pos = node.position,
			rot = node.rotation,
			sca = node.scale;
			
		data = data.concat("position="+pos.x+','+pos.y+','+pos.z);
		data = data.concat("&rotation="+rot.x+','+rot.y+','+rot.z);
		data = data.concat("&scale="+sca.x+','+sca.y+','+sca.z);
		
		xhr.post({
			url : updateUrl,
			postData : data,
			handleAs : "text",
			load : function(response){
				callback(response);
			},
			error : function(response){
				callback(response);
			}
			
		});
	};
	
	
	/*
		从场景中删除节点
	*/
	updateAction.removeNode = function(node, callback){ 

		if(authentication()==false){
			return;
		}
	
		if(!node.restUrl){
			callback(false);
			return;
		}
	
		var pdata = ":operation=delete";
		
		var posturl = node.restUrl;
		
		xhr.post({
			url : posturl,
			postData : pdata,
			handleAs : "text",
			load : function(response){
				callback(response);
			},
			error : function(response){
				callback(response);
			}
			
		});
	};
	
	/*
		更新摄像机数据
	*/
	updateAction.updateCamera = function(loadableScene, callback){
		// 身份验证
		if(!authentication()){
			return;
		}
		
		
		var camera = Spolo.camera,
			pos = camera.position != undefined ? camera.position:'0,0,0',
			rot = camera.rotation != undefined ? camera.rotation:'0,0,0',
			far = camera.far != undefined ? camera.far:'2000',
			near = camera.near != undefined ? camera.near:'1',
			fov = camera.fov != undefined ? camera.fov:'45',
			aspect = camera.aspect != undefined ? camera.aspect:'1',
			width = camera.width != undefined ? camera.width:'1024',
			height = camera.height != undefined ? camera.height:'768',
			focus = camera.focus != undefined ? camera.focus:'0,0,0';	// 这里是渲染时摄像机盯着的点
			
		var data = "";
		data = data.concat("position="+pos.x+','+pos.y+','+pos.z);
		data = data.concat("&rotation="+rot.x+','+rot.y+','+rot.z);
		data = data.concat("&far="+far);
		data = data.concat("&near="+near);
		data = data.concat("&fov="+fov);
		data = data.concat("&aspect="+aspect);
		data = data.concat("&width="+width);
		data = data.concat("&height="+height);
		data = data.concat("&focus="+focus);
		
		// 判断缓存，决定是否更新数据
		if(this.__cameraCache == data){
			return;
		}
		this.__cameraCache = data;
		
		
		var cameraUrl = loadableScene.restUrl + '/camera';	// 这里parentNode 如果是 loadableScene 的话 , restUrl 是带 /tddata 的
	
		xhr.post({
			url : cameraUrl,
			postData : data,
			handleAs : "text",
			load : function(response){
				if(callback)
					callback(response);
			},
			error : function(response){ 
				if(callback)
					callback(response);
			}
		});
	};
	
	return updateAction;
	
});