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

//该类负责l1material中属性的getter和setter方法
define("spolo/data/l1material",function(){
    return dojo.declare("l1material",[],{
		/**
		*构造函数中根据所传入的数据进行初始化
		*/
		constructor : function(material_data){
		    this._resource = material_data;	
		},
		/**
		*	getter method
		*/
		getAuthor:function(){
		    return this._resource["jcr:createdBy"];
		},
		getUsername:function(){
			return this._resource["jcr:createdBy"].substring(0).replace(/_/g,'%');
		},
		getCreatedDate:function(){
			return this._resource["jcr:created"];
		},
		
		getResouceType:function(){
			return this._resource["sling:resourceType"];
		},
		
		getMaterialName:function(){
			var materialName="未命名";
			if(typeof this._resource["materialName"] == "undefined"){
				return materialName;
			}else{
				return this._resource["materialName"];
			}
		},
		
		/**
		* setter method
		* 以下的setter方法，并未实现，只是作为测试UI
		*/
		
		setAuthor:function(Author){
			this._resource["jcr:createdBy"]=Author;
		},
		
		setCreatedDate:function(createdDate){
			this._resource["jcr:created"]=createdDate;
		},
		
		setResouceType:function(resourceType){
			this._resource["sling:resouceType"]=resourceType;
		},
		
		setMaterialName:function(materialName){			
			this._resource["materialName"]=materialName;
			// console.log(this._resource);
		}
	});//dojo.declare
});//define end