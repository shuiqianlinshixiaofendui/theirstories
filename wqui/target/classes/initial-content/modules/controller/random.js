var random = {
	nextFrame : function(wrapNode){
		var wrapW,wrapH,wrapX,wrapY,$wrapNode;
		if(wrapNode){
			$wrapNode = $(wrapNode);
		}else{
			$wrapNode = $(document);
		}
		wrapPos = $wrapNode.position();
		wrapW = $wrapNode.width();
		wrapH = $wrapNode.height();
		wrapX = wrapPos.left;
		wrapY = wrapPos.top;
		// 通过计算返回一个随机位置的对象
		var frame = {};
		frame.x = wrapX+Math.random()*wrapW;// 随机数字
		frame.y = wrapY+Math.random()*wrapY;// 随机数字
		frame.width = 200;// 随机数字
		frame.height = 200;// 随机数字
		return frame;
	}
};
