var request = require('superagent')
var utils = require('./utils')

module.exports = ClusterAdmin

function ClusterAdmin (name, password, connection) {
  this.name = name
  this.password = password
  this.connection = connection
}

ClusterAdmin.prototype.save = function (fn) {
  var req = request
    .post(utils.url(this.connection, 'cluster_admins'))
    .query(utils.qs(this.connection))
    .send(this.toJSON())

  return utils.maybeCall(fn, utils.req(req))
}

ClusterAdmin.prototype.setPassword = function (password, fn) {
  this.password = password

  var req = request
    .post(utils.url(this.connection, 'cluster_admins/' + this.name))
    .query(utils.qs(this.connection))
    .send({ password: password })

  return utils.maybeCall(fn, utils.req(req))
}

ClusterAdmin.prototype.destroy = function (fn) {
  var req = request
    .del(utils.url(this.connection, 'cluster_admins/' + this.name))
    .query(utils.qs(this.connection))

  return utils.maybeCall(fn, utils.req(req))
}

ClusterAdmin.prototype.toJSON = function () {
  return {
    name: this.name
    , password: this.password
  }
}
