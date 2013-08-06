/*
* 获取url参数，返回json格式。
* 
* {key1:value,key:value}
* ?mdid=128&mpvid=12801&fpvid=12802&bid=12606&id=103&frid=103#123
* {mdid:128,mpvid:12801,fpvid:12802,bid:12606,id:103,frid:103,WellNo:123}
*/

jQuery.extend({
    getParameter: function () {
        var url = location.href;
        //判断有没有参数
        if (url.indexOf("?") == -1) {
            return {};
        }
        
        var paraString = url.substring(url.indexOf("?") + 1, url.length);
        var arrPara = paraString.split('#');
        paraString = arrPara[0];

        paraString = paraString.replace(/=/g, ":'");
        paraString = paraString.replace(/&/g, "',");

        paraString = paraString.replace(/%22/g, "\"");

        if (arrPara.length == 2)
            paraString += ",WellNo:" + arrPara[1];

        var param = eval("({" + paraString + "'})");

        return param;
    }
});

//ajax的方式，获取记录集，不缓存数据
jQuery.extend({
    ajaxData : {
        data: "",
        title: "",
        success: function () {},
        debug : function () { }
    },
    ajaxGetData: function (ajaxData) {
        $.ajax({
            type: "GET",
            dataType: "json",
            cache: false,
            url: "/JsonServer/GetData.ashx",
            data: ajaxData.data,
            //timeout: 2000,
            error: function() {
                alert("获取" + ajaxData.title + "的时候发生错误！");
            },

            success: function(msg) {
                if (typeof (ajaxData.debug) != "undefined")
                    ajaxData.debug(msg);
                ajaxData.success(msg);

            }
        });
    }
});

//ajax的方式获取元数据，利用自带缓存
jQuery.extend({
     ajaxMeta : {
        data:"",
        title: "",
        success: function () {},
        debug: function () { }
    },
    ajaxGetMeta: function (ajaxMeta) {
        $.ajax({
            type: "GET",
            dataType: "json",
            cache: true,
            url: "/JsonServer/GetMeta.ashx",     //math.random()
            data: ajaxMeta.data,
            //timeout: 2000,
            error: function () {
                alert("获取" + ajaxMeta.title + "的时候发生错误！");
            },

            success: function (msg) {
                //alert(msg);
                if (typeof (ajaxMeta.debug) != "undefined")
                    ajaxMeta.debug(msg);
                ajaxMeta.success(msg);
            }
        });
    }
});

/*获取div中最大的 z-index */
jQuery.extend({
    getDivIndexHighest: function () {
        var indexMax = 0;
        $("div").each(function () {
            var tmp = $(this).css("z-index");
            if (tmp != "auto")
                if (indexMax < tmp * 1)
                    indexMax = tmp * 1;
        });

        return indexMax;
    }
});

// plugin author :  chenjinfa@gmail.com
// plugin name : $.include
//     $.include('file/ajaxa.js');$.include('file/ajaxa.css');
//  or $.includePath  = 'file/';$.include(['ajaxa.js','ajaxa.css']);
/*添加css和js*/
$.extend({
    includePath: '',
    include: function (file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    }
});