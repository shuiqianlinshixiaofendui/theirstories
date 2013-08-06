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
 
 define("spolo/data/model",["spolo/data/resource"],function(Resource){
	/**
	*	author : wangxiaodong
	*	ModelResource模块，获取json格式的jcr node，并返回所需数据
	*/
	return dojo.declare("model",Resource,{
	
		/**
		* this的引用
		*/
		model:null,
		
		/**
		*	以Resource对象为参数构建model对象
		*/
		constructor : function(model_data){
			dojo.declare.safeMixin(this,model_data);
		    model = this;
		},
		
		/** 
		* @brief 上传模型。
		**/
		upload : function(divdom,callback){
			// Todo
		},
		
		/** 
		*	@brief 获取下载地址。
		**/
		getModelURL : function(modelType){
			// Todo
		},
		
		/** 
		* @brief 删除模型。
		**/
		destory : function(){
			// Todo
		},
		
		/**
		* @brief 设置某个component所使用的二级材质。
		**/
		setCompMaterial : function(compName,mat){
			// Todo
		},
		
		/**
		* @brief 获取指定的组件及其对应的二级材质，如果未指定二级材质，则二级材质部分为空。
		**/
		componetHandler : function(componentNames,mats){
		},
		
		/** 
		*	@brief 获取可以指定二级材质的组件列表。
		*	@param queryString为空，则返回全部组件列表。
		**/
		getComponents : function(queryString,componetCB,errorCB){
			// Todo
		},
		
		/** 
		*	@brief 返回此模型价格标识的数值字符串，价值的大小由具体的业务规则决定。
		**/
		getPrice : function(){
			var price="0.0";
		    if(typeof model["price"]== "undefined"){
				return price;
			}else{
				return model["price"];
			}
		},
		
		/** 
		*	@brief 设置新的模型价格。
		*	@param price : 新的材质价格
		**/	
		setPrice : function(price){
			function onSuccess(data) {
				// console.log(data);
			}
			function onError(error){
				alert(error);
			}
			var info = {
				"price" : price,
				"price@TypeHint" : "String"
			}
			this.xhrJsonPost(info,onSuccess,onError);
		},
		
		/**
		*	@brief 返回模型展示图片预览路径,如果没有设置则返回nopreview
		**/
		getPreview : function(){
			if(typeof model["preview"] == "object"){
				return model.path+"/preview/preview.jpg";
			}else{
				return "/image/nopreview.jpg";
			}
		},

		/** 
		*	@brief 设置模型展示图片的存放路径
		*	@param previewPath : 模型展示图片的存放路径
		**/
		setPreview : function(previewPath){	
			function onSuccess(data) {
				// console.log(data);
			}
			function onError(error){
				alert(error);
			}
			var info = {
				"preview" : previewPath,
				"preview@TypeHint" : "String"
			}
			this.xhrJsonPost(info,onSuccess,onError);
		}
		
	});

});