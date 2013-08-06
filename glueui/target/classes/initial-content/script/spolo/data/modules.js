/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/
define("spolo/data/modules",
[
 "dojo/_base/declare", 
 "spolo/data/spobject", 
 "spolo/data/spsession"
],
function(
 declare, 
 spobject, 
 spsession
 ){ 
     
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

	var spnode;
	var spsession;
	var modules; 
	
	var retClass = declare("spolo/data/modules", [spobject], {
		constructor : function(path)
		{
			// 这里会先调用 spobject 的构造函数，在spobject中实例化 spsession 和 spnode
			// 所以这里可以直接 this.spsession 和 this.spnode
			// 这里的 path 应该是 /modules
			spsession = this.spsession;
			spnode = this.spnode;
			
		}
	});	
	
	retClass.getInstance = function(path){
		if(!modules){
			modules = new spolo.data.modules(path);
		}
		return modules;
	}
	
	/**
	* summary:
	* 检测系统应用是否存在config.html 文件	
	*/
	retClass.hasModuleConfig = function(/*string*/moduleName, callback, notexistCallback, errorCallback){
		
		// 参数数量的判断
		if(arguments.length < 1){
			throw("hasModuleConfig() must be have one arguments!");
		}
		
		// 判断参数的类型
		checkDate("hasModuleConfig", moduleName, "string" );

		var isExist = false;
		
		var path = moduleName;
		var module = spnode.getNode(path);
		module.ensureData({
			success : function(module){
				var modulejson = module.getJson();
				for(var child in modulejson){
					if(child === "config.html"){
						isExist = true;
					}
				}
				 
				if(isExist){
					callback();
				}else{
					notexistCallback();
				} 
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback(error);
				}else{
					throw(error);
				}
			},
			loading : function(){},
		});
	}
	
	/**
	* summary :
	* 根据用户的应用列表，获取系统中的应用列表详细信息
    * 此方法多次调用 spsession.getNode();
	*/
	retClass.getSysModule = function(modulesjson, callback, errorCallback){
		
		
		var sysModulesJson = {};
		var jsonLength = 0;
		for(var i in modulesjson){
		
			jsonLength++;
			var url = modulesjson[i].url;
			var sysModule = spsession.getNode(url);
			
			sysModule.ensureData({
				success : function(sysModule){
					var sysModuleJson = sysModule.getJson();
					
					sysModulesJson[jsonLength--] = sysModuleJson;
					
					if(jsonLength == 0){
						callback(sysModulesJson);
					}
				},
				failed : function(error){
					if(typeof(errorCallback) == "function"){
						errorCallback();
					}else{
						throw(error);
					}
				},
				loading : function(){
					// console.log("");
					// console.log("loading");
				}
			});
		}
	}
	
	/**
	* summary :
    * 系统中的应用列表详细信息
	* return JSON
	*/
	retClass.getSysModules = function(callback, errorCallback){
		// 参数判断
		if(!callback || typeof callback != "function"){
			console.error("[modules.getSysModules ERROR] callback is undefined or not function!");
			return;
		}
		// 进行系统中应用的过滤
		function filterModules(sysModulesjson){
			
			require(["spolo/data/user"],function(user_cls){
				//检查IP
				user_cls.getRealIP(
					function(ip){
						if(ip != null){
							var user_IP = ip;
							user_IP = user_IP.split(".");
							if(user_IP[0]!="192" && user_IP[1]!="168"){
								
								for(var singleModule in sysModulesjson){
									//console.log(singleModule);
									var modulesArr = ["categorymanager","grantmanager","statpublish","sysinfo","uploadScene","uploadmaterial"];
									var modulesCount = modulesArr.length;
									for(var i=0; i<modulesCount; i++){
										if(singleModule==modulesArr[i]){
											delete sysModulesjson[singleModule];
										}
									}
								}
								callback(sysModulesjson);
								return;
							}
							callback(sysModulesjson);
							return;
						}
					},
					function(error){
						console.error("[modules.getSysModules ERROR] call getSysModules failed!");
						console.error(error);
						return;
					}
				);
			});
				
		}
		
		// 加载sysnode节点	
		spnode.ensureData({
		    ignoreCache:true, // 重新从jcr 中获取
			success : function(sysModules){
				// 当前节点正确加载，获取getNodesJson对象
				var sysModulesjson = sysModules.getNodesJson();
				filterModules(sysModulesjson);
				
			},
			failed : function(error){
				if(typeof(errorCallback) == "function"){
					errorCallback();
				}else{
					throw(error);
				}
			},
			loading : function(loading){
				// console.log("");
				// console.log("loading the modules");
				// console.log(loading);
			}
		});
		
	}
	
	/** @brief 获取系统应用中config.json 文件中的默认信息	
		@param moduleName ： 系统应用名称。
		@param callback ： 通过此回调函数传递获取的配置信息JSON
		@param errorCallback ： 获取失败，则调用此回调函数
	*/
	retClass.getDefaultConfig = function(/*string*/moduleName, callback, errorCallback){
		
		// 参数数量的判断
		if(arguments.length < 1){
			throw("getDefaultConfig() must be have one arguments!");
		}
		// 判断参数的类型
		checkDate("getDefaultConfig", moduleName, "string" );
				
		// 获取module的节点对象
		// 拼装路径
		var path = moduleName + "/config";
		// 判断一下是否存在 config.json 文件
		
	    function hasConfig(existed, notExist, checking){
				spsession.hasNode({
					nodePath: path,
					existed : function(){
						existed();
					},
					notExist : function(e){
						if(typeof notExist == "function"){
							notExist(e);
						}
					},
					checking : function(){
						if(typeof checking == "function"){
							checking();
						}
					}
				});
		}
		
		hasConfig(
			function(){
				var moduleConfig = spnode.getNode(path);
				// 加载module节点
				moduleConfig.ensureData({
					success : function(moduleConfig){
						// 当前节点正确加载，获取getJson对象
						var configModuleInfo = moduleConfig.getJson();
						// 删除不能被修改的信息
						delete configModuleInfo["jcr:created"];
						delete configModuleInfo["jcr:createdBy"];
						delete configModuleInfo["jcr:primaryType"];
						
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
			},
			function(e){
			    if(e.response && e.response.status == 404){
				    if(typeof(errorCallback) == "function"){
						errorCallback(e);
					}else{
						throw("there is not has a config node !");
					}
				}
				
			},
			function(){
			
			}
		);
	}
	
	/**
	*获取系统中所有的应用
	*/
	retClass.getAllModules = function(callback, errorCallback){
		
	}
	
	/**
	*获取指定分类中的应用
	*/
	retClass.getCateModules = function(moduleCateName,callback, errorCallback){
		
	}
	
	/**
	*获取指定类型的应用
	*/
	retClass.getTypeModules = function(moduleType,callback, errorCallback){
		
	}
	
	/**
	*通过指定应用名称或路径来获取应用URL地址
	*/
	retClass.getmoduleURL = function(args,callback, errorCallback){
		
	}
	
	return retClass;
});