##  内置指令

Vue.js 的指令是带有特殊前缀 "v-" 的 HTML 特性，它绑定一个表达式，并将一些特性应用到 DOM 上。

###  基本指令

#### v-cloak

`v-cloak` 不需要表达式，它会在 Vue 实例结束编译时从绑定的 HTML 元素上移除，经常和 CSS 的 `display: none`，配合使用：

```html
		<div id="app1" v-cloak>
			{{ message }}
		</div>
		<script>
			var app1 = new Vue({
				el: '#app1',
				data: {
					message: 'This is a text'
				}
			})
		</script>
```

这时虽然已经加了指令 `v-cloak`，但其实并没有起到任何作用，当网速较慢、Vue.js 文件还没加载完时，在页面上会显示 `{{message}}` 字样，直到 Vue 创建实例、编译模板时，DOM 才会被替换，所以这个过程屏幕是有闪动的。只要加一句 CSS 就可以解决这个问题了：

```css
[v-cloak] {
    display: none;
}
```

在一般情况下，`v-cloak` 是一个解决初始化慢导致页面闪动的最佳实践，对于简单的项目很实用，但是在具有工程化的项目里，比如后面进阶篇将介绍 webpack 和 vue-router 时，项目的 HTML 结构就只有一个空的 `div` 元素，剩余的内容都是由路由去挂载不同组件完成的，所以不再需要 `v-cloak`。

*原书在这里没提到 `v-cloak` 的作用，这就很奇怪。我去找了找：*

*这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。*

####  v-once

`v-once` 也是一个不需要表达式的指令，作用是定义它的元素或组件只渲染一次，包括元素或组件的所有子节点。首次渲染后，不再随数据的变化重新渲染，将被视为静态内容，例如：

```html
	<!-- v-once -->
	<div id="app2">
		<span v-once>{{ message }}</span>
		<span>{{ message }}</span>
		<div v-once>
			<span>{{ message }}</span>
		</div>
		<div>
			<span>{{ message }}</span>
		</div>
	</div>
	<script>
		var app2 = new Vue({
			el: '#app2',
			data: {
				message: 'This is a text2.'
			}
		})
		app2.message = 'Text2 has been changed.'
	</script>
```
v-once 在业务中也很少使用，当你需要进一步优化性能时，可能会用到。

*由于只渲染一次，此后数据更改时不会同步更新。*

###  条件渲染指令

####  v-if、v-else-if、v-else

与 JavaScript 的 `if` `else` `else if` 类似，Vue.js 的条件指令可以根据表达式的值在 DOM 中渲染或销毁元素/组件，例如：

```html
	<!-- v-if v-else-if v-else -->
	<div id="app3">
		<p v-if="status === 1">当 status 为 1 时显示该行</p>
		<p v-else-if="status === 2">当 status 为 2 时显示该行</p>
		<p v-else>否则显示该行</p>
	</div>
	<script>
		var app = new Vue({
			el: '#app3',
			data: {
				status: 1
			}
		})
	</script>
```
表达式的值为真时，当前元素/组件及所有子节点将被渲染，为假时被移除。如果一次判断的是多个元素，可以在 Vue.js 内置的 `<template>` 元素上使用条件指令，最终渲染的结果不会包含该元素。

```html
	<!-- vue condition and template -->
	<div id="app4">
		<template v-if="status === 4">
			<p>This is a text3.</p>
			<p>This is a text3.</p>
			<p>This is a text3.</p>
		</template>
	</div>
	<script>
		var app4 = new Vue({
			el: '#app4',
			data: {
				status: 4
			}
		})
	</script>
```
Vue 在渲染元素时，出于效率考虑，会尽可能地复用已有的元素而非重新渲染。所以输入框中输入的内容会不变。

```html
	<!-- vue condition reuse -->
	<div id="app5">
		<template v-if="type === 'name'">
			<label>用户名：</label>
			<input placeholder="输入用户名">
		</template>
		<template v-else>
			<label>邮箱：</label>
			<input placeholder="输入邮箱">
		</template>
		<button @click="handleToggleClick">切换输入类型</button>
	</div>
	<script>
		var app5 = new Vue({
			el: '#app5',
			data: {
				type: 'name'
			},
			methods: {
				handleToggleClick: function() {
					this.type = this.type === 'name' ? 'mail' : 'name'
				}
			}
		})
	</script>
```
如果你不希望这样做，可以使用 Vue.js 提供的 `key` 属性，它可以让你自己决定是否要复用元素，`key`的值必须是唯一的。

```html
	<!-- vue condition reuse key -->
	<div id="app6">
		<template v-if="type === 'name'">
			<label>用户名：</label>
			<input placeholder="输入用户名" key="name-input">
		</template>
		<template v-else>
			<label>邮箱：</label>
			<input placeholder="输入邮箱" key="mail-input">
		</template>
		<button @click="handleToggleClick">切换输入类型</button>
	</div>
	<script>
		var app6 = new Vue({
			el: '#app6',
			data: {
				type: 'name'
			},
			methods: {
				handleToggleClick: function() {
					this.type = this.type === 'name' ? 'mail' : 'name'
				}
			}
		})
	</script>
```
给两个 `<input>` 元素都增加 `key` 后，就不会复用了，切换类型时键入的内容也会被删除，不过 `<label>` 元素仍然是被复用的，因为没有添加 `key` 属性。

####  v-show

`v-show` 的用法与 `v-if` 的用法基本一致，只不过 `v-show` 是改变元素的 CSS 属性 `display`。当 `v-show` 表达式的值为 `false` 时，元素会隐藏，查看 DOM 结构会看到元素上加载了内联样式 `display: none;`。

```html
	<!-- v-show -->
	<div id="app7">
		<p v-show="status === 1">当 v-show 的判断条件 <code>status === 1</code> 成立时显示该行</p>
		<button @click="handleToggleClick">切换 status</button>
	</div>
	<script>
		var app7 = new Vue({
			el: '#app7',
			data: {
				status: 1
			},
			methods: {
				handleToggleClick: function () {
					this.status = this.status === 1 ? 0 : 1
				}
			}
		})
	</script>
```
*在 Vue 中通常通过切换绑定数据来控制元素效果，在简单的 `toggle` 效果中，三元操作符是个很简洁的表达式。*

####  v-if 与 v-show 的选择

v-if 和 v-show 具有类似的功能，不过 v-if 才是真正的条件渲染，它会根据表达式适当地销毁或重建元素及绑定的事件或子组件。若表达式初始值为 false，则一开始元素/组件并不会渲染，只有当条件第一次变真时才开始编译。

而 v-show 只是简单的 CSS 属性切换，无论条件真假，都会被编译。相比之下 v-if 更适合条件不经常改变的场景，以为它切换开销相对较大，而 v-show 适用于频繁切换条件。

###  列表渲染指令 v-for

`<template>` 是 Vue 提供用来将多个元素包裹成一个组件并统一操作的。

*`v-for` 会对自身所在标签进行复制，所以当多个元素为一组进行复制时，需要用到 `<template>` 标签。*

`v-for` 可以迭代数组 `v-for="book in booksArray"`

迭代数组时提供可选参数 `index`，`v-for="(book, index) in booksArray"`。

`v-for` 可以迭代对象 `v-for="book in booksObject"`

迭代对象时提供可选参数 `index`，`key`，`v-for="(value, key, index) in booksObject"`

`v-for` 还可以迭代整数 `v-for="n in 10"`

####  数组更新

Vue  的核心是数据与视图的双向绑定，当我们修改数组时，Vue 会检测到数据变化，所以用 v-for 渲染的视图也会立即更新。Vue 包含了一组观察数组变异的方法，使用它们改变数组也会触发视图更新：

* push()
* pop()
* shift()
* unshift()
* splice()
* sort()
* reverse()

```javascript
app10.books[app10.books.length - 1] = 'altered'
console.log(app10.books)
```

可见直接修改并不会导致 Vue 实例数据变化，只有通过 Vue 允许的方法才能修改成功。

以下方法不会改变原数组：

* filter()
* concat()
* slice()

它们返回的是一个新数组，在使用这些非变异方法时，可以使用新数组来替换原来数组。

####  过滤与排序

当你不想改变原数组，向通过一个数组的副本来做过滤或排序的显示时，可以使用计算属性来返回过滤或排序后的数组。

### 方法与事件

####  基本用法

在 methods 中定义了我们需要的方法供 @click 调用，需要注意的是，@click 调用的方法名后可以不跟括号“()”。此时，如果该方法有参数，默认会将原生事件对象 event 传入。

这种在 HTML 元素上监听事件的设计看似将 DOM 与 JavaScript 紧耦合，违背分离的原理，实则刚好相反。因为通过 HTML 就可以知道调用的是哪个方法，将逻辑与 DOM 解耦，便于维护。最重要的是，当 ViewModel 销毁时，所有的事件处理器都会自动删除，无须自己清理。

Vue 提供了一个特殊变量 $event，用于访问原生 DOM 事件。

```html
<a href="http://www.apple.com" @click="handleClick('禁止打开', $event)">Open Link</a>
```

####  修饰符

`event.preventDefault()` 也可以用 Vue 事件的修饰符来实现，在 `@ `绑定的事件后加上点“.”，在跟一个后缀来使用修饰符。

* .stop 阻止（冒泡）传播
* .prevent 阻止默认行为
* .capture 捕获模式
* .self 仅限本身，子元素触发无效
* .once 只触发一次

在表单上监听键盘事件时，还可以使用按键修饰符，比如按下某个键时才调用方法。

```html
<!-- 只有在 keycode 是 13 时调用 vm.submit() -->
<input @keyup.13="submit">
```

也可以自己配置具体按键：

```javascript
Vue.config.keyCodes.f1 = 112
// 全局定义后，就可以使用 @keyup.f1 
```

除了具体的某个 keyCode 外，Vue 还提供了一些快捷名称，以下是全部的别名：

* .enter
* .tab
* .delete（捕获“删除”和“退格”键）
* .esc
* .space
* .up
* .down
* .left
* .right

这些按键修饰符也可以组合使用，或和鼠标一起配合使用：

* .ctrl
* .alt
* .shift
* .meta（Mac 下是 Command 键，Windows 下是窗口键）

```html
<!-- Shift + S -->
<input @keyup.shift.83="handleSave">
```

###  实战：利用计算属性、指令等知识开发购物车

需求：购物车需要展示一个已加入购物车的商品列表，包含商品名称、商品单价、购买数量和操作等信息，还需要实时显示购买的总价。其中购买数量可以增加或减少，每类商品还可以从购物车中移除。

这次采用将 HTML、CSS、JavaScript 分离的方式。

注意，要将 Vue.js 和 index.js 文件写在 `<body>` 的最底部，以防 DOM 没解析完无法创建 Vue 实例。除非通过异步或在事件 DOMContentLoaded（IE 是 onreadystatechange) 触发时再创建 Vue 实例，有点像 jQuery 的 $(document).ready() 方法。

*`<input>` 标签的 `disabled` 属性：*

>定义和用法
>
>disabled 属性规定应该禁用 input 元素。
>
>被禁用的 input 元素既不可用，也不可点击。可以设置 disabled 属性，直到满足某些其他的条件为止（比如选择了一个复选框等等）。然后，就需要通过 JavaScript 来删除 disabled 值，将 input 元素的值切换为可用。
>
>**注释：**disabled 属性无法与 `<input type="hidden">`  一起使用。