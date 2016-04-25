var reduce = require('reduce-js')
var path = require('path')
var del = require('del')

var build = path.join(__dirname, 'build')

del(build).then(function () {
  var basedir = path.join(__dirname, 'src')
  var b = reduce.create({
    basedir: basedir,
  })
  b.plugin('index-hashify')

  reduce.src('src/**/index.js', { cwd: __dirname })
    .pipe(reduce.watch(b, {
      groups: '*/**/index.js',
      common: 'common.js',
    }))
    .on('bundle', function (bundleStream) {
      bundleStream
        .pipe(reduce.dest(build))
        .on('data', function (file) {
          console.log('bundle:', file.relative)
        })
        .on('end', function () {
          console.log('--------------')
        })
    })
})


