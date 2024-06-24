const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve('.');

module.exports = (env) => {
    console.log(env);

    const currentEnivronment = env?.NODE_ENV || env?.nodeEnv; // почему-то devServer и обычная сборка по-разному прокидывают аргументы
    console.log(currentEnivronment);
    const isProduction = currentEnivronment === 'prod';

    const basePath = root + '/.env';

    const envPath = basePath + '.' + currentEnivronment;

    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    const fileEnv = dotenv.config({ path: finalPath }).parsed;

    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});
    const devtool = isProduction ? '' : 'eval-cheap-module-source-map';
    console.log(isProduction);
    console.log(envKeys);

    return {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, '..', 'priv', 'static', 'js'),
            publicPath: '/', // этот путь будет добавляться в пути до каждого бандла внутри хтмл и других бандлов
            // filename: '[name].[hash].bundle.js',
            filename: 'app.js',
            chunkFilename: '[name].[hash].bundle.js',
        },
        node: {
            fs: 'empty',
        },
        devtool,
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            sourceMap: !isProduction,
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(scss|module.(scss))$/,
                    exclude: /\.$/,
                    loader: [
                        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProduction,
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpg|jpeg|gif|png|svg)$/,
                    loader: ['file-loader?context=src/images&name=images/[path][name].[ext]'],
                },
                {
                    test: /\.(woff|woff2|eot|ttf)$/,
                    loader: 'file-loader?name=fonts/[name].[hash].[ext]',
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin(envKeys),
            new MiniCssExtractPlugin({ filename: '../css/app.css' }),
            new CopyWebpackPlugin({
                patterns: [{ from: 'static/', to: '../' }],
            }),
        ],
    };
};
