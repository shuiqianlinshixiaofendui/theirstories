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
 
define("spolo/data/util/image",
[
	"dojo/_base/declare",
],
function(
	declare
)
{

	// var image = declare("spolo/data/util/image", null, {
	
		// constructor : function() {
			// // console.log("this is file");
		// }
		
	// });	
	var image = {
		// convert : function(path, height, width){
			// // 参数判断
			// if(!path){
				// console.error("[ERROR]: path is undefined!");
				// return;
			// }
			// if(typeof height == "undefined"){
				// console.error("[ERROR]: height is undefined!");
				// return;
			// }
			// if(typeof width == "undefined"){
				// console.error("[ERROR]: width is undefined!");
				// return;
			// }
			// path += ".image?srcImage=preview.jpg&command=-resize&commandPara=" + height + "x" + width + "&destImage=preview.jpg";
			// return path;
		// }
		convert : function(args){
			// 参数判断
			if(!args["path"]){
				console.error("[ERROR]: args['path'] is undefined!");
				return;
			}else{
				var path = args["path"];
			}
			
			// if(!args["srcImage"]){
				// var srcImage = "preview.jpg";
			// }else{
				// var srcImage = args["srcImage"];
			// }
			
			if(!args["command"]){
				var command = "-resize";
			}else{
				var command = args["command"];
			}
			
			if(typeof args["height"] == "undefined"){
				var height = "235";
			}else{
				var height = args["height"];
			}
			
			if(typeof args["width"] == "undefined"){
				var width = "235";
			}else{
				var width = args["width"];
			}
			
			if(!args["destImage"]){
				var destImage = "preview.jpg";
			}else{
				var destImage = args["destImage"];
			}
			
			if(typeof args["clearCache"] == "undefined"){
				var clearCache = true;
			}else{
				var clearCache = args["clearCache"];
			}
			
			path += ".image?command=" + command + "&commandPara=" + height + "x" + width + "&destImage=" + destImage + "&clearCache=" + clearCache;
			
			return path;
			
		}
	}
	return image;
});