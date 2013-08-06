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
//定义一个模块，用来获取模型分类
define("modellib/js/modelcategory",
	   [
	   "dojo/_base/declare",
	   "dojo/query",
	   "dojo/_base/xhr",
	   "dojo/dom-construct",
	   "dojo/dom",
	   "dojo/store/Memory",
	   "dijit/form/FilteringSelect",
	   "spolo/data/folder",
	   "dojo/_base/lang",
	   "dojo/domReady!"
	   ],
	   function(declare,query,xhr,dom_construct,dom,memory,filteringSelect,folder_cls,lang){
		var retClass = declare("modellib/js/modelcategory",[],
		{
			constructor : function(){
				modelcategoryObj = this;
				modelcategoryObj.path = "/content/modellib";
			},
			
			create : function(count,start){
				for(var i = start ; i < count; i++){
					dom_construct.create("li",
					{
						id : i
					},
					dom.byId("modelcategory")
					);
				}
			},
			
			replace: function(index,categoryname,categoryuri){
				dom.byId(index).innerHTML = lang.replace(
				"<a class='category'>{name}</a>"+"<div style='display:none;'>{uri}</div>",
				{
					name : categoryname,
					uri  : categoryuri
				}
				);
			},
			
			showModelCategory : function(){
				var folder = new folder_cls(modelcategoryObj.path);
				var initCount = 0;
				folder.getChildren(
					function(arrayObj){
						if(arrayObj.length > 0){
							if($("#modelcategory li").length == 0){
								initCount = arrayObj.length;
								modelcategoryObj.create(arrayObj.length,0);//动态创建li元素
							}
							for(var i in arrayObj){
								if(arrayObj.length == $("#modelcategory li").length)
								{
									modelcategoryObj.replace(i,arrayObj[i].getName(),arrayObj[i].getURI());
								}
								else if(arrayObj.length > $("#modelcategory li").length)
								{
									modelcategoryObj.create(arrayObj.length - initCount,$("#modelcategory li").length);
									modelcategoryObj.replace(i,arrayObj[i].getName(),arrayObj[i].getURI());
								}
								else
								{
									modelcategoryObj.replace(i,arrayObj[i].getName(),arrayObj[i].getURI());
									$("#modelcategory li:gt("+(arrayObj.length - 1)+")").remove();
								}
							}
							$("#noData").empty();
						}
						else
						{
							dom.byId("noData").innerHTML = "没有了...";
							$("#modelcategory").empty();
						}
					},
					function(error){
						alert("error");
					}
				);
			 },
			 
			 loadCategory : function(path,currCategory){
				modelcategoryObj.path = path;
				dom_construct.create("span",
				{
					id:modelcategoryObj.path,
					innerHTML:"<b class='currentmodelcategory'>" + currCategory + "</b><a class='more'><s></s></a><b class='arrow'>></b>"
				},
				dom.byId("currentCategory")
				);
				modelcategoryObj.showModelCategory();
			 },
			 
			 loadCurrCategory : function(path){
				if(modelcategoryObj.path != path){
					modelcategoryObj.path = path;
					modelcategoryObj.showModelCategory();
				}
			 }
		});
		return retClass;
});