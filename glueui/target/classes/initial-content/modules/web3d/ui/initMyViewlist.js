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
define("web3d/ui/initMyViewlist",
    ["dojo/topic","dojo/dom","dojo/dom-construct","dijit/Dialog","dijit/form/TextBox","dojo/query","dijit/Tooltip","dijit/form/Textarea","dojo/dom-style","dojo/mouse","dijit/form/Button","dojo/on"],
	function(topic,dom,construct,Dialog,TextBox,query,Tooltip,Textarea,domStyle,mouse,Button,on){
			//测试数据			
			var retClass = dojo.declare("web3d/ui/initMyViewlist",[],{
				constructor:function(containerID){					
					var _dthis = this;
					_dthis.containerID = containerID;
					topic.subscribe("command/viewpoint_action/viewList",function(value){
						_dthis.myView = value;
						_dthis.initMyView(_dthis.containerID,_dthis.myView);					
					});					
				},
				//初始化我的视角
				initMyView:function(containerID,myView){	
					// console.log("myView",myView);
					this._myView = myView;
					var container = dom.byId(containerID);	
					domStyle.set(container,"background","#c2c2c2");
					//定义Dialog
					var myDialog = new Dialog({
						title: "修改",						
						style: "width:300px"
					});	
					//这里标注名字
					var _tagname = construct.create("div", 
					{    id:"_tagname",
						"class": "dijitDialogPaneContentArea",
						style : "height:5px;width:100px;",
						innerHTML:"视角名称："	
					}, myDialog.containerNode);
                    var _viewName = construct.create("div", 
                    {    id:"_viewName",
                        "class": "dijitDialogPaneContentArea",
                        style : "float:left;margin-left:45px",
                        innerHTML:""	
                    }, myDialog.containerNode);
                    
					// 用来容纳textbox的控件
					var renamecontainer = construct.create("div", 
					{    id:"renamecontainer",
						"class": "dijitDialogPaneContentArea"	
					}, myDialog.containerNode);	
					//描述
					var _describe = construct.create("div", 
					{    id:"_describename",
						"class": "dijitDialogPaneContentArea",
						style : "height:5px;width:100px;margin-top:10px",
						innerHTML:"修改描述："	
					}, myDialog.containerNode);
					//容纳textare控件
					var areacontainer = dojo.create("div", 
					{    id:"areacontainer",
						"class": "dijitDialogPaneContentArea",					
					}, myDialog.containerNode);
					
				  var _textarea = new Textarea({
					name: "myarea",
					value: "myarea.",
					style: "width:290px;margin-top:15px;height:200px;"
				}, "areacontainer");
					
					var actionBar = dojo.create("div", {
						"class": "dijitDialogPaneActionBar"
					}, myDialog.containerNode);
					 var _okButton = new Button({
							"label": "Ok",
							id:"_okButton",
							"class":"_ok"
					}).placeAt(actionBar);				
					
					//对Tooltip进行初始化操作
					dijit.Tooltip.defaultPosition=['below','above'];
				    //对背景显示进行记录
					var remmeberViewBg = [] ;
					//遍历数据并且显示在tabContainer当中
					for(var i = 0 ; i < this._myView.length ; i ++){
                            var viewName = this._myView[i].data.name ; 
                            var viewDescript = this._myView[i].data.description ; 
							var _currentBg = dojo.create("div",{
								id :viewName+"_bg",
								style:{float:"left",backgroundImage:"url('image/long_bg2.jpg')",width:"229px",height:"25px",marginTop:"-2px",cursor:"pointer"},
							},container);
							//记录每一个背景					
							//remmeberViewBg.push(viewName+"_bg");
                            //这个事div容器
							var currentBg = dom.byId(_currentBg);
							 construct.create("div",{
								id:viewName+"_sc",
                                "class" : viewName,
								style:{float:"left",marginLeft:"4px",marginTop:"5px",width:"25%",color:"green",cursor:"pointer"},
								innerHTML:viewName,
                                title : viewDescript
							},currentBg);							
							construct.create("div",{
								id:i,								
								"class":viewName,	
								style:{float:"left",marginLeft:"20px",marginTop:"5px",color:"blue",cursor:"pointer"},
								onmouseover:function(){
									this.style.color = "red";
								},
								onmouseout:function(){
									this.style.color = "blue";
								},
								innerHTML:"编辑"
							},currentBg);
							var _delete = construct.create("div",{
								id:viewName+"_delete",
								style:{float:"left",marginLeft:"20px",marginTop:"5px",color:"blue",cursor:"pointer"},	
								"class":viewName,
								onmouseover:function(){
									this.style.color = "red";
								},
								onmouseout:function(){
									this.style.color = "blue";
								},	
								innerHTML:"删除"
							},currentBg);
							
                            // 选中事件
							query("#"+viewName+"_sc").on("click",function(){
							     topic.publish("command/viewpoint_action/selectViewFromScene",
                                    this.className) ;			
							});	
                            //  删除事件
                            query("#"+viewName+"_delete").on("click",function(){
								dojo.destroy(dom.byId(this.className+"_bg"));
								topic.publish("command/viewpoint_action/deleteView",this.className);
                            });	
							
                            // 点击编辑
                            query("#"+i).on("click",function(){	
                                _textarea.setValue(dom.byId(this.className+"_sc").title) ;	
								_okButton.setAttribute("id","_ok"+this.className);
							    _okButton.setAttribute("className",this.className);
                                _viewName.innerHTML = this.className ;
								myDialog.show();
							});		
														
						}	

                        // 重命名是点击ok
						query("#"+_okButton.id).on("click",function(){
                            var reText = _textarea.getValue() ;	
                            dom.byId(this.className+"_sc").title = reText;	
                            myDialog.hide();  
                            topic.publish("command/viewpoint_action/modifyView",this.className,reText);
						});
                        
                        
                        
						//下面是添加我的视角的操作
						topic.subscribe('command/viewpoint_action/addResult', function(val){						
							//创建背景		
                            var viewName = val.name ;
                            var viewDes = val.description ;
							var _currentBg = dojo.create("div",{
								id :viewName+"_bg",
								style:{float:"left",backgroundImage:"url('image/long_bg2.jpg')",width:"229px",height:"25px",marginTop:"-2px",cursor:"pointer"},
							},container);
							remmeberViewBg.push(val["DEF"]+"_bg");
							var currentBg = dom.byId(_currentBg);
							//显示viewName	
							 construct.create("div",{
								id:viewName+"_sc",
								style:{float:"left",marginLeft:"4px",marginTop:"5px",width:"25%",color:"green",cursor:"pointer"},
								innerHTML:viewName,
								title:viewDes
							},currentBg);		
							//编辑	
							construct.create("div",{
								id:viewName,								
								"class":viewName,	
								style:{float:"left",marginLeft:"20px",marginTop:"5px",color:"blue",cursor:"pointer"},
								onmouseover:function(){
									this.style.color = "red";
								},
								onmouseout:function(){
									this.style.color = "blue";
								},
								innerHTML:"编辑"
							},currentBg);
							//删除
							var _delete = construct.create("div",{
								id:viewName+"_delete",
								style:{float:"left",marginLeft:"20px",marginTop:"5px",color:"blue",cursor:"pointer"},	
								"class":viewName,
								onmouseover:function(){
									this.style.color = "red";
								},
								onmouseout:function(){
									this.style.color = "blue";
								},	
								innerHTML:"删除"
							},currentBg);
														
							// 删除事件
							query("#"+viewName+"_delete").on("click",function(){
                                dojo.destroy(dom.byId(this.className+"_bg"));
								topic.publish("command/viewpoint_action/deleteView",this.className) ;
                            });	
                            // 选中事件
							query("#"+viewName+"_sc").on("click",function(){
								topic.publish("command/viewpoint_action/selectViewFromScene",viewName);
                            });	
                            
                            
							// 修改的事件
							query("#"+viewName).on("click",function(){
                                _textarea.setValue(dom.byId(this.className+"_sc").title) ;	
								_okButton.setAttribute("id","_ok"+this.className);
							    _okButton.setAttribute("className",this.className);
                                _viewName.innerHTML = this.className ;
								myDialog.show();																
							});	
							 // topic.subscribe("view/modifyView", function(viewpoint){
								// val["viewName"] = viewpoint["viewName"];
								// val["description"] = viewpoint["description"];							
							 // });
	
						
						}); 	
				}
			});		
			return retClass;
		});