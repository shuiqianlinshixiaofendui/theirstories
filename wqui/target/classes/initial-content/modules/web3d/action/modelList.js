/** 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/

/** 
	遍历当前场景所有模型
	帖子：#940
*/

/*负责遍历当前场景的模型,把数据发送给二维界面显示。*/

define("web3d/action/modelList",["dojo/topic","dojo/_base/xhr","dojo/request"],
	function(topic,xhr,request){
		return dojo.declare([],{
			constructor : function(x3d)
			{
			
				//遍历当前场景的所有模型，发布消息给二维。( 模型的id,名称,缩略图,锁定信息,显示隐藏信息)
				var allTrans_def = new Array();			// 模型id	
				var allInline_name = new Array();		// 模型名称
				var allInline_img = new Array();		// 模型图片
				var allInline_locked = new Array();		// 模型锁定
				var allInline_render = new Array();		// 模型隐藏
				var count_trans = 0 ;					// 外层循环
				var count_inline = 0 ;					// 里层循环
				var sceneChild = x3d.firstElementChild.children ;	// scene下的transform 
			
			
				// 修改jcr中的属性
				var modifyModelLocked = function(baseURI,value){
					xhr.post({
						url: baseURI + ".json",
						load: function(data) {
						},
						error: function(err) {
							console.log("error:", err);
						},
						content:{
							"_charset_":"UTF-8",
							"islocked":value
						}
					});
				}
				
				/*取得全部的模型信息*/
				var getModelInformation = function(request_uri,inline_url){
					request.get(request_uri, {
					handleAs: "json"
					}).then(function(json_data){	
					allInline_name.push(json_data["modelName"]);
					var previews = json_data["preview"];
					for(var k in previews){
						if (typeof(previews[k]) == 'object'){		// 只要图片
							var img = inline_url + "/preview/" + k ;	// 拼接图片路径
							allInline_img.push(img) ;
							count_inline ++ ;
							if(count_trans == count_inline)	{	// 最后一个将全部数据发送出去
								allModelList() ;
							}
						}
					}
					}, function(err){
					console.log("error:", err);
					});
				}
				
				/*遍历全部的数组，然后发布到2D*/
				var allModelList = function(){
				    var allModel = {} ;
					/*	数据格式
					{
						0 : {
								DEF : "Transform13565966745720",
								modelName : "茶几",
								modelImg : "chaji.jpg",
								modelLocked : "false",
								modelRender : "true" 
						},
						1 : {
								DEF : "Transform13565966745720",
								modelName : "茶几",
								modelImg : "chaji.jpg",
								modelLocked : "false",
								modelRender : "true"
						}
					}
					*/
					for(var i = 0 ; i < allTrans_def.length ; i ++){
						allModel[i] = {"DEF":allTrans_def[i],"modelName":allInline_name[i],
									   "modelImg" : allInline_img[i],"modelLocked":allInline_locked[i],"modelRender":allInline_render[i]};
					}
					topic.publish("modelList/allModel",allModel) ;
				}
				
								
				/*遍历scen下的节点
				for(var i = 0 ; i < sceneChild.length ; i ++)
				{
					var nodeName = sceneChild[i].nodeName ;
					if(nodeName == "TRANSFORM")
					{
						count_trans ++ ;
						var transDef = sceneChild[i].getAttribute("def") ;
						var transLocked = sceneChild[i].getAttribute("islocked") ;
						var transRender = sceneChild[i].getAttribute("render") ;
						if(!transLocked){		// 没有islocked
							var trans_baseURI = sceneChild[i].getAttribute("baseURI") ;
							modifyModelLocked(trans_baseURI,"false") ;
							transLocked = "false" ;
						}
						allTrans_def.push(transDef) ;			
						allInline_locked.push(transLocked) ;
						allInline_render.push(transRender) ;
						var trans_inline = sceneChild[i].children.item() ;		// transfrom下的inline
						var inline_name = trans_inline.nodeName ;
						if(inline_name == "INLINE")
						{
							// 抽成方法
							var inline_url = trans_inline.getAttribute("url").split("/x3d.x3d")[0] ;
							var request_uri = inline_url+".2.json"
							getModelInformation(request_uri,inline_url) ;
						}
					}
				}*/
				
				
			}
		});
	}
);

