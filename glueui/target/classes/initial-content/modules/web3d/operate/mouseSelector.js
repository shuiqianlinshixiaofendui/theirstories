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

define("web3d/operate/mouseSelector",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
				var selectedModeId = 1;
			    var x3dom_Viewarea_checkEvents = x3dom.Viewarea.prototype.checkEvents;
				x3dom.Viewarea.prototype.checkEvents = function (obj, x, y, buttonState, eventType)
				{
					x3dom_Viewarea_checkEvents.call(this,obj, x, y, buttonState, eventType);
					if(eventType === 'onmousedown')
					{
						Spolo.isMouseInModel  = true;
						if(Spolo.cameraLock) //if the cameralock is on, prevent mouse select mesh
							return;
						
						//我们这里不再进行选择。直接发送this._pickingInfo.pickObj被选中.由接收者自行判定是否是同一object。
						//引发原因:x3dom.Viewarea.prototype.checkEvents中会对选中物体做一个变化(如果没有事件监听，变化为geometry)。
						//here we select a shape object, not a transform, thus we need to get its ancestor obj afterwards
						topic.publish("edit/select",Spolo.viewarea._pickingInfo.pickObj,x3d);
					}
					if(eventType === 'onmouseup'){
						//console.log("mouse over out !\n");
						 Spolo.isMouseInModel  = false;
						
					}
				};
				
				//目前只支持单选。currentobj为_x3domNode.
				this.currentobj = null;

				var cthis = this;
				//关注edit/select消息。 
				topic.subscribe("edit/select", function(ele,target){
					if( (!target || x3d == target) && cthis.currentobj != ele )
					{
						if(cthis.currentobj)
						{
							//@todo:highlight是1.4才开始支持的函数。
							//cthis.currentobj.highlight(false,new x3dom.fields.SFColor(1, 0, 0));
							
							
							topic.publish("edit/deselected",cthis.currentobj,ele,x3d);
						}
						
						/*if(x3dom.isa(ele, x3dom.nodeTypes.Shape))
							var t_ele = getTransformAncestor(ele);
						cthis.currentobj = t_ele;*/
						
						cthis.currentobj = ele;
						
						if(cthis.currentobj)
						{
							
							//@todo:highlight是1.4才开始支持的函数。
							//cthis.currentobj.highlight(true,new x3dom.fields.SFColor(1, 0, 0));
							topic.publish("edit/selected",cthis.currentobj,x3d);
							//向2D页面发送模型选中消息
							topic.publish("toolbar/mouseSelected",true);
							//assign current processing obj to this
							// Spolo.eventProcessor.onPress = this;
						}
					}
				});
				
				//获取Transform祖先对象。
				//FIXME: 这里不应该递归，检查父节点是否是Transform，并且是否只包含自己这么一个shape。
				//成立，则返回父，不成立，则创建一个Transform，动态修改场景树以满足后续假设。
				function  getTransformAncestor(node)
				{						
					if(node._parentNodes.length)
					{
						//if(x3dom.isa(node._parentNodes[0], x3dom.nodeTypes.Transform)){
						var tagName = node._parentNodes[0]._xmlNode.tagName;
						if(tagName=="Transform" || tagName=="Group" || tagName=="GROUP" || 
							tagName=="INLINE" || tagName=="Inline" ||  // 根节点下的scene的tagName是SCENE,全大写
							tagName=="TRANSFORM" ){
							return getTransformAncestor(node._parentNodes[0]);
						}else{
							// @fixme 这里需要再根据 TagName 来做进一步判断，确保node是一个Transform，
							// 否则后续的模型位置、旋转、缩放操作会报错
							// 但从目前的数据结构来看，这里的 node 肯定是一个 Transform
							// 因为在向scene中加模型时，就自动给模型套了一层Transform，并保存到jcr中了
							 if(node._parentNodes[0]._parentNodes[0]){
                                    return node._parentNodes[0]._parentNodes[0]._parentNodes[0];
                               }else{
                                    return node;
                               }
						}
					}
					return null;
				}
				//订阅二维发送的模型操作类型消息。
				topic.subscribe("toolbar/model/selectModeFree",function(selId){
					// console.log("model drage Mode="+selId);
					selectedModeId = selId;
					if(selId == 2){
						topic.publish("command/module_action/removeCurBox");
					}
					//将缓冲的模型置空。
					Spolo.selectedObj = null;
					// 切换模式时，置空当前选中模型变量
					cthis.currentobj = null;
					//将鼠标模型操作模式保存为全局变量。
					Spolo.modelOperationMode = selId;
					Spolo.current_trans = Spolo.transList[selId - 1];
					//删除坐标轴模式创建的坐标轴
					if(selId==1){
						topic.publish("command/module_action/axisDelete");
					} 
					// else if(selId == 2){
						// topic.publish("command/module_action/removeCurBox");
					// }
				});
				
				//订阅模型锁定消息
				topic.subscribe("toolbar/model/locked",function(val){
					console.log("recive toolbar/model/locked");
					Spolo.modelSelectable = !val;
				});
				
				// var cthis = this;
				topic.subscribe("edit/selected", function(node,target){
					//获取Transform祖先对象。
					var trans = getTransformAncestor(node);
					//alert(trans.constructor)
					var target = null ;
					if(target){
						target = getTransformAncestor(target);
					}
					//console.log("trans._DEF : " + trans._DEF);
					if(trans && trans._DEF !="coorbar_model" && trans._DEF !="boundingBox" && trans._DEF && target != trans)
					{
						// alert(trans.highlight(true,new x3dom.fields.SFColor()));
						//console.log("selectedObj is not null !!! \n");
						
						trans._sp_selectedobj = node;
                        // old Spolo.selectedObj
                        var oldSelectedObj = Spolo.selectedObj;
						Spolo.oldSelectedObj = oldSelectedObj;
						//update global selectedobj in spolo3d
						Spolo.selectedObj = trans;
						Spolo.mesh = Spolo.viewarea._pickingInfo.pickObj._cf.geometry.node._mesh;
						
						// 绕物体模式时点击物体则物体获取红心
						if(Spolo.aroundObjOperationMode){
							var sync = Spolo.dataSync;
							var data = sync.get_camera_data();
							var cap = data.cameraAssisPoint;
							var position = trans._trafo.e3();
							cap.receivePos(new x3dom.fields.SFVec3f(position.x,position.y,position.z));
						}
						
						if(selectedModeId == 1) {//模型拖动模式为1平移，2为坐标模式
						//	trans.replaceDragger("dragger");
							//topic.publish("command/module_action/addBox");
						} else {
							//console.log("坐标模式拖动");
							//添加坐标轴
							//console.log(trans._vf.translation);
							if(Spolo.selectedObj._DEF){
							    if(!oldSelectedObj || (Spolo.selectedObj._DEF != oldSelectedObj._DEF)){
							        topic.publish("command/module_action/axisAdd",trans);
							    }
							}
						}
						
					}
				});
				
				topic.subscribe("edit/deselected", function(node,target){
					
					//获取Transform祖先对象。
					var trans = getTransformAncestor(node);
					var target = getTransformAncestor(target);
					
					if(trans && trans._sp_selectedobj && target._DEF !="coorbar_model")
					{
						topic.publish("command/module_action/removeBox");
						//向2D页面发送模型取消选中消息
						topic.publish("toolbar/mouseSelected",false);
						//remove dragger
						trans.replaceDragger();
						cthis.currentobj = null;
						//删除坐标轴
						if(selectedModeId != 1 && trans._DEF && target._DEF != trans._DEF){
							if(document.getElementById("coorbar_model")!=null){
								topic.publish("command/module_action/axisDelete");
							}
						}
					} else if(trans && target._DEF != "coorbar_model" && Spolo.selectedObj._DEF != target._DEF){
                        //删除坐标轴
						if(selectedModeId != 1 && trans._DEF && target._DEF != trans._DEF){
							if(document.getElementById("coorbar_model")!=null){
								topic.publish("command/module_action/axisDelete");
							}
						}
                    }
				});
					
			}, 
		});
	}
);

