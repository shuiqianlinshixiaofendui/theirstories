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

define("web3d/action/render",["dojo/topic","dojo/_base/xhr"],function(topic,xhr){
		return dojo.declare([],{
			constructor : function(x3d){
				
				topic.subscribe("render", function(size)
				{	
					//得到当前场景的节点 Spolo.currentNode 
					//split the url into small nodes
					var nodes = (Spolo.getCurrentNode()).split("/");
					
					//then we change the url from .../scenes/xxx/tddata  to .../scenes/xxx.render
					var newURI = "";
					for(var i = 1; i < nodes.length - 1; i++)
					{
						newURI += ("/" + nodes[i] );
					}
					
					//combined .../scenes/xxx with ".render"
					newURI += ".render" 
					// alert(newURI) // now we are .../scenes/xxx.render
					
					//得到 camera   position and centerOfRotation
					//only and only if when the scene has been initialized 
					
					//get the global vieware obj
					var viewarea = Spolo.viewarea;
						
					if(!viewarea._scene)
						return;
						
						//now we get the viewpoint
						var viewpoint = viewarea._scene.getViewpoint();
						
						//var norm = viewarea.getViewMatrix().inverse().e0().cross(viewarea.getViewMatrix().inverse().e1()).normalize();
						//var dist = norm.dot(viewarea._pick.subtract(viewarea.getViewMatrix().inverse().e3()));
                        //var from = viewarea._pick.addScaled(norm, -dist);
						
						//var C_Pos = viewpoint._vf.position;
						//var C_CenterOfRotation = viewpoint._vf.centerOfRotation;
						var C_Pos = viewarea.getViewMatrix().inverse().e3();
						var C_CenterOfRotation = viewarea._pick;
						var qua = viewarea.getViewMatrix().inverse().e2();
						// alert(C_CenterOfRotation)
						
						var data = {
									"position": C_Pos.x + "_" + C_Pos.y + "_"+ C_Pos.z ,
									"centerOfRotation": C_CenterOfRotation.x +"_"+ C_CenterOfRotation.y +"_"+ C_CenterOfRotation.z,
									"upOfRotation": qua.x +"_"+ qua.y +"_"+ qua.z,
									"size":size
								};
						
							//now we start to post the data through ajax
							xhr.get({
								url: newURI,
								content: data,
								handleAs: "text",
								load: function(response){
									topic.publish("render/sent",response);
								},
								error:function(response){
									alert("Sth wrong with /spolo/action/render.js");
								}
							});
						
				});
			},
			
		});
	}
);

