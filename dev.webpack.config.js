const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  target: 'web',
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.svg$/,
        use: ["babel-loader", "vue-svg-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          { loader: 'css-loader', options: { esModule: false }},
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2)$/i,
        use: [
          {
            loader: "file-loader",
            options: { esModule: false }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  plugins: [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    title: 'PokeDex',
    filename: 'index.html',
    template: 'src/index.html',
    inject: true
  })
  ],
  devServer: {
    host: '0.0.0.0',
    //contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    static: [
      path.resolve(__dirname, 'dist')
    ]
    //publicPath: "/",
    //liveReload: true,
    //watchContentBase: true,
    //hot: false,
    //historyApiFallback: true,
  },
};
