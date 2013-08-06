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
 
// 定义缓存数据操作模块"spolo/data/spcache"


define("spolo/data/spcache",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"spolo/data/spnode"
],
function(
	declare,
	xhr,
	spnode
)
{

	// check parse data
	function	checkParseData(func, data, type)
	{
		if(!data || typeof data != type)
		{
			throw(func + "() " + data + " is null or type of " + data + " is not " + type + " !");
		}
		
		var pathArray = data.split("/");
		return pathArray;
	}
	
	
	
    var retClass = declare("spolo/data/spcache",[],
	{
		
		/**
			数据管理对象构造函数:根据所传入的路径来加载数据
		*/
		constructor : function()
		{
			this.cache = {};
		},
		
		// 向缓存中添加一个节点，给一个节点路径，再给一个JSON。
		// 如果要添加的节点已经存在了，则更新节点相应的属性。
		// 所以，该方法可以理解为创建/更新缓存中的一个节点。
		createNode : function(/*string*/nodepath,/*可选参数*/json)
		{
			var pathArray = checkParseData("createNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			// 记录当前节点下的子节点
			var childNode;
			for(var index = 0; index < pathArray.length; index ++)
			{
				childNode = pathArray[index];
				if(!childNode)
				{
					// 如果子节点未定义，直接跳过
					continue;
				}
				if(!currentNode[childNode])
				{
					// 如果子节点不存在，则创建子节点
					currentNode[childNode] = {};
				}
				// 更新当前节点为子节点，然后继续向下遍历
				currentNode = currentNode[childNode];
			}
			if(json)
			{
				// 如果传入了 json 参数，那么更新指定路径的节点属性
				/** mixin方法会覆盖已经存在的属性*/
				dojo.mixin(currentNode,json);
			}
			
			// 返回创建/更新之后的节点
			return this.cache;
		},
		
		// 根据指定节点路径，从缓存中取节点。
		// 如果不存在，则返回null。
		getNode : function(nodepath)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++)
			{
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
			}
			return currentNode;
		},
			
		// 根据指定路径从缓存中移除一个节点。
		// 如果节点不存在则返回false;
		removeNode : function(nodepath)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			var delPath = pathArray.pop();
			var lastNode = this.cache;
			var child = null;
			
			// 取得要删除节点的父节点
			for(var index = 0; index < pathArray.length; index++)
			{
				child = lastNode[pathArray[index]];
				
				// 检查child是否有效，
				// 如果没有 child 则在缓存中创建之
				if( typeof(child) == "undefined" )
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
				lastNode = child;
			}
			
			// 删除节点
			delete lastNode[delPath];
			
			return this.cache;
		},
			
		// 根据指定节点路径和属性名称，修改节点的属性值。
		// 如果节点不存在,不创建，返回false;
		// 如果节点存在，属性不存在，则创建属性并赋值。
		// 所以，该方法可以理解为添加/更新缓存中节点属性。
		setProperty : function(nodepath,property,value)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++)
			{
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
			}
			
			if(property)
			{
				currentNode[property] = value;
			}
			
			return currentNode;
		},
			
		// 获取指定节点的属性值。
		// 如果节点或属性不存在，则返回null。
		getProperty : function(nodepath,property)
		{
			
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++)
			{
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
			}
			
			var value = undefined;
			if(property)
			{
				value = currentNode[property];
			}
			
			return value;
		},
			
		// 删除指定节点的指定属性。
		// 如果节点不存在则返回false;
		removeProperty : function(nodepath,property)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++){
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
			}
			
			if(property)
			{
				delete currentNode[property];
			}
			
			return this.cache;
		},
			
		// 检查缓存中是否有指定的节点，返回值为boolean类型。
		hasNode : function(nodepath)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++){
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return false;
				}
			}
			
			return true;
		},
			
		// 检查缓存中的指定节点是否包含指定属性，返回值为boolean类型。
		hasProperty : function(nodepath,property)
		{
			var pathArray = checkParseData("getNode", nodepath, "string");
			
			// 当前节点是缓存的根
			var currentNode = this.cache;
			for(var index = 0; index < pathArray.length; index ++){
				// console.log(currentNode[pathArray[index]])
				if(currentNode[pathArray[index]])
				{
					currentNode = currentNode[pathArray[index]];
				}
				else
				{
					// console.log(pathArray[index] + " has no child!!");
					return;
				}
			}
			
			var value = undefined;
			if(property)
			{
				value = currentNode[property];
			}
			
			return value != undefined;
		}
		
		
		
	});//dojo.declare

	return retClass; // 返回资源对象
	
});//define end