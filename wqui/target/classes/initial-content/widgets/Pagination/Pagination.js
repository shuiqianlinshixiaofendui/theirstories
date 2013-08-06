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
 
define("widgets/Pagination/Pagination",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
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
	
	return declare("widgets/Pagination/Pagination", [ WidgetBase, TemplatedMixin ,Evented], {
		
		firstLabel:"首页",
		prevLabel:"prev",
		nextLabel:"next",
		endLabel:"末页",
		pageTitle1:"当前",
		pageTitle2:"共",
		
		total : 0,
		_setTotalAttr: function(page){
			if(page==0){
				page=1;
			}
			this._set("total",page);
			if(this.totalNode){
				this.totalNode.innerHTML = this.total;
				if(this.total==1||this.total==0){
					this.set("firstDisplay",true);
					this.set("prevDisplay",true);
					this.set("nextDisplay",true);
					this.set("endDisplay",true);
				}
			}
			
			
		},
		nowPage: 1,
		
		_setNowPageAttr: function(page){
			 this._set("nowPage", page);
			 if(this.pageNode){
				this.pageNode.value = page;
				if(page==1){
					this.set("firstDisplay",true);
					this.set("prevDisplay",true);
				}else{
					this.set("firstDisplay",false);
					this.set("prevDisplay",false);
				}
				if(page==this.total){
					this.set("nextDisplay",true);
					this.set("endDisplay",true);
				}else{
					this.set("nextDisplay",false);
					this.set("endDisplay",false);
				}
			 }
			 
		},
		
		
		
		//分页的状态
		pageState:0,
		//首页的显示
		firstDisplay:true,
		_setFirstDisplayAttr:function(display){
			this._set("firstDisplay", display);
			if(display){
				domClass.add(this.firstNode,"_aSelected");
			}else{
				domClass.remove(this.firstNode,"_aSelected");
			}
			
		},
		//上一页的显示
		prevDisplay:true,
		_setPrevDisplayAttr:function(display){
			this._set("prevDisplay", display);
			if(display){
				domClass.add(this.prevNode,"_aSelected");
			}else{
				domClass.remove(this.prevNode,"_aSelected");
			}
			
		},

		//下一页的显示
		nextDisplay:false,
		_setNextDisplayAttr:function(display){
			this._set("nextDisplay", display);
			if(display){
				domClass.add(this.nextNode,"_aSelected");
			}else{
				domClass.remove(this.nextNode,"_aSelected");
			}
		},
		//末页的显示
		endDisplay:false,
		_setEndDisplayAttr: function(display){
			this._set("endDisplay", display);
			if(display){
				domClass.add(this.endNode,"_aSelected");
			}else{
				domClass.remove(this.endNode,"_aSelected");
			}
		},
			
		templateString: template,
		
		constructor : function(params, srcNodeRef)
		{
			if(params["total"]==0){
				this.set("total",1);
			}else{
				this.set("total",params["total"]);
			}
		},
		
		postCreate: function(){
			this.inherited(arguments);
			//initPage.call(this);
			
		},
		
		_onFirst:function(){
			if(this.nowPage != 1){
				this.set("nowPage",1);
				this.pageNode.value = 1;
				this.emit(clickPage,{"nowPage":this.nowPage});
			}
		},
		 _onPageChange:function(){
			
			var turnToPage = parseInt(this.pageNode.value);
			if(isNaN(turnToPage)){
				this.set("nowPage",this.nowPage);
				this.pageNode.value = this.nowPage;
			}else{
				if(turnToPage==this.nowPage){
					this.set("nowPage",this.nowPage);
					this.pageNode.value = this.nowPage;
				}else{
					if(turnToPage>=1&&turnToPage<=this.total){
						this.set("nowPage",turnToPage);
						this.pageNode.value = turnToPage;
						
					}else if(turnToPage>this.total){
						this.set("nowPage",this.total);
						this.pageNode.value = this.total;
					}else{
						this.set("nowPage",this.nowPage);
						this.pageNode.value = this.nowPage;
					
					}
					
				}
				
			}
			this.emit(clickPage,{"nowPage":this.nowPage});
		 },
		_onPre:function(){
			var turnToPage = this.nowPage-1;
			if(turnToPage<1){
			
			}else{
				this.set("nowPage",turnToPage);
				this.pageNode.value = turnToPage;
				this.emit(clickPage,{"nowPage":this.nowPage});
			}
		},
		_onNext:function(){
			var turnToPage = this.nowPage+1;
			if(turnToPage>this.total){
			
			}else{
				this.set("nowPage",turnToPage);
				this.pageNode.value = turnToPage;
				this.emit(clickPage,{"nowPage":this.nowPage});
			}
			
		},
		_onEnd:function(){
			if(this.nowPage != this.total){
				this.set("nowPage",this.total);
				this.pageNode.value  = this.nowPage;
				this.emit(clickPage,{"nowPage":this.nowPage});
			}
		},
		 refresh:function(total,nPage){
			//设置total到本地
			var total = parseInt(total);
			var nPage = parseInt(nPage);
			
			if(isNaN(total)){
				this.set("total",1);
			}else{
				
				if(total==0){
					total=1;
				}
				if(this.total != total){
					//重置分页组件
					this.set("total",total);
					if(isNaN(nPage) || nPage>total){
						this.set("nowPage",1);
					}else{
						this.set("nowPage",nPage);
					}
					this.emit(clickPage,{"nowPage":this.nowPage});
				}else{
					if(isNaN(nPage) || nPage>total|| this.nowPage == nPage){
						
					}else{
						this.set("nowPage",nPage);
						this.emit(clickPage,{"nowPage":this.nowPage});
					}
				}
			}
		}
		
		
	});	
	
	
});