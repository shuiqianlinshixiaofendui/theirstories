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
// web3d ui 的主文件

require(["dojo/parser", "dojo/ready","dojo/topic","dojo/query","dijit/layout/BorderContainer", "dijit/layout/ContentPane"], 
	function(parser, ready, topic, query ,BorderContainer,ContentPane){
		ready(function(){
			parser.parse();		// 将 dijit 节点转换为 DOM
			
			// 下面初始化系统中的 Action
			var layoutRoot = query("#layout_main");		// 这里取得2D界面树的根节点，得到的dojo Object
			
			// 这里定义存放系统中所有Action的JSON对象
			if(!layoutRoot._sp_actions)	// 如果不存在则创建一个新的
				layoutRoot._sp_actions = {};	// 在界面树的根节点下

			// 这里定义也实例化Action的通用方法
			var addAction = function(name, classdefine){
				if(!layoutRoot._sp_actions[name])
					// 这里实例化并保存Action， 为了方便在Action中添加UI，这里将UI根节点传入
					layoutRoot._sp_actions[name] = new classdefine(layoutRoot);		
			};
			
			// 下面开始添加Action
			require([			
				"web3d/ui/scenelefttab"
				], function(scenelefttab){
				
				addAction("scenelefttab",scenelefttab);//场景编辑页面左侧
			});		
		});
});

