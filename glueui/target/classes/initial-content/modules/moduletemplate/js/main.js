/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: spolo@spolo.org
 *  
 *  author		 : 	xxx@spolo.org
 *  wiki  		 : 	这里是对应的wiki地址
 *  description  : 	这里是功能描述
 **/

/** 当前js文件的私有方法
	写在这里的方法子窗口或其他js文件中是调用不到的。
*/
(function(){
	// 这里声明了存放widget的容器ID
	var wdgTmplContainer = "tempWidget";
	var widgetTemplate;
	var custom;

	// 初始化页面中的控件
	// 绑定控件的事件
	require(
		[
			"dojo/on",
			"dojo/ready",
			"widgets/WidgetTemplate/main",
			"moduletemplate/js/custom"
		],
		function(on, ready, WidgetTemplate, custom){
			ready(function(){
				// 创建widget，并placeAt到module的html中
				widgetTemplate = new WidgetTemplate().placeAt(wdgTmplContainer);
				// 订阅该widget的所有事件，dojo/on
				on(widgetTemplate,"WidgetTemplate_ready",function(){
					// 在on()中调用ready外的方法，这样的写法可以是代码更容易维护
					widgetTemplateReady.call(this);
				});
				console.log("widgetTemplate.init()");
				widgetTemplate.init();
				custom = new custom();
				custom.test();
			});
		}
	);

	/**	处理某某控件的某某事件
	*/
	function widgetTemplateReady(){
		// 这里根据API来进行逻辑处理
		console.log("widgetTemplateReady");
	}

})();

/**	当前js文件的公有方法
*/
function subWindowClose()
{

}
