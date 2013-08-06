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
		"dojo/dom",
		"widgets/menu/ThirdNav/main"
	],
	function(on, ready, lang, dom, ThirdNav){
		var sourceArray = [];
		ready(function(){
			// 退出按钮
			var exit = dom.byId("exit");
			on(exit, "click", function(){
				Spolo.gutil.logout(function(){
					var url = "/modules/user/index.html?isGutil=true&redirect=/modules/gutil/opensource/index.html";
					window.location.href = url;	
				});
			});
			
			var thirdnav = new ThirdNav();
			thirdnav.placeAt("thirdNavWidget");
			var selfSource = {
				catData : [
					{
						catData : [],
						path: "/modules/myscenelib/index.html?isGutil=true",
						resourceName: "我的场景",
						totalNum: 0
					},
					{
						catData : [],
						path: "./addselfmodel.html",
						resourceName: "我的模型库",
						totalNum: 0
					},
					{
						catData : [],
						path: "/modules/scenedetail/addmodelfrommypreviewlib.html?isGutil=true",
						resourceName: "我的效果图",
						totalNum: 0
					}
				],
				path: "/content/users",
				resourceName: "我的资源",
				totalNum: 3
			};
			var pubSource = {
				catData : [
					{
						catData : [],
						path : "./addpubmodel.html",
						resourceName: "公共模型库",
						totalNum: 0
					},
					{
						catData : [],
						path: "/modules/scenedetail/addmodelfrompreviewlib.html?isGutil=true",
						resourceName: "公共效果图",
						totalNum: 0
					}
				],
				path : "/content",
				resourceName: "公共资源",
				totalNum: 2
			};
			sourceArray.push(selfSource);
			sourceArray.push(pubSource);
			thirdnav.initialize(sourceArray);
			
			on(thirdnav,"changeNav",function(json)
			{
				pulldownMenuAOnClick.call(this, json);
			});
		});
		
		function pulldownMenuAOnClick(json){
			var containerIframe = dom.byId("containerIframe");
			var path = json["path"];
			for(var index = 0; index < sourceArray.length; index ++){
				if(path.indexOf("content") < 0){
					if(sourceArray[index]["catData"].length > 0){
						for(var i = 0; i < sourceArray[index]["catData"].length; i ++){
							if(sourceArray[index]["catData"][i]["path"] == path){
								containerIframe.src = path;
								return;
							}
						}
					}
				}
			}
		}
	}
);