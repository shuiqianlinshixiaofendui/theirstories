/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("spolo/data/module",function(){
    var module_cls = dojo.declare("module",[],{
	});
	module_cls.getModulePath = function(){
		return "/modules";
	}
	var Module = "";
	/**
		@brief 设置当前模块。这指示了当前页面(iframe内的内容)使用了哪个模块。只有切换模块时本值会被设置。
		模块跳转，请发送事件(topic.publish)module/switch
	*/
	module_cls.setCurrentModule = function(m){
		Module = m;
	}
	module_cls.getCurrentModule = function(){
		return Module;
	}
	return module_cls;
});
