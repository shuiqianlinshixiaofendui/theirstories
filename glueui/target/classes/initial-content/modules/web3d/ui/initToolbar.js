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
// Tooltip 操作事件 
define("web3d/ui/initToolbar",
    ["dojo/topic","dojo/dom","dijit/form/Select","dojo/query","dojo/mouse","dojo/on","dijit/form/Button","dojo/dom-construct","dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem","dojo/fx","dijit/Tooltip","dojo/dom-style","dijit/Dialog","dijit/form/TextBox","dijit/form/Textarea","spolo/data/scene","widgets/ModelLib/ModelLib"],
	function(topic,dom,Select,query,mouse,on,Button,construct,DropDownButton,DropDownMenu,MenuItem,fx,Tooltip,domStyle,Dialog,TextBox,Textarea,sceneClass,ModelLibClass){
			//测试数据		
			var initModelList = {};	
			var retClass = dojo.declare("web3d/ui/initToolbar",[],{				
				constructor:function(containerID){		
					this.initToolbar(containerID);
					this.initViewbar();
					this.initModelbar();	
				},
				//=====================================1=======================================================				
				//this is a part of initModelbar .......................
				initModelbar:function(){	
				  if(!_showModelbar.innerHTML){	
					//返回按钮操作
					construct.create("font",{
						id:"return_btn",
						size:"4",
						color:"white",					
						style:"float:left;margin-top:3px;cursor:pointer",
						innerHTML:"<<返回"
					},_showModelbar);
					//请选择
					construct.create("div",{
						id:"pleaseChoice_",
						style:{float:'left',marginTop:"8px",marginLeft:"40px"},
						innerHTML:"请选择:"
					},_showModelbar);
					//用来容纳button的容器	
					construct.create("div",{
						id:"_operator_",
						style:{float:'left',width:"80px",height:"100%",marginLeft:"10px"}
					},_showModelbar);	
					//button
					var myButton_ = new Button({
							id:"myButton_",
							label: "模型操作"							
						}).placeAt("_operator_","wrapper");
					//这里是对摄像机的操作
					construct.create("div",{
						id:"currentChoice",
						style:{float:'left',marginTop:"8px",marginLeft:"70px"},
						innerHTML:"当前操作： 模型操作"
					},_showModelbar);		
				    //分割线
					construct.create("div",{							
							style:{float:"left",width:"1px",height:"31px",background:"#dadada",marginLeft:"50px"}
						},_showModelbar);					
					//模型选择
					construct.create("div",{	
							id:"modelChoice",
							"class":"className",
							title:"模型选择",
							style:{	backgroundImage:"url('image/select.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}							
						},_showModelbar);
						
					//选择模式
					var selectMode =new Select({
						id:"selectMode",
						name: "selectMode",
						style:{	float:"left",marginLeft:"20px",marginTop:"5px"},
						options: [
							{ label: "自由模式", value: "1", selected: true },
							{ label: "坐标模式", value: "2"}							
						]
					}).placeAt(_showModelbar);		
				
					//模型平移
					construct.create("div",{	
							id:"model_trans",
							title:"模型平移",
							"class":"className",
							style:{	backgroundImage:"url('image/translate.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showModelbar);					
					//	模型缩放
					construct.create("div",{	
							id:"model_scale",
							title:"模型缩放",
							"class":"className",
							style:{	backgroundImage:"url('image/scale.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showModelbar);	
					/*construct.create("div",{
						id:"currentRotate",
						style:{float:'left',marginTop:"8px",marginLeft:"20px"},
						innerHTML:"请选择旋转操作："
					},_showModelbar);	*/			
					//	模型旋转
					/*var rotate_choose =new Select({
						id:"rotate_choose",
						name: "rotate_choose",
						style:{	float:"left",marginLeft:"20px",marginTop:"5px"},
						options: [
							{ label: "投射平面旋转", value: "1", selected: true },
							{ label: "自身旋转", value: "2"}							
						]
					}).placeAt(_showModelbar);		*/
					//绕X轴旋转
					construct.create("div",{	
							id:"model_rotate",
							title:"模型旋转X轴",
							"class":"className",
							style:{	backgroundImage:"url('image/rotate.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px",display:"none"
							}
						},_showModelbar);	
					//绕X轴旋转
					construct.create("div",{	
							id:"model_rotateX",
							title:"模型旋转X轴",
							"class":"className",
							style:{	backgroundImage:"url('image/rotateX.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showModelbar);				
					//绕Y轴旋转
					construct.create("div",{	
							id:"model_rotateY",
							title:"模型旋转Y轴",
							"class":"className",
							style:{	backgroundImage:"url('image/rotateY.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showModelbar);	
					//绕Z轴旋转
					construct.create("div",{	
							id:"model_rotateZ",
							title:"模型旋转Z轴",
							"class":"className",
							style:{	backgroundImage:"url('image/rotateZ.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showModelbar);	
                        
                    // 保存div
                    construct.create("div",{	
							id:"save_console",
							"class":"className",
							style:{	width:"230px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							},
                            innerHTML:""
						},_showModelbar);	
                        
                        
                        
					// 保存模型
					construct.create("div",{	
							id:"model_save",
							title:"保存模型",
							"class":"className",
							style:{	backgroundImage:"url('image/delete.png')",width:"34px",height:"33px",float:"right",marginTop:"-3px"
							}
						},_showModelbar);												
				   //模型选择操作
					query("#modelChoice").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/select.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/selecting.png')");							
						}					
					});	
					query("#modelChoice").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/selecting.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/select.png')");							
						}					
					});	
					query("#modelChoice").on("click",function(){					   					
						if(this.style.backgroundImage.indexOf('image/selecting.png')!= -1){						
							domStyle.set(this,"backgroundImage","url('image/selected.png')");	
							domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotate"),"backgroundImage","url('image/rotate.png')");
							domStyle.set(dom.byId("model_rotateX"),"backgroundImage","url('image/rotateX.png')");
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");
							topic.publish("toolbar/model/select");	
						}else{								
							domStyle.set(this,"backgroundImage","url('image/select.png')");
							topic.publish("toolbar/model/unselect");
						}							
					});	
					//选择模式操作
					selectMode.on("change",function(){			
						//console.log("this is  get Value",this.get("value"));
						if(this.get("value")==2){
								domStyle.set(dom.byId("model_rotate"),"display","block");
								domStyle.set(dom.byId("model_rotateX"),"display","none");
								domStyle.set(dom.byId("model_rotateY"),"display","none");
								domStyle.set(dom.byId("model_rotateZ"),"display","none");
						}
						if(this.get("value")==1){
								domStyle.set(dom.byId("model_rotate"),"display","none");
								domStyle.set(dom.byId("model_rotateX"),"display","block");
								domStyle.set(dom.byId("model_rotateY"),"display","block");
								domStyle.set(dom.byId("model_rotateZ"),"display","block");
						}
						topic.publish("toolbar/model/selectModeFree",this.get("value"));	
							
					});	
					//模型平移操作
					query("#model_trans").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/translate.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/translating.png')");							
						}					
					});	
					query("#model_trans").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/translating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/translate.png')");							
						}					
					});	
					query("#model_trans").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/translating.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/translated.png')");
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotate"),"backgroundImage","url('image/rotate.png')");	
						    domStyle.set(dom.byId("model_rotateX"),"backgroundImage","url('image/rotateX.png')");	
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");	
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");	
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/translate.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/translate",_status);							
						}else{
							topic.publish("command/module_action/coor_translate",_status);
						}						
					});	
					//模型放大缩小操作
					query("#model_scale").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/scale.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/scaling.png')");							
						}					
					});	
					query("#model_scale").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/scaling.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/scale.png')");							
						}					
					});	
					query("#model_scale").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/scaling.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/scaled.png')");	
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");
							domStyle.set(dom.byId("model_rotate"),"backgroundImage","url('image/rotate.png')");	
						    domStyle.set(dom.byId("model_rotateX"),"backgroundImage","url('image/rotateX.png')");
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/scale.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/scale",_status);							
						}else{
							topic.publish("command/module_action/coor_scale",_status);
						}	
					});	
					//模型的旋转操作						
					/*rotate_choose.on("change",function(){			
						// console.log("this is  get Value",this.get("value"));
						if(this.get("value")==1){
							topic.publish("command/module_action/rotate");
						}
						if(this.get("value")==2){
							topic.publish("command/module_action/rotate");
						}*/
						// topic.publish("toolbar/model/selectModeFree",this.get("value"));				
					//});					
					//模型旋转
					query("#model_rotate").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotate.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotating.png')");							
						}					
					});	
					query("#model_rotate").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotate.png')");							
						}					
					});	
					query("#model_rotate").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/rotating.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/rotated.png')");	
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/rotate.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/rotate");							
						}else{
							topic.publish("command/module_action/coor_rotate",_status);
						}	
						
					});						
					//型模旋转X轴
					query("#model_rotateX").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateX.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateXing.png')");							
						}					
					});	
					query("#model_rotateX").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateXing.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateX.png')");							
						}					
					});	
					query("#model_rotateX").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/rotateXing.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/rotateXed.png')");	
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/rotateX.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/rotate",1);							
						}else{
							topic.publish("command/module_action/coor_rotate",_status);
						}	
						
					});	
					//型模旋转Y轴
					query("#model_rotateY").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateY.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateYing.png')");							
						}					
					});	
					query("#model_rotateY").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateYing.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateY.png')");							
						}					
					});	
					query("#model_rotateY").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/rotateYing.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/rotateYed.png')");	
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotateX"),"backgroundImage","url('image/rotateX.png')");
							domStyle.set(dom.byId("model_rotateZ"),"backgroundImage","url('image/rotateZ.png')");
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/rotateY.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/rotate",2);							
						}else{
							topic.publish("command/module_action/coor_rotate",_status);
						}	
						
					});	
					//模型旋转Z轴
					query("#model_rotateZ").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateZ.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateZing.png')");							
						}					
					});	
					query("#model_rotateZ").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotateZing.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotateZ.png')");							
						}					
					});	
					query("#model_rotateZ").on("click",function(){	
						var _status="";						
						if(this.style.backgroundImage.indexOf('image/rotateZing.png')!= -1){							
							domStyle.set(this,"backgroundImage","url('image/rotateZed.png')");	
							domStyle.set(dom.byId("modelChoice"),"backgroundImage","url('image/select.png')");	
						    domStyle.set(dom.byId("model_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("model_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("model_rotateY"),"backgroundImage","url('image/rotateY.png')");
							domStyle.set(dom.byId("model_rotateX"),"backgroundImage","url('image/rotateX.png')");
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/rotateZ.png')");
							_status = 2;
						}
						if(Spolo.current_trans=="free"){
							topic.publish("command/module_action/rotate",3);							
						}else{
							topic.publish("command/module_action/coor_rotate",_status);
						}	
						
					});	
                    topic.subscribe("sys/save_console",function(console_string){
                        dom.byId("save_console").innerHTML = console_string;
                        
                    });
                    
					//返回按钮
					query("#return_btn").on("mouseover",function(){					   					
						domStyle.set(this,"color","grey");				
					});	
					query("#return_btn").on("mouseout",function(){					   					
						domStyle.set(this,"color","white");					
					});	
					query("#return_btn").on("click",function(){	
						//----------------------------------------------					
						window.history.go(-1);	
					});
					//型模删除操作
					query("#model_save").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/delete.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/deleting.png')");							
						}					
					});	
					query("#model_save").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/deleting.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/delete.png')");							
						}					
					});	
					query("#model_save").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/deleting.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/delete.png')");	
                            topic.publish("command/module_action/modelSync");     // 发送同步模型消息
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/delete.png')");
							_status = 2;
						}
						topic.publish("toolbar/model/delete");
					});	
					// button_操作
					on(dom.byId(myButton_),"click",function(){						
							dom.byId("_showViewbar").style.display = 'block';
							dom.byId("_showModelbar").style.display = 'none';						
							dijit.byId("tabMain").selectChild(dijit.byId("tcpMyView"));					
							topic.publish("toolbar/camera/locked",false);						
							
					});							
				  }
				},
				//=====================================2=======================================================			
				//this is a part of initViewbar .......................
				initViewbar:function(){		
				 if(!_showViewbar.innerHTML){
					//返回按钮操作
					construct.create("font",{
						id:"return_btn2",
						size:"4",
						color:"white",					
						style:"float:left;margin-top:2px;cursor:pointer",
						innerHTML:"<<返回"
					},_showViewbar);
				   //请选择
					construct.create("div",{
						id:"pleaseChoice",
						style:{float:'left',marginTop:"8px",marginLeft:"40px"},
						innerHTML:"请选择:"
					},_showViewbar);
					//用来容纳button的容器	
					construct.create("div",{
						id:"_operator",
						style:{float:'left',width:"80px",height:"100%",marginLeft:"10px"}
					},_showViewbar);	
					//button
					var myButton = new Button({
							id:"myButton",
							label: "摄像机操作"							
						}).placeAt("_operator","wrapper");
					//这里是对摄像机的操作
					construct.create("div",{
						id:"currentChoice",
						style:{float:'left',marginTop:"8px",marginLeft:"70px"},
						innerHTML:"当前操作： 摄像机操作"
					},_showViewbar);		
					//分割线
					construct.create("div",{							
							style:{float:"left",width:"1px",height:"31px",background:"#dadada",marginLeft:"50px"}
						},_showViewbar);
					
				    var selectedcamera = new Select({
						id:"selectedcamera",
						name: "selectedcamera",
						style:{	float:"left",marginLeft:"20px",marginTop:"5px"},
						options: [
							{ label: "检查", value: "1", selected: true },
							{ label: "浏览", value: "2"},							
							/*
							{ label: "游戏", value: "3"},							
							{ label: "直升机", value: "4"},							
							{ label: "查看", value: "5"},	
							*/					
						]
					}).placeAt(_showViewbar);
                    var ua = navigator.userAgent.toLowerCase(); 
                    var windows = ua.indexOf("windows") ;
                    if(windows == -1){
                        construct.create("div",{	
                            id:"view_trans",
                            title:"摄像机平移",
                            "class":"className",
                            style:{	backgroundImage:"url('image/translate.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
                            }
                        },_showViewbar);					
                        construct.create("div",{	
                                id:"view_scale",
                                title:"摄像机远近",
                                "class":"className",
                                style:{	backgroundImage:"url('image/scale.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
                                }
                            },_showViewbar);					
                        construct.create("div",{	
                                id:"view_rotate",
                                title:"摄像机旋转",
                                "class":"className",
                                style:{	backgroundImage:"url('image/rotate.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
                                }
                            },_showViewbar);	
                    }                        
				   
					construct.create("div",{	
							id:"view_reset",
							title:"重置",
							"class":"className",
							style:{	backgroundImage:"url('image/reset.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showViewbar);	
					/* image/roundmodel.png	*/
					/*construct.create("div",{	
							id:"view_roundmodel",
							title:"绕模型旋转",
							"class":"className",
							style:{	backgroundImage:"url('image/roundmodel_unedit.png')",width:"34px",height:"33px",float:"left",marginLeft:"20px",marginTop:"-3px"
							}
						},_showViewbar);	*/	
					selectedview = new Select({
						id:"selectedview",
						name: "selectedview",
						style:{	float:"left",marginLeft:"20px",marginTop:"5px"},
						options: [
							{ label: "自由视角", value: "1", selected: true },
							{ label: "前视图", value: "2"},							
							{ label: "后视图", value: "3"},							
							{ label: "左视图", value: "4"},							
							{ label: "右视图", value: "5"},							
							{ label: "顶视图", value: "6"},							
							{ label: "底视图", value: "7"},							
						]
					}).placeAt(_showViewbar);	
					//添加视角
					construct.create("div",{	
							id:"addView",
							title:"添加视角",
							"class":"className",
							style:{	backgroundImage:"url('image/add.png')",width:"34px",height:"33px",float:"right",marginTop:"-3px"
							}
					},_showViewbar);								
					
                   //添加模型
					construct.create("div",{	
							id:"addModel",
							title:"添加模型",
                            "class":"className",
							style:{	backgroundImage:"url('image/addModel.png')",width:"34px",height:"33px",float:"right",marginTop:"-3px"}
					},_showViewbar);
                    //删除模型
					construct.create("div",{	
							id:"deleteModel",
							title:"删除模型",
							style:{	backgroundImage:"url('image/deleteModel.png')",width:"34px",height:"33px",float:"right",marginTop:"-3px"}
					},_showViewbar);
                    
					
                    
					
					// console.log("this is cancle ",dijit.byId("cancel"));						
					selectedcamera.on("change",function(){		
					        if(this.get("value")==1){		
								// console.log("this value:",this.get("value"));
								Spolo.browseViewOperationMode = false;
								topic.publish("command/viewpoint_action/translate");
							}
							if(this.get("value")==2){							
								// console.log("this value:",this.get("value"));
								Spolo.browseViewOperationMode = true;
								topic.publish("command/viewpoint_action/browseViewTranslate"); 
							}
							//屏蔽未完成事件
							/*if(this.get("value")==3){							
								// console.log("this value:",this.get("value"));
								topic.publish("toolbar/camera/modeToGame"); 
							}
							if(this.get("value")==4){							
								// console.log("this value:",this.get("value"));
								topic.publish("toolbar/camera/modeToHelicopter"); 
							}
							if(this.get("value")==5){							
								// console.log("this value:",this.get("value"));
								topic.publish("toolbar/camera/modeToSee"); 
							}*/
							
					});	
					//视角平移操作
					query("#view_trans").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/translate.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/translating.png')");							
						}					
					});	
					query("#view_trans").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/translating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/translate.png')");							
						}					
					});	
					/*topic.subscribe("toolbar/mouseSelected",function(_val){						
						if(_val){
							domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel.png')");
						}else{
							domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel_unedit.png')");
						}
					});*/
					//------------------------------------------------------------------
					query("#view_trans").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/translating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/translated.png')");							
						    domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");	
						    domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')"); 
							domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
							/*if(dom.byId("view_roundmodel").style.backgroundImage.indexOf('image/roundmodelled.png')!=-1){
								domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel.png')");	
							}	*/			
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/translate.png')");
							_status = 2;
						}
						
						if(Spolo.current_view == "free_view"&& !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
							topic.publish("command/viewpoint_action/translate",_status);
						}
                        
                        if(Spolo.current_view != "free_view" && !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
                            topic.publish("command/viewpoint_action/fixedViewMove",_status);
                        }	
						
					});	
					//视角放大缩小操作
					query("#view_scale").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/scale.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/scaling.png')");							
						}					
					});	
					query("#view_scale").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/scaling.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/scale.png')");							
						}					
					});	
					query("#view_scale").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/scaling.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/scaled.png')");	
						    domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
							domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");					
							/*if(dom.byId("view_roundmodel").style.backgroundImage.indexOf('image/roundmodelled.png')!=-1){
								domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel.png')");	
							}*/	
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/scale.png')");
							_status = 2;
						}
						
						if(Spolo.current_view == "free_view"&& !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
							topic.publish("command/viewpoint_action/scale",_status);
						}
                        if(Spolo.current_view != "free_view" && !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
                            topic.publish("command/viewpoint_action/fixedViewScale",_status);
                        }
                        if(Spolo.aroundObjOperationMode){
                            topic.publish("command/viewpoint_action/aroundObjScale",_status);
                        }					
					});	
					//视角旋转操作
					query("#view_rotate").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotate.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotating.png')");							
						}					
					});	
					query("#view_rotate").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/rotating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotate.png')");							
						}					
					});	
					query("#view_rotate").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/rotating.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/rotated.png')");	
							domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
							/*if(dom.byId("view_roundmodel").style.backgroundImage.indexOf('image/roundmodelled.png')!=-1){
								domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel.png')");	
							}	*/
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/rotate.png')");
							_status = 2;
						}
						if(Spolo.current_view == "free_view" && !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
							topic.publish("command/viewpoint_action/rotate",_status);
						}
                        if(Spolo.current_view != "free_view" && !Spolo.aroundObjOperationMode){
                            Spolo.isToolbar = true ;
                            topic.publish("command/viewpoint_action/fixedViewRotate",_status);
                        }
                        if(Spolo.aroundObjOperationMode){
                            topic.publish("command/viewpoint_action/aroundObjRotate",_status);
                        }
					});	
					//重置操作				
					query("#view_reset").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/reset.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/resetting.png')");							
						}					
					});	
					query("#view_reset").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/resetting.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/reset.png')");							
						}					
					});	
					query("#view_reset").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/resetting.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/resetted.png')");	
							domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
							 domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
							/*if(dom.byId("view_roundmodel").style.backgroundImage.indexOf('image/roundmodelled.png')!=-1){
								domStyle.set(dom.byId("view_roundmodel"),"backgroundImage","url('image/roundmodel.png')");	
							}*/	
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/reset.png')");
							_status = 2;
						}
						if(!Spolo.browseViewOperationMode){
							if(Spolo.current_view == Spolo.view_list[0]){
								topic.publish("command/viewpoint_action/reset");
							}else{
								topic.publish("command/viewpoint_action/fixedViewReset");
							}
						}else{
							topic.publish("command/viewpoint_action/browseViewReset");
						}
					});	
					//摄像机旋转一周操作
					/*query("#view_roundmodel").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/roundmodel.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/roundmodelling.png')");							
						}					
					});	
					query("#view_roundmodel").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/roundmodelling.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/roundmodel.png')");							
						}					
					});	
					query("#view_roundmodel").on("click",function(){
						var _status=false;
						if(this.style.backgroundImage.indexOf('image/roundmodelling.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/roundmodelled.png')");	
							domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
						    domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
							domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
							 domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");					
							_status = true;							
						}else{	
							if(dom.byId("view_roundmodel").style.backgroundImage.indexOf('image/roundmodelled.png')!=-1){
								domStyle.set(this,"backgroundImage","url('image/roundmodel.png')");
							}
							_status = false;
						}
						console.log(" this is Spolo.current_view.........",Spolo.current_view);
						topic.publish("command/viewpoint_action/aroundObj",_status);
					});	*/
					//选择模式的操作
					selectedview.on("change",function(){
							topic.publish("toolbar/camera/viewchange"); 
					        if(this.get("value")==1){		
								// console.log("this value:",this.get("value"));
								console.log(dom.byId("view_trans"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toFreeView"); 
							}
							if(this.get("value")==2){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toFrontView"); 
							}
							if(this.get("value")==3){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toBackView"); 
							}
							if(this.get("value")==4){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toLeftView"); 
							}
							if(this.get("value")==5){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toRightView"); 
							}
							if(this.get("value")==6){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toTopView"); 
							}
							if(this.get("value")==7){							
								// console.log("this value:",this.get("value"));
								domStyle.set(dom.byId("view_trans"),"backgroundImage","url('image/translate.png')");	
								domStyle.set(dom.byId("view_scale"),"backgroundImage","url('image/scale.png')");
								domStyle.set(dom.byId("view_reset"),"backgroundImage","url('image/reset.png')");
								domStyle.set(dom.byId("view_rotate"),"backgroundImage","url('image/rotate.png')");
								topic.publish("command/viewpoint_action/toBottomView"); 
							}
					});	
					//添加视角操作
					query("#addView").on("mouseover",function(){					   					
						if(this.style.backgroundImage.indexOf('image/add.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/adding.png')");							
						}					
					});	
					query("#addView").on("mouseout",function(){					   					
						if(this.style.backgroundImage.indexOf('image/adding.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/add.png')");							
						}					
					});	
					query("#addView").on("click",function(){	
						var _status="";
						if(this.style.backgroundImage.indexOf('image/adding.png')!= -1){								
							domStyle.set(this,"backgroundImage","url('image/add.png')");	
							_status = 1;							
						}else{								
							domStyle.set(this,"backgroundImage","url('image/add.png')");
							_status = 2;
						}
                        topic.publish("command/viewpoint_action/addView") ;
					});	
                    
                    
                    /**
                        创建公共模型库的dialog
                    **/
                    var dialog = new Dialog({
                        id:"modelLibDialog",
                        style:"width:90%"
                    });
                    
                    var json = {
                        path: "/content/modellib",
						toolbarData:{
							multipleChoice : true
						}
                    };
                    
                    var modellib = new ModelLibClass(json);
                    modellib.placeAt("modelLibDialog");
                    on(modellib.listWidget,"onListItemClick",function(nodeData){
                        topic.publish("command/module_action/modelAdd",nodeData) ;  // 发送添加model 的消息
                    });
					on(modellib,"multipleChoice",function(data){
						var items = modellib.listWidget.getSelectNodes();
						topic.publish("command/module_action/modelAdd",items) ;
					});
                                       
                    query("#addModel").on("click",function(){	
						 dijit.byId("modelLibDialog").show();
					});	
                    query("#deleteModel").on("click",function(){
						topic.publish("command/module_action/modelDelete"); 
                    });
                    
					// console.log("myButton.label",myButton.label);
					on(dom.byId(myButton),"click",function(){
					        _statusModel = true;	
							_statusCamera = false;	
							dom.byId("_showViewbar").style.display = 'none';
							dom.byId("_showModelbar").style.display = 'block';	
							dijit.byId("tabMain").selectChild(dijit.byId("tcpMyScene"));
							// 默认发送的事件						
							topic.publish("toolbar/camera/locked",true);				
								
					});	
					//返回2按钮
					query("#return_btn2").on("mouseover",function(){					   					
						domStyle.set(this,"color","grey");				
					});	
					query("#return_btn2").on("mouseout",function(){					   					
						domStyle.set(this,"color","white");					
					});	
					query("#return_btn2").on("click",function(){	
						//----------------------------------------------					
						window.history.go(-1);		
					});	
				  }		
				},
				//=====================================3=======================================================
			    //this is initToolbar part............
				initToolbar:function(containerID){				   
						var container = dom.byId(containerID);	
						domStyle.set(container,"background","#c5c5c5");
						//初始化锁的状态
						topic.publish("toolbar/camera/locked",false);						
						dijit.Tooltip.defaultPosition=['below','above'];					
						construct.create("div",{
							id:"_showModelbar",
							style:{float:'left',width:"100%",height:"100%",display:"block"}							
						},container);	
						construct.create("div",{
							id:"_showViewbar",
							style:{float:'left',width:"100%",height:"100%",display:"none"}							
						},container);						
						var _showModelbar = dom.byId('_showModelbar');	
						var _showViewbar = dom.byId('_showViewbar');									
				}
			});		
			return retClass;
		});