define("gluerender/js/toolbar",[
	"dojo/_base/declare",
	"dijit/Menu",
	"dijit/MenuItem",
	"dijit/PopupMenuBarItem",    
	"dijit/DropDownMenu",
    "dojo/domReady!"
],function(declare,MenuBar,MenuItem,PopupMenuBarItem,DropDownMenu){
	
var retClass = declare("gluerender/js/toolbar",[],{	
	constructor:function(containerId){
		this.createToolbar(containerId);
	},
	createToolbar:function(containerId){
		//创建Menu bar 根节点
		var rootMenubar = new MenuBar({});
		//创建一级菜单项
		//文件
		var _file = new DropDownMenu({});
		//编辑
		var _edit = new DropDownMenu({});
		//节点
		var _node = new DropDownMenu({});
		//帮助
		var _help = new DropDownMenu({});
		/* ********************************************************
		***************添加一级菜单********************************
		***********************************************************/
		//添加文件Menu
		rootMenubar.addChild(new PopupMenuBarItem({
			label:"file",
			popup:_file
		}));
		//添加编辑Menu
		rootMenubar.addChild(new PopupMenuBarItem({
			label:"edit",
			popup:_edit
		}));
		//添加节点Menu
		rootMenubar.addChild(new PopupMenuBarItem({
			label:"node",
			popup:_node
		}));
		//添加帮助Menu
		rootMenubar.addChild(new PopupMenuBarItem({
			label:"help",
			popup:_help
		}));
		
		/* ********************************************************
		***************添加二级菜单********************************
		***********************************************************/
		
		//添加file二级菜单-----------------------------------------
		//新建
		_file.addChild(new MenuItem({
			label: "New..."
		}));
		//打开
		_file.addChild(new MenuItem({
			label: "Open.."
		}));
		//保存
		_file.addChild(new MenuItem({
			label: "Save"
		}));
		//另存为
		_file.addChild(new MenuItem({
			label: "Save As..."
		}));
		//Preference
		_file.addChild(new MenuItem({
			label: "Preference..."
		}));
		//退出
		_file.addChild(new MenuItem({
			label: "Exit"
		}));
		//添加edit二级菜单-----------------------------------------
		//剪切
		_edit.addChild(new MenuItem({
			label: "Cut"
		}));
		//拷贝
		_edit.addChild(new MenuItem({
			label: "Copy"
		}));
		//粘帖
		_edit.addChild(new MenuItem({
			label: "Paste"
		}));
		//删除
		_edit.addChild(new MenuItem({
			label: "Delete"
		}));
		//添加node二级菜单-----------------------------------------
		//Import nodes
		_node.addChild(new MenuItem({
			label: "Import nodes.."
		}));
		//Export Selected nodes
		_node.addChild(new MenuItem({
			label: "Export Selected nodes.."
		}));
		//Import Wavefront OBJ Mesh Node 
		_node.addChild(new MenuItem({
			label: "Export Selected nodes.."
		}));
		//添加help二级菜单-----------------------------------------
		//Open Menu
		_help.addChild(new MenuItem({
			label: "Open Menu.."
		}));
		//Open Log
		_help.addChild(new MenuItem({
			label: "Open Log.."
		}));
		//About GlueRender
		_help.addChild(new MenuItem({
			label: "About GlueRender.."
		}));
		//Show License
		_help.addChild(new MenuItem({
			label: "Show License.."
		}));
		//将所有Menubar放在页面进行显示
		rootMenubar.placeAt(containerId);
		//起动menubar
		rootMenubar.startup();
	}
});
return retClass;	
});