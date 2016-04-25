var shasum = require('shasum')
var path = require('path')
var Transform = require('stream').Transform

module.exports = function (b) {
  var basedir = b._options.basedir || process.cwd()
  b.on('reset', reset)
  reset()

  function reset() {
    b.pipeline.get('sort').push(hashify({ stringify: stringify }))
  }

  function stringify(row) {
    var prefix = row.id
    if (path.isAbsolute(prefix)) {
      prefix = path.relative(basedir, prefix)
    }
    return prefix + row.source
  }
}

module.exports.hashify = hashify

function hashify(opts) {
  opts = opts || {}
  var stringify = opts.stringify || function (row) {
    return row.id + row.source
  }
  var stream = Transform({ objectMode: true })
  var rows = []
  stream._transform = function (row, enc, next) {
    rows.push(row)
    next()
  }
  stream._flush = function (next) {
    var old2new = {}
    rows.forEach(function (row) {
      var index = row.index
      if (index && row.source) {
        row.index = shasum(stringify(row)).slice(0, 7)
        old2new[index] = row.index
      }
    })
    rows.forEach(function (row) {
      if (row.dedupe) {
        row.dedupeIndex = old2new[row.dedupeIndex] || row.dedupeIndex
      }
      if (row.indexDeps) {
        for (var k in row.indexDeps) {
          if (row.indexDeps.hasOwnProperty(k)) {
            row.indexDeps[k] = old2new[row.indexDeps[k]] || row.indexDeps[k]
          }
        }
      }
      stream.push(row)
    })
    next()
  }
  return stream
}

