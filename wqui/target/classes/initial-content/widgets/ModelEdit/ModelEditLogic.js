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
	"dojo/_base/declare", "dojo/_base/lang",
	"spolo/data/model",	"spolo/data/folder", "dojo/_base/array","widgets/Mask/Mask","spolo/data/folder/favourite"
],
function(
	declare, lang, 
	model, folder_cls, arrayUtil,Mask,favourite
)
{
	function getFolderObj(){
		if(!folderObj){
			var folderObj = new folder_cls("/content/modellibcategory");
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
					var msPath = this.modelObj.getStylePath();
					var mdoPath = this.modelObj.getMadeOfPath();
					var rcPath = this.modelObj.getCategoryPath();
					var brandPath = this.modelObj.getBrandPath();
					var roomPath = this.modelObj.getRoomPath();
					var sightfeelingPath = this.modelObj.getSightfeelingPath();
					var price = this.modelObj.getPrice();
					var keyInfo = this.modelObj.getKeyInfo();
					var introduction = this.modelObj.getIntroduction();
					var res = {
						resourceName: rName,
						style: "请选择风格",
						stylePath: msPath,
						madeOf: "请选择主材",
						madeOfPath: mdoPath,
						category: "请选择分类",
						categoryPath: rcPath,
						brand: "请选择品牌",
						brandPath: brandPath,
						room: "请选择居室类型",
						roomPath: roomPath,
						sightfeeling: "请选择视觉感受",
						sightfeelingPath: sightfeelingPath,
						introduction: introduction,
						price:price,
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
		
		getModelCategory : function(path, callback){
			getFullNameFromFolder(path, callback);
		},
		
		getModelStyle : function(path, callback){
			getFullNameArrayFromFolder(path, callback);
		},
		
		getModelMadeOf : function(path, callback){
			getFullNameFromFolder(path, callback);
		},
		
		getModelBrand : function(path, callback){
			getFullNameFromFolder(path, callback);
		},
		
		getModelRoom : function(path, callback){
			getFullNameArrayFromFolder(path, callback);
		},
		
		getModelSightfeeling : function(path, callback){
			getFullNameArrayFromFolder(path, callback);
		},
		
		save : function(json, callback, errorback){
			
			if(json["resourceName"]!=undefined&&json["resourceName"]!="undefined"){
				this.modelObj.setResourceName(json["resourceName"]);
			};
			if(json["stylePath"]!=undefined&&json["stylePath"]!="undefined"){
				this.modelObj.setStylePath(json["stylePath"]);
			};
			if(json["madeOfPath"]!=undefined&&json["madeOfPath"]!="undefined"){
				this.modelObj.setMadeOfPath(json["madeOfPath"]);
			};
			if(json["categoryPath"]!=undefined&&json["categoryPath"]!="undefined"){
				this.modelObj.setCategoryPath(json["categoryPath"]);
			};
			if(json["brandPath"]!=undefined&&json["brandPath"]!="undefined"){
				this.modelObj.setBrandPath(json["brandPath"]);
			};
			if(json["roomPath"]!=undefined&&json["roomPath"]!="undefined"){
				this.modelObj.setRoomPath(json["roomPath"]);
			};
			if(json["sightfeelingPath"]!=undefined&&json["sightfeelingPath"]!="undefined"){
				this.modelObj.setSightfeelingPath(json["sightfeelingPath"]);
			};
			if(json["price"]!=undefined&&json["price"]!="undefined"){
				this.modelObj.setPrice(json["price"]);
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
		//更新模型
		updateModel : function(formId){
			this.modelObj.updatamodelFromobj(formId,
			{
				load : function(data)
				{
					if(data.suc)
					{
						Spolo.notify({
							"text" : "更新成功!",
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
		}
	});

	return defClass;
	
});