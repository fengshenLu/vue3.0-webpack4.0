# web Worker

​    JavaScript 语言采用的是单线程模型，依靠node.js**事件循环**机制来处理 处理非阻塞 I/O 操作，具体**事件循环**的参考资料可以看[node.js官网](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#what-is-the-event-loop)或是一些相关的书籍、文档。[Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。一旦创建， 一个worker 可以将消息发送到创建它的JavaScript代码, 通过将消息发布到该代码指定的事件处理程序（反之亦然）。

下面的介绍，先以一个实例看看web Worker的特点：

1. 直接调用100个HTTP请求的方式看看页面的阻塞情况：

   ```
    initData() {
                   this.handleGetEntUsers()
                   this.getRuleLib()  // 被阻塞的接口 也就是loading状态决定因素
                   this.getRuleLibType()
                   // this.webWorkTest() // webWorker 方式
                   // setTimeout(() => {
                   //     this.getRulesData() // setTimeOut 方式
                   // }, 1000)
                   this.getRulesData() // 直接调用 方式
               },
   // this.getRulesData() 为100次HTTP请求 
   // this.getRuleLib()  被阻塞的接口
   ```

   **直接调用方式this.getRuleLib()接口被阻塞到最后，大概9秒后解除loading状态**

<video src="../../static/normal.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>

2. settimeOut形式解决阻塞问题，

   ```
   initData() {
                   this.handleGetEntUsers()
                   this.getRuleLib()
                   this.getRuleLibType()
                   // this.webWorkTest() // webWorker 方式
                   setTimeout(() => {
                       this.getRulesData() // setTimeOut 方式
                   }, 1000)
                   // this.getRulesData() // 直接调用 方式
               },
   // this.getRulesData() 为100次HTTP请求 
   // this.getRuleLib()  被阻塞的接口
   ```

   **由于延迟触发机制，使第一次调用this.getRuleLib()未被阻塞，4-5秒左右解除了loading状态，但是第二次调用this.getRuleLib()还是会被阻塞**

<video src="../../static/setTimeOut.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>







3. webWorker 调用HTTP

   ```
   initData() {
                   this.handleGetEntUsers()
                   this.getRuleLib()
                   this.getRuleLibType()
                   this.webWorkTest() // webWorker 方式
                   // setTimeout(() => {
                   //     this.getRulesData() // setTimeOut 方式
                   // }, 1000)
                   // this.getRulesData() // 直接调用 方式
               },
   // this.getRulesData() 为100次HTTP请求 
   // this.getRuleLib()  被阻塞的接口
   ```

   **大概5-6秒后解除loading状态，不阻塞接口**

<video src="../../static/webWorker.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>



webWorker的代码:

```
			// 主线程调用文件
			webWorkTest() { // webWorker调用
			// 子线程worker脚本路径   注意这里不能采用本地脚本，所以我放到static本地webpackDevServe模拟线上脚本
                let path = '/static/worker.js' 
                let myWorker = new Worker(path);
                configsService.getRulesData().then(data => {
                    if (data && data.length) {
                        myWorker.postMessage(data) // 发送数据到子线程
                    } else {
                        this.ruleList = []
                    }
                })
                myWorker.onmessage = function(event) { // 接受子线程返回数据
                    console.log(`Received message from worker: ${event.data}`)
                    myWorker.terminate() // 关闭子线程
                }
            }
           //  /static/worker.js
           
            function  getRulesData(e) {
                const fetchData = (url) => { // 自定义promise http XMLHttpRequest 请求
                    return new Promise((resolve, reject) => {
                        function reqListener() {
                            if (this.status !== 200) {
                                return reject();
                            }
                            resolve(this.responseText);
                        }
                        const oReq = new XMLHttpRequest();
                        oReq.addEventListener('load', reqListener);
                        oReq.open('GET', url);
                        oReq.send();
                    });}
                    let tasks = []
                    let data = e.data // 缓存变量 **在实际开发中没缓存，还是会阻塞。考虑可能是worker共用引用对象导致** 
                    data.forEach(item => {
                        let url = `/cbim-rule/v1/audit-page/standard/${item.id}`
                        tasks.push(fetchData(url))
                    })
                    Promise.all(tasks).then(list => {
                        let ruleList = []
                        data.forEach((l, index) => {
                            l.articleName = l.name
                            l.children = list[index]
                            ruleList.push(l)
                        })
                        postMessage(ruleList) // 返回结果到主线程
                        close() // 及时关闭子线程
                    }).finally(() => {
                    })
            }
            addEventListener('message',getRulesData) // 监听主线程


```

*webWorker使用特点*：

1. **脚本必须同源**
2. **子线程不能影响UI线程，也就是DOM操作**
3. **通信需要postmessage方式**
4. **脚本不能是本地**
5. **引入脚本使用importScripts()**

*用途：*

**针对阻塞浏览器响应的问题，时间复杂度较大的运算或是HTTP请求等一系列问题，也可以用setTimeOut异步执行脚本但是多个场景可能编写比较复杂，延迟时间也不太可控**

