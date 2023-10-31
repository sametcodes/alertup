/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [
        require('autoprefixer'),
        require('./plugins/postcss-scope')("#root_extension"),
    ]
}

module.exports = config