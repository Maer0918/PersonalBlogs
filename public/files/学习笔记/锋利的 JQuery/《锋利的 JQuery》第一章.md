##  认识 JQuery

The occurency of jQuery is to deal with the three disadvantages of JavaScript itself:

1. The difficulty of DOM
2. The difference between browsers
3. The lack of debug tool

本书的重点 jQuery 同样是一个轻量级的库，拥有强大的选择器、出色的 DOM 操作、可靠的事件处理、完善的兼容性和链式操作等功能。

####  jQuery 的优势

jQuery 强调的理念是写得少，做得多（write less, do more)。

####  编写简单的 jQuery 代码

在 jQuery 库中，\$ 就是 jQuery 的一个简写形式，例如 \$("#foo") 和 jQuery("#foo") 是等价的。

####  jQuery 代码风格

##### 链式操作风格

```html
<!DOCTYPE html>
<html>
	<head>
		<meta chaset="utf-8">
		<title>Chain Style</title>
	</head>
	<body>
		<div class="box">
			<ul class="menu">
				<li class="level1">
					<a href="#none">衬衫</a>
					<ul class="level2">
						<li><a href="#none">短袖衬衫</a></li>
						<li><a href="#none">长袖衬衫</a></li>
						<li><a href="#none">短袖T恤</a></li>
						<li><a href="#none">长袖T恤</a></li>
					</ul>
				</li>
				<li class="level1">
					<a href="#none">卫衣</a>
					<ul class="level2">
						<li><a href="#none">开襟卫衣</a></li>
						<li><a href="#none">套头卫衣</a></li>
						<li><a href="#none">运动卫衣</a></li>
						<li><a href="#none">童装卫衣</a></li>
					</ul>
				</li>
				<li class="level1">
					<a href="#none">裤子</a>
					<ul class="level2">
						<li><a href="#none">短裤</a></li>
						<li><a href="#none">休闲裤</a></li>
						<li><a href="#none">牛仔裤</a></li>
						<li><a href="#none">免烫卡其裤</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</body>
</html>
```

```javascript
$(".level1 > a").click(function() {
	$(this).addClass("current").next().show().parent().siblings().children("a").removeClass("current").next().hide()
	return false
})

```

以上这段代码的作用是：当鼠标单击到 a 元素（它是 class 含有 level1 的子元素）的时候

1. 给其添加一个名为 current 的 class | $(this).addClass("current").
2. 然后将紧邻其后面的元素显示出来 | .next().show()
3. 同时将它的父辈的同辈元素内部的子元素 \<a\> 都去掉一个名为 current 的 class | .parent().siblings().children("a").removeClass("current")
4. 并且将紧邻它们后面的元素都隐藏。| .next().hide()

*链式风格的原理是连续调用的方法，其执行顺序是从左到右逐个方法执行。猜测每个方法执行完以后都会返回一个 jQuery 对象，否则方法链无法延续。*

这就是 jQuery 强大的链式操作，一行代码就完成了导航栏功能。

**虽然 jQuery 做到了行为与代码的分离，但 jQuery 代码本身也应该拥有良好的层次结构及规范，这样才能进一步改善代码的可读性和可维护性。因此，推荐一种带有适当的格式的代码风格。**

```javascript
$("level1 > a").click(function () {
	$(this).addClass("current")
    .next().show()
    .parent().siblings().children("a").removeClass("current")
    .next().hide()
    return false
})
```

*亲测这种格式可正常运行*

代码风格总结：

1. 对于同一个对象不超过 3 个操作的，可以直接写成一行

   1. ```javascript
      $("li").show.unbind("click");
      ```

2. 对于同一个对象的较多操作，建议每行写一个操作

   1. ```javascript
      $("this").removeClass("mouseout")
      				.addClass("mouseover")
      				.stop()
      				.fadeTo("fast", 0.6)
      				.fadeTo("fast", 1)
      				.unbind("click")	
      ```

3. 对于多个对象的少量操作，可以每个操作写一行，如果涉及子元素，可以考虑适当地缩进

   1. ```javascript
      $(this).addClass("highlight")
      			.children("li").show().end()
      .siblings().removeClass("highlight")
      			.children("li").hide()
      ```

#####  为代码添加注释

通过有意义的注释，能够培养良好的编码习惯和风格。

###  jQuery 对象和 DOM 对象

第一次学习 jQuery，经常分辨不清哪些是 jQuery 对象、哪些是 DOM 对象，因此需要重点了解 jQuery 对象和 DOM 对象以及它们之间的关系。

```html
<script type="text/javascript" src="jquery-3.4.1.js"></script>
```

*\$ 也就是 jQuery 相当于一个函数或者说一个构造器，可以返回一个 jQuery 对象。*

在讨论 jQuery 对象和 DOM 对象的相互转换之前，先约定好定义变量的风格。如果获取的对象是 jQuery 对象，那么在变量前面加上 $，例如：

```javascript
var  $variable = jQueryObject;
```

如果是 DOM 对象：

```javascript
var variable = DOMObject;
```

#####  jQuery 对象转成 DOM 对象

jQuery 对象不能使用 DOM 中的方法，但如果对 jQuery 对象所提供的方法不熟悉，或者 jQuery 没有封装想要的方法，不得不使用 DOM 对象的时候，有以下两种处理方法。

**jQuery 提供了两种方法将一个 jQuery 对象转换成 DOM 对象，即 [index] 和 get(index)。*

1. jQuery 对象是一个类似数组的对象，可以通过 [index] 的方法得到相应的 DOM 对象。

```javascript
var $cr = $("#cr");
var cr = $cr[0];
```

```html
<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8">
		<title>JQuery Template</title>
	</head>
	<body>
		<script type="text/javascript" src="jquery-3.4.1.js"></script>
		<nav>This is nav</nav>
		<article>This is article</article>
		<footer>This is footer</footer>
	</body>
</html>
```

```javascript
var obj = {
    	  por0:0,
          por1:1,
          por2:2
}
obj[0]
```

*obj[0] 是 undefinded，说明这种用法是调用了 javascript 的内部反射机制*

2. 另一种方法是 jQuery 本身提供的，通过 get(index) 方法得到相应的 DOM 对象。

jQuery 代码如下：

```javascript
var $cr = $("cr")
var cr = $cr.get(0)
```

*jQuery 对象转 DOM 对象都是跟序号有关，而且都是序号 0 *

#####  DOM 对象转成 jQuery 对象

*因为两种对象的方法不相互兼容。所以要调用某种方法时，只能转换。*

对于一个 DOM 对象，只需要用 \$() 把 DOM 对象包起来，就可以获得一个 jQuery 对象了。方式为 \$(DOM 对象)。

```javascript
var cr = document.getElementById("cr")
var $cr = $(cr)
```

P36

