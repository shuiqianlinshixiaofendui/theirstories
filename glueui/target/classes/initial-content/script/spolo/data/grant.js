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
 
define("spolo/data/grant",
[
	"dojo/_base/declare", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"dojo/request/xhr",
	"dojo/json"
],
function(
	declare,  
	spsession,
	spnode,
	xhr,
	JSON
)
{
	
	/****************************************************************/
	/*******************全局变量*****************************************/
	/****************************************************************/
	
	//网站地址(WEB_ADDRESS : http://devvm.spolo.org)
	//var WEB_ADDRESS = window.location.href.split("/")[0] ;
	//groups地址(GROUP_ADDRESS : /system/userManager/group)
	var GROUP_ADDRESS = "/system/userManager/group" ;
	//users地址(USER_ADDRESS : /system/userManager/user)
	var USER_ADDRESS = "/system/userManager/user" ;
	
	
	/****************************************************************/
	/*******************私有方法*************************************/
	/****************************************************************/
	
	//获取members(可以使add或者delete的)
	function getMembers(membersArray){
		var newMemberArray = new Array();
		for(var i=0 ; i<membersArray.length ; i++ ){
			newMemberArray.push( USER_ADDRESS + "/"+ membersArray[i]) ;
			console.log(newMemberArray[i]);
		};
		return newMemberArray ;
	}
	
	//通过ajax调用sling的restful接口
	function ajaxToRestful(args){
		var url = args["url"] ; // restful接口
		var dataJSON = args["data"] ; //传入参数
		var method = args["method"]; //POST或者GET
		var handleAs = args["handleAs"]; //返回的参数类型(json或者html)
		xhr(url,{
				data : dataJSON,
			    method : method,
				handleAs : handleAs 
		}).then(
			function(data) {
				if(typeof(args["success"])=="function"){
					args["success"](data) ; 
				}else{
					throw("args[\"success\"] is undefined!"); 
				}
			},
			function(error) {
				if(typeof(args["failed"])=="function"){
					args["failed"](error) ; 
				}else{
					throw("args[\"failed\"] is undefined!"); 
				}
			}
		);
	}
	
	//设置传入参数args
	function setArgs(url , data , method , handleAs , propertyJSON){
		var args = {
			"url" : url ,
			"data" : data,
			"handleAs" : handleAs,
			"method" : method,
			"success" : propertyJSON["success"],
			"failed" : propertyJSON["failed"]
		};
		return args ; 
	}
	
	//验证传入参数非空
	function checkArgsNotNull(property , propertyJSON){
		if(propertyJSON[property]){
			return  propertyJSON[property] ;
		}else{
			return "";
		}
	}

	/****************************************************************/
	/*******************公有方法*************************************/
	/****************************************************************/
	
	var retClass =  declare("spolo/data/grant", [], {
	
		constructor : function()
		{
		},
		
    ////////////////////group操作///////////////////////////////////////
		
		/**@brief :list Groups
		 * @param : propertyJSON = {
				success : // 成功的回调函数,
				failed : // 失败的回调函数
			}
		*/
		listGroups : function(propertyJSON){
			var url =  GROUP_ADDRESS + ".tidy.1.json"; 
			var data = {} ;
			var handleAs = "json" ;
			var method = "GET";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		/**@brief :getGroup
		 * @param propertyJSON = {
				groupName : //权限组的名称
				success : // 执行成功的回调函数
				failed : //执行失败的回调函数
			}
		*/
		getGroup : function(propertyJSON){
			//验证参数非空
			var groupName = checkArgsNotNull("groupName" , propertyJSON ); 
			if(groupName == "") {
				if(typeof(propertyJSON["failed"])=="function"){
					propertyJSON["failed"]("groupName or groupName_CN is null") ; 
				}else{
					throw("propertyJSON[\"failed\"] is undefined!"); 
				}
				return ;
			}
			var url = GROUP_ADDRESS +"/"+groupName+".tidy.1.json" ; 
			var data = {};
			var method = "GET";
			var handleAs = "json";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		/**@brief :创建group
		 * @param : propertyJSON = {
				groupName : //group名 ,
				groupName_CN : //group中文名
				success :  sucessFunc , //成功的回调函数
				failed : failedFunc    //失败的回调函数
		 *	}
		 *
		*/
		creatGroup : function(propertyJSON){
			//验证传入参数非空.
			var groupName = checkArgsNotNull("groupName" , propertyJSON );
			var groupName_CN = checkArgsNotNull("groupName_CN" , propertyJSON );
			if(groupName == "" || groupName_CN == "") {
				if(typeof(propertyJSON["failed"])=="function"){
					propertyJSON["failed"]("groupName or groupName_CN is null") ; 
				}else{
					throw("propertyJSON[\"failed\"] is undefined!"); 
				}
				return ;
			}
			var url = GROUP_ADDRESS + ".create.html" ; 
			var data = {":name" : groupName , "chineseName" : groupName_CN , "_charset_" : "utf-8"};
			var method = "POST";
			var handleAs = "text";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		/**@brief :删除group
		 * @param : propertyJSON = {
				groupName : //group名 , 
				success :  sucessFunc ,
				failed : failedFunc 
		 *	}
		 *
		*/
		deleteGroup : function(propertyJSON){
			//验证传入参数非空.
			var groupName = checkArgsNotNull("groupName" , propertyJSON );
			if(groupName == "") {
				if(typeof(propertyJSON["failed"])=="function"){
					propertyJSON["failed"]("groupName is null") ; 
				}else{
					throw("propertyJSON[\"failed\"] is undefined!"); 
				}
				return ;
			}
			var url = GROUP_ADDRESS + "/"+groupName+".delete.html" ;
			var data = {} ; 
			var method = "POST";
			var handleAs = "text";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		/**@brief :修改group
		 * @param : propertyJSON = {
				groupName : group名 , 
				:member : 添加的users, 
				:@member@delete :  删除的users,
				sucess : sucessFunc , 
				failed : failedFunc 
		 *	}
		 *
		*/
		updateGroup : function(propertyJSON){
			//验证传入参数非空.
			var groupName = checkArgsNotNull("groupName" , propertyJSON );
			if(groupName == "") {
				if(typeof(propertyJSON["failed"])=="function"){
					propertyJSON["failed"]("groupName is null") ; 
				}else{
					throw("propertyJSON[\"failed\"] is undefined!"); 
				}
				return ;
			}
			var member = new Array() ;
			var memberDelete = new Array() ;
			if(typeof(propertyJSON[":member"])=="object"){
				member = getMembers.call(this,propertyJSON[":member"]);
			}
			if(typeof(propertyJSON[":member@Delete"])=="object"){
				memberDelete = getMembers.call(this,propertyJSON[":member@Delete"]);
			}
			var url = GROUP_ADDRESS + "/"+groupName+".update.html" ; 
			var data = {":member" : member , ":member@Delete" : memberDelete };
			var method = "POST";
			var handleAs = "text";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		
		///////////////////////////用户操作/////////////////////////////////////
		
		/**@brief :list users
		 * @param : propertyJSON = {
				success : // 成功的回调函数,
				failed : // 失败的回调函数
			}
		*/
		listUsers : function(propertyJSON){
			var url = USER_ADDRESS + ".tidy.1.json" ; 
			var data = {} ;
			var method = "GET";
			var handleAs = "json";
			//设置参数
			var args = setArgs.call(this,url , data ,method , handleAs , propertyJSON );
			//调用Ajax方法
			ajaxToRestful.call(this,args);
		},
		
		/**@brief : getGroupNameArrByUserName
		 * @param : userName // 编码后的用户名
		 * @param : callback // 成功的回调函数
		*/
		getGroupNameArrByUserName : function(userName , callback , errorCallback){
			var groupNameArr = [] ; 
			if(userName)
				userName = USER_ADDRESS + "/" +  userName;
			
			var listGroupArgs = {
				"success" : function(json){
					//便利所有的group
					for(var key in json){
						//便利Group中的members
						var members = json[key]["members"] ; 
						for(var index in members){
							if(userName == members[index]){
								//判断组是不是有中文名
								if(json[key]["chineseName"])
									groupNameArr.push(json[key]["chineseName"]);
								else
									groupNameArr.push(key);
							}
						}
					}
					if(typeof(callback)=="function"){
						callback(groupNameArr);	
					}else{
						return groupNameArr;
					}
				},
				"failed" : function(error){
					if(typeof(errorCallback)=="function"){
						errorCallback(error);
					}
				}
			};
			this.listGroups(listGroupArgs);
		},
		
		
		/**@brief : resetUserPwd(重置用户密码)
		 * @param args = {
				userName : //用户名
				newPwd   : //新密码
				newPwdConfirm : 新密码重置
				success  : //执行成功的回调函数
				failed   : //执行失败的回调函数
		 };
		*/
		changePwd : function(args){
			// 参数的判断
			if(!args["userName"]||!args["newPwd"]||!args["newPwdConfirm"]){
				console.error("[ERROR] : please input userName or new password or new password confirm ");
				return;
			}	
			if(args["newPwd"] != args["newPwdConfirm"]){
				console.error("[ERROR]: New Password does not match the confirmation password");
				return;
			}
			if(!args["success"]|| typeof args["success"] != "function"){
				console.error("[ERROR]: args['success'] is undefined! or not function!");
				return;
			}
			// 参数的获取	
			var userName = args["userName"];
			userName = Spolo.encodeUname(userName);
			var newPassWord = args["newPwd"];
			var newPassWordConfirm = args["newPwdConfirm"];
			
			var url = "/system/userManager/user/" + userName + ".changePassword.html";
			var data = {
				"newPwd" : newPassWord,
				"newPwdConfirm" : newPassWordConfirm
			};
			var method = "POST";
			var handleAs = "html";
			//设置参数
			//var argsJSON = setArgs.call(this,url , data ,method , handleAs , args );
			//调用Ajax方法
			//ajaxToRestful.call(this,argsJSON);
			
			xhr(url,{
				handleAs : handleAs,
				method : method,
				data : data
			}).then(
				function(data){
					args["success"](data);
				},
				function(error){
					if(args["failed"] && typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					console.error("[ERROR]:call changePwd occurs error！" + errror);
					return;
				}
			);
		},
		
		/////////////////权限操作//////////////////////////////////////////////////
		
		/**@brief :设置权限
		 * @param : propertyJSON = {
				nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib)
				principalId : 权限组的名称, 
				grantName : 权限名称(比如jcr:write : 删除与编辑节点的权限),
				grantValue : 权限值(比如granted : 允许该权限,dennis : 拒绝该权限 , none : 取消该权限).
				sucess : sucessFunc , 
				failed : failedFunc 
		 *	}
		 *
		*/
		setPermissions : function(args){
			var path = args["nodePath"] ;
			var principalId = args["principalId"] ; 
			var grantName = args["grantName"]; 
			var grantValue = args["grantValue"];
			var url =  path + ".modifyAce.html";
			var data_str = "{\"principalId\":"+"\""+principalId+"\",\"privilege@"+grantName+"\":"+"\""+grantValue+"\"}";
			var data = JSON.parse(data_str);
			var method = "POST";
			var handleAs = "html";
			//设置参数
			var argsJSON = setArgs.call(this,url , data ,method , handleAs , args );
			//调用Ajax方法
			ajaxToRestful.call(this,argsJSON);
			
		},
		
		/**@brief :设置权限
		 * @param : propertyJSON = {
				nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib)
				principalId : 权限组的名称, 
				grant : 权限值(比如:1是只读; 2编辑属性; 3管理员;).
				success : sucessFunc , 
				failed : failedFunc 
		 *	}
		 *
		*/
		setGroupPermissions : function(args){
			var path = args["nodePath"] ;
			var principalId = args["principalId"]; 
			var grant = args["grant"];
			var url = path + ".grant";
			var content = {};
			content["uname"] = principalId;
			content["grant"] = grant;
			xhr(url,{
				handleAs : "text",
				data: content,
				method : "POST"
			}).then(
				function(){
					if(args["success"]&&
						(typeof args["success"] == "function")){
						args["success"]();
					}
				},	
				function(error){
				    if(args["failed"]&&
						(typeof args["failed"] == "function")){
						args["failed"](error);
					}else{
						throw(error);
					}
				}
			);      
		},
		
		/**@brief setUsersPermissions 对多个用户赋予权限 "/content/modellib.grant?users=user1,user2&grant=2"
		   @param args : json 格式的参数
				@code{.js} 
					var args = {
						nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib)
						users : 用户名称数组  
						grant : 权限值(比如:1是只读; 2编辑属性; 3管理员;).
						success : sucessFunc , 
						failed : failedFunc 
					}
				@endcode
		**/
		setUsersPermissions : function(args){
		    // 输入参数的判断
			if(!args["nodePath"]||!args["users"]||!args["grant"]||!args["success"]){
				console.error("[ERROR]:args['nodePath'] or args['users'] or args['grant'] or args['success'] is undefined!");
				return;
			}
			var path = args["nodePath"] ;
			var users = args["users"];			
			var grant = args["grant"];
			var users = users.join(",");
			var url = path + ".grant";
			var content = {};
			content["users"] = users;
			content["grant"] = grant;
			// 发送ajax 请求
			xhr(url,{
				handleAs : "text",
				data: content,
				method : "POST"
			}).then(
				function(){
					if(typeof args["success"] == "function"){
						args["success"]();
						return;
					}
				},	
				function(error){
				    if(typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}else{
						//throw(error);
						console.error("[ERROR]: call setUsersPermissions occurs wrong" + error);
						return;
					}
				}
			);      
		},
		
		/**@brief :删除权限
		 * @param : args = {
				nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib),
				applyTo : 使用该权限的用户或者组的名称数组
				success : // 成功的回调函数,
				failed : // 失败的回调函数
			}
		*/
		deletePermissions : function(args){
			var path = args["nodePath"] ;
			var applyTo = args[":applyTo"] ;
			var url = path + ".deleteAce.html" ;
			var data = {":applyTo" : applyTo};
			var method = "POST";
			var handleAs = "html";
			//设置参数
			var argsJSON = setArgs.call(this,url , data ,method , handleAs , args);
			//调用Ajax方法
			ajaxToRestful.call(this,argsJSON);
		},
		
		/**@brief : 获取权限
		 * @param : args = {
				nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib),
				success : // 成功的回调函数,
				failed : // 失败的回调函数
			}
		*/
		getPermissions : function(args){
			var path = args["nodePath"] ;
			var url = path + ".acl.json" ;
			var data = {} ;
			var method = "GET";
			var handleAs = "json";
			//设置参数
			var argsJSON = setArgs.call(this,url , data ,method , handleAs , args);
			//调用Ajax方法
			ajaxToRestful.call(this,argsJSON);
		},
		
		/**@brief getUserPermissions 获取用户的权限
		   @param args ： JSON 格式的参数
				@code{.js}
					var args = {
						
					}
				@endcode
		**/
		getUserPermissions : function(args){
			 // 输入参数的判断
			if(!args["user"]||!args["success"]){
				console.error("[ERROR]:args['user'] or args['success'] is undefined!");
				return;
			}
			// 请求路径拼接
			var user = args["user"];
			user = Spolo.encodeUname(user);
			var url = "/content/users" + ".permission";
			var content = {};
			content["user"] = user;
			// 发送ajax 请求
			xhr(url,{
				handleAs : "json",
				query: content,
				method : "GET"
			}).then(
				function(jsonData){
					if(typeof args["success"] == "function"){
						args["success"](jsonData);
						return;
					}
				},	
				function(error){
				    if(args["failed"] &&　typeof args["failed"] == "function"){
						args["failed"](error);
						return;
					}
					
					console.error("[ERROR]: call getUsersPermissions occurs wrong ！" + error);
					return;
					
				}
			);      
		
		}
    });
	return retClass;	
});