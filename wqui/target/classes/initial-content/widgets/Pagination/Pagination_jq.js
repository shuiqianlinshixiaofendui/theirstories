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
 
define("widgets/Pagination/Pagination_jq",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template_jq.html",
	"dijit/form/CheckBox",
	"dijit/Tooltip",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/Evented",
	"dojo/query",
	"dojo/_base/array",
	"dojo/NodeList-traverse",
	"dojo/NodeList-manipulate"
	
],
function(
	declare, WidgetBase, TemplatedMixin, template,
	CheckBox, Tooltip, domStyle,domClass,domAttr,lang,domConstruct,on,Evented,query,array
)
{
	//用户点击上一页，下一页或某一页的时候，发出当前页的信息。
	var clickPage = "onClickPage";
	function initPage(){
		var total = this.total;
		var nowPage = this.nowPage;
		var centerPageCount = this.centerPageCount;
		var minSidePageCountLater = this.minSidePageCountLater;
		var minSidePageCount = this.minSidePageCount;
		
		var centerPageCountAva =(centerPageCount-1)/2;
		//这是左侧最多要创建多少个分页
		var leftPageCount = centerPageCount+centerPageCountAva;
		var rightPageMx = total - centerPageCountAva;
		var initRightPage = total - minSidePageCountLater+1;
		if(total<(centerPageCount+centerPageCountAva*2)){
			for(var i=1;i<=total;i++){
				addPageNumber.call(this,i);
			}
		}else{
			for(var i=1;i<=centerPageCount;i++){
				addPageNumber.call(this,i);
			}
			//右侧要创建多少分页
			if(nowPage<rightPageMx){
				for(var i=initRightPage;i<=total;i++){
					addPageNumber.call(this,i);
						
				}
				addEllipsis.call(this,initRightPage);
			}
		}
		freshCss.call(this);
	}
	function ifClick(){
		var nowPage = this.nowPage;
		var total = this.total;
		var centerPageCount = this.centerPageCount;
		var minSidePageCountLater = this.minSidePageCountLater;
		var rightMinSidePageCountLater = total - minSidePageCountLater;
		var minSidePageCount = this.minSidePageCount;
		
		//通过当前页计算出需要增加的页数
		//如果当前页的2倍减一大于未分离顶头最少的分页数 且 小于未分离顶头最多的分页数时，向右
		var seeCount = (centerPageCount-1)/2;
		var leftPageCountMx = centerPageCount+seeCount;
		var leftPageCountMn = (centerPageCount+1)/2;
		var rightPageCountMx = total-seeCount;
		var rightPageCountMn = total-leftPageCountMn;
		
			//这个情况下左侧顺序加一
			//计算加几个
			var addPage = nowPage-seeCount;
			var addPageEnd = nowPage+seeCount;
			for(var i=addPage;i<=addPageEnd&&i<=total&&i>=1;i++){
				addPageNumberSubscript.call(this,i);
			}
		if(total<(centerPageCount+seeCount*2)){
			
		}else{
			//如果当前页小于左侧最小
			if(nowPage<=minSidePageCountLater){
				//加省略
				addEllipsis.call(this,rightMinSidePageCountLater+1);
				var addStart = minSidePageCountLater+1;
				var addEnd = centerPageCount; 
				for(var i = addStart;i<addEnd;i++){
					addPageNumberSubscript.call(this,i);
				}
				//删除7后面的
				var deleteStart = centerPageCount+1;
				var deleteRightPageEnd = total-minSidePageCountLater;
				for(var i=deleteStart;i<=deleteRightPageEnd;i++){
					deletePageNumber.call(this,i);
				}
				
			}
			if((nowPage+seeCount)>=centerPageCount && (nowPage+seeCount)<leftPageCountMx){
				//加省略
				addEllipsis.call(this,rightMinSidePageCountLater+1);
			}
			
			
			//如果当前页加上可视范围大于左侧最大数了，则需要缩率分页项
			if((nowPage+seeCount)>=leftPageCountMx && nowPage<=rightPageCountMn){
				
				//加省略
				addEllipsis.call(this,minSidePageCountLater);
				addEllipsis.call(this,rightMinSidePageCountLater+1);
				//计算删除的项和个数
				var deletePage = minSidePageCountLater+1;
				var deleteEnd = nowPage-seeCount;
				for(var i=deletePage;i<deleteEnd;i++){
					deletePageNumber.call(this,i);
				}
				var deleteRightPage = nowPage+seeCount+1;
				var deleteRightPageEnd = total-minSidePageCountLater;
				for(var i=deleteRightPage;i<=deleteRightPageEnd;i++){
					deletePageNumber.call(this,i);
				}
			}
			var rightPoint = total-seeCount;
			var rightNoMovePoint = total-centerPageCount;
			var rightMaxPoint = total-leftPageCountMx;
			//当前页小于右侧临界点
			if((nowPage-seeCount)>=rightPageCountMn && nowPage<=rightNoMovePoint){
				//加省略
				//addEllipsis.call(this,minSidePageCountLater);
			}
			//当前页大于右侧临界点，且小于右侧
			if((nowPage-seeCount)>=rightNoMovePoint){
				//加省略
				addEllipsis.call(this,minSidePageCountLater);
				var addStart = rightMaxPoint+1;
				var addEnd = rightMinSidePageCountLater; 
				/*for(var i = addStart;i<=addEnd;i++){
					//addPageNumberSubscript.call(this,i);
				}*/
				//删除7后面的
				var deleteStart = minSidePageCountLater+1;
				var deleteRightPageEnd = rightMaxPoint;
				for(var i=deleteStart;i<=deleteRightPageEnd;i++){
					deletePageNumber.call(this,i);
				}
			}
		}
		
		
	}
	function deleteEllipsis(){
		var ul = this.pageNumberList;
		//清空
		var list = ul.children;
		var returnExist;
		array.forEach(list,function(item,i){
			if(item){
				var listText = item.innerText;
				if(listText == "…"){
					item.parentNode.removeChild(item);
				}
			}
				
		});
	}
	//判断当前分页是否已经存在
	function ifExists(index){
		var exist = false;
		var ul = this.pageNumberList;
		var list = ul.children;
		array.forEach(list, function(item,i){
			if(item.innerText==(index+"")){
				exist = true;
			}
			
		});
		return exist;
	}
	//判断分页的前后存在的最近分页项
	function getNearPageNumber(index){
		var nowPage = this.nowPage;
		var ul = this.pageNumberList;
		//清空
		var list = ul.children;
		var returnItem;
		var nearCount;
		array.forEach(list,function(item,i){
			var listNumber = parseInt(item.innerText);
			nowNear = Math.abs(listNumber-index);
		
			if(!nearCount){
				nearCount = nowNear;
			}else{
				if(nearCount>nowNear){
					nearCount = nowNear;
					returnItem = item;
				}
			}
		});
		return returnItem;
	}
	//根据当前页获取当前页的项
	function getNowPageLi(){
		var nowPage = this.nowPage;
		var ul = this.pageNumberList;
		//清空
		var list = ul.children;
		var returnItem;
		array.forEach(list,function(item,i){
			var listNumber = parseInt(item.innerText);
			if(nowPage==listNumber){
				returnItem = item;
			}
		});
		return returnItem;
	}
	//加上缩率号，省略分页项
	function addEllipsis(index){
		//通过当前页判断是否加省略，加在哪里
		//一旦当前页大于左侧分离临界点的值时，左侧需要加省略
		//首先判断省略是否已经存在
		var ellipsis = ifEllipsisExist.call(this,index);
		if(!ellipsis){
			setTimeout(lang.hitch(this,function(){
				var deponItem = getEllipsisDepon.call(this,index);
				var pageNumberTemplate = "<a class=\"_cube ellipse\"><span>…</span></a>";
				var li = domConstruct.create(
					"li",
					{
						//style:style,
						innerHTML:pageNumberTemplate
					}, 
					this.pageNumberList
				);
				
				//如果依赖的页等于左侧最小值，则将省略加在左侧最小值的项的右侧
				var minSidePageCountLater = this.minSidePageCountLater;
				var total = this.total ;
				var deleteRightPageEnd = total-minSidePageCountLater+1;
				if(index==minSidePageCountLater){
					query(deponItem).after(li);
				//如果依赖的页等于右侧最小值，则将省略加载右侧最小值的项的左侧
				}else if(index==deleteRightPageEnd){
					query(deponItem).before(li);
				}
			}),0);
		}
	}
	//判断要加的省略是否已经存在
	function ifEllipsisExist(index){
		var ellipsis = false;
		var deonItem = getEllipsisDepon.call(this,index);
		//清空
		var li = query(deonItem).next("li");
		if(li[0]){
			var liText = li[0].innerText;
			if(liText=="…"){
				ellipsis = true;
			}
			//console.log(li);
		}
		return ellipsis;
	}
	//找到加或减省略的依赖分页项
	function getEllipsisDepon(index){
		var ul = this.pageNumberList;
		//清空
		var list = ul.children;
		var returnExist;
		array.forEach(list,function(item,i){
			var listNumber = parseInt(item.innerText);
			if(listNumber == index){
				returnExist = item;
			}
		});
		return returnExist;
	}
	//删除分页项
	function deletePageNumber(index){
		//判断当前分页是否已经存在
		var exits = ifExists.call(this,index);
		if(exits){
			setTimeout(lang.hitch(this,function(){
				var ul = this.pageNumberList;
				
				var list = ul.children;
				array.forEach(list, function(item,i){
					if(item){
						var listNumber = parseInt(item.innerText);
						
						if(listNumber==index){
							//cubeList.removeChild(item);
							item.parentNode.removeChild(item);
						}

					}
					
				});
			}));
		}
	}
	function addPageNumberSubscript(index){
		deleteEllipsis.call(this);
		//判断当前分页是否已经存在
			var exits = ifExists.call(this,index);
			if(!exits){
				setTimeout(lang.hitch(this,function(){
					var pageNumberTemplate = "<a class=\"_cube\"><span class=\"_pageNumber\">" + index + "</span></a>";
					
					//查找当前要加的分页项的前后的分页项
					var item = getNearPageNumber.call(this,index);
					var li = domConstruct.create(
						"li",
						{
							//style:style,
							innerHTML:pageNumberTemplate
						}, 
						this.pageNumberList
					);
					var nearNumber = parseInt(item.innerText);
					if(index>nearNumber){
						query(item).after(li);
					}else if(index<nearNumber){
						query(item).before(li);
					}
					
					
					var dthis = this;
					on(li,"click",function(){
						liDom = query(this)[0];
						
						//console.log(liDom);
						var pageIndex = liDom.innerText;
						dthis.nowPage = parseInt(pageIndex);
						//console.log({"nowPage":pageIndex});
						ifClick.call(dthis);
						//刷新当前样式
						freshCss.call(dthis);
						dthis.emit(clickPage,{nowPage:pageIndex});
					})
					
				}),0);
			}
	}
	//添加分页项
	function addPageNumber(index){
			//判断当前分页是否已经存在
			var exits = ifExists.call(this,index);
			if(!exits){
				setTimeout(lang.hitch(this,function(){
					var pageNumberTemplate = "<a class=\"_cube\"><span class=\"_pageNumber\">" + index + "</span></a>";
					
					var li = domConstruct.create(
						"li",
						{
							//style:style,
							innerHTML:pageNumberTemplate
						}, 
						this.pageNumberList
					);
					
					if(this.nowPage==index){
						// console.log(query(li).children("a"));
						// domClass.add(query(li).children("a"),"aSelected");
						var nodelist = query(li).children("a");
						nodelist.addClass("aSelected");
					}
					
					var dthis = this;
					on(li,"click",function(){
						liDom = query(this)[0];
						
						//console.log(liDom);
						var pageIndex = liDom.innerText;
						dthis.nowPage = parseInt(pageIndex);
						//console.log({"nowPage":pageIndex});
						ifClick.call(dthis);
						//刷新当前样式
						freshCss.call(dthis);
						dthis.emit(clickPage,{nowPage:pageIndex});
					})
					
				}),0);
			}
			
		}
	//刷新分页组件的样式
	function freshCss(){
		var nowPage = this.nowPage;
		var total = this.total;
		var ul = this.pageNumberList;
		//清空
		var cubeList = ul.children;
		//var nodelist = query(li).children("a");
		//nodelist.toggleClass("aSelected");
		//通过当前页计算当前页的前一页和后一页是否存在。以此来判定上一页和下一页是否可用
		if(nowPage>1){
			//设置上一页可用
			this.set("prevDisplay",true);
			//query("._Prev").style("display","block");
		}else{
			//设置上一页不可用
			this.set("prevDisplay",false);
			//query("._Prev").style("display","none");
		}
		if(nowPage<total){
			//设置下一页可用
			this.set("nextDisplay",true);
			//query("._Next").style("display","block");
		}else{
			//设置下一页不可用
			this.set("nextDisplay",false);
			//query("._Next").style("display","none");
		}
		array.forEach(cubeList, lang.hitch(this,function(item,i){
			var itemText = item.innerText;
			if(itemText==nowPage+""){
				
				query(item).children("a").addClass("aSelected");
			}else{
				query(item).children("a").removeClass("aSelected");
			}
		}));
	}
	//通过计算的出前后
	function addMore(){
		var nowPage = this.nowPage;
		
		
		//如果当前页小于
		if(this.nowPage){
			
		}
	}
	//左侧无变化
	function leftSideNoChange(){
		
	}
	//判断分页是否初始化完毕
	function ifDone(){
		var nowPage = this.nowPage;
		var total = this.total;
		var minSidePageCountLater = minSidePageCountLater;
		
		var allDone = true;
		var startPage = 1;
		var endPage = minSidePageCountLater;
		for(var i = startPage ; i<=endPage ; i++){
			var exits = ifExists.call(this,index);
			if(!exits){
				allDone = false;
			}
		}
		var rightStart = total-minSidePageCountLater;
		var rightEnd = total;
		for(var i = rightStart ; i<=rightEnd ; i++){
			var exits = ifExists.call(this,index);
			if(!exits){
				allDone = false;
			}
		}
		return allDone;
		
	}
	
	return declare("widgets/Pagination/Pagination", [ WidgetBase, TemplatedMixin ,Evented], {
		
		prevLabel:"prev",
		nextLabel:"next",
		total : 20,
		nowPage: 1,
		//未分离顶头最少的分页数
		minSidePageCount:7,
		//分离后顶头分页数
		minSidePageCountLater:2,
		//未分离顶头最多的分页数
		maxSidePageCount:10,
		//分离后中间的分页数
		centerPageCount:7,
		//分页的状态
		pageState:0,
		
		//上一页的显示
		prevDisplay:true,

         _setPrevDisplayAttr: function(/*Boolean*/ prevDisplay){
             this._set("prevDisplay", prevDisplay);
            // domStyle.set(this.prevNode, "display", prevDisplay ? "block" : "none");
			if(prevDisplay){
				if(domClass.contains(this.prevNode, "pageSelected")){
					domClass.remove(this.prevNode,"pageSelected");
				}
			}else{
				domClass.add(this.prevNode,"pageSelected");
			}
			
         },
		//下一页的显示
		nextDisplay:true,
		 _setNextDisplayAttr: function(/*Boolean*/ nextDisplay){
             this._set("nextDisplay", nextDisplay);
             //domStyle.set(this.nextNode, "display", nextDisplay ? "block" : "none");
			 if(nextDisplay){
				if(domClass.contains(this.nextNode, "pageSelected")){
					domClass.remove(this.nextNode,"pageSelected");
				}
				
			 }else{
				domClass.add(this.nextNode,"pageSelected");
			 }
			
         },
		
		templateString: template,
		
		constructor : function(params, srcNodeRef)
		{
			//total 总页数
			this.total = params["total"];
			//this.arg = args;
		},
		
		postCreate: function(){
			this.inherited(arguments);
			initPage.call(this);
			//根据total的值来初始化UI
			/*for(var i=1;i<=this.total;i++){
				this.addPageNumber(i);
				
			}*/
		},
		
		
		_onPre:function(){
			if(this.nowPage-1<=1){
				this.nowPage = 1;
			}else{
				this.nowPage = this.nowPage-1;
			}
			ifClick.call(this);
			//刷新当前样式
			freshCss.call(this);
			this.emit(clickPage,{nowPage:this.nowPage});
			
		},
		_onNext:function(){
			if(this.nowPage+1>=this.total){
				this.nowPage = this.total;
			}else{
				this.nowPage = this.nowPage+1;
			}
			ifClick.call(this);
			//刷新当前样式
			freshCss.call(this);
			this.emit(clickPage,{nowPage:this.nowPage});
		},
		refresh:function(total){
			this.total = total;
			//判断当前分页是否加载完毕
			var doneTime = setInterval(lang.hitch(this,function(){
				var allDone = ifDone.call(this);
				if(allDone){
					window.clearInterval(doneTime);
					var ul = this.pageNumberList;
					//清空
					var list = ul.children;
					while(ul.lastChild){
						ul.removeChild(ul.lastChild);
					}
					
					
					
					/*for(var i=1;i<=this.total;i++){
						this.addPageNumber(i);*/
						initPage.call(this);
					/*}*/
				}
			}), 0);
			
			
		}
		
		
	});	
	
	
});