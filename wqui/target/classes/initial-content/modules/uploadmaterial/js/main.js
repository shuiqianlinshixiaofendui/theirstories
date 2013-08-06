require([
			"dojo/dom", 
			"dojo/dom-style",
			"dojo/dom-class",
			"dojo/dom-attr",
			"dojo/on",
			"spolo/data/spsession",	
			"spolo/data/folder/materiallib",
			"dojo/ready",
			"dojo/query",
			"dojo/mouse",
			"dijit/registry",
			"dijit/form/Button",
			"dijit/Dialog",
			"widgets/Category/Category",
			"widgets/Mask/Mask"
		],function(dom,domStyle,domClass,domAttr,on,
				spsession_class,materiallib_cls, ready, query,
				mouse,registry,Button,Dialog,Category, Mask){
				
			ready(function(){
			
				var uid = Spolo.getUserId();
				
				// 构造一个 session 对象
				var sessionPath = "/content/users/"+uid+"/scenelib";
				var spsession = new spsession_class(sessionPath);
				
				var varsMap = Spolo.getUrlVars();
				var isGutil = varsMap ['isGutil'];
				if(isGutil == "true"){
					// <script> 跨域
					// http://127.0.0.1:10828/upload?finputid=selectFile
				}
				
				//初始化页面
				initPage();
			});
			function initPage(){
				//预览图
				initPreviewBox();
				//材质
				initMaterial();
				//材质信息
				initMaterialInfo();
				//上传
				initUpload();
				
			}
			function initPreviewBox(){
				var previewPaneNode = registry.byId("previewPane");
				on(previewPaneNode,mouse.enter,function(){
					displaySelectBox(true);
					
				});
				on(previewPaneNode,mouse.leave,function(){
					displaySelectBox(false);
				});
				var previewBoxNode = dom.byId("previewBox");
				
				if(previewBoxNode != undefined){
					var promptNode = dom.byId("filepre");
					
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
							setImg(dom.byId("maPreview"),query(".previewShow")[0],files);
							
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
					dom.byId("maPreview").click();
				});
				var maPreviewNode = dom.byId("maPreview");
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
			//隐藏prompt
			function displayPrompt(promptNode,display){
				if(promptNode != undefined){
					if(display == true){
						domStyle.set(promptNode,"display","block");
					}else{
						domStyle.set(promptNode,"display","none");
					}
				}
			}
			//隐藏按钮
			function displayBtn(btnNode,display){
				if(btnNode != undefined){
					if(display == true){
						domStyle.set(btnNode,"display","inline-block");
					}else{
						domStyle.set(btnNode,"display","none");
					}
				}
			}
			function initMaterial(){
				var toSelectMaterialNode = dom.byId("toSelectMaterial");
				var maFileNode = dom.byId("maFile");
				var fileBoxNode = dom.byId("filePane");
				if(toSelectMaterialNode!=undefined){
					on(toSelectMaterialNode,"click",function(){
						if(maFileNode!=undefined && typeof(maFileNode.click) == "function"){
							dom.byId("maFile").click();
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
						domStyle.set(fileBoxNode,"border","1px solid #FFFFFF");
					});
					on(fileBoxNode,"drop",function(event){
						event.preventDefault();
						domStyle.set(fileBoxNode,"border","1px solid #FFFFFF");
						if (event.dataTransfer) {
							var files = event.dataTransfer.files; // FileList object.
							setFile(dom.byId("maFile"),files);
							
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
			function connectField(userWidget,submitWidget){
				if(userWidget != undefined){
					on(userWidget,"keyup",function(){
						if(submitWidget != undefined){
							var widgetValue = domAttr.get(userWidget,"value");
							domAttr.set(submitWidget,"value",widgetValue);
						}
					});
				}
			}
			
			function initMaterialName(){
				var materialNameNode = dom.byId("materialName");
				var maNameNode = dom.byId("maName");
				connectField(materialNameNode,maNameNode);
			}
			function initMaterialCategory(){
				var materialCategoryNode = dom.byId("materialCategory");
				var maCategoryNode = dom.byId("maCategory");
				if(materialCategoryNode != undefined){
					on(materialCategoryNode,"click",function(){
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
				var materialKeywordsNode = dom.byId("materialKeywords");
				var maKeywordsNode = dom.byId("maKeywords");
				connectField(materialKeywordsNode,maKeywordsNode);
			}
			function initMaterialDescribe(){
				var materialDescribeNode = dom.byId("materialDescribe");
				var maDescribeNode = dom.byId("maDescribe");
				connectField(materialDescribeNode,maDescribeNode);
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
					var formId = "uploadMaterial";
					uploadMaterial(material,formId);
					//alert(formId);
				}
			}
			function validateForm(){
				var isvalidate = true;
				
				var isPreviewValid = validatePreview();
				if(isPreviewValid != undefined){
					if(isPreviewValid == false){
						previewValidFaild();
						isvalidate = false;
					}
					
				}
				//检验材质文件
				var isFileValid = validateMaterialFile();
				if(isFileValid != undefined){
					if(isFileValid == false){
						//提示用户材质文件的规范
						fileValidFaild();
						isvalidate = false;
					}
				}
				//检验材质名称
				var isNameValid = validateMaterialName();
				if(isNameValid!=undefined){
					if(isNameValid == false){
						//让材质名称输入框获取焦点
						var materialNameNode = registry.byId("materialName");
						if(materialNameNode != undefined){
							//materialNameNode.validate(true);
							materialNameNode.focus();
							materialNameNode.set("state","Error");
							materialNameNode.displayMessage(materialNameNode.get("missingMessage"));
							isvalidate = false;
						}
					}
				}
				//检验材质分类
				/* var isCategoryValid = validateMaterialCategory();
				if(isCategoryValid != undefined){
					if(isCategoryValid == false){
						//让材质名称输入框获取焦点
						var materialCategoryNode = dom.byId("materialCategory");
						if(materialCategoryNode != undefined){
							//提示用户材质文件的规范
							categoryValidFaild();
							isvalidate = false;
						}
					}
				} */
				
				return isvalidate;
			}
			function validateMaterialFile(){
				var isFileValidate = false;
				var maFileNode = dom.byId("maFile");
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
				var maNameNode = dom.byId("maName");
				var maName = domAttr.get(maNameNode,"value");
				if(maNameNode==undefined || maName==undefined || maName==""){
					isNameValidate = false;
				}
				return isNameValidate;
			}
			function validateMaterialNameNull(){
				var isNameNull = false;
				var maNameNode = dom.byId("maName");
				var maName = domAttr.get(maNameNode,"value");
				if(maNameNode==undefined || maName==undefined || maName==""){
					isNameNull = true;
				}
				return isNameNull;
			}
			function validateMaterialCategory(){
				var isCategoryValidate = true;
				var maCategoryNode = dom.byId("maCategory");
				var maCategory = domAttr.get(maCategoryNode,"value");
				if(maCategoryNode==undefined || maCategory==undefined || maCategory==""){
					isCategoryValidate = false;
				}
				return isCategoryValidate;
			}
			function validatePreview(){
				var isPreviewValid = false;
				var maPreviewNode = dom.byId("maPreview");
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
				var materialPreviewNode = dom.byId("previewShow");
				var maPreviewNode = dom.byId("maPreview");
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
				var materialCategoryNode = dom.byId("materialCategory");
				var maCategoryNode = dom.byId("maCategory");
				if(materialCategoryNode != undefined){
					materialCategoryNode.innerHTML = categoryName;
				}
				if(maCategoryNode != undefined){
					domAttr.set(maCategoryNode,"value",category);
				}
				
				
			}
			function previewValidSucc(){
				var previewShowNode = query(".previewShow");
				var maPreviewNode = dom.byId("maPreview");
				if(previewShowNode!=undefined && maPreviewNode != undefined){
					setImg(maPreviewNode,previewShowNode[0]);
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
				var maFileNode = dom.byId("maFile");
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
				var maFileNode = dom.byId("maFile");
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
				var maNameNode = dom.byId("maName");
				if(maNameNode != undefined){
					domAttr.set(maNameNode,"value",materialName);
				}
			}
			function getParams(){
				var material = new Object();
				var maName = dom.byId("maName");
				if(maName != undefined){
					material.maName = maName.value;
				}
				
				var maType = dom.byId("maCategory");
				if(maType != undefined){
					material.maType = maType.value;
				}
				
				var maKeywords = dom.byId("maKeywords");
				if(maKeywords != undefined){
					material.maKeywords = maKeywords.value;
				}
				var maDescribe = dom.byId("maDescribe");
				if(maDescribe != undefined){
					material.maDescribe = maDescribe.value;
				}
				return material;
			}
			function uploadMaterial(material,formId){
				if(material != undefined && formId != undefined){
					//设置上传按钮不可用
					disableUploadBtn(true);
					Mask.show();
					materiallib_cls.createMaterial(
						formId,
						{
							"name" : material.maName,
							"type" : material.maType,
							"keyInfo" : material.maKeywords,
							"introduction" : material.maDescribe,
							"load" : function(data){
								console.log(data.result.suc);
								//提示用户材质文件的规范
								Mask.hide();
								
								var text = "";
								var type = "";
								if(data.result.suc)
								{
									text = "材质上传成功!";
									type = "success";
								}
								else
								{
									text = "材质上传失败";
									type = "error"
								}
								
								setResult(type,text);
								disableUploadBtn(false);
							},
							"error" : function(err){
								setResult("error","没有上传材质权限！请联系管理员！！");
								Mask.hide();
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
			//上传结果显示
			function setResult(type,text){
				/* var resultinfoNode = dom.byId("resultinfo");
				if(resultinfoNode){
					resultinfoNode.innerHTML = innerHtml;
					domStyle.set(resultinfoNode,"color",color);
				} */
				Spolo.notify({
					text : text,
					type : type,
					timeout : 3000
				});
			}
			
		});