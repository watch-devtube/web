/* eslint-disable import/no-commonjs */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dest = path.resolve(__dirname, './dist')

module.exports = {
  entry: './src/entry-client.js',
  output: {
    path: dest,
    publicPath: '/',
    filename: `[name].[hash].js`
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.pug'}),
    new CopyWebpackPlugin([
      { from: "src/static" }
    ]),
    new WriteFilePlugin()
  ],  
  module: {
    rules: [  
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax',
          },
        },
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'] 
          },
          {
            use: ['source-loader', 'pug-static-loader']
          }
        ]
      },          
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        }
      }
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  devServer: {
    historyApiFallback: false
  },
  performance: {
    hints: false,
  }
};