require(
[
	"dojo/ready",
	"dojo/on", 
	"dojo/dom"
],
function(ready, on, dom){
   ready(function(){
		var axis = "";
		var pos_z = null;
	    var type = "";
		
		/**
		 * 检测是否选中模型
		 */
		function isSelectCheck(){
			var name = dom.byId('model_name').value;
			if(name){
				return 1;
			}
			return 0;
		}
		//var offset = null;
		 on(dom.byId("EditConsole"), "event", function(e){
			if(e.data){
				var data = e.data;
				var model_name = data.model_name;
				var angle = data.angle;
				//offset = data.offset;
				//var pick_pos = Spolo.viewarea.projectVector(data.pick_pos);
				//pos_z = pick_pos.z;
				var position_CC = Spolo.viewarea.projectVector(data.position);
				pos_z = position_CC.z;
				var x = ((position_CC.x + 1) / 2 * Spolo.viewarea._width).toFixed(1);
				var y = ((1 - position_CC.y) / 2 * Spolo.viewarea._height).toFixed(1);
				axis = "axisX";
				dom.byId('model_name').value = model_name;
				dom.byId('positionX').value = x;
				dom.byId('positionY').value = y;
				dom.byId("sliderValue").value = angle;
				dom.byId("model_visible").checked = true;
				dom.byId('model_name').readOnly = true;
				var _slider = dijit.byId("slider");
				_slider.set("value", angle);
			}	
			if(e.deleteData){
				dom.byId('model_name').value = "";
				dom.byId('positionX').value = "";
				dom.byId('positionY').value = "";
				dom.byId("sliderValue").value = 0;
				dom.byId("model_visible").checked = false;
				dom.byId('model_name').readOnly = false;
				var _slider = dijit.byId("slider");
				_slider.set("value", 0);
			}
			if(e.changeAxis){
				var changeAxis = e.changeAxis;
				var change_axis = changeAxis.axis;
				change_axis = "rotation_" + change_axis;
				dom.byId(change_axis).checked = true;
				var angle = dom.byId("sliderValue").value;
				angle = Math.round(Number(angle) + changeAxis.rot);
				if(angle > 359){
					angle = 0;
				}
				if(angle < 0){
					angle = 359;
				}
				dom.byId("sliderValue").value = angle;
				var _slider = dijit.byId("slider");
				_slider.set("value", angle);
				_slider.state = false;
			}			
		});
		
		on(dom.byId("rotation_x"),"click",function(){
			if(isSelectCheck()){
				axis = "axisX";
			} else {
				alert("请先选择模型！");
			}
		});
		on(dom.byId("rotation_y"),"click",function(){
			if(isSelectCheck()){
				axis = "axisY";
			} else {
				alert("请先选择模型！");
			}
		});
		on(dom.byId("rotation_z"),"click",function(){
			if(isSelectCheck()){
				axis = "axisZ";
			} else {
				alert("请先选择模型！");
			}
		});
		
		function getPosition(){
			var valuex = dom.byId('positionX').value;
			var valuey = dom.byId('positionY').value;
			var name = dom.byId('model_name').value;
			if(name && valuex && valuey){
				mainWidget.setPosition(valuex,valuey,pos_z);
			} else {
				alert("请先输入值！");
			}
			
            Spolo.dynamicsSys.isCollision();
		};
		
		dom.byId("positionX").onblur = function(){
			if(isSelectCheck()){
				getPosition();
			} else {
				alert("请先选择模型！");
			}
		};
		dom.byId("positionY").onblur = function(){
			if(isSelectCheck()){
				getPosition();
			} else {
				alert("请先选择模型！");
			}
		};
		dom.byId("sliderValue").onblur = function(){
			if(isSelectCheck()){
				var rot = dom.byId('sliderValue').value;
				if(rot){
					var _slider = dijit.byId("slider");
					_slider.set("value", rot);
					_slider.state = true;
				} else {
					alert("请先输入值！");
				}
			} else {
				alert("请先选择模型！");
			}
		};
		dom.byId("model_scale").onblur = function(){
			if(isSelectCheck()){
				var name = dom.byId('model_name').value;
				var _scale = dom.byId('model_scale').value;
				if(name && _scale){
					mainWidget.setScale(_scale);
				} else {
					alert("请先输入值！");
				}
			} else {
				alert("请先选择模型！");
			}
		}
		
    });
});