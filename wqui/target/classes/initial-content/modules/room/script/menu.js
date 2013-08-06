require([
    "dojo/ready",
    "room/model/menu_model",
    "widgets/ModelLib/ModelLib",
    "dijit/Dialog",
    "widgets/room/node/modelNode",
    "dojo/on",
	"dojo/dom"
    ],
function(ready,menu,ModelLib,Dialog,modelNode,on,dom){
    ready(function(){
        
        
        var json = {
            path: "/content/modellib"
        };
        
       
        // 自由模式
        function freeModules(){
            mainWidget.freeModules(true);
			var name = dom.byId('model_name').value;
			if(name){
				var modelObj = null;
				var roomEdit_scene = dom.byId("roomEdit_scene");
				var list = roomEdit_scene.getElementsByTagName("TRANSFORM");
				for(var i = 0; i < list.length; i++){
					if(list[i]._x3domNode._DEF == name){
						modelObj = list[i]._x3domNode;
						mainWidget.bindingBox(modelObj);
						break;
					}
				}
			}
        }
        
		// bounding box
		mainWidget.IsShowBBox(true);
		
        // 设置是否加载天空盒
        mainWidget.setRoomScene(true);
        mainWidget.setRoomEditScene(true);
        
        /**
         * 坐标系模式
         */ 
        // 平移
        function coordinateModelMove(){
			var data = {"operate_type" : {operateType : "coordinate"}};
			on.emit(dom.byId("EditConsole"), "event", data);
            mainWidget.coordinateModelMove(true);
        }
        // 旋转
        function coordinateModelRotation(){
			var data = {"operate_type" : {operateType : "coordinate"}};
			on.emit(dom.byId("EditConsole"), "event", data);
            mainWidget.coordinateModelRotation(true);
        }
        // 缩放
        function coordinateModelZoom(){
			var data = {"operate_type" : {operateType : "coordinate"}};
			on.emit(dom.byId("EditConsole"), "event", data);
            mainWidget.coordinateModelZoom(true);
        }
        
        // 設置scene, 1 -- room_scene 2 -- roomEdit_scene 3 两个都显示坐标系
        mainWidget.setCoordinateScene(2);
        
        // 设置是否在墙体加坐标系
        mainWidget.setWallCoordinate(false);
		// 设置是否拦截鼠标事件
        mainWidget.setMouseResponse(true);
        
        // 设置参照坐标系
        mainWidget.setReferCoordinateRoom(true);
        mainWidget.setReferCoordinateRoomEdit(false);
        
        var modelList  = [
            {type : "ITEM", label : "自由模式", onClick: freeModules},
            /**
             * 坐标系操作菜单
             */
            {
                type:"CITEM",
                parentLabel : "坐标系模式",
                childLabel : [
                    {
                        label : "移动",
                        onClick : coordinateModelMove       
                    },
                    {
                        label : "旋转",
                        onClick : coordinateModelRotation
                    },
                    // {
                        // label : "缩放",
                        // onClick: coordinateModelZoom
                    // }
                ]
            }
        ]
        var _menu = new menu("modelOperate","模型操作",modelList);
        
        var focusOn = function(){
            mainWidget.focusOnObj();
        }
        var showAll = function(){
            mainWidget.showAll();
        }
        var changeWindow = function(){
            mainWidget.changeWindow();
        }
        var changePerspective1 = function(){
            mainWidget.changePerspective(1);
        }
        var changePerspective2 = function(){
            mainWidget.changePerspective(2);
        }
        var changePerspective3 = function(){
            mainWidget.changePerspective(3);
        }
        var changePerspective4 = function(){
            mainWidget.changePerspective(4);
        }
        
        var PerspectiveList = [
            {type:"ITEM",label:"透视视角(浏览视图)",onClick:changePerspective1},
            {type:"ITEM",label:"正交视角(浏览视图)",onClick:changePerspective2},
            {type:"ITEM",label:"透视视角(编辑视图)",onClick:changePerspective3},
            {type:"ITEM",label:"正交视角(编辑视图)",onClick:changePerspective4},
        ]
        
        var cameraList  = [
            {type:"ITEM",label:"锁定墙体",onClick:focusOn},
            {type:"ITEM",label:"全景展示",onClick:showAll},
            {type:"ITEM",label:"切换窗口",onClick:changeWindow},
            {type:"MENU",parentLabel:"切换视角",childLabel:PerspectiveList},
            
        ]
        
        var _menu = new menu("cameraOperate","摄像机操作",cameraList);
        
        
       
    });
});