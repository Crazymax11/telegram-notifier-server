const config = require('@n1/eslint-config');
config.env = Object.assign({}, config.env, { jest: true })

module.exports = config;