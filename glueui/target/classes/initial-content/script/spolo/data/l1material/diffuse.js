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
 define("spolo/data/diffuse",["dojo/_base/xhr"],function(xhr){
		
		//定义diffuse模块
		return dojo.declare("diffuse",resource,{
			constructor : function(data){
				this._resource=data;
			},
			/**
			*	getter method
			*/
			//获取当前diffuse图的名称
			getName : function(GETName,ERROR){
				/*this.getMasks(
					function(data){
						GETName(name=data[0].getDiffuseName());
					},
					function(error){
						ERROR(error);
					}
				);*/
			},
			//获取当前diffuse对应一级材质的ocm文件路径
			getOcmPath : function(GETOcmPath,ERROR){
				/*var PThis = this;
				if(PThis._ocmPath.length){
					GETOcmPath(PThis._ocmPath);
					//return PThis._ocmPath;
				}
				else{
					xhr.get({
						url : PThis._resource["path"]+".2.json",
						handleAs : "json",
						load : function(json_data){
							getData.call(PThis,json_data);
							GETOcmPath(PThis._ocmPath);
						},
						error:function(error){
						}	
					});
				}*/
			},
			//获取Masks的所有信息
			getMasks : function(GetMasks,ERRORCB){
				/*var PThis = this;
				if(this._masks.length){
						GetMasks(PThis._masks);
				}
				else{
					xhr.get({
						url : PThis._resource["path"]+".2.json",
						handleAs : "json",
						load : function(json_data){
							getData.call(PThis,json_data);
							GetMasks(PThis._masks);
						},
						error:function(error){
						}
					});
				}*/
			},
		});
	})