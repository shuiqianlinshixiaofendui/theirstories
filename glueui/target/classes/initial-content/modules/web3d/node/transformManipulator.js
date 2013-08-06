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
define("web3d/node/transformManipulator", ["dojo/topic"],function(topic){
	return dojo.declare([],{
		constructor : function(x3d){
		
			//要求vector为标准向量。每个元素取值范围[-1,1].
			//unproject cc to wc 
			x3dom.Viewarea.prototype.unprojectVector = function(vector)
			{
				return this.getCCtoWCMatrix().multFullMatrixPnt(vector);
			}
			//project wc to cc
			x3dom.Viewarea.prototype.projectVector = function(vector)
			{
				return this.getWCtoCCMatrix().multFullMatrixPnt(vector);
			}
			
			x3dom.nodeTypes.Transform.prototype.isEditing = function()
			{
				return (typeof(this._sp_dragger) != "undefined");
			}

			//切换一个维护器(conditioner)。
			x3dom.nodeTypes.Transform.prototype.replaceDragger = function(name)
			{
				if(this._sp_dragger)
				{
					//如果当前dragger不为空，调用其unload方法.
					if(typeof(this._sp_dragger.unload) ==='function')
					{
						this._sp_dragger.unload();
						// this._sp_dragger.unload(this._sp_selectedobj._xmlNode);
					}
						
					//删除_sp_manipulator属性。
					delete this._sp_dragger;
					delete this._sp_selectedobj; 
				}

				if(name)
				{
					var cthis = this;
					require(["web3d/node/" + name,"dojo/_base/lang"], function(dragger_class, lang){
						cthis._sp_dragger = new dragger_class(cthis);
					});
				}
			}
			
			//now we started to perform detailed actions such as translation, rotations, scale etc. 
			
			//first change WC position to LC position, then make translations
			x3dom.nodeTypes.Transform.prototype.moveTo_WC = function(pos_WC)
			{ 
				if(this._parentNodes.length >= 1)
				{
					this.moveTo_LC(this._parentNodes[0].getCurrentTransform().multFullMatrixPnt(pos_WC));
				}else{
					this.moveTo_LC(pos_WC);
				}
			}
			
			//translation in LC coordinate system
			x3dom.nodeTypes.Transform.prototype.moveTo_LC = function(pos_LC)
			{
				this._vf.translation = pos_LC; 
	 	        this.postMessage("translation", this._vf.translation); 
	 	        this.fieldChanged("translation"); 
			}
			
			//rotation
			//@fixme: wont work for now, need to be fixed later
			x3dom.nodeTypes.Transform.prototype.worldRotate = function(axis, a)
			{
				this.localRotate(this.getCurrentTransform().multFullMatrixPnt(axis),a);
			}
			
			x3dom.nodeTypes.Transform.prototype.localRotate = function(axis, a)
			{
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
			x3dom.nodeTypes.Transform.prototype.scale = function(scale)
			{
				this._vf.scale = scale; 
	 	        this.postMessage("scale", this._vf.scale); 
	 	        this.fieldChanged("scale"); 
			}
			
			x3dom.nodeTypes.Transform.prototype.addScale = function(scale)
			{
				this._vf.scale = this._vf.scale.add(scale); 
	 	        this.postMessage("scale", this._vf.scale); 
	 	        this.fieldChanged("scale"); 
			}
			
			//模型锁定当前状态获取
			x3dom.nodeTypes.Transform.prototype.isLocked = function()
			{
				//console.log("trans locked="+this._xmlNode.getAttribute("islocked"));
				var flag = this._xmlNode.getAttribute("islocked");
				if( flag == "true") {
					return true;
				} else {
					return false;
				}
			}
			
			//method axisAngle, will be avaible on v1.4
			x3dom.fields.Quaternion.axisAngle = function (axis, a) {
			var t = axis.length();
			
			if (t > x3dom.fields.Eps)
			{
				var s = Math.sin(a/2) / t;
				var c = Math.cos(a/2);
				return new x3dom.fields.Quaternion(axis.x*s, axis.y*s, axis.z*s, c);
			}else{
				return new x3dom.fields.Quaternion(0, 0, 0, 1);
			}
		} 
		
		//mesh locks and unlocks
		topic.subscribe("mesh/lock", function(v,target){
			Spolo.cameraLock = true;
		});
			
		topic.subscribe("mesh/unlock", function(v,target){
			Spolo.cameraLock = false;
		});
		 //before we do fast camera positioning, we need to generated all required data
		 topic.subscribe("cameraPos/init", function(){
		 
			//
			var viewarea = Spolo.viewarea;
			
			if(!Spolo._front_tarMat)
				Spolo._front_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.identity()).mult(x3dom.fields.SFMatrix4f.identity());
	
			//the back target matrix 
			if(!Spolo._back_tarMat)
				Spolo._back_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.rotationY(Math.PI)).mult(x3dom.fields.SFMatrix4f.identity());
			
			//the left target matrix 
			if(!Spolo._left_tarMat)
				Spolo._left_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.rotationY(Math.PI/2)).mult(x3dom.fields.SFMatrix4f.identity());
			
			//the right target matrix 
			if(!Spolo._right_tarMat)
				Spolo._right_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.rotationY(-(Math.PI/2))).mult(x3dom.fields.SFMatrix4f.identity());
			
			//the up target matrix 
			if(!Spolo._up_tarMat)
				Spolo._up_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.rotationX(Math.PI/2)).mult(x3dom.fields.SFMatrix4f.identity());
				
			//the below target matrix 
			if(!Spolo._below_tarMat)
				Spolo._below_tarMat = viewarea.getViewpointMatrix().mult(viewarea._transMat).mult(x3dom.fields.SFMatrix4f.rotationX(-(Math.PI/2))).mult(x3dom.fields.SFMatrix4f.identity());
			
		 });
		 
		
		//when we hit a mesh, we highlight the mesh by surrounding the mesh with a pointed-cube
		topic.subscribe("mesh/highlight", function(shape){
		
			 if (this._vf.hasOwnProperty("diffuseColor")) 
            {
                if (enable) {
                    if (this._actDiffuseColor === undefined) {
                        this._actDiffuseColor = new x3dom.fields.SFColor();
                        this._highlightOn = false;
                    }
                    
                    if (!this._highlightOn) {
                        this._actDiffuseColor.setValues(this._vf.diffuseColor);
                        this._vf.diffuseColor.setValues(color);
                        this._highlightOn = true;
                    }
                }
                else {
                    if (this._actDiffuseColor !== undefined) {
                        this._vf.diffuseColor.setValues(this._actDiffuseColor);
                        this._highlightOn = false;
                    }
                }
            }
            
            for (var i=0; i<this._childNodes.length; i++)
            {
                if (this._childNodes[i])
                    this._childNodes[i].highlight(enable, color);
            }
		});
		
		//now, we de-highlight the mesh
		topic.subscribe("mesh/highlight", function(){
			
		});
		
		//here we add the method support for the transforms and shpapse,
		//we change the color of the mesh by a diffirent one to achieve highlight
		// x3dom.nodeTypes.Shape.prototype.highlight = function(enable, color)
		// {
			// if (this._vf.hasOwnProperty("diffuseColor")) 
            // { 
                // if (enable) {
                    // if (this._actDiffuseColor === undefined) {
                        // this._actDiffuseColor = new x3dom.fields.SFColor();
                        // this._highlightOn = false;
                    // }
                    
                    // if (!this._highlightOn) {
                        // this._actDiffuseColor.setValues(this._vf.diffuseColor);
                        // this._vf.diffuseColor.setValues(color);
                        // this._highlightOn = true;
                    // }
                // }
                // else {
                    // if (this._actDiffuseColor !== undefined) {
                        // this._vf.diffuseColor.setValues(this._actDiffuseColor);
                        // this._highlightOn = false;
                    // }
                // }
            // }
            
            // for (var i=0; i<this._childNodes.length; i++)
            // {
                // if (this._childNodes[i])
                    // this._childNodes[i].highlight(enable, color);
            // }
		// }
		
		//end of constructor
		},
		
		
	});
});