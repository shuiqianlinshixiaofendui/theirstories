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

//manipulator修改x3dom中Transform的实现，为Transform及其派生类添加edit支持。
define("widgets/room/utils/x3domRewrite", [], function(){
	return dojo.declare([],{
		constructor : function(x3d){
			//unproject cc to wc 
			x3dom.Viewarea.prototype.unprojectVector = function(vector){
				return this.getCCtoWCMatrix().multFullMatrixPnt(vector);
			}
            
			//project wc to cc
			x3dom.Viewarea.prototype.projectVector = function(vector){
				return this.getWCtoCCMatrix().multFullMatrixPnt(vector);
			}
            
			//first change WC position to LC position, then make translations
			x3dom.nodeTypes.Transform.prototype.moveTo_WC = function(pos_WC){ 
				if(this._parentNodes.length >= 1){
					this.moveTo_LC(this._parentNodes[0].getCurrentTransform().multFullMatrixPnt(pos_WC));
				}else{
					this.moveTo_LC(pos_WC);
				}
			}
			
			//translation in LC coordinate system
			x3dom.nodeTypes.Transform.prototype.moveTo_LC = function(pos_LC){
				this._vf.translation = pos_LC; 
	 	        this.postMessage("translation", this._vf.translation); 
	 	        this.fieldChanged("translation"); 
			}
			
			//rotation
			//@fixme: wont work for now, need to be fixed later
			x3dom.nodeTypes.Transform.prototype.worldRotate = function(axis, a){
				this.localRotate(this.getCurrentTransform().multFullMatrixPnt(axis),a);
			}
			
			x3dom.nodeTypes.Transform.prototype.localRotate = function(axis, a){
				var q = x3dom.fields.Quaternion.axisAngle(axis, a);
				//q.toAxisAngle();
				
				// if(!base)
					// base = this._vf.rotation;
				// this._vf.rotation = base.multiply (q);
				
				this._vf.rotation = this._vf.rotation.multiply (q);
	 	        this.postMessage("rotation", this._vf.rotation); 
	 	        this.fieldChanged("rotation"); 
			}
			
			//scale
			x3dom.nodeTypes.Transform.prototype.scale = function(scale){
				this._vf.scale = scale; 
	 	        this.postMessage("scale", this._vf.scale); 
	 	        this.fieldChanged("scale"); 
			}
			
			x3dom.nodeTypes.Transform.prototype.addScale = function(scale){
				this._vf.scale = this._vf.scale.add(scale); 
	 	        this.postMessage("scale", this._vf.scale); 
	 	        this.fieldChanged("scale"); 
			}
			
			// Quaternion to EulerAngle
            /**
             * 返回值区间
             * x轴：弧度 [-兀, 兀]
             * y轴：弧度 [-兀 / 2, 兀 / 2]
             * z轴：弧度 [-兀, 兀]
             */
			x3dom.fields.Quaternion.prototype.toEulerAngle = function(){
				var Pitch = Math.atan2(2 * (this.w * this.x + this.z * this.y) , 1 - 2 * (this.x * this.x + this.y * this.y));
				var Roll = Math.asin(2 * (this.w * this.y - this.x * this.z));
				var Yaw = Math.atan2(2 * (this.w * this.z + this.y * this.x) , 1 - 2 * (this.z * this.z + this.y * this.y));
				return new x3dom.fields.SFVec3f(Pitch, Roll, Yaw);
			}

			// EulerAngle to Quaternion
			x3dom.fields.Quaternion.eulerAngle = function(eAngle){
				var t = eAngle.length();
				if (t > x3dom.fields.Eps){
					var e_x = eAngle.x;
					var e_y = eAngle.y;
					var e_z = eAngle.z;
					var w = Math.cos(e_x / 2) * Math.cos(e_y / 2) * Math.cos(e_z / 2) + Math.sin(e_x / 2) * Math.sin(e_y / 2) * Math.sin(e_z / 2);
					var x = Math.sin(e_x / 2) * Math.cos(e_y / 2) * Math.cos(e_z / 2) - Math.cos(e_x / 2) * Math.sin(e_y / 2) * Math.sin(e_z / 2);
					var y = Math.cos(e_x / 2) * Math.sin(e_y / 2) * Math.cos(e_z / 2) + Math.sin(e_x / 2) * Math.cos(e_y / 2) * Math.sin(e_z / 2);
					var z = Math.cos(e_x / 2) * Math.cos(e_y / 2) * Math.sin(e_z / 2) - Math.sin(e_x / 2) * Math.sin(e_y / 2) * Math.cos(e_z / 2);
					return new x3dom.fields.Quaternion(x, y, z, w);
				} else {
					return new x3dom.fields.Quaternion(0, 0, 0, 0);
				}
			}

			
		}
		
	});
});