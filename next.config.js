/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config.js')
module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['demo.ecarfinance.uz', 'apps.avtoindex.uz']
  },
  i18n
}
