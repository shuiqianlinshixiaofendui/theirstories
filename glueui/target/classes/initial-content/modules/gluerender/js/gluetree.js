define("gluerender/js/gluetree",[
			"dojo/_base/declare",
			"dojo/store/Memory",
			"dijit/tree/ObjectStoreModel",
			"dijit/Tree",
			"dojo/ready",
			"dojo/dom",
			"dojo/Evented"			
],function(declare,Memory,ObjectStoreModel,Tree,Ready,dom,Evented){
	var treeMap=[
			   {id:"sceneRoot", name:"createTree",isclick:"false"}, 
	           {id:"root", name:"models", parent:"sceneRoot",isclick:"false"}  			   
	];	
	var data_json={};
	var store = new Memory({
			data :treeMap,
			getChildren : function(object)
			{
				return this.query({parent: object.id});
			}
	});		
	var retClass = declare("gluerender/js/gluetree",[Evented],{
			constructor:function(containerId){		
				//containerId 显示位置的信息
				this.getTreeList();	
				this.showTreeList(containerId);
			},
			//遍历数据，以树的结构显示
			showTreeList:function(containerId){
				var model = new ObjectStoreModel({
					store : store,
					query : {parent : "sceneRoot"}
				});	
				var dthis = this;
				Ready(function(){				
					var tree = new Tree({
						model : model,
						onClick:function(item){								
							if(item.isclick == "true"){
								dthis.emit("send/currentItem",item.name);	
							}	
						}
					});
					tree.placeAt(containerId);
					tree.startup();
				});
			},
			//设置当前setTreeList
			setTreeList:function(model){				
				if(model){
					treeMap.push(model);	
				}		
			},			
			getTreeList:function(){			
				return treeMap;
			},
			getRootName:function(){
				return treeMap[1]["id"];
			}
	});
return retClass;
});






