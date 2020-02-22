##  Node Web 程序是什么

Node Web 程序的工作包括：开始一个新的项目、管理依赖项、创建 RESTful API、把数据保存到数据库中，以及用模板做一个用户界面。

###  了解 Node Web 程序的结构

典型的 Node Web 程序由下面几部分组成的：

* package.json —— 一个包含依赖项列表和运行这个程序的命令的文件
* public/ —— 静态资源文件夹，CSS 和客户端 JavaScript 都放在这里
* node_modules/ —— 项目的依赖项都会装到这里
* 放程序代码的一个或多个 JavaScript 文件。

程序代码一般又会分成下面几块：

* app.js 或 index.js —— 设置程序的代码
* models/ —— 数据库模型
* views/ —— 用来渲染页面的模板
* controllers/ 或 routes/ —— HTTP 请求处理器
* middleware/ —— 中间件组件

####  开始一个新的 Web 程序

创建一个新的 node 项目：

```shell
mkdir later
cd later
npm init -fy
```

大多数人都会用 npm 上的模块来降低开发难度。Node 自带了一个 http 模块，他有个服务器。但使用 http 模块依然需要做很多套路化的开发工作，所以我们一般会选择使用更便捷的 Express。

#####　添加依赖项

```shell
npm install --save express
```

对应的 package.json 会看到 Express 已经给加上去了。

```json
"dependencies": {
    "express": "^4.14.0"
}
```

Express 模块也应该安装在了这个项目的 node_modules/ 文件夹下。如果想卸载 Express，可以运行 `npm rm express --save`。这个命令会把它从 node_modules/ 中删除，还会更新 package.json 文件。

#####  一个简单的服务器

Express 以 Node 自带的 http 模块为基础，致力于在 HTTP 请求和响应上来建模 Web 程序。

为了做出一个最基本的程序，我们需要用 express() 创建一个程序实例，添加路由器，然后将这个程序实例绑定到一个 TCP 端口上。

```javascript
const express = require('express')
const app = express()

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Express web app available at localhost: $(port)`)
})
```

#####  npm 脚本

启动服务器的命令（node index.js）可以保存为 npm 脚本，打开 package.json 文件，在 scripts 里添加一个 start 属性：

```json
"scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

现在只要运行 `npm start` 就可以启动程序了。如果你看到有错误提示说端口 3000 已经被占用，那么可以运行 `PORT=3001 npm start` 使用另外一个端口。npm 脚本可以做很多事情：构建客户端包、执行测试、生成文档等。它基本就是一个微型脚本调试工具，只要你喜欢，放什么都行。

###  搭建一个 RESTful Web 服务



设计 RESTful 服务时，要想好需要哪些操作，并将它们映射到 Express 里的路由上。就此而言，需要实现保存文章、获取文章、获取包含所有文章的列表和删除不再需要的文章这几个功能。分别对应下面这些路由：

* POST /articles —— 创建新文章
* GET /articles/:id —— 获取指定文章
* GET /articles —— 获取所有文章
* DELETE /articles/:id —— 删除指定文章

在考虑数据库和 Web 界面等问题之前，我们先重点解决如何用 Express 创建 RESTful 资源的问题。你可以用 cURL 向示例程序发起请求，然后再逐步实现数据存储等更加复杂的操作，让它越来越像一个真正的 Web 程序。

下面这个简单的 Express 程序实现了这些路由，不过现在是用 JavaScript 数组来存储文章的。

P48

*书里教的示例不好用，这里开始用 Express 官方文档。感谢这本书引导我至此。*