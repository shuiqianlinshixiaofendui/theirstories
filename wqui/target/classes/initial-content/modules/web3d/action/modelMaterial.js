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
	模型高亮
	帖子：#577
*/

/*负责修改模型的Material，实现高亮。*/

define("web3d/action/modelMaterial",["dojo/topic"],
	function(topic){
		
		
		var dThis;  // 缓冲当前this
		var isRepeat = false; // 是否循环执行闪烁
		var transparency  ;
		var trans;
		var dNode;
		var repeatSetMaterial = function (node){
			dNode = node; // 缓冲当前需要改变material的节点
			var context = this;
			setTimeout(function() {
				// Call it
				modifyMaterial(dNode);
			}, 1000);
			
		}
		var modifyMaterial = function (trans_material){	// 修改Material
					
		for(var i = 0 ; i < trans_material.length ; i ++){
			trans = trans_material[i];
			transparency = trans_material[i].getAttribute("transparency") ;
			if(typeof(transparency) == ""){		// 如果没有transparency
				trans_material[i].setAttribute("transparency","0") ;
				transparency = trans_material[i].getAttribute("transparency") ;
			}
			if(transparency == "0.5"){
				trans_material[i].setAttribute("transparency","0") ;
				
			}else{
				trans_material[i].setAttribute("transparency","0.5") ;
			}
		}
		
		
		if(isRepeat){
			repeatSetMaterial(dNode);
		}else{
			trans.setAttribute("transparency","0") ;
		}
		
	}

		
		
		var modelMaterial = dojo.declare([],{
			constructor : function(x3d)
			{
				dThis = this;
				
				// 模型高亮
				topic.subscribe("modelMaterial/highlight", function(def){  // 2D部分只需要publish一回
				
					if(!isRepeat){
						isRepeat = true;
					}else{
						isRepeat = false;
					}
				
					// 这里进行判断
					var sceneChild = x3d.firstElementChild.children ;	// scene下的transform 
					for(var i = 0 ; i < sceneChild.length ; i ++){
						var nodeName = sceneChild[i].nodeName ;
						if(nodeName == "TRANSFORM"){
							var trans_def = sceneChild[i].getAttribute("DEF") ;		// 这里有一个问题：@zhangwei添加的是id
							var trans_id = sceneChild[i].getAttribute("id") ;
							if(trans_def!=null && trans_def == def){
							    var childern = sceneChild[i]._x3domNode ;
								var nodeList = getTransformChildren(childern)._xmlNode.childNodes ;
								for(var j = 0 ; j < nodeList.length ; j ++){
									var nodeName = nodeList[j].nodeName ;
									if(nodeName == "Transform"){
										var node_material = nodeList[j].getElementsByTagName("Material") ;
										repeatSetMaterial(node_material);
									}
								}
							}else if(trans_id!=null && trans_id == def){
								var trans_material = sceneChild[i].getElementsByTagName("Material") ;
								repeatSetMaterial(trans_material);
							}
							
						}
					}
				});
				
				//获取Transform子孙对象。
				var getTransformChildren =function(node){						
					if(node._childNodes.length){
						//if(x3dom.isa(node._parentNodes[0], x3dom.nodeTypes.Transform)){
						var tagName = node._childNodes[0]._xmlNode.tagName;
						if(tagName=="Transform" || tagName=="Group" || tagName=="GROUP" || 
							tagName=="INLINE" || tagName=="Inline" || tagName=="Scene" ||   // 根节点下的scene的tagName是SCENE,全大写
							tagName=="TRANSFORM" ){
							return getTransformChildren(node._childNodes[0]);
						}else{
							// @fixme 这里需要再根据 TagName 来做进一步判断，确保node是一个Transform，
							// 否则后续的模型位置、旋转、缩放操作会报错
							// 但从目前的数据结构来看，这里的 node 肯定是一个 Transform
							// 因为在向scene中加模型时，就自动给模型套了一层Transform，并保存到jcr中了
							return node;
						}
					}
					return null;
				}
				
			}
		});
		return modelMaterial;
	}
);

