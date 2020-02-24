##  v-bind 及 class 与 style 绑定

DOM 元素经常会动态地绑定一些  class 类名或 style 样式，本章将介绍使用 v-bind 指令来绑定 class 和 style 的多种方法。

###  了解 v-bind 指令

它的主要用法是动态更新 HTML 元素上的属性。

在数据绑定中，最常见的两个需求就是元素的样式名称 class 和内联样式 style 的动态绑定，它们也是 HTML 的属性，因此可以使用 v-bind 指令。我们只需要用 v-bind 计算出表达式最终的字符串就可以，不过有时候表达式的逻辑较复杂，使用字符串拼接方法较难阅读和维护，所以 Vue.js 增强了对 class 和 style 的绑定。

###  绑定 class 的几种方式

####  对象语法

给 v-bind:class 设置一个对象，可以动态地切换 class。

```html
	<div id="app1">
		<div :class="{ 'active': isActive }"></div>
	</div>
	<script>
		var app1 = new Vue ({
			el: '#app1',
			data: {
				isActive: true
			}
		})
	</script>
```
上面示例中，类名 active 依赖于数据 isActive，当其为 true 是，div 会拥有类名 Active，为 false 时则没有，所以上例最终渲染完的结果是：

```html
<div class="active"></div>
```

对象中也可以传入多个属性，来动态切换 class。另外， :class 可以与普通 class 共存，例如：

```css
			.active {
				width: 100px;
				height: 100px;
				background: blue;
			}
			.error {
				border: 1px solid red;
			}
			.static {
				border-radius: 25px;
			}
```

```html
		<!-- v-bind class 2 -->
		<div id="app2">
			<div class="static" :class="{ 'active': isActive, 'error':isError }"></div>
		</div>
		<script>
			var app = new Vue ({
				el: '#app2',
				data: {
					isActive: true,
					isError: false
				}
			})
		</script>
```

:class 内的表达式每项为真时，对应的类名就会加载：

```html
<div class="static active"></div>
```

当数据 isActive 或 isError 变化时，对应的 class 类名也会更新。比如当 isError 为 true 时，渲染的后果为：

```javascript
app.isError = true
```

```html
<div class="static active error"></div>
```

P38

*vue.js 在设计绑定类名的语法时，有两个效果要达成：一、可以同时设置多个类名；二、各个类名可独立动态切换。如果纯同时设置多个类名的话，这样和 html 代码本身写死没什么区别，没有设计的必要。所以要可以动态切换才能显出优势。所以设置了对象语法，将要设置的类名设置为对象的属性名，其布尔值绑定到 vue 实例的 data 中。*

*而采用 JavaScript 熟悉的对象语法，则减少了设计新语法的成本，也减少了学习成本。*

当 :class 的表达式过长或逻辑复杂时，还可以绑定一个计算属性，这是一种很友好的常用的用法，一般当条件多于两个时，都可以使用 data 或 computed。

```html
	<!-- :class computed -->
	<div id="app3">
		<div :class="classes"></div>
	</div>
	<script>
		var app3 = new Vue ({
			el: '#app3',
			data: {
				isActive: true,
				error: null
			},
			computed: {
				classes: function () {
					return {
						active: this.isActive && !this.error
						// It seems something wrong with this code
						// 'text-fail': this.error & this.error.type === 'fail'
					}
				}
			}
		})
	</script>
```
*居然在计算属性返回一个对象，vue 还能对这个对象进行解释。在此前的计算属性例子中都是只返回到 html 的字面值为止。*

除了计算属性，你也可以直接绑定一个 Object 类型的数据，或者使用类似计算属性的 methods。

```html
	<!-- :class computed test2 -->
	<div id="app5">
		<div :class="classes">app5</div>
	</div>
	<script>
		var app5 = new Vue ({
			el: '#app5',
			data: {
				isActive: true,
				isError: false
			},
			computed: {
				classes3: function () {
					return {
						active: this.isActive,
						error: this.isError
					}
				},
				classes2: function () {
					return this.classes3
				},
				classes: function () {
					return this.classes2
				}
			}
		})
	</script>
```
*初步推测，只要返回类型是对象类的，就会一直解释至非对象。推测 vue 会对返回值不同做出不同反应，而不是再对返回到 html 字符串进行解析。因为把返回值改为 "this.classes2" 字符串的话，它就不解析了。*

####  数组语法

当需要应用多个 class 时，可以使用数组语法，给 :class 绑定一个数组，应用一个 class 列表：

```html
	<!-- :class array -->
	<div id="app6">
		<div :class="[activeCls, errorCls]">app6</div>
	</div>
	<script>
		var app6 = new Vue ({
			el: '#app6',
			data: {
				activeCls: 'active',
				errorCls: 'error'
			}
		})
	</script>
```
*数组语法因为可以在同一个位置切换不同的类。所以适合在一个数组中不同元素担任不同的职责，比如一个负责字体类，一个负责边距类，一个负责边框类等。而对比之下对象语法适用于效果的动态交互，对某类进行生效或失效。*

```html
	<!-- :class array test -->
	<div id="app7">
		<div :class="[activeCls, errorCls, testCls]">app7</div>
	</div>
	<script>
		var app7 = new Vue ({
			el: '#app7',
			data: {
				activeCls: 'active',
				errorCls: 'error',
				testCls: null
			}
		})
	</script>
```
也可以使用三元组来进行条件判断

```html
	<!-- triple array :class -->
	<div id="app8">
		<div :class="[isActive ? activeCls : '', errorCls]">app8</div>
	</div>
	<script>
		var app8 = new Vue ({
			el: '#app8',
			data: {
				isActive: true,
				activeCls: 'active',
				errorCls: 'error'
			}
		})
	</script>
```
样式 error 会始终应用，当数据 isActive 为真时，样式 active 才会被应用。class 有多个条件时，这样写较为繁琐，可以在数组语法中使用对象语法：

```html
	<!-- array computed :class -->
	<div id="app9">
		<div :class="[{active: isActive}, errorCls]">app9</div>
	</div>
	<script>
		var app9 = new Vue ({
			el: '#app9',
			data: {
				isActive: true,
				errorCls: 'error'
			}
		})
	</script>
```
*数组语法和对象语法混用的话，可以使某部分固定有不同的样式，而另一部分动态切换。*

*Vue 实例相当于定义方法和数据变量，而在 html 绑定的表达式部分则直接调用。*

*要把 html 中绑定的表达式直接认为是 JavaScript 对象，而表达式中的变量则在 Vue 实例中声明并定义。*

当然，与对象语法一样，也可以使用 data、computed 和 methods 三种方式，以计算属性为例：

```css
		.btn {
			background: green;
		}
		.btn-large {
			width: 150px;
			height: 150px;
		}
		.btn-disabled {
			display: none;
		}
```
```html
	<!-- data computed array :class -->
	<div id="app10">
		<div :class="classes">app10</div>
	</div>
	<script>
		var app10 = new Vue ({
			el: '#app10',
			data: {
				size: 'large',
				disabled: false
			},
			computed: {
				classes: function () {
					return [
						'btn',
						{
							['btn-' + this.size]: this.size != '',
							'btn-disabled': this.disabled
						}
					]
				}
			}
		})
	</script>
```
示例中的样式 btn 会始终应用，当数据 size 不为空时，会应用样式前缀 btn-，后加 size 的值；当 disabled 为真时，会应用样式 btn-disabled。

*这里返回的对象中键名带中括号的 [] 现象是 JavaScript 的创建字面量对象的语法。对于对象的键，可以是数字，可以是字符串，也可以直接是标识符。最常用的还是直接标识符，如果要创建可计算的键的话，就要在键名两边加中括号。*

[使用对象 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects) 参见“使用对象初始化器”一节。

###  绑定内联样式

使用 v-bind:style （即 :style）可以给元素绑定内联样式，方法与 :class 类似，也有对象语法和数组语法，看起来很像直接在元素上写 CSS。

```html
	<!-- :style -->
	<div id="app11">
		<div :style="{ 'color':color, 'fontSize': fontSize + 'px' }"> app11 </div>
	</div>
	<script>
		var app11 = new Vue ({
			el: '#app11',
			data: {
				color: 'red',
				fontSize: 14
			}
		})
	</script>
```
CSS 属性名称使用驼峰命名（camelCase）或短横分隔命名（kebab-case）。

大多数情况下，直接写一长串的样式不便于阅读和维护，所以一般写在 data 或 computed 里。

```html
	<!-- :style data -->
	<div id="app12">
		<div :style="styles"> app12 </div>
	</div>
	<script>
		var app12 = new Vue ({
			el: '#app12',
			data: {
				styles: {
					color: 'red',
					fontSize: 14 + 'px'
				}
			}
		})
	</script>
```
应用多个样式对象时，可以使用数组语法：

```html
<div :style="[styleA, styleB]">
    text
</div>
```

实际业务中，:style 的数组语法并不常用，因为往往可以写在一个对象里面；而较为常用的应当是计算属性。

另外，使用 :style 时，Vue.js 会自动给特殊的 CSS 属性名称增加前缀，比如 transform。