/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("widgets/ModelEdit/ModelEdit",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/template.html",
	"dojo/Evented",
	"dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"dijit/form/RadioButton",
	"dijit/Dialog",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/query",
	"dojo/on",
	"widgets/ModelEdit/ModelEditLogic",
	"widgets/Category/Category",
	"widgets/CategorySelect/CategorySelect",
	"dijit/registry",
	"dijit/ProgressBar",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dojo/parser",
	"widgets/viewx3d/widgets",
	"widgets/Mask/Mask",
	"spolo/data/model",
	"spolo/data/folder/favourite",
	"dojo/domReady!"
],
function(
	declare, WidgetBase, WidgetsInTemplateMixin, TemplatedMixin, template, Evented, 
	ValidationTextBox, Button,RadioButton, Dialog, 
	dom, domStyle, domAttr, lang,arrayUtil, query, on, 
	ModelEditLogic, Category, CategorySelect, registry,ProgressBar, TabContainer, ContentPane, BorderContainer,
	parser, widgets, Mask,model,favourite
)
{
	
	var selectStyleEvent = "onSelectStyle";
	var selectMadeOfEvent = "onSelectMadeOf";
	var selectCategoryEvent = "onSelectCategory";
	var selectBrandEvent = "onSelectBrand";
	var selectRoomEvent = "onSelectRoom";
	var selectSightfeelingEvent = "onSelectSightfeeling";
	var cancelEvent = "onCancel";
	var saveEvent = "onSave";
	var saveSuccessEvent = "onSaveSuccess";
	var saveFailedEvent = "onSaveFailed";
	
	
	var dialog = null;
	
	// 显示Category选择对话框
	function showDialogCategory(json){
		var dialogContent = "<div id=\"dialogCont\" style=\"margin:0px auto;\"></div>"+
			"<div style='margin:30px 0px 0px 100px;'>"+
				"<button type='button' id='modelEditSureBtn'></button>"+
				"<button type='button' id='modelEditCancelBtn'></button>"+
			"</div>";
		dialog = new Dialog({
			title: json["title"],
			style: "width:90%;height:90%;background:#fff",
			content: dialogContent
		});
		var cancelBtn = new Button({
			label:" 取消 ",
			onClick:function(){
				closeDialog();
			}
		},"modelEditCancelBtn");
		var sureBtn = new Button({
			label:" 确定 ",
			onClick:function(){
				var label = json["title"];
				if(selectedData["label"])
				{
					label = selectedData["label"];
				}
				var path = json["path"];
				if(selectedData["path"])
				{
					path = selectedData["path"];
				}
				dthis.set(json["propertyName"],label);
				dthis.set(json["propertyName"]+"Path",path);
				closeDialog();
			}
		},"modelEditSureBtn");
		
		dialog.on("hide",function(){
			closeDialog();
		});
		
		function closeDialog(){
			dialog.hide();
			cancelBtn.destroy();
			sureBtn.destroy();
			cateWidget.destroy();
			dialog.destroy();
		}
		
		var dthis = this;
		var cateWidget = new Category(json).placeAt("dialogCont");
		if(json["selectedPath"] && json["selectedPath"]!="undefined"){
			if(json["selectedPath"] != json["path"])
			{
				var selectedJson = {
					path : json["selectedPath"],
					text : json["selectedName"],
					type : "modellibcategory"
				};
				cateWidget.initialize(selectedJson);
			}else{
			cateWidget.initialize();
			}
		}else{
			cateWidget.initialize();
		}
		
		var selectedData = {};
		on(cateWidget, "onSelectedListChanged", function(res){
			selectedData = res;
		});
		
		dialog.show();
	}
	
	// 显示CategorySelect选择对话框
	function showDialogCategorySelect(json){
		var dialogContent = "<div id=\"dialogCont\" style=\"margin:0px auto;\"></div>"+
			"<div style='margin:30px 0px 0px 100px;'>"+
				"<button type='button' id='modelEditSureBtn'></button>"+
				"<button type='button' id='modelEditCancelBtn'></button>"+
			"</div>";
		dialog = new Dialog({
			title: json["title"],
			style: "width:90%;height:90%;background:#fff",
			content: dialogContent
		});
		var cancelBtn = new Button({
			label:" 取消 ",
			onClick:function(){
				closeDialog();
			}
		},"modelEditCancelBtn");
		var sureBtn = new Button({
			label:" 确定 ",
			onClick:function(){
				var text = json["title"];
				if(json["selectedName"])
				{
					text = json["selectedName"];
				}
				if(selectedData["text"])
				{
					text = selectedData["text"];
				}
				var path = json["path"];
				if(json["selectedPath"])
				{
					path = json["selectedPath"];
				}
				if(selectedData["path"])
				{
					path = selectedData["path"];
				}
				dthis.set(json["propertyName"],text);
				dthis.set(json["propertyName"]+"Path",path);
				closeDialog();
			}
		},"modelEditSureBtn");
		
		dialog.on("hide",function(){
			closeDialog();
		});
		
		function closeDialog(){
			dialog.hide();
			cancelBtn.destroy();
			sureBtn.destroy();
			cateWidget.destroy();
			dialog.destroy();
		}
		
		var dthis = this;
		var cateWidget = new CategorySelect(json).placeAt("dialogCont");
		if(json["selectedPath"] && json["selectedPath"]!="undefined"){
			var selectedJson = {
				path : json["selectedPath"],
				text : json["selectedName"]
			};
			console.log(selectedJson)
			cateWidget.initialize(selectedJson);
		}else{
			cateWidget.initialize();
		}
		
		var selectedData = {};
		on(cateWidget, "onSelectedItemClick", function(res){
			console.log(res);//false
			selectedData = res;
		});
		
		dialog.show();
	}
	
	
	//初始化属性
	function initModelProperties(dthis){
		// disabled button
		dthis.modelEditLogic.getModelProperties(function(json){
			var stylePath = json["stylePath"];
			var madeOfPath = json["madeOfPath"];
			var categoryPath = json["categoryPath"];
			var brandPath = json["brandPath"];
			var roomPath = json["roomPath"];
			var sightfeelingPath = json["sightfeelingPath"];
			dthis.set("resourceName",json["resourceName"]);
			dthis.set("publishAuthor",json["publishAuthor"]);
			dthis.set("publishdate",json["publishdate"]);
			dthis.set("stylePath",stylePath);
			dthis.set("madeOfPath",madeOfPath);
			dthis.set("categoryPath",categoryPath);
			dthis.set("brandPath",brandPath);
			dthis.set("roomPath",roomPath);
			dthis.set("sightfeelingPath",sightfeelingPath);
			dthis.set("price",json["price"]);
			dthis.set("keyInfo",json["keyInfo"]);
			dthis.set("introduction",json["introduction"]);
			
			dthis.modelEditLogic.getModelCategory(categoryPath,function(data){
				if(data==""){
					data = dthis["category"];
				}
				dthis.set("category",data);
				// registry.byId("_category_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.categoryNode.set("disabled","");
				}
				
			});
			dthis.modelEditLogic.getModelStyle(stylePath,function(data){
				if(data==""){
					data = dthis["style"];
				}
				dthis.set("style",data);
				// registry.byId("_style_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.styleNode.set("disabled","");
				}
			});
			dthis.modelEditLogic.getModelMadeOf(madeOfPath,function(data){
				if(data==""){
					data = dthis["madeOf"];
				}
				dthis.set("madeOf",data);
				// registry.byId("_madeOf_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.madeOfNode.set("disabled","");
				}
			});
			dthis.modelEditLogic.getModelBrand(brandPath,function(data){
				if(data==""){
					data = dthis["brand"];
				}
				dthis.set("brand",data);
				// registry.byId("_brand_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.brandNode.set("disabled","");
				}
			});
			dthis.modelEditLogic.getModelRoom(roomPath,function(data){
				if(data==""){
					data = dthis["room"];
				}
				dthis.set("room",data);
				// registry.byId("_room_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.roomNode.set("disabled","");
				}
			});
			dthis.modelEditLogic.getModelSightfeeling(sightfeelingPath,function(data){
				if(data==""){
					data = dthis["sightfeeling"];
				}
				dthis.set("sightfeeling",data);
				// registry.byId("_sightfeeling_btn").set("disabled","");
				if(dthis.granted==true){
					dthis.sightfeelingNode.set("disabled","");
				}
			});
			
		});
		dthis.btnChangePreview.onClick();
		
		//初始化模型地址
		initModelPathNode.call(dthis);
		
	}
	//初始化模型地址
	function initModelPathNode(){
		var dthis = this;
		//填充模型地址
		setModelPath.call(dthis);
		//模型地址事件
		modelPathEvent.call(dthis);
	}
	//填充模型地址
	function setModelPath(){
		var dthis = this;
		dthis.copyModelPathNode.innerHTML = dthis.json["path"];
	}
	//绑定事件给模型地址
	function modelPathEvent(){
		var dthis = this;
		//绑定点击事件
		on(dthis.copyModelPathNode,"click",function(){
			SelectText(this);
		});
	}
	//选中文本
	function SelectText(text) {
		if ($.browser.msie) {
			var range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		} else if ($.browser.mozilla || $.browser.opera) {
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		} else if ($.browser.safari) {
			var selection = window.getSelection();
			selection.setBaseAndExtent(text, 0, text, 1);
		}
	}
	
	//获取用户选择的下载模型的类型
	function getUserDownloadType(){
		var dthis = this;
		var type = "";
		 var formWidgets = registry.findWidgets(query(".loadTypeList")[0]);
		 arrayUtil.forEach(formWidgets,function(item,i){
			if(item.get("checked")==true){
				type = item.get("value");
			}
		 });
		 return type;
		//console.log(formWidgets);
	}
	
	//获取文件信息
	function getUpdateFileInfo(inputFileNode){
		var dthis = this;
		var fileInfo = new Object();
		if(inputFileNode && inputFileNode.files){
			var sceneJsonFile = inputFileNode.files[0];
			if(sceneJsonFile){
				//文件名称
				fileInfo.fileName = sceneJsonFile.name != undefined ? sceneJsonFile.name : "未选择";
				//文件大小
				fileInfo.fileSize = sceneJsonFile.size != undefined ? sceneJsonFile.size : 0;
			}
			
		}
		return fileInfo;
	}
	//设置文件信息
	function setUpdateFileInfo(updatefileInfo){
		var dthis = this;
		if(updatefileInfo){
			setUpdateFileName.call(dthis,updatefileInfo.fileName);
		}
	}
	//设置文件名称
	function setUpdateFileName(fileName){
		var dthis = this;
		if(fileName){
			dthis.updateFileNameNode.innerHTML = fileName;
		}
	}
	//重置进度条
	function resetProgress(){
		var dthis = this;
		setProgressValue.call(dthis,0);
	}
	//设置进度条进度
	function setProgressValue(point){
		var dthis = false;
		if(point){
			dthis.updateFileProgressNode.set({value: point});
		}
	}
	//设置收藏图标
	function setFavModel(){
		var dthis = this;
		domStyle.set(dthis.favoriteModelNode,"display","block");
		domStyle.set(dthis.favoritedModelNode,"display","none");
		
	}
	//设置已经收藏的图标
	function setFavedModel(){
		var dthis = this;
		domStyle.set(dthis.favoriteModelNode,"display","none");
		domStyle.set(dthis.favoritedModelNode,"display","block");	
	}
	
	
	return declare("widgets/ModelEdit/ModelEdit", [ WidgetBase, WidgetsInTemplateMixin, TemplatedMixin, Evented ], {
		
		resourceName: "未命名",
		style: "请选择风格",
		stylePath: "",
		madeOf: "请选择主材",
		madeOfPath: "",
		category: "请选择分类",
		categoryPath: "",
		brand:"请选择品牌",
		brandPath:"",
		room:"请选择居室类型",
		roomPath:"",
		sightfeeling:"请选择视觉感受",
		sightfeelingPath:"",
		price:"0.00",
		keyInfo:"",
		introduction:"请输入属性介绍",
		path: "",
		publishAuthor:"",
		publishdate:"",
		granted:true,//默认是有权限的
		
		constructor: function(json){		
			//根据params中的path缓冲一个model对象
			this.json = json;
			window.modelEdit = this;
			this.modelEditLogic = new ModelEditLogic(this.json["path"]);
		},
		
		templateString: template,
		
		postCreate: function(){
			this.inherited(arguments);
			initModelProperties(this);
		},
		
		// 点击保存按钮
		__onSaveClick: function(e){
			var json = {
				resourceName : this.get('resourceName'),
				publishAuthor : this.get('publishAuthor'),
				publishdate : this.get('publishdate'),
				style: this.get("style"),
				stylePath : this.get('stylePath'),
				madeOf : this.get("madeOf"),
				madeOfPath : this.get('madeOfPath'),
				category : this.get("category"),
				categoryPath : this.get('categoryPath'),
				brand : this.get("brand"),
				brandPath : this.get('brandPath'),
				room : this.get("room"),
				roomPath : this.get('roomPath'),
				sightfeeling : this.get("sightfeeling"),
				sightfeelingPath : this.get('sightfeelingPath'),
				price : this.get('price'),
				keyInfo : this.get('keyInfo'),
				introduction : this.get('introduction')
			};
			var dthis = this;
			function saveSuccess(data){
				dthis.emit(saveSuccessEvent, json);
			}
			function errorBack(error){
				dthis.emit(saveFailedEvent, error);
			}
			this.emit(saveEvent,{});
			this.modelEditLogic.save(json, saveSuccess, errorBack);
			//发送当前修改的名字
			if(json["resourceName"]){
				Spolo.dialogEmit("resetResoureName",json["resourceName"]);
			}else{
				throw("json['resourceName'] is not exit ");
			}
			Spolo.dialogEmit("modelPreview");//发出模型预览图的事件
		},
		
		__onBackClick: function(e){
			this.emit(cancelEvent, {});
		},
		
		// 选择模型风格
		_selectStyle:function(){
			this.emit(selectStyleEvent, {});
			showDialogCategorySelect.call(this,{
				title1: "选择风格",
				title: "请选择风格",
				path : "/content/modellibcategory/modelstyle",
				propertyName : "style",
				selectedName : this.get("style"),
				selectedPath : this.get("stylePath")
			});
		},
		
		// 选择模型主材
		_selectMadeOf:function(){
			this.emit(selectMadeOfEvent, {});
			showDialogCategory.call(this,{
				title1: "选择主材",
				title: "请选择主材",
				path : "/content/modellibcategory/modelmadeof",
				propertyName : "madeOf",
				selectedName : this.get("madeOf"),
				selectedPath : this.get("madeOfPath")
			});
		},
		
		// 选择分类
		_selectCategory:function(){
			this.emit(selectCategoryEvent, {});
			showDialogCategory.call(this,{
				title1: "选择分类",
				title: "请选择分类",
				path : "/content/modellibcategory/modelcategory",
				propertyName : "category",
				selectedName : this.get("category"),
				selectedPath : this.get("categoryPath")
			});
		},
		
		// 选择品牌
		_selectBrand:function(){
			this.emit(selectBrandEvent, {});
			showDialogCategory.call(this,{
				title1: "选择品牌",
				title:"请选择品牌",
				path : "/content/modellibcategory/modelbrand",
				propertyName : "brand",
				selectedName : this.get("brand"),
				selectedPath : this.get("brandPath")
			});
		},
		
		// 选择居室类型
		_selectRoom:function(){
			this.emit(selectRoomEvent, {});
			showDialogCategorySelect.call(this,{
				title1: "选择居室类型",
				title:"请选择居室类型",
				path : "/content/modellibcategory/room",
				propertyName : "room",
				selectedName : this.get("room"),
				selectedPath : this.get("roomPath")
			});
		},
		
		// 选择视觉感受
		_selectSightfeeling:function(){
			this.emit(selectSightfeelingEvent, {});
			showDialogCategorySelect.call(this,{
				title1: "选择视觉感受",
				title:"请选择视觉感受",
				path : "/content/modellibcategory/sightfeeling",
				propertyName : "sightfeeling",
				selectedName : this.get("sightfeeling"),
				selectedPath : this.get("sightfeelingPath")
			});
		},
		
		// 点击切换预览方式
		_changePreview:function(){
			var dthis = this;
			var label = "查看3D效果";
			var curLabel = this.btnChangePreview.label;
			if(label==curLabel){
				domStyle.set(this.web3dNode, "display","block");
				domStyle.set(this.imageNode, "display","none");
				this.web3dNode.innerHTML = "<iframe name=\"web3d\" frameborder=\"no\" border=\"0\" marginwidth=\"0\" "+
										"marginheight=\"0\" scrolling=\"no\" allowtransparency=\"yes\" style=\"width:400px;height:300px\" "+
										"src=\"/widgets/viewx3d/viewX3D.html?path="+this.path+"\"></iframe> ";
				label = "查看效果图";
			}else{
				domStyle.set(this.web3dNode, "display","none");
				domStyle.set(this.imageNode, "display","block");
				dthis.modelEditLogic.getPreview(lang.hitch(dthis,dthis.setPreview),function(error){
					var img =  "/modules/scenedetail/images/nopreview.jpg";
					dthis.setPreview(img);
				});
			}
			this.btnChangePreview.set("label", label);
		},
		_updatePreview:function(){
			this.emit("updatePreview");
		},
		
		_changeImage:function(){
			this.fileInputNode.click();
		},
		
		_fileSelected:function(){
			var file = this.fileInputNode.value;
			var formId = this.previewForm.id;
			
			Mask.show();
			
			var options = {
				resumable : true,
				load : lang.hitch(this,function(data){
					if(data.suc)
					{
						this.modelEditLogic.getPreview(
							lang.hitch(this,
								function(data){
									this.setPreview(data);
									Spolo.notify({
										"text" : "图片更换成功！",
										"type" : "success",
										"timeout" : 1000
									});
									Mask.hide();
								}
							),
							function(error){
								console.log(error);
							}
						);
						//dom.byId("info").innerHTML = "成功!";
					}
					else
					{
						//dom.byId("info").innerHTML = data.reason;
						//dom.byId("info").innerHTML = "ERROR:" + data.reason.replace(new RegExp("\\n",'g'),"\n<BR>").replace(new RegExp("\\r",'g'),"\r<BR>");
					}
				}),
				error : function(err){
					//dom.byId("info").innerHTML = "ERROR:" + err;
				}
			};
			this.modelEditLogic.uploadImg(formId,options);
			// this.btnImageIsSave = true;
			// this.btnChangeImage.set("label","<font color='red'>保存</font>效果图");
			// domStyle.set(this.btnChangeImage, "color", "#f00");
		},
		//下载模型按钮点击
		_downloadModel : function(evt){
			//获取下载类型
			var downloadType = getUserDownloadType.call(this);
			//调用下载api
			this.modelEditLogic.downloadModel(downloadType);
		},
		//点击选择更新文件
		_selectModelFile : function(){
			//模拟点击更新模型form表单中的文件选择器
			this.updateFileInputNode.click();
		},
		//当文件选择器中的文件改变 
		_onUpdateFileChange : function(){
			//文件改变了，获取文件信息
			var fileInfo = getUpdateFileInfo.call(this,this.updateFileInputNode);
			//显示文件信息，
			setUpdateFileInfo.call(this,fileInfo);
			//重置进度条
			resetProgress.call(this);
		},
		//开始更新
		_startUpdateModel : function(){
			//判断文件是否合法
			if(this.updateFileInputNode.value == "")
			{
				Spolo.notify({
					"text" : "请您首先选择上传的文件！",
					"type" : "error",
					"timeout" : 1000
				});
			}
			else
			{
				var filename = this.updateFileInputNode.value;
				var pos = filename.lastIndexOf(".");
				var lastname = filename.substring(pos,filename.length);
				//不合法要求用户重新选择文件,提示文件规范
				if(lastname.toLowerCase()!=".obj")
				{
					Spolo.notify({
						"text" : "您上传的文件类型为" + lastname + ",文件必须是以.obj结尾",
						"type" : "error",
						"timeout" : 1000
					});
				}
				else{
					//合法的话调用api开始更新
					this.modelEditLogic.updateModel(this.updateFileFormNode);
				}
			}
			
		},
		//收藏模型
		_favoriteModel : function(){
			//Spolo.getRoot().spshowmask();
			var dthis = this;
			favourite.addFavModel(
				this.json["path"],
				function(){
					Spolo.notify({
						"text" : "模型收藏成功",
						"type" : "success",
						"timeout" : 1000
					});
					setFavedModel.call(dthis);
					//Spolo.getRoot().sphidemask();
				},
				function(error){
					console.log("error"+ error);
				}
			);
			
		},
		//取消收藏
		__favoritedModel : function(){
			//Spolo.getRoot().spshowmask();
			var dthis = this;
			favourite.delFavModel(
				this.json["path"],
				function(){
					Spolo.notify({
						"text" : "取消收藏成功",
						"type" : "success",
						"timeout" : 1000
					});
					setFavModel.call(dthis);
					//Spolo.getRoot().sphidemask();
				},
				function(error){
					console.log("error"+ error);
				}
			);
			
		},
		// 模型名称
		_setResourceNameAttr: function(value){
			this.resourceName = value;
			this.resourceNameNode.set("value", value);
		},
		_getResourceNameAttr: function(){
			return this.resourceNameNode.value;
		},
		
		//发布者名称
		_setPublishAuthorAttr: function(value){
			this.publishAuthor = value;
			this.publishAuthorNode.set("value", value);
		},
		_getPublishAuthorAttr: function(){
			return this.publishAuthorNode.value;
		},
		//发布时间
		_setPublishdateAttr: function(value){
			this.publishdate = value;
			this.publishDateNode.set("value", value);
		},
		_getPublishdateAttr: function(){
			return this.publishDateNode.value;
		},
		// 风格名称
		_setStyleAttr: function(value){
			this.style = value;
			this.styleNode.set("label", value);
		},
		_getStyleAttr: function(){
			return this.styleNode.label;
		},
		// 风格路径
		_setStylePathAttr: function(value){
			this.stylePath = value;
			this.stylePathNode.value = value;
		},
		_getStylePathAttr: function(){
			return this.stylePathNode.value;
		},
		
		
		// 主材名称
		_setMadeOfAttr: function(value){
			this.madeOf = value;
			this.madeOfNode.set("label", value);
		},
		_getMadeOfAttr: function(){
			return this.madeOfNode.label;
		},
		// 主材路径
		_setMadeOfPathAttr: function(value){
			this.madeOfPath = value;
			this.madeOfPathNode.value = value;
		},
		_getMadeOfPathAttr: function(){
			return this.madeOfPathNode.value;
		},
		
		
		// 分类全名
		_setCategoryAttr: function(value){
			this.category = value;
			this.categoryNode.set("label", value);
		},
		_getCategoryAttr: function(){
			return this.categoryNode.label;
		},
		// 分类路径
		_setCategoryPathAttr: function(value){
			this.categoryPath = value;
			this.categoryPathNode.value = value;
		},
		_getCategoryPathAttr: function(){
			return this.categoryPathNode.value;
		},
		
		
		// 品牌
		_setBrandAttr: function(value){
			this.brand = value;
			this.brandNode.set("label", value);
		},
		_getBrandAttr: function(){
			return this.brandNode.label;
		},
		// 品牌路径
		_setBrandPathAttr: function(value){
			this.brandPath = value;
			this.brandPathNode.value = value;
		},
		_getBrandPathAttr: function(){
			return this.brandPathNode.value;
		},
		
		
		// 居室类型
		_setRoomAttr: function(value){
			this.room = value;
			this.roomNode.set("label", value);
		},
		_getRoomAttr: function(){
			return this.roomNode.label;
		},
		// 居室类型路径
		_setRoomPathAttr: function(value){
			this.roomPath = value;
			this.roomPathNode.value = value;
		},
		_getRoomPathAttr: function(){
			return this.roomPathNode.value;
		},
		
		// 视觉感受
		_setSightfeelingAttr: function(value){
			this.sightfeeling = value;
			this.sightfeelingNode.set("label", value);
		},
		_getSightfeelingAttr: function(){
			return this.sightfeelingNode.label;
		},
		// 视觉感受路径
		_setSightfeelingPathAttr: function(value){
			this.sightfeelingPath = value;
			this.sightfeelingPathNode.value = value;
		},
		_getSightfeelingPathAttr: function(){
			return this.sightfeelingPathNode.value;
		},
		
		// 视觉感受
		_setIntroductionAttr: function(value){
			this.introduction = value;
			this.introductionNode.set("value", value);
		},
		_getIntroductionAttr: function(){
			return this.introductionNode.value;
		},
		
		// 价格
		_setPriceAttr: function(value){
			this.price = value;
			this.priceNode.set("value", value);
		},
		_getPriceAttr: function(){
			return this.priceNode.value;
		},
		//关键字
		_setKeyInfoAttr: function(value){
			this.keyInfo = value;
			this.keyInfoNode.set("value", value);
		},
		_getKeyInfoAttr: function(){
			return this.keyInfoNode.value;
		},
		setPreview: function(url){
			this.previewNode.src = url;
		},
		
		//设置按钮隐藏，属性不可编辑
		setForbidEdit: function()
		{
			domStyle.set(this.saveNode,"display","none");
			domStyle.set(this.cancelNode,"display","none");
			this.btnChangeImage.set("style","display:none");
			this.resourceNameNode.set("disabled",true);
			this.priceNode.set("disabled",true);
			this.keyInfoNode.set("disabled",true);
			this.introductionNode.set("disabled",true);
			this.styleNode.set("disabled","disabled");
			this.madeOfNode.set("disabled","disabled");
			this.categoryNode.set("disabled","disabled");
			this.brandNode.set("disabled","disabled");
			this.roomNode.set("disabled","disabled");
			this.sightfeelingNode.set("disabled","disabled");
			this.startUpdateModelNode.set("disabled","disabled");
			this.selectUpdateFileNode.set("disabled","disabled");
		},
		//设置收藏图标
		setFavorModel : function(){
			setFavModel.call(this);
			
		},
		//设置已经收藏的图标
		setFavoredModel : function(){
			setFavedModel.call(this);	
		}
		/**/
	});	
	
	
});