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
 
define("spolo/data/queryClass",
[
	"dojo/_base/declare", 
	"spolo/data/spobject", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"dojo/request/xhr",
	"dojo/json"
],
function(
	declare, 
	spobject, 
	spsession,
	spnode,
	xhr,
	JSON
)
{

	var nodePath = "";
	/****************************************************************/
	/*******************私有方法*************************************/
	/****************************************************************/
	
	//添加条件
	function addCondition(conditionJSON,targetJSON){
		if(typeof(conditionJSON)=="object"){
			for(var key in conditionJSON){
				if(conditionJSON[key]){
					targetJSON[key] = conditionJSON[key] ; 
				}
			}
		}
	}
	
	//根据关键字AND OR 进行字符串的过滤 
	function fileterConditionByKeyword(keyString){
		var keyArray = {};
		
		// if(keyString.indexOf("AND")>0&&keyString.indexOf("OR")>0){
			// throw("search is't support 'AND' and 'OR' at one time");
		// }
		// if(keyString.indexOf("AND")>0){
				// keyArray["keyArray"] = keyString.split(/\s*AND\s*/);
				// keyArray["key"] = "and";
		// }else if(keyString.indexOf("OR")>0){
			// keyArray["keyArray"] = keyString.split(/\s*OR\s*/);
			// keyArray["key"] = "or";
		// }else{
			// keyArray["keyArray"] = [keyString];
			// keyArray["key"] = null;
		// }
		// return keyArray;
		
		if(keyString.indexOf("OR")>0){
			keyArray["keyArray"] = keyString.split(/\s*OR\s*/);
			keyArray["key"] = "or";
		}else if(keyString.indexOf(/\*/)){
			keyArray["keyArray"] = keyString.split(/\s+/);
			keyArray["key"] = "and";
		}else{
			keyArray["keyArray"] = [keyString];
			keyArray["key"] = null;
		}
		return keyArray;
	}
	
	//根据类别创建不同的条件语句
	function createConditionByType(str , key , valueString , type){
		switch(type){
			case 0 :
				str = "@" + key + "=\"" + valueString + "\","; //普通查询
				break ;
			case 1 :
				str ="jcr:like(fn:lower-case(" + "@" + key + "),\"%" + valueString.toLocaleLowerCase() + "%\")," ; //模糊查询
				break ;
			case 2 :
				str = "@" + key + "  " + valueString + ","; //排序
				break ;
				
			case 3 : 
				{
					var keys = fileterConditionByKeyword(valueString);
					
					if(keys["key"].length>0){
						if(keys["key"]){
							var keyword = keys["key"];
						}
						var keyArray = keys["keyArray"];
						for(var i = 0; i<keyArray.length; i++){
							str += "jcr:like(fn:lower-case(@" + key + "),";
							str += "\"%" + keyArray[i].toLocaleLowerCase() + "%\")"; //模糊查询
							if(i<keyArray.length-1){
								str +=" "+keyword+" ";
							}
						}
						str += ",";
					}else{
						str += "jcr:like(fn:lower-case(@" + key + "),";
						str += "\"%" + valueString[i].toLocaleLowerCase() + "%\"),"; //模糊查询
							
					}
				break;
				}
			case 4 : 
				{	
				    //console.log(key);
					//console.log(valueString);
					if(key=="startTime"){
						for(var key in valueString){
							str = "@"+key +">= xs:dateTime(\""+valueString[key]+"\"),";
							break;
						}
					}
					if(key=="endTime"){
						for(var key in valueString){
							str = "@"+key +"<= xs:dateTime(\""+valueString[key]+"\"),";
							break;
						}
					}
					break;
				}	
			default : 
				return  str;
		};
		return str ; 
	}
	
	//从JSON中获取条件语句
	function getConditionStringFromJSON(conditionJSON,type){
		var json = conditionJSON ; 
		var str = "";
		for(var key in json){
			str += createConditionByType.call(this,str,key,json[key],type);
		}
		str = str.substring(0,str.length-1);
		return str ; 
	}
	
	//组装条件语句
	function AssemblyCondition(args, str_filter , str_fuzzy_filter , str_keyword_filter, str_timeranges_filter, str_order){		
		// 根据args["isLocal"] 进行初始化查询语句
		if(!args["isLocal"]){
			var str_express = "/jcr:root" + nodePath + "//*";
		}else{
			var str_express = "/jcr:root" + nodePath + "/*";
		}
		//初始化查询语句
		// var str_express = "/jcr:root" + nodePath + "//*"; 
		//组装查询条件
		if(str_filter=="" && str_fuzzy_filter=="" && str_keyword_filter==""&&str_timeranges_filter==""){
			 str_express = "/jcr:root" + nodePath + "/*";
		}else{
			var filterArray = [];
			if(str_filter!=""){
				filterArray.push(str_filter);
			}
			if(str_fuzzy_filter!=""){
				filterArray.push(str_fuzzy_filter);
			}
			if(str_keyword_filter!=""){
				filterArray.push(str_keyword_filter);
			}
			if(str_timeranges_filter!=""){
				filterArray.push(str_timeranges_filter);
			}
			
			str_express += "[";
			for(var i=0;i<filterArray.length;i++){
				if(i<filterArray.length-1){
					str_express += filterArray[i] + ",";
				}else{
					str_express += filterArray[i];
				}
			}
			str_express += "]";
			
		}
		//组装排序条件
		if(str_order != "")
			str_express += " order by " +  str_order ; 
			
		return str_express;
	}
	
	//获取xpath语句
	function getExpression(args, filterJSON , fuzzyFilterJSON , keywordFilterJSON, timeRangesFilterJSON, orderJSON  ){ 
		
		//获取普通查询语句
		var str_filter =  getConditionStringFromJSON.call(this , filterJSON , 0) ;
		//获取模糊查询语句
		var	str_fuzzy_filter = getConditionStringFromJSON.call(this , fuzzyFilterJSON , 1) ; 
		//获取排序语句
		var str_order = getConditionStringFromJSON.call(this , orderJSON , 2);
		//获取关键字查询语句
		var str_keyword_filter = getConditionStringFromJSON.call(this , keywordFilterJSON , 3) ; 
		//获取时间范围查询语句
		var str_timeranges_filter = getConditionStringFromJSON.call(this , timeRangesFilterJSON , 4) ; 
		//组装条件语句
		var str_express = AssemblyCondition(args, str_filter , str_fuzzy_filter , str_keyword_filter, str_timeranges_filter,	str_order);
		
		return str_express ; 
	}
	
	
	//设置参数query方法的参数jsonArgs
	function setJSONArgs(args , filterJSON , fuzzyFilterJSON , keywordFilterJSON , timeRangesFilterJSON, orderJSON){
		var jsonArgs = {} ; 
		jsonArgs["language"] = "xpath" ; 
		jsonArgs["limit"] = "-1"; 
		jsonArgs["offset"] = "-1"; 
		if(args["nodePath"])
			nodePath = args["nodePath"] ;
		jsonArgs["nodePath"] =  nodePath  ; 
		jsonArgs["expression"] =  getExpression.call(this,	args,	filterJSON , fuzzyFilterJSON, keywordFilterJSON, timeRangesFilterJSON, orderJSON) ; 
		if(args["limit"])
			jsonArgs["limit"] =  args["limit"] ; 
		if(args["offset"])
			jsonArgs["offset"] =  args["offset"] ; 
		if(typeof(args["load"])=="function")
			jsonArgs["load"] = args["load"] ; 
		if(typeof(args["error"])=="function")
			jsonArgs["error"] = args["error"] ;
		return jsonArgs ; 
	}

  
	/****************************************************************/
	/*******************公有方法*************************************/
	/****************************************************************/
	
	var retClass =  declare("spolo/data/queryClass", [], {
	
		constructor : function()
		{
		}
		
    });
	
	/** @brief 动态查询,动态排序
		@param : args = { 
				nodePath:"", //节点路径(必写),
				timeRangesProperties : { // 按照时间范围进行排序
					startTime:{"jcr:created" : "2006-08-19T10:11:38.281+02:00"},
					endTime:{"jcr:created" : "2017-08-19T10:11:38.281+02:00"}
				}, 
				keywordProperties : { // 通过空格 和 OR 关键字进行查询
					"slig:resourceType":"",
				},
				fuzzyProperties : {  模糊查询的条件
					"sling:resourceType":"",
					"someProperty":""
				},
				properties:{
					"sling:resourceType":"",
					"someProperty":""
				},
				orderDesc:"",//降序
				orderAsc:"", //升序
				limit:"",
				offset:"",
				load : 查询成功执行的回调函数,
				error : 失败执行的回调函数
			}
	*/
	retClass.query = function(args){
	
		//存储查询条件的JSON
		var filterJSON = {} ; 
		//存储模糊查询的JSON
		var fuzzyFilterJSON = {} ;
		//添加关键字AND OR 查询的JSON
		var keywordFilterJSON = {};
		//存储时间范围的JSON
		var timeRangesFilterJSON = {}
		//存储排序条件的JSON
		var orderJSON = {} ;
	
		//设置查询条件
		addCondition.call(this,args["properties"] , filterJSON );
		//添加模糊查询条件
		addCondition.call(this,args["fuzzyProperties"] , fuzzyFilterJSON );
		//添加关键字AND OR 查询条件
		addCondition.call(this,args["keywordProperties"] , keywordFilterJSON );
		//添加按时间范围查询条件
		addCondition.call(this,args["timeRangesProperties"] , timeRangesFilterJSON );
		
	    //添加排序条件
		var orderBy ; 
		if(args["orderDesc"]){
			orderBy = args["orderDesc"] ;
			orderJSON[orderBy] = "descending" ; 
		}
		if(args["orderAsc"]){
			orderBy = args["orderAsc"] ;
			orderJSON[orderBy] = "ascending" ; 
		}
		
		//设置参数
		var option = setJSONArgs.call(this,args , filterJSON , fuzzyFilterJSON, keywordFilterJSON, timeRangesFilterJSON, orderJSON ) ; 
		//执行查询
		spsession.query(option);
		 
	}
	
	/**@brief executeXpath 直接执行xpath 语句
	   @param args : JSON 格式的参数
			@code{.js}
				var args = {
					expression : "", // 查询语句 "/jcr:root/content/users//*[jcr:contains(@jcr:createdBy,'admin')]"
					offset : "", // optional, 查询偏移量
					limit : "",  // optional, 查询长度
					orderDesc : "", // optional, 降序,与orederAsc 不能同时存在
					orderAsc : "",  // optional, 升序,与orderDesc 不能同时存在
					load : function(data){}, // 成功的回调函数 data["data"] data["totalNum"] 
					error : function(error){} // optional, 失败的回调函数
				}
			@endcode
	**/
	retClass.executeXpath = function(args){
		
		var queryArgs = {}
		queryArgs["nodePath"] = "/content/users";
		queryArgs["language"] = "xpath" ; 
	
		if(args["limit"]){
			queryArgs["limit"] =  args["limit"] ; 
		}else{
			queryArgs["limit"] = "-1"; 
		}	
		if(args["offset"]){
			queryArgs["offset"] =  args["offset"] ; 
		}else{
			queryArgs["offset"] = "-1"; 
		}	
		
		var orderJSON = {};
		
		var orderBy ; 
		if(args["orderDesc"]){
			orderBy = args["orderDesc"] ;
			orderJSON[orderBy] = "descending" ; 
		}
		if(args["orderAsc"]){
			orderBy = args["orderAsc"] ;
			orderJSON[orderBy] = "ascending" ; 
		}
		
		queryArgs["expression"] = args["expression"];
		
		if(orderJSON){
			queryArgs["expression"] += " order by " + "@" + orderBy + " " + orderJSON[orderBy]; 
		}
		
		queryArgs["load"] = function(data){
			if(args["load"]&&typeof args["load"] == "function"){
				args["load"](data);
				return;
			}
			console.error("[ERROR]: args['load'] is undefined! or not function!");
			return;
		}
		queryArgs["error"] = function(error){
			if(args["error"] && typeof args["error"] == "function"){
				args["error"](error);
				return;
			}
			console.error("[ERROR]: call executeXpath occures error!" + error);
			return;
		}
		spsession.query(queryArgs);
	}
	
	
	return retClass;
	
});