##	DOM 扩展

对 DOM 的两个主要的扩展是 Selectors API（选择符 API）和 HTML5。还有一个不那么引人瞩目的 Element Traversal（元素遍历）规范，为 DOM 添加了一些属性。

###  选择符 API

众多 JavaScript 库中最常用的一项功能，就是根据 CSS 选择器选择与某个模式匹配的 DOM 元素。实际上，jQuery 的核心就是通过 CSS 选择符查询 DOM 文档取得元素的引用，从而抛开了 getElementById() 和 getElementsByTagName()。

把 CSS 查询变成原生 API 之后，解析和树查询操作可以在浏览器内部通过编译后的代码来完成，极大地改善了性能。

**Selectors API Level1 的核心是两个方法：querySelector() 和 querySelectorAll()。**在兼容的浏览器中，可以通过 Document 及 Element 类型的实例调用它们。

####  querySelector() 方法

querySelector() 方法接收一个 CSS 选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 null。

```javascript
// 取得 body 元素
var body = document.querySelector("body");
// 取得 ID 为 "myDiv" 的元素
var myDiv = document.querySelector("#myDiv");
// 取得类为 "selected" 的第一个元素
var selected = document.querySelector(".selected");
// 取得类为 "button" 的第一个图像元素
var img = document.body.querySelector("img.button")
```

**通过 Document 类型调用 querySelector() 方法时，会在文档元素的范围内查找匹配的元素。而通过 Element 类型调用 querySelector() 方法时，只会在该元素后代元素的范围内查找匹配的元素。**

```javascript
var fixedImage = document.querySelector("#fixedImage");
var body = document.querySelector("body");
var wx_1= document.querySelector(".wx_1");
```

*querySelector() 方法仅返回匹配第一个符合的项。*

####  querySelectorAll() 方法

querySelectorAll() 返回一个 NodeList 的实例。

**具体来说，返回的值实际上是带有所有属性和方法的 NodeList，而其底层时现则类似于一组元素的快照，而非不断对文档进行搜索的动态查询。这样实现可以避免使用 NodeList 对象通常会引起的大多数性能问题。**

与 querySelector() 类似，能够调用 querySelectorAll() 方法的类型包括 Document，DocumentFragment 和 Element。

*DocumentFragment Node 是为了保存多个将来可能添加到文档树中的节点而使用的，避免浏览器的反复渲染。*

```javascript
var ems = document.getElementById("myDiv").querySelectorALL("em");
//...
```

####  matchsSelector() 方法

Selector API Level 2 规范为 Element 类型新增了一个方法 matchsSelector() 。接收一个参数，即 CSS 选择符。如果调用元素与该选择符匹配，返回 true；否则，返回 false。

###  元素遍历

因为 IE 和其他所有浏览器在文本节点的处理不一致，导致了使用 childNodes 和 firstChild 等属性时的行为不一致。为了弥补这一差异同时保持 DOM 规范不变，Element Traversal 规范定义了一组新属性。

* childElementCount：返回子元素（不包括文本节点和注释）的个数。
* firstElementChild：指向第一个子元素。
* lastElementChild：指向最后一个子元素。
* previousElementSibling：指向前一个同辈元素。
* nextElementSibling：指向后一个同辈元素。

*可以看出，这里都有带 Element 字，所以这些都是指向 Element 或仅与 Element 相关的。*

###  HTML5

HTML5 规范则围绕如何使用新增标记定义了大量 JavaScript API。其中一些 API 与 DOM 重叠，定义了浏览器应该支持的 DOM 扩展。

####  与类相关的扩充

HTML5 新增了很多 API，致力于简化 CSS 类的用法。

#####  getElementsByClassName() 方法

该方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的 NodeList。

因为返回的对象是 NodeList，所以使用这个方法与使用 getElementByTagName() 以及其他返回 NodeList 的 DOM 方法都具有同样的性能问题。

#####  classList 属性

在操作类名时，需要通过 className 属性添加，删除和替换类名。

这是为了应对一个标签拥有多个类名的情况。

####  焦点管理

HTML5 也添加了辅助管理 DOM 焦点的功能。

*焦点管理不仅能设置焦点，还能检测是否获得焦点，这就是坑比学习网站不让焦点转移的原理？*

首先就是 document.activeElement 属性，这个属性始终会引用 DOM 中当前获得了焦点的元素。

元素获得焦点的方式：

* 页面加载
* 用户输入
* 在代码中调用 focus() 方法

```javascript
var button = document.querySelector("myButton");
button.focus();
alert(document.activeElement === button);
```

默认情况下，文档刚刚加载完成时，document.activeElement 中保存的是 document.body 元素的引用。文档加载期间，document.activeElement 的值为 null。

```javascript
function alertFocus() {
    function al() {
        if (!document.hasFocus()) 
            alert("Please look at me!");    
    }
    setInterval(al, 3000);
}

alertFocus();
```

使用 document.hasFocus() 可以确定文档是否获得焦点。

####  HTMLDocument 的变化

HTML5 扩展的属性：

* document.readyState 文档加载状态
* document.compatMode 兼容模式
* document.head 头部元素节点

####  字符集属性

document.charset 可以读写文档的字符集。

####  自定义数据属性

HTML5 规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值。dataset 属性的值是 DOMStringMap 的一个实例，也就是一个键值对的映射。

```javascript
var div = document.querySelector("#myDiv");

var appId = div.dataset.appId;
var myName = div.dataset.myname;

div.dataset.appId = 23456;
div.dataset.myname = "Greg";
```

####  插入标记

DOM 如果用于大量新 HTML 标记的情况则操作过于繁琐。相对而言，使用插入标记的技术，直接插入 HTML 字符串不仅更简单，而且速度更快。

#####  innerHTML 属性

innerHTML 属性在读模式下，只返回所有子节点对应的 HTML 标记，不返回本身的 HTML 标记。在写模式下，innerHTML 会根据指定的值创建新的 DOM 树，然后用这个 DOM 树完全替换调用元素原先的所有子节点。

*也就是说，想要在哪里插入一大段的话，就找到想插入位置的前一个节点，修改其 innerHTML 属性。不过这样好像也不完全行，因为前一个节点内容不一定为空，而且如果同辈插入的话，这个方法做不到。*

```html
<div class="n n1">Search <img src="/img/FOREIGN/2015/03/212677/images/icon1.gif" alt=""></div>
```

```javascript
var n1 = document.querySelector(".n1");
n1.innerHTML;
// "Search <img src="/img/FOREIGN/2015/03/212677/images/icon1.gif" alt="">"
```

使用写模式的话，就只是修改其属性的值就好了：

```javascript
var body = document.body;
body.innerHTML = "<h1>Hello world!</h1>"
```

设置了 innerHTML 之后，可以像访问文档中的其他节点一样访问新创建的节点。

使用 innerHTML 属性也有一些限制。比如在大多数浏览器中，通过 innerHTML 插入 \<script> 元素并不会执行其中的脚本。

并不是所有元素都支持 innerHTML 属性。不支持 innerHTML 的元素有：\<col>，\<colgroup>，\<frameset>，\<head>，\<html>，\<style>，\<table>，\<tbody>，\<thead>，\<tfoot> 和 \<tr>。

*大部分都是和表格有关的标签。*

#####  outerHTML 属性

outerHTML 与 innerHTML 对应，不过它返回及作用的是本身节点及所有子节点。

#####  insertAdjacentHTML() 方法

插入标记的最后一个新增方法是 insertAdjacentHTML() 方法。该方法接受两个参数：插入位置和要插入的 HTML 文本。第一个参数必须是以下字符串值之一：

* "beforebegin" 同辈且当前元素之前
* "afterbegin" 子，第一个
* "beforeend" 子，最后一个
* "afterend" 同辈，下一个

#####  内存与性能问题

在使用本节介绍的 innerHTML 属性，outerHTML 属性，insertAdjacentHTML() 方法时，可能导致内存占用问题。在删除带有事件处理程序或引用了其他 JavaScript 对象子树时，就有可能导致内存占用问题。元素与处理事件程序之间的绑定关系在内存中没有一并删除。

#### scrollIntoView() 方法

scrollIntoView() 可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。

```javascript
var p1_last = document.querySelector(".p1_left").lastElementChild;
p1_last.scrollIntoView();
```

###  专有扩展

#### 文档模式

略

####  children 属性

由于 IE9 之前的版本与其他浏览器在处理文本节点中的空白符时有差异，因此就出现了 children 属性。这个属性是 HTMLCollection 的实例，只包含元素中通言还是元素的子节点。

####  contains() 方法

用来确定父节点是否包含某个节点。

```javascript
var p1_last = document.querySelector(".p1_left").lastElementChild;
p1_left = p1_last.parentNode;
p1_left.contains(p1.last); // true
```

DOM Level3 中的 compareDocumentPosition() 也能够确定节点间的关系。返回一个表示该关系的位掩码（bitmask）。

| 掩码 | 节点关系 |
| :--: | :------: |
|  1   |   无关   |
|  2   |   居前   |
|  4   |   居后   |
|  8   |   包含   |
|  16  |  被包含  |

####  插入文本

innerText 和 outerText 作用与 innerHTML 和 outerHTML 类似，只不过没有被纳入规范。

####  滚动

列举了没有被纳入规范的滚动方法。

