## 数据绑定与第一个 Vue 应用

```javascript
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>First App</title>
	</head>
	<body>
		<div id="app">
			<input type="text" v-model="name" placeholder="你的名字">
			<h1>你好，{{ name }}</h1>
		</div>
		<script src="https://unpkg.com/vue/dist/vue.min.js"></script>
	<script>
		var app = new Vue({
			el:"#app",
			data: {
				name: ''
			}
		})
	</script>
	</body>
</html>
```

*v-model 对应的应该是 vue 对象中 data 的属性名 name。*

*placeholder 相当于 input 的默认值。*

这段代码展示了 Vue.js 最核心的功能：数据的双向绑定。

*数据的双向绑定，双向是指哪双向？*

###  Vue 实例与数据绑定

**Vue.js 应用的创建很简单，通过构造函数 Vue 就可以创建一个 Vue 的根实例，并启动 Vue 应用。**

el 选项必不可少，用来挂载到网页指定 DOM 元素上。值可以是 HTMLElement，也可以是选择器。

```javascript
var app = new Vue({
    el: document.getElementById('app') // 或者是 '#app'
})
```

挂载成功后，可以通过 app.$el 来访问该元素。

input 标签上的 v-model 指令，其值对应 Vue 实例中的 data 选项中的 name 字段。这就是 Vue 的数据绑定。

通过 Vue 实例的 data 选项，可以声明应用内需要双向绑定的数据。建议所有会用到的数据都预先在 data 中声明，这样不至于将数据散落在业务逻辑中，难以维护。

**Vue 实例本身也代理了 data 对象里的所有属性，所以可以这样访问：**

```javascript
var app = new Vue ({
    el: '#app',
    data: {
        a: 2
    }
})
console.log(app.a) // 2
```

*Vue 实例的属性不能直接通过属性名访问。要通过加美元符访问。*

```javascript
app2.data
app2.$data
```

*两个指向的不是同一个对象，只有 app2.$data 才是指向我们想要的对象。*

**除了显式地声明数据外，也可以指向一个已有的变量，并且他们之间默认建立了双向绑定，当修改其中一个时，另一个也会一起变化。**

*这就是双向绑定，两个数据对象，一个发生变化，另一个也会变化。*

*这个好像是传值还是传址问题而已？*

```javascript
var myData = {
    a: 1
}

var app = new Vue ({
    el: '#app',
    data: myData
})

console.log()
```

*向 Vue() 构造函数中传入的字面量对象实际上只是一个参数集合，构造出来的对象会对参数对象的属性进行加工。所以字面量对象中的 el 属性只需要对应一个选择器也可。*

####  生命周期

每个 Vue 实例创建时，都会经历一系列的初始化过程，同时也会调用相应的生命周期钩子，我们可以利用这些钩子，在合适的时机执行我们的业务逻辑。

Vue 的生命周期钩子与 jQuery 的 $(document).ready() 相似，比较常用的有：

* created 
  * 实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载，$el 还不可用，需要初始化一些数据时会比较有用，后面章节将有介绍。
* mounted 
  * el 挂载到实例上后调用，一般我们的第一个业务逻辑会在这里开始。 

* beforeDestroy 实例销毁之前调用，主要解绑一些使用 addEventListener 监听的事件等。

这些钩子与 el 和 data 类似，也是作为选项写入 Vue 实例内，并且钩子的 this 指向的是调用它的 Vue 实例：

```javascript
var app = new Vue({
    el: '#app',
    data: {
        a: 2
    },
    created: function () {
        console.log(this.a)
    },
    mounted: function () {
        console.log(this.$el)
    }
})
```

####  插值与表达式

使用双大括号（Mustache 语法）“{{ }}”是最基本的文本插值方法，它会自动将我们双向绑定的数据实时显示出来。P22

```html
		<div id="app1">
			{{ book }}
		</div>
```

```javascript
		// Mustache
		var app1 = new Vue({
			el: '#app1',
			data: {
				book: 'The Book Which Tell The Truth'
			}
		})
```

大括号里的内容会被替换为 Vue 实例的 data 中相应属性的内容。通过任何方法修改数据 book，大括号的内容都会被实时替换，比如实时更新时间：

```html
		<div id="app2">
			{{ date }}
		</div>
```

```javascript
		// Real time reflection
		var app2 = new Vue ({
			el: '#app2',
			data: {
				date: new Date()
			},
			mounted: function () {
				var _this = this;
				this.timer = setInterval(function() {
					_this.date = new Date()
				}, 1000)
			},
			beforeDestroy: function () {
				if (this.timer) {
					clearInterval(this.timer)
				}
			}
		})
```

> 这里的 {{ date }} 输出的是浏览器默认的时间格式，并非格式化的事件，所以要注意时区。有多种方法可以对时间格式化，比如赋值前先使用自定义的函数处理。Vue 的过滤器（filter）或计算属性（computed）也可以实现，稍后会介绍到。

如果有时候就是想输出 HTML，而不是数据解释后的纯文本，可以使用 v-html:

```html
	<div id="app3"> 
		<span v-html="link"></span>
	</div>
	<script>
		var app3 = new Vue ({
			el: '#app3',
			data: {
				link: '<a href="#">这是一个链接</a>'
			}
		})
	</script>
```

link 的内容将会被渲染为一个具有点击功能的 a 标签，而不是纯文本。这里要注意，如果将用户产生的内容使用 v-html 输出后，有可能导致 XSS 攻击，所以要在服务端对用户提交的内容进行处理，一般可将尖括号“<>”转义。

如果想显示 {{}} 标签，而不进行替换，使用 v-pre 即可跳过这个元素和它的子元素的编译过程，例如：

```html
<span v-pre>{{ Content here will not be compiled. }}</span>
```

*html 标签中的 v- 前缀的属性都会被 vue 解释掉，在返回给浏览器的页面中不会出现 v- 前缀的属性。*

在 {{}} 中，除了简单的绑定属性值外，还可以使用 JavaScript 表达式进行简单的运算、三元运算等，例如：

```html
	<!-- computed -->
	<div id="app4">
		{{ number / 10 }}
		{{ isOK ? 'Confirm' : 'Cancel' }}
		{{ text.split(',').reverse().join(',') }}
	</div>
	<script>
		var app4 = new Vue({
			el: '#app4',
			data: {
				number: 100,
				isOK: false,
				text: '123,456'
			}
		})
	</script>
```

Vue.js 只支持单个表达式，不支持语句和流控制。另外，在表达式中，不能使用用户自定义的全局变量，只能使用 Vue 白名单内的全局变量，例如 Math 和 Date。以下是一些无效示例：

```html
<!-- 这是语句，不是表达式 -->
{{ var book = 'The Book Which Tells The Truth'}}
<!-- 不能使用流控制，要使用三元运算 -->
{{ if (ok) return msg }}
```

*只支持有限的功能是对的，提供一定便利的同时防止结构过于臃肿。*

####  过滤器

Vue.js 支持在 {{}} 插值的尾部添加一个管道符“（|）”对数据进行过滤，经常用于格式化文本，比如字母全部大写，货币千位使用逗号分隔等。过滤的规则是自定义的，通过 Vue 实例添加选项 filters 来设置，例如时间格式化：

```html
	<!-- filters -->
	<div id="app5">
		{{ date | formatDate }}
	</div>
	<script>
		var padDate = function(value){
			return value < 10 ? '0' + value : value
		}
		var app = new Vue({
			el: '#app5',
			data: {
				date: new Date()
			},
			filters: {
				formatDate: function(value){
					var date = new Date(value)
					var year = date.getFullYear()
					var month = padDate(date.getMonth() + 1)
					var day = padDate(date.getDate())
					var hours = padDate(date.getHours())
					var minutes = padDate(date.getMinutes())
					var seconds = padDate(date.getSeconds())
					return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
				}
			},
			mounted: function () {
				var _this = this // 声明一个变量指向 Vue 实例，保证作用域一致
				this.timer = setInterval(function() {
					_this.date = new Date()
				}, 1000)
			},
			beforeDestroy: function () {
				if (this.timer) {
					clearInterval(this,timer)
				}
			}
		})
	</script>
```

过滤器也可以串联，而且可以接收参数，例如：

```html
<!-- 串联 -->
{{ message | filterA | filterB }}
```

```html
<!-- 接收参数 -->
{{ message | filterA('arg1', 'arg2')}}
```

这里的字符串 arg1 和 arg2 将分别传给过滤器的第二个和第三个参数，以为第一个是数据本身。

*$\delta$ 这第二和第三个参数怎么传？*

> 过滤器应当用于处理简单的文本转换，如果要实现更为复杂的数据变换，应该使用计算属性，下一章会详细介绍它的用法。

###  指令与事件

指令（Directives）是 Vue.js 模板中最常用的一项功能，它带有前缀 v-，在前文我们已经使用过不少指令了，比如 v-if，v-html，v-pre 等。指令的主要指责就是当表达式的值改变时，相应地将某些行为应用到 DOM 上，以 v-if 为例：

```html
	<!-- directives -->
	<div id="app6">
		<p v-if="show"> Display this text </p>
	</div>
	<script>
		var app6 = new Vue({
			el: '#app6',
			data: {
				show: true
			}
		})
	</script>
```

当数据 show 的值为 true 时，p 元素会被插入，为 false 则会被移除。

**数据驱动 DOM 是 Vue.js 的核心理念，所以不到万不得已时不要主动操作 DOM。**你只需要维护好数据，DOM 的事 Vue 会帮你优雅的处理。

*Vue 的理念与 jQuery 大不相同，jQuery 是优雅地主动操作 DOM；而 Vue 则是只需维护数据，DOM 的话 Vue 会优雅地解决。*

Vue.js 内置了很多指令，帮助我们快速完成常见的 DOM 操作，比如循环渲染、显示与隐藏等。

现在先来熟悉 v-bind 和 v-on。

v-bind 的基本用途是动态更新 HTML 元素上的属性，比如 id、class 等，例如下面几个示例：

```html
	<div id="app7">
		<a v-bind:href="url">链接</a>
		<img v-bind:src="imgUrl">
	</div>
	<script>
		var app = new Vue({
			el: '#app7',
			data: {
				url: 'https://www.github.com',
				imgUrl: 'http://xxx.xxx.xx/img.png'
			}
		})
	</script>
```

*由数据决定 DOM，由 Vue.js 重新解释页面。*

另一个非常重要的指令是 v-on，它用来绑定事件监听器，这样我们就可以做一些交互了：

```html
	<!-- v-on -->
	<div id="app8">
		<p v-if="show">这是一段文本</p>
		<button v-on:click="handleClose">点击隐藏</button>
	</div>
	<script>
		var app8 = new Vue({
			el: '#app8',
			data: {
				show: true
			},
			methods: {
				handleClose: function () {
					this.close()
				},
				close: function () {
					this.show = false
				}
			}
		})
	</script>
```

在 button 按钮上，使用 v-on:click 给该元素绑定了一个点击事件，在普通元素上，v-on 可以监听原生的 DOM 事件，除了 click 外，还有 dblclick、keyup、mouseover 等。表达式可以是一个方法名，这些方法都写在 Vue 实例的 methods 属性内，并且是函数的形式，函数内的 this 指向的是当前 Vue 实例本身，因此可以直接用 this.xxx 的形式来访问或修改数据，如示例中的 this.show = false。

表达式除了方法名，也可以直接是一个内联语句：

```html
<!-- v-on.2 -->
<div id="app9">
	<p v-if="show">这是一段文本</p>
	<button v-on:click="show = false">点击隐藏</button>
</div>
<script>
	var app9 = new Vue({
		el: '#app9',
		data: {
			show: true
		}
	})
</script>
```
*Vue.js 甚至自制了一个语法解析引擎。*

如果绑定的事件要处理复杂的业务逻辑，建议还是在 methods 里声明一个方法，这样可读性更强也好维护。

Vue.js 将 methods 里的方法也代理了，所以也可以像访问 Vue 数据那样来调用方法。

在 handleClose 方法内，直接通过 this.close() 调用了 close() 函数。在上面实例中是多此一举的，只是用于演示它的用法，在业务中会经常用到。

###  语法糖

**语法糖是指在不影响功能的情况下，添加某种方法实现同样的效果，从而方便程序开发。**

Vue.js 的 v-bind 和 v-on 指令都提供了语法糖，也可以说是缩写，比如 v-bind，可以省略 v-bind，直接写一个冒号“:”：

```html
<a v-bind:href="url">链接</a>
<img v-bind:src="imgUrl">
<!-- 缩写为 -->
<a :href="url">链接</a>
<img :src="imgUrl">
```

v-on 可以直接用“@”来缩写：

```html
<button v-on:click="handleClose">点击隐藏</button>
<!-- 缩写为 -->
<button @click="handleClose">点击隐藏</button>
```

从下一章开始，所有实例的 v-bind 和 v-on 指令将默认使用语法糖的写法。

