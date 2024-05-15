const copydir = require('copy-dir')
const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')

// 目录守卫，父目录不存在，递归创建父目录
function mkdirGuard(target) {
  try {
    // fs.mkdirSync(path[, options]) 创建文件夹目录
    // recursive是否要创建父级目录
    fs.mkdirSync(target, { recursive: true })
  } catch(e) {
    mkdirp(target)
    function mkdirp(dir) {
      // fs.existsSync(path) 检查目录是否存在
      if (fs.existsSync(dir)) return true
      // path.dirname(path) 用于获取给定路径的目录名
      const dirname = path.dirname(dir)
      mkdirp(dirname)
      fs.mkdirSync(dir)
    }
  }
}

function copyDir(from, to, options) {
  mkdirGuard(to)
  copydir.sync(from, to, options)
}

function checkMkdirExists(path) {
  return fs.existsSync(path)
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from)
  const parentPath = path.dirname(to)
  mkdirGuard(parentPath)
  fs.writeFileSync(to, buffer)
}

function readTemplate(path, data = {}) {
  const str = fs.readFileSync(path, { encoding: 'utf-8' })
  return Mustache.render(str, data)
}

function copyTemplate(from, to, data = {}) {
  if (path.extname(from) !== '.tpl') {
    return copyFile(from, to)
  }
  const parentToPath = path.dirname(to)
  mkdirGuard(parentToPath)
  fs.writeFileSync(to, readTemplate(from, data))
}

exports.copyDir = copyDir
exports.checkMkdirExists = checkMkdirExists
exports.mkdirGuard = mkdirGuard
exports.copyFile = copyFile
exports.readTemplate = readTemplate
exports.copyTemplate = copyTemplate
