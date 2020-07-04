const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const jsTem = `

if (process.env.NODE_ENV === 'development') {
  import('./index.html')
}

`

class CopyPlugin {
  apply (compiler) {
    compiler.hooks.afterEmit.tapAsync('done', (compilation, callback) => {
      const staticFiles = fs.readdirSync('static')
      for (let i = 0; i < staticFiles.length; i++) {
        fs.copyFileSync(`static/${staticFiles[i]}`, `dist/${staticFiles[i]}`)
        console.log(staticFiles[i])
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