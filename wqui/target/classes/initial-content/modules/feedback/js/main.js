/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: spolo@spolo.org
 *  
 *  author		 : 	xxx@spolo.org
 *  wiki  		 : 	这里是对应的wiki地址
 *  description  : 	这里是功能描述
 **/

/** 当前js文件的私有方法
	写在这里的方法子窗口或其他js文件中是调用不到的。
*/
(function(){
	// 这里声明了存放widget的容器ID
	var custom;
	var subBtn;
	function getUploadFileContain(){
		var uploadFileContainNode;
		var dom = require("dojo/dom");
		uploadFileContainNode = dom.byId("uploadFileContain");	
		return uploadFileContainNode;
	}
	function getSubBtnNode(){
		return subBtn;
	}
	function getContentNode(){
		var contentNode;
		var dom = require("dojo/dom");
		contentNode = dom.byId("content_1");
		return contentNode;
	}
	function getTelNode(){
		var telNode;
		var dom = require("dojo/dom");
		telNode = dom.byId("phone");
		return telNode;
	}
	function getEmailNode(){
		var emailNode;
		var dom = require("dojo/dom");
		emailNode = dom.byId("email");
		return emailNode;
	}

	// 初始化页面中的控件
	function initUi(){
		require(["dojo/on","widgets/Button/main","dojo/dom"],function(on,GBtn,dom){
			var json1 = {
				style: "combination_style",
				buttonNumber:1,
				button_size:{
					"height":"25px",
					"width":"100px"
				},
				font:{
					"title":["提交问卷"],
					"fontSize":"12px",
					"fontWeight":"bolder"
				}
			};
			var submitFormNode = dom.byId("submitForm");
			subBtn = new GBtn(json1).placeAt("submitForm");
			subBtn.onClick = on(subBtn,"click",function(){
				console.log("!!!!!!!!btn1 click");
				//uploadFeed();
				var userFeed = getUserFeed();
				sendFeed(userFeed);
			})
			
			var adFile = {
				style: "combination_style",
				buttonNumber:1,
				button_size:{
					"height":"25px",
					"width":"100px"
				},
				font:{
					"title":["添加文件"],
					"fontSize":"12px",
					"fontWeight":"bolder"
				}
			}
		});
	}
	// 绑定控件的事件
	function initEvent(){
		require(
			[
				"dojo/on",
				"dojo/dom",
				
			],
			function(on, dom){
				var addFileNode = dom.byId("addFile");
				var uploadFileContainNode = getUploadFileContain();
				on(addFileNode,"click",function(evt){
					//addFile(uploadFileContainNode);
					creSleFile();
				})
			}
		);
	}
	require(
		[
			"dojo/on",
			"dojo/ready",
			
		],
		function(on, ready){
			ready(function(){
				initUi();
				initEvent();
			});
			
		}
	);
	
	/**	处理某某控件的某某事件
	*/
	function widgetTemplateReady(){
		// 这里根据API来进行逻辑处理
		console.log("widgetTemplateReady");
	}
	//
	//添加一个文件
	function addFile(containNode,fileNode){
		require(["dojo/dom-construct"],function(domConstruct){
			var row = domConstruct.create("div",{className:"table-row"},containNode);
			var tablecellL = domConstruct.create("div",{className:"table-cell"},row);
			var delA = domConstruct.create("a",
							{
								className:"icon del",
								href:"javascript:void(0)",
								onclick:function(evt){
									cancelFile(evt.currentTarget);
								}
							},
						tablecellL);
			function getFileName(fileNode){
				var filename = "";
				if(fileNode){
					var fullPath = fileNode.value;
					if (fullPath) {
						var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
						var filename = fullPath.substring(startIndex);
						if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
							filename = filename.substring(1);
						}
					}					
				}
				return filename;
			}
			var fileName = getFileName(fileNode);
			var fileNameNode = domConstruct.create("span",{className:"filename",title:fileName,innerHTML:fileName},tablecellL);
			var tablecellR = domConstruct.create("div",{className:"table-cell"},row);
			if(fileNode){
				domConstruct.place(fileNode,row,"last");
			}
			var inpt = domConstruct.create("input",
							{
								className:"describe",
								name:"describe[]",
								placeHolder:"添加描述"
							},tablecellR);
			/* var tableRow = "<div class=\"table-row\">"
							+	"<div class=\"table-cell">
							+		"<a class=\"icon del\" href=\"javascript:void(0)\"></a>"
							+		"<span class=\"filename\" title=\"\">jax.png</span>"
							+	"</div>"
							+	"<div class=\"table-cell\">"
							+		"<input class=\"describe\" name=\"describe[]\" placeHolder=\"添加描述\"></input>"
							+	"</div>"
							+"</div>"; */
		});
		
		
	}
	function creSleFile(){
		require(["dojo/dom-construct"],function(domConstruct){
			var inpt = domConstruct.create("input",
						{
							type:"file",
							style:{display:"none"},
							size:"1",
							className:"",
							name:"upload_file[]",
							onclick:function(){
								document.body.onfocus = function(){
									if(inpt.value.length) {
										//alert('ROAR! FILES!')
									}
									else {
										domConstruct.destroy(inpt);//alert('*empty wheeze*')
									}
									document.body.onfocus = null
									console.log('depleted')
								}
								console.log('chargin')
							},
							onchange:function(evt){
								var uploadFileContainNode = getUploadFileContain();
								addFile(uploadFileContainNode,this);
							}
						});
			inpt.click();
		});
	}
	
	//删除文件
	function cancelFile(delnode){
		require(["dojo/query","dojo/NodeList-traverse","dojo/NodeList-manipulate","dojo/NodeList-html","dojo/NodeList-dom"],function(query){
			//找到被点击的那一行
			var delList = query(delnode);
			var rowList = delList.closest(".table-row");
			rowList.orphan();
		});
	}
	
	//上传反馈
	function uploadFeed(){
		require(["spolo/data/feed"],function(feed){
			feed.upload("commentsForm",function(data){
				spolo.notify({
					text:"您的意见和问题已经提交，我们会尽快给您答复！",
					type:"success"
				});
			},function(err){
				spolo.notify({
					text:"反馈系统崩溃了，请稍后再试！",
					type:"error"
				});
				console.error(err);
			})
		});
	}
	function getContent(){
		var content = "";
		var domAttr = require("dojo/dom-attr");
		var contentNode = getContentNode();
		content = domAttr.get(contentNode,"value");
		return content;
	}
	function getTel(){
		var tel = "";
		var domAttr = require("dojo/dom-attr");
		var telNode = getTelNode();
		tel = domAttr.get(telNode,"value");
		return tel;
	}
	function getEmail(){
		var tel = "";
		var domAttr = require("dojo/dom-attr");
		var EmailNode = getEmailNode();
		tel = domAttr.get(EmailNode,"value");
		return tel;
	}
	function getUserFeed(){
		var subject = "",content = "",email = "",tel = "";
		subject = "用户反馈";
		content = getContent();
		tel = getTel();
		email = getEmail();
		return {
			subject : subject,
			content : content,
			tel : tel,
			email : email
		};
	}
	function sendFeed(feed){
		showMask(getSubBtnNode());
		console.log(feed);
		if(feed){
			require(["spolo/data/util/spemail"],function(spemail){
				var args = {
					subject : feed["subject"],
					target : "caobin@spolo.org"/*feed["target"]*/,
					content : feed["content"],
					tel : feed["tel"],
					email : feed["email"],
					success : function(suc){
						console.log("[INFO] success to sendEmail");
						console.log(suc);
						hideMask(getSubBtnNode());
					},
					failed : function(err){
						console.error("[spemail.sendEmail ERROR]");
						console.error(err);
						hideMask(getSubBtnNode());
					}	
				};
				spemail.sendEmail("commentsForm",args);
			});
		}else{
			console.error("feed is not defined");
			hideMask();
		}
	}
	function showMask(domNode){
		var mask = require(["widgets/Mask/Mask"],function(Mask){
			Mask.show();
		});
		
		if(domNode){
			domNode.onClick.remove();
		}
	}
	function hideMask(domNode){
		var on = require("dojo/on");
		var mask = require(["widgets/Mask/Mask"],function(Mask){
			Mask.message(":) 我们已经接收到您的建议和问题，尽快给您答复！",true);
		});
		
		if(domNode){
			domNode.onClick = on(domNode,"click",function(){
				console.log("!!!!!!!!btn1 click");
				//uploadFeed();
				var userFeed = getUserFeed();
				sendFeed(userFeed);
			});
		}
	}
})();

/**	当前js文件的公有方法
*/
