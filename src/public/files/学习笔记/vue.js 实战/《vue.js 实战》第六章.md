##  表单与 v-model

表单类控件承载了一个网页数据的录入与交互，本章将介绍如何使用指令 v-model 完成表单的数据双向绑定。

###  基本用法

输入的内容会实时映射到绑定的数据上。

```html
		<!-- basic form -->
		<div id="app1">
			<input type="text" v-model="message" placeholder="输入……">
			<p>输入的内容是：{{ message }}</p>
		</div>
	<script>
		var app1 = new Vue({
			el: '#app1',
			data: {
				message: ''
			}
		})
	</script>
```

*回想一下，好像只有开头那里用过 `v-model` 指令，推测 `v-model` 指令是直接从表单获取数据并实时反映的？*

> 使用 `v-model` 后，表单控件显示的值只依赖所绑定的数据，不再关心初始化时的 `value` 属性，对于在 `<textarea></textarea>` 之间插入的值，也不会生效。

> 使用 `v-model` 时，如果是用中文输入法输入中文，一般在没有选定词组前，也就是在拼音阶段，Vue 是不会更新数据的，当敲下汉字才会触发更新。如果希望总是实时更新，可以用 `@input` 来代替 `v-model` 。 

```html
	<!-- @input -->
	<div id="app2">
		<input type="text" @input="handleInput" placeholder="输入……">
		<!-- Insert 10 break tags here in order to avoid sheltering the output -->
		<br v-for="i in 10">
		<p> 输入的内容是：{{ message }} </p>
	</div>
	<script>
		var app2 = new Vue({
			el: '#app2',
			data: {
				message: ''
			},
			methods: {
				handleInput: function (e) {
					this.message = e.target.value
				}
			}
		})
	</script>
```

单选按钮在使用时，不需要 `v-model` ，直接使用 `v-bind` 绑定一个布尔类型的值，为真时选中，为否时不选。

```html
	<!-- multiple radio buttons -->
	<!-- 单选按钮顾名思义组合起来才能切换选择 -->
	<div id="app4">
		<p> 三选一 </p>
		<template v-for="item in items">
			<input type="radio" v-model="picked" :value="item.value" :id="item.id">
			<label :for="item.id">{{ item.text }}</label>
		</template>
		<br>
		<p>选择的项是：{{ picked }}</p>
	</div>
	<script>
		var app4 = new Vue({
			el: '#app4',
			data: {
				picked: '',
				items: [
					{
						value: 'html',
						id: 'html',
						text: 'HTML'
					},
					{
						value: 'js',
						id: 'js',
						text: 'JavaScript'
					},
					{
						value: 'css',
						id: 'css',
						text: 'CSS'
					}
				]
			}
		})
	</script>
```

*单选按钮绑定 `v-model` 后反映的值是其 `value`。*

复选框：

复选框也分单独使用和组合使用，不过用法稍与单选不同。复选框单独用时，也是用 `v-model` 来绑定一个布尔值：

```html
<!-- single checkbox -->
<div id="app5">
	<p>app6:</p>
	<input type="checkbox" v-model="checked" id="checked">
	<label for="checked">选择状态：{{ checked }}</label>
</div>
<script>
	var app = new Vue({
		el: "#app5",
		data: {
			checked: false
		}
	})
</script>
```
组合使用时，也是 `v-model` 与 `value` 一起，多个勾选框都绑定到同一个数组类型的数据，`value` 的值在数组当中，就会选中这一项。这过程也是双向的，在勾选时，`value` 的值也会自动 push 到这个数组中，取消选择时也会自动 `。

```javascript
	<!-- multiple checkbox -->
	<div id="app7">
		<p>app7:</p>
		<template v-for="item in items">
			<input type="checkbox" v-model="checked" :value="item.value" :id="item.id">
			<label for="item.id">{{ item.name }}</label>
			<br>
		</template>
		<p>选中的有：<span v-for="check in checked">{{ check }}&nbsp;</span></p>
	</div>
	<script>
		var app = new Vue({
			el: '#app7',
			data: {
				items: [
					{
						id: 'html',
						value: 'html',
						name: 'HTML'
					},
					{
						id: 'js',
						value: 'js',
						name: 'JavaScript'
					},
					{
						id: 'css',
						value: 'css',
						name: 'css'
					}
				],
				checked: []
			}
		})
	</script>
```

选择列表：

选择列表就是下拉选择器，同样也分为单选和多选两种方式。

```html
<!-- seletion -->
<div id="app8">
	<p>app8:</p>
	<select v-model="selected">
		<option v-for="item in items" :value="vl(item)">{{ item }}</option>
	</select>
	<p>你选择了：{{ selected }}</p>
</div>
<script>
	var app8 = new Vue({
		el: '#app8',
		data: {
			selected: '',
			items: ['html', 'css', 'javascript']
		},
		methods: {
			vl: function (item) {
				if (item === 'javascript')
					return 'js'
				return item
			}
		}
	})
</script>
```
`<option>` 是备选项，如果含有 `value` 属性，`v-model` 就会有限匹配 `value` 的值；如果没有，就会直接匹配 `<option>` 的 `text`。

*不过以上代码并不能体现，以为全部设置了 `value` ，这也体现了 `v-for` 的局限性。*

给 `selected` 添加属性 `multiple` 就可以多选，此时 `v-model` 绑定的是一个数组，与复选框用法类似。

```html
<!-- multiple selection -->
<div id="app9">
	<p>app9:</p>
	<select v-model="selected" multiple>
		<option>html</option>
		<option value="js">javascript</option>
		<option>css</option>
	</select>
	<p>选择的项是：{{ selected }}</p>
</div>
<script>
	var app = new Vue({
		el: '#app9',
		data: {
			selected: []
		}
	})
</script>
```
*不过好像要用 `ctrl` 按住再用鼠标单击才能实现选多个。*

`<select>` 样式依赖平台和浏览器，无法统一，也不太美观，功能也受限，必须不支持搜索，所以常见的解决方案是用 `div` 模拟一个类似的控件。

###  绑定值

业务中，有时需要绑定一个动态的数据，这时可以用 `v-bind` 来实现。

*上文中自己实践时已实现过*

###  修饰符

与事件的修饰符类似，v-model 也有修饰符，用于控制数据同步的时机。

####  .lazy

在输入框中，`v-model` 默认是在 `input` 事件中同步输入框的数据（除了提示中介绍的中文输入法情况外），使用修饰符 `.lazy` 会转变为在 `change` 事件中同步。

*也就是输入框失焦或回车后才更新值。*

#### .number

`.number` 可以将输入转换为 `Number` 类型，否则默认的都是 `String` 。

```html
<!-- .number decorator -->
<hr/>
<div id="app12">
	<p>app12:</p>
	<input type="number" v-model.number="digit">
	<input type="number" v-model="message">
	<p>digit + 7 字符串拼接测试：{{ digit + 7 }}</p>
	<p>message + 7 字符串拼接测试：{{ message + 7 }}</p>
</div>
<script>
	var app12 = new Vue({
		el: '#app12',
		data: {
			message: '',
			digit: ''
		}
	})
</script>
```
####  .trim

修饰符 `.trim` 可以自动过滤输入的首尾空格。