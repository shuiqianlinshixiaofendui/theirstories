define("modeledit/js/modelversioninfo",[
			"dojo/_base/declare",
			"dojo/dom-construct",	
			"dojo/ready",
			"dojo/dom",
			"dojo/Evented",
			"dijit/form/DateTextBox",
			"dojo/data/ObjectStore",
			"dojox/grid/DataGrid",
			"dojo/store/Memory",		
			"dojo/on",
			"spolo/data/model"	
],function(declare,domConstruct,Ready,dom,Evented,DateTextBox,ObjectStore,DataGrid,Memory,on,model_cls){	
	var path;
	function createSearch(containerId){
		var search_wrap = domConstruct.create("div",{
			id:"search-wrap"
		},containerId);
		/*var searchForm = domConstruct.create("form",{
			id:"searchForm",
			name:"searchForm"
		},search_wrap);*/
		var search_left = domConstruct.create("div",{
			id:"search-left"
		},search_wrap);
		var search_mid = domConstruct.create("div",{
			id:"search-mid"
		},search_wrap);
		var queryText = domConstruct.create("input",{
			type:"text",
			id:"query",
			name:"query",
			value:""
		},search_mid);
		var searchButton =  domConstruct.create("button",{
			id:"searchButton"
			//,
			// type:"submit"
		},search_wrap);	
	}
	function createTXT(textValue,containerId){
		var searchButton =  domConstruct.create("div",{
			innerHTML:textValue			
		},containerId);	
	}
	function createDateTextBox(id,date,containerId){
		
		var props = {	
			id:id,
			name: "date1",
			value:date,	
			hasDownArrow: false,
			lang:"en-us",
			required:true,	
			style:"width:94px;height:20px;font-size:12px;padding-top:2px;"						
		};
		var german = new DateTextBox(props, containerId);
		german.startup();
	}
	function createDataGrid(json,containerId){
				var dataStore =  new ObjectStore({ objectStore:new Memory({ data: json.items }) });
				function formatFraction(value){		
					if(value=='当前版本'){
						return "<span style='color:orange;font-size:12px;'>(当前版本)</span>";
					}
					if(value=='cannotEdit'){
						return "<input type='radio' value="+value+" name='radioOne'  disabled=true >";		
					}
					var radioOne = "<input type='radio' value="+value+" name='radioOne' >";					
					return radioOne;	
				}
				function formatDownBtn(value){
					//console.log("这个值为: ",value);
					var src = "image/download_btn.png"; 
					return "<img src=\"" + src + "\" />"; 
				}
				var grid = new DataGrid({
					id:"grid",
					store: dataStore,
					query: { id: "*" },
					queryOptions: {},
					style:"font-size:12px;min-height:475px;",
					structure: [
						{ name: "版本号", field: "col1", width: "8%"},	
						{
							name: "当前版本",
							field: "col2",
							formatter: formatFraction,
							width: "10%" 
						},
						{ name: "作者", field: "col3", width: "12%" },
						{ name: "修改时间", field: "col4", width: "20%" },
						{ name: "下载", 
						  field: "col5",
						  formatter:formatDownBtn,
						  width: "6%"						
						 },
						{ name: "描述", field: "col6", width: "40%" },
							
					]
				}, containerId);
				grid.startup();
				var flag = false;
				grid.on("RowClick", function(evt){
					//选择当前版本
					if(evt.cellIndex==1){
						var idrow = evt.rowIndex;	
						var model = new model_cls(path);
						//先检查是否存在cannotEdit
						for(var i = 0;i<grid.rowCount;i++){
							var row_dat = grid.getItem(i);	
							var row_datVal = row_dat.col2;
							if(row_datVal=="cannotEdit"){
								flag = true;
							}							
						}	
						for(var i = 0;i<grid.rowCount;i++){
							var idx = i;
							if(idx==idrow){								
								rowData = grid.getItem(idrow);	
								var col2Value = rowData.col2;									
								if(col2Value!="cannotEdit"&&col2Value!="当前版本"){	
									grid.store.setValue(rowData,'col2','当前版本');
									model.reversion(
										rowData.col1,
										function(data){
											console.log("reversion ========== success");
											console.log(data);
										},
										function(error){
											console.log("reversion ========== failed!");
											console.log(error);
										}
									);
								}
							}else{
								var _rowData = grid.getItem(idx);
								var col2Value = _rowData.col2;				
								
								if(!flag&&col2Value=="当前版本"){									
									grid.store.setValue(_rowData,'col2','radio'+_rowData.col1);										
								}
								
							}							
						}									
					}
					
				  if(evt.cellIndex==4){
						var idx = evt.rowIndex;	
						var rowData = grid.getItem(idx);						
						var url = "/modules/modeledit/modelversiondownload.html";		
						var dialogData = {
							widthradio: 0.35,
							heightradio:0.3,
							title:"版本下载",										
							url:url,
							data:{	
								"modelpath":path,
								"versionNum":rowData.col1							
							},
							callback: function(spdialog){									
								spdialog.on("modeldownloadparam",function(args){								
									model_cls.download(args["modelpath"],args["downloadType"], args["modelversionNum"]);
								});
							}
						};
						Spolo.dialog(dialogData);
				  }
										
				}, true);
				
	}
	var retClass = declare("modeledit/js/modelversioninfo",[Evented],{
			constructor:function(modelpath){
				//获取modelpath
				path = modelpath;
			},
			//创建搜索框
			createSearch:function(containerId){
				createSearch.call(this,containerId);
			},
			//创建一个文本域
			createTXT:function(textValue,containerId){
				createTXT.call(this,textValue,containerId);
			},
			//创建日期的datetextbox
			createDateTextBox:function(id,date,containerId){
				createDateTextBox.call(this,id,date,containerId);
			},
			//创建网格
			createDataGrid:function(json,containerId){
				createDataGrid.call(this,json,containerId);
			}
		
	});
return retClass;
});






