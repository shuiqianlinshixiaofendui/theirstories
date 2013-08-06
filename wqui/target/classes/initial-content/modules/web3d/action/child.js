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

//@TODO: 依赖关系如何自动抉择？
//child可以依赖select以便当未指定parent时，自动作为parent处理。也可以不依赖select,交由调用者来指定parent.

define("web3d/action/child",["dojo/topic"],function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
				//缓冲select对象。
				//@FIXME: select对象是不需要的。
				//var select = x3d._sp_actions["select"];
				
				var startDate = new Date('1/1/2012');
				
				var id_suffix = 0;
				
				//删除Transform下的所有节点
				var deletemodel = function(ot){
					
					for (var i = 0; i < ot.childNodes.length; i++) {
						
						if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) {
						
							ot.removeChild(ot.childNodes[i]);
							
							break;
						}
					}
					
					return false;	
				}
				
				//tree/append将url指定的当作一个外部资源引入到场景中。parent参数如果为空，自动添加到根节点下。
				topic.subscribe("tree/append", function(url,parent)
				{
				
					x = Math.random() * 6 - 3;
					y = Math.random() * 6 - 3;
					z = Math.random() * 6 - 3;
					
					//s0 = Math.random() + 0.5;
					//s1 = Math.random() + 0.5;
					//s2 = Math.random() + 0.5;
		
					if(parent == "undefined")
					{
						parent = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
					}
					var p_baseURI = parent.getAttribute("baseURI");
					if(!p_baseURI || p_baseURI.length == 0)
					{//@TODO: 试图加入到没有baseURI的节点下。这是异常情况。
						topic.publish("child/parenterror");
						return;
					}

					
					var t = document.createElement('Transform');
					t.setAttribute("translation", x + " " + y + " " + z );
					t.setAttribute("scale", 1 + " " + 1 + " " + 1 );
					t.isnew = true;

					//@FIXME: how to create the name of node? 
					//uname_date. ? 是否需要加入用户名？					
					//为Transform设置id及baseURI.
					var dt = Date.now() - startDate;
					t.id = "uname" + dt-- + "_" + id_suffix.toString();
					id_suffix++;
					p_baseURI = p_baseURI + "/" + t.id;
					t.setAttribute("baseURI",p_baseURI);

					//为Inline设置id及baseURI.
					var i = document.createElement('Inline');
					i.setAttribute("url",url);
					i.id = "uname" + dt  + "_" + id_suffix.toString();
					id_suffix++;
					p_baseURI = p_baseURI + "/" + i.id;
					i.setAttribute("baseURI",p_baseURI);
					i.isnew = true;

					parent.appendChild(t);
					t.appendChild(i);
				});
				
				// 删除模型的操作
				topic.subscribe("tree/remove", function(node, parent)
				{	
					//alert(node+"    "+parent);
					if(parent == undefined)
					{
						parent = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;
					}
					
					if(node && node._xmlNode){
						// parent.removeChild(parent.childNodes[0]);
						parent.removeChild(node._xmlNode);
						
					}
					
				});
				
				//辅助坐标轴响应事件
				topic.subscribe("assAxis/answer",function(x,y,buttonState){
				
					//the point where the mouse hit the obj
					dragObj.pickpos = x3dom.fields.SFVec3f.copy(viewarea._pickingInfo.pickPos);
						
					//the offset from the hit point to the centre of the mesh
					dragObj.offset = trans._vf.translation.subtract(dragObj.pickpos);
					
					var pos = dragObj.pickpos;
					var _intersect_pos_inCC = viewarea.projectVector( pos );
					
					if(Transform.selectedObj.id==coord0){ //click on is the X axis
						//model only on X-axis moves
						var _Mouse3D = new x3dom.fields.SFVec3f( (x / viewarea._width) * 2 - 1);
					}else if(Transform.selectedObj.id==coord1){ //click on is the Y axis
						//model only on Y-axis moves
						var _Mouse3D = new x3dom.fields.SFVec3f( -(y / viewarea._width) * 2 + 1);
					}else if(Transform.selectedObj.id==coord2){ //click on is the Z axis
						//model only on Z-axis moves
						var _Mouse3D = new x3dom.fields.SFVec3f( _intersect_pos_inCC.z);
					}else {
						var _Mouse3D = new x3dom.fields.SFVec3f( (x / viewarea._width) * 2 - 1,
																	 -(y / viewarea._width) * 2 + 1,
																	  _intersect_pos_inCC.z);
					}
					//先把坐标系换算为世界坐标系。
					var pos_WC = viewarea.unprojectVector(_Mouse3D); 
					//记录下鼠标当前三维空间点的z点
					var tem = x3dom.fields.SFVec3f.copy(pos_WC);
					//减去模型中心点和鼠标点击位置的偏差
					pos_WC = pos_WC.add(dragObj.offset);
					//change to LC 
					trans.moveTo_WC(pos_WC);
				});
				
				//清空场景中所有模型
				topic.subscribe("menu/empty" , function(){
				
					var parent = x3d.runtime.canvas.doc._viewarea._scene._xmlNode;

					//循环遍历Scene下的所有子节点
					for(var i = 0 ; i < parent.childNodes.length ; i++ ) {

						if( parent.childNodes[i].nodeName === "TRANSFORM"){
						
							//删除Scene节点的所有子节点Transform
							deletemodel(parent.childNodes[i]);
				
						}
					}
					
				});
			},
			
		});
	}
);

