##  组件详解

组件（Component）是 Vue.js 的核心功能，也是整个框架设计最精彩的地方，当然也是最难掌握的。

### 组件与复用

####  为什么使用组件

*利于复用呗，人尽皆知～*

####  组件用法

组件与 Vue 实例类似，需要注册后才可以使用。分全局注册和局部注册，全局注册后，任何 Vue 实例都可以使用。

全局注册：

```javascript
Vue.component('my-component', {
    // options
})
```

自定义组件标签名称推荐使用小写加连字符分隔形式命名。

P78

要在父实例中使用这个组件，必须先注册再创建实例。

*而且注册组件时必须定义 `template` 属性，否则调用时会报错。即使后来注册了同名的且带 `template` 属性的组件都不会正确显示。*

```html
	<!-- my-component example -->
	<div id="app1">
		<my-component></my-component>
	</div>
	<script>
		Vue.component('my-component', {
			template: "<div>这里是组件的内容</div>"
		})

		var app1 = new Vue({
			el: '#app1'
		})
	</script>
```
`template` 的 DOM 结构必须被一个元素包含，如果直接写成“这里是组件的内容”，不带 `<div></div>` 是无法渲染的。

注册局部组件的话，就在对应的 Vue 实例下，使用 `components` 选项注册。注册后的组件只在该实例作用域下有效。组件中也可以使用 `components` 选项来注册组件，使组件可以嵌套。

Vue 组件的模板在某些情况下会受到 HTML 的限制，比如 `<table>` 内规定只允许是 `<tr>`、`<td>`、`<th>` 等这些表格元素，所以在 `<table>` 内直接使用组件是无效的。这种情况下，可以使用特殊的 `is` 属性来挂载组件。

```html
	<!-- component is -->
	<div id="app2">
		<p>app2:</p>
		<table>
			<tbody is="my-component"></tbody>
		</table>
	</div>
	<script>
        // 'my-component 的定义已在上文'
		var app2 = new Vue({
			el: "#app2"
		})
	</script>
```
> 如果使用的是字符串模板，是不受限制的，比如后面会介绍的 .vue 单文件用法等。

`tbody` 在渲染时，会被替换为组件的内容。常见的限制元素还有 `<ul>`、`<ol>`、`select`。

除了 `template` 选项外，组件中还可以像 Vue 实例那样使用其他的选项，比如 `data`、`computed`、`methods` 等。使用 `data` 时，和实例稍有区别，`data` 必须是函数，然后将数据 `return` 出去。

```html
	<!-- component data -->
	<div id="app3">
		<p>app3:</p>
		<my-component3></my-component3>
	</div>
	<script>
		Vue.component('my-component3', {
			template: '<div> {{ message }} </div>',
			data: function () {
				return {
					message: '组件内容'
				}
			}
		})
		var app3 = new Vue({
			el: '#app3'
		})
	</script>
```
JavaScript 对象是引用关系，所以如果 return 出的对象引用了外部的一个对象，那这个对象就是共享的，任何一方修改都会同步。

```html
		<!-- component reference -->
		<div id="app4">
			<headshot></headshot>
			<my-component4></my-component4>
			<my-component4></my-component4>
			<my-component4></my-component4>
		</div>
		<script>
			var outterData = {
				count: 4
			}

			Vue.component("headshot", {
				template: "<p>count:{{ count }}</p>",
				data: function () {
					return outterData 
				}
			})

			Vue.component("my-component4", {
				template: '<button @click="count++">{{ count }}</button>',
				data: function () {
					return outterData
				}
			})

			var app4 = new Vue({
				el: '#app4'
			})
		</script>
```

独立数据：

```html
	<!-- independent data -->
	<div id="app5">
		<p>app5:</p>
		<my-component5></my-component5>
		<my-component5></my-component5>
		<my-component5></my-component5>
	</div>
	<script>
		Vue.component('my-component5', {
			template: '<button @click="count++">{{ count }}</button>',
			data : function () {
				return {
					count: 0
				}
			}
		})

		var app5 = new Vue({
			el: '#app5'
		})
	</script>
```
###  使用 props 传递数据

####  基本用法

父组件向子组件传递数据的过程通过 `props` 来实现。

在组件中，使用选项 `props` 声明需要从父级接收的数据。

`props` 的值可以是两种，字符串数组和对象。

*在组件中使用 `props` 传递数据，达成类似实例中 `data` 的效果，至于组件的 `data` 是干嘛的，具体区别还得往后学。*

*props 中声明的数据主要来自父级，而 data 函数中的数据是组件自己的数据。这两种数据都可以在模板 template 及计算属性 computed 和方法 methods 中使用。*

**一个组件的 `data` 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝。**

*<a href="#a1">&delta;</a> 究竟谁是父组件，谁是子组件？*

*<span id="a1">&Delta;</span> 因为 Vue 实例一般挂载在组件的父元素上，所以数据的传递方向是从 Vue 实例流向组件，故 Vue 实例是父组件，模板组件为子组件。如果是静态属性，那么模板组件通常由组件标签解析而来，在层次上，解析出来的整体仍可以看做内部子组件。*

**因为组件是可复用的 Vue 实例，所以它们与 `new Vue` 接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。仅有的例外是像 `el` 这样根实例特有的选项。**

**Prop 是你可以在组件上注册的一些自定义 attribute。当一个值传递给一个 prop attribute 的时候，它就变成了那个组件实例的一个属性。**

```html
	<!-- static props -->
	<div id="app6">
		<p>app6:</p>
		<my-component6 message="来自父元素的静态数据"></my-component6>
	</div>
	<script>
		Vue.component('my-component6', {
			props: ['message'],
			template: '<div>{{ message }}</div>'
		})
		var app6 = new Vue({
			el: '#app6'
		})
	</script>
```
由于 HTML 特性不区分大小写，当使用 DOM 模板时，驼峰命名（camelCase）的 props 名称要转为短横分隔命名（kebab-case）。

```html
	<!-- kebab-case Component -->
	<div id="app7">
		<p>app7:</p>
		<my-component7 warning-text="提示信息"> </my-component7>
	</div>
	<script>
		Vue.component('my-component7', {
			props: ['warningText'],
			template: '<div>{{ warningText }}</div>'
		})

		var app7 = new Vue({
			el: '#app7'
		})
	</script>
```
动态传递数据：

```html
		<div id="app8">
			<p>app8:</p>
			<input type="text" v-model="parentMessage">
			<my-component8 :message="parentMessage"> </my-component8>
		</div>
		<script>
			Vue.component('my-component8', {
				props: ['message'],
				template: '<div>{{ message }}</div>'
			})

			var app8 = new Vue({
				el: '#app8',
				data: {
					parentMessage: ''
				}
			})
		</script>
```

*对于组件，必须有 Vue 实例挂载在其父元素上，才能使组件生效。*

*动态通过 v-bind 绑定组件 props 属性传递数据时，跟实例平时用 v-bind 绑定普通标签属性用法没什么两样。*

注意，如果直接传递数字、布尔值、数组、对象，而且不使用 v-bind，传递的仅仅是字符串。

*如果要直接传字面值，加个 v-bind 就好。*

####  单向数据流

Vue 2.x 通过 props  传递数据是单向的了，只能从父组件传递给子组件。业务中会经常遇到两种需要改变 props 的情况，一种是父组件传递初始值进来，子组件将它作为初始值白存起来，在自己的作用域下可以随意使用和修改。这种情况可以在组件 data 内再声明一个数据，引用父组件的 prop。

```html
	<!-- Props as init data -->
	<div id="app10">
		<p>app10:</p>
		<my-component10 :init-count="appCount"> </my-component10>
		<p>appCount: {{ appCount }}</p>
	</div>
	<script>
		Vue.component('my-component10', {
			props: ['initCount'],
			template: '<div @click="count++">componentCount: {{ count }}</div>',
			data: function () {
				return {
					count: this.initCount
				}
			}
		})

		var app10 = new Vue({
			el: '#app10',
			data: {
				appCount: 1
			}
		})
	</script>
```
这样就可以只维护组件 `count`  避免了直接操作 `initCount` 。

另一种情况是 prop 作为需要被转变的原始值传入。这种情况用计算属性就可以了。

```html
	<!-- Props as init data -->
	<div id="app10">
		<p>app10:</p>
		<my-component10 :init-count="appCount"> </my-component10>
		<p>appCount: {{ appCount }}</p>
	</div>
	<script>
		Vue.component('my-component10', {
			props: ['initCount'],
			template: '<div @click="count++">componentCount: {{ count }}</div>',
			data: function () {
				return {
					count: this.initCount
				}
			}
		})

		var app10 = new Vue({
			el: '#app10',
			data: {
				appCount: 1
			}
		})
	</script>
```
> 注意，在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，所以 props 是对象和数组时，在子组件内改变是会影响父组件的。

####  数据验证

props 除了数组外，还可以是对象。当 prop 需要验证时，就需要对象写法。

一般当你的组件需要提供给别人使用时，推荐都进行数据验证，比如某个数据必须是数字类型，如果传入字符串，就会在控制台弹出警告。

```html
		<!-- Props validation -->
		<div id="app12">
			<my-component12 :prop-a="1" prop-b="ccc" :prop-c="false" :prop-d="7" :prop-e="[3, 4, 5]" :prop-f="12"> </my-component12>
			<!-- <my-component12 prop-a="'1'" prop-b="333" prop-c="false" prop-e="[3, 4, 5]" prop-f="9"> </my-component12> -->
		</div>
		<script>
			Vue.component('my-component12', {
				template: '<div></div>',
				props: {
					// 必须是数字类型
					propA: Number,
					// 必须是字符串或数字类型
					propB: [String, Number],
					// 布尔值，如果没有定义，默认值是 true
					propC: {
						type: Boolean,
						default: true
					},
					// 数字，而且是必需
					propD: {
						type: Number,
						required: true
					},
					// 如果是数组或对象，默认值必须是一个函数来返回
					propE: {
						type: Array,
						default: function () {
							return []
						}
					},
					// 自定义一个验证函数
					propF: {
						validator: function (value) {
							return value > 10
						}
					}
				}
			})

			var app12 = new Vue({
				el: '#app12'
			})
		</script>
```
验证的 type 类型可以是：

* String
* Number
* Boolean
* Object
* Array
* Function

type 也可以是一个自定义构造器，使用 instanceof 检测。

当 prop 检测失败时，在开发版本下会在控制台抛出一条警告。

###  组件通信

组件短息可分为：父子组件通信、兄弟组件通信、跨级组件通信。

####  自定义事件

当子组件需要向父组件传递数据时，就要用到自定义事件。

v-on 除了监听 DOM 事件外，还可以用于组件之间的自定义事件。

类似 JavaScript 设计模式中的观察者模式里的 dispatchEvent 和 addEventListener 这两个方法。Vue 组件也有一套类似模式，子组件用 \$emit() 来触发事件，父组件用 \$on 来监听子组件的事件。

父组件也可以直接在子组件的自定义标签上使用 v-on 来监听子组件触发的自定义事件。

```html
	<!-- $emit() $on() -->
	<div id="app13">
		<p>app13:</p>
		<p>total: {{ total }}</p>
		<my-component13
			@increase="handleGetTotal"
			@reduce="handleGetTotal"></my-component13>
	</div>
	<script>
		Vue.component('my-component13', {
			template: '<div>\
						<button @click="handleIncrease">+1</button>\
						<button @click="handleReduce">-1</button>\
						</div>',
			data: function () {
				return {
					counter: 0
				}
			},
			methods: {
				handleIncrease: function () {
					this.counter++
					this.$emit('increase', this.counter)
				},
				handleReduce: function () {
					this.counter--
					this.$emit('reduce', this.counter)
				}
			}
		})

		var app13 = new Vue({
			el: '#app13',
			data: {
				total: 0
			},
			methods: {
				handleGetTotal: function (total) {
					this.total = total
				}
			}
		})
	</script>
```
*父传子用 props，子传父用 `$emit()`，父同时 `$on()` 也就是 `@customizedEvent`。父传子和子传父都得在组件属性上动手。*

`$emit()` 第一个参数是自定义事件的名称，`@` 监听的也是自定义事件的名称。

除了用 v-on 在组件上监听自定义事件外，也可以监听 DOM 事件，这时可以用 .native 修饰符表示监听的是一个原生事件，监听的是该组件的根元素。

```html
<my-component v-on:click.native="handleClick"></my-component>
```

####  使用 v-model 

Vue 2.x 可以在自定义组件上使用 v-model 指令。

```html
	<!-- v-model on component -->
	<div id="app14">
		<p>app14:</p>
		<p>{{ total }}</p>
		<my-component14 v-model="total"></my-component14>
	</div>
	<script>
		Vue.component('my-component14', {
			template: '<button @click="handleClick">+1</button>',
			data: function () {
				return {
					count: 0
				}
			},
			methods: {
				handleClick: function () {
					this.count++
					this.$emit('input', this.count)
				}
			}
		})
		
		var app14 = new Vue({
			el: '#app14',
			data: {
				total: 0
			}
		})
	</script>
```
这次 `$emit()` 事件名是特殊的 `input`，在使用组件的父级，并没有在 `<my-component14>` 上使用 `@input="handler"` ，而是直接使用了 `v-model` 绑定的一个数据 `total`。

*相当于调用和触发的是原生事件，处理的函数是 Vue 内部对 input 绑定的函数，并实时更新到与 input 相对应的 v-model 上。*

v-model 还可以用来创建自定义的表单输入组件，进行数据双向绑定。

```html
	<!-- v-model bidirectional communication -->
	<div id="app15">
		<p>app15:</p>
		<p>{{ total }}</p>
		<my-component15 v-model="total"></my-component15>
		<button @click="handleReduce">-1</button>
	</div>
	<script>
		Vue.component('my-component15', {
			props: ['value'],
			template: '<input :value="value" @input="updateValue">',
			methods: {
				updateValue: function (event) {
					this.$emit('input', event.target.value)
				}
			}
		})
		
		var app15 = new Vue({
			el: '#app15',
			data : {
				total: 0
			},
			methods: {
				handleReduce: function () {
					this.total--
				}
			}
		})
	</script>
```
实现这样一个具有双向绑定的 v-model 组件要满足下面两个条件：

1. 接收一个 value 属性。
2. 在有新的 value 时触发 input 事件。

####  非父子组件通信

实际业务中还有很多非父子组件通信的场景，非父子组件一般有两种，兄弟组件和跨多级组件。

*箭头函数立马执行的语法：*

```javascript
(() => {
    // codes
}) ()
```

*插播一组 heading 的设计*

```html
	<!-- heading -->
	<div id="app16">
		<hd></hd>
	</div>
	<div id="app17">
		<hd></hd>
	</div>
	<script>
		(() => {
			var hcount = {
				count: 16
			}

			Vue.component('hd', {
				template: '<p>app{{countPlus}}:</p>',
				data : function () {
					return hcount
				},
				computed: {
					countPlus: function () {
						return this.count++
					}
				}
			})
		}) ()

		var app16 = new Vue({
			el: '#app16'
		})

		var app17 = new Vue({
			el: '#app17'
		})
	</script>
```
*以上写法是有漏洞的，当 `<hd>` 只有一组时，没有问题。但是两组或以上时，后面组件的 `computed` 中的 `countPlus` 会触发之前组件中 `computed` 的更新，之前也会造成之后的更新，造成无限循环。*

*解决方案是在模板标签中添加只渲染一次的指令。`'<p v-once>app{{countPlus}}:</p>'`*

*使用箭头函数并立即执行，能保证 `hcount` 不泄漏，不被意外修改。*

Vue.js 1.x 中，除了 \$emit() 方法外，还提供了 \$dispatch() 和 \$broadcast() 这两个方法。\$dispatch() 用于向上级派发事件，只要是它的父级（一级或多级以上），都可以在 Vue 实例的 events 选项内接收。

同理，\$broadcast() 是由上级向下级广播事件的，用法完全一致，只是方向相反。

这两种方法一旦发出事件后，任何组件都是可以接收到的，就近原则，而且会在第一次到后停止冒泡，除非返回 true。

这两个方法在 Vue.js 2.x 中都废弃了，因为基于组件树结构的事件流方式让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱，并且不能解决兄弟组件通信的问题。

在 Vue.js 2.x 中，推荐使用一个空的 Vue 实例作为中央事件总线（bus），也就是一个中介。

```html
	<script>
		var bus = new Vue()

		Vue.component('component-a', {
			template: '<button @click="handleEvent">传递事件</button>',
			methods: {
				handleEvent: function () {
					bus.$emit('on-message', '来自组件 component-a 的内容')
				}
			}
		})
		
		Vue.component('component-b', {
			template: '<p @on-message="receiveMessage">{{ msg }}</p>',
			data: function () {
				return {
					msg: 'Component-b original text'
				}
			},
			methods: {
				receiveMessage: function (msg) {
					console.log("executed")
					this.msg = msg
				}
			}
		})

		Vue.component('component-c', {
			template: '<p>{{ msg }}</p>',
			data: function () {
				return {
					msg: 'Component-c original text'
				}
			},
			mounted: function () {
				_this = this
				bus.$on('on-message', function (msg) {
					_this.msg = msg
				})
			}
		})

		var app16 = new Vue({
			el: '#app16'
		})
	</script>
```
*由上可见，@customizedEvent 这样的语法只能用在父子组件传递信息上。*

这种方法巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级，且 Vue 1.x 和 Vue 2.x 都适用。

如果深入使用，可以扩展 bus 实例，给它添加 data、methods、computed 等选项，这些都是公用的。在业务中，尤其在协同开发时非常有用，因为经常需要共享一些通用的信息，比如用户登录的昵称、性别、邮箱等，还有用户的授权 token 等。只需在初始化时让 bus 获取一次，任何时间、任何组件都可以从中直接使用了，在单页面富应用（SPA）中会很实用，我们会在进阶篇里逐步介绍这些内容。

当项目大，更多人协同开发时，也可以选择更好的状态的管理解决方案 vuex，进阶篇会详细提到。

除了中央事件总线 bus 外，还有两种方法可以实现组件间通信：父链和子组件索引。

P92

####  父链

在子组件中，使用 this.\$parent 可以直接访问该组件的父实例或组件，父组件也可以通过 this.\$children 访问它所有的子组件，而且可以递归向上或向下无限访问，直到根实例或最内层的组件。

```html
	<!-- parent chain -->
	<div id="app17">
		<hd></hd>
		<p>{{ message }}</p>
		<my-component17></my-component17>
	</div>
	<script>
		Vue.component('my-component17', {
			template: '<button @click="handleClick">通过父链修改数据</button>',
			methods: {
				handleClick: function () {
					this.$parent.message = '来自组件 my-component17 的内容'
				}
			}
		})

		var app17 = new Vue({
			el: '#app17',
			data: {
				message: '原本父组件的数据'
			}
		})
	</script>
```
在业务中，子组件应尽可能地避免依赖父组件的数据，更不应该取主动修改它的数据，因为这样使得父子组件紧耦合，只看父组件，很难理解父组件的状态，以为它可能被任意组件修改。理想情况下，只要组件自己能修改它的状态，父子组件最好还是通过 props 和 $emit 来通信。

####  子组件索引

当子组件较多时，通过 this.$children 来一一遍历出我们需要的一个组件实例是比较困难的，尤其是组件动态渲染时，它们的序列是不固定的。

Vue 提供子组件索引的方法，用特殊的属性 ref 来为子组件指定一个索引名称。

```html
	<!-- children component reference -->
	<div id="app18">
		<hd></hd>
		<p>{{ msg }}</p>
		<button @click="handleClick">通过子组件索引获取数据</button>
		<my-component18 ref="com18"> </my-component18>
	</div>
	<script>
		Vue.component('my-component18', {
			template: '<div>子组件</div>',
			data: function () {
				return {
					message: '子组件的信息'
				}
			}
		})

		var app = new Vue({
			el: '#app18',
			data: {
				msg: '父组件的文本'
			},
			methods: {
				handleClick: function () {
					this.msg = this.$refs.com18.message
				}
			}
		})
	</script>
```
在父组件模板中，子组件标签上使用 ref 指定一个名称，并在父组件内通过 this.$refs 来访问指定名称的子组件。

> \$refs 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案，应当避免在模板或计算属性中使用 \$refs。

*说到底父传子还是推荐用 props；子传父还是推荐用 \$emit() $on()；父子双向 v-model 也行；非父子就用总线。*

###  使用 slot 分发内容

Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自 Web Components 规范草案，将 `<slot>` 元素作为承载分发内容的出口。

####  什么是 slot

当需要让组件组合使用，混合父组件的内容与子组件的模板时，就会用到 slot，这个过程叫作内容分发（transclusion）。它有两个特点：

* 组件不知道它的挂载点会有什么内容。挂载点的内容是由父组件决定的。
* 组件很可能有自己的模板

####  作用域

编译的作用域能使我们明白什么变量仅在本组件中调用，什么变量是共用的。

slot 的官方中文名是插槽。

```html
<child-component>
	{{ message }}
</child-component>
```

这里的 message 就是一个 slot，但是它绑定的是父组件的数据，而不是组件 \<child-component> 的数据。

父组件模板的内容是在父组件作用域内编译，子组件模板的内容是在子组件作用域内编译。

```html
		<!-- slot domain -->
		<div id="app19">
			<hd></hd>
			<my-component19 v-show="showValue"></my-component19>
			<my-component19b></my-component19b>
			<p>这里是第三行</p>
		</div>
		<script>
			Vue.component('my-component19', {
				template: '<div>\
							<p>这里是第一行</p>\
							</div>',
				data : function () {
					return {
						showValue: true,
					}
				}
			})

			Vue.component('my-component19b', {
				template: '<div>\
							<p v-show="showValue2"> 这里是第二行 </p>\
							</div>',
				data : function () {
					return {
						showValue2: true
					}
				}
			})

			var app19 = new Vue({
				el: '#app19',
				data: {
					showValue: false,
					showValue2: false
				}
			})
		</script>
```
*上面的哪个值对应哪个组件显示，足以说明作用域的划分。*

**因此，slot 分发的内容，作用域是在父组件上的。**

####  slot 用法

#####  单个 Slot 

**在子组件内使用特殊的 \<slot> 元素就可以为这个子组件开启一个 slot （插槽），在父组件模板里，插入在子组件标签内的所有内容将替代子组件的 \<slot> 标签及它的内容。**

*以上是 slot 的基本用法及意义，用来在组件内嵌入来自父组件的内容，避免组件过于零碎化。*

*组件的内容大多数由父组件主导，因为组件定位是将重复的内容复用，但是独有的内容才是主要价值，所以才造就了由父组件主导的设计。*

```html
	<!-- single slot -->
	<div id="app20">
		<hd></hd>
		<my-component20>
			<p> 分发的内容</p>
			<p> 还有一行 </p>
		</my-component20>
	</div>
	<script>
		Vue.component('my-component20', {
			template: '\
			<div>\
				以下是 Slot 内容\
				<slot>\
					<p> 如果父组件没有插入内容，我将作为默认内容出现。</p>\
				</slot>\
			</div>'
		})

		var app20 = new Vue({
			el: '#app20',
		})
	</script>
```
*变着法儿从父组件传信息进来。*

子组件的模板内定义了一个 \<slot> 元素，并且用一个 \<p> 作为默认的内容，在父组件没有使用 slot 时，会渲染这段默认的文本：如果写入了 slot，那就会替换整个 \<slot> 。

子组件 \<slot> 内的备用内容，它的作用域是子组件本身。

插槽内可以包含任何模板代码，包括 HTML，甚至它的组件。

如果组件中没有包含 \<slot> 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

####  具名 slot 

具名 slot 用法在 Vue 2.6 版本更新了，废弃了 `slot` attribute，新增了 `name` attribute。

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：

```html
<div class="container">
    <header>
        <!-- 这里放页头 -->
    </header>
    <main>
        <!-- 这里放主要内容 -->
    </main>
    <footer>
        <!-- 这里放页脚 -->
    </footer>
</div>
```

`<slot>`  元素有一个特殊的 attribute：`name` 来应对这种情况。这个 attribute 可以用来定义额外的插槽：

```html
<div class="container">
    <header>
        <slot name="header"></slot>
    </header>
    <main>
        <slot></slot>
    </main>
    <footer>
        <slot name="footer"></slot>
    </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

*这样就很容易区分哪些内容是那个 `<slot>` 的，以免父组件的所有填充都塞到一个 `<slot>` 里面去。*

```html
	<!-- named slots -->
	<div id="app22">
		<hd></hd>
		<my-component22>
			<template v-slot:header>
				<h1>Here might be a page title</h1>
			</template>

			<p>A paragragh for the main content</p>
			<p>And another one</p>

			<template v-slot:footer>
				<p> Here's some contact info<p>
			</template>
		</my-component22>
	</div>
	<script>
		Vue.component('my-component22', {
			template: '<div class="container">\
							<header>\
								<slot name="header"></slot>\
							</header>\
							<main>\
								<slot></slot>\
							</main>\
							<footer>\
								<slot name="footer"></slot>\
							</footer>\
						</div>'
		})
		
		var app22 = new Vue({
			el: '#app22'
		})
	</script>
```
任何没有被包裹在 `v-slot` 的 `<template>` 中的内容都会被视为默认插槽的内容。

然而，如果你希望更明确一些，仍然可以在一个 `<template>` 中包裹默认插槽的内容。

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

注意 `v-slot` 只能添加在 `template` 上（只有一种例外情况，独占默认插槽）。

####  作用域插槽

> slot-scope attribute 的语法已被废弃

作用域插槽是一种特殊的 slot，使用一个可以复用的模板替换已渲染元素。有时让插槽内容能够访问子组件才有的数据是很有用的。

> 作用域插槽的内容采用[官网教程](https://cn.vuejs.org/v2/guide/components-slots.html)

```html
	<!-- domain slot -->
	<div id="app21">
		<hd></hd>
		<my-component21>
			<template v-slot:default="slotProps">
				{{ slotProps.user.firstName }}
			</template>
		</my-component21>
	</div>
	<script>
		Vue.component('my-component21', {
			template: '\
			<span>\
				<slot :user="user">\
					{{ user.lastName }}\
				</slot>\
			</span>',
			data: function () {
				return {
					user: {
						firstName: 'Maer',
						lastName: 'Chan'
					}
				}
			}
		})

		var app21 = new Vue({
			el: '#app21'
		})
	</script>
```
为了让 `user` 在父级插槽内容可用，我们可以将 `user` 作为 \<slot> 元素的一个 attribute 绑定上去。`<slot :user="user">\`

绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop** 。在父级作用域中，可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```html
		<my-component21>
			<template v-slot:default="slotProps">
				{{ slotProps.user.firstName }}
			</template>
		</my-component21>
```

*好奇的是为什么它要再写出一个 `<template>` 标签，去除了也是有效。*

```html
	<my-component21 v-slot:default="slotProps">
			{{ slotProps.user.firstName }}
	</my-component21>
```
*这是上一节具名插槽我看漏了的内容，上一节提到 `v-slot` 只能用在 `<template>` 标签上，除了了一种特殊情况，就是“独占默认插槽的缩写语法”情况。刚好上面那段代码就是这种特殊情况。*

####  独占默认插槽的缩写语法

当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。

```html
		<!-- default slot -->
		<div id="app23">
			<hd></hd>
			<my-component23 v-slot:default='slotProps'>
				{{ slotProps.userAttr.firstName }}
			</my-component23>
			<my-component23 v-slot="slotProps">
				{{ slotProps.userAttr.thirdName }}
			</my-components>
		</div>
		<script>
			Vue.component('my-component23', {
				template: '<span>\
								<slot :user-attr="user">\
									{{ user.lastName }}\
								</slot>\
							</span>',
				data: function () {
					return {
						user: {
							firstName: 'Maer',
							lastName: 'Chan',
							thirdName: 'BigHead'
						}
					}
				}
			})
	
			var app23 = new Vue({
				el: '#app23'
			})
		</script>
```
*在模板中绑定数据的时候，属性名采用 kebab-case 烤肉串式，因为 html 不区分大小写。但是有一点奇怪的，我写成 `userattr` 它认不出来，`userAttr` 倒认得出来。*

注意默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确。

只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法。

####  解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：

```javascript
function (slotProps) {
    // 插槽内容
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以在支持的环境下（单文件组件或现代浏览器），你也可以使用 ES2015（ES6） 解构来传入具体的插槽 Prop：

```html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 `user` 重命名为 `person`：

```html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：

```html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

*不太懂解构的用处，这好像和 JavaScript 的解构赋值不一样。*

*懂了！和 JavaScript 的解构赋值一样！解构了 `v-slot="{ user }"` 后，在引用时，不用再指定 `user.user.firstName` 形式的，而是直接 `user.firstName`。*

*现在来验证多 Props 情况。*

```html
		<!-- multiple props & destruct prop -->
		<div id="app24">
			<hd></hd>
			<my-component24>
				<template #info="infos">
					Man: {{ infos.manProp.name }}, {{ infos.manProp.age }} <br/>
					Company: {{ infos.companyProp.name }}, {{ infos.companyProp.address }} <br/>
					Car: {{ infos.carProp.brand }}, {{ infos.carProp.price }}
				</template>
			</my-component24>
			<br/>
			<my-component24>
				<template #info="{manProp, companyProp, carProp}">
					Man: {{ manProp.name }}, {{ manProp.age }} <br/>
					Company: {{ companyProp.name }}, {{ companyProp.address }} <br/>
					Car: {{ carProp.brand }}, {{ carProp.price }}
				</template>
			</my-component24>
		</div>
		<script>
			Vue.component('my-component24', {
				template: '<div>\
								<slot name="info" :man-prop="man" :company-prop="company" :car-prop="car"></slot>\
							</div>',
				data: function () {
					return {
						man: {
							name: 'Faker',
							age: 23
						},
						company: {
							name: 'SK Telecom T1',
							address: 'South Korea'
						},
						car: {
							brand: 'benz',
							price: '10$'
						}
					}
				}
			})
	
			var app24 = new Vue({
				el: '#app24'
			})
		</script>
```

*`<template #info="infos">` 不仅指定了 `<slot>` 还将其所有的 `Props` 赋予在 `infos` 对象上。要在父组件引用 `Props` 就要通过它在子组件的 `<slot>` 上绑定的属性名来引用。*

*所以要将多个 Props 解构的话，就要参考 ES6 的 [变量的解构赋值](http://es6.ruanyifeng.com/#docs/destructuring) 中“对象的解构赋值”一节。在父组件解构时，承接的变量名应与 `Props` 在子组件 `<slot>` 中的绑定属性名一致。这一点是和 ES6 的对象解构语法一致的。 *

###  动态插槽名

2.6.0 新增内容

[动态指令参数]([https://cn.vuejs.org/v2/guide/syntax.html#%E5%8A%A8%E6%80%81%E5%8F%82%E6%95%B0](https://cn.vuejs.org/v2/guide/syntax.html#动态参数))（2.6.0 新增）也可以用在 `v-slot` 上，来定义动态的插槽名：

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

###  具名插槽的缩写

v-slot 的缩写成为了我所学的 Vue 的第三个语法糖。把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`。

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

```html
<!-- 这样会触发一个警告 -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：`#default="{ user }"`

###  其他示例

**插槽 Prop 允许我们将插槽转换为可复用的模板，这些模板可以基于输入的 prop 渲染出不同的内容。**

这在设计封装数据逻辑同时允许父级组件自定义部分布局的可复用组件时是最有用的。

详细回看[官方教程]([https://cn.vuejs.org/v2/guide/components-slots.html#%E5%85%B6%E5%AE%83%E7%A4%BA%E4%BE%8B](https://cn.vuejs.org/v2/guide/components-slots.html#其它示例))。

###  动态组件 & 异步组件

####  动态组件基础

[动态组件基础教程]([https://cn.vuejs.org/v2/guide/components.html#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6](https://cn.vuejs.org/v2/guide/components.html#动态组件))

有时候在不同组件之间进行动态的切换是非常有用的，比如在一个多标签的界面里。

上述内容可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

上述示例中，`currentTabComponent` 包括

* 已注册组件的名字
* 一个组件的选项对象

请留意，这个 attribute 可以用于常规 HTML 元素，但这些元素将被视为组件，这意味着所有的 attribute 都会作为 DOM attribute 被绑定。

对于像 `value` 这样的 property，若想让其如预期般工作，你需要使用 `.prop` 修饰器。

**一个组件只允许拥有一个根实例。**

[[Vue动态组件](https://www.cnblogs.com/xiaohuochai/p/7395694.html)](https://www.cnblogs.com/xiaohuochai/p/7395694.html)

教程[样例代码](https://jsfiddle.net/chrisvfritz/o3nycadu/)（需要全局代理翻墙）：

```html
<script src="https://unpkg.com/vue"></script>

<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['tab-button', { active: currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>

  <component
    v-bind:is="currentTabComponent"
    class="tab"
  ></component>
</div>
```

```javascript
Vue.component('tab-home', { 
	template: '<div>Home component</div>' 
})
Vue.component('tab-posts', { 
	template: '<div>Posts component</div>' 
})
Vue.component('tab-archive', { 
	template: '<div>Archive component</div>' 
})

new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
```

```css
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
```

*和样例代码比起来，我的就相形见绌了。*

```html
	<!-- Dynamic component using is attribute -->
	<style>
		.tab {
			height: 1.5em;
			width: 100px;
			float: left;
		}
		.tabContainer { 
			overflow: hidden;
		}
	</style>
	<div id="app25">
		<hd></hd>
		<div class="tabContainer">
			<div class="tab" @click="clickA">Component1</div>
			<div class="tab" @click="clickB">Component2</div>
		</div>
		<component :is="activeComponent"></component>
	</div>
	<script>
		Vue.component('my-component25a', {
			template: '<p>my-component25a text</p>'
		})
		Vue.component('my-component25b', {
			template: '<p>my-component25b text</p>'
		})
		var app25 = new Vue({
			el: '#app25',
			data: {
				activeComponent: 'my-component25a'
			},
			methods: {
				clickA: function () {
					this.activeComponent = 'my-component25a'
				},
				clickB: function () {
					this.activeComponent = 'my-component25b'
				}
			}
		})
	</script>
```
####  深入动态组件

使用 `<component :is>` 的情况下，当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题。

你会注意到，如果你选择了一篇文章，切换到 Archive 标签，然后再切换回 Posts，是不会继续展示你之前选择的文章的。这是因为你每次切换新标签的时候，Vue 都创建了一个新的 `currentTabComponent` 实例。

重新创建动态组件的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。为了解决这个问题，我们可以用一个 `<keep-alive>` 元素将其动态组件包裹起来。

其动态组件包裹起来。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

> 注意这个 `<keep-alive>` 要求被切换到的组件都有自己的名字，不论是通过组件的 `name` 选项还是局部/全局注册。

```html
		<div id="app26">
			<hd></hd>
			<button v-for="tab in tabs" @click="handleClick(tab)">{{ tab }}</button>
			<keep-alive>
				<component :active-component="activeComponent" :is="activeComponent"></component>
			</keep-alive>
            <div style="clear: both;"></div>
		</div>
		<style>
			.contentTab {
				float: left;
			}
			.content {
				overflow: hidden;
			}
			#furnitureList {
				width: 100px
			}
		</style>
		<script>
			var app26 = new Vue({
				el: '#app26',
				data: {
					tabs: ['Livingroom', 'Bathroom', 'Bedroom'],
					activeComponent: 'livingroom-tab'
				},
				methods: {
					handleClick: function (tab) {
						this.activeComponent = tab.toLowerCase() + '-tab'
					}
				},
				components: {
					'livingroom-tab': {
						data: function () {
							return {
								livingroomFurniture: ['chair', 'table', 'tv'],
								activeFurniture: 'chair'
							}
						},
						props: ['active-component'],
						template: '\
						<div>\
							<div id="furnitureList" class="contentTab">\
							<div v-for="furniture in livingroomFurniture" :value="furniture" @click="activeFurniture = furniture">{{ furniture }}</div>\
							</div>\
							<div id="furnitureInfo" class="contentTab">this is {{ activeFurniture }}</div>\
						</div>'
					},
					'bathroom-tab': {
						props: ['active-component'],
						template: '<div> this is {{ activeComponent.toLowerCase() }} </div>'
					},
					'bedroom-tab': {
						props: ['active-component'],
						template: '<div> this is {{ activeComponent.toLowerCase() }} </div>'
					}
				}
			})
		</script>
```

*记得 Prop 要用 kebab-case，所有涉及到 attribute 的都要用 kebab-case 命名。*

###  异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个木块。为了简化，Vue 允许你用一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

```html
		<!-- asynchronous component -->
		<div id="app27">
			<hd></hd>
			<a-tab></a-tab>
			<b-tab></b-tab>
			<c-tab></c-tab>
		</div>
		<script>
			Vue.component('a-tab', {
				template: '<p>This is synchronous component A. Time stamp: {{new Date()}}</p>'
			})
			Vue.component('b-tab', {
				template: '<p>This is synchronous component B. Time stamp: {{new Date()}}</p>'
			})
			Vue.component('c-tab', function(resolve, reject) {
				setTimeout(function () {
					// 向resolve 回调传递组件定义
					resolve({
						template: '<p>This is asynchronous component C. Time stamp: {{new Date()}}</p>'
					})
				}, 3000)
			})
			var app = new Vue({
				el: '#app27'
			})
		</script>
```

如你所见，这个工厂函数会收到一个 `reslove` 回调，这个回调函数会在你从服务器得到组件定义时被调用。你也可以调用 `reject(reason)` 来表示加载失败。这里的`setTimeout` 是为了演示用，如何获取组件取决于你自己。

本节后面内容涉及 webpack，没学故省略。

###  处理边界情况

*以下内容不是特别重要，以后遇到需要的情况再参考。*

> 这里记录的都是和处理边界情况有关的功能，即一些需要对 Vue 的规则做一些小调整的特殊情况。不过注意这些功能都是有劣势或危险的场景的。我们会在每个案例中注明，所以当你使用每个功能的时候请稍加留意。

####  访问根实例

`$root`

> 对于 demo 或非常小型的有少量组件的应用来说这是很方便的。不过这个模式扩展到中大型应用来说就不然了。因此在绝大多数情况下，我们强烈推荐使用 [Vuex](https://github.com/vuejs/vuex) 来管理应用的状态。

####  访问父级组件实例

`$parent`

> 在绝大多数情况下，触达父级组件会使得你的应用更难调试和理解，尤其是当你变更了父级组件的数据的时候。当我们稍后回看那个组件的时候，很难找出那个变更是从哪里发起的。

####  访问子组件实例或子元素

`$ref` `ref="childName"

> `$refs` 只会在组件渲染完成之后生效，并且它们不是响应式的。这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 `$refs`。

####  依赖注入

[依赖注入](https://cn.vuejs.org/v2/guide/components-edge-cases.html#依赖注入)

####  程序化的事件侦听器

- 通过 `$on(eventName, eventHandler)` 侦听一个事件
- 通过 `$once(eventName, eventHandler)` 一次性侦听一个事件
- 通过 `$off(eventName, eventHandler)` 停止侦听一个事件

####  递归组件

[递归组件](https://cn.vuejs.org/v2/guide/components-edge-cases.html#递归组件)

####  组件之间的循环引用

[组件之间的循环引用](https://cn.vuejs.org/v2/guide/components-edge-cases.html#组件之间的循环引用)

####  内联模板

内联模板

#### X-Template

[X-Template](https://cn.vuejs.org/v2/guide/components-edge-cases.html#X-Template)

####  控制更新

#####  强制更新

#####  通过 v-once 创建低开销的静态组件

[通过 `v-once` 创建低开销的静态组件](https://cn.vuejs.org/v2/guide/components-edge-cases.html#通过-v-once-创建低开销的静态组件)