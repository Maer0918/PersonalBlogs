##  BOM

- [x] 理解 window 对象—— BOM 的核心
- [ ] 控制窗口，框架和弹出窗口
- [x] 利用 location 对象中的页面信息
- [ ] 利用 navigator 对象了解浏览器



ECMAScript 是 JavaScript 的核心，但如果要在 Web 中使用 JavaScript，那么 BOM（浏览器对象模型）则无疑才是真正的核心。

W3C 为了把浏览器中 JavaScript 最基本的部分标准化，已经将 BOM 的主要方面纳入了 HTML5 的规范中。

###  window 对象

BOM 的核心对象是 window，它表示浏览器的一个实例。在浏览器中， window 既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。

####  全局作用域

所有在全局作用域中声明的变量，函数都会变成 window 对象的属性和方法：

```javascript
var age = 29;
function sayAge () {
    alert(this.age);
}

alert(window.age); // 29
sayAge(); // 29
window.sayAge(); // 29
```

全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以。

```javascript
var age = 29;
window.color = "red";
delete window.age; // false
delete window.color; // true
alert(window.age); // 29
alert(window.color); // undefined
```

使用 var 语句添加的 window 属性的 [[Configurable]] 特性为 false。

尝试访问未声明的变量会抛出错误，但是通过查询 window 对象，可以知道某个可能未声明的变量是否存在。

```javascript
var newValue = oldValue;
/*
Uncaught ReferenceError: oldValue is not defined
    at <anonymous>:1:16
(anonymous) @ VM260:1
*/
var newValue = window.oldValue; //undefined
```

####  窗口关系及框架

如果页面中包含框架，则每个框架都拥有自己的 window  对象，并且保存在 frames 集合中。frames[0]~frames[n]从左到右，从上到下，或者框架名称来访问对应的 window 对象。每个 window 对象都有一个 name 属性，其中包含框架的名称。

```html
<html>
    <head>
        <meta charset="utf-8">
      <title>Frameset Example</title>
    </head>
    <frameset rows="160,*">
     	<frame src="frame.htm" name="topFrame"></frame>   
    	<frameset cols="50%,50%">
            <frame src="anotherframe.htm" name="leftFrame"></frame>
    		<frame src="yetanotherframe.htm" name="rightFrame"></frame>
    </frameset>
     </frameset>
</html>
```

我们可以使用 window.frames[0] 或者 window.frames["topFrame"] 来引用上方的框架。不过，最好使用 top 而非 window 来引用这些框架，例如 top.frames[0]。

因为 top 对象始终指向最高（最外）层的框架，也就是浏览器窗口。使用它可以确保在一个框架中正确地访问另一个框架。

因为对于在一个框架中编写的任何代码来说，其中的 window 对象指向的都是那个框架的特定实例，而非最高层框架。

与 top 相对的另一个 window 对象是 parent。顾名思义，parent（父）对象始终指向当前框架的直接上层框架。

与框架有关的最后一个对象是 self，它始终指向 window；实际上，self 和 window 对象可以互换使用。引入 self 对象的目的值是为了与 top 和 parent 对象对应起来，因此它不额外包含其他值。

> 在使用框架的情况下，浏览器中会存在多个 Global 对象。在每个框架中定义的全局变量会自动成为框架中 window 对象的属性。由于每个 window 对象都包含原生类型的构造函数，因此每个框架都有一套自己的构造函数，这些构造函数一一对应，但并不项等。例如，top.Object 并不等于 top.frames[0].Object。这个问题会影响到对跨框架传递的对象使用 instanceof 操作符。

第八章内容暂留后学……

###  location 对象

location 是最有用的 BOM 对象之一，它提供了与当前窗口中家在的文档有关的信息，还提供了一些导航功能。

事实上，location 对象是很特别的一个对象，因为它既是 window 对象的属性，也是 document 对象的属性；还句话说，window.location 和 document.location 引用的是同一个对象。

location 对象不只保存着当前文档的信息，还可以将 URL 解析为独立的片段。

* hash
* host
* hostname
* href
* pathname
* port
* protocol
* search

P207

####  查询字符串

虽然 location 的属性可以访问到大多数信息，但其中访问 URL 包含的查询字符串的属性并不方便。因为不返回逐个查询字符串参数，只返回整个查询字符串。

```javascript
function getQueryStringArgs() {
    // 取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
        	args = {},
        	items = qs.length ? qs.split("&") : [],
        	item = null,
        	name = null,
        	value = null,
        	i = 0,
        	len = items.length;
    
    for (i = 0; i < len; i++) {
		item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        
        if (name.length) {
            args[name] = value;
        }
    }
    
    return args;
}

getQueryStringArgs();
/*
{q: "攻略", qs: "n", form: "QBLH", sp: "-1", pq: "攻略", …}
cvid: "C86AD8BF7A9441BDBC83E7F18620E4BE"
form: "QBLH"
pq: "攻略"
q: "攻略"
qs: "n"
sc: "9-2"
sk: ""
sp: "-1"
__proto__: Object
*/
```

