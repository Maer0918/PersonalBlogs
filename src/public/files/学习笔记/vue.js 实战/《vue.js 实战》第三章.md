##  计算属性

**模板内的表达式常用于简单的运算，当其过长或逻辑复杂时，会难以维护，本章的计算属性就是用于解决该问题的。**

###  什么是计算属性

在模板中双向绑定一些数据或表达式，但是表达式如果过长，或者逻辑更为复杂时，就会变得臃肿甚至难以阅读和维护：

```html
<div>
    {{ text.split(',').reverse().join(',') }}
</div>
```

这里的表达式包含 3 个操作，并不是很清晰，所以在遇到复杂的逻辑时应该使用计算属性。上例可以用计算属性进行改写：

```html
<div id="app">
{{ reversedText }}
</div>
<scirpt>
	var app = new Vue({
		el: '#app',
		data: {
			text: '123,456'
		},
		computed: {
			reversedText: function () {
				// 这里的 this 指向的是当前的 Vue 实例
				return this.text.split(',').reverse().join(',')
			}
		}
	})
</script>
```

所有的计算属性都以函数形式写在 Vue 实例内的 computed 选项内，最终返回计算后的结果。

*所谓计算属性，就是在 Vue 实例内有一个叫“计算”的属性，"computed"。这个属性专门匹配模板表达式中所调用的方法，而之前提到的 methods 应该是专门匹配标签内 v-on 或其简写 @ 所调用的方法。*

###  计算属性用法

在一个计算属性里可以完成各种复杂的逻辑，包括运算、函数调用，只要最终返回一个结果就可以。

*在双向绑定中，Vue.js 应该是对属性的修改做了监听，使得每一次属性的修改都会触发修改对应 DOM 中的值的行为。要设计一个框架，除了对设计模式很熟悉以外，还要对语法分析，该编程语言内部属性很熟悉。*

计算属性还可以依赖多个 Vue 实例的数据，只要其中任一数据变化，计算属性就会重新执行，视图也会更新：

```html
	<div id="app1" >
		总价: {{ prices }}
	</div>
	<script>
	var app1 = new Vue({
		el: '#app1',
		data: {
				package1 : [
					{
						name : 'iPhone 7',
						price: 7199,
						count: 2
					},
					{
						name : 'iPad',
						price : 2888 ,
						count: 1
					}
				],
				package2 : [
					{
						name : 'apple',
						price : 3,
						count : 5
					},
					{
						name : 'banana',
						price: 2,
						count: 10
					}
				]
		},
		computed : {
			prices : function () {
				var prices = 0 ;
				for (var i = 0 ; i< this.package1.length; i ++ ) {
					prices += this.package1[i].price * this.package1[i].count
				}
				for (var i = 0 ; i < this.package2.length; i++ ) {
					prices += this.package2[i].price * this.package2[i].count
				}
				return prices
			}
		}
	})
	</script>
```
当 package1 或 package2 中的商品有任何变化，比如购买数量变化或增删商品时，计算属性 prices 就会自动更新，视图中的总价也会自动变化。

每一个计算属性都包含一个 getter 和一个 setter，我们上面的两个示例都是计算属性的默认用法，只是利用了 getter 来读取。在你需要时，也可以提供一个 setter 函数，当手动修改计算属性的值就像修改一个普通数据那样时，就会触发 setter 函数，执行一些自定义的操作，例如：

```html
	<!-- computed 2 -->
	<div id="app2">
		姓名：{{ fullName }}
	</div>
	<script>
		var app2 = new Vue ({
			el: '#app2',
			data: {
				firstName: 'Jack',
				lastName: 'Green'
			},
			computed: {
				fullName: {
					// getter, 用于读取
					get: function () {
						return this.firstName + ' ' + this.lastName
					},
					// setter, 写入时触发
					set: function (newValue) {
						var names = newValue.split(' ')
						this.firstName = names[0];
						this.lastName = names[names.length - 1]
					}
				}
			}
		})
	</script>
```
*每次页面需要获取 fullName 时就会调用 get()。每次通过赋值符设置 fullName 时，就会调用 set()，并重新设置页面的值，调用 get()。*

计算属性除了上述简单的文本插值外，还经常用于动态地设置元素的样式名称 class 和内联样式 style，在下章会介绍这方面的内容。当使用组件时，计算属性也经常用来动态传递 props，这也会在第 7 章组件里详细介绍。

计算属性还有两个很实用的小技巧容易被忽略：一是计算属性可以依赖其他计算属性：二是计算属性不仅可以依赖当前 Vue 实例的数据，还可以依赖其他实例的数据，例如：

```html
	<!-- computed 3 -->
	<div id="app3"></div>
	<div id="app4">
		{{ reversedText }}
	</div>
	<script>
		var app3 = new Vue ({
			el: '#app3',
			data: {
				text: '123,456'
			}
		})
		var app4 = new Vue ({
			el: '#app4',
			computed: {
				reversedText: function () {
					// 这里依赖的是 app3 的数据 text
					return app3.text.split(',').reverse().join(',')
				}
			}
		})
	</script>
```
在一个 Vue 实例中依赖另一个 Vue 实例的属性，这样的用法在这里看起来用处不大，但后面介绍的组件和组件化里会用到，尤其是在多人协同开发时很常用，以为你写的一个组件所用得到的数据需要他人的组件提供。

###  计算属性缓存

在上一章介绍指令与事件时，你可能发现调用 methods 里的方法也可以与计算属性起到同样的作用，比如本章第一个示例可以用 methods 改写为：

```html
		<!-- computed 4 -->
		<div id='app5'>
			{{ reversedText() }}
		</div>
		<script>
			var app5 = new Vue ({
				el: '#app5',
				data: {
					text: '123,456'
				},
				methods: {
					reversedText: function () {
						return this.text.split(',').reverse().join(',')
					}
				}
			})
		</script>
```

**定义在 methods 中的函数必须以函数形式调用，而在 computed 中的函数以属性方式调用。**

methods 里定义了一个方法实现了 computed 相同的效果，甚至该方法还可以接受参数，使用起来灵活。

但计算属性是基于它的依赖缓存的。一个计算属性所依赖的数据发生变化时，它才会重新取值，所以只要 text 不改变，计算属性也就不更新。

```javascript
computed: {
    now: function () {
		return Date.now()
    }
}
```

这里的 Date.now() 不是响应式依赖，所以计算属性 now 不会更新。但是 methods 则不同，只要重新渲染，它就会被调用，因此函数也会被执行。

使用计算属性还是 methods 取决于你是否需要缓存，当遍历大数组和做大量计算时，应当使用计算属性，除非你不希望得到缓存。

