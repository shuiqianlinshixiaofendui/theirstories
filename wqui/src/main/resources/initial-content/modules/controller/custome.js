var custome.initialize = function(controller,template){
	var customeframe = {};
	
	customeframe.addNewImg = function(src){
		var postion = controller.nextFrame();
		template.setX(postion.x);
		template.setX(postion.y);
		template.setX(postion.width);
		template.setX(postion.height);
	};
	return customeframe;
}

var custome.addImgTemplate = function(template){

}