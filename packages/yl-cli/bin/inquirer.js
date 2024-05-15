const inquirer = require('inquirer')
const path = require('path')
const { exec } = require('child_process')
const ora = require("ora")
const fs = require('fs')

function inquirerPrompt(argv) {
  const { name } = argv
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
        default: name,
        validate: function(val) {
          if (!/^[a-z A-Z][a-z A-Z -]*[a-z A-Z]$/.test(val)) {
            return '模板名称只能含有英文或-，且首尾只能含有英文'
          }
          return true
        }
      }
    ]).then(answers => {
      const { name } = answers
      if(fs.existsSync(name)) {
        inquirer.prompt([
          {
            type: 'confirm',
            message: '文件夹已存在，是否删掉原先的内容并覆盖？',
            default: false,
            name: 'isCoverFolder'
          }
        ]).then(answers1 => {
          const { isCoverFolder } = answers1
          if (isCoverFolder) {
            inquirerPromptData().then(answers2 => {
              resolve({
                ...answers,
                ...answers1,
                ...answers2
              })
            }).catch(error => {
              reject(error)
            })
          }
        }).catch(error => {
          reject(error)
        })
      } else {
        inquirerPromptData().then(answers2 => {
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

function inquirerPromptData() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        message: '请输入子系统的端口号',
        name: 'port',
        default: 8101,
        validate: function(val) {
          if (!/^[0-9]+$/.test(val)) {
            return '端口号只能输入数字'
          }
          return true
        }
      },
      {
        type: 'input',
        message: '请输入子系统的路由',
        name: 'routeIndex',
        default: 'networkManagementIndex',
        validate: function(val) {
          if (!/^[a-z A-Z]+$/.test(val)) {
            return '路由只能输入英文'
          }
          return true
        }
      },
      {
        type: 'input',
        message: '请输入子系统【开发环境】的接口服务域名',
        name: 'devApiUrl',
        validate: function(val) {
          if (val && !/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(val)) {
            return '请输入正确的接口服务域名地址'
          }
          return true
        }
      },
      {
        type: 'input',
        message: '请输入子系统【测试环境】的接口服务域名',
        name: 'testApiUrl',
        validate: function(val) {
          if (val && !/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(val)) {
            return '请输入正确的接口服务域名地址'
          }
          return true
        }
      },
      {
        type: 'input',
        message: '请输入子系统【预发环境】的接口服务域名',
        name: 'preApiUrl',
        validate: function(val) {
          if (val && !/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(val)) {
            return '请输入正确的接口服务域名地址'
          }
          return true
        }
      },
      {
        type: 'input',
        message: '请输入子系统【生产环境】的接口服务域名',
        name: 'prodApiUrl',
        validate: function(val) {
          if (val && !/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/.test(val)) {
            return '请输入正确的接口服务域名地址'
          }
          return true
        }
      }
    ]).then(answers => {
      resolve(answers)
    }).catch(error => {
      reject(error)
    })
  })
}

exports.inquirerPrompt = inquirerPrompt