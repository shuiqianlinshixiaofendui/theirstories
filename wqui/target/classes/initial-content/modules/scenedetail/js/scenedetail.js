define("scenedetail/js/scenedetail",
[
	"spolo/data/scene",
	"spolo/data/folder",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/query",
	"dojo/NodeList-traverse",
	"dojo/dom-attr",
	"dojo/_base/declare"
],function(sceneClass, folder, dom, domConstruct, query, traverse, attr, declare){
	
	/* TODO: 这个方法会在 setInfo 方法废弃的时候修改
		这里定义该模块的私有方法
	*/
	function sceneFormatter(/*JSON*/scene){
		// 设置场景名称
		if(!scene["resourceName"] || scene["resourceName"] == ""){
			scene["resourceName"] = "未命名";
		}
		// 设置场景介绍
		if(!scene["intro"] || scene["intro"] == ""){
			scene["intro"] = "无";
		}
		// 设置场景预览图
		if(!scene["preview"] || scene["preview"] == ""){
			scene["preview"] = "images/nopreview.jpg";
		}
		// 设置创建时间
		if(!scene["jcr:created"] || scene["jcr:created"] == ""){
			scene["jcr:created"] = "无";
		}
		// 设置创建者
		if(!scene["jcr:createdBy"] || scene["jcr:createdBy"] == ""){
			scene["jcr:createdBy"] = "无";
		}
		//设置总模型数量
		if(!scene["totalModelNumber"] || scene["totalModelNumber"] == ""){
			scene["totalModelNumber"] = 1;
		}
		return scene;
	}
	
	// 获取场景详细信息的HTML
	function getSceneInfoHTML(/*JSON*/scene){
		// 格式化场景数据
		var scene = sceneFormatter(scene);
		var div = "<div class=\"sceneInfo\">"+
					"<div>场景名称：</div>"+
					"<div class=\"sceneInfoVal\">" + scene["resourceName"] + "</div>"+
				"</div>"+
				"<div class=\"sceneInfo\">"+
					"<div>场景介绍：</div>"+
					"<div class=\"sceneInfoVal\">" + scene["intro"] + "</div>"+
				"</div>"+
				"<div class=\"sceneInfo\">"+
					"<div>创建时间：</div>"+
					"<div class=\"sceneInfoVal\">" + scene["jcr:created"] + "</div>"+
				"</div>"+
				"<div class=\"sceneInfo\">"+
					"<div>创建者：</div>"+
					"<div class=\"sceneInfoVal\">" + scene["jcr:createdBy"] + "</div>"+
				"</div>"+
				"<div style=\"height:230px;\" class=\"sceneInfo\">"+
					"<div>场景预览图：</div>"+
					"<div class=\"modelInfoHolder\">"+
						"<img width=\"200px\" height=\"200px\" src=\"" + scene["preview"] + "\"></img>"+
					"</div>"+
				"</div>"+
				"<div class=\"sceneInfo\">"+
					"<div>模型数量：</div>"+
					"<div class=\"sceneInfoVal\">" + scene["totalModelNumber"] + "</div>"+
				"</div>";
		return div;
	}
	
	// 模型信息格式化
	function modelFormatter(model){
		model["id"] = (model["id"]&&model["id"]!="")?model["id"]:"";
		model["preview"] = (model["preview"]&&model["preview"]!="")?model["preview"]:"images/nopreview.jpg";
		model["name"] = (model["name"]&&model["name"]!="")?model["name"]:"未命名";
		model["intro"] = (model["intro"]&&model["intro"]!="")?model["intro"]:"无";
		model["jcr:createdBy"] = (model["jcr:createdBy"]&&model["jcr:createdBy"]!="")?model["jcr:createdBy"]:"无";
		model["jcr:created"] = (model["jcr:created"]&&model["jcr:created"]!="")?model["jcr:created"]:"无";
		model["number"] = (model["number"]&&model["number"]!="")?model["number"]:1;
		return model;
	}
	
	// 获取单个模型的HTML代码
	function getModelHTML(model){
		var model = modelFormatter(model);
		var div = "<div class=\"qf\">"+
						"<div class=\"ii\">"+
							"<span role=\"button\" class=\"a-n Hw Ph\" title=\"“选项”菜单\" tabindex=\"0\" aria-haspopup=\"true\"></span>"+
							"<a href=\"#\" class=\"g-s-n-aa Wk\" oid=\"#\" aria-hidden=\"true\">"+
								"<img src=\"" + model["preview"] + "\" width=\"48px\" height=\"48px\" alt=\"\" class=\"Ol Rf Ep\" oid=\"#\">"+
							"</a>"+
							"<div class=\"Jst8Q MI\">"+
								"<header>"+
									"<h3 class=\"cK\">"+
										"<a href=\"#\" class=\"Sg Ob Tc\" oid=\"#\">" + model["name"] + "</a>"+
									"</h3>"+
									"<span class=\"Wp mc\">"+
										"<span class=\"Ri lu\">"+
											"<a href=\"#\" target=\"_blank\" class=\"g-M-n g-s-n-aa ik Bf\" title=\"" + model["jcr:created"] + "\">" + model["jcr:created"] + "</a>"+
										"</span> &nbsp;-&nbsp; "+
										"<span role=\"button\" class=\"a-n ej Ku pl B5\" title=\"分享细节\" tabindex=\"0\" aria-haspopup=\"true\">公开</span>"+
									"</span>"+
								"</header>"+
							"</div>"+
							"<div class=\"ze ie\"></div>"+
							"<div class=\"ci gv\">"+
								"<div class=\"eE Fp\">"+
									"<div class=\"wm VC Dq2JMd\">　"+
										"<div class=\"modelInfo\">"+
											"<div class=\"infoLabel\">"+
												"<span>创建者：</span>"+
											"</div>"+
											"<div class=\"modelInfoVal\">"+
												"<span>" + model["jcr:createdBy"] + "</span>"+
											"</div>"+
										"</div>"+
										"<div class=\"modelInfo\" inputName=\"modelNumber\">"+
											"<div class=\"infoLabel\">"+
												"<span>模型数量：</span>"+
											"</div>"+
											"<div class=\"modelInfoVal\">"+
												"<span>" + model["number"] + "</span>"+
											"</div>"+
										"</div>"+
										"<div class=\"modelInfo\">"+
											"<div class=\"infoLabel\">模型简介：</div>"+
											"<div class=\"modelInfoVal\">" + model["intro"] + "</div>"+
										"</div>"+
										"<div style=\"height:1px; margin-top:-1px;clear: both;overflow:hidden;\"></div> "+
									"</div>"+
								"</div>"+
							"</div>"+
							
							
						"</div>"+
					"</div>";
		return div;
	}
	
	// 获取模型列表的HTML代码
	function getModelListHTML(itemArray){
		var item, val, html="";
		for(item in itemArray){
			if(item=="hasObject")continue;
			val = itemArray[item]["data"];
			html += "<div id=\""+val["id"]+"\" class=\"model Tg Sb GE\">"
					+ getModelHTML(val)
					+ "</div>";
		}
		return html;
	}
	
	
	// 下面是公共方法
	var classDefine = declare("scenedetail/js/scenedetail",[],
	{
		// 构造函数
		constructor : function(scenePath){
			// 获取场景的 jcr path
			this.currentPath = scenePath;
			
			// 实例化scene类
			this.senceObject = new sceneClass(this.currentPath);
			
			// 初始化场景详细信息
			//this.setInfo("sceneDetailInfo");
			
			// 初始化场景模型列表
			//this.listModel("itemList");

		},
		
		
		/*	设置场景的详细信息
		TODO:
			这个方法只是临时的，因为 scene.js 中支持如下方法：
				scene.getName() 获取场景的名称
				scene.getDescription() 获取场景的详细信息
				scene.getCreateDate() 获取场景的作者
				scene.getAuthor() 这个目前应该不需要，因为现在能打开的场景都是你自己的。
				scene.getPreview() 预览图，应该直接可以拿到一个url
				scene.getModelCount() 获取场景中的模型总数
		*/
		setInfo : function(containerId){
			var container = dom.byId(containerId);
			container.innerHTML = "正在加载...";
			// 获取当前场景的详细信息数据
			this.senceObject.getInfo(
				function(data){
					// 获取场景详细信息的HTML代码,包含CSS
					var html = getSceneInfoHTML(data);
					container.innerHTML = html;
					
					// container.innerHTML = "";
					// domConstruct.create("div",{
						// "class":"scene",
						// innerHTML:html
					// },"sceneDetailInfo");
				},
				function(err){
					container.innerHTML = "加载失败...";
				}
			);
			
			
			
		},
		
		
		/**	把当前场景中所有模型都列出来
		*/
		listModel : function(containerId){
			var container = dom.byId(containerId);
			container.innerHTML = "正在加载...";
			
			this.senceObject.ensureItems(
				function(itemArray){
					// console.log(itemArray);
					var html = getModelListHTML(itemArray);
					// console.log(html);
					container.innerHTML = html;
				},
				function(err){
					throw(err);
				}
			);
		},
		
		// 下载场景
		download : function(sceneType){
			this.senceObject.download(sceneType);
		}
		
		/*
		InitializeModel:function(addRowsToPage,errorFunc){
			this.senceObject.getObjects(addRowsToPage,errorFunc);
		},
		
		getSceneJson:function(){
			var json = {
				
			};
			return json;
		},
		
		Initialize:function(){
			// this.addSceneInfoToPage(scene);
			
			//var modelArr = this.getModelArrayFromScene(scene);
			//初始化场景信息
			this.InitializeScene(classDefine.addSceneInfoToPage,function(e){
				Spolo.notify({
					"text" : "获取数据错误！",
					"type" : "error",
					"timeout" : 1000
				});
			});
			//初始化模型列表信息
			this.InitializeModel(
				classDefine.addRowsToPage,
				function(error){
					Spolo.notify({
						"text" : "获取数据失败！",
						"type" : "error",
						"timeout" : 1000
					});
				}
			);
			
			
			
		},
		InitializeScene:function(addSceneInfoToPage,errorFunc){
			//通过调用scene.js的获取场景基本信息的方法获取json
			this.senceObject.getInfo(addSceneInfoToPage,errorFunc);
			
			//先用假数据获取
			//this.addSceneInfoToPage(this.sceneData);
		},
		
		getModelArrayFromScene:function(scene){
			var modelArr = new Array();
			//得到ticket的json
			if(scene["ticket"]){
				var ticket = scene["ticket"];
				//得到items的json
				if(ticket["items"]){
					var items = ticket["items"];
					modelArr = items;
				}
			}
			return modelArr;
		},
		
		updateModelNumber:function(model,modelDom){
			var number = model["number"];
			number = parseInt(number);
			//一方面改变页面
			var span = query(modelDom).children(".modelInfoVal span");
			span.innerHTML = number;
			//一方面调用api改变jcr
			
		},
		getModelById:function(id){
			//得到当前场景的所有模型
			var modelarr = this.modelArr;
			//判断数组中是否有此id的模型
			if(modelarr[id]){
				var model = modelarr[id];
				return model;
			}
		}
	});
	
	*/
	
	});
	
	return classDefine;
	
});//define end