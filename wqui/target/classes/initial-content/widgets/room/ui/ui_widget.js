/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
**/
/*define("widgets/room/ui/ui_widget",[
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
	"dijit/form/CheckBox"
],function(
	on,
	dom,
	domstyle,
	domconstruct,
	CheckBox
){
	var model_list = [];
	
	var show_mdellist = dojo.declare([], {
		constructor : function(){
			this.init();
			_this = this;
		},
		init: function(){
			dom.byId("List").style.display='none';
			domstyle.set(dom.byId("showList"),{
				width:"6%",
				height:"6%",
				backgroundImage:"url('image/button/stretch.png')",
				backgroundRepeat:"no-repeat",
				backgroundSize:"100% 100%",
				float:"left"
			});
			
			domstyle.set(dom.byId("head"),{
				fontSize:"12pt",
				//color:"white",
				width:"30%",
				height:"5%",
				//backgroundImage:"url('image/button/button1.jpg')",
				//backgroundRepeat:"no-repeat",
				//backgroundSize:"100% 100%",
				float:"left"
			});
			domstyle.set(dom.byId("add"),{
				width:"30%",
				height:"5%",
				float:"right"
			});
			domstyle.set(dom.byId("delet"),{
				width:"30%",
				height:"5%",
				float:"right"
			});
			on(dom.byId("showList"),"click",function(){
				if(this.style.backgroundImage.indexOf('image/button/stretch.png')!=-1){
					domstyle.set(this,"backgroundImage","url('image/button/shrink.png')");
					dom.byId("List").style.display='block';
				}else if(this.style.backgroundImage.indexOf('image/button/shrink.png')!=-1){
					domstyle.set(this,"backgroundImage","url('image/button/stretch.png')");
					dom.byId("List").style.display='none';
				}
			});
		},
		showModelList : function(list){
			// console.log(domstyle.getComputedStyle(dom.byId("List")));
			//console.log(list, "@@@@List");
			for(var i=0; i< list.length; i++){
				var List = dom.byId("List");
				 domstyle.set(dom.byId("List"),{
					width:"70%",
					height:"253px",
					margin:"5% 20% 0% 20%",
					border:"5px solid #F8B3D0",
					backgroundColor:"#FFF5FA",
					overflowY : "scroll",
					float:"left"
				 });
				var modelName = list[i];
				
				domconstruct.create("li",{
					id:"li" + i,
				}, dom.byId("List"));
				
				domstyle.set(dom.byId("li" + i), {
					width:"80%",
					textAlign:"center",
				});
				domconstruct.create("input",{
					id:"checkbox" + i,
					type:"checkbox",
					value:modelName
				},dom.byId("li" + i));
				domconstruct.create("button",{
					id:"btn_" + i,
					innerHTML:modelName,
				}, dom.byId("li" + i));
				
				domstyle.set(dom.byId("btn_" + i),{
					color:"",
					backgroundColor:"",
					height:"25%",
					width:"80%",
				});
				
				on(dom.byId("btn_" + i),"click",function(){
					var curId = this.id;
					domstyle.set(this,"color","red");
					domstyle.set(this,"backgroundColor","#33a3dc");
					for(var i=0;i<list.length;i++ ){
						var otherId = "btn_" + i;
						if(curId != otherId){
						//console.log(otherId);
							id = i;
							domstyle.set(dom.byId("btn_" + i),"color","");
							domstyle.set(dom.byId("btn_" + i),"backgroundColor","");
						}
					}
				});
				on(dom.byId("checkbox" + i),"change",function(){
						var model_name = this.value;
						if(this.checked){
							model_list.push(model_name);
						} else {
							for(var i = 0; i < model_list.length; i++){
								if(model_list[i] == model_name){
									console.log(i,"i");
									model_list.splice(i,1);
								}
							}
						}
						console.log(_this.modelList());
				});
				
			}
		},
		modelList : function(){
			return model_list;
		},
		
		
	});
	return show_mdellist;
});*/