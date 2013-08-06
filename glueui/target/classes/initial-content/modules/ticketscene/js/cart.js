/* require(["dojo/cookie"],function(cookie){
	//购物车的cookie 名称为 modelCart
	var modelCart = {
		
	}
	
	
}); */

/*function Cart(totalNumber,totalPrice){
	this.totalNumber = totalNumber;
	this.totalPrice = totalPrice;
}*/

//cookie中的购物车json数据，缓冲到全局变量中
var modelCart;
$(document).ready(function(){
	

	var id = 1;
	// $("p").click(function(){
	// $(this).hide();
	// });
	
	
	initCartPage();
	

	
	/* var modelexample = new Object();
	modelexample.modelName = "卫生纸";
	modelexample.modelPrice = 10.5;
	modelexample.modelNumber = 2; 
	modelexample.modelPic = "http://localhost:8080/apps/page/image/logo.jpg";
	addModelToCart(modelexample);
	addModelToCart(modelexample); */
});
//初始化购物车页面
function initCartPage(){
	modelCart = {
		sceneName:"场景名称",
		ticket:{
			sceneName:"场景名称",
			items:[
				/*var uuid = UUIDjs.create():{
					id:UUIDjs.create(),
					modelName : "卫生纸",
					modelPrice : 19.1,
					modelNumber : 10,
					modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
				},
				{
					id:UUIDjs.create(),
					modelName : "卫生纸",
					modelPrice : 19.1,
					modelNumber : 10,
					modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
				},
				{
					id:
					modelName : "卫生纸",
					modelPrice : 19.1,
					modelNumber : 10,
					modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
				},
				{
					id:UUIDjs.create(),
					modelName : "卫生纸",
					modelPrice : 19.1,
					modelNumber : 10,
					modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
				}*/
			]
		}
		
	};
	require(["ticketscene/js/cartCookie"],function(cartCookie){
		/*cartCookie.DelCookie("cart");
		for(var i=1;i<10;i++){
			var uuid = UUIDjs.create();
			var model = {
				//id:uuid.hex,
				modelName : "卫生纸",
				modelPrice : 19.1,
				modelNumber : 10,
				modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
			};
			//往cookie里存几个模型
			//cartCookie.addModelToCookie(model);
			cartCookie.setCookie("cart",model);
		}	
		for(var i=1;i<10;i++){
			var uuid = UUIDjs.create();
			var model = {
				//id:uuid.hex,
				modelName : "笔记本",
				modelPrice : 19.1,
				modelNumber : 1,
				modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
			};
			//往cookie里存几个模型
			//cartCookie.addModelToCookie(model);
			cartCookie.setCookie("cart",model);
		}*/
		
		//取出cookie
		var cartArray = cartCookie.getCookiea("cart");
		console.log(cartArray);
		for(var index in cartArray){
			var uuid = cartArray[index].id;
			modelCart.ticket.items[uuid]=cartArray[index];
		}
	})
	/*for(var i=1;i<10;i++){
		var uuid = UUIDjs.create();
		modelCart.ticket.items[uuid]={
			id:uuid.hex,
			modelName : "卫生纸",
			modelPrice : 19.1,
			modelNumber : 10,
			modelPic : "http://localhost:8080/apps/page/image/logo.jpg"
		};
	}*/
	console.log(modelCart);
	//初始化模型列表
	addModelsToChart(modelCart);
	updateCartPage(modelCart);
	
	
}
function updateCartPage(modelCart){
	setTimeout(function(){
		
		//模型总数
		setTotalNumber(getTotalNumber(modelCart));
		//模型总价
		setTotalPrice(getTotalPrice(modelCart));
	},0);
}

	function addModelsToChart(modelCart){
		//首先获取购物车的cookie
		
		//获取模型数组
		var modelArray;
		modelArray = modelCart.ticket.items;
		//遍历模型数组
		for(var index in modelArray){
			var model = modelArray[index];
			addModelToCart(model);
		}
		
	}
	function getTotalNumber(modelCart){
		var totalNumber=0;
		//获取模型数组
		var modelArray;
		modelArray = modelCart.ticket.items;
		//遍历模型数组
		for(var index in modelArray){
			var model = modelArray[index];
			totalNumber += parseInt(model.modelNumber);
		}
		return totalNumber;
	}
	
	function setTotalNumber(totalNumber){
		$("#totalNumber").text(totalNumber);
	}
	
	function getTotalPrice(modelCart){
		var totalPrice=0;
		//获取模型数组
		var modelArray;
		modelArray = modelCart.ticket.items;
		//遍历模型数组
		for(var index in modelArray){
			var model = modelArray[index];
			//计算总价
			totalPrice += parseInt(model.modelNumber)*parseFloat(model.modelPrice);
			
		}
		//对价格做格式化处理
		totalPrice = Math.ceil(totalPrice*10)/10;
		return totalPrice;
	}
	function setTotalPrice(totalPrice){
		$("#totalPrice").text(totalPrice);
		$(".shoppingSubTotalTop").children("ul").children("li").children("span").text("￥"+totalPrice);
		$(".shoppingSubTotalBottom .total .font_red").text("￥"+totalPrice);
	}
	
  
	//一个模型就会在购物车上增加一条数据
	/** 
	 *模型名
	 *价格
     *数量
	 *变更数量 
	 **/
	function addModelToCart(model){
		//根据模型对象，向购物车上添加dom节点
					
					var item = "<tr>"

									+"<td style='padding:2px;'>"

										+"<table width='950' border='0' cellspacing='0' cellpadding='0' class='shoppingTabBody'>"

											+"<tr>"

												+"<td class='Identity' style='display:none' Identity="+model.id+">"+model.modelName+"</td>"

												+"<td class='pic'>"

													+"<a href='http://www.redbaby.com.cn/yingyangfs/11101041002100.html' target='_blank'>"

														+"<img src='"+model.modelPic+"'>"

													+"</a>"

												+"</td>"

												+"<td class='info'>"

													+"<div class='name'>"

														+"<span>[特价]</span>"

														+"<a href='http://www.redbaby.com.cn/yingyangfs/11101041002100.html' target='_blank' class='font_blue'>"+model.modelName+"</a>"

													+"</div>"

												+"</td>"

												+"<td class='price font_red'>￥"+model.modelPrice+"</td>"

												+"<td class='amount'>"

													+"<span><img id='QImg1_0_0_0_1002100' onclick=\"fShopCart_editNum('-',this);\" src='http://img01.bgoimg.com/core/app/theme/skin/image/front/shoppingCart_Less.gif'></span>"

													+"<input type='text' onchange=\"fShopCart_editNum('',this);\" onkeydown=\"fShopCart_enterNum(event,this);\" value='"+model.modelNumber+"' resetValue='"+model.modelNumber+"' size='3' id='Qty_0_0_0_1002100'>"

													+"<span><img id='QImg1_0_0_0_1002100' onclick=\"fShopCart_editNum('+',this);\" src='http://img01.bgoimg.com/core/app/theme/skin/image/front/shoppingCart_Add.gif'></span>"

													+"<input type='hidden' value='"+model.modelNumber+"' id='Qty_hidden_0_0_0_1002100'>"

												+"</td>"

												+"<td class='subtotal'>￥"+(model.modelPrice*model.modelNumber)+"</td>"

												+"<td class='icon'>"

													+"&nbsp;"

												+"</td>"

												+"<td class='operation'><a href='javascript:void(0)' id='Del_0_0_0_1002100' onclick=\"fShopCart_delRev('delete',this);\" class='font_blue'>删除</a></td>"

											+"</tr>"

										+"</table>"

									+"</td>"

								  +"</tr>";
		$("#cartGrid tr:first").after(item);
		
	}
	//当点击减号，物品数量减一。
	//当点击加号，物品数量加一。
	function fShopCart_editNum(oper,pthis){
		var min =1;
		var max = 20;
		var uuid = "";
		
		var input = $(pthis);
		if(oper=="-"){
			input = $(pthis).parent().next("input");
			Identity = $(pthis).parent().parent().parent().children("td[class='Identity']");
			uuid = $(Identity).attr("Identity");
			var number = input.val();
			if(number<=min){
				input.val(min);
				input.attr("resetValue",min);
				Spolo.notify({
					"text" : "模型数量不能少于1!!!",
					"type" : "error",
					"timeout" : 1000
				});
			}else{
				input.val(number-1);
				input.attr("resetValue",number-1);
				modelCart.ticket.items[uuid].modelNumber = number-1;
			}
		}else if(oper=="+"){
			input = $(pthis).parent().prev("input");
			Identity = $(pthis).parent().parent().parent().children("td[class='Identity']");
			uuid = $(Identity).attr("Identity");
			var number = input.val();
			if(number>=max){
				input.val(max);
				input.attr("resetValue",max);
				Spolo.notify({
					"text" : "模型数量不能超过20!!!",
					"type" : "error",
					"timeout" : 1000
				});
			}else{
				input.val(parseInt(number)+1);
				input.attr("resetValue",parseInt(number)+1);
				modelCart.ticket.items[uuid].modelNumber = parseInt(number)+1;
			}
		}else{
			input = $(pthis);
			Identity = $(pthis).parent().parent().children("td[class='Identity']");
			uuid = $(Identity).attr("Identity");
			//var number = parseInt(input.val());
			var number = input.val();
			if(!isNaN(number)){
				if(number<min){
					input.val(min);
					input.attr("resetValue",min);
					Spolo.notify({
						"text" : "模型数量不能少于1!!!",
						"type" : "error",
						"timeout" : 1000
					});
				}else if(min<number && number<max){
					input.val(number);
					input.attr("resetValue",number);
					modelCart.ticket.items[uuid].modelNumber = number;
				}else if(number>max){
					input.val(max);
					input.attr("resetValue",max);
					Spolo.notify({
						"text" : "模型数量不能超过20!!!",
						"type" : "error",
						"timeout" : 1000
					});
				}
			}else{
				input.val(input.attr("resetValue"));
				Spolo.notify({
					"text" : "请输入数字！",
					"type" : "error",
					"timeout" : 1000
				});
			}
			
		}
		//改变当前模型的总价
		setOneTypeTotalPrice(input);
		updateCartPage(modelCart);
	}
	//检测用户输入的是否是数字
	function fShopCart_enterNum(event,pthis){
		/*var input = $(pthis);
		var number = input.val();
		var resetnumber = input.attr("resetValue");
		
		e = event.keyCode;
		if (e == 13 || e == 32) {
			$(pthis).blur();
			sleepId = setInterval("fShopCart_Sleep()", 1000)
		}*/
	}
	//改变当前模型的总价
	function setOneTypeTotalPrice(input){
		//得到总数量
		var number = parseInt(input.val());
		//得到单价
		var tdPrice = input.parents(".amount").prev(".price");
		var price = tdPrice.text();
		price = parseFloat(price.substr(price.indexOf("￥")+1));
		//计算总价
		var totalPrice = number*price;
		//对价格做格式化处理
		totalPrice = Math.ceil(totalPrice*10)/10;
		//得到存放地址
		var totalPlace = input.parents(".amount").next(".subtotal");
		totalPlace.text("￥"+totalPrice);
	}
	//删除当前模型
	function fShopCart_delRev(event,pthis){
		if(event="delete"){
			var beDelete = $(pthis).parent().parent().parent().parent().parent();
			$(beDelete).remove();
		}
	}