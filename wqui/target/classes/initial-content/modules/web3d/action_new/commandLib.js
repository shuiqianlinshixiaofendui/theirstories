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
	commandLib - 命令库
	
	拦截dojo topic publish消息，将publish的消息当做命令
	根据命令决定加载哪个Action
*/
define("web3d/action_new/commandLib",["dojo/topic","web3d/Lib/syncLib"],function(topic,syncLib){
	var stack = [];
	var stack_length = 20;
	var oldActionName;
	var oldAction;
	var actionExist = [];
	/*
		private function
		拦截 topic publish 的消息
		当 publish 消息后，将需要记录的消息存储起来
	*/
	function intercept_topic_publish(x3d){
		var _publish = topic.publish;
		topic.publish = function(arg_1,arg_2,arg_3,arg_4,arg_5,arg_6){
			// 截取命令第一段
			var command = arg_1.split("/");
			// 如果接收的消息是操作命令消息，那么将这个消息存储在栈中
			if(command[0] == "command"){
				// json打包
				// var data = pack(arg_1,arg_2,arg_3,arg_4,arg_5,arg_6);
				// if(true){//这里判断是不是摄像机操作，代码完善后需要修改此处
					// push(data);
				// }
				// 根据拦截下来的消息，将此消息需要的Action加载进来，要记录的消息为command/action/operate
				loadAction(command[1],x3d);
			}else if(command[0] == "system" && command[1] == "onMouseRelease"){
				/**
				*从JCR中取出上一次操数据的信息保存到数组中
				*/
                var _Sylb = new syncLib();
                if(Spolo.selectedObj && Spolo.selectedObj._DEF != "boundingBox" && Spolo.selectedObj._DEF){
                    var _def = Spolo.selectedObj._DEF;
                    _Sylb.getItemByName(_def, function(item){
                        push(item.data);
                    });
                }
				
			}else if(arg_1 == "keybord/rollback/undo"){	
				undo();
			}
			_publish.call(this,arg_1,arg_2,arg_3,arg_4,arg_5,arg_6);
			
		}
	}
	
	// 根据命令加载action
	function loadAction(action,x3d){
		if(!actionIsExist(action)){	
			var actionPath = "web3d/action_new/"+action;
			require([actionPath],
				 function(action){
					new action(x3d);
				}
			);
			actionExist.push(action);
		}
	}
	
	// 查询一个action是否已加载
	function actionIsExist(action){
		for(j=0;j<actionExist.length;j++){
			if(action == actionExist[j]){
				return true;
			}
		}
		return false;
	}

	function push(data){
		stack.push(data);
		stack.length;
		if(stack.length >=stack_length){
			//如果数组中存储数据的长度大于规定的个数时，将最先存入数组中的数据删除
			stack.shift();
		}
	}
	
	// 命令出栈
	function pop(){
		var com	= stack.pop();
		return com;
	}
	
	// json打包
	// function pack(arg_1,arg_2,arg_3,arg_4,arg_5,arg_6){
		// var JSONObject= {
			// "command":arg_1,
			// "parameter1":arg_2,
			// "parameter2":arg_3,
			// "parameter3":arg_4,
			// "parameter4":arg_5,
			// "parameter5":arg_6
		// };
		// return JSONObject;
	// }
	
	// 撤销操作
	function undo(){
		var data = pop();
		if(data){
			topic.publish("keybord/rollback/update", data);
		}
	}
	
	var commandLib = dojo.declare([],{
		constructor : function(x3d){
			intercept_topic_publish(x3d);
			
			// 摄像机平移命令
			//topic.publish("command/viewpoint_action/translate");
			
			topic.subscribe("toolbar/camera/locked",function(cameraState){
				if(cameraState){
					Spolo.OperationMode = 2; 
                    // 自由模式下模式移动模型
                    if(Spolo.current_trans == "free"){
						topic.publish("command/module_action/translate");
					}else if(Spolo.current_trans == "asis"){
						// 坐标模式下模式移动模型
						topic.publish("command/module_action/coor_translate");
					}
				}else{
					Spolo.OperationMode = 1;
                    // 摄像机模式下删除模型坐标系
					if(document.getElementById("coorbar_model")!=null){
						topic.publish("command/module_action/axisDelete");
					}
					topic.publish("command/module_action/removeCurBox");
				}
			});
			topic.publish("toolbar/camera/locked",true);
		},
		
		runAction : function (str){
			
		}
	});
	return commandLib;
});