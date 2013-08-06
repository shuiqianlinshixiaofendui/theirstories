/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
*/	
	var flag1=false;
	var flag2=false;
	//第一个表的修改状态
	function update1(){		
		$("#contactInfo input").attr("style","display:block");
		$("#contactInfo strong").attr("style","display:none");
		var strongs=$("#contactInfo strong");		
		var inputs=$("#contactInfo input");
		for(var i=0;i<strongs.length;i++){
			var info=strongs[i].innerHTML;
			inputs[i].value=info;
		}
		$("#butt").removeClass("none");
		flag1=true;
	}
	//取消修改
	function cancel1(){
		$("#contactInfo input").attr("style","display:none");
		$("#contactInfo strong").attr("style","display:block");
		flag1=false;
		if(flag1==false && flag2==false){
			$("#butt").addClass("none");
		}
	}
	
	//第二个表的修改状态
	function update2(){		
		$("#baseInfo input").attr("style","display:inline-block");
		//$("#baseInfo label").attr("style","display:inline-block");
		$("#baseInfo strong").attr("style","display:none");
		var strongs=$("#baseInfo strong");		
		var inputs=$("#baseInfo input");
		for(var i=0;i<strongs.length;i++){
			var info=strongs[i].innerHTML;
			inputs[i].value=info;
		}
		var txt=$("#txtSign").html();
		$("#txtSign").attr("style","display:none");
		$("#txtContent").html(txt);
		$("#txtContent").attr("style","display:block");
		$("#butt").removeClass("none");
		flag2=true;
	}
	//取消修改
	function cancel2(){
		$("#baseInfo input").attr("style","display:none");
		//$("#baseInfo label").attr("style","display:none");
		$("#baseInfo strong").attr("style","display:block");
		$("#txtSign").attr("style","display:block");
		$("#txtContent").attr("style","display:none");
		$("#tip").addClass("none");
		flag2=false;
		if(flag1==false&&flag2==false){
			$("#butt").addClass("none");
		}
	}
	//left menu
	$(function(){
		var tmp=0;
		$("#management span").click(function(){			
			tmp+=1;
			if(tmp%2!=0){
				$("#img").removeClass("opened");
				$("#img").addClass("closed");
				$("#management ul").removeClass("clearfix");
				$("#management ul").addClass("none");
			}else{
				$("#management i").removeClass("closed");
				$("#management i").addClass("opened");
				$("#management ul").removeClass("none");
				$("#management ul").addClass("clearfix");
			}
		});
		var b=$("#list li");	
		var h=$("form");			
		for(var i=0;i<b.length;i++){
			b[i].index=i;
			b[i].onclick=function(){
				var j=this.index;					
				for(var n=0;n<b.length;n++){
					h[n].className="none";
					b[n].className=""
				}
				b[j].className="open";
				h[j].className="clearfix"
			}
		}
		
		$("#txtContent").click(function(){
			$(this).next("span").removeClass("none");
			$(this).next("span").addClass("fgrey");
		});
		
		$("#pwdSubmit").click(function(){			
			var newPwd=$("#new_pwd").val();
			var r_newPwd=$("#r_new_pwd").val();
			if(r_newPwd!=newPwd){
				Spolo.notify({
					"text" : "请核实新密码！",
					"type" : "error",
					"timeout" : 1000
				});
				//return false;
			}else if(r_newPwd==""){
				Spolo.notify({
					"text" : "请输入新密码！",
					"type" : "error",
					"timeout" : 1000
				});
			}else{
				Spolo.notify({
					"text" : "修改成功！",
					"type" : "success",
					"timeout" : 1000
				});
				return true;
			}
			return false;
		});
	})

	