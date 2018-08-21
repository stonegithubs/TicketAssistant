const path = require('path');

module.exports = {
  entry: './static/index.html',
  output: {
    filename: 'bundle.html',
    path: path.resolve(__dirname, 'dist')
  }
};