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
 define("spolo/data/mask",["dojo/_base/xhr"],function(xhr){
		//定义diffuse模块
		return dojo.declare("mask",[],{
			constructor : function(data){
				this._resource = data;
			},
			/**
			*	getter method
			*/
			//获取对应diffuse图的名称
			getDiffuseName :function(){
				return this._resource["diffuseName"];
			},
			//获取当前mask所属的diffuse
			getDiffuse : function(){
				/*var thisDiffuse;
				var PThis=this;
				var str=this._resource["path"];//为了获取数据拼接成可用的URL
				var strlength=str.lastIndexOf("/");
				str=str.substring(0,strlength);
				require(["spolo/data/diffuse","spolo/data/resource"],
					function(diffuse,resource){
						var res = new resource(str);
						thisDiffuse= new diffuse(res);
					}
				)
				return thisDiffuse;*/
			},
			//获取当前mask对应的二级材质路径
			getL2materialPath : function(){
				//return this._resource["L2material"];
			},
			//获取当前mask对应的部件名称
			getComponentName : function(){
				//return this._resource["componentName"];
			},
			/**
			*	setter method
			*/
			//设置当前mask对应的二级材质路径
			setL2materialPath : function(l2matpath){
				/*var PThis = this;
				xhr.post({
						url : PThis._resource["path"],
						load : function(data){},
						error : function(error){},
						content:{
							"L2material":l2matpath
						},
						sync:false
				});*/
			},
			//设置当前mask对应的部件名称
			setComponentName:function(componentName){
				/*var PThis = this;
				xhr.post({
					url : PThis._resource["path"],
					load : function(data){},
					error : function(error){},
					content:{
						"componentName":componentName
					},
					sync:false
				});*/
			},
		});
	})