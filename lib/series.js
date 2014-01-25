var request = require('superagent')
var utils = require('./utils')

module.exports = Series

function Series (name, database) {
  this.database = database
  this.name = name
}

Series.prototype.insert = function (points, options, fn) {
  if ( ! Array.isArray(points)) {
    points = [points]
  }

  for (var i = 0; i < points.length; i++) {
    points[i].name = this.name
  }

  return this.database.insert(points, options, fn)
}

Series.prototype.destroy = function (fn) {
  var db = this.database

  var req = request
    .del(utils.url(db.connection, 'db/' + db.name + '/series/' + this.name))
    .query(utils.qs(db.connection))

  return utils.maybeCall(fn, utils.req(req))
}
