##  jQuery 中的 DOM 操作

DOM 是 Document Object Model 的缩写，意思是文档对象模型。根据 W3C DOM 规范（http://www.w3.org/DOM），DOM 是一种与浏览器、平台、语言无关的接口，使用该接口可以轻松地访问页面中的所有标准组件。

###  jQuery 中的 DOM 操作

```html
 <p title="选择你喜欢的水果。">你喜欢的水果是？</p>
        <ul>
            <li title="苹果">苹果</li>
            <li title="橘子">橘子</li>
            <li title="菠萝">菠萝</li>
        </ul>
```

P75

####  查找节点

#####  查找元素节点

```javascript
var $li = $("ul li:eq(1)")	// 获取 <ul> 里第 2 个节点
var li_txt = $li.text()			// 获取第 2 个 <li> 元素节点的文本内容
alert(li_txt)
```

#####  查找属性节点

```javascript
var $para = $("p")
var p_txt = $para.attr("title")
console.log("$('p')..attr('title'): " + p_txt)
```

*记得在 DOM 模型里，属性也是节点，文本也是节点。*

####  创建节点

#####  创建元素节点

1. 创建两个 \<li> 新元素。
2. 将这两个新元素插入文档中。

第一个步骤可以用 jQuery 的工厂函数 $() 来完成，格式如下：

```javascript
$( html )
```

\$(html) 方法会根据传入的 HTML 标记字符串，创建一个 DOM 对象，并将这个对象包装成一个 jQuery 对象后返回。

*由于 \$(html) 工厂方法是传递 html 并解析，而返回的是一个 DOM 对象。故推测可以传入复杂 html 并返回对应带有层次结构的 DOM。*

```javascript
var $li_1 = $("<li></li>")
var $li_2 = $("<li></li>")
```

使用 jQuery 中的 append() 等方法将新元素插入文档中。

```javascript
$("ul").append($li_1)
$("ul").append($li_2)
```

> Caution:
>
> 1. 动态创建的新元素节点不会被自动添加到文档中，而是需要使用其他方法将其插入文档中。
> 2. 当创建单个元素时，要注意闭合标签和使用标准的 XHTML 格式。

#####  创建带文本节点的元素节点

```javascript
var $li_3 = $("<li>布拿拿</li>")
var $li_4 = $("<li>屁儿</li>")
$("ul").append($li_3)
$("ul").append($li_4)
```

**无论 \$(html) 中的 HTML 代码多么复杂，都可以使用相同的方法来创建。**P78

#####  创建属性节点

```javascript
var $li_5 = $("<li title='香蕉'>香蕉</li>")
var $li_6 = $("<li title='雪梨'>雪梨</li>")
$("ul").append($li_5)
$("ul").append($li_6)
```

####  插入节点

下面展示插入节点的八种方法，每种都可适用于隐性迭代的情形：

* append() 向每个匹配的元素内部追加内容 ┫▣↓
* appendTo() 将所有匹配的元素追加到指定的元素中┣▣↓
* prepend() 向每个匹配的元素内部前置内容 ┫▣↑
* prependTo() 将所有匹配的元素前置到指定的元素中┣▣↑
* after() 在每个匹配的元素后面插入内容 ┫◎↓
* insertAfter() 将所有匹配的元素插入到指定的元素后┣ ◎↓
* before() 在每个匹配的元素之前插入内容 ┫◎↑
* insertBefore() 将所有匹配的元素插入到指定的元素前面┣ ◎↑

*┫┣ 是二元操作符，隐藏操作数。左边是内容元素，右边是目标元素。┫是 1 -> N，┣ 是 N -> 1。*

*▣◎ 是描述符。▣ 代表添加到内部；◎ 代表添加到同层位置。*

*↓↑是描述符。↓是追加到尾部；↑是前置在头部。*

*八个方法实际是 2 x 2 x 2 的情况组合。*

这些插入节点的方法不仅能将新创建的 DOM 元素插入到文档中，也能对原有的 DOM 元素进行移动。

```javascript
// 演示元素插入
		var $li_7 = $("<li title='li_7'>li_7</li>")
		var $li_8 = $("<li title='li_8'>li_8</li>")
		var $li_9 = $("<li title='li_9'>li_9</li>")

		var $parent = $("ul")
		var $two_li = $("ul li:eq(1)")
		$parent.append($li_7)
		$parent.prepend($li_8)
		$li_9.insertAfter($two_li)

		// 移动节点
		var $one_li = $("ul li:eq(1)")
		var $two_li = $("ul li:eq(2)")
		$two_li.insertBefore($one_li)
```

*和原生 ECMAScript 一样，对文档中已存在的 DOM 元素操作的话，也会移动原来的元素。*

####  删除节点

jQuery 提供了三种删除节点的方法，即 remove()，detach() 和 empty()。P82

#####  remove() 方法

作用是从 DOM 中删除所有匹配的元素，传入的参数用于 jQuery 表达式筛选元素。

```javascript
$("ul li:eq(1)").remove()
```

当某个节点用 remove() 方法删除后，该节点所包含的所有后代节点将同时被删除。这个方法的返回值是一个指向已被删除的节点的引用，因此可以在以后再使用这些元素。

*attr() 方法可以获取或赋值属性。*

```javascipt
		// 演示元素删除
		var $deleteBtn = $("input[value=元素删除]")
		var $recovery = null
		$deleteBtn.click(function() {
			$toDelete = $("ul li:eq(0)")
			if ($recovery == null) {
				$recovery = $toDelete.remove()
			} else {
				$recovery.insertBefore($toDelete)
				$recovery = null
			}
		})
```

#####  detach() 方法

detach() 和 remove() 一样，从 DOM 中去掉所有匹配的元素。但它不会吧匹配元素从 jQuery 对象中删除，因而可以在将来再使用这些匹配的元素。

**与 remove() 不同的是，所有绑定的事件，附加的数据都会保留。**

*也就是说 remove() 会删除与其绑定的事件和附加的数据。*

```javascript
// 演示元素解绑
		var $toDetech = $("<input type='button' value='Click me and print one'/>")
		$toDetech.click (function() {
			console.log("One")
		})
		$("ul").append($toDetech)
		var $detachBtn = $("<input type='button' value='元素解绑'/>")
		var flag = true
		$detachBtn.click(function() {
			if (flag) {
				$toDetech.detach()
				flag = false
			} else {
				$("ul").append($toDetech)
				flag = true
			}
		})
		$("input:last").after($detachBtn)
```

#####  empty() 方法

empty() 方法是用于清空所有后代节点

```javascript
// 演示清空后代
		var $toEmpty = $("ul")
		var $children = $toEmpty.children()
		var $emptyBtn = $("<input type='button' value='清空后代'/>")
		var $emptyFlag = true
		$emptyBtn.click(function () {
			if ($emptyFlag) {
				$toEmpty.empty()
				$emptyFlag = false
			} else {
				$toEmpty.append($children)
				$emptyFlag = true
			}
		})
		$("input:last").after($emptyBtn)
```

####  复制节点

P84

复制节点是常用的 DOM 操作之一，例如拖拽商品。

使用 clone() 方法可以完成复制元素。

```javascript
$("ul li").click(function() {
	$(this).clone(true).appendTo("ul") // 复制当前单击的节点，并将它追加到 <ul> 元素中
})
```

*这里虽然完成了复制功能，但并未完成拖拽功能。*

复制节点后，被复制的新元素并不具备任何行为。如果需要新复制的元素也具备原元素的绑定事件，在 clone() 中传入参数 true。

####  替换节点

如果要替换某个节点，jQuery 提供了 replaceWith() 和 replaceAll()。

replaceWith() 方法的作用是将所有匹配的元素都替换成指定的 HTML 或 DOM 元素。

replaceAll() 方法则颠倒操作。

```javascript
		// 演示替换元素
		var event1 = function() {$("ul li:first").replaceWith("<li>这是第一个列表项</li>")}
		var event2 = function() {$("<li>这不是第一个列表项</li>").replaceAll("ul li:first")}
		var $replaceBtn1 = $("<input type='button' value='替换1'/>")
		var $replaceBtn2 = $("<input type='button' value='替换2'/>")
		$replaceBtn1.click(event1)
		$replaceBtn2.click(event2)
		$("input:last").after($replaceBtn1)
		$("input:last").after($replaceBtn2)
```

**如果在替换之前，已经为元素绑定事件，替换后原先绑定的事件将会与被替换的元素一起消失，需要在新元素上重新绑定事件。**

*也就是被换掉的元素的事件会消失。*

####  包裹节点

如果要将某个节点用其他标记包裹起来，jQuery 提供了相应的方法，即 wrap()。该方法对于需要在文档中插入额外的结构化标记非常有用，而且它不会破坏原始文档的语义。

*选择页面中的最后一个元素，即\<body\>中的最后一个元素：*

```css
*:last {}
```

```javascript
$("*:last").after("<h1>TITLE</h1>")
```

```javascript
		// 演示包裹元素
		var $p = $("<p>TITLE</p>")
		$("*:last").after($p)
		var $wrapBtn = $("<input type='button' value='wrap'>")
		$wrapBtn.click(function(){
			$("p").wrap("<b></b>")
		})
		$("input:last").after($wrapBtn)
```

#####  wrapAll() 方法

该方法会将所有匹配的元素用一个元素包裹。不同于 wrap() 方法，wrap() 方法是将所有的元素进行单独的包裹。

```javascript
		// 演示包裹所有元素
		var $wrapAllBtn = $("<input type='button' value='wrapAll'/>")
		$wrapAllBtn.click(function(){
			$("li").wrapAll("<b></b>")
		})
		$("input:last").after($wrapAllBtn)
```

> 如果被包裹的多个元素间有其它元素，其它元素会被放到包裹元素之后。

*也就是说会改变元素之间的顺序。*

#####  wrapInner() 方法

该方法将每一个匹配的元素的字内容（包括文本节点）用其它结构化的标记包裹起来。

```javascript
		// 演示内包裹
		var $wrapInnerExample = $("<div id='wrapInnerExample'><span><p>colemak</p></span></div>")
		$("*:last").after($wrapInnerExample)
		var $wrapInnerBtn = $("<input type='button' value='wrapInner'/>")
		$wrapInnerBtn.click(function(){
			$("div").wrapInner("<i></i>")
		})
		$("input:last").after($wrapInnerBtn)
```

*wrapInner() 不仅会包裹文字，还会包裹匹配的选择器内部所有内容。*

####  属性操作

在 jQuery 中，用 attr() 方法来获取和设置元素属性，removeAttr() 方法来删除元素属性。

#####  获取属性和设置属性

如果要获取 \<p> 元素的属性 title，那么只需要给 attr() 方法传递一个参数，即属性名称。

```javascript
		// 演示获取元素属性
		var $attrExample = $("<div id='attrExample' extraData='colemak'>attrExample<span id='attrExampleSpan'>span</span></div>")
		$("*:last").after($attrExample)
		console.log($("#attrExample").attr("extraData"))

		// 演示获取元素文本
		console.log($("#attrExample").text())
```

*即使不是 html 标准属性也是可以获取到的。*

*下面额外的获取文本属性说明了匹配到的元素内部的所有文本节点都会被视作其文本。*

```javascript
		// 设置元素属性
		$("#attrExample").attr("someData", "maer")
		$("#attrExample").attr({"value1":7, "value2":"cn"})
```

*设置单属性就直接传入两个参数，第一个是属性名，第二个是属性值。*

*设置多个属性的时候，直接传入一个字面量对象。*

> jQuery 中的很多方法都是用同一个函数实现获取（getter）和设置（setter）的，例如上面的 attr() 方法，既能设置元素属性的值，也能获取元素属性的值。类似的还有 html()、text()、height()、width()、val() 和 css() 等方法。

#####  删除属性

P88

removeAttr() 方法可以完成删除元素的任务。

```javascript
		// 演示删除元素属性
		$("#attrExample").removeAttr("value2")
```

> jQuery 1.6 中新增了 prop() 和 removeProp()，分别用来获取在匹配的元素集中的第一个元素的属性值和为匹配的元素删除设置的属性。

####  样式操作

#####  获取样式和设置样式

获取 class 属性可以用 attr() 获取，设置和追加也可以用这个方法。

```javascript
		// 演示设置元素样式
		var	$styleBtn = $("<input type='button' value='styleButton'/>")
		$styleBtn.click(function(){
			$("#attrExample").attr("class", "borderClass")
			$("#attrExample").attr("style", "font-size:22px")
			$("#attrExample").attr("style", $("#attrExample").attr("style")+";font-weight:bold")
		})
		$("input:last").after($styleBtn)
```

*可以通过先获取原有属性值，再将新属性值与旧的拼接，实现追加的效果。*

#####  追加样式

jQuery 专门提供了 addClass() 方法来追加样式。

*Javascript 中的 DOM 操作是否会重新渲染页面？*

*修改 DOM 元素的样式会导致重绘或重排。*

[高频dom操作和页面性能优化探索](https://feclub.cn/post/content/dom)

**CSS 规定，如果有不同的 class 设定了同一样式属性，则后者覆盖前者。**

```javascript
		// 演示追加样式
		var $addClassBtn = $("<input type='button' value='addClass'/>")
		$addClassBtn.click(function(){
			$("p").addClass("boldClass")
			$("p").addClass("borderClass italicClass")
		})
		$("input:last").after($addClassBtn)
```

addClass() 可以每次只添加一个，也可以一次添加多个。多个则用空格分隔。

#####  移除样式

*移除样式实际上是移除 class。*

和追加类一样，移除类也可以单个或多个移除。

```javascript
		// 演示移除样式类
		var $removeClassBtn = $("<input type='button' value='removeClass'/>")
		$removeClassBtn.click(function(){
			$("p").removeClass("boldClass")
			$("p").removeClass("borderClass italicClass")
		})
		$("input:last").after($removeClassBtn)

			var $removeClassAtOnceBtn = $("<input type='button' value='removeClassAtOnce'/>")
		$removeClassAtOnceBtn.click(function(){
			$("p").removeClass()
		})
		$("input:last").after($removeClassAtOnceBtn)
```

值得注意的是，如果 removeClass() 不带参数时，就会将 class 的值全部删除。

#####  切换样式

toggle() 的作用是，如果元素原来是显示的，则隐藏它；原来是隐藏的则显示它。

在样式上，与之类似的是 toggleClass()，如果类名存在则删除它，如果类名不存在则添加它。

```javascript
		// 演示切换样式
		var $toggleClassBtn = $("<input type='button' value='toggleClass'/>")
		$toggleClassBtn.click(function(){
			$("p").toggleClass('borderClass italicClass')
			$("p").toggleClass('boldClass')
		})
		$("input:last").after($toggleClassBtn)
```

*同 addClass() 和 removeClass() 一样，可以单切，也可以多切。*

*♞toggle() 的用法*。

```javascript
	// 显示和隐藏
	var $toggleBtn = $("<input type='button' value='toggle'/>")
	$toggleBtn.click(function(){
		$("p").toggle()
	})
	$("input:last").after($toggleBtn)
```
*[jQuery toggle()](https://api.jquery.com/toggle/)*

*书中所用的切换不同事件的 toggle() 已被 jQuery 废弃。*

```javascript
	/* 现已不可用
	// 切换事件
	var $toggleEventBtn = $("<input type='button' value='toggleEventBtn'/>")
	$toggleEventBtn.click(function() {
	$("p").toggle(
		function(){
		$("body").css("background-color","green");},
		function(){
		$("body").css("background-color","red");},
		function(){
		$("body").css("background-color","yellow");}
	)})
	$("input:last").after($toggleEventBtn)
	*/
```
*♞了解在 click() 传入的函数表达式中的 this 指向哪里。*

*根据 JavaScript 规则，谁调用此函数表达式就指向谁。*

*[.click() | jQuery API Documentation](https://api.jquery.com/click/) 根据描述，click() 是 on("click", handler) 的快捷用法。所以我们要查 on()。*

*[.on() | jQuery API Documentation](https://api.jquery.com/on/)，幸运的是我们在这里发现了在传入的 handler 中调用了 this 的用法。*

*在此之前先来说说自己做的实验：*

```javascript
	// 演示事件所用到的函数表达式中的 this 指向
	var showJQueryObject = function(){
		console.log(this)
		console.log(this+"   suffix")
	}
	$("input[type=button]").click(showJQueryObject)
	// <input type="button" value="toggle">
	// [object HTMLInputElement]   suffix
```
*返回的是一个 HTMLElement，不是 jQuery Object。*

*其文档中的代码示例是：*

```javascript
$( "#dataTable tbody tr" ).on( "click", function() {
  console.log( $( this ).text() );
});
```

*此段代码可以正常工作。所以这里的 \$(this) 是根据其 HTMLElement 新构造了 jQuery Object。[](https://www.runoob.com/linux/linux-comm-grep.html)*

*参考：[jQuery $(this) keyword - Stack Overflow](https://stackoverflow.com/questions/12481439/jquery-this-keyword)* 

```javascript
		// 探究 jQuery 对象如何表示为字符串
		console.log($("p") + "suffix")
		// [object Object]
```

*由此可见 jQuery 对象只是表现为 [Object Object]。而在 $().click(function(){this}) 中，this 则是 JavaScript 的标准对象 HTMLElement。表明 this 的确是被改变指向了。*

*apply() call() bind() 是改变调用函数中的 this 指向。*

*♞jQuery Object 的 this 为什么返回的是 jQuery prototype？*

*♞jQuery 链式操作的核心是要弄懂每个方法的返回值是什么，所以现在要翻文档查返回值。*

#####  判断是否含有某个样式

hasClass() 可以用来判断元素中是否含有某个 class，如果有，返回 true，否则返回 false。

```javascript
$("p").hasClass("borderClass")
```

> 这个方法是为了增强代码可读性而产生的。在 jQuery 内部实际上是调用了 is() 方法来完成这个功能的
>
> ```javascript
> $("p").is("borderClass")
> ```

####  设置和获取 HTML、文本和值

#####  html() 方法

此方法类似于 Javascript 中的 innerHTML 属性，可以用来读取或设置某个元素中的 HTML 内容。

```javascript
		// 改变 HTML 
		var $htmlBtn = $("<input type='button' value='change html'/>")
		$htmlBtn.click(function(){
            console.log($("div").html())
			$("div").html("<h2>这里改了html</h2>")
		})
		$("input:last").after($htmlBtn)
```

> html() 方法可以用于 XHTML 文档，但不能用于 XML 文档。

#####  text() 方法

此方法类似于 Javascript 中的 innerText 属性，可以用来读取或者设置某个元素中的文本内容。P94

```javascript
	// text() 方法演示
	var $textBtn = $("<input type='button' value='text'/>")
	$textBtn.click(function(){
		console.log($("p").text())
		$("p").text("我动了 text")
	})
	$("input:last").after($textBtn)
```
#####  val() 方法

此方法类似于 JavaScript 中的 value 属性，可以用来设置和获取元素的值。

*是用来获取表单元素中的 value。*

无论元素是文本框，下拉列表还是单选框，它都可以返回元素的值。如果元素为多选，则返回一个包含所有选择的值的数组。

需求：

* 实现登录表单，第一行邮箱地址文本框和一个单选框，单选框内两个选项：留在首页和进入邮箱。
* 第一行的文本框内默认显示“请输入邮箱地址”字样。当文本框被选中时清空字样；当文本框失去焦点且为空值时则显示默认字样。
* 第二行邮箱密码，登录按钮和记住状态单选框。第三行免费注册和忘记密码两个超链接，免费注册字体加粗。
* 第二行的文本框内默认显示“请输入邮箱密码”字样，当文本框被选中时清空字样；当文本框失去焦点且为空值时则显示默认字样。

```javascript
	// 如果邮箱地址的值为默认值，则清空
	// 如果邮箱地址为空，则置默认值
	var $address = $("#address")
	var defaultAddress = $address.val()
	$address.focus(function() {
		if ($(this).val() == defaultAddress) {
			$(this).val("")
		}
	})
	$address.blur(function(){
		if ($(this).val() == "") {
			$(this).val(defaultAddress)
		}
	})
```
```javascript
$(this).val: function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,k(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=k.map(t,function(e){return null==e?"":e+""})),(r=k.valHooks[this.type]||k.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=k.valHooks[t.type]||k.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(wt,""):null==e?"":e:void 0}
```

*密码输入框的值是上面一串函数。*

```javascript
		// 如果邮箱地址的值为默认值，则清空
		// 如果邮箱地址为空，则置默认值
		var $address = $("#address")
		var defaultAddress = $address.val()
		$address.focus(function() {
			if ($(this).val() == defaultAddress) {
				$(this).val("")
			}
		})
		$address.blur(function(){
			if ($(this).val() == "") {
				$(this).val(defaultAddress)
			}
		})
		
		var $password = $("#password")
		var defaultPassword = $password.val()
		/*
		$password.focus(function(){
			console.log("$(this).val: " + $(this).val)
			"$(this).val: function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,k(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=k.map(t,function(e){return null==e?"":e+""})),(r=k.valHooks[this.type]||k.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=k.valHooks[t.type]||k.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(wt,""):null==e?"":e:void 0}"
			$(this).val input element's value is a function.
			// This judgement condition seems to be invalid.
			if ($(this).val == defaultPassword) {
			console.log("If judgement has been triggered.")
				$(this).val("")
			} 
		})
		*/
		$password.focus(function(){
			$(this).val("")
			$(this).attr("type", "password")
		})
		// Codes below are useless. Since password could not be compared with literal string.
		$password.blur(function(){
			if ($(this).val == "") {
				$(this).attr("type", "text")
				$(this).val = defaultPassword
			}
		})

```

*由于 jQuery 对象的 this 会返回其原型对象，即 HTMLElement ，故上述功能中的元素初识默认值可以被 this.defaultValue 取代。*

```javascript
		// another example
		var $address1 = $("#address1")
		$address1.focus(function(){
			if ($(this).val() == this.defaultValue) {
				$(this).val("")
			}
		})
		$address1.blur(function(){
			if ($(this).val() == "") {
				$(this).val(this.defaultValue)
			}
		})
```

####  遍历节点

以下开始介绍遍历节点的各种方法。

#####  children() 方法

该方法用于取得匹配元素的子元素集合。

*如果要获取 html 的 body 标签，直接用 \$("body") 即可。\$("\*:last").after() 可以用 $("body").append() 代替。*

```javascript
$("body").append("<h1>Extra Title</h1>")
```

.children() 示例

```javascript
		// Here below are codes about travesal nodes
		var $body = $("body").children()	
		var $p = $("p").children()
		var $ul = $("ul").children()
		console.log($body.length)
		console.log($p.length)
		console.log($ul.length)
		for(var i = 0; i < $ul.length; i++) {
			console.log($ul[i].innerHTML)
		}
```

**children() 方法只考虑子元素而不考虑其他后代元素。**

#####  next() 方法

该方法用于取得匹配元素后面紧邻的同辈元素。

```javascript
		// next()
		for(var i = 0; i < $("p").next().length; i++){
			console.log("next(): " + $("p").next()[i])
		}
```

#####  prev() 方法

该方法用于取得匹配元素前面紧邻的同辈元素。P100

```javascript
	// prev()
	var $prev = $("ul").prev()
	console.log("$prev.text(): " + $prev.text())
```
##### siblings() 方法

该方法用于取得匹配元素的所有同辈元素。

```javascript
$("level1 > a").click(function() {
	$(this).addClass("current")
    	.next().show()
    	.parent().siblings().children("a").removeClass("current")
    	.next().hide()
    return false
})
```

这里用到了 siblings() 方法。

*以上代码中，每行以一个动作结尾，动作之前都是定位动作目标的方法。*

*每个动作都返回一个 jQuery 对象，大多数是动作目标自身。这个链式操作的每个方法都有返回值，也必须有返回值，否则只要其中一个为 null 就会断链。*

```javascript
		// siblings()
		var $siblings = $("ul").siblings()
		for (var i = 0; i < $siblings.length; i++){
			console.log("$siblings["+i+"]: "+$siblings[i].outerHTML)
		}
```

*jQuery 对象的 index() 方法被改写过，返回的是其 HTMLElement 原型。如果选择器匹配的是一个数组，那么返回的 HTMLElement 原型也是一个数组。*

#####  cloesest() 

该方法用于取得最近的匹配元素。首先检查当前元素是否匹配，如果匹配则直接返回元素本身。如果不匹配则向上查找父元素，逐级向上直至找到匹配选择器的元素。

*$\delta$ 如果最近的匹配元素在同层前后各有一个，那它的返回结果是什么？*

*closest() 的测试，看 2 包 1 和 3 同这两种情况，closest() 各返回什么？*

```javascript
		// closest() 的测试，看 2 包 1 和 3 同这两种情况，closest() 各返回什么？
		var $p1 = $("<p class='p1'> this is p1</p>")
		var $p2 = $("<p class='p2'> this is p2</p>")
		var $p3 = $("<p class='p3'> this is p3</p>")
		var $middle = $("<span class='middle'>this is middle span</span>")
		// if write so, p1 p2 will onjy be append once and the last appearance
		// $("body").append($p1, $middle, $p2, $p1, $p3, $p2)
        // write so are the same. Maybe since the unique jQuery objects can only appear once in dom tree.
		$("body").append($p1, $middle, $p2)
		$("body").append($p1, $p3, $p2)
```

*多次添加同一个 jQuery 对象，此 jQuery 对象只会出现在最后一次添加的位置。可能是因为同一 jQuery 对象只在 dom tree 中出现一次。*

*$\delta$ HTMLElement 是否也是如此？*

```javascript
        $("body").append($p1[0], $middle[0], $p2[0], $p1[0], $p3[0], $p2[0])
```

*$\Delta$以上代码也是只添加一次。说明 HTMLElement 也是如此。*

*$\delta$ 用 jQuery.html() 或 HTMLElement.outerHTML 是否能解决重复添加问题？*

```javascript 
$("body").append($p1.html(), $middle.html(), $p2.html(), $p1.html(), $p3.html(), $p2.html())
```

*$\Delta$ 这段代码不能解决想要重复添加相同 HTML 元素的问题。jQuery 的 html() 方法是相当于 javascript 的 innerHTML。所以要用 javascript 的 outerHTML。*

```javascript
$("body").append($p1[0].outerHTML, $middle[0].outerHTML, $p2[0].outerHTML, $p1[0].outerHTML, $p3[0].outerHTML, $p2[0].outerHTML)
```

*$\Delta$closest() 方法现在只会在其后代中寻找最近的匹配子元素。*

*.closest(selector): Description: For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.*

#####  parent() parents()

parent() 获取每个匹配元素的父母元素。

parents() 获得每个匹配元素的祖先元素。

除了这些方法外，还有很多其他方法可以遍历 DOM tree。例如 find()、filter()、nextAll() 和 prevAll() 等。

####  CSS-DOM 操作

通过 css() 方法，可以设置或获取CSS属性。