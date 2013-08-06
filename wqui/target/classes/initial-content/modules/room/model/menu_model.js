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
    dojo menu model
 */
 
 
define("room/model/menu_model",
[
	"dijit/MenuBar",
    "dijit/MenuItem",
    "dijit/PopupMenuItem",
    "dijit/DropDownMenu",
    "dijit/PopupMenuBarItem"
],
function(
	MenuBar,MenuItem,PopupMenuItem,DropDownMenu,PopupMenuBarItem
)
{
    
    var m = dojo.declare([], {
        /**
            TEST DATA
            List = [
                {type:"ITEM",label:"aa"},
                {type:"ITEM",label:"bb"},
                {type:"ITEM",label:"cc",onClick:"function_name"},
                {
                    type:"CITEM",
                    parentLabel : "Submenu",
                    childLabel : [
                        {
                            label:"sub item 1",
                            onClick:"function_name"        
                        },
                        {
                            label:"sub item 2",
                            onClick:"function_name"
                        }
                    ]
                }
            ]
            
        */
        constructor : function(id,name,List){
            var pMenuBar;
            var _onClick;
            var _onFun = function(){
                console.log("You not add onClick Event for button");
            };
            pMenuBar = new MenuBar({});

            var pSubMenu = new DropDownMenu({});
           
            for(var i=0;i<List.length;i++){
                // addMenuItems for in List
                if(List[i].type == "ITEM"){
                    
                    if(List[i].onClick){
                        _onClick = List[i].onClick;
                    }else{
                        _onClick = _onFun;
                    }
                    pSubMenu.addChild(new MenuItem({
                        label: List[i].label,
                        onClick : _onClick
                    })); 
                }else{
                  // addChildMenuItems for in List
                    
                    var pdSubMenu = new DropDownMenu();
                    var childLable = List[i].childLabel;
                    for(var j=0;j<childLable.length;j++){
                        if(childLable[j].onClick){
                            _onClick = childLable[j].onClick;
                        }else{
                            _onClick = _onFun;
                        }
                        pdSubMenu.addChild(new MenuItem({
                            label: childLable[j].label,
                            onClick : _onClick
                        }));
                    }
                    pSubMenu.addChild(new PopupMenuItem({
                        label: List[i].parentLabel,
                        popup: pdSubMenu
                    }));
                    
                }
                
            }
            pMenuBar.addChild(new PopupMenuBarItem({
                label: name,
                popup: pSubMenu
            }));  
            pMenuBar.placeAt(id);
            pMenuBar.startup();
            
		}
        
	});
	
	return m;
});

