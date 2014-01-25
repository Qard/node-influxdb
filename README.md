# InfluxDB
[![Build Status](https://travis-ci.org/Qard/node-influxdb.png)](https://travis-ci.org/Qard/node-influxdb)

Fully-functional node driver for [InfluxDB](http://influxdb.com).

## Install

    npm install influxdb

## Usage

    var conn = influxdb('127.0.0.1', 8086)
    var db = conn.database('foo')
    db.save(function () {
      var bar = db.series('bar')

      bar.insert({
        columns: ['a', 'b'],
        points: [
          ['a1', 'b1'],
          ['a2', 'b2']
        ]
      })

      db.query('select * from bar;', done)
    })

You can create regular and cluster admin users easily.

    var clusterAdmin = conn.clusterAdmin('foo', 'bar')
    clusterAdmin.save(done)

    var user = db.user('foo', 'bar')
    user.save(done)

## API Reference

### Connection(host, port)
Specify the location of the server to connect to.

#### connection.auth(name, password)
Specify the user credentials to use for all requests made within the connection.

#### connection.clusterAdmin(name, password)
Factory method for `ClusterAdmin`.

#### connection.database(name)
Factory method for `Database`.

#### connection.databases([callback])
Get a list of all databases. Defers to `Database.all`.

### ClusterAdmin(name, password, server)
Create a local representation of a cluster admin. You will need to save it before using it.

#### clusterAdmin.save([callback])
Save the cluster admin to the database.

#### clusterAdmin.setPassword(password, [callback])
Update the password for the cluster admin.

#### clusterAdmin.destroy([callback])
Deletes the cluster admin from the database.

#### clusterAdmin.toJSON()
Returns a JSON representation of the cluster admin containing the name and password.

### Database(name, server)
Create a local representation of a database. You will need to save it before using it.

#### database.save([callback])
Create the database on the server.

#### database.drop([callback])
Delete the database from the server.

#### database.all([callback])
Get a list of all databases.

#### database.series(name)
Factory method for `Series`.

#### database.user(name, password)
Factory method for `User`.

#### database.insert(point(s), [callback])
Insert a point, or list of points, to their respective series' within the database.

#### database.query(query, [callback])
Query for data in the database.

### User(name, password, database)
Create a local representation of a user. You will need to save it before using it.

#### user.save([callback])
Save the user to the database.

#### user.setPassword(password, [callback])
Update the password for the user.

#### user.promote([callback])
Promotes the user to admin status.

#### user.demote([callback])
Demotes the user from admin status.

#### user.destroy([callback])
Deletes the user from the database.

#### user.toJSON()
Returns a JSON representation of the user containing the name and password.

### Series(name, database)
Create a local representation of a series. Unlike the other data models, series are create automatically when a point is inserted into it.

#### series.insert(point(s), [callback])
Insert a point, or list of points, to the database. All points will have the correct series name injected.

#### series.destroy([callback])
Delete all points in the series from the database.

---

### Copyright (c) 2011 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
