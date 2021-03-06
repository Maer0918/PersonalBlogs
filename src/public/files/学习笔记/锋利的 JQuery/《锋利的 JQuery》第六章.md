##  jQuery 与 Ajax 的应用

Ajax 全称为 "Asynchronous JavaScript and XML" （异步 JavaScript 和 XML），它并不是指一种单一的技术，而是有机地利用了一系列交互式网页应用相关的技术所形成的结合体。它的出现，揭开了无刷新更新页面的新时代，并有替代传统的 Web 方式和通过隐藏的框架来进行异步提交的趋势，是 Web 开发应用的一个里程碑。

###  Ajax 的优势和不足

P185

####  Ajax 的优势

#####  不需要插件支持

Ajax 不需要任何浏览器插件，就可以被绝大多数主流浏览器所支持，用户只需要允许 JavaScript 在浏览器上执行即可。

#####  优秀的用户体验

这是 Ajax 技术的最大优点，能在不刷新整个页面的前提下更新数据，这使得 Web 应用程序能更为迅速地回应用户的操作。

#####  提高 Web 程序的性能

与传统模式相比，Ajax 模式在性能上的最大区别就在于传输数据的方式，在传统模式中，数据提交是通过表单（Form）来实现的，而数据获取是靠全页面刷新来重新获取整页的内容。Ajax 模式只是通过 XMLHttpRequest 对象向服务器端提交希望提交的数据，即按需发送。

#####  减轻服务器和带宽的负担

Ajax 的工作原理相当于在用户和服务器之间加了一个中间层，使用户操作与服务器响应异步化。它在客户端创建 Ajax 引擎，把传统方式下的一些服务器负担的工作转移到客户端，便于客户端资源来处理，减轻服务器和带宽的负担。

####  Ajax 的不足

#####  浏览器对 XMLHttpRequest 对象的支持度不足

Ajax 的不足之一首先来自于浏览器。Internet Explorer 在 5.0 及以后的版本才支持 XML HttpRequest 对象（现阶段大部分客户端上的 IE 浏览器是 IE 6 及以上），Mozilla。Netscape 等浏览器支持 XMLHttpRequest 则更在其后。为了使得 Ajax 应用能在各个浏览器中正常运行，程序员必须话费大量的精力编码以兼顾各个浏览器之间的差别，来让 Ajax 应用能够很好地兼容各个浏览器。这使得 Ajax 开发的难度比普通 Web 开发高出很多，许多程序员因此对 Ajax 望而生畏。

#####  破坏浏览器前进、“后退”按钮的正常功能

在传统的网页中，用户经常会习惯性的使用浏览器自带的“前进”和“后退”按钮，然而 Ajax 改变了此 Web 浏览习惯。在 Ajax 中“前进”和“后退”按钮的功能都会失效，虽然可以通过一定的方法（添加锚点）来使得用户可以使用“前进”和“后退”按钮，但相对于传统的方式却麻烦了很多，对于大多数程序员来说宁可放弃前进、后退的功能，也不愿意在繁琐的逻辑中去处理该问题。

#####  对搜索引擎的支持的不足

对于搜索引擎的支持也是 Ajax 的一项缺陷。通常搜索引擎都是通过爬虫程序来对互联网上的数以亿计的海量数据来进行搜索整理的，然而爬虫程序现在还不能理解那些奇怪的 JavaScript 代码和因此引起的页面内容的变化，这使得应用 Ajax 的站点在网络推广上相对于传统站点明显处于劣势。

#####  开发和调试工具的缺乏

###  Ajax 的 XMLHttpRequest 对象

Ajax 的核心是 XMLHttpRequest 对象，它是 Ajax 实现的关键——发送异步请求、接收响应及执行回调都是通过它来完成的。XMLHttpRequest 对象最早是在 Microsoft Internet Explorer 5.0 ActiveX 组件中被引入的，之后各大浏览器厂商都以 JavaScript 内置对象的方式来实现 XMLHttpRequest 对象。

###  安装 Web 环境——AppServ

