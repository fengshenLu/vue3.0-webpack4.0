

# js性能分析

**1.垃圾回收机制引发的项目卡顿问题**

> 64位操作系统默认使用1.4G，32位操作系统默认使用0.7G

  V8之所以限制了内存的大小，表面上的原因是V8最初是作为浏览器的JavaScript引擎而设计，不太可能遇到大量内存的场景，而深层次的原因则是由于V8的垃圾回收机制的限制。

> 官方说法，对于1.5G的垃圾回收堆内存，V8做一次小的垃圾回收需要50ms，做一次非增量式的垃圾回收在1s以上（小垃圾回收和非增量都是垃圾回收策略）。这些是垃圾回收引起js执行暂停的时间。在这样的时间花销下，前后端都是没法接受的，因此直接限制堆内存是一个合理的选择。
>
> 垃圾回收算法在执行前，需要将应用逻辑暂停，执行完垃圾回收后再执行应用逻辑，这种行为称为 「**全停顿**」（`Stop The World`）
>
> 具体V8垃圾回收原理不在这详细说明了，可查看

下面是实际开发中遇到的一个实例：

设计说明工具中内存占用过大，垃圾回收机制引发的页面卡顿问题：

<video src="../../static/beforeClear.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>

上述问题还存在于设计说明工具中成果输出等其它界面，可以从网页开发者工具的performance性能分析工具看出，JS被卡顿也就是页面目前处于全停顿状态，minor GC占用较大。

在设计说明页面切换项目时主动清理内存

```
        // 手动清理内存，这里是应用同页面切换，要是不用页面切换可直接全部清空
        destroyData() {
            Object.keys(this.$data).forEach(item => { // 读取vue实例中所有全局变量
                if (typeof this[item] === 'object') { 
                 // 部分配置数据需要保留
                    if (['projParams', 'sortParams', 'toProjParams', 'designDocData'].indexOf(item) === -1) { 
                   // 按类型主动清理内存，以免数据类型发生变化
                        if (Array.isArray(this[item])) { 
                            this[item] = []
                        } else {
                            this[item] = {}
                        }
                    }
                }
            })
        },
```

在切换项目后主动清理内存后页面性能基本能维持不卡死的情况：

<video src="../../static/afterClear.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>

**2. js常用的一些优化技巧**

> 1. 减少DOM操作
> 2. js循环优化
> 3. 

***2.1 js减少DOM操作***

看下面两段代码：

```
1. // 循环向DOM添加元素
    let body = document.getElementsByTagName('body')[0],
            item = null
      for (let i = 0; i <= 5000; i++) {
           item = document.createElement("div");
           body.appendChild(item);
           item.appendChild(document.createTextNode(" Item" + i));
      }
2. // 生成元素后，一次性插入DOM
      let body = document.getElementsByTagName('body')[0],
          item = null
          fragment = document.createDocumentFragment()
      for (let i = 0; i <= 5000; i++) {
           item = document.createElement("div");
           fragment.appendChild(item);
           item.appendChild(document.createTextNode(" Item" + i));
      }
      body.appendChild(fragment);
  
```

通过JS脚本对DOM进行操作，有以下几种优化的方式：

1. 尽量减少操作次数，类似还有：element.style.color、element.style.width等可以集成为element.setAttribute(``"style"``,``"top:20px;left:20px;color:red;"``)一次性操作
2. 文档碎片方式 document.createDocumentFragment()，reateDocumentFragment()方法，是用来创建一个虚拟的节点对象，或者说，是用来创建文档碎片节点。它可以包含各种类型的节点，在创建之初是空的。
3. 将要修改的文档首先脱离文档流处理(display: none,position：absolute)等方式，最后再插入文档流
4. 动画效果尽量使用绝对定位，或是限定一个区域减少重绘

***2.2  js循环优化***

****js中原始的for循环和js提供的forEach()、map()、reduce()、for...of等遍历API性能上相差不多，除了for...in，因为for...in是会遍历原型链属性，导致性能在某些应用场景是比较差的****

```
let obj = Object.assign({}, {'a':123, 'b':21321, 'c':12312})
Object.prototype.say = 000
for(let key in obj){
    console.log(key)
}
// a
// b
// c
// say
```

****2.2.1 虽然for系列写法比较复杂，但是for系列的循环是可以通过break来中断，在一定应用场景还是有性能上的优化空间。下面是个简单的例子****

```
  // 编写方法，实现冒泡
    let arr = Array(10000).fill(1).map(item => item = parseInt(Math.random()*100));
    let dataOne = JSON.parse(JSON.stringify(arr))
        dataTwo = JSON.parse(JSON.stringify(arr))
    // 外层循环，控制趟数，每一次找到一个最大值
    // let body = document.getElementsByTagName('body')[0].innerText
    let dateStart = new Date()
    for (let i = 0, len = dataOne.length; i < len - 1; i++) {
        // 内层循环,控制比较的次数，并且判断两个数的大小
        // body.innerText = i + Math.random()
        for (let j = 0, lenj = dataOne.length - 1 - i; j < lenj ; j++) {
            // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
            if (dataOne[j] > dataOne[j + 1]) {
                let temp = dataOne[j];
                dataOne[j] = dataOne[j + 1];
                dataOne[j + 1] = temp;
            }
        }
    }
    console.log('1', new Date() - dateStart )
    dateStart = new Date()
    // let state = 0 // 涉及一个作用域的优化问题可以注意一下区别
    for (let i = 0, len = dataTwo.length; i < len - 1; i++) {
        // body.innerText = i + Math.random()
        let state = 0 // 加入状态
        for (let j = 0, lenj = dataTwo.length - 1 - i; j < lenj ; j++) {
            if (dataTwo[j] > dataTwo[j + 1]) {
                state = 1
                let temp = dataTwo[j];
                dataTwo[j] = dataTwo[j + 1];
                dataTwo[j + 1] = temp;
            }
        }
        if(!state) break
    }
   console.log('2', new Date() - dateStart)
   // 1 201
   // 2 197
```

****2.2.2 减少循环体操作并缓存对象，也适用于函数体****

```
// 测试环境为空页面， 开发者工具测试结果一次性，没取多次跑代码的时长平均值，结果是纯JS代码
let list = Array(10000).fill(6)
let dateStart = new Date()
for(let i = 0;i < list.length; i++){
    document.getElementsByTagName('body')[0].innerText = list[i]
}
console.log('1', new Date() - dateStart) 
dateStart = new Date()
let body = document.getElementsByTagName('body')[0] // 缓存变量，不用每次循环遍历获取元素
for(let i = 0,len=list.length;i < len; i++){ // 缓存数组length =》 len ，使用 i = list.length ; i--,也是可以优化的
    body.innerText = list[i] + i
}
console.log('2', new Date() - dateStart)
// 1 31 ms 这是一次性的结果
// 2 15 ms 这是一次性的结果
```

***2.3 条件判断if-else、switch 换成数组[]***

***2.4 事件委托***























