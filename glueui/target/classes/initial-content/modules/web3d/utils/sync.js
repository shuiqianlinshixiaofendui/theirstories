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

// start spolo code scope
(function() {

if(!Spolo.updateInterval || Spolo.updateInterval < 1000)
	Spolo.updateInterval = 1000;

function OnAccessDenied()
{
	require(["dojo/topic"], function(topic){
		topic.publish("user/login");
		topic.subscribe("user/logined", function(){
			//resetAllDenied
			for(var i = 0 ; i < updateArray.length; i++)
			{
				if(updateArray[i].denied)
					updateArray[i].denied = false;
			}
			//重新调度更新。
			dispatchWait();
		});
	});
}

//调用了SetTimeout之后设置为true，指示当前是否处在等待更新状态。
var bWaitSync = false;

//保存了当前全部的更新请求.每个元素的结构如下:
// { 
// url : string,//保存了请求操作的url,
// node : x3domNode, //保存了请求操作的x3domNode.
// field : [string], //保存了需要同步的field名称。
// isnew : false, //指示本节点是否是一个newnode.
// opType : int, //指示本节点的更新类型.
// isSync : false, //指示当前是否正在同步。
// denied : false, //本域由更新函数添加，指示更新请求被服务器拒绝。收到登录请求会重置本域.
// }

var updateArray = [];
//为updateArray添加一些hlper method.
updateArray.removeSyncer = function(syncer)
{
	for(var i = 0; i < updateArray.length; i++)
	{
		if(updateArray[i] == syncer)
		{
			//已经成功发现cua，删除元素。
			updateArray.splice(i,1); 
			return true;
		}
	}
	return false;
}
updateArray.addSyncer = function(syncer)
{
	for(var i = 0; i < updateArray.length; i++)
	{
		if(updateArray[i].merge(syncer))
		{
			return;
		}
	}
	updateArray.push(syncer);
	dispatchWait();
}
updateArray.doSync = function()
{
	for(var i = 0; i < updateArray.length; i++)
	{
		if(!updateArray[i].doSync())
		{//不再继续更新。
			return;
		}
	}
}


var	SYNCER_UPDATE = 1;
var SYNCER_CREATE = 2;
var SYNCER_DELETE = 3;
var SYNCER_MOVE = 4;

//基类。
var	SyncerBase = function(url,node)
{
	this.url = url;
	this.node = node;
	this.isSync = false;
	this.denied = false;
}
//是否可以把同步指令合并到同一个请求中去。如果已经合并，返回true.否则返回false.
SyncerBase.prototype.merge = function(syncer)
{
	return false;
}
SyncerBase.prototype.doSync = function()
{
}
SyncerBase.prototype.errorProc = function(error)
{
	this.cua.isSync = false; //不再处于同步状态。
	if(error.status == 500)
	{//500: acess denied.
		//指示当前更新请求已经被拒绝访问。
		this.cua.denied = true;
		//发出accessDenied事件。缺省处理请求用户登录。
		OnAccessDenied();
	}else{
		//@TODO: 这种情况应该不会出现，如果出现，这里提示用户无法保存数据？或者输出到日志中？如何处理?由于这些请求无法处理，是否应该删除同步请求？
		alert(error);
	}
	delete this.cua;
}

//更新syncer类。
var SyncerUpdate = function(url,node,name)
{
	SyncerBase.call(this,url,node);
	this.field = [name];
	this.opType = SYNCER_UPDATE;
}
SyncerUpdate.prototype.merge = function(syncer)
{
	if(!this.isSync && this.node == syncer.node && this.opType == syncer.opType && this.url === syncer.url)
	{
		for(var i = 0; i < syncer.field.length; i++)
		{
			if(!this.field.hasObject(syncer.field[i]))
				this.field.push(syncer.field[i]);
		}
		return true;
	}
	return false;
}
//返回true指示继续向下执行。返回false指示终止更新。
SyncerUpdate.prototype.doSync = function()
{
	//本元素没有在同步并且没有被服务器拒绝。
	if(this.isSync || this.denied)
		return true;

	var ctx = {};
	for(var j = 0 ; j <  this.field.length; j++)
	{
		var fname = this.field[j];
		var nodevf = this.node._vf[fname]
		if(nodevf.toStringValue){
			ctx[fname] = this.node._vf[fname].toStringValue();
		}else{
			ctx[fname] = this.node._vf[fname].toString();
		}
	}
    var viewName = this.node._xmlNode.getAttribute("viewName") ;
	if(typeof(viewName) != "")
	{
		ctx["viewName"] = viewName ;
	}
	this.isSync = true;
	var cua = this;
	ctx["_charset_"] = "UTF-8";
	var deferred = dojo.xhrPost({
		url : cua.url,
		content : ctx,
		cua : cua,
		load: function(data){
			//fixme: index由于历史的删除，已经不能正确标识了。
			//我们使用cua来删除之。
			updateArray.removeSyncer(this.cua);
			delete this.cua;
		},
		error: SyncerBase.prototype.errorProc
	});
	return true;
}


//新建syncer类。
var SyncerCreate = function(url,node)
{
	SyncerBase.call(this,url,node);
	this.opType = SYNCER_CREATE;
}
SyncerCreate.prototype.merge = function(syncer)
{
	//如果节点相同或者试图对相同url做更新，则合并之。
	if(this.node == syncer.node || ( this.opType == syncer.opType && this.url === syncer.url) )
	{
		return true;
	}
	return false;
}
var nodeCreating = false;	//是否正在创建新节点。sling有bug:同时创建节点会引发名称自动变化！
SyncerCreate.prototype.doSync = function()
{
	var cua = this;
	//本元素没有在同步并且没有被服务器拒绝。
	if(!cua.isSync && !cua.denied)
	{
		//构建content内容。
		var content = {};
		//新建节点。构建全部属性。
		if(nodeCreating)
		{
			return false;
		}
		nodeCreating = true;
		var vf = cua.node._vf;
		//@FIXME: 这里我们采用hacker的方式来确定需要加入哪些域值。
		//@TODO: 这里遍历cua的x3dom
        
        //alert(cua.node.typeName()) ;
        
		switch(cua.node.typeName())
		{
		case "Inline":
			content["url"] = vf.url;
			break;
		case "Transform":
			content["center"] = vf.center.toStringValue();
			content["translation"] = vf.translation.toStringValue();
			content["rotation"] = vf.rotation.toStringValue();
			content["scale"] = vf.scale.toStringValue();
			content["scaleOrientation"] = vf.scaleOrientation.toStringValue();
			break;
        case "Viewpoint":
            content["position"] = vf.position.toStringValue() ;
			content["centerOfRotation"] = vf.centerOfRotation.toStringValue() ;
			content["orientation"] = vf.orientation.toStringValue() ;
			content["description"] =  vf.description ;
			content["viewName"] = cua.node._xmlNode.getAttribute("viewName") ;
			content["bind"] = vf.bind ;
			
			//content["set_bind"] = vf.set_bind ;
            break ;
		}
		//添加几个必备属性:
		//1.sp:Tag
		//2.sling:resourceType
		//3.jcr:primaryType.
		content["sp:Tag"] = cua.node.typeName();
		content["sling:resourceType"] = "x3d";
		content["jcr:primaryType"] = "sling:Folder";
		content["_charset_"] = "UTF-8";
        
        
        //ctx["scaleOrientation"] = vf.scaleOrientation.toStringValue();
		
        cua.isSync = true;
			
		var deferred = dojo.xhrPost({
			url : cua.url,
			content : content,
			cua : cua,
			load: function(data){
				nodeCreating = false;
				//fixme: index由于历史的删除，已经不能正确标识了。
				//我们使用cua来删除之。
				updateArray.removeSyncer(this.cua);
				dispatchWait();
				delete this.cua;
			},
			error: function(error){
				nodeCreating = false;
				SyncerBase.prototype.errorProc.call(this,error);
			}
		});
	}
	return !nodeCreating;
}

//删除syncer类
var SyncerDelete = function(url)
{
	SyncerBase.call(this,url);
	this.opType = SYNCER_DELETE;
}
SyncerDelete.prototype.merge = function(syncer)
{
	//如果试图对相同url做删除，则合并之。
	if( this.opType == syncer.opType && this.url === syncer.url)
	{
		return true;
	}
	return false;
}
SyncerDelete.prototype.doSync = function()
{
	var cua = this;
	//本元素没有在同步并且没有被服务器拒绝。
	if(!cua.isSync && !cua.denied)
	{
		cua.isSync = true;
		
		var ctx = {};
		ctx[":operation"] = "delete";
			
		var deferred = dojo.xhrPost({
			url : cua.url,
			content : ctx,
			cua : cua,
			load: function(data){
				//fixme: index由于历史的删除，已经不能正确标识了。
				//我们使用cua来删除之。
				updateArray.removeSyncer(this.cua);
				delete this.cua;
			},
			error: function(error){
				SyncerBase.prototype.errorProc.call(this,error);
			}
		});
	}
	return true;
}

//删除syncer类
var SyncerMove = function(url,dest)
{
	SyncerBase.call(this,url);
	this.opType = SYNCER_DELETE;
	this.destURL = dest;
}
SyncerMove.prototype.merge = function(syncer)
{
	//如果试图对相同url做删除，则合并之。
	if( this.opType == syncer.opType && this.url === syncer.url && this.destURL === syncer.destURL)
	{
		return true;
	}
	return false;
}
SyncerMove.prototype.doSync = function()
{
	var cua = this;
	//本元素没有在同步并且没有被服务器拒绝。
	if(!cua.isSync && !cua.denied)
	{
		cua.isSync = true;
		
		if(nodeCreating)
		{//move也会创建节点。
			return false;
		}
		nodeCreating = true;
		
		var ctx = {};
		ctx[":operation"] = "move";
		ctx[":dest"] = cua.destURL;
			
		var deferred = dojo.xhrPost({
			url : cua.url,
			content : ctx,
			cua : cua,
			load: function(data){
				nodeCreating = false;
				//fixme: index由于历史的删除，已经不能正确标识了。
				//我们使用cua来删除之。
				updateArray.removeSyncer(this.cua);
				delete this.cua;
			},
			error: function(error){
				nodeCreating = false;
				SyncerBase.prototype.errorProc.call(this,error);
			}
		});
	}
	return !nodeCreating;
}

//执行实际的更新动作。
function internalUpdate(){
	bWaitSync = false;
	updateArray.doSync();
}

function dispatchWait()
{
	if(bWaitSync)
	{//处在等待同步状态，因此，直接退出.
		return;
	}else{
	//没有处在等待同步状态,启动延迟处理。
		bWaitSync = true;
		setTimeout(internalUpdate,Spolo.updateInterval);
	}
}

x3dom.nodeTypes.X3DNode.prototype.initSync = function(xmlNode,name)
{
	var variant = this._vf[name];
	getter = function () {
		return variant;
	},
	setter = function (val) {
		var bChanged = (variant != val);
		variant = val;
		if(bChanged)
		{
			var uri = xmlNode.getAttribute("baseURI");
			if(uri && uri.length && xmlNode._x3domNode )
			{//uri属性存在，现在对其做延迟更新。
				var syncer = new SyncerUpdate(uri,xmlNode._x3domNode,name);
				updateArray.addSyncer(syncer);
			}
		}
		return val;
	};

	// can't watch constants
	if (delete this._vf[name]) {
		if (Object.defineProperty) // ECMAScript 5
			Object.defineProperty(this._vf, name, {
				get: getter,
				set: setter
			});
		else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
			Object.prototype.__defineGetter__.call(this._vf, name, getter);
			Object.prototype.__defineSetter__.call(this._vf, name, setter);
		}
	}
};

var sp_old_addField_SFInt32 = x3dom.nodeTypes.X3DNode.prototype.addField_SFInt32;
x3dom.nodeTypes.X3DNode.prototype.addField_SFInt32 = function (ctx, name, n) {
	sp_old_addField_SFInt32.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFFloat = x3dom.nodeTypes.X3DNode.prototype.addField_SFFloat;
x3dom.nodeTypes.X3DNode.prototype.addField_SFFloat = function (ctx, name, n) {
	sp_old_addField_SFFloat.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFDouble = x3dom.nodeTypes.X3DNode.prototype.addField_SFDouble;
x3dom.nodeTypes.X3DNode.prototype.addField_SFDouble = function (ctx, name, n) {
	sp_old_addField_SFDouble.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFTime = x3dom.nodeTypes.X3DNode.prototype.addField_SFTime;
x3dom.nodeTypes.X3DNode.prototype.addField_SFTime = function (ctx, name, n) {
	sp_old_addField_SFTime.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFBool = x3dom.nodeTypes.X3DNode.prototype.addField_SFBool;
x3dom.nodeTypes.X3DNode.prototype.addField_SFBool = function (ctx, name, n) {
	sp_old_addField_SFBool.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFString = x3dom.nodeTypes.X3DNode.prototype.addField_SFString;
x3dom.nodeTypes.X3DNode.prototype.addField_SFString = function (ctx, name, n) {
	sp_old_addField_SFString.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFColor = x3dom.nodeTypes.X3DNode.prototype.addField_SFColor;
x3dom.nodeTypes.X3DNode.prototype.addField_SFColor = function (ctx, name, r, g, b) {
	sp_old_addField_SFColor.call(this,ctx,name, r, g, b);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFColorRGBA = x3dom.nodeTypes.X3DNode.prototype.addField_SFColorRGBA;
x3dom.nodeTypes.X3DNode.prototype.addField_SFColorRGBA = function (ctx, name, r, g, b, a) {
	sp_old_addField_SFColorRGBA.call(this,ctx,name, r, g, b, a);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFVec2f = x3dom.nodeTypes.X3DNode.prototype.addField_SFVec2f;
x3dom.nodeTypes.X3DNode.prototype.addField_SFVec2f = function (ctx, name, x, y) {
	sp_old_addField_SFVec2f.call(this,ctx,name, x, y);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFVec3f = x3dom.nodeTypes.X3DNode.prototype.addField_SFVec3f;
x3dom.nodeTypes.X3DNode.prototype.addField_SFVec3f = function (ctx, name, x, y, z) {
	sp_old_addField_SFVec3f.call(this,ctx,name, x, y, z);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFVec3d = x3dom.nodeTypes.X3DNode.prototype.addField_SFVec3d;
x3dom.nodeTypes.X3DNode.prototype.addField_SFVec3d = function (ctx, name, x, y, z) {
	sp_old_addField_SFVec3d.call(this,ctx,name, x, y, z);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFRotation = x3dom.nodeTypes.X3DNode.prototype.addField_SFRotation;
x3dom.nodeTypes.X3DNode.prototype.addField_SFRotation = function (ctx, name, x, y, z, a) {
	try{
	sp_old_addField_SFRotation.call(this,ctx,name, x, y, z, a);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
	}catch(e)
	{
		alert(e);
	}
};

var sp_old_addField_SFMatrix4f = x3dom.nodeTypes.X3DNode.prototype.addField_SFMatrix4f;
x3dom.nodeTypes.X3DNode.prototype.addField_SFMatrix4f = function (ctx, name,  _00, _01, _02, _03,
																			  _10, _11, _12, _13,
																			  _20, _21, _22, _23,
																			  _30, _31, _32, _33) {
	sp_old_addField_SFMatrix4f.call(this,ctx,name,  _00, _01, _02, _03,
													_10, _11, _12, _13,
													_20, _21, _22, _23,
													_30, _31, _32, _33);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_SFImage = x3dom.nodeTypes.X3DNode.prototype.addField_SFImage;
x3dom.nodeTypes.X3DNode.prototype.addField_SFImage = function (ctx, name, def) {
	sp_old_addField_SFImage.call(this,ctx,name,def);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFString = x3dom.nodeTypes.X3DNode.prototype.addField_MFString;
x3dom.nodeTypes.X3DNode.prototype.addField_MFString = function (ctx, name, def) {
	sp_old_addField_MFString.call(this,ctx,name,def);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFInt32 = x3dom.nodeTypes.X3DNode.prototype.addField_MFInt32;
x3dom.nodeTypes.X3DNode.prototype.addField_MFInt32 = function (ctx, name, def) {
	sp_old_addField_MFInt32.call(this,ctx,name,def);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFFloat = x3dom.nodeTypes.X3DNode.prototype.addField_MFFloat;
x3dom.nodeTypes.X3DNode.prototype.addField_MFFloat = function (ctx, name, def) {
	sp_old_addField_MFFloat.call(this,ctx,name,def);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFDouble = x3dom.nodeTypes.X3DNode.prototype.addField_MFDouble;
x3dom.nodeTypes.X3DNode.prototype.addField_MFDouble = function (ctx, name, def) {
	sp_old_addField_MFDouble.call(this,ctx,name,def);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFColor = x3dom.nodeTypes.X3DNode.prototype.addField_MFColor;
x3dom.nodeTypes.X3DNode.prototype.addField_MFColor = function (ctx, name, n) {
	sp_old_addField_MFColor.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFColorRGBA = x3dom.nodeTypes.X3DNode.prototype.addField_MFColorRGBA;
x3dom.nodeTypes.X3DNode.prototype.addField_MFColorRGBA = function (ctx, name, n) {
	sp_old_addField_MFColorRGBA.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFVec2f = x3dom.nodeTypes.X3DNode.prototype.addField_MFVec2f;
x3dom.nodeTypes.X3DNode.prototype.addField_MFVec2f = function (ctx, name, n) {
	sp_old_addField_MFVec2f.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFVec3f = x3dom.nodeTypes.X3DNode.prototype.addField_MFVec3f;
x3dom.nodeTypes.X3DNode.prototype.addField_MFVec3f = function (ctx, name, n) {
	sp_old_addField_MFVec3f.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFVec3d = x3dom.nodeTypes.X3DNode.prototype.addField_MFVec3d;
x3dom.nodeTypes.X3DNode.prototype.addField_MFVec3d = function (ctx, name, n) {
	sp_old_addField_MFVec3d.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

var sp_old_addField_MFRotation = x3dom.nodeTypes.X3DNode.prototype.addField_MFRotation;
x3dom.nodeTypes.X3DNode.prototype.addField_MFRotation = function (ctx, name, n) {
	sp_old_addField_MFRotation.call(this,ctx,name,n);
	if (ctx && ctx.xmlNode) {
		this.initSync(ctx.xmlNode,name);
	}
};

//添加所有field的标准文本输出:
x3dom.fields.SFVec3f.prototype.toStringValue = function()
{
	return this.x + " " + this.y + " " + this.z;
}
x3dom.fields.Quaternion.prototype.toStringValue = function()
{
    var val = this.toAxisAngle();
	return val[0].x + " " + val[0].y + " " + val[0].z + " " + val[1];
}

//@TODO: 拦截孩子被添加删除的事件以响应delete/add操作并更新JCR。
//当事node可以通过属性ignoreSyncer来控制是否跳过更新。缺省是undefined.这个特性是为move服务的。
var sp_old_addChild = x3dom.nodeTypes.X3DNode.prototype.addChild;
x3dom.nodeTypes.X3DNode.prototype.addChild = function(node, containerFieldName){
	if(sp_old_addChild.call(this,node, containerFieldName) && !node.ignoreSyncer && node._xmlNode && node._xmlNode.isnew)
	{//添加成功，并且存在_xmlNode,创建更新条目。
		var uri = node._xmlNode.getAttribute("baseURI");
		if(uri && uri.length && node)
		{//uri属性存在，现在对其做延迟更新。
			var syncer = new SyncerCreate(uri,node);
			updateArray.addSyncer(syncer);
		}
		delete node._xmlNode.isnew;
	}
};

var sp_old_removeChild = x3dom.nodeTypes.X3DNode.prototype.removeChild;
x3dom.nodeTypes.X3DNode.prototype.removeChild = function(node){
	var flag = sp_old_removeChild.call(this,node);
	if(flag && !node.ignoreSyncer && node._xmlNode && node._xmlNode.hasAttribute("baseURI") && this._xmlNode)
	{//成功删除，并且node中存在baseURI属性。
		//@FIXME: 是否需要检查thisURI contain thatURI?
		//var thisURI = this._xmlNode.getAttribute("baseURI");
		var thatURI = node._xmlNode.getAttribute("baseURI");
		if(thatURI && thatURI.length)
		{//uri属性存在，现在对其做延迟删除。
			var syncer = new SyncerDelete(thatURI);
			updateArray.addSyncer(syncer);
		}
	}
}

//为x3dom添加moveChild函数。用于将一个node从其当前父移除，并加入到当前节点下:
//@FIXME: 这个函数需要处理_xmlNode.
x3dom.nodeTypes.X3DNode.prototype.moveChild = function(node){
	//首先设置node的ignoreSyncer属性，我们自己来接管sync，利用:move来处理。
	node.ignoreSyncer = true;
	try{
		var oldParent = node._parentNodes[0];
		var thisURL,destURL;
		if(node._xmlNode)
		{
			thisURL = node._xmlNode.getAttribute("baseURI");
		}
		if(this._xmlNode)
		{
			destURL = this._xmlNode.getAttribute("baseURI");
		}
		oldParent.removeChild(node);
		this.addChild(node);
		
		if(thisURL && destURL)
		{
			destURL += "/";
			destURL += thisURL.split('/').pop();
			var syncer = new SyncerDelete(thatURI);
			updateArray.addSyncer(syncer);
		}
	}catch(e)
	{
		alert("moveChild error : " + e);
	}
	delete node.ignoreSyncer;
}

// end spolo code scope 
})();