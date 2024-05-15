#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const { inquirerPrompt, install  } = require('./inquirer')
const { copyDir, checkMkdirExists, copyFile, copyTemplate } = require('./copy')

// 命令：pnpm study
// console.log('Welcome to study World'); 

// 命令：pnpm study --name=orderPage
// console.log('name', yargs.argv.name);

// 命令：pnpm study create --name=orderPage
// 命令：pnpm study c --name=orderPage
// 命令：pnpm study c
// 命令：pnpm study c --name=OrderPage
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
      console.log('answers', answers)
      // 把packages/study/bin/template/form这个文件夹拷贝到examples/app/src/pages/OrderPage中 
      // const { name, type } = answers
      // const isMkdirExists = checkMkdirExists(
      //   path.resolve(process.cwd(), `./src/pages/${name}`)
      // )
      // console.log('process.cwd()', process.cwd())
      // console.log('__dirname', __dirname)
      // if (isMkdirExists) {
      //   console.log(`${name}文件夹已存在`)
      // } else {
      //   copyDir(
      //     path.resolve(__dirname, `./template/${type}`),
      //     path.resolve(process.cwd(), `./src/pages/${name}`)
      //   )
        
      // }

      // 拷贝文件
      // const { name, type } = answers
      // const isMkdirExists = checkMkdirExists(
      //   path.resolve(process.cwd(), `./src/pages/${name}/test.js`)
      // )
      // if (isMkdirExists) {
      //   console.log(`${name}/test.js文件已经存在`)
      // } else {
      //   copyFile(
      //     path.resolve(__dirname, `./template/${type}/test.js`),
      //     path.resolve(process.cwd(), `./src/pages/${name}/test.js`)
      //   )
      // }

      // 生成动态文件
      const { name, type } = answers
      const isMkdirExists = checkMkdirExists(
        path.resolve(process.cwd(), `./src/pages/${name}/index.js`)
      )
      if (isMkdirExists) {
        console.log(`${name}/index.js文件已经存在`)
      } else {
        copyTemplate(
          path.resolve(__dirname, `./template/${type}/index.tpl`),
          path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
          {
            name
          }
        )
        install(process.cwd(), answers)
      }
    })
  }
).argv