var url = require('url')

exports.req = function (req, filter) {
  filter = filter || function (v) { return v }
  return function (fn) {
    req.end(function (res) {
      if (res.error) {
        fn(new Error(res.text))
        return
      }
      
      fn(null, filter(res.body))
    })
  }
}

exports.url = function (connection, database) {
  return url.format({
    protocol: 'http:'
    , hostname: connection.host
    , port: connection.port
    , pathname: database
  })
}

exports.qs = function (connection, query) {
  query = query || {}
  query.u = query.u || connection.name
  query.p = query.p || connection.password
  return query
}

exports.maybeCall = function (expected, callback) {
  if (typeof expected === 'function') {
    callback(expected)
  } else {
    return callback
  }
}
