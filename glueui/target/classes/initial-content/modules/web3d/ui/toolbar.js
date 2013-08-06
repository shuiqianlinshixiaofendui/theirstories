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

// 该类负责工具栏初始化和修正

define("web3d/ui/toolbar",["dojo/topic","dojo/query","dojo/on","dijit/Dialog","dijit/form/Button","dijit/form/ValidationTextBox","dojo/dom-construct"],function(topic,query,on,Dialog,Button,ValidationTextBox,domConstruct){
		return dojo.declare([],{
			// 构造函数
			constructor : function(layoutRoot){
				
			    (function(){
					if(Sling.getSessionInfo()["userID"]!="anonymous")
						initTool();
						//alert("模型锁定");
						console.log("模型锁定");
						topic.publish("global/model/lock");
						
						//alert("摄像机解锁");
						console.log("摄像机解锁");
						topic.publish("global/camera/unlock");
						
						
				})();
				
				// 登陆成功初始化工具栏
				//topic.subscribe("user/login/success",function(){
				//	initTool();
				//});
				
				function initTool(){
					var toolbar_str = "<div id=\"toolbar\">"+		
											"<div id=\"l_menu_sub_1\">"+
												"<span class=\"btns\">模型操作：</span>"+
											    "<div class=\"btns\">"+
													"<input type=\"image\" id=\"lock\" state=\"lock\" class=\"someClass\" style=\"border-color:#bababa;\" title=\"模型锁定\" src=\"image/locked.png\" />"+
												"</div>"+
												"<div class=\"btns\">"+
													"<input type=\"image\" id=\"select\" class=\"someClass\" title=\"选择\" src=\"image/select.png\" style=\"border-color:#bababa;\" />"+
												"</div>"+
												"<div class=\"btns\">"+
													"<select id=\"selectedMode\">"+
														"<option value=1 >自由模式</option>"+
														"<option value=2 >坐标模式</option>"+						
													"</select>"+ 	
												"</div>"+
												"<div class=\"btns\">"+
													"<input type=\"image\" id=\"pingyi\" class=\"someClass\" title=\"平移\" src=\"image/pingyi.png\" />"+
												"</div>"+
												"<div class=\"btns\">"+
													"<input type=\"image\" id=\"xuanzhuang\" class=\"someClass\" title=\"旋转\" src=\"image/xuanzhuang.png\" />"+
												"</div>"+
												"<div class=\"btns\">"+
												"<input type=\"image\" id=\"suofang\" class=\"someClass\" title=\"缩放\" src=\"image/suofang.png\" />"+
												"</div>"+
												"<div class=\"btns\">"+
													"<input type=\"image\" id=\"clear\" class=\"someClass\" title=\"删除\" src=\"image/clear.png\" />"+
												"</div>"+
												
												"<div class=\"linebg\"></div>"+
												
											"</div>"+
											//摄像机模式
											"<div id=\"l_menu_sub_alone_1\">"+
												"<select id=\"selectedcamera\">"+
												"<option value=1 >检查</option>"+
												"<option value=2 >飞行</option>"+
												"<option value=3 >游戏</option>"+
												"<option value=4 >直升机</option>"+
												"<option value=5 >查看</option>"+
												"</select>"+ 
											"</div>"+
											"<div class=\"linebg\"></div>"+	
											//摄像机的锁定
											"<div class=\"btns\">"+
												"<input type=\"image\" id=\"cameralock\" state=\"unlock\" class=\"someClass\"  title=\"摄像机锁定\" src=\"image/lock.png\" />"+
											"</div>"+
											//front, back, left, right, up/above below
											//前方，后方，左方，右方，上方，下方
											"<div id=\"l_menu_sub_alone_2\">"+
												"<select id=\"selectedview\">"+
												"<option value=1 >自由视角</option>"+
												"<option value=2 >后视图</option>"+
												"<option value=3 >左视图</option>"+
												"<option value=4 >右视图</option>"+
												"<option value=5 >顶视图</option>"+
												"<option value=6 >底视图</option>"+
												"<option value=7>前视图</option>"+
												"</select>" +
											"</div>"+											
										    //摄像机的旋转平移远近
											"<div class=\"btns\">"+
												"<input type=\"image\" id=\"camerarotate\" class=\"someClass\" title=\"摄像机旋转\" src=\"image/xuanzhuang.png\" />"+
											"</div>"+
											"<div class=\"btns\">"+
												"<input type=\"image\" id=\"cameratranslation\" class=\"someClass\" title=\"摄像机平移\" src=\"image/pingyi.png\" />"+
											"</div>"+
											"<div class=\"btns\">"+
												"<input type=\"image\" id=\"camerafarnear\" class=\"someClass\" title=\"摄像机远近\" src=\"image/suofang.png\" style=\"border-color:#bababa;\" />"+
											"</div>"+
											//删除按钮，开始隐藏，选中模型后出现
											"<div id=\"l_menu_sub_alone_3\" class=\"btns\">"+
												"<input type=\"image\" id=\"addview\" class=\"someClass\" title=\"添加视角\" src=\"image/clear.png\" />"+
											"</div>"+
			
										"</div>";
					//alert("toolbar_str");
					$("#layout_head").append(toolbar_str);
					
					$(".someClass").tipTip({maxWidth: "auto", edgeOffset: 0});
					
					var statu = 0;
					
					//设置颜色
					var setColor = function(name){
						$(name).attr("style", "border-color:#f5f5f5;");
					}
					
					$("#back,#next").mouseover(function(){
						$(this).attr("style", "border-color:#bababa;");
					}).mouseout(function(){
						setColor($(this));
					});
					
					$("#select,#pingyi,#xuanzhuang,#suofang,#clear").mouseover(function(){
						$(this).attr("style", "border-color:#bababa;");
					}).mouseout(function(){
						switch(statu){
							case 1:{
								setColor($("#l_menu_sub_1 input").not("#pingyi"));
							break;
							}
							case 2:{
								setColor($("#l_menu_sub_1 input").not("#xuanzhuang"));
							break;
							}
							case 3:{
								setColor($("#l_menu_sub_1 input").not("#suofang"));
							break;
							}
							case 4:{
								setColor($("#l_menu_sub_1 input").not("#clear"));
							break;
							}
							default:{
								setColor($("#l_menu_sub_1 input").not("#select"));
							}
						}
					});
					$("#select").click(function(){
						if(statu == 1){
							$("#pingyi").attr("src","image/pingyi.png");
							setColor($("#pingyi"));
						}else if(statu == 2){
							$("#xuanzhuang").attr("src","image/xuanzhuang.png");
							setColor($("#xuanzhuang"));
						}else if(statu == 3){
							$("#suofang").attr("src", "image/suofang.png");
							setColor($("#suofang"));
						}else if(statu == 4){
							$("#clear").attr("src", "image/clear.png");
							setColor($("#clear"));
						}
						statu = 0;
						$(this).attr("src","image/selected.png");
						//alert("选择");
						topic.publish("toolbar/select");
					});
					$("#pingyi").click(function(){
						if(statu == 0){
							$("#select").attr("src","image/select.png");
							setColor($("#select"));
						}else if(statu == 2){
							$("#xuanzhuang").attr("src","image/xuanzhuang.png");
							setColor($("#xuanzhuang"));
						}else if(statu == 3){
							$("#suofang").attr("src", "image/suofang.png");
							setColor($("#suofang"));
						}else if(statu == 4){
							$("#clear").attr("src", "image/clear.png");
							setColor($("#clear"));
						}
						statu = 1;
						$(this).attr("src","image/pingyied.png");
						//alert("平移");
						topic.publish("toolbar/translation");
					});
					$("#xuanzhuang").click(function(){
						if(statu == 0){
							$("#select").attr("src","image/select.png");
							setColor($("#select"));
						}else if(statu == 1){
							$("#pingyi").attr("src","image/pingyi.png");
							setColor($("#pingyi"));
						}else if(statu == 3){
							$("#suofang").attr("src", "image/suofang.png");
							setColor($("#suofang"));
						}else if(statu == 4){
							$("#clear").attr("src", "image/clear.png");
							setColor($("#clear"));
						}
						statu = 2;
						$(this).attr("src", "image/xuanzhuanged.png;");
						//alert("旋转");
						topic.publish("toolbar/rotate");
					});
					$("#suofang").click(function(){
						if(statu == 0){
							$("#select").attr("src","image/select.png");
							setColor($("#select"));
						}else if(statu == 1){
							$("#pingyi").attr("src","image/pingyi.png");
							setColor($("#pingyi"));
						}else if(statu == 2){
							$("#xuanzhuang").attr("src","image/xuanzhuang.png");
							setColor($("#xuanzhuang"));
						}else if(statu == 4){
							$("#clear").attr("src", "image/clear.png");
							setColor($("#clear"));
						}
						statu = 3;
						$(this).attr("src", "image/suofanged.png;");
						//alert("缩放");
						topic.publish("toolbar/scale");
					});
					$("#clear").click(function(){
						if(statu == 0){
							$("#select").attr("src","image/select.png");
							setColor($("#select"));
						}else if(statu == 1){
							$("#pingyi").attr("src","image/pingyi.png");
							setColor($("#pingyi"));
						}else if(statu == 2){
							$("#xuanzhuang").attr("src","image/xuanzhuang.png");
							setColor($("#xuanzhuang"));
						}else if(statu == 3){
							$("#suofang").attr("src", "image/suofang.png");
							setColor($("#suofang"));
						}
						statu = 4;
						$(this).attr("src", "image/cleared.png;");
						//alert("删除");
						topic.publish("toolbar/delete");
					});
					$("#render").click(function(){
						//alert("渲染");
					});
					$("#back").click(function(){
						//alert("撤销");
						topic.publish("toolbar/backout");
					});
					$("#next").click(function(){
						//alert("恢复");
						topic.publish("toolbar/recover");
					});
					
					var cstatu = 0;
					
					$("#camerarotate,#camerafarnear,#cameratranslation").mouseover(function(){
						$(this).attr("style", "border-color:#bababa;");
					}).mouseout(function(){
						switch(cstatu){
						    case 0:{
								setColor($("#l_menu_sub_1 input").not("#camerarotate"));
							break;
							}
							case 1:{
								setColor($("#l_menu_sub_1 input").not("#cameratranslation"));
							break;
							}
							case 2:{
								setColor($("#l_menu_sub_1 input").not("#camerafarnear"));
							break;
							}
						}
					});
					
					
					//摄像机的旋转平移远近
					$("#camerarotate").click(function(){
						if(cstatu == 1){
							$("#cameratranslation").attr("src","image/pingyi.png");
							setColor($("#cameratranslation"));
						}else if(cstatu == 2){
							$("#camerafarnear").attr("src","image/suofang.png");
							setColor($("#camerafarnear"));
						}
						cstatu = 0;
						$(this).attr("src","image/xuanzhuanged.png");
						//alert("摄像机的旋转");
						topic.publish("camera/rotate");
						console.log("摄像机的旋转");
					});
					$("#cameratranslation").click(function(){
						if(cstatu == 0){
							$("#camerarotate").attr("src","image/xuanzhuang.png");
							setColor($("#camerarotate"));
						}else if(cstatu == 2){
							$("#camerafarnear").attr("src","image/suofang.png");
							setColor($("#camerafarnear"));
						}
						cstatu = 1;
						$(this).attr("src","image/pingyied.png");
						//alert("摄像机的平移");
						topic.publish("camera/translation");
						console.log("摄像机的平移");
					});
					$("#camerafarnear").click(function(){
						if(cstatu == 0){
							$("#camerarotate").attr("src","image/xuanzhuang.png");
							setColor($("#camerarotate"));
						}else if(cstatu == 1){
							$("#cameratranslation").attr("src","image/pingyi.png");
							setColor($("#cameratranslation"));
						}
						cstatu = 2;
						$(this).attr("src","image/suofanged.png");
						//alert("摄像机的远近");
						topic.publish("camera/farnear");
						console.log("摄像机的远近");
					});
					
					
					
					//弹出对话框，添加视角
					var addview_Dialog;
					if(!addview_Dialog){
						var addview_Dialog = new Dialog({
							id:"addview_Dilog",
							title: "添加视角",
							style: "width:600px;height:100px;background:#fff;display:none",
							content: "<div id=\"addview_content\" class=\"dijitDialogPaneContentArea\">"+"<label for=\"viewport\">视角名称</label>"+"<input id=\"viewportname\" promptMessage=\"请输入视角名称!\" dojoType=\"dijit.form.ValidationTextBox\" trim=\"true\"/>"+"</div>"+
							"<div id=\"addview_action\" class=\"dijitDialogPaneActionBar\" style=\"width:600px;\"></div>"
						
						});
					}
					var sure = new Button({
						id:"addview",
						type:"button",
						label:"确定",
						onClick:function(){
						    //publish视角的事件
							var viewportname=dijit.byId("viewportname").attr("value");
							topic.publish("view/add",viewportname);
							console.log(viewportname);
							dijit.byId("addview_Dilog").hide();
						}
						
					});
					var cancel = new Button({
						id:"cancelSort",
						type:"button",
						label:"取消",
						onClick:function(){
							dijit.byId("addview_Dilog").hide();
						}
						
					});
					
					sure.placeAt("addview_action","last");
					cancel.placeAt("addview_action","last");
					$("#addview").click(function(){
						//alert("添加视角");
						dijit.byId("addview_Dilog").show();
						
					});
					
					//默认平移为选中状态
					$("#select").trigger("click");
					
					
					//模型的锁定
					$("#lock").click(function(){
						var state = $("#lock").attr("state");
						if(state=="lock"){
							//alert("模型解锁");
							console.log("模型解锁");
							topic.publish("global/model/lock");
							$(this).attr("state","unlock");
							setColor($(this));
							$(this).attr("src", "image/locked.png;");
							//alert("摄像机锁定");
							console.log("摄像机锁定");
							topic.publish("global/camera/lock");
							$("#cameralock").attr("state","lock");
							$("#cameralock").attr("style", "border-color:#bababa;");
							$("#cameralock").attr("src", "image/locked.png;");
							
						}else if(state=="unlock"){
							//alert("模型锁定");
							console.log("模型锁定");
							topic.publish("global/model/lock");
							$(this).attr("state","lock");
							$(this).attr("style", "border-color:#bababa;");
							$(this).attr("src", "image/locked.png;");
							//alert("摄像机解锁");
							console.log("摄像机解锁");
							topic.publish("global/camera/unlock");
							$("#cameralock").attr("state","unlock");
							setColor($("#cameralock"));
							$("#cameralock").attr("src", "image/lock.png;");
						}
						
					});
							
					$("#lock").mouseover(function(){
						$(this).attr("style", "border-color:#bababa;");
					}).mouseout(function(){
						var state = $("#lock").attr("state");
					    if(state=="unlock"){
							setColor($(this));
						}
						
					});
					
					//摄像机的锁定
					$("#cameralock").click(function(){
						var state = $("#cameralock").attr("state");
						if(state=="lock"){
							//alert("摄像机解锁");
							console.log("摄像机解锁");
							topic.publish("global/camera/unlock");
							$(this).attr("state","unlock");
							setColor($(this));
							$(this).attr("src", "image/lock.png;");
							//alert("模型锁定");
							console.log("模型锁定");
							topic.publish("global/model/lock");
							$("#lock").attr("state","lock");
							$("#lock").attr("style", "border-color:#bababa;");
							$("#lock").attr("src", "image/locked.png;");
							
						}else if(state=="unlock"){
							//alert("摄像机锁定");
							console.log("摄像机锁定");
							topic.publish("global/camera/lock");
							$(this).attr("state","lock");
							$(this).attr("style", "border-color:#bababa;");
							$(this).attr("src", "image/locked.png;");
							//alert("模型解锁");
							console.log("模型解锁");
							topic.publish("global/model/unlock");
							$("#lock").attr("state","unlock");
							setColor($("#lock"));
							$("#lock").attr("src", "image/lock.png;");
						}
						
					});
							
					$("#cameralock").mouseover(function(){
						$(this).attr("style", "border-color:#bababa;");
					}).mouseout(function(){
						var state = $("#cameralock").attr("state");
					    if(state=="unlock"){
							setColor($(this));
						}
						
					});
					
					//以下拉列表形式的摄像机模式的转换
					$("#selectedcamera").change(function(){
						var _val=$(this).val();
						//alert(sle); //摄像机模式状态
						topic.publish('selected/model', _val);
					});
					//模式选择
					$("#selectedMode").change(function(){
						var _val=$(this).val();						
						//alert(sle); //摄像机模式状态
						topic.publish('selected/mode', _val);
					});
					//以下拉列表形式的图像视角转换
					$("#selectedview").change(function(){
						var sle=$(this).val();
						//alert(sle);//摄像机视角状态
						topic.publish('camera/locateTo', sle);
					});
					
				}
				
				//显示×按钮
				topic.subscribe("delete/block",function(){
					$("#delete").attr("style", "display:block;");
				});
				//隐藏×按钮
				topic.subscribe("delete/none",function(){
					$("#delete").attr("style", "display:none;");
				});
				//用户登出
				topic.subscribe("user/logouted",function(){
					if(dojo.byId("toolbar"))
						dojo.destroy("toolbar");
				});
				
			}
			
		});
	}
);

