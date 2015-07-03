var sink = require('sink-transform');
var shasum = require('shasum');

module.exports = function (b) {
    b.pipeline.get('sort').push(tr());
    b.on('reset', function () {
        b.pipeline.get('sort').push(tr());
    });
};

module.exports.hashify = tr;

function tr() {
    return sink.obj(function (rows, done) {
        var stream = this;
        var hashes = {};
        rows.forEach(function (row) {
            var index = row.index;
            if (index && row.source) {
                row.index = shasum(row.source).slice(0, 7);
                hashes[index] = row.index;
            }
        });
        rows.forEach(function (row) {
            if (row.dedupe) {
                row.dedupeIndex = hashes[row.dedupeIndex] || row.dedupeIndex;
            }
            if (row.indexDeps) {
                for (var k in row.indexDeps) {
                    if (row.indexDeps.hasOwnProperty(k)) {
                        row.indexDeps[k] = hashes[row.indexDeps[k]] || row.indexDeps[k];
                    }
                }
            }
            stream.push(row);
        });
        done();
    });
}
