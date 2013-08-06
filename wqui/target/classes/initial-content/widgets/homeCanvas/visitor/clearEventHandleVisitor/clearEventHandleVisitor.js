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

/**
	
*/

define("widgets/homeCanvas/visitor/clearEventHandleVisitor/clearEventHandleVisitor",["dojo/topic"],function(topic){
    
    var clearEventHandleVisitor = dojo.declare([],{
        
		constructor : function(){
           
		},
        
        visit : function(accepter){
            if(accepter != Spolo.canvas.canvasElement){
                accepter.stroke = "3px #0aa";
                accepter.redraw();
            }
            
            if(accepter.events.click){
                accepter.events.click.splice(0,accepter.events.click.length);
            }
            if(accepter.events.dblclick){
                accepter.events.dblclick.splice(0,accepter.events.dblclick.length);
            }
            if(accepter.events.mousedown){
                accepter.events.mousedown.splice(0,accepter.events.mousedown.length);
            }
            if(accepter.events.mouseup){
                accepter.events.mouseup.splice(0,accepter.events.mouseup.length);
            }
            if(accepter.events.mousemove){
                accepter.events.mousemove.splice(0,accepter.events.mousemove.length);
            }
            if(accepter.events.mouseenter){
                accepter.events.mouseenter.splice(0,accepter.events.mouseenter.length);
            }
            if(accepter.events.mouseleave){
                accepter.events.mouseleave.splice(0,accepter.events.mouseleave.length);
            }

        },
        
        clearCanvasEvent : function(){
            this.visit(Spolo.canvas.canvasElement);
        },
       
	});		
	return clearEventHandleVisitor;
});