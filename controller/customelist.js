var customelist.initialize = function(dom,controller,template){
	var customeframe = {};
	
	customeframe.addNewImg = function(src){
		var postion = controller.nextFrame();
		template.setX(postion.x);
		template.setX(postion.y);
		template.setX(postion.width);
		template.setX(postion.height);
		// 添加到页面的指定的dom元素上
		dom.addChildren(template);
	};
	return customeframe;
}
