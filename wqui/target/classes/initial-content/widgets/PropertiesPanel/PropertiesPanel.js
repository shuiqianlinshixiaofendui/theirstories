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
 
define("widgets/PropertiesPanel/PropertiesPanel",
[
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/template.html",
	"dojo/dom-construct",
	"dojo/dom",
	"dijit/form/HorizontalSlider",
	"dojo/query",
	"dojo/on",
	"dijit/form/Select",
	"dojo/Evented"	
],
function(declare, WidgetBase, TemplatedMixin, template,domConstruct,dom,HorizontalSlider,query,on,Select,Evented){
	function createItem(){			
		//2.创建图标div
		var imgDiv ="<div class='icon'><img src='images/icon.png'/></div>";		
		//4.打开或者关闭的div
		var showPanelDiv ="<div class='openOrCloseImg'  style='float:left;'><img src='images/rightwardBtn.png'/></div>";
		//创建Options
		var createOption="<option value='colorPanel'>colorPanel</option><option value='metal'>metal</option>" ;			
		//创建select
		var createSelectDiv="<div id='createSelectDiv' style='width:120px;height:30px;float:left;'></div>";
		//创建显示标题内容的Div
		var showTXTDiv ="<div class='showTXT' style='color:white;'>这是一段文字</div>";		
		//创建内容会改变的div
		var changeBodyDiv = "<div id='changebodydiv' style='width:100%;min-height:30px;margin-top:5px;padding-top:10px;'></div>"
		//3.创建右侧widget容器
		var propertyDiv="<div class='panelBody' id='liBodyContainer'>"+showPanelDiv+createSelectDiv+showTXTDiv+changeBodyDiv+"</div>"	
		//1.创建div容器
		var liContainerDiv = "<div class='liContainerDiv' id='liContainer'>"+imgDiv+propertyDiv+"</div>";
		var li = domConstruct.create("li",
				{
					id:"a1",
					innerHTML : liContainerDiv
				},	this.panelContainerNode
		);		
	}
	//创建select选择器
	function createSelect(args,defaultSelect){	
		var options =[];
		for(var i=0;i<args.length;i++){
			if(args[i]["type"]==defaultSelect){
				var colorArray={label:args[i]["type"],value:args[i]["type"],selected:true};
				options.push(colorArray);
				continue;
			}
			var jsonArray = {label:args[i]["type"],value:args[i]["type"]};
			options.push(jsonArray);
		}	
		new Select({
			id:"allSelect",
            name: "select2",
            options: options
        }).placeAt(dom.byId("createSelectDiv"));		
	}
	//创建select事件
	function createSelectClient(args){	
		var dthis = this;
		on(dijit.byId("allSelect"),"change",function(){	
			if(query("#redSlider").length != 0){
				dijit.byId("redSlider").destroy();
			}
			if(query("#blueSlider").length != 0){
				dijit.byId("blueSlider").destroy();
			}
			if(query("#greenSlider").length != 0){
				dijit.byId("greenSlider").destroy();
			}	
			var arg =[];
			for(var i=0;i<args.length;i++){
				if(args[i]["type"]==this.get("value")){			
					arg.push(args[i]);
					break;
				}			
			}			
			//console.log(arg);	
			//console.log(arg[0]);	
			createWidgetByType.call(dthis,this.get("value"),arg[0]);			
		});		
	}
	//创建滑动器
	function createSlider(sliderId,positionValue,minimumValue,maximumValue,placeAtId){
		
		var slider = new HorizontalSlider({
            id: sliderId,
            value: positionValue,
            minimum: minimumValue,
            maximum: maximumValue,
            intermediateChanges: true,
            style: "width:195px;"
        }).placeAt(placeAtId);
	}
	//创建滑动器事件
	function createSliderClient(sliderId,arg){	
		var dthis = this;
		on(sliderId,"change",function(){						
			if(this.id=="redSlider"){
				var rgbArray = getBackgroundColor();	
			    dom.byId("colorShow").style.backgroundColor="rgb("+parseInt(this.value)+","+rgbArray[1]+","+rgbArray[2]+")";
			}
			if(this.id=="greenSlider"){
				var rgbArray = getBackgroundColor();	
				dom.byId("colorShow").style.backgroundColor="rgb("+rgbArray[0]+","+parseInt(this.value)+","+rgbArray[2]+")";
			}
			if(this.id=="blueSlider"){
				var rgbArray = getBackgroundColor();	
				dom.byId("colorShow").style.backgroundColor="rgb("+rgbArray[0]+","+rgbArray[1]+","+parseInt(this.value)+")";
			}
			if(this.id=="metalbumptex"){				
				dom.byId("metalBumptex").value = this.value;
				arg["bumptex"] = this.value;	
				//console.log("arg   :",arg);	
				dthis.emit("send/metalBumptex",arg);
			}
			if(this.id=="metalnormaltex"){
				dom.byId("metalNormaltex").value = this.value;
				arg["normaltex"] = this.value;	
				//console.log("arg   :",arg);	
				dthis.emit("send/metalNormaltex",arg);
			}
			if(this.id=="metalexp"){
				dom.byId("metalExp").value = this.value;
				arg["exp"] = this.value;	
				//console.log("arg   :",arg);	
				dthis.emit("send/metalNormaltex",arg);
			}
		});	
	}
	//获得指定的div背景色
	function getBackgroundColor(){
			var c = dom.byId("colorShow").style.backgroundColor;
			c = c.substr(c.indexOf("("),c.indexOf(")")).replace(/[ ]/g,"");				
			c = c.substr(c.indexOf("(")+1,c.indexOf(")")-1);			
			return c.split(",");	
	}	
	//对所有类型进行创建
	function createWidgetByType(typename,arg){		
		var dthis = this;
		//colorpanel类型
		if(typename=="colorpanel"){			
			//创建显示颜色的div
			var colorShowDiv ="<div id='colorShow' style='width:30px;height:30px;background-color:#ff0000;margin:0px 5px 0px 0px;float:left;'></div>";		
			//容纳slider的Div
			var sliderDiv ="<div id='sliderShow' style='width:40%;height:50px;float:left;'></div>";	
			dom.byId("changebodydiv").innerHTML=colorShowDiv+sliderDiv;
			//红色滑动块
			createSlider("redSlider",255,0,255,dom.byId("sliderShow"));		
			createSliderClient.call(dthis,dijit.byId("redSlider"));
			//绿色滑动块儿
			createSlider("greenSlider",0,0,255,dom.byId("sliderShow"));
			createSliderClient.call(dthis,dijit.byId("greenSlider"));
			//蓝色滑动块儿
			createSlider("blueSlider",0,0,255,dom.byId("sliderShow"));
			createSliderClient.call(dthis,dijit.byId("blueSlider"));
		}
		//matte 类型
		if(typename=="matte"){		
			dom.byId("changebodydiv").innerHTML="";
			var kdValue="<label for='kdX' style='color:white;'>kd :</label><input id='kdX' style='width:50px;' data-dojo-type='dijit/form/TextBox' /><input id='kdY' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><input id='kdZ' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><br/><br/>";
			dom.byId("changebodydiv").innerHTML=kdValue;		
		}	
		if(typename=="mirror"){	
			dom.byId("changebodydiv").innerHTML="";
			var _kr = arg["kr"].split(" ");	
			var _emission=arg["emission"].split(" ");
			var _normaltex = arg["normaltex"];	
			var _bumptex = arg["bumptex"];
			var kdValue="<label for='mirrorX' style='color:white;'>kr :</label><input id='mirrorKdx' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[0]+"'/><input id='mirrorKdy' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[1]+"'/><input id='mirrorKdz' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[2]+"'/><br/><br/>";
			var normaltexValue="<label for='normaltex' style='color:white;'>normaltex:</label><input id='mirrorNormaltex' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_normaltex+"'/><br/><br/>"
			var bumptexValue="<label for='bumptex' style='color:white;'>bumptex:</label><input id='mirrorBumptex' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_bumptex+"'/><br/><br/>"
			var emissionValue="<label for='krX' style='color:white;'>emission :</label><input id='mirrorEmissionX' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[0]+"'/><input id='mirrorEmissionY' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[1]+"'/><input id='mirrorEmissionZ' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[2]+"'/><br/><br/>";
			dom.byId("changebodydiv").innerHTML=kdValue+normaltexValue+bumptexValue+emissionValue;	
		
		}
		//metal 类型
		if(typename=="metal"){	
			var dthis = this;
			dom.byId("changebodydiv").innerHTML="";
			var _exp = arg["exp"];
			var _kr = arg["kr"].split(" ");	
			var _emission=arg["emission"].split(" ");
			var _normaltex = arg["normaltex"];	
			var _bumptex = arg["bumptex"];
			var expValue="<div><label  style='color:white;float:left;'>exp:</label><input id='metalExp' style='width:50px;float:left;' data-dojo-type='dijit/form/TextBox' value='"+_exp+"'/><div id='controlExp' style='width:160px;height:30px;float:left;'></div><br/><br/></div>";
			var krValue="<div><label  style='color:white;'>kr :</label><input id='metalKrx' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[0]+"'/><input id='metalKry' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[1]+"'/><input id='metalKrz' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_kr[2]+"'/><br/><br/></div>";
			var normaltexValue="<div><label  style='color:white;float:left;'>normaltex:</label><input id='metalNormaltex' style='width:50px;float:left' data-dojo-type='dijit/form/TextBox' value='"+_normaltex+"'/><div id='controlNormal' style='width:160px;height:30px;float:left;'></div><br/><br/></div>";
			var bumptexValue="<div><div style='float:left;'><label  style='color:white;'>bumptex:</label><input id='metalBumptex' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_bumptex+"'/></div><div id='controlBump' style='width:160px;height:30px;float:left;'></div><br/><br/></div>";
			var emissionValue="<div><label  style='color:white;'>emission :</label><input id='metalEmissionx' style='width:50px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[0]+"'/><input id='metalEmissiony' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[1]+"'/><input id='metalEmissionz' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' value='"+_emission[2]+"'/><br/><br/></div>";
			dom.byId("changebodydiv").innerHTML=expValue+krValue+normaltexValue+bumptexValue+emissionValue;	
			createSlider("metalexp",5000,1000,5000,dom.byId("controlExp"));
			createSlider("metalbumptex",1,0,1,dom.byId("controlBump"));
			createSlider("metalnormaltex",1,0,1,dom.byId("controlNormal"));
			createSliderClient.call(dthis,dijit.byId("metalexp"),arg);
			createSliderClient.call(dthis,dijit.byId("metalbumptex"),arg);
			createSliderClient.call(dthis,dijit.byId("metalnormaltex"),arg);
			query("#metalKrx,#metalKry,#metalKrz,#metalNormaltex,#metalBumptex,#metalEmissionx,#metalEmissiony,#metalEmissionz,#metalExp").on("blur",function(){
				arg["exp"] = dom.byId("metalExp").value.trim();
				arg["kr"] = dom.byId('metalKrx').value.trim()+" "+dom.byId('metalKry').value.trim()+" "+dom.byId('metalKrz').value.trim();
				arg["normaltex"] = dom.byId('metalNormaltex').value.trim();
				arg["bumptex"]=dom.byId('metalBumptex').value.trim();			
				arg["emission"] = dom.byId('metalEmissionx').value.trim()+" "+dom.byId('metalEmissiony').value.trim()+" "+dom.byId('metalEmissionz').value.trim();
				dthis.emit("send/exp",arg);
				dthis.emit("send/metalKr",arg);					
				dthis.emit("send/metalNormaltex",arg);
				dthis.emit("send/metalBumptex",arg);				
				dthis.emit("send/metalEmission",arg);
			});
		}
		if(typename=="glass"){
			dom.byId("changebodydiv").innerHTML="";
			var krValue="<label for='krX' style='color:white;'>kr :</label><input id='krX' style='width:50px;' data-dojo-type='dijit/form/TextBox' /><input id='krY' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><input id='krZ' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><br/><br/>";
			var kdValue="<label for='kdX' style='color:white;'>kd :</label><input id='kdX' style='width:50px;' data-dojo-type='dijit/form/TextBox' /><input id='kdY' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><input id='kdZ' style='width:50px;margin-left:4px;' data-dojo-type='dijit/form/TextBox' /><br/><br/>";
			var ioroutsideValue="<label for='ltb' style='color:white;'>ioroutside:</label><input id='ltb' style='width:50px;' data-dojo-type='dijit/form/TextBox' /><br/><br/>";
		    var iorinsideValue="<label for='ltb' style='color:white;'>iorinside:</label><input id='ltb' style='width:50px;' data-dojo-type='dijit/form/TextBox' /><br/><br/>";
		    dom.byId("changebodydiv").innerHTML=krValue+kdValue+ioroutsideValue+iorinsideValue;
		}
		if(typename=="archglass"){
			dom.byId("changebodydiv").innerHTML="";
		}
		if(typename=="mix"){
			dom.byId("changebodydiv").innerHTML="";
		}
		if(typename=="null"){
			dom.byId("changebodydiv").innerHTML="";
		}
		if(typename=="mattetranslucent"){
			dom.byId("changebodydiv").innerHTML="";
		}
		if(typename=="glossy2 "){
			dom.byId("changebodydiv").innerHTML="";
		}
		
	}
//5.获取选中的id
//6.根据头部的id，创建对应的widgets 
//7.时时发送临听事件
//8.创建mix形式的div 
//9.找到叶子mix节点
//10.定义变量判断是否添加


var retClass =  declare("widgets/PropertiesPanel/PropertiesPanel", [ WidgetBase, TemplatedMixin,Evented], {
		templateString:template,
		constructor : function(args)
		{
			this.args = args;			
		},
		initCreateItem:function(){			
			createItem.call(this);			
		},
		setDefaultSelected:function(defaultSelect){
			createSelect.call(this,this.args,defaultSelect);
			createSelectClient.call(this,this.args);	
		},
		setSelectedClient:function(typename){
			var arg =[];
			for(var i=0;i<this.args.length;i++){
				if(this.args[i]["type"]==typename){			
					arg.push(this.args[i]);
					break;
				}			
			}		
			createWidgetByType.call(this,typename,arg[0]);			
		},
		getWidgetByType:function(val){
			createWidgetByType.call(this,val);
		},
		postCreate:function(){					
	
		}
				
	});		
return retClass	;
});