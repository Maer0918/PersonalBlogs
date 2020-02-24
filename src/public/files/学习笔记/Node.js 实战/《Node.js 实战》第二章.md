##  Node 编程基础

本章要解决 Node 新手的两个难题：

1. 如何组织代码
2. 如何实现异步编程
   1. 如何响应一次性事件
   2. 如何处理重复性事件
   3. 如何让异步逻辑顺序执行

模块是 Node 的一种代码组织和包装方式，让代码易于重用。

###  Node 功能的组织及重用

Node 模块打包代码是为了重用，但它们不会改变全局作用域。

Node 模块允许从被引入文件中选择要暴露给程序的函数和变量。

![NodeJS1](/home/maer/pinkman/Notes/Frontend/JS/Node.js 实战/NodeJS1.jpg)

后面内容将会掌握：

1. 如何创建模块
2. 模块放在文件系统中的什么地方
3. 在创建和使用模块时要意识到的东西

###  开始一个新的 Node 项目

创建一个空的 Node 项目：

```sh
mkdir my_moudle
cd my_moudle
npm init -y
```

-y 表示 yes 默认情况。

####  创建模块

Node 通常会在这个目录下找一个叫 `index.js` 的文件作为模块的入口（这个默认设置可以重写，见 2.5 节）

*类似 Python 的包，Node 的模块也有入口和配置。*

典型的模块是一个包含 exports 对象属性定义的文件，这些属性可以是任意类型的数据，比如字符串、对象和函数。

```javascript
const canadianDollar = 0.91

function roundTwo(amount) {
	return Math.round(amount * 100) / 100;
}

// 外部文件只能访问 exports 中有的属性
exports.canadianToUS = canadian => roundTwo(canadian * canadianDollar)
exports.USToCanadian = us => roundTwo(us / canadianDollar)
```

*这点类似 Java 中的包 `public` 和 `private` 。*

使用这个新模块要用到 Node 的 `require` 函数，该函数以所用模块的路径为参数。

*<a href="#a1">&delta;</a> 那多文件组成的单模块是怎么组织？*

Node 以同步的方式寻找模块，定位到这个模块并加载文件中的内容。

*注意是同步，不是异步。只有加载完模块了才会执行下一个指令。*

Node 查找文件的顺序是先找核心模块，然后是当前目录，最后是 node_modules。

*注意，最后两步，一般语言是找完核心后找第三方包，最后找当前目录。而 Node  是找完核心找当前目录，再找第三方包。这里推测 node_modules 是第三方包。*

P19

> require 是 Node 中少数几个同步 I/O 操作之一。因为经常用到模块，并且一般都是在文件顶端引入，所以把 require 做成同步的有助于保持代码的整洁、有序、还能增强可读性。
>
> 但在 I/O 密集的地方尽量不要用 require。所有同步调用都会阻塞 Node，直到调用完成才能做其他事情。如果在每个进入的请求上都用了 require，就会遇到性能问题。所以 require 和其他同步操作通常放在程序最初加载的地方。

```javascript
const currency = require('./currency')

function print(arg) { console.log(arg) }

print('50 Canadian dollars equals this amount of US dollars: ')
print(currency.canadianToUS(50))
print('30 US dollars equals this amount of Canadian dollars: ')
print(currency.USToCanadian(30))
```

**再强调一次，`require` 函数以所用模块的路径为参数。**

如果没有指明是 js 文件，Node 也会检查 json 文件， json 文件是作为 JavaScript 对象加载的。

在 Node 定位到并计算好你的模块之后，require 函数会返回这个模块中定义的 exports 对象中的内容。

**组装模块中的 exports 对象是在单独的文件中组织可重用代码的一种简便方法。**

###  用 module.exports 微调模块的创建

尽管函数和变量组装 exports 能满足大多数模块创建需求，有时还是需要不同的模型创建该模块。

比如将货币转换器模块改成只返回一个 Currency 构造函数，而不是包含两个函数的对象。

目标调用代码：

```javascript
/* test_currency2.js */

const Currency = require('./currency2')
const canadianDollar = 0.91
const currency = new Currency(canadianDollar)
console.log(currency.canadianToUS(50))
```

模块代码：

```javascript
/* currency2.js */

class Currency {
	constructor(canadianDollar) {
		this.canadianDollar = canadianDollar
	}

	roundTwoDecimals(amount) {
		return Math.round(amount * 100) / 100
	}

	canadianToUS(canadian) {
		return this.roundTwoDecimals(canadian * this.canadianDollar)
	}

	USToCanadian(us) {
		return this.roundTwoDecimals(us / this.canadianDollar)
	}
}

module.exports = Currency
```

由于 Node 不允许重写 `exports`，所以要直接操作 `module.exports`。即不允许 `exports = Currency` 的写法。

`module.exports` 可以对外提供单个变量、函数或者对象。如果你创建了一个既有 `exports` 又有 `module.exports` 的模块，那它会返回 `module.exports`，而 `exports` 会被忽略。

> 程序最终导出的是 `module.exports`，因为 `exports` 只是对 `module.exports` 的一个全局引用，最初被定义为一个可以添加属性的空对象。
>
> 所以，如果把 `exports` 设定为别的，就打破了 `module.exports` 和 `exports` 之间的引用关系。
>
> 因为真正导出的是 `module.exports`，那样 `exports` 就不能用了，以为它不再指向 `module.exports` 了。如果你想保留那个链接，可以像下面这样让 `module.exports` 再次引用 `exports` ：
>
> `module.exports = exports = Currency`
>
> 根据需要使用 `exports` 或 `module.exports` 可以将功能组织成模块，规避掉程序脚本一直增长所带来的弊端。

```javascript
> a = {}
{}
> b = a
{}
> a = { prop: 'proptext' }
{ prop: 'proptext' }
> b
{}
```

*以上可以看出断链的过程。*

####  用 node_modules 重用模块

相对路径存放对于组织程序特定的代码很有帮助，但对于想要在程序间共享或跟其他人共享代码却用处不大。Node 中有一个独特的模块引入机制，可以不必知道模块在文件系统中的具体位置。这个机制就是使用 node_modules 目录

如果是 `const Currency = require('currency')` 这种写法，Node 会依次在核心模块、当前目录下的 nodes_modules 目录、父目录、环境变量 NODE_PATH 指定的目录中寻找，都找不到则抛出异常。

*实验已验证，把模块放进当前目录下的 node_modules 文件夹中，然后在引入文件时不采用相对路径写法，直接写模块名，也可以正确找到模块。*

###  注意事项

1. 如果模块是目录，在模块目录中定义模块的文件必须被命名为 index.js，除非系在这个目录下一个叫 package.json 的文件里特别指明。要指定一个取代 index.js 的文件，package.json 文件里必须有一个用 JavaScript Object Notation (JSON) 数据定义的对象，其中有一个名为 main 的键，指明模块目录内主文件的路径。

*归根到底还是要主文件，package.json 只是相当于将主文件重命名了。*

2. Node 能把模块作为对象缓存起来。如果程序中的两个文件引入了相同的模块，第一个 require 会把模块返回的数据存到内存中，这样第二个 require 就不用再去访问和计算模块的源文件了。

###  使用异步编程技术

在 Web 前端程序中，做过界面事件（比如鼠标点击）触发的逻辑，就做过异步程序。

服务端的异步编程也一样：事件发生会触发响应逻辑。在 Node 世界里流行两种响应逻辑管理方式：回调和事件监听。

P24

**回调**通常用来定义一次性响应的逻辑。比如对数据库查询，可以指定一个回调函数来确定如何处理查询结果。这个回调函数可能会显示数据库查询结果，根据这些结果做些计算，或者以查询结果为参数执行另一个回调函数。

**事件监听器**本质上也是一个回调，不同的是，它跟一个概念实体（事件）相关联。例如，用 `EventEmitter.prototype.on` 方法在服务器上绑定了一个监听器，所以每当有 `request` 发出时，服务器就会调用 `handleRequest` 函数：

`server.on('request', handleRequest)`

一个 Node HTTP 服务器实例就是一个事件发生器，一个可以继承、能够添加事件发射及处理能力的类（EventEmitter）。Node 的很多核心功能都继承自 EventEmitter，你也能创建自己的事件发射器。

接下来了解下异步工作机制。

###  用回调处理一次性事件

**回调**是一个函数，它被当作参数传给异步函数，用来描述异步操作完成之后要做什么。回调在 Node 开发中用得很频繁，比事件发射器用得多，并且用起来简单。

用简单的 HTTP 服务器演示回调：

* 异步获取存放在 JSON 文件中的文章的标题；
* 异步获取简单的 HTML 模板；
* 把那些标题组装到 HTML 页面里；
* 把 HTML 页面发送给用户。

> 1. nodejs通过libev事件得到IO执行状态，而不是轮询，提高了CPU利用率。 
>
> 2. 虽然nodejs是单线程的，但它的IO操作是多线程的，多个IO请求会创建多个libeio线程（最多4个），使通常情况的IO操作性能得到提高。
>
> 3. 但是当IO操作情况比较复杂的时候，有可能造成线程竞争状态，导致IO性能降低；而且libeio最多创建4个线程，当同时有大量IO请求时，实际性能有待测量。另外，由于每个IO请求对应一个libeio的数据结构，当同时有大量IO操作驻留在系统中时候，会增加内存开销。
>
> 4. Libeio为了实现异步IO功能，带来了额外的管理，当IO数据量比较小的时候，整体性能不一定比同步IO好。
>
> —— [**nodejs异步IO的实现**](https://cnodejs.org/topic/4f16442ccae1f4aa2700113b)

[初探Node.js的异步I/O实现](https://www.kancloud.cn/thinkphp/nodejs-mini-book/43660)

*建议还是去看朴灵的《深入浅出 node.js》来了解 node 异步 I/O 原理。*

```javascript
const http = require('http')
const fs = require('fs')

// 创建 HTTP 服务器并用回调定义响应逻辑
http.createServer((req, res) => {
	if (req.url == '/') {
		// 读取 JSON 文件并用回调定义如何处理其中的内容
		fs.readFile('./titles.json', (err, data) => {
			// 如果出错，输出错误日志，并给客户端返回 "Server Error"
			if (err) {
				console.error(err)
				res.end('Server Error')
			} else {
				// 从文本中解析数据
				const titles = JSON.parse(data.toString())
				// 读取 HTML 模板，并在加载完成后使用回调
				fs.readFile('./template.html', (err, data) => {
					if (err) {
						console.error(err)
						res.end('Server Error')
					} else {
						const tmpl = data.toString()
						// 组装 HTML 页面以显示博客标题
						const html = tmpl.replace('%', titles.join('</li><li>'))
						res.writeHead(200, { 'Content-Type': 'text/html'})
						// 将 HTML 页面发送给用户
						res.end(html)
					}
				})
			}
		})
	}
}).listen(8000, '127.0.0.1')
```

这个例子中的回调嵌套了三层：

```javascript
http.createServer((req, res) => { ...
    fs.readFile('./title.json', (err, data) => { ...
    	fs.readFile('./template.html', (err, data) => { ...
```

回调的层数越多，代码看起来越乱，重构和测试起来也越困难。

*在浏览器地址栏输入"127.0.0.1:端口号" 即可访问。*

```javascript
const http = require('http')
const fs = require('fs')

// 客户端请求一开始就会进到这里
http.createServer((req, res) => {
	getTitles(res)
}).listen(8000, '127.0.0.1')

function getTitles(res) {
	fs.readFile('./titles.json', (err, data) => {
		if (err) {
			hadError(err. res)
		} else {
			getTemplate(JSON.parse(data.toString()), res)
		}
	})
}

function getTemplate(titles, res) {
	fs.readFile('./template.html', (err, data) => {
		if (err) {
			handleError(err, res)
		} else {
			formatHtml(titles, data.toString(), res)
		}
	})
}

function formatHtml(titles, tmpl, res) {
	const html = tmpl.replace('%', titles.join('</li><li>'))
	res.writeHead(200, {'Content-Type': 'text/html'})
	res.end(html)
}

function hadError(err, res) {
	console.log(err)
	res.end('Server Error')
}
```

还可以使用 Node 开发中的另一种惯用法来减少由 if/else 引起的嵌套：尽早从函数中返回。尽早返回可以避免嵌套，还明确表示出了函数不应该继续执行的意思。

```javascript
const fs = require('fs')
const http = require('http')

http.createServer(( req, res ) => {
	getTitles(res)
}).listen(8000, '127.0.0.1')

function getTitles(res) {
	fs.readFile('./titles.json', (err, data) => {
		if (err) return hadError(err, res)
		getTemplate(JSON.parse(data.toString()), res)
	})
}

function getTemplate(titles, res) {
	fs.readFile('./template.html', (err, data) => {
		if (err) return hadError(err, res)
		formatHtml(titles, data.toString(), res)
	})
}

function formatHtml(titles, tmpl, res) {
	const html = tmpl.replace('%', titles.join('</li><li>'))
	res.writeHead(200, {'Content-Type': 'text/html'})
	res.end(html)
}

function hadError(err, res) {
	console.error(err)
	res.end('Server Error')
}
```

> Node 的异步回调惯例
>
> Node 中的大多数内置模块在使用回调时都会带两个参数：第一个用来放可能会发生的错误，第二个用来放结果。错误参数经常缩写为 err。

###  用事件发射器处理重复性事件

事件发射器会触发事件，并且在那些事件触发时能处理它们。一些重要的 Node API 组件，比如 HTTP 服务器、TCP 服务器和流，都被做成了事件发射器。你也可以创建自己的事件发射器。

事件是通过监听器进行处理的。监听器是跟事件相关联的、当有事件出现时就会被触发的回调函数。比如 Node 中的 TCP socket，它有一个 data 事件，每当 socket 中有新数据时就会触发：

```javascript
socket.on('data', handleData)
```

*重复一次，监听器是跟事件相关联的、当有事件出现时就会被触发的回调函数。*

####  事件发射器示例

echo 服务器就是一个处理重复性事件的简单例子，当你给它发送数据时，它会把数据发回来。

```javascript
const net = require('net')
const server = net.createServer(socket => {
	// 当读取到新数据时处理的 data 事件
	socket.on('data', data => {
		// 数据被写回到客户端
		socket.write(data)
	})
})
server.listen(8888)
```

使用方法：

```shell
node echo_server.js
```

```shell
telnet 127.0.0.1 8888
```

####  响应只应该发生一次的事件

```javascript
const net = require('net')
const server = net.createServer(socket => {
	// 当读取到新数据时处理的 data 事件
	socket.once('data', data => {
		// 数据被写回到客户端
		socket.write(data)
	})
})
server.listen(8888)
```

*把 on() 改成 once() 即可。*

####  创建事件发射器：一个 PUB/SUB 的例子

```javascript
const EventEmitter = require('events').EventEmitter
const channel = new EventEmitter()

channel.on('join', () => {
	console.log('Welcome!')
})

channel.emit('join')
```

`events` 是 Node 内置的事件模块，添加监听器除了可以用 `on` 还可以用比较长的 `addListener` 方法。

发射事件则用 `emit` 方法。

> 事件名称
>
> 事件是可以具有任意字符串值的键：data、join 或某些长的让人发疯的事件名都行。只有一个事件是特殊的，那就是 error。

实现一个简单的聊天服务器。

聊天服务器的频道被做成了事件发射器，能对客户端发出的 join 事件做出响应。当有客户端加入聊天频道时，join 监听器逻辑会将一个针对该客户端的监听器附加到频道上，用来处理会将所有广播消息写入该客户端 socket 的 broadcast 事件。

```javascript
const events = require('events')
const net = require('net')
const channel = new events.EventEmitter()

// 把 clients 和 subscriptions 设置为空对象
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) {
	// 添加 join 事件的监听器，保存用户的 client 对象，以便程序可以将数据发送给用户
	this.clients[id] = client
	this.subscriptions[id] = (senderId, message) => {
		// 忽略发出这一广播数据的用户
		if (id != senderId) {
			this.clients[id].write(message)
		}
	}
	// 添加一个专门针对当前用户的 broadcast 事件监听器
	this.on('broadcast', this.subscriptions[id])
})

const server = net.createServer(client => {
	const id = `${client.remoteAddress}:${client.remotePort}`
	// 当有用户连到服务器上时发出一个 join 事件，指明用户 ID 和 Client 对象
	channel.emit('join', id, client)
	client.on('data', data => {
		data = data.toString()
		// 当有用户发送数据时，发出一个频道 broadcast 事件，指明用户 ID 和消息
		channel.emit('broadcast', id, data)
	})
})

server.listen(8888)
```

*图中用了反引号的表达式是 [Template Literals (Template Strings)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)，模板字面量（模板字符串）可以使用多行字符串和字符串插值功能。*

*`channel` 中会保存 `clients` 客户端和 `subscriptions` 订阅，这两个对象都以 `id` 为键，`id` 由 `client.remoteAddress` + ':' + `client.remotePort` 拼接而成，`client` 则是 `net.createServer` 时传入的箭头函数参数的参数 `client`。该箭头函数应该会被 `net.createServer` 内部调用。*

*该段代码只要熟悉 API 后就可以轻易写出，不必现在学习。后面的改善版同理。*

> 错误处理
>
> 在错误处理上有个常规做法，你可以创建发出 error 类型事件的事件发射器，而不是直接抛出错误。这样就可以为这一事件类型设置一个或多个监听器，从而定义定制的事件响应逻辑。
>
> 下面的代码显示的是一个错误监听器如何将被发出的错误输出到控制台中：
>
> ```javascript
> const events = require('events')
> const myEmitter = new events.EventEmitter()
> myEmitter.on('error', err => {
>     console.log(`ERROR: ${err.message}`)
> })
> myEmitter.emit('error', new Error('Something is wrong.'))
> ```
>
> 如果发出这个 error 事件类型时没有该事件类型的监听器，事件发射器会输出一个栈跟踪（到错误发生时所执行过的程序指令列表）并停止执行。栈跟踪会用 emit 调用的第二个参数指明错误类型。这是只有错误类型事件才能享有的特殊待遇，在发出没有监听器的其他事件类型时，什么也不会发生。
>
> 如果发出的 error 类型事件没有作为第二个参数的 error 对象，栈跟踪会指出一个“未捕获、未指明的‘错误’事件”错误，并且程序会停止执行。你可以用一个已经被废除的方法处理这个错位，用下面的代码定义一个全局处理器实现响应逻辑：
>
> ```javascript
> process.on('uncaughtException', err => {
>     console.error(err.stack)
>     process.exit(1)
> })
> ```
>
> 除了这个，还有像 domains 这样正在开发的方案，但它们是实验性质的。

####  扩展事件监听器：文件监视器

略

###  异步开发的难题

异步程序必须密切关注程序的执行流程：事件轮询的条件、程序变量，以及其他随着程序逻辑执行而发生变化的资源。

留意闭包和异步所带来的闭包变量的值变化。

###  异步逻辑的顺序化

让一组异步任务顺序执行的概念被 Node 社区成为流程控制。这种控制分为两类：串行和并行。

通常来说，并行比串行的实现更容易让传统单线程编程人员理解。

###  何时使用串行流程控制

可以使用回调让几个异步任务按顺序执行，但如果任务很多，必须组织一下，否则过多的回调嵌套会把代码搞得很乱。

```javascript
setTimeout(() => {
    console.log('I execute first.')
    setTimeout(() => {
        console.log('I execute next.')
        setTimeout(() => {
            console.log('I execute last.')
        }, 100)
    }, 500)
}, 1000)
```

此外，也可以使用 Async 这样的流程控制工具执行这些任务。Async 用起来简单直接，并且它的代码量很小（经过缩小化和压缩后只有 837 个字节）。

```shell
npm install async
```

```javascript
const async = require('async')
async.series([callback => {
				setTimeout(() => {
                    console.log('I execute first.')
                    callback()
                }, 1000)
			},
             callback => {
                 	setTimeout(() => {
                    console.log('I execute next.')
                    callback()
                }, 500)
             },
             callback => {
                 	setTimeout(() => {
                    console.log('I execute last.')
                    callback()
                }, 100)
             }])
```

*要想理解掌握如何使用 async，还得去看它的文档。*

###  实现串行化流程控制

*这里原书的流程复杂且不好操作，所以采用里阮一峰的《JavaScript 入门教程》中的[异步串行流程控制](https://wangdoc.com/javascript/async/general.html)示例。*

```javascript
var items = [1, 2, 3, 4, 5, 6]
var results = []

function async(arg, callback) {
    console.log('参数为 ' + arg + '，1秒后返回结果')
    setTimeout(function () { callback(arg * 2)}, 1000)
}

function final(value) {
    console.log('完成：', value)
}

function series(item) {
    if(item) {
        async( item, function(result) {
            results.push(result)
            return series(item.shift())
        })
    } else {
        return final(results[results.length - 1])
    }
}

series(items.shift())
```

*这里的 `async` 函数就是异步函数的代表，在传入的回调函数中，要将回调函数收到的结果参数 `result` 存入结果队列 `results`，并且回调函数最后必须调用串行包装函数 `series`，参数从参数队列 `itmes` 中弹出。串行流程控制函数 `series` 是核心，参数和结果队列都是保证其实现。* 

###  实现并行化流程控制

*继续采用阮一峰老师的示例。*

```javascript
var items = [1, 2, 3, 4, 5, 6]
var results = []

function async(arg, callback) {
    console.log('参数为 ' + arg + '，1秒后返回结果')
    setTimeout(function () { callback(arg * 2) }, 1000)
}

function final(value) {
    console.log('完成：', value)
}

items.forEach(function(item) {
    async(item, function(result){
        results.push(result)
        if (results.length === items.length) {
            final(results[results.length - 1])
        }
    })
})
```

*这里的流程简单，写个循环按顺序开始即可。不必递归调用。*

###  利用社区的工具

社区中的很多附加模块都提供了方便好用的流程控制工具。其中比较流行的有 Async、Step 和 Seq 这三个。