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
 
// 定义缓存数据操作模块"spolo/data/spjcr"


define("spolo/data/spjcr",
[
	"dojo/_base/declare",
	"dojo/request/xhr"
],
function(
	declare,
	xhr
)
{
	/**
		
	*/
	function checkData(func, data, type)
	{
		if(!data || typeof data != type)
		{
			throw(func + "() " + data + " is null or type of " + data + " is not " + type + " !");
		}
	}
	
	
	var retClass = declare("spolo/data/spjcr",[],
	{
		
		/**
			数据管理对象构造函数。
		*/   
		constructor : function()
		{
		},
		
		/**
			通过指定路径获得该路径指向的节点信息。
		*/
		getNode : function(resPath, onComplete, onError)
		{
			checkData("getNode", resPath, "string");
			var newPath = resPath + ".1.json";
			xhr(
				newPath,
				{
					handleAs : "json",
					method : "GET",
					sync : false
				}
			).then(
				function(data)
				{
					console.log("getNode Successful");
					onComplete(data);
				},
				function(error)
				{
					throw(error);
					onError(error);
				}
			);
		},
		
		/**
			通过指定路径和节点信息创建该路径指向的节点。
		*/
		createNode : function(resPath, jsonArg, onComplete, onError)
		{
			checkData("createNode", resPath, "string");
			if(typeof jsonArg == "undefined")
			{
				throw("createNode() jsonArg is undefined !");
			}
			
			xhr(
				resPath,
				{
					// handleAs : "json",
					method: "POST",
					data : jsonArg,
					sync : false
				}
			).then(
				function(data)
				{
					console.log("createNode Successful");
					var bool = true;
					onComplete(bool);
				},
				function(error)
				{
					// // console.log("createNode Failed");
					throw(error);
					onError(error);
				}
			);
		},
		
		
		/**
			通过指定路径删除该路径指向的节点。
		*/
		removeNode : function(resPath, onComplete, onError)
		{
			checkData("removeNode", resPath, "string");
			
			xhr(
				resPath,
				{
					// handleAs : "json",
					method: "POST",
					data : {
						":operation" : "delete"
					},
					sync : false
				}
			).then(
				function()
				{
					console.log("removeNode Successful");
					var bool = true;
					onComplete(bool);
					
				},
				function(error)
				{
					// // console.log("removeNode Failed");
					throw(error);
					onError(error);
				}
			);
		},
		
		/**
			通过指定路径和指定属性名称获得该路径指向的节点的该属性信息。
		*/
		getProperty : function(resPath, property, onComplete, onError)
		{
			checkData("getProperty", resPath, "string");
			checkData("getProperty", property, "string");
			
			this.getNode(
				resPath,
				function(data)
				{
					// // console.log("getProperty Successful");
					// // console.log(data[property]);
					onComplete(data[property]);
				},
				function(error)
				{
					// // console.log("getProperty Failed");
					throw(error);
					onError(error);
				}
			);
		},
		
		/**
			通过指定路径和指定属性以及该属性的类型、该属性的值
			设置该路径指向的节点的该属性信息。
		*/
		setProperty : function(resPath, property, resType, value, onComplete, onError)
		{
			checkData("setProperty", resPath, "string");
			checkData("setProperty", property, "string");
			checkData("setProperty", resType, "string");
			checkData("setProperty", value, "string");
			
			// data : 
			// {
				// sling:resourceType@TypeHint:String
				// sling:resourceType:folder
			// }
			
			var jsonArg = {};
			jsonArg[property + "@TypeHint"] = resType;
			jsonArg[property] = value;
			
			xhr(
				resPath,
				{
					method: "POST",
					data : jsonArg,
					sync : false
				}
			).then(
				function()
				{
					// // console.log("setProperty Successful");
					var bool = true;
					onComplete(bool);
				},
				function(error)
				{
					// // console.log("setProperty Failed");
					throw(error);
					onError(error);
				}
			);
		},
		
		/**
			通过指定路径和指定属性名称删除该路径指向的节点的该属性信息。
		*/
		removeProperty : function(resPath, property, onComplete, onError)
		{
			checkData("removeProperty", resPath, "string");
			checkData("removeProperty", property, "string");
			
			var jsonArg = {};
			jsonArg[property + "@Delete"] = "delete";
			
			xhr(
				resPath,
				{
					method: "POST",
					data : jsonArg,
					sync : false
				}
			).then(
				function()
				{
					// // console.log("removeNode Successful");
					var bool = true;
					onComplete(bool);
					
				},
				function(error)
				{
					// // console.log("removeNode Failed");
					throw(error);
					onError(error);
				}
			);
		},
		
		/**
			
		*/
		moveNode : function(oldPath, newPath, onComplete, onError)
		{
			
			checkData("moveNode", oldPath, "string");
			checkData("moveNode", newPath, "string");
			
			var _this = this;
			this.copyNode(
				oldPath,
				newPath,
				function()
				{
					_this.removeNode(oldPath, onComplete, onError);
				},
				function(error)
				{
					onError(error);
				}
			);
		},
		
		/**
			
		*/
		copyNode : function(oldPath, newPath, onComplete, onError)
		{
			checkData("copyNode", oldPath, "string");
			checkData("copyNode", newPath, "string");
			
			var _this = this;
			
			this.getNode(
				oldPath,
				function(data)
				{
					var newData = {};
					for(var index in data)
					{
						if(index != "jcr:created" && index != "jcr:createdBy")
						{
							newData[index] = data[index];
						}
						
					}
					_this.createNode(
						newPath,
						newData,
						onComplete,
						onError
					);
				},
				function(error)
				{
					// // console.log("getProperty Failed");
					throw(error);
					onError(error);
				}
			);
		}

	});//dojo.declare

	return retClass; // 返回资源对象

}); //define end



