/**
 *  This file is part of the Glue(Superpolo Glue).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved. 
 *
 *  See http://glue.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://glue.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 *  
 *  author : wangxiaodong@3dly.net
 *  date   : 2013/6/20
 *  wiki   : http://glue.spolo.org/trac/glue/wiki/WebApplication/Widget
 *  description  : WaterFall Widget 主要以瀑布流形式，对图片进行逐步加载显示
 **/
 
define("widgets/WaterFall/main",
[
    "dojo/dom",
    "dojo/on",
	"dojo/_base/declare",
    "dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
    "dojo/text!./template/template.html",
    "dojo/dom-construct",
    "dojo/Evented",
	"dojo/dom-style",
	"dojo/_base/array"
],
function(
	dom,on,declare,WidgetBase,TemplatedMixin,template,domConstruct,Evented, domStyle, arrayUtil
)
{
    
    
    //  瀑布流算法
    function waterfall(){
        var wfArea = $(".waterfall_waterfall"); //显示区域名称
        var wfList = $(".waterfall_picList"); //内容区域名称
        var wfWidth = wfList.outerWidth(true); //获取内容区域实际宽度（含Margin和Padding的值）
 
        var wfArr = []; //创建数组，用来记录内容区域高度
        
		var computedStyle = domStyle.getComputedStyle(_this.waterfallWidget.parentNode);
     
        var outBorderWidth = parseFloat(computedStyle.width) // 根据 placeAt 的DIV宽度设置每行显示多少条数据
        var maxCol = Math.floor( outBorderWidth / wfWidth ); //窗口的宽度除以内容区域宽度，并且向下取整（得出每行能放多少列）
        for(var i = 0; i < wfList.length; i++) { //根据内容区域数量进行循环
            colHeight = wfList.eq(i).outerHeight(true); //获取每个内容区域的高度
        
            if( i < maxCol ){ //如果i小于maxCol，那就说明是在一行里面（例如每行有4列，那就是4个为一组）
                wfArr[i] = colHeight; //把每组内容区域的高度，放入到数组中
                wfList.eq(i).css("top",0); //第一行Li的默认Top值为0
                wfList.eq(i).css("left",i * wfWidth); //每个列的Left值就是当前列数*内容区域宽度
            }else{
                minHeight = Math.min.apply(null,wfArr); //获取数组中的最小值（也就是每行中，最小高度的那列）
                minCol = getArrayKey(wfArr, minHeight); //最小的值对应的指针
                wfArr[minCol] += colHeight; //加上新高度后更新高度值
                wfList.eq(i).css("top",minHeight); //先得到高度最小的Li，然后把接下来的li放到它的下面
                wfList.eq(i).css("left",minCol * wfWidth); //第i个列的左坐标就是i*列的宽度
            }
        };
        var wfLastLayerT = parseInt(wfList.last().css("top")); //最后一个元素的Top值
        var wfLastLayerH = wfList.last().outerHeight(true); //最后一个元素的高度
        var wfAreaH = wfLastLayerT + wfLastLayerH + "px"; //显示区域的高度为 最后一个元素的Top值+自身高度
        wfArea.css({ "width":wfWidth * maxCol,"height":wfAreaH }); //设置显示区域宽度和高度
        
            
        _this.loadDia.style.display = "none";
    }
    
    //使用for in运算返回数组中某一值的对应项数(比如算出最小的高度值是数组里面的第几个) 
    function getArrayKey(s, v){
        for( k in s ) {
            if( s[k] == v)  {
                return k;
            };
        };
    }
    
    // _this.pageLimit 每页限制个数 currentNum 当前页数
    function loadData(){
	        
		arrayUtil.forEach(_this.dataList, function(item){
		
            var id = item.id ;
            var img = item.img ;
           
            var dom1 = domConstruct.create("div", {className:"waterfall_picList",id:item.id,style:"margin-left:10px"},_this.waterfall);
           
            
            var dom2 = domConstruct.create("div", {className:"waterfall_shareIcon"},dom1);
            // var dom_del = domConstruct.create("img", {src:"/widgets/WaterFall/img/del.png",className:"waterfall_shareIcon_child",style : "display:"+_this.delButDis},dom2);
            var dom3 = domConstruct.create("div", {className:"waterfall_picThumbnail"},dom1);
            var dom4 = domConstruct.create("a", {className:"waterfall_picture"},dom3);
            var dom5 = domConstruct.create("img", {src:img},dom4);
            
            // 点击删除按钮发出事件
            // on(dom_del,"click",function(){
                // _this.delId = id;
                // _this.emit("delPic",id);
            // });
            
            on(dom5,"click",function(){
                _this.emit("picClick",id);
            });
            
            var dom6 = domConstruct.create("div", {className:"waterfall_picDescription"},dom1);
            
            var jsonLength = Object.keys(item.fields).length;
            for(var j in item.fields){
                if(jsonLength <= 3){          
                    var innerHtmlText = j + "：" + item.fields[j];
                     // if(innerHtmlText.length > 20){
                         // innerHtmlText = innerHtmlText.substring(0,20) + "...";
                     // }
                 
                    var dom = domConstruct.create(
                        "p",
                        {
                            innerHTML : innerHtmlText,
                            style : "white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"
                        },
                        dom6
                    );
                    
                    
                } else{
                    console.log("  WaterFall Widget Error : 图片描述显示条目数超过3个，已经被屏蔽")
                }
                
            }
            
            
            // 添加下载按钮
            var itemLength = Object.keys(item).length;
            
            if(itemLength > 3){
                var dom_button = domConstruct.create(
                    "p",
                    {
                        innerHTML : item.button,
                        style : "white-space:nowrap;text-overflow:ellipsis;overflow:hidden;color:red;cursor:pointer;"
                    },
                    dom6
                );
                
                on(dom_button,"click",function(){
                    _this.emit("sourceDownload",id);
                });
            
            }
            
           
       
        });
      
        setTimeout(function() {
            // Call it
            waterfall();
            
            _this.total.value = " /" + _this.totalPage; // 设置当前总页数
           
        
        }, 500);
        
    }
    
   
    window.onresize = function() { waterfall(); }; //当窗口改变时，执行函数
  
    
    
    $backToTopFun = function() {
        var st = $(document).scrollTop(), winh = $(window).height();
        var placeAtId = _this.waterfallWidget.parentNode.id;
        var relativeTop = $("#" + placeAtId).offset().top;
        (st > relativeTop)? _this.waterfall_backToTop.style.display="block": _this.waterfall_backToTop.style.display="none";
        
        //IE6下的定位
        if (!window.XMLHttpRequest) {
            $backToTopEle.css("top", st + winh - 166);
        }

    };
    $(window).bind("scroll", $backToTopFun);
    $(function() { 
        $backToTopFun();
        on(_this.waterfall_backToTop,"click",function(){
            _this.currentNum = 1;
            _this.inputContext.value = _this.currentNum;
            _this.waterfall_backToTop.style.display="none"
            $("html, body").animate({ scrollTop: 0 }, 120);
        })
      }
    );
    
    
    $(window).scroll(function (evt) { //滚动到底部时加载
       
        var wfLoadArea = 50; //为了更直观，这里加个变量。目的在于这里的参数，表示滚动条距离底部还有多少像素的时候加载
        var placeAtId = _this.waterfallWidget.parentNode.id;
        var relativeTop = $("#" + placeAtId).offset().top;
        
        if( $(document).scrollTop() + $(window).height() >= $(document).height() - wfLoadArea ){
            if(_this.currentNum < _this.totalPage){
                
                for(var i=0;i<_this.loadPageNumList.length;i++){
                    if(_this.currentNum == _this.loadPageNumList[i]){
                        _this.loadPageFlag = true;
                    }
                }
                if(!_this.loadPageFlag){
                    _this.emit("loadingData", _this.currentNum);
                    _this.loadDia.style.display = "block";
                    _this.loadPageNumList.push(_this.currentNum);
                }else{
                    _this.loadPageFlag = false;
                }
                
            }else{
                console.log("  WaterFall Widget Error : 当前页数已经超过总页数 ");
            }
        }    
        /**
            计算当前页数
        */
        
        var wfList = $(".waterfall_picList"); //内容区域名称
        var wfHeight = wfList.outerHeight(true); // 获取每张图片的固定高度
        var pageHeight = wfHeight * 3; // 每页高度
        var sh = $(document).scrollTop() - relativeTop; // 获取下拉条高度
        var cn = Math.floor(sh/pageHeight); 
        if(cn < 0){
            cn = 0;
        }
        _this.currentNum = cn + 1;
        _this.inputContext.value = _this.currentNum;
        
        setDisplay();
        
    });
    // setScrollTop 设置滚动条跳转，接收当前跳转页数，直接跳转
    function setScrollTop(args){
      
         /**
            如果翻页翻到没有加载的部分时，才控制图片加载，如果已经加载的图片，就不在加载了
            当前，通过位置信息进行的校验，如果position的位置大于当前已经加载所有图片的高度，则继续加载图片，否则不加载
        */
        var relativeTop = $("#model_list").offset().top;
        _this.currentNum = args;
        var wfList = $(".waterfall_picList"); //内容区域名称
        var wfHeight = wfList.outerHeight(true); // 获取每张图片的固定高度
        var pageHeight = wfHeight * 3; // 每页高度
        var position = args * pageHeight - pageHeight + relativeTop; //当前页数都是从1开始的，但是高度需要从0开始
        var wp = $(document).height() ;
      
        $("html, body").animate({ scrollTop: position }, 120);
        
        setDisplay();
        
    }
    
    function clickUp(){
        if(_this.currentNum > 0){
            _this.currentNum --;
            setScrollTop(_this.currentNum);
        }
    }
    
    function clickDown(){
        if(_this.currentNum < _this.totalPage ){
            _this.currentNum ++;
            var needCount = _this.currentNum * _this.pageLimit;
            if(needCount > _this.waterfall.childElementCount){
                var json = {
                    start : _this.waterfall.childElementCount + 1,
                    amount : needCount - _this.waterfall.childElementCount
                }
                _this.emit("loadPic",json);
            }else{
                setScrollTop(_this.currentNum);
            }
        }
    }
    
    function setDisplay(){
        var ph = $(".waterfall_picList");
        for(var i=0;i<ph.length;i++){
            var top = ph[i].style.top;
            var topPi = parseInt(top);
            var scrollHeight = $(document).scrollTop();
            var sceenHeight = $(window).height(); 
            if(topPi >= (scrollHeight-400) && topPi < (scrollHeight + sceenHeight) ){
                ph[i].style.display = "block";
            }else{
                ph[i].style.display = "block";
            }
            
        }
    }
    
    var main = declare([ WidgetBase, TemplatedMixin,Evented], {
        
        hrefURL : require.toUrl("widgets/WaterFall/css/style.css"), // 定义widget的css样式文件
        templateString : template, // widget模板
        _this : null, // 存储当前this对象
        
        
        constructor : function(){}, // 构造函数
        
        // 初始化函数，在初始化函数中，初始化widget的全局变量
        postCreate : function(){
            this.pageLimit = 15; // 限制每页显示15条数据
            this.currentNum = 1; // 当前页数
            this.totalPage = 1;  // 当前场景总页数 
            this.dataList = []; //  数据数组
            this.loadPageNumList = [0]; // 当前已经加载页数
            this.loadPageFlag = false ; // 当前页面是否已经加载 
            this.delId; // 需要删除的图片
            
            _this = this; // 记录this变量
		},
        

        /** 
            初始化数据,需要一个 Json List
            初始化数据时，当前只接受一部分数据。当然初始化数据给15条最好（每页显示15条数据）
        */
        initData : function(data,tp){
            _this.totalPage = tp;  // tp 数据总页数
            _this.dataList = data;
            // console error 
            if(data.length != 15 && tp != 1 ){
                console.log(" WaterFall Widget Error : 初始化数据不够15条 ");
            }
            loadData();
        },
        /**
            当翻页时，或者滚轮下滑时，emit一个事件，然后通addData方法，继续加载数据
            数据还是Json List
        */
        addData : function(data){
            // console error 
            if( data.length != 15 && _this.currentNum != _this.totalPage){
                 console.log(" WaterFall Widget Error : loadingData加载数据不够15条 ");
            }
            this.dataList = data;
            loadData();
        },
        
        receiveData : function(data,json){
            if(data.length != json.amount){
                console.log(" WaterFall Widget Error : 传入数据量不够 ");
            }
            this.dataList = data;
            loadData();
            setTimeout(function() {
                // Call it
                setScrollTop(_this.currentNum);
               
            }, 500);
            
        },
        
        deleteData : function(args,tp){
            
            // 根据 args 判断当前数据是否可以删除 args = true/false
            if(args){
                for(var i=0;i<_this.dataList.length;i++){
                    var item = _this.dataList[i];
                    if(item.id == _this.delId){
                        _this.dataList.pop(item);
                    }
                }
                console.log(dojo.byId(_this.delId+""));
                this.waterfall.removeChild(dojo.byId(_this.delId+""));
                _this.totalPage = tp;
                _this.total.value = " /" + _this.totalPage; // 设置当前总页数
                waterfall();
            }else{
                console.log(" WaterFall error : 暂时不能删除此数据 ");
            }
        },
        
		refreshData : function(data,tp){
			domConstruct.empty(_this.waterfall);
            // 刷新列表后，需要将所有的变量全部设置成初始化
            this.pageLimit = 15; // 限制每页显示15条数据
            this.currentNum = 1; // 当前页数
            this.totalPage = 1;  // 当前场景总页数 
            this.dataList = []; //  数据数组
            this.loadPageNumList = [0]; // 当前已经加载页数
            this.loadPageFlag = false ; // 当前页面是否已经加载 
            this.delId = null; // 需要删除的图片
            this.delButDis = "block";
            
            this.totalPage = tp;  // tp 数据总页数
			this.dataList = data;
            if(data.length != 15 && tp != 1 ){
                console.log(" WaterFall Widget Error : 初始化数据不够15条 ");
            }
			loadData();
		},
      
        clickUpEvent : function(){
            clickUp();
        },
        
        clickDownEvent : function(){
            clickDown();
        },
        
               
        onMouseOverEvent : function(){
            $(".waterfall_square_up").css("opacity","1");
            $(".waterfall_triangle_up").css("opacity","1");
            $(".waterfall_triangle_inline_up").css("opacity","1");
            $(".waterfall_square_down").css("opacity","1");
            $(".waterfall_triangle_down").css("opacity","1");
            $(".waterfall_triangle_inline_down").css("opacity","1");
            $(".waterfall_input_div").css("opacity","1");
            $(".waterfall_input_inline").css("opacity","1");
            
            $(".waterfall_inputContext").css("background-color","#444");
            $(".waterfall_total").css("background-color","#444");
            $(".waterfall_inputContext").css("color","white");
            $(".waterfall_total").css("color","white");
        },
        
        onMouseOutEvent : function(){
            $(".waterfall_square_up").css("opacity","0.1");
            $(".waterfall_triangle_up").css("opacity","0.1");
            $(".waterfall_triangle_inline_up").css("opacity","0.1");
            $(".waterfall_square_down").css("opacity","0.1");
            $(".waterfall_triangle_down").css("opacity","0.1");
            $(".waterfall_triangle_inline_down").css("opacity","0.1");
            $(".waterfall_input_div").css("opacity","0.1");
            
            $(".waterfall_inputContext").css("background-color","rgba(255, 255, 204, 0.1)");
            $(".waterfall_total").css("background-color","rgba(255, 255, 204, 0.1)");
            $(".waterfall_inputContext").css("color","black");
            $(".waterfall_total").css("color","black");
        },
        
        inputEvent : function(){
        
            var inputValue = _this.inputContext.value;
            
            // 对输入数据进行校验
            var reg = new RegExp("^[0-9]*$");
            var regFlag = reg.test(inputValue);
            if(!regFlag){
                _this.inputContext.value = 1;
                console.log("  WaterFall Widget Error : 请输入数字 ");
            }
            if(inputValue < _this.totalPage ){
                _this.currentNum = inputValue;
                var needCount = _this.currentNum * _this.pageLimit;
                if(needCount > _this.waterfall.childElementCount){
                    var json = {
                        start : _this.waterfall.childElementCount + 1,
                        amount : needCount - _this.waterfall.childElementCount
                    }
                    _this.recordJson = json;
                    _this.emit("loadPic",json);
                }else{
                    setScrollTop(_this.currentNum);
                }
            }else{
                _this.inputContext.value = 1;
                console.log("  WaterFall Widget Error : 当前页数已经超过总页数 ")
            }
            
        },

        // 设置删除按钮是否显示。默认如果不调用本方法，任何图片都是可以删除的。
        setDelButtonDisplay : function(args){
            var delList = $(".waterfall_shareIcon_child")
            for (var i = delList.length - 1; i >= 0; i--) {
                delList[i].style.display = args;
            };
            this.delButDis = args;
        }
       
        
                
	});
	
	return main;
});