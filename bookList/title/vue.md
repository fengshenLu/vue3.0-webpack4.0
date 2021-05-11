







# vue

vue的对网页性能方面涉及的比较多，这里不全部列举了，就实际开发中[函数式组件](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)的一点应用

**vue函数式组件：**

> 没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法。实际上，它只是一个接受一些 prop 的函数。在这样的场景下，我们可以将组件标记为 `functional`，这意味它无状态 (没有[响应式数据](https://cn.vuejs.org/v2/api/#选项-数据))，也没有实例 (没有 `this` 上下文)。一个**函数式组件**就像这样：
>
> ```
> Vue.component('my-component', 
> {   functional: true,   // 标记函数式组件
> 	// Props 是可选的  
> 	props: {    // ...  },  // 为了弥补缺少的实例  // 提供第二个参数作为上下文  
> 	render: function (createElement, context) {    // ...  }
> })
> ```
>
> 或是直接在标签添加
>
> ```
> <template functional>
> </template>
> ```
>
> 当使用函数式组件时，该引用将会是 HTMLElement，因为他们是无状态的也是无实例的。

**vue函数式组件应用**

​    **正常的vue递归组件**

<video src="../../static/beforeFunctional.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>



​    **函数式递归组件**

```

export default {
    functional: true, // 函数式组件
    name: 'node1',
    props: ['content', 'isLeaf', 'onChange', 'no', 'level', 'indexType', 'parentNo',
        'activeIndex',
        'numberGrade',
        'showNum',
        'values',  // 文档值集合
        'settings',// 文档设置
        'addItems', // 新增条目
        'docTableTemplates',
        'docDataSource',
        'sectionBak'
    ],
    render(h, context) {
        let contentArr = [];
        let spanArr = [];
        let filedArr = [];
        let params = context.props.content.parameters || []
        ... // 省略
        return (
            <div id={context.props.content.id} class={`detail-wrap review-warp review-level-${context.props.level}`}>
                {
                    context.props.level !== 1 && num && context.props.showNum ?
                        <div class="detail-num">
                            <span>{num}</span>
                        </div> : ''

                }
               ...// 省略
                    {children && children.map((item, index) => { // 组件递归
                        return (<nodeForOutput
                            content={item}
                            isLeaf={true}
                            no={index + 1}
                            showNum={children.length >1}
                            parentNo={num}
                            level={context.props.level + 1}
                            values={context.props.values}
                            settings={context.props.settings}
                            addItems={context.props.addItems}
                            indexType={context.props.indexType}
                            activeIndex={activeIndex}
                            numberGrade={context.props.numberGrade}
                            docDataSource={context.props.docDataSource}
                            docTableTemplates={context.props.docTableTemplates}
                            handleClick={context.props.handleClick}></nodeForOutput>)
                    })}
   
}
```

<video src="../../static/afterFunctional.mp4" controls="controls" width="100%" height="300">您的浏览器不支持播放该视频！</video>

可以看出普通vue组件在渲染时速度基本差不多，但其实性能差了很多，**页面直接崩溃无法操作**，
其实在函数式组件之前做了也做了一些优化才保证页面快速出来：

主要是解决**重绘**引发的性能问题：

1.  数据获取后一次性渲染
2. 轮询找到渲染大致结束标志，然后再分栏处理

