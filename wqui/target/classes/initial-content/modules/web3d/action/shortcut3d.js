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
	3D部分快捷键
	帖子：#967
*/

/*支持3D部分操作的快捷键。*/

define("web3d/action/shortcut3d",["dojo/topic","dojo/request"],
	function(topic,request){
		return dojo.declare([],{
			constructor : function(x3d)
			{
				document.addEventListener('keydown', onKeydown, false) ;
				document.addEventListener('keyup', onKeyup, false) ;
					
				var flag = false ;						// 判断是否使用了shift键
				
				
				
				/*键盘按下事件*/
				function onKeydown(event){ 
				    //console.log("down"+event.keyCode) ;
					switch(event.keyCode) {
						case 16: 		// key shift
							flag = true ;
							onKeyup(event) ;		// 使用shift组合键
						break;
						case 17: 		// key ctrl
						    //console.log("ctrl") ;
							//flag = true ;
							//onKeyup(event) ;		// 使用ctrl组合键
						break;
						case 18: 		// key alt
						
						break;
						case 49:		// key 1
						
						break;
						case 50:		// key 2 
						
						break;
						case 51:		// key 3 
						
						break;
						case 52:		// key 4 
							
						break;
						case 53:		// key 5 
							
						break;
						case 54:		// key 6 
							
						break;
						case 55:		// key 7 
							
						break;
						case 65:		// key a 
						    if(flag==false){		// 没有按下shift
								topic.publish("shortcut3d/camera/reset_a") ;	// 按下a重置全局变量
							}
						break;
					
					}
				}
				
				/*键盘抬起*/
				function onKeyup(event){
				    if(flag){
						switch(event.keyCode) {	
							case 18: 		// key alt
								
							break;
							case 65:		// key a
								topic.publish("shortcut3d/camera/amplify") ;	// 摄像机推进放大
								flag = false ;
							break ;
							case 69:		// key e
								topic.publish("shortcut3d/camera/reset") ;    // 摄像机reset功能					  
								flag = false ;
							break ;
							case 70:		// key f
								topic.publish("shortcut3d/camera/farnear") ;    // 摄像机缩放
								flag = false ;
							break ;
							case 82:		// key r 
								topic.publish("shortcut3d/camera/rotate") ;		// 摄像机旋转
								flag = false ;
							break;
							case 83:		// key s
								topic.publish("shortcut3d/showHidden") ;		// 显示\隐藏标示小球
								flag = false ;
							break ;
							case 84:		// key t 
								topic.publish("shortcut3d/camera/translate") ;	// 摄像机平移
								flag = false ;
							break;
						}
					}
				}
				
				
				
			}
		});
	}
);