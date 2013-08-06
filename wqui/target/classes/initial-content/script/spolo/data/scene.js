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
 
define("spolo/data/scene",
[
	"dojo/_base/declare", 
	"dojo/store/Memory",
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/material",
	"spolo/data/model",	
	"spolo/data/scene/mesh",	
	"spolo/data/scene/camera",
	"spolo/data/scene/option",	
	"spolo/data/queryClass",
	"spolo/data/folder",
	"dojo/request/xhr",
	"dojo/json",
	"spolo/data/jobs/renderjobmanager",
	"spolo/data/jobs/previewjobmanager",
	"dojo/_base/lang",
	"spolo/data/util/image"
],
function(
	declare, 
	Memory,
	spobject, 
	spsession,
	material,
	model,
	mesh_cls,
	camera_cls,
	option_cls,
	queryClass,
	folder_cls,
	xhr,
	JSON,
	RenderJobManager,
	PreviewJobManager,
	lang,
	image_cls
)
{  
   var itemCount = {};
   
	//私有方法,使用json数据来更新场景数据
	function updateItemsImpl(jsonData,suc,failed)
	{
		//类似getObjects，通过发送xhr请求以更新objects.
		url = this.spnode.getFullpath();
		url += ".updateObjects";
		// 缓存this
		var pthis = this;
		xhr(url,{
				data : jsonData,
				handleAs : "json",
				method : "POST"
		}).then(
			dojo.hitch(this, function(json_data){
				// 调用私有方法，处理请求的数据
			    sucFunUpdateObjects.call(this,json_data, suc, failed);
						
			}),	
			function(error){
				// console.log("error");
				if(failed) failed(error);
			}
		);
		
	}
   
   // 私有方法，ajax 请求updateObjects 成功的处理函数。
   function sucFunUpdateObjects(json_data, callback, errorCallback)
   {
		console.log(json_data);	
		
		if(json_data["error"]==undefined||json_data["error"]==""){
			// 请求的数据成功
			// 这里将json_data处理为item array.
			this.itemArray = [];
			for(var i = 0; i < json_data["data"].length; i++)
			{
				var o = json_data["data"][i];
				createItemImplement.call(this,o.type,o);
			}
			// 打印处理的操作add,delete,modify,replace
			if(json_data["info"]&&json_data["info"]["add"].length>0){
				console.log("add_info");
				console.log(json_data["info"]["add"]);
			}
			if(json_data["info"]&&json_data["info"]["delete"].length>0){
				console.log("delete_info");
				console.log(json_data["info"]["delete"]);
			}
			if(json_data["info"]&&json_data["info"]["modify"].length>0){
				console.log("modify_info");
				console.log(json_data["info"]["modify"]);
			}
			if(json_data["info"]&&json_data["info"]["replace"].length>0){
				console.log("replace_info");
				console.log(json_data["info"]["replace"]);
			}
			callback(this.itemArray, json_data);
		}else{
			// 请求的数据失败
			if(typeof errorCallback == "function"){
				errorCallback(json_data["error"]);
			}else{
				throw(json_data["error"]);
			}
		}	
   }
   
   // 私有方法，ajax 请求getObjects 成功的处理函数
   function sucFunGetObjects(json_data, callback, errorCallback)
   {
		console.log(json_data);	
	
		if(json_data["error"]==undefined||json_data["error"]==""){
		
			if(json_data instanceof Array){
				// 请求成功的数据处理
				// 这里将json_data处理为item array.
				// if(this.itemArray == null)
				this.itemArray = [];
				for(var i = 0; i < json_data.length; i++)
				{
					var o = json_data[i];
					createItemImplement.call(this,o.type,o);
				}
				callback(this.itemArray, json_data);
			
			}else{
				// 请求成功的数据处理
				//这里将json_data处理为item array.
				//if(this.itemArray == null)
				this.itemArray = [];
				for(var i = 0; i < json_data["data"].length; i++)
				{
					var o = json_data["data"][i];
					createItemImplement.call(this,o.type,o);
				}
				callback(this.itemArray, json_data);
			}
		}else{
			// 请求失败的处理
			if(typeof errorCallback == "function"){
				errorCallback(json_data["error"]);
			}else{
				throw(json_data["error"]);
			}
		}
		
	
   }
   
   function hasItem(scene, name)
   {	
      var itemArray = scene.itemArray;
      if(itemArray && itemArray.length)
      {
         for(var i=0; i<itemArray.length; i++)
         {
            var itemName = itemArray[i].getName();
			if(name == itemName){
			   return true;
			}
            
                     
         }
      }
      return false;
   }
   
   /**@brief 生成4位随机数
   */
   function gen4random(){
   
		var timeDate = new Date();
		var millisecond = timeDate.getMilliseconds().toString();
		var random = Math.random(millisecond).toString().substring(2,6);
		return random;
   }
   
   /**@brief 对item 进行重命名
   */
   function reName(scene, name)
   {
	
		var rename = name + gen4random();
		while(hasItem(scene, rename)){
			rename = name + gen4random();
		}
		return rename;
		
   }
   
	/** @brief 创建item对象并加入到itemArray中.
	*/
	function createItemImplement(type,json)
	{
		var itemObj = null;
		if(type == "MESH")
		{
			itemObj = new mesh_cls(json,this);
			this.itemArray.push(itemObj);
		}else if(type == "CAMERA"){
			// alert("type " + o.type + " not implement,please implement it!");
			itemObj = new camera_cls(json,this);
			this.itemArray.push(itemObj);
		}
		return itemObj;
	}

	var notifier_seq = 0;
	var client_dirty = "sp:client:dirty";
	var retClass = declare("spolo/data/scene", [spobject], {
		constructor : function(path)
		{
			/*
				首先构造一个 spsession，也就是建立一个操作JCR的连接；
				spsession 也负责维护客户端缓存的所有 node 数据；
				一般情况下，我们构造一个 spsession 就应该够用了，我们也推荐你只构造一个；
				当然，为了更灵活的操作数据，构造多个spsession也是支持的，前提你必须能够维护好。
			*/
			this.ref=null;
			
			/** @brief 缓冲了当前场景的item数组.这个item数据中的data含有如下客户端扩展域:
				sp:client:dirty : 指示客户端是否发生变化.
			*/
			this.itemArray = null;
			// 指示getStoredModel中是否走缓存。
			//this.ignoreModelsCache = false;
			
			this.option = new option_cls(path);
		},
		
		/** @brief 为当前场景上传一个场景.
		//	@param formID : 包含文件选择form的dom id.
		//	@param option : 是一个json数据.包含内容:
		//			resumable : (optional) 支持断点上传.
		//			notifier : (optional) comet风格的通知.这个参数指示了服务器实时通知的函数.当本值被设置时,如果noresumable未设置,自动设置noresumable为true.
		//			load : (optional) 当数据被加载成功之后的回调函数.
		//			error : (optional) 当发生错误时的回调函数.
		//			debug : (optional) 启用调试.如果调试被启用,则返回进程执行结果而不是json对象.
		//			merge : (optional) 是否作合并式上传.也就是把上传的场景加入到当前场景中.
		**/
		upload:function(formID, option){
			if(this.ref != null)
			{
				return this.ref.upload(formID,option);
			}
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				var notify_func_name = null;
				//指定了通知notifier并且不支持断点上传.
				if(option && option.notifier && !option.resumable )
				{
					content["useNginx"] = false;
					if(typeof option.notifier == "function")
					{
						notify_func_name = "_sp_scene_notifier_" + notifier_seq;
						notifier_seq++;
						window[notify_func_name] = function(msg){
							option.notifier(msg);
						}
						content["notifier"] = "window.parent." + notify_func_name;
					}else{
						content["notifier"] = "window.parent." + option.notifier;
					}
				}
				
				if(option && option.debug)
				{
					content["debug"] = option.debug;
					handleAs = "text";
				}
				if(option && option.merge)
				{
					content["merge"] = option.merge;
				}
				if(option && option.x3d!=undefined)
				{
					content["isGenX3D"] = option.x3d;
				}
				if(option && option.del_err_obj!=undefined)
				{
					content["delete_error_Objects"] = option.del_err_obj;
				}
				if(option && option.checkDiffuse!=undefined)
				{
					content["checkDiffuse"] = option.checkDiffuse;
				}
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				
				var	url;
				
				var fullpath = this.spnode.getFullpath();
				
				if(content["useNginx"])
				{//使用nginx.
					url = "/upload";
					content["spi_target"] = this.spnode.getFullpath() + ".create";
				}else{
					url = this.spnode.getFullpath() + ".create";
				}
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						
						//处理preview
						/*var url = fullpath + ".proc_preview";
						
						xhr(url,{
									handleAs : "json",
									method: "GET",
									sync: false
							}).then(function(){},function(){});*/
						
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
			}));
		},
      
		updateByJSON : function(formID, option) {
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
			 
				var content = {};
				var handleAs = "json";
				var url = this.spnode.getFullpath() + ".updateObjects";

					if(option && option.handleAs)
					{
						handleAs = option.handleAs;
					}
				
					ioIframe.send({
						form: dom.byId(formID),
						method : "POST",
						content : content,
						url: url,
						handleAs: handleAs,
						load : function(data){
							if(option && option.load)
							{
								//option.load(data);
								sucFunUpdateObjects.call(this, data, option.load, option.error);
							}
						},
						error : function(error){
							if(option && option.error)
							{
								option.error(error);
							}
						}
				   });            
			 }));         
		},
		/**@brief 更新场景中的camera 信息
		   @param jsonCamera : 是摄像机的json对象数组
		   @param suc : 成功的回调函数
           @param failed : 失败的回调函数  		   
		*/
		updateCameraByJSON : function(jsonCamera,suc,failed){
			// json 转换成 string
			var jsonCamera = JSON.stringify(jsonCamera);
			// 再次转换成{}.data 的形式
			var jsonData = {};
			jsonData.data = jsonCamera;
			updateItemsImpl.call(this, jsonData, suc, failed);
		},
		
		createEmptyScene : function(suc, failed){
			url = this.spnode.getFullpath();
			url += ".createEmpty";
			xhr(url,{
				   handleAs : "json",
				   method : "POST"
			}).then(
				function(succeedata){
				   // console.log("succeed");
				   if(suc)	suc(succeedata);
				},	
				function(error){
				   // console.log("error");
				   if(failed) failed(error);
				}
			);         
		},
		
		//获取jcr中的material
		getStoredMaterial:function(callback,errorCallback){
			if(this.ref != null)
			{
				return this.ref.getStoreMaterial(callback,errorCallback);
			}
			//获取material的节点对象。
			matNode = this.spnode.getNode("material");
			//加载material节点。
			matNode.ensureData({
				success : function(node)
				{//当前节点正确加载。获取全部matArray对象。
					var matArray = node.getNodes();
					var retMaterial = [];
					for(var i in matArray){
						retMaterial.push(new material(null,null,i));
					}
					callback(retMaterial);
				},
				failed : function(error)
				{
					if(typeof(errorCallback) == "function")
						errorCallback(error);
				}
			});
		},
		
		/** @brief 为当前场景构建一个item.一旦添加完毕,则ensure会立即返回,无法获取服务器数据.
		*/
		createItem : function(type,json)
		{
			if(this.itemArray == null)
				this.itemArray = [];
				
			if(type == "MESH"){
				if(hasItem(this, json["name"])){    // 不在这里处理名字重复问题，在外层进行处理
					json["name"] = reName(this, json["name"])
				}	
			}
			
			if(type == "CAMERA")
			{   
				if(!json){
					var json = {};
					json["type"] = "CAMERA";
					json["name"] = Spolo.CreateNodeName("camera"); 
				}else{
					json["type"] = "CAMERA";
					// 处理重命名
					if(hasItem(this, json["name"])){
						// json["name"] = json["name"];
						json["name"] = reName(this, json["name"]);
					}
					
				}	
			}
			
			var ret =  createItemImplement.call(this,type,json);
			ret.data[client_dirty] = true;
			return ret;
		},
		
		/**@brief 通过数量添加Item,此类型为MESH.
		   @param json ：Item 的json 串.
		   @param count : 添加的数量，默认为1.
           @return 		   
		*/
		addItemsByCount : function(json, count){
			if(this.itemArray == null){
				this.itemArray = [];
			}
			if(!json["type"]){
				throw("there must be a 'type' parameter in arguments! ");
			}
			var type = json["type"];
			if(!count){
				var count = 1;
			}
			var pthis = this;
			if(type == "MESH"){
				for(var i=0; i<count; i++){
					var jsonClone = lang.clone(json);
					pthis.createItem("MESH", jsonClone);
				}
			}
			return;	
		},
		
		/** @brief 从当前场景中删除一个item.
		*/
		removeItem : function(item)
		{
			if(this.itemArray == null)
					return;
			for(var i = 0; i < this.itemArray.length; i++)
			{
					var val = this.itemArray[i];
					if((val.getName() == item.getName())&&
							(val.getType()==item.getType()))
					{       
							val.data["delete"] = true;
							val.data[client_dirty] = true;
							return true;
					}
			}
			return false;
		},
		
		/**@brief 进行成组的删除,
		   @param type : 类型，指示是MESH 还是CMERA	,
		   @param name : 名称,
		   @param referModel : 如果是MESH, 还需要传入一个referModel	。
		   @return boolean : 返回true 或者是false。
		**/
		removeItemsGroup : function(type, name, referModel){
			if(this.itemArray == null)
					return;
			var isRemoved = false;
			if(type == "MESH")
			{
				for(var i = 0; i < this.itemArray.length; i++)
				{
					var val = this.itemArray[i];
					if(val.data["referModel"] == referModel)
					{       
						val.data["delete"] = true;
						val.data[client_dirty] = true;
						isRemoved = true;
					}
				}
			}	
			if(type == "CAMERA")
			{
				for(var i = 0; i < this.itemArray.length; i++)
				{
					var val = this.itemArray[i];
					if((val.getName() == name)&&
							(val.getType()=="CAMERA"))
					{       
						val.data["delete"] = true;
						val.data[client_dirty] = true;
						isRemoved = true;
					}
				}
			}
			return isRemoved;
		},
		
		/**@brief newItem替换当前场景中的oldItem
		   @param oldItem : 场景中现有的Item
		   @param newItem : 模型库中的Item
		   @return boolean ： true 替换成功，false 替换失败	
		**/
		replaceItem : function(oldItem, newItem)
		{
			if(this.itemArray == null)
				return;
			for(var i = 0; i < this.itemArray.length; i++)
			{
				
				var val = this.itemArray[i];
				if(val == oldItem)
				{
					newItem.data["replace"] = oldItem.getName();
					newItem.data[client_dirty] = true;
					// 从i 删除1 个数据
					this.itemArray.splice(i, 1);
					
					return true;
				}
			}			
			
		},
				
		/** @brief 更新当前场景的item列表.
		*/
		saveItems : function(suc,fail)
		{
			//数据未变化.
			if(this.itemArray == null)
				return;
			var queryObj = {}
			var dirties = [];
			for(var i = 0; i < this.itemArray.length; i++)
			{
				if(this.itemArray[i].data[client_dirty])
				{
					delete this.itemArray[i].data[client_dirty];
					dirties.push(this.itemArray[i].data);
				}
			}
			queryObj.data = JSON.stringify(dirties);
			updateItemsImpl.call(this,queryObj,suc,fail);
		},
      
		
		// /** @brief 获取当前场景的item对象.可能为空.
		// */
		// getItems : function()
		// {
			// return this.itemArray;
		// },
		
		/** @brief 标示一个item的数据是脏的.
		*/
		markItemDirty : function(item)
		{
			item[client_dirty] = true;
		},
		
		/** @brief 判定一个item的数据是脏的.
		*/
		isItemDirty : function(item)
		{
			return (item[client_dirty] == true);
		},
		
		//获取当前场景的所有元素.(之所以不用object这个词,是为了和spobject加以区别).
		ensureItems :	function(callback,error,ignoreCache){
			if(this.ref != null)
			{
				return this.ref.getObjects(callback,error);
			}
			
			if(ignoreCache){
				this.itemArray = null;
			}
			
			if(this.itemArray != null)
			{
				callback(this.itemArray);
				return;
			}
			
			//获取当前全路径。
			url = this.spnode.getFullpath();
			//发送xhr请求以获取objects.
			url += ".getObjects"
			xhr(url,{
					handleAs : "json",
					method: "GET",
					sync: false
			}).then(
					dojo.hitch(this,function(json_data){
						// 调用私有方法
						sucFunGetObjects.call(this, json_data, callback, error);
					}),
					function(error){
						error(error);
					}
			);
		},
		
		// 进行数量分组
		ensureItemsByCount : function(callback, errorCallback){
			// 对结果进行排序
			function sortedItems(itemsArray){
			
				var store = new Memory({ data: itemsArray });

				var sortedData = store.query(null, {
					sort:[{ attribute: "name", descending: false }]
				});

				//console.dir(sortedData);
				return sortedData;
				
			
			}
			
			//selected ：1 已选定，2 排除掉，3 摄像机
			function itemsbygroup(itemsArray){
				var diffItems = [];
				// 遍历itemsArray
				for(var i = 0; i<itemsArray.length; i++){
					// 选出不同的一个MESH
					if(itemsArray[i]["data"]["selected"]==undefined&&
						itemsArray[i]["data"]["type"]=="MESH"){
						
						itemsArray[i]["data"]["selected"] = 1;
						itemsArray[i]["data"]["count"] = 1;
						// 对MESH count ++
						for(var j = i+1;j<itemsArray.length; j++){
							if(itemsArray[j]["data"]["selected"]==undefined&&
								itemsArray[i]["data"]["referModel"]==itemsArray[j]["data"]["referModel"]){
									itemsArray[j]["data"]["selected"]=2;
									itemsArray[i]["data"]["count"] ++;
								}
						}
						var diffItem = {};
						diffItem.ID = itemsArray[i]["data"]["ID"];
						diffItem.name = itemsArray[i]["data"]["name"];
						diffItem.type = "MESH";
						diffItem.count = itemsArray[i]["data"]["count"];
						diffItem.referModel = itemsArray[i]["data"]["referModel"];
						diffItem.err = itemsArray[i]["data"]["err"];
						diffItem.invalid = itemsArray[i]["data"]["invalid"]==undefined ? 0:1;
						// 添加到diffItems 中
						//console.log(diffItem);
						diffItems.push(diffItem);
					// 将CAMERA 添加到diffItems 中	
					}else if(itemsArray[i]["data"]["selected"]==undefined&&
						itemsArray[i]["data"]["type"]=="CAMERA"){
						itemsArray[i]["data"]["selected"] =  3;	
						var diffItem = {};
						diffItem.name = itemsArray[i]["data"]["name"];
						diffItem.type = "CAMERA";
						diffItem.count = 1;
						//console.log(diffItem);
						diffItems.push(diffItem);
					}	
				}
				// 返回diffItems
				//console.log(diffItems);
				return diffItems;
			}
			
			this.ensureItems(
				function(itemsArray){
					//console.log(itemsArray);
					if(itemsArray.length>0){
						callback(sortedItems(itemsbygroup(itemsArray)));
					}else{
						callback(itemsArray);
					}
					
				},
				function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				},
				true
			);
		},
		
		// 获取x3d 是否存在
		ensureX3d : function(callback){
			var url = this.spnode.getFullpath();
			url += ".prep_x3d";
			xhr(url,{
				handleAs : "json",
				method: "GET"
			}).then(
				function(jsondata){	
					
					if(typeof callback == "function"){
						callback(jsondata);
					}else{
						throw("there must be a 'callback' parameter in arguments!");
					}
					
				},
				function(error){
					throw(error);
				}
			);
		},
		
		//获取缺失文件列表
		getMissingFile : function(callback,errorCallback)
		{
			//获取当前全路径。
			url = this.spnode.getFullpath();
			//发送xhr请求以获取objects.
			url += ".missingfile"
			xhr(url,{
					handleAs : "json",
					method: "GET",
					sync: false
			}).then(
					dojo.hitch(this,function(json_data){
						
						// var missingfilelist = {};
						// filelist = json_data.filelist;
						// for(var i in filelist)
						// {
							// var o = filelist[i];
							// missingfilelist[i] = {};
							// missingfilelist[i].matname = o.matname
							// missingfilelist[i].matpath = o.matpath
						// }
						callback(json_data["filelist"]);
					}),
					function(error){
						errorCallback(error);
					}
			);
		},
		
		//获取缺失文件列表
		proc_messingfiles : function(callback,errorCallback)
		{
			//获取当前全路径。
			url = this.spnode.getFullpath();
			//发送xhr请求以获取objects.
			url += ".proc_missingfile"
			xhr(url,{
					handleAs : "json",
					method: "GET",
					sync: false
			}).then(
					dojo.hitch(this,function(json_data){
						
						// var missingfilelist = {};
						// filelist = json_data.filelist;
						// for(var i in filelist)
						// {
							// var o = filelist[i];
							// missingfilelist[i] = {};
							// missingfilelist[i].matname = o.matname
							// missingfilelist[i].matpath = o.matpath
						// }
						callback();
					}),
					function(error){
						errorCallback(error);
					}
			);
		},
		
		//以单个文件的形式上传缺失文件
		
		uploadMissingfile : function(formID,option)
		{
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				
				content["filename"] = option.filename;
				
				
				
				
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				
				
				var	url = this.spnode.getFullpath() + ".uploadMissingfile";
				// alert(url);
				// alert(option.load);
				// alert(dom.byId(formID));
				
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
				
				
			}));
		},
		
		
		//以zip包的形式上传缺失文件
		uploadMissingfileByZip:function(formID,option){
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				var notify_func_name = null;
				//指定了通知notifier并且不支持断点上传.
				if(option && option.notifier && !option.resumable )
				{
					content["useNginx"] = false;
					if(typeof option.notifier == "function")
					{
						notify_func_name = "_sp_scene_notifier_" + notifier_seq;
						notifier_seq++;
						window[notify_func_name] = function(msg){
							option.notifier(msg);
						}
						content["notifier"] = "window.parent." + notify_func_name;
					}else{
						content["notifier"] = "window.parent." + option.notifier;
					}
				}
				
				if(option && option.debug)
				{
					content["debug"] = option.debug;
					handleAs = "text";
				}
				if(option && option.merge)
				{
					content["merge"] = option.merge;
				}
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				
				var	url;
				if(content["useNginx"])
				{//使用nginx.
					url = "/upload";
					content["spi_target"] = this.spnode.getFullpath() + ".uploadMissingfiles";
				}else{
					url = this.spnode.getFullpath() + ".uploadMissingfiles";
				}
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
			}));
		},
		
		//以zip包的形式添加模型
		addExternalmodelByzip:function(formID,option){
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				// 模型数量默认指定为1
				content["num"] = 1;
				var notify_func_name = null;
				//指定了通知notifier并且不支持断点上传.
				if(option && option.notifier && !option.resumable )
				{
					content["useNginx"] = false;
					if(typeof option.notifier == "function")
					{
						notify_func_name = "_sp_scene_notifier_" + notifier_seq;
						notifier_seq++;
						window[notify_func_name] = function(msg){
							option.notifier(msg);
						}
						content["notifier"] = "window.parent." + notify_func_name;
					}else{
						content["notifier"] = "window.parent." + option.notifier;
					}
				}
				
				if(option && option.debug)
				{
					content["debug"] = option.debug;
					handleAs = "text";
				}
				if(option && option.merge)
				{
					content["merge"] = option.merge;
				}
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				if(option && option.num!=undefined)
				{
					if(option.num>=1){
						content["num"] = option.num;
					}else{
						//console.error("num is 1 at least!");
						//return;
						throw(" addExternalmodelByzip's parameter option.num is 1 at least!");
					}
				}
				var	url;
				if(content["useNginx"])
				{//使用nginx.
					url = "/upload";
					content["spi_target"] = this.spnode.getFullpath() + ".add_externalmodel";
				}else{
					url = this.spnode.getFullpath() + ".add_externalmodel";
				}
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
			}));
		},
		
		
		//更新场景
		updataScene:function(formID,option){
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				var content = {};
				var handleAs = "json";
				content["useNginx"] = true;
				// 模型数量默认指定为1
				content["num"] = 1;
				var notify_func_name = null;
				//指定了通知notifier并且不支持断点上传.
				if(option && option.notifier && !option.resumable )
				{
					content["useNginx"] = false;
					if(typeof option.notifier == "function")
					{
						notify_func_name = "_sp_scene_notifier_" + notifier_seq;
						notifier_seq++;
						window[notify_func_name] = function(msg){
							option.notifier(msg);
						}
						content["notifier"] = "window.parent." + notify_func_name;
					}else{
						content["notifier"] = "window.parent." + option.notifier;
					}
				}
				
				if(option && option.debug)
				{
					content["debug"] = option.debug;
					handleAs = "text";
				}
				if(option && option.merge)
				{
					content["merge"] = option.merge;
				}
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				if(option && option.num!=undefined)
				{
					if(option.num>=1){
						content["num"] = option.num;
					}else{
						//console.error("num is 1 at least!");
						//return;
						throw(" addExternalmodelByzip's parameter option.num is 1 at least!");
					}
				}
				var	url;
				if(content["useNginx"])
				{//使用nginx.
					url = "/upload";
					content["spi_target"] = this.spnode.getFullpath() + ".updataScene";
				}else{
					url = this.spnode.getFullpath() + ".updataScene";
				}
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
			}));
		},
		
		//获取jcr中的Model
		getStoredModel:function(callback,errorCallback)
		{
			if(typeof(callback) != "function")
				return;
			//类似getStoreMaterial。通过获取jcr数据来判定存储了哪些storeModel.
			if(this.ref != null)
			{
				return this.ref.getStoreModel(callback,errorCallback);
			}
			//获取model的节点对象。
			modNode = this.spnode.getNode("model");
			//加载model节点。
			modNode.ensureData({
			  //  ignoreCache : this.ignoreModelsCache,
			    ignoreCache : true,
				success : function(node)
				{
					// 关闭忽略缓存的开关
					//this.ignoreModelsCache = false;
					//当前节点正确加载。获取全部matArray对象。
					var modArray = node.getNodes();
					var retedModel = [];
					for(var i = 0 ; i < modArray.length; i++)
					{
						
						retedModel.push(new model(null,null,modArray[i]));
					}
					callback(retedModel);
				},
				failed : function(error)
				{
					alert(error);
					if(typeof(errorCallback) == "function")
						errorCallback(error);
				}
				
			});
		},
		
		// 获取scene 场景的resourceName
		getSceneName : function(callback, errorCallback){
		
			this.ensureData({
				success : dojo.hitch(this, function(){
					if(typeof callback == "function"){
						callback(this.getName());
					}
				}),
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				
				}
			});
			
		},
		
		/**@brief setSceneName 设置场景的名称
		   @param sceneName : 场景的名称
           @param callback ：设置场景成功的回调函数		   
           @param errorCallback ：设置场景失败的回调函数		   
		**/
		setSceneName : function(sceneName, callback, errorCallback){
			this.spnode.ensureData({
				success : dojo.hitch(this,function(data){
					this.spnode.setProperty("resourceName",sceneName);
					// if(typeof callback == "function"){
						// callback();
					// }else{
						// throw("callback is undefined!");
					// }
					this.saveDataToJcr(
						function(){
							if(typeof callback == "function"){
								callback();
							}else{
								throw("callback is undefined!");
							}
						},
						function(){
							if(typeof errorCallback == "function"){
								errorCallback(error);
							}else{
								throw(error);
							}
						}
					);
				}),
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback();
					}else{
						throw("call setSceneName occurs wrong!" + error);
					}
				}
			});
		},
		
		
		/**@brief saveDataToJcr 保存场景信息到jcr 中
           @param callback ：保存成功的回调函数		   
           @param errorCallback ：保存失败的回调函数		   
		**/
		saveDataToJcr : function(callback ,errorCallback){
			this.spnode.save({
				success: function(){
					if(typeof callback == "function"){
						callback();
					}else{
						throw("callback is undefined!");
					}
				},
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				}
			});
		},
	
		//获取jcr中的Model
		getStoredModelByQuery:function(args)
		{
			if(typeof(args) != "object")
				return;
			//类似getStoreMaterial。通过获取jcr数据来判定存储了哪些storeModel.
			if(this.ref != null)
			{
				return this.ref.getStoreModel(callback,errorCallback);
			}
			if(args["limit"]==undefined && args["offset"]==undefined){
				var limit = 10;
				var offset = 0;
			}else if(args["limit"]!=undefined && args["offset"]!=undefined){
				var limit = args["limit"];
				var offset = args["offset"];
			}else{
				throw("the 'limit' and 'offset' parameter is wrong!");
			}
			
			var rootPath = this.spnode.getFullpath() + "/model";
			
			var pthis = this; 
			
			var loadFunc = function(data){
				//console.log(data);
				if(typeof(data) == "object" && data["totalNum"]>=0){
					var modArray = data["data"];
					var totalNum = data["totalNum"];
					var retedModel = [];
					
					pthis.getSceneName(
						function(sceneName){
							
							for(var path in modArray){
								if(path != "hasObject" && modArray[path]){
									
									var mod = modArray[path];
									mod.path = path;
									mod.sceneName = sceneName;
									retedModel.push(mod);
								}
							}
							if(args["success"]&&
								(typeof args["success"] == "function")){
								args["success"](retedModel, totalNum);
							}else{
								throw("there must be a 'success' parameter in arguments!");
							}
					
						}
					);
				}					
			}
			
			var queryArgs = {
				"nodePath"  : rootPath,
				"properties" : {
					"sling:resourceType":"model",
					"type": "MESH"
				},
				//"orderAsc" : "jcr:created" , 
				"orderAsc" : "resourceName" , 
				"limit" : limit,
				"offset" : offset,
				load : loadFunc,
				error : function(error){
					if(args["failed"]&&typeof args["failed"] == "function"){
						args["failed"](retedModel);
					}else{
						throw(error);
					}
				}
			}
			queryClass.query(queryArgs);
			
		},
		
		
		//获取场景信息
		getInfo:function(callback,errorCallback){
			
			var url = this.spnode.getFullpath() + ".0.json";
			
			xhr(url,{
				handleAs : "json",
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
		
		// 获取isProcessing 信息
		getIsProcessing:function(callback,errorCallback){
			this.spnode.ensureData({
			    ignoreCache : true,
				success : function(node){
					//console.log(node.getJson());
					var isProcess = node.getJson()["isProcessing"];
					callback(isProcess);
				},
				failed : function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				}
			});
		},
		
		getNodePath:function(callback){
			callback(this.spnode.getPath());
			
		},
		
		//链接到目标sceneURL上。
		link:function(sceneURL){
			this.spnode.setProperty("glueref",sceneURL);
			this.spnode.save();
		},
		
		//取消链接。
		unlink:function(){
			this.spnode.removeProperty("glueref");
			this.spnode.save();
		},
		
		//复制模型
		copy:function(){
			//发送xhr请求以复制数据。如果有链接(link),服务器端会取消。
		},
		
		/**@brief 下载当前场景文件.fixme: 使用iframe来执行,以确保异步.
		   @param isDec(boolean):是否减面。默认为false. 	
		*/
		download:function(format_str, isDec){
			//缺省格式是blend.
			// if(!format) format = ".blend";
			// console.log(format);
			var format;
			switch(format){
				//case "blend":
				//case "ocs":
				default:
					format = format_str + ".zip";
					break;
			}
			if(!isDec){
				format = format + "?dec=0";
			}else{
				format = format + "?dec=1";
			}
			
			url = this.spnode.getFullpath() + '.' + format;
			require(["dojo/io/iframe"], function(ioIframe){
				var dframe = "SPdownloadSCENEIframe"; 
				var iframe = ioIframe.create(dframe);
				ioIframe.setSrc(iframe, url, true);
			});
		},
		
		/**@brief downloadModels : 选中多个模型进行ocs 格式下载
		   @param pathArray ： 需要下载的模型的全路径 	
		**/
		downloadModels : function(pathArray)
		{
			// 参数判定
			//if(!pathArray|| !(pathArray instanceof Array) || pathArray.length < 1){
			if(typeof pathArray == "undefined"){
				console.error("[ERROR]: pathArray is undefined! or isn't Array");
				return;
			}
			var pathsString = pathArray.join(","); 
			
			var url = this.spnode.getFullpath() + ".selectmodels.zip" + "?models=" + pathsString;
			
			require(["dojo/io/iframe"], function(ioIframe){
				var dframe = "SPDownloadModelsIframe"; 
				var iframe = ioIframe.create(dframe);
				ioIframe.setSrc(iframe, url, true);
			});
		},
		
		/**@brief : 模型属性的导出
		**/
		exportModelData : function()
		{
			var url = this.spnode.getFullpath();
			url += ".exportModelData";
			require(["dojo/io/iframe"], function(ioIframe){
				var dframe = "SPExportModelDataIframe"; 
				var iframe = ioIframe.create(dframe);
				ioIframe.setSrc(iframe, url, true);
			});
		},
		
		
		/**@brief : 模型属性的导入
		   @param callback : 成功的回调函数	
		   @param errorCallback : 失败的回调函数.	
		**/
		importModelData : function(formID, option){

			if(this.ref != null)
			{
				return this.ref.importModelData(formID,option);
			}
			require(["dojo/io/iframe","dojo/dom"], dojo.hitch(this,function(ioIframe,dom){
				
				var content = {};
				var handleAs = "json";
				var	url;
				
				var fullpath = this.spnode.getFullpath();
				
				
				url = fullpath + ".importModelData";
			
				
				ioIframe.send({
					form: dom.byId(formID),
					method : "POST",
					content : content,
					url: url,
					handleAs: handleAs,
					load : function(data){
						
						if(option && option.load)
						{
							option.load(data);
						}
					},
					error : function(error){
						
						if(option && option.error)
						{
							option.error(error);
						}
					}
			   });
			}));
		},
		
		/**@brief 获取当前场景中的所有摄像机.
		   @param callback : 成功的回调函数,回调函数中的参数为camersArray.
		   @param errorCallback : 失败的回调函数.
		   @param ignoreCache : 是否忽略缓存，默认为false，不忽略缓存. 
		*/
		getCameras : function(callback, errorCallback, ignoreCache){
			if(!ignoreCache){
				var ignoreCache = false;
			}
			this.ensureItems(
				function(itemsArray){
					var camerasArray = [];
					for(var i=0; i<itemsArray.length; i++){
						var item = itemsArray[i];
						if(item["data"]["type"] == "CAMERA" ){
							camerasArray.push(item);
						}
					}
					callback(camerasArray);
				},
				function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				},
				ignoreCache
			);	
		},
		
		/**@brief 获取当前场景中的所有MESH.
		   @param callback : 成功的回调函数,回调函数中的参数为meshsArray.
		   @param errorCallback : 失败的回调函数.
		   @param ignoreCache : 是否忽略缓存，默认为false，不忽略缓存. 
		*/
		getMeshs : function(callback, errorCallback, ignoreCache){
			if(!ignoreCache){
				var ignoreCache = false;
			}
			this.ensureItems(
				function(itemsArray){
					var meshsArray = [];
					for(var i=0; i<itemsArray.length; i++){
						var item = itemsArray[i];
						if(item["data"]["type"] == "MESH" ){
							meshsArray.push(item);
						}
					}
					callback(meshsArray);
				},
				function(error){
					if(typeof errorCallback == "function"){
						errorCallback(error);
					}else{
						throw(error);
					}
				},
				ignoreCache
			);	
		},
		
		/**@brief 判断当前场景中是否有摄像机
		   @param callback : 成功的回调函数,参数为'true' 或者是 'false'
		   @param errorCallback : 失败的回调函数.
		**/
		hasCamera : function(callback, errorCallback){
			this.getCameras(
				function(cameraArray){
					if(cameraArray.length>0){
						callback("true");
					}else{
						callback("false");
					}
				},
				function(error){
					if(typeof errorCallback == "fucntion"){
						errorCallback(error);	
					}else{
						throw(error);
					}
				},
				true
			)
		},
		
		/**@brief 判断当前场景中是否有mesh
		   @param callback : 成功的回调函数,参数为'true' 或者是 'false'
		   @param errorCallback : 失败的回调函数.
		**/
		hasMesh : function(callback ,errorCallback){
			this.getMeshs(
				function(meshArray){
					if(meshArray.length>0){
						callback("true");
					}else{
						callback("false");
					}
				},
				function(error){
					if(typeof errorCallback == "fucntion"){
						errorCallback(error);	
					}else{
						throw(error);
					}
				},
				true
			)
		},
		
		/**@brief 判断当前场景是否可以进行渲染
		   @param callback : 成功的回调函数,参数json 对象。
		   @param errorCallback : 失败的回调函数.
		**/
		isRender : function(callback, errorCallback){
			var isRenderInfo = {};
			isRenderInfo["hasMesh"] = "false";
			isRenderInfo["hasCamera"] = "false";
			
			var i = 0;
			
			this.hasMesh(
				function(isMesh){
					isRenderInfo["hasMesh"] = isMesh;
					i ++;
					isFinished(i);
				},
				function(error){
					if(typeof errorCallback == "fucntion"){
						errorCallback(error);	
					}else{
						throw(error);
					}
				}
			);
			this.hasCamera(
				function(isCamera){
					isRenderInfo["hasCamera"] = isCamera;
					i ++;
					isFinished(i);
				},
				function(error){
					if(typeof errorCallback == "fucntion"){
						errorCallback(error);	
					}else{
						throw(error);
					}
				}
			);
			
			
			function isFinished(temp){
				if(temp==2){
					if(isRenderInfo["hasMesh"]==="true"&&isRenderInfo["hasCamera"]==="true"){
						isRenderInfo["isRender"] = "true";
					}else{
						isRenderInfo["isRender"] = "false";
					}
					callback(isRenderInfo);
				}
			}
			
		},
		
		/**@brief 判断当前场景中是否有此camera
		   @param cameraName : 摄像机名称
		   @param onExist : 此名字存在的，调用的回调函数
		   @param onNotExist : 此名字不存在的，调用的回调函数
		**/
		cameraIsExist :  function(cameraName, onExist, onNotExist){
			if(!cameraName){
				throw("there must be a 'cameraName' in arguments!");
			}
			// 将camera 进行中文编码
			this.getCameras(
				function(camerasArray){
					for(var i=0; i<camerasArray.length; i++){
						var camera = camerasArray[i];
						if(camera.getName()==cameraName){
							onExist();
							return;
						}
					}
					if(typeof onNotExist == "function"){
						onNotExist();
					}
				},
				function(error){
					throw(error);
				},
				true
			);
		},
		
		/**@brief checkIdenticalModels 检查要要合并的数据是否相同
		   @param pathArray : 要合并的模型路径数组./content/users/admin/scenelib/scenexx/model/modelxxx
		   @param callback : 成功的回调函数
		   @param errorCallback : 失败的回调函数，可有可无的回调函数
		**/
		checkIdenticalModels : function(pathArray, callback, errorCallback){
			
			if(pathArray.length<2){
				console.error("pathArray length is 2 at least!");
				return;
				//throw("pathArray length is 2 at least!");
			}
			
			// 拼接路径
			var pathStrings = pathArray.join(",");
			var url = this.spnode.getFullpath() + ".checkIdenticalModels";
			// 请求数据
			var data = {};
			data["models"] = pathStrings; 
			// 发送ajax 请求
			xhr(url,{
				handleAs : "json",
				query : data,
				method : "GET"
			}).then(
				function(jsonData){
					console.log(jsonData);
					if(jsonData.suc=="true"){
						if(typeof(callback) == "function"){
							callback(jsonData);
						}else{
							throw("there must be a 'callback' parameter in arguments!");
						}
					}else if(jsonData.suc=="false"){
						if(typeof(errorCallback)=="function"){
							errorCallback(jsonData);
						}else{
							throw(jsonData);
						}
					}
				},	
				function(error){
					if(typeof(errorCallback)=="function"){
						errorCallback(error);
					}else{
						throw(error);
					}	
				}
			);
		},
		
		
		/**@brief mergeIdenticalModels 要合并的模型数据是否相同
		   @param pathArray : 要合并的模型路径数组./content/users/admin/scenelib/scenexx/model/modelxxx
		   @param callback : 成功的回调函数
		   @param errorCallback : 失败的回调函数，可有可无的回调函数
		**/
		mergeIdenticalModels : function(pathArray, callback, errorCallback){
			
			if(pathArray.length<2){
				console.error("pathArray length is 2 at least!");
				return;
				//throw("pathArray length is 2 at least!");
			}
			// 拼接路径
			var pathStrings = pathArray.join(",");
			var url = this.spnode.getFullpath() + ".mergeIdenticalModels";
			// 请求的数据
			var data = {};
			data["models"] = pathStrings;
			// 发送ajax 请求
			xhr(url,{
				handleAs : "json",
				query : data,
				method : "GET"
			}).then(
				function(jsonData){
					console.log(jsonData);
					if(typeof(callback) == "function"){
						callback(jsonData);
					}else{
						throw("there must be a 'callback' parameter in arguments!");
					}
					
				},	
				function(error){
					if(typeof(errorCallback)=="function"){
						errorCallback(error);
					}else{
						throw(error);
					}	
				}
			);
		},
		
		/**@brief setModelsPro 设置模型数组属性
		   @param args ： JSON 对象
				@code{.js}
					var args = {
						pathArray : [],// 模型数组全路径
						property : {   // 属性对象
							pro1 : value1,
							pro2 : value2
						},
						success : function(){}, // 成功的回调函数 
						failed : function(){}   // optional 失败的回调函数
					}
				@endcode
		**/
		setModelsPro : function(args){
			
			var pathsArray = args["pathsArray"];
			var pros = args["properties"];
			
			for(var i = 0 ;i<pathsArray.length; i++){
				var path = pathsArray[i].substring(pathsArray[i].lastIndexOf("/"));
				path = "model" + path;
				
				this.spsession.addNode({
					nodePath : path,
					property : pros
				});
			}
							
			this.spsession.save({
				success : function(){
					//console.log("nodeChild.addNode success");
					if(args["success"]&& (typeof args["success"]=="function")){
						args["success"]();
					}else{
						throw("args['success'] is undefined!");
					}
				},
				failed : function(){
					//console.log("nodeChild.addNode failed");
					if(args["failed"]&& (typeof args["failed"]=="function")){
						args["failed"]();
					}else{
						throw("setModelsPro is failed!");
					}
				}
			});
		},
		
		/**@brief createPreview : 通过效果图所在的磁盘路径进行preview 节点的创建
		   @param imgpath : 效果图路径 // /home/glue/share/repository/8155/a89d/bf31/405a/96fa/6f9b/24f8/6229/import/yamabu00013.jpg
		   @param callback : 成功的回调函数, 回调函数的中的参数为 创建的效果图路径
		   @param errorCallback : 失败的回调函数，可有可无
		**/
		createPreview : function(imgpath, callback, errorCallback){
			// 参数检测
			if(typeof imgpath == "undefined"){
				console.error("[ERROR]: imgpath is undefined!");
				return;
			}
			if(typeof callback == "undefined" || typeof callback != "function"){
				console.error("[ERROR]: callback is undefined ! or not function!");
				return;
			}
			// 拼接请求路径，以及请求数据
			var path = this.spnode.getFullpath();
			var url = path + ".createpreview";
			var data = {};
			data["imgpath"] = imgpath;
			xhr(url,{
				handleAs : "text",
				method : "GET",
				query : data
			}).then(
				function(previewpath){
					callback(previewpath);
				},
				function(error){
					if(errorCallback && typeof errorCallback == "function"){
						errorCallback(error);
					}
					console.error("[ERROR]: call createPreview occurs error!" + error);
					return;
				}
			);
		},
		
		/**@brief publishPreview : 发布效果图
		   @param imgpath : 效果图路径 // /home/glue/share/repository/8155/a89d/bf31/405a/96fa/6f9b/24f8/6229/import/yamabu00013.jpg
		   @param callback : 成功的回调函数
		   @param errorCallback : 失败的回调函数，可有可无
		**/
		publishPreview : function(imgpath, callback, errorCallback){
			// 参数检测
			if(typeof imgpath == "undefined"){
				console.error("[ERROR]: imgpath is undefined!");
				return;
			}
			if(typeof callback == "undefined" || typeof callback != "function"){
				console.error("[ERROR]: callback is undefined ! or not function!");
				return;
			}
			
			// 在个人效果图库下创建一个效果图节点
			// lang.hitch(this,
				this.createPreview(
					imgpath,
					function(path){
					    // path : /content/users/userxxx/previewlib/scenexxx/previewxxx
						console.log("[INFO]: createPreview path" + path);
						path = path.substring(0,path.lastIndexOf("/"));
						console.log(path);
						publish(
							path,
							function(suc){
								callback(suc);
							},
							null	
						);	
					},
					function(){
						if(errorCallback && typeof errorCallback == "function"){
							errorCallback(error);
						}
						console.error("[ERROR]: call publishPreview createPreview occurs error!" + error);
						return;
					}
				)
			// );
			
			// 将此效果图进行发布到云端效果图库下
			function publish(path,callback){
				
				folder_cls.publish("preview",{
					path : path,
					isPublishModel : "True",// 默认为"False"
					success : function(suc){
						callback(suc);
					},
					failed : function(error){
						console.error("[ERROR]: call publishPreview publish occurs error!" + error);
						return;
					}
				});
			}
			
		},
		
		// 下载当前场景的渲染文件.请使用download("ocs");
		// downloadRenderFile:function(){
			// url = this.spnode.getFullpath()
			// url += ".downrender";
			// return url;
		// },
		
		/**
		*获取该scene下面的jobs目录节点
		*@param type 		job管理器类型
		*@param callback 	回调函数，当jobs存在或者创建成功时，会返回该jobManager对象给该回调函数
		* 					否则什么也不传入。
		*@param isRealTime 	是否是实时通信的
		*/
		getJobManager:function(type,callback,isRealTime){
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
					case 'preview':{
						jobsNodeName="previewJobs";
						jobmanager_CLASS = PreviewJobManager;
						break;
					}
					default:{
						return;
					}
				}
			}
			var sceneObject=this;
			var sceneNode=sceneObject.getNode();
			var context_session=sceneNode.getSession();
			
			var	ensure_success=function(data){
				console.log('scene节点加载成功！');							
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
						jobs_node=sceneNode.addNode(jobsNodeInfo);
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
						sceneNode.save(args_createjobs);
					},
					checking : function(){
						console.log('正在检测是否存在'+jobsNodeName+'节点... ...');
					}
				};							
				data.hasNode(args_hasjobs);		
			};
			var	ensure_failed=function(){
				console.log('scene节点加载失败！');
				callback();
			};
			var args_ensurescene = {	
				ignoreCache : true,
				success : ensure_success,
				failed : ensure_failed,
				loading : function(){
					console.log('正在加载最新scene节点数据... ...');
				}
			};
			sceneNode.ensureData(args_ensurescene);
		}
	});	
	
	/**@brief 获取当前场景的所有预览图
	   @param scenepath : 给定的当前场景的路径
	   @param callback(arrayList) : 获得的数值以成功的回调函数的参数的形式返回数组。
	   @param errorCallback : 失败的回调函数，可有可无.
	*/
	retClass.getPreview = function(scenepath, callback, errorCallback){
		// 参数检测
		if(!scenepath){
			console.error("[ERROR]: scenepath is undefined!");
			return;
		}
		if(!callback || typeof callback != "function"){
			console.error("[ERROR]: callback is undefined! or not function!");
			return;
		}
		// 请求路径拼接
		var url = scenepath;
		url += ".previewlist";
		
		// 发送ajax 请求
		xhr(url,{
				handleAs : "json",
				method : "GET"
		}).then(
			function(data){
				if(data=="nopreview"){
					if(typeof errorCallback == "function"){
						errorCallback(data);
					}
				}
			    var previewList = [];
				for(var pre in data){
					// srcImage=preview.jpg&command=-resize&commandPara=200x10&destImage=preview.png
					//previewList.push(data[pre] +".image?srcImage=preview.jpg&command=-resize&commandPara=200x10&destImage=preview.jpg");
					// previewList.push(data[pre] +".image");
					var imagepath = data[pre];
					imagepath = image_cls.convert({
						"path" : imagepath,
						"width" : 235,
						"height" : 235
						
					});
					previewList.push(imagepath);
				}
				callback(previewList);
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
	return retClass;
});