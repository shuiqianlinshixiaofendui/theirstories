/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: spolo@spolo.org
 *  
 *  author		 : 	xxx@spolo.org
 *  wiki  		 : 	这里是对应的wiki地址
 *  description  : 	这里是功能描述
 **/

define("moduletemplate/js/custom", ["dojo/_base/declare"], function(declare){

	function privateMethod(){
		console.log("call privateMethod");
	}

	var retClass = declare("moduletemplate/js/custom",[],{
		constructor : function(){

		},

		test : function(){
			console.log("this is a test function");
			privateMethod.call(this);
		}
	});
	return retClass;
});