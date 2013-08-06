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
 
define("spolo/data/grantManager",
[
	"dojo/_base/declare", 
	"spolo/data/spsession",
	"spolo/data/spnode",
	"spolo/data/grant",
	"dojo/request/xhr",
	"dojo/json"
],
function(
	declare,  
	spsession,
	spnode,
	grant,
	xhr,
	JSON
)
{
	
	

	/****************************************************************/
	/*******************公有方法*************************************/
	/****************************************************************/
	var retClass =  declare("spolo/data/grantManager", [], {
	
		constructor : function()
		{
		}
    });
	retClass.grant = new grant();
	
	////////////////////group操作///////////////////////////////////////
	/**@brief :列举所有的权限组
		* @param : propertyJSON = {
			success : // 成功的回调函数,
			failed : // 失败的回调函数
		}
	*/
	retClass.listGroups = function(propertyJSON){
		retClass.grant.listGroups(propertyJSON);
	},
		
	/**@brief :根据名称获取权限组
		* @param propertyJSON = {
			groupName : //权限组的名称
			success : // 执行成功的回调函数
			failed : //执行失败的回调函数
		}
	*/
	retClass.getGroup = function(propertyJSON){
		retClass.grant.getGroup(propertyJSON);
	},
		
	/**@brief :创建权限组
		* @param : propertyJSON = {
			groupName : //group名 ,
			groupName_CN : //group中文名
			success :  sucessFunc , //成功的回调函数
			failed : failedFunc    //失败的回调函数
		*	}
		*
	*/
	retClass.creatGroup = function(propertyJSON){
		retClass.grant.createGroup(propertyJSON);
	},
		
	/**@brief :删除权限组
		* @param : propertyJSON = {
			groupName : //group名 , 
			success :  sucessFunc ,
			failed : failedFunc 
		*}
		*
	*/
	retClass.deleteGroup = function(propertyJSON){
		retClass.grant.deleteGroup(propertyJSON);
	},
		
	/**@brief :修改权限组
		* @param : propertyJSON = {
			groupName : group名 , 
			:member : 添加的users, 
			:@member@delete :  删除的users,
			sucess : sucessFunc , 
			failed : failedFunc 
		*}
		*
	*/
	retClass.updateGroup = function(propertyJSON){
			retClass.grant.updateGroup(propertyJSON);
	},
	
	/**@brief :根据groupName获取该group的权限范围(jcr的节点)
	 * @param : propertyJSON = {
			groupName : group名 , 
			sucess : sucessFunc , 
			failed : failedFunc 
	 *	}
	 *
	*/
	retClass.getNodePathArrByGroupName = function(propertyJSON){
		
		// var groupName = propertyJSON["groupName"];//需要要验证非空
		// var nodePathArr = []; //存储content下所有子节点,暂时先存3个子节点
		// var newNodePathArr = []; //存储该group作用的所有节点的path
		// var modellib = "/content/modellib" ; 
		// var previewlib = "/content/previewlib";
		// var materiallib = "/content/materiallib";
		// nodePathArr.push(modellib , previewlib , materiallib ) ;
		
		////循环遍历所有节点,获取作用于该节点的groups
		// for(var i=0 ; i<nodePathArr.length ; i++ ) {
			// var args = {
				// "nodePath" : nodePathArr[i],
				// "success" : function(json){
					////循环遍历json
					// for(var key in json){
						// if(groupName == json[key]){
							// newNodePathArr.push(nodePathArr[i]);
						// }
					// }
				// },
				// "failed" : function(error){
					// if(typeof(propertyJSON["failed"])=="function"){
						// propertyJSON["failed"](error) ; 
					// }else{
						// throw("propertyJSON[\"failed\"] is undefined!"); 
					// }
				// }
			
			// };
			// this.getPermissions(args);
		// }
		// if(typeof(propertyJSON["success"]=="function")){
			// propertyJSON["success"](newNodePathArr);
		// }else{
			// return newNodePathArr;
		// }
	},
				
	///////////////////////////用户操作/////////////////////////////////////
	/**@brief :列举所有用户
	 * @param : propertyJSON = {
			success : // 成功的回调函数,
			failed : // 失败的回调函数
		}
	*/
	retClass.listUsers = function(propertyJSON){
		retClass.grant.listUsers(propertyJSON);
	},
	
	/**@brief : getGroupNameArrByUserName
	 * @param : userName // 编码后的用户名
	 * @param : callback // 成功的回调函数
	*/
	retClass.getGroupNameArrByUserName = function(userName , callback , errorCallback){
		retClass.grant.getGroupNameArrByUserName(userName,callback , errorCallback);
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
	retClass.changePwd = function(args){
		retClass.grant.changePwd(args);
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
	retClass.setPermissions = function(args){
		retClass.grant.setPermissions(args);
		
	},
	
	/**@brief :删除权限
	 * @param : args = {
			nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib),
			applyTo : 使用该权限的用户或者组的名称数组
			success : // 成功的回调函数,
			failed : // 失败的回调函数
		}
	*/
	retClass.deletePermissions = function(args){
		retClass.grant.deletePermissions(args);
	},
		
	/**@brief : 获取权限
	 * @param : args = {
			nodePath : 权限组操作的节点的路径,(比如modellibGroup : /content/modellib),
			success : // 成功的回调函数,
			failed : // 失败的回调函数
		}
	*/
	retClass.getPermissions = function(args){
		retClass.grant.getPermissions(args);
	}
	return retClass;	
});