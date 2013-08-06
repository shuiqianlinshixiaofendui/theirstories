/* 
 *  _this file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */

define("widgets/Search/main",
[
	"dojo/_base/declare",
	"dojo/Evented",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/on",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/keys",
	"dojo/mouse",
	"dojo/parser", 
	"dijit/form/DateTextBox",
	"dijit/registry",
	"dojo/dom-geometry",
	"dojo/NodeList-traverse"
],
function(
	declare,Evented,WidgetBase,TemplatedMixin,template,arrayUtil,lang,win,dom,on,query,domConstruct,domStyle,domClass,domAttr,keys,mouse,parser,DateTextBox,registry,domGeom
)
{	
	var searchEvent = "search";
	var advancedSearch = "advanceSearch";
	function createSearchBox(args){
		var _this = this;
		if(!_this.getSearchBoxALL()){
			//显示下菜单的Btn
			var dropBtnSelectDiv = _this.getDropBtnSelectDiv();
			if(!dropBtnSelectDiv){
				//console.error("[INFO] dropBtnSelectDiv 不存在!~");
			}
			var filteringSelect = _this.getFilteringSelect();
			if(!filteringSelect){
				//console.error("[INFO] filteringSelect 不存在!~");
			}
			var searchId = _this.getSearchId();
			var dropBtnShow = dom.byId(_this.getSearchDropBtn());
			var position = domGeom.position(_this.getSearchAll(),true);
			var x = parseInt(position.x)+1;
			var y = parseInt(position.y)+29;
			if(!args[0]){
				console.error("[INFO] args 不存在!~");
				return;
			}
			var height = args.length*60;
			var width = parseInt(position.w);
			var searchBoxALL =  domConstruct.create("div",{style:"width:"+(width-2)+"px; height:auto;margin-top:2px;position:absolute;left:"+x+"px;top:"+y+"px;z-index:999;display:none;"},win.body());
			var searchBox = domConstruct.create("div",{className:"ZZ",style:"width:"+(width-2-18)+"px;height:auto"},searchBoxALL);
			
			_this.setSearchBox(searchBox);
			_this.setSearchBoxALL(searchBoxALL);
			//创建根div
			for(var i=0;i<args.length;i++){
				var name = args[i]["name"];
				var type = args[i]["type"];
				var id = args[i]["id"];
				if(type){
					if(type == "calendar"){
						createTimeRange(name,id,searchBox);
					}else{
						console.error("不支持的搜索类型："+type);
					}
				}else{
					var wNw = domConstruct.create("div",{className:"w-Nw"},searchBox);
					var zG = domConstruct.create("span",{className:"ZG"},wNw);
					var wPv = domConstruct.create("span",{className:"w-Pv"},wNw);
					domConstruct.create("label",{classNmae:"",forName:":7t",innerHTML:name},zG);
					var inputDom = domConstruct.create("input",{type:"text",className:"ZH filter","data-filter":id},wPv);
					inputDom.onkeypress = function(event){
						if(event.keyCode == 13){
							//获取所有筛选条件的值
							var filterData = _this.getFilterData(true);
							_this.emit(advancedSearch,filterData);
							displaySearchBox.call(_this,false);
							var searchDropBtn = _this.getSearchDropBtn();
							domClass.remove(searchDropBtn,"hide");
						}
					}
				}
				
			}
			var btnContain = domConstruct.create("div",{className:"search-btnContain"},searchBox,"last");
			var searchBoxBtn = domConstruct.create("div",{className:"search-btn bluebtn",style:""},btnContain);
			var btnImg = domConstruct.create("span",{className:"searchimg"},searchBoxBtn);
			on(searchBoxBtn,mouse.enter,function(evt){
				var searchNode = evt.currentTarget;
				domClass.add(searchNode,"bluebtn-hvr");
			});
			on(searchBoxBtn,mouse.leave,function(evt){
				var searchNode = evt.currentTarget;
				domClass.remove(searchNode,"bluebtn-hvr");
			});
			on(searchBoxBtn,"click",function(evt){
				//获取所有筛选条件的值
				var filterData = _this.getFilterData(true);
				_this.emit(advancedSearch,filterData);
				displaySearchBox.call(_this,false);
				var searchDropBtn = _this.getSearchDropBtn();
				domClass.remove(searchDropBtn,"hide");
			});
		}
		//监听下拉按钮的事件
		//initListener.call(_this,searchId);	
		var searchBox = _this.getSearchBoxALL();
		if(searchBox){
			var searchBoxStyle = domStyle.get(searchBox,"display");
			if(!searchBoxStyle||searchBoxStyle=="none"){
				_this.setDisSearchBox(true);
				displaySearchBox.call(_this,true);
			}else{
				_this.setDisSearchBox(false);
				displaySearchBox.call(_this,false);
			}
		}
	}
	function createTimeRange(label,id,searchBox){
			var wNw = domConstruct.create("div",{className:"w-Nw"},searchBox);
			var zG = domConstruct.create("span",{className:"ZG"},wNw);
			var wPv = domConstruct.create("span",{className:"w-Pv"},wNw);
			var formLabel = domConstruct.create("div",{className:"",innerHTML:label},zG);
			//var inputDom = domConstruct.create("input",{type:"text",className:"ZH","data-filter":id,wPv);
			var startTimeBox = domConstruct.create("div",{className:"timebox"},wPv);
			var startTimeLab = domConstruct.create("label",{className:"tiLab",innerHTML:"开始"},startTimeBox);
			
            var eRDate = new Date();
            yy = eRDate.getFullYear();
            mm = eRDate.getMonth();
            if(mm == 1 ){
               mm = 12;
               --yy;
            }else{
               --mm;
            }
            eRDate.setMonth(mm);
            eRDate.setFullYear(yy);
            
            
            var startTimeCal = new DateTextBox({
				value: eRDate,
				size:"51",
				class : "filter timeRange",
				"filter-type":"timeRange",
				"data-filter" : id+"-startTime",
				onClick:function(evt){
					evt.stopPropagation();
				},
				onChange: function(v){ 
					endTimeCal.constraints.min = this.get("value");
				}
			}).placeAt(startTimeBox);
			var endTimeBox = domConstruct.create("div",{className:"timebox"},wPv);
			var endTimeLab = domConstruct.create("label",{className:"tiLab",innerHTML:"结束"},endTimeBox);
			var endTimeCal = new DateTextBox({
				value: new Date(),
				size:"10",
				"filter-type":"timeRange",
				"data-filter" : id+"-endTime",
				class : "filter timeRange",
				onClick:function(evt){
					evt.stopPropagation();
				},
				onChange: function(v){ 
					startTimeCal.constraints.max = this.get("value");
				}
			}).placeAt(endTimeBox);
			startTimeCal.onChange();
			endTimeCal.onChange();
			
	}
	
	function displaySearchBox(display){
		var _this = this;
		var searchBox = _this.getSearchBoxALL();
		if(searchBox){
			if(display){
				domStyle.set(searchBox,"display","block");
			}else{
				domStyle.set(searchBox,"display","none");
			}
		}
	}
	function isHide(evtNode,areaList){
		var hide = false;
		setResult(queryContain(evtNode,areaList));
		//如果evtNode属于某一组件
		var hasWidget = registry.getEnclosingWidget(evtNode);
		if(hasWidget){
			var widgetDomNode = hasWidget.domNode;
			//假设组件就在高级搜索中
			setResult(queryContain(widgetDomNode,areaList));
			//假设组件是datetimebox下拉的calendar
			var calendarWidgetId = hasWidget.get("id");
			//通过查看规律发现datetimebox和下拉calendar的id有联系
			var timeWidgetId = calendarWidgetId.substr(0,calendarWidgetId.lastIndexOf("_"));
			var timeWidget = registry.byId(timeWidgetId);
			if(timeWidget){
				var timeWidgetDom = timeWidget.domNode;
				setResult(queryContain(timeWidgetDom,areaList));
			}
		}
		//首先按照普通节点判断
		console.log({"时间组件":hasWidget});
		function setResult(contain){
			if(hide != true){
				hide = contain;
			}
		}
		function queryContain(evtNode,areaList){
			var contain = false;
			for(var i=0; i<areaList.length; i++){
				var nodelistMerg = query(evtNode).closest(".ZZ",areaList[i]);
				/* var nodelist2 = query("#"+domAttr.get(evtNode,"id"),areaList[i]);
				var nodelistMerg = nodelist1.concat(nodelist2);  */
				if(nodelistMerg.length != 0){
					contain = true;
				}
			}
			return contain;
		}
		return hide;
	}
	function formatDate(dateStr,BE){
		var stamp = require("dojo/date/stamp");
		var date1 = new Date();
		var options = {
			milliseconds :true
		};
		var date = new Date(dateStr);
		if(BE=="startTime"){
			date.setHours(0);
		}else if(BE=="endTime"){
			var endDay = date.getUTCDate();
			date.setUTCDate(endDay+1);
			var endDateMill = date.getTime();
			date = new Date(endDateMill-1);
		}
		var formatedDate = stamp.toISOString(date,options);
		
		return formatedDate;

	}
	var retClass = declare("widgets/Search/main",[WidgetBase, TemplatedMixin, Evented],{
		templateString : template,
		hrefURL : require.toUrl("widgets/Search/css/style.css"),
		disSearchBox : false,
		filterData : [],
		constructor:function(){	
		},	
		postCreate : function(){
			var _this = this;
			this.inherited(arguments);
			//监听浏览器缩放事件
			on(window,"resize",function(evt){
				//缩小搜索框
				console.log(evt);
			});
			on(win.doc,"mouseup",function(evt){
				//evt.stopPropagation();
				var evtNode = evt.target;
				var dropBtnNode = _this.getSearchDropBtn();
				var searchBoxNode = _this.getSearchBoxALL();
				var areaList = [];
				areaList.push(dropBtnNode);
				areaList.push(searchBoxNode);
				if(dropBtnNode){
					var ishide = isHide(evtNode,areaList);
					if(ishide == false){
						displaySearchBox.call(_this,ishide);
						var searchDropBtn = _this.getSearchDropBtn();
						domClass.remove(searchDropBtn,"hide");
					}
				}
				
			});
			var searchInputNode = this.getSearchInput();
			searchInputNode.onkeypress = function(event){
				if(event.keyCode == 13){
					//获取所有筛选条件的值
					var filterData = _this.getFilterData();
					_this.emit(searchEvent,filterData);
					displaySearchBox.call(_this,false);
				}
			}
		},
		setDisSearchBox:function(dis){
			this.disSearchBox = dis;
		},
		getDisSearchBox:function(){
			return this.disSearchBox; 
		},
		setFilteringSelect:function(filteringSelect){
			this.filteringSelect = filteringSelect;
		},
		getFilteringSelect:function(){
			return this.filteringSelect;
		},
		setSearchId:function(containerId){
			this.containerId = containerId;
		},
		getSearchId:function(){
			return this.containerId;
		},
		setSearchAll:function(boxNode){
			this.boxNode = boxNode;
		},
		getSearchAll:function(){
			return this.boxNode;
		},
		setSearchDropBtn:function(dropNode){
			this.dropNode = dropNode;
		},
		getSearchDropBtn:function(){
			return this.dropNode;
		},
		setSearchBox:function(searchBox){
			this.searchBox = searchBox;
		},
		getSearchBox:function(){
			return this.searchBox;
		},
		setSearchInput:function(searchInputNode){
			this.searchInputNode = searchInputNode;
		},
		getSearchInput:function(){
			return this.searchInputNode;
		},
		setSearchBoxALL:function(searchBoxALL){
			this.searchBoxALL = searchBoxALL;
		},
		getSearchBoxALL:function(){
			return this.searchBoxALL;
		},
		setDropBtnSelectDiv:function(dropBtnSelectDiv){
			this.dropBtnSelectDiv = dropBtnSelectDiv;
		},
		getDropBtnSelectDiv:function(){
			return this.dropBtnSelectDiv;
		},
		setSearchBoxX:function(val){
			var boxX = this.getSearchBoxALL();
			if(!boxX){
				console.error("[INFO] this.getSearchBoxALL() 没有获得相应的值");
			}
			dom.byId(boxX.id).style.left = parseFloat(val) + "px";
		},
		setSearchBoxY:function(val){
			var boxY = _this.getSearchBoxALL();
			if(!boxY){
				console.error("[INFO] this.getSearchBoxALL() 没有获得相应的值");
			}
			dom.byId(boxY.id).style.top = parseFloat(val) + "px";
		},
		createSearchBox:function(winBody,args){
			createSearchBox.call(this,winBody,args);
		},
		_onEnterBox:function(evt){
			var boxNode = evt.currentTarget;
			domClass.add(boxNode,"search-boxhvr");
		},
		_onLeaveBox:function(evt){
			var boxNode = evt.currentTarget;
			domClass.remove(boxNode,"search-boxhvr");
		},
		_onFocusInput:function(evt){
			var boxNode = this.getSearchAll();
			domClass.add(boxNode,"search-boxfcs");
		},
		_onBlurInput:function(evt){
			var boxNode = this.getSearchAll();
			domClass.remove(boxNode,"search-boxfcs");
		},
		_onClickBox:function(){
		
		},
		_onEnterDrop:function(evt){
			var dropNode = evt.currentTarget;
			domClass.add(dropNode,"search-drophvr");
		},
		_onLeaveDrop:function(evt){
			var dropNode = evt.currentTarget;
			domClass.remove(dropNode,"search-drophvr");
		},
		_onClickDrop:function(evt){
			evt.stopPropagation();
			//清空普通搜索内容
			var searchInputNode = this.getSearchInput();
			domAttr.set(searchInputNode,"value","");
			var searchDropBtn = this.getSearchDropBtn();
			domClass.add(searchDropBtn,"hide");
			createSearchBox.call(this,this.filterData);
		},
		_onEnterSearch:function(evt){
			var searchNode = evt.currentTarget;
			domClass.add(searchNode,"bluebtn-hvr");
		},
		_onLeaveSearch:function(evt){
			var searchNode = evt.currentTarget;
			domClass.remove(searchNode,"bluebtn-hvr");
		},
		_onClickSearch:function(evt){
			//获取所有筛选条件的值
			var filterData = this.getFilterData();
			this.emit(searchEvent,filterData);
			displaySearchBox.call(this,false);
			var searchDropBtn = this.getSearchDropBtn();
			domClass.remove(searchDropBtn,"hide");
		},
		getFilterData:function(expert){
			var _this = this;
			var filterData = new Array();
			function addFilter(filterName,filterValue){
				var filterObj = {
					filterName : filterName,
					filterValue : filterValue
				};
				filterData.push(filterObj);
			}
			if(expert){
				
				var searchBoxAllNode = _this.getSearchBoxALL();
				if(searchBoxAllNode){
					var filterList = query(".filter");
					var searchInputNode = this.getSearchInput();
					var term = domAttr.get(searchInputNode,"data-filter");
					addFilter(term,undefined);
					arrayUtil.forEach(filterList,function(item,index){
						var filterType = domAttr.get(item,"filter-type");
						var filterName = domAttr.get(item,"data-filter");
						var filterValue = domAttr.get(item,"value");
						if(filterType == null && filterName == null && filterValue == null){
							var itemWidget = registry.getEnclosingWidget(item);
							if(typeof itemWidget.get == "function"){
								filterType = itemWidget.get("filter-type");
								filterName = itemWidget.get("data-filter");
								filterValue = itemWidget.get("value");
							}
						}
						//处理时间格式
						if(filterType == "timeRange"){
							var BE = filterName.substr(filterName.lastIndexOf("-")+1);
							filterValue = formatDate(filterValue,BE);
						}
						if(filterValue){
							if(typeof filterValue == "string"){
								filterValue = lang.trim(filterValue)
							}
							addFilter(filterName,filterValue);
						}else{
							addFilter(filterName,undefined);
						}
					});
				}
			}else{
				var searchInputNode = this.getSearchInput();
				if(searchInputNode){
					var filterName = domAttr.get(searchInputNode,"data-filter");
					var filterValue = lang.trim(domAttr.get(searchInputNode,"value"));
					if(filterValue){
						addFilter(filterName,filterValue);
					}else{
						addFilter(filterName,undefined);
					}
					var filterList = query(".filter");
					arrayUtil.forEach(filterList,function(item,index){
						var filterName = domAttr.get(item,"data-filter");
						if(filterName == null){
							var itemWidget = registry.getEnclosingWidget(item);
							if(typeof itemWidget.get == "function"){
								filterName = itemWidget.get("data-filter");
							}
						}
						addFilter(filterName,undefined);
					});
				}
			}

			
			return filterData;
		}
	});
	return retClass;
});