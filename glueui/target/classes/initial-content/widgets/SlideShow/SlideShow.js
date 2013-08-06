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

define("widgets/SlideShow/SlideShow",
	[
		"dojo/_base/declare",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetsInTemplateMixin",
		"dojo/text!./templates/template.html",
		"dijit/layout/StackContainer",
		"dijit/layout/BorderContainer", 
		"dijit/layout/ContentPane",
		"dojo/query",
		"dojo/on",
		"dojo/dom",
		"dojo/_base/lang",
		"dojo/dom-construct",
		"dojo/Evented",
		"dojo/dom-class",
		"dojo/NodeList-manipulate",
		"dojo/NodeList-traverse",
		"dojo/NodeList-fx"
	],function(
		declare,	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, StackContainer, BorderContainer, ContentPane, 
		query, on, dom, lang, domConstruct, Evented, domClass
	){
		
		// 选中第一个子元素
		function selectFirstItem(which){
			query("li",which).first().addClass("liSelected");
		}
		
		// 按比例压缩图片
		function AutoResizeImage(maxWidth,maxHeight,objImg){
			var hRatio;
			var wRatio;
			var Ratio = 1;
			var w = objImg.attr("defaultw");
			var h = objImg.attr("defaulth");
			wRatio = maxWidth / w;
			hRatio = maxHeight / h;
			if (maxWidth ==0 && maxHeight==0){
				Ratio = 1;
			}else if (maxWidth==0){
				if (hRatio<1) Ratio = hRatio;
			}else if (maxHeight==0){
				if (wRatio<1) Ratio = wRatio;
			}else if (wRatio<1 || hRatio<1){
				Ratio = (wRatio<=hRatio?wRatio:hRatio);
			}
			if (Ratio<1){
				w = w * Ratio;
				h = h * Ratio;
			}
			h != 0 ? objImg.height(h) : null;
			w != 0 ? objImg.width(w) : null;
			
			// 防止图片出现由小突然变大的情况。仅作用于图片display：none;
			objImg.fadeIn(500); 
		}
		
		// 设置大图尺寸
		function setBigPicResize(item){
			var itemImg = $(".sPic img:eq("+item+")",this.ulBigPic);
			// 记录初始尺寸
			itemImg.attr("defaultw") == 0 ? itemImg.attr("defaultw",itemImg.width()) : null;
			itemImg.attr("defaulth") == 0 ? itemImg.attr("defaulth",itemImg.height()) : null;
			// 获取父级尺寸
			var pareWidth = itemImg.parent().width();
			var pareHeight = itemImg.parent().height();
			// 调整图片比例
			AutoResizeImage(pareWidth,pareHeight,itemImg);	
		}
		
		// 创建图片元素
		function createPreviewItems(data,type,which){
			if(type == "smallPic"){ // 小图
				for(var key in data){
					var name = data[key]["resourceName"];
					var content = '<li>'+
					'<span class="sPic"><img alt="'+name+'" width="80px" height="80px" title="'+name+'" src="'+key+'.image"></span>'+
					'</li>';
					query(which).append(content);
				}
				// 默认选中第一个子元素
				//selectFirstItem(which);
			}else if(type == "bigPic"){ // 大图
				for(var key in data){
					var name = data[key]["resourceName"];
					// 创建结构
					var li = domConstruct.create("li",{},which);
					var div = domConstruct.create(
					"div",{
						className : "sPic",
						style : {
							"width" : "100%",
							"height" : "100%"
						}
					},li);
					
					// 创建图片
					var img = domConstruct.create(
					"img",{
						alt : name,
						title : name,
						src : key+".image",
						style : {
							display : "none"
						}
					},div);
					
					// 图片的加载事件
					on(img,"load",function(){
						$(this).attr("defaultw",$(this).width());
						$(this).attr("defaulth",$(this).height());
						// 调整图片比例
						var pareWidth = $(this).parent().width();
						var pareHeight = $(this).parent().height();
						AutoResizeImage(pareWidth,pareHeight,$(this));
					});
				}
			}
		}

		//mouseover效果
		function liMouseOn(){
			$("#dPicListBody .ulBigPic li").attr("class","");
			for(var i=0; i<$("#dPicListBody .ulBigPic li").length;i++) {
				(function(j){
					$("#dPicListBody .ulBigPic li:eq("+j+")").live("mouseover",function(){
						if($("#dPicListBody").attr("class") == "dSmallList" || $("#dPicListBody").attr("class") == "dMiddleList") {
							if($(this).attr("class") != "liSelected") {
								$(this).attr("class","liSelected");
							}
						}
					});
					$("#dPicListBody .ulBigPic li:eq("+j+")").live("mouseout",function(){
						if($("#dPicListBody").attr("class") == "dSmallList" || $("#dPicListBody").attr("class") == "dMiddleList") {
							if($(this).attr("class") == "liSelected") {
								$(this).attr("class","");
							}
						}
					});
				}) (i);
			}
		}
		
		//定义当前、之前、之后要显示图片的排位
		var curPic=0,nextPic=-1,prePic=-1;preShowPic=-1;
		var allPic = 0;
		//初始化当前、之前、之后要显示图片的排位
		function numInit(num) {
			allPic=$("#dPicListBody .ulBigPic li").length;
			if(num=="init"){
				if(allPic > 1) {
					nextPic=curPic+1;
					prePic=allPic-1;
				}else if(allPic == 1){
					nextPic=0;
					prePic=0;
				}
				$("#dPicListBody .ulBigPic li:eq("+curPic+")").attr("class","liSelected");
			}else if(num == "plus"){
				preShowPic=curPic;
				prePic=curPic;
				curPic=nextPic;
				if(curPic < (allPic-1)) {
					nextPic=curPic+1;
				}else if(curPic == (allPic-1)) {
					nextPic=0;
				}
				$("#dPicListBody .ulBigPic li:eq("+curPic+")").attr("class","liSelected");
				if(preShowPic != curPic) {
					$("#dPicListBody .ulBigPic li:eq("+preShowPic+")").attr("class","");
				}
			}else if(num == "minus") {
				preShowPic=curPic;
				nextPic=curPic;
				curPic=prePic;
				if(curPic > 0) {
					prePic=curPic-1;
				}else if(curPic == 0 && allPic > 1) {
					prePic=allPic-1;
				}
				$("#dPicListBody .ulBigPic li:eq("+curPic+")").attr("class","liSelected");
				if(preShowPic != curPic) {
					$("#dPicListBody .ulBigPic li:eq("+preShowPic+")").attr("class","");
				}
			}else{
				preShowPic=curPic;
				curPic=num;
				if(curPic == (allPic-1)) {
					nextPic=0;
					if(allPic > 1) {
						prePic=curPic-1;
					}else if(allPic == 1) {
						prePic=0;
					}
				}else if(curPic == 0) {
					prePic=allPic-1;
					if(allPic > 1) {
						nextPic=1;
					}else if(allPic == 1) {
						nextPic=0;
					}
				}else{
					nextPic=curPic+1;
					prePic=curPic-1;
				}
				$("#dPicListBody .ulBigPic li:eq("+curPic+")").attr("class","liSelected");
				if(preShowPic != curPic) {
					$("#dPicListBody .ulBigPic li:eq("+preShowPic+")").attr("class","");
				}
			}
			//alert("curPic="+curPic+"/nextPic="+nextPic+"/prePic="+prePic+"/preShowPic="+preShowPic);
		}
		
		//大图左右按钮初始化
		function btnAInit(){
			if(allPic < 2) {
				$("#sLeftBtnA").attr("class","sLeftBtnABan");
				$("#sRightBtnA").attr("class","sRightBtnABan");
			}else{
				if(curPic == 0) {
					$("#sLeftBtnA").attr("class","sLeftBtnABan");
					$("#sRightBtnA").attr("class","sRightBtnA");
				}else if(curPic == (allPic-1)) {
					$("#sLeftBtnA").attr("class","sLeftBtnA");
					$("#sRightBtnA").attr("class","sRightBtnABan");
				}else{
					$("#sLeftBtnA").attr("class","sLeftBtnA");
					$("#sRightBtnA").attr("class","sRightBtnA");
				}
			}
		}
		
		//小图左右按钮初始化
		function btnBInitA(){
			if(allPic > 6) {
				$("#sRightBtnB").attr("class","sRightBtnB");
			}
		}
		
		function btnBInitB() {
			if(curPic > 2 && (allPic-curPic) > 4) {
				if($("#sLeftBtnB").attr("class") != "sLeftBtnB") {$("#sLeftBtnB").attr("class","sLeftBtnB");}
				if($("#sRightBtnB").attr("class") != "sRightBtnB") {$("#sRightBtnB").attr("class","sRightBtnB");}
			}else if(curPic < 3){
				if($("#sLeftBtnB").attr("class") != "sLeftBtnBBan") {$("#sLeftBtnB").attr("class","sLeftBtnBBan");}
				if(allPic > 6) {
					if($("#sRightBtnB").attr("class") != "sRightBtnB") {$("#sRightBtnB").attr("class","sRightBtnB");}
				}else{
					if($("#sRightBtnB").attr("class") != "sRightBtnBBan") {$("#sRightBtnB").attr("class","sRightBtnBBan");}
				}
			}else if(curPic > (allPic-4)) {
				if($("#sRightBtnB").attr("class") != "sRightBtnBBan") {$("#sRightBtnB").attr("class","sRightBtnBBan");}
				if(allPic > 6) {
					if($("#sLeftBtnB").attr("class") != "sLeftBtnB") {$("#sLeftBtnB").attr("class","sLeftBtnB");}
				}else{
					if($("#sLeftBtnB").attr("class") != "sLeftBtnBBan") {$("#sLeftBtnB").attr("class","sleftBtnBBan");}
				}
			}
		}
		
		//小图标签selected函数
		function smallPicSelected() {
			if(!$("#dPicListBody .ulSmallPic li:eq("+curPic+")").hasClass("liSelected")) {$("#dPicListBody .ulSmallPic li:eq("+curPic+")").addClass("liSelected");}
			if(preShowPic!=(-1)) {
				if($("#dPicListBody .ulSmallPic li:eq("+preShowPic+")").hasClass("liSelected")) {
					$("#dPicListBody .ulSmallPic li:eq("+preShowPic+")").removeClass("liSelected");
				}
			}
		}
		
		//小图滚动函数
		function smallPicScroll() {
			if(curPic != preShowPic) {
				var leftPosition=0;
				if(curPic>2 && curPic<($("#dPicListBody .ulSmallPic li").length-3)) {
					leftPosition=-(curPic-2)*147;
				}else if(curPic > ($("#dPicListBody .ulSmallPic li").length-4) && $("#dPicListBody .ulSmallPic li").length>6) {
					leftPosition=-($("#dPicListBody .ulSmallPic li").length-6)*147;
				}
				leftPosition+="px";
				$("#dPicListBody .ulSmallPic").attr("rel","moving");
				$("#dPicListBody .ulSmallPic").animate({left:leftPosition},200,function(){$("#dPicListBody .ulSmallPic").attr("rel","stop");});
			}
		}
		
		//大图按钮效果
		$("#sLeftBtnA").live("mouseover",function(){
			if($(this).attr("class")=="sLeftBtnA") {
				$(this).attr("class","sLeftBtnASel");
			}
		});
		
		$("#sLeftBtnA").live("mouseout",function(){
			if($(this).attr("class")=="sLeftBtnASel") {
				$(this).attr("class","sLeftBtnA");
			}
		});
		
		var dthis = this;
		$("#sLeftBtnA").live("click",function(){
			if($(this).attr("class")=="sLeftBtnASel") {
				numInit("minus");
				btnBInitB();
				smallPicSelected();
				smallPicScroll();
				if(curPic == 0) {$("#sLeftBtnA").attr("class","sLeftBtnABan");}
				if(curPic < (allPic-1) && $("#sRightBtnA").attr("class")=="sRightBtnABan") {$("#sRightBtnA").attr("class","sRightBtnA");}
				
				// 设置大图尺寸
				setBigPicResize.call(dthis,curPic);
			}
		});
		
		$("#sRightBtnA").live("mouseover",function(){
			if($(this).attr("class")=="sRightBtnA") {
				$(this).attr("class","sRightBtnASel");
			}
		});
		
		$("#sRightBtnA").live("mouseout",function(){
			if($(this).attr("class")=="sRightBtnASel") {
				$(this).attr("class","sRightBtnA");
			}
		});
		
		$("#sRightBtnA").live("click",function(){
			if($(this).attr("class")=="sRightBtnASel") {
				numInit("plus");
				btnBInitB();
				smallPicSelected();
				smallPicScroll();
				if(curPic == (allPic-1)) {$("#sRightBtnA").attr("class","sRightBtnABan");}
				if(curPic > 0 && $("#sLeftBtnA").attr("class")=="sLeftBtnABan") {$("#sLeftBtnA").attr("class","sLeftBtnA");}
				
				// 设置大图尺寸
				setBigPicResize.call(dthis,curPic);
			}
		});
		
		//小图li按键效果
		function initSmallClick(){
			var dthis = this;
			for (var i=0;i<$("#dPicListBody .ulSmallPic li").length;i++) {
				(function(j) {
					$("#dPicListBody .ulSmallPic li:eq("+j+")").live("click",function() {
						if($(this).attr("class") != "liSelected") {
							numInit(j);
							btnAInit();
							smallPicSelected();
						}
						
						// 设置大图尺寸
						setBigPicResize.call(dthis,j);
					})
				}) (i);
			}
		}
		
		//小图左右按键效果
		$("#sLeftBtnB").live("mouseover",function(){
			if($(this).attr("class")=="sLeftBtnB") {
				$(this).attr("class","sLeftBtnBSel");
			}
		});
		
		$("#sLeftBtnB").live("mouseout",function(){
			if($(this).attr("class")=="sLeftBtnBSel") {
				$(this).attr("class","sLeftBtnB");
			}
		});
		
		$("#sLeftBtnB").live("click",function(){
			if($(this).attr("class")=="sLeftBtnBSel") {
				var leftPosition=$("#dPicListBody .ulSmallPic").css("left");
				var leftPositionNum=Number(leftPosition.substring(0,(leftPosition.length-2)));
				leftPosition=leftPositionNum+147+"px";
				if(leftPosition=="0px") {if($(this).attr("class") != "sLeftBtnBBan") {$(this).attr("class","sLeftBtnBBan");}}
				var bestLeftNum=-($("#dPicListBody .ulSmallPic li").length-6)*147;
				if((leftPositionNum+147) > bestLeftNum && $("sRightBtnB").attr("class") != "sRightBtnB") {$("#sRightBtnB").attr("class","sRightBtnB")}
				if($("#dPicListBody .ulSmallPic").attr("rel")=="stop"){
					$("#dPicListBody .ulSmallPic").attr("rel","moving");
					$("#dPicListBody .ulSmallPic").stop();
					$("#dPicListBody .ulSmallPic").animate({left:leftPosition},200,function(){$("#dPicListBody .ulSmallPic").attr("rel","stop");});
				}
			}
		});
		
		$("#sRightBtnB").live("mouseover",function(){
			if($(this).attr("class")=="sRightBtnB") {
				$(this).attr("class","sRightBtnBSel");
			}
		});
		
		$("#sRightBtnB").live("mouseout",function(){
			if($(this).attr("class")=="sRightBtnBSel") {
				$(this).attr("class","sRightBtnB");
			}
		});
		
		$("#sRightBtnB").live("click",function(){
			if($(this).attr("class")=="sRightBtnBSel"){
				var leftPosition=$("#dPicListBody .ulSmallPic").css("left");
				var leftPositionNum=Number(leftPosition.substring(0,(leftPosition.length-2)));
				leftPosition=leftPositionNum-147+"px";
				var bestLeftNum=-($("#dPicListBody .ulSmallPic li").length-6)*147;
				if((leftPositionNum-147)==bestLeftNum) {$(this).attr("class","sRightBtnBBan");}
				if(leftPositionNum==0 && $("#sLeftBtnB").attr("class")=="sLeftBtnBBan") {$("#sLeftBtnB").attr("class","sLeftBtnB");}
				if($("#dPicListBody .ulSmallPic").attr("rel")=="stop") {
					$("#dPicListBody .ulSmallPic").attr("rel","moving");
					$("#dPicListBody .ulSmallPic").stop();
					$("#dPicListBody .ulSmallPic").animate({left:leftPosition},200,function(){$("#dPicListBody .ulSmallPic").attr("rel","stop");});
				}
			}
		});
		
		var ret = declare("widgets/SlideShow/SlideShow",
						[StackContainer,_WidgetBase,_WidgetsInTemplateMixin, _TemplatedMixin, Evented ],{
			// 指定template
			templateString: template,
			
			constructor:function(){
				
			},
			postCreate: function(){
			},
			/**
			* 动态添列表元素
			*/
			addPreviewItem: function(data){
				// 初始化小图
				createPreviewItems(data,"smallPic",this.ulSmallPic);
				// 初始化大图
				createPreviewItems(data,"bigPic",this.ulBigPic);
				
				// mouseover效果
				liMouseOn();
				
				// 初始化当前、之前、之后要显示图片的排位
				numInit("init");
				
				// 大图左右按钮初始化
				btnAInit();
				
				// 小图左右按钮初始化
				btnBInitA();
				
				// 小图li按键效果
				initSmallClick.call(this);
				
				// 小图标签selected函数
				smallPicSelected();
			}
		});
		
		return ret;
	});