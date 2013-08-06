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
* 添加网格
*/
define("web3d/node/grid",["dojo/topic"],
	function(topic){
		return dojo.declare([],{
			constructor : function(x3d){
					var grid_no=8;
					var	parent = document.getElementById("_sp_scene1");
					var trans = document.createElement('Transform');
					trans.setAttribute("id","grid");
					trans.setAttribute("def","grid");
					trans.setAttribute("translation",0+" "+0+" "+0);
					trans.setAttribute("rotation",1+" "+0+" "+0+" "+0);
					/*---------------------网格start----------------------*/
					var shape_node = document.createElement('Shape');
					var appearance_node = document.createElement('Appearance');
					var material_node = document.createElement('Material');
					material_node.setAttribute("diffuseColor",0+" "+0+" "+0);
					var indexedLineSet_node = document.createElement('IndexedLineSet');
									
					var strz="";
					var a=grid_no*2+1;
					for(var i=0;i<a;i++){
						if(i!=grid_no){
							strz+=(i+" "+(i+a)+" -1,");
						}
					}
					for(var i=2*a;i<3*a;i++){
						if(i!=2*a+grid_no){
							strz+=(i+" "+(i+a)+" -1,");
						}
					}
									
					indexedLineSet_node.setAttribute("coordIndex",strz);
					var coordinate_node = document.createElement('Coordinate');
									
					var strx="";
					var b=-1*grid_no;
					for(var i=b;i<=grid_no;i++){
						strx+=(b+" 0 "+i+",");
					}
					for(var i=b;i<=grid_no;i++){
						strx+=(grid_no+" 0 "+i+",");
					}
					for(var i=b;i<=grid_no;i++){
						strx+=(i+" 0 "+grid_no+",");
					}
					for(var i=b;i<=grid_no;i++){
						strx+=(i+" 0 "+b+",");
					}
									
					coordinate_node.setAttribute("point",strx);
					indexedLineSet_node.appendChild(coordinate_node);
					//appearance_node.appendChild(material_node);
					shape_node.appendChild(appearance_node);
					shape_node.appendChild(indexedLineSet_node);
					/*---------------------网格end----------------------*/
					/*---------------------x轴start----------------------*/
					var shape_nodex = document.createElement('Shape');
					var appearance_nodex = document.createElement('Appearance');
					var material_nodex = document.createElement('Material');
					material_nodex.setAttribute("diffuseColor","0 1 0");//此处设置颜色
					var indexedLineSet_nodex = document.createElement('IndexedLineSet');
					indexedLineSet_nodex.setAttribute("coordIndex","0 1 -1");
					var coordinate_nodex = document.createElement('Coordinate');
					coordinate_nodex.setAttribute("point",-grid_no+" 0 0,"+grid_no+" 0 0");
					indexedLineSet_nodex.appendChild(coordinate_nodex);
					appearance_nodex.appendChild(material_nodex);
					shape_nodex.appendChild(appearance_nodex);
					shape_nodex.appendChild(indexedLineSet_nodex);
					/*---------------------x轴end----------------------*/
					/*---------------------z轴start----------------------*/
					var shape_nodez = document.createElement('Shape');
					var appearance_nodez = document.createElement('Appearance');
					var material_nodez = document.createElement('Material');
					material_nodez.setAttribute("diffuseColor","1 0 0");//此处设置颜色
					var indexedLineSet_nodez = document.createElement('IndexedLineSet');
					indexedLineSet_nodez.setAttribute("coordIndex","0 1 -1");
					var coordinate_nodez = document.createElement('Coordinate');
					coordinate_nodez.setAttribute("point","0 0 "+-grid_no+",0 0 "+grid_no);
					indexedLineSet_nodez.appendChild(coordinate_nodez);
					appearance_nodez.appendChild(material_nodez);
					shape_nodez.appendChild(appearance_nodez);
					shape_nodez.appendChild(indexedLineSet_nodez);
					/*---------------------z轴end----------------------*/
					trans.appendChild(shape_node);
					trans.appendChild(shape_nodex);
					trans.appendChild(shape_nodez);
					parent.appendChild(trans);
				
				
				topic.subscribe("gridHelper/delete", function()
				{
					var	parent = document.getElementById("_sp_scene1");
					var child = document.getElementById("grid");
					parent.removeChild(child);
				});
			}, 
		});
	}
);

