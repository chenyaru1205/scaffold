## monorepo风格脚手架(pnpm)

### 1、安装pnpm
npm install -g pnpm
其中：npm的版本需高于16.14，才能安装pnpm


### 2、整个工程目录
  |-- scaffold
      |-- package.json
      |-- pnpm-lock.yaml
      |-- pnpm-workspace.yaml
      |-- examples
      |   |-- app
      |       |-- package.json
      |-- packages
          |-- study-cli
              |-- package.json
              |-- bin
                  |-- index.js


### 3、命令参数模块
**小知识点：**
pnpm add 是pnpm安装依赖包的命令，--F study-cli 是指定依赖安装到study-cli子工程下

使用yargs来解析命令参数
`pnpm add yargs --F study-cli`

#### （1）获取命令参数
pnpm study的命令需要加上两个连字符（--），这是为了告诉pnpm后面的入参是传给命令study本身的，而不是pnpm
#### （2）设置子命令
`yargs.command(cmd, desc, builder, handler)`
参数说明：
- `cmd<string | Array<string>>` => 子命令名称
- `desc<string>` => 子命令描述
- `builder<function>:Array` => 子命令参数配置
- `handler<function>` => 专门处理子命令参数的函数


### 4、用户交互模块
使用inquirer来实现询问式的交互 
`pnpm add inquirer@8.2.5 --F study-cli`

询问用户问题；获取并解析用户的输入；检测用户的答案是否合法
可通过`inquirer.prompt()`来实现，入参是个对象的数组，其对象的配置项
- `type<'input' | 'confirm' | 'list' | 'checkbox'>` => 提问的类型
- `name<string>` => 存储问题答案的变量
- `message<string>` => 问题描述
- `default<any>` => 默认值
- `choices<Array>` => 列表选项
- `validate<function>` => 校验函数
- `filter<function>` => 对用户答案进行过滤处理


### 5、文件夹拷贝模块
使用copy-dir来实现文件夹拷贝
`pnpm add copy-dir --F study-cli`

#### （1）脚手架中的路径处理
`path.resolve([from...], to)`
- 若to以 `/` 开头，不会拼接前面的路径
- 若to以 `../` 开头，拼接前面的路径，且不包含最后一节路径
- 若to以 `./` 开头或者没有符号，拼接前面的路径

**其中：**
__dirname 是动态获取当前文件模块所属目录的绝对路径
process.cwd() 是Node.js进程运行时的文件所属目录的绝对路径

#### （2）目录守卫
`fs.mkdirSync(path[, options])` 创建文件夹目录，其中options的配置recursive 是否要创建父级目录
`fs.existsSync(path)` 检查目录是否存在
`path.dirname(path)` 用于获取给定路径的目录名

### 5-1、删除文件夹
使用rimraf来实现删除文件夹及其内容
`pnpm add rimraf --F study-cli`

### 6、文件拷贝模块
三步实现
1、`fs.readFileSync` 读取拷贝文件内容
2、创建文件
3、使用 `fs.writeFileSync` 写入文件内容

### 7、动态文件生成模块
使用mustache来实现
`pnpm add mustache --F study-cli`

**mustache的使用**
#### （1）简单绑定
{{key}}，key要和Mustache.render方法的第二个参数的属性名一致

#### （2）绑定子属性
Mustache.render('<span>{{ifno.name}}</span>', { ifno: { name: '张三' } })

#### （3）循环渲染
可以使用{{#key}}{{/key}}来循环展示
其中 {{#}} 标记表示从该标记以后的内容全部都要循环展示，{{/}}标记表示循环结束
```js
// 示例一
Mustache.render(
  '<span>{{#list}}{{name}}{{/list}}</span>',
  {
    list: [
      { name: '张三' },
      { name: '李四' },
      { name: '王五' },
    ]
  }
)

// 示例二
Mustache.render(
  '<span>{{#list}}{{.}}{{/list}}</span>',
  {
    list:  ['张三','李四','王五']
  }
)
```
输出：<span>张三李四王五</span>

##### （4）循环中二次处理数据
Mustache.render方法的第二个参数的属性值可以是个函数，this可以获取第二个参数的上下文
```js
Mustache.render(
  '<span>{{#list}}{{info}}{{/list}}</span>',
  {
    list: [
      { name: '张三' },
      { name: '李四' },
      { name: '王五' },
    ],
    info () {
      return this.name + ','
    }
  }
)
```
输出：<span>张三,李四,王五,</span>

#### （5）条件渲染
使用 {{#key}} {{/key}} 语法 和 {{^key}} {{/key}} 语法来实现条件渲染
当 key 为 false、0、[]、{}、null，既是 key == false 为真，{{#key}} {{/key}} 包裹的内容不渲染，{{^key}} {{/key}} 包裹的内容渲染
```js
Mustache.render(
  '<span>{{#show}}显示{{/show}}{{^show}}隐藏{{/show}}</span>',
  {
    show: false
  }
)
```

#### （6）不转义HTML标签
使用 {{&key}} 语法来实现
```js
Mustache.render(
  '<span>{{&key}}</span>',
  {
    key: '<span>标题</span>'
  }
)
```


### 8、自动安装依赖模块
使用 Node 中 child_process 子进程这个模块来实现
`child_process.exec(command, options, callback)`
参数说明：
- command：命令，比如 pnpm install
- options：参数
-- cwd：设置命令运行环境的路径
-- env：环境变量
-- timeout：运行执行现在
- callback：运行命令结束回调，(error, stdout, stderr) =>{ }，执行成功后 error 为 null，执行失败后 error 为 Error 实例，stdout、stderr 为标准输出、标准错误，其格式默认是字符串

使用ora来实现加载动画
依赖在安装时，光标一直在闪烁，好像卡住了
pnpm add ora@5.4.1 --F study-cli



### 9、发布包
没有npm账号的时候，需要去注册一个 https://www.npmjs.com/
登录账号 `npm login`
发布到npm `npm publish --access=public`
每次修改发布，记得改版本号version

### 10、使用脚手架
卸载脚手架
`npm uninstall -g  @lucia.chen/study-cli`
下载脚手架
`npm install -g  @lucia.chen/study-cli`
利用脚手架创建一个src文件
`study create --name=ProjectTest`

### 11、补充

