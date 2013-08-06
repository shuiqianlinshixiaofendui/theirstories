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
//定义一个模块,显示模型列表
define("modellib/js/list",
		[
		"dojo/_base/declare",
		"dojo/query",
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/dom",
		"ticketscene/js/cartCookie",
		"dojo/fx",
		"dojo/on",
		"dojo/dom-geometry",
		"dojo/json",
		"dojo/_base/lang",
		"dojo/dom-attr",
		"dojo/_base/fx",
		"spolo/data/folder",
		"dojo/domReady!"
		],
		function(declare,query,style,dom_construct,dom,cartCookie_cls,fx,on,domGeom,json,lang,attr,basefx,folder_cls){
			var list = {
				0:{
					modelPic:"./images/2.jpg",
					modelName:"手机",
					modelPrice : 99.1,
					modelNumber : 0,
					L1Material:"有",
					L2Material:"部分",
					author:"suzigang"
				},
				1:{
					modelPic:"./images/5.jpg",
					modelName:"手机",
					modelPrice : 19.8,
					modelNumber : 1,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				2:{
					modelPic:"./images/3.jpg",
					modelName:"手机",
					modelPrice : 19.1,
					modelNumber : 2,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				3:{
					modelPic:"./images/6.jpg",
					modelName:"手机",
					modelPrice : 55,
					modelNumber : 3,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				4:{
					modelPic:"./images/5.jpg",
					modelName:"手机",
					modelPrice : 22,
					modelNumber : 4,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				5:{
					modelPic:"./images/4.jpg",
					modelName:"手机",
					modelPrice : 86,
					modelNumber : 5,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				6:{
					modelPic:"./images/3.jpg",
					modelName:"手机",
					modelPrice : 53,
					modelNumber : 6,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				7:{
					modelPic:"./images/4.jpg",
					modelName:"手机",
					modelPrice : 76,
					modelNumber : 7,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				8:{
					modelPic:"./images/2.jpg",
					modelName:"手机",
					modelPrice : 3346,
					modelNumber : 8,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				9:{
					modelPic:"./images/2.jpg",
					modelName:"iphone",
					modelPrice : 85,
					modelNumber : 9,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				},
				10:{
					modelPic:"./images/6.jpg",
					modelName:"三星",
					modelPrice : 19.1,
					modelNumber : 10,
					L1Material:"有",
					L2Material:"部分",
					author:"admin"
				}
			};
			var retClass = declare("modellib/js/list",[],
			{
				constructor : function(containerID){
					listObj = this;
					listObj.list = list;
					listObj.showList(containerID);
					listObj.showAuthor();
					listObj.test();
				},
				showList : function(containerID){
					var count = 0;
					dom_construct.create("ul",{class:"list-h",id:"ul_list"},containerID,"first");
					var temp = "";
					for(var i in listObj.list){
						dom_construct.create("li",
						{
						id:i,
						innerHTML:"<div id='modelImg"+i+"'><img id='model_img"+i+"' src='"+listObj.list[i].modelPic+"'/></div>"+
								  "<div class='modelname'>"+listObj.list[i].modelName+"</div>"+
								  "<div class='material'><span>筛选材质 "+listObj.list[i].L1Material+"</span></div>"+
								  "<div class='material'><span>光学材质 "+listObj.list[i].L2Material+"</span></div>"+
								  "<div class='extra'><span class='evaluate'>作者:"+listObj.list[i].author+"</span></div>"+
								  "<div class='btns'><a class='btn-buy'>添加</a></div>"
						},
						"ul_list");
					}
					query(".btn-buy").on("click",function(evt){
						var id = $(this).parents("li").attr("id");//得到id值，为了取相应的图片id
						//TODO:这里调用cookie方法
						cartCookie_cls.addModelToCookie(list[id]);
						var imgSrc = $(this).parents("div").siblings("div").find("img").attr("src"); 
						if(!dom.byId("animImg"+id)){
							dom_construct.place("<img id='animImg"+id+"' src='"+imgSrc+"'/>","model_img"+id,"after");
						}
						var imgNode1 = dom.byId("model_img"+id);
						var imgpos = domGeom.position(imgNode1,true);
						var jsonImg = eval("("+json.stringify(imgpos)+")");
						var imgNode = dom.byId("animImg"+id);
						// alert((eval("("+json.stringify(domGeom.position(dom.byId("myscene"),false))+")")).x+"     ------"+(eval("("+json.stringify(domGeom.position(dom.byId("myscene"),false))+")")).y);
						fx.combine([
							fx.slideTo({
			                    node: imgNode,
			                    left: "900",//元素运动以后的状态
			                    top:  30 + window.scrollY,
			                    beforeBegin: function(){
									style.set(imgNode, {
										left:(jsonImg.x)+"px",//元素运动以前的状态
										top: (jsonImg.y)+"px",
										opacity:0.2
		                        	});
			                    },
								duration:2000
		                	}),
							basefx.fadeOut({
								node:imgNode,
								duration:2200,
								onEnd : function(){
									count ++ ;
									$("#myscene").empty();
									dom.byId("myscene").innerHTML = "我的场景 "+count+"";
									dom_construct.destroy("animImg"+id);
								}
							})
						]).play();
					});
				},
				showAuthor : function(){
					var authorArr = new Array();
					var newArr = new Array();
					var o = {};
					dom_construct.create("div",
					{
					innerHTML:"<a class='author' style='background:#4598D2;color:#fff;'>不限</a>"
					},
					dom.byId("authors")
					);
					for(var i in listObj.list)
					{
						authorArr.push(listObj.list[i].author);
					}
					for(var i = 0;i<authorArr.length;i++)
					{
						var v = authorArr[i];
						if(o[v] !== 1)
						{
							newArr.push(v);
							o[v] = 1;
						}
					}
					for(var i in newArr)
					{
						dom_construct.create("div",{innerHTML:"<a class='author'>"+newArr[i]+"</a>"},dom.byId("authors"));
					}
				},
				
				test : function(){
					var folder = new folder_cls("/content/users/admin/modellib/defaultCategory/chaji");
					folder.getChildJSON(
						function(json){
							for(var i in json){
								console.log(i+ "          -------"+json[i]);
							}
						},
					
					function(error){alert("error");});
				}
			});
			return retClass;
});