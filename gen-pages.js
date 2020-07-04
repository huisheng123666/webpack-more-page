const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const jsTem = `

if (process.env.NODE_ENV === 'development') {
  import('./index.html')
}

`

function getIPAdress() {
  let interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

class CopyPlugin {
  apply (compiler) {
    compiler.hooks.done.tapAsync('done', (compilation, callback) => {
      const staticFiles = fs.readdirSync('static')
      for (let i = 0; i < staticFiles.length; i++) {
        fs.copyFileSync(`static/${staticFiles[i]}`, `dist/${staticFiles[i]}`)
      }
      if (!isProd) {
        setTimeout(() => {
          console.clear()
          console.log('you can open!')
          console.log('network:', `http://${getIPAdress()}:8000`)
          console.log('local:', `http://localhost:8000`)
        }, 100)
      }
      callback()
    })
  }
}

const genPages = () => {
  const entry = {
    common: './src/common/js/index.js'
  }
  const htmls = []
  const dirPath = './src/pages'
  const files = fs.readdirSync(dirPath)
  for (let i = 0, len = files.length; i < len; i++) {
    const jsPath = `${dirPath}/${files[i]}/index.js`
    entry[files[i]] = jsPath
    htmls.push(new HtmlWebpackPlugin({
      filename: files[i] !== 'index' ? `${files[i]}/index.html` : 'index.html',
      chunks: [files[i], 'common'],
      template: `./src/pages/${files[i]}/index.html`,
      inject: true,
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      }
    }))
    if (fs.existsSync(jsPath)) {
      let content = fs.readFileSync(jsPath, 'utf8')
      if (content.indexOf(jsTem) >= 0) continue
      content += jsTem
      fs.unlinkSync(jsPath)
      fs.writeFileSync(jsPath, content)
    } else {
      fs.writeFileSync(jsPath, jsTem)
    }
  }

  return {
    entry,
    htmls
  }
}

module.exports = {
  genPages,
  CopyPlugin
}