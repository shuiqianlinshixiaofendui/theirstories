
var logg = function(e){
	console.log(e);
};

//分类中英文对应显示			
var myDict = {
	"idea":"建议",
	"question":"疑问",
	"problem":"难题",
	"praise":"赞"
};
//修改分类样式（背景色）
var setTopicStyle = function(style) {
  $('#tabs li').removeClass("active");
  $("."+style).addClass("active");
};

//用于文本的预显示文字
var changeText = function(style){
	var value = $('#topic_additional_detail_label');
	if(value[0].innerHTML.indexOf(myDict[style]) < 0)
		value[0].innerHTML = "留下您的" + myDict[style];
};

/* 
	* 分类的点击事件
	* 修改l分类的样式
	* 修改文本的预显示文字
	* 设置预显示文字为block
*/
$("#tabs li").click(function (e) {
    e.preventDefault();
	var style = e.currentTarget.className;
	setTopicStyle(style);
	
	if(style.indexOf("active")<0)
		changeText(style);
	$('#topic_additional_detail_label')[0].style.display = "block";
	$('#content_1')[0].value = "";
});

//隐藏text的预显示文字
$("#content_1").click(function (e) {
	$('#topic_additional_detail_label')[0].style.display = "none";
});


