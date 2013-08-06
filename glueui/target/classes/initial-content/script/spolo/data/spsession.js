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

// 定义数据操作模块"spolo/data/spsession"

/** @brief 需要区分如下几个名字:

1. jsonnode : 
	客户端以json形式保存的node，使用者是不需要关心这个Node的，
	这个Node是spsession内部使用的，主要记录了数据的加载状态、路径，其中也包含了jcrNode数据。
	
2. jcrnode : 
	从服务器端回来的原生node，这个node所包含的数据跟JCR中一样。这个我们只在跟服务端JCR交互时使用。
	
3. spnode : 
	客户端封装jsonnode之后的对象形式，这个Node是为使用者提供的，API与JCR Node API保持一致

**/

define("spolo/data/spsession", 
[
    "dojo/_base/declare", 
    "dojo/request/xhr", 
    "spolo/data/spnode", 
    "dojo/dom"
], 
function(
declare, 
xhr, 
spnode, 
dom
) 
{
    /*********************************************************************************************************************************
		下面的方法为私有方法.
***********************************************************************************************************************************/


    // data load state:    		sp_loaded 分为如下几个等级。我们使用四个等级顺序来判断加载阶段:s
    var DATA_UNLOAD = 0; // 0: 未加载: DATA_UNLOAD
    var DATA_IS_LOADING = 1; // 1: 数据正在加载中: DATA_IS_LOADING
    var DATA_LOADED = 2; // 2: 数据已经加载完成: DATA_LOADED
    var CHILD_LOADED = 3; // 3: 孩子已经加载完成: DATA_LOADED


    /**	@brief 自定义一个 mixin 方法，不覆盖重名的属性		
	**/
    function spmixin(dest, source) 
    {
        if (!dest) {
            dest = {};
        }
        var prop;
        for (prop in source) {
            if (dest[prop]) {
                continue;
            }
            dest[prop] = source[prop];
        }
        return dest;
    }


    /**	@brief 深入遍历混合两个对象及子对象，不覆盖重名的属性
			在 dest[prop] 和 source[prop] 都为 object 时才会深入混合
	**/
    function spmixinDepth(dest, source) 
    {
    
    }


    /**	@biref	检查某个object是不是 jsonnode 
		该方法主要用于检查 dataStore 中的 jsonnode
	**/
    function checkJSONNode(object) 
    {
        if (object["sp::client::path"] && object["sp::client::dataState"]) {
            return true;
        }
        return false;
    }


    /** @brief 创建一个 jsonnode 节点。 
	**/
    function createJSONNode(path) 
    {
        return {
            "sp::client::path": path,
            "sp::client::dataState": DATA_UNLOAD,
            "sp::client::node": null
        };
    }


    /** @brief 	把一个 jsonnode 恢复为 jcr json 
	**/
    function recoverJSONFromJNode(jsonnode) 
    {
        delete jsonnode["sp::client::path"];
        delete jsonnode["sp::client::dataState"];
        delete jsonnode["sp::client::node"];
        delete jsonnode["sp::client::nodes"];
        return jsonnode;
    }


    /** @brief  把一个 JSONNode或 转换为 JSON
	**/
    function getJsonFromJNode(jsonnode) 
    {
        var newJsonNode = {};
        spmixin(newJsonNode, jsonnode);
        
        var prop;
        function recursion(rejson) {
            rejson = recoverJSONFromJNode(rejson);
            for (prop in rejson) 
            {
                if (typeof (rejson[prop]) == "object") 
                {
                    recursion(rejson[prop]);
                }
            }
        }
        recursion(newJsonNode);
        return newJsonNode;
    }


    /** @brief  把一个 JSONNode或 转换为 JSONArray
	**/
    function getNodesJsonFromJsonNode(jsonnode) 
    {
        var newJson = {};
        var json;
        for (k in jsonnode) 
        {
            if (
            typeof (jsonnode[k]) == "object" && 
            k.indexOf("jcr:") < 0 && 
            k.indexOf("sp::client::") < 0
            ) {
                json = getJsonFromJNode(jsonnode[k]);
                newJson[k] = json;
            }
        }
        
        return newJson;
    }


    /**	@brief	从指定的spnode中检索子节点，并缓存下来
				该方法在 ensureNode 的时候调用，取到单个节点数据的同时缓存一份 nodes 数据
				所以，这里传入的spnode已经加载好数据了。
				
				该方法中的 this 是当前 spsession 对象；
				是在调用时通过 .call(this, ); 传过来的。
	**/
    function getNodesFromJsonNode(jsonnode) 
    {
        var basepath = jsonnode["sp::client::path"];
        // 如果当前jsonnode是根节点
        if (basepath == this.rootPath)
            basepath = "";
        else
            basepath += "/";
        
        var newNodeArray = [];
        
        var nodepath, newNode;
        for (var k in jsonnode) {
            if (
            typeof (jsonnode[k]) == "object" && 
            k.indexOf("jcr:") < 0 && 
            k.indexOf("sp::client::") < 0
            ) {
                // 如果当前节点中已经有 spnode 了，直接使用
                newNode = jsonnode[k]["sp::client::node"];
                if (!newNode) {
                    nodepath = basepath + k;

                    // newJson = {};	// 这里是不想把缓存中的 jcrnode 转成 jsonnode
                    // spmixin(newJson, jsonnode[k]);
                    // newNode = getNodeFromJson.call(this, newJson, nodepath);
                    
                    newNode = getNodeFromJson.call(this, jsonnode[k], nodepath);
                }
                newNodeArray.push(newNode);
            }
        
        }
        return newNodeArray;
    }


    /** @brief	从JsonNode中获取指定的 spnode.
			该方法中的 this 是当前 spsession 对象；
			是在调用时通过 .call(this, ); 传过来的。
	*/
    function getNodeFromJsonNode(jsonnode) 
    {
        if (jsonnode) 
        {
            if (typeof (jsonnode["sp::client::node"]))
                jsonnode["sp::client::node"] = new spnode(this, jsonnode);
            var path = jsonnode["sp::client::path"];
            var nodeName = path.substring(path.lastIndexOf('/') + 1);
            jsonnode["sp::client::node"]["nodeName"] = nodeName;
            return jsonnode["sp::client::node"];
        }
        return null;
    }


    /**	@brief	从一个SPNode节点中取出普通的 JSON 数据
			该方法中的 this 是当前 spsession 对象；
			是在调用时通过 .call(this, ); 传过来的。
	*/
    function getNodeFromJson(json, absPath) 
    {
        var jsonnode = spmixin(json, createJSONNode(absPath));
        return getNodeFromJsonNode.call(this, jsonnode);
    }


    /**	@brief	把绝对路径转换为相对于当前 session 根路径的相对路径
	**/
    function absPathToRelPath(absPath, rootPath) 
    {
        var relPath = "";
        // 先把absPath转为相对路径
        // 如果结果为空，那么说明 absPath == rootPath 
        relPath = absPath.replace(rootPath, "");
        if (relPath == "") {
            return "";
        }

        // 如果路径前面是以 / 开头的，则去掉
        if (relPath.substring(0, 1) == "/") {
            relPath = relPath.substring(1);
        }
        return relPath;
    }


    /**	@brief	从指定缓存中删除指定节点，
			该方法会在确定得到了服务端JCR中的正确数据后被调用；
		@param 这里传入的参数是一个 JSONObject ,
			var JSONObject = {
				cache : datastore,	相当于是path的根节点，它是一个 dataStore / DSWriteCache / DSDelCache 。
				rootPath : rootPath,	当前 session 的根路径。
				absPath : absPath		以当前session为根路径的绝对路径；根据路径去寻找 cache 下的子节点。
			};
			调用者需要通过  .call(JSONObject) 来传入参数。
		@return 如果节点存在，则返回节点；如果节点不存在，则返回 null;
	**/
    function removeJsonNodeFromCache(args) 
    {
        var cache = args["cache"], 
        rootPath = args["rootPath"], 
        absPath = args["absPath"];
        
        var relPath = absPathToRelPath(absPath, rootPath);
        if (relPath == "") {
            cache = {};
            return;
        }
        
        var dataMember = relPath.split("/"), 
        delPath = dataMember.pop(), 
        lastNode = cache, 
        child = null;

        // 取得要删除节点的父节点
        for (var i = 0; i < dataMember.length; i++) 
        {
            child = lastNode[dataMember[i]];

            // 检查child是否有效，
            // 如果没有 child 则在缓存中创建之
            if (typeof (child) == "undefined") 
            {
                return;
            }
            lastNode = child;
        }

        // 删除节点
        delete lastNode[delPath];
        
        return;
    }


    /** @brief	从给定的一个对象中，按照 path 逐层创建缓存数据。
		@param 这里传入的参数是一个 JSONObject ,
			var JSONObject = {
				cache : datastore,	相当于是path的根节点，它是一个 dataStore / DSWriteCache / DSDelCache 。
				absPath : absPath,		以当前session为根路径的绝对路径；根据路径去寻找 cache 下的子节点。
				rootPath : rootPath,	当前 session 的根路径。
				initfunc : initfunc		初始化新建节点的函数。如果未指定，则不予以初始化。initfunc 
			};
			调用者需要通过  .call(JSONObject) 来传入参数。
		@return 返回刚刚添加的节点，jsonnode类型
	*/
    function getJsonNodeFromCache() 
    {
        // 这里的 this 是调用这个方法的时候通过 .call(argsJSON) 传过来的。
        var cache = this.cache;
        var rootPath = this.rootPath;
        var absPath = this.absPath;
        var initfunc = this.initfunc;
        
        var relPath = absPathToRelPath(absPath, rootPath);
        if (relPath == "") {
            return cache;
        }
        
        var dataMember = relPath.split('/');
        var lastNode = cache;
        var curpath = "";
        var child = null;
        for (var i = 0; i < dataMember.length; i++) 
        {
            child = lastNode[dataMember[i]];
            //更新path;
            if (curpath.length > 0)
                curpath += '/';
            curpath += dataMember[i];

            //检查child是否有效，
            // 如果没有 child 则在缓存中创建之
            if (typeof (child) == "undefined") 
            {
                if (typeof (initfunc) == "function") // 如果支持初始化缓存节点的方法，则调用
                    lastNode[dataMember[i]] = initfunc(curpath);
                else // 如果不支持，则直接创建一个普通的 object 
                    lastNode[dataMember[i]] = {};
                child = lastNode[dataMember[i]];
            } else { // 如果已经有了这个 child ，则检查是否符合 jsonnode 的规范
                // 如果不符合规范，则校正之
                if (!checkJSONNode(child)) {
                    spmixin(child, createJSONNode(curpath));
                }
            }
            lastNode = child;
        }
        // currentStore保存了需要的节点。
        // 这里需要返回最后一层节点，也就是用户当前需要的Node.
        return lastNode;
    }


    /**	@brief 从dataStore中获取读对象。
		该方法中的 this 是当前 spsession 对象；
		调用时通过 .call(this, ); 传过来的。
	**/
    function getJsonNodeFromRead(path) 
    {
        var args = {
            cache: this.dataStore,
            absPath: path,
            rootPath: this.rootPath,
            initfunc: createJSONNode
        };
        return getJsonNodeFromCache.call(args);
    }


    /**	@brief 从DSWriteCache中获取写对象。
		该方法中的 this 是当前 spsession 对象；
		调用时通过 .call(this, ); 传过来的。
	**/
    function getJsonNodeFromUpdate(absPath) 
    {
        var args = {
            cache: this.DSUpdateCache,
            absPath: absPath,
            rootPath: this.rootPath
        };
        return getJsonNodeFromCache.call(args);
    }


    /**	@brief 从 DSCreateCache 中获取写对象。
	**/
    function getJsonNodeFromCreate(path) 
    {
        var args = {
            cache: this.DSCreateCache,
            absPath: path,
            rootPath: this.rootPath
        };
        return getJsonNodeFromCache.call(args);
    }


    /**	@brief	更新 cache 中的一个节点
	**/
    function updateJsonNodeToCache(cache, jsonnode) 
    {
    
    }


    /** @brief 从jcr中加载数据到node对象中。
		这里传入的参数是一个 JSONObject ,
		var JSONObject = {
			session : spsession,
			spnode : spnode,
			callback : callback,
			errCallback : errCallback
		};
		调用者需要通过  .call(JSONObject) 来传入参数。
	**/
    function loadNodeFromJCR() 
    {
        var session = this["session"];
        var spnode = this["spnode"];
        var callback = this["callback"];
        var errCallback = this["errCallback"];
        
        var jsonnode = spnode["jsonnode"];
        this["nodepath"] = jsonnode["sp::client::path"]; // 添加这句是为了保存请求节点的地址
        // 因为在 xhr error 的时候获取不到 spnode 了。
        var path;

        // 这里取到当前 session 的根路径
        if (session.rootPath == jsonnode["sp::client::path"]) {
            path = jsonnode["sp::client::path"];
        } else {
            path = session.rootPath + "/" + jsonnode["sp::client::path"];
        }
        
        path = path + ".1.json";
        
        xhr(path, {
            handleAs: "json",
            method: "GET",
            sync: false
        }).then(
        // 执行成功
        dojo.hitch(spnode, function(jcrnode) {
            // 把拿到的 jcr 数据合并到 spnode 中
            spmixin(this["jsonnode"], jcrnode);
            this["jsonnode"]["sp::client::dataState"] = CHILD_LOADED;
            var childArray = this.getNodes();
            // 将孩子的加载状态设置为DATA_LOADED.
            for (var i = 0; i < childArray.length; i++) 
            {
                var child = childArray[i];
                child["jsonnode"]["sp::client::dataState"] = DATA_LOADED;
            }
            // for(var key in this["jsonnode"])
            // {
            // if(key.indexOf("sp::client::") >= 0)
            // continue;
            // var c = this["jsonnode"][key];
            // if(typeof(c) == "object" && typeof(c["sp::client::dataState"]) != "undefined")
            // {
            // c["sp::client::dataState"] = DATA_LOADED;
            // }
            // }
            // console.log(this);
            callback.call(spnode);
        }), 
        // 执行失败 : @FIXME: 为什么这里要绑定this context?谁需要这个信息了？
        // A: 1044行ensureData中使用错误来rollback.所以绑定了this.
        dojo.hitch(this, function(result) {
            errCallback.call(this, result);
        })
        );
    }


    /** @brief 从缓存中删除加载时出现错误的节点
	*/
    function removeErrorNodeFromCache() 
    {
    // TODO: 
    }


    /**	@brief 判断 cache 中是否有数据
	*/
    function checkCacheEmpty(cache) 
    {
        var flag = false;
        for (var k in cache) {
            if (cache[k]) {
                flag = true;
                break;
            }
        }
        return flag;
    }


    /** @brief 把 DSCreateCache 里的数据更新到服务端 JCR 中
		@param args = {
				success : function(){
				},
				failed : function(){
				},
				saving : function(){
				}
			}
		该方法中的 this 是当前 session  
	*/
    function saveDataFromDSCreate(args) 
    {
        if (checkCacheEmpty(this.DSCreateCache) == false) {
            return;
        }

        // 这里整理缓存中的数据，把 sp::client:: 这样的属性删除，否则无法提交 jcr 
        // 这个操作会 clone 一份 this.DSCreateCache 。
        // 这样做是为了避免在提交请求的过程中再次执行save引发的冲突 。
        var cache = getJsonFromJNode(this.DSCreateCache);
        // 清空 this.DSCreateCache 。
        this.DSCreateCache = {};

        // var replaceExist = args["existNodeReplace"];
        // if(typeof(replaceExist)=="undefined")
        // replaceExist = false;
        
        var successFunc = args["success"];
        var failedFunc = args["failed"];
        var savingFunc = args["saving"];

        // 先来准备更新的数据及参数
        var url = this.getPath();
        var content = {};
        
        content["_charset_"] = "UTF-8";
        content[":operation"] = "import";
        content[":contentType"] = "json";
        content[":content"] = JSON.stringify(cache);
        content[":replaceProperties"] = true;
        // content[":replace"] = false;
        
        xhr(url, {
            handleAs: "text",
            method: "POST",
            data: content
        }).then(
        dojo.hitch(this, function(msg) {
            // 保存成功 , 执行回调
            if (successFunc)
                successFunc(msg);
        }), 
        dojo.hitch(this, function(e) {
            if (failedFunc)
                failedFunc(e);
        })
        );
    }


    /**	@brief	把 dirty 数据的修改保存到 jcr 中，这里dirty是节点属性的变动
		@param args = {
				success : function(){
				},
				failed : function(){
				},
				saving : function(){
				}
			}
		该方法中的 this 是当前 session  
	*/
    function saveDataFromDSUpdate(args) 
    {
        // TODO: 这个方法可以与 saveDataFromDSCreate() 合并
        
        if (checkCacheEmpty(this.DSUpdateCache) == false) {
            return;
        }
        
        var cache = getJsonFromJNode(this.DSUpdateCache);
        this.DSUpdateCache = {};
        
        var successFunc = args["success"];
        var failedFunc = args["failed"];
        var savingFunc = args["saving"];

        // 先来准备更新的数据及参数
        var url = this.getPath();
        var content = {};
        
        content["_charset_"] = "UTF-8";
        content[":operation"] = "import";
        content[":contentType"] = "json";
        content[":content"] = JSON.stringify(cache);
        content[":replaceProperties"] = true;
        // content[":replace"] = false;
        
        xhr(url, {
            handleAs: "text",
            method: "POST",
            data: content
        }).then(
        dojo.hitch(this, function(msg) {
            // 保存成功 , 执行回调
            if (successFunc)
                successFunc(msg);
        }), 
        dojo.hitch(this, function(e) {
            if (failedFunc)
                failedFunc(e);
        })
        );
    }


    /**	@brief 把 DSDeleteCache 里的数据更新到服务端 JCR 中
		@param args = {
				success : function(){
				},
				failed : function(){
				},
				saving : function(){
				}
			}
		该方法中的 this 是当前 session	
	*/
    function saveDataFromDSDelete(args) 
    {
        if (this.DSDeleteCache.length < 1) {
            return;
        }
        
        var cache = [];
        cache = this.DSDeleteCache;
        this.DSDeleteCache = []; // 清空缓存
        
        var successFunc = args["success"];
        var failedFunc = args["failed"];
        var savingFunc = args["saving"];
        
        var content = {};
        content["_charset_"] = "UTF-8";
        content[":operation"] = "delete";
        content[":applyTo"] = [];
        
        var key;
        for (key in cache) {
            if (key != "hasObject" && cache[key]) {
                content[":applyTo"].push(cache[key]);
            }
        }
        
        var url = this.rootPath;
        
        xhr(url, {
            handleAs: "text",
            method: "POST",
            data: content
        }).then(
        dojo.hitch(this, function(msg) {
            // 删除成功, 执行回调
            if (successFunc)
                successFunc(msg);
        }), 
        dojo.hitch(this, function(e) {
            if (failedFunc)
                failedFunc(e);
        })
        );
    }


    /**	@brief 执行在loading时保存下来的所有回调函数
	**/
    function invokeLoadingCallback(type) {
        var callPath;
        var dataStoreLoadingCallback = this.getSession()["dataStoreLoadingCallback"];
        for (callPath in dataStoreLoadingCallback) 
        {
            if (dataStoreLoadingCallback[callPath]) {
                dataStoreLoadingCallback[callPath][type](dataStoreLoadingCallback[callPath][this]);
            }
        }
    }


    /*********************************************************************************************************************************
		下面是公共方法
*********************************************************************************************************************************/




    // 创建资源类管理对象实例，按照顺序加载资源。
    var retClass = declare("spolo/data/spsession", [], 
    {

        /** 数据管理对象构造函数:根据所传入的路径来加载数据
		*/
        constructor: function(path) 
        {
            
            this.rootPath = path; // 保存当前 session 的根路径
            this.dataStoreLoadingCallback = {}; // 保存了请求加载的回调。如果有数据被加载，则数据加载完毕之后会回调。
            this.dataStoreErrorCallback = {}; // 保存了请求错误后的回调。
            
            this.dataStore = {}; // 保存了jcr的缓冲。缺省为空。
            // 每当我们加载了一级缓冲。
            // 我们会设置相应级别的sp::client::dataState为is_loading或者loaded.
            
            this.DSUpdateCache = {}; // 保存了jcr的写入部分。
            // 我们写入的规则是先写入DSWriteCache.
            // 如果dataStore对应节点被加载，则更新之，否则不予以更新jcr.
            
            this.DSCreateCache = {}; // 保存了jcr的新建节点部分。
            this.DSDeleteCache = []; // 保存了jcr中删除的缓冲。尚未被实现和利用。

            // 初始化当前 dataStore 的根节点
            this.dataStore = createJSONNode(path);
        
        },


        /** @brief 在当前 spsession 数据缓冲中添加一个节点
			@param args = {
				nodePath : "tddata001",
				property : {
					resName : "新场景11", 
					author : "管理员11", 
					price : 111000, 
					tdName : "donwww" 
				}
			}
			@return  当前session
		*/
        addNode: function(args) 
        {
            var absPath = args["nodePath"];
            if (!absPath) {
                throw ("nodePath is not defined in addNode method");
            }
            var json = args["property"];
            if (!json) {
                throw ("property is not defined in addNode method");
            }
            
            var node = getJsonNodeFromCreate.call(this, absPath);
            spmixin(node, json);

            // 把新添加的节点更新到 dataStore 缓存中
            node = getJsonNodeFromRead.call(this, absPath);
            spmixin(node, json);
            node["sp::client::dataState"] = CHILD_LOADED;
            
            var successFunc = args["success"];
            var failedFunc = args["failed"];
            var savingFunc = args["saving"];
            if (typeof (successFunc) == "function") {
                this.save({
                    success: function() {
                        successFunc();
                    },
                    failed: function(e) {
                        if (failedFunc) {
                            failedFunc(e);
                        }
                    },
                    saving: function() {
                        if (savingFunc) {
                            savingFunc();
                        }
                    }
                });
            }
            
            return getNodeFromJsonNode.call(this, node);
        },


        /** @brief	获得当前session的根节点
		*/
        getRootNode: function() 
        {
            return getNodeFromJsonNode.call(this, this.dataStore);
        },

        /**	@brief	从JsonData中获取指定的NodeObject.
		*/
        getNode: function(absPath, successFunc, failedFunc, loadingFunc) 
        {
            var jsonArgs = {};
            // 如果路径为空，则默认为当前 session 的根路径
            if (!absPath) {
                absPath = this.rootPath;
            }
            //判断是否传入回调函数,如果不传入,则
            if (typeof (successFunc) != "function") {
                try {
                    return getNodeFromJsonNode.call(this, getJsonNodeFromRead.call(this, absPath));
                } catch (e) {
                    throw ("not find this node , please check your relPath ");
                }
            }
            if (typeof (successFunc) == "function")
                jsonArgs["success"] = successFunc;
            if (typeof (failedFunc) == "function")
                jsonArgs["failed"] = failedFunc;
            if (typeof (loadingFunc) == "function")
                jsonArgs["loading"] = loadingFunc;
            jsonArgs["absPath"] = absPath;
            this.ensureNode(jsonArgs);
        
        },


        /** @brief	从指定的路径下获取所有的子节点
			使用者必须确保当前节点的数据已经加载了。
		*/
        getNodes: function(absPath, successFunc, failedFunc, loadingFunc) 
        {
            // 因为数据已经ensure , 所以直接从本地缓存中取出指定的节点
            var jsonnode = getJsonNodeFromRead.call(this, absPath);
            // 去 jsonnode 中的 spnode 
            if (jsonnode["sp::client::dataState"] >= CHILD_LOADED) 
            {
                return getNodesFromJsonNode.call(this, jsonnode);
            } else {
                throw ("getNodes method must be after node " + absPath + " ensureData");
            }
        },
        
        isDataValid: function(node) 
        {
            return node["jsonnode"]["sp::client::dataState"] >= DATA_LOADED;
        },
        
        isChildValid: function(node) 
        {
            return node["jsonnode"]["sp::client::dataState"] >= CHILD_LOADED;
        },

        /**	@brief	从一个SPNode节点中取出普通的 JSON 数据
		*/
        getJSONFromNode: function(spnode) 
        {
            if (!spnode) {
                throw ("spnode is undefined!");
            }
            
            var jsonnode = spnode["jsonnode"];
            if (jsonnode["sp::client::dataState"] >= DATA_LOADED) 
            {
                return getJsonFromJNode(spnode["jsonnode"]);
            } else {
                throw ("getJSONFromNode method must be after node " + spnode.getPath() + " ensureData");
            }
        },


        /**	@brief	从一个SPNode节点中取出普通的 JSON 数据
		*/
        getNodesJsonFromNode: function(spnode) 
        {
            var jsonnode = spnode["jsonnode"];
            if (jsonnode["sp::client::dataState"] >= CHILD_LOADED) 
            {
                return getNodesJsonFromJsonNode(spnode["jsonnode"]);
            } else {
                throw ("getNodesJsonFromNode method must be after node " + spnode.getPath() + " ensureData");
            }
        },


        /** @brief	获得当前session的根路径
		*/
        getPath: function() {
            return this.rootPath;
        },


        /**	@brief 从当前 spsession 数据缓冲中删除一个节点
			@param absPath 绝对路径
		*/
        removeNode: function(absPath) 
        {
            if (absPath) {
                this.DSDeleteCache.push(absPath);
                var args = {
                    cache: this.dataStore,
                    rootPath: this.rootPath,
                    absPath: absPath
                };
                removeJsonNodeFromCache(args);
            }
        },


        /**	@brief	查找当前session中是否包含指定节点
			@param 	args = {
						nodePath: "",
						existed : function(){
						},
						notExist : function(){
						},
						checking : function(){
						}
					};
		*/
        hasNode: function(args) {
            
            var ensureArgs = {
                absPath: args["nodePath"],
                success: args["existed"],
                failed: args["notExist"],
                loading: args["checking"]
            };
            
            this.getNode(args["nodePath"]);
            this.ensureNode(ensureArgs);
        },


        /**	@brief 修改某个属性的值
			@param args = 
					{
						spnode: this,	// spnode对象，该参数与 nodePath 参数二选一即可。
						nodePath: "",	// 节点在缓存中的路径，该参数与 spnode 参数二选一即可。
						propertyName: propName,
						value : value
					};
		*/
        setProperty: function(args) 
        {
            // 先把节点的属性修改记录到 writeCache 中
            // 然后修改当前缓存 dataStore 中的值
            // 得到缓存中对应节点
            // 然后再设置属性值
            // 返回 spsession 对象，以便于直接 .save()
            
            var absPath = args["nodePath"], 
            spnode = args["spnode"], 
            propertyName = args["propertyName"], 
            value = args["value"];
            
            if (typeof (spnode) == "object") {
                absPath = spnode["jsonnode"]["sp::client::path"];
            } else if (absPath) {
                spnode = this.getNode(absPath);
            } else {
                console.error("spsession.setProperty parameter error!");
                return;
            }
            
            var wrnode = getJsonNodeFromUpdate.call(this, absPath);
            wrnode[propertyName] = value;
            spnode["jsonnode"][propertyName] = value;
            
            return this;
        },


        /** @brief 得到指定节点的指定属性值.调用者需要确保对象的数据已经被ensure.
			FIXME: 如果使用者 setProp 之后，没有save，然后getProp，应该从 DSWriteCache 中返回
		*/
        getProperty: function(param, property) 
        {
            if (!param)
                return null;
            
            var jsonNode;
            if (typeof (param) == "object") 
            { //如果param1是一个对象，我们假定其为node对象.
                jsonNode = param["jsonnode"];
            } else {
                jsonNode = getJsonNodeFromRead.call(this, param);
            }
            return jsonNode[property];
        },


        /** @brief 获取指定节点的所有属性
		*/
        getProperties: function(spnode) {
            return this.getJSONFromNode(spnode);
        },


        /**	@brief 删除指定节点的指定属性
			@param spnode 节点对象; 也可以是nodePath; 
			@param propName 节点的属性名
		*/
        removeProperty: function(spnode, propName) {
        
        },


        /** @brief 确定指定节点的数据是否被加载；
				如果加载了直接从缓存中返回
				如果没加载则从服务端jcr中加载
			@param jsonArgs = {
				spnode : spnode,	// spnode 和 absPath 这两个参数任选一个即可，
				absPath : string,		如果两个都给，那么默认使用 spnode 
				success : function(){},
				failed : function(){},
				loading : function(){}
			}
			该方法的 this 是 spsession
		*/
        ensureNode: function(jsonArgs) 
        {
            var spnodeParam = jsonArgs["spnode"];
            var absPath = jsonArgs["absPath"];
            var successFunc = jsonArgs["success"];
            var failedFunc = jsonArgs["failed"];
            var loadingFunc = jsonArgs["loading"];
            var notLoadingChild = jsonArgs["nochild"];
            var ignoreCache = jsonArgs["ignoreCache"];
            if (typeof (notLoadingChild) == "undefined")
                notLoadingChild = false;
            
            var spnode;
            if (typeof (spnodeParam) == "object") {
                spnode = spnodeParam;
            } else if (absPath) { // 如果 param 是一个相对于 spsession 的绝对路径
                spnode = this.getNode(absPath); // 这里的 absPath 允许为空
            // 为空则返回当前根节点
            }
            
            var jsonnode = spnode["jsonnode"];
            var nodepath = jsonnode["sp::client::path"];

            // 设置当前节点忽略缓存
            if (ignoreCache) {
                spnode.ignoreCache();
            }
            
            var loadDataFromJCR = function() 
            {
                // 加载成功的回调函数
                function callback() {
                    // 这里的 this 是 xhr success 后传过来的 spnode
                    if(successFunc)successFunc(this);

                    // 执行loading时请求ensureNode的回调函数
                    invokeLoadingCallback.call(this, "success");
                }
                // 加载失败的回调函数
                function errCallback(reslt) {
                    // 这里的 this 是 xhr error 后传过来的 args JSON 
                    // 数据加载失败后，需要把错误数据从 cache 中移除
                    // console.log("");
                    var errPath = this["nodepath"];
                    // // console.log("errCallback  " +errPath);

                    // 先把错误节点的 dataState 修改为 DATA_UNLOAD
                    this["spnode"]["jsonnode"]["sp::client::dataState"] = DATA_UNLOAD;
                    // 删除错误节点


                    // 执行失败的回调函数
                    if(failedFunc)failedFunc(reslt);

                    // 执行loading时请求ensureNode的回调函数
                    invokeLoadingCallback.call(this["spnode"], "failed");
                }
                
                var args = {
                    session: this,
                    spnode: spnode,
                    callback: callback,
                    errCallback: errCallback
                };
                
                spnode["jsonnode"]["sp::client::dataState"] = DATA_IS_LOADING;
                if (loadingFunc)
                    loadingFunc(spnode);
                loadNodeFromJCR.call(args);
            };
            
            switch (jsonnode["sp::client::dataState"]) 
            {
                case DATA_LOADED:
                    if (notLoadingChild) 
                    {
                        //加载完毕，直接发出事件。
                        if (successFunc)
                            successFunc(spnode);
                    } else {
                        loadDataFromJCR.call(this);
                    }
                    break;
                case CHILD_LOADED:
                    //加载完毕，直接发出事件。
                    if (successFunc)
                        successFunc(spnode);
                    break;
                case DATA_IS_LOADING:
                    // 当前节点正在加载中
                    if (loadingFunc)
                        loadingFunc(spnode);
                    // 保存回调，等待加载完成后调用
                    var key = spnode.getSession().rootPath + "/" + nodepath;
                    jsonArgs["spnode"] = spnode;
                    this.dataStoreLoadingCallback[key] = jsonArgs;
                    break;
                default: //此时我们认为数据未加载。maybe undefined.
                    loadDataFromJCR.call(this);
                    break;
            }
        },


        /** @brief 把缓存中修改的数据更新到服务器
			@param args = {
				success : function(){
				},
				failed : function(){
				},
				saving : function(){
				}
			}
		*/
        save: function(args) 
        {

            //1. 判断缓存中是否有 dirty 数据。
            //2. 将 dirty 数据使用 :operate=  一次性更新服务器数据。
            //3. 将 dirty 数据更新到本地缓存 this.dataStore 。
            //4. 清空 dirty 。
            
            var savingFunc = args["saving"];
            if (savingFunc)
                savingFunc();

            // 将新建节点的 cache 数据保存到 jcr
            saveDataFromDSCreate.call(this, args);
            
            saveDataFromDSUpdate.call(this, args);
            
            saveDataFromDSDelete.call(this, args);
        
        },
        
        
        updateFromForm: function(domid, mapping) 
        {
        //1. 如果有mapping,添加一个hidden域，将mapping传入。
        //2. 检查并修改action地址。
        //3. 遍历form,将对应属性从DSWriteCache中删除。并缓冲到一个局部对象dataCache中。
        //4. form提交。
        //5. dataCache中的属性更新this.dataStore.
        },
        
        
        isDirty: function() 
        {
        
        },
        
        
        getDirty: function() 
        {
            return this.DSWriteCache;
        }
    
    }); //dojo.declare


    /** @brief 查询模型的方法
		@param option = {    //表示一个json数据:包含以下内容：
				nodePath : 节点路径,必须是folder类型,
				language : 查询的语言,
				expression : 查询的语句,
				load : 查询成功执行的回调函数,
				error : 失败执行的回调函数
			}
	*/
    retClass.query = function(option)
	{
		if(!option){
			throw("option is undefined!");
		}
		
		var data = {};
		
		if(option["language"]){
			data["language"] = option["language"];
		}else{
			throw("option[\"language\"] is undefined!");
		}
		
		if(option["expression"]){
			data["expression"] = option["expression"];
		}else{
			throw("option[\"expression\"] is undefined!");
		}
		
		if(option["limit"]){
			data["limit"] = option["limit"];
		}else{
			throw("option['limit'] is undefined!");
		}
		
		if(option["offset"]){
			data["offset"] = option["offset"];
		}else{
			throw("option['offset'] is undefined!");
		}
		
		if(!option["nodePath"]){
			throw("option[\"nodePath\"] is undefined!");
		}
		var url = option["nodePath"] + ".query";
		
		xhr( url, {
			query: data,
			handleAs:"json"
		}).then(
			function(json) {
				if(typeof(option["load"])=="function"){
					option["load"](json);
				}else{
					throw("option[\"load\"] is undefined!");
				}
			},
			function(error) {
				if(typeof(option["error"])=="function"){
					option["error"](error);
				}else{
					throw(error);
				}
			}
		);

	}
	return retClass; // 返回资源对象

}); //define end
////@ sourceURL=/script/spolo/data/spsession.js