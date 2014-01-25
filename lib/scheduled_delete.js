var request = require('superagent')
var utils = require('./utils')

module.exports = ScheduledDelete

function ScheduledDelete (options, database) {
  options = options || {}
  this.database = database

  if (typeof options === 'number') {
    this.id = options
  } else {
    this.id = options.id
    this.regex = options.regex
    this.olderThan = options.olderThan
    this.runAt = options.runAt
  }
}

ScheduledDelete.prototype.save = function (fn) {
  var db = this.database

  var req = request
    .post(utils.url(db.connection, 'db/' + db.name + '/scheduled_deletes'))
    .query(utils.qs(db.connection))
    .send({
      regex: this.regex
      , olderThan: this.olderThan
      , runAt: this.runAt
    })

  return utils.maybeCall(fn, utils.req(req))
}

ScheduledDelete.prototype.delete = function (fn) {
  var db = this.database

  if ( ! this.id) {
    return utils.maybeCall(fn, function (fn) {
      fn(new Error('No id set'))
    })
  }

  var req = request
    .del(utils.url(db.connection, 'db/' + db.name + '/scheduled_deletes/' + this.id))
    .set('Accept', 'application/json')
    .query(utils.qs(db.connection))

  return utils.maybeCall(fn, utils.req(req))
}

ScheduledDelete.all = function (db, fn) {
  var req = request
    .get(utils.url(db.connection, 'db/' + db.name + '/scheduled_deletes'))
    .set('Accept', 'application/json')
    .query(utils.qs(db.connection))

  return utils.maybeCall(fn, function (fn) {
    return utils.req(req)(function (err, deletes) {
      if (err) {
        fn(err)
        return
      }

      fn(null, deletes.map(function (scheduledDelete) {
        return new ScheduledDelete(scheduledDelete)
      }))
    })
  })
}
