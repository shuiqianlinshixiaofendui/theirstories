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
/**
    处理场景加载,
    并添加场景加载进度 #1387
*/


require(["dojo/topic", "web3d/widgets","web3d/ui/waringDiv","widgets/Mask/Mask","dijit/Dialog", "dojo/ready"],function( topic, widgets,waringDiv,Mask,Dialog,ready ){
    var loc = window.location.href;
    var scenePath = loc.substr(loc.indexOf("?path=")+6);
    ready(function(){
        // This function won't run until the DOM has loaded and other modules that register  have run.
        function showDia(){
            dijit.byId("dialog").show();
        }
        function close(){
            dijit.byId("dialog").hide();
        }
        var war = new waringDiv("dialog");
        var flag = war.getFlag();
        if(!flag){
            showDia();  // 显示版本错误信息
        }else{          // 加载场景
            var json = {"url":scenePath + ".x3d"};  
            var widget = new widgets(json).placeAt("layout_3d");
            var x3d = document.getElementById("_sp_x3d_main_tag");
            
        }
    });
    
});