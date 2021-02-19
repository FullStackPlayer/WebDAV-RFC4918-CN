/**
 * 自动生成边栏的脚本
 */

const fs = require('fs')
// 读取配置文件
let cfgPath = process.cwd() + '/Translation/.vuepress/config.js'
let content = fs.readFileSync(cfgPath, { encoding: 'utf-8' })
content = content.replace(`module.exports = `,'')
// console.log(content)
let config = JSON.parse(content)
let sidebar = config.themeConfig.sidebar
sidebar = []
// 读取文档目录
let docDir = process.cwd() + '/Translation/'
let docs = fs.readdirSync(docDir)
for (let i=0; i<docs.length; i++) {
    let name = docs[i]
    if (name !== 'README.md' && name !== '.vuepress' && name !== 'Wechat.png' && name !== '.DS_Store') {
        sidebar.push('/' + name.replace('.md',''))
    }
}
// 顶部添加首页链接
sidebar.unshift(['/','首页'])
config.themeConfig.sidebar = sidebar
// console.log(sidebar)
// 保存文件
content = `module.exports = ` + JSON.stringify(config,null,4)
fs.writeFileSync(cfgPath, content)
console.log('导航目录更新完成')
