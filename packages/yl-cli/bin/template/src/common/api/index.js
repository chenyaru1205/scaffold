'use strict'
import Api from '@public/api'
const API_URL = { ...Api.API_URL }
const API = { ...Api.API }
const files = require.context('.', true, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') {
    return
  }
  const fils = files(key)
  if (key.includes('url.js')) {
    let k = key.replace(/(^\.\/|\.url.js$)/g, '')
    const ka = k.split('/')
    k = ka[ka.length - 1]
    API_URL[k] = API_URL[k] || {}
    Object.keys(fils).forEach(item => {
      if (item === 'default') API_URL[k] = { ...API_URL[k], ...fils[item] }
      else API_URL[k][item] = fils[item]
    })
  } else {
    let k = key.replace(/(^\.\/|\.js$)/g, '')
    const ka = k.split('/')
    k = ka[ka.length - 1]
    API[k] = API[k] || {}
    Object.keys(fils).forEach(item => {
      if (item === 'default') API[k] = { ...API[k], ...fils[item] }
      else API[k][item] = fils[item]
    })
  }
})
export default {
  API_URL, API
}
