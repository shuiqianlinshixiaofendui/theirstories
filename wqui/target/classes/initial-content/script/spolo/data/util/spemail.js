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
 
define("spolo/data/util/spemail",
[
	"dojo/_base/declare",
	"dojo/_base/lang"
],
function(
	declare,
	lang
)
{
	/**@brief email 用来处理email 相关资源
	**/
	var spemail = {
		
		/**@breif sendEmail 发送反馈email
		   @param formID : 客户端UI表单ID  	
		   @param args : JSON 格式的参数
				@code{.js}
					var args = {
						subject : "标题",(optional)
						target ： "收件人邮箱",(optional)
						content : "邮件内容",(optional)
						tel ： "反馈者联系电话",(optional)
						email ： "反馈者邮箱地址",(optional)
						success : function(){},		// 成功的回调函数
						failed : function(){}		// 失败的回调函数,(optional)
					}
				@endcode
		**/
		sendEmail : function(formID, args){
			
			// subject : 标题
			// target ： 收件人邮箱
			// content : 邮件内容
			// tel ： 反馈者联系电话
			// email ： 反馈者邮箱地址
			

			// 进行参数判断
			if(!args["success"] || typeof args["success"] != "function"){
				console.error("[email.sendEmail ERROR]: args['success'] is undefined or not function!");
				return;
			}
			
			if(!formID){
				console.error("[email.sendEmail ERROR]: formID is undefined!");
				return;
			}
			
			if(!args["subject"]){
				var subject = "用户反馈";
			}else{
				var subject = args["subject"];
			}

			if(!args["target"]){
				// TODO: 应该读取配置文件
				var target = "caobin@spolo.org";
			}else{
				var target = args["target"];
			}
			// TODO: email format validate
			if(!args["content"]){
				var content = "用户反馈信息为空！";
			}else{
				var content = args["content"];
			}
			
			if(typeof args["tel"] != "undefined" || args["tel"] != ""){
				var tel = args["tel"];
			}
			
			if(typeof args["email"] != "undefined" || args["email"] != ""){
     			var email = args["email"];
			}

			require(["dojo/request/iframe","dojo/dom"],lang.hitch(this,function(iframe,dom){
				
				var url = "/content/mail" + ".sendMail";
				
				var data = {};
				data["subject"] = subject;
				data["target"] = target;
				data["content"] = content;
				if(tel){
					data["tel"] = tel;
				}
				if(email){
					data["email"] = email;
				}
				
				
				iframe.post(url,{
					form : dom.byId(formID),
					data : data,
					handleAs : "json"
				}).then(
					function(suc){
						args["success"](suc);
					},
					function(error){
						if(args["failed"] && typeof args["failed"] == "function"){
							args["failed"](error);
							return;	
						}
						console.error("[email.sendEmail ERROR]:call sendEmail failed!",error);
						return;	
					}
				);
			}));

		}
		
	}
	return spemail;
});