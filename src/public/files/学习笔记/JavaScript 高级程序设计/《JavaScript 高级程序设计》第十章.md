##  DOM

- [x] 理解包含不同层次节点的 DOM
- [x] 使用不同的节点类型
- [x] 克服浏览器兼容性问题及各种陷阱

DOM（文档对象模型）是针对 HTML 和 XML 文档的一个 API（应用程序编程接口）。DOM 描绘了一个层次化的节点树，允许开发人员添加，移除和修改页面的某一部分。

###  节点层次

DOM  可以将任何 HTML 或 XML 文档描绘成一个由树状结构。

```html
<html>
    <head>
        <title>Sample Page</title>
    </head>
    <body>
        <p>
            Hello World!
        </p>
    </body>
</html>
```

文档节点是每个文档的根节点。在这个例子中，文档节点只有一个子节点，即 <html> 元素，我们称之为文档元素。

* Document
  * Element html
    * Element head
      * Element title
        * Text Sample Page
    * Element body
      * Element p
        * Text Hello World!

文档元素是文档最外层的元素，文档中的其他所有元素都包含在文档元素中。**每个文档只能由一个文档元素。**在 HTML 页面中，文档元素始终都是 <html> 元素。在 XML 中，没有预定义的元素，因此任何元素都可能称为文档元素。

每一段标记都可以通过树中的一个节点来表示：HTML 元素通过元素节点表示，特性（attribute）通过特性节点表示，文档类型通过文档类型节点表示，而注释则通过注释节点表示。总共有 12 种节点类型，这些类型都继承自一个基类型。

####  Node 类型

DOM1 级等一了一个 Node 接口，该接口将由 DOM 中的所有节点类型实现。这个 Node 接口在 JavaScript 中是作为 Node 类型实现的；JavaScript 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。

每个节点都有一个 nodeType 属性，用于表明节点的类型。节点类型由在 Node 类型中定义的下列 12 个数值常量来表示，任何节点类型必居其一：

1. Node.ELEMENT_NODE
2. Node.ATTRIBUTE_NODE
3. Node.TEXT_NODE
4. Node.CDATA_SECTION_NODE
5. Node.ENTITY_REFERENCE_NODE
6. Node.ENTITY_NODE
7. Node.PROCESSING_INSTRUCTION_NODE
8. Node.COMMENT_NODE
9. Node.DOCUMENT_NODE
10. Node.DOCUMENT_TYPE_NODE
11. Node.DOCUMENT_PRAGENT_NODE
12. Node.NOTATION_NODE

这些序号就是这些常量的值。

> 除了 IE 之外，在其他所有浏览器中都可以访问到 Node 类型。

并不是所有节点类型都受到 Web 浏览器的支持。开发人员最常用的就是元素和文本节点。

*在开始后面内容的学习时，首先要掌握选取节点的方法。*P249

*查找元素操作在 P256*

*回想下节点的概念，节点的英文就是 Node。Node 在 JavaScript 里有 12 种，所有标签都是节点，标签内的文本，代码的注释都是节点……文档节点时每个文档的根结点。*

#####  查找元素

Document 类型提供了两个方法获取元素：getElementById()，getElementsByTagName() 和 getElementsByName()。

getElementById() 的 ID 必须与页面中元素的 id 严格匹配，包括大小写。

```html
<div id="myDiv">
    Some Text
</div>
```

```javascript
var div = document.getElementById("myDiv");
```

getElementsByTagName() 则返回一个 NodeList，在 HTML 文档中，这个方法会返回一个 HTMLCollection 对象，与 NodeList 非常类似。

```javascript
var images = document.getElementsByTagName("img");
```

getElementsByTagName() 支持方括号语法。在后台，对数值引索就会调用 item()，而对字符串引索就会调用 namedItem()。

```javascript
var myImage = images["myImage"];
```

如果使用 getElementsByTagName("*") 则会返回所有节点，包括注释节点。

```javascript
var allElements = document.getElementsByTagName("*");
```

getElementsByName() 则接收的是 name 参数。

#####  nodeName 和 nodeValue 属性

了解节点的具体信息，可以使用 nodeName 和 nodeValue 这两个属性。这两个属性的值完全取决于节点类型。在使用这两个值以前最好先检测一下节点类型。

```javascript 
var copyright = document.getElementById("copyright");

if (copyright.nodeType == 1) {
    var value = copyright.nodeName;
}

value; // "DIV"
copyright.nodeValue; // null
```

**对于元素节点，nodeName 中保存的始终都是元素的标签名，而 nodeValue 的值则始终为 null。**

#####  节点关系

每个节点都可能有父，子，兄弟节点。

每个节点都有一个 childNodes 属性，其中保存着一个 NodeList 对象。NodeList 是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。

NodeList 虽然可以通过方括号语法访问其值，及拥有 length 属性，但不是 Array 的实例。

**NodeList 对象的独特之处在于，它实际上是基于 DOM 结构动态执行查询的结果，因此 DOM 结构的变化能够自动反映在 NodeList 对象中。我们常说，NodeList 是有生命，有呼吸的对象，而不是在我们第一次访问它们的某个瞬间的快照。**

```html
<div id="copyright">
	<a href="/n3/2018/0706/c90828-9478507.html" target="_blank">About People's Daily Online</a> | <a href="http://en.people.cn/n3/2017/0829/c98649-9261777.html" target="_blank"> Join Us </a>| <a href="http://en.people.cn/102840/8347260.html" target="_blank">Contact Us</a>
<br>people.cn © People's Daily Online
</div>
```

```javascript
var copyright = document.getElementById("copyright");

copyright.childNodes;
// NodeList(9) [text, a, text, a, text, a, text, br, text]
copyright.children;
// HTMLCollection(4) [a, a, a, br]
```

*Node.childNodes 保存的是按照 Node 标准划分的 NodeList，所以几乎每两个节点之间都有一个 text。而 Node.children 保存的则是标签集合 HTMLCollection，只保存里面的子标签。*

```html
<div id="copyright">
	<a href="/n3/2018/0706/c90828-9478507.html" target="_blank">About People's Daily Online</a> | <a href="http://en.people.cn/n3/2017/0829/c98649-9261777.html" target="_blank"> Join Us </a>| <a href="http://en.people.cn/102840/8347260.html" target="_blank">Contact Us</a>
<br>people.cn © People's Daily Online
    
    <br>
    <br>
    <br>
</div>
```

```javascript
copyright.childNodes;
// NodeList(15) [text, a, text, a, text, a, text, br, text, br, text, br, text, br, text]
```

*现在我信 NodeList 是有生命的了，因为我没有重新调用赋值的情况下，直接修改了 html 页面，然后再次返回结果时它准确地体现出了修改。*

每个节点都有一个 parentNode 属性，该属性指向文档树中地父节点。包含在 childNodes 列表中的所有节点都具有相同的父节点，因此它们的 parentNode 属性都指向同一个节点。previousSibling 属性可以访问上一个同辈节点，nextSibling 属性可以访问下一个同辈节点。

如果 NodeList 只有一个节点，那么该节点 nextSibling 和 previousSibling 都为 null。其父节点的 firstChild 和 lastChild 同指向该结点。

someNode.hasChildNodes() 方法可以判断有无子节点。

所有节点都有 ownerDocument，该属性指向表示整个文档的文档节点。这种关系表示的是任何节点都属于它所在的文档，任何节点都不能同时存在于两个或更多文档中。通过这个属性可以直接访问文档节点。

#####  操作节点

因为关系指针都是只读的，所以 DOM 提供了一些操作节点的方法。

最常用的是 appendChild()，用于 childNodes 列表的末尾添加一个节点。

```javascript
var copyright = document.getElementById("copyright");
var returnedNode = copyright.appendChild(    newNode    );
```

*因为这里需要新建一个 Node，所以我们要在后面章节中找到新建 Node 的操作。*

*P268 里我们找到了创建元素的操作*

#####  创建元素

使用 document.createElement() 方法可以创建新元素。

```javascript
var div = document.createElement("div");

div.id = 'myNewDiv';
div.className = "box";
```

创建新元素时会自动为其设置 ownerDocument 属性。创建以后可以操作元素的特性，为它添加更多子节点以及其他操作。

一旦将元素添加到文档树中，浏览器就会立即呈现该元素。此后对这个元素的任何操作都会实时反映在浏览器中。

*我们返回到操作节点的章节中。*

##### 操作节点（续）

```javascript
var copyright = document.getElementById("copyright");
var newNode = document.createElement("p");
newNode.id = "myNewDiv";
newNode.className = "boxx";
var returnedNode = copyright.appendChild(newNode);
returnedNode == newNode;
```

```javascript
<div id="copyright">
	<a href="/n3/2018/0706/c90828-9478507.html" target="_blank">About People's Daily Online</a> | <a href="http://en.people.cn/n3/2017/0829/c98649-9261777.html" target="_blank"> Join Us </a>| <a href="http://en.people.cn/102840/8347260.html" target="_blank">Contact Us</a>
<br>people.cn © People's Daily Online
    
    <br>
    <br>
    <br>
<p id="myNewDiv" class="boxx"></p></div>
```

*添加后还真就实时反映到 HTML 文档中了。*

如果传入到 appendChild() 中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。即使可以将 DOM 树看成是由一系列指针连接起来的，但任何 DOM 节点也不能同时出现在文档中的多个位置上。

```javascript
var copyright = document.getElementById("copyright");
var returnedChild = copyright.appendChild(copyright.childNodes.item(0));

returnedChild;
// #text
copyright.childNodes;
/*
NodeList(16) [a, text, a, text, a, text, br, text, br, text, br, text, br, text, p#myNewDiv.boxx, text]
*/
```

如果要插入某个特定的位置，可以使用 insertBefore() 方法。这个方法接受两个参数：要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点（previousSibling)，同时被方法返回。如果参照节点是 null，则 insertBefore() 与 appendChild() 执行相同的操作。

```javascript
returnedNode = copyright.insertBefore((function() {
    var newNode = document.createElement("span");
    newNode.id = "newSpan";
    newNode.className = "newSpanClass";
    return newNode;
}()), copyright.childNodes[1]);
// <span id="newSpan" class="newSpanClass"></span>
```

replaceChild() 可以替换节点，它接受的两个参数是：要插入 的节点和要替换的节点。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置。

```javascript
var copyright = document.getElementById("copyright");
var returnedNode = copyright.replaceChild((function(){
    var newNode = document.createElement("span");
    newNode.id = "newSpan";
    newNode.className = "newSpanClass";
    return newNode;
}()), copyright.childNodes[0]);
copyright.childNodes;
// NodeList(9) [span#newSpan.newSpanClass, a, text, a, text, a, text, br, text]
```

*对于函数表达式作为参数时是否需要括号包围，不需要括号包围也可行。*

```javascript
var returnedNode = copyright.replaceChild(function(){
    var newNode = document.createElement("span");
    newNode.id = "newSpan";
    newNode.className = "newSpanClass";
    return newNode;
}(), copyright.childNodes[1]);
```

技术上来讲，被替换的节点仍然在文档中，但它在文档中已经没有了自己的位置。
removeChild() 用来移除节点。

*因为这里的 DOM 是以 Document 为根节点的，所以所有 HTML 元素都是里面的子节点，这样就衍生出了操纵子节点，而不操纵本体的思维。*

#####  其他方法

cloneNode() 返回自己的副本，接受参数 true 或 false 表示是否执行深复制。复制返回的节点副本属于文档所有，但并没有为它指定父节点，要使用节点操作使其进入文档树中。

normalize() 唯一的作用就是处理文档树中的文本节点。

####  Document 类型

**JavaScript 通过 Document 类型表示文档。在浏览器中， document 对象是 HTMLDocument（继承自 Document 类型）的一个实例，表示整个 HTML 页面。而且， document 对象是 window 对象的一个属性，因此可以将其作为全局对象来访问。**

#####  文档的子节点

虽然 DOM 标准规定 Document 节点的子节点可以是 DocumentType，Element，ProcessingInstructor 或 Comment，但还有两个内置的访问其子节点的快捷方式。

第一个就是 documentElement 属性，指向 HTML 页面中的 \<html> 元素。

另一个就是通过 childNodes 列表访问文档元素。不过还是第一种更快捷。

作为 HTMLDocument 的实例，document 对象还有一个 body 属性，直接指向 \<body> 元素。因为开发人员经常使用这个元素，所以 document.body 在 JavaScript 代码中出现的频率非常高。

Document 另一个可能的子节点是 DocumentType。通常将 \<!DOCTYPE> 标签看成一个与文档其他部分不同的实体，可以通过 doctype 属性即 document.doctype 来访问。

#####  文档信息

作为 HTMLDocument 的一个实例，document 对象还有一些标准的 Document 对象所没有的属性。比如 document.title，document.URL，document.domain，document.reference。

#####  特殊集合

HTMLCollection 对象的特殊集合：

* document.anchors 包含文档中所有带 name 特性的 \<a> 元素。
* document.forms 所有的表格
* document.images
* document.links 所有带有 href 特性的 \<a> 元素

集合中的项也会随着当前文档内容的更新而更新。

##### 文档写入

有一个 document 对象的功能已经存在很多年了，那就是将输出流写入到网页中的能力。

document.write() | document.writeln() | document.open() | document.close()

其中，write() 和 writeln() 方法都接受一个字符串参数，即要写到输入流中的文本。

除了可以使用 write() 和 writeln() 动态显示文本或标签外，还可以动态地包含外部资源，例如 JavaScript 文件等。

前面的例子使用 document.write() 在页面被呈现的过程中直接向其输出了内容。如果在文档加载结束后再调用 document.write() ，那么输出的内容将会重写整个页面。

使用 window.onload 事件处理程序，等页面完全加载后再延迟执行函数。

方法 open() 和 close() 分别用于打开和关闭网页输出流。如果是在页面加载期间使用 write() 或 writeln() 方法，则不需要用到这两个方法。

> 严格型 XHTML 文档不支持文档写入。

####  Element 类型

除了 Document 类型之外，Element 类型就要算是 Web 编程中最常用的类型了。Element 类型用于表现 XML 或 HTML 元素。

**Element 节点的 nodeValue 始终为 null 。nodeName 的值为元素的标签名。**

标签名可以用 nodeName 或 tagName 属性来访问，建议用后者。

```javascript
var copyright = document.getElementById("copyright");
copyright.tagName == "DIV"; // true
```

#####  HTML 元素

所有 HTML 元素都由 HTMLElement 类型表示，不是直接通过这个类型，也是通过它的子类型来表示。HTMLElement 类型直接继承自 Element 并添加了一些属性。

id | title | lang | dir | className

这些属性是可读写的。

#####  取得特性

每个元素都有一个或多个特性，这些特性的用途是给出相应元素或其内容的附加信息。

操作特性的 DOM 方法主要有三个，分别是 getAttribute()，setAttribute() 和 removeAttribute()。三个方法都可以对任何特性使用。

有两类特殊的特性，它们虽然有对应的属性名，但属性的值与通过 getAttribute() 返回的值不相同。

第一类特性是 style，在通过 getAttribute() 访问时，返回的是 CSS 文本，通过 style 属性返回时，是一个对象。由于 style 属性是用于编程方式访问元素样式的，因此并没有直接映射到 style 特性。

第二类特性是 onclick 这样的事件处理事件程序。在元素上使用时，onclick 包含的是 JavaScript 代码，如果通过 getAttribute() 访问，则会返回相应代码的字符串。而在访问 onclick 属性时，则会返回一个 JavaScript 函数。

#####  设置特性

setAttribute() 方法接受两个参数：要设置的特性名和值。特性不存在则创建并设置，存在则替换。

removeAttribute() 清除特性值并删除特性。

#####  attributes 属性

Element 类型是使用 attributes 属性的唯一一个 DOM 节点类型。attributes 属性中包含一个 NamedNodeMap，与 NodeList 类似，也是一个“动态”的集合。元素的每一个特性都由一个 Attr 节点表示，每个节点都保存在 NamedNodeMap 对象中。NamedNodeMap 对象拥有下列方法。

* getNamedItem(name) ：返回 nodeName 属性等于 name 的节点；
* removeNamedItem(name)：从列表中移除 nodeName 属性等于 name 的节点；
* setNamedItem(node)：向列表中添加节点，以节点的 nodeName 属性为索引；
* item(pos)：返回位于数字 pos 位置处的节点。

*别忘了有一种 Node 是 Node.ATTRIBUTE_NODE 值。也就是 Attribute 也是 Node。*

attributes 属性中包含一系列节点，每个节点的 nodeName 就是特性的名称，而节点的 nodeValue 就是特性的值。

```javascript
var id = element.attributes.getNamedItem("id").nodeValue;

var id = element.attributes["id"].nodeValue;
element.attributes("id").nodeValue = "someOtherId";
```

也可以使用方括号语法访问。attribute 的 nodeValue 的值也是可读写的。

setNamedItem() 时一个很不常用的方法，通过这个方法可以为元素添加一个新特性，为此需要为它传入一个特性节点。

一般来说，由于前面介绍的 attributes 的方法不够方便，因此开发人员更多的会使用 getAttribute()，removeAttribute() 和 setAttribute() 方法。不过如果想要遍历属性的时候，attributes  就有其作用了。

#####  元素的子节点

略

####  Text 类型

文本节点由 Text 类型表示，包含的是可以照字面解释的纯文本内容。纯文本中可以包含转义后的 HTML 字符，但不能包含 HTML 代码。

**Text Node 的 nodeValue 的值为节点所包含的文本。**

**Text Node 没有子节点。**

操作文本节点的方法：

* appendData(text)：将 text 添加到节点末尾
* deleteData(offset, count)
* insertData(offset, text)
* replaceData(offset, count, text)
* splitText(offset)
* substringData(offset, count)

#####  创建文本节点

document.createTextNode() 创建新文本节点，这个方法接受一个参数——要插入节点中的文本。

*由于文本节点通常作为元素节点的子节点，故可能会有加粗或斜体等标签环绕。在向 DOM 文档中插入文本之前，先对其进行 HTML 编码。*

*对文本节点的文本进行 HTML 编码有两种方式，一种是修改其 nodeValue 时，直接传入普通字符串，然后其会自动进行 HTML 编码转义。第二种是创建文本节点时传入普通字符串，也自动会对其进行 HTML 编码转义。*

```javascript
/* 这段代码终于可用！*/

var aText = function (startNode) { 
    if (startNode.hasChildNodes())
        var queue = Array.prototype.slice.call(startNode.childNodes, 0);
    while (queue.length) {
        var node = queue.pop();
    	if (node.hasChildNodes()) {
            var toConcat = Array.prototype.slice.call(node.childNodes, 0);
            queue = queue.concat(toConcat);
        }
        if (node.nodeType == Node.TEXT_NODE)
            return node;
    }
} (document);

aText.nodeValue = "<h1>THIS IS TITLE!!!</h1>"
```

*concat() 不会改变原数组的 length 属性值！要手动添加。*

*该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。*

P271

```javascript
var element = document.createTextNode("Hello world!");
```

#####  规范化文本节点

对父节点使用，将相邻的文本节点拼接——normalize() 方法。

#####  分割文本节点

splitText() 按照指定位置分割 nodeValue 值。

####  Attr 类型

元素的特性在 DOM 中以 Attr 类型来表示。

* nodeValue 的值是特性的值
* nodeName 是特性的名称
* 在 HTML 中不支持（没有）子节点

**尽管它们也是节点，但特性却不被认为是 DOM 文档树的一部分。开发人员最常使用的是 getAttribute()，setAttribute() 和 removeAttribute() 方法，很少直接引用特性节点。**

###  DOM 操作技术

由于浏览器中充斥这隐藏的陷阱和不兼容问题，用 JavaScript 代码处理 DOM 的某些部分要比处理其他部分更复杂一些。

*这一大节应该是本章最重要的应用大节了，因为前面把理论知识都学了。*

#### 动态脚本

**使用 \<script> 元素可以向页面中插入 JavaScript 代码，一种方式是通过 src 特性包含外部文件，另一种方式就是用这个元素本身来包含代码。**

*这两种说的都是 HTML 技术。*

```HTML
/* 这段代码是试验性代码，不用管 */

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Outside JS File</title>
    </head>
    <body>
       	<p>
            Let's load a js file from script now.
        </p>
        <script type="text/javascript">
            document.write("<strong>Paragraph</strong>");
        </script>
    </body>
</html>
```

**而这一节要讨论的动态脚本，值的是在页面加载时不存在，但将来的某一时刻通过修改 DOM 动态添加的脚本。**

跟操作 HTML 元素一样，创建动态脚本也有两种方式：插入外部文件和直接插入 JavaScript 代码。

```javascript
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "/home/maer/codes/frontend/js/outter.js";
document.body.appendChild(script);
```

这里有两个注意点，设置元素属性的时候，可以直接通过节点属性修改吗？可以直接通过 document.body 来访问主体吗？*

> 任何元素的所有特性，也都可以通过 DOM 元素本身的属性来访问。当然，HTMLElement 也会有 5 个属性与相应的特性一一对应。不过，只有公认的（非自定义的）特性才会以属性的形式添加到 DOM 对象中。

*也就是说内部可能有设置了添加属性就添加特性的相关内部函数。*

> 作为 HTMLDocument 的实例，document 对象还有一个 body 属性，直接指向 <body> 元素。

```HTML
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>O</title>
    </head>
    <body>
        <p>
            load js file
        </p>
        <script type="text/javascript">
        	var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "/home/maer/codes/frontend/js/outter.js";
            document.body.appendChild(script);
        </script>
    </body>
</html>
```

*在网页中修改 HTML 代码不会正确呈现这段动态脚本的效果。控制台和原 HTML 直接打开可以。*

问题只有一个：怎么知道脚本加载完成呢？遗憾的是，并没有什么标准方式来探知这一点。不过，与此相关的一些事件倒是可以派上用场，但要取决于所用的浏览器，第 13 章将详细讨论。

另一种指定 JavaScript 代码的方式是行内方式：

```HTML
<script type="text/javascript" >
	function sayHi () {
        alert("hi");
    }
    sayHi();
</script>
```

从逻辑上讲，下面的 DOM 代码是有效的：

```javascript
var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function sayHi(){alert(\"hi\");} sayHi();"));
document.body.appendChild(script);
```

以这种方式加载的代码会在全局作用域中执行，而且当脚本执行后将立即可用。实际上，这样执行的代码与在全局作用域中把相同的字符串传递给 eval() 是一样的。

####  动态样式

能够把 CSS 样式包含到 HTML 页面中的元素有两个。其中，\<link>元素用于包含来自外部的文件，而 \<style> 元素用于指定嵌入的样式。

与动态脚本类似，所谓动态样式是指在页面加载时不存在的样式；动态样式是在页面加载完成后动态添加到页面中的。

```HTML
<link rel="stylesheet" type="text/css" href="style.css">
```

使用 DOM 代码实现以上效果：

```javascript
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";
document.getElementsByTagName("head")[0].appendChild(link);
```

需要注意的是，必须将 \<link> 元素添加到 \<head> 而不是 \<body> 元素，才能保证在所有浏览器中的行为一致。以上代码可以包装成以下：

```javascript
function loadStyles(url){
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
loadSytles("styles.css")
```

\<style> 元素嵌入 CSS

```html
<style type="text/css">
    body {
        background-color: red;
    }
</style>
```

等同 DOM：

```javascript
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode("body{background-color:red}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

> IE 老版本不能操作 Text Node

####  操作表格

略

####  使用 NodeList

**理解 NodeList 及其“近亲”NamedNodeMap 和 HTMLCollection，是从整体上透彻理解 DOM 的关键所在。这三个集合都是“动态的”；换句话说，每当文档结构发生变化时，它们都会得到更新。**

**从本质上说，所有 NodeList 对象都是在访问 DOM 文档时实时运行的查询。**

**一般来说，应该尽量减少访问 NodeList 的次数，因为每次访问 NodeList，都会运行一次基于文档的查询。所以，可以考虑将从 NodeList 中取得的值缓存起来。**