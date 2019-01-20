var path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = env => {

  let plugins, optimization, JSFilename;

  if(env.NODE_ENV === 'dev'){
    JSFilename = 'bundle.js';
    plugins = [
      new ExtractTextPlugin('../css/[name].css')
    ];
    optimization = {};
  }
  else if(env.NODE_ENV === 'production'){
    JSFilename = 'bundle.min.js';
    plugins = [
      new ExtractTextPlugin('../css/[name].bundle.css'), 
      new OptimizeCssAssetsPlugin()
    ];
    optimization = {
      minimize: true,
      splitChunks: {
        chunks: "async",
        minSize: 1000,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          }
        }
      }
    };
  }
  else{
    console.log('INCORRECT BUILD OPTIONS ENV NOT CORRECT!')
    return;
  }

  return {
    entry: ['./src/js/index.js', './src/js/test.js', './src/sass/main.scss'],
    optimization: optimization,
    output: {
      path: path.resolve(__dirname, 'js'),
      filename: JSFilename
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          })
        }
      ]
    },
    resolve: {
      alias: {}
    },
    plugins: plugins
  }
};