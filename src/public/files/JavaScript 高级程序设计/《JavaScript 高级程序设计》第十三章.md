##  事件

- [x] 理解事件流
- [ ] 使用事件处理程序
- [ ] 不同的事件类型

*要理解事件在内部的执行原理，就要先了解事件流，即处理顺序。*

###  事件流

事件流描述的是从页面中接收事件的顺序。

IE 和 Netscape 提出了两种完全相反的事件流概念。IE 的是事件冒泡流；Netscape 的是事件捕获流。

事件冒泡流即由内到外。事件捕获流则由外到内。

####  DOM 事件流

“DOM2 级事件”规定的事件流包括了三个阶段：事件捕获阶段，处于目标阶段和事件冒泡阶段。

首先发生的是事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

###  事件处理程序

事件就是用户或浏览器自身执行的某种行为。诸如 click，load 和 mouseover，都是事件的名字。

而响应某个事件的函数就叫做事件处理程序（或事件侦听器）。

事件处理程序的名字以“on”开头。

####   HTML 事件处理程序

某个元素支持的每种事件，都可以使用一个与相应事件处理程序同名的 HTML 特性来指定。

```html
<input type="button" value="Click Me" onclick="showMessage()" />
```

这样指定事件处理程序具有一些独到之处。首先，这样会创建一个封装着元素属性值的函数。这个函数中有一个局部变量 event，也就是事件对象：

​	通过 event 变量，可以直接访问事件对象。在这个函数内部，this 值等于事件的目标元素：

```html
<input type="button" value="Click Me" onclick="alert(this.value)">
```

*它扩展作用域的函数是在哪里定义的？*

```javascript
function() {
    with (document) {
        with (this) {
            // 元素值属性
        }
    }
}
```

*这个作用域扩展是在内部实现中的，在调用时可以直接使用。*

```javascript
<input type="button" value="ClickMe" onclick="alert(value)">
```

**实际上，这样扩展作用域的方式，无非就是想让事件处理程序无需引用表单元素就能访问其他表单字段。**

```html
<form method="post">
    <input type="text" name="username" value="">
    <input type="button" value="Echo Username" onclick="alert(username.value)">
</form>
```

> 不过，在 HTML 中指定事件处理程序有两个缺点。
>
> 首先，存在一个时差问题。因为用户可能会在 HTML 元素一出现在页面上就触发相应的事件，但当时的事件处理程序有可能尚不具备执行条件。比如函数定义在按钮后面。
>
> 另一个缺点是，这样扩展事件处理程序的作用域链在不同浏览器中会导致不同结果。
>
> 通过 HTML 指定事件处理程序的最后一个缺点是 HTML 与 Javascript 代码紧密耦合。如果要更换事件处理程序，就要改动两个地方：HTML 代码和 Javascript 代码。

####  DOM0 级事件处理程序

将一个函数赋值给一个事件处理程序属性，是 Javascript 指定事件处理的传统方式。而且至今仍然为所有现代浏览器所支持。原因一是简单，二是具有跨浏览器的优势。

**要使用 JavaScript 指定事件处理程序，首先必须取得一个要操作的对象的引用。**

```javascript
var btn = document.querySelector("myBtn");
btn.onclick = function() {
    alert("Chicked");
};
```

但是要注意，在这些代码运行以前不会指定事件处理程序。

使用 DOM0 级方法指定的事件处理程序被认为是元素的方法。因此，这时事件处理程序是在元素的作用域中运行。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Cool</title>
	</head>
	<body>
		<input type="button" value="ClickMe" onclick="alert(value)">
		<input type="text">
		<input id="pm" type="button" value="PrintMultiplication" >
	<script type="text/javascript">
		var pm = document.querySelector("input[value=\"PrintMultiplication\"]");
		pm.onclick = function () {
			var table  = "";
			for (var i = 1; i < 10; i++) {
				for (var j = 1; j < 10; j++) {
					table += (i*j) + "\&nbsp";
				}
				table += "\<br\>"
			}
			var tbele = document.createElement("p");
			tbele.innerHTML = table;
			document.body.appendChild(tbele);
		}
	</script>
	</body>
</html>
```

\<script> 的指定必须在要指定事件处理程序的标签后，否则找不到该标签返回 null。

*querySelector 支持属性选择器。*

*往标签间添加文本，修改 .innerHTML 属性。*

也可以通过删除 DOM0 级方法指定的事件处理程序：

```javascript
btn.onclick = null;
```

####  DOM2 级事件处理程序

"DOM2 级事件"定义了两个方法，用于处理指定和删除事件处理程序的操作：addEventListener() 和 removeEventListener()。所有 DOM 节点中都包含这两个方法，并且它们都接受  3 个参数：要处理的事件名，作为事件处理程序的函数和一个布尔值。如果布尔值为 true，则表示在捕获阶段调用事件处理程序；如果是 false，表示在冒泡阶段调用事件处理程序。

*如果该事件被触发，不是要在“处于目标阶段”才执行处理吗？捕获和冒泡阶段究竟是什么作用？*

[JS中事件冒泡与捕获 - warjiang - SegmentFault 思否](https://segmentfault.com/a/1190000005654451)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Event Capture Bubble</title>
		<style type="text/css">
			.parent {
				width: 400px;
				height: 400px;
				background-color: green;
			}
			.child {
				width: 200px;
				height: 200px;
				background-color: blue;
				position: relative;
				left: 200px;
				top: 200px;
			}
		</style>
	</head>
	<body>
		<div class="parent">
			<div class="child"></div>
		</div>
	<script type="text/javascript">
		var p = document.querySelector(".parent");
		var c = document.querySelector(".child");
		var order = 0;
		p.onclick = function () {
			this.firstChild.nodeValue = "Parent: " + order++ ;
		}
		c.onclick = function () {
			this.innerHTML = "Child: " + order++ + "\<br\>";
		}
	</script>
	</body>
</html>

```

*这段代码演示了事件执行顺序。因为两个 \<div> 都有 onclick 事件，单点一次最里面的按钮，两处 \<div> 都会出现文字。*

*第三个参数可以设置在冒泡还是在捕获阶段处理，则应该是考虑到两种思维的兼容。*

addEventListener() 如果第二个参数是匿名函数的话，那这个函数将无法通过 removeEventListener() 来移除。

> 大多数情况下，都是将事件处理程序添加到事件流的冒泡阶段，这样可以最大限度地兼容各种浏览器。最好只在需要在事件到达目标之前截获它的时候将事件处理程序添加到捕获阶段。如果不是特别需要，我们不建议在事件捕获阶段注册事件处理程序。

这里的 DOM2 级方法，在 IE 浏览器中并不支持，IE 有一套自己的事件处理程序。

####  IE 事件处理程序

略

####  跨浏览器的事件处理程序

为了以跨浏览器的方式处理事件，不少开发人员会使用能够隔离浏览器差异的 JavaScript 库，还有一些开发人员会自己开发最合适的事件处理方法。只要恰当地使用能力检测即可。

###  事件对象

在触发 DOM 上的某个事件时，会产生一个事件对象 event，这个对象包含着所有与事件有关的信息。包括事件的元素，事件的类型以及其他与特定时间相关的信息。

####  DOM 中的事件对象

兼容 DOM 的浏览器会将一个 event 对象传入到事件处理程序中。无论指定事件处理程序时使用什么方法（DOM0 级或 DOM2 级），都会传入 event 对象。

```javascript
var btn = document.getElementById("myBtn");
btn.onclick = function(event) {
	alert(event.type); //"click"
}
btn.addEventListener("click", function(event) {
    alert(event.type); //"click"
}, false);
```

```HTML
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Event Argument</title>
	</head>

	<body>
		<input id="myBtn" value="eventTest" type="button">
	<script type="text/javascript">
		var btn = document.querySelector("#myBtn");
		btn.onclick = function(event) {
			alert(event.type);
		}

		var btn2 = document.createElement("input");
		btn2.type = "button";
		btn2.value = "eventTest2";
		btn2.onclick = btn.onclick;
		document.body.append(btn2);
	</script>
	</body>
</html>

```

在通过 HTML 特性指定事件处理程序时，变量 event 中保存着 event 对象。

```html
<input type="button" value="Click Me" onclick="alert(event.type)" />
```

*也就是 HTML 中指定的事件处理中 event 的作用和 DOM 中指定的一致。*

*要了解 event 对象究竟起什么作用，就要了解它能干什么。*

[Event - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

*里面大体的属性和方法的都是有关于阻止默认行为或阻止冒泡的。*

在事件处理程序内部，对象 this 始终等于 currentTarget 的值，而 target 则只包含事件的实际目标。如果直接将事件处理程序指定给了目标元素，则 this.currentTarget 和 target 包含相同的值。

```javascript
var btn = document.createElement("input");
btn.type = "button";
btn.value = "ClickMe";
btn.onclick = function(event) {
    alert(event.currentTarget === this);
    alert(event.target === this);
}
document.body.append(btn);
```

在需要通过一个函数处理多个事件时，可以使用 type 属性：

```javascript
var btn = document.createElement("input");
btn.type = "button";
btn.value = "ClickMe";
var handler = function(event) {
    switch(event.type) {
        case "click":
            alert("Clicked");
            break;
            
        case "mouseover":
            event.target.style.backgroundColor = "red";
            break;
            
        case "mouseout":
            event.target.style.backgroundColor = "";
            break;
    }
};

btn.onclick = handler;
btn.onmouseover = handler;
btn.onmouseout = handler;
```

###  事件类型

Web 浏览器中可能发生的事件有很多类型。如前所述，不同的事件类型具有不同的信息，而“DOM3”级事件规定了以下几类事件。

* UI 事件
* 焦点事件
* 鼠标事件
* 滚轮事件
* 文本事件
* 键盘事件
* 合成事件
* 变动事件
* 变动名称事件。此类事件已被废弃，没有任何浏览器实现它们。

####  UI 事件

UI 事件指的是那些不一定与用户操作有关的事件。这些事件在 DOM 规范出现之前，都是以这种或那种形式存在的，而在 DOM 规范中保留是为了向后兼容。

* load
* unload
* abort
* error
* select
* resize
* scroll

#####   load 事件

JavaScript 中最常用的一个事件就是 load。当页面完全加载后（包括所有图像、JavaScript 文件、CSS 文件等外部资源），就会触发 window 上面的 load 事件。有两种定义 onload 事件处理程序的方式。

###  内存和性能

由于事件处理程序可以为现代 Web 应用程序提供交互能力，因此许多开发人员会不分青红皂白地向页面中添加大量的处理程序。在创建 GUI 的语言（如 C#）中，为 GUI 中的每个按钮添加一个 onclick 事件处理程序是司空见惯的事，而且这样做也不会导致什么问题。可是在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。

导致这一问题的原因事多方面的。首先，每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。其次，必须事先制定所有事件处理程序而导致的 DOM 访问次数，会延迟整个页面的交互就绪事件。事实上，从如何利用好事件处理程序的角度出发，还是有一些方法能够提升性能的。

####  事件委托

对“事件处理程序过多”问题的解决方案就是**事件委托**。事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。

####  移除事件处理程序

在指定时执行完所需操作后立即将事件指针置空。

###  事件模拟

JavaScript 事件可以在任何时间触发，通过模拟。