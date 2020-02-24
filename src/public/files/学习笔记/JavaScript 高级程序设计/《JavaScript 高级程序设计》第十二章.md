##  DOM2 和 DOM3

- [ ] DOM2 和 DOM3 的变化
- [ ] 操作样式的 DOM API
- [ ] DOM 遍历和范围

DOM1 级主要定义的是 HTML 和 XML 文档的底层结构。DOM2 和 DOM3 则在这个结构的基础上引入了更多的交互能力，也支持了更高的 XML 特性。

####  针对 XML 命名空间的变化

从技术上说，HTML 不支持 XML 命名空间，但 XHTML 支持 XML 命名空间。

*因为不学 XHTML 所以这小节略过。*

####  其他方面的变化

#####  DocumentType 类型的变化

DocumentType 类型新增了 3 个属性：publicId，systemId 和 internalSubset。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
		"http://www.w3.org/TR/html4/strict.dtd">
```

##### Document 类型的变化

Document 类型的变化中唯一与命名空间无关的方法是 importNode()。这个方法的用途是从一个文档中取得一个节点，然后将其导入另一个文档，使其成为这个文档结构的一部分。

这个方法在 HTML 文档中并不常用，在 XML 文档中用得比较多。

DOM2 级视图模块添加了一个名为 defaultView 的属性，其中保存着一个指针，指向拥有给定文档的窗口（或框架）。除此之外，“视图”规范没有提供什么其他视图可用的信息，因而这是唯一一个新增的属性。

* document.implementation.createDocumentType()
* document.implementation.createDocument()

#####  Node 类型的变化

Node 类型中唯一与命名空间无关的变化，就是添加了isSupported() 方法。与 DOM1 级为 document.implementation 引入的 hasFeature() 方法类似，用于确定当前节点具有什么能力。这个方法接受相同的两个参数：特性名和特性版本号。

DOM3 级引入了两个辅助比较节点的方法：isSameNode() 和 isEqualNode()。这两个方法都接受一个节点参数。相同是两个节点引用的是同一个对象。相等是两个节点是相同的类型，具有相等的属性。

DOM3 级还针对为 DOM 节点添加额外数据引入了新方法。其中，setUserData() 方法会将数据给指定节点，而 getUserData() 可以获取值。

#####  框架的变化

框架和内嵌框架分别用 HTMLFrameElement 和 HTMLFrameElement 表示，它们在 DOM2 级中都有了一个新属性，名叫 contentDocument。这个属性包含一个指针，指向表示框架内容的文档对象。

###  样式

DOM2 级样式模块为样式读写机制提供了一套 API。

####  访问元素的样式

任何支持 style 特性的 HTML 元素在 JavaScript 中都有一个对应的 style 属性。这个 style 对象是 CSSStyleDeclaration 的实例，包含这通过 HTML 的 style 特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式。

```javascript
var myDIv = document.querySelector("myDiv");
myDiv.style.backgroundColor = "red";
```

#####  计算的样式

虽然 style 对象能够提供支持 style 特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息。

```javascript
document.defaultView.getComputedStyle(myDiv, null);
```

#### 操作样式表

CSSStyleSheet 类型表示的是样式表，包括通过 \<link> 元素包含的样式表和在 \<style> 元素中定义的样式表。

应用于文档的所有样式表是通过 document.styleSheets 集合来表示的。通过这个集合的 length 属性可以获知文档中样式表的数量，而通过方括号语法或 item() 方法可以访问每一个样式表。

```javascript
var sheet = null;
for (var i = 0, len = document.styleSheets.length; i < len; i++) {
    sheet = document.styleSheets[i];
    alert(sheet.href);
}
```

> \<style> 元素包含的样式表没有 href 属性

#####  CSS 规则

CSSRule 对象表示样式表中的每一条规则。实际上 CSSRule 是一个供其他多种类型继承的基类型，其中最常见的就是 CSSStyleRule 类型，表示样式信息。

CSSRule 对象最常用的三个属性是 cssText，selectorText 和 style。cssText 属性和 style.cssText 属性类似，但并不相同。前者包含选择符文本和围绕样式信息的花括号，后者只包含样式信息。此外，cssText 是只读的，而 style.cssText 也可以被重写。

*CSS 的一条规则对应一个选择器及其样式。*

#####  创建规则

sheet.insertRule();

虽然可以像这样来添加规则，但随着要添加规则的增多，这种方法就会变得非常繁琐。因此，如果要添加的规则非常对，我们建议还是采用第 10 章介绍过的动态加载样式表的技术。

#####  删除规则

sheet.deleteRule()；

与添加规则相似，删除规则也不是实际 Web 开发中常见的做法。考虑到删除规则可能会影响 CSS 层叠的效果，因此请大家慎重使用。

####  元素大小

略

###  遍历

略

###  范围

```javascript
var range = document.createRange();
```

操作不规则的连续节点。

范围是选择 DOM 结构中特定部分，然后再执行相应操作的一种手段。

使用范围选取可以在删除文档中某些部分的同时，保持文档结构的格式良好，或者复制文档中的相应部分。

