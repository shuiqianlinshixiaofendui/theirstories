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

define("widgets/LibView/PreviewLib",
	[
		"dojo/_base/declare",
		"dojo/_base/lang",
		"dijit/Dialog",
		"widgets/LibView/LibView",
		"dojo/dom-construct",
		"dojo/on",
		"spolo/data/queryClass",
		"spolo/data/spsession",
		"spolo/data/folder",
		"spolo/data/folder/previewlib",
		"dojo/query",
		"dojo/dom",
		"spolo/data/preview",
		"dojo/keys",
		"widgets/Category/Category",
		"widgets/CategorySelect/CategorySelect",
		"widgets/Mask/Mask",
		"dijit/form/Button",
		"dojo/store/Memory", 
		"dijit/form/FilteringSelect",
		"dojo/_base/array",
		"dijit/form/SimpleTextarea",
		"dojo/dom-class",
		"dojo/fx", 
		"dojo/fx/easing",
		"dojo/_base/fx",
		"dojo/dom-style",
		"dojo/NodeList-traverse"
	],
	function(
		declare,
		lang,
		Dialog,
		LibView,
		domConstruct,
		on,
		query_class,
		spsession,
		folderClass,
		previewlibClass,
		query,
		dom,
		preview_cls,
		keys,
		Category,
		CategorySelect,
		Mask,
		Button,
		Memory,
		FilteringSelect,
		arrayUtil,
		SimpleTextarea,
		domclass,
		fx,
		easing,
		fxBase,
		domStyle
	){

		var folderObj = null;	// folder的单例
		//----------客户端屏幕信息.start---------------------------------------------------------------------------------------------
				//----------客户端屏幕信息.start---------------------------------------------------------------------------------------------
		var Client = {
			viewportWidth: function() {
				return self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
			},        
			viewportHeight: function() {
				return self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
			},        
			viewportSize: function() {
				return { width: this.viewportWidth(), height: this.viewportHeight() };
			}
		};
		var dialogWidth = parseInt(Client.viewportWidth())*0.9;
		var dialogHeight = parseInt(Client.viewportHeight())*0.9;
		var iframeWidth = dialogWidth-10;
		var iframeHeight = dialogHeight-40;
	
		//------------------.end-------------------------------------------------------------------------------------
		/**
		* 得到 folder 的对象
		*/
		function getFolderObj(path){
			if(!folderObj){
				folderObj = new folderClass(path);
			}
			return folderObj;
		}
		
		/**
		* 初始化删除时的提示窗口
		*/
		function initMsgDialog(){
			var div = domConstruct.create("div",
				{
					innerHTML:"<div style='margin-bottom:10px;'>确定删除吗？</div>",
					style:"width:100%;text-align:center;"
				}
			);
			
			this.MsgDialog = new Dialog({
				title: "删除效果图",
				content: div,
				style: "width: 200px;font-size:12px"
			});
			
			var btnSure = domConstruct.create("button",
				{
					innerHTML:"确定"
				},div
			);
			var btnCancel = domConstruct.create("button",
				{
					innerHTML:"取消"
				},div
			);
			
			var dthis = this;
			on(btnSure,"click",function(){
				// 隐藏提示窗口
				dthis.MsgDialog.hide();
				Mask.show();
				// 执行删除
				dthis.execDelOption();
			});		
			
			on(btnCancel,"click",function(){
				// 隐藏提示窗口
				dthis.MsgDialog.hide();
			});		
		}
		
		
		function categoryModifyDialog(json)
		{
			var dthis = this;
			// 保存选择的数据
			// dthis.selectedData = {};
			// 关闭对话框需要的操作，destroy
			function closeDialog(){
				dialog.hide();
				cancelBtn.destroy();
				sureBtn.destroy();
				categoryWidget.destroy();
				dialog.destroy();
			}
			
			var dialogContent = "<div id=\"dialogCont\" style=\"margin:0px auto;\"></div>"+
				"<div style='margin:30px 0px 0px 100px;'>"+
					"<button type='button' id='previewEditSureBtn'></button>"+
					"<button type='button' id='previewEditCancelBtn'></button>"+
				"</div>";
			var dialog = new Dialog({
				title : json["title"],
				style : "width:60%;height:60%;background:#fff",
				content : dialogContent
			});
			var cancelBtn = new Button({
				label : " 取消 ",
				onClick : function(){
					closeDialog();
				}
			},"previewEditCancelBtn");
			var sureBtn = new Button({
				label : " 确定 ",
				onClick : function(){
					var style = dom.byId(json["id"]);
					style.innerHTML = dthis.label;
					if(selectedData["label"])
					{
						style.innerHTML = selectedData["label"];
					}
					closeDialog();
					switch(json["id"])
					{
						case "modifyPropertyBtn" :	
							var pathName = json["path"];
							if(selectedData["path"])
							{
								pathName = selectedData["path"];
							}
							json["object"].propertyData["previewCategory"] = pathName;
							break;
					}
				}
			},"previewEditSureBtn");
			
			dialog.on("hide",function(){
				closeDialog();
			});
			
			var Json = {
				title1 : json["title1"],
				path : json["path"],
				text : ""
			};
			var categoryWidget = new Category(Json).placeAt("dialogCont");
			if(json["newPath"] && json["label"])
			{
				var selectedJson = {
					path : json["newPath"],
					text : json["label"],
					type : "previewlib"
				};
				categoryWidget.initialize(selectedJson);
			}
			else
			{
				categoryWidget.initialize();
			}
			
			var selectedData = {}
			on(categoryWidget, "onSelectedListChanged", function(res){
				selectedData  = res;
			});
			
			dialog.show();
		}
		
		function categorySelectModifyDialog(json)
		{
			var dthis = this;
			// 保存选择的数据
			// dthis.selectedData = {};
			// 关闭对话框需要的操作，destroy
			function closeDialog(){
				dialog.hide();
				cancelBtn.destroy();
				sureBtn.destroy();
				categoryWidget.destroy();
				dialog.destroy();
			}
			
			var dialogContent = "<div id=\"dialogCont\" style=\"margin:0px auto;\"></div>"+
				"<div style='margin:30px 0px 0px 100px;'>"+
					"<button type='button' id='previewEditSureBtn'></button>"+
					"<button type='button' id='previewEditCancelBtn'></button>"+
				"</div>";
			var dialog = new Dialog({
				title : json["title"],
				style : "width:60%;height:60%;background:#fff",
				content : dialogContent
			});
			var cancelBtn = new Button({
				label : " 取消 ",
				onClick : function(){
					closeDialog();
				}
			},"previewEditCancelBtn");
			var sureBtn = new Button({
				label : " 确定 ",
				onClick : function(){
					var style = dom.byId(json["id"]);
					style.innerHTML = dthis.label;
					if(json["label"])
					{
						style.innerHTML = json["label"];
					}
					if(selectedData["text"])
					{
						style.innerHTML = selectedData["text"];
					}
					closeDialog();
					switch(json["id"])
					{
						case "modifyStyleBtn" :	
							var pathName = json["path"];
							if(json["newPath"])
							{
								pathName.innerHTML = json["newPath"];
							}
							if(selectedData["path"])
							{
								pathName = selectedData["path"];
							}
							json["object"].propertyData["previewStyle"] = pathName;
							break;
						case "modifyRoomBtn" :	
							var pathName = json["path"];
							if(json["newPath"])
							{
								pathName.innerHTML = json["newPath"];
							}
							if(selectedData["path"])
							{
								pathName = selectedData["path"];
							}
							json["object"].propertyData["previewRoom"] = pathName;
							break;
					}
				}
			},"previewEditSureBtn");
			
			dialog.on("hide",function(){
				closeDialog();
			});
			
			var Json = {
				title1 : json["title1"],
				path : json["path"],
				text : ""
			};
			var categoryWidget = new CategorySelect(Json).placeAt("dialogCont");
			if(json["newPath"] && json["label"])
			{
				var selectedJson = {
					path : json["newPath"],
					text : json["label"]
				};
				categoryWidget.initialize(selectedJson);
			}
			else
			{
				categoryWidget.initialize();
			}
			
			var selectedData = "";
			on(categoryWidget, "onSelectedItemClick", function(res){
				selectedData  = res;
			});
			
			dialog.show();
		}
		
		/**
		* 初始化编辑时的提示窗口
		*/
		function initUpdateDialog()
		{
			var dthis = this;
			var dialogContent = "<div id=\"dialogContParent\" style=\"margin:0px auto;\"></div>" +
				"<div style='margin:10px 0px 0px 10px;'>" +
					"<label style='font-weight:bold;'>名称：</label>" +
					"<input id='inputProperty' type='text'/>" +
					"<br />" +
					"<label style='font-weight:bold;'>属性：</label>" +
					"<button id='modifyPropertyBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>风格：</label>" +
					"<button id='modifyStyleBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>居室：</label>" +
					"<button id='modifyRoomBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>描述信息：</label>" +
					"<textarea id='textareaDisInfo'></textarea>" +
					"<br />" +
					"<br />" +
					"<center>" +
					"<button id='saveDataSuerBtn'></button>" +
					"<button id='saveDatacancelBtn'></button>" +
					"<center>" +
				"</div>";
			var div = domConstruct.create("div",
				{
					innerHTML:"<label style='float:left;line-height:25px;font-weight:bold;'>名称：</label><div class='previewName' style='float:left;margin-bottom:10px;'><input type='text'/></div>",
					style: "margin:0 auto;text-align:center;"
				}
			);
			
			this.UpdateDialog = new Dialog({
				title: "编辑效果图",
				content: dialogContent,
				style: "width: 40%;height: 60%;font-size:12px;background:#fff"
			});
			
			var modifyPropertyBtn = new Button({
				label:" 请选择装修属性 ",
				onClick:function(){
					var json = {
						title : "编辑效果图属性",
						title1 : "装修属性",
						path : "/content/previewcategory",
						id : "modifyPropertyBtn",
						object : dthis,
						label : dthis.initData["previewCategoryName"],
						newPath : dthis.initData["previewCategory"]
					};
					categoryModifyDialog.call(this, json);
				}
			},"modifyPropertyBtn");
			var modifyStyleBtn = new Button({
				label:" 请选择风格类型 ",
				onClick:function(){
					var json = {
						title : "编辑效果图风格类型",
						title1 : " 风格 ",
						path : "/content/modellibcategory/modelstyle",
						id : "modifyStyleBtn",
						object : dthis,
						label : dthis.initData["previewStyleName"],
						newPath : dthis.initData["previewStyle"]
					};
					categorySelectModifyDialog.call(this, json);
				}
			},"modifyStyleBtn");
			var modifyRoomBtn = new Button({
				label:" 请选择居室类型 ",
				onClick:function(){
					var json = {
						title : "编辑效果图居室类型",
						title1 : " 居室 ",
						path : "/content/modellibcategory/room",
						id : "modifyRoomBtn",
						object : dthis,
						label : dthis.initData["previewRoomName"],
						newPath : dthis.initData["previewRoom"]
					};
					categorySelectModifyDialog.call(this, json);
				}
			},"modifyRoomBtn");
			
			// getInfo
			// var textareaValue = dthis.initData["introduction"];
			var textareaInfo = new SimpleTextarea({
				value: "",
				rows : "5",
				style: "width:60%;"
			}, "textareaDisInfo");
			
			var saveDataSuerBtn = new Button({
				label:" 保存 ",
				onClick:function(){
					dthis.UpdateDialog.hide();
					console.log(textareaInfo.value);
					dthis.propertyData["introduction"] = textareaInfo.value;
					if(textareaInfo.value == "")
					{
						dthis.propertyData["introduction"] = "undefined";
					}
					dthis.updateCategory(dthis.propertyData);
					// 执行编辑
					dthis.execUpdateOption();
				}
			},"saveDataSuerBtn");
			var saveDatacancelBtn = new Button({
				label:" 取消 ",
				onClick:function(){
					dthis.UpdateDialog.hide();
				}
			},"saveDatacancelBtn");
			
			// selectPreviewCategory
		}
		
		// 初始化List控件的数据
		function initListWidgetData(){
			//清空list控件
			var dthis = this;
			var currentPage = this.currentPage;
			var limit = dthis.limit;
			var json = getJsonFromFilter.call(dthis);
			folderClass.searchforLibs({
				nodePath : this.path,
				fuzzyProperties : json,
				//orderDesc : "publishdate",
				limit : limit ,  
				offset : ((currentPage - 1) * dthis.limit).toString() ,
				success : function(data,nameArray)
				{
					//刷新分页
					var total = data["totalNum"];
					dthis.PaginationWidget.refresh(Math.ceil(total/dthis.limit));
					//加载 list 数据
					initListWidget.call(dthis,data);
				},
				failed : function(error)
				{
					dthis.PaginationWidget.refresh(1);
					onError(error);
				}
			});
		}
		
		// 时间 < 10的时候用 “0” 补
		function Appendzero(obj)
		{
			if(obj<10)
				return "0" +""+ obj;
			else
				return obj;
		}
		
		// 初始化 list 控件显示
		function initListWidget(data){
			var _this = this;
			var listw = this.listWidget;
			var listData = data["data"];
			var array = new Array();
			for(var key in listData){
				array.push(key);
			}
			//加载listitem的结构
			listw.addItems(array,true);
			for(var i = 0; i < array.length; i++){
				var key = array[i];
				// 设置名称字段
				var name = listData[key]["resourceName"];
				var auther = listData[key]["publishAuthor"];
				var pubDate = listData[key]["publishdate"];
				if(!name)name = "未命名";
				if(!auther)auther = "无作者";
				if(!pubDate)pubDate = "无时间"
				var div = domConstruct.create(
					"div",{
						innerHTML : "名称："+name,
						id : key
					}
				);
				var autherDom = domConstruct.create(
					"div",{ innerHTML : "发布者："+Spolo.decodeUname(auther)}
				);
				var _date = new Date(pubDate);
				var dateString = Appendzero(_date.getFullYear()) + "."
							+ Appendzero(_date.getMonth()+1) + "."
							+ Appendzero(_date.getDate()) + " "
							+ Appendzero(_date.getHours()) + ":"
							+ Appendzero(_date.getMinutes()) + ":"
							+ Appendzero(_date.getSeconds());
				var pubDateDom = domConstruct.create(
					"div",{ innerHTML : "发布时间："+dateString}
				);
				
				listw.addDomNode(key,div);
				listw.addDomNode(key,autherDom);
				listw.addDomNode(key,pubDateDom);
				if(_this.isGutil){
					var download = domConstruct.create(
						"div",{
							innerHTML : "点击下载场景",
							style : "cursor:pointer;color:#F00;"
						}
					);
					on(download,"click",function(){
						Mask.show();
						var _this = this;
						var previewPath = query(this).parents("li").attr("itemid")[0];
						console.log(previewPath);
						var resource = previewPath + ".downloadmodel"
						var url = "http://127.0.0.1:10828/download?method=POST";//?resource="+resource+"&";
						var content = {};
						content.resource = resource;
						content.fileformat = "max";
						require(["dojo/request/iframe"], function(iframe){
							iframe(url, {
								method : "GET",
								handleAs: "text",
								data: content
							}).then(
								function(data){
									Mask.hide();
									console.log(data);
								}, 
								function(err){
									console.log(err);
								}, 
								function(evt){	
								}
							);
						});
					});
					listw.addDomNode(key, download);
				}
				
				// 设置listitem中的图片
				setPreviewImage(key);
			}
			// 设置listitem中的图片
			function setPreviewImage(path){
				previewlibClass.getPreviewImages(
					path,
					function(arrayUrl){
						if(arrayUrl && arrayUrl.length){
							var imgUrl = arrayUrl[0];
							listw.setItemImage(path,imgUrl); 
						}
					},
					function(error){
						throw error;
					}
				);
			}
			
			//初始化完毕
			this.init = true;
		}
		
		//根据条件判断是否拼接resourceName
		function JsonResourceName(){
			var dthis = this;
			if(dthis.filterValue != "")
			{
				dthis.filterJson["resourceName"] = dthis.filterValue.toString();
			}
			else
			{
				delete dthis.filterJson["resourceName"];
			}
		}
		
		// 当点击List控件的图片时
		function onListItemClick(data){
			// new PreviewDetail控件
			var previewPath = data;
			showPreviewDetail.call(this,previewPath);
		}
		
		// 显示previewDetail控件
		function showPreviewDetail(previewPath){
			var dthis = this;
			if(this.isRadio != undefined && (this.isRadio == true || this.isRadio == "true")){
				this.isRadio = true;
			}else{
				this.isRadio = false;
			}
			if(this.isInsteadModel != undefined && (this.isInsteadModel == true || this.isInsteadModel == "true")){
				this.isInsteadModel = true;
			}else{
				this.isInsteadModel = false;
			}
			var oldModel = "";
			if(this.oldModel && this.oldModel.name){
				oldModel = JSON.stringify(this.oldModel);
			}
			//改成spdialog的形式
			var url = "/widgets/PreviewDetail/PreviewDetailInPreviewLib.html";
			var iframe = window.parent.iframe || this.iframe;
			var scene = window.parent.scene || this.scene;
			if(dthis.isGutil){
				scene = {};
				var content = {};
				var models = [];
				//得到scene对象，重写addItemsByCount方法，获得model路径
				scene.addItemsByCount = function(pathArray, callback){
					console.log("---------");
					console.log(pathArray);
					console.log("---------");
					for(var key = 0; key < pathArray.length;){
						var json = {};
						json["amount"] = pathArray[key+1];
						json["path"] = pathArray[key];
						models.push(json);
						key += 2;
					}
					content.models=JSON.stringify(models);
					content.resource = "/content/modellib.download";
					var url = "http://127.0.0.1:10828/download?method=POST";
					require(["dojo/request/iframe"],function(iframe){
						iframe(url, {
							method: "GET",
							handleAs: "text",
							data:content
						}).then(
							function(data){  
								callback();
								console.log(data);
							}, 
							function(err){	
								console.log(err);
							}, 
							function(evt){	
								
							}
						);
					});
				}
			}
			var dialogData = 
			{
				widthradio: 0.9,
				heightradio:0.9,
				id:previewPath,
				title:"效果图预览",
				url:url,
				data:{
					"iframe":iframe,
					"scene":scene,
					"numberSpinner":this.numberSpinner,
					"oldModel":this.oldModel,
					"isInsteadModel":this.isInsteadModel,
					"isRadio":this.isRadio,
					"canAddModel":this.previewDetailHasButton,
					"path":previewPath,
					"isGutil":dthis.isGutil
				},
				callback:function(spdialog){
					spdialog.on("previewlist",function()
					{
						//window.location.reload();
						initListWidgetData.call(dthis);
					});
					spdialog.on("delsucc",function()
					{
						initListWidgetData.call(dthis);
					});
				}
			};
			Spolo.dialog(dialogData);
		}
		
		// 初始化分类控件
		function initCategory()
		{
			var dthis = this;
			//加入分类组件
			var categoryJson = {
				title1:"效果图",
				path:"/content/previewcategory",
				text:""
			};
			
			var styleJson = {
				title1:"风格",
				path:"/content/modellibcategory/modelstyle",
				text:""
			};
			
			var roomJson = {
				title1:"居室",
				path:"/content/modellibcategory/room",
				text:""
			};
			
			var categoryWidget = new Category(categoryJson).placeAt(this.categoryListNode);
			categoryWidget.initialize();
			var styleWidget = new CategorySelect(styleJson).placeAt(this.categoryListNode);
			var roomSelectWidget = new CategorySelect(roomJson).placeAt(this.categoryListNode);
			
			//监听分类变化时的事件
			on(categoryWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["previewCategory"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
			
			on(styleWidget,"onSelectedItemClick",function(json){
				if(json.isChecked)
				{
					dthis.filterJson["previewStyle"] = json["path"];
					JsonResourceName.call(dthis);
					doSearch.call(dthis);
				}
				else
				{
					dthis.filterJson["previewStyle"] = "";
					JsonResourceName.call(dthis);
					doSearch.call(dthis);
				}
			});
			
			on(roomSelectWidget,"onSelectedItemClick",function(json){
				if(json.isChecked)
				{
					dthis.filterJson["previewRoom"] = json["path"];
					JsonResourceName.call(dthis);
					doSearch.call(dthis);
				}
				else
				{
					dthis.filterJson["previewRoom"] = "";
					JsonResourceName.call(dthis);
					doSearch.call(dthis);
				}
			});
			
			on(dthis.divFoldCategoryNode,"click",function(){
				if(this.innerHTML == "收起分类")
				{
					this.innerHTML = "展开分类";
					domclass.remove(dthis.foldNode,"modelLibTemplate_unfold");
					domclass.add(dthis.foldNode,"modelLibTemplate_fold");
					domStyle.set(dthis.categoryListNode, {
					  height: "",
					  display: "none"
					});
				}
				else
				{
					this.innerHTML = "收起分类";
					domclass.remove(dthis.foldNode,"modelLibTemplate_fold");
					domclass.add(dthis.foldNode,"modelLibTemplate_unfold");
					domStyle.set(dthis.categoryListNode, {
						height: "100%",
						display: "block"
					});
				}
			});
			on(dthis.foldNode,"click",function(){
				if(query(this).prev()[0].innerHTML == "收起分类")
				{
					query(this).prev()[0].innerHTML = "展开分类";
					domclass.remove(dthis.foldNode,"modelLibTemplate_unfold");
					domclass.add(dthis.foldNode,"modelLibTemplate_fold");
					domStyle.set(dthis.categoryListNode, {
					  height: "",
					  display: "none"
					});
				}
				else
				{
					query(this).prev()[0].innerHTML = "收起分类";
					domclass.remove(dthis.foldNode,"modelLibTemplate_fold");
					domclass.add(dthis.foldNode,"modelLibTemplate_unfold");
					domStyle.set(dthis.categoryListNode, {
						height: "100%",
						display: "block"
					});
				}
			});
		}
		
		//整理查询需要的参数，然后调用search
		function doSearch(params)
		{
			var dthis = this;
			search.call(
				dthis,
				function(data,nameArray){
					//刷新列表
					var total = data["totalNum"];
					dthis.PaginationWidget.refresh(Math.ceil(total/dthis.limit),dthis.currentPage);
					var array = [];
					for(var key in data["data"]){
						array.push(key);
					}
					dthis.listWidget.addItems(array,true);
					
					initListWidget.call(dthis,data);
					
					//设置高亮显示
					if(dthis.filterValue.trim() != ""){
						for(var key in data["data"]){
							var modelpath = key;
							var modelname = data["data"][key]["resourceName"];
							var field = dthis.listWidget.getField(modelpath,1);
							/* var re = new RegExp(dthis.filterValue,"gi");
							var array;
							while((array = re.exec(modelname)) != null){
								console.log(array);

							} */
							var inputValue = dthis.filterValue;
							var modelnameToLower = modelname.toLowerCase();
							var filterValueToLower = inputValue.toLowerCase();
							var array = [];
							for(var i = 0; i < modelnameToLower.length; i ++)
							{
								if(filterValueToLower.length > modelnameToLower.length)
								{
									return;
								}
								var string2 = "";
								for(var index = 0; index < filterValueToLower.length; index ++)
								{
									string2 += modelnameToLower[index+i];
									if(string2 == filterValueToLower)
									{
									array.push(i);
									console.log(array);
									}
								}
							}
							var lightStr = "";
							for(var index = 0;index < array.length;index ++){
								var start = array[index-1]+filterValueToLower.length;
								if(start == undefined){
									start = 0;
								}
								var perlightvalue = modelname.substring(start,array[index]);
								var lightvalue = modelname.substring(array[index],array[index]+filterValueToLower.length);
								var lastlightvalue = "";
								if(index == array.length-1){
									lastlightvalue = modelname.substring(array[index] + filterValueToLower.length, array[index+1]);
								}
								lightStr += perlightvalue + "<span style=\"background-color:#ff0;\">"+lightvalue+"</span>" + lastlightvalue;	
							}
							
							dthis.listWidget.setField(field, "名称："+lightStr);
							
						}
					}
				},
				function(error){
					dthis.PaginationWidget.refresh(1,1);
					console.log(error);
				},
				params
			);
		}
		
		
		//执行查询方法，返回json数据的结果
		function search(onSucc,onError,params)
		{
			var dthis = this;
			var path = dthis.path;
			var currentPage = dthis.currentPage;
			var json = getJsonFromFilter.call(dthis);
			var limit = dthis.limit;
			var queryData = {
				nodePath : path,
				fuzzyProperties : json,
				//orderDesc : "publishdate",
				limit : limit ,  
				offset : ((currentPage - 1) * dthis.limit).toString() ,
				success : function(data,nameArray)
				{
					//dthis.jsonData = data;
					onSucc(data,nameArray);
				},
				failed : function(error)
				{
					onError(error);
				}
			};
			if(params != undefined){
				var sortName = params["sortName"];
				var order = params["order"];
				queryData[order] = sortName;
			}
			folderClass.searchforLibs(queryData);
		}
		
		//得到选择分类的字符串
		function getJsonFromFilter(){
			var dthis = this;
			var json = "";
			json += "{";
			for(var i in dthis.filterJson){
				if(dthis.filterJson[i]){
					json += "\"" + i + "\":\"" + dthis.filterJson[i] + "\","
				}
			}
			json += "\"sling:resourceType\":\"folder\"";
			json += "}";
			return JSON.parse(json);
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
		//在stateStore对象中添加元素
		function addResourceName(){
			var dthis = this;
			dthis.stateStore["data"].length = 0;
			search.call(
				dthis,
				function(data,nameArray){
					if(nameArray.length){
						for(var key  = 0;key < nameArray.length;key++){
							var name = {};
							name["resourcename"] = nameArray[key];
							dthis.stateStore["data"].push(name);
						}
					}
				},
				function(error){
					console.log(error);
				}
			);
		}
		//判断对象是否为空
		function isEmptyObject(obj){
			for(var n in obj)
			{
				return false;
			} 
			return true; 
		}
		//排序
		function sortList(data){
			var dthis = this;
			doSearch.call(dthis,data);
		}
/********************************************************************************************************
********************************************************************************************************/

		var ret = declare("widgets/LibView/PreviewLib",	[ LibView ],
		{			
			constructor:function(json){
				var dthis = this;
				
				var tmpPath = "/content/previewlib";
				// 初始化参数，是否完成了初始化
				this.init = false;
				this.propertyData = {
					// "previewCategory" : "/content/previewcategory",
					// "previewStyle" : "/content/modellibcategory/modelstyle",
					// "previewRoom" : "/content/modellibcategory/room"
				}
				
				if(json){
					this.json = json;
					this.currentPage = json["currentPage"] || 1;
					this.limit = json["limit"] || 10;
					this.isPublish = json["isPublish"] || false;
					this.isGutil = json["isGutil"] || false;
					this.hasButton = json["hasButton"] || false;
					this.previewDetailHasButton = json["canAddModel"]!=undefined?json["canAddModel"]:true;
					this.numberSpinner = json["numberSpinner"]!=undefined?json["numberSpinner"]:false;
					this.path = json["path"] || tmpPath;
					this.isRadio = json.isRadio || false; //list组件的单选或多选控制，默认为多选
					this.isInsteadModel = json.isInsteadModel || false; //控制弹出的效果图组件是否是替换模式，默认是加入场景模式
					this.oldModel = json.oldModel || {}; //如果是替换模式应该传第一个旧模型对象
					//初始化下拉框
					this.stateStore = new Memory({
						data:[]
					});
					this.filterValue = "";
					this.scene = json["scene"];
					this.iframe = json["iframe"];
				}else{
					//默认值
					this.currentPage = 1;
					this.limit = 10;
					this.isPublish = false;
					this.isGutil = false;
					this.hasButton = false;
					this.path = tmpPath;
					this.filterValue = "";
				}
				
				
				this.filterJson = {};	// 保存分类筛选的条件
				// 订阅分页事件
				// this.PaginationWidget.on("onClickPage",function(data){
					// dthis.currentPage = this.nowPage;
					//只有初始化完毕后，才能执行分页查询数据
					// if(dthis.init){
						// initListWidgetData.call(dthis);
					// }
				// });
				dthis.PaginationWidget.watch(
					"nowPage", 
					function()
					{
						//saveCurrentPageSelected.call(dthis);
						dthis.currentPage = dthis.PaginationWidget.get("nowPage");
						if(dthis.init){
							initListWidgetData.call(dthis);
						}
					}
				);
				
				this.folder = new folderClass(this.path);
				
				// 订阅列表控件的缩略图点击事件	// 这里是订阅基类的 List 控件的相关方法
				this.listWidget.on("onListItemClick",function(data){
					onListItemClick.call(dthis,data);
				});
				on(this,"postCreateReady",lang.hitch(this,function(){
					var widgetThis = this;
					// 是否隐藏按钮面板
					dthis.displayButtonList(this.hasButton);
					// 初始化列表控件的数据
					initListWidgetData.call(this);
					
					initCategory.call(this);
					//this.divFoldCategoryNode.click();
					/**
					*订阅按钮面板功能按钮事件
					*/
					//排序
					this.on("onSort",function(data){
						sortList.call(this,data);
					});
					// 全选
					this.on("onSelectAll",function(){
						this.listWidget.selectAll();
					});
					
					// 取消选择
					this.on("onUnSelectAll",function(){
						this.listWidget.unSelectAll();
					});
					
					// List 布局
					this.on("onShowList",function(){
						this.listWidget.showList();
					});
					
					// 大图 布局
					this.on("onShowThumbnail",function(){
						this.listWidget.showThumbnail();
					});
					
					// 打开编辑模式
					this.on("onOpenEditModel",function(){
						this.listWidget.openEdit();
					});	
					
					// 关闭编辑模式
					this.on("onCloseEditModel",function(){
						this.listWidget.closeEdit();
					});
					
					// 打开选择模式
					this.on("onOpenSelectModel",function(){
						this.listWidget.openSelect();
					});
					
					// 关闭选择模式
					this.on("onCloseSelectModel",function(){
						this.listWidget.closeSelect();
					});
					
					//初始化下拉框的内容
					var filteringSelect = new FilteringSelect({
						store: dthis.stateStore,
						searchAttr: "resourcename",
						style:"margin:15px 0 20px 32%;height:22px;width:360px;font-size:15px;padding:2px 0 2px 0",
						hasDownArrow:false,
						forceWidth:true,
						required:false,
						invalidMessage:false,
						trim:true,
						autoComplete:false,
						onKeyUp:function(evt)
						{
							var value = filteringSelect.get('displayedValue');
							dthis.filterValue = value;
							JsonResourceName.call(dthis);
							
						},
	
						onKeyDown:function(evt)
						{
							var value = filteringSelect.get('displayedValue');
							dthis.filterValue = value;
							JsonResourceName.call(dthis);
							if(value.trim() != "")
							{
								dthis.filterJson["resourceName"] = value.toString();
								//addResourceName.call(dthis);
							}
							switch(evt.keyCode)
							{
								case keys.ENTER:
								dthis.filterValue = value;
								JsonResourceName.call(dthis);
								var flag = isEmptyObject.call(dthis,dthis.filterJson);
								if(value.trim() != "" || !flag){
									dthis.currentPage = 1;
									doSearch.call(dthis);
								}
								break;
							}
						},
						validate:function () {
						}
					}, this.searchNode);
				
					new Button({
						label:"查询",
						style:"font-size:14px;margin:-4px 0 0 25px;",
						onClick:function(){
							var value = filteringSelect.get('displayedValue');
							dthis.filterValue = value;
							JsonResourceName.call(dthis);
							var flag = isEmptyObject.call(dthis,dthis.filterJson);
							if(value.trim() != "" || !flag){
								dthis.currentPage = 1;
								doSearch.call(dthis);
							}
						}
					},this.btnSearchNode);
					
				}));
				// 删除选中项
				this.on("onDelSelectItem",function(items){
					if(items.length == 0){
						Spolo.notify({
							"text" : "您未选中任何选中项！",
							"type" : "error",
							"timeout" : 1000
						});
					}else{
						// 显示是否删除
						this.MsgDialog.show();
						this.execDelOption = function(){
							// 获取folder对象
							var path = this.path;
							var dthis = this;
							var folder = getFolderObj(path);
							folder.batchRemove(items,function(){
								// 隐藏提示窗口
								dthis.MsgDialog.hide();
								
								//UI层删除
								for(var i = 0; i < items.length; i++){
									dthis.listWidget.delItem(items[i]);
								}
							},function(error){
								// 隐藏提示窗口
								dthis.MsgDialog.hide();
								
								Spolo.notify({
									"text" : "删除失败！",
									"type" : "error",
									"timeout" : 1000
								});
							});		
						}
					}
				});
				
				this.on("onRenderPreview",function(items){
					if(items.length == 0){
						Spolo.notify({
							"text" : "您未选中任何选中项！",
							"type" : "error",
							"timeout" : 1000
						});
						dthis.toolbar.noBusyRenderModel(false);
					}else{
						dthis.renderPreview = false;
						dthis.toolbar.disableRenderAllModel(true);
						preview_cls.createModelsPreview(
							items,
							function(){
								dthis.renderPreview = true;
								Spolo.notify({
									"text" : "渲染任务已经发出！",
									"type" : "information",
									"timeout" : 1000
								});
								dthis.toolbar.noBusyRenderModel();
								dthis.toolbar.noBusyRenderAllModel();
							},
							function(error){
								throw error;
								dthis.toolbar.noBusyRenderModel();
								dthis.toolbar.noBusyRenderAllModel();
							}       
						);
					}
				});
				this.on("onRenderAllPreview",function(items){
					dthis.renderPreview = false;
					dthis.toolbar.disableRenderModel(true);
					var path = dthis.path;
					previewlibClass.createModelsPreview(
						path,
						function(jsonData){
							dthis.renderPreview = true;
							Spolo.notify({
								"text" : "渲染任务已经发出！",
								"type" : "information",
								"timeout" : 1000
							});
							dthis.toolbar.noBusyRenderModel();
							dthis.toolbar.noBusyRenderAllModel();
						},
						function(error){
							throw error;
							dthis.toolbar.noBusyRenderModel();
							dthis.toolbar.noBusyRenderAllModel();
						}
					);
				});
				
				// 订阅删除按钮事件
				this.listWidget.on("onDelItemClick",function(itemid){
					// 显示是否删除
					dthis.MsgDialog.show();
					// 删除按钮事件执行函数
					dthis.execDelOption = function(){
						var currentPage = dthis.currentPage;
						var limit = dthis.limit;
						query_class.query({
							nodePath : dthis.path,
							orderDesc : "jcr:created",
							limit : limit ,
							offset : ((currentPage - 1) * limit),
							load : function(data){
								var pathArray = new Array();
								pathArray.push(itemid);
								previewlibClass.batchRemove(
									pathArray, 
									function(){
										Mask.message("删除成功",true);
										Mask.appendLogItem("删除成功!");
										dthis.removePreview();
									}, 
									function(error){
										Mask.message("删除失败",true);
										Mask.appendLogItem("删除失败!");
										throw error;
									} 
								); 
							},
							error : function(error){
								throw error;
							}
						});
					}
					
					dthis.removePreview = function()
					{
						// 获取folder对象
						var path = dthis.path;
						var folder = getFolderObj(path);
						folder.batchRemove([itemid],function(){
							// 隐藏提示窗口
							dthis.MsgDialog.hide();
							// UI层删除
							dthis.listWidget.delItem(itemid);
						},function(error){
							// 隐藏提示窗口
							dthis.MsgDialog.hide();
							
							Spolo.notify({
								"text" : "删除失败！",
								"type" : "error",
								"timeout" : 1000
							});
						});
					}
				});

				// 订阅编辑按钮事件
				this.listWidget.on("onEditItemClick",function(itemid){
					dthis.getCategory = function()
					{//setPreviewProperty
					//getPreviewProperty
						preview_cls.getPreviewProperty(
							itemid,
							function(data){
								dthis.initData = data;
								getFullNameArrayFromFolder(data["previewStyle"], function(label){
									var style = dom.byId("modifyStyleBtn");
									if(!label)
									{
										style.innerHTML = "请选择风格类型";
									}
									else
									{
										style.innerHTML = label;
										dthis.initData["previewStyleName"] = label;
									}
								});
								
								getFullNameArrayFromFolder(data["previewRoom"], function(label){
									var room = dom.byId("modifyRoomBtn");
									if(!label)
									{
										room.innerHTML = "请选择居室类型";
									}
									else
									{
										room.innerHTML = label;
										dthis.initData["previewRoomName"] = label;
									}
								});
								
								getFullNameFromFolder(data["previewCategory"], function(label){
									var Property = dom.byId("modifyPropertyBtn");
									if(!label)
									{
										Property.innerHTML = "请选择装修属性";
									}
									else
									{
										Property.innerHTML = label;
										dthis.initData["previewCategoryName"] = label;
									}
								});
								
								var textareaDis = dom.byId("textareaDisInfo");
								textareaDis.value = data["introduction"];
								if(data["introduction"] == "undefined" || data["introduction"] == undefined)
								{
									textareaDis.value = ""
								}
								dthis.UpdateDialog.show();
							},
							function(error){
								throw error;
							}	
						);
					}
					
					dthis.getCategory();
					
					// 编辑文本框
					var previewNameInput = query("#inputProperty",dom.byId(dthis.UpdateDialog.id));
					// 获取场景名称
					preview_cls.getName(itemid,
						function(name){
							previewNameInput.val(name);
						},
						function(error){
							throw error;
						}
					);
	
					// 确定按钮事件执行函数
					dthis.execUpdateOption = function(){
						// 编辑完后的名称
						var previewName = previewNameInput.val();
						
						// 修改场景名称
						preview_cls.setName(
							itemid,
							previewName,
							function(){
								dom.byId(itemid).innerText = "名称：" + previewName;
							},
							function(error){
								throw error;
							}
						);
					}
					
					// 隐藏提示窗口
					dthis.updateCategory = function()//this.propertyData
					{
						
						previewPropertyJson = {
							"previewCategory" : dthis.propertyData["previewCategory"],
							"previewStyle" : dthis.propertyData["previewStyle"],
							"previewRoom" : dthis.propertyData["previewRoom"],
							"introduction" : dthis.propertyData["introduction"]
						}
						preview_cls.setPreviewProperty(
							itemid,
							previewPropertyJson,
							function(){
							
							},
							function(error){
								throw error;
							}	
						);
					}
					
				});
				
				// 订阅选择按钮事件
				this.listWidget.on("onListItemSelect",function(itemid){
					
				});
				
				// 初始化删除时的提示窗口
				initMsgDialog.call(this);
				
				// 初始化编辑时的提示窗口
				initUpdateDialog.call(this);
			}
			
		});
		
		return ret;
	});