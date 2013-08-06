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

define("web3d/action/view",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
                var all_viewpoint = x3d.getElementsByTagName("Viewpoint") ;		//从x3d中读取全部的viewpoint
				var allview = {} ;
                if(all_viewpoint.lenght != 0){
					for(var i = 0 ; i < all_viewpoint.length ; i ++){
					/*
					{
	                0 : {
	                        DEF : "viewpoint_a",
	                        viewName : "_a",
							description : "description" 
	                },
	                1 : {
	                        DEF : "viewpoint_b",
	                        viewName: "_b",
							description : "description" 
	                }
					}
					*/
					
						allview[i]={"DEF":all_viewpoint[i].getAttribute("DEF"),"viewName":all_viewpoint[i].getAttribute("viewName"),"description" : all_viewpoint[i].getAttribute("description")};
						
					}
					topic.publish("view/allview",allview) ;			// 发布全部的view
				}
				
				// view/add : 添加我的视角
				// name : 视角的名称
				// description : 视角的描述
				topic.subscribe("view/add", function(name,description){
                    var parent = document.getElementById("_sp_scene1") ;
                    var baseURI = parent.getAttribute("baseURI");
                    if(!baseURI || baseURI.length == 0) {// 出错就不执行                    
                        return;
                    } 
                    // 对视角名称做处理
					var encodeName = Spolo.encodeUname(name) ;		// 处理中文
					var viewDef = "viewpoint" + encodeName;
					for(var i = 0 ; i < all_viewpoint.length ; i ++){
						if(viewDef == all_viewpoint[i].getAttribute("DEF") ){
							var message = "视角名称已存在" ; 
							topic.publish("view/add/error",message) ;		// 添加出错
							return ;
						}
					}
                    
                     // 获取当前viewpoint的信息
					var viewarea = Spolo.viewarea;
					var C_CenterOfRotation = viewarea._pick         
                    var mat_view  = viewarea.getViewMatrix() ;
					var e_viewpoint = viewarea._scene.getViewpoint();
					var e_viewtrafo = e_viewpoint.getTransformation();
					e_viewtrafo = e_viewtrafo.inverse().mult(mat_view);
					var e_mat = e_viewtrafo.inverse();
					var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
					rotation.setValue(e_mat);
					var translation = e_mat.e3();
					var rot = rotation.toAxisAngle();
			
                    // 设置viewpoint信息
                    var view = document.createElement('Viewpoint');
					var view_def = "viewpoint" + encodeName ;
					view.setAttribute("DEF",view_def) ;
                    view.setAttribute("position", translation.x.toFixed(5)+ " " + translation.y.toFixed(5) + " " +  translation.z.toFixed(5) );         
                    view.setAttribute("centerOfRotation",C_CenterOfRotation.x + " " + C_CenterOfRotation.y + " " + C_CenterOfRotation.z ) ;     
                    view.setAttribute("orientation",rot[0].x.toFixed(5) + " " + rot[0].y.toFixed(5) + " " + rot[0].z.toFixed(5) + " " + rot[1].toFixed(5) ) ;  
                    view.setAttribute("description",description)  ; 
                    view.setAttribute("viewName",name)  ; 
                    var viewBaseURI = baseURI + "/tddata/" + view_def;
                    view.setAttribute("baseURI",viewBaseURI) ;
					view.bind = false ;
					//view.setAttribute("set_bind",false) ;
                    view.isnew = true ;
                    
                    // 如果没有异常,保存到jcr中，并向2d发消息
                    try{
                        parent.appendChild(view) ;
						var viewpoint = {"DEF":view_def ,"viewName":name , "description" : description } ;	
                        topic.publish('view/addView', viewpoint); 	// 发布添加视角
                    }catch(e){
                        console.log("view error") ;
                    }  
                   
				});
				
                // view/selected : 选中我的视角
				// def : 选中视角的def
				topic.subscribe("view/selected", function(def){
					if(all_viewpoint.lenght != 0){
						for(var i = 0 ; i < all_viewpoint.length ; i ++){
							var viewDef = all_viewpoint[i].getAttribute("DEF") ;
							if(viewDef == def ){   
								all_viewpoint[i].bind=true ;
							}
						}
					}
				});
                
                // view/delete : 删除我的视角
				// def : 选中视角的def
				topic.subscribe("view/delete", function(def){
					var parent = document.getElementById("_sp_scene1") ;
					var baseURI = parent.getAttribute("baseURI");
					if(!baseURI || baseURI.length == 0) {// 出错就不执行                    
						return;
					} 
				
					if(all_viewpoint.lenght != 0){
						for(var i = 0 ; i < all_viewpoint.length ; i ++){
							var viewDef = all_viewpoint[i].getAttribute("DEF") ;
							if(viewDef == def ){
								parent.removeChild(all_viewpoint[i]) ; // 此处不设置返回值，直接删除。
							}	
						}
					}
				});
                
				
                // view/modify : 修改我的视角
				// def ： 选中的视角的def
				// rename : 修改的名称
				// description : 修改的描述
				topic.subscribe("view/modify", function(def,rename,description){
					var encodeName = Spolo.encodeUname(rename) ;
					var viewDef = "viewpoint" + encodeName;
					for(var i = 0 ; i < all_viewpoint.length ; i ++){
						if(viewDef == all_viewpoint[i].getAttribute("DEF") ){
							var message = "视角名称已存在" ; 
							topic.publish("view/modify/error",message) ;		// 修改出错
							return ;
						}
					}
					  
					if(all_viewpoint.lenght != 0){
						for(var i = 0 ; i < all_viewpoint.length ; i ++){
							var viewDef = all_viewpoint[i].getAttribute("DEF") ;
							if(viewDef == def ){
								all_viewpoint[i].description = description ;
								all_viewpoint[i]._x3domNode._xmlNode.setAttribute("viewName",rename) ; // 只能这样修改
							}
						}
					}
					 var viewpoint = {"DEF":"viewpoint" + encodeName ,
						"viewName":rename , "description" : description } ;	
                     topic.publish('view/modifyView', viewpoint);			// 发布修改的view
				}); 
				
			}
		});
	}
);





