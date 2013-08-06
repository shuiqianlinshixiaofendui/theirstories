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
	此Action 负责响应模型的所有操作
	并且，通过响应的不同事件，获取不同的node来处理事件。
	当响应的事件发生改变时，delete当前的node
*/

define("web3d/action_new/module_action",["dojo/topic", "web3d/node_new/selectModuleState"],function(topic,selectModuleState){
	
	
	var currentNode = null;// currentNode 记录当前需要加载的node
	var lastNodeName = "";// lastNodeName 上一次加载的节点名字
	var _selectModuleState = null;
	
	// 加载node(此处应该修改，判断原node和当前node是否是同一个node，如果相同则不加载)
	function requireNode(nodeName,x3d){
        var _nodeName = nodeName
		var newNode ;
        if(nodeName.split("_")[0] == "node"){
			newNode = "node_new";
		}else if(nodeName.split("_")[0] == "operate"){
			newNode = "operate";
		}else{
            newNode = "node_new" ;
        }
		require(["web3d/"+newNode+"/" + nodeName], 
			function(nodeName){
				// 如果当前节点名字与上一次加载的节点名字不一致，才能够加载节点，否则不加载节点
				if(nodeName != lastNodeName){
					if(currentNode){
                        if( _nodeName != "model" && _nodeName != "operate_modelHiden" && _nodeName != "operate_syncerdata" ){
                            currentNode.unload();
                            currentNode = null;
                        }
					}
					currentNode = new nodeName(x3d);
					lastNodeName = nodeName;
				}
			}
		);
	}
	
	var module_action = dojo.declare([],{
		constructor : function(x3d){
			_selectModuleState = new selectModuleState(x3d);
			// 响应摄像机锁定状态
			topic.subscribe("command/viewpoint_action/locked",function(state){
				if(Spolo.dataSync){
					var camera_json = Spolo.dataSync.get_camera_data();
					camera_json.camera_locked = state;
				}
			});
			
			// addBox
			topic.subscribe("command/module_action/addBox",function(){
				_selectModuleState.addBox();
			});
			
			// 删除box
			topic.subscribe("command/module_action/removeBox",function(){
				_selectModuleState.removeBox();
			});
			// 切换模式时删除当前的box
			topic.subscribe("command/module_action/removeCurBox",function(){
				_selectModuleState.removeCurBox();
			});
			// 当用户选择模型平移操作后，此处响应消息，调用node完成模型平移操作
			topic.subscribe("command/module_action/translate",function(){
				requireNode("operate_freeModule",x3d);
				currentNode.model_translate();
			});
			
			// 当用户选择模型旋转操作后，此处响应消息，调用node完成模型旋转操作
			topic.subscribe("command/module_action/rotate",function(state){
				requireNode("operate_freeModule",x3d);
				currentNode.model_rotate(state);
			});

			// 当用户选择模型平缩放作后，此处响应消息，调用node完成模型缩放操作
			topic.subscribe("command/module_action/scale",function(){
				requireNode("operate_freeModule",x3d);
				currentNode.model_scale();
			});
			
			// --------------------------------------------------------------------
			
			// 当用户选择坐标模式模型平移操作后，此处响应消息，调用node完成坐标模式模型平移操作
			topic.subscribe("command/module_action/coor_translate",function(){
				requireNode("operate_axisManager",x3d);
				currentNode.coor_translate();
			});
			
			// 当用户选择坐标模式模型旋转操作后，此处响应消息，调用node完成坐标模式模型旋转操作
			topic.subscribe("command/module_action/coor_rotate",function(){
				requireNode("operate_axisManager",x3d);
				currentNode.coor_rotate();
			});
			
			// 当用户选择坐标模式模型缩放操作后，此处响应消息，调用node完成坐标模式模型缩放操作
			topic.subscribe("command/module_action/coor_scale",function(){
				requireNode("operate_axisManager",x3d);
				currentNode.coor_scale();
			});
			
			// 给点击物体添加坐标轴
			topic.subscribe("command/module_action/axisAdd",function(trans){
				requireNode("operate_axisManager",x3d);
				currentNode.axisAdd(trans);
			});
			
			// 删除坐标轴
			topic.subscribe("command/module_action/axisDelete",function(){
				requireNode("operate_axisManager",x3d);
				currentNode.axisDelete();
			});
            
            // 添加模型
			topic.subscribe("command/module_action/modelAdd",function(nodeData){
				requireNode("model",x3d);
				currentNode.addModel(nodeData);
			});
             // 删除模型
			topic.subscribe("command/module_action/modelDelete",function(){
				requireNode("model",x3d);
				currentNode.deleteModel();
			});
            
             // 隐藏模型
			topic.subscribe("command/module_action/modelHiden",function(def){
				requireNode("operate_modelHiden",x3d);
				currentNode.hidenModel(def) ;
			});
			// 同步模型数据
			topic.subscribe("command/module_action/modelSync",function(){
				requireNode("operate_syncerdata",x3d);
				currentNode.syncModel() ;
			});
			// 模型高亮
			topic.subscribe("command/module_action/modelHighLight",function(modelId){
                var modelNode = document.getElementById(modelId) ;
                Spolo.oldSelectedObj = Spolo.selectedObj ;
                Spolo.selectedObj = modelNode._x3domNode ;
				requireNode("selectModuleState",x3d);
                currentNode.removeBox() ;
				currentNode.addBox() ;
			});
            
            topic.subscribe("toolbar/model/selectModeFree",function(state){
                if( state == 1 ){
                    requireNode("operate_freeModule",x3d);
                    currentNode.model_translate();
                }else{
                    requireNode("operate_axisManager",x3d);
                    currentNode.coor_translate();
                }
			});
		},
		
		deleteNode : function(){
			if(currentNode){
				currentNode.unload();
				currentNode = null;
			}
		}
	
	});
	
	return module_action; 
	
});