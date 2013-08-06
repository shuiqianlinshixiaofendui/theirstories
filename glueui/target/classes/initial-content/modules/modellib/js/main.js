/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: spolo@spolo.org
 *  
 *  author		 : 	yangxiuwu@spolo.org
 *  wiki  		 : 	这里是对应的wiki地址
 *  description  : 	这里是功能描述
 **/

require(
	[
		"dojo/on",
		"dojo/ready",
		"dojo/_base/lang",
		"dijit/Dialog",
		"dijit/form/Button",
		"dojo/dom-construct",
		"widgets/WaterFall/main",
		"widgets/Search/main",
		"widgets/AdvCategory/main",
		"widgets/Toolbar/Toolbar",
		"spolo/data/folder/modellib",
		"spolo/data/folder",
		"spolo/data/user"
	],
	function(on, ready, lang, Dialog, Button, domConstruct, waterfall, search, AdvCategory, Toolbar, folder_modellib, folder_cls, user_cls){
		// 设置全局变量，用来存储搜索搜索/查询条件
		var conditions = {
			"limit" : 15,
			"offset" : "0",
			"fuzzyProperties" : {},
			"timeRangesProperties" : {},
			"callback" : function(){}
		};
		var isGrant = false;
		ready(function(){
			var userName = Spolo.getUserId();
			var path = "/content/modellib"
			user_cls.isGranted(
				userName,
				path,
				function(result){
					if(result == "True"){
						isGrant = true;
					}
				},
				function(error){
					throw error;
				}
			);
			// create widgets
			var args = [
				{"name":"名称","id":"resourceName"},
				{"name":"发布者","id":"publishAuthor"},
				{"name":"模型关键字","id":"keyInfo"},
				{"name":"描述","id":"introduction"},
				{"name":"发布时间","id":"timeRangesProperties","type":"calendar"}
			];
			var searchWidget = new search({
				filterData: args
			}).placeAt("search");
			var advCategory = new AdvCategory();
			advCategory.placeAt("catgory");
			var waterfall_ref = new waterfall();
			waterfall_ref.placeAt("model_list");
			
			// init search widget
			on(searchWidget, "search", function(filterData){
				doSearch.call(this, filterData, waterfall_ref);
			});
			
			on(searchWidget, "advanceSearch", function(filterData){
				doSearch.call(this, filterData, waterfall_ref);
			});
			
			// init advCategory widget
			var path = "/content/modellibcategory";
			folder_cls.getCategory
			({
				path:path,
				success:function(cateData)
				{
					advCategory.initialize(cateData);
					on(advCategory,"subcatItem",function(json){
						advCategorySubcatItem.call(this, json);
					});
					
					on(advCategory,"siblingcatItem",function(json){
						advCategorySiblingcatItem.call(this, json);
					});
					
					on(advCategory,"categoryItemChange",function(json){
						advCategoryCategoryItemChange.call(this, json, waterfall_ref);
					});
					
					on(advCategory,"switchSiblingCategory",function(json){
						advCategorySwitchSiblingCategory.call(this, json, waterfall_ref);
					});
					
					on(advCategory,"moreCategoryItem",function(json){
						advCategoryMoreCategoryItem.call(this, json);
					});
					
					on(advCategory,"addCategory",function(json){
						advCategoryAddCategory.call(this, json);
					});
					
					on(advCategory,"moreCategory",function(json){
						advCategoryMoreCategory.call(this, json);
					});
				},
				failed:function(error)
				{
					console.log(error);
				}
			});
		
			// init WaterFall widget
			conditions["callback"] = function(initDataList, totalNum){
				console.log("初始化数据");
				console.log(initDataList);
				var pageNum = totalNum/(conditions["limit"]);
				if(pageNum == 0){
					pageNum = 1;
				}
				waterfall_ref.initData(initDataList, Math.ceil(pageNum));
				if(isGrant = false){
					waterfall_ref.setDelButtonDisplay("none");
				}
				on(waterfall_ref,"loadPic",function(args){
					waterFallLoadPic.call(this, args);
				});
				
				on(waterfall_ref,"picClick", function(data){
					pagesJump.call(this, data);
				});
				
				on(waterfall_ref,"loadingData",function(data){
					waterFallLoadingData.call(this, data);
				});
				
				on(waterfall_ref,"delPic",function(args){
					var dthis = this;
					dialog.show();
					on(btnSure,"click",function(){	
						removeRefs.call(dthis,args);
						dialog.hide();
					});		
				});
				
				on(waterfall_ref,"sourceDownload",function(args){
					pagesJump.call(this, args, "downLoadModel");
				});
				
			};
			getModellist.call(this, conditions);
			
			var btnSure = domConstruct.create("div",
					{
						innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>确定</button>",
						style:"float:left; width:45px;margin-left:22%;margin-top:10px;"
					},div
				);
			var btnCancel = domConstruct.create("div",
				{
					innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>取消</button>",
					style:"float:left; width:45px;margin-top:10px;"
				},div
			);
			var div = domConstruct.create("div",{
				innerHTML:"<center><label>确定删除吗？</label><br /></center>"
				}
			);
			domConstruct.place(btnSure,div,"last");
			domConstruct.place(btnCancel,div,"last");
			
			var dialog = new Dialog({
				title: "删除模型",
				content: div,
				style: "width: 200px;height:100px;position:relavite;top:20px;font-size:12px;background-color:white"
			});
			
			on(btnCancel,"click",function(){
				dialog.hide();
			});	
			
		
		});
		
		function doSearch(filterData, waterfall_ref){
			console.log("点击search，返回的搜索条件对象");
			console.log(filterData);
			var json = {};
			for(var index = 0; index < filterData.length; index ++){
				console.log(!filterData[index]["filterName"].indexOf("timeRangesProperties"));
				if(filterData[index]["filterName"].indexOf("timeRangesProperties")){
					json[filterData[index]["filterName"]] = filterData[index]["filterValue"];
				}else{
					console.log(filterData[index]["filterName"]);
					var filterName = filterData[index]["filterName"];
					var filterNameArray = filterName.split("-");
					conditions["timeRangesProperties"][filterNameArray[1]] = filterData[index]["filterValue"];
				}
			}
			console.log(json);
			lang.mixin(conditions["fuzzyProperties"], json);
			conditions["callback"] = function(dataList, totalNum){
					console.log(dataList);
					console.log(totalNum);
					waterfall_ref.refreshData(dataList, Math.ceil(totalNum/(conditions["limit"])));
				}
			getModellist.call(this, conditions);
		}
		
		function waterFallLoadPic(args){
			var _this = this;
			conditions["offset"] = (args.start-1).toString();
			conditions["callback"] = function(dataList){
				console.log("点击上/下页事件");
				console.log((args.start-1).toString())
				console.log(dataList);
				_this.receiveData(dataList,args);
			}
			getModellist.call(this, conditions);
		}
		
		function waterFallLoadingData(data){
			var _this = this;
			conditions["offset"] = (data * (conditions["limit"])).toString();
			conditions["callback"] = function(dataList){
				console.log("滚轮事件");
				console.log((data * (conditions["limit"])).toString());
				console.log(dataList);
				_this.addData(dataList);
			}
			getModellist.call(this, conditions);
		}
		
	
		
		function format(obj){
			if(obj<10)
				return "0" +""+ obj;
			else
				return obj;
		}
		
		function setpublishdate(date){
			var _date = new Date(date);
			var datestring = format(_date.getFullYear()) + "."
				+ format(_date.getMonth()+1) + "."
				+ format(_date.getDate()) + " "
				+ format(_date.getHours()) + ":"
				+ format(_date.getMinutes()) + ":"
				+ format(_date.getSeconds());
			return datestring;
		}
		
		function advCategorySubcatItem(json){
			console.log("subcatItem");
			var _this = this;
			var path = json["path"];
			folder_cls.getSubCategory({
				path : path,
				success : function(subCatArr)
				{
					_this.getSubCategory(subCatArr);
				},
				failed : function(error){
					console.error(error);
				}
			});
		}
		
		function advCategorySiblingcatItem(json){
			console.log("siblingcatItem");
			var _this = this;
			var path = json["path"];
			folder_cls.getSiblingCategory({
				path : path,
				success : function(siblingCatArr)
				{
					_this.getSibCategory(siblingCatArr);
				},
				failed : function(error)
				{
					console.error(error);
				}
			});
		}
		
		function advCategoryCategoryItemChange(json, waterfall_ref){
			console.log("categoryItemChange");
			console.log(json);
			var categoryString = {};
			for(var i in json){
				switch(i)
				{
					case "/content/modellibcategory/modelbrand":
						categoryString["brandPath"] = json[i][json[i].length-1];
						break;
					case "/content/modellibcategory/modelcategory":
						categoryString["categoryPath"] = json[i][json[i].length-1];
						break;
					case "/content/modellibcategory/modelmadeof":
						categoryString["madeOfPath"] = json[i][json[i].length-1];
						break;
					case "/content/modellibcategory/modelstyle":
						categoryString["stylePath"] = json[i][json[i].length-1];
						break;
					case "/content/modellibcategory/room":
						categoryString["roomPath"] = json[i][json[i].length-1];
						break;
					case "/content/modellibcategory/sightfeeling":
						categoryString["sightfeelingPath"] = json[i][json[i].length-1];
						break;
					default:
						break;
				}
			}
			lang.mixin(conditions["fuzzyProperties"], categoryString);
			conditions["callback"] = function(dataList, totalNum){
					console.log(dataList);
					waterfall_ref.refreshData(dataList, Math.ceil(totalNum/(conditions["limit"])));
				}
			getModellist.call(this, conditions);
		}
		
		function advCategorySwitchSiblingCategory(json, waterfall_ref){
			console.log("switchSiblingCategory");
			var _this = this;
			var path = json["path"];
			folder_cls.getSubCategory({
				path : path,
				success : function(subCatArr)
				{
					_this.switchCategory(subCatArr);
					console.log(path);
					var keyWord = path.split("/");
					var categoryString = {};
					switch(keyWord[3])
					{
						case "modelbrand":
							categoryString["brandPath"] = path;
							break;
						case "modelcategory":
							categoryString["categoryPath"] = path;
							break;
						case "modelmadeof":
							categoryString["madeOfPath"] = path;
							break;
						case "modelstyle":
							categoryString["stylePath"] = path;
							break;
						case "room":
							categoryString["roomPath"] = path;
							break;
						case "sightfeeling":
							categoryString["sightfeelingPath"] = path;
							break;
						default:
							break;
					}
					lang.mixin(conditions["fuzzyProperties"], categoryString);
					conditions["callback"] = function(dataList, totalNum){
							console.log(dataList);
							waterfall_ref.refreshData(dataList, Math.ceil(totalNum/(conditions["limit"])));
						}
					getModellist.call(this, conditions);
				},
				failed : function(error){
					console.error(error);
				}
			});
		}
		
		function advCategoryMoreCategoryItem(json){
			console.log("moreCategoryItem");
			var _this = this;
			var path = json["path"];
			folder_cls.getSubCategory({
				path : path,
				success : function(subCatArr)
				{
					_this.getMoreSubCategory(subCatArr);
				},
				failed : function(error){
					console.error(error);
				}
			});
		}
		
		function advCategoryAddCategory(json){
			console.log("addCategory");
			var _this = this;
			var path = json["path"];
			folder_cls.getSubCategory({
				path : path,
				success : function(subCatArr)
				{
					_this.addCategory(subCatArr);
				},
				failed : function(error){
					console.error(error);
				}
			});
		}
		
		function advCategoryMoreCategory(json){
			console.log("moreCategory");
			var _this = this;
			var path = json["path"];
			folder_cls.getSubCategory({
				path : path,
				success : function(subCatArr)
				{
					_this.getMoreCategory(subCatArr);
				},
				failed : function(error){
					console.error(error);
				}
			});
		}
		
		function pagesJump(data, page){
			var url = "/modules/modeledit/index.html?modelPath=" + data + "&page=" + page;
			// var field = dthis.listWidget.getField(modelPath,1);
			var dialogData = 
			{
				widthpx: 980,
				heightpx : 700,
				id:data,
				title:"模型详细信息",
				url:url,
				data:
				{
					// "modelPath":modelPath,
					// "list":dthis.listWidget,
					// "showAddItemsModelLib":dthis.showAddItemsModelLib
				},
				callback: function(spdialog){
				
				}
			};
			Spolo.dialog(dialogData);
		}
		
		function getModellist(args){
			var fuzzyProperties = args["fuzzyProperties"];
			if(!fuzzyProperties){
				fuzzyProperties = {};
			}
			
			var obj = {
				limit : args["limit"],// 每页个数
				offset : args["offset"],
				isPersonalLib : false,
				fuzzyProperties : fuzzyProperties,
				success : function(data){
					var dataList = analyseJSON(data)
					args["callback"](dataList, data["totalNum"]);
				},
				failed : function(){
					throw error;
				},
			};
			lang.mixin(obj,conditions);
			folder_modellib.getModellist(obj);
		}
		
		function removeRefs(args){
			var _this = this;
			folder_modellib.removeRefs(
				args,
				function(){
					conditions["offset"] = "0";
					conditions["callback"] = function(dataList,totalNum){
						console.log(totalNum);
						_this.deleteData(true,Math.ceil(totalNum/(conditions["limit"])));
					}
					getModellist.call(this, conditions);
				},
				function(){
				console.log(error);
			});
		} 
		
		function analyseJSON(data){
			// 成功的回调函数
			var dataList = new Array();
			for(var index in data["data"]){
				var date = setpublishdate.call(this, data["data"][index]["publishdate"]);
				var publishAuthor = data["data"][index]["publishAuthor"];
				publishAuthor = Spolo.decodeUname(publishAuthor);
				var resourceName = data["data"][index]["resourceName"];
				var fieldsList = {
					"名    称" : resourceName,
					"发 布 者" : publishAuthor,
					"发布时间" : date
				}
				
				var previewurl = data["data"][index]["previewurl"];
				if(previewurl == "false" || !previewurl){
					previewurl = "/modules/modellib/images/nopreview.jpg";
				}
				var json = {
					"id" : index,
					"img" : previewurl,
					"fields" : fieldsList,
					"button" : "点击下载模型"
				}
				
				dataList.push(json);
			}
			return dataList;
		}
		
		function demoWidget_someEventFun(data){
		var _this = this;
		// 需要获得点击的是哪个
		// 可以查看详细信息，用 spdialog，嵌套 modeledit 模块
		}
	}
);