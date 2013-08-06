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
	["dojo/dom",
	 "dojo/query",
	 "dojo/dom-class",
	 "dojo/dom-style",
	 "dojo/dom-attr",
	 "dojo/ready",
	 "dojo/on",
	 "dojo/json",
	 "dojo/date",
	 "dojo/_base/array",
	 "dijit/dijit", // loads the optimized dijit layer
	 "dijit/Calendar",
	 "dojo/date/locale",
	 "dojo/date/stamp",
	 "dojo/domReady!"],
	 function( dom,query,domClass,domStyle,domAttr,ready,on,jsonUtil,date,array,dijit,Calendar,locale,stamp ){
		var eventNode = window.eventNode;
		
		//排序事件名
		var orderevent = "order";
		var searchtimeframeevent = "searchtimeframe";
		var searchpriceframeevent = "searchpriceframe";
		var searchareaframeevent = "searchareaframe";
		var searchPublishAuthorevent = "searchPublishAuthor"
		var rowListevent = "rowList";
		var gridListevent = "gridList";
		console.log(eventNode);
		var startCalender = new Calendar({
			id:"startCalenderWidget",
			value: new Date(),
			searchName : "jcr:created",
			onChange : function(value){
				if(endCalender!=undefined){
					endCalender._populateGrid();
				}
			}, 
			isDisabledDate: function(d){
				var disable = false;
				var d = new Date(d); d.setHours(0, 0, 0, 0);
				if(endCalender!=undefined){
					var endDateStr = endCalender.get("value");
					var endDate = new Date(endDateStr);endDate.setHours(0, 0, 0, 0);
					disable = d>endDate;
				}
				return disable;
			}
		});
		var endCalender = new Calendar({
			id:"endCalenderWidget",
			value: new Date(),
			searchName : "jcr:created",
			onChange : function(){
				if(startCalender!=undefined){
					startCalender._populateGrid();
				}
			},
			isDisabledDate: function(d){
				var disable = false;
				var d = new Date(d); d.setHours(0, 0, 0, 0);
				if(startCalender!=undefined){
					var startDateStr = startCalender.get("value");
					var startDate = new Date(startDateStr);startDate.setHours(0, 0, 0, 0);
					disable = d<startDate;
				}
				return disable;
			}
		});
		ready(function(){
			//获取所有排序项
			var orderItems = query(".orderItem");
			orderItems.on("click",function(data){
				
				array.forEach(orderItems,function(item,i){
					domClass.remove(item, "selected");
				});
				domClass.add(this,"selected");
				var orderNode = query(this)[0];
				
				var orderdata = {
					sortName : domAttr.get(orderNode,"sortName"),
					order : domAttr.get(orderNode,"order")
				};
				eventNode.emit(orderevent,orderdata);
				console.log(this);
				console.log(query(".orderItem"));
				console.log(data);
			});
			
			
			/*时间选择*/
			// var start = dom.byId("startCalender");
			// var end = dom.byId("endCalender");
			// startCalender.placeAt(start);
			// startCalender._populateGrid();
			// endCalender.placeAt(end);
			// endCalender._populateGrid();
			
			/*时间选择事件*/
			// on(dom.byId("start"),"focus",function(){
				// domStyle.set(start,"display","block");
				// domAttr.set("start","value","");
				// startCalender.focus();
			// });
			// on(startCalender,"blur",function(){
				// domStyle.set(start,"display","none");
			// });
			// on(dom.byId("end"),"focus",function(){
				// domStyle.set(end,"display","block");
				// domAttr.set("end","value","");
				// endCalender.focus();
			// });
			// on(endCalender,"blur",function(){
				// domStyle.set(end,"display","none");
			// });
			// on(startCalender,"change",function(value){
				// domAttr.set("start","value",locale.format(value, {datePattern: "yyyy.MM.dd", selector:'date'}));
				// domAttr.set("start","displayValue",value);
			// });
			// on(endCalender,"change",function(value){
				// domAttr.set("end","value",locale.format(value, {datePattern: "yyyy.MM.dd", selector:'date'}));
				// domAttr.set("end","displayValue",value);
			// });
			/*时间段搜索*/
			// var totimeframe = dom.byId("totimeframe");
			// on(totimeframe,"click",function(){
				// eventNode.emit(searchtimeframeevent);
			// });
            
            /*价格段搜索*/
			// var topriceframe = dom.byId("topriceframe");
			// on(topriceframe,"click",function(){
				// eventNode.emit(searchpriceframeevent);
			// });
            
            /*面积段搜索*/
			// var toareaframe = dom.byId("toareaframe");
			// on(toareaframe,"click",function(){
				// eventNode.emit(searchareaframeevent);
			// });
			
			/*发布者事件*/
			var searchPublish = dom.byId("searchPublish");
			on(searchPublish,"click",function(){
				eventNode.emit(searchPublishAuthorevent);
			});
			
			/*模型个数*/
			//setModelTotal(1000);
			//setModelNumber(500);
			
			/*视图切换*/
			// var rowList = dom.byId("rowList");
			// var gridList = dom.byId("gridList");
			// on(rowList,"click",function(){
				// domClass.add(this,"rowListChecked");
				// domClass.remove(gridList,"gridListChecked");
				// eventNode.emit(rowListevent);
			// });
			// on(gridList,"click",function(){
				// domClass.add(this,"gridListChecked");
				// domClass.remove(rowList,"rowListChecked");
				// eventNode.emit(gridListevent);
			// });
		});
		
});
function setModelTotalToFilterBar(total){
	require(["dojo/dom"],function(dom){
		var totalNumberNode = dom.byId("totalNumber");
		if(totalNumberNode){
			totalNumberNode.innerHTML = total;
		}
	});
	
}
function setModelNumberToFilterBar(number){
	require(["dojo/dom"],function(dom){
		var resultNumberNode = dom.byId("resultNumber");
		if(resultNumberNode){
			resultNumberNode.innerHTML = number;
		}
	});
}