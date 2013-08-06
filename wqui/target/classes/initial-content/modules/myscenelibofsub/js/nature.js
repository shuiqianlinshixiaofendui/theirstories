/*
* 定义函数。
* 
 
*/

var Nature = {};

Nature.Event = { };     //index页面用的事件注册
Nature.Control = {};    // 表单里的子控件，文本框、下拉列表框等
Nature.Debug = { };     //显示debug信息
Nature.Page = {};

Nature.Page.Button = {};    // 操作按钮
Nature.Page.Find = {};      // 查询控件
Nature.Page.Form = {};      // 添加、修改表单
Nature.Page.Grid = {};      // 数据列表

Nature.Page.Tab = {};       // 标签tab
Nature.Page.Tree = {};      // 树状功能菜单
Nature.Page.QuickPager = {};// 分页控件

 
// 分页需要的信息
//Nature.Page.QuickPager.PageInfo = function () {
//};

Nature.CommonModule = {}; //共用模块
Nature.CommonModule.ModuleForRole = {};         //角色维护里的模块列表、功能按钮
Nature.CommonModule.ModuleForRoleColumns = {};  //角色维护里的列表字段，表单字段等

Nature.CommonFunction = {};

Nature.CommonFunction = {
    /*判断使用哪个key。全都没打挑，视为都可以使用*/
    GetPermissionKey: function (colAll, colPermission) {
        var key = "";
        if (colPermission != undefined) {
            if (colPermission == "admin")
                key = colAll;
            else {
                if (colPermission.length == 0)
                    key = colAll;
                else
                    key = colPermission;

            }
        }
        else
            key = [];

        return key;

    },
    
    /*必须打挑的才能用*/
    GetPermissionKey2: function (colAll, colPermission) {
        var key = "";
        if (colPermission != undefined) {
            if (colPermission == "admin")
                key = colAll;
            else {
                key = colPermission;
            }
        }
        else
            key = [];

        return key;

    },
    
    //动态加载css
    addStyle : function (stylePath) {
        var container = document.getElementsByTagName("head")[0];
        var addStyle = document.createElement("link");
        addStyle.rel = "stylesheet";
        addStyle.type = "text/css";
        addStyle.media = "screen";
        addStyle.href = stylePath;
        container.appendChild(addStyle);
    }
};
