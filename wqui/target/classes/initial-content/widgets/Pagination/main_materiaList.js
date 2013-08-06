/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/
//定义一个模块, 分页显示
define("widgets/Pagination/main_materiaList",
[
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/dom-style",
	"dojo/Evented",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template_materiaList.html",
],
function(dom,domConstruct,on,domStyle,Evented,WidgetBase,TemplatedMixin,template){
	function setChangeStyle1(selectedObj){
		var page_number = this.page_number;
		var preObj = this.preNode;
		var nextpageObj = this.nextNode;
		if(selectedObj.name == "1" && (selectedObj.name !=  page_number)){
			preObj.className = "disabled_smk_pagination";
			nextpageObj.className = "smk_pagination";
		}else if((selectedObj.id == "page_" + page_number) && (selectedObj.id != "page_1")){
			preObj.className = "smk_pagination";
			nextpageObj.className = "disabled_smk_pagination";
		}else{
			preObj.className = "smk_pagination";
			nextpageObj.className = "smk_pagination";
		}
		selectedObj.className = "active_smk_link";
		this.curObj.className = "normal_pagination_style";
		this.curObj = selectedObj;
	}
	
	function setChangeStyle(selectedObj){
		var page_number = this.page_number;
		var preObj = this.preNode;
		var nextpageObj = this.nextNode;
		if(selectedObj.name == "1" && (selectedObj.name != page_number)){
			preObj.className = "disabled_smk_pagination";
			nextpageObj.className = "smk_pagination";
		}else if((selectedObj.name == page_number) && (selectedObj.name != "1")){
			preObj.className = "smk_pagination";
			nextpageObj.className = "disabled_smk_pagination";
		}else{
			preObj.className = "smk_pagination";
			nextpageObj.className = "smk_pagination";
		}
		selectedObj.className = "active_smk_link";
		
		if(selectedObj.name == "3"){
			var num = Number(this.curObj.name);
			switch(num){
				case 1 : case 2: case 3: case 4: case 5: case 6: case (page_number - 1): case page_number:
					this.curObj.className = "normal_pagination_style";
				break;
			}
			this.curObj = selectedObj;
		}else if(selectedObj.name == (page_number - 1)){
			var num = Number(this.curObj.name);
			switch(num){
				case 1: case 2: case 3: case page_number: case (page_number - 1): case (page_number - 2): case (page_number - 3): case (page_number - 4):
					this.curObj.className = "normal_pagination_style";
				break;
			}
			this.curObj = selectedObj;
		}else if((selectedObj.name == "6" && this.curObj.name == "4") || ((selectedObj.name == (page_number -4)) && this.curObj.name == (page_number - 2))){
			this.curObj = selectedObj;
		}else {
			this.curObj.className = "normal_pagination_style";
			this.curObj = selectedObj;
		}
	}
	
	function sendMessage(value){
		var data = {"curPage":value};
		this.emit("changePage",data);
	}
	function page_click1(selectObj){
		if(this.curObj.name != selectObj.name){
			setChangeStyle1.call(this,selectObj);
			var value = Number(selectObj.name);
			sendMessage.call(this,value);
		}
	}
	
	function nextpage_click1(){
		var value = Number(this.curObj.name) + 1;
		if(value <= this.page_number){
			var children = getchildNodes.call(this);
			var newObj = children[value - 1];
			setChangeStyle.call(this,newObj);
			sendMessage.call(this,value);
		}
	}
	
	function prevpage_click1(){
		var value = Number(this.curObj.name) - 1;
		if(value){
			var children = getchildNodes.call(this);
			var newObj = children[value - 1];
			setChangeStyle.call(this,newObj);
			sendMessage.call(this,value);
		}
	}
	
	function click_page_number_1(){
		var page_number = this.page_number;
		var children = getchildNodes.call(this);
		for(var i = (page_number - 5);i <= (page_number-3); i++){
			children[i].className = "show_page";
			children[i].innerHTML = i + 1;
		}
		for(var i = 4;i< (page_number - 5);i++ ){
			children[i].className = "hide_page";
		}
		children[3].className = "show_elipsis";
		children[3].innerHTML = "...";
		this.old_elip1 = 3;
	}
	
	function click_page_number_3(){
		var children = getchildNodes.call(this);
		var page_number = this.page_number;
		for(var i = 4;i <= (page_number - 6) ;i++){
			children[i].className = "hide_page";
		}
		children[page_number - 3].className = "show_page";
		children[page_number - 3].innerHTML = page_number - 2;
		children[page_number - 5].className = "show_page";
		children[page_number - 5].innerHTML = page_number - 4;
		children[3].className = "show_elipsis";
		children[3].innerHTML = "...";
		this.old_elip2 = 3;
	}
	function showTwoElipsis(selectedObj){
		var children = getchildNodes.call(this);
		var elip1 = Number(selectedObj.name) - 3;
		var elip2 = Number(selectedObj.name) + 1;
		var middle_left = Number(selectedObj.name) - 2;
		var middle_right = Number(selectedObj.name);
		children[elip1].className = "show_elipsis";
		children[elip2].className = "show_elipsis";
		children[elip1].innerHTML = "...";
		children[elip2].innerHTML = "...";
		children[middle_left].className = "show_page";
		children[middle_right].className = "show_page";
		children[middle_left].innerHTML = Number(selectedObj.name) - 1;
		children[middle_right].innerHTML = Number(selectedObj.name) + 1;
		this.old_elip1 = elip1;
		this.old_elip2 = elip2;
		
	}
	function click_page3(){
		var children = getchildNodes.call(this);
		for(var i = 3;i <= 5 ;i++){
			children[i].className = "show_page";
			children[i].innerHTML = i + 1;
		}
		for(var i = 7;i< this.page_number - 2;i++ ){
			children[i].className = "hide_page";
		}
		children[6].className = "show_elipsis";
		children[6].innerHTML = "...";
		this.old_elip1 = 6;
	}
	function click_page5(){
		var children = getchildNodes.call(this);
		children[3].className = "show_page";
		children[3].innerHTML = 4;
		children[6].className = "show_elipsis";
		children[6].innerHTML = "...";
		this.old_elip2 = 6;
	}
	function del_elip(){
		var children = getchildNodes.call(this);
		if(this.old_elip1){
			children[this.old_elip1].className = "hide_elipsis";
			this.old_elip1 = null;
		}
		if(this.old_elip2){
			children[this.old_elip2].className = "hide_elipsis";
			this.old_elip2 = null;
		}
	}
	function page_click(selectObj){
		if(this.curObj.name != selectObj.name && (selectObj.innerHTML != "...")){
			if(selectObj.name >= 6 && (selectObj.name < (this.page_number-3))){
				del_elip.call(this);
				showTwoElipsis.call(this,selectObj);
			}
			if(selectObj.name == "5"){
				del_elip.call(this);
				click_page5.call(this);
			}
			if(selectObj.name == "3"){
				del_elip.call(this);
				click_page3.call(this);
			}
			if(selectObj.name == (this.page_number-1)){
				del_elip.call(this);
				click_page_number_1.call(this);
			}
			if(selectObj.name == (this.page_number-3)){
				del_elip.call(this);
				click_page_number_3.call(this);
			}
			setChangeStyle.call(this,selectObj);
			var value = Number(selectObj.name);
			sendMessage.call(this,value);
		}
		
	}
	
	function prevpage_click(){
		var children = getchildNodes.call(this);
		var value = Number(this.curObj.name) - 1;
		if(value){
			var newObj = children[value - 1];
			if(value >= 6 && (value < (this.page_number-3))){
				del_elip.call(this);
				showTwoElipsis.call(this,newObj);
			}
			if(value == 5){
				del_elip.call(this);
				click_page5.call(this);
				
			}
			if(value == (this.page_number - 1)){
				del_elip.call(this);
				click_page_number_1.call(this);
			}
			setChangeStyle.call(this,newObj);
			sendMessage.call(this,value);
		}
		
	}
	
	function nextpage_click(){
		var children = getchildNodes.call(this);
		var value = Number(this.curObj.name) + 1;
		if(value <= this.page_number){
			var newObj = children[value - 1];
			if(value >= 6 && (value < (this.page_number-3))){
				del_elip.call(this);
				showTwoElipsis.call(this,newObj);
			}
			if(value == (this.page_number-3)){
				del_elip.call(this);
				click_page_number_3.call(this);
			}
			if(value == 3){
				del_elip.call(this);
				click_page3.call(this);
			}
			setChangeStyle.call(this,newObj);
			sendMessage.call(this,value);
		}
	}
	function create_page(n){
		var _this = this;
		for(var i = 1;i<= n;i++){
			var a = domConstruct.create("a",{
				innerHTML:i,
				href:"#",
				name:i
			},this.pageMatList_showUI);
			on(a,"click",function(){
				if(n < 8){
					page_click1.call(_this,this);
				} else{
					page_click.call(_this,this);
				}
			})
		}
		var children = getchildNodes.call(this);
		this.curObj = children[0];
		this.curObj.className = "active_smk_link";
	}
	
	/**
	 * 获取a list
	 */
	function getchildNodes(){
		var array = [];
		var nodes = this.pageMatList_showUI.childNodes;
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].nodeName == "A"){
				array.push(nodes[i]);
			}
		}
		return array;
	}
		
	function initPage(n){
		if(n<=8){
			create_page.call(this,n);
		}else if(n > 8){
			create_page.call(this,n);
			var children = getchildNodes.call(this);
			children[6].className = "show_elipsis";
			children[6].innerHTML = "...";
			for(var i = 8;i <= n-2; i++){
				children[i-1].className = "hide_page";
			}
		}
		this.preNode.className = "disabled_smk_pagination";
		if(this.page_number == 1){
			this.nextNode.className = "disabled_smk_pagination";
		}else if(this.page_number > 1){
			this.nextNode.className = "smk_pagination";
		}
	}
	var retClass = dojo.declare([WidgetBase, TemplatedMixin,Evented],{
		hrefURL : require.toUrl("widgets/Pagination/css/main_materiaList.css"),
		templateString:template,
		constructor : function(number){
			this.curObj = null;
			this.page_number = number;
			this.old_elip1 = null;
			this.old_elip2 = null;
			
		},
		postCreate : function(){
			initPage.call(this,this.page_number);
		},
		Recreate : function(n){
			// 删除之前创建的页面按钮
			this.page_number = n;
			var list = this.pageMatList_showUI
			domConstruct.empty(list);
			//重新创建新按钮
			initPage.call(this,n);
		},
		_onPre: function(){
			if(this.page_number <=8){
				prevpage_click1.call(this);
			}else if(this.page_number > 8){
				prevpage_click.call(this);
			}
		},
		_onNext: function(){
			if(this.page_number <=8){
				nextpage_click1.call(this);
			}else if(this.page_number > 8){
				nextpage_click.call(this);
			}
		},
		
	});
	return retClass;
	
});