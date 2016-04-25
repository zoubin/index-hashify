var hashify = require('..').hashify
var test = require('tap').test
var shasum = require('shasum')

test('hashify', function(t) {
  t.plan(1)

  var hash = hashify()
  var rows = []
  hash.on('data', function (row) {
    rows.push(row)
  })
  hash.on('end', function () {
    t.same(rows, [
      {
        id: '/main.js',
        index: index('ONE', '/main.js'),
        indexDeps: { './foo': index('TWO', '/foo.js') },
        source: 'ONE',
      },
      {
        id: '/foo.js',
        index: index('TWO', '/foo.js'),
        indexDeps: { './bar': index('THREE', '/bar.js') },
        source: 'TWO',
      },
      {
        id: '/bar.js',
        index: index('THREE', '/bar.js'),
        indexDeps: {},
        source: 'THREE',
      },
    ])
  })

  hash.write({
    id: '/main.js',
    index: 3,
    indexDeps: { './foo': 2 },
    source: 'ONE',
  })
  hash.write({
    id: '/foo.js',
    index: 2,
    indexDeps: { './bar': 1 },
    source: 'TWO',
  })
  hash.write({
    id: '/bar.js',
    index: 1,
    indexDeps: {},
    source: 'THREE',
  })
  hash.end()
})

function index(s, id) {
  return shasum(id + s).slice(0, 7)
}
