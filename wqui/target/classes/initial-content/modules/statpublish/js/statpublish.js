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

define("statpublish/js/statpublish",
    [
		"dojo/_base/lang","dojo/on","dojo/_base/declare","dojo/dom-construct",
		"dojo/dom","dijit/form/Select",'dojox/grid/DataGrid','dojo/data/ItemFileWriteStore',
		"spolo/data/user","spolo/data/folder/previewlib","dojo/_base/array","dijit/form/DateTextBox"
	],
	function(
		lang,on,declare,domConstruct,dom,Select,DataGrid,
		ItemFileWriteStore,user_cls,previewlib_cls,arrayUtil,DateTextBox
	){
		var data_list = [];
		var user_list = [];	
		var retClass = declare("statpublish/js/statpublish",[],{
			constructor:function(containerId){
				this.createDivContainer(containerId);
				this.createToppart();	
				this.initListData();	
			},
			createDivContainer:function(containerId){
				domConstruct.create("div",{id:"toppart",style:"width:100%;height:30px;margin-top:15px;"},dom.byId(containerId));
				//创建分割线div
				domConstruct.create("div",{style:"border:1px solid #AAAAAA;height:0px;width:100%;"},dom.byId(containerId));
				//创建表div
				domConstruct.create("div",{id:"centerpart",style:"width:100%;height:460px;margin-top:10px;"},dom.byId(containerId));
	
			},
			createToppart:function(){
				if(dom.byId("toppart")){
					/* domConstruct.create("div",{id:"toppart2",style:"width:100px;height:100%;float:left;text-align:center;",innerHTML:"请选择起始日期:"},dom.byId("toppart")); */
					domConstruct.create("span",{id:"",innerHTML:"&nbsp;&nbsp;&nbsp;&nbsp;请选择起始日期："},dom.byId("toppart"));
					domConstruct.create("input",{id:"german"},dom.byId("toppart"));
					domConstruct.create("span",{id:"",innerHTML:"&nbsp;&nbsp;&nbsp;&nbsp;请选择结束日期："},dom.byId("toppart"));
					domConstruct.create("input",{id:"germanTo"},dom.byId("toppart"));
					domConstruct.create("button",{id:"sure",innerHTML:"确定"},dom.byId("toppart"));
					var _this = this;
					function eventHandler(e){
						var gridWid = dijit.byId("grid");
						if(gridWid){
							gridWid.destroy();	
						}
											
						_this.initListData();
					}
					function eventOnchange(e){
						germanTo.constraints.min = arguments[0];
					}
					function eventOnchangeto(){
						german.constraints.max = arguments[0];
					}
					
					var props = {
						id:'date1',
						name: "date1",
						value: new Date(),
						hasDownArrow: false,
						onChange: eventOnchange						
					};
					var german = new DateTextBox(props, "german");
					german.startup();
					
					var props1 = {
						id:'date2',
						name: "date2",
						value: new Date(),
						hasDownArrow: false,
						onChange: eventOnchangeto						
					};
					var germanTo = new DateTextBox(props1, "germanTo");
					germanTo.startup();
					
					var sure = dom.byId("sure");
					on(sure,"click",function(){
						eventHandler();
					})
					//初始的限定
					germanTo.constraints.min = german.value;
					german.constraints.max = germanTo.value;
					
				}else{
					console.log("dom.byId('toppart') is not exist!");
					return ;
				}				
			},
			
			initListData:function(){
			   if(user_list){
					user_list=[];
					data_list=[];
			   }
			   var dthis = this;
			   user_cls.getAllUsers(
					function(usersArray){		
						arrayUtil.forEach(usersArray, function(data){								
							user_list.push(data);						
						});
						dthis.initAllUserNum(user_list);
					},
					function(error){
						console.log(error);
					}
				);
			},
			initAllUserNum:function(user_list){				
				var sdate = new Date(dijit.byId("date1").value);	
				if(!sdate){
					console.log("当前时间不存在"+"dijit.byId('date1').value  is null!");
				}				
				var syear = sdate.getFullYear();
				var smonth = sdate.getMonth()+1;
				var sday = sdate.getDate();
				if(sday < 10){
					sday = "0"+sday;
				}else{
					sday = sday;
				}
				
				var edate = new Date(dijit.byId("date2").value);
				if(!edate){
					console.log("当前时间不存在"+"dijit.byId('date2').value  is null!");
				}				
				var eyear = edate.getFullYear();
				var emonth = edate.getMonth()+1;
				var eday = edate.getDate();
				if(eday < 10){
					eday = "0"+eday;
				}else{
					eday = eday;
				}
				
				var _this = this;
				arrayUtil.forEach(user_list, function(data){							
							var publishAuthor = data["realname"];	
							var nickName = data["nickname"];						
							/* if(!year){
								console.log("年份不存在");
								return ;
							}
							if(!month){
								console.log("月份不存在");
							}*/							
							if(publishAuthor){													
								var startTime = parseInt(smonth)/10<1?syear+"-0"+smonth+"-"+sday+"T00:00:00.000+08:00":year+"-"+month+"-"+sday+"T00:00:00.000+08:00";//year+"-"+month+"-"+day+"T00:00:00.000+08:00";
								var endTime =   parseInt(emonth)/10<1?eyear+"-0"+emonth+"-"+eday+"T23:59:59.000+08:00":year+"-"+month+"-"+eday+"T23:59:59.000+08:00";//year+"-"+month+"-"+day+"T00:00:00.000+08:00";
								var dthis = _this;
								previewlib_cls.searchforstatics({
									// "publishAuthor" : publishAuthor,               // 发布者
									"publishAuthor" : publishAuthor,               // 发布者
									"startTime" :startTime, // 起始时间（必须是这种格式）
									"endTime" : endTime,   // 终止时间 （必须是这种格式）
									"success" : function(jsonData){									
										var jsonstore = { col1: publishAuthor,col2:nickName, col3:jsonData["totalNum"],col4:jsonData["modelsTotal"]};
										data_list.push(jsonstore);			
										if(user_list.length == data_list.length){
											dthis.createCenter(data_list);
										}
									},
									"failed" : function(error){
										console.log(error);
									}
								});								
							}else{
								console.log("当前没有发布者");
								return ;
							}		
				});			
			},
			createCenter:function(val){			
				var new_val=[];
				user_list = val;
				//对val进行排序
				for(var i =0;i<val.length;i++){
					for(var j=i+1;j<val.length;j++){
						if(val[i]["col3"]<val[j]["col3"]){
							temp = val[i];
							val[i] = val[j];
							val[j] = temp;
						}
					}
				}				
				if(dom.byId("centerpart")){
				   /*set up data store*/
					var data = {
					  identifier: "id",
					  items: []
					};					
					var rows = val.length;
					for(var i = 0, l = val.length; i < rows; i++){
						data.items.push(lang.mixin({ id: i+1 }, val[i%l]));
					}
					var store = new ItemFileWriteStore({data: data});

					/*set up layout*/
					var layout = [[
					  {'name': '排名', 'field': 'id', 'width': '40px'},
					  {'name': '注册用户', 'field': 'col1', 'width': '150px'},
					  {'name': '注册姓名', 'field': 'col2', 'width': '70px'},
					  {'name': '效果图数量', 'field': 'col3', 'width': '70px'},
					  {'name': '模型数量', 'field': 'col4', 'width': '70px'}
					]];
	
					/*create a new grid*/
					var grid = new DataGrid({
						id: 'grid',
						store: store,
						structure: layout,
						rowSelector: '20px'});

						/*append the new grid to the div*/
						grid.placeAt("centerpart");

						/*Call startup() to render the grid*/
						grid.startup();
				}else{
					console.log("dom.byId('centerpart') is not exist");
					return ;
				}
			}
		
		});
		return retClass;
	}
);






