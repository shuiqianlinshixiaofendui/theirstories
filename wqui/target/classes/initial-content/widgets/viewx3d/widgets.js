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
 
define("widgets/viewx3d/widgets",["dojo/request","dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin","dojo/text!./template/x3dom_template.html"],
    function(request,declare, WidgetBase, TemplatedMixin,x3dom_template){
        return declare("web3d/widgets", [WidgetBase,TemplatedMixin],{
            url: "",
            templateString: x3dom_template,
			
			constructor:function(){
				
			},
			
			postCreate: function(){
			},
		   
            _getUrlAttr: function(){
                return this.x3dNode.url;
            },
            
            _setUrlAttr: function(url){
                this.x3dNode.url=url;
            }
        });	
});