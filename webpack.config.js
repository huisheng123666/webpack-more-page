const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { genPages, CopyPlugin } = require('./gen-pages')

const { entry, htmls } = genPages()

const isProd = process.env.NODE_ENV === 'production'
const preCss = process.env.CSS_ENV

const cssReg = {
  sass: /\.scss$/,
  less: /\.less$/,
  stylus: /\.styl$/
}

const cssLoader = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  },
  {
    loader: 'postcss-loader'
  },
  {
    loader: `${preCss}-loader`,
    options: {
      sourceMap: isProd,
    }
  }
]

module.exports = {
  entry,
  output: {
    filename: 'js/[name][hash:8].js',
    path: path.resolve(__dirname, './dist'),
    chunkFilename: 'js/[name].[hash:8].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.relative(__dirname, './dist'),
    hot: true,
    port: 8000,
    host: '0.0.0.0'
  },
  devtool: isProd ? 'cheap' : 'source-map',
  optimization: isProd ? {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  } : {},
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [isProd ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '/',
          }
        } : 'style-loader'].concat(cssLoader.slice(0, 2))
      },
      {
        test: cssReg[preCss],
        sideEffects: true,
        use: [isProd ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '/',
          }
        } : 'style-loader'].concat(cssLoader)
      },
      {
        test: /\.jpeg|png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'img/[name]-[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      }
    ]
  },
  plugins: [
    ...htmls,
    !isProd && new webpack.HotModuleReplacementPlugin(),
    isProd && new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    isProd && new OptimizeCSSAssetsPlugin({}),
    isProd && new CleanWebpackPlugin(),
    new CopyPlugin()
  ].filter(Boolean)
}