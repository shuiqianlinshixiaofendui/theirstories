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

//类spolo.scene.adjGrid 为场景的辅助网格


//因为我们不再依赖任何其它模块。如果依赖其它模块，写法如下，利用三个参数来书写:
//define(自己模块名，依赖模块数组，function(依序的依赖模块declare){这里需要return一个dojo.declare对象});
define("web3d/node/adjGrid",[],function(){
		return dojo.declare([THREE.Object3D],{
			constructor : function(color, opacity){
				//这里缓冲this。如果不缓冲，后面的函数需要使用hitch来切换执行域。
				this.obj3d = this;
				
				this.color = color || 0x888888;
				this.opacity = opacity || 0.2;
				
				this.generate(color, opacity);
			},
			generate : function(color, opacity){
			
				color = color || this.color;
				opacity = opacity || this.opacity;
				
				var line_material = new THREE.LineBasicMaterial( { color: color, opacity: opacity } ),
					geometry = new THREE.Geometry(),
					floor = -75, step = 25;

				for ( var i = 0; i <= 40; i ++ ) {

					geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
					geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

					geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
					geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

				}
				
				this.obj3d.add(new THREE.Line( geometry, line_material, THREE.LinePieces ));
			}
		});
});

