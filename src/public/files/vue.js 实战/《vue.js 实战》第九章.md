##  Render 函数

Vue.js 2.x 与 Vue.js 1.x 最大的区别就在于 2.x 使用了 Virtual Dom（虚拟 DOM ）来更新 DOM 节点，提升渲染性能。

虽然组件模板都是写在 template 选项里的，但是在 Vue.js 编译时，都会解析为 Virtual DOM。

###  什么是 Virtual DOM

React 和 Vue 2 都是用了 Virtual DOM 技术，Virtual DOM 并不是真正意义上的 DOM，而是一个轻量级的 JavaScript 对象，在状态发生变化时，Virtual DOM 会进行 Diff 运算，来更新只需要被替换的 DOM，而不是全部重绘。

与 DOM 操作相比，Virtual DOM 是基于 JavaScript 计算的，所以开销会小很多。

Virtual DOM 运行过程：

1. Object
2. render 生成虚拟节点
3. createElement(h) 基于虚拟节点创建 DOM 节点
4. diff 状态更新后，进行对比，生成补丁对象
5. patch 遍历补丁对象，更新 DOM 节点

正常 HTML DOM：

```html
<div id="main">
    <p>文本内容</p>
    <p>文本内容</p>
</div>
```

用 Virtual DOM 创建的 JavaScript 对象：

```javascript
var vNode = { 
	tag: 'div',
    attributes: {
        id: 'main'
    },
    children: {
        // p 节点
    }
}
```

vNode 对象通过一些特定的选项描述了真实的 DOM 结构。

在 Vue.js 2 中，Virtual DOM 就是通过一种 VNode 类表达的，每个 DOM 元素或组件都对应一个 VNode 对象，Vue.js 源码定义：

```javascript
export interface VNode {
    tag?: string
    data?: VNodeData
    children?: VNode[]
    text?: string
    elm?: Node
    ns?: string
    context?: Vue
    key?: string | number
    componentOptions?: VNodeComponentOptions
    componentInstance?: Vue
    parent?: VNode
    raw?: boolean
    isStatic?: boolean
    isRootInsert: boolean
    isComment: boolean
}
```

具体含义如下：

* tag 当前节点的标签名
* data 当前节点的数据对象

*节点的 DOM 和 JavaScript 主要属性都用数据描述了。* 

*不懂为什么属性名后有问号 ?*

VNodeData 代码如下：

```javascript
export interface VNodeData {
    key?: string | number
    slot?: string
    scopedSlots?: { [key: string]: ScopedSlot }
	ref?: string
    tag?: string
	staticClass?: string
    class?: any
	staticStyle?: { [key: string]: any }
    style?: Object[] | Object
	props?: { [key: string]: any }
    attrs?: { [key: string]: any }
    domProps?: { [key: string]: any }
    hook?: { [key: string]: Function }
    on?: { [key: string]: Function | Function[] }
    nativeOn?: {key: string]: Function | Function[] }
    transition?: Object
    show?: boolean
	inlineTemplate?: {
    	render: Function
		staticRenderFns: Function[]
	}
    directives?: VNodeDirective[]
    keepAlive?: boolean
}
```

* children 子节点，数组，也是 VNode 类型
* text 当前节点的文本，一般文本节点或注释节点会有该属性
* elm 当前虚拟节点对应的真实 DOM 节点
* ns 节点的 namespace
* content 编译作用域
* funcitonalContext 函数化组件的作用域
* key 节点的 key 属性，用于作为节点的标识，有利于 patch 的优化
* componentOptions 创建组件实例时会用到的选项信息
* child 当前节点对应的组件实例
* parent  组件的占位节点
* raw 原始 html
* isStatic 静态节点的标识
* isRootInsert 是否作为根节点插入，被 \<transition\> 包裹的节点，其属性的值为 false
* isComment 当前节点是否为注释节点
* isCloned 当前节点是否为克隆节点
* isOnce 当前节点是否有 v-once 指令

VNode 节点的主要分类：

* TextVNode 文本节点
* ElementVNode 普通元素节点
* ComponentVNode 组件节点
* EmptyVNode 没有内容的注释节点
* CloneVNode 克隆节点，可以是以上任意类型的节点，唯一的区别在于 isCloned 属性为 true

使用 Virtual DOM  就可以完全发挥 JavaScript 的编程能力。在多数场景中，我们使用 template 就足够了，但在一些特定的场景下，使用 Virtual DOM 会更简单，下节就来介绍 Vue 的 Render 函数的用法。

###  什么是 Render 函数

常见的文档和伯乐中，都有区分一级标题、二级标题、三级标题……为方便分享 url ，它们都做成了锚点，点击一下，会将内容加在网址后面，以“#”分割。

目标要求：标题标签，内容含有一个 `<a href="#特性">#</a>` 的链接，点击后，url 就带有了锚点信息，别人打开时，会直接聚焦到“特性”所在的位置。

```html
	<!-- anchor -->
	<div id="app1">
		<anchor :level="2" title="特性">特性</anchor>

		<script type="test/x-temlate" id="anchor">
			<div>
				<h1 v-if="level === 1">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h1>
				<h2 v-if="level === 2">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h2>
				<h3 v-if="level === 3">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h3>
				<h4 v-if="level === 4">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h4>
				<h5 v-if="level === 5">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h5>
				<h6 v-if="level === 6">
					<a :href="'#' + title">
						<slot></slot>
					</a>
				</h6>
			</div>
		</script>
	</div>
	<script>
		Vue.component("anchor", {
			template: '#anchor',
			props: {
				level: {
					type: Number,
					required: true
				},
				title: {
					type: String,
					default: ''
				}
			}
		})

		var app1 = new Vue({
			el: '#app1'
		})
	</script>
```
这样写没有任何错误，只是缺点很明显：代码冗长。用 Render 函数改写简化。

```html
	<!-- first render -->
	<div id="app2">
		<hd></hd>
		<anchor2 :level="2" title="特性">特性</anchor2>
	</div>
	<script>
		Vue.component('anchor2', {
			props: {
				level: {
					type: Number,
					required: true
				},
				title: {
					type: String,
					default: ''
				}
			},
			render: function (createElement) {
				return createElement(
					'h' + this.level,
					[
						createElement(
							'a',
							{
								domProps: {
									href: '#' + this.title
								}
							},
							this.$slots.default
						)
					]
				)
			}
		})

		var app2 = new Vue({
			el: '#app2'
		})
	</script>
```
*虽然很厉害，但是目前看不懂。*

Render 函数通过 createElement 参数来创建 Virtual DOM，结构精简了很多。在第七章组件中介绍 slot 时，有提到过访问 slot 的用法，使用场景就是在 Render 函数。

*也就是说 Render 函数要经常访问 slot。*

Render 函数所有神奇的地方都在这个 createElement 里。

###  creatElement 用法

####  基本参数

createElement 构成了 Vue Virtual DOM 的模板，它有 3 个参数：P151

```javascript
createElement(
	// {String | Object | Function}
    // 一个 HTML 标签，组件选项，或一个函数
    // 必须 Return 上述其中一个
    'div',
    // {Object}
    // 一个对应属性的数据对象，可选
    // 您可以在 template 中使用
    {
        // 稍后详细介绍
    },
    // {String | Array}
    // 子节点（VNodes），可选
    [
        createElement('h1', 'hello world')
        createElement(MyComponent, {
        	props: {
        		someProp: 'foo'
        	}
        }),
    	'bar'
    ]
)
```

*编程的本质是减少重复的劳动。组件是为了避免重复编写同质化的元素组合，render 也是。*

第一个参数必选，可以是一个 HTML 标签，也可以是一个组件或函数；第二个是可选函数，数据对象，在 template 中使用。第三个是子节点，也是可选参数，用法一致。

对于第二个参数“数据对象”，具体的选项如下：

```javascript
{
    // 和 v-bind:class 一样的 API
    class: {
        foo: true,
        bar: false
    },
    // 和 v-bind:style 一样的 API
    style: {
		color: 'red',
        frontSize: '14px'
    },
    //  正常的 HTML 特性
    attrs: {
        id: 'foo'
    },
    // 组件 Props
    props: {
        myProp: 'bar'
    },
    // DOM 属性
    domProps: {
        innerHTML: 'baz'
    },
    // 自定义事件监听器 "on"
    // 不支持如 v-on: keyup.enter 的修饰器
    //  需要手动匹配 keyCode
    on: {
        click: this.clickHandler
    },
    // 仅对于组件，用于监听原生事件
    // 而不是组件使用 vm.$emit 触发的自定义事件
    nativeOn: {
        click: this.nativeClickHandler
    },
    // 自定义指令
    directives: [
        {
            name: 'my-custom-directive',
            value: '2',
            expression: '1 + 1',
            arg: 'foo',
            modifiers: {
                bar: true
            }
        }
    ],
    // 作用域 slot
    // { name: prop => VNode | Array<VNode> }
    scopedSlots: {
        default: props => h('span', props.text)
    },
    // 如果子组件有定义 slot 的名称
    slot: 'name-of-slot',
    // 其他特殊顶层属性
    key: 'myKey',
    ref: 'myRef'
}
```

以往在 template 里，我们都是在组件的标签上使用形容 v-bind:class、v-bind:style、v-on:click 这样的指令，在 Render 函数都将其写在了数据对象里，比如下面的组件，使用传统的 template 写法是：

```html
<div id="app">
    <ele></ele>
</div>
<script>
	Vue.component('ele', {
        template: '\
			<div id="element" \
			:class="{show: show}" \
			@click="handleClick"> 文本内容 </div>',
        data: function () {
        	return {
                show: true
            }
    	},
        methods: {
            handleClick: function () {
                console.log('clicked!')
            }
        }
    })
    
    var app = new Vue ({
        el: '#app'
    })
</script>
```

*这也不麻烦呀，重复性内容不多。*

使用 Render 改写后的代码如下：

```html
<div id="app">
    <ele></ele>
</div>
<script>
	Vue.component('ele', {
        render: function (createElement) {
            return createElement(
            	'div',
                {
                    // 动态绑定 class，同 :class
                    class: {
                        'show': this.show
                    },
                    // 普通的 HTML 特性
                    attrs: {
                        id: 'element'
                    },
                    // 给 div 绑定 click 事件
                    on: {
                        click: this.handleClick
                    }
                },
                '文本内容'
            )
        },
        data: function () {
            return {
                show: true
            }
        },
        methods: {
            handleClick: function () {
                console.log('clicked!')
            }
        }
    })
    
    var app = new Vue({
        el: '#app'
    })
</script>
```

就此例而言，template 的写法明显要比 Render 写法要可读而且简洁，所以要在合适的场景使用 render 函数，否则只会增加负担。

*书也这么说了，果然是。*

*render 能达到 template 几乎一样的效果，视模板重复性来选择使用哪个渲染组件。还是有点差别的，render 存在约束。值得注意，Vue 的模板实际上被编译成了渲染函数。*

*render 也是采用和 data 一样的函数形式，理由推测也和 data 一样，为了维护独立的数据内容。*

####  约束

所有的组件树中，如果 VNode 是组件或含有组件的 slot，那么 VNode 必须唯一。

以下为错误示范：

重复使用组件：

```html
<div id="app">
    <ele></ele>
</div>
<script>
	// 局部声明组件
    var Child = {
		render: function(createElement) {
            return creatElement('p', 'text')
        }
    }
    Vue.component('ele', {
        render: function (createElement) {
            // 创建一个子节点，使用组件 Child
            var ChildNode = createElement(Child)
            return creatElement('div', [
                ChildNode,
                ChildNode
            ])
        }
    })
    
    var app = new Vue({
        el: '#app'
    })
</script>
```

重复使用含有组件的 slot：

```html
<div id="app">
    <ele>
    	<div>
            <Child></Child>
        </div>
    </ele>
</div>
<script>
	// 全局注册组件
    Vue.componnent('Child', {
        render: function (createElement) {
            return createElement('p', 'text')
        }
    })
    
    Vue.component('ele', {
        render: function (createElement) {
            return createElement('div', [
                this.$slots.default,
                this.$slots.default
            ])
        }
    })
    
    var app = new Vue({
        el: '#app'
    })
</script>
```

这两种情况下实际都是能渲染出一个 Child 。

对于重复渲染多个组件（或元素）的方法有很多：

```html
<div id="app">
    <ele></ele>
</div>
<script>
	var Child = {
        render: function(createElement) {
            return createElement('p', 'text')
        }
    }
    Vue.component('ele', {
        render: function (createElement) {
            return createElement('div', 
                 Array.apply(null, {
                	length: 5
            }).map(function() {
                return createElement(Child)
            })
          )
        }
    })
</script>
```

通过一个循环和工厂函数就可以渲染出 5 个重复的子组件 Child。对于含有组件的 slot，复用就要稍微复杂一点了，需要将 slot 的每个子节点都克隆一份。

```html
<div id="app">
    <ele>
    	<div>
            <Child></Child>
        </div>
    </ele>
</div>
<script>
    // 全局注册组件
    Vue.component('Child', {
      render: function (createElement) {
        return createElement('p', 'text')
      }
    })
    Vue.component('ele', {
      render: function (createElement) {
        // 克隆 slot 节点的方法
        function cloneVNode (vnode) {
          // 递归遍历所有子节点，并克隆
          const clonedChildren = vnode.children &&
          vnode.children.map(function(vnode) {
            return cloneVNode(vnode)
          })
          const cloned = createElement(
            vnode.tag,
            vnode.data,
            clonedChildren
          )
          cloned.text = vnode.text
          cloned.isComment = vnode.isComment
          cloned.componentOptions = vnode.componentOptions
          cloned.elm = vnode.elm
          cloned.context = vnode.context
          cloned.ns = vnode.ns
          cloned.isStatic = vnode.isStatic
          cloned.key = vnode.key

          return cloned
        }
        const vNodes = this.$slots.default
        const clonedVNodes = vNodes.map(function(vnode) {
          return cloneVNode(vnode);
        })

        return createElement('div', ]
          vNodes,
          clonedVNodes
        ])
      }
    })

    var app = new Vue({
      el:'#app'
    })
</script>
```

上面的例子在 Render 函数里创建了一个 cloneVNode 的工厂函数，通过递归将所有子节点都克隆了一份，并对 VNode 的关键属性也进行复制。

深度克隆 slot 的做法有点偏黑科技，不过一般业务中几乎不会遇到这样的需求，主要还是运用在独立组件中。

*好麻烦。*

####  使用 JavaScript 代替模板功能

在 Render 函数中，不再需要 Vue 内置的指令，比如 v-if、v-for，当然，也没办法使用它们。无论要实现什么功能，都可以用原生 JavaScript。比如 v-if  和 v-else 的代替写法：

```html
<div id="app">
  <ele :show="show"></ele>
  <button @click="show = !show">切换 show</button>
</div>
<script>
  Vue.component('ele', {
    render: function (createElement) {
      if (this.show) {
        return createElement('p', 'show 的值为 true')
      } else {
        return createElement('p', 'show 的值为 false')
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  })

  var app = new Vue({
    el: '#app',
    data: {
      show: false
    }
  })
</script>
```

*后面还有这样的内容，不一一赘述了。对于回车自动发送信息那个，可以需要再看。P163*

###  函数化组件

在类似创建锚点标题组件的场景中，比较简单，没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法，只接受一些 prop 的组件，可以将组件标记为 functional。这意味着它无状态（没有响应式数据），也没有实例（没有 this 上下文）。

>注意：在 2.3.0 之前的版本中，如果一个函数式组件想要接收 prop，则 `props` 选项是必须的。在 2.3.0 或以上的版本中，你可以省略 `props` 选项，所有组件上的 attribute 都会被自动隐式解析为 prop。
>
>当使用函数式组件时，该引用将会是 HTMLElement，因为他们是无状态的也是无实例的。

有关函数化组件的详细用法，可以参考官方文档和书的内容。

### JSX

由于 JSX 要用到 webpack ，所以后面回来再学。