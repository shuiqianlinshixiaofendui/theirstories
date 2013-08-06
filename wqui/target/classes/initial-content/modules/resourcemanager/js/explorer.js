define(
	"resourcemanager/js/explorer",
	[
		"spolo/data/folder",
		"dijit/Tree",
		"dojo/ready",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/dom",
		"dojo/aspect",
		"dojo/_base/array",
		"dojo/topic",
		"dijit/layout/ContentPane",
		"dijit/layout/BorderContainer",
		"dijit/tree/dndSource",
		"dojo/dom-geometry"
	],
	function(Folder, Tree, ready, on, lang, domConstruct, dom, aspect, array, topic, ContentPane, BorderContainer, dndSource, domGeometry){
		var explorer = dojo.declare("resourcemanager/js/explorer",[],{
			/*
			* @constructor TODO:model应该单独写成一个模块
			*/
			constructor : function(path){
				var _this = this;
				this.model = {
					getIdentity : function(folder){
						//console.log("[getIdentity] folder getURI:"+folder.getURI());
						return folder.getURI();
					},
					mayHaveChildren : function(folder){
						//console.log("[mayHaveChildren] folder mayHaveChildren:"+folder.mayHaveChildren());
						return folder.mayHaveChildren();
					},
					getChildren : function(folder, onComplete, onError){
						//console.log("[getChildren] folder getChildren:"+folder.getName());
						folder.getChildren(onComplete, onError);
					},
					getRoot : function(onItem, onError){
						var folder = new Folder(path);
						//console.log("[getChildren] folder getRoot:"+folder.getName());
						_this.rootItem = folder;
						folder.getRoot(onItem, onError);
					},
					getLabel : function(folder){
						//console.log("[getLabel] folder getName:"+folder.getName());
						return folder.getName();
					},
					newItem : function(args, parent, insertIndex, before){
						console.log("newItem");
					},
					isItem : function(something){
						return true;
					},
					pasteItem : function(childItem, oldParentItem, newParentItem, bCopy, insertIndex, before){
						console.log("pasteItem");
						//需要folder支持
						if(!bCopy)
						{
							//剪切+粘贴
						}
					}
				};

				var tree = new Tree({
					model : this.model,
					persist : false,
					showRoot : true,
					dndController : dndSource,
					style : {overflow:'visible'}
				});
				tree.placeAt("res_tree");
				tree.startup();
				
				on(tree, "click", lang.hitch(this, this.showView));
				on(tree, "load", function(){
					_this.showView(_this.rootItem);
				});
				
				this.getTree = function(){
					return tree;
				}
				aspect.after(this.model, "newItem", function(childItem, parentItem){
					try{
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
					}catch(e){
						console.log("error:"+e.stack);
					}
				}, true);
			},
			/*
			遵守folder规范的model
			*/
			model : null,
			/*
			获取左侧的tree object
			*/
			getTree : null,
			/*
			explorer_view中的视图缓存
			*/
			viewList : {},
			/*
			将视图浏览历史缓存到historyCache中
			*/
			historyCache : [],
			/*
			当前视图在historyCache中的索引
			*/
			curViewIndex : -1,
			/*
			显示historyCache中上一个视图
			*/
			viewBack : function(){
				if(this.curViewIndex > 0)
				{
					var history = this.historyCache[this.curViewIndex - 1];
					console.log("explorer viewBack "+history.getName());
					this.createViews(history.children);
					this.curViewIndex--;
				}
			},
			/*
			显示historyCache中下一个视图
			*/
			viewForward : function(){
				if((this.curViewIndex + 1) < this.historyCache.length)
				{
					var history = this.historyCache[this.curViewIndex + 1];
					console.log("explorer viewForward "+history.getName());
					this.createViews(history.children);
					this.curViewIndex++;
				}
			},
			/*
			显示historyCache中index所在的视图
			*/
			viewTo : function(index){
				var history = this.historyCache[index];
				this.createViews(history.children);
				this.curViewIndex = index;
			},
			/*
			视图显示的类型：
			1、缩略图(默认) //Thumbnail
			2、一般列表 //normallist
			3、详细列表 //fulllist
			*/
			viewType : "Thumbnail",
			/*
			设置显示类型的接口
			type:string
			*/
			setViewType : function(type){
				this.viewType = type;
				var history = this.historyCache[this.curViewIndex];
				this.createViews(history.children);
			},
			/*
			检查当前视图显示的类型，并调用相应的创建视图的方法
			item:folder
			*/
			checkViewType : function(item){
				var updateViewMethod = null;
				console.log("[checkViewType] type :"+this.viewType);
				
				if(this.viewType != "fulllist" && this.fullListContainer)
				{
					console.log("[checkViewType] fullListContainer :"+this.fullListContainer);
					this.fullListContainer.destroyDescendants(false);
					this.fullListContainer.destroy(false);
					this.fullListContainer = null;
				}
				switch(this.viewType){
					case "Thumbnail" :
						updateViewMethod = "createThumbnailView";
						break;
					case "normallist" :
						updateViewMethod = "createNormalListView";
						break;
					case "fulllist" :
						updateViewMethod = "createFullListView";
						break;
					default :
						updateViewMethod = "createThumbnailView";
				}

				if(Object.prototype.toString.call(item) === '[object Array]')
				{
					array.forEach(item, function(child){
						this[updateViewMethod](child);
					}, this);
				}
				else
				{
					this[updateViewMethod](item);
				}
			},
			/*
			销毁explorer_view中node节点对应的视图
			node:treeNode
			*/
			destorySingView : function(node){
				switch(this.viewType){
					case "fulllist" :
						if(this.historyCache.length && this.historyCache[this.curViewIndex] == node.item.parent)
						{
							var name = node.get("label");
							array.forEach(this.viewList[name], function(view){
								domConstruct.destroy(view);
							});
						}
						node.destroy();
						break;
					case "Thumbnail" :
					case "normallist" :
					default :
						if(this.historyCache.length && this.historyCache[this.curViewIndex] == node.item.parent)
						{
							var name = node.get("label");
							domConstruct.destroy(this.viewList[name]);
						}
						node.destroy();
				}
			},
			/*
			
			*/
			createThumbnailView : function(item){
				var name = item.getName();
				var explorer_view_div = domConstruct.create(
					"div", 
					{
						style : "width:150px; height:150px; border:1px; border-style:solid;border-color:black; float:left; margin:2px;"
					}, 
					"explorer_view"
				);
				this.viewList[name] = explorer_view_div;
				var _this = this;
				on(explorer_view_div, "dblclick", lang.hitch(item, function(){
					console.log("dblclick:"+this.getName());
					_this.showView(this);
				}));
				var explorer_view_img_div = domConstruct.create(
					"div", 
					{
						style : "width:130px; height:130px; margin:0px 10px;"
					}, 
					explorer_view_div
				);
				domConstruct.create(
					"img",
					{
						src : "/image/nopreview.jpg",
						width : "130px",
						height : "130px"
					},
					explorer_view_img_div
				);
				domConstruct.create(
					"label",
					{
						innerHTML : item.getName(),
						id : "view_text_" + item.getName()
					},
					explorer_view_img_div
				);
			},
			/*
			
			*/
			createNormalListView : function(item){
				try{
				var name = item.getName();
				var explorer_view_div = domConstruct.create(
					"div", 
					{
						style : "width:200px; height:15px; margin:2px;"
					}, 
					"explorer_view"
				);
				this.viewList[name] = explorer_view_div;
				var _this = this;
				on(explorer_view_div, "dblclick", lang.hitch(item, function(){
					console.log("dblclick:"+this.getName());
					_this.showView(this);
				}));
				//暂时先使用folderClosed.gif
				domConstruct.create(
					"img",
					{
						src : "/libs/dijit/themes/tundra/images/folderClosed.gif",
						style : "width:14px; height:14px; float:left;"
					},
					explorer_view_div
				);
				domConstruct.create(
					"label",
					{
						innerHTML : item.getName(),
						id : "view_text_" + item.getName()
					},
					explorer_view_div
				);
				}catch(e){
					console.log(e.stack);
				}
			},
			/*
			
			*/
			fullListContainer : null,
			createFullListView : function(item){
				if(!this.fullListContainer)
				{
					var bc = new BorderContainer({
						style: "height: 100%; width: 70%; margin : 0px; padding : 0px;",
						liveSplitters : true,
						gutters : false
					});
					this.fullListContainer = bc;
					var topPane = new ContentPane({
						region: "top", 
						style: "height: 20px; margin : 0px; padding : 0px;",
						splitter : false
					});
					var centerPane = new ContentPane({
						region: "center", 
						style: "height: 95%; margin : 0px; padding : 0px;",
						splitter : false
					});
					
					var topBc = new BorderContainer({
						style: "height: 100%; margin : 0px; padding : 0px;",
						liveSplitters : false,
						gutters : true
					});
					var topPaneLeft = new ContentPane({
						region : "left", 
						content : "名称", 
						style: "border-right:0px; width: 40%; margin : 0px; padding : 0px; background-color : rgb(195, 214, 223);", 
						splitter : true
					});
					var topPaneCenter = new ContentPane({
						region : "center", 
						content : "类型", 
						style: "width: 30%; margin : 0px; padding : 0px;background-color : rgb(195, 214, 223);", 
						splitter : true
					});
					var topPaneRight = new ContentPane({
						region : "right", 
						content : "大小", 
						style: "border-left:0px; width: 30%; margin : 0px; padding : 0px;background-color : rgb(195, 214, 223);", 
						splitter : true
					});
					topBc.addChild(topPaneLeft);
					topBc.addChild(topPaneCenter);
					topBc.addChild(topPaneRight);
					topPane.addChild(topBc);
					
					var centerBc = new BorderContainer({
						style: "height: 100%; margin : 0px; padding : 0px;",
						liveSplitters : true,
						gutters : false
					});
					var centerPaneLeft = new ContentPane({
						region : "left", 
						style: "width: 40%; margin : 0px; padding : 0px;", 
						splitter : false,
						id : "centerPaneLeft"
					});
					var centerPaneCenter = new ContentPane({
						region : "center", 
						style: "width: 30%; margin : 0px; padding : 0px;", 
						splitter : false,
						id : "centerPaneCenter"
					});
					var centerPaneRight = new ContentPane({
						region : "right",  
						style: "width: 30%; margin : 0px; padding : 0px;", 
						splitter : false,
						id : "centerPaneRight"
					});
					centerBc.addChild(centerPaneLeft);
					centerBc.addChild(centerPaneCenter);
					centerBc.addChild(centerPaneRight);
					centerPane.addChild(centerBc);
					
					bc.addChild(topPane);
					bc.addChild(centerPane);
					bc.placeAt("explorer_view");
					bc.startup();
					bc.resize();
					//getSplitter may be removed in 2.0
					topBc.getSplitter("left").on("blur", function(){
						var tlPanelPos = domGeometry.position(topPaneLeft.domNode, false);
						var tcPanelPos = domGeometry.position(topPaneCenter.domNode, false);
						centerPaneLeft.set("style", "width:"+tlPanelPos.w+"px;");
						centerPaneCenter.set("style", "left:"+tcPanelPos.x+"px; width:"+tcPanelPos.w+"px");
						centerBc.resize();
					});
					topBc.getSplitter("left").on("mouseUp", function(){
						this.emit("blur");
						/*
						由于mouseUp中获取this.l的值总是旧的，因此发出blur事件，在blur订阅中处理相关事情
						console.log("mouseUp"+this.l);
						*/
					});
					topBc.getSplitter("right").on("blur", function(){
						var trPanelPos = domGeometry.position(topPaneRight.domNode, false);
						var tcPanelPos = domGeometry.position(topPaneCenter.domNode, false);
						centerPaneRight.set("style", "left:"+trPanelPos.x+"px; width:"+trPanelPos.w+"px");
						centerPaneCenter.set("style", "left:"+tcPanelPos.x+"px; width:"+tcPanelPos.w+"px");
						centerBc.resize();
					});
					topBc.getSplitter("right").on("mouseUp", function(){
						this.emit("blur");
					});
				}

				var array = [];
				var name = item.getName();
				var explorer_view_div = domConstruct.create(
					"label",
					{
						style : "width:100%; display : block; overflow : hidden;text-indent : 3px;",
						innerHTML : item.getName(),
						id : "view_text_" + name
					},
					"centerPaneLeft"
				);
				array.push(explorer_view_div);
				var _this = this;
				on(explorer_view_div, "dblclick", lang.hitch(item, function(){
					console.log("dblclick:"+this.getName());
					_this.showView(this);
				}));
				var dataLabel = domConstruct.create(
					"label", 
					{
						style : "width:100%; display : block; text-indent : 4px;",
						innerHTML : "type"
					}, 
					"centerPaneCenter"
				);
				array.push(dataLabel);
				var typeLabel = domConstruct.create(
					"label", 
					{
						style : "width:100%; display : block;text-indent : 3px;",
						innerHTML : "size"
					}, 
					"centerPaneRight"
				);
				array.push(typeLabel);
				this.viewList[name] = array;
			},
			/*
			销毁当前视图并创建新的视图
			如果传入history，会将当前创建的视图缓存到historyCache中
			*/
			createViews : function(children, history){
				if(!children.length)
					return false;
				
				if(history)
				{
					console.log("explorer set history "+history.getName());
					//console.log("pre view "+this.curViewIndex);
					var curView = this.curViewIndex + 1;
					if(this.historyCache.length > curView)
					{
						var clearCacheCount = this.historyCache.length - curView;
						console.log("explorer clear history cache "+clearCacheCount);
						this.historyCache.splice(this.curViewIndex+1, clearCacheCount);
					}
					this.historyCache.push(history);
					this.curViewIndex++;
					//console.log("cur view "+this.curViewIndex);
				}
				
				for(var name in this.viewList)
				{
					if(Object.prototype.toString.call(this.viewList[name]) === '[object Array]')
					{
						console.log("[createViews] is array");
						array.forEach(this.viewList[name], function(obj){
							domConstruct.destroy(obj);
						});
						delete this.viewList[name];
					}
					else
					{
						domConstruct.destroy(this.viewList[name]);
						delete this.viewList[name];
					}
				}
				
				this.checkViewType(children);
				return true;
			},
			showView : function(item, node, evt)
			{
				var _this = this;
				
				var type = item.getType();
				console.log("type : " + type + "; uri : " + item.getURI());
				if(type == "scene")
				{
					window.location.href = "../scenedetail/index.html?path=" + item.getURI();
					return ;
				}
				else if(type == "model")
				{
					window.location.href = "../modeldetail/index.html?path=" + item.getURI();
					return ;
				}
				else if(type == "material")
				{
					window.location.href = "../materialedit/index.html?path=" + item.getURI();
					return ;
				}
				
				if(item.children.length)
				{
					var ret = _this.createViews(item.children, item);
					if(ret)
						topic.publish("onViewShow", item);
				}
				else{
					item.getChildren(
						function(children){
							var ret = _this.createViews(children, item);
							if(ret)
								topic.publish("onViewShow", item);
						},
						function(error){
							console.log("error:"+error);
						}
					);
				}
			},
			/*
			创建新文件夹
			*/
			createFolder : function(node, value){
				if(node && value != "")
				{
					var _this = this;
					var parentFolder = node.item;
					var pNode = node;
					var json = {
						"resourceName" : value,
						"jcr:primaryType" : "sling:Folder"
					}
					node.item.create(
						json,
						function(childFolder){
							console.log("创建文件夹 : "+childFolder.getName());
							_this.model.newItem(childFolder, pNode);
							if(_this.historyCache.length && _this.historyCache[_this.curViewIndex] == pNode.item)
							{
								_this.checkViewType(childFolder);
							}
						},
						function(error){
							console.log("error:"+error);
						}
					);
				}
			},
			/*
			文件夹重命名
			*/
			updateFolder : function(node, value){
				if(node && value != "")
				{
					var _this = this;
					node.item.rename(
						value,
						function(newFolder){
							try{
								console.log("重命名 : "+value);
								if(_this.historyCache.length && _this.historyCache[_this.curViewIndex] == node.item.parent)
								{
									var name = node.get("label");
									var text = dom.byId("view_text_" + name);
									text.innerHTML = value;
									text.id = "view_text_" + value;
									_this.viewList[value] = _this.viewList[name];
									delete _this.viewList[name];
								}
								node.set("label",value);
							}catch(e){
								console.log("重命名 : "+e.stack);
							}
						},
						function(error){
							console.log("error:"+error);
						}
					);
				}
			},
			/*
			删除文件夹
			*/
			deleteFolder : function(node){
				if(node)
				{
					var _this = this;
					node.item.remove(
						function(){
							try{
								var name = node.item.getName();
								var parent = node.item.parent;
								console.log("删除 : "+name);
								_this.destorySingView(node);
								topic.publish("onFolderDelete", {name : name, parent : parent});
							}catch(e){
								console.log("删除 : "+e.stack);
							}
						},
						function(error){
							console.log("error:"+error);
						}
					);
				}
			}
		});
		return explorer;
	}
);//dojo.declare