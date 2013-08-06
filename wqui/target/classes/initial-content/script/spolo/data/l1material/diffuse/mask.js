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
		//����diffuseģ��
		return dojo.declare("mask",[],{
			constructor : function(data){
				this._resource = data;
			},
			/**
			*	getter method
			*/
			//��ȡ��Ӧdiffuseͼ������
			getDiffuseName :function(){
				return this._resource["diffuseName"];
			},
			//��ȡ��ǰmask������diffuse
			getDiffuse : function(){
				/*var thisDiffuse;
				var PThis=this;
				var str=this._resource["path"];//Ϊ�˻�ȡ����ƴ�ӳɿ��õ�URL
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
			//��ȡ��ǰmask��Ӧ�Ķ�������·��
			getL2materialPath : function(){
				//return this._resource["L2material"];
			},
			//��ȡ��ǰmask��Ӧ�Ĳ�������
			getComponentName : function(){
				//return this._resource["componentName"];
			},
			/**
			*	setter method
			*/
			//���õ�ǰmask��Ӧ�Ķ�������·��
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
			//���õ�ǰmask��Ӧ�Ĳ�������
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