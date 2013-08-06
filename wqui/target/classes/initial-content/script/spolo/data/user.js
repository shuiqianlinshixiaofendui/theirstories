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
 
define("spolo/data/user",
[
	"dojo/_base/declare", 
	"dojo/request/xhr",
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/queryClass",
	"spolo/data/jobs/renderjobmanager"
],
function(
	declare, 
	xhr,
	spobject, 
	spsession,
	queryClass,
	RenderJobManager
)
{
    /**
	** 实现对函数参数的数据类型的判断
	**/
	function checkDate(func, date, type)
	{    
		if(!date || typeof date != type)
		{
			throw(func + "() " + date + " is null or type of " + date + " is not " + type + " !");
		}
	}
	// var path = "/content/users/"+Spolo.getUserId();
	var spnode;
	var spsession;
	var user;
	var retClass = declare("spolo/data/user", [spobject], {
		constructor : function(path)
		{
			// 这里会先调用 spobject 的构造函数，在spobject中实例化 spsession 和 spnode
			// 所以这里可以直接 this.spsession 和 this.spnode
			// 这里的 path 应该是 /content/users/xxxxuser
			// 所以 this.spnode 就是用户目录的根节点
			
			spsession = this.spsession;
			spnode = this.spnode;
			// 在这里再维护一个系统的syssession和sysnode
			// this.syssession = new spsession("/modules");
		    // this.sysnode = this.syssession.getRootNode();
		},
		/**
		*获取该jobs目录节点
		*@param type 		job管理器类型
		*@param callback 	回调函数，当jobs存在或者创建成功时，会返回该jobManager对象给该回调函数
		* 					否则什么也不传入。
		*@param isRealTime 	是否是实时通信的
		*/
		getJobManager : function(type,callback,isRealTime){
			//jobs节点名
			var jobsNodeName='';
			var jobmanager_CLASS='';
			//判断参数合法性
			if((typeof callback!="function") || (typeof type!="string")){
				return;
			}else{				
				switch(type){
					case 'render':{
						jobsNodeName="renderJobs";
						jobmanager_CLASS = RenderJobManager;
						break;
					}
					default:{
						return;
					}
				}
			}
			var currentNode=this.getNode();
			var context_session=currentNode.getSession();
			
			var	ensure_success=function(data){
				console.log('user节点加载成功！');							
				var args_hasjobs = {
					nodePath: jobsNodeName,
					existed : function(jobs_node){
						console.log('存在'+jobsNodeName+'节点！');
						var jobs=new jobmanager_CLASS(jobs_node.getFullpath(),context_session,jobs_node,isRealTime);
						callback(jobs);
					},
					notExist : function(){
						console.log(jobsNodeName+'节点不存在！');
						var jobsNodeInfo={};
						jobsNodeInfo['nodePath'] = jobsNodeName;
						jobsNodeInfo['property'] = {'sling:resourceType':'scene/jobs'};
						jobsNodeInfo['replaceExist']= true;
						jobs_node=currentNode.addNode(jobsNodeInfo);
						args_createjobs = {
							success : function(){
								console.log('创建'+jobsNodeName+'节点成功');
								var jobs=new jobmanager_CLASS(jobs_node.getFullpath(),context_session,jobs_node,isRealTime);
								callback(jobs);
							},
							failed : function(){
								console.log('创建'+jobsNodeName+'节点失败');
								callback();
							},
							saving : function(){
								console.log('正在创建'+jobsNodeName+'节点... ...');
							}
						}
						currentNode.save(args_createjobs);
					},
					checking : function(){
						console.log('正在检测是否存在'+jobsNodeName+'节点... ...');
					}
				};							
				data.hasNode(args_hasjobs);		
			};
			var	ensure_failed=function(){
				console.log('user节点加载失败！');
				callback();
			};
			var args_ensure = {	
				ignoreCache : true,
				success : ensure_success,
				failed : ensure_failed,
				loading : function(){
					console.log('正在加载最新user节点数据... ...');
				}
			};
			currentNode.ensureData(args_ensure);
		}
	});	
	
	retClass.getInstance = function(path){
		if(!user){
			user = new spolo.data.user(path);
		}
		return user;
	}
	/** @brief 添加一个module 到/content/users/modules/modulexx,
	           如果存在defaultConfig 属性，则添加一个
			   /content/users/modules/modulexx/config 
		@param 在这里出入一个JSON，其中defaultConfig 可选
		  args = {
		    moduleName : "moduleName",
		    index : "1"
		    defaultConfig : {
				author : "xiaoming"
		   }
		} 
        @param callback : 成功则调用callback 回调函数
        @param errorCallback ： 失败则调用errorCallback 回调函数		
	**/
	retClass.addModule = function(args, callback, errorCallback){
	    
		// 判断是否存在moduleName 和 index 这两个参数
		if(typeof args.moduleName == "undefined"){
			throw("there must be a 'moduleName' parameter! ");
		}
		if(typeof args.index == "undefined"){
			throw("there must be a 'index' parameter!");
		}
		
		var moduleName = args["moduleName"],
			index = args["index"],
			defaultConfig = args["defaultConfig"];
		
		// 判断参数的类型
		checkDate("addModule", moduleName, "string" );
		if(isNaN(index))
		{
			throw("addModule() " + index + " is null or type of " + index + " is not Number !");
		}
		
	    spnode.addNode({
			nodePath : "modules/" + moduleName,
			property : { 
					url:moduleName,
					index:index
			}
	    }); 
	    if(defaultConfig){
			spnode.addNode({
					nodePath : "modules/" + moduleName + "/config",
					property : defaultConfig
			});      
	    }
		spsession.save({
			success : function(){
				if(typeof(callback) == "function"){
					callback();
				}
			},
			failed : function(){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			saving : function(){
				// console.log("nodeChild.addNode saving");
			}
		});
	}
	
	retClass.getModuleConfig = function(/*string*/moduleName, callback, errorCallback){
		// sammary:
		// 获取用户下某个应用的配置信息
		// return : JSON
		
		// 参数数量的判断
		if(arguments.length < 1){
			throw("getModuleConfig() must be have one arguments!");
		}
		// 判断参数的类型
		checkDate("getModuleConfig", moduleName, "string" );
		
		// 获取module的节点对象
		// 拼装路径
		var path = "modules/"+moduleName+"/config"
		var moduleConfig = spnode.getNode(path);
		// 加载module节点
		moduleConfig.ensureData({
			success : function(moduleConfig){
				// 当前节点正确加载，获取getJson对象
				var configModuleInfo = moduleConfig.getJson();
				callback(configModuleInfo);
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			loading : function(loading){

			}
		});
	}
	
	retClass.setModuleConfig = function(/*string*/moduleName, /*JSON*/moduleConfig, callback, errorCallback){
		// sammary:
		// 设置某个应用的配置信息
		
		// 参数数量的判断
		if(arguments.length < 2){
			throw("setModuleConfig() must be have two arguments!");
		}
		// 判断参数的类型
		checkDate("setModuleConfig", moduleName, "string" );
		checkDate("setModuleConfig", moduleConfig, "object" );
		
		var path = "modules/" + moduleName + "/config";
		// 获取module 节点对象
		var module = spnode.getNode(path);
		
		//var pthis = this;
		// 加载module 节点 
		module.ensureData({
			success : function(module){
				// 拼凑JSON
				// moduleConfig["spnode"] = module;
				for(var propertyName in moduleConfig){
					module.setProperty(propertyName, moduleConfig[propertyName]);
				}
				// spsession.setProperty(moduleConfig);
				spsession.save({
					success : function(){
						if(typeof(callback) == "function"){
							callback();
						}
					},
					failed : function(error){
						if(typeof(errorCallback) == "function"){
							errorCallback();
						}else{
							throw(error);
						}
					},
					saving : function(){}
				});
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			loading : function(){}
		});
	}
	retClass.moveModule = function(moduleName, setindex, callback, errorCallback){
		// summary :
		// 对module 进行排序，其实就是修改 module中的index 属性。
		// 获取当前module 的index
		// 与给定的index 进行比较，将两者之间的index 进行+1操作。
		// 例如自身为5，给定为2，
		// 将之前的 2，3，4，进行+1操作
		
		// 参数数量的判断
		if(arguments.length < 2){
			throw("moveModule() must be have two arguments!");
		}
		// 判断参数的类型
		checkDate("moveModule", moduleName, "string" );
	
		if(isNaN(setindex))
		{
			throw("moveModule() " + setindex + " is null or type of " + setindex + " is not Number !");
		}
		checkDate("moveModule", callback, "function" );
		
		var path = "modules/"+moduleName;
		var module = spsession.getNode(path);

		module.ensureData({
			success : function(module){
			
				// 获取自身的index
				var modulejson = module.getJson();
				var preindex = modulejson["index"];
				
				// 对preindex 与 setindex 进行取中间
				// 区间为 [low, high]
				var low = preindex;
				var high = setindex;
				if(preindex > setindex){
					low = setindex;
					high = preindex;
				}
		
				var modules = spsession.getNode("modules");
				modules.ensureData({
					success : function(modules){
						// 获取 用户下所有应用的json串
						var modulesjson = modules.getNodesJson();
						// 取出 区间的json 串 放到 modulesArray 中
						for(var i in modulesjson){
							if(modulesjson[i].index >= low && modulesjson[i].index <= high){
								
								var _nodePath = "modules/" + i;
								var _value = modulesjson[i].index;
								
								// 通过对 preindex 与 setindex 的大小
								// 决定 index +1 or -1
								// 当 preindex = setindex 时，continue;
								if(preindex < setindex){
									_value = _value - 1;
								}else if(preindex == setindex){
									continue;
								}else{
									_value = _value + 1;
								}
								
								spsession.setProperty({
				
									nodePath: _nodePath,	// 节点在缓存中的路径，该参数与 spnode 参数二选一即可。
									propertyName: "index",
									value : _value
								
								});
							}
						}
						// 最后对自身进行设置index
						module.setProperty("index", setindex);
						spsession.save({
							success : function(){
								callback();
							},
							failed : function(error){
								if(typeof(errorCallback) == "function"){
									errorCallback();
								}else{
									throw(error);
								}
							},
							saving : function(){
								// console.log("");
								// console.log("saving this.spesession.setProperty");
							}
						});
						
					},
					failed : function(error){
						if(typeof(errorCallback) == "function"){
							errorCallback();
						}else{
							throw(error);
						}
					},
					loading : function(){}
				});	
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			loading : function(){}
		});
	}
	
	retClass.deleteModule = function(moduleName, callback, errorCallback){
		// 根据moduleName 删除一个节点到users/userxxx/modules
		// 在删除module 时，同时修改所有 > index ,将其 - 1 
		// 为了获得此module 的index ，需要将其ensureData 才能获取其index
		// 成功执行callback
		// 失败执行errorCallback
		
		// 参数数量的判断
		if(arguments.length < 1){
			throw("deleteModule() must be have one arguments!");
		}
		// 判断参数的类型
		checkDate("deleteModule", moduleName, "string" );
		// checkDate("deleteModule", callback, "function" );
		// checkDate("deleteModule", errorCallback, "function" );
		
		// 拼装路径
		var path = "modules/" + moduleName;	

		var isCall = true;
		// 获取用户下的所有应用，将其大于tempindex 的所有index - 1
		var modules = spsession.getNode("modules");
		modules.ensureData({
			success : function(modules){
				var modulesjson = modules.getNodesJson();
				
				var tempindex = 0;
				for(var j in modulesjson){
					if(j === moduleName){
						tempindex = modulesjson[j].index;
					}
				}
	
				for(var i in modulesjson){
					if(modulesjson[i].index > tempindex){
						
						var _nodePath = "modules/" + i;
						var _value = modulesjson[i].index - 1;
						
						spsession.setProperty({
		
							nodePath: _nodePath,	// 节点在缓存中的路径，该参数与 spnode 参数二选一即可。
							propertyName: "index",
							value : _value
						
						});
					}
					
				}
				// 删除自身节点
				spsession.removeNode(path); 
				// 最后执行save 方法 
				spsession.save({
					success : function(){
						// if(typeof(callback) == "function"){
						if(isCall){
						   callback();
						}
						isCall = false;	//callback();
						//}
					},
					failed : function(){
						if(typeof(errorCallback) == "function"){
							errorCallback();
						}
					},
					saving : function(){
						
					}
				});
				
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			loading : function(){}
		
		});
			
	}
	
    retClass.getModules = function(sysModulesJson, callback,	errorCallback){
		// sammary : 
		// 获取当前用户的应用列表
		// return : JSON
		
		// 获取modules的节点对象
		var modules = spnode.getNode("modules");
		
		var userModulesJson = {};
		
		function processModules(modulesjson,callback)
		{	
			for(var i in modulesjson){
				for(var j in sysModulesJson){
					if(i===j){
						// userModulesJson[i]=sysModulesJson[j];
						sysModulesJson[j].url = modulesjson[i].url;
						userModulesJson[modulesjson[i].index]=sysModulesJson[j];
						// userModulesJson[modulesjson[i].index].url = modulesjson[i].url
					}
				}
			}
			callback(userModulesJson);
	
		}
		
		// 加载modules节点	
		modules.ensureData({
		    ignoreCache:true, // 重新从jcr 中获取 
			success : function(modules){
				// 当前节点正确加载，获取getNodesJson对象
				
				var modulesjson = modules.getNodesJson();
				processModules(modulesjson,callback);
			},
			failed : function(error){
				if(error.response && error.response.status == 404)
				{//当前用户未指定配置信息，使用缺省配置。
					var defaultMods = {"sling:resourceType":"module","jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 18:14:50 GMT+0800","jcr:primaryType":"sling:Folder","myscenelib":{"index":0,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 18:15:03 GMT+0800","url":"myscenelib","jcr:primaryType":"sling:Folder"},"sceneDetailedInformation":{"index":1,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 18:15:08 GMT+0800","url":"sceneDetailedInformation","jcr:primaryType":"sling:Folder"},"categorymanager":{"index":2,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 19:02:49 GMT+0800","url":"categorymanager","jcr:primaryType":"sling:Folder"},"uploadScene":{"index":3,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 19:02:49 GMT+0800","url":"uploadScene","jcr:primaryType":"sling:Folder"},"materiallib":{"index":4,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 20:25:55 GMT+0800","url":"materiallib","jcr:primaryType":"sling:Folder"},"modellib":{"index":5,"jcr:createdBy":"admin","jcr:created":"Fri Feb 01 2013 21:19:08 GMT+0800","url":"modellib","jcr:primaryType":"sling:Folder"}};
					processModules(defaultMods,callback);
				}else{
					
					if(typeof(errorCallback) == "function"){
						errorCallback(error);
					}
				}
			},
			loading : function(loading){
				
			}
		});
	}
	
	/**@brief 检查IP地址，判断内网还是外网
	*/
	retClass.getRealIP = function(callback, errorCallback){
		var url = "/content/users";
		url += ".getRealIP";
		
		xhr(url,{
				handleAs : "text",
				method : "GET"
		}).then(
			function(data){
				callback(data);
			},	
			function(error){
				if(typeof errorCallback == "function"){
					errorCallback(error);
				}else{
					throw(error);
				}
				
			}
		);
	},
	
	
	/**@brief 判断用户是不是具有访问节点的权限
	*/
	retClass.isGranted = function(userName,nodePath,callback ,errorCallback){
		
		var user_name;
		var node_path;
		
		if(userName){
			user_name = userName ;
		}else{
			throw("please input userName argument");
		}
		if(nodePath){
			node_path = nodePath ;
		}else{
			throw("please input nodePath argument");
		}
		var url = "/content/users/"+ user_name + ".isGranted?nodePath="+node_path;
		xhr(url,{
			handleAs : "text",
			method : "GET"
		}).then(
			function(result){
				callback(result);
			},	
			function(error){
				if(typeof errorCallback == "function"){
					errorCallback(error);
				}else{
					throw(error);
				}
				
			}
		);
	}
	
	/**@brief getAllUsers : 获取系统中所有用户
	   @param callback : 成功的回调函数，参数为用户数组
       @param errorCallback ： 失败的回调函数（optional）	   
	**/
	retClass.getAllUsers = function(callback, errorCallback){
		// 参数判断
		if(callback=="undefined"|| typeof callback != "function"){
			console.error("[ERROR]:callback is undefined!");
			return;
		}
		
		var queryArgs = {
			"nodePath" : "/content/users",
			"properties" : {
				"sling:resourceType":"users"
			},
			"orderDesc" : "jcr:created",
			"load" : function(data){
				
				if(typeof data == "object" && data["totalNum"]>=0){
					var usersArray = [];
					
					for(var key in data["data"]){
						
						var nickname = data["data"][key]["nickname"];
						var realname = key.substring(key.lastIndexOf("/")+1);
						// 将用户名进行解码
						realname = Spolo.decodeUname(realname);
						var usersObj = {};
						usersObj["realname"] = realname;
						usersObj["nickname"] = nickname;
						if(usersObj["realname"]=="admin"){
							continue;
						}
						usersArray.push(usersObj);
					}
				}
				
				callback(usersArray);
			
			},
			"failed" : function(error){
				if(errorCallback && typeof errorCallback == "function"){
					errorCallback(error);
					return;
				}
				console.error("[ERROR]: call getAllUsers occurs wrong " + error);
				return;
			}
		}
		queryClass.query(queryArgs);
	}
	return retClass;
});