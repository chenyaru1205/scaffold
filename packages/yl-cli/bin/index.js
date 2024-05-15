#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const { inquirerPrompt  } = require('./inquirer')
const { deleteDir, copyTemplateMultiple } = require('./fs-operate')


yargs.command(
  ['create', 'c'],
  '新建一个模板',
  function(yargs) {
    return yargs.option('name', {
      alias: 'n',
      demand: true,
      describe: '模板名称',
      type: 'string'
    })
  },
  function(argv) {
    console.log('argv', argv)
    inquirerPrompt(argv).then(answers => {
      const { name, isCoverFolder, port, routeIndex, devApiUrl, testApiUrl, preApiUrl, prodApiUrl } = answers
      // 文件已存在
      if (isCoverFolder !== undefined && !isCoverFolder) {
        console.log(`${name}文件夹已经存在`)
      } else {
        // 文件已存在，覆盖
        if (isCoverFolder) {
          // 删掉原先的内容，拷贝文件夹
          deleteDir(path.resolve(process.cwd(), `./${name}`))
        }
        copyTemplateMultiple(
          path.resolve(__dirname, `./template`),
          path.resolve(process.cwd(), `./${name}`),
          {
            name,
            port,
            routeIndex,
            devApiUrl,
            testApiUrl,
            preApiUrl,
            prodApiUrl
          }
        )
      }
      console.log('\n')
      console.log(`${name}项目创建成功\n\n`)
      if (!port) {
        console.log(`------端口号缺失，请在.env文件和public/index.html文件里补充`)
      }
      if (!routeIndex) {
        console.log(`------子系统的路由缺失，请在vue.config.js文件补充`)
      }
      if (!devApiUrl) {
        console.log(`------【开发环境】的接口服务域名未填写，请在.env.dev-release文件里补充`)
      }
      if (!testApiUrl) {
        console.log(`------【测试环境】的接口服务域名未填写，请在.env.test文件里补充`)
      }
      if (!preApiUrl) {
        console.log(`------【预发环境】的接口服务域名未填写，请在.env.pre-release文件里补充`)
      }
      if (!prodApiUrl) {
        console.log(`------【开发环境】的接口服务域名未填写，请在.env.production文件里补充`)
      }
      console.log('\n\n')
      console.log(`执行cd ${name} 进入项目\n`)
      console.log(`执行npm i 加载依赖\n`)
      console.log(`执行npm serve 运行项目\n`)

      console.log(`若加载依赖失败，可检查node的版本，最好保持在14.19.3\n`)
    })
  }
).argv

// 变量：name:项目名称，
// port：微服务端口号，
// routeIndex：子系统路由，
// devApiUrl：开发环境的域名，testApiUrl：测试环境的域名，preApiUrl：预发环境的域名，prodApiUrl：生产环境的域名
// 主依赖包：