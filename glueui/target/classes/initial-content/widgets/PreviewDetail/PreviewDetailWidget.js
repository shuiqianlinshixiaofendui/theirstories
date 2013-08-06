/* 
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */

define("widgets/PreviewDetail/PreviewDetailWidget",
	[
		"dojo/_base/declare",
		"widgets/PreviewDetail/PreviewDetail",
		"spolo/data/preview",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"spolo/data/model",
		"widgets/Mask/Mask",
		"spolo/data/queryClass",
		"dijit/form/NumberSpinner",
		"dijit/form/Button",
		"dijit/registry",
		"dijit/Dialog",
		"dijit/form/Textarea",
		"spolo/data/folder",
		"dijit/layout/ContentPane",
		"dijit/layout/BorderContainer",
		"spolo/data/folder/favourite",
		"dojo/json",
		"dojo/dom-style",
		"spolo/data/folder/previewset",
		"spolo/data/user",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-traverse"
	],function(
		declare, PreviewDetail, previewClass, 
		query, on, dom, lang,arrayUtil, domConstruct,domAttr, modelClass, Mask, queryClass,NumberSpinner,
		Button,registry, Dialog, Textarea, folderClass,ContentPane,BorderContainer,favourite,JSON,domStyle,previewset,user
	){
		// var iframe = window.iframe;
		var ifInsteadDialog;
		// 设置UI，在模型列表出现“加入场景”的按钮。
		function initUI(){
			var data = this.models;//所有页返回的数据
			// 控制加入场景功能面板的显示隐藏
			var dthis = this;
			
			var modelpatharray = [];
			if(this.canAddModel == true || this.canAddModel=="true"){
				//打开选择模式
				dthis.listWidget.openSelect();
			}else if(this.canAddModel == false || this.canAddModel=="false"){
				this.setAddModelButton();
				dthis.listWidget.closeSelect();
			}

			// 设置模型的预览图、名称、材质信息
			for(var key in dthis.currentPageData)
			{
				initField.call(dthis,key);
				dthis.listWidget.addDomNode(key,"<div id=\""+key+"check\">检查材质：<img src=\"/widgets/Mask/images/mask_loading.gif\" width=\"13px\" height=\"13px\"></div>");
				modelpatharray.push(key);
			}
			//添加模型的材质信息
			modelClass.checkMaterials(modelpatharray,
				function(data){
					for(var i in data){
						//var field = dthis.listWidget.getField(i,2);
						if(data[i]["check"] == false){
							//dthis.listWidget.setField(field,"<div><span style=\"color:red;\">缺少材质</span></div>");
							query("#"+i+"check").innerHTML("<div><span style=\"color:red;\">缺少材质</span></div>");
						}
						else{
							//dthis.listWidget.setField(field,"<div><span style=\"color:green;\">材质完全</span></div>");
							query("#"+i+"check").innerHTML("<div><span style=\"color:green;\">材质完全</span></div>");
						}
					}
				},
				function(error){
					console.log(error);
				}
			);
			console.log(modelpatharray+"   suzigang" +"  数组的长度是"+ modelpatharray.length);
			function initField(key){
				var dthis = this;
				// 预览图
				// 名称
				var modelNameDom = data[key]["resourceName"];
				var para = {
					nodeType : "div",
					className : "modelName",
					content : modelNameDom,
					style : {
						"position" : "absolute",
						"left" : "145px",
						"top" : "17px"
					}
				};
				dthis.listWidget.addField(key,para);
				if(this.numberSpinner){
					//添加数量控制
					addNumberSpinner.call(dthis,key);
				}
				
				//获取模型的预览图
				modelClass.getImage(
					key,
					function(imgsrc){
						dthis.listWidget.setItemImage(key,imgsrc);
						dthis.emit("modellistReady");
					},
					function(){
						var imgsrc = "/modules/scenedetail/images/nopreview.jpg";
						dthis.listWidget.setItemImage(key,imgsrc);
						dthis.emit("modellistReady");
					}
				);
			}
			// 初始化完毕
			dthis.init = true;
		}
		//初始化是否替换模型窗口
		function initIfInsteadDialog(array){
			var dthis = this;
			if(ifInsteadDialog==undefined){
				var content = domConstruct.create("div",{
					innerHTML : "<label>确认替换？</label>"+
								"<div>"+
									"<button id=\"sure\">确定</button>"+
									"<button id=\"cancel\">取消</button>"+
								"</div>",
				});
				
				ifInsteadDialog = new Dialog({
					title: "是否替换",
					content: content,
					style: "width: 200px;position:relavite;top:20px;",
					onExecute: function(){
						insteadModel.call(dthis,array);
					},
					onCancel: function(){
						this.hide();
					}
				});
				
				var sureBtn = new Button({
					label:"确定",
					onClick:function(){
						ifInsteadDialog.onExecute();
					}
				},"sure");
				var cancelBtn = new Button({
					label:"取消",
					onClick:function(){
						ifInsteadDialog.onCancel();
					}
				},"cancel");
			}
		}
		
		//获取模型的预览图
		function getModelPreview(path){
			var dthis = this;
			modelClass.getImage(
				path,
				function(url){
					dthis.listWidget.setItemImage(path,url);
				},
				function(error){
					var img =  "/modules/scenedetail/images/nopreview.jpg";
					dthis.listWidget.setItemImage(path,img);
				}
			);
		}
		
		function addNumberSpinner(key){
			var mySpinner;
			if(registry.byId(key)){
				mySpinner = registry.byId(key);
			}else{
				mySpinner = new NumberSpinner({
					value: 1,
					smallDelta: 1,
					constraints: { min:1, max:100, places:0 },
					id: key,
					style: "width: 79px;position: absolute;top: 70px;left: 135px;"
				});
			}
			
			this.listWidget.addDomNode(key,mySpinner.domNode);
		}
		//根据id获取数量
		function getModelNumber(key){
			var mySpinner = registry.byId(key);
			var addModelNumber = mySpinner.get("value");
			return addModelNumber;
		}
		// 显示web3d窗口
		function showWeb3d(modelPath){
			if(!modelPath){
				throw("modelPath is undefined!");
				return;
			}
			var html = "<iframe name=\"web3d\" "+
						"frameborder=\"no\" border=\"0\" marginwidth=\"0\" "+
						"marginheight=\"0\" scrolling=\"no\" allowtransparency=\"yes\""+
						" style=\"width:100%;height:500px\" "+
						"src=\"/widgets/viewx3d/viewX3D.html?path="+modelPath+"\"></iframe> ";
			if(this.view3dDialog){
				this.view3dDialog.destroy();
			}
			this.view3dDialog = new Dialog({
				title: "3D",
				content: html,
				style:"width:500px;"
			});
			this.view3dDialog.show();
		}
		
		// 将选中的所有模型添加到场景中
		function addModelsToScene(array){
			if(!this.scene)return;
			var json,key,modelData;
			var dthis = this;
			if(dthis.isGutil){
				var pathArray = new Array();
				for(var j = 0; j < array.length ;j++){
					var keyA = array[j];
					pathArray.push(array[j]);
					var addNumber = getModelNumber.call(dthis,keyA);
					pathArray.push(addNumber);
				}
				scene.addItemsByCount(pathArray, success);
			}else{
				for(var i=0;i<array.length;i++){
					key = array[i];
					var addNumber = getModelNumber.call(dthis,key);
					modelData = this.models[key];
					json = getModel(key,modelData);
					this.scene.addItemsByCount(json,addNumber);
					//this.scene.createItem("MESH",json);
				}
			}
			function success(){
				Mask.hide();
				dthis.emit("onAddModelSuccess");
				Spolo.notify({
					text : "添加模型成功!!",
					type : "success",
					timeout : 1000
				});
			}
			function error(err){
				Mask.hide();
				Spolo.notify({
					text : "添加模型失败!!",
					type : "error",
					timeout : 1000
				});
			}
			this.scene.saveItems(success,error);
		}
		
		//将选中的模型替换现在
		function insteadModel(data){
			var dthis = this;
			
			//获取被替换的节点对象
			var node = dthis.oldModel;
			//通过node和itemArray找到原模型
			var old_Item = getOldItem.call(this,node,dthis.scene.itemArray);
			
			var new_Item = getNewItem.call(this,data,dthis.models);
			if(old_Item == undefined)
			{
				Spolo.notify({
					"text" : "请先选择替换的模型!",
					"type" : "error",
					"timeout" : 1000
				});
			}
			else
			{
				//遮罩
				Mask.show();
				// 获取此scene 中要被替换的Item
				dthis.scene.replaceItem(old_Item, new_Item);
				// 保存操作
				dthis.scene.saveItems(
					function(suc){
						Mask.hide();
						//刷新数据
						dthis.iframe.refreshEditItems();
						Spolo.dialogHide();
					},
					function(e){
						Mask.hide();
						Spolo.notify({
							"text" : "更新失败！",
							"type" : "error",
							"timeout" : 1000
						});
						insteadDialog.hide();
					}
				);
			}
		}
		function getOldItem(node,itemArray){
			var oldItem;
			var resourceName;
			if(typeof node != "object"){
				node = JSON.parse(node);
			}
			arrayUtil.forEach(itemArray,function(item,i){
				if(node["name"]==item["data"]["name"]){
					oldItem = item;
				}
			});
			return oldItem;
		}
		function getNewItem(node,itemArray){
			var dthis = this;
			var newItem;
			if(node){
				if(typeof(node)=="object"){
					for(var pro in node){
						if(typeof(node[pro]) == "string"){
							for(var index in itemArray){
								if(typeof(itemArray[index])=="object"){
									if(index==node[pro]){
										var ID = itemArray[index]["resourceName"];
										var name = itemArray[index]["resourceName"];
										newItem = dthis.scene.createItem("MESH", {"ID" : ID , "name" : name, "type" : "MESH", "referModel" : node[pro]}); 
									}					
								}
							}
						}
					}
				}
			}
			
			
			return newItem;
		}
		
		// 添加模型
		function getModel(key,data){
			// 得到模型的ID和refer
			var json = {
				name : data["resourceName"],
				referModel : key,
				type : "MESH",
				ID:data["ID"]
			};
			return json;
		}
		
		/**
		* 从场景中获取效果图
		*/
		function getPreviewByScene(callback){
			var dthis = this;
			queryClass.query({
				nodePath : dthis.path,
				orderDesc : "jcr:created",
				load : function(data){
					callback.call(dthis,data);
				},
				error : function(error){
					console.error(error);
				}
			});
		}
		
		// 设置场景中的效果图
		function setPreviewImages(){
			var previewData = this.previewData;
			var flag = true;
			for(var key in previewData){
				if(flag){
					this.modelListPath = key;
					flag = false;
				}
				//var preiveDA = key+".image";
				//this.setEffectImg(preiveDA);	// 调用基类的方法
			}
		}
		//获取选中的模型的位置
		function setModellistByModelPath(){
			var dthis = this;
			var modelPath = dthis.modelPath;
			var path = dthis.modelListPath;
			var currentPage = dthis.currentPage;
			var limit = dthis.limit;
			if(modelPath!= undefined && modelPath!=""){
				previewClass.listModelsByGroup({
					path : path,
					start : ((currentPage - 1) * limit),
					length : limit,
					startmodelpath : modelPath,
					success : function(data,count,startmodelindex){
						dthis.currentPage = getCurrentPageByStartModelIndex(limit,startmodelindex);
						setModellist.call(dthis);
						dthis.PaginationWidget.refresh(Math.ceil(count/limit),dthis.currentPage);
					},
					failed : function(err){
						// 刷新分页
						dthis.PaginationWidget.refresh(1);
						console.log(err);
					}	
				});
			}
		}
		//计算模型所在的分页
		function getCurrentPageByStartModelIndex(limit,startmodelindex){
			var currentPage = 1;
			var page = Math.floor(startmodelindex/limit);
			var pageCompare = page*(limit-1);
			if(startmodelindex>pageCompare){
				currentPage = page+1;
			}else{
				currentPage = page;
			}
			if(currentPage<=0){
				currentPage = 1;
			}
			return currentPage;
		}
		//查询成功
		function searchSucc(data,count,limit){
			var dthis = this;
			// 这里缓存一下data,在添加模型时会用到
			//缓存每个访问过的分页中的数据，不能重复
			dthis.currentPageData = data;
			if(data){
				if(dthis.models){
					for(var index in data){
						if(dthis.models[index]){
							
						}else{
							dthis.models[index] = data[index];
						}
					}
				}else{
					dthis.models = data;
				}
			}
			
			
			// 刷新分页
			dthis.PaginationWidget.refresh(Math.ceil(count/limit),dthis.currentPage);
			
			// 存储需要的key
			var array = new Array();
			// 初始化模型列表
			for(var key in data){
				array.push(key);
			}
			// 装载数据至列表
			dthis.listWidget.addItems(array,true);
			
			// 初始化UI
			initUI.call(dthis);
		}
		//查询失败
		function searchFail(err){
			var dthis = this;
			// 刷新分页
			dthis.PaginationWidget.refresh(1);
			console.log(err);
		}
		//获取查询条件
		function getSearchStr(){
			var dthis = this;
			var searchStr = "";
			if(dthis.searchNode != undefined){
				searchStr = domAttr.get(dthis.searchNode,"value");
			}
			return searchStr
		}
		//模糊搜索
		function searchModel(searchStr){
			var dthis = this;
			var path = dthis.modelListPath;
			
			var currentPage = dthis.currentPage
			var limit = dthis.limit;
			var keyWord = "";
			if(dthis.filterValue != undefined){
				keyWord = dthis.filterValue;
			}
			if(searchStr != undefined){
				keyWord = searchStr;
			}
			
			/* previewClass.searchModels({
				"path" : path,
				"keyWord" : keyWord,
				"start" : ((currentPage - 1) * limit),
				"length" : limit,
				"success" : function(data,count){
					searchSucc.call(dthis,data,count,limit);
				},
				"failed" : function(err){
					searchFail.call(dthis,err);
				}
			}); */
			previewClass.searchModels({
					"path" : path,
					"keyWord" : keyWord,
					"startPos" : ((currentPage - 1) * limit),
					"length" : limit,
					"success" : function(data, count){
						dthis.filterValue = keyWord;
						searchSucc.call(dthis,data,count,limit);
					},
					"failed" : function(error){
						searchFail.call(dthis,err);
					}
				});
			
		}
		
		// 初始化效果图的数据
		function setModellist(){
			var dthis = this;
			var path = dthis.modelListPath;
			var currentPage = dthis.currentPage;
			var limit = dthis.limit;
			previewClass.listModelsByGroup({
				path : path,
				start : ((currentPage - 1) * limit),
				length : limit,
				success : function(data,count){
					searchSucc.call(dthis,data,count,limit);
				},
				failed : function(err){
					searchFail.call(dthis,err);
				}	
			});
		}
		
		function getFullNameFromFolder(path, callback){
			if(!path || path=="undefined"){
				callback("");
				return;
			}
			var arrPath = path.split("/");
			var baseUrl = arrPath[2];
			arrPath.splice(0,3);
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
			
			function getContentFolderObj(){
				var folderObj = "";
				if(!folderObj){
					folderObj = new folderClass("/content");
				}
				return folderObj;
			}
			
			// 根据路径获取resourceName
			function getRnameByPath(index, path){
				var foldNode = getContentFolderObj();
				var node = foldNode.spnode.getNode(path);
				node.ensureData({
					success:function(data){
						var name = data.getProperty("resourceName");
						checkGetRnameCount(index, name);
					},
					failed:function(error){
						throw error;
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
							var folderObjContent = new folderClass("/content");
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
		//下载贴图资源
		function downloadPreviewResource(path){
			previewClass.downloadTextures(path)
		}
		//收藏效果图
		function addFavPreview(path){
			var dthis = this;
			favourite.addFavPreview(
				path,
				function(){
					Spolo.notify({
						"text" : "收藏效果图成功",
						"type" : "success",
						"timeout" : 1000
					});
					//Spolo.getRoot().sphidemask();
					setFavedPreview.call(dthis);
				},
				function(error){
					console.log(error);
				}
			);
			//Spolo.getRoot().spshowmask();
		}
		//取消收藏
		function delFavPreview(path){
			var dthis = this;
			favourite.delFavPreview(
				path,
				function(){
					Spolo.notify({
						"text" : "取消收藏成功",
						"type" : "success",
						"timeout" : 1000
					});
					//Spolo.getRoot().sphidemask();
					setFavPreview.call(dthis);
				},
				function(error){
					console.log(error);
				}
			);
		}
		//设置收藏图标
		function setFavPreview(){
			domStyle.set(query(".favpreview")[0],"display","block");
			domStyle.set(query(".favedpreview")[0],"display","none");
			
		}
		//设置已经收藏的图标
		function setFavedPreview(){
			domStyle.set(query(".favpreview")[0],"display","none");
			domStyle.set(query(".favedpreview")[0],"display","block");	
		}
		//管理效果图页面
		function managePreview(path){
			var dthis = this;
			var url = "/modules/previewedit/index.html";
			var dialogData = {
				widthradio: 0.9,
				heightradio:0.9,
				id:path+"previewedit",
				title:"效果图编辑",
				url:url,
				data: {	
					"path":path
				},
				callback:function(spdialog){
					spdialog.on("seepreviewlist",function()
					{
						window.location.reload();
						Spolo.dialogEmit("previewlist");
						//dthis.constructor.superclass.initslideshow.apply(dthis,arguments);//继承父类调用方法
					});
					spdialog.on("delpreviewsucc",function()
					{
						window.location.reload();
						Spolo.dialogEmit("delsucc");
					});
				}
			};
			Spolo.dialog(dialogData);
		}
		
		function delPreviewPic(url)
		{
			//删除效果图
			if(url){
				//删除时弹出提示的对话框
				var div = domConstruct.create("div",
					{
						innerHTML:"<center><label>确定删除该效果图吗？</label><br /></center>"
					}
				);
				var btnSure = domConstruct.create("div",
					{
						innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>确定</button>",
						style:"float:left; width:45px;margin-left:22%"
					},div
				);
				var btnCancel = domConstruct.create("div",
					{
						innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>取消</button>",
						style:"float:left; width:45px;"
					},div
				);
				var deldialog = new Dialog({
					title: "删除效果图",
					content: div,
					style: "width: 200px;position:relavite;top:20px;font-size:12px;background-color:white"
				});
				deldialog.show();
				on(btnSure,"click",function()
				{
					var pre = new previewClass(url);
					Mask.show();
					pre.remove(
						function(data){
							console.log(data);
							// spolo.notify({
								// "text" : "删除成功",
								// "type" : "success",
								// "timeout" : 1000
							// });
							alert("删除成功");
							deldialog.hide();
							Mask.hide();
							Spolo.dialogHide();
							// window.location.reload();
						},
						function(error){
							Mask.hide();
							console.error(error);
						}
					);
				});	
				on(btnCancel,"click",function(){
					deldialog.hide();
				});	
			}
			else
			{
				alert("请选择要删除的效果图");
				// Spolo.notify({
					// "text" : "请选择要删除的效果图",
					// "type" : "error",
					// "timeout" : 1000
				// });
			}
		}
		
		var ret = declare("widgets/PreviewDetail/PreviewDetailWidget",[PreviewDetail],
		{	
			constructor : function(json){
				// 记录数据是否加载完毕
				this.init = false;
				this.currentPage = 1;
				this.publishAuthor = "";
				this.publishDate = "";
				this.info = "";
				this.previewName = "";
				if(json){
					this.numberSpinner = json.numberSpinner || false;
					this.isGutil = json.isGutil || false;
					this.currentPage = json["currentPage"] || 1;
					this.limit = json["limit"] || 10;
					this.isRadio = json["isRadio"] || false;
					this.isInsteadModel = json["isInsteadModel"] || false;
					this.oldModel = json["oldModel"] || {};
					this.modelPath = json["modelPath"] || "";
					if(json["path"]){
						this.path = json["path"];
					}else{
						throw("path is undefined!")
					}
					var canAddModel = json["canAddModel"];
					if(canAddModel != undefined){
						if(canAddModel==true||canAddModel=="true"){
							this.canAddModel = true;
						}else if(canAddModel == false || canAddModel == "false"){
							this.canAddModel = false;
						}
					}else{
						this.canAddModel = true;
					}
					// 这里可以从外部传入一个spolo.data.scene对象
					// 如果传入了scene对象，那么就支持向该scene中添加模型的方法
					scene = json["scene"];
					if(scene){
						this.scene = scene;
					}
					this.showAddItemsModelLib = false;//默认显示的是云端效果图
					this.iframe = json["iframe"];
					this.currentPageData = {};
					this.isnotclickmodel = false;//默认可以点击模型列表的缩略图
				}else{
					this.numberSpinner = false;
					this.isGutil = false;
					this.limit = 10;
					this.showAddItemsModelLib = false;//默认显示的是云端效果图
					throw("path is undefined!")
				}
				var dthis = this;
				//这里使用api替换之前的使用spnode实现的功能
				previewset.getInfo(this.path,
					function(infoJson){
						console.log(infoJson);
						var name = infoJson["resourceName"];// name
						var previewCategory = infoJson["previewCategory"];  // 属性
						var introduction = infoJson["introduction"]; //Description
						var previewRoom = infoJson["previewRoom"]; //room
						var previewStyle = infoJson["previewStyle"]; //style
						var publishAuthor = infoJson["publishAuthor"]; //发布者
						var publishDate = infoJson["publishDate"]; //发布时间
						
						getFullNameFromFolder(previewCategory, function(label){
							previewCategory = label;
							getFullNameArrayFromFolder(previewRoom, function(label){
								previewRoom = label;
								getFullNameArrayFromFolder(previewStyle, function(label){
									previewStyle = label;
									var textareaInfo = new ContentPane({
										content: "",
										className : "textareaInfo",
										style: "margin:0px;padding:0px;width:100%;min-height:350px;border:1px solid #d1d1d1;",
									}, dthis.previewDescriptionsNode);
									var downloadMapResources = new Button({
										label : "下载效果图",
										style : {
											"margin" : "0px 0px 30px 20px"
										},
										onClick : function(){
											// alert(spolo.priviewPath, " spolo.priviewPath");
											if(spolo.priviewPath)
											{
												// downloadPreviewResource(spolo.priviewPath);
												parent.window.location = spolo.priviewPath;
											}
											else
											{
												alert("请点击选择下载效果图片！");
											}
										}
									});
									//添加管理效果图的按钮
									var managepreview = new Button({
										label : "删除效果图",
										style : {
											"margin" : "0px 0px 30px 50px"
										},
										onClick : function(){
											var priPath = spolo.priviewPath.split(".download")[0];
											//弹出dialog，显示所有的效果图
											var userName = Spolo.getUserId();
											var nodePath = "/content/previewlib";;
											if(!dthis.showAddItemsModelLib){//如果是云端效果图
												//这里需要判断权限
												user.isGranted(
													userName,
													nodePath,
													function(result)
													{
														if(result == "True"){
															delPreviewPic.call(dthis, priPath);
														}
														else if(result == "False"){
															Spolo.notify({
																"text" : "对不起，您没有权限！",
																"type" : "error",
																"timeout" : 1000
															});
														}
														
													},
													function(error)
													{
														throw error;
													}
												);
												
											}
											else{
												// managePreview.call(dthis,dthis.path);
												delPreviewPic.call(dthis, priPath);
											}
										}
									});
									
									var addFavoritePreview = domConstruct.create("img",
										{
											class:"favpreview",
											src:"/widgets/ModelEdit/image/favorite.png",
											title:"加入收藏夹",
											style:"margin-left:35px;width:40px;cursor:pointer;display:none;"
										}
									);
									on(addFavoritePreview,"click",function(){
										addFavPreview.call(dthis,dthis.path);
									});
									
									var delFavoritePreview = domConstruct.create("img",
										{
											class:"favedpreview",
											src:"/widgets/ModelEdit/image/favorited.png",
											title:"取消收藏",
											style:"margin-left:35px;width:40px;cursor:pointer;display:none;"
										}
									);
									on(delFavoritePreview,"click",function(){
										delFavPreview.call(dthis, spolo.priviewPath);
									});
									
									/**
									* firefox浏览器中不支持dojo/dom-Construct模块的create方法参数style中写带"-"号的样式名称
									* 例：font-size，即不支持。
									*/
									// 添加字符项
									function addFieldItem(obj){
										// 获取父容器
										var ParentNode = dom.byId(textareaInfo.id);
										// 是否需要label
										if(obj["labelName"]){
											domConstruct.create("label",{
												innerHTML : obj["labelName"],
												style : {
													"margin" : "0px 0px 0px 10px"
												}
											},ParentNode);
										}
										// 添加字段
										var field = domConstruct.create(obj["nodeType"],{
											className : obj["className"] || "",
											innerHTML : obj["content"] || ""
										},ParentNode);
										// 线条属性块级元素，仅加一个换行
										if(obj["className"] == "fieldLine"){
											// 添加换行
											query(ParentNode).append("</br>");
										}else{
											// 添加换行
											query(ParentNode).append("</br></br>");
										}
										return field;
									}
									// 线条
									var line = {
										nodeType : "div",
										className : "fieldLine"
									}
									// 字段一，名称
									var field1 = {
										nodeType : "h3",
										className : "fieldName",
										content : name || "未命名"
									};
									/*
									// 字段二，发布者
									var field2 = {
										labelName : "发 布 者：",
										nodeType : "span",
										content : Spolo.decodeUname(publishAuthor)
									}
									// 字段三，发布时间
									var field3 = {
										labelName : "发布时间：",
										nodeType : "span",
										content : getDate(publishDate)
									}
									// 字段四，风格类型
									var field4 = {
										labelName : "风格类型：",
										nodeType : "span",
										content : previewStyle
									}
									// 字段五，风格类型
									var field5 = {
										labelName : "居室类型：",
										nodeType : "span",
										content : previewRoom
									}
									// 字段六，装修属性
									var field6 = {
										labelName : "装修属性：",
										nodeType : "span",
										content : previewCategory
									}
									*/
									// 字段七，详细信息
									var field7 = {
										labelName : "详细信息：",
										nodeType : "span",
										className : "fieldDetail",
										content : introduction
									}
									// 字段八，按钮
									var field8 = {
										nodeType : "div"
									}
				
									// 统一添加字段、线条
									addFieldItem(field1);
									/*
									addFieldItem(field2);
									addFieldItem(field3);
									addFieldItem(line);
									addFieldItem(field4);
									addFieldItem(field5);
									addFieldItem(field6);
									*/
									addFieldItem(line);
									addFieldItem(field7);
									
									var btnContent = addFieldItem(field8);
									downloadMapResources.placeAt(btnContent);
									managepreview.placeAt(btnContent);
									domConstruct.place(addFavoritePreview,btnContent,"last");
									domConstruct.place(delFavoritePreview,btnContent,"last");
									//textareaInfo.addChild(downloadMapResourcesPane);
									textareaInfo.domNode.readOnly = true;
								})
							})
						})
						
						function getDate(date)
						{
							// 时间 < 10的时候用 “0” 补
							function Appendzero(obj)
							{
								if(obj<10)
									return "0" +""+ obj;
								else
									return obj;
							}
							
							var _date = new Date(date);
							var dateString = Appendzero(_date.getFullYear()) + "."
										+ Appendzero(_date.getMonth()+1) + "."
										+ Appendzero(_date.getDate()) + " "
										+ Appendzero(_date.getHours()) + ":"
										+ Appendzero(_date.getMinutes()) + ":"
										+ Appendzero(_date.getSeconds());
							return dateString;
						}
					},
					function(error){
						console.log(error);
					}
				);
				// 设置场景中的效果图数据
				getPreviewByScene.call(this,function(data){
					dthis.emit("previewImagesReady",data["data"]);
					// 这里可以调用外部的图片轮播组件
					// 暂时先在该类内部设置效果图
					dthis.previewData = data["data"];
					setPreviewImages.call(dthis);//这个方法中会设置 modelListPath
					//上面这个方法执行完之后就可以使用 this.modelListPath
					
					// 设置模型列表,使用 this.modelListPath
					if(dthis.modelPath!=undefined && dthis.modelPath!=""){
						setModellistByModelPath.call(dthis);
					}else{
						setModellist.call(dthis);
					}
				});

				// 订阅加入场景按钮的点击事件
				this.on("onAddToScene",function(array){
					if(array.length != 0){
						Mask.show();
						addModelsToScene.call(dthis,array);
					}else{
						Spolo.notify({
							"text" : "您还未选择任何模型!",
							"type" : "error",
							"timeout" : 1000
						});
					}
				});
				// 订阅替换模型按钮的点击事件
				this.on("onInsteadModel",function(array){
					if(array.length != 0){
						initIfInsteadDialog.call(dthis,array);
						ifInsteadDialog.show();
						
					}else{
						Spolo.notify({
							"text" : "您还未选择任何模型!",
							"type" : "error",
							"timeout" : 1000
						});
					}
				});
				
				// 订阅模糊搜索的事件
				this.on("onSearch",function(){
					//获取搜索的内容
					var searchStr = getSearchStr.call(dthis);
					//调用搜索接口
					dthis.currentPage = 1;
					searchModel.call(dthis,searchStr);
				});
				
				// 订阅效果图数据准备完毕
				this.on("previewImagesReady",function(data){
					dthis.addPreviewItemToSlideShow(data);
				});
				
				// 响应父类的postCreateReady事件
				this.on("postCreateReady",function(){
					// 分页事件
					this.PaginationWidget.on("onClickPage",function(data){
						dthis.currentPage = this.nowPage;
						dthis.listWidget.currentPage = this.nowPage;
						// 数据加载完后，分页才起效果
						if(dthis.init){
							// 组装模型列表
							//setModellist.call(dthis);
							searchModel.call(dthis);
						}
					});
					
					var dthis = this;
					if(!dthis.isnotclickmodel){
						this.listWidget.on("onListItemClick",function(id){
							var paramStr = "modelPath="+id;
							//获得当前modelList的名字，然后做修改
							var modelListNameField = this.getField(id,1);
							var url = "/modules/modeledit/index.html?"+paramStr;
							var _this = this;
							var dialogData = {
								widthpx: 980,
								heightpx : 700,
								title:"模型详细信息",
								id:id,
								url:url,
								data: {	// 这里演示了如何向spdialog中传递参数; 获取参数的演示可以查看 /widgets/ModelEdit/modelEdit.html 第50行
									"showAddItemsModelLib":dthis.showAddItemsModelLib
								},
								callback: function(spdialog){
									//接收传来名字
									spdialog.on("resetResoureName",function(modelName){
										var currentModelName =" <div class=\"modelName\" style=\"position: absolute; left: 145px; top: 17px;\">"+modelName+"</div>";
										_this.setField(modelListNameField,currentModelName);
									});	
									spdialog.on("modelPreview",function()
									{
										getModelPreview.call(dthis,id);
									});
								}
							};
							Spolo.dialog(dialogData);
							//showWeb3d.call(dthis,id);
						});
					}
					
				});
			},
			
			//设置收藏图标
			setFavorPreview:function(){
				setFavPreview.call(this);
				
			},
			//设置已经收藏的图标
			setFavoredPreview:function(){
				setFavedPreview.call(this);	
			}
		});
		
		return ret;
	});