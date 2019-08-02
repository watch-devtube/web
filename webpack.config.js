/* eslint-disable import/no-commonjs */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dest = path.resolve(__dirname, './dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    app: ['./src/styles/main.sass', './src/entry-client.js']
  },
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
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    })
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false,
              publicPath: 'src/static'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production',
              importLoaders: 2
            }
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     sourceMap: process.env.NODE_ENV !== 'production'
          //   }
          // },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                require('path').resolve(__dirname, 'node_modules/bulma')
              ],
              sourceMap: process.env.NODE_ENV !== 'production',
              indentedSyntax: true
            }
          }
        ]
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
    }
  },
  devServer: {
    historyApiFallback: false
  },
  performance: {
    hints: false,
  }
};
