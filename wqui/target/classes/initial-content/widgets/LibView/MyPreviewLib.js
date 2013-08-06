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

define("widgets/LibView/MyPreviewLib",
	[
		"dojo/_base/declare","dojo/_base/lang","dojo/dom",
		"dijit/Dialog","dojo/on","dojo/dom-construct","dojo/dom-attr","dojo/query",
		"widgets/PreviewDetail/PreviewDetailWidget",
		"widgets/LibView/LibView",
		"spolo/data/queryClass",
		"spolo/data/folder",
		"widgets/Mask/Mask",
		"spolo/data/preview",
		"dojo/keys",
		"widgets/Category/Category",
		"widgets/CategorySelect/CategorySelect",
		"dijit/form/Button",
		"spolo/data/folder/previewlib",
		"dojo/_base/array",
		"dojo/store/Memory", 
		"dijit/form/FilteringSelect",
		"dijit/form/Textarea",
		"dojo/dom-class",
		"dojo/fx", 
		"dojo/fx/easing",
		"dojo/_base/fx",
		"dojo/dom-style",
		"dojo/NodeList-traverse"
	],function(
		declare,lang,dom,
		Dialog, on, domConstruct,domAttr,query,
		PreviewDetailWidget,
		LibView,
		queryClass,
		folderClass,
		Mask,
		preview_cls,
		keys,
		Category,
		CategorySelect,
		Button,
		previewlib_class,
		arrayUtil,
		Memory, 
		FilteringSelect,
		Textarea,
		domclass,
		fx,
		easing,
		fxBase,
		domStyle
	){

		var folderObj = null;	// folder的单例
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
						case "PersonalModifyPropertyBtn" :	
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
						case "PersonalModifyStyleBtn" :	
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
						case "PersonalModifyRoomBtn" :	
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
					"<input id='PersonalInputProperty' type='text'/>" +
					"<br />" +
					"<label style='font-weight:bold;'>属性：</label>" +
					"<button id='PersonalModifyPropertyBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>风格：</label>" +
					"<button id='PersonalModifyStyleBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>居室：</label>" +
					"<button id='PersonalModifyRoomBtn'></button>" +
					"<br />" +
					"<label style='font-weight:bold;'>描述信息：</label>" +
					"<textarea id='PersonalTextareaDisInfo'></textarea>" +
					"<br />" +
					"<br />" +
					"<center>" +
					"<button id='PersonalSaveDataSuerBtn'></button>" +
					"<button id='PersonalSaveDatacancelBtn'></button>" +
					"<center>" +
				"</div>";
			
			this.UpdateDialog = new Dialog({
				title: "编辑效果图",
				content: dialogContent,
				style: "width: 40%;height: 60%;font-size:12px;background:#fff"
			});
			
			var PersonalModifyPropertyBtn = new Button({
				label:" 请选择装修属性 ",
				onClick:function(){
					var json = {
						title : "编辑效果图属性",
						title1 : "装修属性",
						path : "/content/previewcategory",
						id : "PersonalModifyPropertyBtn",
						object : dthis,
						label : dthis.initData["previewCategoryName"],
						newPath : dthis.initData["previewCategory"]
					};
					categoryModifyDialog.call(this, json);
				}
			},"PersonalModifyPropertyBtn");
			var PersonalModifyStyleBtn = new Button({
				label:" 请选择风格类型 ",
				onClick:function(){
					var json = {
						title : "编辑效果图风格类型",
						title1 : " 风格 ",
						path : "/content/modellibcategory/modelstyle",
						id : "PersonalModifyStyleBtn",
						object : dthis,
						label : dthis.initData["previewStyleName"],
						newPath : dthis.initData["previewStyle"]
					};
					categorySelectModifyDialog.call(this, json);
				}
			},"PersonalModifyStyleBtn");
			var PersonalModifyRoomBtn = new Button({
				label:" 请选择居室类型 ",
				onClick:function(){
					var json = {
						title : "编辑效果图居室类型",
						title1 : " 居室 ",
						path : "/content/modellibcategory/room",
						id : "PersonalModifyRoomBtn",
						object : dthis,
						label : dthis.initData["previewRoomName"],
						newPath : dthis.initData["previewRoom"]
					};
					categorySelectModifyDialog.call(this, json);
				}
			},"PersonalModifyRoomBtn");
			
			// getInfo
			// var textareaValue = dthis.initData["introduction"];
			var textareaInfo = new Textarea({
				value: "",
				style: "width:60%;"
			}, "PersonalTextareaDisInfo");
			
			var PersonalSaveDataSuerBtn = new Button({
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
			},"PersonalSaveDataSuerBtn");
			var PersonalSaveDatacancelBtn = new Button({
				label:" 取消 ",
				onClick:function(){
					dthis.UpdateDialog.hide();
				}
			},"PersonalSaveDatacancelBtn");
			
			// selectPreviewCategory
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
		
		/**
		* 初始化List控件的数据
		*/
		function initListWidgetData(flag){
			//清空list控件
			var dthis = this;
			var currentPage = this.currentPage;
			var limit = this.limit;
			var json = getJsonFromFilter.call(dthis);
			folderClass.searchforLibs({
				nodePath : this.path,
				fuzzyProperties : json,
				//orderDesc : "publishdate",
				limit : limit ,  
				offset : ((currentPage - 1) * dthis.limit).toString() ,
				success : function(data,nameArray)
				{
					if(!dthis.init){
						//刷新分页
						var total = data["totalNum"];
						dthis.PaginationWidget.refresh(Math.ceil(total/limit));
					}
					initListWidget.call(dthis, data, flag);
				},
				failed : function(error)
				{
					dthis.PaginationWidget.refresh(1);
					onError(error);
				}
			});
		}
		
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
					//高亮显示
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
					dthis.jsonData = data;
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
		/**
		*检查发布详情
		*/
		function checkPublish(path){
			// 显示遮罩
			Mask.show();
			// 展开log窗口
			Mask.showLogWindow();
			
			preview_cls.validate({
				previewPath : path,
				notifier : function(msg){
					Mask.appendLogItem(msg);
				},
				finished : function(){
					Mask.message("处理完毕",true);
				},
				error: function(error){
					Mask.message("处理失败",false);
					Mask.appendLogItem(error);
				}
			});
		}
		/**
		* 通过数据填充List实体
		*/
		function initListWidget(data, flag){
			var dthis = this;
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
				// 设置listitem中的图片
				if(listData[key]["preview"]){
					listw.setItemImage(key,listData[key]["preview"]);
				}else{
					var imgUrl = key.replace("previewlib","scenelib")
					listw.setItemImage(key,imgUrl+".preview");
				}
				// 设置名称字段
				var name = listData[key]["resourceName"];
				if(!name)name = "未命名";
				var div = domConstruct.create(
					"div",{
						innerHTML : "名称：" + name,
						id : key
					}
				);
				var isPublished = listData[key]["isPublished"];
				if(isPublished == "true")
				{
					dthis.alreadyPublish.push(key);
				}
				// 添加检查发布功能字段
				// var atagInnerHTML = "[发布前检查]";
				// if(dthis.isGutil){
					// atagInnerHTML = "[模型检查]";
				// }
				// var checkPub = domConstruct.create(
					// "a",{
						// style:"padding:3px;cursor:pointer;",
						// innerHTML : atagInnerHTML
					// }
				// );
				
				// 给检查发布功能添加事件
				// on(checkPub,"click",function(){
					// var path = query(this).parents("li").attr("itemid")[0];
					// checkPublish(path);
				// });
				
				// 添加发布效果图按钮
				// var atag = domConstruct.create(
					// "a",{
						// style : "padding:3px;cursor:pointer;",
						// innerHTML : "[发布效果图]",
						// id : key
					// }
				// );
				dthis.flag = flag;
				// 给发布效果图按钮添加事件
				// on(atag,"click",function(){
					// var _this = this;
					// var previewPath = query(this).parents("li").attr("itemid")[0];
					// var type = "preview";
					// var postData = {
						// path:previewPath,
						// isPublishModel:"False",
						// success : function(suc){
							// dthis.alreadyPublish.push(previewPath);
							// if(suc.match("success")){
								// Mask.message("发布成功",true);
								// Mask.appendLogItem("发布成功！");
								// // 添加UI发布显示
								// var style = "";
								// if(flag == "onShowList")
								// {
									// style = "position:absolute;left:560px;top:10px;cursor:pointer";
								// }
								// else
								// {
									// style = "position:absolute;left:60px;top:50px;cursor:pointer";
								// }
								// var img = domConstruct.create(
									// "div",{
										// innerHTML : "<img src='/widgets/LibView/images/ispublished.png'/>",
										// style : style
									// }, dom.byId(_this.id)
								// );
								// on(img,"click",function(){
									// //发送事件
									// function sendEvent(eventName,listw){
										// var currentItem = query(this).parents("li");
										// var itemId = currentItem.attr("itemid");
										// //发出删除消息
										// listw.emit(eventName,itemId[0]);
									// }
									// sendEvent.call(this,"onListItemClick",listw);
								// });
							// }
							// if(suc.match("this preview has published")){
								// Mask.message("已被发布",false);
								// Mask.appendLogItem("该效果图已经被发布过了！");
							// }
						// },
						// failed : function(error){
							// Mask.message("发布失败",false);
							// Mask.appendLogItem(error);
						// }
					// };
					// showAlsoReleaseModel.call(dthis,type,postData);
				// });
				// ====================================================================
				
				// 添加检查发布功能字段
				// var download = domConstruct.create(
					// "a",{
						// style:"padding:3px;cursor:pointer;",
						// innerHTML : "下载效果图"
					// }
				// );
				
				// // 给检查发布功能添加事件
				// on(download,"click",function(){
					// // 这里应该想gutil发送请求，下载该效果图对应的场景 TODO
					// Mask.show();
					// var _this = this;
					// var previewPath = query(this).parents("li").attr("itemid")[0];
					// console.log(previewPath);
					// var resource = previewPath + ".downloadmodel";
					// var url = "http://127.0.0.1:10828/download?method=POST";//?resource="+resource+"&";
					// var content = {};
					// content.resource = resource;
					// content.fileformat = "max";
					// require(["dojo/request/iframe"], function(iframe){
						// iframe(url, {
							// method : "GET",
							// handleAs: "text",
							// data: content
						// }).then(
							// function(data){
								// Mask.hide();
								// console.log(data);
							// }, 
							// function(err){
								// console.log(err);
							// }, 
							// function(evt){	
							// }
						// );
					// });
				// });
				// ====================================================================
				// 添加名称字段
				listw.addDomNode(key,div);
				
				// 添加检查发布字段
				// listw.addDomNode(key,checkPub);
				
				// 是否支持发布功能
				// if(dthis.isPublish){
					// listw.addDomNode(key,atag);
				// }
				
				// 是否是gutil访问
				if(dthis.isGutil){
					listw.addDomNode(key,download);
				}
			}
			
			// 给已经发布的添加图片和图片事件
			arrayUtil.forEach(array, function(item){
				var pathArray = new Array();
				pathArray.push(item);
				previewlib_class.isPublished(
					pathArray,
					function(jsonData){
						for(var i in jsonData)
						{
							if(jsonData[i])
							{
								var style = "";
								if(flag == "onShowList")
								{
									style = "position:absolute;left:560px;top:10px;cursor:pointer";
								}
								else
								{
									style = "position:absolute;left:60px;top:50px;cursor:pointer";
								}
								var img = domConstruct.create(
									"div",{
										innerHTML : "<img src='/widgets/LibView/images/ispublished.png'/>",
										style : style
									}, dom.byId(i)
								);
								
								on(img,"click",function(){
									//发送事件
									function sendEvent(eventName,listw){
										var currentItem = query(this).parents("li");
										var itemId = currentItem.attr("itemid");
										//发出删除消息
										listw.emit(eventName,itemId[0]);
									}
									sendEvent.call(this,"onListItemClick",listw);
								});
							}
						}
					},
					function(error){
						throw error;
					}
				);
			});
			
			//初始化完毕
			this.init = true;
		}
		
		/**
        * 发布效果图
		*/
		function publishPreview(type,postData){
			// 这里调用 spolo.data.preview.publish 方法
			folderClass.publish(type,postData);
		}
		
		// 当点击List控件的图片时
		function onListItemClick(data){
			// new PreviewDetail控件
			var previewPath = data;//data["scene"]+"/"+data["name"];
			showPreviewDetail.call(this,previewPath);
		}
		
		// 询问用户是否连带效果图中的模型一起发布
		function showAlsoReleaseModel(type,postData){
			if(this.alsoReleaseModelDialog){
				this.alsoReleaseModelDialog.destroy();
			}
			
			var contentpane = "<div id=\"alsoReleaseModelContent\">"+
								"<div style='margin-bottom:10px;'>首先</div>"+
								"<div style='margin-bottom:25px;'><button class=\"checkPublish\">发布前检查</button></div>"+
								"<div style='margin-bottom:10px;'>可选项</div>"+
								"<div class=\"publishChoice\" style='margin-bottom:30px;'>"+
									"<input type=\"checkbox\" checked='checked' name=\"publishContent\" value=\"containsModel\">将效果图中所包含的模型也一起发布</input>"+
								"</div>"+
								"<div class=\"publishBtnList\">"+
									"<button class=\"publishBtn\" style='margin-right:10px;'>发布</button>"+
									"<button class=\"publishCancel\">取消</button>"+
								"</div>"+
							"</div>";
			this.alsoReleaseModelDialog = new Dialog({
				title:"发布效果图",
				content:contentpane
			});
			query(".dijitDialogPaneContent",dom.byId(this.alsoReleaseModelDialog.id)).style({padding:"20px 150px 30px 20px"});
			
			var dthis = this;
			//订阅检查发布按钮的事件
			on(query(".checkPublish",dom.byId(dthis.alsoReleaseModelDialog.id)),"click",function(){
				var path = postData["path"];
				checkPublish(path);
			});
			
			//发布
			on(query(".publishBtn",dom.byId(dthis.alsoReleaseModelDialog.id)),"click",function(evt){
				dthis.alsoReleaseModelDialog.hide();
				// 显示遮罩
				Mask.show();
				var checkedRadio = query(".publishChoice input[type='checkbox']:checked")[0];
				if(checkedRadio){
					postData["isPublishModel"] = "True"
				}	
				// 调用发布效果图的方法
				publishPreview.call(dthis,type,postData);
			});
			
			//取消发布
			on(query(".publishCancel",dom.byId(dthis.alsoReleaseModelDialog.id)),"click",function(evt){
				dthis.alsoReleaseModelDialog.hide();
			});
			
			this.alsoReleaseModelDialog.show();
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
			var url = "/widgets/PreviewDetail/PreviewDetailInMyPreviewLib.html";
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
			var iframe = window.parent.iframe || this.iframe;
			var dialogData = 
			{
				widthradio: 0.9,
				heightradio:0.9,
				title:"效果图预览",
				url:url,
				data:{
					"scene":scene,
					"iframe":iframe,
					"numberSpinner":this.numberSpinner,
					"oldModel":oldModel,
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
						//window.location.reload();
						initListWidgetData.call(dthis);
					});
				}
			};
			Spolo.dialog(dialogData);
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

		var ret = declare("widgets/LibView/MyPreviewLib",	[ LibView ],
		{			
			constructor:function(json){
				
				var dthis = this;
				// 临时的path路径
				var tempPath = "/content/users/"+Spolo.getUserId()+"/previewlib";
				
				// 初始化参数，是否完成了初始化
				this.init = false;
				this.alreadyPublish = new Array();
				this.propertyData = {
					// "previewCategory" : "/content/previewcategory",
					// "previewStyle" : "/content/modellibcategory/modelstyle",
					// "previewRoom" : "/content/modellibcategory/room"
				}
				
				if(json){
					this.json = json;
					this.currentPage = json["currentPage"] || 1;
					this.limit = json["limit"] || 8;
					this.isPublish = json["isPublish"] || false;
					this.isGutil = json["isGutil"] || false;
					this.hasButton = json["hasButton"] || false;
					this.previewDetailHasButton = json["canAddModel"]!=undefined?json["canAddModel"]:true;
					this.numberSpinner = json["numberSpinner"]!=undefined?json["numberSpinner"]:false;
					this.path = json["path"] || tempPath;
					this.isRadio = json.isRadio || false; //list组件的单选或多选控制，默认为多选
					this.isInsteadModel = json.isInsteadModel || false; //控制弹出的效果图组件是否是替换模式，默认是加入场景模式
					this.oldModel = json.oldModel || {}; //如果是替换模式应该传第一个旧模型对象
					//初始化下拉框
					this.stateStore = new Memory({
						data:[]
					});
					this.search = false;
					this.filterValue = "";
					this.scene = json["scene"];
					this.iframe = json["iframe"];
				}else{
					//默认值
					this.currentPage = 1;
					this.limit = 8;
					this.isPublish = false;
					this.isGutil = false;
					this.hasButton = false;
					this.path = tempPath;
					this.search = false;
					this.filterValue = "";
				}
				
				this.filterJson = {};	// 保存分类筛选的条件
				// 订阅基类的模板初始化完毕事件
				this.on("postCreateReady",function(){
					// 是否隐藏按钮面板
					dthis.displayButtonList(this.hasButton);
					dthis.displayRenderButton(false);
					dthis.displayRenderAllButton(false);
					
					// 初始化列表控件的数据
					initListWidgetData.call(this);
					// initCategory.call(this);
					//this.divFoldCategoryNode.click();
					/*
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
								if(!flag || value.trim() != ""){
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
					*/
					// 初始化用户信息显示
					var userEmail = Spolo.decodeUname( Spolo.getUserId() );
					if(!userEmail || userEmail=="nonymous"){
						alert("该功能需要登录后才能使用");
						window.location.href="/modules/user/index.html?redirect=/modules/myJob/upload2.html";
					}
					//设置显示用户名称
					this.userInfo.innerHTML = "当前登录用户:" + userEmail;
					// 初始化搜索栏
					console.log(this.searchNode, " searchNode");
				});
				
				// 订阅基类的列表控件的缩略图点击事件	
				this.listWidget.on("onListItemClick",function(data){
					// 这里是订阅基类的 List 控件的相关方法
					onListItemClick.call(dthis, data);
				});
				
				// 订阅分页事件
				var dthis = this;
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
						initListWidgetData.call(dthis);
					}
				);
				
				/**
				*订阅按钮面板功能按钮事件
				*/
				// //排序
				// this.on("onSort",function(data){
					// sortList.call(this,data);
				// });
				// // 全选
				// this.on("onSelectAll",function(){
					// this.listWidget.selectAll();
				// });
				
				// 取消选择
				// this.on("onUnSelectAll",function(){
					// this.listWidget.unSelectAll();
				// });
				
				// // List 布局
				// this.on("onShowList",function(){
					// initListWidgetData.call(dthis, "onShowList");
					// this.listWidget.showList();
				// });
				
				// // 大图 布局
				// this.on("onShowThumbnail",function(){
					// initListWidgetData.call(dthis);
					// this.listWidget.showThumbnail();
				// });
				
				this.on("onTimeOrderRise",function()
				{
					console.log("onTimeOrderRise");
					var data = 
					{
						sortName: "jcr:created",
						order: "orderAsc"
					};
					sortList.call(this,data);
				});
				this.on("onTimeOrderDrop",function()
				{
					console.log("onTimeOrderDrop");
					var data = 
					{
						sortName: "jcr:created",
						order: "orderDesc"
					};
					sortList.call(this,data);
				});
				this.on("onNameOrderRise",function()
				{
					console.log("onNameOrderRise");
					var data = 
					{
						sortName: "resourceName",
						order: "orderAsc"
					};
					sortList.call(this,data);
				});
				this.on("onNameOrderDrop",function()
				{
					console.log("onNameOrderDrop");
					var data = 
					{
						sortName: "resourceName",
						order: "orderDesc"
					};
					sortList.call(this,data);
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
				
				// 订阅删除按钮事件
				this.listWidget.on("onDelItemClick",function(itemid){
					// 显示是否删除
					dthis.MsgDialog.show();
					
					// 删除按钮事件执行函数
					dthis.execDelOption = function(){
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
					dthis.getCategory = function(modifyStyleButton)
					{
						preview_cls.getPreviewProperty(
							itemid,
							function(data){
								dthis.initData = data;
								getFullNameArrayFromFolder(data["previewStyle"], function(label){
									var style = dom.byId("PersonalModifyStyleBtn");
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
									var room = dom.byId("PersonalModifyRoomBtn");
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
									var Property = dom.byId("PersonalModifyPropertyBtn");
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
								
								var textareaDis = dom.byId("PersonalTextareaDisInfo");
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
					
					dthis.getCategory()
					
					// 编辑文本框
					var previewNameInput = query("#PersonalInputProperty",dom.byId(dthis.UpdateDialog.id));
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
								// 添加UI发布显示
								for(var index = 0; index < dthis.alreadyPublish.length; index ++)
								{
									if(itemid == dthis.alreadyPublish[index])
									{
										var style = "";
										if(dthis.flag == "onShowList")
										{
											style = "position:absolute;left:560px;top:10px;cursor:pointer";
										}
										else
										{
											style = "position:absolute;left:60px;top:50px;cursor:pointer";
										}
										var img = domConstruct.create(
											"div",{
												innerHTML : "<img src='/widgets/LibView/images/ispublished.png'/>",
												style : style
											}, dom.byId(itemid)
										);
										on(img,"click",function(){
											//发送事件
											function sendEvent(eventName,listw){
												var currentItem = query(this).parents("li");
												var itemId = currentItem.attr("itemid");
												//发出删除消息
												listw.emit(eventName,itemId[0]);
											}
											sendEvent.call(this,"onListItemClick",dthis.listWidget);
										});
									}
								}
							},
							function(error){
								throw error;
							}
						);
					};
					// 隐藏提示窗口
					dthis.updateCategory = function(selectedData)
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