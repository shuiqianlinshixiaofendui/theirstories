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
 
define("widgets/homeCanvas/eventManager",
[
	"dojo/_base/declare",
],
function(
	declare
)
{
    var eventManager = declare([], {
        eventList : null,
        
        constructor : function(){
            Spolo.eventManager = this;
            this.eventList = [];
		},
        
        addEvent : function (oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = fnHandler;
            }
            
            var evtjson = {
                oTarget : oTarget,
                sEventType : sEventType,
                fnHandler : fnHandler,
            }
            this.eventList.push(evtjson);
        },
                
        removeEvent : function (oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else { 
                oTarget["on" + sEventType] = null;
            }
        },
        
        clearAllEvent : function(){
            while(this.eventList.length>0){
                var evt = this.eventList.pop();
                this.removeEvent(evt.oTarget, evt.sEventType, evt.fnHandler);
            }
        },
        
	});
	
	return eventManager;
});