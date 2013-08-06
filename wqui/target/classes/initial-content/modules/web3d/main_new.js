/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/

// 3d 的入口文件 

x3dom.Runtime.prototype.ready = function(){
    /**
     * 更新数据时，关闭窗口提示。
     */
    // var _Sylb;
    var _topic;
    require(["dojo/topic"], function(topic){	
        _topic = topic;
    });
	Spolo.isSyncFinish = function(){
       var isFinish = x3d._sp_actions._syncLib.isFinish(function (){
            if(x3d._sp_actions._topic){
                x3d._sp_actions._topic.publish("sys/save_console","数据同步完成！");
            }
        });
        if(isFinish){
            return 1;
        }
        return 0;
    }
	/*
	  //计算3d区域div的大小并自适应。
	*/
	
	var _sp_x3d_main_tag_width = false;
	//监听页面大小变化。
	var _on = require("dojo/on");
	_on(window, "resize", function() {
		_sp_x3d_main_tag_width = false;
		initIndex();
	});
	var Client = {
		viewportWidth: function() {
			return self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
		},        
		viewportHeight: function() {
			return self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
		}, 
		viewportSize: function() {
			return { width: this.viewportWidth(), height: this.viewportHeight() };
		}
	};
	//设置已有div的宽和高，并调用setx3d_width(); 设置_sp_x3d_main_tag的宽的方法。
	function initIndex(){
		var h = Client.viewportHeight();
		var w = Client.viewportWidth();	
		
		document.getElementById("layout_main").style.width = w+"px";
		document.getElementById("layout_main").style.height = h+"px";
		document.getElementById("layout_3d").style.width = w-280-19+"px";
		document.getElementById("layout_3d").style.height = h-44-24+"px";
		//alert(h+"      222            "+w);
		setx3d_width();
	}
	//当_sp_x3d_main_tag已经加载出来之后，设置其宽和高，如果不存在调用执行延时的方法。
	function setx3d_width(){
		if(document.getElementById("_sp_x3d_main_tag")!=null){
			var w = Client.viewportWidth();	
			var h = Client.viewportHeight();
			document.getElementById("web3d/widgets_0").style.width = w-280-19+"px";
			document.getElementById("web3d/widgets_0").style.height = h-44-24+"px";
			document.getElementById("_sp_x3d_main_tag").setAttribute("width",(w-280-21)+"px");
			document.getElementById("_sp_x3d_main_tag").setAttribute("height",(h-44-26)+"px");
			x3dom.Viewarea._width  =  w-280-21;
			x3dom.Viewarea._height =  h-44-26;
			_sp_x3d_main_tag_width = true;
		}else{
			if(!_sp_x3d_main_tag_width){
				var timer=setTimeout(function() {
					setx3d_width();
				},1000);
			}
		}
	}
	//初始化执行设置。
	initIndex();
	
	/*
	 //我们全部的功能列表支持都是从场景的x3d标签开始的。我们会为其扩展一个属性_sp_actions[]数组。下标为action的名称。
	*/
	var x3d = document.getElementById("_sp_x3d_main_tag");
	if(!x3d._sp_actions)
		x3d._sp_actions = {};

	//init x3d width and height
	x3dom.Viewarea._width  =  (x3d.getAttribute("width").split("px")[0]).valueOf();
	x3dom.Viewarea._height   =  (x3d.getAttribute("height").split("px")[0]).valueOf();
	
	var addAction = function(name,classdefine){
		//采用可读名称，以方便后续使用。
		//if(!x3d._sp_actions[classdefine._meta.ctor])
		//	x3d._sp_actions[classdefine._meta.ctor] = new classdefine(x3d);
		if(!x3d._sp_actions[name])
			x3d._sp_actions[name] = new classdefine(x3d);
	};
	
	//update globla viewarea obj
	Spolo.viewarea = x3dom.Viewarea;
	
	//添加action类
	require([
		"web3d/action_new/init_action",
		"web3d/action_new/commandLib",
        "web3d/Lib/syncLib"
		], 
		function(init_action,commandLib, syncLib, topic){
			addAction("init_action",init_action);
			addAction("commandLib",commandLib);
			addAction("_syncLib", syncLib);
			
			//TODO: 下面代码演示了如何建立初始事件关注。
			Spolo.cmdmap["onKeyPress_z"] = "view/showall";
	});
}
