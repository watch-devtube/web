/* eslint-disable import/no-commonjs */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const webpack = require('webpack');

module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    filename: 'build.js',
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
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
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
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
    historyApiFallback: false,
    openPage: "dist/index.html"
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
};