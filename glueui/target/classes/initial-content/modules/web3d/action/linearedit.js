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

///@brief linearedit负责维护场景的线性编辑行为。现阶段我们只有一个transformManipulator.因此，其职责只是简单的把transformManipulator构造出来就结束了。并不响应任何事件。
define("web3d/action/linearedit",["dojo/topic","web3d/node/transformManipulator"],
	function(topic,transformManipulator){
		return dojo.declare([],{
			constructor : function(x3d){
				this.manipulator = new transformManipulator();
			}
		});
	}
);

