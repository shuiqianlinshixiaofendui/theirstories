require([
    "dojo/ready",
    "dijit/form/HorizontalSlider",
    "dojo/dom", // for inserting value in TextBox example
    "dijit/form/TextBox", // this we only include to make an example with TextBox
    "dojo/parser" // parser because of TextBox decoration
], function(ready, HorizontalSlider, dom){
    ready(function(){
        var sliderBar = dom.byId("sliderBar");
        var slider = new HorizontalSlider({
            id: "slider",
            name: "slider",
            value: 0,
            minimum: 0,
            maximum: 359,
            discreteValues:360,
            intermediateChanges: true,
            style: "width:120px;",
			state: false,
            onChange: function(value){
                dom.byId("sliderValue").value = Math.round(value);
				var axis = null;
				if(document.getElementById("rotation_x").checked){
					axis = "axisX";
				}else if(document.getElementById("rotation_y").checked){
					axis = "axisY";
				}else if(document.getElementById("rotation_z").checked){
					axis = "axisZ";
				}
				var name = dom.byId("model_name").value;
				if(axis && name && this.state){
					 mainWidget.setRotation(Math.round(value),axis);
				}
               
            },
			onMouseEnter : function(){
				this.state = true;
			},
			onMouseLeave : function(){
				this.state = false;
			}
        }).placeAt("sliderBar");
    });
});