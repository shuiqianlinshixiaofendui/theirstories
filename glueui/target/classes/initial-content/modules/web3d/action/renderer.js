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

//类spolo.renderer 为渲染器类，
/*
	可以给一个 div 的 id 作为渲染器的容器，渲染器的大小会取 div.style.width 和 height，如果没有则取浏览器内容区域的大小
	其中包括Stats帧率监测器，不过需要外部引用一个 Stats.js，如果不引这个js则不显示
	render 由外部调用启动
*/


//因为我们不再依赖任何其它模块。如果依赖其它模块，写法如下，利用三个参数来书写:
//define(自己模块名，依赖模块数组，function(依序的依赖模块declare){这里需要return一个dojo.declare对象});
define("web3d/action/renderer",[],function(){
		return dojo.declare([],{
			constructor : function( divId ){
				// 保存容器的ID
				this.containerID = divId;
				// 获得/创建一个渲染器的容器，并确定高宽
				var div = document.getElementById(divId);
				if(div){
					this.container = div;
					this.width = div.style.width || window.innerWidth;
					this.height = div.style.height || window.innerHeight;
				}else{
					this.container = document.createElement( 'div' );
					this.width = window.innerWidth;
					this.height = window.innerHeight;
				}
				document.body.appendChild( this.container );
				
				// 初始化渲染器
				this.renderer = new THREE.WebGLRenderer( { antialias: true } );
				this.renderer.setSize( this.width, this.height );
				this.container.appendChild( this.renderer.domElement );
				
				// 初始化 Stats 监测器
				var scriptList = document.getElementsByTagName('script');
				this.stats = null;
				var src;
				for( var s in scriptList){
					src = scriptList[s].src;
					if(src && src.indexOf('Stats.js')>-1){
						this.stats = new Stats();
						this.stats.domElement.style.position = 'absolute';
						this.stats.domElement.style.top = '0px';
						this.container.appendChild( this.stats.domElement );
						break;
					}
				}				
			},
			
			render: function(scene, camera){
				this.renderer.render(scene,camera);
				if(this.stats)this.stats.update();
				//animation();
				// requestAnimationFrame(this.render(scene, camera, animation));
			},
			
			setSize : function(width, height){
				this.width = width;
				this.height = height;
				
				this.renderer.setSize( this.width, this.height );
			}
		});
});

