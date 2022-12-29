const browserslist = require('browserslist')

function query(options) {
  const browserslistEnv = options.modern ? 'modern' : 'legacy'
  const browsers = browserslist.loadConfig({ env: browserslistEnv, path: '.' })
  return browsers
}

async function regex(options) {
  const { getUserAgentRegex } = await import('browserslist-useragent-regexp')
  return getUserAgentRegex({
    browsers: query(options),
    allowHigherVersions: true,
  })
}

module.exports.query = query
module.exports.regex = regex
