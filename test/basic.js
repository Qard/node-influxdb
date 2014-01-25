var influxdb = require('..')

describe('connection', function () {
  var connection

  it('should create connection', function () {
    connection = new influxdb('127.0.0.1', 8086)
  })

  it('should set auth credentials', function () {
    connection.auth('testing', 'testing')
    connection.should.have.property('name', 'testing')
    connection.should.have.property('password', 'testing')

    // Restore after
    connection.auth('root', 'root')
  })

  it('should get a list of databases', function (done) {
    connection.databases(done)
  })
})

describe('cluster admins', function () {
  var connection
  var clusterAdmin

  before(function () {
    connection = new influxdb('127.0.0.1', 8086)
  })

  it('should initialize clusterAdmin', function () {
    clusterAdmin = connection.clusterAdmin('testing', 'testing')
    clusterAdmin.should.have.property('name', 'testing')
    clusterAdmin.should.have.property('password', 'testing')
  })

  it('should serialize to json', function () {
    var json = JSON.stringify(clusterAdmin)
    json.should.eql('{"name":"testing","password":"testing"}')
  })

  it('should save clusterAdmin', function (done) {
    clusterAdmin.save(done)
  })

  it('should change clusterAdmin password', function () {
    clusterAdmin.setPassword('test123')
    clusterAdmin.should.have.property('password', 'test123')
  })

  it('should save clusterAdmin password', function (done) {
    clusterAdmin.setPassword('test123', done)
  })

  it('should destroy clusterAdmin', function (done) {
    clusterAdmin.destroy(done)
  })
})

describe('database', function () {
  var connection
  var database

  before(function () {
    connection = new influxdb('127.0.0.1', 8086)
  })

  it('should initialize the database model', function () {
    database = connection.database('testing')
    database.should.have.property('name', 'testing')
  })

  it('should save the database', function (done) {
    database.save(done)
  })

  it('should drop the database', function (done) {
    database.drop(done)
  })
})

describe('database users', function () {
  var connection
  var database
  var user

  before(function (done) {
    connection = new influxdb('127.0.0.1', 8086)
    database = connection.database('testing')
    database.save(done)
  })

  after(function (done) {
    database.drop(done)
  })

  it('should initialize the user model', function  () {
    user = database.user('testing', 'testing')
    user.should.have.property('name', 'testing')
    user.should.have.property('password', 'testing')
  })

  it('should change server auth credentials', function  () {
    connection.auth(user)
    connection.should.have.property('name', 'testing')
    connection.should.have.property('password', 'testing')
    connection.auth({
      name: 'root'
      , password: 'root'
    })
  })

  it('should serialize to json', function () {
    var json = JSON.stringify(user)
    json.should.eql('{"name":"testing","password":"testing"}')
  })

  it('should save the user', function (done) {
    user.save(done)
  })

  it('should change user password', function () {
    user.setPassword('test123')
    user.should.have.property('password', 'test123')
  })

  it('should save user password', function (done) {
    user.setPassword('test123', done)
  })

  it('should promote the user', function (done) {
    user.promote(done)
  })

  it('should demote the user', function (done) {
    user.demote(done)
  })

  it('should destroy the user', function (done) {
    user.destroy(done)
  })
})

describe('series', function () {
  var connection
  var database
  var series
  var user

  before(function (done) {
    connection = new influxdb('127.0.0.1', 8086)
    database = connection.database('testing')
    database.save(done)
  })

  before(function (done) {
    user = database.user('testing', 'testing')
    user.save(done)
  })

  before(function (done) {
    user.promote(done)
  })

  before(function () {
    connection.auth(user)
  })

  after(function (done) {
    connection.auth({
      name: 'root'
      , password: 'root'
    })
    user.destroy(done)
  })

  after(function (done) {
    database.drop(done)
  })

  it('should initialize the series model', function () {
    series = database.series('testing')
  })

  it('should write a single point to the series', function (done) {
    series.insert({
      columns: ['a', 'b', 'c'],
      points: [
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2']
      ]
    }, done)
  })

  it('should write multiple points to the series', function (done) {
    series.insert([{
      columns: ['a', 'b', 'c'],
      points: [
        ['a1', 'b1', 'c1'],
        ['a2', 'b2', 'c2']
      ]
    }, {
      columns: ['a', 'b', 'c'],
      points: [
        ['a3', 'b3', 'c3'],
        ['a4', 'b4', 'c4']
      ]
    }], done)
  })

  it('should query for points', function (done) {
    database.query('select * from testing;', function (err, res) {
      var columns = ['time', 'sequence_number', 'a', 'b', 'c']
      res.should.have.lengthOf(1)
      res[0].should.have.property('name', 'testing')
      res[0].should.have.property('columns', columns)
      res[0].should.have.property('points')
      res[0].points.should.have.lengthOf(6)
      done(err)
    })
  })

  it('should destroy series', function (done) {
    series.destroy(done)
  })
})
