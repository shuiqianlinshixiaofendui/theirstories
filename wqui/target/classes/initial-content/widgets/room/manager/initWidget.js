/**
 *  This file is part of the SPP(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 **/
 
define("widgets/room/manager/initWidget",
[
    "widgets/room/utils/maintainObj"
],
function(
	MaintainObj
)
{
    /**
     * 私有方法
     */
    var _maintainObj = null;
    /**
     * 公有方法
     */
    return dojo.declare([], {
        constructor : function(x3d, x3dEdit){
            _maintainObj = new MaintainObj(x3d, x3dEdit);
            this.initUiWidget();
		},
        initUiWidget : function(){
            // var moduleList = _maintainObj("modelListOperate").getModuleList("qiang1");
            var moduleList = ["1","aa","dddddd","2"];
            // _maintainObj.load("ui_widget").showModelList(moduleList);
        }
	});
});