##  引用类型

- [x] 使用对象
- [x] 创建并操作数组
- [x] 理解基本的 JavaScript 类型
- [x] 使用基本类型和基本包装类型

> 引用类型的值（对象）是引用类型的一个示例。在 ECMAScript 中，引用类型是一种数据结构，用于将数据和功能组织在一起。它也常被称为**类**，但这种称呼并不妥当。尽管 ECMAScript 从技术上讲是一门面向对象的语言。但它不具备传统的面向对象语言所支持的类和接口等基本结构。引用类型有时候也被称为对象定义，因为它们描述的是一类对象所具有的属性和方法。

> 虽然引用类型与类看起来相似，但它们并不是相同的概念。为避免混淆，本书将不使用类这个概念。

###  Object 类型

两种创建 Object 实例的方式：

1. 构造函数

```javascript
var person = new Object();
person.name = "Nicholas";
person.age = 29;
```

2. 对象字面量表示法

```javascript
var person = {
	name : "Nicholas";
	age : 29
}
```

在这个例子中，左边的花括号（{）表示对象字面量的开始，因为它出现在了表达式上下文（experssion context）中。ECMAScirpt 中的表达式上下文指的是能够返回一个值（表达式）。赋值操作符表示后面是一个值，所以左花括号在这里表示一个表达式的开始。同样的花括号，如果出现在一个语句上下文（statement context）中，例如跟在 if 语句条件的后面，则表示一个语句块的开始。

开发人员更青睐对象字面量语法，因为菏泽中语法要求的代码量少，而且能够给人封装数据的感觉。实际上，对象字面量也是向函数传递大量和选参数的首选方式：

```javascript
function displayInfo(args) {
    var output = "";
    
    if (typeof args.name == "string"){
		output += "Name: " + args.name + "\n";
    }
    
    if (typeof args.age == "number") {
        output += "Age: " + args.age + "\n";
    }
    
    alert(output);
}

displayInfo({
    name:"Nicholas",
    age:29
});
```

对象字面量表示法也可以使用字符串来表示属性名：

```javascript
var person = {
    "name" : "Nicholas",
    "age" : 29,
    5 : true
}
```

这里的数值属性名会自动转换成字符串。

对应的也可以使用方括号表示法来访问对象的属性。在方括号中放入要访问的属性，以字符串形式：

```javascript
alert(person["name"]);
```

*这种语法则更说明了 ECMAScript 的对象就是一个字典。*

这种访问方法的好处在于可以使用变量来访问属性：

```javascript
var propertyName = "name";
alert(person[propertyName]);
```

**通常，除非必须使用变量来访问属性，否则我们建议使用点表示法。**

###  Array 类型

*ECMAScipt 数组和 Python 列表极其类似，两者都可以表示混杂任意类型的数据，都有序，都可动态调整。*

创建数组的基本方式有两种：

1. 使用 Array 构造函数：

   ```javascript
   var arr = new Array(20, "blue", new Object());
   // 可省略 new 操作符
   var arr = Array(17, "red", new Object());
   // javascript 不会触发重复声明错误
   ```

2. 数组字面量表示法：

   ```javascript
   var arr = [17, "red", new Object()];
   ```


访问数组时与其他语言访问数组的方式一致，使用方括号包围基于零的数字引索值。

```javascript
var colors = ['red', 'blue', 'green'];
alert(colors[1]);
```

数组的 length 属性很有特点——它不是只读的。因此通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项：

```javascript
var colors = ['red', 'blue', 'green'];
colors.length = 2;
alert(colors[2]);  // undifined
```

```javascript
var colors = ['red', 'blue', 'green'];
colors.length = 4;
alert(colors[3]);  // undifined
```

不仅仅可以增多或移除 1 项，还可以增添或删除尾部任意数量项。

逐个在尾部添加项：

```javascript
var colors = ['red', 'blue', 'green'];
colors[colors.length] = "black";
colors[colors.length] = "brown";
```

可以直接在数组长度外指定位置添加元素，但其与尾部之间的元素将默认新建为空：

```javascript
colors[11] = 7;
colors;
// (12) ["red", "blue", "green", empty × 8, 7]
```

####  检测数组

对于一个网页，或者一个全局作用域而言，使用 instanceof 操作符就能得到满意的结果：

```javascript
if (value instanceof Array) {}
```

instanceof 操作符的问题在于，它假定单一的全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的 Array 构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

ECMAScript 5 新增了 Array.isArray() 方法。这个方法的目的是最终确定某一个值到底是不是数组，而不管它是在哪个全局执行环境中创建的。

```javascript
if (Array.isArray(value)) {}
```

####  转换方法

所有对象都具有 toLocaleString(), toString() 和 valueOf() 方法。

如果使用 join() 方法，则可以使用不同的分割符来构建这个字符串。

#### 栈方法

push() pop() 方法

####  队列方法

push() shift() 方法

####  重排序方法

sort() reverse() 方法

这里的 sort() 方法比较特别，它会调用每个数组的 toString() 转型方法，然后比较得到的字符串，即使数组里是数字，也使用字符串比较。

```javascript
var values = [0, 1, 5, 10, 15];
values.reverse();
alert(values); //15,10,5,1,0
values.sort();
alert(values); //0,1,10,15,5
```

因此 sort() 方法可以接收一个比较函数作为参数，以便我们制定哪个值位于哪个值的前面。

```javascript
function compare(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}
var values = [0, 1, 5, 10, 15];
values.sort(compare);
alert(values); //0,1,5,10,15
```

使用匿名函数照样也可：

```javascript
values.sort(function (value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
});
//(5) [0, 1, 5, 10, 15]
```

更简洁的匿名比较函数：

```javascript
values.sort(function (val1, val2) {
    return val1 - val2;
});
// (5) [0, 1, 5, 10, 15]
```

####  操作方法

数组的拼接和切片

concat() slice() 方法，这两个方法都是返回一个新的数组，不影响原数组。

强大的数组方法 splice()

splice() 有很多种用法，主要用途是向数组的中部插入项，但使用这个方法的方式则有如下三种：

* 删除：可以删除任意数量的项，只需指定两个参数：要删除的第一项的位置和要删除的项数。splice(0,2) 会删除数组中的前两项。
* 插入：可以向指定位置插入任意数量的项，3 or more 个参数：起始位置，0（要删除的项数），要插入的项数（可多个）。splice(2, 0, "red", "green") 会从当前数组的位置 2 开始插入字符串 "red" 和 "green" 。
* 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 or more 个参数：起始位置，要删除的项数，要插入的项数（可多个）。插入的项数不必与删除的项数项等。例如，splice(2, 1, "red", "green") 会删除当前数组位置 2 的项，然后再从位置 2 开始插入字符串 "red" 和 "green"。

```javascript
var values = [1, 3, 9, 7, 2];
values.splice(0, 2);
alert(values); // 9,7,2
values.splice(2, 0, "red", "green");
alert(values); // 9,7,red,green,2
values.splice(2, 1, "blue", "yellow");
alert(values); // 9,7,blue,yellow,green,2
```

splice() 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项，如果没有删除任何项，则返回一个空数组。

```javascript
var values = [1, 3, 9, 7, 2];
alert(values.splice(0, 2)); //1,3
alert(values.splice(2, 0, "red", "green")); //
alert(values.splice(2, 1, "blue", "yellow")); // red
```

#### 位置方法

indexOf() 和 lastIndexOf()

indexOf() 从左往右

lastIndexOf() 从右往左

比较时都是使用全等运算符。

####  迭代方法

ECMAScript 5 为数组定义了 5 个迭代方法。每个方法都接收两个参数：要在每一项上运行的函数和（可选的）运行该函数的作用域对象——影响 this 的值。传入这些方法中的函数会接收三个参数：数组项的值，该项在数组中的位置和数组对象本身。

* every()：对数组中的每一项运行给定函数，如果该函数对每一项都返回 true，则返回 true。
* some()：对数组中的每一项运行给定函数，如果该函数对任一项返回 true，则返回 true。
* filter()：对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组。
* map()：对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
* forEach()：对数组中的每一项运行给定函数。这个方法没有返回值。

以上方法都不会修改数组中的包含的值。

```javascript
for (var arr = new Array(10), i = 0; i < arr.length; i++) // 当 Array() 只接收一个数值型参数时，该参数就为数组大小
    arr[i] = i;
alert(arr.every(function(item, index, array) {
    return item > 2;
}));
alert(arr.some(function(item, index, array){
    return item > 2;
}));
alert(arr.filter(function(item, index, array){
    return item > 2;
}));
alert(arr.map(function(item, index, array){
    return item * 2;
}));
alert(arr.forEach(function(item, index, array){}));
```

####  缩小方法

ECMAScript 5 还新增了两个缩小数组的方法：reduce() 和 reduceRight()。

*其实我还是不知道这个缩小方法在哪里缩小了，不过根据它的作用，应该就是归总吧。*

迭代数组所有项，然后构建一个最终返回的值。reduce() 从左往右，reduceRight() 从右往左。

```javascript
var values = [1, 2, 3, 4, 5];
alert(values.reduce(function(prev, cur, index, array) {
    return prev + cur;
}));
```

两个方法都接收四个参数：前一个值，当前值，项的引索和数组对象。这个函数返回的任何值都会作为第一个参数自动传给下一项。

###  Date 类型

> ECMAScript 中的 Date 类型是在早期 Java 中的 java.util.Date 类基础上构建的。

要创建一个日期对象，使用 new 操作符和 Date 构造函数即可：

```javascript
var now = new Date();
```

在调用 Date 构造函数而不穿地参数的情况下，新创建的对象自动获得当前日期和时间。如果项根据特定的日期和时间创建日期对象，必须传入表示该日期的毫秒数（即从 UTC 时间 1970 年 1 月 1 日午夜起至该日期止经过的毫秒数）。

ECMAScript 提供了两个方法来简化这一计算过程：Date.parse() 和 Date.UTC()。

Date.parse() 方法接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相应日期的毫秒数。

实际上，如果直接将表示日期的字符串传递给 Date 构造函数，也会在后台条用 Date.parse()。

Date.UTC() 方法同样返回表示日期的毫秒数，不过与 Date.parse() 不同的是，构建值时使用不同的信息。

Date.UTC() 的参数是年份，基于 0 的月份，月中的哪一天，小时数（0 到 23），分钟，秒以及毫秒数。只有年和月是必须的，其他都是可选的，默认为 0 。

Date() 构造函数都是基于本地时区，而非 GMT 来创建。即使传入的是 Date.UTC() 的参数格式，也是按照本地时区来构建。

```javascript
var dt = new Date("1998.9.18");
alert(dt); // Fri Sep 18 1998 00:00:00 GMT+0800 (中国标准时间)
var dtt = new Date(2005, 4, 5, 17, 55, 55);
alert(dtt); // Thu May 05 2005 17:55:55 GMT+0800 (中国标准时间)
```

ECMAScript 5 添加了 Date.now() 方法，返回调用这个方法时的日期和毫秒数。

```javascript
var start = Date.now();
doSomething();
var stop - Date.now(), result = stop - start;
```

#### 继承的方法

Date 类型也重写了 toLocaleString()，toString()，和 valueOf() 方法；但这些方法返回的值与其他类型中的方法不同。Date 类型的 toLocaleString() 方法会按照与浏览器设置的地区相适应的格式返回日期和时间。toString() 方法则通常返回带有时区信息的日期和时间，其中时间一般以军用时间（即小时的范围是 0 到 23）表示。

至于 Date 类型的 valueOf() 方法，则根本不返回字符串，而是返回日期的毫秒表示。

#### 日期的格式化方法

获得不同格式的时间字符串。

#### 日期/时间组件方法

获得或设置日期的不同部分，如年月日时分秒毫秒。

### RegExp 类型

RegExp 就是 Regular Expression 正则表达式。使用类似 Perl 的语法，就可以创建一个正则表达式。

```javascript
var exp = / pattern / flags;
```

其中的模式（pattern）部分可以是任何简单或复杂的正则表达式，可以包含字符类，限定符，分组，向前查找以及反向引用。每个正则表达式都可以带一个或多个标志（flags），用以标明正则表达式的行为。

* g：表示全局（global）模式
* i：表示不区分大小写（case-insensitive）模式
* m：表示多行（multiline）模式，即在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。

```javascript
/* 匹配所有的 ".at"，不区分大小写 */
var pattern = /\.at/gi;
```

以上是用字面量方式定义正则表达式，另一种创建正则表达式的方式是使用 RegExp 构造函数，它接收两个参数：要匹配的字符串模式，可选的标志字符串。

```javascript
var pattern = RegExp("\.at", "gi");
```

####  RegExp 实例属性

* global：布尔值，是否设置了 g 标志。
* ingoreCase：布尔值，表示是否设置了 i 标志。
* lastIndex：整数，表示开始搜索下一个匹配项的字符位置，从 0 算起。
* multiline：布尔值，表示是否设置了 m 标志。
* source：正则表达式的字符串表示。

####  RegExp 实例方法

RegExp 对象的主要方法是 exec()，该方法是专门为捕获组而设计的。exec() 接收一个参数，即要应用模式的字符串，然后返回包含第一个匹配项信息的数组；或者没有匹配项则返回 null 。

```javascript
var text = "mom and dad and baby";
var pattern = /mom( and dad( and baby)?)?/gi;
var matches = pattern.exec(text);
alert(matches); // (3) ["mom and dad and baby", " and dad and baby", " and baby", index: 0, input: "mom and dad and baby", groups: undefined]
```

这个例子中的模式包含两个捕获组。最内部的捕获组匹配 "and baby"，而包含它的捕获组匹配 "and dad" 或者 "and dad and baby"。

返回的数组虽然是 Array 的实例，但包含两个额外属性：index 和 input。index 是匹配项在字符串中的位置，input 是输入。

证明返回的数组确实是 Array 的实例：

```javascript
alert(typeof matches); // "object"
alert(Array.isArray(matches)); // true
```

除了基本类型的包装类的对象不能额外添加属性以外，其他的类的对象都能添加额外属性，如数组：

```javascript
var arr = [7];
arr.name = "数组";
alert(arr.name); // "数组"
```

对于 exec() 方法而言，即使在模式中设置了全局标志（g），它每次也只回返回一个匹配项。在不设置全局标志的情况下，在同一个字符串上多次调用 exec() 将始终返回第一个匹配项的信息。而在设置全局标志的情况下，每次调用 exec() 则都会在字符串中继续查找新匹配项。

正则表达式的第二个方法是 test() ，它接收一个字符串参数。在模式与该参数匹配的情况下返回 true；否则返回 false。常用于 if 语句中，只想知道目标字符串与某个模式是否匹配，但不需要知道其文本内容。

```javascript
var text = "000-00-0000";
var pattern = /\d{3}-\d{2}-\d{4}/;

if (pattern.test(text)) {
    alert("The pattern was matched.");
}
```

#### RegExp 构造函数属性

RegExp 构造函数包含一些属性（这些属性在其他语言中被看成是静态属性）。可获取最近一次匹配的有关信息。

####  模式的局限性

虽然 ECMAScript 中的正则表达式功能还是比较完备的，但仍然缺少某些语言（特别是 Perl）所支持的高级正则表达式特性：

* 匹配字符串开始和结尾的 \A 和 \Z 锚
* 向后查找（lookbehind）
* 并集和交集类
* 原子组（atomic grouping）
* Unicode 支持（单个字符出外，如 \uFFFF）
* 命名的捕获组
* s（single，单行）和 x（free-spacing，无间隔）匹配模式
* 条件匹配
* 正则表达式注释

即使存在这些限制，ECMAScript 正则表达式仍然是非常强大的，能够帮我们完成绝大多数模式匹配任务。

### Function 类型

ECMAScript 中最有意思的，莫过于函数——而有意思的根源，则在于函数实际上是对象。

每个函数的都是 Function 类型的实例，而且都与其他引用类型一样具有属性和方法。

**由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。**

使用函数声明语法定义函数：

```javascript
function sum (num1, num2) {
    return num1 + num2;
}
```

使用函数表达式定义函数：

```javascript
var sum = function (num1, num2) {
    return num1 + num2;
};
```

function 关键字后面没有函数名。因为在使用函数表达式定义函数时，没有必要使用函数名——通过变量 sum 即可以引用函数。另外，还要注意函数末尾有一个分号，就像声明其他变量一样。

使用 Function 构造函数：

```javascript
var sum = new Function("num1", "num2", "return num1 + num2"); // 不推荐
```

这种语法对于理解“函数是对象，函数名是指针”的概念非常直观，技术角度讲，这是一个函数表达式。

但是不推荐使用这种方法定义函数，因为这种语法会导致解析两次代码（第一次是解析常规 ECMAScript 代码，第二次是解析传入构造函数中的字符串），从而影响性能。

*推测，这只是声明函数的三种语法，对于实际声明出来的，都是同一个函数，拥有同样的属性和方法，是同一个对象。本质上，没有区别。即使是使用函数声明方法声明出来的 sum，也同样可以把 sum 赋值为 null 或其他值。如上所言，函数名只是一个指针。*

```javascript
function sum (num1, num2) {
    return num1 + num2;
}
alert(sum(1, 2)); // 3
sum = null;
alert(typeof sum); // "object"
sum = 7;
alert(typeof sum); // "number"
```

####  没有重载（深入理解）

将函数名想象为指针，也有助于理解为什么 ECMAScript 中没有函数重载的概念。后面声明的同名函数会覆盖掉前面的函数。

####  函数声明与函数表达式

**函数声明和函数表达式是有区别的。**实际上，解析器在向执行环境加载数据时，对函数声明和函数表达式并非一视同仁。解析器会率先读取函数声明，并使其在执行任何代码之前可用（可以访问）；至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真正被解释执行。

*也就是说一个是在执行环境中加载数据即可用，另一个则必须等到解析器执行到它所在的代码行，才会真正被解释执行。*

```javascript
alert(sum(10, 10)); // 20
function sum(num1, num2) {
    return num1 + num2;
}
```

```javascript
alert(di);
var di = 7;
```

*上面提前调用 sum() 函数的代码完全可以正常运行，会正常弹出结果 20。但是下面的提前调用未声明变量的代码，则只会弹出 undefined。*

因为在代码开始执行之前，解析器就已经通过一个名为函数声明提升（function declaration hoisting）的过程，读取并将函数声明天添加到执行环境中。对代码求值时，JavaScript 引擎在第一遍会声明函数并将它们放到源代码树的顶部。所以，即使声明函数的代码在调用它的代码后面，JavaScript 引擎也能把函数声明提升到顶部。

如果把上例的函数声明改为等价的函数表达式，就会在执行期间导致错误：

```javascript
alert(sum2(10, 10));
var sum2 = function(num1, num2) {
    return num1 + num2;
} //VM499:1 Uncaught TypeError: sum2 is not a function    at <anonymous>:1:7
```

以上代码之所以会在运行期间产生错误，原因在于函数位于一个初始化语句中，而不是一个函数声明。

####  作为值的函数

因为 ECMAScript 中的函数名本身就是变量，所以函数也可以作为值来使用。例如，将一个函数作为另一个函数的参数传入或结果返回：

```javascript
function callSomeFunction(someFunction, someArgument) {
    return someFunction(someArgument);
}

function add10(num) {
    return num + 10;
}

var result = callSomeFunction(add10, 10);
alert(result); // 20

function getGreeting(name) {
	return "Hello, " + name;
}

var result2 = callSomeFunction(getGreeting, "maer");
alert(result2);  // Hello, maer
```

以下是将函数作为结果返回：

```javascript
function createComparisonFunction(propertyName) {
    return function(obj1, obj2) {
        var val1 = obj1[propertyName];
        var val2 = obj2[propertyName];
        if (val1 < val2)
            return -1;
        else if (val1 > val2)
            return 1;
        else 
            return 0;
    };
}

var data = [{name:"Zachary", age:28}, {name:"Nicholas", age:29}];

data.sort(createComparisonFunction("name"));
alert(data[0].name); // Nicholas

data.sort(createComparisonFunction("age"));
alert(data[0].name); // Zachary
```

####  函数内部属性 后顾

#####  理解参数

ECMAScript 函数的参数与大多数其他语言中的函数的参数有所不同。

ECMAScript 函数不介意传进来多少个参数，也不在乎传进来参数是什么数据类型。也就是说，即使不写参数，也可以传进多个参数，解析器永远不会有什么怨言。

因为 ECMAScript 中的参数在内部是用一个数组来表示的。函数接收到的始终都是这个数组，而不关心数组中包含那些参数。

写了参数不传也没关系，不会报错，只是函数不会正常运行：

```javascript
function test (val1, val2) {
    return val1 + val2;
}

test(); // NaN
```

不写参数传了也能正常调用：

```javascript
function sayHi() {
    alert ("Hello " + arguments[0] + ", " + arguments[1]);
}

sayHi("cool", "man"); // Hello cool, man
sayHi("maer"); // Hello maer, undefined
```

由于可以测试 arguments 数组里各值的类型及 arguments 数组的长度，开发人员依然可以实现所谓的重载功能，即使 ECMAScript 不提供重载，算是弥补了 ECMAScript 的这一缺憾了。

```javascript
function doAdd() {
    if (arguments.length == 1) {
        alert(arguments[0] + 10);
    } else if (arguments.length == 2) {
        alert(arguments[0] + arguments[1]);
    }
}

doAdd(1); // 11
doAdd(1, 2); // 3
```

另一个与参数相关的重要方面，就是 arguments 对象可以与命名参数一起使用，如下面的例子所示：

```javascript
function doAdd(num1, num2) {
    if (arguments.length == 1) {
        alert(num1 + 10);
    } else if (arguments.length == 2) {
        alert(arguments[0] + num2);
    }
}
```

严格模式对如何使用 arguments 对象做出了一些限制，不允许重写 arguments 的值。

#####  没有重载

ECMAScript 函数不像传统意义上那样实现重载。而在其他语言（如 Java）中，可以为一个函数编写两个定义，只要这两个定义的签名（接收的参数的类型和数量）不同即可。如前所述，ECMAScript 函数没有签名，因为其参数是由包含零或多个值的数组来表示的。**而没有函数签名，真正的重载是不可能做到的。**

*由于 ECMAScript 对参数全部做了数组处理，故不会记录参数的数量和类型。*

####  函数内部属性

在函数内部，有两个特殊的对象：arguments 和 this 。arguments 是一个类数组对象，包含者传入函数中的所有参数。arguments 不属于 Array 。虽然 arguments 的主要用途是保存函数参数，但这个对象还有一个名叫 callee 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。

请看下面这个非常经典的阶乘函数：

 ```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}
factorial (10); // 3628800
 ```

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}
factorial(10); // 3628800
```

*乍一看很奇怪，为什么要多出一个 arguments.callee 呢？*

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}

var fac = factorial;
factorial = null;
fac(10);
/* Uncaught TypeError: factorial is not a function
    at factorial (<anonymous>:5:22)
    at <anonymous>:11:1
factorial @ VM39:5
(anonymous) @ VM39:11
*/
```

*根据以上示例，我们可以知道，当 factorial 被置为 null 后，整个函数无法正常递归。*

*那么为什么要解除这种紧密耦合呢？别忘了在 ECMAScript 里面，函数是一个对象，属于 Function 引用类型。当这个函数是被创造函数作为值传出时，就会存在由于紧密耦合而出错的情况。*

```javascript
function create() {
    return function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}
}

var faa = create();
faa(10); // 3628800
```

*事实证明我错了，这样写不会报错。我还特意调用了以下 faa，看它里面装什么：*

```javascript
faa
ƒ factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}
```

*好吧，怪不得它从函数里传出来不会出错，这变量居然还保存了函数名。*

*那可能 arguments.callee 是为了匿名函数递归用的吧。*

函数内部的另一个特殊对象是 this，其行为与 Java 和 C# 中的 this 大致类似。换句话说，this 引用的是函数据以执行的环境对象。

```javascript
window.color = "red";
var o = {color:"blue"};

function sayColor() {
    alert(this.color);
}

sayColor(); // red

o.sayColor = sayColor;
o.sayColor(); // blue
```

由于在调用函数之前，this 的值并不确定，因此 this 可能会在代码执行过程中引用不同的对象。当在全局作用域中调用 sayColor() 时，this 引用的是全局对象 window。而当把这个函数赋给对象 o 并调用 o.sayColor() 时，this 引用的是对象 o，因此 this.color 求值会转换成对 o.color 求值。

**函数的名字仅仅是一个包含指针的变量而已。**

ECMAScript 5 也规范了另一个函数对象的属性：caller。

这个属性保存着调用当前函数的函数的引用，如果是在全局作用域中调用当前函数，它的值为 null。如果在全局作用域中调用当前函数，它的值为 null。

```javascript
function outer() {
    inner();
}

function inner() {
    alert(inner.caller);
}

outer();
/* function outer() {
		inner();
	}
*/
```

为了实现更松散的耦合，也可以通过 arguments.callee.caller 来访问相同的信息。

```javascript
function outer(){
    inner();
}
function inner(){
	alert(arguments.callee.caller);
}
outer();
/* function outer() {
		inner();
	}
*/
```

严格模式下，访问 arguments.callee 会导致错误。

#### 函数属性和方法

ECMAScript 中的函数是对象，因此函数也有属性和方法。

每个函数包含两个属性：length 和 prototype。length表示函数希望接收的命名参数的个数。*也就是定义时写了几个参数。*

在 ECMASCript 核心所定义的全部属性中，最耐人寻味的就要数 prototype 属性了。对于 ECMAScript 中的引用类型而言，prototype 是保存它们所有实例方法的真正所在。**换句话说，诸如 toString() 和 valueOf() 等方法实际上都保存在 prototype 名下**，只不过是通过各自对象的实例访问罢了。

在 ECMAScript 5 中，prototype 属性是不可枚举的，因此使用 for-in 无法发现。

每个函数都包含两个非继承而来的方法：apply() 和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值。

首先，apply() 方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 arguments 对象。

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
function callSum1(num1, num2) {
    return sum.apply(this, arguments);
}
function callSum2(num1, num2) {
    return sum.apply(this, [num1, num2]);
}
alert(callSum1(10,10)); // 20
alert(callSum2(10,10)); // 20
```

*apply() 和 call() 可以更换传入的第一个参数，即在其中运行函数的作用域，来更改其作用域。*

call() 方法与 apply() 方法的作用相同，它们的区别仅在于接收参数的方式不同。call() 所要传入的参数，要一个个逗号隔开传进去，像普通调用那样，不像 apply() 那样直接传数组或 arguments。

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
function callSum(num1, num2) {
    return sum.call(this, num1, num2);
}
alert(callSum(1, 2)); // 3
```

事实上，传递参数并非 apply() 和 call() 真正的用武之地，它们真正强大的地方是能够扩充函数赖以运行的作用域。

```javascript
window.color = "red";
var o = { color:"blue" };
function sayColor() {
    alert (this.color);
}

sayColor(); // red

sayColor.call(this); // red
sayColor.call(window); // red
sayColor.call(o); // blue
```

**使用 call()（或 apply() ）来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。**

ECMAScript 5 还定义了一个方法：bind()。这个方法会创建一个函数的实例，其 this 值会被绑定到传给 bind() 函数的值：

```javascript
window.color = "red";
var o = { color:"blue" };

function sayColor() {
    alert(this.color);
}

var objectSayColor = sayColor.bind(o);
objectSayColor(); // blue
```

###  基本包装类型

为了便于操作基本类型值，ECMAScript 还提供了 3 个特殊的引用类型：Boolean， Number， String 。这些引用类型与本章介绍的其他引用类型相似，但同时也具备与各自的基本类型相应的特殊行为。

**实际上，每当读取一个基本类型值的时后，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。**

```javascript
var s1 = "some text";
var s2 = s1.substring(2);
s2;
```

当第二行代码访问 s1 时，访问过程处于一种读取模式，也就是要从内存中读出这个字符串的值。而在读取模式中访问字符串时，后台都会自动完成下列处理：

1. 创建 String 类型的一个实例；
2. 在实例上调用指定的方法；
3. 销毁这个实例。

相当于执行了以下代码：

```javascript
var s1 = new String("some text");
var s2 = s1.substring(2);
s1 = null;
```

以上步骤也分别适用于 Boolean 和 Number 类型对应的布尔值和数字值。

**引用类型和基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在与一行代码的执行瞬间，然后立即被销毁。**

**这意味着我们不能在运行时为基本类型值添加属性和方法。**

```javascript
var s1 = "some text";
s1.color = "red";
alert(s1.color); // undefined
```

可以显示地调用 Boolean，Number 和 String 来创建基本包装类型的对象。不过，应该在绝对必要的情况下再这样做，因为这种做法很容易让人分不清自己是在处理基本类型还是引用类型的值。

使用 new 创建出来的基本包装类型对象，与普通的引用类型对象生存周期一致：

```javascript
var s3 = new String("String3");
s3.name = "s33"; // "s33"
s3.name; // "s33"
```

对基本包装类型的实例调用 typeof 会返回“object”，而且所有基本包装类型的对象对会被转换为布尔值 true。

Object 构造函数也会像工厂方法一样，根据传入值的类型返回相应基本包装类型的实例：

```javascript
var obj = new Object("Some Text");
alert(obj instanceof String); // true
```

要注意的时，使用 new 调用基本包装类型的构造函数，与直接调用同名的转型函数是不一样的：

```javascript
var value = "25";
var num = Number(value);
alert(typeof num); // number
var obj = new Number(value);
alert(typeof obj); // object
```

####  Boolean 类型

Boolean 对象在 ECMAScript 中的用处不大，因为它经常会造成人们的误解：

```javascript
var falseObject = new Boolean(false);
var result = falseObject && true;
alert(result); // true

var falseValue = false;
result = falseValue && true;
alert(result); // false
```

所有 Object 对象的布尔值都为 true。

永远不要使用 Boolean 类型。

Number 类型

可以为 toString() 方法传递一个表示基数的参数，告诉它返回几进制数值的字符串形式：

```javascript
var num = 10;
alert(num.toString()); // 10
alert(num.toString(2)); // 1010
alert(num.toString(8)); // 12
alert(num.toString(10)); // 10
alert(num.toString(16)); // a
```

toFixed() 方法会按照指定的小数位返回数值的字符串表示：

```javascript
var num = 10;
alert(num.toFixed(2)); //  10.00
```

如果数值多于指定位会四舍五入：

```javascript
var num = 10.005;
alert(num.toFixed(2)); // "10.01"
```

toExponential() 返回以指数表示法（也称 e 表示法）表示的数值的字符串形式。toExponential() 也接收一个参数，而且该参数同样也是指定输出结果中的小数位数。

```javascript
var num = 10;
alert(num.toExponential(1)); // "1.0e+1"
```

toPrecision() 方法可能会返回固定大小（fixed）格式，也可能返回指数（exponential）格式，看参数是长与位数还是短于位数：

```javascript
var num = 99;
alert(num.toPrecision(1)); // 1e+2
alert(num.toPrecision(2)); // 99
alert(num.toPrecision(3)); // 99.0
```

####  String 类型

* charAt() 方法返回在指定引索位的字母
* codeAt() 方法返回在指定引索位的字母的字符编码
* concat() 方法拼接字符串
* slice() 方法返回字符串切片，接收起始位置和结束位置后面一个位置参数
* substr() 方法返回字符串子串，接收起始位置和返回的字符个数（可选，默认则返回至结尾）
* substring() 方法返回字符串子串，接收起始位置和结束位置后面一个位置（可选，默认则返回至结尾）

* indexOf() 方法从左到右检索参数传入的字母，返回第一个匹配的位置

* lastIndexOf() 方法则从右到左

* trim() 方法返回删除前置后置的空格符的副本

* toLowerCase() toUpperCase() toLacaleLowerCase() toLocaleUpperCase() 方法如其名

* match() 方法本质上与调用 RegExp 的 exec() 方法相同，只接收一个参数，要么是一个正则表达式，要么是一个 RegExp 对象

* search() 方法接收的参数与 match() 一致，返回的是第一个匹配项的引索

* replace() 方法接收两个参数，第一个参数可以是一个 RegExp 对象或者一个字符串（这个字符串不会被转换成正则表达式），第二个参数可以是一个字符串或者一个函数。如果第一个参数是字符串，那么只会替换第一个子字符串。想要替换所有子字符串，唯一的方法就是提供一个正则表达式，而且指定全局（g）标志：

  ```javascript
  var text = "cat, bat, sat, fat";
  var result = text.replace("at", "ond");
  alert(result); // cond, bat, sat, fat
  
  result = text.replace(/at/g, "ond");
  alert(result); // cond, bond, sond, fond
  ```

  如果第二个参数是字符串，那么还可以使用一些特殊的字符序列，将正则表达式操作得到的值插入到结果字符串中。（P127）

* split() 方法可以基于指定的分割符将一个字符串分割成多个子字符串，并将结果保存在一个数组中。分割符可以是字符串，也可以是一个 RegExp 对象（这个方法不会将字符串看成正则表达式）。第二个可选参数，用于指定数组大小。

* String.fromCharCode() 方法接收一或多个字符编码，然后将它们转换成一个字符串。

* HTML 方法，用来创建 HTML 标签（P130）

### 单体内置对象

ECMA-262 对内置对象的定义是：“由 ECMAScript 实现提供的，不依赖于宿主环境的对象。这些对象在 ECMAScript 程序执行之前就已经存在了。”

意思就是说，开发人员不必显式地实例化内置对象，因为它们已经实例化了。例如 Object, Array 和 String。

ECMA-262 还定义了两个单体内置对象：Global 和 Math。

####  Global 对象

Global（全局）对象可以说是 ECMAScript 中最特别的一个对象了，因为不管你从什么角度上看，这个对象都是不存在的。ECMAScript 中的 Global 对象在某种意义上是作为一个终极的“兜底儿对象”来定义的。不属于任何其他对象的属性和方法，最终都是它的属性和方法。

**事实上，没有全局变量或全局函数；所有在全局作用域中定义的属性和函数，都是 Global 对象的属性。**

#####  URI 编码方法

Global 对象的 encodeURI() 和 encodeURIComponent() 方法可以对 URI（Uniform Resource Identifiers，通用资源标识符）进行编码，以便发送给浏览器。

有效的 URI 中不能包含某些字符，例如空格。而这两个 URI 编码方法就可以对 URI 进行编码，它们用特殊的 UTF-8 编码替换所有无效的字符，从而让浏览器能够接受和理解。

其中，encodeURI() 主要用于整个 URI（例如，http://www.wrox.com/illegal value.htm)，而 encodeURIComponent() 主要用于对 URI 中的某一段（例如前面 URI 中的 illegal value.htm）进行编码。

encodeURI() 不会对本身属于 URI 的特殊字符进行编码，例如冒号，正斜杠，问号和井号；而 encodeURIComponent() 则会对它发现的任何非标准字符进行编码：

```javascript
var uri = "http://www.wrox.com/illegal value.htm#start";
alert(encodeURI(uri)); // http://www.wrox.com/illegal%20value.htm#start
alert(encodeURIComponent(uri)); // http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start
```

一般来说，我们使用 encodeURIComponent() 方法的时候要比使用 encodeURI() 更多，因为在实践中更常见的是对查询字符串参数而不是对基础 URI 进行编码。

与 encodeURI() 和 encodeURIComponent() 方法对应的两个方法分别是 decodeURI() 和 decodeURIComponent()。decodeURI() 只能对使用 encodeURI() 替换的字符进行解码，decodeURIComponent() 能够解码使用 encodeURIComponent() 编码的所有字符，即它可以解码任何特殊字符的编码：

```javascript
var uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start";
alert(decodeURI(uri)); // http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start
alert(decodeURIComponent(uri)); // http://www.wrox.com/illegal value.htm#start
```

#####  eval() 方法

整个 ECMAScript 语言和宗最强大的一个方法：eval()。

eval() 方法就像是一个完整的 ECMAScript 解析器，它只接受一个参数，即要执行的 ECMAScript 字符串：

```javascript
eval("alert('hi')"); // hi
alert("hi"); // hi
```

当解析器发现代码调用 eval() 方法时，它会将传入的参数当作实际的 ECMAScript 语句来解析，然后把执行结果插入到原位置。通过 eval() 执行的代码被认为是包含该次调用的执行环境的一部分，因此被执行的代码具有与该执行环境相同的作用域链。

```javascript
var msg = "hello world";
eval("alert(msg)"); // hello world
```

```javascript
eval("function sayHi() {alert('hi');}");
sayHi(); // hi
```

在 eval() 中创建的任何变量或函数都不会被提升，因为在解析代码的时后，它们被包含在一个字符串中；它们只在 eval() 执行的时候创建。

严格模式下，在外部访问不到 eval() 中创建的任何函数或变量，在此模式下，为 eval 赋值也会导致错误。

使用 eval() 必须极为谨慎，因为解析代码字符串的能力非常强大且危险，要防止用户恶意代码注入。

#####  Global 对象的属性

* 特殊的值 undefined，NaN 以及 Infinity 都是 Global 对象的属性。
* 所有原生引用类型的构造函数，如 Object 和 Function，Boolean，String，Date，RegExp，Array，Number，Error，EvalError，RangeError，ReferenceError，SyntaxError，TypeError，URIError 都是 Global 的属性。

ECMAScript 5 明确禁止给 undefined，NaN 和 Infinity 赋值，非严格模式下也会导致错误。

##### window 对象

ECMAScript 中全局作用域声明的所有变量和函数，都成为了 window 对象的属性。

```javascript
var color = "red";
function sayColor() {
    alert(window.color);
}
window.sayColor(); // red
```

另一种方法是通过函数返回 Global 对象：

```javascript
var global = function (){
    return this;
}(); // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
```

#### Math 对象

ECMAScript 还为保存数学公式和信息提供了一个公共位置，即 Math 对象。

P134。

