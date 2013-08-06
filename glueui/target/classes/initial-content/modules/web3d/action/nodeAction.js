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

// 类spolo.action.nodeAction 
// 维护场景中节点的增加和删除

//因为我们不再依赖任何其它模块。如果依赖其它模块，写法如下，利用三个参数来书写:
//define(自己模块名，依赖模块数组，function(依序的依赖模块declare){这里需要return一个dojo.declare对象});
define(["web3d/action/updateAction","web3d/node/loadable"],function(updateAction,loadable){
	
	var nodeAction = new Object();
	/*
		根据参数解释： 将 loadable 添加到 scene 场景中的 parent 节点下。
	*/
	nodeAction.addNode = function(parentLoadable, modelUrl, callback){
		// 先同步jcr中的数据		
		updateAction.addNode(parentLoadable, modelUrl, function(msg){
			// 这个判断需要放在前面
			if(msg["status"]==500){
				if(callback)callback(msg);
			}
			
			if(msg.indexOf("<div id=\"Status\">201</div>")>-1){
			
				// 将模型加载到场景中
				var ldab = new loadable(modelUrl);
				
				// 设置模型的restful接口
				var restUrl = msg.substring(msg.indexOf('<h1>'), msg.indexOf('</h1>'));
				restUrl = restUrl.replace('<h1>Content created ', '');// 取得地址
				ldab.restUrl = restUrl;
				
				parentLoadable.add(ldab);
				if(callback){
					callback(msg);
				}
			}
		});
	};
	
	/*
		根据参数解释： 将 loadable 从其父节点中移除。
	*/
	nodeAction.removeNode = function(parentLoadable, loadable, callback){
		updateAction.removeNode(loadable, function(msg){
			if(msg["status"]==500){
				if(callback){
					callback(msg);
				}
			}
			
			if(msg.indexOf("<div id=\"Status\">200</div>")>-1){
				parentLoadable.remove(loadable);
				if(callback){
					callback(msg);
				}
			}
		});
	};
	
	return nodeAction;
});