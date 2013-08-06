define("scenedetail/js/modelEditDialog",["dijit/Dialog","widgets/ModelEdit/ModelEdit","dojo/parser","dojo/ready","dojo/dom-style","dojo/query" ,"dojo/dom","dojo/domReady!"], function(Dialog,ModelEdit,parser,domStyle,ready,query,dom){
	var dialogContent = "<div id=\"modelEditContainer\"></div>";
	
	var	dialog = new Dialog({
			title: "模型属性修改",
			style: "width:500px;height:350px;background:#fff",
			content: dialogContent
		})
	var array = {
		
		newModelEditWidget:function(path){
			
			var json = {
					/*"name":"shafa1_1",
					"brand":"飞鹿",
					"price":"10000",
					"type":"MESH",*/
					"img":"images/nopreview.jpg",
					"path":path
				};
			console.log(dojo.byId("modelEditContainer"));
			//清空一下
			if(this.modelObj){
			
				this.modelObj.destroy();
			}
			this.modelObj = new ModelEdit(json).placeAt("modelEditContainer");
			
			dialog.show();
			query(".dijitDialogPaneContent").style("width","450px");
			query(".dijitDialogPaneContent").style("height","280px");
			parser.parse(dom.byId("modelEditContainer"));
		}
	}
	
	return array;
})