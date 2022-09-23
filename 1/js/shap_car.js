window.onload = function() {
	//获取所有的input标签
	var inputs = document.getElementById("cart").getElementsByTagName("input");
	//定义全选框
	var checkAll = null;
	//对所有的input标签进行循环遍历
	for(var i = 0; i < inputs.length; i++) {
		//如果当前input的name属性为all那份这个是全选标签
		if(inputs[i].getAttribute("name") == "all") {
			//全选按钮点击
			//e指向当前所发生的事件
			//e.target它永远是直接接收事件的目标DOM元素
			inputs[i].onclick = function(e) {
				//遍历所有name为id的多选框
				for(var j = 0; j < inputs.length; j++) {
					if(inputs[j].getAttribute("name") == "id") {
						//使多选框的选择情况和全选框相同
						inputs[j].checked = e.target.checked;
					}
				}
				//计算总金额的方法
				calculate();
			}
			checkAll = inputs[i];
		}
		//如果当前input的name属性为id那么这个是多选标签
		if(inputs[i].getAttribute("name") == "id") {
			//多选框的点击事件
			inputs[i].onclick = function() {
				var count = 0; //保存多选框未被选中的数量
				//遍历所有name为id的多选框
				for(var j = 0; j < inputs.length; j++) {
					if(inputs[j].getAttribute("name") == "id") {
						count++; //遇见点选框加1
						if(inputs[j].checked) { //判断该多选框是否被选中
							count--; //如果被选中数量减1
						}
					}
				}
				if(count == 0) { //如果所有多选框都被选中
					checkAll.checked = true; //全选框被选中
				} else {
					checkAll.checked = false;
				}
				//计算总金额
				calculate();
			}
		}
		/*
		 * 减少购买数量
		 */
		if(inputs[i].getAttribute("name") == "minus") { //找到减号
			inputs[i].onclick = function(e) { //点击减号
				var countInput = e.target.nextElementSibling; //获取点击的标签的下一个兄弟元素
				var count = parseInt(countInput.value); //将数量解析为int类型的
				if(isNaN(count)) { //判断是不是数字
					count = 1;
				}
				if(count > 1) {
					--count;
					countInput.value = count;
				}
				calculate();
			};
		}
		/*
		 * 增加购买数量
		 */
		if(inputs[i].getAttribute("name") == "plus") {
			inputs[i].onclick = function(e) {
				var countInput = e.target.previousElementSibling;
				var count = parseInt(countInput.value);
				if(isNaN(count)) {
					count = 1;
				}
				++count;
				countInput.value = count;
				calculate();
			};
		}
		/*
		 * 手动输入数量
		 */
		if(inputs[i].getAttribute("name") == "count") {
			inputs[i].onblur = function(e) { //当失去焦点时
				var count = parseInt(e.target.value);
				console.log(count);
				if(isNaN(count) || count < 1) {
					count = 1;
				}
				//console.log(count)
				e.target.value = count;
				calculate();
			};
		}
		/*
		 * 删除商品
		 */
		document.getElementById("cart-delete").onclick = function(e) {
			var goodsList = document.getElementById("cart-goods-list"); //商品列表
			var deleteTr = []; //定义一个数组，用来储存要删除的tr标签
			for(var i = 0; i < inputs.length; i++) {
				if(inputs[i].name == "all") {
					inputs[i].checked = false; //点击删除 全选矿处于未被选中状态
				}
				if(inputs[i].name == "id" && inputs[i].checked) {
					deleteTr.push(inputs[i].parentElement.parentElement); //寻找单选框的父元素的父元素
				}
			}
			for(var j = 0; j < deleteTr.length; j++) {
				goodsList.removeChild(deleteTr[j]); //移出tbody里面的子元素tr
			}
			calculate();
		};
		//calculate();
	}
	/*
	 * 计算商品金额
	 */
	function calculate() {
		var totalAmountEm = document.getElementById("total-amount")
			.getElementsByTagName("em")[0]; //查找代表合计金额的标签
		var totalAmount = 0.0; //定义总金额
		var goodsList = document.getElementById("cart-goods-list"); //查找id为cart-goods-list的元素
		var goodsListTr = goodsList.getElementsByTagName("tr");
		for(var i = 0; i < goodsListTr.length; i++) { //循环遍历tr
			var priceEm = goodsListTr[i]
				.getElementsByClassName("price")[0]
				.getElementsByTagName("em")[0]; //查找代表单价的标签
			var price = parseFloat(priceEm.innerHTML);
			if(isNaN(price)) {
				price = 0.00;
			}
			var countInput = goodsListTr[i]
				.getElementsByClassName("combo-value")[0]; //查找代表数量的标签
			var count = parseInt(countInput.value);
			if(isNaN(count)) {
				count = 1;
			}
			var amountEm = goodsListTr[i]
				.getElementsByClassName("amount")[0]
				.getElementsByTagName("em")[0]; //查找代表价格的标签
			var amount = price * count;
			amountEm.innerHTML = amount.toFixed(2); //在标签里面插入内容，金额保留两位小数
			var idInput = goodsListTr[i]
				.getElementsByTagName("td")[0]
				.getElementsByTagName("input")[0]; //查找单选框所在的标签
			if(idInput.checked) {
				totalAmount += amount;
			}
		}
		totalAmountEm.innerHTML = totalAmount.toFixed(2); //在标签里面插入内容，金额保留两位小数
	}
}