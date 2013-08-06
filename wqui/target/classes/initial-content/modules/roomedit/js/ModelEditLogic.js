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
 
define(
[
	"dojo/_base/declare",
	"dojo/_base/lang",
	"spolo/data/model",
	"spolo/data/folder",
	"dojo/_base/array",
	"widgets/Mask/Mask",
	"spolo/data/folder/favourite",
	"dijit/Dialog",
	"dijit/form/Button",
	"widgets/Category/Category",
	"widgets/CategorySelect/CategorySelect",
	"dojo/on"
],
function(
	declare, lang, 
	model, folder_cls, arrayUtil,Mask,favourite,
	Dialog, Button, Category, CategorySelect, 
	on
)
{
	function getFolderObj(){
		if(!folderObj){
			var folderObj = new folder_cls("/content/roomlibcategory");
		}
		return folderObj;
	}
	

	// 获取模型的风格
	function getFullNameFromFolder(path, callback){
		if(!path || path=="undefined"){
			callback("");
			return;
		}
		var arrPath = path.split("/");
		var baseUrl = arrPath[3];
		arrPath.splice(0,4);
		if(arrPath.length == 0)
		{
			callback("");
			return;
		}
		var resourceNameArray = [];
		var count = 0;
		var total = arrPath.length;
		var foldPath = baseUrl;
		for(var i=0; i<arrPath.length; i++){
			foldPath += "/"+arrPath[i];
			getRnameByPath(i, foldPath);
		}
		
		// 根据路径获取resourceName
		function getRnameByPath(index, path){
			var foldNode = getFolderObj();
			var node = foldNode.spnode.getNode(path);
			node.ensureData({
				success:function(data){
					var name = data.getProperty("resourceName");
					checkGetRnameCount(index, name);
				},
				failed:function(error){
					console.log(error);
				}
			});
		}

		function checkGetRnameCount(index, name){
			resourceNameArray[index] = name;
			count ++;
			if(count == total){
				var res = "";
				for(var key=0; key<resourceNameArray.length; key++){
					res += resourceNameArray[key]+">>";
				}
				res = res.substring(0,res.length-2);
				callback(res);
			}
		}
	}
	
	// 获取模型的风格
	function getFullNameArrayFromFolder(pathArray, callback){
		if(!pathArray || pathArray=="undefined"){
			callback("");
			return;
		}
		var newPathArray = pathArray.split(";");
		var name = "";
		arrayUtil.forEach(newPathArray, function(path){
			var arrPath = path.split("/");
			var baseUrl = arrPath[2];
			arrPath.splice(0,3);
			if(arrPath.length == 1)
			{
				callback("");
				return;
			}
			var resourceNameArray = [];
			var count = 0;
			var total = arrPath.length;
			var foldPath = baseUrl;
			for(var i=1; i<arrPath.length; i++){
				foldPath += "/"+arrPath[0]+"/"+arrPath[i];
				getRnameByPath(i, foldPath);
			}
			
			
			// 根据路径获取resourceName
			function getRnameByPath(index, path){
				function getFolderObjContent(){
					if(!folderObjContent){
						var folderObjContent = new folder_cls("/content");
					}
					return folderObjContent;
				}
				var foldNode = getFolderObjContent();
				var node = foldNode.spnode.getNode(path);
				node.ensureData({
					success:function(data){
						var resname = data.getProperty("resourceName");
						name += resname + ";";
						callback(name);
					},
					failed:function(error){
						console.log(error);
					}
				});
			}
		});
	}
	
	function format(obj){
			if(obj<10)
				return "0" +""+ obj;
			else
				return obj;
	}
	
	// 初始化模型基本属性
	function initModelProperties(callback){
        this.modelObj.initData(
			lang.hitch(this,
				function(spnode){
					var rName = this.modelObj.getResourceName();
					var _publishAuthor = this.modelObj.getPublishAuthor();
					var publishAuthor = Spolo.decodeUname(_publishAuthor);
					if(!publishAuthor){
						publishAuthor = "未知";
					}
					var publishdate;
					var _publishdate = this.modelObj.getPublishdate();
					if(!_publishdate){
						publishdate = "未知";
					}
					else
					{
						var __publishdate = new Date(_publishdate);
						publishdate = format(__publishdate.getFullYear()) + "."
									+ format(__publishdate.getMonth()+1) + "."
									+ format(__publishdate.getDate()) + " "
									+ format(__publishdate.getHours()) + ":"
									+ format(__publishdate.getMinutes()) + ":"
									+ format(__publishdate.getSeconds());
					}
                    var roomPath = this.modelObj.getRoomPath(); 					
					var area = this.modelObj.getArea();
					if(area == undefined)
					{
						area = "0平方米";
					}
					var keyInfo = this.modelObj.getKeyInfo();
					var introduction = this.modelObj.getIntroduction();
					var res = {
                        room: "请选择居室类型", 
                        roomPath: roomPath, 
						resourceName: rName,
						introduction: introduction,
						area:area,
						keyInfo:keyInfo,
						publishAuthor:publishAuthor,
						publishdate:publishdate
					};
					callback(res);
				}
			)
		);
	}
	
	var defClass = declare("widgets.ModelEdit.ModelEditLogic",[],{
		
		constructor : function(modelPath){
			this.modelpath = modelPath;
			this.modelObj = new model(modelPath);
			this.folderObj = getFolderObj();
		},
		
		getModelProperties : function(callback){
			initModelProperties.call(this,callback);
		},
        
        getModelRoom : function(path, callback){ 
                getFullNameArrayFromFolder(path, callback); 
        }, 
		
		save : function(json, callback, errorback){
			
			if(json["resourceName"]!=undefined&&json["resourceName"]!="undefined"){
				this.modelObj.setResourceName(json["resourceName"]);
			};
            if(json["roomPath"]!=undefined&&json["roomPath"]!="undefined"){ 
                    this.modelObj.setRoomPath(json["roomPath"]); 
            }; 
			if(json["area"]!=undefined&&json["area"]!="undefined"){
				this.modelObj.setArea(json["area"]);
			};
			if(json["keyInfo"]!=undefined&&json["keyInfo"]!="undefined"){
				this.modelObj.setKeyInfo(json["keyInfo"]);
			};
			if(json["introduction"]!=undefined&&json["introduction"]!="undefined"){
				this.modelObj.setIntroduction(json["introduction"]);
			};
		
			this.modelObj.save(
				function(data){
                    callback(data);
				},
				function(error){
                    errorback(error);
				}
			); 
		},
		
		uploadImg : function(formID,options){
			
			this.modelObj.uploadPreview(formID,options);
		},
		getPreview: function(callback,errorback){
			model.getImage(this.modelpath,callback,errorback);
		},
		//下载模型
		downloadModel : function(downloadType){
			model.download(this.modelpath,downloadType);
		},
		
		getFormat : function(callback, errorback){
			model.getFormat(this.modelpath, callback, errorback);
		},
		
		setModelDownCount : function(callback, errorback){
			var _this = this;
			_this.modelObj.initData(
				function(){
					_this.modelObj.setDownloadCount();
					_this.modelObj.save(
						function(){
							var countNum = _this.modelObj.getDownloadCount();
							console.log(countNum);
							callback(countNum);
						},
						function(error){
							throw error;
						}
					);
				},
				function(error){
					throw error;
				}
			)
		},
		
		getModelDownCount : function(callback, errorback){
			var _this = this;
			_this.modelObj.initData(
				function(data){
					var countNum = _this.modelObj.getDownloadCount();
					console.log(countNum);
					callback(countNum);
				},
				function(error){
					throw error;
				}
			)
		},
		
		
		//更新模型
		updateModel : function(msg,formId){
			this.modelObj.updatamodelFromobj(formId,
			{	
				msg:msg,
				load : function(data)
				{
					if(data.suc)
					{
						Spolo.notify({
							"text" : "模型更新成功",
							"type" : "success",
							"timeout" : 1000
						});
						Spolo.getRoot().sphidemask();
					}
					else
					{	
						console.log(data);
					}
				},
				error : function(err)
				{
					console.log(err);
				}
			});
			Spolo.getRoot().spshowmask();
		},
				
		showDialogCategory : function(json){
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
					var returnJson = {};
					returnJson["label"] = label;
					returnJson["path"] = path;
					json["success"](returnJson);
					// dthis.set(json["propertyName"],label);
					// dthis.set(json["propertyName"]+"Path",path);
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
		},
		
		// 显示CategorySelect选择对话框
		showDialogCategorySelect : function(json){
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
					var returnJson = {};
					returnJson["text"] = text;
					returnJson["path"] = path;
					json["success"](returnJson);
					// dthis.set(json["propertyName"],text);
					// dthis.set(json["propertyName"]+"Path",path);
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
	});

	return defClass;
	
});