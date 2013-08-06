define("scenedetail/js/camera",
["dijit/Dialog","dojo/dom-construct","dijit/registry","dijit/form/ValidationTextBox","dijit/form/Button","dojo/_base/lang","dojo/parser","widgets/ModelListItem/ModelListItem","dojo/on","dojo/topic","dojo/domReady!"], function(Dialog,domConstruct,registry,ValidationTextBox,Button,lang,parser,ModelListItem,on,topic){
	
	//添加摄像机的组件数组
	var cameraWidgets = new Array();
	var addCameraDialog = "addCameraDialog";
	var camerainput = "camerainput";
	var cameraSure = "cameraSure";
	var cameraAuto = "cameraAuto";
	
	//销毁可能重复的节点
	function destroyAddCameraNodes(){
		for(var index in cameraWidgets){
			if(typeof(cameraWidgets[index])=="object"){
				cameraWidgets[index].destroy();
				delete cameraWidgets[index];
			}
			
		}
	}
	
	//初始化添加摄像机的节点
	function initAddCameraNodes(){
		//准备好摄像机名称输入框，确定按钮，自动命名按钮
		var contnode = domConstruct.create("div");
		var childStr = domConstruct.toDom("<label forName=\"cameraName\">摄像机名称：</label>"+
						"<input type=\"text\" id=\""+camerainput+"\" data-dojo-type=\"dijit.form.ValidationTextBox\"></input>"+
						"<label class=\"cameraInfo\"></label>"+
						"<div><button id=\""+cameraSure+"\" data-dojo-type=\"dijit.form.Button\"></button>"+
						"<button id=\""+cameraAuto+"\" data-dojo-type=\"dijit.form.Button\"></button></div>");
		domConstruct.place(childStr,contnode);
		parser.parse(contnode);
		
		cameraWidgets[camerainput] = registry.byId(camerainput);
		cameraWidgets[cameraSure] = registry.byId(cameraSure);
		cameraWidgets[cameraAuto] = registry.byId(cameraAuto);
		
		//初始化摄像机名称组件
		initCameraInput();
		//初始化摄像机确定按钮组件
		initCameraSureWidget();
		
		var cameraAutoWidget = registry.byId("cameraAuto");
		cameraAutoWidget.set("label","自动命名");
		cameraAutoWidget.onClick = lang.hitch(this,function(){
			createCamera();
		});
		
		cameraWidgets[addCameraDialog] = new Dialog({
			id : "addCameraDialog",
			title : "摄像机名称",
			content : contnode
		});
		
	}
	
	//初始化摄像机名称组件
	function initCameraInput(){
		cameraWidgets[camerainput].set("required",true);
		cameraWidgets[camerainput].set("selectOnClick",true);
		cameraWidgets[camerainput].set("missingMessage","如果您不想命名，请点击自动命名！");
	}
	//初始化摄像机确定按钮组件
	function initCameraSureWidget(){
		var cameraSureWidget = registry.byId("cameraSure");
		cameraSureWidget.set("label","确定");
		cameraSureWidget.onClick = lang.hitch(this,function(){
			//添加摄像机
			addCamera();
		});
	}
	//添加摄像机
	function addCamera(){
		//摄像机名称验证
		if(cameraWidgets[camerainput].validate()){
			
			if(scene.cameraIsExist && typeof(scene.cameraIsExist)=="function"){
				scene.cameraIsExist(cameraWidgets[camerainput].get("value"), onExist, onNotExist);
			}
		}else{
			cameraWidgets[camerainput].focus();
		}
	}
	
	//如果摄像机已存在
	function onExist(){
		//如果名称已存在，提示用户
		cameraWidgets[camerainput].focus();
		cameraWidgets[camerainput].displayMessage("摄像机名称重复！请重新输入");
	}
	//如果摄像机不存在
	function onNotExist(){
		createCamera(cameraWidgets[camerainput].get("value"));
	}
	//创建摄像机
	function createCamera(name){
		cameraWidgets[addCameraDialog].hide();
		//调用添加摄像机的接口
		//创建摄像机
		var newItem;
		if(name){
			newItem = scene.createItem("CAMERA",{"name":name});
		}else{
			newItem = scene.createItem("CAMERA");
			name=newItem["data"]["name"];
		}
		//先创建一条数据出来
		var tempItem = addCameraToItemlist(newItem);
		tempItem.set("name","正在创建...");
		
		function success(data){
			//动态
			if(data){
				//添加一个摄像机到itemlist
				tempItem.set("name",name);
				//发出摄像机添加成功的消息
				var cameraItem = {
					name:newItem["data"]["name"],
					type:newItem["data"]["type"]
				}
				topic.publish("addCameraSuccess",tempItem,cameraItem);
			}
		}
		function error(err){
			Mask.hide();
			Spolo.notify({
				"text" : res,
				"type" : "error",
				"timeout" : 1000
			});
			throw(res);
		}
		//保存场景
		scene.saveItems(success, error);
	}
	function addCameraToItemlist(item){
		//console.log(item);
		var name = item["data"]["name"];
		item["data"]["name"] = name;
		item["data"]["canEdit"] = true;
		//新添加的摄像机放到列表的最上方
		w = new ModelListItem(item["data"]).placeAt("itemList","first");
		var dthis = this;
		on(w,"onInstead",function(node){
			insteadObj.insteadModel.call(dthis,node);
		});
		return w;
	}
	
	var camera = {
		showAddCameraDialog : function(){
			
			//先销毁所有关于添加摄像机的组件
			destroyAddCameraNodes();
			
			//初始化添加摄像机的组件
			initAddCameraNodes();
			
			cameraWidgets[addCameraDialog].show();
		}
	}
	
	return camera;
})