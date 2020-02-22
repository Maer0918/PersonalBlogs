## jQuery 选择器

*虽然现在的 ECMA 对 DOM 的选择已经提供了完善的 CSS 选择器支持，但是为了掌握 jQuery 还是有必要掌握 jQuery 的选择器。*

**选择器是 jQuery 的根基，在 jQuery 中，对事件处理，遍历 DOM 和 Ajax 操作都依赖于选择器。**

### jQuery 选择器

####  基本选择器

基本选择器的用法和 CSS 基本选择器语法一致

####  层次选择器

层次选择器适用于通过 DOM 元素之间的层次来获取特定元素，例如后代元素、子元素、相邻元素和同辈元素等。

*jQuery 层次选择器与 CSS 层次选择器语法一致。*

P49

```javascript
$(".one + div")
	.css("background", "#bbffaa")
```

"+" 表示同辈的下一个元素

```javascript
$("#two ~ div")
	.css("background", "#bbffaa")
```

"~" 表示同辈的所有后面元素

#### 过滤选择器

过滤选择器主要是通过特定的过滤规则来筛选出所需的 DOM 元素，过滤规则与 CSS 中的伪类选择器语法相同，即选择器都以一个冒号（:）开头。

*过滤选择器的功能是 CSS 伪类选择器功能的超集。*

过滤选择器可以分为基本过滤、内容过滤、可见性过滤、属性过滤、子元素过滤和表单对象过滤选择器。P49

#####  基本过滤选择器

* :first*
* :last 
* :not(selector) 
* :even
* :odd
* :eq(index) 
* gt(index)
* lt(index)
* :header
* :animated
* :focus

#####  内容过滤选择器

* :contain(text)
*  :empty
*  :has(selector)
*  :parent

#####  可见性过滤选择器

* :hidden
*  :visible

#####  属性过滤选择器

* [attribute]
* [attribute=value]
* [attribute!=value]
* [attribute^=value]
* [attribute$=value]
* [attribute*=value]
* [attribute|=value]
* [attribute-=value]
* \[attribute1]\[attribute2]\[attributeN]

#####  子元素过滤选择器

*:nth-child() 那一类。*

#####  表单对象属性过滤选择器

* :enabled 
* :disabled
* :checked
* :selected

#### 表单选择器

为了使用户能更灵活地操作表单，jQuery 中专门加入了表单选择器。利用这个选择器，能极其方便地获取到表单的某个或某类型的元素。

* :input
* :text
* :password
* :radio
* :checkbox
* :submit
* :image
* :reset
* :button
* :file
* :hidden

###  应用 jQuery 改写示例

* 例子1：给网页中所有的 \<p> 元素添加 onclick 事件
* 例子2：使一个特定的表格隔行变色
* 例子3：对多选框进行操作，输出选中的多选框的个数

**jQuery 具有隐式迭代的特性。**

```javascript
$("p").click(function() { // 获取页面中的所有 p 元素，给每一个 p 元素添加单击事件
    //do something
})
```

```javascript
$("#tb tbody tr:even").css("background", "#888") 
/*
获取 id 为 tb 的元素，然后寻找它下面的 tbody 标签，再寻找 tbody 下引索值是偶数的 tr 元素，改变它的背景色。
css("property", "value")
*/
```

```javascript
$("#btn").click(function() {
    //先使用属性选择器，然后用表单对象属性过滤，最后获取 jQuery 对象的长度
	var items = $("input[name='check']:checked")
    alert("选中的个数为：" + items.length)
})
```

###  选择器中的一些注意事项

####  选择器中含有特殊符号的注意事项

##### 选择器中含有“.”、“#”、“（”或“]”等特殊字符

根据 W3C 的规定，属性值中是不能含有这些特殊字符的，但在实际项目中偶尔会遇到表达式中含有“#”和“.”等特殊字符。此时要使用转义字符。

```html
<div id="id#b">bb</div>
<div id="id[1]">cc</div>
```

```javascript
$("#id\\#b")
$("#id\\[1\\]")
```

### 案例研究——某网站品牌列表的效果

####  目标效果

* 用户进入页面时，品牌列表默认是精简展示的。

* 用户可以单击商品列表下方的“显示全部品牌”按钮来显示全部的品牌。
* 单击“显示全部品牌”按钮的同时，列表会将推荐的品牌的名字高亮显示，按钮里的文字也换成了“精简显示品牌”。
* 再次单击“精简显示品牌”按钮，即又回到精简展示页面。

* 每行显示三个品牌，每列品牌左对齐。

> [CSS3 美化有序列表](https://www.w3cplus.com/css3/css3-ordered-list-styles)  :
>
> ```css
> li {
>     list-styie: none;
> }
> ```
>
> [CSS 超级链接的美化](https://www.jianshu.com/p/0023b2309507)  :
>
> ```css
> a {
>     text-decoration: none;
> }
> ```
>
> [CSS 清除浮动](https://segmentfault.com/a/1190000004865198)：
>
> * overflow: hidden;
> * clear: both;
> * :after {.....}

#### 步骤 

1. 从第 7 条开始隐藏后面的品牌，最后一条“其他品牌相机”除外。
2. 当用户单击“显示全部品牌”按钮时，将执行以下操作：
   1. 显示隐藏的品牌。
   2. “显示全部品牌”按钮文本切换成“精简显示品牌”。
   3. 高亮推荐品牌。
3. 当用户单击“精简显示品牌”按钮时，将执行以下操作：
   1. 从第 7 条开始隐藏后面的品牌，最后一条“其他品牌相机”除外。
   2. “精简显示品牌”按钮文本切换成“显示全部品牌”。
   3. 去掉高亮显示的推荐品牌。

```javascript
var $category = $("ul li:gt(5):not(:last)") // 获取大于第六条的 li ，除了最后一条 li
$category.hide() // 隐藏 li
```

*猜测 jQuery 的选择器引索值是从 0 开始的。*

```javascript
var $toggleBtn = $('div.showmore > a')
// 功能：获取“显示全部品牌”按钮
// 意思：class 为 showmore 的 div 的所有子元素 a
```

*注意 div.showmore 这个写法。*P67

```javascript
$toggleBtn.Click(function() {
	$category.show()	// 显示全部品牌
    return false	// 超链接不跳转
})
```

**由于给超链接添加 onclick 事件，因此需要使用“return false”语句让浏览器认为用户没有单击该超链接，从而组织该超链接跳转。**

*这里采用了一个精妙的设计，使用超链接元素充当按钮。使用超链接样式提示用户可点击，然后通过取消超链接响应以防止跳转。*

```javascript
$(this).find("span")
			.css("background", "url(img/up.gif) no-repeat 0 0")
			.text("精简显示品牌")	// 这里使用了链式操作
```

```javascript
// 高亮推荐品牌
$("ul li")
		.fliter(":contains('佳能').contains('尼康').:contains('奥林巴斯')")
		.addClass("promoted")
```

> [网上本章完整代码显示](https://www.cnblogs.com/zhaojieln/p/4233974.html)

>上面用到的几个 jQuery 方法的以意思如下：
>
>* show()：显示隐藏的匹配元素。
>* css(name, value)：给元素设置样式
>* text(string)：设置所有匹配元素的文本内容。
>* filter(expr)：筛选出与制定表达式匹配的元素集合，其中 expr 可以是多个选择器的组合。注意区分它和 find() 方法。find() 会在元素内寻找匹配元素，而 filter() 则是筛选元素。一个是对它的子集操作，一个是对自身集合元素进行筛选。
>* addClass()：为匹配的元素添加指定的类名。

*注意这里的添加类并不是添加 div 元素。*

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Show More</title>
<style>
	* {
		margin: 0;
		padding: 0;
	}
	.SubCategoryBox {
		width:480px;
		overflow:hidden;
	}
	.SubCategoryBox li {
		float: left;
		width: 160px;
		height: 20px;
		list-style: none;
	}
	a {
		text-decoration: none;
	}
	.promoted {
		color: red;
	}
</style>
	</head>
	<body>
		<div class="SubCategoryBox">
			<ul>
				<li><a href="#">佳能</a><i>(30440)</i></li>
				<li><a href="#">索尼</a><i>(27220)</i></li>
				<li><a href="#">三星</a><i>(20808)</i></li>
				<li><a href="#">尼康</a><i>(17821)</i></li>
				<li><a href="#">松下</a><i>(12289)</i></li>
				<li><a href="#">卡西欧</a><i>(8242)</i></li>
				<li><a href="#">富士</a><i>(14894)</i></li>
				<li><a href="#">柯达</a><i>(9520)</i></li>
				<li><a href="#">宾得</a><i>(9520)</i></li>
				<li><a href="#">理光</a><i>(4114)</i></li>
				<li><a href="#">奥林巴斯</a><i>(12205)</i></li>
				<li><a href="#">明基</a><i>(1466)</i></li>
				<li><a href="#">爱国者</a><i>(3091)</i></li>
				<li><a href="#">其他品牌相机</a><i>(7275)</i></li>
			</ul>
		</div>
		<div class="showmore">
			<a href="showmore.html"><span>显示全部品牌</span></a>
		</div>
		<script src="jquery-3.4.1.min.js"></script>
	<script>
		$(function(){
			// 获取大于第六条的 li ，除了最后一条 li
			var $category = $("ul li:gt(5):not(:last)")
			// 隐藏 li
			$category.hide() 
			var $toggleBtn = $('div.showmore > a')
			// 功能：获取“显示全部品牌”按钮
			// 意思：class 为 showmore 的 div 的所有子元素 a
			$toggleBtn.click(function() {
				$category.show()	// 显示全部品牌
				$(this).find("span")
					.css("background", "url(img/up.gif) no-repeat 0 0")
					.text("精简显示品牌")	// 这里使用了链式操作
				// 高亮推荐品牌
				$("ul li")
					.filter(":contains('佳能'),:contains('尼康'),:contains('奥林巴斯')")
					.addClass("promoted")
				return false	// 超链接不跳转
			})
		})
	</script>
	</body>
</html>
```

完成“精简显示品牌”按钮的功能：

由于用户单击的是同一个按钮，因此事件仍然是在刚才的按钮元素上。

```javascript
// 隐藏后面部分目录
$category.hide()
// 更改图片及文字
$(this).find('span')
			.css("baceground", "url(img/down.gif) no repeat 0 0")
			.text("显示全部品牌")
// 去除高亮样式
$('ul li').removeClass("promoted")
```

完成情况切换：

```javascript
// 如果元素是显示的
if($category.is(":visible")) {
    // 执行精简
    
    // 否则执行显示
} else {
    
}
```

```javascript
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Show More</title>
<style>
	* {
		margin: 0;
		padding: 0;
	}
	.SubCategoryBox {
		width:480px;
		overflow:hidden;
	}
	.SubCategoryBox li {
		float: left;
		width: 160px;
		height: 20px;
		list-style: none;
	}
	a {
		text-decoration: none;
	}
	.promoted {
		color: red;
	}
</style>
	</head>
	<body>
		<div class="SubCategoryBox">
			<ul>
				<li><a href="#">佳能</a><i>(30440)</i></li>
				<li><a href="#">索尼</a><i>(27220)</i></li>
				<li><a href="#">三星</a><i>(20808)</i></li>
				<li><a href="#">尼康</a><i>(17821)</i></li>
				<li><a href="#">松下</a><i>(12289)</i></li>
				<li><a href="#">卡西欧</a><i>(8242)</i></li>
				<li><a href="#">富士</a><i>(14894)</i></li>
				<li><a href="#">柯达</a><i>(9520)</i></li>
				<li><a href="#">宾得</a><i>(9520)</i></li>
				<li><a href="#">理光</a><i>(4114)</i></li>
				<li><a href="#">奥林巴斯</a><i>(12205)</i></li>
				<li><a href="#">明基</a><i>(1466)</i></li>
				<li><a href="#">爱国者</a><i>(3091)</i></li>
				<li><a href="#">其他品牌相机</a><i>(7275)</i></li>
			</ul>
		</div>
		<div class="showmore">
			<a href="showmore.html"><span>显示全部品牌</span></a>
		</div>
		<script src="jquery-3.4.1.min.js"></script>
	<script>
		$(function(){
			// 获取大于第六条的 li ，除了最后一条 li
			var $category = $("ul li:gt(5):not(:last)")
			// 隐藏 li
			$category.hide() 
			var $toggleBtn = $('div.showmore > a')

			$toggleBtn.click(function() {
				if($category.is(":hidden")){
					// 功能：获取“显示全部品牌”按钮
					// 意思：class 为 showmore 的 div 的所有子元素 a
						$category.show()	// 显示全部品牌
						$(this).find("span")
							.css("background", "url(img/up.gif) no-repeat 0 0")
							.text("精简显示品牌")	// 这里使用了链式操作
						// 高亮推荐品牌
						$("ul li")
							.filter(":contains('佳能'),:contains('尼康'),:contains('奥林巴斯')")
							.addClass("promoted")
				} else {
					// 隐藏后面部分目录
					$category.hide()
					// 更改图片及文字
					$(this).find('span')
							.css("background", "url(img/down.gif) no repeat 0 0")
							.text("显示全部品牌")
					// 去除高亮样式
					$('ul li').removeClass("promoted")
				}
				return false	// 超链接不跳转
			})
		})
	</script>
	</body>
</html>

```

在 jQuery 中有一个方法更适合上面的情况，它能给按钮添加一组交互事件，而不需要像上例一样判断。使用 .toggle() 方法改善条件切换：P71：

```javascript
$toggleBtn.toggle(function() {
	}, function() {
})
```

*.toggle() 方法中传入两个参数，每个参数是一个函数。*

> 注意：在本例中，如果用户禁用了 JavaScript 的功能，品牌列表仍然能够完全显示，当用户单击“显示全部品牌”按钮的时候，会跳转到 more.html 页面来显示品牌列表。作为一名专业的开发者，必须要考虑到禁用或者不支持 JavaScript 的浏览器（用户代理）。另外，这点对于搜索引擎优化也特别有帮助，毕竟当前的搜索引擎爬虫基本都不支持 JavaScript。

```javascript
$toggleBtn.toggle(function() {
                // 功能：获取“显示全部品牌”按钮
                // 意思：class 为 showmore 的 div 的所有子元素 a
                $category.show()    // 显示全部品牌
                $(this).find("span")
                    .css("background", "url(img/up.gif) no-repeat 0 0")
                    .text("精简显示品牌")   // 这里使用了链式操作
                // 高亮推荐品牌
                $("ul li")
                    .filter(":contains('佳能'),:contains('尼康'),:contains('奥林巴斯')")
                    .addClass("promoted")
                }, function() {
                // 隐藏后面部分目录
                $category.hide()
                // 更改图片及文字
                $(this).find('span')
                        .css("background", "url(img/down.gif) no repeat 0 0")
                        .text("显示全部品牌")
                // 去除高亮样式
                $('ul li').removeClass("promoted")
            })
```

*为啥把控制结构改成以上样式后，切换功能就不正常了？*