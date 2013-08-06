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


var Spolo;

// start spolo code scope
(function() {

//兼容其它名称空间给出的Spolo
if(!Spolo)
	Spolo = new Object();

//cmdmap保存了各个动作到命令的映射。
var cmdmap = {};
Spolo.cmdmap = cmdmap;

//@TODO: 从指定的url中加载cmdmap.
Spolo.loadShortCuts = function(url){
}

//prevent default mouse drag action
var old_x3dom_onDrag = x3dom.Viewarea.prototype.onDrag;
x3dom.Viewarea.prototype.onDrag = function(x,y,buttonState)
{   

	if(Spolo.eventProcessor.onDrag)
	{//事件已经被处理。
		this.handleMoveEvt(x, y, buttonState);
	}else{
					
		//topic.publish("system/onMousePress"); 
		//old_x3dom_onDrag.call(this,x,y,buttonState);
		
	}
}

require(["dojo/topic"], function(topic)
{
	//拦截x3d.viewarea的事件并根据cmdmap publish topic.
	//FIXME: 把鼠标消息桥接到topic上。参考dragger.js实现上的需求。
	function SubclassViewareaMouseMethods(name)
	{
		var _old_x3dom_Viewarea_method = x3dom.Viewarea.prototype[name];
		x3dom.Viewarea.prototype[name] = function(x, y, buttonState, ctx)
		{
			// x3dom.debug.logInfo("x = " + x + ", y = "+ y +", buttonState111 = "+y);
			
			//_old_x3dom_Viewarea_method.call(this,x,y,buttonState);
			
			/**
				如果是响应onDrag方法，这里不需要call了，因为onDrag中对摄像机的操作都已经在实现完，我们不在使用x3dom原生的摄像机操作了。
				其他操作则依然call x3dom原生的操作来处理。
			*/
			if(name != "onDrag"){
				_old_x3dom_Viewarea_method.call(this,x,y,buttonState);
			}
			
			//update globla viewarea obj
			Spolo.viewarea = this;
			
			var cmd = cmdmap[name];
			if(cmd){
				topic.publish(cmd,x,y,buttonState,this,ctx);
			}
			topic.publish("system/"+name,x,y,buttonState,this,ctx);
		}
	}
	SubclassViewareaMouseMethods("onMove");
	SubclassViewareaMouseMethods("onDrag");
	SubclassViewareaMouseMethods("onMousePress");
	SubclassViewareaMouseMethods("onMouseRelease");
	SubclassViewareaMouseMethods("onMouseOver");
	SubclassViewareaMouseMethods("onMouseOut");
	SubclassViewareaMouseMethods("onDoubleClick");
	
	//拦截x3d.document的事件并根据cmdmap publish topic.
	function SubclassDocKeyMethods(name)
	{
		var _old_x3dom_Document_method = x3dom.X3DDocument.prototype[name];
		x3dom.X3DDocument.prototype[name] = function (keycode)
		{
			_old_x3dom_Document_method.call(this,keycode);

			var cmdstr = name;
			if(keycode >= 33 && keycode <= 126)
			{
				cmdstr = name + '_' + String.fromCharCode(keycode);
			}else{
				cmdstr = name + '_' + keycode;
			}
			var cmd = cmdmap[cmdstr];
			if(cmd){
				//FIXME: how to get the x3d node?
				topic.publish(cmd);
			}
			topic.publish("system/"+cmdstr,keycode,this);
		}
	}
	SubclassDocKeyMethods("onKeyDown");
	SubclassDocKeyMethods("onKeyUp");
	SubclassDocKeyMethods("onKeyPress");
});

// end spolo code scope 
})();