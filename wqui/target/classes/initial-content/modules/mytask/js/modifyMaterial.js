require(
[
	"dojo/ready"
],
function(ready){
	ready(function(){
		var data = Spolo.getDialogData();
		initData(data);
	});
	function initData(data){
		console.log(data,"data");
		var material_name = document.getElementById("input_material");
		//console.log(material_name,"material_name");
		var author = document.getElementById("input_author");
		//console.log(author,"author");
	}
})