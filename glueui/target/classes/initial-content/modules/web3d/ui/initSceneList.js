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
define("web3d/ui/initSceneList",
    ["dojo/dom","dojo/topic","dojo/query","dojo/on","dijit/Tooltip","dijit/TooltipDialog","dijit/popup","dojo/mouse","dojo/dom-construct","dojo/dom-style"],
	function(dom,topic,query,on,Tooltip, TooltipDialog, popup,mouse,construct,domStyle){			
		// 创建资源类管理对象实例，按照顺序加载资源。	
        
        var allModelList ;
        
		var retClass = dojo.declare('web3d/ui/initSceneList',[],{
			constructor : function(containerID){
				var _this = this;
				_this.containerID = containerID;
				topic.subscribe("command/module_action/modelList",function(value){	
                         allModelList = value ;
                          dom.byId(_this.containerID).innerHTML="";		      					
						 _this._sceneList = value;
						 _this.initList(_this.containerID);				
					});	               
			},			
			initList:function(containerID){			
					var container = dojo.byId(containerID);		
					domStyle.set(container,"background","#c2c2c2");	
					var myTooltipDialog;					
					var count = 0,tooltipContent="", isCreated=false;					
					dijit.Tooltip.defaultPosition=['below','above'];
					var remmeberBg = [];
					for(var i in this._sceneList){	
							//记录显示与绑定的状态
							var _imgEye_src = this._sceneList[i]["modelRender"]=="true"?"image/bg_.jpg":"image/eye_1.png";
							var _imgLock_src = this._sceneList[i]["modelLocked"]=="true"?"image/lock_1.png":"image/bg_.jpg";
							var _divBg = dojo.create("div",{
								id: this._sceneList[i]["DEF"]+"_bg",
								style:{float:"left",backgroundImage:"url('image/long_bg.jpg')",width:"229px",marginTop:"-2px"},							
								className:"sceneItem"
							},container);
							remmeberBg.push(this._sceneList[i]["DEF"]+"_bg");
							var _itemBg = dojo.byId(_divBg);					
							var _imgEye = construct.create("img",{
								id: this._sceneList[i]["DEF"]+"_eye",
								style:{float:"left",marginLeft:"3px",marginTop:"2px",cursor:"pointer"},
								src:_imgEye_src,
								alt:this._sceneList[i]["DEF"],								
								className:"sceneItem"
							},_itemBg);												
							var _imgLock = construct.create("img",{
								id: this._sceneList[i]["DEF"]+"_lock",
								style:{float:"left",marginLeft:"1px",marginTop:"2px",cursor:"pointer"},
								src:_imgLock_src,
								alt:this._sceneList[i]["DEF"],								
								className:"sceneItem"
							},_itemBg);						
							construct.create("img",{
								id: this._sceneList[i]["DEF"]+"_bitmap",
								style:{float:"left",marginLeft:"5px",width:"25px",height:"25px"},
								// 暂时除了modelName之外，其他的值都获取不到，所以这里先注释掉了显示图片的src，保证项目不产生bug
							//	src:this._sceneList[i]["modelImg"],
								className:"sceneItem"
							},_itemBg);

							var _idr = construct.create("span",{
								id: this._sceneList[i]["DEF"]+"_text",
								style:{float:"left",marginLeft:"20px",marginTop:"5px",cursor:"pointer"},
								innerHTML:this._sceneList[i]["modelName"],
								className:this._sceneList[i]["DEF"]
							},_itemBg);	
					
						on(dom.byId(_imgEye),"click",function(){						
							if(this.src.indexOf('image/eye_1.png')!= -1){
								this.src = "image/bg_.jpg";	
								 for(var i=0;i<remmeberBg.length;i++){
									dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								 }
							}else{								
								this.src = "image/eye_1.png";
								 for(var i=0;i<remmeberBg.length;i++){								
								   if(this.alt+"_bg" == remmeberBg[i]){
										dom.byId(this.alt+"_bg").style.backgroundImage="url('image/long_bg_hight.jpg')";
								   }else{									
										dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								   }
								 }
							}	
							topic.publish("command/module_action/modelHiden",this.alt);	
						});
						on(dom.byId(_imgLock),"click",function(){						
						if(this.src.indexOf('image/bg_.jpg')!= -1){
								this.src = "image/lock_1.png";
								 for(var i=0;i<remmeberBg.length;i++){
									dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								 }
							}else{								
								this.src = "image/bg_.jpg";
								 for(var i=0;i<remmeberBg.length;i++){								
								   if(this.alt+"_bg" == remmeberBg[i]){
										dom.byId(this.alt+"_bg").style.backgroundImage="url('image/long_bg_hight.jpg')";
								   }else{									
										dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								   }
								 }
							}	
							topic.publish("modelLocked/locked",this.alt);	
						});
					    on(dom.byId(_idr.id),mouse.enter,function(){	
						    if(this.style.color == "red"){
								return ;
							}
							domStyle.set(this,"color","#990000");
						});	
						on(dom.byId(_idr.id),mouse.leave,function(){
						     if(this.style.color == "red"){
								return ;
							} 
							domStyle.set(this,"color","black");
						});	
						on(dom.byId(_idr.id),"click",function(){
                            for(var i in allModelList){
                                var myNode = dom.byId(allModelList[i].DEF + "_text") ;
                                var color = domStyle.get(myNode,"color") ;
                                if(color == "rgb(255, 0, 0)"){
                                    domStyle.set(myNode,"color","black");
                                }
                            }
                            
							if(this.style.color == "red"){
								domStyle.set(this,"color","black");
								 // for(var i=0;i<remmeberBg.length;i++){
									// dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								 // }
							}else{ 
								domStyle.set(this,"color","red");
								 // for(var i=0;i<remmeberBg.length;i++){								
								   // if(this.className+"_bg" == remmeberBg[i]){
										// dom.byId(this.className+"_bg").style.backgroundImage="url('image/long_bg_hight.jpg')";
								   // }else{									
										// dom.byId( remmeberBg[i]).style.backgroundImage="url('image/long_bg.jpg')";
								   // }
								 // }
							}
							topic.publish("command/module_action/modelHighLight",this.className);
						});	
						
					}

                    topic.subscribe('command/module_action/modelLight', function(val){
                        for(var i in allModelList){
                            var myNode = dom.byId(allModelList[i].DEF + "_text") ;
                            var color = domStyle.get(myNode,"color") ;
                            if(color == "rgb(255, 0, 0)"){
                                domStyle.set(myNode,"color","black");
                            }
                            if(allModelList[i].DEF == val){
                             
                                domStyle.set(myNode,"color","red");
                            }
                        }
                    }) ;
				
			}		
					
		});
		/**
		* 返回当前dojo.declare
		*/
		return retClass; // 返回对象
	});