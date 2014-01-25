var ClusterAdmin = require('./cluster_admin')
var Database = require('./database')
var utils = require('./utils')

module.exports = Connection

function Connection (host, port) {
  if ( ! (this instanceof Connection)) {
    return new Connection(host, port)
  }

  this.host = host || 'localhost'
  this.port = port || 8086
  this.auth()
}

Connection.prototype.auth = function (name, password) {
  if (typeof name === 'object' && name.name && name.password) {
    this.name = name.name
    this.password = name.password
  } else {
    this.name = name || 'root'
    this.password = password || 'root'
  }
  return this
}

/**
 * Cluster admins
 */

Connection.prototype.clusterAdmin = function (name, password) {
  return new ClusterAdmin(name, password, this)
}

/**
 * Databases
 */

Connection.prototype.database = function (name) {
  return new Database(name, this)
}

Connection.prototype.databases = function (fn) {
  return Database.all(this, fn)
}
