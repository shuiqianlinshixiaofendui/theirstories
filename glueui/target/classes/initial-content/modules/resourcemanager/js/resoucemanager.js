require([
	"dojo/on",
	"dojo/ready",
	"dijit/Dialog",
	"dijit/registry",
	"dijit/Menu",
	"dijit/MenuItem",
	"dijit/form/TextBox",
	"resourcemanager/js/explorer",
	"dojo/_base/lang",
	"dojo/dom",
	"dijit/form/Select",
	"dojo/aspect",
	"dojo/_base/array",
	"dijit/form/DropDownButton",
	"dijit/DropDownMenu",
	"dojo/topic"
	],
	function(on, ready, Dialog, registry, Menu, MenuItem, TextBox, Explorer, lang, dom, Select, aspect, array, DropDownButton, DropDownMenu, topic){
		ready(function(){
			var explorer = new Explorer("/content/users/"+Spolo.getUserId());
			
			var refreshMethod = null;
			var refreshNode = null;
			
			var createFolderDlg = new Dialog({
				title : "",
				style : "width : auto; height : auto"
			});
			var textBox = new TextBox({id:'test'});
			textBox.placeAt(createFolderDlg);
			on(textBox, "keyup", function(e){
				var ENTER = 13;
				if(e.keyCode == ENTER)
				{
					var value = this.get("value");
					if(refreshMethod && refreshNode)
						explorer[refreshMethod](refreshNode, value);
					createFolderDlg.hide();
					this.set("value", "");
				}
			});
			
			var menu = new Menu({
				style:"display: none;", 
				targetNodeIds: ["res_tree"], 
				selector: ".dijitTreeNode"
			});
			menu.addChild(new MenuItem({
				label : "创建文件夹",
				onClick: function(evt){
					var treeNode = registry.byNode(this.getParent().currentTarget);
					refreshMethod = "createFolder";
					refreshNode = treeNode;
					createFolderDlg.set("title","创建文件夹");
					createFolderDlg.show();
				}
			}));
			menu.addChild(new MenuItem({
				label : "重命名",
				onClick: function(evt){
					var treeNode = registry.byNode(this.getParent().currentTarget);
					refreshMethod = "updateFolder";
					refreshNode = treeNode;
					createFolderDlg.set("title","重命名");
					createFolderDlg.show();
				}
			}));
			menu.addChild(new MenuItem({
				label : "删除",
				onClick: function(evt){
					var treeNode = registry.byNode(this.getParent().currentTarget);
					explorer.deleteFolder(treeNode);
				}
			}));
			
			var toolbarBtnBack = dom.byId("toolbarBtnBack");
			var toolbarBtnForward = dom.byId("toolbarBtnForward");
			var toolbarCreateFolder = dom.byId("toolbarCreateFolder");
			
			var viewTypeMenu = new DropDownMenu({
				style: "display: none;"
			});
			viewTypeMenu.addChild(new MenuItem({
				label: "缩略图",
				onClick: function(){ 
					explorer.setViewType("Thumbnail");
				}
			}));
			viewTypeMenu.addChild(new MenuItem({
				label: "列表",
				onClick: function(){ 
					explorer.setViewType("normallist");
				}
			}));
			viewTypeMenu.addChild(new MenuItem({
				label: "详细列表",
				onClick: function(){ 
					explorer.setViewType("fulllist");
				}
			}));
			
			var toolbarViewType = new DropDownButton({
				dropDown : viewTypeMenu,
				iconClass : "toolbarViewType"
			});
			toolbarViewType.placeAt("toolbar");
			
			var historyMenu = new DropDownMenu({
				style: "display: none;"
			});
			var toolbarHistory = new DropDownButton({
				dropDown : historyMenu
			});
			toolbarHistory.placeAt("toolbar");
			
			on(toolbarBtnBack, "click", function(){
				try{
					explorer.viewBack();
					var name = explorer.historyCache[explorer.curViewIndex].getName();
					console.log("current view name "+name);
					toolbarHistory.set("label", name);
				}catch(e){
					console.log("error:"+e.stack);
				}
			});
			on(toolbarBtnForward, "click", function(){
				try{
					explorer.viewForward();
					var name = explorer.historyCache[explorer.curViewIndex].getName();
					console.log("current view name "+name);
					toolbarHistory.set("label", name);
				}catch(e){
					console.log("error:"+e.stack);
				}
			});
			on(toolbarCreateFolder, "click", function(){
				try{
					
					if(explorer.historyCache.length)
					{
						var curItem;
						if(explorer.getTree().selectedItem)
						{
							curItem = explorer.getTree().selectedItem;
						}
						else{
							curItem = explorer.historyCache[explorer.curViewIndex];
						}
						var treeNodes = explorer.getTree().getNodesByItem(curItem);
						array.forEach(treeNodes, function(treeNode, index){
							console.log("click:"+curItem.getName());
							console.log("click:"+treeNode.item.getName());
							if(treeNode.item == curItem)
							{
								console.log("toolbarCreateFolder "+treeNode.item.getName());
								refreshMethod = "createFolder";
								refreshNode = treeNode;
								createFolderDlg.set("title","创建文件夹");
								createFolderDlg.show();
							}
						});
					}
				}catch(e){
					console.log("error:"+e.stack);
				}
			});
			
			topic.subscribe("onViewShow", function(history){
				try{
					if(history)
					{
						var cacheLen = explorer.historyCache.length;
						var children = historyMenu.getChildren();
						var menuLen = children.length;
						
						if(menuLen > cacheLen)
						{
							array.forEach(explorer.historyCache, function(cache, index){
								var label = cache.getName();
								children[index].set("label", label);
								console.log("updateHistory "+label);
							});
							
							while(cacheLen < menuLen)
							{
								console.log("removeHistory "+children[cacheLen].label);
								historyMenu.removeChild(children[cacheLen]);
								children[cacheLen].destroy(true);
								cacheLen++;
							}
						}
						else{
							array.forEach(children, function(child, index){
								var label = explorer.historyCache[index].getName();
								child.set("label", label);
								console.log("updateHistory "+label);
							});
							
							while(menuLen < cacheLen)
							{
								var newLabel = explorer.historyCache[menuLen].getName();
								historyMenu.addChild(new MenuItem({
									label: newLabel,
									onClick: function(){ 
										console.log("click History "+this.label);
										explorer.viewTo(this.getIndexInParent());
										toolbarHistory.set("label", this.label);
									}
								}));
								console.log("addHistory "+newLabel);
								menuLen++;
							}
						}
						
						var name = history.getName();
						console.log("current view name "+name);
						toolbarHistory.set("label", name);
					}
				}catch(e){
					console.log("error:"+e.stack);
				}
			}, true);
			
			topic.subscribe("onFolderDelete", function(evt){
				var nodeName = evt.name;
				var nodeParent= evt.parent;
				var children = historyMenu.getChildren();
				array.forEach(children, function(child){
					var label = child.get("label");
					if(label == nodeName)
					{
						historyMenu.removeChild(child);
						child.destroy(true);
					}
				});
				explorer.showView(nodeParent);
			});
		});
	}
);//dojo.declare