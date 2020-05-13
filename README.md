这个项目主要用来体验 `webpack@5` 以及 `antd@4`，你可以使用 `yarn profile` 来查看打包体积上的问题。


不锁版本，希望每次都可以体验到新鲜的 bug。

代码虽然少，但是糟糕的写法却不少。



### 目前发现的 antd 的问题

- Table 存在多余的渲染 [children 作为了依赖](https://github.com/ant-design/ant-design/pull/23298#issuecomment-625335294) | [存在每次都重新生成的对象](https://github.com/ant-design/ant-design/issues/23948)
- Form 存在多余的渲染 [Field 每次创建新的 onChange](https://github.com/react-component/field-form/blob/b48d379dd3fd79b24f86ff699e8bbc619462e7d2/src/Field.tsx#L390-L471)
- [Form 不支持受控用法](https://github.com/ant-design/ant-design/issues/23898)
- @umijs/father 默认 target IE10，在 ES Module 中带入了大量 @babel/runtime 的东西
- 很多组件导出的写法不合适，导致没法摇树 [比如 Form](https://github.com/ant-design/ant-design/blob/fd7c94240315bece6556b3362e2db7e0cc8abbf5/components/form/index.tsx#L21-L35)
- 组件中存在循环依赖（和上一条类似） 比如 `Tree` 与 `DirectoryTree`


## LICENSE

MIT
