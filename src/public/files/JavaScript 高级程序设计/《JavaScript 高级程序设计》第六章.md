##  第六章 面向对象的程序设计

- [x] 理解对象属性
- [x] 理解并创建对象
- [x] 理解继承

*继承这个概念在 ECMAScript 中与其他语言应该相当不同，我对此也有相当多的疑点——没有类怎么继承。*

**ECMAScript 中没有类的概念，因此它的对象也与基于类的语言中的对象有所不同。**

**ECMA-262 把对象定义为：“无序属性的集合，其属性可以包含基本值，对象或者函数。”严格来讲，这就相当于说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。正因为这样（以及其他将要讨论的原因），我们可以把 ECMASCript 的对象想象成散列表，无非就是一组键值对，其中值可以是数据或函数。**

*这真的很符合散列表的特性。*

### 理解对象

创建对象可以用 Object 构造函数，也可以用字面量方式创建。字面量方式看起来具有更好的封装性，更简洁，故应首先使用字面量方式。

####  属性类型

ECMA-262 第 5 版在定义只有内部才用的特性（attribute）时，描述了属性（property）的各种特征。

**ECMA-262 定义这些特性是为了实现 JavaScript 引擎用的，因此在 JavaScript 中不能直接访问它们。**

ECMAScript 中有两种属性：数据属性和访问器属性。

为了表示特性是内部值，该规范把它们放在两对方括号中，例如 [[Enumberable]]。

``` javascript
var person = new Object();
person.name = "maer";
person.age = 21;
person.job = "Software Engineer";
person.sayName = function() {
    alert(this.name);
}

var person = {
    name : "maer",
    age : 21,
    job : "Software Engineer",
    sayName : function() {
		alert(this.name);
    }
}
```



##### 数据属性

数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的特性：

* [[Configurabale]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的默认值为 true。
* [[Enumberable]]：表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定义的属性，它们的默认值为 true。
* [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的默认值为 true。
* [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 undefined。

要修改属性的默认特性，必须使用 ECMAScript 5 的 Object.defineProperty() 方法。这个方法接收三个参数：属性所在的对象，属性的名字和一个描述符对象。描述符（descriptor）对象的属性必须是：configurable，enumberable，writable 和 value 中的一个或多个值。

```javascript
var person = {};
Object.defineProperty(person, "name", {
    writable : false,
    value : "Nicholas"
});

alert(person.name); // Nicholas
person.name = "Greg";
alert(person.name); // Nicholas
```

在 writable 设置为 false 后，再为该属性赋值的话，非严格模式下将被忽略，严格模式下将会导致抛出错误。

类似的规则也适用于不可配置的属性：

```javascript
var person = {};
Object.defineProperty(person, "name", {
    configurable : false,
    value : "Nicholas"
});
alert(person.name); // Nicholas
delete person.name;
alert(person.name); // Nicholas
```

一旦把属性定义为不可配置的，就不能再把它变回可配置了。

```javascript
var person = {};
Object.defineProperty(person, "name", {
    configurable : false,
    value : "Nicholas"
});

Object.defineProperty(person, "name", {
    configurable : true,
    value = "dim"
});
alert(person.name);

Object.defineProperty(person, "name", {
    writable:"true"
});
alert(person.name); 
/* Uncaught TypeError: Cannot redefine property: name
    at Function.defineProperty (<anonymous>)
    at <anonymous>:1:8
    */
```

*修改所有特性都不行了，包括书中提到的 writable 可修改。*

多数情况下，可能都没有必要利用 Object.defineProperty() 方法提供的这些高级功能。

不过，理解这些概念对理解 JavaScript 对象却非常有用。

#####  访问器属性

访问器属性不包含数据值：它们包含一对 getter 和 setter 函数（不过，这两个函数都不是必需的）。

读取访问器属性时，调用 getter 函数；写入访问器属性时，调用 setter 函数。访问器属性有 4 个特性：

* [[Configurable]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为 true。*这与数据属性的[[Configurable]]一致。*
* [[Enumberable]]：表示能否通过 for-in 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
* [[Get]]：在读取属性时调用的函数。默认值为 undefined。
* [[Set]]：在写入属性时调用的函数。默认值为undefined。

访问器属性不能直接定义，必须使用 Object.defineProperty() 来定义：

```javascript
var book = {
    _year : 2004,
    edition : 1
};
Object.defineProperty(book, "year", {
    get : function() {
        return this._year;
    },
    set : function (newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});

book; // {_year: 2004, edition: 1}
book._year = 2007; // 2007
book; // {_year: 2007, edition: 1}
book.year = 2008; // 2008
book; // {_year: 2008, edition: 5}
```

_year 前面的下划线是一种常用的记号，用于表示只能通过对象方法访问的属性。而访问器属性 year 则包含一个 getter 函数和一个 setter 函数。getter 函数返回 _year 的值，setter 函数通过计算来确定正确的版本。

这是访问器属性的常见方式，即设置一个属性的值会导致其他属性发生变化。

*单下划线前缀的属性，只能通过对象方法访问才会正确触发访问器属性，也就是不带单下划线前缀的语法。*

####  定义多个属性

由于为对象定义多个属性的可能性很大，ECMAScript 5 又定义了一个 Object.defineProperties() 方法。这个方法可以通过描述符一次定义多个属性。

这个方法接收两个对象参数：第一个对象是要添加和修改其属性的对象，第二个对象的属性与第一个对象中要添加或修改的属性一一对应。

```javascript
var book = {};
Object.defineProperties(book, {
    _year : {
        value : 2004
    },
    edition : {
        value : 1
    },
    year : {
        get : function() {
            return this._year;
        },
        set : function(newValue) {
            if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
            }
        }
    }
});
```

*Object.defineProperty() 和 Object.defineProperties() 都是针对数据属性和访问器属性的应用而使用的。*

####  读取属性的特性

ECMAScript 5 的 Object.getOwnPropertyDescriptor() 方法，可以取得给定属性的描述符。

这个方法接收两个参数：属性所在的对象和要读取其描述符的属性名称。返回值是一个对象，如果是访问器属性，这个对象的属性有 configurable，enumberable，get 和 set；如果是数据属性，这个对象的属性有 configurable，enumberable，writable 和 value。

*访问器属性和数据属性有什么区别？*

```javascript
var book = {};
Object.defineProperties(book, {
    _year : {
        value : 2004
    },
    edition : {
        value : 1
    },
    year : {
        get : function(){
			return this._year;
        },
        set : function (newValue) {
            if (newValue > 2004) {
                this._year = new Value;
                this.edition += newValue - 2004;
            }
        }
    }
});

Object.getOwnPropertyDescriptor(book, "_year"); 
/* {value: 2004, writable: false, enumerable: false, configurable: false} */
Object.getOwnPropertyDescriptor(book, "year");
/* {get: ƒ, set: ƒ, enumerable: false, configurable: false} */
```

*访问器属性和数据属性对于一个属性来说是统一的，要设置访问器属性时，就要将属性名加单下划线前缀，然后定义以无下划线前缀的属性名为访问器名，通过该访问器名才能触发访问器。*

###  创建对象

Object 构造函数或对象字面量都可以用来创建单个对象，但有个明显的缺点：使用同一个接口创建很多对象，会产生大量的重复代码。

为解决这个问题，人们开始使用工厂模式的一种变体。

####  工厂模式

工厂模式时软件工程领域一种广为人知的设计模式，这种模式抽象了创建具体对象的过程。考虑到 ECMAScript 无法中无法创建类，开发人员就发明了一种函数，用函数来封装以特定接口创建对象的细节：

```javascript
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        alert(this.name);
    };
    return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");

person1; // {name: "Nicholas", age: 29, job: "Software Engineer", sayName: ƒ}
person2; // {name: "Greg", age: 27, job: "Doctor", sayName: ƒ}
```

*工厂模式虽然容易理解，但是和构造函数好像看起来没什么差别，往下要着重找出工厂模式和构造函数模式的差别。*

工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）。随着 JavaScript 的发展，又一个新模式出现了。

*要有语言实现的支持，才有新模式。*

####  构造函数模式

除了原生构造函数，还可以创建自定义的构造函数，从而定义自定义对象类型的属性和方法。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function (){
		alert(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1;  // Person {name: "Nicholas", age: 29, job: "Software Engineer", sayName: ƒ}
person2; // Person {name: "Greg", age: 27, job: "Doctor", sayName: ƒ}
```

*以下是构造函数模式和工厂模式不同之处：*

* 没有显式地创建对象；
* 直接将属性和方法赋给了 this 对象；
* 没有 return 语句。

构造函数按照惯例，始终都应该以一个大写字母开头，而非构造函数则应该以一个小写字母开头。

*以下是揭开谜底的内容：*

使用 new 操作符创建 Person 的新实例，这种方式调用构造函数实际上会经历以下 4 个步骤：

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

*要是没使用 new 操作符而直接调用 Person() 构造函数的话，Person() 里的 this 就是当前作用域，如果全局就是 window。然后新建的对象的值是 undefined，Person() 里给 this 赋的属性全都会赋给当前作用域。*

```javascript
var p = Person("maer", 21, "msg"); // undefined
name; // "maer"
age; // 21
job; // "msg"
```

在这些 new 出来的对象，都有 constructor 属性，指向它们的 constructor。

```javascript
pi.constructor;
/*
ƒ Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function (){
		alert(this.name);
    }
}
*/
```

constructor 属性最初是用来标识对象类型的。但是，提到检测对象类型，还是 instanceof 操作符要可靠一些。

```javascript
pi instanceof Person; // true
```

*推测 instanceof 就是对比 constructor 属性和构造函数是否是同一个。*

构造函数模式可以检测类型，这正是构造函数模式胜过工厂模式的地方。

#####  构造函数的问题

使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。不同的实例的同名方法不是同一个 Function 的实例。不要忘了—— ECMAScirpt 中的函数是对象，因此每定义一个函数，也就是实例化了一个对象。

从逻辑角度讲，此时的构造函数也可以这样定义：

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = new Function("alert(this.name)"); // 与声明函数在逻辑上是等价的
}
```

**说明白些，以这种方式创建函数，会导致不同的作用域链和标识符解析，但创建 Function 新实例的机制仍然是相同的。**因此，不同实例上的同名函数是不相等的：

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName() {
    alert(this.name);
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

*以下是 ubuntu chromium-browser 上的运行结果：*

```javascript
person1.sayName == person2.sayName;  // true
person1.sayName === person2.sayName; // true
```

*瓦它喵枯了，怎么和书里说的不一样，难道是 ES6 改了？*

*不过在原原本本的构造函数构造法里，两个实例的 sayName() 方法确实不同：*

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function (){
		alert(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.sayName == person2.sayName; // false
```

*原来是我自己搞错了，原原本本的构造函数构造法所产生的实例的方法确实是两个不同的函数实例。然后把它指向全局函数的话，就会一样。做实验的步骤颠倒了而且没做齐。*

使用全局函数来避免每个对象重新实例化其方法函数，确实可以起作用。但是这样做让全局函数名不副实，因为它实际上只被某个对象调用。更让人无法接受的是：如果对象需要定义很多方法，那么就要定义很多个全局函数，于是我们这个自定义的引用类型就丝毫没有封装性可言了。

好在，这些问题可以通过使用原型模式解决。

####  原型模式

我们创建的每个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。

*相当于一个实例同时具备静态和默认的特点。*

**使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。**

*这些设计模式的改进都是根据语言特性而构思的。*

**换句话说，不必再构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中。**

```javascript
function Person() {}
   
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

var person1 = new Person();
person1.sayName(); // Nicholas
var person2 = new Person();
alert(person1.sayName == person2.sayName);  // true
```

*这里虽然解决了重复新建方法函数实例的问题，但是缺又衍生出了封装性欠缺的问题。而且这里没有构造器传入参数，如果属性值的需求和默认值不一致，则又要使用大量代码来重新赋值。*

要理解原型模式的工作原理，必须先理解 ECMAScript 中原型对象的性质。

##### 理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。**在默认情况下，所有原型对象都会自动获得一个 constructor （构造函数）属性，这个属性包含一个指向 prototype 属性所在函数的指针。**

```javascript
function Person() {};
Person.prototype.constructor; // ƒ Person() {}
```

而通过这个构造函数，我么还可继续为原型对象添加其他属性和方法。

 创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性；至于其他方法，则都是从 Object 继承而来。

当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象。ECMA-262 第 5 版中管这个指针叫[[Prototype]]。

虽然在脚本中没有标准的方式访问[[Prototype]]，但 Firefox，Safari 和 Chrome 在每个对象上都支持一个属性 \__proto__；而在其他实现中，这个属性对脚本则是完全不可见的。

**不过，要明确的真正重要的一点就是，这个连接存在于实例与构造函数的原型对象之间，而不是存在于实例与构造函数之间。**



虽然上例的两个实例都不包含属性和方法，但我们却可以调用 perosn1.sayName()。这是通过查找对象属性的过程来实现的。



虽然所有实现中都无法访问到[[Prototype]]，但可以通过 isPrototypeOf() 方法来确定对象之间是否存在这种关系：

```javascript
Person.prototype.isPrototypeOf(person1); // true
Person.prototype.isPrototypeOf(person2); // true
```

ECMAScript 5 新增了一个方法，叫 Object.getPrototypeOf() ，在所有支持的实现中，这个方法返回 [[Prototype]] 的值。

```javascript
Object.getPrototypeOf(person1) == Person.prototype; // true
Object.getPrototypeOf(person1).name; // "Nicholas"
```

每当代码读取某个对象的某个属性时，都先从对象实例本身开始搜索，搜索不到就再搜实例原型指针指向的原型对象。

原型最初只包含 constructor 属性，而该属性也是共享的，因此可以通过对象实例访问。

*当给对象实例的属性赋新值时，就是对象实例有了该属性，就不会再去搜索原型对象。*

```javascript
person1.name = "Greg";
person1; // Person {name: "Greg"}
person2; // Person {}
```

使用 delete 操作符可以完全删除实例属性，从而让我们能够重新访问原型中的属性。

即使将属性置 null ，也只会在实例中设置这个属性，而不会恢复其指向原型的连接。

*因为置空相当于这个属性还是能被找到，既然找到了就不会再往上找。属性之所以置空能被找到的原因，是因为它不是独立的对象，置空了就可能很快被回收，因为它是对象内的属性。*

```javascript
delete person1.name;
person1.name; // "Nicholas"
```



使用 hasOwnProperty() 方法可以检测一个属性是存在于实例中，还是存在于原型中。此方法从 Object 继承而来，只在给定属性存在于对象实例中时，才返回 true。

```javascript
function Person() {}
   
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

var person1 = new Person();
person1.hasOwnProperty("name"); // false
person1.name = "Greg";
perosn1.hasOwnProperty("name"); // true
```

ECMAScript 5 的 Object.getOwnPropertyDescriptor() 方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用 Object.getOwnPropertyDescriptor() 方法。

##### 原型与 in 操作符

有两种方法使用 in 操作符：单独使用和在 for-in 循环中使用。在单独使用时，in 操作符会在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中：

```javascript
person1; // Person {name: "Greg"}
"name" in person1; // true
delete person1.name;
"name" in person1; // true
```

使用 for-in 循环时，返回的是所有能够通过对象访问的，可枚举的（enumerated）属性，其中即包括存在于实例中的属性，也包括存在于原型中的属性。**屏蔽了原型中不可枚举属性（即将 [[Enumerable]] 标记的属性）的属性也会在 for-in 循环中返回。**因为根据规定，所有开发人员定义的属性都是可枚举的。

```javascript
var o = {
    toString : function() {
		return "My Object";
    }
};

for (var prop in o) {
    if (prop == "toString") {
        alert("Found toString"); // 在 IE 中不会显示
    }
}
// Found toString
```

*如果原型中的属性是被设置了内部特性不可枚举的话，那没有在对象实例中为该属性覆盖新值的话，还是真的不能访问的。覆盖了新值就可以访问，因为新值有新的数据属性和访问器属性。*

ECMAScript 5 也将 constructor 和 prototype 属性的 [[Enumerable]] 特性设置为 false。

要取得对象上所有可枚举的实例属性，可以使用 ECMAScript 5 的 Object.keys() 方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组。

```javascript
function Person() {}
   
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

Object.keys(Person.prototype); // (4) ["name", "age", "job", "sayName"]

var p = new Person();
p.name = "Rob";
p.age = 31;
Object.keys(p); // (2) ["name", "age"]
```

*能访问包括原型和对象实例的属性的语法是 for-in 循环，不是 Object.keys() 。*

如果你想要得到所有实例属性，无论它是否可枚举，都可以使用 Object.getOwnPropertyNames() 方法。

```javascript
Object.getOwnPropertyNames(Person.prototype); // (5) ["constructor", "name", "age", "job", "sayName"]
```

注意结果中包含了不可枚举的 constructor 属性。

#####  更简单的原型语法

```javascript
function Person() {}

Person.prototype = {
	name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
```

这种字面量定义原型的方式更少代码量和视觉上更具封装性。

这种方式有个需要注意的地方—— constructor 属性不再指向 Person 了。前面所言，每创建一个函数，就会同时创建它的 prototype 对象，这个对象也会自动获得 constructor 属性。而我们在这里使用的语法，本质上重写了默认的 prototype 对象，因此 constructor 属性也就变成了新对象的 constructor 属性（指向 Object 函数），不再指向 Person 函数。**此时，尽管 instanceof 操作符还能返回正确的结果，但通过 constructor 已经无法确定对象的类型了**：

```javascript
var friend = new Person();

friend instanceof Object; // true
friend instanceof Person; // true
friend.constructor == Person; // false
friend.constructor == Object; // true
```

*这里可以这样理解，Person.prototype 指向了一个新的字面量创建的对象，而不是原来默认的对象了。故对象的 constructor 属性则是新的字面量创建的对象的 constructor。这里也可以看出，instanceof 的判断并不依据 constructor 属性。*

如果 constructor 的值真的很重要，可以像下面这样特意将它设置回适当的值：

```javascript
function Person() {};
Person.prototype = {
    constructor : Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
```

这样会导致 constructor 的 [[Enumerable]] 变为 true。默认情况下，原生的 constructor 属性是不可枚举的。

```javascript
function Person() {};
Person.prototype = {
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};

Object.defineProperty(Person.prototype, "constructor", {
    enumerable : false,
    value: Person
});
```

#####  原型的动态性

由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来。

**如果是重写整个原型对象，那么构造函数与最初原型之间的联联系将被切断，原型的改变便不能立即自动反映到实例中。**

*由于重写原型改变的是构造函数 Person 的原型属性指针 prototype，而新建的实例会复制构造函数的原型指针。所以改变仅对后来新建的实例生效，对之前的不生效。*

#####  原生对象的原型

原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的引用类型，都是采用这种模式创建的。

通过原生对象的原型，不仅可以取得所有默认方法的引用，而且也可以定义新方法。但这种做法不被建议。

##### 原型对象的问题

* 无法传参
* 如果原型的属性中有引用类型，那么所有实例的默认修改都将作用在同一个对象上，导致混乱。

####  组合使用构造函数模式和原型模式

结合构造函数模式可以传参的优点，和原型模式共享函数的优点，将引用类型及值类型的写在构造函数中，将函数声明定义写在原型模式中。

```javascript
function Person(name, age, job) {
    this.name = name,
    this.age = age,
    this.job = job,
    this.friends = {"Shelby", "Court"}
}

Person.prototype = {
    constructor : Person,
    sayName : function() {
		alert(this.name);
    }
}
```

*因为采用字面量定义的原型模式中，constructor 的值会被设置为 Object，所以需要显式改回来。如果有需要将其 [[Enumerable]] 特性该回 false 的话，使用 Object.defineProperty() 即可。*

**这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛，认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式。**

####  动态原型模式

由于对于 OO 语言来说，独立的构造函数和原型依然不太符合 OO 语言的封装性，故有将方法属性在在且仅在第一次调用时，赋值给原型属性的模式。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    
    if (typeof this.sayName != "function") {
        Perosn.prototype.sayName = function (){
			alert(this.name);
        }
    }
}
```

这种方法完美在于兼备了之前的优点和避免了之前的缺点。

*这里的 this.sayName 虽然没定义，但是在面对 this 没定义属性时，typeof 检测出的值是 undefined。*

####  寄生构造函数模式

在前面几种模式都不适用的情况下，可以使用寄生（parasitic）构造函数模式。这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；但从表面上看，这个函数又很像是典型的构造函数。

```javascript
function Person(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job  = job;
    o.sayName = function() {
		alert(this.name);
    }
    return o;
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName(); // Nicholas
friend instanceof Person; // false
```

*ECMAScript 搞得出那么多花里胡哨的创建对象的方式，跟 Java 和 Python 的一两种完全不一样，估计就是因为没有类，所以不能从语言支持的角度好好地创建对象，而且又是 OO 语言。*

这个模式除了使用 new 操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。

**构造函数不返回值的情况下，默认会返回新对象实例。而通过再构造函数的末尾添加一个 return 语句，可以重写调用构造函数时的返回值。**

**这种模式创建出来的实例，不是其构造函数的实例！而是构造函数内，实际调用的构造函数的实例！**

这个模式可以在特殊的情况下用来为对象创建构造函数。假设我们想创建一个具有额外方法的特殊数组。由于不能直接修改 Array 构造函数，因此可以使用这个模式。

```javascript
function SpecialArray() {
    var values = Array();
    values.push.apply(values, arguments);
    values.toPipedString = function(){
		return this.join("|");
    }
    return values;
}

var colors = new SpecialArray("red", "blue", "green");
colors.toPipedString(); // "red|blue|green"
```

*因为这个创建对象的模式是在原有的构造函数上在添加功能，所以叫寄生。*

####  稳妥构造函数模式

稳妥对象（durable objects），指的是没有公共属性，而且其方法也不引用 this 的对象。稳妥对象最适合在一些安全的环境中（这些环境会禁止使用 this 和 new），或者防止数据被其他应用程序（如 Mashup 程序）改动时使用。

稳妥构造函数遵循于寄生构造函数类似的模式，但有两点不同：一是新创建对象的实例方法不引用 this；二是不使用 new 操作符调用构造函数。

```javascript
function Person(name, age, job) {
    var o = new Object();
    // ...
    // 这里定义私有变量和函数
    
    o.sayName = function () {
        alert(name);
    }
    return o;
}
```

除了调用 sayName() 方法外，没有别的方法可以访问其数据成员。

*总结创建对象的其中方式，其中前五种可以归结为不断改进的版本，最终衍生出动态原型模式。一般创建对象就用动态原型模式就好。后两种，一种是用于在原有构造函数的模式下添加自己的功能；另一种是在安全的环境下使用。*

###  继承

*这里是了解 ECMAScript 中极其重要的一章，了解它作为一种 OO 语言，是怎么在没有类的情况下解决继承问题的。*

一般 OO 语言都有接口继承和实现继承两种方式，由于 ECMAScript 没有类，故没有接口继承方式，只有实现继承方式。

#### 原型链

**原型链是实现继承的主要方法。**

原型链的基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

*回想一下，在属性检索时，找不到就去找原型，如果在构造函数中修改了原型的指向，那么就可以实现继承的特性。*

```javascript
Shape.prototype.constructor
/*
ƒ Shape() {
  // 私有变量集
  const this$ = {};

  class Shape {
    constructor(width, height) {
      this$.width = width;
      this$.height = height;
    }

    get area() {
      return this$.width * t…
      */
```

每个构造函数都有一个原型对象，原型中有一个指向构造函数的指针，而实例中有一个指向原型的内部指针。

```javascript
function SuperType () {
    this.property = true;
}

SuperType.prototype.getSuperValue = function () {
    return this.property;
}

function SubType() {
    this.subProperty = false;
}
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
    return this.subProperty;
}

var instance = new SubType();
instance.getSuperValue(); // true
```

*这里我要纠正之前的想法，让原型直接指向另一个原型。这样做时行不通的，因为这样的话所有对原型的修改都会反映到最初的原型上，导致最初原型拥有许多它不该有的属性。正确的做法是把原型指向一个新的另外类型的实例。*

*对象->原型 | 对象->原型 原本在对象中查找属性，找不到会找原型，然而原型也是一个对象，找不到又去找它的原型，直至找到。*

此外，要注意 instance.constructor 现在指向的是 SuperType，因为 SubType.prototype 中的 constructor 被重写了的缘故。

通过实现原型链，本质上扩展了本章前面介绍的原型搜索机制。

#####  别忘记默认的原型

所有引用类型默认都继承了 Object，而这个继承也是通过原型链实现的。

**所有函数的默认原型都是 Object 的实例，因此默认原型都会包含一个内部指针，指向 Object.prototype。**这也就是所有自定义类型都会继承 toString()，valueOf() 等默认方法的根本原因。

即上例中的 SuperType.prototype 指向 Object 。

*令人疑惑的是，SuperType.constructor 指向的是 SuperType，而不是 Object。而 SubType 因为重写了原型，就指向了 SuperType。所以这里面应该存在着内部实现。*

##### 确定原型和实例的关系

```javascript
instance instanceof Object; // true
instance instanceof SubType; // true
instance instanceof SuperType; // true
```

只要是原型链里出现过的原型，就会被 isPrototypeOf() 判定为真：

```javascript
Object.prototype.isPrototypeOf(instance); // true
SuperType.prototype.isPrototypeOf(instance); // true
SubType.prototype.isPrototypeOf(instance); // true
```

#####  谨慎地定义方法

当子类型需要重写超类型中的某个方法，或者需要添加超类型中不存在的某个方法时，一定要将给原型添加方法的代码放在替换原型的语句之后，要不然就白写了。

还有一点要注意，在通过原型链实现继承时，不能使用对象字面量创建原型方法，要不然会重写原型，导致原型链实效，还是白写。

#####  原型链的问题

包含引用类型值的原型属性会被所有实例共享，即使是上一个类型中的引用值类型是通过构造函数新建的，当它变为这个类型的原型时，就会被这个类型的所有实例共享。

原型链的第二个问题是：在创建子类型时，不能向超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。有鉴于此，再加上前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。

*对于原型链的第二个问题，不太懂，为什么要向超类型的构造函数传递参数？*

####  借用构造函数

借用构造函数（constructor stealing）的技术（有时也叫做伪造对象或经典继承）解决了原型中包含引用类型值所带来的问题。

**这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。**

*ECMAScript 的晦涩难懂之处，或许就在于它要为了实现他的前端高效性抛弃类，又要符合面向对象语言的编程思维，在没有类的基础上设计出一堆面向对象的语法，还有内部包装。*

```javascript
function SuperType() {
	this.colors = {"red", "blue", "green"};
}

function SubType () {
    // 继承了 SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
instance1.colors;
```

> **使用 new 操作符创建 Person 的新实例，这种方式调用构造函数实际上会经历以下 4 个步骤：**
>
> 1. 创建一个新对象
> 2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
> 3. 执行构造函数中的代码（为这个新对象添加属性）；
> 4. 返回新对象。

*设计一系列实验，看看 new 的构造函数如果不设置返回值，究竟会传什么回来。*

1. 字面量变量

```javascript
function VarInCons() {
    var o = {pro1 : 7, pro2 : 8};
}

new VarInCons();
/*
VarInCons {}
__proto__:
constructor: ƒ VarInCons()
__proto__: Object
*/
```

2. 函数返回到构造函数作用域

```javascript
function returnFunc() {
    return {pro1 : 7, pro2 : 8};
}

function ReturnInCons() {
    returnFunc();
}

new ReturnInCons();
/*
ReturnInCons {}
__proto__:
constructor: ƒ ReturnInCons()
__proto__: Object
*/
```

*请留意，在上例中，在调用 SuperType.call() 的时候，把 this 当前环境作用域传了进去，按照书本说法，new 是会传回 new 所产生的新对象，这个新对象会被 this 指针指向，属性可以通过 this 指针添加。*

1. 传递参数

```javascript
function SuperType(name) {
    this.name = name;
}

function SubType() {
	SuperType.call(this, "Nicholas");
    this.age = 29;
}

var instance = new SubType();
alert(instance.name); // Nicholas
alert(instance.age); // 29
```

借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。

*估计这点就是为了提高代码重复利用率吧。*

如果仅仅是借用函数，那么方法都在构造函数中的问题无法避免，函数复用无从谈起。超类型原型中定义的方法，子类型无法调用。故借用构造函数的技术也是很少单独使用的。

####  组合继承

组合继承（combination inheritance），有时候也叫伪经典继承，将原型链和借用构造函数的技术组合，取长补短。

背后思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现属性的继承。

*需要留意引用类型是设置在超类型里面还是构造方法里面。*

*在使用动态原型的方法将方法写在构造函数里时，也可以采用 SuperType.prototype.functionName == undefined 来判断有没有被初始化。*

```javascript
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
    if (SuperType.prototype.sayName == undefined) {
		SuperType.prototype.sayName = function () {
            alert(this.name);
        };
        console.log("SuperType.prototype.sayName has been initialized.");
    }
}

function SubType(name, age) {
    if (! (SubType.prototype instanceof SuperType)) {
        SubType.prototype = new SuperType();
        console.log("SubType.prototype has been assigned.");
    }
    SuperType.call(this, name);
    this.age = age;
    if (SubType.prototype.sayAge == undefined) {
      	SubType.prototype.sayAge = function() {
			alert(this.age);
        }  ;
        console.log("SubType.prototype.sayAge has been initialized.");
    }
}

var instance1 = new SubType("Nicholas" ,29);
instance1.sayName();
instance1.sayAge();
SubType.prototype.isPrototypeOf(instance1); // false
```

*回想一下第一节学到的原型链，里面的继承是直接将子类型的原型赋值为一个超类型的实例。这种最原始的继承方法，会导致超类型的引用类型属性变成子类型的原型引用类型属性，引起共享引用类型问题。不过倒是不会导致方法不复用的问题。*

*而第二节学到的借用构造函数法，直接在子类型新建实例时调用超类型的构造方法，而忽略原型问题。这样可以继承属性，避免了引用类型共享问题，但是仅仅将方法写在构造函数里的话，那么函数复用也无从谈起。*

*以上代码中的方法虽然赋值了，调用却会出错。*

```javascript
function SuperType(name) {
	this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
	alert(this.name);
};

function SubType(name, age) {
	SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();
SubType.prototype.sayAge = function() {
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
```

*这段代码却可以正确无误地运行。原因在于不能在构造函数中改原型指针的指向。因为在调用构造函数 new 时，在执行构造函数里面代码之前，就已经将 new 的对象的指针指向了 SubType.prototype，第一个原型。在执行函数里面修改原型指针的指向的话，改不了外面已经赋值的那个。所以内部赋予了两个函数属性的原型，不是新建对象所指向的原型。*

*所以近上的代码才是正确运行的代码。*

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继承模式。而且，instanceof 和 isPrototypeOf() 也能够识别基于组合继承创建的对象。

####  原型式继承

Prototypal Inheritance in JavaScript （JavaScript 中的原型式继承）。借助原型可以基于已有对象而创建新对象，同时还不必因此创建自定义类型。

```javascript
function object(o) {
    function F(){}
    F.prototype = o;
    return new F();
}

var person = {
	name : "Nicholas",
    friends : ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Brabie");

alert(person.friends); // Shelby,Court,Van,Rob,Brabie
```

克罗克福德主张的这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给 object() 函数，然后再根据具体需求对得到的对象加以修改即可。

ECMAScript 5 通过新增 Object.create() 方法规范了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。

```javascript
var person = {
    name : "Nicholas",
    friends : ["Shelby", "Court", "Van"]
};

var anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends); // Shelby,Court,Van,Rob,Barbie
```

当 Object.create() 传入一个参数时，表现就和 object() 函数一样。

```javascript
var person = {
    name : "Nicholas",
    friends : ["Shelby", "Court", "Van"]
};

var anotherPerson = Object.create(person, {
    name : {
        value : "Greg"
    }
});

alert(anotherPerson.name); // Greg
```

*这里可以从语法看出第二个参数是传入要添加的额外参数，及其构造器或数据属性。*

**在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是可以完全可以胜任的。不过引用类型的值依然共享。**

####  寄生式继承

寄生式（parasitic）继承是与原型式继承紧密相关的一种思路，同样是由克罗克福德推广的。

寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```javascript
function object(o) {
    function F () {}
    F.prototype = o;
    return new F();
}

function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function() {
        alert("hi");
    };
    return clone;
}

var person = {
	name:"Nicholas",
    friends:["Shelby", "Court", "Van"]
};

var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // hi
```

*这样看来，寄生函数仅仅将写在函数外面的属性赋值包装在了函数里面，并返回新增强对象。*

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。object() 函数不是必需的，任何能够返回新对象的函数都适用于此模式。

> 使用寄生式继承来为对象添加函数，由于不能做到函数复用而降低效率；这一点和构造函数模式类似。

####  寄生组合式继承

组合继承时 JavaScript 最常用的继承模式。不过它也有不足：无论什么情况，都会调用两次超类型构造函数。在创建子类型原型时和子类型构造函数内部。

```javascript
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
    alert(this.name);
};

function SubType (name, age) {
	SuperType.call(this, name);
    this.age = age;
}

SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
	alert(this.age);
};
```

这个代码创建了两组 name 和 colors 属性：一组在实例上，一组在 SubType 原型中。这是调用组合式继承的结果。

问题的解决方法是寄生组合式继承。

寄生组合式继承，即通过借用构造函数来继承属性，通过原型链混成形式来继承方法。

不必为了指定子类型的原型而调用超类型的构造函数，我们要的无非就是超类型原型的一个副本而已。

```javascript
function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
```

```javascript
function object(o) {
    function F(){}
    F.prototype = o;
    return new F();
}

function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
    alert(this.name);
};

function SubType (name, age) {
	SuperType.call(this, name);
    this.age = age;
}

function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
	alert(this.age);
};
```

*这种方案与组合继承的方案差别在于为子类型原型赋值的过程。寄生组合继承是直接通过 new F() 来复制了一份 SuperType.prototype，不用调用 SuperType 的构造函数和传参。*

*由于 SuperType.prototype 里面只有函数定义，所以通过 object() 拿到的复用的函数。所以不会重建属性。所以真正只在 SubType 的构造函数中调用了一次 SuperType 的构造函数，没有造成空间浪费！也没有应用类型共享！*

**开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。**