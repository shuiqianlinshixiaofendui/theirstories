define("scenedetail/js/preview",
["dijit/Dialog","widgets/LibView/MyPreviewLib","widgets/LibView/PreviewLib","dojo/parser","dojo/ready","dojo/dom-style","dojo/query" ,"dojo/dom","dojo/domReady!"], function(Dialog,MyPreviewLib,PreviewLib,parser,domStyle,ready,query,dom){
	
	var array = {
		
		initMyPreview:function(id){
			var myPreviewLib = new MyPreviewLib().placeAt(id);
		},
		initPreviewLib:function(id){
			var json = {
				//path : "/content/users/"+Spolo.getUserId()+"/previewlib",
				isPublish : false, //是否支持发布功能，默认不支持。
				canAddModel : false, // 是否可以加入场景，默认可以
				hasButton : false //是否显示功能按钮，默认不显示按钮
			}
			var previewLib = new PreviewLib(json).placeAt(id);
		}
	}
	
	return array;
})