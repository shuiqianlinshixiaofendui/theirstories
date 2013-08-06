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
 
define("widgets/homeCanvas/initCanvas/initCanvas",
[
    "widgets/homeCanvas/initCanvas/readsvg",

],
function(
    Readsvg
)
{
    var initCanvas = dojo.declare([], {
		
		constructor : function(path,svgDiv)
		{
            var readsvg = new Readsvg();
            var xmlDoc = readsvg.xml_loadFile(path,null);
            
            var svg = xmlDoc.getElementsByTagName("svg")[0];
            
            var xmlns = "http://www.w3.org/2000/svg";
                
            for (var i = 0; i < svg.childNodes.length -2; i++) {
                if(svg.childNodes[i].nodeType == 1){
                    var node = document.createElementNS (xmlns, svg.childNodes[i].tagName);
                    for(var j = 0;j < svg.childNodes[i].attributes.length; j++){
                        var property = svg.childNodes[i].attributes[j].name;
                        var text = readsvg.xml_text(svg.childNodes[i].attributes[j]);
                        node.setAttributeNS (null, property, text);
                    }
                    svgDiv.appendChild(node);
                }
            }
            console.log(svgDiv);
            
            
        },
		
	});
	
	return initCanvas;
});