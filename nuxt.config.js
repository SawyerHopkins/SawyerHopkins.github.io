const Theme = require('./assets/config/theme')

module.exports = {
  /* MODE */
  mode: 'spa',
  /* HEAD */
  head: {
    title: 'SawyerHopkins.com',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Another website on the Internet' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.8/css/all.css' }
    ]
  },
  /* RESOURCES */
  css: [
    '~/assets/style/app.styl'
  ],
  env: {
    VERSION: JSON.stringify(require('./package.json').version)
  },
  /* LOADING */
  loadingIndicator: {
    name: 'folding-cube',
    color: Theme.accent,
    background: Theme.background
  },
  loading: { color: Theme.accent, height: '5px' },
  /* BUILD */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
