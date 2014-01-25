var request = require('superagent')

// var ScheduledDelete = require('./scheduled_delete')
var Connection = require('./connection')
var Series = require('./series')
var utils = require('./utils')
var User = require('./user')

module.exports = Database

function Database (name, connection) {
  this.name = name
  this.connection = connection || new Connection
}

Database.prototype.series = function (name) {
  return new Series(name, this)
}

Database.prototype.save = function (options, fn) {
  var database = this
  
  if (typeof options !== 'object') {
    fn = options
    options = {}
  }

  var req = request
    .post(utils.url(this.connection, 'db'))
    .query(utils.qs(this.connection, options))
    .send({ name: this.name })

  return utils.maybeCall(fn, utils.req(req, function () {
    return database
  }))
}

Database.prototype.drop = function (fn) {
  var req = request
    .del(utils.url(this.connection, 'db/' + this.name))
    .query(utils.qs(this.connection))


  return utils.maybeCall(fn, utils.req(req))
}

Database.all = function (connection, fn) {
  var req = request
    .get(utils.url(connection, 'db'))
    .query(utils.qs(connection))
    .set('Accept', 'application/json')

  return utils.maybeCall(fn, utils.req(req, mapToInstances))
}

function mapToInstances (databases) {
  return databases.map(recordToInstance)
}

function recordToInstance (database) {
  return new Database(database.name)
}

/**
 * Users
 */

Database.prototype.user = function (username, password) {
  return new User(username, password, this)
}

/**
 * Points
 */

Database.prototype.insert = function (points, options, fn) {
  if ( ! Array.isArray(points)) {
    points = [points]
  }

  if (typeof options !== 'object') {
    fn = options
    options = {}
  }

  var req = request
    .post(utils.url(this.connection, 'db/' + this.name + '/series'))
    .query(utils.qs(this.connection, options))
    .send(points)

  return utils.maybeCall(fn, utils.req(req))
}

/**
 * Querying
 */

Database.prototype.query = function (query, options, fn) {
  if (typeof options !== 'object') {
    fn = options
    options = {}
  }

  options.q = query

  var req = request
    .get(utils.url(this.connection, 'db/' + this.name + '/series'))
    .query(utils.qs(this.connection, options))
    .set('Accept', 'application/json')

  return utils.maybeCall(fn, utils.req(req))
}

/**
 * Scheduled deletes
 */

// Database.prototype.scheduledDelete = function (options) {
//   return new ScheduledDelete(options, this)
// }

// Database.prototype.getScheduledDeletes = function (fn) {
//   return ScheduledDelete.all(this, fn)
// }
