##  自定义指令

丰富的内置指令能满足我们的绝大部分业务需求，不过需要一些特殊功能时，我们仍然希望对 DOM 进行底层的操作，这时就要用到自定义指令。



###  基本用法

自定义指令的注册方式也分全局和局部。

```javascript
// 全局注册
Vue.directive('focus', {
    // options
})
```

```javascript
// 局部注册
var app = new Vue({
    el: '#app',
    directives: {
        focus: {
            // options
        }
    }
})
```

自定义指令的选项是由几个钩子函数组成的，每个都是可选的。

* bind：只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化操作。
* inserted：被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）
* update：被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
* componentUpdated：被绑定元素所在模板完成一次更新周期时调用。
* unbind：只调用一次，指令与元素解绑时调用。

根据需求在不同的钩子函数内完成逻辑代码。

```html
		<!-- customized directive -->
		<div id="app1">
			<input type="text" v-focus>
		</div>
		<script>
			Vue.directive('focus', {
				inserted: function (el) {
					// 聚焦元素
					el.focus()
				}
			})

			var app1 = new Vue({
				el: '#app1'
			})
		</script>
```

参数说明：

* el 指令所绑定的元素，可以用来直接操作 DOM。
* binding 一个对象，包含以下属性：
  * name 指令名，不包括 v- 前缀。
  * value  指令的绑定值，例如 v-my-directive="1+1"，value 值是 2。
  * oldValue 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  * expression 绑定值的字符串形式。例如 v-my-directive="1+1"，expression 的值是“1+1”
  * arg 传给指令的参数。例如 v-my-directive:foo，arg 的值是 foo。
  * modifiers 一个包含修饰符的对象啊。例如 v-my-directive.foo.bar，修饰符对象 modifiers 的值是 { foo: true, bar: true }
* vnode Vue 编译生成的虚拟节点
* oldVnode 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。 

```html
	<!-- directive binding -->
	<div id="app2">
		<hd></hd>
		<div v-test:msg.a.b="message"></div>
	</div>
	<script>
		Vue.directive('test', {
			bind: function(el, binding, vnode) {
				var keys = []
				for (var i in vnode) {
					keys.push(i)
				}
				el.innerHTML = 
					'name: ' + binding.name + '<br>' +
					'value: ' + binding.value + '<br>' +
					'expression: ' + binding.expression + '<br>' +
					'argument: ' + binding.arg + '<br>' +
					'modifiers: ' + JSON.stringify(binding.modifiers) + '<br>' +
					'vnode.keys: ' + keys.join(', ')
			}
		})

		var app2 = new Vue({
			el: '#app2',
			data: {
				message: 'some text'
			}
		})
	</script>
```
*modifiers 修饰符就是平时的 .stop 之类的。*

在大多数使用场景，我们会在 bind 钩子里绑定一些事件，比如在 document 上用 addEventListener 绑定，在 unbind 里用 removeEventListener 解绑，比较经典的就是让这个元素随着鼠标拖拽。

如果需要多个值，自定义指令也可以传入一个 JavaScript 对象字面量，只要是合法类型的 JavaScript 表达式都是可以的。

Vue 2.x 移除了大量 Vue 1.x 自定义指令的配置。在使用自定义指令时，应该充分理解业务需求，因为很多时候你需要的可能并不是自定义指令，而是组件。

###  实战

####  开发一个可从外部关闭的下拉菜单

效果：点击用户头像和名称，会弹出一个下拉菜单，然后点击页面中其他空白区域（除了菜单本身外），菜单就关闭了。

之前分析过，要在 document 上绑定 click 事件，所以在 bind 钩子内声明了一个函数 documentHandler，并将它作为句柄绑定在 document 的 click 事件上。documentHandler 函数做了两个判断，第一个是判断点击的区域是否是指令所在的元素内部，如果是，就跳出函数，不往下继续执行。

使用 `el.__vueClickOutside__` 引用 `documentHandler` ，这样就可以在 unbind 钩子里移除对 document 的 click 事件监听。如果不移除，当组件或元素销毁时，它仍然存在于内存中。

```html
	<!-- Close up menu -->
	<div id="app4" v-cloak>
		<div class="main" v-clickoutside="handleClose">
			<button @click="show = !show">点击显示下拉菜单</button>
			<div class="dropdown" v-show="show">
				<p>下拉框的内容，点击外面区域可以关闭</p>
			</div>
		</div>
	</div>
	<script src="clickoutside.js"></script>
	<script src="index.js"></script>
```
```javascript
Vue.directive('clickoutside', {
	// 为什么要传参数 vnode，后面都没有用到？
	// 在 handleClose() 时，不传也没事，可能是为了普适性。
	bind: function (el, binding, vnode) {
		function documentHandler (e) {
			if (el.contains(e.target)) {
				// 事件回调函数返回 false 就是什么都不做，且会跳过后面的步骤，不再隐藏。
				return false
			}
			if (binding.expression) {
				// 为什么要传参数 e，handleClose() 是无参的？
				// 事实证明在这个 handleClose() 时，不传也没事，可能是为了普适性。
				binding.value(e)
			}
		}
		el.__vueClickOutside__ = documentHandler
		document.addEventListener('click', documentHandler)
	},
	// 这个 unbind 是什么时候解除的？
	// DOM 元素销毁时使用，如不销毁，则仍存留在内存中。
	unbind: function (el, binding) {
		document.removeEventListener('click', el.__vueClickOutside__)
		delete el.__vueClickOutside__
	}
})
```

```javascript
var app = new Vue({
	el: '#app4',
	data: {
		show: false
	},
	methods: {
		handleClose: function () {
			this.show = false
		}
	}
})
```

*以上总结，稍带全局行为的操作就可以用指令表示。组件和实例无能为力的那种。*