##  jQuery 对表单、表格的操作及更多应用

###  表单应用

一个表单有 3 个基本组成部分：

1. 表单标签：包含处理表单数据所用的服务器端程序 URL 以及数据提交到服务器的方法。
2. 表单域：包含文本框、密码框、隐藏框、多行文本框、复选框、单选框、下拉选择框和文件上传框等。
3. 表单按钮：包括提交按钮、复位按钮和一般按钮，用于将数据传送到服务器上或者取消传送，还可以用来控制其他定义了处理脚本的处理工作。

####  单行文本框应用

**补充知识**：

* \<label\> 标签及其 for 属性

> \<label\> 标签为 input 元素定义标注（标记）。
>
> label 元素不会向用户呈现任何特殊效果。不过，它为鼠标用户改进了可用性。如果您在 label 元素内点击文本，就会触发此控件，就是说，当用户选择该标签时，浏览器就会自动将焦点转到和标签相关的表单控件上。
>
> <label\> 标签的 for 属性应当与相关元素的 id 属性相同。
>
> "for" 属性可把 label 绑定到另外一个元素。请把 "for" 属性的值设置为相关元素的 id 属性的值。

* \<fliedset\> 标签

> fieldset 元素可将表单内的相关元素分组。
>
> <fieldset> 标签将表单内容的一部分打包，生成一组相关表单的字段。
>
> 当一组表单元素放到 <fieldset> 标签内时，浏览器会以特殊方式来显示它们，它们可能有特殊的边界、3D 效果，或者甚至可创建一个子表单来处理这些元素。
>
> <fieldset> 标签没有必需的或唯一的属性。
>
> [\<legend\> 标签](https://www.w3school.com.cn/tags/tag_legend.asp)为 fieldset 元素定义标题。

```css
		<style>
			input:focus, textarea:focus {
				border: 1px solid #f00;
				background: #fcc;
			}
		</style>
```

```html
		<form action="#" method="POST" id="regForm">
			<fieldset>
				<legend>个人基本信息</legend>
				<div>
					<label for="username">名称</label>
					<input id="username" type="text">
				</div>
				<div>
					<label for="pass">密码</label>
					<input id="pass" type="password">
				</div>
				<div>
					<label for="pass">密码</label>
					<input id="pass" type="password">
				</div>
				<div>
					<label for="msg">详细信息</label>
					<input id="msg" type="textarea">
				</div>
			</fieldset>
		</form>
```

*在 CSS 中对状态伪类设置，比如 :focus，:hover 等，都相当于在 JavaScript 中设置对应 CSS 事件。*

####  多行文本框应用

#####  高度变化

```html
		<form>
			<div class="msg">
				<div class="msg_caption">
					<span class="bigger">放大</span>
					<span class="smaller">缩小</span>
				</div>
				<div>
					<textarea id="comment" rows="8" cols="20">
						多行文本框高度变化
						多行文本框高度变化
						多行文本框高度变化
						多行文本框高度变化
						多行文本框高度变化
						多行文本框高度变化
						多行文本框高度变化
					</textarea>
				</div>
			</div>
		</form>
```

```javascript
		$(function(){
			$(".bigger").click(function(){
				$comment = $("#comment")
				if ($comment.height() < 500) {
					//$comment.height($comment.height() + 50)
					$comment.animate({height:"+=50"},200)
				}
			})
			$(".smaller").click(function(){
				$comment = $("#comment")
				if ($comment.height() > 200) {
					//$comment.height($comment.height() - 50)
					$comment.animate({height:"-=50"},200)
				}
			})
		})
```

调整高度可以直接通过 CSS 方法中有关 height 的快捷方法 height() 设置，也可以使用 animate() 自定义动画来调整，动画则具有良好的过渡效果。

注意在动画的过程中，需要判断评论框是否处于动画，如果处于动画过程中，则不追加其他动画，以免造成动画队列不必要的累积，使效果出现问题。

#####  滚动条高度变化

对多行文本框设置动画：

```javascript
$comment.animate({scrollTop: "-=50"}, 400)
```

即可达到滚动多行文本框的效果。

####  复选框应用

#####  全选操作

设置一个全选按钮，单击事件为：使用 jQuery 选择器选中所有复选框，用 attr 设置其 checked 属性为 true。

清空选择操作与全选几乎一样，只是把 checked 属性改为 false。

#####  反选操作

```javascript
$('[name=items]:checkbox').each(function(){
    $(this).attr("checked", !$(this).attr("checked"))
})
```

反选则复杂一点，需要遍历每个复选框并取反。

*[name=items] 属性选择器居然也是独立的选择器，伪类也是独立。*

####  下拉框应用

P162

####  表单验证

它没有介绍 jQuery 有专用的表单验证方法，要手动对不同情况实现的。 

###  表格应用

###  其他应用

