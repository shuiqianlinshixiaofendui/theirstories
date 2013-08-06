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

/**
	
*/

define("widgets/homeCanvas/initCanvas/readsvg",
    ["dojo/topic"],
    function(topic){
	
    var readsvg = dojo.declare([],{
        canvas : Spolo.canvas,
		constructor : function(){
            
		},
        
        // funcAsync: 回调函数. function onload(xmlDoc, isError){ ... }
        xml_loadFile : function(xmlUrl, funcAsync) {
            var xmlDoc = null;
            var isChrome = false;
            var asyncIs = (null != funcAsync); // 是否是异步加载。当funcAsync不为空时，使用异步加载，否则是同步加载。

            // 检查参数
            if ("" == xmlUrl)
                return null;
            if (asyncIs) {
                if ("function" != typeof(funcAsync))
                    return null;
            }

            // 创建XML对象
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); // Support IE
            } catch (ex) {}
            if (null == xmlDoc) {
                try {
                    // Support Firefox, Mozilla, Opera, etc
                    xmlDoc = document.implementation.createDocument("", "", null); // 创建一个空的 XML 文档对象。
                } catch (ex) {}
            }
            if (null == xmlDoc)
                return null;

            // 加载XML文档
            xmlDoc.async = asyncIs;
            if (asyncIs) {
                if (window.ActiveXObject) {
                    xmlDoc.onreadystatechange = function () {
                        if (xmlDoc.readyState == 4) {
                            var isError = false;
                            if (null != xmlDoc.parseError) {
                                isError = (0 != xmlDoc.parseError.errorCode); // 0成功, 非0失败。
                            }
                            funcAsync(xmlDoc, isError);
                        }
                    }
                } else {
                    xmlDoc.onload = function () {
                        funcAsync(xmlDoc, false);
                    }
                }
            }
            try {
                xmlDoc.load(xmlUrl);
            } catch (ex) {
                // alert(ex.message)    // 如果浏览器是Chrome，则会catch这个异常：Object # (a Document) has no method "load"
                isChrome = true;
                xmlDoc = null;
            }
            if (isChrome) {
                var xhr = new XMLHttpRequest();
                if (asyncIs) // 异步
                {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            funcAsync(xhr.responseXML, xhr.status != 200);
                        }
                    }
                    xhr.open("GET", xmlUrl, true);
                    try // 异步模式下，由回调函数处理错误。
                    {
                        xhr.send(null);
                    } catch (ex) {
                        funcAsync(null, true);
                        return null;
                    }
                    return xhr; // 注意：返回的是XMLHttpRequest。建议异步模式下仅用null测试返回值。
                } else // 同步
                {
                    xhr.open("GET", xmlUrl, false);
                    xhr.send(null); // 同步模式下，由调用者处理异常
                    xmlDoc = xhr.responseXML;
                }
            }
            return xmlDoc;
        },
        
        // 使用XSLT把XML文档转换为一个字符串。
        xml_transformNode : function(xmlDoc, xslDoc) {
            if (null == xmlDoc)
                return "";
            if (null == xslDoc)
                return "";

            if (window.ActiveXObject) // IE
            {
                return xmlDoc.transformNode(xslDoc);
            } else // FireFox, Chrome
            {
                //定义XSLTProcesor对象
                var xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xslDoc);
                // transformToDocument方式
                var result = xsltProcessor.transformToDocument(xmlDoc);
                var xmls = new XMLSerializer();
                var rt = xmls.serializeToString(result);
                return rt;
            }
        },
        
        // 得到节点的文本
        xml_text : function(xmlNode) {
            if (null == xmlNode)
                return "";
            var rt;
            if (window.ActiveXObject) // IE
            {
                rt = xmlNode.text;
            } else {
                // FireFox, Chrome, ...
                rt = xmlNode.textContent;
            }
            if (null == rt)
                rt = xmlNode.nodeValue; // XML DOM
            return rt;
        }
       
	});		
	return readsvg;
});