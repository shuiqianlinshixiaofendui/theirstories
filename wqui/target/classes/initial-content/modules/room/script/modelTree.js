/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
 /**
    处理模型列表，主要用来处理逻辑，菜单栏等
    #2384
 **/
 
require([
    "dojo/ready",
    "room/model/tree_model",
    "dojo/_base/declare", 
    "dijit/Menu", 
    "dijit/MenuItem", 
    "dojo/on",
    "dojo/dom",
    "widgets/ModelLib/ModelLib",
    "dijit/Dialog",
    "spolo/data/model",
    "widgets/room/cbtree/Tree",
    "dijit/form/Button"
    ],
function(ready,tree_model,declare, Menu, MenuItem,on,dom,ModelLib,Dialog,model_data,Tree,Button){
    var treeModel = new tree_model() ;
    var store = treeModel.getStore() ;
    var model = treeModel.getModel() ;
    Array.prototype.asyncEach = function(iterator) {            //  使用闭包解决异步循环 
        var list = this,  
            n = list.length,  
            i = - 1;  
        var resume = function() {  
            i += 1;  
            if (i === n) return;  
            iterator(list[i], resume);  
        };  
        resume();  
    };  
   ready(function() {
        
        var tree = new Tree( {              // 使用的cbtree
            model: model,
            id: "MenuTree",
            checkboxMultiState: true,       // 这个tree使用checkbox多选
            icon: { iconClass: "networkIcon", indent: true },   // 图片
            branchIcons: true,
            nodeIcons: true
        }, "CheckboxTree" );
        tree.startup();
        var dialog = new Dialog({
            id:"modelLibDialog",
            style:"width:90%"
        });
        var json = {
            path: "/content/modellib",
            toolbarData:{multipleChoice : true}
        };
        var modellib = new ModelLib(json);
        modellib.placeAt("modelLibDialog");
        
        var addButton = new Button({
            label: "添加模型",
            onClick: function(){
                if(Spolo.ModuleContainer){
                    dialog.show();
                }else{
                    alert("请选中墙") ;
                } 
            }
        }, "addModel");
        
        var openPhysi = new Button({
            label: "开启物理系统",
            onClick: function(){
                var temp = openPhysi.get("label") ;
                if(temp == "开启物理系统"){
                    openPhysi.set("label","关闭物理系统") ;
                    mainWidget.openX3domPhysi() ;
                }else{
                    openPhysi.set("label","开启物理系统") ;
                    mainWidget.closeX3domPhysi() ;
                }
            }
        }, "openX3domPhysi");
        
        var addButton = new Button({
            label: "删除模型",
            onClick: function(){
                function gotAll(items, request){
                    for(var i = 0 ; i < items.length ; i ++){
                        var name = items[i].name[0] ;
                        if(name == "model" || name == "camera"){
                            continue ;
                        }else{
                            var inputName = dom.byId("model_name").value;
                            if(inputName == name){                       //  如果删除的模型是input中的，就清空
                                dom.byId("model_name").value = "" ;
                            }
                            model.deleteItem( model.fetchItem(name));    //  删除tree中的model
                            mainWidget.deleteModel(name) ;               //  删除x3dom中的model
                        }
                    }
                }
                store.fetch({query: {checked:true}, onComplete: gotAll, 
                     queryOptions: {deep:true}}); 
            }
        }, "deleteModel");
        
        on(modellib,"multipleChoice",function(data){
            var items = modellib.listWidget.getSelectNodes();   
            items.asyncEach(function(url,resume) { 
                var modelObj = new model_data(url);
                modelObj.getResourceName(      // 使用spolo/data/model获取模型的名称
                    function(resourcename){
                        var modelName = Spolo.CreateNodeName(resourcename) ;  
                        mainWidget.addModel(url,modelName) ;
                        var newParent = model.fetchItem( 'model' );
                        if( newParent ) {
                          model.newItem( {name: modelName , type: 'child', parentNode : newParent }, newParent );
                        } else {
                          throw new Error( "modelTree add error");
                        }
                        resume(); 
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }); 
		});
        
        on(tree, 'click', function(item, node, evt){             // 当触发Tree的节点单击事件
            //console.log("Item", item);
            // console.log("Node", node);
            //console.log("Event", evt);
            //console.log('node: ' +tree.getLabel(node));
            //console.log('event: ' +tree.getLabel(evt));
            //console.log('identifier: ' + tree.getLabel(item));
            var pMenu;
            pMenu = new Menu({                                  // 创建Menu
                targetNodeIds: [node.id]                        //  这里创建Menu的位置，在每一个Tree的节点上
            });
            pMenu.addChild(new MenuItem({
                label: "锁定",
                onClick: function(){
                    console.log("锁定") ;
                }  
            }));
            pMenu.addChild(new MenuItem({
                label: "显示隐藏",
                disabled: false ,
                onClick: function(){
                    console.log("隐藏") ;
                }                
            }));
            pMenu.startup();
			
			
			if(evt.target.tagName == "INPUT"){
				var _checked = getState(item);
				var _root = null;
				if(_checked){
					setCheckboxState(item,true);
				}else{
					setCheckboxState(item,false);
					var _parent = item.parentNode;
					if(_parent){
						setParentState(_parent,false);
						
					}
				}
					
			}
			
        });
		
		function getState(item){
			var _checked = null;
			var type = typeof(item.checked);
			if(type == "boolean"){
				var _checked = item.checked;
				
			}else if(type == "object"){
				_checked = item.checked[0];
			}
			return _checked;
		};
		
		
		
		function setCheckboxState(item,state){
			var state = state;
			var _child = item.children;
			if(_child){
				for(var i=0;i< _child.length;i++){
					_child[i].checked[0] = state;
					model.onSetItem(_child[i], "checked", false, state);
					if(_child[i].children){
						for(var j=0;j< _child[i].children.length; j++){
							_child[i].children[j].checked[0] = state;
							model.onSetItem(_child[i].children[j], "checked", false, state);
						}
					}
				}
			}
			if(state){
				var _parent = item.parentNode;
				 if(_parent){
					setParentState(_parent,true);
				 }
			}
		};
		
		function setParentState(parentObj,state){
			var flag = false;
			var _children = parentObj[0].children;
			if(state){
				for(var i = 0;i < _children.length;i++){
					if(!_children[i].checked[0]){
						 flag = true;
						 break;
					} 
				}
			}else{
				for(var i = 0;i < _children.length;i++){
					if(_children[i].checked[0]){
						 flag = true;
						 break;
					} 
				}
			}
			
			if(flag){
				parentObj[0].checked[0] = "mixed";
				model.onSetItem(parentObj[0],"checked",true,"mixed");
			}else{
				parentObj[0].checked[0] = state;
				model.onSetItem(parentObj[0],"checked",true,state);
			}
			var _parent = parentObj[0].parentNode;
			if(_parent){
				return setParentState(_parent,state);
			} 
		};
		
    });
});