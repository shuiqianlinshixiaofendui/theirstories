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
require(
[
	"dojo/ready",
	"dojo/on",
	"dojo/Evented",
	"widgets/Button/main",
	"widgets/WaterFall/main",
	"widgets/Search/main",
	"widgets/AdvCategory/main",
],function(ready,on,Evented,widgetButton,waterfall,Search,AdvCategory){
		
	ready(function(){
		/**
		*分类按钮
		*/
		var json_button ={
			style:"style1",
			buttonNumber:3,
			button_size:{
				"height":"30px",
				"width":"300px"
			},
			font:{
				"title":["云端模型库","云端材质库","云端效果图"],
				"fontSize":"24px",
				"fontWeight":"bolder"
			}
	   }
		var btn = new widgetButton(json_button).placeAt(dojo.byId("head"));
		
		
		/**
		*搜索框
		*/
		var serch_args =[
			{"name":"名称","id":"resourceName"},
			{"name":"作者","id":"author"},
		];
		var search = new Search({filterData:serch_args}).placeAt(dojo.byId("search"));
		on(search,"search",function(filterData){
			console.log(filterData,"1111");
		});
		on(search,"advanceSearch",function(filterData){
			console.log(filterData,"2222");
		});
		
		/**
		* 分类
		*/
		var catgory = new AdvCategory().placeAt(document.getElementById("catgory"));
		
		
		/**
		*显示材质部分
		*/ 
		
	    var dataList = [];
		var fieldsList = {
			"名称" : "chaji_1",
			"作者" : "admin",
		}
		
		for(var i=0;i<10;i++){
				var data = {
				"id" : i,
				"img" :"/modules/modellib/images/nopreview.jpg",
				"fields" : fieldsList,
			}
			dataList.push(data);
		}
		var waterfall_ref = new waterfall().placeAt(dojo.byId("list"));
		waterfall_ref.initData(dataList,1);
		 waterfall_ref.setDelButtonDisplay("none");
		on(waterfall_ref,"picClick",function(data){
			var url ="/modules/mytask/modifyMaterial.html";
			var selectedObj = document.getElementById(data);
			var message = [];
			for(var i in selectedObj.childNodes){
				if(selectedObj.childNodes[i].className == "waterfall_picDescription"){
					var child_nodes = selectedObj.childNodes[i];
					var length = child_nodes.childNodes.length - 1;
					for(var i=0;i< child_nodes.childNodes.length;i++){
						message.push(child_nodes.childNodes[i].innerHTML.substring(4));
					}
				}
			}
			var dialogData={
				widthpx:960,
				heightpx:750,
				url:url,
				title:"材质bug信息表",
				data : {
					"message" : message
				}
			}
			Spolo.dialog(dialogData);
			
		}) 
	})
});