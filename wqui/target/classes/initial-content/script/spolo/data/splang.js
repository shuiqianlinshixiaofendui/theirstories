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
 
// 定义缓存数据操作模块"spolo/data/splang"


define("spolo/data/splang",
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
		@brief 自定义一个 mixin 方法，不覆盖重名的属性
		// object spmixin(dest, source);
	**/
	function	spmixin(dest, source)
	{
		if(!dest)
		{
			dest = {};
		}
		var prop;
		for(prop in source)
		{
			if(dest[prop])
			{
				continue;
			}
			dest[prop] = source[prop];
		}
		return dest;
	}
	
    
    // object depthMixin(dest, source);
    function	depthMixin(dest, source)
	{
		if(!dest)
		{
			dest = {};
		}
		var prop;
		for(prop in source)
		{
			if(dest[prop])
			{
				if(typeof dest[prop] == "object")
				{
					depthMixin(dest[prop], source[prop]);
				}
				continue;
			}
			
			dest[prop] = source[prop];
		}
		return dest;
	}
    
	// object[] order(object[], field, desc); 
    function	order(objects, field, desc)
	{
		var flag = objects instanceof Array
		var children = [];
		console.log(flag);
		
		if(flag)
		{
			var result;
			if(desc)
			{
				//sheng
				result = objects.sort();
			}
			else
			{
				//jiang
				objects.sort();
				result = objects.reverse();
			}
			return result;
		}
		else
		{
			for(var index in objects)
			{
				objects[index]["index"] = index;
				children.push(objects[index][field]);
			}
			var result;
			if(desc)
			{
				//sheng
				result = children.sort();
			}
			else
			{
				//jiang
				children.sort();
				result = children.reverse();
			}
			return result;
		}
	}
	

	var retClass = declare("spolo/data/splang",[],
	{
	
		/**
			数据管理对象构造函数。
		*/   
		constructor : function(path)
		{
			this._path = path;
		},
		
		test : function()
		{
		
			var json1 =
			{
				"a" : "json1a",
				"b" : "json1b",
				"c" : "json1c",
				"e" : {
					"e1" : "json1e1",
				}
			};
			
			var json2 =
			{
				"a" : "json2a",
				"b" : "json2b",
				"d" : "json2d",
				"e" : {
					"e1" : "json2e1",
					"e2" : "json2e2"
				}
			};
			
			var json3 =
			{
				"a" : "json3a",
				"b" : "json3b",
				"d" : "json3d",
				"e" : {
					"e1" : "json3e1",
					"e2" : "json3e2",
					"f" : {
						"f1" : "json3f1",
						"f2" : "json3f2"
					}
				}
			};
			
			var arrayTest1 =[3, 1, 2, 4];			
			var arrayTest2 =["shafa1_3", "shafa1_1", "shafa1_2", "shafa1_4"];
			
			var jsonTest =
			{
				"b" : "json3b",
				"d" : "json3d",
				"a" : "json3a",
				"e" : {
					"e2" : "json3e2",
					"f" : {
						"f1" : "json3f1",
						"f2" : "json3f2"
					},
					"e1" : "json3e1"
				}
			};
			
			var json = {};
			json["index1"] = json1;
			json["index2"] = json2;
			json["index3"] = json3;
			
			var resultSpmixin = spmixin(json1, json3);
			console.log(resultSpmixin);
			
			
			console.log("");
			var resultDepthMixin = depthMixin(json2, json3);
			console.log(resultDepthMixin);
			
			
			console.log("");
			var resultOrderarray1 = order(arrayTest1, "", false);
			console.log(resultOrderarray1);
			
			
			console.log("");
			var resultOrderarray2 = order(arrayTest2, "", false);
			console.log(resultOrderarray2);
						
			
			console.log("");
			var resultOrder = order(json, "a", false);
			console.log(resultOrder);
			
		}
	
	});//dojo.declare

	return retClass;

}); //define end



