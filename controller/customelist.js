var customelist.initialize = function(dom,controller,template){
	var customeframe = {};
	
	customeframe.addNewImg = function(src){
		var postion = controller.nextFrame();
		template.setX(postion.x);
		template.setX(postion.y);
		template.setX(postion.width);
		template.setX(postion.height);
		// ��ӵ�ҳ���ָ����domԪ����
		dom.addChildren(template);
	};
	return customeframe;
}
