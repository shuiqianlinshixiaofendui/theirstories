require(["dijit/Dialog","dijit/form/Button","widgets/ModelLib/ModelLib","dojo/parser","dojo/ready","dojo/query" ,"dojo/dom","dojo/dom-construct","dojo/on","dojo/_base/array","dojo/dom-attr","dojo/json","widgets/Mask/Mask","dojo/cookie"], function(Dialog,Button,ModelLib,parser,ready,query,dom,domConstruct,on,arrayUtil,domAttr,jsonUtil,Mask,cookie){
	//获取父级页面的 scene 对象
	this.scene = this.parent.scene;
	var scene = this.scene;
	var iframe = this.parent;
	//单选接收的事件名称
	var radioEvent = "onListItemSelect";
	var publicPath = "/content/modellib";
	var uid = Spolo.getUserId();
	var privateLibPath = "/content/users/"+uid+"/modellib";
	//将要被替换的模型
	var oldModel = getParameter("insteadNode");
	if(oldModel!=""){
		oldModel = jsonUtil.parse(oldModel);
	}
	//确认替换模型的对话框
	var ifInsteadDialog;
	
	//根据参数名，获取值
	function getParameter(param){
		var value = "";
		var paramSearch = param+"=";
		var paramStr = location.search;
		var decode_paramStr = decodeURIComponent(paramStr).substring(1);
		var paramsArr = new Array();
		if(decode_paramStr.search(/&/)!=-1){
			paramsArr = decode_paramStr.split("&");
		}
		if(paramsArr[0]){
			arrayUtil.forEach(paramsArr,function(item,i){
				value = item.substr(item.indexOf(param+"=")+paramSearch.length);
			});
		}else{
			value = decode_paramStr.substr(decode_paramStr.indexOf(param+"=")+paramSearch.length);
		}
		return value;
		
	}
	
	//初始化是否替换模型窗口
	function initIfInsteadDialog(data,modelLib){
		if(ifInsteadDialog==undefined){
			var content = domConstruct.create("div",{
				innerHTML : "<label>确认替换？</label>"+
				            "<div>"+
								"<button id=\"sure\">确定</button>"+
								"<button id=\"cancel\">取消</button>"+
							"</div>",
			});
			
			ifInsteadDialog = new Dialog({
				title: "是否替换",
				content: content,
				style: "width: 200px;position:relavite;top:20px;",
				onExecute: function(){
					insteadModel(data,modelLib);
				},
				onCancel: function(){
					this.hide();
				}
			});
			
			var sureBtn = new Button({
				label:"确定",
				onClick:function(){
					ifInsteadDialog.onExecute();
				}
			},"sure");
			var cancelBtn = new Button({
				label:"取消",
				onClick:function(){
					ifInsteadDialog.onCancel();
				}
			},"cancel");
		}
		
	}
	ready(function(){
		//初始化公共模型库
		initPublicModelLib("publicModelLibs",publicPath);
		//初始化个人模型库
		initPrivateModelLib("privateModelLibs",privateLibPath);
	});
	//初始化公共模型库
	function initPublicModelLib(domId,modelPath){
		//公共模型库
		var publicCurrentPage = cookie("publicCurrentPage");
		if(!publicCurrentPage){
			publicCurrentPage = 1;
		}
		
		var json = {
			path: modelPath,
			limit: 18,
			insteadModel:true,
			hasCategory:true,
			selectedModules:true,
			isClickImg:true,
			showEditOrPreview:true,
			showAddItemsModelLib:false,
			currentPage:publicCurrentPage,
			isInsteadModel:true,
			oldModel:oldModel,
			isRadio:true,
			queryString: "[@sling:resourceType='model']",
			showLookPreview:false
		}
		initModelLib(domId,json);
	}
	//初始化个人模型库
	function initPrivateModelLib(domId,modelPath){
		var privateCurrentPage = cookie("privateCurrentPage");
		if(!privateCurrentPage){
			privateCurrentPage = 1;
		}
		var json = {
			path: modelPath,
			limit: 18,
			insteadModel:true,
			hasCategory:true,
			selectedModules:true,
			isClickImg:false,
			showEditOrPreview:true,
			showAddItemsModelLib:true,
			currentPage:privateCurrentPage,
			isInsteadModel:true,
			oldModel:oldModel,
			isRadio:true,
			queryString: "[@sling:resourceType='model']"
		}
		initModelLib(domId,json);
	}
	//替换模型
	function insteadModel(data,modelLib){
		//遮罩
		Mask.show();
		//获取被替换的节点对象
		var nodeStr = getParameter("insteadNode");
		var node = jsonUtil.parse(nodeStr);
		//通过node和itemArray找到原模型
		var old_Item = getOldItem(node,scene.itemArray);
		
		var new_Item = getNewItem(data,modelLib.getJsonData());
		// 获取此scene 中要被替换的Item
		scene.replaceItem(old_Item, new_Item);
		// 保存操作
		scene.saveItems(
			function(suc){
				Mask.hide();
				//console.log(suc);
				//刷新数据
				//关闭对话框
				iframe.hideDialog("dialogReplaceItem");
				iframe.refreshEditItems();
			},
			function(e){
				Mask.hide();
				Spolo.notify({
					"text" : "更新失败！",
					"type" : "error",
					"timeout" : 1000
				});
				insteadDialog.hide();
			}
		);
		
	}
	//初始化模型库
	function initModelLib(domId,json){
		var modelLib = new ModelLib(json);
		modelLib.placeAt(domId);
		//默认打开选择模式
		//modelLib.openSelect();
		//监听选中模型的事件
		on(modelLib.listWidget,radioEvent,function(data){
			//初始化确认对话框
			initIfInsteadDialog(data,modelLib);
			//弹出替换模型确认对话框
			ifInsteadDialog.show();
			
		})
	}
	
	function getOldItem(node,itemArray){
		var oldItem;
		var resourceName;
		arrayUtil.forEach(itemArray,function(item,i){
			if(node["name"]==item["data"]["name"]){
				oldItem = item;
			}
		});
		return oldItem;
	}
	function getNewItem(node,itemArray){
		var newItem;
		if(node){
			if(typeof(node)=="string"){
				
				for(var index in itemArray["data"]){
					if(typeof(itemArray["data"][index])=="object"){
						if(index==node){
							var ID = itemArray["data"][index]["resourceName"];
							var name = itemArray["data"][index]["resourceName"];
							newItem = scene.createItem("MESH", {"ID" : ID , "name" : name, "type" : "MESH", "referModel" : node}); 
						}					
					}
				}
			}else if(typeof(node)=="object"){
				for(var pro in node){
					if(typeof(node[pro]) == "object"){
						var model = node[pro];
						newItem = scene.createItem("MESH", {"ID" : model["ID"] , "name" : model["resourceName"], "type" : "MESH", "referModel" : model["url"]}); 
					}
				}
			}
		}
		
		
		return newItem;
	}

    
})