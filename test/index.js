var hashify = require('..').hashify;
var test = require('tap').test;
var sink = require('sink-transform');
var shasum = require('shasum');

test('hashify', function(t) {
    t.plan(1);

    var hash = hashify();
    hash.pipe(sink.obj(function (rows, done) {
        t.same(rows, [
            {
                "id": "/main.js",
                "index": index("ONE"),
                "indexDeps": { "./foo": index("TWO") },
                "source": "ONE",
            },
            {
                "id": "/foo.js",
                "index": index("TWO"),
                "indexDeps": { "./bar": index("THREE") },
                "source": "TWO",
            },
            {
                "id": "/bar.js",
                "index": index("THREE"),
                "indexDeps": {},
                "source": "THREE",
            }
        ]);
        done();
    }));

    hash.write({
        id: '/main.js',
        index: 3,
        indexDeps: { './foo': 2 },
        source: 'ONE',
    });
    hash.write({
        id: '/foo.js',
        index: 2,
        indexDeps: { './bar': 1 },
        source: 'TWO',
    });
    hash.write({
        id: '/bar.js',
        index: 1,
        indexDeps: {},
        source: 'THREE',
    });
    hash.end();
})

function index(s) {
    return shasum(s).slice(0, 7);
}
