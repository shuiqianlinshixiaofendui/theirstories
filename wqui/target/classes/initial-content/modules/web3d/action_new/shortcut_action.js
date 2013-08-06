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
	此Action 负责响应快捷键所有操作
	通过响应不同的消息加载不同的node，然后执行
*/

define("web3d/action_new/shortcut_action",["dojo/topic"],function(topic){
    return dojo.declare([],{				
		constructor : function(){   
            var flag = true ;       // 将鼠标滚轮的消息指发送一次
			var shift = false;      // 点击了shift键
            var leftMouse = false;
            
            // 注册鼠标事件
			window.onmousewheel=document.onmousewheel=scrollFunc;  // 注册鼠标滚轮事件
            // 注册键盘事件
			document.addEventListener('keyup', onKeyup, false) ;   // 键盘抬起事件
			document.addEventListener("keydown", onKeydown, false);// 键盘按下事件
            
            /**
                鼠标抬起事件
            **/
			topic.subscribe("system/onMousePress", function(x,y,buttonState){
				flag = true; 
				if (buttonState & 1 && shift){
                    if(Spolo.current_view == "free_view"&& !Spolo.browseViewOperationMode && Spolo.isToolbar == false){
                        topic.publish("command/viewpoint_action/translate");
                    }
                    
                    if(Spolo.current_view != "free_view" && !Spolo.browseViewOperationMode && Spolo.isToolbar == false ){
                        topic.publish("command/viewpoint_action/fixedViewMove");
                    }	
					if (Spolo.browseViewOperationMode){
                        topic.publish("command/viewpoint_action/browseViewTranslate");
                    }
				}
                
                if (buttonState & 4 && !shift){
					if(Spolo.current_view == "free_view" && !Spolo.browseViewOperationMode && Spolo.isToolbar == false){
						topic.publish("command/viewpoint_action/rotate");
					}
                    if(Spolo.current_view != "free_view" && !Spolo.browseViewOperationMode && Spolo.isToolbar == false){
                        topic.publish("command/viewpoint_action/fixedViewRotate");
                    }
                    if (Spolo.browseViewOperationMode){
                        topic.publish("command/viewpoint_action/browseViewRotate");
                    }
				}
                
                if(buttonState & 1 && !leftMouse){
                    topic.publish("command/module_action/translate");
                    leftMouse = true;
                }
               
			});
			     
			/**
                鼠标中间滚动事件
            **/
			function scrollFunc(){      
                if(flag){
                    flag = false ;
                    if(Spolo.current_view == "free_view"&& !Spolo.browseViewOperationMode && Spolo.isToolbar == false){
                        topic.publish("command/viewpoint_action/scale");
                    }
                    if(Spolo.current_view != "free_view" && !Spolo.browseViewOperationMode && Spolo.isToolbar == false){
                        topic.publish("command/viewpoint_action/fixedViewScale");
                    }
                    if(Spolo.browseViewOperationMode){
                        topic.publish("command/viewpoint_action/browseViewScale");
                    }	
                }
			}
			
			/**
                键盘抬起事件
            **/
			function onKeyup(event){
				shift = false;
				switch(event.keyCode) {	
					case 110: 	// 小键盘 "."
					topic.publish("command/viewpoint_action/amplify");
					break;
					
				}
			}
            
            /**
                键盘按下事件
            **/
			function onKeydown(event){
				if(event.ctrlKey){		// key  "ctrl"
					switch (event.keyCode){
						case 90 :      // key  "z"	
						topic.publish("keybord/rollback/undo");
						break;
					}
				}
				if(event.shiftKey){         // key "shift" 
					shift = true;
                    switch (event.keyCode){
                        case 83 :           // key "s"
                        topic.publish("command/module_action/modelSync");     // 发送同步模型消息
                        break;
                    }
				}else{
					shift = false;
				}
			}
			
		}
	});
});