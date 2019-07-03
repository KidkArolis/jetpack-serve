# jetpack-serve

This is an express middleware for serving up bundles created by [jetpack](https://github.com/KidkArolis/jetpack/).

Use this in your app if you don't want to install/require the entire jetpack bundler in your production app.

## Usage

Once the app is bundled:

```js
$ jetpack build
```

You can serve it in your express application:

```js
const express = require('express')
const jetpack = require('jetpack-serve')

const app = express()

app.get('/api/data', (req, res) => {
  res.send('hello')
})

app.use(jetpack())

app.listen(3000, function() {
  console.log('Running server on http://localhost:3000')
})
```

This package handles **jetpack's differential builds**! That is a modern or legacy bundle will be served based on the user agent of the browser.
