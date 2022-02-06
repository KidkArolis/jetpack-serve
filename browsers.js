const browserslist = require('browserslist')
const browserslistUseragentRegexp = require('browserslist-useragent-regexp')

// These are browserslist defaults
// + browsers supporting es modules according to babel-preset-env
// - browsers that don't support async/await properly
//
// The point here is to have an evergreen, modern browser support
// but eagerly exclude all the browsers that are still quite new
// but don't support async/await fully. This avoids transpiling
// async/await. Eventually this can be simplified back to browserslist
// default, but for now this is what it takes.
//
// This approach is an alternative to module/nomodule approach.
// While module/nomodule approach is a specific cut in time, where
// certain browsers started supporting es modules, that cut will remain
// static unless new specs for versioning script tags is introduced.
//
// As browsers continue adding new features, this browserslist will
// continue polyfilling less and less. We therefore need to do
// user agent parsing and serve the appropriate html file based
// on this very browserslist.

const jetpackDefaultBrowserslist = {
  modern: ['> 0.25% and last 2 versions', 'not dead', 'not ie <= 11'].join(', '),
  legacy: undefined,
}

function query(options) {
  const browserslistEnv = options.modern ? 'modern' : 'legacy'
  let browsers = browserslist.loadConfig({ env: browserslistEnv, path: '.' })
  browsers = browsers || jetpackDefaultBrowserslist[browserslistEnv]
  return browsers
}

function regexp(options) {
  return browserslistUseragentRegexp.getUserAgentRegExp({
    browsers: query(options),
    allowHigherVersions: true,
  })
}

module.exports.query = query
module.exports.browserslist = jetpackDefaultBrowserslist
module.exports.regexp = regexp
