const inquirer = require('inquirer')
const path = require('path')
const { exec } = require('child_process')
const ora = require("ora")

function inquirerPrompt(argv) {
  const { name } = argv
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '模板名称',
        default: name,
        validate: function(val) {
          if (!/^[a-z A-Z]+$/.test(val)) {
            return '模板名称只能含有英文'
          }
          if (!/^[A-Z]/.test(val)) {
            return '模板名称首字母必须大写'
          }
          return true
        }
      },{
        type: 'list',
        name: 'type',
        message: '模板类型',
        choices: ['表单', '动态表单', '嵌套表单'],
        filter: function(value) {
          return {
            '表单': 'form',
            '动态表单': 'dynamicForm',
            '嵌套表单': 'nestedForm'
          }[value]
        }
      }, {
        type: 'list',
        name: '使用什么框架开发',
        choices: ['vue', 'react'],
        name: 'frame'
      }
    ]).then(answers => {
      const { frame } = answers
      if (frame === 'react') {
        inquirer.prompt([
          {
            type: 'list',
            message: '使用什么UI组件库开发',
            choices: ['Ant Design'],
            name: 'library'
          }
        ]).then(answers1 => {
          resolve({
            ...answers,
            ...answers1
          })
        }).catch(error => {
          reject(error)
        })
      }

      if (frame === 'vue') {
        inquirer.prompt([
          {
            type: 'list',
            message: '使用什么UI组件库开发',
            choices: ['Element'],
            name: 'library'
          }
        ]).then(answers2 => {
          resolve({
            ...answers,
            ...answers2
          })
        }).catch(error => {
          reject(error)
        })
      }
    })
  })
}

const LibraryMap = {
  'Ant Design': 'antd',
  'iView': 'view-ui-plus',
  'Ant Design Vue': 'ant-design-vue',
  'Element': 'element-plus'
}

function install(cmdPath, options) {
  const { frame, library } = options
  const command = `pnpm add ${frame} && pnpm add ${LibraryMap[library]}`
  return new Promise(function(resolve, reject) {
    const spinner = ora();
    spinner.start('正在安装依赖，请稍等')
    exec(
      command,
      {
        cwd: path.resolve(cmdPath)
      },
      function(error, stdout, stderr) {
        // console.log('error', error)
        // console.log('stdout', stdout)
        // console.log('stderr', stderr)
        if (error) {
          reject()
          spinner.fail('安装依赖失败')
          return
        }
        spinner.succeed('依赖安装成功')
        resolve()
      }
    )
  })
}

exports.inquirerPrompt = inquirerPrompt
exports.install = install