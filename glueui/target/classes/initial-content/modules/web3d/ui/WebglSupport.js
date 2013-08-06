/*
	该js用于判断浏览器是否支持webgl通过Detector.js来判断，如果不支持，给出相应提示，并且告知用户安装插件
	目前只有ie浏览器的早期版本不支持，所以分支语句中只有一个关于ie浏览器的判断，如果其他浏览器需要，也可以进一步扩展代码。
*/

function WebglSupport(){
	/*if ( ! Detector.webgl ) 
	//Detector.addGetWebGLMessage();
	{
		//判断显卡是否支持
		if(window.WebGLRenderingContext){
			showWebGLMessage("对不起，您的显卡不支持播放!");
			return;
		}
		//判断浏览器是否是ie浏览器			
		if(window.ActiveXObject)
			showWebGLMessage("对不起，您的浏览器不支持播放!需安装Chrome Frame插件，请点击<a style=\"color:#f00;\" href='#' onclick='installGCF()'>这里</a>进行安装");
	}*/
       CFInstall.check({mode: "inline", // the default
			node: "prompt",
			url:"/index.gcfInstall.html",
			cssText:"width:400px;height:70px;position:relative;margin:100px 0px 0px -200px;"});
}
			
function showWebGLMessage(message){
	var element = document.createElement( 'div' );
	element.id = 'webgl-error-message';
	element.style.fontFamily = 'monospace';
	element.style.fontSize = '13px';
	element.style.fontWeight = 'normal';
	element.style.textAlign = 'center';
	element.style.background = '#fff';
	element.style.color = '#000';
	element.style.padding = '1.5em';
	element.style.width = '400px';
	element.style.margin = '5em auto 0';
				
	element.innerHTML = message ;
				
	document.body.appendChild( element );
}


function installGCF(){
	// document.body.innerHTML = '<iframe src="http://www.google.com/chromeframe?quickenable=true" height="100%" width="100%" margin="0" padding="0" border="0"  frameborder=”no” scrolling=”no”></iframe>';
	/*document.body.innerHTML = '<iframe name="iframe" src="http://www.google.com/chromeframe/eula.html?quickenable=true" height="100%" width="100%" margin="0" padding="0" border="0"  frameborder=”no” scrolling=”no”></iframe>';
	document.body.iframe.window.location.reload();*/
	window.open("/libs/GoogleChromeframeStandaloneEnterprise.msi");
	var element = document.getElementById("webgl-error-message");
	element.innerHTML = "等待安装完成...请在安装完成后请重启浏览器，请点击<a style=\"color:#f00;\" href='#' onclick='closeWindow()'>这里</a>复制和关闭浏览器！";
	/*
	setInterval(function(){
		if ( Detector.webgl ) {
			window.location.reload();
			return ;
		}
	},1000);
	*/
}