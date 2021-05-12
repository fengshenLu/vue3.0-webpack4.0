

# js性能分析

**1.垃圾回收机制引发的项目卡顿问题**

> 64位操作系统默认使用1.4G，32位操作系统默认使用0.7G

  V8之所以限制了内存的大小，表面上的原因是V8最初是作为浏览器的JavaScript引擎而设计，不太可能遇到大量内存的场景，而深层次的原因则是由于V8的垃圾回收机制的限制。

> 官方说法，对于1.5G的垃圾回收堆内存，V8做一次小的垃圾回收需要50ms，做一次非增量式的垃圾回收在1s以上（小垃圾回收和非增量都是垃圾回收策略）。这些是垃圾回收引起js执行暂停的时间。在这样的时间花销下，前后端都是没法接受的，因此直接限制堆内存是一个合理的选择。
>
> 垃圾回收算法在执行前，需要将应用逻辑暂停，执行完垃圾回收后再执行应用逻辑，这种行为称为 「**全停顿**」（`Stop The World`）
>

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
> 3. 条件判断if-else、switch 换成数组[]
> 4. 事件委托

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

****2.2.1 虽然for系列写法比较复杂，但是for系列的循环是可以通过break、continue，在一定应用场景还是有性能上的优化空间****

```
let list = Array(10000).fill(6),
    K = 0 ,
    testList = Array(1000).map(item => Math.random()*100),
    dateStart = new Date()
for(let i = list.length;i--;){
    if(i === 5000) {  // 某个条件下停止
         k = i
         break
    } else {
        testList.sort()
    }
}
console.log('1', new Date() - dateStart) 
k

let list = Array(10000).fill(6),
    K = 0 ,
    testList = Array(1000).map(item => Math.random()*100),
    dateStart = new Date()
for(let i = list.length;i--;){
    if(i <=5000 && i>=1000) { 
         k = i
//         continue
    } 
    testList.sort() 
    
}
console.log('1', new Date() - dateStart) 
k
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
for(let i = 0,len=list.length;i < len; i++){ // 缓存数组length =》 len ，使用 i = list.length ; i--;,也是可以优化的
    body.innerText = list[i] + i
}
console.log('2', new Date() - dateStart)
// 1 31 ms 这是一次性的结果
// 2 15 ms 这是一次性的结果
```

***2.3 条件判断大量if-else、switch 换成数组[]***

```
// 简单使用10个条件判断+for来模拟一下，严格意义上是不准确的
let k = []
function a (e) { k.push(e)}
let len = 100000
let list = Array(len).fill(a)
let time1 = new Date()
for(let i=len; i--;){
let b = i%10
if(b ===0){
    a(0)
}
else if (b===1){
    a(1)
}
else if (b===2){
    a(2)
}
else if (b===3){
    a(3)
}
else if (b===4){
    a(4)
}
else if (b===5){
    a(5)
}
else if (b===6){
    a(6)
}
else if (b===7){
    a(7)
}
else if (b===8){
    a(8)
}
else if (b===9){
    a(9)
}}
console.log('0', new Date() - time1)
 time1 = new Date()
for(let i=len; i--;){
    switch(i%10) {
    case 0 : a(0); break;
    case 1 : a(1); break;
    case 2 : a(2); break;
    case 3 : a(3); break;
    case 4 : a(4); break;
    case 5 : a(5); break;
    case 6 : a(6); break;
    case 7 : a(7); break;
    case 8 : a(8); break;
    case 9 : a(9); break;
}}
console.log('1', new Date() - time1)
 time1 = new Date()
for(let i=len; i--;){
    list[i%10](i%10)
}
console.log('2', new Date() - time1)
    a(5)
}
else if (b===6){
    a(6)
}
else if (b===7){
    a(7)
}
else if (b===8){
    a(8)
}
else if (b===9){
    a(9)
}}
console.log('0', new Date() - time1)
 time1 = new Date()
for(let i=len; i--;){
    switch(i%10) {
    case 0 : a(0); break;
    case 1 : a(1); break;
    case 2 : a(2); break;
    case 3 : a(3); break;
    case 4 : a(4); break;
    case 5 : a(5); break;
    case 6 : a(6); break;
    case 7 : a(7); break;
    case 8 : a(8); break;
    case 9 : a(9); break;
}}
console.log('1', new Date() - time1)
 time1 = new Date()
for(let i=len; i--;){
    list[i%10](i%10)
}
console.log('2', new Date() - time1)
```

***2.4 事件委托***

```
<ul>
   <li>第1个li</li>
   <li>第2个li</li>
   <li>第3个li</li>
   <li>第4个li</li>
   <li>第5个li</li>
   <li>第6个li</li>
   ...
   <li>第100个li</li>
</ul>
<script>
//    li的事件委托给父元素ul
    $('ul').click(function(event){
        console.log($(event.target).text());
    });
 </script>
```























