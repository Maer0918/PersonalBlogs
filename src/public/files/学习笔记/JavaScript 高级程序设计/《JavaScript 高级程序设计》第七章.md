## 函数表达式

- [x] 函数表达式的特征
- [x] 使用函数实现递归
- [x] 使用闭包定义私有变量

函数表达式是 JavaScript 中的一个既强大又容易令人困惑的特性。

定义函数的方式有两种：一是函数声明，另一种是函数表达式。

```javascript
function functionName(arg0, arg1, arg2) {
    // function body
}
```

函数声明的一个重要特征就是函数声明提升（function declaration hoisting），意思是在执行代码之前会读取函数声明。

```javascript
sayHi();
function sayHi() {
    alert("HI");
}
```

第二种创建方式是函数表达式。

```javascript
var functionName = function (arg0, arg1, arg2) {
    // function body
};
```

看上去好像常规的赋值语句。这种情况下创建的函数叫做匿名函数（anonymous function），因为 function 关键字后面没有标识符。

###  递归

递归函数是在一个函数通过名字调用自身的情况下构成的。

*由于在 ECMAScript 中，函数也是对象，也可以被置空然后被清除。所以要考虑递归时解耦的情况。*

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}

var anotherFactorial = factorial;
factorial = null;
alert(anotherFactorial(4));
/*
VM34:5 Uncaught TypeError: factorial is not a function
    at factorial (<anonymous>:5:22)
    at <anonymous>:11:7
    */
```

arguments.callee 是一个指向正在执行的函数的指针，因此可以实现函数的递归调用：

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}

var anotherFactorial = factorial;
factorial = null;
alert(anotherFactorial(4)); // 24
```

但严格模式下，禁止脚本访问 arguments.callee。

不过可以使用命名函数表达式来达成相同的结果：

```javascript
var factorial = (function f(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * f(num-1);
    }
});

f ;
/*
VM225:1 Uncaught ReferenceError: f is not defined
    at <anonymous>:1:1
    */
```

*这里的 f 居然不能够通过外部访问，事有蹊跷！*

以上代码创建了一个名为 f() 的命名函数表达式，然后将它赋值给变量 factorial。即便把函数赋值给了另一个变量，函数的名字 f 仍然有效，所以递归调用照样能正常完成。

这种方式在严格和非严格模式下都行得通。

###  闭包

闭包是指有权访问另一个函数作用域中的变量的函数。

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

*就是通过内部创建函数来延长作用域链？*

```javascript
function createComparisonFunction(propertyName) {
    return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
			return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
```

当某个函数第一次被调用时，会创建一个执行环境（execution context）及相应的作用域链，并把作用域链赋值给一个特殊的内部属性（即 [[Scope]]）。然后，使用 this.arguments 和其他命名参数的值来初始化函数的活动对象（activation object）。

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
```



*以下这段知识点说明了作用域链及 [[Scope]] 的本质*

后台的每个执行环境都有一个表示变量的对象——变量对象。全局环境的变量对象始终存在，而像 compare() 函数这样的局部环境的变量对象，则只在函数执行的过程中存在。在创建 compare() 函数时，会创建一个预先包含全局变量对象的作用域链，这个作用域链被保存在内部的 [[Scope]] 属性中。当调用 compare() 函数时，会为函数创建一个执行环境，然后通过复制函数的 [[Scope]] 属性中的对象构建起执行环境的作用域链。此后，又有一个活动对象（在此作为变量对象使用）被创建并被推入执行环境作用域链的前端。对于这个例子中 compare() 函数的执行环境而言，其作用域链中包含两个变量对象：本地活动对象和全局变量对象。**显然，作用域链的本质上是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。**

*以下知识点说明了闭包的特性。*

**createComparisonFunction() 函数在执行完毕后，其活动对象也不会被销毁，因为匿名函数的作用域链仍然在引用这个活动对象。换句话说，当 createComparisonFunction() 函数返回后，其执行环境的作用域会被销毁，但它的活动对象仍然会存留在内存中；直到匿名函数被销毁后，createComparisonFunction() 的活动对象才会被销毁**，例如：

```javascript
var compareNames = createComparisonFunction("name");
var result = compareNames({name : "Nicholas"}, {name : "Greg"});
compareNames = null;
```

> 由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多，我们建议读者只在绝对必要时再考虑使用闭包。

####  闭包与变量

作用域链的这种配置机制引出了一个值得注意的副作用，即闭包只能取得包含函数中任何变量的最后一个值。别忘了闭包所保存的是整个变量对象，而不是某个特殊的变量。

```javascript
function createFunction() {
    var result = new Array();
    for (var i = 0; i < 10; i++) {
    	result[i] = function() {
            return i;
        };
    }
    
    return result;
}

var res = createFunction();
for (var i = 0; i < res.length; i++)
    console.log(res[i]());
// 10 个 10
```

我们可以通过创建另一个匿名函数强制让闭包的行为符合预期：

```javascript
function createFunction() {
	var result = new Array();
    
    for (var i = 0; i < 10; i++) {
        result[i] = function(num) {
            return function() {
				return num;
            };
        }(i);
    }
    
    return result;
}

var res = createFunction();
for (var i = 0; i < res.length; i++)
    console.log(res[i]());
// 10 个 10
```

在这个版本中，我们没有直接把闭包赋值给数组，而是定义了一个匿名函数，并将立即执行该匿名函数的结果赋给数组。这里的匿名函数有一个参数 num，也就是最终的函数要返回的值。

```javascript
var func = function() {
    return 7;
}();
```

*在匿名函数定义后马上调用是近上的语法。由于在上例中，定义了两个匿名函数，最里面的匿名函数还是一个闭包。可以看到，在定义后马上调用的是最外层的匿名函数，而最外层的匿名函数所返回的是一个闭包，故该闭包的参数就是当时即时调用时传入的参数。由于是传值，故保留当时值。*

####  关于 this 对象

在闭包中使用 this 对象也可能会导致一些问题。this 对象是在运行时基于函数的执行环境绑定的：在全局函数中，this 等于 window，而当函数被作为某个对象的方法调用时，this 等于那个对象。

**不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。**但有时候由于编写闭包的方式不同，这一点可能不会那么明显。

```javascript
var name = "The Window";
var object = {
	name : "My Object",
    
    getNameFunc : function() {
		return function () {
            return this.name;
        };
    }
};

object.getNameFunc()(); // "The Window"
```

**为什么匿名函数没有取得其包含作用域（或外部作用域）的 this 对象呢？**

每个函数再被调用时，其活动对象对会自动取得两个特殊变量：this 和 arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数的这两个变量。*至于活动对象，就要去看图 7.2 了*

*在此再重申一次 this 的指向以理解联系：*

>this 对象是在运行时基于函数的执行环境绑定的：在全局函数中，this 等于 window，而当函数被作为某个对象的方法调用时，this 等于那个对象。

*在上例最后一行代码中， object.getNameFunc() 返回一个匿名函数。这个匿名函数还没被调用，直到 object.getNameFunc()()，最后一对括号出现。这对括号当前语句运行的环境，在例子里就是全局环境调用的，故 this 指向 window。*

如果把外部作用域的 this 对象保存到一个闭包能够访问到的变量里，就可以让闭包访问该对象了：

```javascript
var name = "The Window";

var object = {
    name : "My Object",
    getNameFunc : function () {
        var that = this;
        return function () {
            return that.name;
        };
    }
};

object.getNameFunc()(); // "My Object"
```

*记住，只是 this 和 arguments 这两个特殊变量仅限于当前活动对象查找，不会沿着作用域链查找而已。其他自定义变量是正常沿着作用域链查找的，这也就是为何闭包能生效。*

有几种特殊的情况下， this 的值可能会意外地改变：

```javascript
var name = "The Window";
var object = {
    name : "My Object",
    getName : function () {
        return this.name;
    }
};

alert(object.getName()); // My Object
alert((object.getName) ()); // My Object
alert((object.getName = object.getName) ()); // The Window
//最后一句是在非严格模式下
```

*第一第二句好理解，getName 是一个函数，object 作为调用者，this 自然指向 object。第三句摸不着头脑。*

####  内存泄漏

由于 IE9 之前的版本对 JScript 对象和 COM 对象使用不同的垃圾收集例程，因此闭包在 IE 的这些版本中会导致一些特殊的问题。具体来说如果闭包的作用域链中保存着一个 HTML 元素，那么就意味着该元素将无法被销毁。

```javascript
function assignHandler(){
	var element = document.getElementById("someElement");
    element.onclick = function () {
		alert(element.id);
    };
}
```

由于匿名函数保存了一个对 assignHandler() 的活动对象的引用，因此就会导致无法减少 element 的引用数。只要匿名函数存在，element 的引用数至少也是 1，因此它所占用的内存就永远不会被回收。

*这里的引用数不会被减少是因为匿名函数绑定到了 element.onclick 事件上。因为 element 不会消失，所以该事件也就不会消失，所以就有闭包导致的内存泄漏。内存泄漏不是指函数被分配，而是指里面的变量不被回收。*

```javascript
function assignHandler() {
	var element = document.getElementById("someElement");
    var id = element.id;
    
    element.onclick = function () {
		alert(id);
    };
    
    element = null;
}
```

仅仅做到将 element.id 的一个副本保存在一个变量中，并且在闭包中引用该变量消除了循环引用的话，还是不能解决内存泄露问题。**必须要记住：闭包会引用包含函数的整个活动对象，而其中包含着 element。即使闭包不直接引用 element，包含函数的活动对象中也仍然会保存一个引用。**因此，有必要把 element 变量设置为 null。这样就能够解除对 DOM 对象的引用，顺列地减少其引用数，确保正常回收其占用的内存。

####  模仿块级作用域

JavaScript 没有块级作用域的概念。

JavaScript 从来不会告诉你是否多次声明了同一个变量；遇到这种情况，它只会对后续的声明视而不见（不过它会执行后续声明中的变量初始化）。匿名函数可以用来模仿块级作用域并避免这个问题。

```javascript
function outputNumbers(count) {
	for (var i = 0; i < count; i++) {
		console.log(i);
    }
        
    var i;
    console.log(i);
}
outputNumbers(3);
/*
0
1
2
3
*/
```

块级作用域（通常称为私有作用域）语法如下：

```javascript
(function () {
    // block context
}) ();
```

```javascript
function() {
    // block context
} ();
```

第二段代码会导致语法错误，因为 JavaScript 将 function 关键字当作一个函数声明的开始，而函数声明后面不能跟圆括号。然后函数表达式后面可以跟圆括号。要将函数声明转换成函数表达式，只要像第一段一样给它加上一对圆括号即可。

```javascript
function () {
    var i = 7;
    console.log(i);
} ();
/* Uncaught SyntaxError: Function statements require a function name */

(function () {
    var i = 7;
    console.log(i);
}) (); // 7
```

*很容易理解使用函数表达式来创建一个块级作用域（私有作用域）的原理：创建一个匿名函数，然后马上调用。这样只要匿名函数不被引用，匿名函数里的对象无论是否被调用了都会被马上被销毁。从而制造出和块级作用域一样使用完立刻回收，外部不可访问的特性。*

### 私有变量

**严格来讲，JavaScript 中没有私有成员的概念；所有对象属性都是公有的。**

*由于外部不能访问内部函数的变量，故这样倒可以认为是私有变量。*

由于闭包可以访问包含函数的活动对象，故可以利用这一点来创建访问私有变量的公有方法。

```javascript
function MyObject () {
    var privateVariable = 10;
    function privateFunction() {
        return false;
    }
    
    this.publicMethod = function () {
        privateVariable++;
        return privateFunction();
    }
    
    this.getPrivateVariable = function () {
		return privateVariable;
    };
}

var mo1 = new MyObject();
var mo2 = new MyObject();
mo1.publicMethod();
mo1.getPrivateVariable();
mo2.publicMethod();
mo1.getPrivateVariable();
```

*这里是后端开发人员一开始难理解的地方。因为后端看起来，这里的 var privateVariable = 10 不明明就是类的属性吗？别忘了这里是 JavaScript ！要将属性赋值给对象要用 this.property = value ！*

*这里的 privateVariable 是构造方法中的变量。而这里能在外部读取 privateVariable 的值，是因为调用了闭包保存其包含函数的活动对象。而这里每个对象的有一套独立的“私有属性”是因为每次调用 new MyObject() 都创建了新的闭包，在内存中有不同的活动对象。*

*居然可以用这样的方法实现私有属性，妙啊！*

我们把有权访问私有变量和私有函数的公有方法称为特权方法（privileged method）。

*这里公有私有很简单，在构造函数中赋予 this 的就是公有，不赋予 this 的就是私有。因为不赋予 this 的只能被闭包访问，保存在闭包的包含函数活动对象中。*

```javascript
function Person(name) {
    this.getName = function () {
        return name;
    };
    
    this.setName = function(value) {
        name = value;
    };
}

var person = new Person("Nicholas");
alert(person.getName()); // Nicholas
person.setName("Greg");
alert(person.getName()); // Greg
```

在构造函数中定义特权方法也有一个缺点，没有函数复用，每个实例都会创建同样一组新方法。

而使用静态私有变量来实现特权方法就可以避免这个问题。

#### 静态私有变量

通过在私有作用域中定义私有变量或函数，同样也可以创建特权方法：

```javascript
(function() {
    var privateVariable = 10;
    
    function privateFunction(){
        return false;
    }
    
    MyObject = function() {};
    
    MyObject.prototype.publicMethod = function() {
        privateVariable++;
        return privateFunction();
    }
})();
```

*MyObject = function() {}。因为函数定义在等号右边，所以这个是函数表达式。*

私有作用域中，定义了私有变量和私有函数，然后又定义了构造函数及其公有方法。公有方法是在原型上定义的，这一点体现了典型的原型模式。**为了能使 MyObject 成为全局的构造方法，在定义函数的时候使用了全局变量加函数表达式的形式，而不是函数声明的形式。**因为函数声明只能创建局部函数，而在 JavaScript 中，不使用 var 声明的变量都是全局变量。（初始化未经声明的变量，总是会创建一个全局变量。）在严格模式下给未经声明的变量赋值会导致错误。

特权方法作为一个闭包，总是保存着对包含作用域的引用。

*由于不同闭包才会保存不同活动对象，才能制造出不同对象具有不同的私有变量的特性。但是这种方法中，由于将闭包赋予了原型，故只有一个闭包。所以制造出的是所有实例共享同一个静态私有变量，同一私有方法的特性。*

*可以看出，这种方法所有资源都是静态共享的。*

所以到底是使用实例变量，还是静态私有变量，最终要视你的具体需求而定。

> 多查找作用域链中的一个层次，就会在一定程度上影响查找速度。而这正是使用闭包和私有变量的一个显明的不足之处。

####  模块模式

前面的模式是用于为自定义类型创建私有变量和特权方法。而道格拉斯的模块模式（module pattern）则是为单例创建私有变量和特权方法。所谓单例（singleton），值的就是只有一个实例的对象。

按照管理， JavaScript 是以对象字面量的方式来创建单例对象的。

```javascript
var singleton = {
    name : value,
    method : function () {
        // codes
    }
};
```

模块模式通过为单例添加私有变量和特权方法能够使其得到增强：

```javascript
var singleton = function () {
    var privateVariable = 10;
    function privateFunction () {
		return false;
    }
    
    return {
        publicProperty : true,
        publicMethod : function () {
			privateVariable++;
            return privateFunction();
        }
    };
}();
```

这种模式在需要对单例进行某些初始化，同时又需要维护其私有变量时是非常有用的：

```javascript
var application = function () {
    var components = new Array();
    components.push(new BaseComponent());
    return {
        getComponentCount : function () {
            return components.length;
        },
        registerComponent : function (component) {
            if (typeof component == "object") {
                components.push(component);
            }
        }
    };
}();
```



####  增强的模块模式

改进模块模式，在返回对象之前加入对其增强的代码。这种增强的模块模式适合那些单例必须是某种类型的实例，同时还必须添加某些属性和（或）方法对其加以增强的情况。

```javascript
var singleton = function () {
    var privateVariable = 10;
    function privateFunction () {
        return false;
    };
    var object = new CustomType();
    object.publicProperty = true;
    object.publicMethod = function () {
        privateVariable++;
        return privateFunction();
    };
    
    return object;
};
```

*这种增强模式和前面的区别就在于，这里返回的对象不是单纯由字面量创建的 Object 对象了，它是某种类型的对象，自定义或原型。将公有属性和公有方法都赋予这个对象，私有属性和私有方法则留在包含函数里，这样闭包生效时，包含函数里的变量就会变成外部不可访问的私有。*

*使用闭包来制造公有私有属性时，都是把公有的属性和方法放在闭包可以访问的途径，把私有的放在包含函数里。*

如果前面演示模块模式的例子中的 application 对象必须时 BaseComponent 的实例，那么就可以使用以下代码：

```javascript
var application = function () {
    var component = new Array();
    component.push(new BaseComponent());
    var app = new BaseComponent();
    app.getComponentCount = function () {
        return component.length;
    };
    app.registerComponent = function (component)  {
		if (typeof component == "object") { 
        	components.push(component);
        }
    };
    return app;
}();
```

*要注意到，单例模式无论是否增强，都是匿名函数定义后马上调用的。*

