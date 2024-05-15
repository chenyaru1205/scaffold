const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')

// 目录守卫，父目录不存在，递归创建父目录
const mkdirGuard = function(target) {
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

// 复制目录/文件
const copyDir = function(from, to, callback) {
  const stat = fs.statSync(from)
  if (stat.isFile()) {
    // node版本高于v16.7.0
    if (fs.cpSync) {
      fs.cpSync(from, to)
    } else {
       // 兼容旧版本
       mkdirGuard(to)
       const buffer = fs.readFileSync(from)
       const parentPath = path.dirname(to)
       mkdirGuard(parentPath)
       fs.writeFileSync(to, buffer)
    }
  } else if (stat.isDirectory()) {
    // node版本高于v16.7.0
    if (fs.cpSync) {
      fs.cpSync(from, to, { recursive: true })
    } else {
      // 兼容旧版本
      const copy = (from, to) => {
        // 读取目录下的文件数组list
        const list = fs.readdirSync(from)
        list.forEach((item) => {
          const ss = path.resolve(from, item)
          // 判断文件是否存在
          const statDir = fs.statSync(ss)
          const curSrc = path.resolve(from, item)
          const curDest = path.resolve(to, item)
          if (statDir.isFile()) {
            // 文件，直接复制
            fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest))
          } else if (stat.isDirectory()) {
            // 目录，进行递归
            mkdirGuard(curDest)
            copy(curSrc, curDest)
          }
        })
      }

      // 判断是否有存在和使用权限
      fs.access(to, (err) => {
        if (err) {
          // 若目标目录不存在，则创建
          mkdirGuard(to)
        }
        copy(from, to)
      })
    }
  }
}

// 删除目录/文件
const deleteDir = function(dir) {
  const stat = fs.statSync(dir)
  if (stat.isFile()) {
    // 删除文件
    fs.unlinkSync(dir)
  } else if (stat.isDirectory()) {
    const list = fs.readdirSync(dir)
    // 遍历获取目录下的儿子，并拼接路径
    const dirs = list.map((item) => path.join(dir, item))
    // 指向当前儿子的索引
    if (dirs.length === 0) {
      fs.rmdirSync(dir)
      return
    }
    // 遍历删除
    dirs.forEach((item) => {
      deleteDir(item)
    })
    fs.rmdirSync(dir)
  }
}

// 读取文件内容
const readTemplate = function(path, data = {}) {
  const str = fs.readFileSync(path, { encoding: 'utf-8' })
  return Mustache.render(str, data)
}

// 替换文件的内容(单个)
const copyTemplate = function(from, to, data = {}) {
  // if (path.extname(from) !== '.tpl') {
  //   return copyFile(from, to)
  // }
  const parentToPath = path.dirname(to)
  mkdirGuard(parentToPath)
  fs.writeFileSync(to, readTemplate(from, data))
}

const copyTemplateMultiple = function(from, to, data = {}) {
  const stat = fs.statSync(from)
  if (stat.isFile()) {
    copyTemplate(from, to, data)
  } else if (stat.isDirectory()) {
    const copy = (from, to, data) => {
      // 读取目录下的文件数组list
      const list = fs.readdirSync(from)
      list.forEach((item) => {
        const ss = path.resolve(from, item)
        // 判断文件是否存在
        const statDir = fs.statSync(ss)
        const curSrc = path.resolve(from, item)
        const curDest = path.resolve(to, item)
        if (statDir.isFile()) {
          // 文件，直接复制替换
          copyTemplate(curSrc, curDest, data)
        } else if (stat.isDirectory()) {
          // 目录，进行递归
          mkdirGuard(curDest)
          copy(curSrc, curDest, data)
        }
      })
    }

    // 判断是否有存在和使用权限
    fs.access(to, (err) => {
      if (err) {
        // 若目标目录不存在，则创建
        mkdirGuard(to)
      }
      copy(from, to, data)
    })
  }
}

exports.copyDir = copyDir
exports.deleteDir = deleteDir
exports.mkdirGuard = mkdirGuard
exports.readTemplate = readTemplate
exports.copyTemplate = copyTemplate
exports.copyTemplateMultiple = copyTemplateMultiple