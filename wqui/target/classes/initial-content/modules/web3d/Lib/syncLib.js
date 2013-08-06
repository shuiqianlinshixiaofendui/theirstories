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
 define("web3d/Lib/syncLib", ["dojo/topic", "dojo/_base/declare", "dojo/dom", "spolo/data/scene", "spolo/data/queryClass", "spolo/data/model"], function(topic, declare, dom, scene, queryClass, modules){
	
	/**
		sceneFactory,提供scene对象
	*/
	var sceneObj;
	function sceneFactory(){
        var loc = window.location.href;
        var scenePath = loc.substr(loc.indexOf("?path=")+6);
        // var scenePath = "/content/users/admin/scenelib/scene2013228110223740218704";
        sceneObj = new scene(scenePath);
	}
	
	/**
	 * 格式化名称
	 * 1. 在名称中，其它字符均改成下划线
	 * 2. 名称以数字开头，在数字前加下划线。
	 */
	function formatName(items_data_name){
		//获取jcr中的模型名称字符的第一个字符
		var items_name_character1 = items_data_name.substr(0,1);
		//判断jcr中的模型名称字符的第一个字符 是否是int型 如果是则把名称前+"_"
		if(parseInt(items_name_character1)){
			items_data_name = "_" + items_data_name;
		}
		//判断jcr中的模型名称字符中是否包含“.” 如果包含则替换为“_”
		for(i = 0; i < items_data_name.split(".").length; i++){
			items_data_name = items_data_name.replace(".", "_");
		}
		return items_data_name;
	}
	/**
	 * 缓冲队列
	 */
	var Buffer = {
		/**
		 * 操作数组
		 */
		buffer : [],
		/**
		 * 队列长度
		 */
		length : function(){
			return this.buffer.length;
		},
		/**
		 * 插入队列
		 */
		insert : function(){
		
		},
		/**
		 * 队尾插入队列
		 */
		endBufferInsert : function(operate){
			this.buffer.push(operate);
		},
		/**
		 * 取出当前将要执行操作数据
		 */
		getCurrentOperate : function(){
			return this.buffer[0];
		},
		/**
		 * 从队列头删除元素
		 */
		shift : function(){
			this.buffer.shift();
		},
		/**
		 * 从队列尾删除元素
		 */
		pop : function(){
			this.buffer.pop();
		},
		/**
		 * 清空队列
		 */
		clearBuffer : function(){
			this.buffer = [];
		},
		/**
		 * 判断队列是否为空
		 */
		emptyBuffer : function(){
			return this.length();
		},
		/**
		 * 判断操作是否完成
		 */
		isOperateFinish : 1,
		/**
		 * 操作是否空闲
		 */
		isOperate : function(){
			
		},
		/**
		 * 执行操作
		 */
		doOperate : function(){
			// console.log("this.getCurrentOperate : " + this.getCurrentOperate());
			// console.log("this.length : " + this.length());
			var curOperateData = this.getCurrentOperate();
			var name = curOperateData.name;
			// console.log("this.getCurrentOperate name : " + name);
			// console.log("Buffer.isOperateFinish : " + Buffer.isOperateFinish);
			if(Buffer.isOperateFinish){
				Operate[name](curOperateData);
			}
		}
		
	};
	/**
	 * 操作
	 */
	var Operate = {
		/**
		 * 跳过缓冲队列，直接选择方法执行
		 */
		selectDoOperate : function(_operate){
			this[_operate.name](_operate);
		},
        /**
         * updateItemByJson : 同步操作
         * json : 需要同步的模型信息
         * {
         *    0 ：{"DEF" : "test_TRANSFORM" , "location" : ["0","0","0"] ,
         *            "scale" : ["1","1","1"] , "rotation" : ["0","0","0","0"]
         *        },
         *    1 : {"DEF" : "test2_TRANSFORM" , "location" : ["0","0","0"] ,
         *            "scale" : ["1","1","1"] , "rotation" : ["0","0","0","0"]
         *        }
         * }
         */
        updateItemByJson : function(_operate){
            // 解析数据
            var json = _operate.json;
            var callback = _operate.callback;
			var ignoreCache = _operate.ignoreCache;
            var _this = this;
            // json的数据个数和ensure出来的数据个数相同
            // console.log(json) ;
            sceneObj.ensureItems(function(items){
                for(var j in json){
                    var json_data = json[j] ;               // 当前json
                    var json_def = json_data.DEF ;
                    // var index = json_def.indexOf("_TRANSFORM") ;
                    // var json_name = json_def.substr(0,index) ;
                    
                    var json_location = json_data.location ;    // 依次取出json中的数据
                    var json_scale = json_data.scale ;
                    var json_rotation = json_data.rotation ;
                    
                    for(var i=0; i<items.length; i++){      // 一次查找后台中和json中对象的数据
                        // var item_name = formatName(items[i].data.name) ;
                        var item_name = items[i].data.name ;
                        if( item_name == json_def){        // 名称相同就同步
                            var item_location = items[i].data.location ;    // 依次取出item中的数据
                            var item_scale = items[i].data.scale ;
                            var item_rotation = items[i].data.rotation_axis_angle ;
                            
                            item_location[0] = json_location[0];    // 同步location
                            item_location[1] = json_location[1];
                            item_location[2] = json_location[2];
                                
                            item_scale[0] = json_scale[0];          // 同步scale
                            item_scale[1] = json_scale[1];
                            item_scale[2] = json_scale[2];
                            
                            item_rotation[0] = json_rotation[0];    // 同步rotation
                            item_rotation[1] = json_rotation[1];
                            item_rotation[2] = json_rotation[2];
                            item_rotation[3] = json_rotation[3];
                            
                            items[i].data["sp:client:dirty"] = "true";  
                        }
                    }
                }
                _this.saveItems("updateItemByJson", false, callback);                               // 保存
            }, null, ignoreCache); 
        },
		/**
		 * 修改Items数据
		 */
		updateItem : function(_operate){
			// console.log("current operate updateItem ! ");
			// for(var i in _operate){
				// console.log("_operate[" + i + "] : " + _operate[i]);
			// }
			if(typeof(_operate.ignoreCache) != "boolean"){
				ignoreCache = null;
			}
			var _this = this;
			var itemName = _operate.itemName;
			var handle = _operate.handle;
			var callback = _operate.callback;
			var ignoreCache = _operate.ignoreCache;
			sceneObj.ensureItems(function(items){
				try{
					var itemName_interception = itemName.split("_TRANSFORM")[0];
					for(var i=0; i<items.length; i++){
						if(formatName(items[i].data.name) == itemName_interception){
							handle(items[i]);
							items[i].data["sp:client:dirty"] = true;
						}
					}
				} catch(e){
					console.error("ensureItems时发生错误:" + e);
				}
				_this.saveItems("updateItem", false, callback);
			}, null, _operate.ignoreCache);
		},
		/**
		 * 通过Mesh Name获取Items
		 */
		getItemByName : function(_operate){
			// console.log("current _operate getItemByMeshName ! ");
			// for(var i in _operate){
				// console.log("_operate[" + i + "] : " + _operate[i]);
			// }
			if(typeof(_operate.ignoreCache) != "boolean"){
				ignoreCache = null;
			}
			var _this = this;
			var itemName = _operate.itemName;
			var handle = _operate.handle;
			var callback = _operate.callback;
			var ignoreCache = _operate.ignoreCache;
			sceneObj.ensureItems(function(items){
				try{
					var itemName_interception = itemName.split("_TRANSFORM")[0];
					for(var i=0; i<items.length; i++){
						if(formatName(items[i].data.name) == itemName_interception){
							handle(items[i]);
							// items[i].data["sp:client:dirty"] = true;
						}
					}
				} catch(e){
					console.error("ensureItems时发生错误:" + e);
				}
				_this.saveItems("getItemByMeshName", true, callback);
			}, null, _operate.ignoreCache);
		},
		/**
		 * 通过Item类型获取Items
		 */
		getItemsByType : function(_operate){
			// console.log("current operate getItemsByType ! ");
			// for(var i in _operate){
				// console.log("_operate[" + i + "] : " + _operate[i]);
			// }
			if(typeof(_operate.ignoreCache) != "boolean"){
				ignoreCache = null;
			}
			var _this = this;
			var type = _operate.type;
			var handle = _operate.handle;
			var ignoreCache = _operate.ignoreCache;
			var callback = _operate.callback;
			var itemArray = [];
			// 遍历所有的item
			sceneObj.ensureItems(function(items){
				try{
					for(var i=0;i<items.length;i++){
						if(items[i].data.type == type){
							// 根据用户传的itemName，返回用户需要的item
							itemArray.push(items[i]);
						}
					}
					handle(itemArray);
				} catch(e){
					console.error("ensureItems时发生错误:" + e);
				}
				_this.saveItems("getItemsByType", true, callback);
			}, null, _operate.ignoreCache);
		},
		/**
		 * 创建Item
		 */
		createItem : function(_operate){
			// console.log("current operate createItem ! ");
			// for(var i in _operate){
				// console.log("_operate[" + i + "] : " + _operate[i]);
			// }
			var type = _operate.type;
			var json = _operate.json;
			var callback = _operate.callback;
            // console.log(json) ;
			sceneObj.createItem(type, json);
			this.saveItems("createItem", false, callback);
		},
		/**
		 * 删除Item
		 */
		deleteItem : function(_operate){
			// console.log("current operate deleteItem ! ");
			// for(var i in _operate){
				// console.log("_operate[" + i + "] : " + _operate[i]);
			// }
			var _this = this;
			var itemName = _operate.itemName;
			var callback = _operate.callback;
			sceneObj.ensureItems(function(items){
				try{
					// var itemName_interception = itemName.split("_TRANSFORM")[0];
					for(var i=0; i<items.length; i++){
						// if(formatName(items[i].data.name) == itemName_interception){
                        if(items[i].data.name == itemName){
							sceneObj.removeItem(items[i]);
						}
					}
				} catch(e){
					console.error("ensureItems时发生错误:" + e);
				}
				_this.saveItems("deleteItem", false, callback);
			}, null, true);
		},
		/**
		 * 存储节点
		 * param : suc(1) -- 存储成功
		 * param : fail(0) -- 存储失败，在这里设置返回是1，是为了确认存储节点线程是否空闲。
		 * param : isFinish -- 不使用saveItems存储时，判断一次数据交互是否完成isFinish。
		 */
		saveItems : function(operate, isFinish, callback){
		//	 console.log("current operate saveItems ! ");
			var _this = this;
			if(!isFinish){
				sceneObj.saveItems(function(suc){
					if(suc){
				//		console.log(operate + " : " + suc);
						if(callback)
							callback();
						_this.finish();
					}
				}, function(fail){
					if(fail){
				//		console.log(operate + " : " + fail);
						if(callback)
							callback();
						_this.finish();
					}
				});
			}
			// console.log("operate busy ! ");
			Buffer.isOperateFinish = 0;
			if(isFinish){
                if(callback)
					callback();
				this.finish();
			}
		},
		/**
		 * 完成一次与服务器交互
		 */
		finish : function(){
			// console.log("operate free ! ");
			Buffer.isOperateFinish = 1;
			Buffer.shift();
			// console.log("Buffer.emptyBuffer : " + Buffer.emptyBuffer());
			if(Buffer.emptyBuffer()){
				Buffer.doOperate();
			} else {
				this.finishSyncerData();
				this.breakOff();
			}
		},
		/**
		 * 判断操作是否需要加入队列
		 */
		doBuffer : function(_operate){
			var isDoOperate = !Buffer.buffer.length;
			Buffer.endBufferInsert(_operate);
			// console.log("Buffer.buffer.length : " + Buffer.buffer.length);
			if(isDoOperate)
				Buffer.doOperate();
		},
		/**
		 * 强制中止同步数据
		 */
		breakOff : function(){
			Buffer.clearBuffer();
		},
		/**
		 * 判断数据是否同步完成
		 */
		isFinishSyncerData : function(handle){
			if(Buffer.emptyBuffer()){
				this.finishPrompt = handle;
				return 0;
			}
			return 1;
		},
		/**
		 * 完成数据同步后，提示信息
		 */
		finishPrompt : null,
		/**
		 * 数据同步完成
		 */
		finishSyncerData : function(){
            if(typeof(this.finishPrompt) == "function")
                this.finishPrompt();
			this.finishPrompt = null;
		},
        /**
         * 获取当前场景中的所有摄像机.
         */
        getCameras : function(_operate){
            var handle = _operate.handle;
            var callback = _operate.callback;
            var errorCallback = _operate.errorCallback;
            sceneObj.getCameras(handle, errorCallback);
            this.saveItems("getCameras", true, callback);
        },
        /**
         * 设置摄像机数据
         */
        // setCameras : function(_operate){
            // var handle = _operate.handle;
            // var callback = _operate.callback;
            // var errorCallback = _operate.errorCallback;
            // sceneObj.getCameras(handle, errorCallback);
            // this.saveItems("setCameras", false, callback);
        // }
        setCameras : function(_operate){
            var handle = _operate.handle;
            var callback = _operate.callback;
            // var errorCallback = _operate.errorCallback;
            var _this = this;
            var carArray = [];
            sceneObj.ensureItems(function(items){
				try{
					for(var i = 0; i < items.length; i++){
						if(items[i].data.type == "CAMERA"){
							carArray.push(items[i]);
						}
					}
                //    console.log(carArray, " carArray");
                    handle(carArray);
				} catch(e){
					console.error("ensureItems时发生错误:" + e);
				}
				_this.saveItems("setCameras", false, callback);
			}, null, true);
        }
	};
    
	return declare("web3d/Lib/syncLib",[], {
	
		constructor : function(){
			sceneFactory();
		},
        updateItemByJson : function(json, ignoreCache, isBuffer, callback){
            if(typeof(json) != "object"){
                return;
            }
            if(typeof(ignoreCache) != "boolean"){
				ignoreCache = true;
			}
			if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
            if(!callback){
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
            var _operate = {};
			_operate.name = "updateItemByJson";
			_operate.json = json;
			_operate.ignoreCache = ignoreCache;
			_operate.isBuffer = isBuffer;
			_operate.callback = callback;
			if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
        }
        ,
		/**
		 * 通过Item名修改Item数据
		 * param : itemName -- 节点名。
		 * param : handle -- 操作。
		 * param : ignoreCache -- 是修改缓存，还是服务端数据 true or false。
		 * param : isBuffer -- 是否加入缓存队列 true or false。
		 * param : callback -- 完成后回调。
		 */
		updateItem : function(itemName, handle, ignoreCache, isBuffer, callback){
           if(!itemName || typeof(itemName) != "string" || typeof(handle) != "function"){
                return;
            }
			if(typeof(ignoreCache) != "boolean"){
				ignoreCache = true;
			}
			if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
            if(!callback){
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
            
			var _operate = {};
			_operate.name = "updateItem";
			_operate.itemName = itemName;
			_operate.handle = handle;
			_operate.ignoreCache = ignoreCache;
			_operate.isBuffer = isBuffer;
			_operate.callback = callback;
			if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
			
		},
		/**
		 * 通过mesh名获取Item
		 * param : itemName -- 节点名。
		 * param : handle -- 操作。
		 * param : ignoreCache -- 是修改缓存，还是服务端数据 true or false。
		 * param : isBuffer -- 是否加入缓存队列 true or false。
		 * param : callback -- 完成后回调。
		 */
		getItemByName : function(itemName, handle, ignoreCache, isBuffer, callback){
            if(!itemName || typeof(itemName) != "string" || typeof(handle) != "function"){
                return;
            }
            if(!callback){
                callback = function(){
                    // console.log("callback finished ! ");
                }
            }
            if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
			if(typeof(ignoreCache) != "boolean"){
				ignoreCache = true;
			}
           
			var _operate = {};
			_operate.name = "getItemByName";
			_operate.itemName = itemName;
			_operate.handle = handle;
			_operate.ignoreCache = ignoreCache;
			_operate.isBuffer = isBuffer;
			_operate.callback = callback;
			if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
		},
		/**
		 * 通过节点类型名获取Items
		 * param : type -- 节点类型。
		 * param : handle -- 操作。
		 * param : ignoreCache -- 是修改缓存，还是服务端数据 true or false。
		 * param : isBuffer -- 是否加入缓存队列 true or false。
		 * param : callback -- 完成后回调。
		 */
		getItemsByType : function(type, handle, ignoreCache, isBuffer, callback){
            if(!type || typeof(handle) != "function"){
                return;
            }
            if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
			if(typeof(ignoreCache) != "boolean"){
				ignoreCache = true;
			}
            if(!callback){
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
            
			var _operate = {};
			_operate.name = "getItemsByType";
			_operate.type = type;
			_operate.handle = handle;
			_operate.ignoreCache = ignoreCache;
			_operate.isBuffer = isBuffer;
			_operate.callback = callback;
			if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
		},
		/**
		 * createItem 创建一个item
		 * 使用方式：
		 * syncLib.createItem("Mesh",json);
		 * param : itemName -- 节点名。
		 * param : json -- 存储数据。
		 * param : isBuffer -- 是否加入缓存队列 true or false。
		 * param : callback -- 完成后回调。
		 */
		createItem : function(json, callback, isBuffer){
            if(!json.type || (typeof(json) != "object")){
                return;
            }
            if(callback){
                if(typeof(callback) != "function"){
                    return;
                }
            } else {
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
           if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
			var _operate = {};
			_operate.name = "createItem";
            _operate.json = json;
            _operate.type = json.type;
			_operate.callback = callback;
			_operate.isBuffer = isBuffer;
            if(json.type === "MESH"){
                var nodePath = json.referModel;
                var module = new modules(nodePath);
                module.getID(function(ID){
                    _operate.json.ID = ID;
                    // console.log(_operate.json.ID);
                    // console.log(_operate);
                    if(isBuffer){
                        Operate.doBuffer(_operate);
                    } else {
                        Operate.selectDoOperate(_operate);
                    }
                },
                function(error){
                //   console.log(error);
                });
            } else {
                if(isBuffer){
                    Operate.doBuffer(_operate);
                } else {
                    Operate.selectDoOperate(_operate);
                }
            }
		},
		/**
		 * 存储模型
		 * param : suc(function) -- 成功方法
		 * param : fail(function) -- 失败方法
		 */
		// saveItems : function (suc, fail){
			// var operate = Operate.packageData(itemName, "createItem", callback, ignoreCache, true);
			// Operate.doBuffer(operate);
		// },
		
		/**
		 * deleteItem 删除item 
		 * 使用方式：
		 * syncLib.deleteItem("Mesh",function (item){ return {};});
		 * param : itemName -- 节点名。
		 * param : isBuffer -- 是否加入缓存队列 true or false。
		 * param : callback -- 完成后回调。
		 */
		deleteItem : function(itemName, callback, isBuffer){
            if(!itemName || typeof(itemName) != "string"){
                return;
            }
            if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
            if(!callback){
                callback = function(){
                    // console.log("callback finished ! ");
                }
            }
			var _operate = {};
			_operate.name = "deleteItem";
			_operate.itemName = itemName;
			_operate.callback = callback;
			_operate.isBuffer = isBuffer;
			if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
		},
		/**
		 * 判断数据是否同步完成
		 * 同数据同步完成后提示
		 */
		isFinish : function(handle){
            if(typeof(handle) != "function"){
                return;
            }
			return Operate.isFinishSyncerData(handle);
		},
		/**
		 * 强制中止同步数据
		 */
		breakOff : function(){
			Operate.breakOff();
		},
        /**
         * 获取当前场景中的所有摄像机.
         */
        getCameras : function(handle, isBuffer, callback){
            if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
            if(!callback){
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
            var _operate = {};
			_operate.name = "getCameras";
			_operate.handle = handle;
			_operate.callback = callback;
			_operate.errorCallback = function(){
            //    console.log("get cameras list fail ! ");
            };
            if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
        },
        /**
         * 设置摄像机值
         */
        setCameras : function(json, isBuffer, callback){
            if(typeof(json) != "object"){
                return;
            }
            if(typeof(isBuffer) != "boolean"){
                isBuffer = true;
            }
            if(!callback){
                callback = function(){
                //    console.log("callback finished ! ");
                }
            }
            // json.orientation = json.orientation.toAxisAngle();
            var handle = function(cameras){
                for(var i = 0; i < cameras.length; i++){
                    if(cameras[i].data.name = json.name){
                        cameras[i].data.orientation[0] = json.orientation[0];
                        cameras[i].data.orientation[1] = json.orientation[1];
                        cameras[i].data.orientation[2] = json.orientation[2];
                        cameras[i].data.orientation[3] = json.orientation[3];
                        
                        cameras[i].data.position[0] = json.position[0]; 
                        cameras[i].data.position[1] = json.position[1]; 
                        cameras[i].data.position[2] = json.position[2]; 
                        cameras[i].data.fieldOfView = json.fieldOfView + "";
                        cameras[i].data.description = json.description;
                        cameras[i].data["sp:client:dirty"] = true;
                    }
                }
            }
            var _operate = {};
			_operate.name = "setCameras";
			_operate.handle = handle;
			_operate.callback = callback;
			_operate.errorCallback = function(){
            //    console.log("set cameras fail ! ");
            };
            if(isBuffer){
				Operate.doBuffer(_operate);
			} else {
				Operate.selectDoOperate(_operate);
			}
        }
	});
});