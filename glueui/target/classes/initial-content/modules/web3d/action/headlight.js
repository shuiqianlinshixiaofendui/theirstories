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

define("web3d/action/headlight",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			//prefix为事件名称的前缀.可以为空。
			constructor : function(x3d,suffix){
				//直接从x3d中获取需要的信息，并建立关注和链接。
				//获取scene对象。
				var s = x3d.runtime.canvas.doc._scene;
				//获取navigation对象，并保存之。
				var nav = s.getNavigationInfo();
				this.navigation = nav;
				if(!this.navigation)
				{//@todo: 如果navigation不存在，创建之。ps: 需要使用库来创建，因为要正确设置baseURI以决定是否同步到服务器。
				}
				
				//@fixme 首次创建，需要发出headlight/changed消息，以给响应者一个适应?

				//subclass navigation.fieldchanged。将headlight变化转化为topic事件。
				//下面是一个简化方案，另外的方案可以使用route体系。
				var __orgi_fieldchanged = nav.fieldChanged;
				nav.fieldChanged = function(fieldName)
				{
					if(fieldName.toLowerCase() === "headlight")
					{
						var v = nav._vf["headlight"];
						var evtname = "headlight/changed";
						if(suffix)
							evtname += suffix;
						topic.publish(evtname,v,x3d);
					}
					__orgi_fieldchanged.call(this,fieldName);
				}
				
				//关注headlight/change消息。
				var cthis = this;	//cache this.
				topic.subscribe("headlight/on", function(target){
					if(!target || x3d == target)
					{
						var _v = nav._vf["headlight"];
						if(!_v)
						{
							nav.postMessage("headlight",true);
							nav.fieldChanged("headlight");
							//nav switch to v.
							x3dom.debug.logInfo("spinfo: headlight on");
						}
					}
				});
				
				topic.subscribe("headlight/off", function(target){
					if(!target || x3d == target)
					{
						var _v = nav._vf["headlight"];
						if(_v)
						{
							nav.postMessage("headlight",false);
							nav.fieldChanged("headlight");
							//nav switch to v.
							x3dom.debug.logInfo("spinfo: headlight off");
						}
					}
				});
			}
		});				
	}
);

