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

define("widgets/CategoryManager/CategoryManager",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dijit/layout/StackContainer",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/Evented",
		"dojo/json",
		"dijit/Dialog",
		"spolo/data/folder",
		"spolo/data/model",
		"dijit/form/TextBox",
		"dijit/form/Button",
		"dijit/tree/ObjectStoreModel",
		"dijit/Tree",
		"dijit/Menu",
		"dijit/tree/dndSource",
		"dijit/MenuItem",
		"dijit/registry",
		"dojo/aspect",
		"dojo/dom-construct",
		"dojo/_base/array",
		"dijit/form/RadioButton"
	],function(
		declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, StackContainer, template, 
		query, on, dom, Evented, JSON,
		Dialog, folder_cls, model_cls, TextBox, Button, ObjectStoreModel, Tree,
		Menu, dndSource, MenuItem, registry, aspect, domConstruct, arrayUtil, RadioButton
	){
		var ret = declare("widgets/CategoryManager/CategoryManager",
				[ StackContainer, _WidgetBase, _WidgetsInTemplateMixin, _TemplatedMixin, Evented ],{
			
			// 指定template
			templateString: template,
			
			constructor:function(json){
				this.json = json;
			},
			postCreate: function(){
				this.inherited(arguments);
				var dthis = this;
				var tree = new Tree({
					model : this.json["model"],
					persist : false,
					showRoot : true,
					dndController : dndSource,
					style : {overflow:'visible'}
				});
				tree.placeAt(dthis.ListNode);
				tree.startup();
				
				on(tree, "click", function(){
					var parentFolder = this.lastFocused.item;
					var pNode = this.lastFocused;
					// 匹配pNode.domNode.innerText多出的两个空格，也可以采取去掉空格的方法.
					var flag = "  " + pNode.label
					if(pNode.domNode.innerText == flag)
					{
						this.lastFocused.item.getChildren(
							function(childFolder){
								if(childFolder.length == 0)
								{
									return false;
								}
								for(var index = 0; index < childFolder.length; index ++)
								{
									dthis.model.newItem(childFolder[index], pNode);
								}
							},
							function(){
							}
						)
					}
				});
				
				aspect.after(this.model, "newItem", function(childItem, parentItem){
					newNode = tree._createTreeNode({
						item: childItem,
						tree: tree,
						isExpandable: this.mayHaveChildren(childItem),
						label: tree.getLabel(childItem),
						tooltip: tree.getTooltip(childItem),
						ownerDocument: tree.ownerDocument,
						dir: tree.dir,
						lang: tree.lang,
						textDir: tree.textDir,
						indent: parentItem.indent + 1
					});
					var id = this.getIdentity(childItem);
					tree._itemNodesMap[id] = [newNode];
					parentItem.addChild(newNode);
					if(!parentItem.isExpanded)
						parentItem.expand();
				}, true);
				var menu = new Menu({
					style:"display: none;", 
					targetNodeIds: [dthis.ListNode], 
					selector: ".dijitTreeNode"
				});
				var arrayEvents = new Array();
				for(var event in dthis.json["menu"])
				{
					arrayEvents.push(event);
				}
				
				arrayUtil.forEach(arrayEvents, function(event)
				{
					var eventObj = dthis.json["menu"][event];
					menu.addChild(new MenuItem({
						label : eventObj["value"],
						onClick: function(){
							var createFolderDlg = dthis.initDialog(eventObj["textbox"], event, this);
							createFolderDlg.set("title", eventObj["value"]);
							createFolderDlg.show();
						}
					}));
				});
			},
			
			initDialog : function(textboxFlag, event, menu)
			{
				var dthis = this;
				var array = new Array();
				array.push(menu);
				var pNode = registry.byNode(menu.getParent().currentTarget);
				var parentFolder = pNode.item;
				// alert(parentFolder.getName());
				// alert(parentFolder.getRadio());
				if(event == "createFolder"){
					var url = parentFolder.getURI();
					var urlArray = url.split("/");
					var newURL = "";
					for(var index = 1; index < urlArray.length-1; index ++){
						newURL += ("/" + urlArray[index]);
					}
					var folder = new folder_cls(newURL);
					folder.getRoot(
						function(){
							if(folder.getRadio() == "false"){
								Spolo.notify({
									text : "当前节点为复选型分类不能创建子节点！",
									type : "error",
									timeout : 1000
								})
								closeDialog();
								return ;
							}
						},
						function(){
						}
					);
				}
				function closeDialog(){
					buttonCancel.destroy();
					buttonSure.destroy();
					registry.byId("firstname").destroy();
					registry.byId("radioOne").destroy();
					registry.byId("radioTwo").destroy();
					createFolderDlg.destroy();
				}
				
				var content = "";
				if(!textboxFlag){
					content = "<center><button id='buttonSure' type='button'></button>" +
								"<button id='buttonCancel' type='button'></button></center>";
				}else{
					content = "<center><input type='text' name='firstname' value=''" +
								"data-dojo-type='dijit/form/TextBox'" +
								"data-dojo-props='trim:true' id='firstname' /><br /><br />" +
								"<div id='cRadio'><input type='radio' data-dojo-type='dijit/form/RadioButton' " + 
								"name='radio' id='radioOne' checked value='isradio'/> <label for='radioOne'>单选</label>" +
								"<input type='radio' data-dojo-type='dijit/form/RadioButton' " +
								"name='radio' id='radioTwo' value='isnotradio'/> <label for='radioTwo'>复选</label><br /><br /></div>" +
								"<button id='buttonSure' type='button'></button>" +
								"<button id='buttonCancel' type='button'></button></center>";
				}
				
				var createFolderDlg = new Dialog({
					title : "",
					style : "width : auto; height : auto",
					content : content
				});
				
				createFolderDlg.on("hide",function(){
					closeDialog();
				});
				
				if(textboxFlag){
					if(	parentFolder.getURI() != "/content/modellibcategory"
						&& parentFolder.getURI() != "/content/previewcategory"
						&& parentFolder.getURI() != "/content/roomlibcategory"
						&& parentFolder.getURI() != "/content/materiallibcategory"){
						if(event != "renameFolder"){
							dom.byId("cRadio").style["display"] = "none";
						}
						if(parentFolder.getRadio() == undefined){
							dom.byId("cRadio").style["display"] = "none";
						}
					}else{
						if(event == "renameFolder"){
							dom.byId("cRadio").style["display"] = "none";
						}
					}
					if(event == "renameFolder"){
						registry.byId("firstname").set("value", parentFolder.getName());
						if(parentFolder.getRadio() == "false"){
							registry.byId("radioOne").set("checked", false);
							registry.byId("radioTwo").set("checked", true);
						}
					}
					on(registry.byId("firstname"), "keyup", function(e){
						var ENTER = 13;
						if(e.keyCode == ENTER)
						{
							var textboxValue = this.get("value");
							if(!textboxValue){
								Spolo.notify({
									text:"请输入分类的名称",
									type:"error",
									timeout:1000
								})
								return ;
							}
							array.push(textboxValue);
							if(dom.byId("cRadio").style["display"] != "none"){
								if(registry.byId("radioOne").checked){
									array.push("true");
								}else{
									array.push("false");
								}
							}
							dthis.emit(event, array);
							createFolderDlg.hide();
							this.set("value", "");
						}
					});
				}
				
				var buttonSure = new Button({
					label : " 确定 ",
					onClick : function(){
						if(textboxFlag){
							var textboxValue = registry.byId("firstname").get("value");
							if(!textboxValue){
								Spolo.notify({
									text:"请输入分类的名称",
									type:"error",
									timeout:1000
								})
								return ;
							}
							array.push(textboxValue);
							if(dom.byId("cRadio").style["display"] != "none"){
								if(registry.byId("radioOne").checked){
									array.push("true");
								}else{
									array.push("false");
								}
							}
						}
						dthis.emit(event, array);
						createFolderDlg.hide();
					}
				},"buttonSure");
				
				var buttonCancel = new Button({
					label : " 取消 ",
					onClick : function(){
						createFolderDlg.hide();
					}
				},"buttonCancel");
				
				return createFolderDlg;
			}
		});
		
		return ret;
	});