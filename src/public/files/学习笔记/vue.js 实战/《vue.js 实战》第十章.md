##  使用 webpack

高效的开发离不开基础工程的搭建。

###  前端工程化与 webpack

前端项目比较大时，可能会多人协同开发。模块化、组件化、CSS 预编译等概念也是前端工程化所涉及的。

* JavaScript、CSS 代码的合并和压缩
* CSS 预处理：Less、Sass、Stylus 的编译
* 生成雪碧图（CSS Sprite）
* ES6 转 ES5
* 模块化
* ......

webpack 最难理解的是“编译”这个概念。

各种格式的文件，比如 typescript、less、jpg，还有本章后面要介绍的 .vue 格式的文件。这些格式的文件通过特定的加载器（Loader）编译后，最终统一生成为 .js、.css、.png 等静态资源文件。在 webpack 的世界里，一张图片、一个 css 甚至一个字体，都称为模块，彼此存在依赖关系，webpack 就是来处理模块间的依赖关系的，并把它们进行打包。

