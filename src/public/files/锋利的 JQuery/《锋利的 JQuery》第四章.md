##  jQuery 中的事件和动画

P111 

JavaScript 和 HTML 之间的交互是通过用户和浏览器操作页面时引发的事件来处理的。**当文档或者它的某些元素发生某些变化或操作时，浏览器会自动生成一个事件。**

* 例如当浏览器装载完一个文档后，会生成事件
* 当用户单击某个按钮时，也会生成事件

虽然利用传统的 JavaScript 事件能完成这些交互，但 jQuery 增加并扩展了基本的事件处理机制。

**jQuery 不仅提供了更加优雅的事件处理语法，而且极大地增强了事件处理能力。**

###  JQuery 中的事件

####  加载 DOM 

以浏览器装载文档为例，在页面加载完毕后，浏览器会通过 JavaScript 为 DOM 元素添加事件。在常规的 JavaScript 代码中，通常使用 window.onload 方法，而在 jQuery 中，使用的是 \$(document).ready() 方法。\$(document).ready() 方法是事件模块中最重要的一个函数，可以极大地提高 Web 应用程序的响应速度。

jQuery 就是用 \$(document).ready() 方法来代替传统 JavaScript 的 window.onload 方法的。

需要注意 \$(document).ready() 方法和 window.onload 方法之间的细微区别。

#####  执行时机

$(document).ready() 方法和 window.onload 方法有相似的功能，但是在执行时机方面是有区别的。 window.onload 方法是在网页中所有元素（包括元素的所有关联文件）完全加载到浏览器后才执行，即 JavaScript 此时才可以访问网页中的任何元素。

而通过 jQuery 中的 $(document).ready() 方法注册的事件处理程序，在 DOM 完全就绪时就可以被调用。此时，网页的所有元素对 jQuery 而言都是可以访问的，但是，这并不意味着这些元素关联的文件都已经下载完毕。

> 举一个例子，有一个大型的图库网站，为网页中所有图片添加某些行为，例如单击图片后让它隐藏或显示。如果使用 window.onload 方法来处理，那么用户必须等到每一幅图片都加载完毕后，才可以进行操作。如果使用 jQuery 中的 $(document).ready() 方法来进行设置，只要 DOM 就绪就可以操作了，不需要等待所有图片下载完毕。

由于  DOM 加载完成时文件不一定加载完成，所以对文件的操作不一定有效。故文件加载完成才触发的事件是 load()。

load() 方法会在元素的 onload() 事件中绑定一个处理函数。如果处理函数绑定给 window 对象，则会在所有内容（包括窗口、框架、对象和图像等）加载完毕后触发，如果处理函数绑定在元素上，则会在元素的内容加载完毕后触发。

#####  多次使用

window.onload 只能赋值一个函数，且只有最后被赋值的函数才会被执行，相当于覆盖前面赋值的函数。如果需要调用多个函数，需要多写一个总函数把要调用的函数都包在里面。

```javascript
			var one = function(){
				alert("one")
			}
			var two = function(){
				alert("two")
			}
			// If page is written below, only "two" will be executed.
			window.onload = one
			window.onload = two
			
			// Want both two functions to be executed?
			// Use a function to wrap them.
			var three = function(){
				one()
				two()
			}
			window.onload = three
```

例如有多个 JavaScript 文件，每个文件都需要用到 window.onload 方法，这种情况下用总函数包就会很麻烦。

而 jQuery 的 \$(document).ready() 方法能够很好地处理这些情况，每次调用 \$(document).ready() 方法都会在现有的行为上追加新的行为，这些行为函数会根据注册的顺序依次执行。

```javascript
			// Use jQuery to simplify the registration.
			$(document).ready(function(){
				alert("one")
			})
			$(document).ready(function(){
				alert("two")
			})
```

\$(document).ready() 存在简写方法：

```javascript
$(function(){
    alert("one")
})
$(function(){
    alert("two")
})
```

\$(document) 也可以简写为 \$()。当 \$() 不带参数时，默认参数就是"document"，因此可以简写为：

```javascript
$().ready(function(){
    // codes
})
```

####  事件绑定

在文档装载完成后，如果打算为元素绑定事件来完成某些操作，则可以使用 bind() 方法来对匹配元素进行特定事件的绑定，bind() 方法的调用格式为：

```javascript
bind(type [, data], fn)
```

第一个参数是事件类型；第二个参数是可选参数，作为 event.data 属性值传递给事件对象的额外数据对象；第三个参数则是用来绑定的处理函数。

> 可以发现，jQuery 中的事件绑定类型比普通的 JavaScript 事件绑定类型少了“on”。例如鼠标单击事件在 jQuery 中对应的是 click() 方法，而在 JavaScript 中对应的是 onclick()。

#####  基本效果

目标效果：网页中有一个 FAQ，单击“标题”链接将显示内容。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset="utf-8">
		<style>
			.content{
				display: none;
			}
		</style>
	</head>
	<body>
		<script src="jquery-3.4.1.min.js"></script>
		<div id="panel">
			<h5 class="head">什么是 jQuery？</h5>
			<div class="content">
				jQuery 是继 Prototype 之后的又一个优秀的 JavaScript 库，它是一个由 John Resig 创建于 2006 年 1 月的开源项目。jQuery 凭借简洁的语法和跨平台的兼容性，极大地简化了 JavaScript 开发人员遍历 HTML 文档、操作 DOM、处理事件、执行动画和开发 AJax。它独特而又优雅的代码风格改变了 JavaScript 程序员的设计思路和编写程序的方式。
			</div>
		</div>
	<script>
		$("#panel h5.head").bind("click", function(){
			$(this).next().show()
		})
	</script>
	</body>
</html>
```

*文中的 bind("click", function) 可以使用 click(function) 代替，因为 click 就是 bind("click") 的简写形式。*

#####  加强效果

目标效果：单击“标题”显示出内容；再次单击“标题”，“隐藏”内容。

```javascript
		$("#panel h5.head").bind("click", function(){
			// There are relectors about visiblities, such as ":visible", ":hidden".
			if ($(this).next().is(":hidden")){
				$(this).next().show()
			} else {
				$(this).next().hide()
			}
		})
```

*伪类 Pseudo-classes 也是独立的选择器，并不是必须附属在其他选择器后面。*

*is() 方法用来判断某个元素是否匹配于某个选择器。*

**当发现相同的选择器在你的代码里出现多次时，请用变量将它缓存起来，以优化性能。**

```javascript
		$("#panel h5.head").bind("click", function(){
			$content = $(this).next()
			// There are relectors about visiblities, such as ":visible", ":hidden".
			if ($(this).next().is(":hidden")){
				$content.show()
			} else {
				$content.hide()
			}
		})
```

#####  改变绑定事件的类型

把单击改成鼠标悬停及移出

```javascript
		$("#panel h5.head").bind("mouseover", function(){
			$(this).next().show()
		}).bind("mouseout", function(){
			$(this).next().hide()
		})
```

**注意：** "#panel h5.head" 和 "#panel h5 .head" 所选择的类不一样，由于空格分隔符是表示选择其后代，是层次选择器；而 '.' 和 ':' 分别是类和伪类选择器，故不能接空格。"h5.head" 表示 h5 标签中且类名为 head 的元素。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset="utf-8">
		<style>
			#panel div.face {
				color: green;
			}
			#panel div .face {
				color: red;
			}
		</style>
	</head>
	<body>
		<div id="panel">
			<div>This is blank division.</div>
			<div class="face">This is face division.
				<p>This is blank paragraph</p>
				<p class="face">This is face paragraph.</p>
			</div>
		</div>
	</body>
</html>
```

*以下为示例效果：请用 HTML 或 PDF 查看。*

<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset="utf-8">
		<style>
			#panel div.face {
				color: green;
			}
			#panel div .face {
				color: red;
			}
		</style>
	</head>
	<body>
		<div id="panel">
			<div>This is blank division.</div>
			<div class="face">This is face division.
				<p>This is blank paragraph</p>
				<p class="face">This is face paragraph.</p>
			</div>
		</div>
	</body>
</html>

##### 简写绑定事件

像 click、mouseover 和 mouseout 这类事件，在程序中经常会用到，jQuery 为此也提供了一套简写的方法。

简写与 bind() 实现的无差异，只是为了减少代码量。

####  合成事件

jQuery 有两个合成事件——hover() 方法和 toggle() 方法，类似前面讲过的 ready() 方法，hover() 方法和 toggle() 方法都属于 jQuery 自定义的方法。

**toggle() 改了！不再接受两个函数作为交叉替换的执行函数了！**

#####  hover() 方法

hover() 方法的语法结构为：

```javascript
hover(enter, leave)
```

hover() 方法用于模拟光标悬停事件。当光标移动到元素上时，会触发指定的第一个函数（enter）；当光标移出这个元素时，会触发指定的第二个函数（leave）。

```javascript
		$("#panel h5.head").hover(function(){
			$(this).next().show()
		}, function(){
			$(this).next().hide()
		})
```

此方法有效。

```javascript
		$("#panel h5.head").click(function(){
			$(this).next().toggle()
		})
```

#####  再次加强效果

目标效果：用户单击“标题”链接后，不仅显示“内容”，而且高亮显示“标题”。

```css
			.highlight{
				background: #ff3300;
			}
```

```javascript
		$("#panel h5.head").click(function(){
			$(this).next().toggle()
			if ($(this).is(".highlight")){
				$(this).removeClass("highlight")
			} else {
				$(this).addClass("highlight")
			}
		})
```

####  事件冒泡

#####  什么是冒泡

在页面上可以有多个事件，也可以多个元素响应同一个事件。

假设网页上有两个元素，其中一个元素嵌套在另一个元素里，并且都被绑定了 click 事件，同时 \<body\> 元素上也绑定了click 事件。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset="utf-8">
	</head>
	<body>
		<script src="jquery-3.4.1.min.js"></script>
	<script>
		$(function(){
			$("body").click(function(){
				console.log("body has been clicked.")
			})
			$("div").click(function(){
				console.log("div has been clicked.")
			})
			$("span").click(function(){
				console.log("span has been clicked.")
			})
		})
	</script>
	<div>
		this is div.
		<span> this is span. </span>
	</div>
	</body>
</html>
```

```shell
span has been clicked.
div has been clicked.
body has been clicked.
```

*事件冒泡就是如果多层次的元素绑定了同一个事件，事件从最内层被触发的元素开始向外响应。*

*将元素放入 ready() 事件中的好处是可以将 \<script\> 代码放在任意位置，不必置末。以为 \<script\> 中的代码会在文档准备就绪后才执行，不会找不到在此之前的元素。*

#####  事件冒泡引发的问题

事件冒泡可能会引起预料之外的效果。上例中，原本只想触发 \<span\> 元素的 click 事件，然而 \<div\> 元素和 \<body\> 元素的 click 事件也同时被触发了。因此有必要对事件的作用范围进行限制。

###### 事件对象

由于 IE-DOM 和标准 DOM 实现事件对象的方法各不相同，导致在不同浏览器中获取事件对象变得比较困难。

**针对这个问题，jQuery 进行了必要的扩展和封装，从而使得在任何浏览器中都能很轻松地获取事件对象以及事件对象的一些属性。**

在程序中使用事件对象非常简单，只需要为函数添加一个参数，jQuery 代码如下：

```javascript
$("element").bind("click", function(event){
	//...
})
```

这样，当单击“element”元素时，事件对象就被创建了。这个事件对象只有事件处理函数才能访问到。事件处理函数执行完毕后，事件对象就被销毁。

######  停止事件冒泡

停止事件冒泡可以阻止事件中其他对象的事件处理函数被执行。在 jQuery 中提供了 stopPropagation() 方法来停止事件冒泡。

```javascript 
		$(function(){
			$("body").click(function(){
				console.log("body has been clicked.")
			})
			$("div").click(function(){
				console.log("div has been clicked.")
			})
			$("span").click(function(event){
				console.log("span has been clicked.")
				event.stopPropagation()
			})
		})
```

*需要理解事件传播的相关规则，在事件冒泡中，浅层次的元素不会向深层次的元素传播。只有深层次的元素向浅层次的传播。所有 stopPropagation() 实际上是阻止深层次的元素向浅层次的元素单向传播。不过这也就够了，便实现了双向都不会传播的效果。*

######  阻止默认行为

网页中的元素有自己的默认行为，例如，单击超链接后会跳转、单击“提交”按钮后表单会提交，有时需要阻止元素的默认行为。

*事件与监听是位于同一系列的概念的。相比起程序内部的主动调动，对事件的监听则是当程序外部对程序做出交互动作时，程序的被动执行。*

在 jQuery 中，提供了 preventDefault() 方法来阻止元素的默认行为。

例子：在项目中，单击“提交”按钮时，验证表单内容，例如某元素是否是必填字段，某元素是否够 6 位等，当表单不符合提交条件时，要阻止表单的提交（默认行为）。

```html
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta charset="utf-8">
<style>
	.item {
		width:100em;
		height:2em;
		overflow:hidden;
	}
	.item > *{
		float: left;
	}
	.promotion {
		width:7em;
		height:2em;
		text-align:right;
	}
</style>
	</head>
	<body>
		<script src="jquery-3.4.1.min.js"></script>
	<script>
		$(function(){
			$("#sub").click(function(event){
				var username = $("#username").val()
				if(username == "") {
					$("#username").next().text("文本框的值不能为空")
					event.preventDefault()
				}
			})
		})
	</script>
	<form action="test.html">
		<div class="item">
			<div class="promotion">用户名：</div>
			<input id="username" type="text"/>
			<div class="msg"></div>
		</div>
		<div class="item">
			<div class="promotion">密码：</div>
			<input id="password"/>
			<div class="msg"></div>
		</div>
		<div class="buttonContainer">
			<input id="sub" type="submit" value="提交"/>
		</div>
	</form>
	</body>
</html>

```

如果想同时对事件对象停止冒泡和默认行为，可以在事件处理函数中返回 false。这是对在事件对象上同时调用 stopPropagation() 和 preventDefault() 的一种简写方式。

######  事件捕获

事件捕获和事件冒泡刚好是两个相反的过程，事件捕获是从最顶端往下开始触发。

遗憾的是，并非所有主流浏览器都支持事件捕获，并且这个缺陷无法通过 JavaScript 来修复。jQuery 不支持事件捕获，如果读者需要使用事件捕获，请直接使用原生 JavaScirpt。

####  事件对象的属性

jQuery 在遵循 W3C 规范的情况下，对事件对象的常用属性进行了封装，使得事件处理在各大浏览器下都可以正常运行而不需要进行浏览器类型判断。

#####  event.type

该方法的作用是可以获取到事件的类型。

```javascript
	<script>
		$(function(){
			$("#eventType").click(function(event){
				console.log("event type: " + event.type)
				return false // 同时阻止传播和默认方法
			})
		})
	</script>
	<div id="eventType">eventType</div>
```

#####  event.preventDefault() 方法

阻止事件默认行为

#####  event.stopPropagation() 方法

阻止事件冒泡

#####  event.target

event.target 的作用是获取到触发事件的元素。

```javascript
			$("#eventTarget").click(function(event){
				console.log("event target: " + event.target)
				return false
			})
```

```html
	<div id="eventTarget">eventTarget</div>
```

#####  event.relatedTarget

在标准 DOM 中，mouseover 和 mouseout 所发生的元素可以通过 event.target 来访问，相关元素是通过 event.relatedTarget 来访问的。

#####  event.pageX 和 event.pageY

该方法的作用是获取到光标相对页面的 x 坐标和 y 坐标。

#####  event.which

该方法的作用是在鼠标单击事件中获取到鼠标的左、中、右键；在键盘事件中获取键盘的按键。

#####  event.metaKey

针对不同浏览器对键盘中的 \<ctrl\> 按键解释不同，jQuery 也进行了封装，并规定 event.metaKey 为键盘事件中获取 \<ctrl\> 按键。

> 更多的 event 属性和方法请查看文档。

####  移除事件

P127

#####  移除按钮元素上以前注册的事件

```javascript
$(selector).unbind(type)
```

如果 unbind() 不输入参数，则移除所有绑定的事件。

```html
		<script src="jquery-3.4.1.min.js"></script>
		<script>
			$(function(){
				$("p, div, span").click(function(){
					console.log($(this).html())
				})
				$("input").click(function(){
					$("p, div, span").unbind()
				})
			})
		</script>
		<p>P</p>
		<div>Div</div>
		<span>Span</span>
		<input type="button" value="deleteAllEvent"/>
```

unbind() 方法说明：

1. 如果没有参数，则删除所有绑定事件。
2. 如果提供了事件类型作为参数，则只删除该类型的绑定事件。
3. 如果把在绑定时传递的处理函数作为第二个参数，则只有这个特定的事件处理函数会被删除。

#####  移除 \<button\> 元素的其中一个事件

首先需要为这些匿名处理函数指定一个变量。

```javascript
$(function(){
    $("#btn").bind("click", myFun1 = function(){
        $("#test").append("<p>我的绑定函数</p>")
    }).bind("click", myFun2 = function(){
        $("#test").append("<p>我的绑定函数2</p>")
    }).bind("click", myFun3=function(){
		$("#test").append("<p>我的绑定函数3</p>")
    })
})
```

```html
		<input id="unbindFun2" type="button" value="unbindFun2"/>
		<div id="test"></div>
```

```javascript
				$("#unbindFun2").click(function(){
					$("#btn").unbind("click", myFun2)
				})
```

另外，对于只需要触发一次，随后就要立即接触绑定的情况，jQuery 提供了一种简写方法——one() 方法。One() 方法可以为元素绑定处理函数。当处理函数触发一次后，立即被删除。

```javascript
				$("#unbindOnce").one("click", function(){
					$("#btn").unbind("click", myFun2)
				})
```

####  模拟操作

以上例子都是用户主动交互，有时需要通过模拟用户操作，来达到交互的效果。

#####  常用模拟

在 jQuery 中，可以使用 trigger() 方法完成模拟操作。

```javascript
$("#btn").trigger("click")
```

这样，当页面装载完毕后，就会立刻输出想要的效果。

#####  触发自定义事件

trigger() 方法不仅能触发浏览器支持的具有相同名称的事件，也可以触发自定义名称的事件。bind() 也可以绑定自定义名称的事件。

```javascript
				$("#custom").bind("myClick", function(){
					console.log("Custom event")
				})
				$("#custom").trigger("myClick")
```

#####  传递数据

trigger(type, [data]) 方法有两个参数，第一个参数是要触发的事件类型，第二个参数书要传递给事件处理函数的附加数据，以数组形式传递。

通常可以通过传递一个参数给回调函数来区别这次事件是代码触发的还是用户触发的。

#####  执行默认操作

trigger() 方法触发事件后，会执行浏览器默认操作。

```javascript
$("input").trigger("focus")
```

以上代码不仅会触发为 \<input\> 元素绑定的 focus 事件，也会使 \<input\> 元素本身得到焦点（这是浏览器默认操作）。

如果只想触发绑定的 focus 事件，而不想执行浏览器默认操作，可以使用 jQuery 中另一个类似的方法——triggerHandler() 方法。

```javascript
$("input").triggerHandler("focus")
```

该方法会触发绑定的特定事件，同时取消浏览器对此事件的默认操作，即文本框只触发绑定事件的 focus 事件，不会得到焦点。

####  其他用法

#####  绑定多个事件类型

bind() 可以为元素一次性绑定多个事件类型

```javascript
$("div").bind("mouseover mouseout", function(){})
```

这样可以减少代码量。

#####  添加事件命名空间，便于管理

P132

可以把为元素绑定的多个事件类型用命名空间规范起来

*给事件添加命名空间类似于 CSS 中的给元素添加类。*

```html
		<script>
			$(function(){
				$("div").bind("click.plugin", function(){
					$("body").append("<p>click</p>")
				})
				$("div").bind("mouseover.plugin", function(){
					$("body").append("<p>mouseover</p>")
				})
				$("div").bind("dblclick", function(){
					$("body").append("<p>dblclick</p>")
				})
				$("input[type=button]").click(function(){
					$("div").unbind(".plugin")
				})
			})
		</script>
		<p>P</p>
		<div>Div</div>
		<span>Span</span>
		<input type="button" value="namespace"/>
```

#####  相同事件名称，不同命名空间执行方法

```javascript
$("div").trigger("click!")
```

! 是用来匹配所有不包含在命名空间中的 click 方法。

###  jQuery 中的动画

动画效果也是 jQuery 库吸引人的地方。通过 jQuery 的动画方法，能够轻松地为网页添加非常精彩的视觉效果，给用户一种全新的体验。

####  show() 方法和 hide() 方法

show() 方法和 hide() 方法是 jQuery 中最基本的动画方法。在 HTML 文档里，为一个元素调用 hide() 方法，会将该元素的 display 样式改为“none”。

类似效果的可以通过设置 css("display", "block") 或 css("display", "hide")

注意 hide() 方法在将“内容”的 display 属性值设置为“none”之前，会记住原先的 display 属性值（“block”或“inline”或其他除了“none”之外的值）。当调用 show() 方法时，就会根据 hide() 方法记住 display 属性值来显示元素。

#####  show() 方法和 hide() 方法让元素动起来

show() 方法和 hide() 方法在不带任何参数的情况下与使用 css("display", value) 相当，不会有任何动画。

show() 方法可以接受一个速度参数，例如，指定一个速度关键字“slow”

*不能通过单击自身实现自身的隐藏和显示，因为一旦隐藏就不能通过单击自身来显示。*

```html
	<script>
		$(function(){
			$("#showhidebtn").click(function(){
				if ($(this).prev().is(":hidden")) {
					$(this).prev().show()
				} else {
					$(this).prev().hide()
				}
			})
			$("#showhideslow").click(function(){
				if ($("#showhide").is(":hidden")) {
					$("#showhide").show('slow')
				} else {
					$("#showhide").hide('slow')
				}
			})
			$("#showhidenormal").click(function(){
				if ($("#showhide").is(":hidden")) {
					$("#showhide").show('normal')
				} else {
					$("#showhide").hide('normal')
				}
			})
			$("#showhidefast").click(function(){
				if ($("#showhide").is(":hidden")) {
					$("#showhide").show('fast')
				} else {
					$("#showhide").hide('fast')
				}
			})
		})
	</script>
	<div id="showhide">Click here to experience show(), hide().</div>
	<input id="showhidebtn" type="button" value="showhide"/>
	<input id="showhideslow" type="button" value="showhideslow"/>
	<input id="showhidenormal" type="button" value="showhidenormal"/>
	<input id="showhidefast" type="button" value="showhidefast"/>

```

slow 是 600 毫秒，normal 是 400 毫秒，fast 是 200 毫秒。

####  fadeIn() 方法和 fadeOut() 方法

与 show() 方法不相同的是，fadeIn() 方法和 fadeOut() 方法只改变元素的不透明度。

fadeOut() 方法会在指定的一段时间内降低元素的不透明度，直到元素完全消失。fadeIn() 方法则相反。

####  slideUp() 方法和 slideDown() 方法

```javascript
		// Slide up, Slide down
		$("#slideUpDownButton").click(function(){
			$content = $("#showhide")
			if ($content.is(":hidden")) {
				$content.slideDown()
			} else {
				$content.slideUp()
			}
		})
```
slideUp() 是隐藏，slideDown() 是显示

**jQuery 中的所有动画方法都能指定 slow, normal, fast 三种速度。**

####  自定义动画方法 animate()

P137

前面已经讲了 3 种类型的动画。其中 show() 方法和 hide() 方法会同时修改元素的多个样式属性，即高度、宽度和不透明度；fadeOut() 方法和 fadeIn() 方法只会修改元素的不透明度；slideDown() 方法和 slideUp() 方法只会改变元素的高度。

jQuery 中，可以使用 animate() 方法来自定义动画。其语法结构为：

```javascipt
animate(params, speed, callback)
```

* params 一个包含样式属性及值的映射，比如 {property1:"value1", property2:"value2",...}

* speed: 速度参数，可选
* callback：在动画完成时执行的函数，可选

#####   自定义简单动画

```html
	<div id="animation"></div>
```

```css
			#animation {
				width: 100px;
				height: 100px;
				border: 1px solid #005000;
				background: #96e555;
				cursor: pointer;
			}
```

```javascript
			// Customized animation
			$("#animation").click(function(){
				$(this).animate({height:"50px"}, 3000)
			})
```

*$\delta$不知为何，书中的有关相对位置的动画无法显示效果，有关颜色的也是。*

