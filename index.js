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

const nodeEnv = process.env.NODE_ENV || 'development'

module.exports = function jetpack({ dist = 'dist', env = nodeEnv } = {}) {
  const router = new express.Router()

  const modernBundleExists = exists(path.join(dist, 'index.html'))
  const legacyBundleExists = exists(path.join(dist, 'index.legacy.html'))

  if (env === 'development') {
    router.get('*', require('jetpack/serve'))
  } else {
    router.use('/', express.static(dist, { index: false }))
    router.get('*', async (req, res, next) => {
      try {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const modernBrowserRegex = await getModernBrowserRegex()
        const index = getIndex(req.headers['user-agent'], modernBrowserRegex)
        if (index) {
          res.sendFile(index, { root: dist })
        } else {
          res.sendStatus(404)
        }
      } catch (err) {
        next(err)
      }
    })
  }

  return router

  function getIndex(userAgent, modernBrowserRegex) {
    if (!legacyBundleExists && !modernBundleExists) {
      return null
    }

    if (!legacyBundleExists) {
      return '/index.html'
    }

    if (!modernBundleExists) {
      return '/index.legacy.html'
    }

    if (userAgent && modernBrowserRegex.test(userAgent)) {
      return '/index.html'
    }

    return '/index.legacy.html'
  }
}

module.exports.regex = async function ({ modern = true } = {}) {
  return browsers.regex()
}

function exists(file) {
  try {
    fs.accessSync(file, fs.constants.F_O)
    return true
  } catch (err) {
    return false
  }
}

let modernBrowserRegex
async function getModernBrowserRegex() {
  if (!modernBrowserRegex) {
    modernBrowserRegex = browsers.regex({ modern: true }).then((re) => {
      modernBrowserRegex = re
    })
  }
  return modernBrowserRegex
}
