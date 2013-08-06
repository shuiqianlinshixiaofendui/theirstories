require(
	[
	"dojo/dom",	
	"dojo/on",
	"gluerender/js/gluetree",
	"gluerender/js/toolbar",
	"dojox/widget/ColorPicker",
	"dijit/registry",
	"dojo/json",
	"widgets/PropertiesPanel/PropertiesPanel"	
	],
	function(dom,on,gluetree_cls,toolbar_clas,ColorPicker,registry,JSON,PropertiesPanel){		
		//存储所有Data	
		var DataArray=[];		
		var jsonVar={};
		//初始化树的列表
		var gluetree = new gluetree_cls(dom.byId("libView"));
		//初始化菜单栏
		new toolbar_clas(dom.byId("toolbar"));	
		//使用Widget创建颜色面板
		var rightpaneId = dom.byId("rightpane");
		new ColorPicker({}).placeAt(rightpaneId);
		//引入插件-------------------------------------------------	
		console.log("===============插件目前只支持火狐===============================");
		console.log("=====1.下载支持火狐的slgrender插件 2.下载启动slgrender运行环境==");
		console.log("=====请求场景的内容: ?scenes=scenes\\alloy\\alloy.cfg  =========");
		//获取主面的 embed的ID
	    var glue = dom.byId("glue");
		//获得输入的地址  例: http://devvm.spolo.org/modules/gluerender/index.html?scenes=scenes\\alloy\\alloy.cfg
		var baseUrl = window.location.href;	
		//获取地址栏scene后面的参数 例:scenes\\alloy\\alloy.cfg
		var getSceneUrl = baseUrl.substring(baseUrl.indexOf("?"));	
		var sceneUrl = getSceneUrl.substring(getSceneUrl.indexOf("=")+1);	
		//插件加载请求的场景 例:glue.load(scenes\\alloy\\alloy.cfg)	
		var ret = glue.Load(sceneUrl);			
		//获得树的根路径名字 例:name:"root",创建的内容根据name才能创建
		var sceneRootName = gluetree.getRootName();	
		//获得场景当中的Model
		var scene = glue.GetModelsInfo();			
		scene = JSON.parse(scene);		
		//遍历Scene当中的Model
		for(var model in scene){			
			jsonData={id:sceneRootName+"/"+model,name:model,parent:sceneRootName,isclick:"false"};
			DataArray.push(jsonData);
			//获得mesh
			var meshes = scene[model];					
			for(var mesh = 0; mesh < meshes.length; mesh++){
				jsonData={id:sceneRootName+"/"+model+"/"+meshes[mesh],name:meshes[mesh],parent:sceneRootName+"/"+model,isclick:"false"};
				DataArray.push(jsonData);			
				var meshInfo = glue.GetObjectInfo(meshes[mesh]);				
				meshInfo = JSON.parse(meshInfo);
				var mat = meshInfo.material;
				jsonData={id:sceneRootName+"/"+model+"/"+meshes[mesh] + "/" + mat,name:mat,parent:sceneRootName+"/"+model+"/"+meshes[mesh],isclick:"true"};
				DataArray.push(jsonData);
			}		
		}	
		for(var i = 0; i<DataArray.length;i++){
			gluetree.setTreeList(DataArray[i]);						
		}					
		on(gluetree,"send/currentItem",function(material){	
				//-widgets----------------------------------------------
				var json = [{"exp": "5000","type": "metal","kr": "0.5 0.5 0.5",	"normaltex": "1.0",	"bumptex": "1.0","emission": "0.0 0.0 0.0"}];
				var matProp = glue.GetMaterial(material);
				var jsonArray=[];
				jsonArray.push(JSON.parse(matProp));
				//console.log("jsonArray :",jsonArray);
				//console.log("matProp : ",matProp);
				var widget = new PropertiesPanel(jsonArray).placeAt(dom.byId("widgetContainer"));	
				widget.initCreateItem();	
				widget.setDefaultSelected(jsonArray[0]["type"]);
				widget.setSelectedClient(jsonArray[0]["type"]);
				on(widget,"send/metalKr",function(arg){								
					glue.SetMaterial(material, JSON.stringify(arg));				
				});
				on(widget,"send/metalBumptex",function(val){					 				
					  glue.SetMaterial(material, JSON.stringify(val));					 
				});
				on(widget,"send/metalNormaltex",function(val){									
					  glue.SetMaterial(material, JSON.stringify(val));					 
				});
				on(widget,"send/metalEmission",function(val){					 				
					  glue.SetMaterial(material, JSON.stringify(val));					 
				});		
				on(widget,"send/metalExp",function(val){					  			
					  glue.SetMaterial(material, JSON.stringify(val));					 
				});
				//-----------------------------------------------
							
				var testDom = dom.byId("test");
				testDom.innerHTML = matProp;					
		});	
	}
);