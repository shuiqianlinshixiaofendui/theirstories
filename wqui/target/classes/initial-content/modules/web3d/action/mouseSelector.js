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

define("web3d/action/mouseSelector",["dojo/topic"],
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
					if(eventType === 'onmouseout'){
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
							topic.publish("edit/deselected",cthis.currentobj,x3d);
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
							tagName=="INLINE" || tagName=="Inline" || tagName=="Scene" ||   // 根节点下的scene的tagName是SCENE,全大写
							tagName=="TRANSFORM" ){
							return getTransformAncestor(node._parentNodes[0]);
						}else{
							// @fixme 这里需要再根据 TagName 来做进一步判断，确保node是一个Transform，
							// 否则后续的模型位置、旋转、缩放操作会报错
							// 但从目前的数据结构来看，这里的 node 肯定是一个 Transform
							// 因为在向scene中加模型时，就自动给模型套了一层Transform，并保存到jcr中了
							return node;
						}
					}
					return null;
				}
				//订阅二维发送的模型操作类型消息。
				topic.subscribe("toolbar/model/selectModeFree",function(selId){
					console.log("model drage Mode="+selId);
					selectedModeId = selId;
					
					//将缓冲的模型置空。
					Spolo.selectedObj = null;
					
					//将鼠标模型操作模式保存为全局变量。
					Spolo.modelOperationMode = selId;
					
					//删除坐标轴模式创建的坐标轴
					if(selId==1){
						topic.publish("axisManager/axisDelete");
					}
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
					
					if(trans && trans._DEF !="coorbar_model")
					{
						// alert(trans.highlight(true,new x3dom.fields.SFColor()));
						//console.log("selectedObj is not null !!! \n");
						
						trans._sp_selectedobj = node;
						//update global selectedobj in spolo3d
						Spolo.selectedObj  = trans;
						if(selectedModeId == 1) {//模型拖动模式为1平移，2为坐标模式
						//	trans.replaceDragger("dragger");
							
						} else {
							//console.log("坐标模式拖动");
							//添加坐标轴
							//console.log(trans._vf.translation);
							topic.publish("axisManager/axisAdd",trans);
						}
						
					}
				});
				
				topic.subscribe("edit/deselected", function(node,target){
					//获取Transform祖先对象。
					var trans = getTransformAncestor(node);
					if(trans && trans._sp_selectedobj)
					{
						//向2D页面发送模型取消选中消息
						topic.publish("toolbar/mouseSelected",false);
						//remove dragger
						trans.replaceDragger();
						cthis.currentobj = null;
						//删除坐标轴
						if(selectedModeId!=1){
							//topic.publish("axisManager/axisDelete");
						}
					}
				});
					
			}, 
		});
	}
);

