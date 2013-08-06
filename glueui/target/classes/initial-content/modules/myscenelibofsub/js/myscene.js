/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/
//定义一个模块，显示场景列表
define("myscenelib/js/myscene",
[
	"dojo/query",
	"dojo/dom-construct",
	"spolo/data/folder",
	"dojo/on",
	"dojo/ready",
	"dojo/dom",
	"dijit/form/Button",
	"dijit/Dialog",
	"dojo/_base/lang",
	"dojo/NodeList-traverse"
	
],
function(
	query,
	dom_construct,
	folder_cls,
	on,
	ready,
	dom,
	Button,
	Dialog,
	lang
){

	// 获取当前用户
	var uid = Spolo.getUserId();
	var userNodePath = "/content/users/"+uid;
	var scenelibPath = userNodePath + '/' + "scenelib";

	var list = {};
	
	var scenelibFolder = new folder_cls(scenelibPath);
	
	function init(){
		$LAB.setGlobalDefaults({ BasePath : '' , CacheBust : false });
		$LAB
		.script("js/jquery-ui-1.8.23.custom.min.js").wait()
		.script(
		"js/waypoints.min.js",
		"js/jquery.isotope.min.js",
		"js/jquery.qtip.min.js",
		"js/shadowbox.js"
		).wait()
		.script("js/site.js").wait(function() {
		jSite.start();
		}); 
	}

	function	getSceneList(){
		scenelibFolder.getChildren(
			dojo.hitch(this, function(arrayObj){
				for(var index = 0; index < arrayObj.length; index ++)
				{
					var listSon = {};
					
					listSon["scenePic"] = "../myscenelib/images/001.jpg";
					listSon["sceneName"] = arrayObj[index].getName();
					listSon["author"] = arrayObj[index].getCreatedBy();
					listSon["scenePath"] = arrayObj[index].getURI();
					listSon["Obj"] = arrayObj[index];
					list[index] = listSon;
				}

				this.showList();
				//init.call(this);
			}),
			function(){

			}
		);
	}

	var sceneClass = dojo.declare("myscenelib/js/myscene",[],
	{
		constructor : function(containerID){
			sceneObj = this;
			this.list = list;
			this.containerID = containerID;
			getSceneList.call(this);
		},
		showList : function()
		{
			temp = "<center><label>确定删除该场景吗？</label><br />"+
					"<button id='Sure'></button>"+
					"<button id='Cancel'></button></center>";
			var dialog = new Dialog({
				title: "删除场景",
				content: temp,
				style: "width: 200px;position:relavite;top:20px;"
			});
			new Button({
				label:"确定"
			},"Sure");
			new Button({
				label:"取消"
			},"Cancel");
			dom_construct.create("div",{id:"projects",class:"project_1"},this.containerID,"first");
			for(var i in this.list)
			{
				// 构建用于显示每个场景的代码。
				var tmpInnerHTML = "<img id='"+i+"' width='306' height='220'  src='" + this.list[i].scenePic+"' class='sceneImg'/><img class='remove' style='position:absolute;top:0px;left:0px;display:none' src='./images/remove.jpg' id='__"+i+"'/>"
					+ "<h3>"+this.list[i].sceneName+"&nbsp;&nbsp;作者:"+Spolo.decodeUname(this.list[i].author)+"</h3>"
				dom_construct.create("div",
				{
					id : i,
					class : "element",
					style　: "position:relative;margin:10px",
					innerHTML : tmpInnerHTML
				},
				"projects");
			}
			on(dom.byId("view"), "click", lang.hitch(this, function(){
				dom_construct.destroy("projects");
				dom.byId("result1").innerHTML = "TestNode1 has been destroyed.";
				
				dom_construct.create("div",{id:"projects",class:"project_1"},this.containerID,"first");
					
			}));
			
			
			
			on(query(".icon"),"click",function(){
				if($(this).siblings().html() == "编辑")
				{
					$(this).siblings().html("取消编辑");
					query('.remove').style("display","block");
				}
				else
				{
					$(this).siblings().html("编辑");
					query('.remove').style("display","none");
				}
			});
			// $(".icon").click(function(){
				
				// if (b == 0)
				// {
					// b = 1;    
					// $("#buttonId").val("取消编辑");
					// query('.remove').style("display","block");
				// }
				// else
				// {
					// b = 0;    
					// $("#buttonId").val("编辑");
					// query('.remove').style("display","none");
				// }
			// });

			query(".sceneImg").on("click",function(e){
				window.location.href="../scenedetail/index.html?path="+list[this.id]["scenePath"];		
			});
			
			query(".remove").on("click",function()
			{
				var id = this.id.substring(2);
				var divNode = this.parentNode;
				dialog.show();
				on(dom.byId("Sure"),"click",function(){
					list[id]["Obj"].remove(
						function()
						{
							divNode.remove();
						},
						function()
						{
							alert("删除失败");
						}
					);
					dialog.hide();
					//getSceneList.call(sceneObj);					
				});
				
				on(dom.byId("Cancel"),"click",function(){
					dialog.hide();
				});
			});
		} 
	});
	return  sceneClass;
});