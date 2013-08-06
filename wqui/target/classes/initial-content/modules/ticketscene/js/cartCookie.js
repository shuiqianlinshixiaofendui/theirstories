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
//定义一个模块,显示模型列表
define("ticketscene/js/cartCookie",
		["dojo/query","dojo/dom","dojo/dom-construct","dojo/cookie","dojo/json"],
		function(query,dom,domconstruct,cookie,json){

			var retClass = dojo.declare("ticketscene/js/cartCookie",[],
			{
				constructor : function(){
					/* this.list = list;
					this.showList(containerID); */
				}
				
			});
			
			retClass.GetCookie =function(offset)
			//获得Cookie解码后的值
			{
				return eval("("+cookie(offset)+")");
			}
			retClass.dojoSetCookie =function (name,  value)
			//设定Cookie值
			{
				cookie(name, json.stringify(value, {path:"\/",expires: 5}));
			}
			retClass.DelCookie = function DelCookie(name)
			//删除Cookie
			{
				cookie(name, null, {expires: -1});
			}
			//用户点击添加，将模型添加到cookie中
			retClass.addModelToCookie = function (model){
				var cartArray;
				if(this.getCookiea("cart")){
					cartArray = this.getCookiea("cart");
				}else{
					cartArray = new Array();
				}
				var uuid = UUIDjs.create();
				var hasModel = false;
				for(var index in cartArray){
					if(cartArray[index].modelName == model.modelName){
						//如果模型已经添加过，直接对模型的数量做加一操作
						if(cartArray[index].modelNumber){
							cartArray[index].modelNumber = parseInt(cartArray[index].modelNumber)+1
						}else{
							cartArray[index].modelNumber = 1;
						}
						hasModel = true;
					}
				}
				if(!hasModel){
					//如果没有添加过，直接追加到购物车数组中
					model.id = uuid.hex;
					//cartArray[uuid] = model;
					cartArray.push(model);
				}
				this.setCookie("cart",  json.stringify(cartArray),5);
			}
			//用户改变模型的数量
			retClass.setNumber = function(model){
				var cartArray;
				if(this.getCookiea("cart")){
					cartArray = this.getCookiea("cart");
					var hasModel = false;
					for(var index in cartArray){
						if(cartArray[index].modelName == model.modelName && cartArray[index].id == model.id){
							//如果模型已经添加过，直接对模型的数量做加一操作
							if(cartArray[index].modelNumber){
								cartArray[index].modelNumber = model.modelNumber;
							}else{
								cartArray[index].modelNumber = 1;
							}
							hasModel = true;
						}
					}
					if(!hasModel){
						cartArray.push(model);
					}
				}else{
					cartArray = new Array();
					cartArray.push(model);
				}
				this.setCookie("cart",  json.stringify(cartArray),5);
			}
			
			
			
			  retClass.getCookiea = function(c_name)
				{
				if (document.cookie.length>0)
				  {
				  c_start=document.cookie.indexOf(c_name + "=")
				  if (c_start!=-1)
					{ 
					c_start=c_start + c_name.length+1 
					c_end=document.cookie.indexOf(";",c_start)
					if (c_end==-1) c_end=document.cookie.length
					return eval("("+unescape(document.cookie.substring(c_start,c_end))+")");
					} 
				  }
				return ""
				}

				 retClass.setCookie = function(c_name,value,expiredays)
				{
				//console.log(value);
				var exdate=new Date();
				exdate.setDate(exdate.getDate()+expiredays)
				document.cookie=c_name+ "=" +escape(value)+
				((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
				/* alert(c_name+ "=" +escape(value)+
				((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/");*/
				} 
			//用户点击删除， 
			return retClass;
		});
		