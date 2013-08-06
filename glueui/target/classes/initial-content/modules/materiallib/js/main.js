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

require(
	[
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/ready",
		"dojo/_base/array",
		"dojo/_base/event",
		"dojo/dom-construct",
		"dojo/mouse",
		"spolo/data/folder",
		"spolo/data/folder/materiallib",
		"spolo/data/user",
		"spolo/data/material",
		"widgets/Pagination/main_materiaList",
		"dijit/Dialog",
		"widgets/Mask/Mask",
        "widgets/Dialog/main",
		"widgets/menu/ThirdNav/main",
		"dojo/NodeList-traverse",
		"dojo/NodeList-manipulate"
		
	],function(
		query, on, dom, domClass, ready, arrayUtil, event, domConstruct, mouse,
		folder_cls, materiallib, user, material_cls, Pagination_materiaList, Dialog, Mask, widget_dialog, widget_thirdnav
	){
		//过滤条件
		var filterData = {};
		//材质库路径
		var matLibPath = "/content/materiallib";
		//确认对话框
		var confirmDialog;
		//删除材质集合
		var deleteMatList;
		//材质库操作对象
		var folderObj;
		//每页显示数量
		var limit = 20;
		//当前页
		var currentPage = 1;
		//搜索语句
		var inputName = "";
		
		// 判断是否是 gutil 访问的
		var isGutil = false;
		
		var userName = "";
		var showPagination = null;
		var categoryArray = [];
        
        var w_dialog; //添加Widget Dialog组建
		
		ready(function(){
            // 添加Dialog
            w_dialog = new widget_dialog();
            w_dialog.placeAt(dojo.byId("dialog_placeAt"));
            w_dialog.startup();
            w_dialog.isMode(false);
            w_dialog.modifyPrompt("建议");
            
            on(dojo.byId("Feedback"),"click",function(){
                w_dialog.dialog_open(0,4);
            });
            
            //添加 Email 对象
            var Email_root = domConstruct.create("a", {href:"mailto:caobin@3dly.net?subject=Glue产品使用反馈",style:"float:left;width:200px;"});
            var Email_p = domConstruct.create("p", { innerHTML:"邮件联系 : ",style:"float:left;width:70px;"},Email_root);
            var Email = domConstruct.create("img", { title:"点击发送邮件 ",style:"float:left;width:50px;height:50px;",src:"/modules/materiallib/images/Email_icon.png"},Email_root);
            var Email_json = {
                left : 70,
                top : 30,
                width : 50,
                height : 40 
            }
            w_dialog.injectDomNode(Email_root,Email_json);
            
            
            var Email_addr = domConstruct.create("p", {innerHTML:"或者发邮件到：caobin@3dly.net",style:"float:left;width:200px;color: rgb(5, 5, 5);font-size: 12px;"});
            var Email_addr_json = {
                left : 70,
                top : 10,
                width : 200,
                height : 50 
            }
            w_dialog.injectDomNode(Email_addr,Email_addr_json);
            
            var QQ_root = domConstruct.create("a", {href:"http://wpa.qq.com/msgrd?V=1&Uin=2274343382",style:"float:left;width:200px;"});
            var QQ_p = domConstruct.create("p", { innerHTML:"QQ联系 : ",style:"float:left;width:70px;"},QQ_root);
            var QQ = domConstruct.create("img", {title:"点击发送QQ消息",style:"width:50px;height:50px;",src:"/modules/materiallib/images/qq_icon.gif"},QQ_root);
            var QQ_json = {
                left : 70,
                top : 50,
                width : 80,
                height : 80 
            }
            w_dialog.injectDomNode(QQ_root,QQ_json);
			var varsMap = Spolo.getUrlVars();
			isGutil = varsMap ['isGutil'];
			userName = Spolo.getUserId();
			initCategories();
			//初始化材质列表
			initMatList(limit, currentPage, function(data){
				addItems(data["data"]);
				//创建按钮
				var page = Math.ceil(data["totalNum"]/limit);
				showPagination = new Pagination_materiaList(page).placeAt("smk_pagination");
				
				//接收鼠标点击的页面数值
				showPagination.on("changePage",function(data){
					var currentPage = data.curPage;
					var fuzzyJson = getJsonFromFilter();
					doSearchInput(inputName, limit, currentPage, fuzzyJson, function(data){
						addItems(data["data"]);
						// data["totalNum"]
						// Recreate
					});
				});
				
				//初始化点击页面按钮事件
				showPagination.clickpage();
			});
			
			var inputSearch = dom.byId("inputSearch");
			inputSearch.onfocus = function(){
				inputSearch.style["background"] = "#fff";
				inputSearch.style["width"] = "300px";
			}
			inputSearch.onblur = function(){
				if(!inputSearch.value){
					inputSearch.style["background"] = "#eee";
					inputSearch.style["width"] = "200px";
				}
			}
			inputSearch.onkeypress = function(event){
				if(event.keyCode == 13){
					inputName = inputSearch.value;
					var fuzzyJson = getJsonFromFilter();
					doSearchInput(inputName, limit, currentPage, fuzzyJson, function(data){
						resetCategories(inputName, data);
					});
				}
			}
			on(query("#search_btn"),"click",function(){
				inputName = inputSearch.value;
				filterData = {};
				doSearchInput(inputName, limit, currentPage, filterData, function(data){
					resetCategories(inputName, data);
				});
			});
			
			on(query("#searchNotAll_btn"),"click",function(){
				inputName = inputSearch.value;
				var fuzzyJson = getJsonFromFilter();
				doSearchInput(inputName, limit, currentPage, fuzzyJson, function(data){
					addItems(data["data"]);
					var page = Math.ceil(data["totalNum"]/limit);
					showPagination.Recreate(page);
				});
			});			
		});
		
		function resetCategories(inputName, data){
			addItems(data["data"]);
			var page = Math.ceil(data["totalNum"]/limit);
			showPagination.Recreate(page);
			// TODO 去掉分类，动态添加分类
			delCategories();
			if(inputName != "" && inputName != undefined)
			{
				var array = [];
				for(var i in data["data"]){
					for(var index = 0; index < categoryArray.length; index ++){
						if(data["data"][i]["categoryName"] == categoryArray[index].getURI()){
							console.log(data["data"][i]["resourceName"]);
							console.log(categoryArray[index].getName());
							var categoryData = {
								path : categoryArray[index].getURI(),
								name : categoryArray[index].getName()
							};
							array.push(categoryData);
						}
					}
				}
				for(var i = 0; i < array.length; i ++)
				{
					for(var index = (i+1); index < array.length; index ++){
						if(array[i]["path"] == array[index]["path"]){
							array.splice(index,1);
							index --;
						}
					}
				}
				for(var i = 0; i < array.length; i ++)
				{
					addMatCategory(array[i]);
				}
			}else{
				query("#matCategories")[0].innerHTML = "";
				initCategories();
			}
		}
		
		function confirm(ensure,cancel){
			if(!confirmDialog){
				var div = domConstruct.create("div",{innerHTML:"<div class=\"confirmMsg\"><label>确定删除吗？</label><br /></div>"});
				var btnList = domConstruct.create("div",{innerHTML:"",className:"confirmBtnList"},div)
				var btnSure = domConstruct.create(
					"div",
					{
						style:"width:45px;float:left;",
						innerHTML:"<button data-dojo-type=\"dijit/form/Button\">确定</button>"
					},btnList);
				var btnCancel = domConstruct.create(
					"div",
					{
						style:"width:45px;float:left;margin-left:5px",
						innerHTML:"<button data-dojo-type=\"dijit/form/Button\">取消</button>"
					},btnList);
				confirmDialog = new Dialog({
					title: "删除材质",
					content: div,
					style: "width: 300px;position:relavite;top:20px;font-size:12px;background-color:white"
				});
				
				on(btnSure,"click",function(){
					ensure();
					confirmDialog.hide();
				});	
				
				on(btnCancel,"click",function(){
					cancel();
					confirmDialog.hide();
				});	
			}
			confirmDialog.show();
		}
		
		function isGrant(pass,refuse){
			user.isGranted(
				userName,
				matLibPath,
				function(result)
				{
					if(result == "False")
					{
						refuse();
					}else if(result == "True"){
						pass();
					}
				},
				function(error){
					throw error;
				}
			);
		}
		function initGrantUI(){
			//删除材质的UI
			var deleteNode = query(".pf_icon .delete").parent();
			deleteNode.style("display","inline");
		}
		function initUi(){
			var matNodeList = query(".matListItem").children(".matListItemContain");
			if(matNodeList){
				matNodeList.on(mouse.enter,function(){
					matHover(this,true);
					showIcon(this,true);
				});
				matNodeList.on(mouse.leave,function(){
					matHover(this,false);
					showIcon(this,false);
				});
			}
		}
		function initGrantFun(){
			isGrant(initGrantUI,function(){});
		}
		function matHover(matNode,play){
			var detailNode = query(matNode).children(".matListItemImgWrap");
			var backgroundColor;
			if(play){
				backgroundColor = "#ddd";
			}else{
				backgroundColor = "#f8f8f8";
			}
			detailNode.style("backgroundColor",backgroundColor);
		}
		function showIcon(matNode,play){
			var detailNode = query(matNode).children(".pf_icon").children("a").children(".detail");
			var bigImNode = query(matNode).children(".pf_icon").children("a").children(".bigIm");
			var deleteNode = query(matNode).children(".pf_icon").children("a").children(".delete");
			var downloadNode = query(matNode).children(".pf_icon").children("a").children(".download");
			var opacity,
			detailMarginRight,
			bigImMarginRight,
			deleteMarginRigth,
			downloadMarginRigth
			if(play){
				opacity = 1;
				deleteMarginRigth = 5;
				detailMarginRight = 5;
				bigImMarginRight = 5;
				downloadMarginRigth = 5;
			}else{
				opacity = 0;
				detailMarginRight = -35;
				bigImMarginRight = -35;
				deleteMarginRigth = -35;
				downloadMarginRigth = -35;
			}
			detailNode.style({opacity:opacity,marginRight:detailMarginRight+"px"});
			bigImNode.style({opacity:opacity,marginRight:bigImMarginRight+"px"});
			downloadNode.style({opacity:opacity,marginRight:downloadMarginRigth+"px"});
			deleteNode.style({opacity:opacity,marginRight:deleteMarginRigth+"px"});
		}
		
		function doSearchInput(inputName, limit, currentPage, fuzzyJson, callback){
			delItems();
			materiallib.searchMaterial({
				"limit" : limit,
				"offset" : ((currentPage - 1) * limit).toString(),
				"fuzzyProperties" : fuzzyJson,
				"term" : inputName,
				"success" : function(matData){
					var data = matData["data"];
					if(data){
						callback(matData);
					}
				}
			});
		}
		
		function initCategories(){
			//getMatCategories(categoryLoad);
			var path = "/content/materiallibcategory";
			var thirdNav = new widget_thirdnav().placeAt("matCategories");
			folder_cls.getCategory
			({
				path:path,
				success:function(cateData)
				{
					var json = {
						catData : [],
						path: "",
						resourceName: "ALL",
						totalNum: 0
					}
					var arrar = [];
					arrar.push(json);
					for(var index = 0; index < cateData.length; index ++){
						arrar.push(cateData[index]);
					}
					thirdNav.initialize(arrar);
				},
				failed:function(error)
				{
					console.log(error);
				}
			});
			//监听分类的事件
			on(thirdNav,"changeNav",function(json)
			{
				var path = json["path"];
				filterData["categoryName"] = path;
				doSearchInput(inputName, limit, currentPage, filterData, function(data)
				{
					addItems(data["data"]);
					var page = Math.ceil(data["totalNum"]/limit);
					showPagination.Recreate(page);
				});
			});
			
		}
		
		function initMatList(limit, currentPage, callback){
			//获取材质数据
			materiallib.searchMaterial({
				"limit" : limit,
				"offset" :  ((currentPage - 1) * limit).toString(),
				"fuzzyProperties" : {},
				"success" : function(matData){
					var data = matData["data"];
					if(data){
						callback(matData);
					}
				}
			});
		}
		
		/**
		 * 材质分类
		 */
		function getMatCategories(onSucc,onError){
			//TODO 需要调用api获取材质分类
			var materialCategory = new folder_cls("/content/materiallibcategory");
			materialCategory.getChildren(
				function(array){
					categoryArray = array;
					onSucc(array);
				},
				function(err){
					if(typeof(onError) == "function"){
						onError();
					}else{
						console.error(err);
					}
				}
			);
			return matCategories;
		}
		function categoryLoad(categoryData){
			
			//分类加到页面
			var newNameArray = new Array();
			for(var i = 0; i < categoryData.length; i ++){
				var node = categoryData[i];
				var name = node.getName()
				newNameArray.push(name);
			}
			newNameArray.sort(function(a,b){
				return a.toLowerCase().localeCompare(b.toLowerCase());                           
			});
			for(var index = 0; index < newNameArray.length; index ++)
			{
				for(var i = 0; i < categoryData.length; i ++)
				{
					if(newNameArray[index] == categoryData[i].getName())
					{
						var node = categoryData[i];
						var url = node.getURI()
						var name = node.getName()
						var data = {
							path : url,
							name : name
						};
						newNameArray[index] = data;
						break;
					}
				}
			}
			addMatCategories(newNameArray);
			//给分类添加事件
			//addCategoryEvent();
		}
		//增加多个分类
		function addMatCategories(matCategories){
			if(matCategories != undefined){
				for(var categoryName in matCategories){
					if( typeof(matCategories[categoryName]) == "object" ){
						var category = matCategories[categoryName];
						//category["name"] = categoryName;
						addMatCategory(category);
					}
				}
			}
		}
		//增加一个分类
		function addMatCategory(matCategory){
			var itemNode = domConstruct.create("li",{
				innerHTML:"<a href=\"javascript:void(0)\" data-filter=\""+matCategory["path"]+"\" class=\"\">"+matCategory["name"]+"</a>"
			});
			var matCategoriesNode = dom.byId("matCategories");
			if(matCategoriesNode != undefined){
				domConstruct.place(itemNode,matCategoriesNode,"last");
			}
			//添加事件
			addCategoryEvent(itemNode);
		}
		//添加事件给All分类
		function addCategoryEventItemAll(){
			var categories = query("#matCategories li a[data-filter=\"*\"]");
			if(categories != undefined && categories[0] !=undefined){
				addCategoryEvent(categories[0].parentNode);
			}
		}
		//添加事件给分类
		function addCategoryEvent(itemNode){
			if(itemNode != undefined){
				var aCateList = query(itemNode).children("a");
				if(aCateList != undefined && aCateList[0] != undefined){
					var aCateNode = aCateList[0];
					var flag = true;
					on(aCateNode,"click",function(){
						var _this = this;
						if(flag){
							setTimeout(function(){
								flag = true;
							},500);
						}else{
							return;
						}
						flag = false;
						var clickCategory = this;
						var inputSearch = dom.byId("inputSearch");
						inputName = inputSearch.value;
						
						if(_this.innerText == "ALL"){
							inputSearch.value = "";
							inputName = "";
							delCategories();
							var matListNode = document.getElementById("matCategories");
							if(matListNode.children.length = 2){
								getMatCategories(categoryLoad);
							}
						}
						//获取所有分类
						var categories = query("#matCategories li a");
						if(categories != undefined){
							arrayUtil.forEach(categories,function(item,i){
								if(clickCategory == item){
									if(!domClass.contains(item,"active_cat")){
										domClass.add(item,"active_cat");
									}
								}else{
									if(domClass.contains(item,"active_cat")){
										domClass.remove(item,"active_cat");
									}
								}
							});
						}
						
						var data_filter = clickCategory.dataset;
						setJsonFilter(data_filter);
						var fuzzyJson = getJsonFromFilter();
						//根据分类查询材质
						doSearchInput(inputName, limit, currentPage, fuzzyJson, function(data){
							addItems(data["data"]);
							var page = Math.ceil(data["totalNum"]/limit);
							showPagination.Recreate(page);
						});
					});
				}
			}
		}
		//保存过滤条件
		function setJsonFilter(filter){
			if(filter != null && filter["filter"]){
				if(filter["filter"] == "*"){
					filterData = {};
				}else{
					filterData["categoryName"] = filter["filter"];
				}
				
			}
		}
		//获取所有过滤条件
		function getJsonFromFilter(){
			return filterData;
		}
		
		//增加多条数据
		function addItems(materials){
			if(materials != undefined){
				for(var name in materials){
					if( typeof(materials[name]) == "object" ){
						var material = materials[name];
						material["name"] = name;
						addItem(material);
					}
				}
				//初始化页面特效
				initUi();
				//初始化管理员操作
				initGrantFun();
			}
		}
		
		function delItems(){
			var matListNode = document.getElementById("matList");
			for(var index = 0; index < matListNode.children.length; index ++)
			{
				domConstruct.destroy(matListNode.children[index]);
				index --;
			}
		}
		
		function delCategories(){
			var matListNode = document.getElementById("matCategories");
			for(var index = 2; index < matListNode.children.length; index ++)
			{
				domConstruct.destroy(matListNode.children[index]);
				index --;
			}
		}
		
		//增加一条数据
		function addItem(material){
			// console.log("addItem(material)====");
			// console.log(material);
			
			var matListNode = dom.byId("matList");
			var name = material["resourceName"];
			var imgsrc = material["preview"];
			var url = material["name"];
			var html = "<div class=\"matListItemContain\">"+
							"<a class=\"matListItemImgWrap\">"+
								"<img class=\"matListItemImg\" src=\""+imgsrc+"\" />"+
							"</a>"+
							"<div class=\"pf_icon\">"+
								"<a title='材质下载' href=\"javascript:void(0)\">"+
									"<div class=\"download rta\"></div>"+
								"</a>"+
								"<a title='删除当前材质' href=\"javascript:void(0)\">"+
									"<div class=\"delete rta\"></div>"+
								"</a>"+
								"<a title='材质详细信息' href=\"javascript:void(0)\">"+
									"<div class=\"detail rta\"></div>"+
								"</a>"+
								"<a title='大图展示' href=\"javascript:void(0)\">"+
									"<div class=\"bigIm rta\"></div>"+
								"</a>"+
							"</div>"+
						"</div>"+
						"<div>"+
							"<center>"+name+"</center>"+
						"</div>";
							
							
			var itemNode = domConstruct.create("div",{
				"class":"matListItem",
				"id": url,
				innerHTML: html
			},matListNode);
			// var matListNode = dom.byId("matList");
			// if(matListNode != undefined){
				// domConstruct.place(itemNode,matListNode,"last");
			// }
			on(itemNode,"click",function(){
				if(isGutil == "true"){
					var matUrl = this.id;
					sendMatUrl(matUrl);
				}
			});
			var pfIconNode = query(itemNode).children(".matListItemContain").children(".pf_icon");
			
			var matDownloadBtn = pfIconNode.children().children(".download");
			matDownloadBtn.on("click",function(evt){
				// TODO
				var path = getMaUrl(this);
				var material = material_cls(path[0]);
				material.download();
			});
			
			var matDeleteBtn = pfIconNode.children().children(".delete");
			matDeleteBtn.on("click",function(evt){
				event.stop(evt);
				//获取材质路径
				var path = getMaUrl(this);
				var items = new Array();
				items[0] = path[0];
				deleteMatList = items;
				//删除材质
				confirm(deleteMat,function(){});
			});
			var matDetailBtn = pfIconNode.children().children(".detail");
			matDetailBtn.on("click",function(evt){
				event.stop(evt);
				var path = getMaUrl(this);
				showMatDetail(path[0]);
			});
			var matBigImgBtn = pfIconNode.children().children(".bigIm");
			matBigImgBtn.on("click",function(evt){
				event.stop(evt);
			});
		}
		//获取材质路径
		function getMaUrl(maIconNode){
			var matNode = query(maIconNode).closest(".matListItem");
			return matNode.attr("id");
		}
		/**	把选中材质的url传递给 gutil
		*/
		function sendMatUrl(matUrl){
			// console.log("点击材质的地址为：");
			// console.log(matUrl);
			Mask.show();
			var url = "http://127.0.0.1:10828/download?resource=" + matUrl + ".download";			
			
			require(["dojo/request/iframe"], function(iframe){
				iframe(url, {
					method : "GET",
					handleAs: "text"
				}).then(
					function(data){  
						// 成功
						Mask.hide();
						console.log(data);
					}, 
					function(err){  
						// 失败
						console.log(err);
					}, 
					function(evt){  
						// 处理中 
						// console.log();
					}
				);
			});
		}
		//删除材质
		function deleteMat(){
		
			var matLibFolderPath = matLibPath;
			var matLibFolder = getFolderObj(matLibFolderPath);
			matLibFolder.batchRemove(deleteMatList, function(){
				delMatUi(deleteMatList);
			});
		}
		//摧毁一个材质的dom节点
		function delMatUi(items){
			if(items){
				for(var i=0;i<items.length;i++){
					var matList = query("div[id="+items[i]+"]");
					matList.remove();
				}			
			}
		}
		//显示材质详细信息
		function showMatDetail(path){
			var url = "/modules/materiallib/matDetail.html";
			var dialogData = 
			{
				widthradio: 0.9,
				heightradio:0.9,
				title:"材质详细",
				url:url,
				data:{
					/* "numberSpinner":dthis.numberSpinner,
					"oldModel":oldModel,
					"isInsteadModel":isInsteadModel,
					"isRadio":isRadio,
					"canAddModel":canAddModel, */
					"path":path/* ,
					"itemId":itemId */
				}
			};
			Spolo.dialog(dialogData);
		}
		function getFolderObj(path){
			// 得到 folder 的对象
			if(!folderObj){
				var folderObj = new folder_cls(path);
			}
			return folderObj;
		}
	});