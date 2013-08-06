/* 
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */

define("widgets/List/List",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dojo/text!./templates/template.html",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/Evented",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/cookie",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-traverse",
		"dojo/NodeList-fx"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, template, 
		query, on, dom, lang, domConstruct, Evented, domClass,domStyle, cookie
	){
		/**
		* 初始化列表布局方式
		*/
		function initListLayout(){
			query(this.listNode).attr("class",this.listType);
		}
		/**
		* 获取按钮位置
		*/
		function getBtnPosition(){
			var obj = {};
			// 选择按钮
			obj.positionTop = (this.listItemWidth+5)-(5+1+24);
			obj.positionLeft = (this.listItemWidth+15)-(5+1+24);
			
			// 删除按钮，编辑按钮
			obj.delPositionTop = 5+1+5;
			obj.editPositionTop = 5+1+5+24+2;
			
			return obj;
		}
		/**
		* 获取列表项的宽度，用于实现列表项的自适应。	
		* 通过容器宽度以及每行列表项的个数来决定列表项的宽度
		*/
		function getItemWidth(){
			// 获取容器的宽度
			var listContainerWidth = this.listContainerWidth;
			if(!this.listContainerWidth)
			{
				listContainerWidth = query(this.listNode).style("width")[0];
				this.listContainerWidth = listContainerWidth;
			}
			// 列表项个数
			var lineNumber = this.lineNumber;
			
			// 左右内边距，需乘2
			var padding = 15*2;
			
			// 得出列表项的宽度
			var listItemWidth = (listContainerWidth/lineNumber) - padding;
			
			if(listItemWidth <= 0){
				return 192; // 不存在容器高度或容器宽度太小，防止出错，给一个默认值
			}else{
				return listItemWidth; // 正常情况
			}
		}
		/**
		* 列表项、按钮尺寸自适应
		*/
		function thumbnailAdaptive(){
			// 获取到重新计算好的列表项宽度
			this.listItemWidth = getItemWidth.call(this);
			// 设置列表项宽度
			query("li",this.listNode).style("width",this.listItemWidth+"px");
			
			// 左右内边距，需乘2
			var padding = query("li .nodeImg",this.listNode).style("padding")[0] * 2;
			// 左右边框，需乘2
			var border = query("li .nodeImg",this.listNode).style("border-width")[0] * 2;
						
			// 设置图片高度
			query("li .nodeImg",this.listNode).style("height",(this.listItemWidth-(padding+border))+"px"); // 减掉内边距以及边框的像素值
			
			// 获取按钮位置
			var obj = getBtnPosition.call(this);
			// 选择按钮
			query("li .selectItemed,li .selectItem",this.listNode).style({"left":obj.positionLeft+"px","top":obj.positionTop+"px"});
			// 删除按钮
			query("li .delItem",this.listNode).style({"left":obj.positionLeft+"px","top":obj.delPositionTop+"px"});
			// 编辑按钮
			query("li .editItem",this.listNode).style({"left":obj.positionLeft+"px","top":obj.editPositionTop+"px"});
		}
		/**
		* 是否存在纵向滚动条
		*/
		function isScroll(el) {
			var scrollY = false;
			var st = el.scrollTop;
			el.scrollTop += (st > 0) ? -1 : 1;
			el.scrollTop !== st && (scrollY = scrollY || true);
			el.scrollTop = st;

			return scrollY;
		};
		/**
		* 初始化window的相关事件
		*/
		function initWindowEvent(){
			var dthis = this;
			// 离开该页面时执行，刷新或是点击了其它的页面
			window.onbeforeunload = function(){
				// 记录编辑模式
				//cookie("editModel", dthis.isEditModel, { expires: 1 });
				// 记录选择模式
				//cookie("selectModel", dthis.isSelectModel, { expires: 1 });
			/*	
				// 记录当页数据
				dthis.getSelectNodes(); 
				var arr = dthis.selectItemids; // 多页
				// 将数组转换为json字符串
				var jsonStr = arrayConvertJsonStr(arr);
				// 将json字符串存入cookie
				cookie("selectItemids", jsonStr, { expires: 1 });
				*/
			};
			// 窗口大小变化时触发
			var temp = isScroll(dthis.listNode.parentNode);
			window.onresize = function(){
				// 列表类型
				var listType = dthis.listType;
				// 仅作用于缩略图布局
				if(listType =="thumbnail"){		
					/**
					* 是否存在纵向滚动条，两种方法都是可行的
					* 方法一
					*/
					// 首先获取当前容器宽度
					//var listContainerWidth = query(dthis.listNode).style("width")[0];
					// 当容器宽度变化时调整列表项宽度
					//if(dthis.listContainerWidth != listContainerWidth){
						// 缩略图尺寸自适应
						// thumbnailAdaptive.call(dthis);
					//}

					/**
					* 方法二
					*/
					// 是否存在纵向滚动条
					var hasScroll = isScroll(dthis.listNode.parentNode);// 参数为List组件最外层容器
					if(hasScroll != temp){ // 只有当值变化时才执行
						// 缩略图尺寸自适应
						thumbnailAdaptive.call(dthis);
						temp = hasScroll;
					}
				}
			};
		}
		/**
		* 缩略图等比例自适应
		*/
		var ImageToggleSize = function(width,height){
			var image = query(this);
			var imgW = image.style("width")[0];
			var imgH = image.style("height")[0];
			// 得出图片宽、高中的max值
			if(imgW > imgH){
				image.style("width",width+"px");
				image.style("height",(width/imgW*imgH)+"px"); // 高等于  容器宽/自身宽*自身高   --除可得出缩放/扩大的比率
			}else{
				image.style("height",height+"px");
				image.style("width",(height/imgH*imgW)+"px"); // 宽等于  容器高/自身高*自身宽
			}
		}
		/**
		* 所有列表项图片自适应
		*/
		function AllItemImgAdaptive(){
			// 获取父容器的宽高
			var pareW = query("li .nodeImg",this.listNode).style("width")[0];
			var pareH = query("li .nodeImg",this.listNode).style("height")[0];
			// 自适应缩略图
			var elements = query("li .nodeImg img",this.listNode);
			for(var i = 0; i < elements.length; i++){
				ImageToggleSize.call(elements[i],pareW,pareH);
				verticalMiddle.call(elements[i],pareW,pareH);
			}
		}
		/**
		* 让图片垂直居中
		*/
		function verticalMiddle(width,height){
			// 获取图片的高度
			var image = query(this);
			var imgH = image.style("height")[0];
			imgMar = (height-imgH)/2;
			domStyle.set(image[0],"marginTop",imgMar+"px");
		}
		/**
		* 加载列表项，初始化实体结构、事件
		*/
		function loadItem(itemId){
			// 列表类型
			var listType = this.listType;
			/**
			* 列表项实体
			*/
			if(listType =="list"){ // list类型实体
				var temp = '<div class="nodeImg">'+
							'<img src=""/>'+
							'<div class="selectedDiv"></div><div class="selected"></div>'+
						'</div>'+
						'<div class="editItem">编辑</div>'+
						'<div class="delItem">删除</div>'+
						'<div class="selectNode selectItem">选择</div>';
				
				var li = domConstruct.create("li",
					{
						itemid : itemId,
						innerHTML : temp
					},	this.listNode
				);	
				
				// 图片高度
				var imgHeight = query(".nodeImg",li).style("height")[0];	 
				
			}else{ // 缩略图类型实体
				// 初始化时执行一次
				if(!(this.init)){
					// 记录列表项的宽度
					this.listItemWidth = getItemWidth.call(this);
				}
				
				// 是否存在滚动条
				var hasScroll = isScroll(this.listNode.parentNode);
				if(hasScroll){
					// 对原有列表项做自适应
					thumbnailAdaptive.call(this);
					this.Adaptive = true; // 执行完毕
				}else{
					// 防止滚动条出现初始化时的bug
					if(!(this.Adaptive)){
						this.Adaptive = true; // 执行完毕
						var dthis = this;
						setTimeout(function(){
							// 对原有列表项做自适应
							thumbnailAdaptive.call(dthis);
						},1);
					}
				}
				
				// 缩略图实体结构
				var li = domConstruct.create("li",
					{
						itemid : itemId,
						style : {
							"width" : this.listItemWidth+"px"
						}
					},	this.listNode
				);	
				// 图片高度
				var imgHeight = this.listItemWidth-(10+2);	
				var nodeImg = domConstruct.create("div",
					{
						className : "nodeImg",
						innerHTML : '<div class="selectedDiv"></div><div class="selected"></div>',
						style : {
							"height" : imgHeight+"px"
						}
					},	li
				);			
				var img = domConstruct.create("img",{
				},	nodeImg);
	
				// 获取按钮位置
				var obj = getBtnPosition.call(this);
				var temp = '<div style="left:'+obj.positionLeft+'px;top:'+obj.editPositionTop+'px;" class="editItem"><img src="/widgets/List/images/edit.jpg" title="编辑" alt="编辑"/></div>'+
						   '<div style="left:'+obj.positionLeft+'px;top:'+obj.delPositionTop+'px;" class="delItem"><img src="/widgets/List/images/remove.jpg" title="删除" alt="删除"/></div>'+
						   '<div style="left:'+obj.positionLeft+'px;top:'+obj.positionTop+'px;" class="selectNode selectItem"><img src="/widgets/List/images/selectBtn.jpg" title="选择" alt="选择"/></div>';				
				// 为列表项添加按钮
				query(li).append(temp);
			}	
			
			/**
			* 模式设置
			*/
			// 编辑模式
			if(this.isEditModel){
				// 打开编辑模式
				this.openEdit();
			}else{
				// 关闭编辑模式
				this.closeEdit();
			}
			// 选择模式
			if(this.isSelectModel){
				// 打开选择模式
				this.openSelect();
			}else{
				// 关闭选择模式
				this.closeSelect();
			}
			
			/**
			* 列表项按钮事件
			*/
			var dthis = this;
			//选择按钮
			query(".selectNode",li).on("click",function(){
				if(domClass.contains(this,"selectItem")){
					//是否为单选模式
					if(dthis.isRadio){
						var selectNum = query("li .selectItemed",dthis.listNode);
						if(selectNum.length >= 1){
							if(query(this).parents("ul").attr("class") == "list"){
								selectNum.innerHTML("选择");
							}else{
								selectNum.children("img").attr("src","/widgets/List/images/selectBtn.jpg");
							}
							selectNum.attr("class","selectItem").siblings(".nodeImg").children(".selectedDiv,.selected").style("display","none");
						}
					}
					query(this).attr("class","selectItemed");
					
					if(query(this).parents("ul").attr("class") == "list"){
						query(this).innerHTML("已选择");
					}else{
						query("img",this).attr("src","/widgets/List/images/selectedBtn.jpg");
					}
					query(this).siblings(".nodeImg").children(".selectedDiv,.selected").style("display","block");
					
					// 发出被选中的消息
					sendEvent.call(this,"onListItemSelect",dthis);
				}else{
					query(this).attr("class","selectItem");
					
					var liNode = query(this).parent();
					if(liNode.parent().attr("class") == "list"){
						query(this).innerHTML("选择");
					}else{
						query("img",this).attr("src","/widgets/List/images/selectBtn.jpg");
					}
					query(this).siblings(".nodeImg").children(".selectedDiv,.selected").style("display","none");
				}
				
				// 发出状态被改变消息
				sendEvent.call(this,"onItemStatuChanger",dthis);
			});
			//编辑按钮
			query(".editItem",li).on("click",function(){
				sendEvent.call(this,"onEditItemClick",dthis);
			});
			//删除按钮
			query(".delItem",li).on("click",function(){
				sendEvent.call(this,"onDelItemClick",dthis);
			});	
			//缩略图
			query(".nodeImg img",li).on("click",function(){
				sendEvent.call(query(this).parent(),"onListItemClick",dthis);
			});
			
			//选中状态提示图片事件
			query(".nodeImg .selectedDiv,.nodeImg .selected",li).on("click",function(){
				var liNode = query(this).parent().parent();
				if(liNode.parent().attr("class") == "list"){
					liNode.children(".selectItemed").innerHTML("选择");
				}else{
					query(this).parent().siblings(".selectItemed").children("img").attr("src","/widgets/List/images/selectBtn.jpg");
				}
				liNode.children(".nodeImg").children(".selectedDiv,.selected").style("display","none").end()
				.siblings(".selectItemed").attr("class","selectItem");
			});
			
			// 图片加载事件，图片等比例自适应
			query(".nodeImg img",li).on("load",function(){
				ImageToggleSize.call(this,imgHeight,imgHeight);
				verticalMiddle.call(this,imgHeight,imgHeight);
			});
			
			// 初始化完毕
			dthis.init = true;
		}

		//发送事件
		function sendEvent(eventName,dthis){
			var currentItem = query(this).parent();
			var itemId = currentItem.attr("itemid");
			//发出删除消息
			dthis.emit(eventName,itemId[0]);
		}
		
		// 列表方式布局
		function listLayout(){
			// 设置列表类型
			this.listType = "list";
			
			// UI部分的更换
			query("li",this.listNode).children(".editItem").innerHTML("编辑").end()
			.children(".delItem").innerHTML("删除").end()
			.children(".selectItem").innerHTML("选择").end()
			.children(".selectItemed").innerHTML("已选择").end().parent()
			.attr("class","list");
			
			// 清除缩略图部分的自适应尺寸	
			query("li,li .nodeImg",this.listNode).removeAttr("style");
			
			// 当前所有列表项图片自适应
			AllItemImgAdaptive.call(this);
		}
		
		// 大图方式布局
		function thumbnailLayout(){
			// 设置列表类型
			this.listType = "thumbnail";
			
			query("li",this.listNode).children(".editItem").innerHTML('<img src="/widgets/List/images/edit.jpg"/>').end()
			.children(".delItem").innerHTML('<img src="/widgets/List/images/remove.jpg"/>').end()
			.children(".selectItem").innerHTML('<img src="/widgets/List/images/selectBtn.jpg"/>').end()
			.children(".selectItemed").innerHTML('<img src="/widgets/List/images/selectedBtn.jpg"/>').end().parent()
			.attr("class","thumbnail");
			
			// 缩略图尺寸自适应
			thumbnailAdaptive.call(this);
			
			// 当前所有列表项图片自适应
			AllItemImgAdaptive.call(this);
		}
		
		// 将数组转成json字符串，仅支持一维、二维数组
		function arrayConvertJsonStr(arr){
			var jsonStr = "{";
			// 首要判断是否为二维数组
			if(arr[0] instanceof Array){
				for(var j = 0; j < arr.length; j++){
					jsonStr +=  arr[j] ? "\""+j+"\":\"{" + arr[j].join(",")+"}\"" : "\""+j+"\":\"{}\"";
					// 不是最后一个需加","号
					if(j != arr.length-1){
						jsonStr += ",";
					}
				}
			}else if(arr instanceof Array){ // 或是一维数组
				jsonStr += "\""+0+"\":\"{" + arr.join(",")+"}\"";
			}
			jsonStr += "}";
			return jsonStr;
		}
		
		// 将json字符串转化为数组，统一转为二维数组
		function jsonStrConvertArray(jsonStr){
			// 将json字符串转为json对象
			var jsonObj = eval('(' + jsonStr + ')');
			
			// 将json对象转为数组
			var arr = [];
			for(var i in jsonObj){
				if(jsonObj[i] == "{}"){
					arr[i] = undefined;
				}else{
					// 去除不需要的部分"{}"
					jsonObj[i] = jsonObj[i].slice(1,-1);
					arr[i] = jsonObj[i].split(",");
				}
			}
			return arr;
		}
		
		var ret = declare("widgets/List/List",[_WidgetBase, _TemplatedMixin, Evented ],{
			// 指定template
			templateString: template,
			
			constructor:function(json){
				if(json){
					this.isRadio = json["isRadio"] || false; // 单选模式参数
					this.lineNumber = json["lineNumber"] || 4; // 默认每行显示5个
					this.listType = json["listType"] || "thumbnail"; // 列表类型，默认为大图布局
					this.isEditModel = json["isEditModel"] || false; // 编辑模式，默认关闭
					this.isSelectModel = json["isSelectModel"] || false; // 选择模式，默认关闭
					this.currentPage = json["currentPage"];// 多页选择参数
				}else{
					this.isRadio = false;
					this.lineNumber = 4;
					this.listType = "thumbnail";
				}

				// 初始化状态，记录初始化时不执行列表切换动画
				this.init = false;
				// 记录列表容器宽度
				this.listContainerWidth = 1000;
				// 记录列表项宽度
				this.listItemWidth = 0;
				// 记录初始化的自适应功能
				this.Adaptive = false;
				
				// cookie记录模式状态， 暂不支持
				/*
				// 编辑模式
				if(cookie("editModel") == "true"){
					this.isEditModel = true;
				}else{
					this.isEditModel = false;
				}
				// 选择模式
				if(cookie("selectModel") == "true"){
					this.isSelectModel = true;
				}else{
					this.isSelectModel = false;
				}*/
				
				// 存储当前列表中已选中的列表项
				var jsonStrA = cookie("selectItemids") || [];
				if(jsonStrA instanceof Array){
					this.selectItemids = jsonStrA;
				}else{
					// 将json字符串转换为数组
					this.selectItemids = jsonStrConvertArray(jsonStrA);
				}
								
				// 记录页码
				this.max = 1;
			},
			/**
			*选择未选中的所有列表项
			*/
			selectAll:function(){
				if(!(this.isRadio)){
					var selectItem = query("li",this.listNode).children(".selectItem");
					if(query(this.listNode).attr("class") == "thumbnail"){
						selectItem.children("img").attr("src","/widgets/List/images/selectedBtn.jpg");
					}else{
						selectItem.innerHTML("已选择");
					}
					selectItem.attr("class","selectItemed").siblings(".nodeImg").children(".selected,.selectedDiv").style("display","block");
				}
			},
			/**
			*根据itemid选中列表项
			*/
			selectByItemId:function(array){
				if(array instanceof Array){
					var listType = this.listType;
					for(var i = 0; i < array.length; i++){
						var itemid = query("li[itemid='"+array[i]+"'] .selectItem",this.listNode);
						if(itemid.length != 0){
							if(listType == "thumbnail"){
								itemid.children("img").attr("src","/widgets/List/images/selectedBtn.jpg");
							}else{
								itemid.innerHTML("已选择");
							}
							itemid.attr("class","selectItemed").siblings(".nodeImg").children(".selected,.selectedDiv").style("display","block");
						}
					}
				}else{
					console.error("为selectByItemId方法传递的参数必须为数组。");
				}
			},
			/**
			*取消已选中的所有列表项
			*/
			unSelectAll:function(){
				if(!(this.isRadio)){
					var selectItem = query("li",this.listNode).children(".selectItemed");
					if(query(this.listNode).attr("class") == "thumbnail"){
						selectItem.children("img").attr("src","/widgets/List/images/selectBtn.jpg");
					}else{
						selectItem.innerHTML("选择");
					}
					selectItem.attr("class","selectItem").siblings(".nodeImg").children(".selected,.selectedDiv").style("display","none");
				}
			},
			/**
			*切换为列表方式显示
			*/
			showList:function(){
				var dthis = this;			
				// 列表类型
				var listType = dthis.listType;
				// 不处于list布局时执行
				if(listType != "list"){
					// 是否数据初始化完毕
					if(dthis.init){
						query(dthis.listNode).fadeOut({
							duration:300,
							onEnd:function(){
								// 列表方式布局
								listLayout.call(dthis);
								query(dthis.listNode).fadeIn({
									duration:300
								}).play();
							}
						}).play();
					}else{
						// 列表方式布局
						listLayout.call(dthis);
					}
				}
			},
			/**
			*切换为缩略图方式显示
			*/
			showThumbnail:function(){
				var dthis = this;
				
				// 列表类型
				var listType = dthis.listType;
				
				// 不处于thumbnail布局时执行
				if(listType != "thumbnail"){
					// 是否数据初始化完毕
					if(dthis.init){
						query(dthis.listNode).fadeOut({
							duration:300,
							onEnd:function(){
								// 大图方式布局
								thumbnailLayout.call(dthis);
								query(dthis.listNode).fadeIn({
									duration:300
								}).play();
							}
						}).play();
					}else{
						// 大图方式布局
						thumbnailLayout.call(dthis);
					}
				}
			},
			/**
			*打开编辑模式
			*/
			openEdit:function(){
				var item = query("li",this.listNode).children(".editItem,.delItem");
				item.fadeIn({
					duration:150,
					onEnd:function(){
						setTimeout(function(){
							item.style("display","block");
						},1);	
					}
				}).play();
				// 记录编辑模式为打开
				this.isEditModel = true;
			},
			/**
			*关闭编辑模式
			*/
			closeEdit:function(){
				var item = query("li",this.listNode).children(".editItem,.delItem");
				if(this.isEditModel){
					item.fadeOut({
						duration:150,
						onEnd:function(){
							setTimeout(function(){
								item.style("display","none");
							},1);
						}
					}).play();
					// 记录编辑模式为关闭
					this.isEditModel = false;
				}else{
					item.style("display","none");
				}
			},
			/**
			*打开选择模式
			*/
			openSelect:function(){
				var item = query("li",this.listNode).children(".selectItem,.selectItemed");
				item.fadeIn({
					duration:150,
					onEnd:function(){
						setTimeout(function(){
							item.style("display","block");
						},1);
					}
				}).play();
				// 记录选择模式为打开
				this.isSelectModel = true;
			},
			/**
			*关闭选择模式
			*/
			closeSelect:function(){
				var item = query("li",this.listNode).children(".selectItem,.selectItemed");
				if(this.isSelectModel){
					item.fadeOut({
						duration:150,
						onEnd:function(){
							setTimeout(function(){
								item.style("display","none");
							},1);
						}
					}).play();
					// 记录选择模式为关闭
					this.isSelectModel = false;
				}else{
					item.style("display","none");
				}
			},
			/**
			*获取已选中项的itemid
			*/
			getSelectNodes:function(){
				//所有被选中的列表项
				var itemIds = query("li .selectItemed",this.listNode).parent("li").attr("itemid");
				//修改为满足要求的数组格式
				var array = new Array();
				for(var i = 0; i < itemIds.length; i++){
					array.push(itemIds[i]);
				}
				// 是否存在分页，及配置了分页参数
				if(this.currentPage != undefined){
					// 记录当前页
					var currentPage = this.currentPage;
					if(currentPage > this.max + 1){// 最大页码、不固定页码
						this.selectItemids[this.max - 1] = array;
					}else if(currentPage > this.max){// 增大页码
						this.selectItemids[currentPage - 2] = array;
					}else if(currentPage < this.max - 1){// 最小页码、不固定页码
						this.selectItemids[this.max - 1] = array;
					}else if(currentPage < this.max){// 减小页码
						this.selectItemids[currentPage] = array;
					}else{
						// 1、初始化，array.length = 0 ，不做任何记录。否则会将原有记录覆盖。
						// 2、离开，需记录当前页的情况。需将array记录下来。
						// 3、页码不变时执行getSelectNodes方法，也会执行记录。
						if(this.init){
							this.selectItemids[currentPage-1] = array;
						}
					}
					this.max = currentPage;
					// 将其整理至一个数组中返回
					var selectItemids = [];
					for(var j = 0; j < this.selectItemids.length; j++){
						// 过滤空数组
						if(this.selectItemids[j] != undefined){
							// 数组合并
							var selectItemids = selectItemids.concat(this.selectItemids[j]);
						}
					}
					// 返回多页中已选中项itemid
					return selectItemids;
				}else{
					// 返回列表中当前选中项itemid
					return array;
				}
			},
			/**
			*获取List当前显示的itemid
			*/
			getCurrentItemIds:function(){
				var itemids = query(this.listNode).children().attr("itemid");
				//修改为满足要求的数组格式
				var array = new Array();
				for(var i = 0; i < itemids.length; i++){
					array.push(itemids[i]);
				}
				return array;
			},
			/**
			*删除节点
			*/
			delItem:function(itemId,isWipeOut){
				var currentNode = query("li[itemid='"+itemId+"']",this.listNode);
				if(isWipeOut){
					currentNode.wipeOut({
						duration:500,
						onEnd:function(){
							currentNode.orphan();
						}
					}).play();
				}else{
					currentNode.fadeOut({
						duration:500,
						onEnd:function(){
							currentNode.orphan();
						}
					}).play();
				}
			},
			/**
			*添加多个列表项，参数为数组
			*/
			addItems:function(itemIds,isClear){
				if(itemIds instanceof Array){
					// 是否执行清空
					if(isClear){
						// 存储当前页选中项，仅可用于多页的情况。（配置了currentPage属性时生效）
						if(this.currentPage != undefined){
							// 记录多页
							this.getSelectNodes();
						}
						
						// 待被清空的列表项数据
						var oldItems = query(this.listNode).children();
						
						// 执行清空
						oldItems.orphan();
						
					}
					
					// 添加新增元素
					for(var i = 0; i < itemIds.length; i++){
						loadItem.call(this,itemIds[i]);
					}
					
					// 为已选中项设置选中状态。仅可用于多页的情况。（配置了currentPage属性时生效）
					if(this.currentPage != undefined){
						for(var i = 0; i < this.selectItemids.length; i++){
							if(this.currentPage-1 == i){
								// 过滤掉空数据
								if(this.selectItemids[i] instanceof Array){
									this.selectByItemId(this.selectItemids[i]);
								}
								break;
							}
						}
					}					
					/*
					// 将存储的已选中列表项数组存入cookie中
					var arr = this.selectItemids; // 多页
					// 将数组转换为json字符串
					var jsonStr = arrayConvertJsonStr(arr);
					// 将json字符串存入cookie
					cookie("selectItemids", jsonStr, { expires: 1 });
					*/
				}else{
					console.error("为addListItems方法传递的参数必须为数组。");
				}
			},
			/**
			*添加单个列表项
			*/
			addItem:function(itemId){
				loadItem.call(this,itemId);
			},
			/**
			*设置列表项的缩略图（将被废弃）
			*/
			setItemImageByKey: function(itemId,url){
				this.setItemImage(itemId,url);
			},
			/**
			*设置列表项的缩略图
			*/
			setItemImage:function(itemId,url){
				var itemImg = query("li[itemid='"+itemId+"'] .nodeImg img",this.listNode);
				itemImg.attr("src",url);
			},
			/**
			*添加dom节点
			*/
			addDomNode:function(itemId,domNode){
				var proField = domConstruct.create("div",{
					className : "proField"
				});
				query(proField).append(domNode);
				
				query("li[itemid='"+itemId+"']",this.listNode).append(proField);
			},
			/**
			*添加字段，类似addDomNode方法
			*/
			addField:function(itemId,json){
				var currentNode = query("li[itemid='"+itemId+"']",this.listNode);
				var proField = domConstruct.create("div",{
					className : "proField"
				},currentNode[0]);
				if(json.nodeType){
					//自定义项内容
					var field = domConstruct.create(json.nodeType, 
					{ 
						className : json.className || null,
						innerHTML :  json.content || "",
						style : json.style || null
					},  proField);
				}else{
					proField.innerHTML = json.content || "";
				}	
			},
			/**
			*获取字段
			*/
			getField:function(itemId,index){
				var field = query("li[itemid='"+itemId+"'] .proField",this.listNode)[index-1];
				return field;
			},
			/**
			*修改字段
			*/
			setField:function(field,content){
				query(field).innerHTML(content);
			},
			/**
			*删除字段
			*/
			delField:function(field){
				query(field).orphan();
			},
			/**
			*通过字段获取当前itemid
			*/
			getItemidByField:function(field){
				query(field).parents("li").attr("itemid")[0];
			},
			postCreate: function()
			{
				// 初始化列表布局方式
				initListLayout.call(this);
				
				// 初始化相关事件
				initWindowEvent.call(this);
			}
		});
		
		return ret;
	});