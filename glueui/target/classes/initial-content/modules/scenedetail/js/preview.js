define("scenedetail/js/preview",
	[
		"widgets/LibView/MyPreviewLib",
		"widgets/LibView/PreviewLib",
		"dojo/_base/lang",
		"dojo/domReady!"
	], function(
		MyPreviewLib, PreviewLib, lang
	){
	
	var array = {
		initMyPreview:function(id, json){
			var myPreviewLibJson = {
				numberSpinner: true,
				isGutil: true
			}
			lang.mixin(myPreviewLibJson, json);
			var myPreviewLib = new MyPreviewLib(myPreviewLibJson).placeAt(id);
		},
		initPreviewLib:function(id, json){
			var previewLibJson = {
				isPublish : false, //是否支持发布功能，默认不支持。
				canAddModel : true, // 是否可以加入场景，默认可以
				hasButton : false, //是否显示功能按钮，默认不显示按钮
				numberSpinner : true,
				isGutil: true
			}
			lang.mixin(previewLibJson, json);
			var previewLib = new PreviewLib(previewLibJson).placeAt(id);
		}
	}
	
	return array;
})