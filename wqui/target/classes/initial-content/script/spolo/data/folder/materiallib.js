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
 
define("spolo/data/folder/materiallib",
[
	"dojo/_base/declare",
	"dojo/request/xhr",
	"dojo/_base/lang",
	"spolo/data/queryClass",	
	"spolo/data/folder",
	"spolo/data/util/image"
],
function(
	declare, 
	xhr,
	lang,
	queryClass,
	folder,
	image_cls
)
{
	var retClass = declare("spolo.data.folder.materiallib", [folder], {
	
		constructor : function(path)
		{
			this.ref = null;
		}
		
	});	
	
	/**@brief createMaterial : 上传一个material
	   @param formID : form 表单ID
	   @param option ： JSON 格式的参数
			@code{.js}
				var option = {
					name : "", // 材质名称
					type : "", // 材质分类
					keyInfo : "",       // 关键字
					introduction : "" , // 材质描述
					load : function(data){},	// 成功的回调函数
					error : function(error){}   // 失败的回调函数
				
				}
			@endcode
	**/
	retClass.createMaterial = function(formID, option){
		// 参数判断
		if(!formID){
			console.error("[ERROR]: formID is undefined!");
			return;
		}
		if(!option){
			console.error("[ERROR]: option is undefined!");
			return;
		}
		if(!option.name){
			console.error("[ERROR]: option.name is undefined!");
			return;
		}
		
		if(!option.load || typeof option.load != "function"){
			console.error("[ERROR]: option.load is undefined! or not function!");
		}
		// require iframe
		require(["dojo/request/iframe","dojo/dom"], 
			lang.hitch(this,function(iframe,dom){
				var data = {};
				var handleAs = "json";
				data["useNginx"] = true;
				var notify_func_name = null;
				//指定了通知notifier并且不支持断点上传.
				if(option && option.notifier && !option.resumable )
				{
					data["useNginx"] = false;
					if(typeof option.notifier == "function")
					{
						notify_func_name = "_sp_material_notifier_" + notifier_seq;
						notifier_seq++;
						window[notify_func_name] = function(msg){
							option.notifier(msg);
						}
						data["notifier"] = "window.parent." + notify_func_name;
					}else{
						data["notifier"] = "window.parent." + option.notifier;
					}
				}
				
				if(option && option.debug)
				{
					data["debug"] = option.debug;
					handleAs = "text";
				}
				
				if(option && option.handleAs)
				{
					handleAs = option.handleAs;
				}
				
				var	url;
				
				var path = "/content/materiallib"
				
				if(data["useNginx"])
				{//使用nginx.
					url = "/upload";
					data["spi_target"] = path + ".createMaterial";
				}else{
					url = path + ".createMaterial";
				}
				
				data["matname"] = option.name;
				
				if(option && typeof option.type != "undefined"){
					data["mattype"] = option.type;
				}
				
				if(option && typeof option.keyInfo != "undefined"){
					var keyInfo = option.keyInfo;
					keyInfo = Spolo.inputEncode(keyInfo);
					data["keyInfo"] = keyInfo;
				}
				
				if(option && typeof option.introduction != "undefined"){
					var introduction = option.introduction;
					introduction = Spolo.inputEncode(introduction);
					data["introduction"] = introduction;
				}
				
				iframe(url,{
					form: dom.byId(formID),
					method : "POST",
					data : data,
					handleAs: handleAs
				}).then(
					function(data){
					
						if(notify_func_name)
							delete window[notify_func_name];
						// 成功的回调函数
						option.load(data);
					
					},
					function(error){
						if(notify_func_name)
							delete window[notify_func_name];
						if(option && option.error && typeof option.error == "function")
						{
							option.error(error);
							return;
						}
						console.error("[ERROR]: call createMaterial occurs error" + error);
						return;
					}
				
				);// iframe end
			})// dojohitch end
		);// require end	
	}
	
	/**@brief searchMaterial : 执行对/content/materiallib/ 下的材质的搜索功能
	   @param args ： JSON 格式的参数
			@code{.js}
				var args = {
					fuzzyProperties : {
						resourceName : "",	
						keyInfo : "",
						introduction : "",
						categoryName : ""
					},
					term : "", // 查询条件
					limit : 5, // 分页，每页显示的个数(optional)
					offset ：0, // 分页，每页的第一个数据位置(optional)
					orderDesc ："", // 按什么样的条件将查询结果进行排序, 降序(同升序2选1)(optional)
					orderAsc : "",  // 按什么样的条件将查询结果进行排序, 升序(同降序2选1)(optional)
					success : function(data){},	// 成功的回调函数, 参数为获取的材质数据
					failed : function(error){}	// 失败的回调函数, 参数为错误信息(optional)
				}
			@endcode
	**/
	retClass.searchMaterial = function(args){
		
		// 参数判断
		
		if(!args["success"] || typeof args["success"] != "function"){
			console.error("[ERROR]: args['success'] is undefined! or not function!");
			return;
		}
		
		// limit = -1 查询全部
		if(typeof args["limit"] == "undefined"){
			
			var limit = -1;			
		}else{
			var limit = args["limit"];
		}
		if(typeof args["offset"] == "undefined"){
		
			var offset = 0;
		
		}else{
			var offset = args["offset"];
		}
		var expression = "/jcr:root/content/materiallib/*[jcr:contains(@sling:resourceType,'material')]";
		// jcr:like(fn:lower-case(" + "@" + key + "),\"%" + valueString.toLocaleLowerCase() + "%\"),"
		// 查询参数
		var queryArgs = {
			// nodePath : "/content/materiallib",	// 现在只是查询云端的材质库
			// isLocal : true,
			// fuzzyProperties : {
				// "sling:resourceType" : "material"
			// },
			limit : limit,
			offset : offset,
			load : function(data){
				if(typeof data == "object" && data["totalNum"] >= 0){
					
					for(var _data in data["data"]){
						// 添加上图片路径
						var imgpath = _data + ".preview";
						data["data"][_data]["preview"]= imgpath;
						// 对keyInfo 和introduction 进行Spolo.inputDecode() 
						if(typeof data["data"][_data]["keyInfo"] != "undefined"){
							var keyInfo = data["data"][_data]["keyInfo"];
							keyInfo = Spolo.inputDecode(keyInfo);
							data["data"][_data]["keyInfo"] = keyInfo;
						}
						
						if(typeof data["data"][_data]["introduction"] != "undefined"){
							var introduction = data["data"][_data]["introduction"];
							introduction = Spolo.inputDecode(introduction);
							data["data"][_data]["introduction"] = introduction;
						}
					}
					// 将数据返回
					args["success"](data);
					return;
				}
			},
			error : function(error){
				if(args["failed"] && typeof args["failed"]=="function"){
					args["failed"](error);
					return;
				}
				console.error("[ERROR]: call searchMaterial occurs error"+error);
				return;
					
			}
		};
		// 拼接查询条件 降序或者升序
		if( args["orderAsc"]!=undefined&& args["orderDesc"]!=undefined){
			console.error("[ERROR]: args['orderAsc'] and args['orderDesc'] must't exist at one time!");
			return;
		}else if( args["orderAsc"]!=undefined&& args["orderDesc"]==undefined){
			var orderAsc = args["orderAsc"];
			queryArgs["orderAsc"] = orderAsc;
		}else if( args["orderAsc"]==undefined && args["orderDesc"]!=undefined){
			var orderDesc = args["orderDesc"];
			queryArgs["orderDesc"] = orderDesc;
		}else{
			queryArgs["orderDesc"] = "jcr:created";
		}
		if(typeof args["fuzzyProperties"] != "undefined"){
			
			for(var condition in args["fuzzyProperties"]){
				//queryArgs["fuzzyProperties"][condition] = args["fuzzyProperties"][condition];
				var valueString = args["fuzzyProperties"][condition];
				console.log(valueString);
				valueString = valueString.toLocaleLowerCase();
				expression = expression.substring(0,expression.lastIndexOf("]"));
				expression += ",jcr:like(fn:lower-case(" + "@" + condition + "),\"%" + valueString + "%\")]";
				
			}
			// expression = expression.substring(0,expression.lastIndexOf(","));
			// console.log(expression);
		}
		//console.log(args["term"]);
		if( args["term"] != undefined){
			var term = args["term"];
			term = term.toLocaleLowerCase();
			expression = expression.substring(0,expression.lastIndexOf("]"));
			expression += ",jcr:like(fn:lower-case(@resourceName),\"%" + term + 
			"%\") or jcr:like(fn:lower-case(@keyInfo),\"%" + term + 
			"%\") or jcr:like(fn:lower-case(@introduction),\"%" + term + 
			"%\") or jcr:like(fn:lower-case(@publishAuthor),\"%" + Spolo.encodeUname(term) + 
			"%\")]";
			// console.log(expression);
		}
		queryArgs["expression"] = expression;
		console.log("materiallib.searchMaterial expression",expression);
		// 执行查询
		// queryClass.query(queryArgs);
		queryClass.executeXpath(queryArgs);
	}
	
	return retClass;
})