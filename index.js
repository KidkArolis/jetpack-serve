/**
 * handle node req/res
 * and respond with client side app in both dev and prd!
 * in dev – proxy to the jetpack dev server
 * in prd – serve the static assets from dist
 * handle all that jazz so you don't have to
 */

const fs = require('fs')
const path = require('path')
const express = require('express')
const browsers = require('./browsers')

const env = process.env.NODE_ENV || 'development'

module.exports = function jetpack({ dist = 'dist' } = {}) {
  const router = new express.Router()

  const modernBrowserRegexp = browsers.regexp({ modern: true })
  const modernBundleExists = fs.existsSync(path.join(dist, 'index.html'))
  const legacyBundleExists = fs.existsSync(path.join(dist, 'index.legacy.html'))

  if (env === 'development') {
    router.get('*', require('jetpack/serve'))
  } else {
    router.use('/', express.static(dist))
    router.get('*', (req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      res.sendfile(getIndex(req.headers['user-agent']))
    })
  }

  function getIndex(userAgent) {
    if (!legacyBundleExists && !modernBundleExists) {
      return null
    }

    if (!legacyBundleExists) {
      return '/index.html'
    }

    if (!modernBundleExists) {
      return '/index.legacy.html'
    }

    if (userAgent && modernBrowserRegexp.test(userAgent)) {
      return '/index.html'
    }

    return '/index.legacy.html'
  }
}

module.exports.regexp = function({ modern = true } = {}) {
  return browsers.regexp()
}
