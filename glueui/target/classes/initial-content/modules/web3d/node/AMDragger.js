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

//draggerʵ������򵥵�manipulate.

define("web3d/node/AMDragger",["dojo/topic"],
	function(topic){

		return dojo.declare([],{
			//������Transform����
			constructor : function(trans){
			
				this.Transform = trans;
				
				//��Ӹ����������Լ����¼�����
				// topic.publish("axisHelper/add", this.Transform);

				var dragObj = this;
				
				var _lastMouseX = 0;
				var _lastMouseY = 0;
			
				//when mouse pressed, register ondrag and on mouse release events
				this.MousePressHandler = topic.subscribe("system/onMousePress",function(x,y,buttonState){
					
					//viewarea obj
					var viewarea = Spolo.viewarea;
					//current action mode
					var cm = Spolo.currentAction;
					
					//determine if the mouse is grabbing anything
					var hitobj = viewarea._pickingInfo.pickObj;
					
					if(!hitobj) //if nothing grabbed, we do nothing
						return;
						
					//else we proceed to perform actions	
					Spolo.eventProcessor.onDrag = true;
					
					this.MouseDragHandler = topic.subscribe("system/onDrag",function(x,y,buttonState){ 
						//first, tell other classes the dragger is currently handling the mouse drag events
						Spolo.eventProcessor.onDrag = true;
						
						if(cm == Spolo.actionModeList[0]) //translate mode
						{
							var pos = trans._vf.translation;
							
							var _intersect_pos_inCC = viewarea.projectVector( pos );
							var _Mouse3D = new x3dom.fields.SFVec3f( (x / viewarea._width) * 2 - 1,
																		-(y / viewarea._height) * 2 + 1,
																		_intersect_pos_inCC.z);
							//�Ȱ�����ϵ����Ϊ��������ϵ��
							var pos_WC = Spolo.viewarea.unprojectVector(_Mouse3D);
							trans.translateTo_WC(pos_WC);
							
						}else if(cm == Spolo.actionModeList[1]) //rotate mode
						{
						
						}else if(cm == Spolo.actionModeList[2]) //scale mode
						{
						
						}
					});
					});
			},
			
			//added for axis helper, used to choose among all the 
			//make it adaptable to its parameters
			setActionMode : function(i)
			{
				if((!isNaN(i)) && (i < 3)) //if i is a number
				{
					Spolo.currentAction = Spolo.actionModeList[i];
				}else{ //or it is a string
					for(var a = 0; a < Spolo.actionModeList.length; a++)
					{
						if(i == Spolo.actionModeList[a])
						{
							Spolo.currentAction = i;
						}
					}					
				}
				//if nothing mathes, it is an error
			},
			
			//ɾ����Ϣ��ע��
			// x3dom.nodeTypes.Transform.prototype.
			unload : function()
			{
				var tthis = this.Transform;
				
				if(this.MouseReleaseHandler)
					this.MouseReleaseHandler.remove();
				if(this.MouseDragHandler)
					this.MouseDragHandler.remove();
				if(this.MousePressHandler)
					this.MousePressHandler.remove();
				
				if(tthis._sp_selectedobj)
				{
					// delete tthis._sp_selectedobj._xmlNode["onclick"]; 
					delete tthis._sp_selectedobj._xmlNode["onmousedown"]; 
					// delete tthis._sp_selectedobj._xmlNode["onmouseover"]; 
					// delete tthis._sp_selectedobj._xmlNode["onmouseout"]; 
					// delete tthis._sp_selectedobj._xmlNode["onmousemove"]; 
					delete tthis._sp_selectedobj._xmlNode["onmouseup"];  
				}
			},
		});				
	}
);

