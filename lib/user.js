var request = require('superagent')
var utils = require('./utils')

module.exports = User

function User (name, password, database) {
  this.name = name
  this.password = password
  this.database = database
  this.isAdmin = false
}

User.prototype.save = function (fn) {
  var db = this.database

  var req = request
    .post(utils.url(db.connection, 'db/' + db.name + '/users'))
    .query(utils.qs(db.connection))
    .send(this.toJSON())

  return utils.maybeCall(fn, utils.req(req))
}

User.prototype.setPassword = function (password, fn) {
  var db = this.database
  this.password = password

  var req = request
    .post(utils.url(db.connection, 'db/' + db.name + '/users/' + this.name))
    .query(utils.qs(db.connection))
    .send({ password: password })

  return utils.maybeCall(fn, utils.req(req))
}

User.prototype.destroy = function (fn) {
  var db = this.database

  var req = request
    .del(utils.url(db.connection, 'db/' + db.name + '/users/' + this.name))
    .query(utils.qs(db.connection))

  return utils.maybeCall(fn, utils.req(req))
}

User.prototype.promote = function (fn) {
  return edit(this, true, fn)
}

User.prototype.demote = function (fn) {
  return edit(this, false, fn)
}

User.prototype.toJSON = function () {
  return {
    name: this.name
    , password: this.password
  }
}

/**************************** HELPER FUNCTIONS ********************************/

function edit (self, isAdmin, fn) {
  var db = self.database
  self.isAdmin = isAdmin

  var req = request
    .post(utils.url(db.connection, 'db/' + db.name + '/users/' + self.name))
    .query(utils.qs(db.connection))
    .send({ admin: !!isAdmin })

  return utils.maybeCall(fn, utils.req(req))
}
