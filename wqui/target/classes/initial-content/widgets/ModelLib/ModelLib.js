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

define("widgets/ModelLib/ModelLib",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/layout/StackContainer",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/parser",
		"dojo/dom",
		"dojo/dom-attr",
		"dojo/dom-style",
		"dojo/Evented",
		"widgets/Category/Category",
		"widgets/CategorySelect/CategorySelect",
		"widgets/Toolbar/Toolbar",
		"widgets/List/List",
		"widgets/Pagination/Pagination",
		"spolo/data/spsession",
		"dojo/json",
		"dojo/_base/array",
		"dojo/_base/lang",
		"widgets/ModelEdit/ModelEdit",
		"dijit/Dialog",
		"dijit/form/Button",
		"dijit/form/NumberSpinner",
		"dijit/registry",
		"dijit/layout/ContentPane",
		"dojox/layout/ContentPane",
		"spolo/data/folder",
		"spolo/data/model",
		"spolo/data/queryClass",
		"dojo/NodeList-traverse",
		"dojo/dom-construct",
		"spolo/data/folder/modellib",
		"widgets/PreviewDetail/PreviewDetailWidget",
		"dojo/store/Memory", 
		"dojo/date/stamp",
		"dijit/form/FilteringSelect",
		"dojo/keys",
		"dojo/dom-class",
		"dojo/fx", 
		"dojo/fx/easing",
		"dojo/_base/fx",
		"dojo/domReady!"
	],function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, StackContainer, template, 
		query, on,parser, dom,domAttr,domStyle, Evented, Category, CategorySelect, Toolbar ,List, Pagination, spsession, JSON,arrayUtil,lang, ModelEdit,
		Dialog, Button,NumberSpinner,registry,ContentPane,xContentPane, folderClass, modelClass, queryClass, traverse, domConstruct, modellib_cls,PreviewDetailWidget,
		Memory,stamp,FilteringSelect,keys,domclass,fx,easing,fxBase
	){
		var folderObj = null;	// folder的单例
		var modelEditWidget = null;	// 
		var modelEditDialog = null;
        var toolBarObj  ;
		
		// 得到 folder 的对象
		function getFolderObj(path){
			if(!folderObj){
				folderObj = new folderClass(path);
			}
			return folderObj;
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
			json += "\"sling:resourceType\":\"model\"";
			json += "}";
			return JSON.parse(json);
		}
		//缓存筛选条件
		function getFilterParams(params){
			var filterData = new Object();
		
			// var startCalender = registry.byId("startCalenderWidget");
			// var endCalender = registry.byId("endCalenderWidget");
			// var start = dom.byId("start");
			// var options = {
				// milliseconds :true
			// };
			// var timeframeDataStr = "{";
			// if(start != null){
				// var startValue = domAttr.get(start,"value");
				// if(startValue != undefined && startValue !=""){
					// var startDateStr = startCalender.get("value");
					// var startSearchName = startCalender.get("searchName");
					// var startDate = new Date(startDateStr);
					// var formatStartStr = stamp.toISOString(startDate,options);
					// timeframeDataStr = timeframeDataStr+"\"startTime\":{\""+startSearchName+"\" : \""+formatStartStr+"\"}";
				// }
			// }
			
			// var end = dom.byId("end");
			// if(end != null){
				// var endValue = domAttr.get(end,"value");
				// if(endValue != undefined && endValue !=""){
					// var endDateStr = endCalender.get("value");
					
					// var endDate = new Date(endDateStr);
					// var endDay = endDate.getUTCDate();
					// endDate.setUTCDate(endDay+1);
					// var endDateMill = endDate.getTime();
					// var relEndDate = new Date(endDateMill-1);
					
					// var endSearchName = endCalender.get("searchName");
					// var formatEndStr = stamp.toISOString(relEndDate,options);
					// if(domAttr.get(start,"value")!=undefined && domAttr.get(start,"value")!=""){
						// timeframeDataStr = timeframeDataStr+",";
					// }
					// timeframeDataStr = timeframeDataStr+"\"endTime\":{\""+endSearchName+"\" : \""+formatEndStr+"\"}";
				// }
			// }
			
			// timeframeDataStr = timeframeDataStr+"}"
			/* var timeframeDataStr = "{"+ // 按照时间范围进行排序
				"\"startTime\":{\""+startSearchName+"\" : \""+formatStartStr+"\"},"+   
				"\"endTime\":{\""+endSearchName+"\" : \""+formatEndStr+"\"}"+
			"}";  */
			// if(timeframeDataStr!="{}"){
				// var timeframeData = JSON.parse(timeframeDataStr);
				// lang.mixin(filterData,timeframeData);
			// }
			var publishInput = dom.byId("publishInput");
			if(publishInput!=null){
				var publishor = domAttr.get("publishInput","value");
                console.log(publishor);
				if(publishor != undefined){
					var publishorData = {
						"jcr:createdBy" : publishor
					};
					lang.mixin(filterData,publishorData);
				}
			}
			
			
			var orderList = document.getElementsByName("orderItem");
			if(orderList){
				arrayUtil.forEach(orderList,function(item,i){
					if(domclass.contains(item, "selected")){
                        var orderdata = {
							sortName : domAttr.get(item,"sortName"),
							order : domAttr.get(item,"order")
						};
                        // for(var xx in item){
                        
                            // console.log(xx+"   "+item[xx]);
                        // }
                        if(domAttr.get(item,"order") == "orderDesc"){
                            item.className = "orderItem";
                            domAttr.set(item,"order","orderAsc");
                        }else if(domAttr.get(item,"order") == "orderAsc"){
                            item.className = "orderItem2";
                            domAttr.set(item,"order","orderDesc");
                        }
						lang.mixin(filterData,orderdata);
					}else{
                        item.className = "orderItem";
                        domAttr.set(item,"order","orderAsc");
                    }
				});
			}
            console.log(filterData);
			return filterData;
		}
		//获取模型总数
		function getModelTotal(onSucc){
			var dthis = this;
			var path = dthis.path;
			var currentPage = dthis.currentPage;
			var json = getJsonFromFilter.call(dthis);
			var limit = dthis.limit;
			var queryData = {
				nodePath : path,
				fuzzyProperties : json,
				limit : limit ,  
				offset : ((currentPage - 1) * dthis.limit).toString() ,
				success : function(data,nameArray)
				{
					onSucc(data,nameArray);
				},
				failed : function(error)
				{
					onError(error);
				}
			};
			folderClass.searchforLibs(queryData);//这个方法需要改成folder中的search方法
		}
		
		//执行查询方法，返回json数据的结果
		function search(onSucc,onError,params)
		{
			var dthis = this;
			var path = dthis.path;
			var currentPage = dthis.currentPage;
			var json = getJsonFromFilter.call(dthis);
			var limit = dthis.limit;
			
			var filterData = getFilterParams.call(dthis);
						
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
				if(sortName!= undefined && order!=undefined){
					queryData[order] = sortName;
				}
			}
			if(filterData["startTime"]!=undefined || filterData["endTime"]!=undefined){
				queryData["timeRangesProperties"] = new Object();
				if(filterData["startTime"]!=undefined){
					queryData["timeRangesProperties"]["startTime"] = filterData["startTime"]
				}
				if(filterData["endTime"]!=undefined){
					queryData["timeRangesProperties"]["endTime"] = filterData["endTime"]
				}
			}
			if(filterData["order"]!=undefined && filterData["sortName"]){
                queryData[filterData["order"]] = filterData["sortName"];
			}
			if(filterData["jcr:createdBy"]!=undefined){
				queryData["fuzzyProperties"]["jcr:createdBy"] = filterData["jcr:createdBy"];
			}
            console.log(queryData);
			folderClass.searchforLibs(queryData);//这个方法需要改成folder中的search方法
		}
		//排序查询
		function sortList(data){
			var dthis = this;
			doSearch.call(dthis,data);
		}
		
		//加载缩略图，设置模型的名字，设置模型的作者
		function initItemData(dataObj)
		{
			var dthis = this;
			for(var j in dataObj)
			{
				var path = j;
				var index;
				index = path.substring(path.lastIndexOf("/")+1);
				setImage.call(dthis,path, index);
			}
			setModelName.call(dthis,dataObj);
			setModelAuthor.call(dthis,dataObj);
			setpublishdate.call(dthis,dataObj);
			
			if(!dthis.showAddItemsModelLib && dthis.showLookPreview)
			{//如果是云端模型库，并且不是添加模型时的云端模型库
				//这里处理并且显示模型的材质是否完全
				// setmaterialofmodel.call(dthis,dataObj);
				showPreview.call(dthis,dataObj,function(path){
					dthis.listWidget.addDomNode(path,"<div id="+path+" path=\""+path+"\" style=\"cursor:pointer;color:blue;\">查看案例</div>");//创建查看案例的按钮
					on(dom.byId(path),"click",function()
					{
						var modelPath = this.getAttribute("path");
						modelClass.getPreviewURLsByURL(
							modelPath,
							function(url){
								showModelPreview.call(dthis,url,modelPath);
							},
							function(error){
								throw error;
							}
						);
					});
				});
				
			}
			if(this.numberSpinner==true)
			{
				// setModelNumber.call(dthis,dataObj);
			}
		}
		
		//在云端模型库中显示模型对应的效果图
		function showModelPreview(path,itemId){
			var dthis = this;
			var canAddModel = false;
			if(dthis.showAddItemsModelLib){
				canAddModel = true;
			}
			var isRadio = false;
			if(dthis.isRadio!=undefined && (dthis.isRadio == true || dthis.isRadio == "true")){
				isRadio = true
			}
			var isInsteadModel = false;
			if(dthis.isInsteadModel!=undefined && (dthis.isInsteadModel == true || dthis.isInsteadModel == "true")){
				isInsteadModel = true;
			}
			var oldModel = "";
			if(dthis.oldModel && dthis.oldModel.name){
				oldModel = JSON.stringify(dthis.oldModel);
			}
			//改成spdialog的形式
			var url;
			url = "/widgets/PreviewDetail/PreviewDetailInPreviewLib.html";
			var dialogData = 
			{
				widthradio: 0.9,
				heightradio:0.9,
				title:"效果图预览",
				url:url,
				data:{
					"numberSpinner":dthis.numberSpinner,
					"oldModel":oldModel,
					"isInsteadModel":isInsteadModel,
					"isRadio":isRadio,
					"canAddModel":canAddModel,
					"path":path,
					"itemId":itemId
				}
			};
			Spolo.dialog(dialogData);
		}
		
		function setImage(path,index)
		{
			var dthis = this;
			getModelPreview.call(dthis,path);
		}
		
		function setModelName(data)
		{
			var dthis = this;
			for(var key in data){
				var name = data[key]["resourceName"];
				if(name == "未命名")
				{
					dthis.listWidget.addDomNode(key,"<div>名称：" + name + "</div>");
				}
				else
				{
					dthis.listWidget.addDomNode(key,"<div>名称：" + name + "</div>");
				}
				
			}
		}
		
		function setModelAuthor(data)
		{
			var dthis = this;
			for(var key in data)
			{
				var author = data[key]["jcr:createdBy"];
				if(author == undefined)
				{
					dthis.listWidget.addDomNode(key,"<div>发布者：" + data[key]["jcr:createdBy"] + "</div>");
				}
				else
				{
					dthis.listWidget.addDomNode(key,"<div>发布者：" + Spolo.decodeUname(author) + "</div>");
				}
			}
		}
		//显示模型的材质信息
		function setmaterialofmodel(obj){
			var dthis = this;
			var modelarray = [];
			for(var key in obj){
				dthis.listWidget.addDomNode(key,"<div>检查材质信息：<img src=\"/widgets/Mask/images/mask_loading.gif\" width=\"13px\" height=\"13px\"></div>");
				modelarray.push(key);
			}
			modelClass.checkMaterials(modelarray,
				function(data){
					for(var i in data){
						var field = dthis.listWidget.getField(i,4);
						if(data[i]["check"] == false){
							dthis.listWidget.setField(field,"<div>检查材质信息：<span style=\"color:red;\">缺少材质</span></div>");
						}
						else{
							dthis.listWidget.setField(field,"<div>检查材质信息：<span style=\"color:green;\">材质完全</span></div>");
						}
					}
				},
				function(error){
					console.log(error);
				}
			);
		}
		
		function format(obj){
			if(obj<10)
				return "0" +""+ obj;
			else
				return obj;
		}
		function setpublishdate(data){
			var dthis = this;
			for(var key in data)
			{
				var date = data[key]["jcr:created"];
				var _date = new Date(date);
				var datestring = format(_date.getFullYear()) + "."
								+ format(_date.getMonth()+1) + "."
								+ format(_date.getDate()) + " "
								+ format(_date.getHours()) + ":"
								+ format(_date.getMinutes()) + ":"
								+ format(_date.getSeconds());
				dthis.listWidget.addDomNode(key,"<div>发布时间：" + datestring + "</div>");
			}
		}
		//给每个模型增加数量的选择
		function setModelNumber(data){
			var dthis = this;
			/* var jsons = {
				nodeType : "div", className : "modelNumber", content : "", style : {}
			};
			dthis.listWidget(itemId,jsons); */
			
			for(var key in data){
				var mySpinner;
				if(registry.byId(key)){
					mySpinner = registry.byId(key)
				}else{
					mySpinner = new NumberSpinner({
						value: 1,
						smallDelta: 1,
						constraints: { min:1, max:9999, places:0 },
						intermediateChanges:true,
						id: key,
						style: "width:100px",
						onChange: function(){
						
							var allSelectItem = dthis.allPageSelectedItem;
							var key = this.get("id");
							if(allSelectItem){
								for(var index in allSelectItem){
									arrayUtil.forEach(allSelectItem[index],lang.hitch(this,function(item,i){
										//console.log(item);
										var nodeName = item["nodeName"];
										if(nodeName!=undefined && nodeName != ""){
											if(key.search(nodeName)!=-1){
												allSelectItem[index][i]["addNumber"] = this.get("value");
											}
										}
									}));
								}
							}
							
						}
					});
				}
				dthis.listWidget.addDomNode(key,mySpinner.domNode);
			}
		}
		
		//点击查看案例模型对应的效果图
		function showPreview(data,callback){
			var dthis = this;
			//遍历当前页的数据，如果有对应的效果图，创建按钮
			for(var key in data){
				var path = dthis.path + "/" + data[key]["nodeName"];
				isReferPreview.call(dthis,path);
			}
			function isReferPreview(path){
				modelClass.isReferPreview
				(
					path,
					function(data)
					{
						if(data)
						{
							callback(path);
						}
						else
						{
							dthis.listWidget.addDomNode(path,"<div></div>");//创建查看案例的按钮
						}
						
					}
				);
			}
		}
		
		//根据key获取模型数量
		function getModelNumber(key){
			if(registry.byId(key)){
				var mySpinner = registry.byId(key);
				var addModelNumber = mySpinner.get("value");
				return addModelNumber;
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
		//查询成功
		function searchSucc(data,nameArray){
			console.log(data);
            var dthis = this;
			//刷新列表
			var total = data["totalNum"];
			dthis.Paginationwidget.refresh(Math.ceil(total/dthis.limit),dthis.currentPage);
			var array = [];
			for(var key in data["data"]){
				array.push(key);
			}
			dthis.listWidget.addItems(array,true);
			
			//加载缩略图,设置模型的名称，模型的发布者
			initItemData.call(dthis,data["data"]);
			
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
							console.log("11111111111111");
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
					if(array.length != 0){
                        for(var index = 0;index < array.length;index ++){
                            var start = array[index-1]+filterValueToLower.length;
                            if(start == undefined){
                                start = 0;
                            }
                            var perlightvalue = modelname.substring(start,array[index]);
                            console.log(perlightvalue);
                            var lightvalue = modelname.substring(array[index],array[index]+filterValueToLower.length);
                            var lastlightvalue = "";
                            if(index == array.length-1){
                                lastlightvalue = modelname.substring(array[index] + filterValueToLower.length, array[index+1]);
                            }
                            lightStr += perlightvalue + "<span style=\"background-color:#ff0;\">"+lightvalue+"</span>" + lastlightvalue;	
                        }
                        
                        dthis.listWidget.setField(field, "名称："+lightStr);
					}else{
                        dthis.listWidget.setField(field, "名称："+modelname);
                    }
				}
				
			}
			
			
			//显示已经选中的模型
			selectedModelPath.call(dthis);
			
			//设置默认是选择状态
			if(dthis.selectedModules){
				dthis.listWidget.openSelect();
			}
			//显示模型总数
			showModelNum.call(dthis,0);	
			setModelNumberToFilterBar(data["totalNum"])			
		}
		//查询失败
		function searchFail(error){
			dthis.Paginationwidget.refresh(1,1);
			console.log(error);
		}
		//整理查询需要的参数，然后调用search
		function doSearch(params)
		{
			var dthis = this;
			
			search.call(
				dthis,
				function(data,nameArray){
					searchSucc.call(dthis,data,nameArray);				
				},
				function(error){
					searchFail.call(dthis,error);
				},
				params
			);
		}
		// 检察列表的空缺，并刷新列表
		function checkItem()
		{
			var dthis = this;
			search.call(dthis,
				function(data,nameArray){
					//获取所有列表项
					var listItems = $(dthis.listWidget.listNode).children();
					var items = data["data"];
					var isHave = false;
					//新增项对象存储
					var newItems = {};
					newItems.data = {};
					//检查出新增项
					for(var i in items)
					{
						for(var j = 0; j < listItems.length; j++){
							if(i == $(listItems[j]).attr("itemid")){
								//不为新增项，下一个
								isHave = true;
								break;
							}
						}
						if(!isHave){
							newItems.data[i] = items[i];
						}else{
							//为下一个做准备
							isHave = false;
						}
					}
					//刷新列表
					var array = [];
					for(var key in newItems["data"])
					{
						array.push(key);
					}
					dthis.listWidget.addItems(array);
					
					//加载缩略图，设置模型的名字，设置模型的作者
					initItemData.call(dthis,newItems["data"]);
					//刷新分页
					var total = data["totalNum"];
					dthis.Paginationwidget.refresh(Math.ceil(total/dthis.limit),dthis.currentPage);
				},function(error){
					console.log(error)
				});
		}
		
		// 删除节点
		function delItem(items)
		{
			var dthis = this;
			var path = dthis.path;
			var folder = getFolderObj(path);
			folder.batchRemove(items, function(){
				//隐藏Dialog提示窗口
				dthis.dialog.hide();
				// 执行UI部分的删除
				for(var key = 0;key < items.length; key++){
					dthis.listWidget.delItem(items[key]);
				}
				//延时加载新的元素
				setTimeout(function(){
					checkItem.call(dthis);
				},1000);
			});
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
		
		// 初始化分类控件
		function initCategory()
		{
			var dthis = this;
			//加入分类组件
			var roomJson = {
				title1:"居室",
				path:"/content/modellibcategory/room",
				text:""
			};
			var styleJson = {
				title1:"风格",
				path:"/content/modellibcategory/modelstyle",
				text:""
			};
			var colorSystemJson = {
				title1:"色系",
				path:"/content/modellibcategory/colorSystem",
				text:""
			};
			var brandJson = {
				title1:"品牌",
				path:"/content/modellibcategory/modelbrand",
				text:""
			};
			var madeofJson = {
				title1:"主材",
				path:"/content/modellibcategory/modelmadeof",
				text:""
			};
            
			var roomWidget = new Category(roomJson).placeAt(this.categoryListNode);
            roomWidget.initialize();
			
			var styleWidget = new CategorySelect(styleJson).placeAt(this.categoryListNode);
			
			var colorSystemWidget = new Category(colorSystemJson).placeAt(this.categoryListNode);
			colorSystemWidget.initialize();
			
			var brandWidget = new Category(brandJson).placeAt(this.categoryListNode);
			brandWidget.initialize();
			
            var madeofWidget = new Category(madeofJson).placeAt(this.categoryListNode);
			madeofWidget.initialize();
			
			on(roomWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["roomPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
			on(styleWidget,"onSelectedItemClick",function(json){
				if(json.isChecked)
				{
					dthis.filterJson["stylePath"] = json["path"];
					//doSearch.call(dthis);
				}
				else
				{
					dthis.filterJson["stylePath"] = "";
					//doSearch.call(dthis);
				}
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
			on(colorSystemWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["colorSystemPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
			on(brandWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["brandPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
            on(madeofWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["madeOfPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
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
			
			on(dthis.foldNode,"click",function()
			{
				if(query(this).prev()[0].innerHTML == "收起分类"){
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
        
        function initRoomCategory()
		{
			var dthis = this;
			//加入分类组件
			var roomJson = {
				title1:"居室",
				path:"/content/roomlibcategory/room",
				text:""
			};
			var areaJson = {
				title1:"面积",
				path:"/content/roomlibcategory/area",
				text:""
			};
            
			var roomWidget = new Category(roomJson).placeAt(this.categoryListNode);
            roomWidget.initialize();
			
            var areaWidget = new Category(areaJson).placeAt(this.categoryListNode);
			areaWidget.initialize();
			
			on(roomWidget,"onSelectedListChanged",function(json){
				dthis.filterJson["roomPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
			});
			
            on(areaWidget,"onSelectedListChanged",function(json){
                dthis.filterJson["areaPath"] = json["path"];
				JsonResourceName.call(dthis);
				doSearch.call(dthis);
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
			
			on(dthis.foldNode,"click",function()
			{
				if(query(this).prev()[0].innerHTML == "收起分类"){
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
		
		function isOpenUpCategory(state)
		{
			if(state)
			{
				this.divFoldCategoryNode.innerHTML = "收起分类";
				domclass.remove(this.foldNode,"modelLibTemplate_fold");
				domclass.add(this.foldNode,"modelLibTemplate_unfold");
				domStyle.set(this.categoryListNode, {
					height: "100%",
					display: "block"
				});
				
			}
			else
			{
				this.divFoldCategoryNode.innerHTML = "展开分类";
				domclass.remove(this.foldNode,"modelLibTemplate_unfold");
				domclass.add(this.foldNode,"modelLibTemplate_fold");
				domStyle.set(this.categoryListNode, {
				  height: "",
				  display: "none"
				});
				
			}
		}
		
		// 弹出模型属性编辑的窗口
		function dialogModelEdit(modelPath)
		{
			var dthis = this;
			if(modelPath.indexOf("modellib") > -1){
                var url = "/modules/modeledit/index.html?modelPath="+modelPath;
            }else if(modelPath.indexOf("roomlib") > -1){
                var url = "/modules/roomedit/index.html?modelPath="+modelPath;
            }
			var field = dthis.listWidget.getField(modelPath,1);
			var dialogData = 
			{
				widthpx: 980,
				heightpx : 700,
				id:modelPath,
				title:"模型详细信息",
				url:url,
				data:
				{
					"modelPath":modelPath,
					"list":dthis.listWidget,
					"showAddItemsModelLib":dthis.showAddItemsModelLib
				},
				callback: function(spdialog){
					//接收传来名字
					spdialog.on("resetResoureName",function(modelName)
					{
						var currentModelName =" <div class=\"modelName\">"+"名称："+modelName+"</div>";
						dthis.listWidget.setField(field,currentModelName);
					});
					spdialog.on("modelPreview",function(url)
					{
						getModelPreview.call(dthis,modelPath);
					});	
				}
			};
			Spolo.dialog(dialogData);
		}
		
		/**
		*按钮事件
		*/
		function initButtonEvent()
		{
			//全选/取消按钮切换事件
			var dthis = this;
			on(this.toolbar,"sortable",function(data){
				sortList.call(dthis,data);
			})
			on(this.toolbar,"selectAll",function(data){
				if(data){
					dthis.listWidget.selectAll();
				}else{
					dthis.listWidget.unSelectAll();
				}
				saveCurrentPageSelected.call(dthis);
			})
			//List方式布局
			on(this.toolbar,"rowList",function(data){
				if(data == true){
					dthis.listWidget.showList();
				}
			})
			
			on(this.toolbar,"gridList",function(data){
				if(data == true){
					dthis.listWidget.showThumbnail();
				}
			})
			
			//启动/关闭编辑模式
			on(this.toolbar,"editable",function(data){
				if(data){
					dthis.listWidget.openEdit();
				}else{
					dthis.listWidget.closeEdit();
                    
				}
			})
			
			//启动/关闭选择模式
			on(this.toolbar,"optional",function(data){
				if(data){
					dthis.listWidget.openSelect();
                    if(toolBarObj){
                        toolBarObj.disableMultipleChoice(false) ;
                    }
				}else{
					dthis.listWidget.closeSelect();
                    if(toolBarObj){
                        toolBarObj.disableMultipleChoice(true) ;
                    }
				}
			})
			
			//删除选中元素(删除一个或者多个模型)
			on(this.toolbar,"erasable",function(){
				var items = dthis.getSelectNodes();
				if(items.length == 0)
				{
					Spolo.notify({
						"text" : "您未选中任何模型！!",
						"type" : "error",
						"timeout" : 1000
					});
				}
				else
				{
					dthis.flag = true;
					isRefer.call
					(
						dthis,
						function(state)
						{
							if(state){
								dthis.dialog1.show();
							}
							else{
								dthis.dialog.show();
							}
						}
					);
				}
			});
			// 发送被选中的模型的地址数组
			on(this.toolbar,"multipleChoice",function(data){
				var items = dthis.getSelectNodes();
				if(items.length == 0)
				{
					Spolo.notify({
						"text" : "您未选中任何模型！!",
						"type" : "error",
						"timeout" : 1000
					});
				}
				else
				{
					dthis.emit("multipleChoice");
				}
			});
			
			//响应删除按钮消息(删除单个模型)
			on(this.listWidget,"onDelItemClick",function(item)
			{
				modelClass.isReferPreview(
				item,
				function(data)
				{
					if(data)
					{
						dthis.dialog1.show();
						dthis.flag = false;
						dthis.delItem = [];
						dthis.delItem.push(item);	
						
					}
					else
					{
						dthis.dialog.show();
						dthis.flag = false;
						dthis.delItem = [];
						dthis.delItem.push(item);	
					}
				});
				
			});
			//响应编辑按钮消息
			on(this.listWidget,"onEditItemClick",function(currentItem){
				var modelPath = currentItem;
				dthis.isClickImg = false;
				dialogModelEdit.call(dthis,modelPath);
			});
			
			//响应图片点击的消息
			if(dthis.isClickImg){	
				on(this.listWidget,"onListItemClick",function(currentItem){
					var modelPath = currentItem;
					if(dthis.showEditOrPreview)
					{
						modelClass.getPreviewURLsByURL(
							modelPath,
							function(url){
								showPreviewDetail.call(dthis,url,modelPath);
							},
							function(){
								Spolo.notify({
									"text" : "该模型没有关联的效果图!",
									"type" : "error",
									"timeout" : 1000
								});
							}
						);
					}
					else
					{
						dialogModelEdit.call(dthis,modelPath);
					}
				});
			}
			
			//响应选中模型的消息
			on(this.listWidget,"onItemStatuChanger",function(item){
				saveCurrentPageSelected.call(dthis);
                if(toolBarObj){
                    toolBarObj.disableMultipleChoice(false) ;
                }
			});
			//使用watch方法监听分页
			this.Paginationwidget.watch(
				"nowPage", 
				function()
				{
					saveCurrentPageSelected.call(dthis);
					dthis.currentPage = dthis.Paginationwidget.get("nowPage");
					doSearch.call(dthis);
				}
			);
			
		}
		
		//显示previewDetail组件
		function showPreviewDetail(path,itemId)
		{
			var dthis = this;
			var canAddModel = false;
			if(dthis.showAddItemsModelLib){
				canAddModel = true;
			}
			var isRadio = false;
			if(dthis.isRadio!=undefined && (dthis.isRadio == true || dthis.isRadio == "true")){
				isRadio = true;
			}
			var isInsteadModel = false;
			if(dthis.isInsteadModel!=undefined && (dthis.isInsteadModel == true || dthis.isInsteadModel == "true")){
				isInsteadModel = true;
			}
			var oldModel = "";
			if(dthis.oldModel && dthis.oldModel.name){
				oldModel = JSON.stringify(dthis.oldModel);
			}
			//改成spdialog的形式
			var url;
			if(dthis.showAddItemsModelLib == false)
			{
				url = "/widgets/PreviewDetail/PreviewDetailInPreviewLib.html";
			}
			else{
				url = "/widgets/PreviewDetail/PreviewDetailInMyPreviewLib.html";
			}
			
			var iframe = window.parent.iframe;
			var scene = window.parent.scene;
			var dialogData = 
			{
				widthradio: 0.9,
				heightradio:0.9,
				title:"效果图预览",
				url:url,
				data:{
					"iframe":iframe,
					"scene":scene,
					"numberSpinner":dthis.numberSpinner,
					"oldModel":oldModel,
					"isInsteadModel":isInsteadModel,
					"isRadio":isRadio,
					"canAddModel":canAddModel,
					"path":path,
					"itemId":itemId
				}
			};
			Spolo.dialog(dialogData);
		}
		
		//缓存选中模型的全路径,并改变选中模型的状态
		function selectedModelPath()
		{
			var dthis = this;
			var selectedItems = dthis.allPageSelectedItem[dthis.currentPage];
			if(!selectedItems){
				selectedItems = getDataArrayByKeys.call(dthis,[]);
			}
			else{
				var array = [];
				for(var i = 0;i < selectedItems.length; i++){
					array.push(dthis.path + "/" + selectedItems[i]["nodeName"]);
				}
				dthis.listWidget.selectByItemId(array);
			}
			
		}
		
		// 缓存每一页中选中的数据
		function saveCurrentPageSelected()
		{
			var dthis = this;
			var keys = dthis.getSelectNodes();
			dthis.allPageSelectedItem[dthis.currentPage] = getDataArrayByKeys.call(dthis,keys);
		}
		
		// 根据key数组获取所对应的数据，并返回array
		function getDataArrayByKeys(keys){
			var array = [];
			var dthis = this;
			for(var i=0;i<keys.length;i++){
				if(dthis.numberSpinner==true){
					var modelNumber = getModelNumber.call(this,keys[i]);
					dthis.jsonData["data"][keys[i]]["addNumber"] = modelNumber;
				}
				array.push(dthis.jsonData["data"][keys[i]]);
			}
			return array;
		}
		// 获取所有页面中选中的模型
		function getAllPageSelected()
		{
			var dthis = this;
			var array = [];
			var json = dthis.allPageSelectedItem;
			for(var key in json){
				array = array.concat(json[key]);
			}
			return array;
		}
		
		//设置按钮隐藏
		function setButtonDisplay(display)
		{
			this.toolbar.destroyAdminControl();
		}
		
		//判断模型中有无关联效果图的方法
		function isRefer(callback)
		{
			var dthis = this;
			var len = getSelectedModelLength.call(dthis);
			for(var key in dthis.allPageSelectedItem)
			{
				var items = dthis.allPageSelectedItem[key];
				var requestCount = 0;
				var res = false;
				for(var i = 0;i < items.length; i++)
				{
					var path = dthis.path + "/" + items[i]["nodeName"];
					getIsReferPreview.call(dthis,path);
					
				}
				function getIsReferPreview(path){
					modelClass.isReferPreview(
						path,
						function(data)
						{
							requestCount++;
							if(data)
							{
								res = true;
							}
							if(requestCount == len)
							{
								callback(res);
							}
							
						}
					);
				}
			}
		}
		
		//获取所有选中的模型的长度
		function getSelectedModelLength(){
			var len = 0;
			var dthis = this;
			for(var key in dthis.allPageSelectedItem)
			{
				var items = dthis.allPageSelectedItem[key];
				len += items.length;
			}
			return len;
		}
		
		//删除多个模型,显示模型总数
		function delModels()
		{
			var dthis = this;
			var len = getSelectedModelLength.call(dthis); 
			var requestCount = 0;
			for(var key in dthis.allPageSelectedItem)
			{
				var items = dthis.allPageSelectedItem[key];
				for(var i = 0;i < items.length; i++)
				{
					var path = dthis.path + "/" + items[i]["nodeName"];
					refresh.call(dthis,path);
				}
				function refresh(path){
					modellib_cls.removeRefs(
						path,
						function()
						{
							requestCount ++;
							dthis.listWidget.delItem(path);
							if(requestCount == len){
								setTimeout(function(){
									checkItem.call(dthis);
								},1000);
								showModelNum.call(dthis);
							}
						}
					);	
				}
			}
			dthis.allPageSelectedItem = {};
		}
		
		//显示模型总数
		function showModelNum(){
			var dthis = this;
			if(dthis.showModelTotal){
				getModelTotal.call(
					dthis,
					function(data)
					{
						// $(".totalModel").html("模型总数为：" + (data["totalNum"]));
						setModelTotalToFilterBar(data["totalNum"]);
					}
				);
				
			}	
		}
		//执行删除方法
		function del()
		{
			var dthis = this;
			if(dthis.flag){
				delModels.call(dthis);
			}
			else
			{
				modellib_cls.removeRefs(dthis.delItem[0],function(){
					dthis.listWidget.delItem(dthis.delItem[0]);
					showModelNum.call(dthis);
					setTimeout(function(){
						checkItem.call(dthis);
					},1000);
				});
				
			}
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
		
		//判断空对象
		function isEmptyObj(obj){
			for(var key in obj){
				return false;
			}
			return true;
		}
		//实例化工具栏
		function createToolbar(){
			var dthis = this;
			var config = {
				//isRadio:true //是否打开单选模式。默认为多选。单选模式下禁止全选与取消功能。
				sortable : true, //排序
				gridList : true,//列表视图
				rowList : true,//缩率图视图
				seletAll : true,//全选
				editable : true,    //编辑模式
				optional : true, // 选择模式
				erasable : true  // 删除选中项
			}
			for(var par in dthis.toolbarData){
				config[par] = dthis.toolbarData[par];
			}
			return new Toolbar(config);
		}
		//初始化过滤工具栏
		function initFilterbar(){
			var dthis = this;
			var filterContent = new xContentPane({
				style:"padding:0px"
			});
			filterContent.placeAt(dthis.filterbarNode);
			filterContent.set("href","/widgets/Toolbar/filterbar.html?total");
		}
		// 准备一个 Evented 的对象, 也是 spdialog 的 handle 
		function setIframeHandle(callback){
			require(["dojo/_base/declare","dojo/Evented"], function(declare,Evented){
				var EventedObj = declare([Evented], {
					constructor: function(){
					}
				});
				var evtobj = new EventedObj();
				callback(evtobj);
			});
		}
		var timer;
		function do_time(){
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(function(){
				doSearch.call(dthis);
			},1000);
		}
		
			
		var ret = declare("widgets/ModelLib/ModelLib",[_WidgetBase, _WidgetsInTemplateMixin, _TemplatedMixin, Evented ],
		{
			// 指定template
			templateString: template,
			
			constructor:function(json)
			{
				var dthis = this;
				this.json = json;
				this.currentPage = json.currentPage || 1;
				this.jsonData = {};//当前页的json数据
				this.path = json.path || "";
				this.filterJson = {};	// 保存分类筛选的条件
				this.limit = json.limit || 10;
				this.delItem = [];//将要删除的模型
				this.allPageSelectedItem = {};//所有选中的模型
				this.selectedModules = false;//选择模式
				this.showModelTotal = false;//显示模型总数
				this.flag = false;//区别单选和多选
				this.isClickImg = false;
				this.showEditOrPreview = false;//默认是弹出属性编辑窗口
				this.showAddItemsModelLib = false;//默认显示的是云端模型库中的模型
				this.showLookPreview = true;//默认显示的有查看案例
				this.numberSpinner = json.numberSpinner || false;
				this.isRadio = json.isRadio || false; //list组件的单选或多选控制，默认为多选
				this.isInsteadModel = json.isInsteadModel || false; //控制弹出的效果图组件是否是替换模式，默认是加入场景模式
				this.oldModel = json.oldModel || {}; //如果是替换模式应该传第一个旧模型对象
				this.stateStore = new Memory({
					data:[]
				});
				this.filterValue = "";
				//stateStore = [];
				this.toolbarData = json["toolbarData"] || {}; //工具栏初始化参数组
				//创建toolbar
				this.toolbar = createToolbar.call(this);
                toolBarObj = this.toolbar ;
				this.toolbar.disableMultipleChoice(true) ;
				setIframeHandle(function(eventNode){
					//监听排序事件
					on(eventNode,"order",function(){
						doSearch.call(dthis);
						dthis.currentPage = 1;
					});
					on(eventNode,"searchtimeframe",function(){
						doSearch.call(dthis);
						dthis.currentPage = 1;
					});
                    on(eventNode,"searchpriceframe",function(){
						doSearch.call(dthis);
						dthis.currentPage = 1;
					});
                    on(eventNode,"searchareaframe",function(){
						doSearch.call(dthis);
						dthis.currentPage = 1;
					});
					on(eventNode,"searchPublishAuthor",function(){
                        doSearch.call(dthis);
						dthis.currentPage = 1;
					});
					on(eventNode,"gridList",function(){
						dthis.listWidget.showThumbnail();
					});
					on(eventNode,"rowList",function(){
						dthis.listWidget.showList();
					});
				
					window.eventNode = eventNode;
				}); 
			},
			//获取已选中项Dom节点
			getSelectNodes:function()
			{
				return this.listWidget.getSelectNodes();
			},
			//获取所有页中选中的模型
			getAllPageSelected:function()
			{
				return getAllPageSelected.call(this);
			},
			//获取当前页的json数据
			getJsonData:function()
			{
				return this.jsonData;
			},
			//隐藏按钮
			hideButton:function()
			{
				return setButtonDisplay.call(this,false);
			},
			//设置当前列表模式为替换模型
			openSelect:function()
			{
				this.listWidget.openSelect();
			},
			//获取当前页码
			getCurrentPage:function(){
				return this.currentPage;
			},
			//初始化组件
			postCreate: function()
			{
				var dthis = this;
				//检测是否加载分类控件
				if(this.hasCategory)
				{
					/**
					*分类控件
					*/
					//初始化分类控件
					console.log(this);
                    if(this.path == "/content/roomlib"){
                        initRoomCategory.call(this);
                    }else{
                        initCategory.call(this);
                    }
					/**
					 * 是否展开分类
					 */
					isOpenUpCategory.call(this, this.isOpenUp);
					//this.divFoldCategoryNode.click();
				}else{
					//删除相关容器
					query(this.categoryListNode).orphan();
				}
				if(this.insteadModel){
					setButtonDisplay.call(this,false);
				}
								
				/**
				*Toolbar,工具栏控件
				*/
				
				this.toolbar.placeAt(this.buttonListNode);
				var totalModelNode = domConstruct.create("div",{"class":"totalModel"});
				this.toolbar.addMenuItem(totalModelNode);
				/* <div class="totalModel" data-dojo-attach-point="totalModel" data-dojo-attach-point="totalModelNode"></div> */
				/**
				*List控件
				*/
				var listJson = new Object;
				if(this.isRadio != undefined){
					listJson.isRadio = this.isRadio;
				}
				this.listWidget = new List(listJson);
				this.listWidget.placeAt(this.ListNode);
				
				var div = domConstruct.create("div",
					{
						innerHTML:"<center><label>确定删除吗？</label><br /></center>"
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
				
				dthis.dialog = new Dialog({
					title: "删除模型",
					content: div,
					style: "width: 200px;position:relavite;top:20px;font-size:12px;background-color:white"
				});
				
				on(btnSure,"click",function()
				{
					dthis.dialog.hide();
                    dthis.toolbar.state.selectAll.setChecked(false);
					del.call(dthis);
				});	
				
				on(btnCancel,"click",function(){
					dthis.dialog.hide();
				});	
				
				var div1 = domConstruct.create("div",
					{
						innerHTML:"<center><label>模型有关联的效果图,确定删除吗？</label><br /></center>"
					}
				);
				var btnSure1 = domConstruct.create("div",
					{
						innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>确定</button>",
						style:"float:left; width:45px;margin-left:25%"
					},div1
				);
				var btnCancel1 = domConstruct.create("div",
					{
						innerHTML:"<button data-dojo-type='dijit/form/Button' style='width:100%'>取消</button>",
						style:"float:left; width:45px;"
					},div1
				);
				
				dthis.dialog1 = new Dialog({//有关联效果图的dialog
					title: "删除模型",
					content: div1,
					style: "width: 220px;position:relavite;top:20px;font-size:12px;background-color:white"
				});
				on(btnSure1,"click",function()
				{
					dthis.dialog1.hide();
					del.call(dthis);
				});	
				
				on(btnCancel1,"click",function(){
					dthis.dialog1.hide();
				});	
				initFilterbar.call(dthis);
				/**
				*分页插件
				*/
				var json = 
				{
					total:0
				};
				this.Paginationwidget = new Pagination(json);
				this.Paginationwidget.placeAt(this.pageListNode);
				//初始化搜索框
				var filteringSelect = new FilteringSelect({
					//value:"v",
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
								var flag = isEmptyObj.call(dthis,dthis.filterJson);
								if(!flag || value.trim() != ""){
									dthis.currentPage = 1;
									doSearch.call(dthis);
								}
								
								break;
						}
					},
					validate:function() 
					{
					}
					// onFocus:function(){
						// filteringSelect.active = true;
					// }
				}, this.searchNode);
				
				new Button({
					label:"查询",
					style:"font-size:14px;margin:-4px 0 0 25px;",
					onClick:function(){
						var value = filteringSelect.get('displayedValue');
						dthis.filterValue = value;
						JsonResourceName.call(dthis);
						var flag = isEmptyObj.call(dthis,dthis.filterJson);
						if(value.trim() != "" || !flag){
							dthis.currentPage = 1;
							doSearch.call(dthis);
						}
					}
				},this.btnSearchNode);
				
				// 执行查询
				doSearch.call(this);
				
				// 初始化按钮事件
				initButtonEvent.call(this);
			}	
		});		
		return ret;
	});