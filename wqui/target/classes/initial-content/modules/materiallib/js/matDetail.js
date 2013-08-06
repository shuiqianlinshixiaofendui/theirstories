require([
			"dojo/request/xhr",
			"dojo/dom", 
			"dojo/dom-style",
			"dojo/dom-class",
			"dojo/dom-attr",
			"dojo/dom-construct",
			"dojo/on",
			"dijit/form/ValidationTextBox",
			"spolo/data/scene",
			"spolo/data/spsession",	
			"spolo/data/material",	
			"spolo/data/folder/materiallib",
			"dojo/ready",
			"dojo/query",
			"dojo/json",
			"dojo/parser", 
			"dojo/mouse",
			"dojo/keys",
			"dojo/date/locale",
			"dijit/registry",
			"dijit/form/Button",
			"dijit/Dialog",
			"dijit/layout/BorderContainer",
			"dijit/layout/ContentPane",
			"widgets/Category/Category",
			"dojo/NodeList-traverse",
			"dojo/NodeList-dom",
			"dojo/NodeList-manipulate"
		],function(xhr, dom,domStyle,domClass,domAttr,domConstruct, on, ValidationTextBox, 
				scene_class, spsession_class,material_class,materiallib_cls, ready, query,jsonUtil,parser,mouse,keys,locale,registry,Button,Dialog,BorderContainer,ContentPane,Category){
				var materialObj = {};
			ready(function(){
			
				var uid = Spolo.getUserId();
				
				// 构造一个 session 对象
				var sessionPath = "/content/users/"+uid+"/scenelib";
				var spsession = new spsession_class(sessionPath);
				
				//获取材质的对象
				materialObj = getMaterialObj();
				//初始化页面
				initPage();
			});
			//获取发布者组件
			function getMatAuthorNode(){
				return dom.byId("author");
			}
			//获取发布时间组件
			function getMatPulishDataNode(){
				return dom.byId("publishDate");
			}
			//获取材质名输入组件
			function getMatNameNode(){
				return dom.byId("maName");
			}
			//获取材质分类按钮
			function getMatCategoryBtnNode(){
				return dom.byId("materialCategory");
			}
			//获取材质分类输入组件
			function getMatCategoryNode(){
				return dom.byId("maCategory");
			}
			//获取材质关键字输入组件
			function getMatKeywordsNode(){
				return dom.byId("maKeywords");
			}
			//获取材质描述输入组件
			function getMatDescribeNode(){
				return dom.byId("maDescribe");
			}
			//获取材质预览图组件
			function getMatPreviewImgNode(){
				return dom.byId("previewShow");
			}
			//获取材质预览图输入组件
			function getMatPreviewNode(){
				return dom.byId("maPreview");
			}
			//获取材质输入组件
			function getMatFileNode(){
				return dom.byId("maFile");
			}
			//获取材质对象
			function getMaterialObj(){
				var data = Spolo.getDialogData();
				var matPath;
				if(data){
					matPath = data["path"];
				}
				return new material_class(matPath);
			}
			function initPage(){
				//通过材质对象获取并设置详细信息填充到页面
				getMatInfo(loadInfo,faildInfoLoad);
				//预览图
				initPreviewBox();
				//材质
				initMaterial();
				//材质信息
				initMaterialInfo();
				//上传
				initUpload();
				
			}
			function loadInfo(infoData){
				var maAuthor,
				maPublishDate,
				maName,
				maKeywords,
				maCategory,
				maCategoryPath,
				maDescribe,
				previewShow;
				console.log(infoData);
				maAuthor = infoData["publishAuthor"];
				maPublishDate = infoData["publishdate"];
				maPublishDate = formatDate(maPublishDate);
				maName = infoData["resourceName"];
				maKeywords = infoData["keyInfo"];
				maCategory = infoData["categoryName"];
				maCategoryPath = infoData["categoryPath"];
				maDescribe = infoData["introduction"];
				previewShow = infoData["preview"];
				//设置发布者
				var matAuthorNode = getMatAuthorNode();
				maAuthor = Spolo.decodeUname(maAuthor);
				if(matAuthorNode && maAuthor){
					domAttr.set(matAuthorNode,"value",maAuthor);
				}
				//设置发布时间
				var matPulishDataNode = getMatPulishDataNode();
				if(matPulishDataNode && maPublishDate){
					domAttr.set(matPulishDataNode,"value",maPublishDate);
				}
				//设置材质名
				var maNameNode = getMatNameNode();
				if(maNameNode&&maName){
					domAttr.set(maNameNode,"value",maName);
				}
				//设置关键字
				var maKeywordsNode = getMatKeywordsNode();
				if(maKeywordsNode&&maKeywords){
					domAttr.set(maKeywordsNode,"value",maKeywords);
				}
				//设置分类
				var maCategoryNode = getMatCategoryNode();
				var maCategoryBtnNode = getMatCategoryBtnNode();
				if(maCategoryBtnNode&&maCategoryNode&&maCategory){
					domAttr.set(maCategoryNode,"value",maCategoryPath);
					domAttr.set(maCategoryBtnNode,"value",maCategory);
				}
				//设置描述
				var maDescribeNode = getMatDescribeNode();
				if(maDescribeNode&&maDescribe){
					domAttr.set(maDescribeNode,"value",maDescribe);
				}
				//设置预览图
				var maPreviewImgNode = getMatPreviewImgNode();
				if(maPreviewImgNode&&previewShow){
					domAttr.set(maPreviewImgNode,"src",previewShow);
				}
			}
			function faildInfoLoad(error){
				console.log(error);
			}
			function getMatInfo(loadInfo,faildInfoLoad){
				var data = Spolo.getDialogData();
				var matPath;
				if(data){
					matPath = data["path"];
				}
				if(matPath){
					material_class.getInfo({
						path : matPath,
						separator : ">>",
						success : function(jsondata){
							loadInfo(jsondata)
						},
						failed : function(error){
							faildInfoLoad(error);
						}
					});
				}
				
			}
			function initPreviewBox(){
				var previewPaneNode = dom.byId("previewBox");
				on(previewPaneNode,mouse.enter,function(){
					displaySelectBox(true);
					
				});
				on(previewPaneNode,mouse.leave,function(){
					displaySelectBox(false);
				});
				var previewBoxNode = dom.byId("previewBox");
				
				if(previewBoxNode != undefined){
					on(previewBoxNode,"dragover",function(event){
						domStyle.set(previewBoxNode,"border","1px solid #00FF00");
						event.preventDefault();
						if (event.stopPropagation) {
							event.stopPropagation ();
						}
						else {
							event.cancelBubble = true;
						}
					});
					on(previewBoxNode,"dragenter",function(e){
						domStyle.set(previewBoxNode,"border","1px solid #00FF00");
					});
					on(previewBoxNode,"dragleave",function(e){
						domStyle.set(previewBoxNode,"border","1px solid #FFFFFF");
					});
					on(previewBoxNode,"drop",function(event){
						// prevent default action (open as link for some elements)
						event.preventDefault();
						domStyle.set(previewBoxNode,"border","1px solid #FFFFFF");
						if (event.dataTransfer) {
							var files = event.dataTransfer.files; // FileList object.
							setImg(getMatPreviewNode(),getMatPreviewImgNode(),files);
							
						}
						else {
							alert ("Your browser does not support the dataTransfer object.");
						}
						
						if (event.stopPropagation) {
							event.stopPropagation ();
						}
						else {
							event.cancelBubble = true;
						}
						return false;
					});
					
				}
				
				on(query(".selectBox"),"click",function(){
					getMatPreviewNode().click();
				});
				var maPreviewNode = getMatPreviewNode();
				if(maPreviewNode!=undefined){
					on(maPreviewNode,"change",function(e){
						var isPreviewValid = validatePreview();
						if(isPreviewValid != undefined){
							if(isPreviewValid == true){
								previewValidSucc();
								
							}else{
								previewValidFaild()
								
							}
						}
					}); 
				}
				
			}
			function displaySelectBox(display){
				var toSelectPreviewBgNode = dom.byId("toSelectPreviewBg");
				var toSelectPreviewBtNode = dom.byId("toSelectPreviewBt");
				displayByNode(toSelectPreviewBgNode,"selectBox");
				displayByNode(toSelectPreviewBtNode,"selectBox");
				function displayByNode(node,className){
					if(node!=undefined){
						var isDisplay = domClass.contains(node,className);
						if(display == true){
							if(isDisplay != undefined && isDisplay != false){
								domClass.remove(node,className);
							}
						}else{
							if(isDisplay != undefined && isDisplay != true){
								domClass.add(node,className);
							}
						}
					}
				}
			}

			function initMaterial(){
				var toSelectMaterialNode = dom.byId("toSelectMaterial");
				var maFileNode = getMatFileNode();
				var fileBoxNode = dom.byId("filePane");
				if(toSelectMaterialNode!=undefined){
					on(toSelectMaterialNode,"click",function(){
						if(maFileNode!=undefined && typeof(maFileNode.click) == "function"){
							getMatFileNode().click();
						}
					})				
				}
				if(fileBoxNode != undefined){
					var promptNode = dom.byId("filepro");
					var selectFileBtnNode = dom.byId("toSelectMaterial");
					on(fileBoxNode,"dragover",function(event){
						event.preventDefault();
						if (event.stopPropagation) {
							event.stopPropagation ();
						}
						else {
							event.cancelBubble = true;
						}
						domStyle.set(fileBoxNode,"border","1px solid #00FF00");
					});
					on(fileBoxNode,"dragenter",function(e){
						domStyle.set(fileBoxNode,"border","1px solid #00FF00");
					});
					on(fileBoxNode,"dragleave",function(e){
						domStyle.set(fileBoxNode,"border","1px solid #cccccc");
					});
					on(fileBoxNode,"drop",function(event){
						event.preventDefault();
						domStyle.set(fileBoxNode,"border","1px solid #cccccc");
						if (event.dataTransfer) {
							var files = event.dataTransfer.files; // FileList object.
							setFile(getMatFileNode(),files);
							
						}
						else {
							alert ("Your browser does not support the dataTransfer object.");
						}
						
						if (event.stopPropagation) {
							event.stopPropagation ();
						}
						else {
							event.cancelBubble = true;
						}
						return false;
					});
				}
				if(maFileNode!=undefined){
					on(maFileNode,"change",function(){
						var isFileValid = validateMaterialFile();
						if(isFileValid != undefined){
							if(isFileValid == false){
								//材质文件验证失败
								fileValidFaild();
								
							}else{
								fileValidSucc();
							}
						}
					})
				}
			}
			function initMaterialInfo(){
				initMaterialName();
				initMaterialCategory();
				initMaterialKeywords();
				initMaterialDescribe();
			}
			
			function initMaterialName(){
				var maNameNode = getMatNameNode();
				if(maNameNode){
					on(maNameNode,"keyup",function(){
						var isNameValid = validateMaterialName();
						if(isNameValid!=undefined){
							if(isNameValid == false){
								//让材质名称输入框获取焦点
								setInputState(maNameNode,isNameValid,"require");
							}else{
								setInputState(maNameNode,isNameValid);
							}
						}
					})
				}
			}
			function initMaterialCategory(){
				var maCategoryNode = getMatCategoryBtnNode();
				if(maCategoryNode != undefined){
					on(maCategoryNode,"click",function(){
						//显示分类选择器
						var json = {
							title1: "选择分类",
							title: "请选择分类",
							path : "/content/materiallibcategory",
							propertyName : "category"
							//selectedName : this.get("category"),
							//selectedPath : this.get("categoryPath")
						};
						showCategorySelect(json);
					});
				}
				
			}
			function showCategorySelect(json){
				var dialogContent = "<div id=\"dialogCont\" style=\"margin:0px auto;\"></div>"+
					"<div style='margin:30px 0px 0px 100px;'>"+
						"<button type='button' id='modelEditSureBtn'></button>"+
						"<button type='button' id='modelEditCancelBtn'></button>"+
					"</div>";
				dialog = new Dialog({
					title: json["title"],
					style: "width:90%;height:90%;background:#fff",
					content: dialogContent
				});
				var cancelBtn = new Button({
					label:" 取消 ",
					onClick:function(){
						closeDialog();
					}
				},"modelEditCancelBtn");
				var sureBtn = new Button({
					label:" 确定 ",
					onClick:function(){
						var label = json["title"];
						if(selectedData["label"])
						{
							label = selectedData["label"];
						}
						var path = json["path"];
						if(selectedData["path"])
						{
							path = selectedData["path"];
						}
						setCategory(label,path);
						
						//dthis.set(json["propertyName"],label);
						//dthis.set(json["propertyName"]+"Path",path);
						closeDialog();
					}
				},"modelEditSureBtn");
				
				dialog.on("hide",function(){
					closeDialog();
				});
				
				function closeDialog(){
					dialog.hide();
					cancelBtn.destroy();
					sureBtn.destroy();
					cateWidget.destroy();
					dialog.destroy();
				}
				
				var dthis = this;
				var cateWidget = new Category(json).placeAt("dialogCont");
				if(json["selectedPath"] && json["selectedPath"]!="undefined"){
					if(json["selectedPath"] != json["path"])
					{
						var selectedJson = {
							path : json["selectedPath"],
							text : json["selectedName"],
							type : "modellibcategory"
						};
						cateWidget.initialize(selectedJson);
					}else{
					cateWidget.initialize();
					}
				}else{
					cateWidget.initialize();
				}
				
				var selectedData = {};
				on(cateWidget, "onSelectedListChanged", function(res){
					selectedData = res;
				});
				
				dialog.show();
			}
			function initMaterialKeywords(){
				var maKeywordsNode = getMatKeywordsNode();
			}
			function initMaterialDescribe(){
				var maDescribeNode = getMatDescribeNode();
			}
			function setImg(imgNode,file,files){
				if(imgNode!=undefined){
					if(files!=undefined){
						imgNode.files = files;
					}
					if(imgNode.files != undefined){
						var selectedFile = imgNode.files[0];
						var reader = new FileReader();
						if(file != undefined){
							file.title = selectedFile.name;

							reader.onload = function(event) {
								file.src = event.target.result;
							};

							reader.readAsDataURL(selectedFile);
						}
					}else{
						var filePath = imgNode.value;
						filePath = filePath.replace(/\\/g,"/");
						file.src = String(filePath);
					}
					
				}
			}
			function setFile(imgNode,files){
				if(imgNode!=undefined){
					if(files!=undefined){
						imgNode.files = files;
					}
				}
			}
			function initUpload(){
				var uploadBtn = dom.byId("upMaterialBtn");
				if(uploadBtn!=undefined){
					var handle = on(uploadBtn,"click",function(evt){
						readyUpload(handle);
					});
				}
			}
			function readyUpload(handle){
				//检验重要参数
				var isvalid = validateForm();
				if(isvalid == true){
					handle.remove();
					//获取重要参数
					var material = getParams();
					//调用上传材质的接口
					var formId = "updateMaterial";
					updateMaterial(material,formId);
					//material_class.upload(formId);
					//alert(formId);
				}
			}
			function validateForm(){
				var isvalidate = true;
				
				//检验材质名称
				var isNameValid = validateMaterialName();
				if(isNameValid!=undefined){
					if(isNameValid == false){
						//让材质名称输入框获取焦点
						var materialNameNode = getMatNameNode();
						if(materialNameNode != undefined){
							//materialNameNode.validate(true);
							materialNameNode.focus();
							isvalidate = false;
							setInputState(materialNameNode,isvalidate,"require");
						}
					}
				}
				
				return isvalidate;
			}
			function validateMaterialFile(){
				var isFileValidate = false;
				var maFileNode = getMatFileNode();
				var file = maFileNode.files;
				if(maFileNode!=undefined){
					var filePath = "";
					if(file!=undefined){
						if(file.length>0){
							filePath = file[0].name;
						}
					}else{
						filePath = maFileNode.value;
					}
					var fileType = filePath.substring(filePath.lastIndexOf("."));
					if(fileType!=undefined && (fileType == ".gmt" || fileType == ".zip")){
						isFileValidate = true;
					}
				}
				return isFileValidate;
			}
			function validateMaterialName(){
				var isNameValidate = true;
				var maNameNode = getMatNameNode();
				var maName = domAttr.get(maNameNode,"value");
				if(maNameNode==undefined || maName==undefined || maName==""){
					isNameValidate = false;
				}
				return isNameValidate;
			}
			function validateMaterialNameNull(){
				var isNameNull = false;
				var maNameNode = getMatNameNode();
				var maName = domAttr.get(maNameNode,"value");
				if(maNameNode==undefined || maName==undefined || maName==""){
					isNameNull = true;
				}
				return isNameNull;
			}
			function validateMaterialCategory(){
				var isCategoryValidate = true;
				var maCategoryNode = getMatCategoryNode();
				var maCategory = domAttr.get(maCategoryNode,"value");
				if(maCategoryNode==undefined || maCategory==undefined || maCategory==""){
					isCategoryValidate = false;
				}
				return isCategoryValidate;
			}
			function validatePreview(){
				var isPreviewValid = false;
				var maPreviewNode = getMatPreviewNode();
				var file = maPreviewNode.files;
				if(maPreviewNode!=undefined){
					var filePath = "";
					if(file!=undefined){
						if(file.length>0){
							filePath = file[0].name;
						}
					}else{
						filePath = maPreviewNode.value;
					}
					var fileType = filePath.substring(filePath.lastIndexOf("."));
					if(fileType!=undefined){
						if(fileType==".bmp" || 
						   fileType==".jpg" || 
						   fileType==".png" ||
						   fileType==".jpeg")
						{
							isPreviewValid = true;
						}
					}
				}
				return isPreviewValid;
			}
			function resetPreview(){
				var materialPreviewNode = getMatPreviewImgNode();
				var maPreviewNode = getMatPreviewNode();
				if(materialPreviewNode != undefined){
					domAttr.set(materialPreviewNode,"src","");
				}
				if(maPreviewNode != undefined && typeof(maPreviewNode.reset) == "function"){
					maPreviewNode.reset();
				}
			}
			function showCategoryDialog(category){
				//目前选择的分类
				Spolo.dialog({
					title : "分类选择器",
					content : "<div>分类选择器</div>",
					data : {
						category : category
					}
				});
			}
			function setCategory(categoryName,category){
				var materialCategoryNode = getMatCategoryBtnNode();
				var maCategoryNode = getMatCategoryNode();
				if(materialCategoryNode != undefined){
					domAttr.set(materialCategoryNode,"value",categoryName);
				}
				if(maCategoryNode != undefined){
					domAttr.set(maCategoryNode,"value",category);
				}
			}
			function previewValidSucc(){
				var previewShowNode = getMatPreviewImgNode();
				var maPreviewNode = getMatPreviewNode();
				if(previewShowNode!=undefined && maPreviewNode != undefined){
					setImg(maPreviewNode,previewShowNode);
				}
			}
			function previewValidFaild(){
				//提示用户材质文件的规范
				Spolo.notify({
					text : "缩略图不是必要，格式应为'bmp,jpg,png,jpeg'!!",
					type : "error",
					timeout : 1000
				});
				//重置预览图节点和图片展示节点
				resetPreview();
			}
			function fileValidFaild(){
				//提示用户材质文件的规范
				Spolo.notify({
					text : "材质文件必须，格式应为'gmt'或'zip'!!",
					type : "error",
					timeout : 1000
				});
				var maFileNode = getMatFileNode();
				if(maFileNode != undefined){
					if(typeof(maFileNode.reset) == "function"){
						maFileNode.reset();
					}
				}
				//恢复材质文件提示信息
				setFileMsg(false)
			}
			function categoryValidFaild(){
				//提示用户材质文件的规范
				Spolo.notify({
					text : "材质分类必须，请选择分类!!",
					type : "error",
					timeout : 1000
				});
				
			}
			function fileValidSucc(){
				//在材质文件选择区域显示材质文件就绪
				setFileMsg(true);
				//判断用户是否已经输入材质名
				var isMaterialNameNull = validateMaterialNameNull();
				if(isMaterialNameNull == true){
					//将文件名称填充到材质名称输入框中
					setFileName(getMaterialFileName());
				}
				
			}
			
			function setFileMsg(ready){
				var msg;
				if(ready == true){
					msg = "材质文件就绪";
				}else{
					msg = "请拖拽材质文件到这里";
				}
				var fileMsgNode = dom.byId("fileMsg");
				if(fileMsgNode != undefined){
					var state = domClass.contains(fileMsgNode,"readyMsg");
					if(ready == false){
						if(state!=undefined){
							if(state == true){
								domClass.remove(fileMsgNode,"readyMsg");
							}
						}
					}else{
						if(state!=undefined){
							if(state == false){
								domClass.add(fileMsgNode,"readyMsg");
							}
						}
					}
					fileMsgNode.innerHTML = msg;
				}
			}
			function getMaterialFileName(){
				var fileName = "";
				var maFileNode = getMatFileNode();
				var file = maFileNode.files;
				if(maFileNode!=undefined){
					var filePath = "";
					if(file!=undefined){
						if(file.length>0){
							filePath = file[0].name;
						}
					}else{
						filePath = maFileNode.value;
					}
					//ie下获取的是全路径
					var lastsprit = filePath.lastIndexOf("\\");
					if(lastsprit != -1){
						fileName = filePath.substring(lastsprit+1,filePath.lastIndexOf("."))
					}else{
						fileName = filePath.substring(0,filePath.lastIndexOf("."));
					}
					
				}
				return fileName;
			}
			function setFileName(materialName){
				var materialNameNode = dom.byId("materialName");
				if(materialNameNode != undefined){
					domAttr.set(materialNameNode,"value",materialName);
				}
				var maNameNode = getMatNameNode();
				if(maNameNode != undefined){
					domAttr.set(maNameNode,"value",materialName);
				}
			}
			function getParams(){
				var material = new Object();
				var maName = getMatNameNode();
				if(maName != undefined){
					material.maName = maName.value;
				}
				
				var maType = getMatCategoryNode();
				if(maType != undefined){
					material.maType = maType.value;
				}
				
				var maKeywords = getMatKeywordsNode();
				if(maKeywords != undefined){
					material.maKeywords = maKeywords.value;
				}
				var maDescribe = getMatDescribeNode();
				if(maDescribe != undefined){
					material.maDescribe = maDescribe.value;
				}
				return material;
			}
			function updateMaterial(material,formId){
				if(material != undefined && formId != undefined){
					//设置上传按钮不可用
					disableUploadBtn(true);
					materialObj.update(
						formId,
						{
							"name" : material.maName,
							"type" : material.maType,
							"keyInfo" : material.maKeywords,
							"introduction" : material.maDescribe,
							"load" : function(data){
								console.log(data.result.suc);
								//提示用户材质文件的规范
								
								var text = "";
								var type = "";
								if(data.result.suc)
								{
									text = "材质更新成功!";
									type = "success";
									setTimeout(function(){
										Spolo.dialogHide();
									},1000);
								}
								else
								{
									text = "材质更新失败";
									type = "error"
								}
								
								setResult(type,text);
								disableUploadBtn(false);
							},
							"error" : function(err){
								setResult("error","ERROR:" + err);
								disableUploadBtn(false);
							}
						}
					);
				}
				
			}
			//禁用上传材质按钮
			function disableUploadBtn(disable){
				var upMaterialBtnNode = dom.byId("upMaterialBtn");
				if(upMaterialBtnNode != undefined){
					if(disable == true){
						domClass.add(upMaterialBtnNode,"disablebtn");
					}else{
						domClass.remove(upMaterialBtnNode,"disablebtn");
						var handle = on(upMaterialBtnNode,"click",function(evt){
							readyUpload(handle);
						});
					}
					
				}
			}
			//设置表单验证结果
			function setInputState(inputNode,state,type,msg){
				var stateNode,
				    msgNode;
				if(inputNode){
					var nodelist = query(inputNode);
					stateNode = nodelist.closest(".control-group");
					msgNode = nodelist.siblings(".help-inline");
				}
				if(stateNode){
					if(state){
						stateNode.removeClass("error");
					}else{
						stateNode.addClass("error");
					}
				}
				if(msgNode){
					var innerText = "";
					if(msg){
						innerText = msg;
					}else{
						if(type){
							if(type == "require"){
								innerText = "你必须输入一个名称";
							}
						}else{
							innerText = "";
						}
					}
					msgNode.text(innerText);
				}
				
			}
			//上传结果显示
			function setResult(type,text){
				Spolo.notify({
					text : text,
					type : type,
					timeout : 3000
				});
			}
			//格式化时间
			function formatDate(date, fmt){ 
				if(date){
					return locale.format( new Date(date), {selector:"date", datePattern:(fmt)?fmt:"yyyy.MM.d HH:mm:ss" } ); 
				}
			};
		});